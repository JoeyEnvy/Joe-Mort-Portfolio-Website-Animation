/*
  MASTER JS FILE - COMBINED & CLEANED
  - WebsiteController
  - Scroll Snap
  - Section Scroll-In/Out
  - Portfolio Hover
  - FAQ Toggle
  - Form Validation
  - AI Video Preview & Trailer Logic
*/

// ========== WEBSITE CONTROLLER ==========
class WebsiteController {
  constructor() {
    this.config = {
      scrollThreshold: 100,
      resizeDebounce: 100,
      mobileBreakpoint: 1024
    };

    this.state = {
      lastScrollPosition: 0,
      scrollingDown: false,
      scrollTicking: false,
      isMobileMenuOpen: false,
      isScrolled: false
    };

    this.init();
  }

  init() {
    this.cacheElements();
    this.setupListeners();
    this.checkInitialState();
  }

  cacheElements() {
    this.elements = {
      nav: document.querySelector('nav'),
      navProgressBar: document.querySelector('.nav-progress'),
      main: document.querySelector('main'),
      heroSection: document.querySelector('.jj-hero-section'),
      splineViewer: document.querySelector('spline-viewer'),
      hamburger: document.querySelector('.hamburger'),
      navLinks: document.querySelectorAll('nav a, .mobile-menu a'),
      navList: document.querySelector('nav ul.nav-links'),
      html: document.documentElement,
      body: document.body,
      mobileMenu: document.getElementById('mobileMenu')
    };
  }

  setupListeners() {
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.handleResize(), this.config.resizeDebounce);
    });
    this.setupMobileNavigation();
  }

  checkInitialState() {
    const yOffset = window.pageYOffset;
    const shouldScroll = yOffset > this.config.scrollThreshold;
    this.toggleNavState(shouldScroll);
    this.updateSplineWidth(yOffset);
  }

  handleScroll() {
    if (!this.state.scrollTicking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        this.state.scrollingDown = currentScroll > this.state.lastScrollPosition;
        this.updateScrollProgress(currentScroll);
        this.updateNavState(currentScroll);
        this.updateSplineWidth(currentScroll);
        this.state.lastScrollPosition = currentScroll;
        this.state.scrollTicking = false;
      });
      this.state.scrollTicking = true;
    }
  }

  handleResize() {
    if (!this.isMobileView() && this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    this.checkInitialState();
  }

  updateScrollProgress(currentScroll) {
    if (!this.elements.navProgressBar) return;
    const totalHeight = this.elements.html.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(100, (currentScroll / totalHeight) * 100);
    const isVisible = currentScroll > this.config.scrollThreshold;
    this.elements.navProgressBar.style.width = `${scrollProgress}%`;
    this.elements.navProgressBar.style.opacity = isVisible ? '1' : '0';
  }

  updateNavState(currentScroll) {
    const pastThreshold = currentScroll > this.config.scrollThreshold;
    if (currentScroll <= this.config.scrollThreshold) {
      this.toggleNavState(false);
      return;
    }
    if (pastThreshold !== this.state.isScrolled) {
      this.toggleNavState(pastThreshold);
    }
    if (this.state.scrollingDown && pastThreshold && this.state.isMobileMenuOpen && this.isMobileView()) {
      this.closeMobileMenu();
    }
  }

  toggleNavState(shouldScroll) {
    this.state.isScrolled = shouldScroll;
    this.elements.nav?.classList.toggle('scrolled', shouldScroll);
    this.elements.main?.classList.toggle('scrolled', shouldScroll);
    this.elements.heroSection?.classList.toggle('jj-nav-scrolled', shouldScroll);
  }

  updateSplineWidth(currentScroll) {
    if (!this.elements.splineViewer) return;
    const spline = this.elements.splineViewer;
    const isFullWidth = currentScroll > this.config.scrollThreshold;
    spline.style.width = isFullWidth ? '100vw' : '';
    spline.style.left = isFullWidth ? '0' : '';
    spline.style.right = isFullWidth ? 'auto' : '0';
  }

  isMobileView() {
    return window.innerWidth <= this.config.mobileBreakpoint;
  }

  setupMobileNavigation() {
    if (!this.elements.hamburger) return;
    this.elements.hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMobileMenu();
    });

    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMobileView() && this.state.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (
        this.isMobileView() &&
        this.state.isMobileMenuOpen &&
        !e.target.closest('.mobile-menu') &&
        !e.target.closest('.hamburger')
      ) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
    if (this.state.isMobileMenuOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  openMobileMenu() {
    this.elements.mobileMenu?.classList.add('active');
    this.elements.hamburger?.classList.add('active');
    this.elements.hamburger?.setAttribute('aria-expanded', 'true');
    this.elements.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.elements.mobileMenu?.classList.remove('active');
    this.elements.hamburger?.classList.remove('active');
    this.elements.hamburger?.setAttribute('aria-expanded', 'false');
    this.elements.body.style.overflow = '';
    this.state.isMobileMenuOpen = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WebsiteController();
});

// ========== AI VIDEO ROTATION ==========
document.addEventListener('DOMContentLoaded', function () {
  const mainVideo = document.querySelector('.ai-main-video video');
  const thumbnails = document.querySelectorAll('.ai-thumb');
  const playPauseBtn = document.querySelector('.ai-play-pause');
  const audioBtn = document.querySelector('.ai-audio-control');
  const fullscreenBtn = document.querySelector('.ai-fullscreen');

  if (!mainVideo || thumbnails.length === 0) return;

  const videoSources = [
    'film production/shining/1.mp4',
    'film production/shining/2.mp4',
    'film production/shining/3.mp4',
    'film production/shining/4.mp4',
    'film production/shining/5.mp4'
  ];

  let currentVideoIndex = 0;
  let autoplayInterval;

  mainVideo.muted = true;
  thumbnails.forEach(thumb => {
    const video = thumb.querySelector('video');
    if (video) {
      video.muted = true;
      video.play().catch(e => console.log("Autoplay prevented (thumb):", e));
    }
  });

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      mainVideo.src = thumb.dataset.video;
      mainVideo.muted = true;
      mainVideo.play().catch(e => console.log("Autoplay prevented (main):", e));
      currentVideoIndex = index;
    });
  });

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
      mainVideo.src = videoSources[currentVideoIndex];
      mainVideo.muted = true;
      mainVideo.play().catch(e => console.log("Autoplay prevented (autoplay):", e));
    }, 10000);
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      const icon = playPauseBtn.querySelector('i');
      if (mainVideo.paused) {
        mainVideo.play().catch(e => console.log("Autoplay prevented (manual):", e));
        icon?.classList.replace('fa-play', 'fa-pause');
        startAutoplay();
      } else {
        mainVideo.pause();
        icon?.classList.replace('fa-pause', 'fa-play');
        clearInterval(autoplayInterval);
      }
    });
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const icon = audioBtn.querySelector('i');
      mainVideo.muted = !mainVideo.muted;
      icon?.classList.replace(
        mainVideo.muted ? 'fa-volume-up' : 'fa-volume-mute',
        mainVideo.muted ? 'fa-volume-mute' : 'fa-volume-up'
      );
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        mainVideo.requestFullscreen().catch(e => console.log("Fullscreen error:", e));
      } else {
        document.exitFullscreen();
      }
    });
  }

  startAutoplay();
});

// ========== PORTFOLIO HOVER & PREVIEW ==========
document.addEventListener('DOMContentLoaded', function () {
  const videos = document.querySelectorAll('.portfolio-item video');

  videos.forEach(video => {
    video.addEventListener('loadedmetadata', () => {
      if (!isNaN(video.duration) && video.duration > 0) {
        video.currentTime = Math.random() * video.duration;
      }
    });

    video.addEventListener('timeupdate', function () {
      if (!isNaN(video.duration) && video.currentTime >= video.duration - 0.5) {
        setTimeout(() => {
          video.currentTime = 0;
        }, 1000);
      }
    });
  });

  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4)';
    });
    item.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    });
  });
});

// ========== FAQ TOGGLE & CONTACT FORM VALIDATION ==========
document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const currentlyActive = document.querySelector('.faq-item.active');
      if (currentlyActive && currentlyActive !== question.parentElement) {
        currentlyActive.classList.remove('active');
        currentlyActive.querySelector('.faq-toggle').textContent = '+';
      }

      const faqItem = question.parentElement;
      faqItem.classList.toggle('active');
      const toggle = question.querySelector('.faq-toggle');
      toggle.textContent = faqItem.classList.contains('active') ? '−' : '+';
    });
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = this.querySelector('#name').value.trim();
      const email = this.querySelector('#email').value.trim();
      const message = this.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in all required fields');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
      }

      this.submit();
    });
  }
});

// ========== TRAILER VIDEO PLAYBACK ==========
document.addEventListener('DOMContentLoaded', function() {
  const videoPlaceholder = document.querySelector('.video-placeholder');
  const video = document.querySelector('.preview-video');
  const playButton = document.querySelector('.play-button');

  if (videoPlaceholder && video && playButton) {
    video.muted = true;
    video.style.display = 'none';

    playButton.addEventListener('click', function () {
      videoPlaceholder.style.display = 'none';
      video.style.display = 'block';
      video.muted = true;
      video.play().catch(err => {
        console.warn("Playback failed:", err);
      });
    });
  }
});


// ========== SMOOTH SNAP SCROLLING BETWEEN SECTIONS ==========
(function () {
  let snapReady = false;
  let currentIndex = 0;
  let isAnimating = false;

  function getSectionHeight() {
    return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  }

  let SECTION_HEIGHT = getSectionHeight();

  function updateSectionHeight() {
    SECTION_HEIGHT = getSectionHeight();
  }

  function getActiveSections() {
    const isMobile = window.innerWidth <= 480;
    return [
      document.getElementById('jj-hero'),
      document.getElementById('about'),
      document.getElementById('aboutfreelancerjoemortmark2'),
      !isMobile ? document.getElementById('listservices-joemort-services') : null,
      document.getElementById('joe-mort-apollo-showcase-section'),
      document.getElementById('web-design-recent-joe-mort-showcase-section')
    ].filter(el => el && getComputedStyle(el).display !== 'none');
  }

  let SECTIONS = getActiveSections();

  function getNearestSectionIndex(scrollY, direction = 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < SECTIONS.length; i++) {
      const sectionTop = SECTIONS[i].offsetTop;
      const dist = sectionTop - scrollY;

      const biasedDist = direction === 0
        ? Math.abs(dist)
        : direction > 0
          ? (dist >= 0 ? dist : Infinity)
          : (dist <= 0 ? Math.abs(dist) : Infinity);

      if (biasedDist < minDistance) {
        minDistance = biasedDist;
        nearestIndex = i;
      }
    }
    return nearestIndex;
  }

  function syncCurrentIndex(direction = 0) {
    currentIndex = getNearestSectionIndex(window.scrollY, direction);
  }

  function scrollToSection(index) {
    updateSectionHeight();
    isAnimating = true;

    currentIndex = Math.max(0, Math.min(index, SECTIONS.length - 1));
    const targetOffset = SECTIONS[currentIndex].offsetTop;

    window.scrollTo({ top: targetOffset, behavior: 'smooth' });

    setTimeout(() => {
      isAnimating = false;
    }, 360); // Slightly increased for stability
  }

  function handleScroll(direction) {
    if (!snapReady || isAnimating) return;

    const newIndex = Math.max(0, Math.min(currentIndex + direction, SECTIONS.length - 1));
    if (newIndex !== currentIndex) {
      scrollToSection(newIndex);
    }
  }

  function isInSnapScrollZone() {
    const lastSnapSection = SECTIONS[SECTIONS.length - 2];
    const lastSnapBottom = lastSnapSection.offsetTop + lastSnapSection.offsetHeight;
    return window.scrollY < lastSnapBottom - window.innerHeight * 0.3;
  }

  let lastWheelTime = 0;
  window.addEventListener('wheel', (e) => {
    if (!snapReady || !isInSnapScrollZone()) return;

    const now = Date.now();
    if (now - lastWheelTime < 200) return;
    lastWheelTime = now;

    const direction = Math.sign(e.deltaY);
    syncCurrentIndex(direction);

    const newIndex = Math.max(0, Math.min(currentIndex + direction, SECTIONS.length - 1));
    if (newIndex !== currentIndex) {
      e.preventDefault();
      handleScroll(direction);
    }
  }, { passive: false });

  let touchStartY = null;
  let touchStartTime = null;

  window.addEventListener('touchstart', (e) => {
    if (!snapReady || e.touches.length !== 1 || !isInSnapScrollZone()) return;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  });

  window.addEventListener('touchend', (e) => {
    if (!snapReady || touchStartY === null || !isInSnapScrollZone()) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    const time = Date.now() - touchStartTime;
    const velocity = Math.abs(deltaY) / (time || 1);
    const minDistance = SECTION_HEIGHT * 0.18;
    const minVelocity = 0.5;

    const direction = Math.sign(deltaY);
    syncCurrentIndex(direction);

    const newIndex = Math.max(0, Math.min(currentIndex + direction, SECTIONS.length - 1));

    if ((Math.abs(deltaY) > minDistance || velocity > minVelocity) && newIndex !== currentIndex) {
      e.preventDefault();
      handleScroll(direction);
    } else {
      scrollToSection(getNearestSectionIndex(window.scrollY));
    }

    touchStartY = null;
    touchStartTime = null;
  });

  window.addEventListener('scroll', () => {
    if (!snapReady || isAnimating) return;
    syncCurrentIndex(); // Neutral direction on normal scroll
  }, { passive: true });

  function handleViewportChange() {
    SECTIONS = getActiveSections();
    updateSectionHeight();
    syncCurrentIndex();
  }

  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', handleViewportChange);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportChange);
  }

  window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.remove('no-scroll');
    handleViewportChange();
    snapReady = true;
  });
})();






//section 2 freelancer background color change on mobile 480 



document.addEventListener('DOMContentLoaded', function() {
  const aboutSection = document.getElementById('about');
  const rightColumn = aboutSection.querySelector('.freelancer-info-right');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutSection.classList.add('background-transparent');
        rightColumn.style.opacity = '1';
        rightColumn.style.transform = 'translateY(0)';
      } else {
        aboutSection.classList.remove('background-transparent');
        rightColumn.style.opacity = '0';
        rightColumn.style.transform = 'translateY(50px)';
      }
    });
  }, { threshold: 0.4 });

  observer.observe(aboutSection);
});





// freelancer about 3rd section info part slide in and color change 





document.addEventListener('DOMContentLoaded', function() {
  const freelancerSection = document.getElementById('aboutfreelancerjoemortmark2');

  // Set starting background color as solid nav grey
  freelancerSection.style.backgroundColor = 'rgba(45, 52, 54, 1)';
  freelancerSection.style.transition = 'background-color 0.8s ease';

  // ========== BACKGROUND FADE OBSERVER ==========
  const bgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          freelancerSection.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        }, 100); // tiny delay for smooth transition
      } else {
        setTimeout(() => {
          freelancerSection.style.backgroundColor = 'rgba(45, 52, 54, 1)';
        }, 100);
      }
    });
  }, { threshold: 0.5 });

  bgObserver.observe(freelancerSection);

  // ========== CONTENT SLIDE-IN/OUT OBSERVER ==========

  // Select all .animate elements except the ones inside 🚀 or 🤖 cards
  const animatedElements = Array.from(freelancerSection.querySelectorAll('.animate'))
    .filter(el => {
      const heading = el.querySelector('h3');
      if (!heading) return true; // No heading, keep it animating
      const headingText = heading.textContent || '';
      return !(headingText.includes('🚀') || headingText.includes('🤖'));
    });

  animatedElements.forEach(el => {
    // Start off-screen to the right
    el.style.transform = 'translateX(50vw)';
    el.style.opacity = '0';
    el.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
    el.style.willChange = 'transform, opacity';
  });

  const contentObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateX(0)';
        entry.target.style.opacity = '1';
      } else {
        entry.target.style.transform = 'translateX(50vw)';
        entry.target.style.opacity = '0';
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    contentObserver.observe(el);
  });

});














//don't know what this below bit is but it's  mega important so leave it there




// ========== ANIMATE FREELANCER LEFT COLUMN ELEMENTS IN/OUT ==========
document.addEventListener('DOMContentLoaded', function () {
  const animationDuration = 600;
  const thresholds = [0, 0.1, 0.2, 0.5, 1];
  const rootMargin = '0px 0px -200px 0px';

  const section = document.getElementById('about');

  // ✅ Removed .device-showcase from animated elements to avoid layout/flicker issues
  const leftColumnElements = [
    section.querySelector('h1'), // updated to match h1 if used
    section.querySelector('.intro'),
    section.querySelector('.company'),
    section.querySelector('.cta-button'),
    section.querySelector('.showcase-title')
  ].filter(Boolean);

  function setupAnimations() {
    leftColumnElements.forEach((el, index) => {
      if (el._animationInitialized) return;

      el._animationInitialized = true;
      const delay = Math.min(index * 50, 300);

      el.style.transform = 'translateX(50vw)';
      el.style.opacity = '0';
      el.style.transition = `transform ${animationDuration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity ${animationDuration}ms ease-out`;
      el.style.transitionDelay = `${delay}ms`;
      el.style.willChange = 'transform, opacity';
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        entry.target.style.transform = 'translateX(50vw)';
        entry.target.style.opacity = '0';
      } else {
        entry.target.style.transform = 'translateX(0)';
        entry.target.style.opacity = '1';
      }
    });
  }, {
    threshold: thresholds,
    rootMargin: rootMargin
  });

  setupAnimations();

  leftColumnElements.forEach(el => {
    try {
      observer.observe(el);
    } catch (e) {
      console.warn('Failed to observe element:', el, e);
    }
  });

  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });













//freelancer 2nd about nd section shit 







  // ========== FREELANCER VIDEO FUNCTIONS ==========
  const desktopVideo = document.getElementById('desktop-video');
  const mobileVideo = document.getElementById('mobile-video');

  const desktopSource = desktopVideo.querySelector('source');
  const mobileSource = mobileVideo.querySelector('source');

  // ✅ Swapped playlists: desktop shows verticals, mobile shows horizontals
  const desktopPlaylist = ['1.mp4', '2.mp4', '3.mp4', '4.mp4'];
  const mobilePlaylist = ['A.mp4', 'B.mp4', 'C.mp4', 'D.mp4'];

  let desktopIndex = 0;
  let mobileIndex = 0;
  const interval = 7500;

  function updateVideo(videoEl, sourceEl, playlist, index) {
    const path = `videos/ShowcaseSlideShowVideos/${playlist[index]}`;
    sourceEl.src = path;
    videoEl.load();
    videoEl.play().catch(err => console.warn('Video play error:', err));
  }

  updateVideo(desktopVideo, desktopSource, desktopPlaylist, desktopIndex);
  updateVideo(mobileVideo, mobileSource, mobilePlaylist, mobileIndex);

  setInterval(() => {
    desktopIndex = (desktopIndex + 1) % desktopPlaylist.length;
    mobileIndex = (mobileIndex + 1) % mobilePlaylist.length;
    updateVideo(desktopVideo, desktopSource, desktopPlaylist, desktopIndex);
    updateVideo(mobileVideo, mobileSource, mobilePlaylist, mobileIndex);
  }, interval);

  // Fullscreen on click
  function fullscreen(videoEl) {
    if (videoEl.requestFullscreen) videoEl.requestFullscreen();
    else if (videoEl.webkitRequestFullscreen) videoEl.webkitRequestFullscreen();
    else if (videoEl.msRequestFullscreen) videoEl.msRequestFullscreen();
  }

});


//about freelancer 480 background man laptop image dissappear 

  document.addEventListener("DOMContentLoaded", () => {
    const aboutSection = document.querySelector("section#about");

    function fadeBackground(enable) {
      if (enable) {
        aboutSection.classList.add("background-fade");
      } else {
        aboutSection.classList.remove("background-fade");
      }
    }

    // Desktop hover
    aboutSection.addEventListener("mouseenter", () => fadeBackground(true));
    aboutSection.addEventListener("mouseleave", () => fadeBackground(false));

    // Mobile touch
    aboutSection.addEventListener("touchstart", () => fadeBackground(true));
    aboutSection.addEventListener("touchend", () => fadeBackground(false));
  });









//SERVICES GRID SECTION ANIMATE IN FROM THE RIGHT AND OUT


document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".skill-card");

  // Set initial inline styles
  cards.forEach(card => {
    card.style.opacity = "1";
    card.style.transform = "translateX(150px)";
    card.style.transition = "transform 1.2s ease, opacity 1.2s ease";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;

      if (entry.isIntersecting) {
        // Slide in from right
        card.style.transition = "transform 1.2s ease, opacity 1.2s ease";
        card.style.transform = "translateX(0)";
        card.style.opacity = "1";
      } else {
        // Slide out to left quickly
        card.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
        card.style.transform = "translateX(-150px)";
        card.style.opacity = "0.3";
      }
    });
  }, {
    threshold: 0.3
  });

  cards.forEach(card => observer.observe(card));
});












//web design index apollo videos


document.querySelectorAll('.joe-mort-apollo-video-block').forEach(block => {
  block.addEventListener('click', function() {
    const videoSrc = this.getAttribute('data-video');
    const modal = document.getElementById('apolloModal');
    const modalVideo = document.getElementById('apolloModalVideo');
    modalVideo.src = videoSrc;
    modal.classList.add('active');
    modalVideo.play();
  });
});

document.getElementById('apolloModalClose').addEventListener('click', function() {
  const modal = document.getElementById('apolloModal');
  const modalVideo = document.getElementById('apolloModalVideo');
  modal.classList.remove('active');
  modalVideo.pause();
  modalVideo.currentTime = 0;
  modalVideo.src = '';
});

document.getElementById('apolloModal').addEventListener('click', function(e) {
  if (e.target === this) {
    const modal = document.getElementById('apolloModal');
    const modalVideo = document.getElementById('apolloModalVideo');
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = '';
  }
});











// pistols and trademasters or whatever index web design full screen and video stuff

const modal = document.getElementById('mediaFullscreenModal');
const modalContent = document.getElementById('mediaFullscreenContent');
const closeBtn = document.getElementById('mediaFullscreenClose');

// Helper to open modal with video or image
function openMediaModal(type, src) {
  modalContent.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.style.maxWidth = '90vw';
  wrapper.style.maxHeight = '90vh';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';

  const element = document.createElement(type);
  element.src = src;
  element.setAttribute('loading', 'lazy');
  element.style.borderRadius = '12px';
  element.style.boxShadow = '0 0 25px rgba(0,0,0,0.5)';
  element.style.maxWidth = '100%';
  element.style.maxHeight = '100%';
  element.style.display = 'block';

  if (type === 'video') {
    element.autoplay = true;
    element.muted = true;
    element.loop = true;
    element.playsInline = true;
    element.controls = false;

    // Force correct aspect ratio based on known dimensions
    const isMobilePreview = src.includes('A.mp4') || src.includes('mobile'); // adjust logic if needed
    const aspectRatio = isMobilePreview ? (9 / 16) : (16 / 9);

    if (isMobilePreview) {
      wrapper.style.width = '360px';
      wrapper.style.height = `${360 / aspectRatio}px`;
    } else {
      wrapper.style.width = '90vw';
      wrapper.style.height = `calc(90vw * ${1 / aspectRatio})`;
    }
  }

  wrapper.appendChild(element);
  modalContent.appendChild(wrapper);
  modal.classList.add('active');

  // Style close button on the fly
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '20px';
  closeBtn.style.right = '-400px';
  closeBtn.style.fontSize = '2em';
  closeBtn.style.color = '#fff';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.zIndex = '10000';
}

// Close logic
function closeMediaModal() {
  modal.classList.remove('active');
  modalContent.innerHTML = '';
}

closeBtn.addEventListener('click', closeMediaModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeMediaModal();
});

// Apply to preview videos
document.querySelectorAll('.web-design-recent-joe-mort-preview-video').forEach(video => {
  video.play();

  video.parentElement.addEventListener('mouseenter', () => {
    video.style.transform = 'scale(1.05)';
    video.style.transition = 'transform 0.3s ease';
  });
  video.parentElement.addEventListener('mouseleave', () => {
    video.style.transform = 'scale(1)';
  });

  video.parentElement.addEventListener('click', () => {
    const videoSrc = video.querySelector('source')?.src || video.src;
    openMediaModal('video', videoSrc);
  });
});

// Apply to gallery images
document.querySelectorAll('.web-design-recent-joe-mort-gallery-image').forEach(img => {
  img.addEventListener('click', () => {
    openMediaModal('img', img.src);
  });
});







//about freelancer mobile and desktop videos full screen and hover 


// Desktop & Mobile preview videos from About section
['#desktop-video', '#mobile-video'].forEach(selector => {
  const video = document.querySelector(selector);
  if (!video) return;

  // Autoplay and hover scaling
  video.play();

  video.addEventListener('mouseenter', () => {
    video.style.transform = 'scale(1.05)';
    video.style.transition = 'transform 0.3s ease';
  });

  video.addEventListener('mouseleave', () => {
    video.style.transform = 'scale(1)';
  });

  video.addEventListener('click', () => {
    const videoSrc = video.querySelector('source')?.src || video.src;

    // Use known aspect ratio (mobile = 9:16, desktop = 16:9)
    const isMobile = selector.includes('mobile');
    const aspectRatio = isMobile ? (9 / 16) : (16 / 9);

    modalContent.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.maxWidth = '90vw';
    wrapper.style.maxHeight = '90vh';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';

    if (isMobile) {
      wrapper.style.width = '360px';
      wrapper.style.height = `${360 / aspectRatio}px`;
    } else {
      wrapper.style.width = '90vw';
      wrapper.style.height = `calc(90vw * ${1 / aspectRatio})`;
    }

    const clone = document.createElement('video');
    clone.src = videoSrc;
    clone.autoplay = true;
    clone.muted = true;
    clone.loop = true;
    clone.playsInline = true;
    clone.controls = false;
    clone.style.borderRadius = '12px';
    clone.style.boxShadow = '0 0 25px rgba(0,0,0,0.5)';
    clone.style.maxWidth = '100%';
    clone.style.maxHeight = '100%';
    clone.style.display = 'block';

    wrapper.appendChild(clone);
    modalContent.appendChild(wrapper);
    modal.classList.add('active');

    // Style the close button
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '-250px';
    closeBtn.style.fontSize = '2em';
    closeBtn.style.color = '#fff';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '10000';
  });
});

