const scriptURL = "https://script.google.com/macros/s/AKfycbxKWQT4VJbxvmNETNVTGeSnE5uT9jgfsan8kkutK3qHDlQSFGcAQrCqHbyLPckVeMenAA/exec";

document.getElementById("bracket-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then((res) => res.text())
    .then((text) => {
      document.getElementById("results").innerHTML = `<p>${text}</p>`;
    })
    .catch((err) => {
      document.getElementById("results").innerHTML = `<p style="color:red;">${err}</p>`;
    });
});

// Auto-fill logic for Rounds 2, 3, and Final

const updateRounds = () => {
  const setSpan = (id, value) => {
    const el = document.getElementById(id);
    el.textContent = value || "";
    el.classList.toggle("filled", !!value);
  };

  const r1 = {
    A1vsWC1: document.querySelector('input[name="A1vsWC1"]:checked')?.value,
    A2vsA3: document.querySelector('input[name="A2vsA3"]:checked')?.value,
    M1vsWC2: document.querySelector('input[name="M1vsWC2"]:checked')?.value,
    M2vsM3: document.querySelector('input[name="M2vsM3"]:checked')?.value
  };

  const semi1 = r1.A1vsWC1 && r1.A2vsA3 ? r1.A1vsWC1 + " vs " + r1.A2vsA3 : "";
  const semi2 = r1.M1vsWC2 && r1.M2vsM3 ? r1.M1vsWC2 + " vs " + r1.M2vsM3 : "";

  document.getElementById("EastSemi1").textContent = semi1;
  document.getElementById("EastSemi2").textContent = semi2;

  const eastFinal = (r1.A1vsWC1 && r1.A2vsA3 && r1.M1vsWC2 && r1.M2vsM3) ? "Winner of Semi1 vs Winner of Semi2" : "";
  document.getElementById("EastFinal").textContent = eastFinal;

  const cupFinal = eastFinal ? "East Champion vs West Champion" : "";
  document.getElementById("CupFinal").textContent = cupFinal;
};

document.querySelectorAll("input[type='radio']").forEach(el => {
  el.addEventListener("change", updateRounds);
});

  const r1 = {
    A1vsWC1: document.querySelector('input[name="A1vsWC1"]:checked')?.value,
    A2vsA3: document.querySelector('input[name="A2vsA3"]:checked')?.value,
    M1vsWC2: document.querySelector('input[name="M1vsWC2"]:checked')?.value,
    M2vsM3: document.querySelector('input[name="M2vsM3"]:checked')?.value,
    C1vsWC2: document.querySelector('input[name="C1vsWC2"]:checked')?.value,
    C2vsC3: document.querySelector('input[name="C2vsC3"]:checked')?.value,
    P1vsWC1: document.querySelector('input[name="P1vsWC1"]:checked')?.value,
    P2vsP3: document.querySelector('input[name="P2vsP3"]:checked')?.value
  };

  setSpan("EastSemi1", r1.A1vsWC1 && r1.A2vsA3 ? r1.A1vsWC1 + " vs " + r1.A2vsA3 : "");
  setSpan("EastSemi2", r1.M1vsWC2 && r1.M2vsM3 ? r1.M1vsWC2 + " vs " + r1.M2vsM3 : "");
  setSpan("WestSemi1", r1.C1vsWC2 && r1.C2vsC3 ? r1.C1vsWC2 + " vs " + r1.C2vsC3 : "");
  setSpan("WestSemi2", r1.P1vsWC1 && r1.P2vsP3 ? r1.P1vsWC1 + " vs " + r1.P2vsP3 : "");

  const eastFinal = (r1.A1vsWC1 && r1.A2vsA3 && r1.M1vsWC2 && r1.M2vsM3) ? "Winner of East Semis" : "";
  const westFinal = (r1.C1vsWC2 && r1.C2vsC3 && r1.P1vsWC1 && r1.P2vsP3) ? "Winner of West Semis" : "";

  setSpan("EastFinal", eastFinal);
  setSpan("WestFinal", westFinal);
  setSpan("CupFinal", eastFinal && westFinal ? "East Champ vs West Champ" : "");
