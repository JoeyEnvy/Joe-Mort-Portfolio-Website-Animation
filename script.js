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
document.addEventListener('DOMContentLoaded', () => {
  // Collect all snap sections
  const SECTIONS = [
    document.getElementById('jj-hero'),
    document.getElementById('about'),
    document.getElementById('joe-mort-about'),
    document.getElementById('services'),
    document.querySelector('.portfolio-showcase')
  ].filter(Boolean);

  // Use VisualViewport for mobile browsers if available
  function getSectionHeight() {
    return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  }

  let SECTION_HEIGHT = getSectionHeight();
  let currentIndex = 0;
  let isAnimating = false;

  function updateSectionHeight() {
    SECTION_HEIGHT = getSectionHeight();
  }
  window.addEventListener('resize', updateSectionHeight);
  window.addEventListener('orientationchange', updateSectionHeight);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateSectionHeight);
  }

  // Helper: Scroll to section by index
  function scrollToSection(index) {
    isAnimating = true;
    currentIndex = Math.max(0, Math.min(index, SECTIONS.length - 1));
    window.scrollTo({ top: currentIndex * SECTION_HEIGHT, behavior: 'smooth' });
    setTimeout(() => { isAnimating = false; }, 450); // Slightly increased for mobile inertia
  }

  // Handle scroll direction
  function handleScroll(direction) {
    if (isAnimating) return;
    let newIndex = Math.max(0, Math.min(currentIndex + direction, SECTIONS.length - 1));
    if (newIndex !== currentIndex) {
      scrollToSection(newIndex);
    }
  }

  // Desktop: Wheel event
  let lastWheelTime = 0;
  window.addEventListener('wheel', (e) => {
    if (window.scrollY < SECTION_HEIGHT * SECTIONS.length) {
      e.preventDefault();

      // Prevent rapid-fire wheel events
      const now = Date.now();
      if (now - lastWheelTime < 350) return;
      lastWheelTime = now;

      handleScroll(Math.sign(e.deltaY));
    }
  }, { passive: false });

  // Mobile: Touch event support with velocity detection
  let touchStartY = null;
  let touchStartTime = null;
  let touchEndY = null;

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }
  });

  window.addEventListener('touchend', (e) => {
    if (touchStartY === null) return;
    touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    const time = Date.now() - touchStartTime;

    // Calculate velocity (pixels per ms)
    const velocity = Math.abs(deltaY) / (time || 1);

    // Only trigger snap on a meaningful swipe (distance or fast flick)
    const minDistance = SECTION_HEIGHT * 0.18; // 18% of screen height
    const minVelocity = 0.5; // px/ms, tweak as needed

    if (
      (Math.abs(deltaY) > minDistance || velocity > minVelocity) &&
      window.scrollY < SECTION_HEIGHT * SECTIONS.length
    ) {
      handleScroll(Math.sign(deltaY));
    } else {
      // Snap to nearest section if not a strong flick
      const nearestIndex = Math.round(window.scrollY / SECTION_HEIGHT);
      scrollToSection(nearestIndex);
    }

    touchStartY = null;
    touchEndY = null;
    touchStartTime = null;
  });

  // Optional: Update currentIndex on manual scroll (e.g., user jumps via anchor)
  window.addEventListener('scroll', () => {
    if (!isAnimating && window.scrollY < SECTION_HEIGHT * SECTIONS.length) {
      // Find nearest section index
      let idx = Math.round(window.scrollY / SECTION_HEIGHT);
      if (idx !== currentIndex) currentIndex = idx;
    }
  }, { passive: true });
});


// ========== SCROLL-IN ELEMENTS (jj-animate-in) ==========
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.jj-animate-in');
  const preferredDuration = '1.8s';
  const firstScrollDuration = '5s';
  const easingCurve = 'cubic-bezier(0.12, 0.7, 0.24, 1)';

  let isFirstScroll = true;
  let lastScrollY = window.scrollY;

  animatedElements.forEach(el => {
    el.style.willChange = 'transform';
    el.style.transition = `transform ${firstScrollDuration} ${easingCurve}`;
  });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY + 10;

    animatedElements.forEach(el => {
      if (isScrollingDown) {
        el.style.transform = 'translateX(150vw)';
        if (isFirstScroll) {
          setTimeout(() => {
            el.style.transition = `transform ${preferredDuration} ${easingCurve}`;
          }, 2500);
        }
      } else {
        el.style.transform = 'translateX(0)';
      }
    });

    if (isScrollingDown) isFirstScroll = false;
    lastScrollY = currentScrollY;
  });
});

// ========== BACKGROUND TRANSITION & ANIMATIONS FOR #joe-mort-about ==========
document.addEventListener('DOMContentLoaded', function() {
  const section = document.getElementById('joe-mort-about');
  if (!section) return;

  const greyColor = 'var(--nav-bg)';
  const whiteColor = 'rgba(255, 255, 255, 0.7)';
  const bgImageUrl = 'images/tech-background.jpg';

  const bgImage = document.createElement('div');
  Object.assign(bgImage.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${bgImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: '-1',
    opacity: '0',
    transition: 'opacity 800ms ease-out',
    willChange: 'opacity'
  });
  section.appendChild(bgImage);

  Object.assign(section.style, {
    position: 'relative',
    backgroundColor: greyColor,
    transition: 'background-color 300ms ease-out',
    willChange: 'background-color',
    overflow: 'hidden'
  });

  let lastScrollPosition = window.scrollY;
  let isInSection = false;
  let currentAnimation = null;
  const initialGreyValue = getComputedStyle(section).backgroundColor;

  function handleScroll() {
    const currentScroll = window.scrollY;
    const scrollDirection = Math.sign(currentScroll - lastScrollPosition);
    lastScrollPosition = currentScroll;

    const sectionRect = section.getBoundingClientRect();
    const viewportMiddle = window.innerHeight / 2;

    if ((sectionRect.top < viewportMiddle && !isInSection) || 
        (scrollDirection < 0 && sectionRect.top < viewportMiddle && sectionRect.bottom > viewportMiddle)) {
      isInSection = true;
      animateToWhite();
    } else if ((sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) && isInSection) {
      isInSection = false;
      animateToGrey();
    }
  }

  function animateToWhite() {
    if (currentAnimation) cancelAnimationFrame(currentAnimation);
    section.style.backgroundColor = whiteColor;
    bgImage.style.opacity = '1';
  }

  function animateToGrey() {
    if (currentAnimation) cancelAnimationFrame(currentAnimation);
    section.style.backgroundColor = initialGreyValue;
    bgImage.style.opacity = '0';
  }

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(handleScroll);
  });

  // Intersection observer to animate child elements in/out
  const elementsToAnimate = [
    ...section.querySelectorAll('.airwaves-jm-tech-badges h4, .airwaves-jm-tech-badges .badge, .airwaves-jm-section-heading, .airwaves-jm-lead, .airwaves-jm-skill-category h4, .airwaves-jm-skill-category li')
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'transform 900ms cubic-bezier(0.23, 1, 0.32, 1), opacity 900ms ease-out';
        entry.target.style.transform = 'translateX(0)';
        entry.target.style.opacity = '1';
      } else {
        entry.target.style.transition = 'transform 700ms cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 700ms ease-in';
        entry.target.style.transform = 'translateX(50vw)';
        entry.target.style.opacity = '0';
      }
    });
  }, { threshold: 0.1 });

  elementsToAnimate.forEach(el => {
    Object.assign(el.style, {
      transform: 'translateX(50vw)',
      opacity: '0',
      willChange: 'transform, opacity'
    });
    observer.observe(el);
  });
});



















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

  desktopVideo.addEventListener('click', () => fullscreen(desktopVideo));
  mobileVideo.addEventListener('click', () => fullscreen(mobileVideo));
});

