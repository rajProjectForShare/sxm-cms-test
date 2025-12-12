// header.js

console.log("sxm-cms-test 🚀 [CMS HEADER] script loaded");

// ===== Language Switch (Experience Cloud) =====
(function initLanguageSwitcher() {
  var LANG_EN = "en_US";
  var LANG_FR = "fr_CA"; // based on your Builder screenshot (French Canadian)

  function getUrl() {
    try {
      return new URL(window.location.href);
    } catch (e) {
      return null;
    }
  }

  function getCurrentSfLanguage() {
    var url = getUrl();
    if (!url) return null;

    // Experience uses ?language=en_US / fr_CA
    var q = url.searchParams.get("language");
    return q || null;
  }

  function setSfLanguage(lang) {
    var url = getUrl();
    if (!url) return;

    url.searchParams.set("language", lang);

    // optional: keep URL clean by removing any hash before reload
    // url.hash = "";

    window.location.href = url.toString();
  }

  function ensureLanguageOnInternalLinks(lang) {
    // Keep language param when user clicks header links like "/"
    var links = document.querySelectorAll(".sx-shell a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute("href");

      if (!href) continue;
      if (href === "#") continue;
      if (href.indexOf("javascript:") === 0) continue;
      if (href.indexOf("mailto:") === 0) continue;
      if (href.indexOf("tel:") === 0) continue;

      // Ignore absolute external links
      if (href.indexOf("http://") === 0 || href.indexOf("https://") === 0) {
        continue;
      }

      // Rewrite relative/internal URLs to preserve ?language=...
      try {
        var abs = new URL(href, window.location.origin);
        abs.searchParams.set("language", lang);
        a.setAttribute("href", abs.pathname + abs.search + abs.hash);
      } catch (e) {
        // ignore
      }
    }
  }

  function updateToggleLabel(currLang) {
    var toggle = document.getElementById("sx-lang-toggle");
    if (!toggle) return;

    // If currently French -> show EN (meaning: click to switch to English)
    // If currently English -> show FR
    if (currLang === LANG_FR) {
      toggle.textContent = "EN";
      toggle.setAttribute("data-target-lang", LANG_EN);
    } else {
      toggle.textContent = "FR";
      toggle.setAttribute("data-target-lang", LANG_FR);
    }
  }

  document.addEventListener("click", function (e) {
    var el = e.target;

    // If user clicks inside the <a> (span etc.), bubble up to the anchor
    while (el && el !== document && el.tagName !== "A") {
      el = el.parentNode;
    }

    if (!el || el === document) return;

    if (el.id === "sx-lang-toggle") {
      e.preventDefault();

      var curr = getCurrentSfLanguage();
      var next = el.getAttribute("data-target-lang") || (curr === LANG_FR ? LANG_EN : LANG_FR);

      setSfLanguage(next);
    }
  });

  // Init on load
  var current = getCurrentSfLanguage() || LANG_EN; // default fallback
  updateToggleLabel(current);
  ensureLanguageOnInternalLinks(current);

  console.log("✅ sxm-cms-test [CMS HEADER] language switch initialized:", current);
})();


// Try loading jQuery once per second for 10 seconds
(function waitForJQuery(retryCount) {
  retryCount = retryCount || 0;

  if (typeof window.jQuery !== "undefined") {
    console.log("✔ sxm-cms-test [CMS HEADER] jQuery version:", window.jQuery.fn.jquery);
    initMegaMenu(window.jQuery);
    return;
  }

  if (retryCount >= 10) {
    console.error("❌ sxm-cms-test [CMS HEADER] jQuery not loaded after 10 seconds");
    return;
  }

  console.warn(
    "⏳ sxm-cms-test [CMS HEADER] waiting for jQuery... (" +
      (retryCount + 1) +
      "/10)"
  );

  window.setTimeout(function () {
    waitForJQuery(retryCount + 1);
  }, 1000);
})();

function initMegaMenu($) {

  function closeAllPanels() {
    $(".sx-primary-item.sx-is-active").removeClass("sx-is-active");
    $(".sx-mega-panel.sx-open").removeClass("sx-open");
  }

  function openPanel(key) {
    closeAllPanels();
    if (!key) {
      return;
    }
    $('.sx-primary-item[data-mega="' + key + '"]').addClass("sx-is-active");
    $('.sx-mega-panel[data-panel="' + key + '"]').addClass("sx-open");
  }

  // Hover handlers
  $(document).on("mouseenter", ".sx-primary-item.sx-has-mega", function () {
    var key = $(this).data("mega");
    openPanel(key);
  });

  $(document).on("mouseleave", ".sx-shell", function () {
    closeAllPanels();
  });

  // Keyboard focus support
  $(document).on(
    "focusin",
    ".sx-primary-item.sx-has-mega .sx-primary-link",
    function () {
      var key = $(this).closest(".sx-primary-item").data("mega");
      openPanel(key);
    }
  );

  $(document).on("keydown", function (evt) {
    if (evt.key === "Escape") {
      closeAllPanels();
    }
  });

  console.log("✅ sxm-cms-test [CMS HEADER] mega menu initialized");
}
