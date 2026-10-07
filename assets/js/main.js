document.getElementById("year").textContent = new Date().getFullYear();

// Shadow under the nav once you scroll.
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile menu.
const toggle = document.getElementById("toggle");
const menu = document.getElementById("menu");
const setMenu = (open) => {
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// Fade blocks in as they scroll into view.
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add("is-in"));
}

// Highlight the current section in the nav.
const links = [...menu.querySelectorAll("a")];
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-on", a.hash === "#" + entry.target.id));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
links.forEach((a) => {
  const section = document.querySelector(a.hash);
  if (section) spy.observe(section);
});

// Project filters.
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    const type = btn.dataset.filter;
    filters.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    cards.forEach((card) => {
      card.hidden = type !== "all" && card.dataset.type !== type;
    });
  })
);

// Contact form: open the visitor's email app with the message filled in.
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const name = String(data.get("name") || "").trim();
  const type = String(data.get("type") || "a project");
  const message = String(data.get("message") || "").trim();
  const subject = `Project enquiry: ${type}`;
  const body = `Hi Meet,\n\nI need help with ${type}.\n\n${message}\n\n— ${name}`;
  window.location.href =
    "mailto:v.meet0503@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
});
