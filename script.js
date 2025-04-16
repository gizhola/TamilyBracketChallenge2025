const scriptURL = "https://script.google.com/macros/s/AKfycbxKWQT4VJbxvmNETNVTGeSnE5uT9jgfsan8kkutK3qHDlQSFGcAQrCqHbyLPckVeMenAA/exec";
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
    <fieldset class="dynamic-matchup">
      <legend>${name}</legend>
      <label><input type="radio" name="${name}" value="${team1}" required /> ${team1}</label>
      <label><input type="radio" name="${name}" value="${team2}" required /> ${team2}</label>
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
    matchup("EastSemi1", picks.A1vsWC1, picks.A2vsA3),
    matchup("EastSemi2", picks.M1vsWC2, picks.M2vsM3),
    matchup("WestSemi1", picks.C1vsWC2, picks.C2vsC3),
    matchup("WestSemi2", picks.P1vsWC1, picks.P2vsP3)
  ];
  container.innerHTML += r2matchups.join("");

  if (picks.EastSemi1 && picks.EastSemi2) {
    container.innerHTML += matchup("EastFinal", picks.EastSemi1, picks.EastSemi2);
  }
  if (picks.WestSemi1 && picks.WestSemi2) {
    container.innerHTML += matchup("WestFinal", picks.WestSemi1, picks.WestSemi2);
  }
  if (picks.EastFinal && picks.WestFinal) {
    container.innerHTML += matchup("StanleyCupWinner", picks.EastFinal, picks.WestFinal);
  }

  section.replaceChildren(...container.children);
}
