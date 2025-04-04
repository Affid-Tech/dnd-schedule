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

fetch('data/games.json')
  .then(response => response.json())
  .then(games => {
    const container = document.getElementById('games-container');

    games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';

      const timeLink = createTimeLink(game);
      const localTime = convertUTCToLocalString(game.date);
      const spotsLeft = game.maxPlayers - game.currentPlayers;

      card.innerHTML = `
        <div class="game-title">${game.title}</div>
        <div class="game-date mb-2">
          🗓 <a href="${timeLink}" target="_blank">${localTime}</a>
        </div>
        <div class="mb-1">🧙 Мастер: ${game.dm}</div>
        <div class="mb-1">📏 Кол-во Игроков: ${game.minPlayers}–${game.maxPlayers}</div>
        <div class="mb-1">📣 ${spotsLeft > 0 ? 'Осталось мест: ' + spotsLeft : 'Команда собрана'}</div>
        <p>${game.description}</p>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Failed to load games:", error);
    document.getElementById('games-container').innerHTML = `
      <div class="alert alert-danger">⚠️ Не получилось загрузить расписание. Попробуйте позже.</div>
    `;
  });
