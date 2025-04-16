
const scriptURL = "https://script.google.com/macros/s/AKfycbzGf6dB4koCYpYCQirVUmWpflHT8TYAW2CWh0ykKFmi/dev";
const form = document.getElementById("bracket-form");
const round1 = document.getElementById("round1");
const dynamic = document.getElementById("dynamic-rounds");

const matchups = {
  A1vsWC1: ["Maple Leafs", "Senators"],
  A2vsA3: ["Lightning", "Panthers"],
  M1vsWC2: ["Capitals", "Canadiens"],
  M2vsM3: ["Hurricanes", "Devils"],
  C1vsWC2: ["Jets", "Blues"],
  C2vsC3: ["Stars", "Avalanche"],
  P1vsWC1: ["Golden Knights", "Wild"],
  P2vsP3: ["Kings", "Oilers"]
};

const normalize = name => name.toLowerCase().replace(/ /g, "_");

function makeLogoLabel(name, team) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "radio";
  input.name = name;
  input.value = team;
  input.required = true;
  const img = document.createElement("img");
  img.src = "assets/logos/" + normalize(team) + ".png";
  img.className = "logo";
  label.appendChild(input);
  label.appendChild(img);
  label.appendChild(document.createTextNode(team));
  return label;
}

function createMatchup(name, t1, t2) {
  if (!t1 || !t2) return;
  const div = document.createElement("div");
  div.className = "dynamic-matchup";
  const title = document.createElement("label");
  title.innerHTML = `<strong>${name}:</strong>`;
  div.appendChild(title);
  div.appendChild(makeLogoLabel(name, t1));
  div.appendChild(makeLogoLabel(name, t2));
  dynamic.appendChild(div);
}

function buildRound1() {
  for (const key in matchups) {
    const [t1, t2] = matchups[key];
    const div = document.createElement("div");
    div.className = "matchup";
    const title = document.createElement("label");
    title.innerHTML = `<strong>${key}:</strong>`;
    div.appendChild(title);
    div.appendChild(makeLogoLabel(key, t1));
    div.appendChild(makeLogoLabel(key, t2));
    const games = document.createElement("input");
    games.type = "number";
    games.name = "GAMES_" + key;
    games.min = 4;
    games.max = 7;
    games.required = true;
    div.appendChild(games);
    round1.appendChild(div);
  }
}

function updateBracket() {
  dynamic.innerHTML = "";
  const picks = {};
  document.querySelectorAll("input[type=radio]:checked").forEach(r => picks[r.name] = r.value);

  createMatchup("EastSemi1", picks.A1vsWC1, picks.A2vsA3);
  createMatchup("EastSemi2", picks.M1vsWC2, picks.M2vsM3);
  createMatchup("WestSemi1", picks.C1vsWC2, picks.C2vsC3);
  createMatchup("WestSemi2", picks.P1vsWC1, picks.P2vsP3);
  createMatchup("EastFinal", picks.EastSemi1, picks.EastSemi2);
  createMatchup("WestFinal", picks.WestSemi1, picks.WestSemi2);
  createMatchup("StanleyCupWinner", picks.EastFinal, picks.WestFinal);
}

form.addEventListener("change", updateBracket);
form.addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {};
  new FormData(form).forEach((value, key) => data[key] = value);
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.text()).then(msg => {
    document.getElementById("results").innerHTML = msg;
  });
});

buildRound1();
