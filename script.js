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