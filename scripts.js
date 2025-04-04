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
    const upcomingContainer = document.getElementById('upcoming-games-container');
    const pastContainer = document.getElementById('past-games-container');
    const toggle = document.getElementById('togglePastGames');
    const pastSection = document.getElementById('past-games-section');

    const now = new Date();

    const upcomingGames = games
      .filter(game => new Date(game.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const pastGames = games
      .filter(game => new Date(game.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    function renderGameCard(game, container) {
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
        <div class="mb-1">🧙 Ведущий: ${game.dm}</div>
        <div class="mb-1">📏 Кол-во игроков: ${game.minPlayers}–${game.maxPlayers}</div>
        <div class="mb-1">📣 Осталось мест: ${spotsLeft > 0 ? spotsLeft : 'Нет (игра полная)'}</div>
        <div class="mb-1">💰 Взнос: ${game.price}</div>
        <p>${game.description}</p>
      `;

      container.appendChild(card);
    }

    upcomingGames.forEach(game => renderGameCard(game, upcomingContainer));
    pastGames.forEach(game => renderGameCard(game, pastContainer));

    toggle.addEventListener('change', () => {
      pastSection.style.display = toggle.checked ? 'block' : 'none';
    });

  })
  .catch(error => {
    console.error("Не удалось загрузить игры:", error);
    document.getElementById('upcoming-games-container').innerHTML = `
      <div class="alert alert-danger">⚠️ Не удалось загрузить игры. Попробуйте позже.</div>
    `;
  });
