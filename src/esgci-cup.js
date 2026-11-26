// ESGCI CUP — scénarios internes à VALORIA FC, jamais un calendrier de l'école.
const teams = Object.freeze([
  { id: 'valoria', name: 'VALORIA FC', short: 'VALORIA', initials: 'V', css: 'valoria' },
  { id: 'esgci', name: 'ESGCI United', short: 'ESGCI United', initials: 'EU', css: 'esgci' },
  { id: 'rivage', name: 'Rivage FC', short: 'Rivage FC', initials: 'RF', css: 'rivage' },
  { id: 'cite', name: 'Cité Sport FC', short: 'Cité Sport', initials: 'CS', css: 'cite' },
  { id: 'nova', name: 'Nova FC', short: 'Nova FC', initials: 'N', css: 'nova' },
  { id: 'horizon', name: 'Horizon SC', short: 'Horizon SC', initials: 'H', css: 'horizon' }
]);

// Games keep their home/away orientation and use [home, away] scores.
const rounds = [
  { day: '2026-09-12T16:00:00+02:00', games: [
    ['valoria','horizon',3,0], ['esgci','nova',2,1], ['rivage','cite',1,0]
  ]},
  { day: '2026-09-26T16:00:00+02:00', games: [
    ['valoria','nova',2,0], ['horizon','cite',0,2], ['esgci','rivage',1,1]
  ]},
  { day: '2026-10-17T16:00:00+02:00', games: [
    ['valoria','cite',2,1], ['nova','rivage',0,2], ['horizon','esgci',0,3]
  ]},
  { day: '2026-11-07T16:00:00+01:00', games: [
    ['valoria','rivage',2,0], ['cite','esgci',0,1], ['nova','horizon',2,2]
  ]},
  { day: '2026-11-21T16:00:00+01:00', games: [
    ['valoria','esgci',1,2], ['rivage','horizon',2,1], ['cite','nova',1,1]
  ]},
  { day: '2026-11-28T16:00:00+01:00', games: [
    ['horizon','valoria',null,null], ['nova','esgci',null,null], ['cite','rivage',null,null]
  ]},
  { day: '2026-12-12T16:00:00+01:00', games: [
    ['nova','valoria',null,null], ['cite','horizon',null,null], ['rivage','esgci',null,null]
  ]},
  { day: '2026-12-19T16:00:00+01:00', games: [
    ['cite','valoria',null,null], ['rivage','nova',null,null], ['esgci','horizon',null,null]
  ]},
  { day: '2027-01-09T16:00:00+01:00', games: [
    ['rivage','valoria',null,null], ['esgci','cite',null,null], ['horizon','nova',null,null]
  ]},
  { day: '2027-01-16T16:00:00+01:00', games: [
    ['esgci','valoria',null,null], ['horizon','rivage',null,null], ['nova','cite',null,null]
  ]}
];
const frDate = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/Paris' });
const frTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
const teamById = id => teams.find(team => team.id === id);
const badge = (id, extra = '') => id === 'valoria'
  ? '<img class="cup-team-crest ' + extra + '" src="/assets/crest.webp" alt="" width="42" height="52" loading="lazy">'
  : '<span class="cup-team-crest cup-badge-' + id + ' ' + extra + '" aria-hidden="true">' + teamById(id).initials + '</span>';

function leagueStandings() {
  const stats = new Map(teams.map(t => [t.id,{ ...t, played:0, win:0, draw:0, lost:0, gf:0, ga:0, pts:0 }]));
  for (const round of rounds) {
    for (const [home,away,h,a] of round.games) {
      if (h === null || a === null) continue;
      const first = stats.get(home), second = stats.get(away);
      first.played++; second.played++;
      first.gf += h; first.ga += a; second.gf += a; second.ga += h;
      if (h === a) { first.draw++; second.draw++; first.pts++; second.pts++; }
      else if (h > a) { first.win++; second.lost++; first.pts += 3; }
      else { second.win++; first.lost++; second.pts += 3; }
    }
  }
  return [...stats.values()].sort((a,b)=>b.pts-a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf || a.name.localeCompare(b.name,'fr'));
}

function resultsRow(game, roundNumber) {
  const [home, away, homeScore, awayScore] = game;
  return '<li class="cup-result"><span class="cup-result-round">J' + roundNumber + '</span>' +
  '<span class="cup-result-home">' + teamById(home).name + '</span>' +
  '<strong>' + (homeScore === null ? '— : —' : homeScore + ' : ' + awayScore) + '</strong>' +
  '<span class="cup-result-away">' + teamById(away).name + '</span></li>';
}

export function initEsgciCup() {
  const holder = document.querySelector('#esgci-cup');
  if (!holder) return;
  const tbody = holder.querySelector('#cup-table-body');
  const rank = leagueStandings();
  tbody.innerHTML = rank.map((t, i) => {
    const diff = t.gf - t.ga;
    const diffText = diff > 0 ? '+' + diff : String(diff);
    return '<tr' + (t.id === 'valoria' ? ' class="cup-us"' : '') + '>' +
      '<td class="cup-rank">' + (i + 1) + '</td>' +
      '<th scope="row"><span class="cup-team-cell">' + badge(t.id) + '<span>' + t.name + '</span></span></th>' +
      '<td>' + t.played + '</td><td class="cup-detail-col">' + t.win + '</td><td class="cup-detail-col">' + t.draw + '</td><td class="cup-detail-col">' + t.lost + '</td>' +
      '<td>' + diffText + '</td><td class="cup-points">' + t.pts + '</td></tr>';
  }).join('');

  const completed = rounds.filter(round => round.games.every(game => game[2] !== null && game[3] !== null)).length;
  holder.querySelector('#cup-standing-round').textContent = 'Après ' + completed + (completed === 1 ? ' journée' : ' journées');
  holder.querySelector('.cup-table').setAttribute('aria-label', 'Classement de l’ESGCI CUP après ' + completed + ' journées');
  const nextIndex = rounds.findIndex(round => round.games.some(game => game.slice(0,2).includes('valoria') && game[2] === null));
  const next = rounds[nextIndex];
  if (next) {
    const match = next.games.find(game => game.slice(0,2).includes('valoria'));
    const opponent = teamById(match[0] === 'valoria' ? match[1] : match[0]);
    const overdue = Date.now() >= new Date(next.day).getTime();
    holder.querySelector('.esgci-match-label').textContent = (overdue ? 'Résultat à venir' : 'Prochaine journée') + ' · J' + String(nextIndex + 1).padStart(2, '0');
    holder.querySelector('#cup-next-date').textContent = frDate.format(new Date(next.day));
    holder.querySelector('#cup-next-time').textContent = frTime.format(new Date(next.day));
    holder.querySelector('#cup-next-opponent').textContent = opponent.name;
    const mark = holder.querySelector('#cup-next-badge');
    mark.className = 'cup-team-crest cup-badge-' + opponent.css;
    mark.textContent = opponent.initials;
    holder.querySelector('.esgci-next-note').textContent = overdue ? 'Résultat en attente de publication.' : (match[0] === 'valoria' ? 'À domicile' : 'À l’extérieur') + ' · Phase ' + (nextIndex < 5 ? 'aller' : 'retour') + '.';
  } else {
    holder.querySelector('.esgci-match-label').textContent = 'Championnat terminé';
    holder.querySelector('.esgci-versus').hidden = true;
    holder.querySelector('.esgci-next-date').hidden = true;
    holder.querySelector('.esgci-next-note').textContent = 'Retrouvez le classement final et tous les résultats.';
  }
  holder.querySelector('#cup-fixtures').innerHTML = rounds.map((round,index) => 
    '<section class="cup-fixture-round"><h4>Journée ' + (index+1) + ' <span>' + frDate.format(new Date(round.day)) + '</span></h4>' +
    '<ul>' + round.games.map(game => resultsRow(game,index+1)).join('') + '</ul></section>'
  ).join('');
  const preview = holder.querySelector('#cup-recent-results');
  preview.innerHTML = rounds.map((round,index) => ({ number: index + 1, game: round.games.find(g => g.slice(0,2).includes('valoria')) }))
    .filter(({ game }) => game && game[2] !== null && game[3] !== null).slice(-3).reverse().map(({ number, game }) =>
      '<li><span>J' + number + '</span><span>' + teamById(game[0]).short + ' <strong>' + game[2] + ' : ' + game[3] + '</strong> ' + teamById(game[1]).short + '</span></li>'
    ).join('');
}
