function adjustRoleFields() {
  const roleSelect = document.getElementById("userRole");
  const idLabel = document.getElementById("idLabel");
  const idInput = document.getElementById("userId");

  if (roleSelect.value === "Student") {
    idLabel.textContent = "Roll No";
    idInput.placeholder = "Enter your Roll No (e.g. 23A51A12B5)";
  } else {
    idLabel.textContent = "Employee ID";
    idInput.placeholder = "Enter your Employee ID (e.g. EMP-9821)";
  }
}

function handleLogin() {
  const name = document.getElementById("userName").value.trim();
  const id = document.getElementById("userId").value.trim();
  const department = document.getElementById("userDept").value.trim();
  const role = document.getElementById("userRole").value;

  if (name && id && department && role) {
    const user = { name, id, department, role };
    localStorage.setItem("scup_user", JSON.stringify(user));
    
    // Seed initial mock data if not present
    seedMockData();

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  }
}

function seedMockData() {
  // Pre-seed some default leave requests if localStorage is empty
  if (!localStorage.getItem("leaveRequests")) {
    const defaultLeaves = [
      {
        rollno: "23A51A12B5",
        department: "IT",
        fromDate: "2026-07-10",
        toDate: "2026-07-12",
        reason: "Attending a cousin's marriage out of station.",
        status: "Approved"
      },
      {
        rollno: "23A51A12A2",
        department: "CSE",
        fromDate: "2026-07-08",
        toDate: "2026-07-09",
        reason: "Severe fever, doctor advised rest.",
        status: "Pending"
      }
    ];
    localStorage.setItem("leaveRequests", JSON.stringify(defaultLeaves));
  }

  // Pre-seed some default maintenance complaints if empty
  if (!localStorage.getItem("complaints")) {
    const defaultComplaints = [
      {
        id: "MC-451",
        rollno: "23A51A12B5",
        location: "Hostel Block B - Room 202",
        issueType: "Electrical",
        description: "Ceiling fan is making loud noises and rotating very slowly.",
        status: "Resolved"
      },
      {
        id: "MC-789",
        rollno: "23A51A12A2",
        location: "CSE Lab 3 - Ground Floor",
        issueType: "Furniture",
        description: "Broken leg on the computer chair at terminal 14.",
        status: "Rejected"
      },
      {
        id: "MC-120",
        rollno: "23A51A12B5",
        location: "Central Library - Reading Room",
        issueType: "Internet",
        description: "Wi-Fi connectivity is extremely slow or keeps disconnecting.",
        status: "Pending"
      }
    ];
    localStorage.setItem("complaints", JSON.stringify(defaultComplaints));
  }

  // Pre-seed default events if empty
  if (!localStorage.getItem("campusEvents")) {
    const defaultEvents = [
      {
        id: "e101",
        title: "AITAM National Hackathon 2026",
        date: "2026-08-15",
        description: "Build innovative web-app solutions in 24 hours! Prizes up to 50k INR.",
        location: "CSE Seminar Hall",
        createdBy: "Admin"
      },
      {
        id: "e102",
        title: "Tech Talk on Generative AI by TCS",
        date: "2026-08-20",
        description: "Industry experts from TCS share insights on LLMs and agentic AI systems.",
        location: "Central Auditorium",
        createdBy: "Faculty"
      },
      {
        id: "e103",
        title: "Annual Sports Meet 2026",
        date: "2026-09-02",
        description: "Intra-college sports championships for cricket, basketball, and athletics.",
        location: "Campus Sports Ground",
        createdBy: "Admin"
      }
    ];
    localStorage.setItem("campusEvents", JSON.stringify(defaultEvents));
  }
}

// Adjust labels on load
document.addEventListener("DOMContentLoaded", () => {
  adjustRoleFields();
});
