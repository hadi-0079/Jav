const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mobLinks   = document.querySelectorAll(".mob-link");

function toggleMenu() {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");

  document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
}

if (hamburger) {
  hamburger.addEventListener("click", toggleMenu);
}

mobLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  });
});

const cursor    = document.querySelector(".mouse-cursor");
const cursorDot = document.querySelector(".cursor-dot");
let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  }
});

function animateDot() {
  dotX += (mouseX - dotX) * 0.15;
  dotY += (mouseY - dotY) * 0.15;
  if (cursorDot) {
    cursorDot.style.left = dotX + "px";
    cursorDot.style.top  = dotY + "px";
  }
  requestAnimationFrame(animateDot);
}
animateDot();

const hoverTargets = document.querySelectorAll("a, h1, .sticker, .logo, button, .skill-card, .social-btn");
hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => cursor && cursor.classList.add("hovered"));
  el.addEventListener("mouseleave", () => cursor && cursor.classList.remove("hovered"));
});

const textElement = document.getElementById("typing-text");
const phrases = [
  "Thank You for Everythig... 💓 ",
  "You Made a Real Difference.",
  "One of the Kindest People I Know.",
  "Your Dreams Will Come True.",
  "Thanks for giving Best Memories 🩶",
  "Hemsha Yad rhen gi ap... Hmesha 🥹"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimer;

function typeWrite() {
  const current = phrases[phraseIndex];
  const displayed = isDeleting
    ? current.slice(0, charIndex--)
    : current.slice(0, charIndex++);

  if (textElement) textElement.textContent = displayed;

  if (!isDeleting && charIndex > current.length) {
    isDeleting = true;
    typeTimer = setTimeout(typeWrite, 2000);
    return;
  }
  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    charIndex = 0;
    typeTimer = setTimeout(typeWrite, 400);
    return;
  }
  typeTimer = setTimeout(typeWrite, isDeleting ? 45 : 95);
}
typeWrite();

const stickers = document.querySelectorAll(".sticker");

document.addEventListener("mousemove", (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) * 0.008;
  const dy = (e.clientY - cy) * 0.008;

  stickers.forEach((s, i) => {
    const depth = (i + 1) * 0.6;
    const rotate = s.style.getPropertyValue("--rotate") || "0deg";
    s.style.transform = `translate(${dx * depth}px, ${dy * depth}px) rotate(${rotate})`;
  });
});

stickers.forEach((sticker) => {
  sticker.addEventListener("click", function () {
    this.style.transition = "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
    this.style.transform  = "scale(1.25) rotate(360deg)";
    setTimeout(() => {
      this.style.transform  = "";
      this.style.transition = "";
    }, 400);
  });
});

const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }

  let current = "";
  sections.forEach((sec) => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}, { passive: true });

const darkSections = document.querySelectorAll(".contact");
darkSections.forEach((sec) => {
  sec.addEventListener("mouseenter", () => {
    cursor    && cursor.classList.add("on-dark");
    cursorDot && cursorDot.classList.add("on-dark");
  });
  sec.addEventListener("mouseleave", () => {
    cursor    && cursor.classList.remove("on-dark");
    cursorDot && cursorDot.classList.remove("on-dark");
  });
});

const revealEls = document.querySelectorAll(
  ".section-label, .section-heading, .about-text h2, .about-text p, " +
  ".about-card, .stat, .skill-card, .contact-sub, .contact-actions"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        const fill = entry.target.querySelector(".skill-fill");
        if (fill) fill.classList.add("animated");

        if (entry.target.classList.contains("stat")) {
          animateCounter(entry.target);
        }

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealEls.forEach((el) => observer.observe(el));

document.querySelectorAll(".skill-fill").forEach((fill) => {
  const skillObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      entries[0].target.classList.add("animated");
      skillObserver.disconnect();
    }
  }, { threshold: 0.5 });
  skillObserver.observe(fill);
});

function animateCounter(statEl) {
  const numEl  = statEl.querySelector(".stat-num");
  if (!numEl) return;
  const target = parseInt(numEl.dataset.target, 10);
  if (isNaN(target)) return;

  let start = 0;
  const duration = 1400;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); 

    numEl.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else numEl.textContent = target;
  };
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

