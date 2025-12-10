// header.js

console.log("sxm-cms-test 🚀 [CMS HEADER] script loaded");

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
