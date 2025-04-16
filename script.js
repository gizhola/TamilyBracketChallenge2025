
const scriptURL = "https://script.google.com/macros/s/AKfycbzGf6dB4koCYpYCQirVUmWpflHT8TYAW2CWh0ykKFmi/dev";
const round1 = document.getElementById("round1");
const laterRounds = document.getElementById("rounds-2-4");
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

const normalize = str => str.toLowerCase().replace(/ /g, "_");

function createLogoLabel(name, team) {
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

function createRound1() {
  for (const [key, [t1, t2]] of Object.entries(matchups)) {
    const div = document.createElement("div");
    div.className = "matchup";
    div.innerHTML = `<label><strong>${key}:</strong></label>`;
    div.appendChild(createLogoLabel(key, t1));
    div.appendChild(createLogoLabel(key, t2));
    const gamesInput = document.createElement("input");
    gamesInput.type = "number";
    gamesInput.name = "GAMES_" + key;
    gamesInput.min = 4;
    gamesInput.max = 7;
    gamesInput.required = true;
    div.appendChild(gamesInput);
    round1.appendChild(div);
  }
}

function createMatchup(name, t1, t2) {
  if (!t1 || !t2) return null;
  const div = document.createElement("div");
  div.className = "dynamic-matchup";
  div.innerHTML = `<label><strong>${name}:</strong></label>`;
  div.appendChild(createLogoLabel(name, t1));
  div.appendChild(createLogoLabel(name, t2));
  return div;
}

function updateBracket() {
  const picks = {};
  document.querySelectorAll("input[type='radio']:checked").forEach(i => picks[i.name] = i.value);
  laterRounds.innerHTML = "";

  const es1 = createMatchup("EastSemi1", picks.A1vsWC1, picks.A2vsA3);
  const es2 = createMatchup("EastSemi2", picks.M1vsWC2, picks.M2vsM3);
  const ws1 = createMatchup("WestSemi1", picks.C1vsWC2, picks.C2vsC3);
  const ws2 = createMatchup("WestSemi2", picks.P1vsWC1, picks.P2vsP3);
  [es1, es2, ws1, ws2].forEach(m => m && laterRounds.appendChild(m));

  const ef = createMatchup("EastFinal", picks.EastSemi1, picks.EastSemi2);
  const wf = createMatchup("WestFinal", picks.WestSemi1, picks.WestSemi2);
  [ef, wf].forEach(m => m && laterRounds.appendChild(m));

  const scf = createMatchup("StanleyCupWinner", picks.EastFinal, picks.WestFinal);
  if (scf) laterRounds.appendChild(scf);
}

document.getElementById("bracket-form").addEventListener("change", updateBracket);
document.getElementById("bracket-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {};
  new FormData(this).forEach((value, key) => data[key] = value);
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.text()).then(msg => {
    document.getElementById("results").innerHTML = msg;
  });
});

createRound1();
