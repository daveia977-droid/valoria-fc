"""Local geometry study, pending the downloadable rear reference.

Reuses the existing packed Blender model and front texture without overwriting
them. Changes garment volume, vertex folds, material roughness and a procedural
fabric normal map. Back graphics are deliberately not invented. This is not the
completed reference-matched V1 prototype and is not installed in the website.

Run: blender --background --threads 4 --python-exit-code 1 --python tools/build_v1_cloth_prototype.py
"""
from pathlib import Path
import json
import math
import struct
import bpy
import bmesh
import numpy as np
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts/prototype-v1"
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT / "design/maillots/domicile-v1.blend"))


def bell(value, centre, radius):
    return math.exp(-((value - centre) / radius) ** 2)


def ridge(x, centre, width):
    # A rounded ridge with the adjacent valleys a fabric fold actually needs.
    d = (x - centre) / width
    return (1 - 2 * d * d) * math.exp(-d * d)


def torso_point(point):
    x, y, z = point
    side = 1 if y >= 0 else -1
    width = .375 - .025 * math.sin(min(1, z / 1.5) * math.pi) + .055 * (z / 1.6) ** 3
    edge = max(0, 1 - (x / max(.35, width)) ** 2) ** .65
    collar_blend = min(1, max(0, (z - 1.28) / .26))
    scale = 1.43 - .18 * collar_blend
    # Centre-back stays quiet; drape gathers beside the waist and underarms.
    long_folds = (
        .014 * ridge(x, -.22 + .08 * (z - .45), .046) * bell(z, .52, .45)
        + .012 * ridge(x, .20 - .055 * math.sin(z * 3), .044) * bell(z, .49, .43)
        + .007 * ridge(x, -.055 + .03 * math.sin(z * 5), .065) * bell(z, .27, .24)
    )
    underarm = .010 * ridge(z, .99 + abs(x) * .43, .035) * bell(abs(x), .24, .14)
    underarm += .006 * ridge(z, .89 + abs(x) * .42, .040) * bell(abs(x), .27, .13)
    hem = .005 * math.sin(x * 38 + .6) * bell(z, .07, .09)
    # Front graphics/UVs are untouched; only the supporting surface is sculpted.
    diagonal_drape = .018 * ridge(z, .40 + .50 * x, .047) * bell(x, -.14, .22)
    folds = (long_folds + underarm + hem) * edge * (.65 if side < 0 else 1.8)
    if side > 0:
        folds += diagonal_drape * edge
    y = y * scale + side * folds
    z += .006 * math.sin(x * 15 + .4) * math.exp(-max(0, z) / .10)
    x *= 1 - .018 * bell(z, .65, .34)
    return Vector((x, y, z))


meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
for obj in meshes:
    grain_uv = obj.data.uv_layers.new(name="Fabric weave")
    # Save grain coordinates before deformation so it follows the fabric.
    for loop in obj.data.loops:
        p = obj.data.vertices[loop.vertex_index].co
        grain_uv.data[loop.index].uv = ((p.x / .9 + .5) * 8, p.z / 1.6 * 8)
    for vertex in obj.data.vertices:
        p = vertex.co.copy()
        if obj.name.startswith("Corps"):
            vertex.co = torso_point(p)
        elif obj.name.startswith(("Manche", "Bord")):
            t = min(1, max(0, (1.38 - p.z) / .44))
            angle = math.atan2(p.y / .12, (abs(p.x) - (.29 + .28 * t)) / .13)
            fold = .004 * math.sin(t * 18 + angle * 2) * math.sin(math.pi * t)
            p.y = p.y * 1.25 + math.sin(angle) * fold
            p.z += math.cos(angle) * fold * .45
            vertex.co = p
        elif obj.name.startswith("Col"):
            p.y *= 1.25
            vertex.co = p
    obj.data.update()
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(obj.data)
    bm.free()
    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj["VFC_prototype_status"] = "Volume et plis seulement ; motif de dos en attente de référence exploitable."

# A small, seamless, original normal texture. No image-generation API or bought asset.
resolution = 256
v, u = np.mgrid[0:resolution, 0:resolution] / resolution
wave_u = 2 * math.pi * 16 * u
wave_v = 2 * math.pi * 16 * v
height = np.sin(wave_u) ** 2 * (.65 + .25 * np.cos(wave_v))
height += np.sin(wave_v) ** 2 * (.65 - .25 * np.cos(wave_u))
dx = (np.roll(height, -1, axis=1) - np.roll(height, 1, axis=1)) * .5
dy = (np.roll(height, -1, axis=0) - np.roll(height, 1, axis=0)) * .5
normal = np.stack((-dx, -dy, np.ones_like(dx)), axis=-1)
normal /= np.linalg.norm(normal, axis=-1)[..., None]
rgba = np.concatenate((normal * .5 + .5, np.ones((*height.shape, 1))), axis=-1).astype(np.float32)
grain = bpy.data.images.new("VFC procedural knit normal", width=resolution, height=resolution)
grain.colorspace_settings.name = "Non-Color"
grain.pixels.foreach_set(rgba.ravel())
grain.filepath_raw = str(OUT / "grain-textile-normal.png")
grain.file_format = "PNG"
grain.save()
grain.pack()

for material in bpy.data.materials:
    if not material.use_nodes:
        continue
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    if not bsdf:
        continue
    if material.name.startswith("Bordeaux uni"):
        material.name = "DOS EN ATTENTE DU PNG — matériau de diagnostic"
    # Gold remains gold fabric; avoid turning the cuff into polished metal.
    bsdf.inputs["Roughness"].default_value = .87
    bsdf.inputs["Metallic"].default_value = .025 if material.name.startswith(("Finitions", "Col")) else 0
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    uv = nodes.new("ShaderNodeUVMap")
    uv.uv_map = "Fabric weave"
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = grain
    tex.extension = "REPEAT"
    bump = nodes.new("ShaderNodeNormalMap")
    bump.inputs["Strength"].default_value = .18
    bump.uv_map = "Fabric weave"
    links.new(uv.outputs["UV"], tex.inputs["Vector"])
    links.new(tex.outputs["Color"], bump.inputs["Color"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

bpy.context.scene["VFC_reference_status"] = "Front packed texture reused exactly. New rear PNG not accessible; rear markings not applied. Same physical shoulder confirmed by user."
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "domicile-v1-volume-et-plis.blend"))
bpy.ops.export_scene.gltf(
    filepath=str(OUT / "domicile-v1-volume-et-plis.glb"),
    export_format="GLB", export_apply=True, export_image_format="AUTO",
    export_texcoords=True, export_normals=True, export_materials="EXPORT",
)


def read_glb(path):
    data = path.read_bytes()
    json_length = struct.unpack_from("<I", data, 12)[0]
    document = json.loads(data[20:20 + json_length])
    bin_start = 20 + json_length + 8
    return document, data[bin_start:]


def front_image(document):
    mat = next(m for m in document["materials"] if m["name"].startswith("Face"))
    texture = document["textures"][mat["pbrMetallicRoughness"]["baseColorTexture"]["index"]]
    return document["images"][texture["source"]]


# Embed the exact approved GLB front JPEG bytes, avoiding a fresh JPEG encoding.
original, original_bin = read_glb(ROOT / "public/models/domicile-v1.glb")
original_image = front_image(original)
original_view = original["bufferViews"][original_image["bufferView"]]
front_bytes = original_bin[original_view.get("byteOffset", 0):original_view.get("byteOffset", 0) + original_view["byteLength"]]
target = OUT / "domicile-v1-volume-et-plis.glb"
document, binary = read_glb(target)
target_image = front_image(document)
replacement_index = target_image["bufferView"]
packed = bytearray()
for index, view in enumerate(document["bufferViews"]):
    chunk = front_bytes if index == replacement_index else binary[view.get("byteOffset", 0):view.get("byteOffset", 0) + view["byteLength"]]
    packed.extend(b"\0" * ((-len(packed)) % 4))
    view["byteOffset"] = len(packed)
    view["byteLength"] = len(chunk)
    packed.extend(chunk)
document["buffers"][0]["byteLength"] = len(packed)
target_image["mimeType"] = original_image["mimeType"]
encoded_json = json.dumps(document, separators=(",", ":"), ensure_ascii=False).encode()
encoded_json += b" " * ((-len(encoded_json)) % 4)
packed.extend(b"\0" * ((-len(packed)) % 4))
target.write_bytes(
    struct.pack("<4sII", b"glTF", 2, 28 + len(encoded_json) + len(packed))
    + struct.pack("<I4s", len(encoded_json), b"JSON") + encoded_json
    + struct.pack("<I4s", len(packed), b"BIN\0") + packed
)
report = {
    "status": "Geometry study only. Rear design blocked pending the original PNG.",
    "rear_orientation_decision": "Same physical shoulder as front, confirmed by user; not yet applied without PNG.",
    "source": "design/maillots/domicile-v1.blend",
    "glb_bytes": (OUT / "domicile-v1-volume-et-plis.glb").stat().st_size,
    "base_meshes": len(meshes),
    "base_vertices": sum(len(o.data.vertices) for o in meshes),
    "cloth_simulation": False,
    "folds": "Actual vertex displacement, not a flat image or a normal-map-only fold effect.",
    "front_texture_changed": False,
    "front_texture_bytes_preserved": True,
    "rear_reference_applied": False,
}
(OUT / "construction-volume.json").write_text(json.dumps(report, indent=2))
print("VFC_GEOMETRY_STUDY", json.dumps(report))
