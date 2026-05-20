/**
 * Data Communication Portfolio — interactive layer
 */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav__links");
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("section[id]");
  const reveals = document.querySelectorAll(".reveal");
  const heroContent = document.querySelector(".hero__content");
  const cards = document.querySelectorAll(".card");
  const timelineItems = document.querySelectorAll(".timeline__item");
  const buttons = document.querySelectorAll(".btn, .card__toggle");

 /**
 * Liquid Glass — interactions
 */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav__links");
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("section[id]");
  const reveals = document.querySelectorAll(".reveal");
  const heroContent = document.querySelector(".hero__content");
  const cards = document.querySelectorAll(".card");
  const timelineItems = document.querySelectorAll(".timeline__item");
  const buttons = document.querySelectorAll(".btn, .card__toggle");
  const progressBar = document.querySelector(".scroll-progress");

  /* Glass scroll capsule uses CSS variable */
  function updateScrollProgress() {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.setProperty("--progress", `${pct}%`);
  }

  function onScroll() {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
    setActiveNavLink();
    updateScrollProgress();
    backBtn?.classList.toggle("is-visible", window.scrollY > 480);
  }

  function setActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const { offsetTop, offsetHeight } = section;
      const id = section.getAttribute("id");
      if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navMenu.classList.toggle("is-open");
    });
    navLinks.forEach((link) => link.addEventListener("click", closeNav));
  }

  function closeNav() {
    navToggle?.setAttribute("aria-expanded", "false");
    navMenu?.classList.remove("is-open");
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* Soft hero float — liquid feel, not harsh 3D */
  if (heroContent && isFinePointer && !prefersReduced) {
    const hero = document.querySelector(".hero");
    hero?.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroContent.style.transform = `translate(${x * 12}px, ${y * 10}px)`;
    });
    hero?.addEventListener("mouseleave", () => {
      heroContent.style.transform = "";
    });
  }

  /* Gentle card lift on pointer — glass panels */
  if (!prefersReduced && isFinePointer) {
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  document.querySelectorAll(".card__toggle").forEach((btn) => {
    const card = btn.closest(".card");
    btn.addEventListener("click", () => {
      const expanded = card.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", String(expanded));
      btn.textContent = expanded ? "Hide details" : "Show details";
    });
  });

  timelineItems.forEach((item, i) => {
    item.addEventListener("mouseenter", () => {
      timelineItems.forEach((t, j) => t.classList.toggle("is-active", j === i));
    });
    item.addEventListener("mouseleave", () => {
      timelineItems.forEach((t) => t.classList.remove("is-active"));
    });
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (prefersReduced) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height) * 1.2;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  let backBtn = document.querySelector(".back-to-top");
  if (!backBtn) {
    backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "back-to-top";
    backBtn.setAttribute("aria-label", "Back to top");
    backBtn.textContent = "↑";
    document.body.appendChild(backBtn);
  }
  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id?.startsWith("#")) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  if (timelineItems.length && !prefersReduced) {
    let i = 0;
    setInterval(() => {
      if (document.querySelector(".timeline__item:hover")) return;
      timelineItems.forEach((t, j) => t.classList.toggle("is-active", j === i));
      i = (i + 1) % timelineItems.length;
    }, 4000);
  }

  /* Parallax blobs — subtle liquid depth */
  const blobs = document.querySelectorAll(".blob");
  if (blobs.length && !prefersReduced) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      blobs.forEach((blob, idx) => {
        const factor = (idx + 1) * 0.35;
        blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    setActiveNavLink();
    updateScrollProgress();
    toggleBackToTop();
  }

  function setActiveNavLink() {
    const scrollPos = window.scrollY + 140;
    sections.forEach((section) => {
      const { offsetTop, offsetHeight } = section;
      const id = section.getAttribute("id");
      if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }

  /* --- Mobile nav --- */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      navMenu.classList.toggle("is-open");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => closeNav());
    });
  }

  function closeNav() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    navMenu.classList.remove("is-open");
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* --- Cursor glow (desktop) --- */
  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow && isFinePointer && !prefersReduced) {
    document.body.classList.add("has-cursor-glow");
    let glowX = 0;
    let glowY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* --- Hero parallax tilt --- */
  if (heroContent && isFinePointer && !prefersReduced) {
    const hero = document.querySelector(".hero");
    hero?.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroContent.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
    });
    hero?.addEventListener("mouseleave", () => {
      heroContent.style.transform = "";
    });
  }

  /* --- Card 3D tilt --- */
  if (!prefersReduced && isFinePointer) {
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.classList.add("is-tilting", "is-hovered");
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("is-tilting", "is-hovered");
        card.style.transform = "";
      });
    });
  }

  /* --- Expandable card details --- */
  document.querySelectorAll(".card__toggle").forEach((btn) => {
    const card = btn.closest(".card");
    btn.addEventListener("click", () => {
      const expanded = card.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", String(expanded));
      btn.textContent = expanded ? "Hide details" : "Show details";
    });
  });

  /* --- Timeline hover sync --- */
  timelineItems.forEach((item, i) => {
    item.addEventListener("mouseenter", () => {
      timelineItems.forEach((t, j) => t.classList.toggle("is-active", j === i));
    });
    item.addEventListener("mouseleave", () => {
      timelineItems.forEach((t) => t.classList.remove("is-active"));
    });
  });

  /* --- Ripple on buttons --- */
  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (prefersReduced) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  /* --- Scroll reveal with stagger --- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const parent = el.closest(".cards, .resource-grid, .timeline");
        if (parent) {
          const siblings = [...parent.children].filter((c) => c.classList.contains("reveal"));
          const index = siblings.indexOf(el);
          el.style.setProperty("--stagger", index);
          el.setAttribute("data-stagger", "");
        }
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  /* --- Back to top --- */
  let backBtn = document.querySelector(".back-to-top");
  if (!backBtn) {
    backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "back-to-top";
    backBtn.setAttribute("aria-label", "Back to top");
    backBtn.innerHTML = "↑";
    document.body.appendChild(backBtn);
  }

  function toggleBackToTop() {
    backBtn.classList.toggle("is-visible", window.scrollY > 500);
  }

  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  /* --- Smooth anchor offset for fixed header --- */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id?.startsWith("#")) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* --- Auto-cycle timeline (subtle) --- */
  if (timelineItems.length && !prefersReduced) {
    let activeIndex = 0;
    setInterval(() => {
      if (document.querySelector(".timeline__item:hover")) return;
      timelineItems.forEach((t, i) => t.classList.toggle("is-active", i === activeIndex));
      activeIndex = (activeIndex + 1) % timelineItems.length;
    }, 3500);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();