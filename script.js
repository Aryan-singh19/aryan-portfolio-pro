const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach((el) => io.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();
