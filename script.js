document.getElementById("year").textContent = new Date().getFullYear();

function setHeaderHeightVar() {
  const header = document.querySelector(".site-header");
  if (header) {
    document.documentElement.style.setProperty(
      "--header-h",
      `${header.offsetHeight}px`
    );
  }
}
setHeaderHeightVar();
window.addEventListener("resize", setHeaderHeightVar);

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Scroll-reveal: fade/slide each section up once, the first time it scrolls into view.
const revealEls = document.querySelectorAll(".reveal");
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

// Scoreboard count-up: animate each stat from 0 to its target once, on first view.
function animateCount(el, target, suffix, duration = 1000) {
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(eased * target)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = `${target}${suffix}`;
    }
  }
  requestAnimationFrame(frame);
}

const scoreboard = document.querySelector(".scoreboard");
if (scoreboard && !prefersReducedMotion && "IntersectionObserver" in window) {
  const scoreNums = scoreboard.querySelectorAll(".score-num");
  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scoreNums.forEach((el) => {
            const match = el.textContent.match(/^(\d+)(.*)$/);
            if (match) {
              animateCount(el, parseInt(match[1], 10), match[2]);
            }
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  countObserver.observe(scoreboard);
}
