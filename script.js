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

function matchup(name, team1, team2) {
  if (!team1 || !team2) return "";
  const normalize = str => str.toLowerCase().replace(/ /g, "_");
  return `
    <fieldset class="dynamic-matchup">
      <legend>${name}</legend>
      <label><input type="radio" name="${name}" value="${team1}" required />
        <img src="assets/logos/${normalize(team1)}.png" class="logo" /> ${team1}</label>
      <label><input type="radio" name="${name}" value="${team2}" required />
        <img src="assets/logos/${normalize(team2)}.png" class="logo" /> ${team2}</label>
    </fieldset>`;
}

function updateBracket() {
  const picks = {};
  document.querySelectorAll("input[type='radio']:checked").forEach(input => {
    picks[input.name] = input.value;
  });

  const container = document.createElement("div");
  container.innerHTML = "";

  const r2matchups = [
    matchup("EastSemi1", picks.A1vsWC1, picks.A2vsA3)
  ];
  container.innerHTML += r2matchups.join("");

  if (picks.EastSemi1 && picks.EastSemi2)
    container.innerHTML += matchup("EastFinal", picks.EastSemi1, picks.EastSemi2);
  if (picks.WestSemi1 && picks.WestSemi2)
    container.innerHTML += matchup("WestFinal", picks.WestSemi1, picks.WestSemi2);

  if (picks.EastFinal && picks.WestFinal)
    container.innerHTML += matchup("StanleyCupWinner", picks.EastFinal, picks.WestFinal);

  section.replaceChildren(...container.children);
}
