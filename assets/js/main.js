document.getElementById("year").textContent = new Date().getFullYear();

// Solid nav background once you scroll.
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile menu.
const toggle = document.getElementById("toggle");
const menu = document.getElementById("menu");
const setMenu = (open) => {
  menu.classList.toggle("is-open", open);
  nav.classList.toggle("is-open", open);
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

// Project index: show a screenshot that follows the cursor (mouse only).
const peek = document.getElementById("peek");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (peek && finePointer) {
  let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
  const follow = () => {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    peek.style.left = cx + "px";
    peek.style.top = cy + "px";
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.5 ? requestAnimationFrame(follow) : 0;
  };
  document.querySelectorAll(".index a").forEach((row) => {
    row.addEventListener("mouseenter", (e) => {
      const src = row.dataset.img;
      if (!src) return;
      peek.src = src;
      cx = x = e.clientX + 200;
      cy = y = e.clientY;
      peek.classList.add("is-on");
    });
    row.addEventListener("mousemove", (e) => {
      x = e.clientX + 200;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(follow);
    });
    row.addEventListener("mouseleave", () => peek.classList.remove("is-on"));
  });
}
