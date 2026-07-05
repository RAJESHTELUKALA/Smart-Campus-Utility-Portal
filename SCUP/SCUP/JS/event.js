let currentUser = null;
let activeTab = 'all'; // 'all' or 'mine'

document.addEventListener("DOMContentLoaded", () => {
  currentUser = JSON.parse(localStorage.getItem("scup_user"));
  if (!currentUser) return;

  // Show dynamic creation actions for Faculty / Admin
  if (currentUser.role !== "Student") {
    document.getElementById("addEventBtn").classList.remove("d-none");
    document.getElementById("myEventsTabItem").classList.add("d-none"); // Faculty doesn't register
  }

  // Set min event date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("eventDate").min = today;

  renderEvents();
});

function renderEvents() {
  const container = document.getElementById("eventList");
  const events = JSON.parse(localStorage.getItem("campusEvents")) || [];
  const registeredEvents = JSON.parse(localStorage.getItem("registeredEvents")) || [];

  container.innerHTML = "";

  let eventsToRender = events;

  // If student filter is on
  if (currentUser.role === "Student" && activeTab === 'mine') {
    eventsToRender = events.filter(e => registeredEvents.some(re => re.id === e.id));
  }

  document.getElementById("eventCountBadge").textContent = `${eventsToRender.length} Event${eventsToRender.length !== 1 ? "s" : ""} Available`;

  if (eventsToRender.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5 text-muted glass-card">
        <i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
        <h5>No events found.</h5>
        <p class="text-sm">Check back later for exciting campus happenings.</p>
      </div>
    `;
    return;
  }

  eventsToRender.forEach(event => {
    const isRegistered = registeredEvents.some(e => e.id === event.id);

    let actionBtn = "";
    if (currentUser.role === "Student") {
      if (isRegistered) {
        actionBtn = `
          <button class="btn btn-secondary-custom w-100" onclick="deregisterEvent('${event.id}')">
            <i class="bi bi-bookmark-x me-1"></i> Deregister
          </button>`;
      } else {
        actionBtn = `
          <button class="btn btn-premium w-100" onclick="registerEvent('${event.id}')">
            <i class="bi bi-bookmark-plus me-1"></i> Register
          </button>`;
      }
    } else {
      // Faculty/Admin can delete events
      actionBtn = `
        <button class="btn btn-outline-danger w-100" onclick="deleteEvent('${event.id}')">
          <i class="bi bi-trash-fill me-1"></i> Cancel Event
        </button>`;
    }

    const card = `
      <div class="col-md-6 col-lg-4">
        <div class="glass-card h-100 d-flex flex-column justify-content-between p-4 border">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-3">
              <span class="badge-custom pending py-1 px-2 text-xs" style="font-size: 0.65rem;">
                <i class="bi bi-calendar-event"></i> Upcoming
              </span>
              <span class="text-muted text-xs font-monospace">ID: ${event.id}</span>
            </div>
            <h5 class="fw-extrabold mb-2">${event.title}</h5>
            <div class="d-flex align-items-center text-sm text-secondary mb-2">
              <i class="bi bi-calendar-check me-2 text-primary"></i> <strong>Date:</strong> &nbsp;${event.date}
            </div>
            <div class="d-flex align-items-center text-sm text-secondary mb-3">
              <i class="bi bi-geo-alt me-2 text-warning"></i> <strong>Venue:</strong> &nbsp;${event.location}
            </div>
            <p class="text-secondary text-sm mb-4 line-clamp-3">${event.description}</p>
          </div>
          <div>
            ${actionBtn}
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

function registerEvent(eventId) {
  const events = JSON.parse(localStorage.getItem("campusEvents")) || [];
  const registeredEvents = JSON.parse(localStorage.getItem("registeredEvents")) || [];

  const selected = events.find(e => e.id === eventId);
  if (selected && !registeredEvents.some(re => re.id === eventId)) {
    registeredEvents.push(selected);
    localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
    alert(`Successfully registered for "${selected.title}"!`);
    renderEvents();
  }
}

function deregisterEvent(eventId) {
  let registeredEvents = JSON.parse(localStorage.getItem("registeredEvents")) || [];
  const selected = registeredEvents.find(e => e.id === eventId);
  if (selected && confirm(`Are you sure you want to deregister from "${selected.title}"?`)) {
    registeredEvents = registeredEvents.filter(re => re.id !== eventId);
    localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
    renderEvents();
  }
}

function deleteEvent(eventId) {
  let events = JSON.parse(localStorage.getItem("campusEvents")) || [];
  const selected = events.find(e => e.id === eventId);
  if (selected && confirm(`Are you sure you want to delete and cancel the event "${selected.title}"?`)) {
    events = events.filter(e => e.id !== eventId);
    localStorage.setItem("campusEvents", JSON.stringify(events));
    renderEvents();
  }
}

function switchTab(tab) {
  activeTab = tab;
  renderEvents();
}

// Handle Form Submission
document.getElementById("addEventForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("eventTitle").value.trim();
  const date = document.getElementById("eventDate").value;
  const location = document.getElementById("eventLocation").value.trim();
  const description = document.getElementById("eventDesc").value.trim();

  const newId = "e" + Math.floor(104 + Math.random() * 900);

  const newEvent = {
    id: newId,
    title: title,
    date: date,
    location: location,
    description: description,
    createdBy: currentUser.role
  };

  let events = JSON.parse(localStorage.getItem("campusEvents")) || [];
  events.push(newEvent);
  localStorage.setItem("campusEvents", JSON.stringify(events));

  // Hide Modal
  const modalEl = document.getElementById("addEventModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  // Reset form
  this.reset();

  renderEvents();
});
