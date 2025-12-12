// header.js

console.log("sxm-cms-test 🚀 [CMS HEADER] script loaded");

// ===== Language Dropdown (Experience Cloud) =====
(function initLanguageDropdown() {
  var LANG_EN = "en_US";
  var LANG_FR = "fr_CA"; // your Experience Builder shows French (Canadian)

  function isSalesforceExperienceHost() {
    var h = window.location.hostname || "";
    return h.indexOf(".my.site.com") > -1 || h.indexOf(".force.com") > -1;
  }

  function getUrl() {
    try { return new URL(window.location.href); } catch (e) { return null; }
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

    // Use assign() to force reload
    window.location.assign(url.toString());
  }

  function bindIfFound() {
    var select = document.querySelector("[data-lang-select]");
    if (!select) return false;

    if (select.getAttribute("data-bound") === "1") return true;
    select.setAttribute("data-bound", "1");

    // Set initial selection based on current URL
    var curr = getCurrentSfLanguage() || LANG_EN;

    // If an unknown value comes (ex: fr_FR), fallback to EN
    if (curr !== LANG_EN && curr !== LANG_FR) curr = LANG_EN;

    select.value = curr;

    select.addEventListener("change", function (e) {
      var chosen = e.target.value;

      console.log("🌐 Language selected:", chosen, "Host:", window.location.hostname);

      if (isSalesforceExperienceHost()) {
        setSfLanguage(chosen);
      } else {
        // Preview mode (GitHub Pages): just update selection, no redirect
        console.log("ℹ️ Preview mode: selection changed (no Salesforce redirect).");
      }
    });

    console.log("✅ sxm-cms-test [CMS HEADER] language dropdown bound. Current:", curr);
    return true;
  }

  // CMS Connect inject timing safe-bind
  if (bindIfFound()) return;

  var obs = new MutationObserver(function () {
    if (bindIfFound()) obs.disconnect();
  });

  obs.observe(document.documentElement, { childList: true, subtree: true });

  var tries = 0;
  var timer = window.setInterval(function () {
    tries++;
    if (bindIfFound() || tries > 30) window.clearInterval(timer);
  }, 300);

  console.log("⏳ Waiting for header to render so language dropdown can bind...");
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
