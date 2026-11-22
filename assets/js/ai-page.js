/* nCloudxel AI page: section scrolling, active navigation and footer year. */
(function () {
  "use strict";
  var links = document.querySelectorAll('.ai-section-nav a[href^="#"]');

  function headerOffset() {
    var header = document.querySelector(".premium-header");
    return header ? Math.ceil(header.getBoundingClientRect().height) + 14 : 18;
  }

  function scrollToTarget(target) {
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? "auto" : "smooth" });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#" + target.id);
      }
    });
  });

  if ("IntersectionObserver" in window && links.length) {
    var sections = Array.prototype.map.call(links, function (link) {
      return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-22% 0px -65% 0px", threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  var year = document.getElementById("ai-current-year");
  if (year) year.textContent = new Date().getFullYear();

  window.addEventListener("load", function () {
    if (!window.location.hash) return;
    var id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch (error) { id = window.location.hash.slice(1); }
    var target = document.getElementById(id);
    if (target) window.setTimeout(function () { scrollToTarget(target); }, 120);
  });
})();
