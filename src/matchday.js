import { uiIcon } from './ui-icons.js';

const games = [
  { id: 'j1', date: '2026-09-09T21:00:00+02:00', rival: 'Bayern Munich', sigle: 'FCB', mark: 'bayern', atHome: true, score: [2, 0] },
  { id: 'j2', date: '2026-10-13T21:00:00+02:00', rival: 'Juventus', sigle: 'JUV', mark: 'juventus', atHome: false, score: [1, 2] },
  { id: 'j3', date: '2026-10-21T21:00:00+02:00', rival: 'Paris Saint-Germain', sigle: 'PAR', mark: 'paris', atHome: true, score: [0, 0] },
  { id: 'j4', date: '2026-11-04T21:00:00+01:00', rival: 'Atlético Madrid', sigle: 'ATM', mark: 'atletico', atHome: false, score: [3, 1] },
  { id: 'j5', date: '2026-11-25T21:00:00+01:00', rival: 'FC Barcelone', sigle: 'BAR', mark: 'barca', atHome: true, score: null },
  { id: 'j6', date: '2026-12-09T21:00:00+01:00', rival: 'Chelsea FC', sigle: 'CHE', mark: 'chelsea', atHome: false, score: null },
  { id: 'j7', date: '2027-01-20T21:00:00+01:00', rival: 'Liverpool FC', sigle: 'LIV', mark: 'liverpool', atHome: true, score: null },
  { id: 'j8', date: '2027-01-27T21:00:00+01:00', rival: 'Inter Milan', sigle: 'INT', mark: 'inter', atHome: false, score: null }
];

const rates = { A: 110, B: 70, C: 35 };
const dateFormat = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const dateCompact = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: 'short' });
const dateTime = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });
const price = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const ongoing = game => !game.score && Date.now() < new Date(game.date).getTime();
const resultLabel = game => !game.score ? (ongoing(game) ? 'À VENIR' : 'PASSÉ') : game.score[0] > game.score[1] ? 'VICTOIRE' : game.score[0] < game.score[1] ? 'DÉFAITE' : 'MATCH NUL';
const resultClass = game => !game.score ? (ongoing(game) ? 'result-upcoming' : 'result-past') : game.score[0] > game.score[1] ? 'result-win' : game.score[0] < game.score[1] ? 'result-loss' : 'result-draw';
const statusText = game => game.score ? 'TERMINÉ' : ongoing(game) ? 'À VENIR' : 'PASSÉ';
const scoreText = game => game.score ? game.score[0] + ' — ' + game.score[1] : dateTime.format(new Date(game.date));
const scoreboardText = game => game.score && !game.atHome ? game.score[1] + ' — ' + game.score[0] : scoreText(game);
const shortDate = game => dateCompact.format(new Date(game.date)).replace('.', '').toUpperCase();
const opponentBadge = (game, featured = false) => '<img class="opponent-crest' + (featured ? ' featured-opponent-crest' : '') + '" src="/assets/opponents/' + game.mark + '.svg" alt="" width="128" height="128" loading="lazy" decoding="async">';

function fixtureCard(game, index, featuredId) {
  const recent = resultLabel(game);
  const result = resultClass(game);
  const home = '<span class="fixture-team"><img class="fixture-own-crest" src="/assets/crest.webp" alt="" width="52" height="65" loading="lazy"><span>VALORIA</span></span>';
  const away = '<span class="fixture-team">' + opponentBadge(game) + '<span>' + game.rival + '</span></span>';
  return '<li class="fixture-slide"><button type="button" class="fixture-card ' + result +
    (game.id === featuredId ? ' is-next' : '') +
    '" data-fixture="' + game.id + '" aria-label="Journée ' + (index + 1) + ' : ' + (game.atHome ? 'VALORIA FC contre ' + game.rival : game.rival + ' contre VALORIA FC') + ', ' + recent + ', ' + scoreboardText(game) + '">' +
    '<span class="fixture-top"><span>JOURNÉE ' + String(index + 1).padStart(2, '0') + '</span><span class="fixture-status">' + statusText(game) + '</span></span>' +
    '<span class="fixture-date">' + shortDate(game) + '</span>' +
    '<span class="fixture-clubs">' + (game.atHome ? home : away) +
    '<strong class="fixture-score">' + scoreboardText(game) + '</strong>' +
    (game.atHome ? away : home) + '</span>' +
    '<span class="fixture-result-label">' + (game.score ? 'VALORIA : ' + recent : game.atHome ? 'À DOMICILE' : 'À L’EXTÉRIEUR') + '</span>' +
    '<span class="fixture-bottom">' + (game.score ? 'Voir le résultat' : ongoing(game) ? 'Voir le match et les billets' : 'Voir le match') + uiIcon('arrow-up-right') + '</span></button></li>';
}

export function initMatchday() {
  const list = document.querySelector('#fixture-list');
  const nextGame = games.find(ongoing);
  const focusGame = nextGame || games[games.length - 1];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  list.innerHTML = games.map((game, index) => fixtureCard(game, index, nextGame && nextGame.id)).join('');
  const featureButton = document.querySelector('#featured-open');
  document.querySelector('#featured-opponent').textContent = focusGame.rival.toUpperCase();
  document.querySelector('#featured-date').textContent = dateFormat.format(new Date(focusGame.date));
  document.querySelector('#featured-time').textContent = dateTime.format(new Date(focusGame.date));
  document.querySelector('#featured-round').textContent = 'PHASE DE LIGUE · JOURNÉE ' + (games.indexOf(focusGame) + 1);
  const featureMark = document.querySelector('#featured-crest');
  featureMark.src = '/assets/opponents/' + focusGame.mark + '.svg';
  featureMark.alt = 'Emblème stylisé non officiel pour ' + focusGame.rival;
  featureMark.className = 'opponent-crest featured-opponent-crest';
  document.querySelector('#featured-venue').textContent = (focusGame.atHome ? 'À DOMICILE' : 'À L’EXTÉRIEUR') + ' · HEURE DE PARIS';
  featureButton.innerHTML = (nextGame ? 'Découvrir la rencontre et les billets' : 'Voir la dernière rencontre') + ' ' + uiIcon('arrow-up-right');

  const countdown = document.querySelector('#match-countdown');
  function clock() {
    if (!nextGame) { countdown.textContent = 'SAISON 2026 / 2027'; return; }
    const seconds = Math.max(0, Math.floor((new Date(nextGame.date).getTime() - Date.now()) / 1000));
    if (seconds <= 0) { countdown.textContent = 'RENCONTRE EN COURS'; return; }
    const d = Math.floor(seconds / 86400);
    const h = Math.floor(seconds % 86400 / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = seconds % 60;
    countdown.textContent = [d, h, m, s].map((x, i) => i ? String(x).padStart(2, '0') : String(x)).join(' : ');
  }
  clock();
  const timer = window.setInterval(clock, 1000);
  window.addEventListener('pagehide', () => window.clearInterval(timer), { once: true });

  for (const [id, direction] of [['fixture-previous', -1], ['fixture-next', 1]]) {
    document.getElementById(id).addEventListener('click', () => {
      list.scrollBy({ left: direction * Math.max(275, list.clientWidth * .72), behavior: reduced.matches ? 'instant' : 'smooth' });
    });
  }
  const dialog = document.querySelector('#match-dialog');
  const form = document.querySelector('#ticket-form');
  const confirmation = document.querySelector('#ticket-confirmation');
  const purchase = document.querySelector('#ticket-purchase');
  const qty = document.querySelector('#ticket-quantity');
  const tribune = document.querySelector('#ticket-tribune');
  let selected = null;
  let trigger = null;

  function updateTicket() {
    if (!selected) return;
    const n = Math.max(1, Math.min(4, Number(qty.value) || 1));
    document.querySelector('#ticket-choice').textContent = 'TRIBUNE ' + tribune.value + ' · ' + n + (n === 1 ? ' PLACE' : ' PLACES');
    document.querySelector('#ticket-price').textContent = price(rates[tribune.value] * n);
    document.querySelector('#ticket-total-label').textContent = price(rates[tribune.value] * n);
    document.querySelector('#ticket-match').textContent = 'VALORIA FC / ' + selected.rival;
    document.querySelector('#ticket-date').textContent = shortDate(selected) + ' · ' + dateTime.format(new Date(selected.date));
  }

  function showGame(game, opener) {
    selected = game;
    trigger = opener;
    document.querySelector('#dialog-opponent').textContent = game.rival;
    const opponentCrest = document.querySelector('#dialog-opponent-crest');
    opponentCrest.src = '/assets/opponents/' + game.mark + '.svg';
    opponentCrest.alt = '';
    document.querySelector('.match-dialog-badges').classList.toggle('is-away', !game.atHome);
    document.querySelector('#dialog-matchday').textContent = 'JOURNÉE ' + (games.indexOf(game) + 1) + ' · PHASE DE LIGUE';
    document.querySelector('#dialog-date').textContent = dateFormat.format(new Date(game.date)) + ' · ' + dateTime.format(new Date(game.date)) + ' (Paris)';
    document.querySelector('#ticket-location').textContent = game.atHome ? 'VALORIA FC reçoit · Match à domicile' : 'VALORIA FC se déplace · Match à l’extérieur';
    document.querySelector('#dialog-result').textContent = game.score ? (game.atHome ? 'VALORIA FC  ' + scoreText(game) + '  ' + game.rival : game.rival + '  ' + scoreboardText(game) + '  VALORIA FC') : '';
    document.querySelector('#dialog-result').hidden = !game.score;
    form.reset();
    purchase.hidden = !ongoing(game);
    confirmation.hidden = true;
    document.querySelector('#dialog-past').hidden = ongoing(game);
    updateTicket();
    dialog.showModal();
  }

  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-fixture]');
    if (button) showGame(games.find(game => game.id === button.dataset.fixture), button);
  });
  featureButton.addEventListener('click', () => showGame(focusGame, featureButton));
  form.addEventListener('input', updateTicket);
  form.addEventListener('change', updateTicket);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!selected || !ongoing(selected)) return;
    updateTicket();
    purchase.hidden = true;
    confirmation.hidden = false;
    document.querySelector('#ticket-confirmation-title').focus();
  });
  document.querySelector('#ticket-ok').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    selected = null;
    trigger?.focus({ preventScroll: true });
    trigger = null;
  });

  const initial = list.querySelector('.is-next');
  if (initial) list.scrollLeft = Math.max(0, initial.offsetLeft - list.offsetLeft - 20);
}
