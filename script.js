document.getElementById("enquiryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    service: service.value,
    message: message.value
  };

  const res = await fetch("/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  document.getElementById("response").innerText = result.message;
});
