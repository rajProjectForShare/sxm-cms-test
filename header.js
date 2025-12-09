// Test script to confirm CMS Connect JS loads correctly
console.log("🚀 Sirius Header JS Loaded");

// Make sure DOM is ready
$(document).ready(function () {
  console.log("✔ jQuery ready inside CMS Header");

  // Show dropdown on hover
  $(".menu-item").hover(
    function () {
      $(this).find(".dropdown").stop(true, true).slideDown(150);
    },
    function () {
      $(this).find(".dropdown").stop(true, true).slideUp(150);
    }
  );
});
