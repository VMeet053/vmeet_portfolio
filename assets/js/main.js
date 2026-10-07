// Highlight the section you're reading in the sidebar, and keep the year current.
document.getElementById("year").textContent = new Date().getFullYear();

const links = document.querySelectorAll(".side__nav a");
const sections = [...links].map((a) => document.querySelector(a.getAttribute("href")));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) =>
        a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id)
      );
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => s && observer.observe(s));
