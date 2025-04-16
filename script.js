const scriptURL = "https://script.google.com/macros/s/AKfycbxKWQT4VJbxvmNETNVTGeSnE5uT9jgfsan8kkutK3qHDlQSFGcAQrCqHbyLPckVeMenAA/exec";

document.getElementById('bracket-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.text())
    .then(text => {
      document.getElementById('results').innerHTML = "<p>" + text + "</p>";
    })
    .catch(err => {
      document.getElementById('results').innerHTML = "<p style='color:red;'>" + err + "</p>";
    });
});
