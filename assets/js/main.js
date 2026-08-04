document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav__links a, .site-nav .btn");

  const closeNav = () => {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    const icon = toggle.querySelector(".bi");
    if (icon) {
      icon.classList.add("bi-list");
      icon.classList.remove("bi-x-lg");
    }
  };

  if (toggle && nav) {
    const icon = toggle.querySelector(".bi");

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

      if (icon) {
        icon.classList.toggle("bi-list", !open);
        icon.classList.toggle("bi-x-lg", open);
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      once: true,
      offset: 40,
      disable: window.innerWidth < 480 ? "mobile" : false,
    });
  }

  if (typeof GLightbox !== "undefined") {
    GLightbox({ selector: ".glightbox" });
  }

  if (typeof Swiper !== "undefined" && document.querySelector(".projects-swiper")) {
    new Swiper(".projects-swiper", {
      loop: true,
      spaceBetween: 16,
      slidesPerView: 1,
      breakpoints: {
        640: { spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 24 },
        1100: { slidesPerView: 3, spaceBetween: 24 },
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  const filterButtons = document.querySelectorAll("[data-gallery-filter]");
  const galleryItems = document.querySelectorAll("[data-gallery-category]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-gallery-filter");

      filterButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");

      galleryItems.forEach((item) => {
        const category = item.getAttribute("data-gallery-category");
        const show = filter === "all" || category === filter;
        item.hidden = !show;
      });
    });
  });

  // Transparent header scroll
  const header = document.querySelector(".site-header--transparent");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
});
