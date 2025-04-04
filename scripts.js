function formatToIsoString(datetime) {
  const date = new Date(datetime);
  return date.toISOString().replace(/[-:]/g, '').slice(0, 13); // YYYYMMDDTHH
}

function createTimeLink(game) {
  const iso = formatToIsoString(game.date);
  const title = encodeURIComponent("D&D - " + game.title);
  return `https://www.timeanddate.com/worldclock/fixedtime.html?msg=${title}&iso=${iso}&p1=534&ah=5`;
}

function convertUTCToLocalString(utcDateStr) {
  const utcDate = new Date(utcDateStr);
  return utcDate.toLocaleString();
}

function renderGames(games, showPast = false) {
  const container = document.getElementById('games-container');
  container.innerHTML = '';

  const now = new Date();
  const filtered = games
    .filter(game => showPast || new Date(game.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  filtered.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.opacity = 0;
    card.style.transition = 'opacity 0.6s ease';

    const timeLink = createTimeLink(game);
    const localTime = convertUTCToLocalString(game.date);
    const spotsLeft = game.maxPlayers - game.currentPlayers;

    card.innerHTML = `
      <div class="game-title">${game.title}</div>
      <div class="game-date mb-2">
        🗓 <a href="${timeLink}" target="_blank">${localTime}</a>
      </div>
      <div class="mb-1">🧙 Мастер: ${game.dm}</div>
      <div class="mb-1">📏 Кол-во игроков: ${game.minPlayers}–${game.maxPlayers}</div>
      <div class="mb-1">📣 Свободных мест: ${spotsLeft > 0 ? spotsLeft : 'Нет'}</div>
      <div class="mb-1">💰 Стоимость: ${game.price}</div>
      <p>${game.description}</p>
    `;

    container.appendChild(card);
    requestAnimationFrame(() => {
      card.style.opacity = 1;
    });
  });
}

let allGames = [];

fetch('data/games.json')
  .then(response => response.json())
  .then(games => {
    allGames = games;
    renderGames(allGames);
  })
  .catch(error => {
    console.error("Не удалось загрузить список игр:", error);
    document.getElementById('games-container').innerHTML = `
      <div class="alert alert-danger">⚠️ Не удалось загрузить список игр. Попробуйте позже.</div>
    `;
  });

window.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('show-past');
  if (checkbox) {
    checkbox.addEventListener('change', () => {
      renderGames(allGames, checkbox.checked);
    });
  }
});
