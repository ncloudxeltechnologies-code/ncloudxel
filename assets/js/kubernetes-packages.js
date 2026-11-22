/* nCloudxel Kubernetes page interactions.
   - Smooth-scrolls package links to their matching sections.
   - Accounts for the site's sticky header.
   - Supports keyboard activation and reduced-motion preferences.
   - No libraries or external dependencies required. */
(function () {
  "use strict";

  function getHeaderOffset() {
    var header = document.querySelector(".premium-header");
    return header ? Math.ceil(header.getBoundingClientRect().height) + 16 : 20;
  }

  function scrollToTarget(target) {
    if (!target) return;

    var top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? "auto" : "smooth"
    });

    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
    }

    window.setTimeout(function () {
      target.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 350);
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest(
      '.k8s-package-button[href^="#"], .k8s-contact-button[href^="#"]'
    );

    if (!link) return;

    var targetId = link.getAttribute("href").slice(1);
    var target = document.getElementById(targetId);

    if (!target) return;

    event.preventDefault();
    scrollToTarget(target);

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + targetId);
    }
  });

  // Correct the initial position when the page is opened with a package hash.
  window.addEventListener("load", function () {
    if (!window.location.hash) return;

    var target = document.getElementById(
      decodeURIComponent(window.location.hash.slice(1))
    );

    if (target) {
      window.setTimeout(function () {
        scrollToTarget(target);
      }, 100);
    }
  });
})();
