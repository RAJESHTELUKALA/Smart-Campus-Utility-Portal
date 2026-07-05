document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("scup_user"));
  if (!user) return;

  // Autofill details
  document.getElementById("rollno").value = user.id;
});

document.getElementById("maintenanceForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("scup_user"));
  const ticketId = "MC-" + Math.floor(100 + Math.random() * 900); // Generate 3 digit ID

  const complaint = {
    id: ticketId,
    rollno: user.id,
    location: document.getElementById("location").value.trim(),
    issueType: document.getElementById("issueType").value,
    description: document.getElementById("description").value.trim(),
    status: "Pending"
  };

  let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  complaints.push(complaint);
  localStorage.setItem("complaints", JSON.stringify(complaints));

  // Trigger Bootstrap Success Modal
  const successModalMsg = document.getElementById("successModalMsg");
  successModalMsg.textContent = `Your ticket "${ticketId}" has been successfully logged. You can track its status in the requests portal.`;
  
  const myModal = new bootstrap.Modal(document.getElementById("successModal"));
  myModal.show();

  this.reset();

  // Re-autofill
  document.getElementById("rollno").value = user.id;
});
