// Minimal JS for theme toggle and contact handler
(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const preferred = localStorage.getItem('theme') || 'dark';
  if (preferred === 'light') root.classList.add('light');

  themeToggle && themeToggle.addEventListener('click', () => {
    root.classList.toggle('light');
    const now = root.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', now);
  });

})();

function handleForm(e){
  // no back-end — open user's mail client as a convenience
  const f = e.target;
  const name = encodeURIComponent(f.name.value.trim());
  const email = encodeURIComponent(f.email.value.trim());
  const message = encodeURIComponent(f.message.value.trim());
  if (!name || !email || !message) return false;
  const subject = encodeURIComponent('Portfolio inquiry from ' + name);
  const body = `From: ${name} (${email})%0D%0A%0D%0A${message}`;
  // update email address so messages go to your inbox
  window.location.href = `mailto:Ashishkumar77393@gmail.com?subject=${subject}&body=${body}`;
  return false;
}

// ============================================
// APPEND EVERYTHING BELOW TO THE END OF script.js
// ============================================

// ---- Total Visits counter ----
// Uses the free CountAPI service (no key/backend needed).
// Each page load increments a shared counter tied to this namespace/key.
(function () {
  const countEl = document.getElementById('visitCount');
  if (!countEl) return;

  fetch('https://api.countapi.xyz/hit/ashish77393-portfolio/visits')
    .then((res) => res.json())
    .then((data) => {
      countEl.textContent = data.value.toLocaleString();
    })
    .catch(() => {
      countEl.textContent = '—';
    });
})();

// ---- Job Notification Popup ----
(function () {
  const popup = document.getElementById('job-alert-popup');
  if (!popup) return;

  const closeBtn = document.getElementById('job-popup-close');
  const dismissCheckbox = document.getElementById('job-popup-dismiss-today');
  const STORAGE_KEY = 'jobPopupDismissedUntil';

  function isDismissedToday() {
    const until = localStorage.getItem(STORAGE_KEY);
    return until && Date.now() < Number(until);
  }

  function closePopup() {
    if (dismissCheckbox.checked) {
      const oneDay = 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, String(Date.now() + oneDay));
    }
    popup.classList.add('hidden');
  }

  if (!isDismissedToday()) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        popup.classList.remove('hidden');
      }, 800);
    });
  }

  closeBtn.addEventListener('click', closePopup);

  popup.addEventListener('click', function (e) {
    if (e.target === popup) closePopup();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
      closePopup();
    }
  });
})();
