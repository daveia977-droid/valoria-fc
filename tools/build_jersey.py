"""Original VFC V1 garment geometry. Run with Blender 4.3+ --background --python.

No purchased mesh, model service or image generation. The existing reference atlas
is projected onto the front; the approved back is plain burgundy. The construction
is an editable visual prototype, not a manufacturing pattern or cloth simulation.
"""
import math
from pathlib import Path
import bpy
import bmesh
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public/models/domicile-v1.glb'
SOURCE = ROOT / 'artifacts/maillots-3d/domicile-v1.blend'
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)


def linear(value):
    return value / 12.92 if value < .04045 else ((value + .055) / 1.055) ** 2.4


def material(name, rgb, roughness=.8, metallic=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    node = mat.node_tree.nodes.get('Principled BSDF')
    node.inputs['Base Color'].default_value = (*[linear(c / 255) for c in rgb], 1)
    node.inputs['Roughness'].default_value = roughness
    node.inputs['Metallic'].default_value = metallic
    mat.diffuse_color = (*[linear(c / 255) for c in rgb], 1)
    return mat


red = material('Bordeaux uni — dos validé', (122, 6, 16))
gold = material('Finitions or — tissu', (230, 190, 116), .55, .18)
cream = material('Col crème doré', (237, 207, 150), .65)
inside = material('Intérieur bordeaux', (70, 4, 12))
front = material('Face — visuel VFC existant', (255, 255, 255), .9)
nodes = front.node_tree.nodes
links = front.node_tree.links
image = bpy.data.images.load(str(ROOT / 'artifacts/maillots-3d/v1-reference-texture.jpg'))
image.pack()
texture = nodes.new('ShaderNodeTexImage')
texture.image = image
texture.interpolation = 'Linear'
texture.extension = 'EXTEND'
links.new(texture.outputs['Color'], nodes.get('Principled BSDF').inputs['Base Color'])


def uv_for(point):
    x, _, z = point
    return ((266 + x * (444 / 1.3)) / 1832, 1 - (700 - z * (570 / 1.6)) / 859)


def mesh_object(name, verts, faces, indices, materials, thickness=.004):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces); mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    for mat in materials: obj.data.materials.append(mat)
    uv = mesh.uv_layers.new(name='Reference projection')
    for face, mat_index in zip(mesh.polygons, indices):
        face.material_index = mat_index
        face.use_smooth = True
        for loop_index in face.loop_indices:
            uv.data[loop_index].uv = uv_for(verts[mesh.loops[loop_index].vertex_index])
    bm = bmesh.new(); bm.from_mesh(mesh)
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=.00001)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh); bm.free()
    if thickness:
        solid = obj.modifiers.new('Épaisseur du tissu et rebords ouverts', 'SOLIDIFY')
        solid.thickness = thickness; solid.offset = 0
    return obj


# Two curved panels, joined at the sides and shoulders; neckline and hem remain open.
nx, nz = 48, 56
neck_radius = .43 * 10 / 24
verts, faces, indices = [], [], []
for back in [False, True]:
    for row in range(nz + 1):
        v = row / nz
        width = .375 - .025 * math.sin(v * math.pi) + .055 * v ** 3
        depth = .082 + .048 * math.sin(v * math.pi)
        for col in range(nx + 1):
            t = col / nx * 2 - 1; x = t * width
            if abs(x) <= neck_radius:
                top = (1.535 if back else 1.405) + (.045 if back else .175) * (abs(x) / neck_radius) ** 2
            else: top = 1.58 - .15 * ((abs(x) - neck_radius) / (.43 - neck_radius))
            z = .015 + v * (top - .015)
            edge = max(0, 1 - t * t) ** .45
            fold = .005 * math.sin(t * 19 + v * 5) * (abs(t) ** 2) * math.sin(v * math.pi) * edge
            # Match the neckline to the collar's ellipse instead of leaving a
            # rectangular slot behind the collar at oblique viewing angles.
            if abs(x) <= neck_radius:
                top_depth = (.083 if back else .087) * math.sqrt(max(0, 1 - (x / neck_radius) ** 2))
            else:
                top_depth = depth * edge * min(1, max(0, (abs(x) - neck_radius) / .08)) ** .5
            blend = max(0, (v - .87) / .13) ** 2
            y = ((1 - blend) * depth * edge + blend * top_depth + fold) * (1 if back else -1)
            z += .004 * math.sin(t * 14 + v * 6) * math.sin(v * math.pi) * abs(t) ** 2
            verts.append((x, y, z))
panel = (nx + 1) * (nz + 1)
for back in [False, True]:
    offset = panel if back else 0
    for row in range(nz):
        for col in range(nx):
            a = offset + row * (nx + 1) + col
            faces.append((a, a + nx + 1, a + nx + 2, a + 1) if back else (a, a + 1, a + nx + 2, a + nx + 1))
            indices.append(1 if back else 0)
for col in range(nx):
    x = verts[nz * (nx + 1) + col][0]
    if abs(x) >= neck_radius - .00001:
        a = nz * (nx + 1) + col
        faces.append((a, a + 1, a + 1 + panel, a + panel)); indices.append(1)
body = mesh_object('Corps creux — face et dos', verts, faces, indices, [front, red])

# Short volumetric sleeves, with actual cuff geometry around the whole opening.
for side in [-1, 1]:
    for cuff in [False, True]:
        verts, faces, indices = [], [], []
        segments, rings = 48, (5 if cuff else 22)
        for row in range(rings + 1):
            t = (.93 + .07 * row / rings) if cuff else (.0 + .93 * row / rings)
            # The proximal ring sits inside the torso, avoiding exposed tube
            # openings and detached shoulders when the garment is turned.
            cx = side * (.29 + .28 * t); cz = 1.38 - .44 * t
            ry = .06 + .09 * math.sin(t * math.pi / 2) - .043 * t
            rv = .135 + .025 * math.sin(t * math.pi) - .022 * t
            for col in range(segments):
                a = col / segments * math.tau
                wave = .002 * math.sin(5 * a + t * 8) * math.sin(t * math.pi)
                x = cx + side * (.87 * rv * math.cos(a))
                y = ry * math.sin(a)
                z = cz + .495 * rv * math.cos(a) + wave
                verts.append((x, y, z))
        for row in range(rings):
            for col in range(segments):
                nxt = (col + 1) % segments
                faces.append((row * segments + col, row * segments + nxt, (row + 1) * segments + nxt, (row + 1) * segments + col))
                midpoint = verts[row * segments + col][1]
                indices.append(0 if cuff or midpoint < 0 else 1)
        mesh_object(('Bord doré' if cuff else 'Manche') + (' gauche' if side < 0 else ' droite'), verts, faces, indices, [gold] if cuff else [front, red])

# Standing collar following the front/back neckline, with a shallow front V notch.
verts, faces, indices = [], [], []
n, rows = 80, 5
for row in range(rows + 1):
    v = row / rows
    for col in range(n):
        a = col / n * math.tau
        x = neck_radius * math.cos(a)
        front_half = math.sin(a) < 0
        base = 1.58 - (.175 if front_half else .045) * math.sin(a) ** 2
        y = (.087 if front_half else .083) * math.sin(a)
        notch = .022 * max(0, -math.sin(a)) ** 14
        z = base + v * (.043 - notch)
        verts.append((x * (1 + .025 * v), y * (1 + .02 * v), z))
for row in range(rows):
    for col in range(n):
        nxt = (col + 1) % n
        faces.append((row * n + col, row * n + nxt, (row + 1) * n + nxt, (row + 1) * n + col))
        indices.append(1 if row in [0, rows - 1] else 0)
mesh_object('Col crème et or — volume', verts, faces, indices, [cream, gold], .006)

for obj in list(bpy.context.scene.objects):
    obj['VFC_provenance'] = 'Géométrie originale locale ; texture de face issue du visuel fourni ; dos uni autorisé.'

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
SOURCE.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE))
bpy.ops.export_scene.gltf(filepath=str(OUTPUT), export_format='GLB', export_apply=True, export_image_format='JPEG', export_jpeg_quality=90, export_texcoords=True, export_normals=True, export_materials='EXPORT')
print('VFC_MODEL_READY', OUTPUT, OUTPUT.stat().st_size)
