/* nCloudxel Kubernetes page interactions */
(function () {
  "use strict";

  var sectionLinks = document.querySelectorAll('.kp-section-nav a[href^="#"]');

  function getHeaderOffset() {
    var header = document.querySelector(".premium-header");
    return header ? Math.ceil(header.getBoundingClientRect().height) + 14 : 18;
  }

  function scrollToSection(target) {
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
  }

  sectionLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href").slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      scrollToSection(target);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#" + id);
      }
    });
  });

  // Highlight the page-section navigation link for the section currently in view.
  if ("IntersectionObserver" in window && sectionLinks.length) {
    var sections = Array.prototype.map.call(sectionLinks, function (link) {
      return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-22% 0px -65% 0px", threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // Keep the footer copyright year current.
  var year = document.getElementById("kp-current-year");
  if (year) year.textContent = new Date().getFullYear();

  // Support direct links such as kubernetes.html#service-packages.
  window.addEventListener("load", function () {
    if (!window.location.hash) return;
    var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) window.setTimeout(function () { scrollToSection(target); }, 120);
  });
})();
