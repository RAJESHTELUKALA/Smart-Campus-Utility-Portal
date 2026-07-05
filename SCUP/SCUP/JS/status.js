let currentUser = null;
let allLeaves = [];
let allComplaints = [];

document.addEventListener("DOMContentLoaded", () => {
  currentUser = JSON.parse(localStorage.getItem("scup_user"));
  if (!currentUser) return;

  // Custom text for Faculty / Admin
  if (currentUser.role !== "Student") {
    document.getElementById("portalSubText").textContent = "Administrative portal to review, approve, and resolve campus requests.";
  }

  loadData();
});

function loadData() {
  allLeaves = JSON.parse(localStorage.getItem("leaveRequests")) || [];
  allComplaints = JSON.parse(localStorage.getItem("complaints")) || [];

  renderTables();
}

function renderTables() {
  const leaveTableBody = document.getElementById("leaveTableBody");
  const complaintsTableBody = document.getElementById("complaintsTableBody");

  const searchQuery = document.getElementById("searchInput").value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;

  // Clear previous
  leaveTableBody.innerHTML = "";
  complaintsTableBody.innerHTML = "";

  // 1. FILTER LEAVES
  let leavesToRender = allLeaves;
  if (currentUser.role === "Student") {
    leavesToRender = leavesToRender.filter(l => l.rollno === currentUser.id);
  }

  leavesToRender = leavesToRender.filter(l => {
    const matchesSearch = l.rollno.toLowerCase().includes(searchQuery) || 
                          l.reason.toLowerCase().includes(searchQuery) ||
                          l.department.toLowerCase().includes(searchQuery);
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  document.getElementById("leaveCount").textContent = `${leavesToRender.length} Application${leavesToRender.length !== 1 ? "s" : ""}`;

  if (leavesToRender.length === 0) {
    leaveTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted"><i class="bi bi-inbox me-2"></i>No leave requests found.</td></tr>`;
  } else {
    leavesToRender.forEach((l) => {
      // Find index in global array to operate
      const globalIndex = allLeaves.findIndex(globalL => 
        globalL.rollno === l.rollno && 
        globalL.fromDate === l.fromDate && 
        globalL.toDate === l.toDate && 
        globalL.reason === l.reason
      );

      const statusBadge = getStatusBadge(l.status);
      let actionsHtml = "";

      if (l.status === "Pending") {
        if (currentUser.role === "Student") {
          actionsHtml = `<button class="btn btn-sm btn-outline-danger" onclick="cancelLeave(${globalIndex})"><i class="bi bi-x-circle"></i> Cancel</button>`;
        } else {
          actionsHtml = `
            <div class="d-flex gap-2 justify-content-end">
              <button class="btn btn-sm btn-success" onclick="updateLeaveStatus(${globalIndex}, 'Approved')"><i class="bi bi-check-lg"></i> Approve</button>
              <button class="btn btn-sm btn-outline-danger" onclick="updateLeaveStatus(${globalIndex}, 'Rejected')"><i class="bi bi-x-lg"></i> Reject</button>
            </div>
          `;
        }
      } else {
        actionsHtml = `<span class="text-muted text-xs">No actions available</span>`;
      }

      const row = `
        <tr>
          <td><strong class="text-primary">${l.rollno}</strong></td>
          <td>${l.department}</td>
          <td>
            <div class="fw-bold">${l.fromDate}</div>
            <small class="text-muted">to ${l.toDate}</small>
          </td>
          <td class="text-wrap" style="max-width: 250px;">${l.reason}</td>
          <td>${statusBadge}</td>
          <td class="text-end">${actionsHtml}</td>
        </tr>
      `;
      leaveTableBody.innerHTML += row;
    });
  }

  // 2. FILTER COMPLAINTS
  let complaintsToRender = allComplaints;
  if (currentUser.role === "Student") {
    complaintsToRender = complaintsToRender.filter(c => c.rollno === currentUser.id);
  }

  complaintsToRender = complaintsToRender.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery) || 
                          c.location.toLowerCase().includes(searchQuery) || 
                          c.issueType.toLowerCase().includes(searchQuery) ||
                          c.description.toLowerCase().includes(searchQuery);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter || 
                          (statusFilter === "Approved" && c.status === "Resolved");
    return matchesSearch && matchesStatus;
  });

  document.getElementById("complaintCount").textContent = `${complaintsToRender.length} Ticket${complaintsToRender.length !== 1 ? "s" : ""}`;

  if (complaintsToRender.length === 0) {
    complaintsTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted"><i class="bi bi-inbox me-2"></i>No maintenance complaints found.</td></tr>`;
  } else {
    complaintsToRender.forEach((c) => {
      const globalIndex = allComplaints.findIndex(globalC => globalC.id === c.id);

      const statusBadge = getStatusBadge(c.status);
      let actionsHtml = "";

      if (c.status === "Pending") {
        if (currentUser.role === "Student") {
          actionsHtml = `<button class="btn btn-sm btn-outline-danger" onclick="cancelComplaint(${globalIndex})"><i class="bi bi-trash"></i> Cancel</button>`;
        } else {
          actionsHtml = `
            <div class="d-flex gap-2 justify-content-end">
              <button class="btn btn-sm btn-success" onclick="updateComplaintStatus(${globalIndex}, 'Resolved')"><i class="bi bi-wrench"></i> Resolve</button>
              <button class="btn btn-sm btn-outline-danger" onclick="updateComplaintStatus(${globalIndex}, 'Rejected')"><i class="bi bi-x-lg"></i> Reject</button>
            </div>
          `;
        }
      } else {
        actionsHtml = `<span class="text-muted text-xs">No actions available</span>`;
      }

      const row = `
        <tr>
          <td><strong class="text-warning">${c.id}</strong></td>
          <td>${c.location}</td>
          <td><span class="badge bg-light text-dark border">${c.issueType}</span></td>
          <td class="text-wrap" style="max-width: 250px;">${c.description}</td>
          <td>${statusBadge}</td>
          <td class="text-end">${actionsHtml}</td>
        </tr>
      `;
      complaintsTableBody.innerHTML += row;
    });
  }
}

function getStatusBadge(status) {
  switch (status) {
    case "Pending":
      return `<span class="badge-custom pending"><i class="bi bi-hourglass-split"></i> Pending</span>`;
    case "Approved":
      return `<span class="badge-custom approved"><i class="bi bi-check-circle-fill"></i> Approved</span>`;
    case "Resolved":
      return `<span class="badge-custom resolved"><i class="bi bi-check-circle-fill"></i> Resolved</span>`;
    case "Rejected":
      return `<span class="badge-custom rejected"><i class="bi bi-x-circle-fill"></i> Rejected</span>`;
    default:
      return `<span class="badge bg-secondary">${status}</span>`;
  }
}

function filterData() {
  renderTables();
}

function clearFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("statusFilter").value = "All";
  renderTables();
}

// Global actions
function updateLeaveStatus(index, newStatus) {
  allLeaves[index].status = newStatus;
  localStorage.setItem("leaveRequests", JSON.stringify(allLeaves));
  loadData();
}

function updateComplaintStatus(index, newStatus) {
  allComplaints[index].status = newStatus;
  localStorage.setItem("complaints", JSON.stringify(allComplaints));
  loadData();
}

function cancelLeave(index) {
  if (confirm("Are you sure you want to cancel this leave application?")) {
    allLeaves[index].status = "Rejected";
    localStorage.setItem("leaveRequests", JSON.stringify(allLeaves));
    loadData();
  }
}

function cancelComplaint(index) {
  if (confirm("Are you sure you want to cancel this maintenance complaint?")) {
    allComplaints[index].status = "Rejected";
    localStorage.setItem("complaints", JSON.stringify(allComplaints));
    loadData();
  }
}
