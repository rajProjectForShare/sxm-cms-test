// header.js

console.log("sxm-cms-test 🚀 [CMS HEADER] script loaded");

(function () {
  // Guard in case jQuery failed
  if (typeof window.jQuery === "undefined") {
    console.error("❌ [CMS HEADER] jQuery is not available.");
    return;
  }

  var $ = window.jQuery;
  console.log("✔ [CMS HEADER] jQuery version:", $.fn.jquery);

  function closeAllPanels() {
    $(".sx-primary-item.sx-is-active").removeClass("sx-is-active");
    $(".sx-mega-panel.sx-open").removeClass("sx-open");
  }

  function openPanel(key) {
    closeAllPanels();
    if (!key) return;

    $('.sx-primary-item[data-mega="' + key + '"]').addClass("sx-is-active");
    $('.sx-mega-panel[data-panel="' + key + '"]').addClass("sx-open");
  }

  // Click / hover handlers
  $(document).on("mouseenter", ".sx-primary-item.sx-has-mega", function () {
    var key = $(this).data("mega");
    openPanel(key);
  });

  $(document).on("mouseleave", ".sx-shell", function () {
    // When pointer leaves the entire header shell, close
    closeAllPanels();
  });

  // Keyboard focus support
  $(document).on("focusin", ".sx-primary-item.sx-has-mega .sx-primary-link", function () {
    var key = $(this).closest(".sx-primary-item").data("mega");
    openPanel(key);
  });

  $(document).on("keydown", function (evt) {
    if (evt.key === "Escape") {
      closeAllPanels();
    }
  });

  console.log("✅ [CMS HEADER] mega menu initialized");
})();
