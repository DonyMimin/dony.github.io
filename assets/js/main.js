/**
 * DONY - Backend Engineer & Software Developer Portfolio
 * Modern JavaScript Engine
 */
(function () {
  "use strict";

  /**
   * Helper selectors
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Header background on scroll
   */
  let selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 50) {
        selectHeader.classList.add('header-scrolled');
      } else {
        selectHeader.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('.nav-menu .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 120;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header');
    let offset = header ? header.offsetHeight : 80;
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    });
  };

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 200) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    let navMenu = select('.nav-menu');
    if (navMenu) {
      navMenu.classList.toggle('navbar-mobile');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    }
  });

  /**
   * Scroll with offset on links with class .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault();

      let navMenu = select('.nav-menu');
      if (navMenu && navMenu.classList.contains('navbar-mobile')) {
        navMenu.classList.remove('navbar-mobile');
        let toggle = select('.mobile-nav-toggle');
        if (toggle) {
          toggle.classList.add('bi-list');
          toggle.classList.remove('bi-x');
        }
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash in URL
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Hero typed.js effect
   */
  const typed = select('.typed');
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    if (typed_strings) {
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 70,
        backSpeed: 40,
        backDelay: 2200
      });
    }
  }

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach(function (el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function () {
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        });
      }, true);
    }
  });

  /**
   * Initiate portfolio lightbox if present
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.portfolio-lightbox'
    });
  }

  /**
   * Animation on scroll (AOS)
   */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  });

  /**
   * PureCounter init
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Quick Copy to Clipboard helper
   */
  window.copyToClipboard = function (text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
      let originalHtml = btnElement.innerHTML;
      btnElement.innerHTML = '<i class="bi bi-check-lg text-success"></i> Copied!';
      btnElement.classList.add('btn-copied');
      setTimeout(() => {
        btnElement.innerHTML = originalHtml;
        btnElement.classList.remove('btn-copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

})();