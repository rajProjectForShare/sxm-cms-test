// header.js

console.log("sxm-cms-test 🚀 [CMS HEADER] script loaded");

// ===== Language Switch (Experience Cloud) =====
(function initLanguageSwitcher() {
  var LANG_EN = "en_US";
  var LANG_FR = "fr_CA"; // your Experience Builder shows French (Canadian)

  function isSalesforceExperienceHost() {
    var h = window.location.hostname || "";
    // Adjust if needed, but this matches your site.com domain
    return h.indexOf(".my.site.com") > -1 || h.indexOf(".force.com") > -1;
  }

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
    return url.searchParams.get("language");
  }

  function setSfLanguage(lang) {
    var url = getUrl();
    if (!url) return;

    url.searchParams.set("language", lang);
    window.location.href = url.toString();
  }

  function updateToggleLabel(currLang) {
    var btn = document.querySelector("[data-lang-toggle]");
    if (!btn) return;

    // show the *other* language as the clickable option
    if (currLang === LANG_FR) {
      btn.textContent = "EN";
      btn.setAttribute("data-target-lang", LANG_EN);
    } else {
      btn.textContent = "FR";
      btn.setAttribute("data-target-lang", LANG_FR);
    }
  }

  function handleToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    var btn = e.currentTarget;
    var curr = getCurrentSfLanguage() || LANG_EN;
    var next = btn.getAttribute("data-target-lang") || (curr === LANG_FR ? LANG_EN : LANG_FR);

    if (isSalesforceExperienceHost()) {
      // ✅ Real switch inside Experience Cloud
      setSfLanguage(next);
    } else {
      // ✅ GitHub Pages / WP preview: don't navigate away
      // Just simulate switch for preview purposes
      updateToggleLabel(next);
      console.log("ℹ️ Preview mode: language toggled (no Salesforce redirect). Next:", next);
    }
  }

  // Bind once
  function bind() {
    var btn = document.querySelector("[data-lang-toggle]");
    if (!btn) {
      console.log('no button')
      return;
    }
    // Prevent double-binding
    if (btn.getAttribute("data-bound") === "1") return;
    btn.setAttribute("data-bound", "1");

    btn.addEventListener("click", handleToggleClick);

    var curr = getCurrentSfLanguage() || LANG_EN;
    updateToggleLabel(curr);

    console.log("✅ sxm-cms-test [CMS HEADER] language switch bound. Host:", window.location.hostname);
  }

  // DOM is already present in CMS fragment, but bind safely
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
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
