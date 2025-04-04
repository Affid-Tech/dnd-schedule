function formatToIsoString(datetime) {
  const date = new Date(datetime);
  return date.toISOString().replace(/[-:]/g, '').slice(0, 13); // YYYYMMDDTHH
}

function createTimeLink(game) {
  const iso = formatToIsoString(game.date);
  const title = encodeURIComponent("D&D - " + game.title);
  return `https://www.timeanddate.com/worldclock/fixedtime.html?msg=${title}&iso=${iso}&p1=534&ah=5`;
}

fetch('data/games.json')
  .then(response => response.json())
  .then(games => {
    const container = document.getElementById('games-container');

    games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';

      const timeLink = createTimeLink(game);
      const localTime = new Date(game.date).toLocaleString();
      const spotsLeft = game.maxPlayers - game.currentPlayers;

      card.innerHTML = `
        <div class="game-title">${game.title}</div>
        <div class="game-date mb-2">
          🗓 <a href="${timeLink}" target="_blank">${localTime}</a>
        </div>
        <div class="mb-1">🧙 DM: ${game.dm}</div>
        <div class="mb-1">🧑‍🤝‍🧑 Players: ${game.currentPlayers} joined</div>
        <div class="mb-1">📏 Min/Max Players: ${game.minPlayers}–${game.maxPlayers}</div>
        <div class="mb-1">📣 Spots Left: ${spotsLeft > 0 ? spotsLeft : 'Full'}</div>
        <p>${game.description}</p>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Failed to load games:", error);
    document.getElementById('games-container').innerHTML = `
      <div class="alert alert-danger">⚠️ Failed to load upcoming games. Please try again later.</div>
    `;
  });
