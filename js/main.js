(function() {
  'use strict';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  var menuToggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('is-open');
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('is-open');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll: use class so CSS theme (light/dark) controls header color
  var header = document.querySelector('.site-header');
  if (header) {
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Hero slideshow
  (function initSlideshow() {
    var track = document.getElementById('slideshow-track');
    var dotsContainer = document.getElementById('slide-dots');
    var prevBtn = document.getElementById('slide-prev');
    var nextBtn = document.getElementById('slide-next');
    if (!track || !dotsContainer) return;

    var slides = track.querySelectorAll('.slide');
    var dots = dotsContainer.querySelectorAll('.dot');
    if (slides.length === 0) return;

    var current = 0;
    var total = slides.length;
    var autoInterval = 4000;
    var timer = null;
    console.debug('slideshow initialized — slides:', total);

    function goToSlide(index) {
      if (slides[current]) slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = ((index % total) + total) % total;
      if (slides[current]) slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      console.debug('goToSlide ->', current);
    }

    function next() { console.debug('next() called'); goToSlide(current + 1); }
    function prev() { console.debug('prev() called'); goToSlide(current - 1); }

    function startAuto() {
      stopAuto();
      timer = setInterval(next, autoInterval);
      console.debug('slideshow autoplay started');
    }
    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; console.debug('slideshow autoplay stopped'); }
    }
    function restartAuto() {
      stopAuto();
      startAuto();
    }

    // Arrow buttons
    if (nextBtn) nextBtn.addEventListener('click', function() { console.debug('nextBtn clicked'); next(); restartAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function() { console.debug('prevBtn clicked'); prev(); restartAuto(); });

    // Dot click
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        console.debug('dot clicked', this.getAttribute('data-slide'));
        var idx = parseInt(this.getAttribute('data-slide'), 10);
        if (!isNaN(idx) && idx !== current) {
          goToSlide(idx);
          restartAuto();
        }
      });
    });

    // Pause on hover
    var slideshow = document.querySelector('.hero-slideshow');
    if (slideshow) {
      slideshow.addEventListener('mouseenter', stopAuto);
      slideshow.addEventListener('mouseleave', startAuto);
    }

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    if (track) {
      track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) { next(); console.debug('swipe left -> next'); } else { prev(); console.debug('swipe right -> prev'); }
          restartAuto();
        }
      }, { passive: true });
    }

    // Keyboard navigation (Left / Right)
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight') { next(); restartAuto(); }
      if (e.key === 'ArrowLeft') { prev(); restartAuto(); }
    });

    // Start
    startAuto();

    // Pause on hover
    var slideshow = document.querySelector('.hero-slideshow');
    if (slideshow) {
      slideshow.addEventListener('mouseenter', stopAuto);
      slideshow.addEventListener('mouseleave', startAuto);
    }

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    if (track) {
      track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) next(); else prev();
          restartAuto();
        }
      }, { passive: true });
    }

    // Start
    startAuto();
  })();
})();
