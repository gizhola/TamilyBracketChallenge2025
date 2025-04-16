const scriptURL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL";
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
  return `
    <div class="dynamic-matchup">
      <strong>${name}:</strong><br>
      <label><input type="radio" name="${name}" value="${team1}" required /> ${team1}</label>
      <label><input type="radio" name="${name}" value="${team2}" required /> ${team2}</label>
    </div>`;
}

function updateBracket() {
  const picks = {};
  document.querySelectorAll("input[type='radio']:checked").forEach(input => {
    picks[input.name] = input.value;
  });

  section.innerHTML = "";

  const eastSemi1 = matchup("EastSemi1", picks.A1vsWC1, picks.A2vsA3);
  const eastSemi2 = matchup("EastSemi2", picks.M1vsWC2, picks.M2vsM3);
  const westSemi1 = matchup("WestSemi1", picks.C1vsWC2, picks.C2vsC3);
  const westSemi2 = matchup("WestSemi2", picks.P1vsWC1, picks.P2vsP3);

  section.innerHTML += eastSemi1 + eastSemi2 + westSemi1 + westSemi2;

  if (picks.EastSemi1 && picks.EastSemi2)
    section.innerHTML += matchup("EastFinal", picks.EastSemi1, picks.EastSemi2);
  if (picks.WestSemi1 && picks.WestSemi2)
    section.innerHTML += matchup("WestFinal", picks.WestSemi1, picks.WestSemi2);

  if (picks.EastFinal && picks.WestFinal)
    section.innerHTML += matchup("StanleyCupWinner", picks.EastFinal, picks.WestFinal);
}
