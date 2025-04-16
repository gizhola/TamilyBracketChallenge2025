const scriptURL = "https://script.google.com/macros/s/AKfycbzGf6dB4koCYpYCQirVUmWpflHT8TYAW2CWh0ykKFmi/dev";
const form = document.getElementById("bracket-form");
const section = document.getElementById("dynamic-rounds");

form.addEventListener("change", updateBracket);
form.addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {};
  new FormData(form).forEach((value, key) => data[key] = value);
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.text())
  .then(msg => document.getElementById("results").innerHTML = msg)
  .catch(err => document.getElementById("results").innerHTML = "Error: " + err);
});

function createMatchup(name, team1, team2) {
  if (!team1 || !team2) return null;
  const div = document.createElement("div");
  div.className = "dynamic-matchup";

  const normalize = str => str.toLowerCase().replace(/ /g, "_");

  const legend = document.createElement("strong");
  legend.textContent = name;
  div.appendChild(legend);

  [team1, team2].forEach(team => {
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
    div.appendChild(label);
  });

  return div;
}

function updateBracket() {
  const picks = {};
  document.querySelectorAll("input[type='radio']:checked").forEach(input => {
    picks[input.name] = input.value;
  });

  section.innerHTML = "";

  const r2 = createMatchup("EastSemi1", picks.A1vsWC1, picks.A2vsA3);
  if (r2) section.appendChild(r2);

  const eastFinal = createMatchup("EastFinal", picks.EastSemi1, "Lightning");
  if (picks.EastSemi1 && picks.EastSemi2) {
    const r3 = createMatchup("EastFinal", picks.EastSemi1, picks.EastSemi2);
    if (r3) section.appendChild(r3);
  }

  if (picks.EastFinal && picks.WestFinal) {
    const final = createMatchup("StanleyCupWinner", picks.EastFinal, picks.WestFinal);
    if (final) section.appendChild(final);
  }
}
