// Wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // 1. Session verification & Profile setup
  const userStr = localStorage.getItem("scup_user");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // If not logged in and not on login page, redirect to index.html
  if (!userStr && currentPage !== "index.html") {
    window.location.href = "index.html";
    return;
  }

  let user = null;
  if (userStr) {
    user = JSON.parse(userStr);
  }

  // 2. Render Sidebar dynamically if sidebar container exists
  renderSidebar(user, currentPage);

  // 3. Dark mode handler
  initDarkMode();

  // 4. Loading Spinner handler (if any)
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) {
    setTimeout(function () {
      spinner.style.display = "none";
    }, 400);
  }
});

// Dynamic Sidebar Renderer
function renderSidebar(user, currentPage) {
  const sidebarContainer = document.getElementById("sidebarContainer");
  if (!sidebarContainer) return;

  if (!user) return;

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

  // Check which page is currently active
  const isActive = (page) => currentPage === page ? 'active' : '';

  const menuHtml = `
    <div class="sidebar" id="appSidebar">
      <div class="brand-section">
        <div class="brand-logo-icon">
          <i class="bi bi-rocket-takeoff-fill"></i>
        </div>
        <a href="dashboard.html" class="brand-logo">SCUP</a>
      </div>

      <div class="user-profile-widget">
        <div class="profile-avatar">${firstLetter}</div>
        <div class="profile-info">
          <div class="profile-name" title="${user.name}">${user.name}</div>
          <div class="profile-role">${user.role}</div>
        </div>
      </div>

      <ul class="sidebar-menu">
        <li class="menu-item ${isActive('dashboard.html')}">
          <a href="dashboard.html"><i class="bi bi-grid-fill"></i> Dashboard</a>
        </li>
        <li class="menu-item ${isActive('leave.html')}">
          <a href="leave.html"><i class="bi bi-calendar2-check-fill"></i> Apply for Leave</a>
        </li>
        <li class="menu-item ${isActive('maintenance.html')}">
          <a href="maintenance.html"><i class="bi bi-tools"></i> Raise Maintenance</a>
        </li>
        <li class="menu-item ${isActive('status.html')}">
          <a href="status.html"><i class="bi bi-file-earmark-bar-graph-fill"></i> Track Requests</a>
        </li>
        <li class="menu-item ${isActive('events.html')}">
          <a href="events.html"><i class="bi bi-calendar-event-fill"></i> Event Portal</a>
        </li>
        <li class="menu-item ${isActive('feedback.html')}">
          <a href="feedback.html"><i class="bi bi-chat-heart-fill"></i> AI Feedback</a>
        </li>
      </ul>

      <div class="sidebar-footer">
        <button class="theme-switch-btn" id="darkModeToggle" title="Toggle Dark/Light Mode">
          <i class="bi bi-moon-stars-fill"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger border-0 fw-bold" onclick="handleLogout()">
          <i class="bi bi-box-arrow-left me-1"></i> Log Out
        </button>
      </div>
    </div>
  `;

  sidebarContainer.innerHTML = menuHtml;

  // Insert a mobile navigation toggle bar overlay
  const mobileToggle = document.createElement("button");
  mobileToggle.className = "mobile-nav-toggle position-fixed top-0 start-0 m-3";
  mobileToggle.id = "mobileNavToggle";
  mobileToggle.innerHTML = '<i class="bi bi-list fs-4"></i>';
  document.body.appendChild(mobileToggle);

  mobileToggle.addEventListener("click", () => {
    const sidebar = document.getElementById("appSidebar");
    sidebar.classList.toggle("active");
    if (sidebar.classList.contains("active")) {
      mobileToggle.innerHTML = '<i class="bi bi-x-lg fs-4"></i>';
    } else {
      mobileToggle.innerHTML = '<i class="bi bi-list fs-4"></i>';
    }
  });

  // Highlight close when clicked outside (on mobile)
  document.addEventListener("click", (e) => {
    const sidebar = document.getElementById("appSidebar");
    if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains("active")) {
      if (!sidebar.contains(e.target) && e.target !== mobileToggle && !mobileToggle.contains(e.target)) {
        sidebar.classList.remove("active");
        mobileToggle.innerHTML = '<i class="bi bi-list fs-4"></i>';
      }
    }
  });
}

// Dark Mode Initialization
function initDarkMode() {
  const body = document.body;
  const isDarkMode = localStorage.getItem("scup-dark-mode") === "on";

  if (isDarkMode) {
    body.classList.add("dark-mode");
    updateThemeIcon(true);
  }

  // Use event delegation because the button is generated dynamically
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("#darkModeToggle");
    if (btn) {
      body.classList.toggle("dark-mode");
      const active = body.classList.contains("dark-mode");
      localStorage.setItem("scup-dark-mode", active ? "on" : "off");
      updateThemeIcon(active);
    }
  });
}

function updateThemeIcon(isDark) {
  const toggleBtn = document.getElementById("darkModeToggle");
  if (!toggleBtn) return;

  if (isDark) {
    toggleBtn.innerHTML = '<i class="bi bi-sun-fill text-warning"></i>';
  } else {
    toggleBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
  }
}

// Logout handler
function handleLogout() {
  localStorage.removeItem("scup_user");
  window.location.href = "index.html";
}
