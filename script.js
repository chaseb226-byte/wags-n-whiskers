// Smooth transform-based parallax with 3 layered depths (hero video, shade/accents, copy),
// plus a gentle drift on section imagery. Uses rAF + translate3d only, is passive on
// scroll/resize, works with touch scrolling, and fully disables itself for reduced motion.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var layers = Array.prototype.slice.call(document.querySelectorAll(".parallax"));
  var ticking = false;

  function update() {
    ticking = false;
    if (reduce.matches) return;
    var vh = window.innerHeight;
    layers.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var speed = parseFloat(el.getAttribute("data-speed") || "0");
      // Progress of the parent through the viewport, -1..1 around center
      var progress = (r.top + r.height / 2 - vh / 2) / vh;
      var y = progress * speed * -220;
      el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
    });
  }
  function requestUpdate() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  if (!reduce.matches) {
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("orientationchange", requestUpdate, { passive: true });
    update();
  }

  // Video: respect reduced motion by pausing on the poster frame.
  var video = document.getElementById("heroVideo");
  if (video && reduce.matches) { video.removeAttribute("autoplay"); video.pause(); }

  // Highlight today's row in the hours table and add a plain-language note.
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var today = new Date().getDay();
  var row = document.querySelector('.hours tr[data-day="' + today + '"]');
  if (row) row.classList.add("today");
  var note = document.getElementById("todayNote");
  if (note) {
    note.textContent = (today >= 2 && today <= 6)
      ? "Today (" + days[today] + "): open 9 AM – 5 PM."
      : "Today (" + days[today] + "): closed. We reopen Tuesday at 9 AM.";
  }
})();
