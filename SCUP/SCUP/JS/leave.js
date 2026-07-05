document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("scup_user"));
  if (!user) return;

  // Autofill details
  document.getElementById("rollno").value = user.id;
  document.getElementById("department").value = user.department;

  // Set min dates to today
  const today = new Date().toISOString().split("T")[0];
  const fromInput = document.getElementById("fromDate");
  const toInput = document.getElementById("toDate");

  fromInput.min = today;
  toInput.min = today;

  fromInput.addEventListener("change", () => {
    toInput.min = fromInput.value;
    calculateDuration();
  });

  toInput.addEventListener("change", () => {
    calculateDuration();
  });
});

function calculateDuration() {
  const fromVal = document.getElementById("fromDate").value;
  const toVal = document.getElementById("toDate").value;
  const durationAlert = document.getElementById("durationAlert");
  const leaveDays = document.getElementById("leaveDays");

  if (fromVal && toVal) {
    const fromDate = new Date(fromVal);
    const toDate = new Date(toVal);

    // Difference in milliseconds
    const diffTime = toDate - fromDate;
    if (diffTime >= 0) {
      // Difference in days (+1 to include both starting and ending days)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      leaveDays.textContent = `${diffDays} Day${diffDays > 1 ? "s" : ""}`;
      durationAlert.classList.remove("d-none");
      return;
    }
  }
  durationAlert.classList.add("d-none");
}

document.getElementById("leaveForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("scup_user"));
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;
  const reason = document.getElementById("reason").value;

  const leaveData = {
    rollno: user.id,
    department: user.department,
    fromDate: fromDate,
    toDate: toDate,
    reason: reason,
    status: "Pending",
  };

  let leaveRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
  leaveRequests.push(leaveData);
  localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));

  // Trigger Bootstrap Success Modal
  const successModalMsg = document.getElementById("successModalMsg");
  successModalMsg.textContent = `Your request for ${document.getElementById("leaveDays").textContent} of leave has been submitted successfully!`;
  
  const myModal = new bootstrap.Modal(document.getElementById("successModal"));
  myModal.show();

  this.reset();
  document.getElementById("durationAlert").classList.add("d-none");
  
  // Re-autofill
  document.getElementById("rollno").value = user.id;
  document.getElementById("department").value = user.department;
});
