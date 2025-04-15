/**
 * WEBSITE CONTROLLER CLASS - ENHANCED NAVIGATION SYSTEM
 * Version 2.0 - Complete Overhaul
 */
class WebsiteController {
  constructor() {
    // Configuration
    this.config = {
      scrollThreshold: 100,
      resizeDebounce: 100,
      mobileBreakpoint: 1024
    };
    
    // State management
    this.state = {
      lastScrollPosition: 0,
      scrollingDown: false,
      scrollTicking: false,
      isMobileMenuOpen: false,
      isScrolled: false
    };
    
    // Initialize
    this.init();
  }

  init() {
    // Cache DOM elements
    this.cacheElements();
    
    // Setup event listeners
    this.setupListeners();
    
    // Check initial state
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
      navLinks: document.querySelectorAll('nav a'),
      navList: document.querySelector('nav ul'),
      html: document.documentElement,
      body: document.body
    };
  }

  setupListeners() {
    // Passive scroll event
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    
    // Debounced resize event
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.handleResize(), this.config.resizeDebounce);
    });
    
    // Mobile navigation
    this.setupMobileNavigation();
  }

  setupMobileNavigation() {
    if (!this.elements.hamburger) return;
    
    // Hamburger toggle
    this.elements.hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMobileMenu();
    });
    
    // Close menu when clicking links
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMobileView() && this.state.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('nav') && this.state.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  checkInitialState() {
    // Initial scroll state
    if (window.pageYOffset > this.config.scrollThreshold) {
      this.toggleNavState(true);
      this.updateSplineWidth(window.pageYOffset);
    }
    
    // Initial mobile state
    if (this.isMobileView() && this.elements.nav.classList.contains('scrolled')) {
      this.elements.navList.style.display = 'none';
    }
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
    // Close menu when resizing to desktop
    if (!this.isMobileView() && this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Ensure proper state after resize
    this.checkInitialState();
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
    this.elements.nav.classList.add('mobile-open');
    this.elements.hamburger.classList.add('active');
    this.elements.hamburger.setAttribute('aria-expanded', 'true');
    this.elements.body.style.overflow = 'hidden';
    
    // Show nav list in scrolled state on mobile
    if (this.isMobileView() && this.elements.nav.classList.contains('scrolled')) {
      this.elements.navList.style.display = 'flex';
    }
  }

  closeMobileMenu() {
    this.elements.nav.classList.remove('mobile-open');
    this.elements.hamburger.classList.remove('active');
    this.elements.hamburger.setAttribute('aria-expanded', 'false');
    this.elements.body.style.overflow = '';
    
    // Hide nav list in scrolled state on mobile
    if (this.isMobileView() && this.elements.nav.classList.contains('scrolled')) {
      this.elements.navList.style.display = 'none';
    }
    
    this.state.isMobileMenuOpen = false;
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

    // Only update state if it's changing
    if (pastThreshold !== this.state.isScrolled) {
      this.toggleNavState(pastThreshold);
    }
    
    // Close mobile menu when scrolling down
    if (this.state.scrollingDown && pastThreshold && this.state.isMobileMenuOpen && this.isMobileView()) {
      this.closeMobileMenu();
    }
  }

  toggleNavState(shouldScroll) {
    this.state.isScrolled = shouldScroll;
    
    this.elements.nav?.classList.toggle('scrolled', shouldScroll);
    this.elements.main?.classList.toggle('scrolled', shouldScroll);
    this.elements.heroSection?.classList.toggle('jj-nav-scrolled', shouldScroll);
    
    // Manage mobile menu state
    if (shouldScroll && this.isMobileView()) {
      if (this.state.isMobileMenuOpen) {
        this.closeMobileMenu();
      } else {
        this.elements.navList.style.display = 'none';
      }
    }
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
}

// Initialize with DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  new WebsiteController();
});



// [SECTION 3] SHOWCASE ROTATING VIDEO AI SECTION ==========================

document.addEventListener('DOMContentLoaded', function() {
    const mainVideo = document.querySelector('.ai-main-video video');
    const thumbnails = document.querySelectorAll('.ai-thumb');
    const playPauseBtn = document.querySelector('.ai-play-pause');
    const audioBtn = document.querySelector('.ai-audio-control');
    const fullscreenBtn = document.querySelector('.ai-fullscreen');
    
    const videoSources = [
        'film production/shining/1.mp4',
        'film production/shining/2.mp4',
        'film production/shining/3.mp4',
        'film production/shining/4.mp4',
        'film production/shining/5.mp4'
    ];
    
    let currentVideoIndex = 0;
    let autoplayInterval;

    thumbnails.forEach(thumb => {
        const video = thumb.querySelector('video');
        video.play().catch(e => console.log("Autoplay prevented:", e));
    });

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            mainVideo.src = thumb.dataset.video;
            mainVideo.play();
            currentVideoIndex = index;
        });
    });

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
            mainVideo.src = videoSources[currentVideoIndex];
            mainVideo.play();
        }, 10000);
    }

    playPauseBtn.addEventListener('click', () => {
        const icon = playPauseBtn.querySelector('i');
        if (mainVideo.paused) {
            mainVideo.play();
            icon.classList.replace('fa-play', 'fa-pause');
            startAutoplay();
        } else {
            mainVideo.pause();
            icon.classList.replace('fa-pause', 'fa-play');
            clearInterval(autoplayInterval);
        }
    });

    audioBtn.addEventListener('click', () => {
        const icon = audioBtn.querySelector('i');
        mainVideo.muted = !mainVideo.muted;
        icon.classList.replace(
            mainVideo.muted ? 'fa-volume-up' : 'fa-volume-mute',
            mainVideo.muted ? 'fa-volume-mute' : 'fa-volume-up'
        );
    });

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            mainVideo.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    startAutoplay();
});

// [SECTION 4] PORTFOLIO ITEMS & ANIMATIONS ================================

document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('.portfolio-item video');
    videos.forEach(video => {
        video.currentTime = Math.random() * video.duration;
        video.addEventListener('timeupdate', function() {
            if(video.currentTime >= video.duration - 0.5) {
                setTimeout(() => { video.currentTime = 0 }, 1000);
            }
        });
    });

    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-category, .expertise-block').forEach((el) => {
        observer.observe(el);
    });
});

// [SECTION 5] FAQ & FORM FUNCTIONALITY ====================================

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
});

// [SECTION 6] VIDEO TRAILER CONTROLS ======================================

document.addEventListener('DOMContentLoaded', function() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const video = document.querySelector('.preview-video');
    const playButton = document.querySelector('.play-button');

    if(videoPlaceholder && video && playButton) {
        playButton.addEventListener('click', function() {
            videoPlaceholder.style.display = 'none';
            video.style.display = 'block';
            video.play();
        });
    }
});

// [SECTION 7] FIXED NAVIGATION CONTROLS ===================================

document.addEventListener('DOMContentLoaded', function() {
    const fixedNav = {
        anchorMenu: document.querySelector('.anchor-menu'),
        backToTop: document.querySelector('.back-to-top'),
        contactButtons: document.querySelector('.fixed-buttons'),

        init: function() {
            if (!this.anchorMenu || !this.backToTop) return;
            this.initScrollHandling();
            this.initClickHandling();
            this.checkMobileDisplay();
        },

        isMobile: function() {
            return window.innerWidth <= 768;
        },

        initScrollHandling: function() {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (!scrollTimeout) {
                    scrollTimeout = setTimeout(() => {
                        const scrollPosition = window.scrollY;
                        const viewportHeight = window.innerHeight * 0.75;

                        if (scrollPosition > viewportHeight && !this.isMobile()) {
                            this.anchorMenu.classList.add('visible');
                            this.backToTop.classList.add('visible');
                        } else {
                            this.anchorMenu.classList.remove('visible');
                            this.backToTop.classList.remove('visible');
                        }

                        scrollTimeout = null;
                    }, 100);
                }
            }, { passive: true });
        },

        initClickHandling: function() {
            this.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            this.anchorMenu.querySelectorAll('a').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href')?.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const targetPosition = targetElement.offsetTop - 50;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                });
            });

            document.querySelector('.whatsapp-btn')?.addEventListener('click', () => {
                console.log('WhatsApp clicked');
            });

            document.querySelector('.email-btn')?.addEventListener('click', () => {
                console.log('Email clicked');
            });

            document.querySelector('.phone-btn')?.addEventListener('click', () => {
                console.log('Phone clicked');
            });
        },

        checkMobileDisplay: function() {
            if (this.isMobile()) {
                this.anchorMenu.classList.add('hidden');
                this.anchorMenu.style.display = 'none';
            } else {
                this.anchorMenu.classList.remove('hidden');
                this.anchorMenu.style.removeProperty('display');
            }
        }
    };

    fixedNav.init();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => fixedNav.checkMobileDisplay(), 250);
    });
});






//hero section index page redo like about 









//100vh scroll effect temp WORKS WITH NO HTML OR CSS very good first 400vh then normal 



document.addEventListener('DOMContentLoaded', () => {
  // 1. Configuration
  const SECTIONS = [
    document.getElementById('jj-hero'),
    document.getElementById('about'),
    document.getElementById('joe-mort-about'),
    document.getElementById('services'),
    document.querySelector('.portfolio-showcase') // New section
  ].filter(Boolean);

  const SECTION_HEIGHT = window.innerHeight;
  const SNAP_AREA_END = SECTION_HEIGHT * 4; // Adjusted to 4 sections
  let currentIndex = 0;
  let isAnimating = false;

  // 2. Smart Scroll Handler
  function handleScroll(deltaY) {
    if (isAnimating) return;

    const currentY = window.scrollY;
    const direction = Math.sign(deltaY);

    // If we're below snap area and scrolling down, do nothing
    if (currentY >= SNAP_AREA_END && direction > 0) return;

    // If we're above snap area and scrolling up, do nothing
    if (currentY <= 0 && direction < 0) return;

    // If in snap area, process snap logic
    if (currentY < SNAP_AREA_END) {
      const newIndex = Math.min(Math.max(currentIndex + direction, 0), SECTIONS.length - 1);

      if (newIndex !== currentIndex) {
        isAnimating = true;
        currentIndex = newIndex;

        window.scrollTo({
          top: currentIndex * SECTION_HEIGHT,
          behavior: 'smooth'
        });

        setTimeout(() => isAnimating = false, 300);
      }
    }
  }

  // 3. Event Listeners with Priority Handling
  function onWheel(e) {
    if (window.scrollY < SNAP_AREA_END) {
      e.preventDefault();
      handleScroll(e.deltaY);
    }
  }

  function onTouchStart(e) {
    if (window.scrollY < SNAP_AREA_END) {
      e.preventDefault();
    }
  }

  function onTouchMove(e) {
    if (window.scrollY < SNAP_AREA_END) {
      e.preventDefault();
      handleScroll(-e.touches[0].movementY);
    }
  }

  function onKeyDown(e) {
    const scrollKeys = [32, 33, 34, 38, 40]; // space, page up/down, arrows
    if (scrollKeys.includes(e.keyCode) && window.scrollY < SNAP_AREA_END) {
      e.preventDefault();
      handleScroll([34, 40].includes(e.keyCode) ? 1 : -1);
    }
  }

  // 4. Smart Event Registration
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('keydown', onKeyDown);

  // 5. Scroll Boundary Detection
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    // Snap to nearest section if in snap area but not aligned
    if (!isAnimating && currentY < SNAP_AREA_END) {
      const expectedY = currentIndex * SECTION_HEIGHT;
      if (Math.abs(currentY - expectedY) > 5) {
        window.scrollTo({
          top: expectedY,
          behavior: 'auto'
        });
      }
    }
  }, { passive: true });
});





//section elements fly off screen to right robot hero section ONLY JAVA SCRIPT REQURIED, just reference html 

//scrolls elements out and back in on scroll 





// Wait for the webpage to fully load before running this script
document.addEventListener('DOMContentLoaded', function() {
  // Select all elements on the page that have the class 'jj-animate-in'
  const animatedElements = document.querySelectorAll('.jj-animate-in');
  
  // Define how long the animation should take (in seconds)
  const preferredDuration = '1.8s'; // This is the speed you liked for scrolling back in
  
  // For the first scroll down, make it even slower and more dramatic
  const firstScrollDuration = '5s'; // This is the speed for the first scroll down
  
  // Define the easing curve (how the animation accelerates and decelerates)
  const easingCurve = 'cubic-bezier(0.12, 0.7, 0.24, 1)';
  
  // Flag to track if it's the first scroll down
  let isFirstScroll = true;
  
  // Store the current scroll position
  let lastScrollY = window.scrollY;

  // Loop through each element that needs animation
  animatedElements.forEach(el => {
    // Tell the browser to optimize this element for animation
    el.style.willChange = 'transform';
    
    // Set the initial animation speed to the slower first scroll speed
    el.style.transition = `transform ${firstScrollDuration} ${easingCurve}`;
  });

  // Listen for scroll events on the window
  window.addEventListener('scroll', function() {
    // Get the current scroll position
    const currentScrollY = window.scrollY;
    
    // Check if the user is scrolling down (not up)
    const isScrollingDown = currentScrollY > lastScrollY + 10; // Add a small threshold to prevent false triggers

    // Loop through each element again
    animatedElements.forEach(el => {
      // If the user is scrolling down
      if (isScrollingDown) {
        // Move the element off-screen to the right
        el.style.transform = 'translateX(150vw)';
        
        // If this is the first scroll down
        if (isFirstScroll) {
          // Wait for the first scroll animation to finish, then switch to the preferred speed
          setTimeout(() => {
            el.style.transition = `transform ${preferredDuration} ${easingCurve}`;
          }, 2500); // This delay matches the firstScrollDuration
        }
      } 
      // If the user is scrolling up
      else {
        // Move the element back to its original position
        el.style.transform = 'translateX(0)';
      }
    });

    // If the user scrolled down, mark it as not the first scroll anymore
    if (isScrollingDown) isFirstScroll = false;
    
    // Update the last scroll position
    lastScrollY = currentScrollY;
  });
});

//freelancer amnimate in and out to the right just java needed second section 





document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const animationDuration = 600;
  const thresholds = [0, 0.1, 0.2, 0.5, 1];
  const rootMargin = '0px 0px -200px 0px';
  
  // Get the about section
  const section = document.getElementById('about');
  
  // Only select left column elements
  const leftColumnElements = [
    section.querySelector('h2'),
    section.querySelector('.intro'),
    section.querySelector('.company'),
    section.querySelector('.cta-button'),
    section.querySelector('.showcase-title'),
    section.querySelector('.device-showcase')
  ].filter(Boolean);

  // Initialize elements with animation properties
  function setupAnimations() {
    leftColumnElements.forEach((el, index) => {
      if (el._animationInitialized) return;
      
      el._animationInitialized = true;
      const delay = Math.min(index * 50, 300);
      
      el.style.transform = 'translateX(50vw)';
      el.style.opacity = '0';
      el.style.transition = `
        transform ${animationDuration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28),
        opacity ${animationDuration}ms ease-out
      `;
      el.style.transitionDelay = `${delay}ms`;
      el.style.willChange = 'transform, opacity';
    });
  }

  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // Slide out to right when leaving viewport
        entry.target.style.transform = 'translateX(50vw)';
        entry.target.style.opacity = '0';
      } else {
        // Slide in from right when entering viewport
        entry.target.style.transform = 'translateX(0)';
        entry.target.style.opacity = '1';
      }
    });
  }, {
    threshold: thresholds,
    rootMargin: rootMargin
  });

  // Initialize and observe left column elements only
  setupAnimations();
  leftColumnElements.forEach(el => {
    try {
      observer.observe(el);
    } catch (e) {
      console.warn('Failed to observe element:', el, e);
    }
  });

  // Cleanup
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });
});









//about section extra joe mort snyposis freelancer second

//html elements animate in and out on scroll 100vh and change background grey to white







document.addEventListener('DOMContentLoaded', function() {
  // ========== CONFIGURATION ==========
  const scrollUpDuration = 300;     // Fast transition up (300ms)
  const scrollDownDuration = 800;   // Slower transition down (800ms)
  const elementAnimationDuration = 900;
  const elementExitDuration = 700;
  
  const section = document.getElementById('joe-mort-about');
  const greyColor = 'var(--nav-bg)';
  const whiteColor = 'rgba(255, 255, 255, 0.7)'; // 70% opacity white
  const bgImageUrl = 'images/tech-background.jpg';

  // ========== BACKGROUND IMAGE SETUP ==========
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
    transition: `opacity ${scrollDownDuration}ms ease-out`,
    willChange: 'opacity'
  });
  section.appendChild(bgImage);

  Object.assign(section.style, {
    position: 'relative',
    backgroundColor: greyColor,
    transition: `background-color ${scrollUpDuration}ms ease-out`,
    willChange: 'background-color',
    overflow: 'hidden'
  });

  // ========== STATE MANAGEMENT ==========
  let lastScrollPosition = window.scrollY;
  let isInSection = false;
  let currentAnimation = null;
  const initialGreyValue = getComputedStyle(section).backgroundColor;

  // ========== SCROLL HANDLING ==========
  function handleScroll() {
    const currentScroll = window.scrollY;
    const scrollDirection = Math.sign(currentScroll - lastScrollPosition);
    lastScrollPosition = currentScroll;
    
    const sectionRect = section.getBoundingClientRect();
    const viewportMiddle = window.innerHeight / 2;
    
    // Entering section (from top or scrolling up into it)
    if ((sectionRect.top < viewportMiddle && !isInSection) || 
        (scrollDirection < 0 && sectionRect.top < viewportMiddle && sectionRect.bottom > viewportMiddle)) {
      isInSection = true;
      animateToWhite(scrollDownDuration); // Slow transition to white
    }
    // Exiting section (up or down)
    else if ((sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) && isInSection) {
      isInSection = false;
      animateToGrey(scrollUpDuration); // Fast transition to grey
    }
  }

  // ========== ANIMATION FUNCTIONS ==========
  function animateToWhite(duration) {
    if (currentAnimation) cancelAnimationFrame(currentAnimation);
    
    const currentColor = getComputedStyle(section).backgroundColor;
    if (currentColor === whiteColor) return;
    
    section.style.transition = `background-color ${duration}ms ease-out`;
    bgImage.style.transition = `opacity ${duration}ms ease-out`;
    
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      section.style.backgroundColor = interpolateColor(currentColor, whiteColor, easedProgress);
      bgImage.style.opacity = String(easedProgress);
      
      if (progress < 1) {
        currentAnimation = window.requestAnimationFrame(step);
      } else {
        currentAnimation = null;
      }
    }
    
    let start = null;
    currentAnimation = window.requestAnimationFrame(step);
  }

  function animateToGrey(duration) {
    if (currentAnimation) cancelAnimationFrame(currentAnimation);
    
    const currentColor = getComputedStyle(section).backgroundColor;
    if (currentColor === initialGreyValue) return;
    
    section.style.transition = `background-color ${duration}ms ease-out`;
    bgImage.style.transition = `opacity ${duration}ms ease-out`;
    
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easedProgress = Math.pow(progress, 3);
      section.style.backgroundColor = interpolateColor(currentColor, initialGreyValue, easedProgress);
      bgImage.style.opacity = String(1 - easedProgress);
      
      if (progress < 1) {
        currentAnimation = window.requestAnimationFrame(step);
      } else {
        currentAnimation = null;
      }
    }
    
    let start = null;
    currentAnimation = window.requestAnimationFrame(step);
  }

  // ========== SCROLL LISTENER ==========
  let isTicking = false;
  window.addEventListener('scroll', function() {
    if (!isTicking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        isTicking = false;
      });
      isTicking = true;
    }
  });

  // ========== ELEMENT ANIMATIONS ==========
  const elementsToAnimate = [
    // Tech badges
    document.querySelector('.airwaves-jm-tech-badges h4'),
    ...document.querySelectorAll('.airwaves-jm-tech-badges .badge'),
    
    // Right column
    document.querySelector('.airwaves-jm-section-heading'),
    document.querySelector('.airwaves-jm-lead'),
    
    // Skills grid
    ...document.querySelectorAll('.airwaves-jm-skill-category:not(.airwaves-jm-philosophy)'),
    ...document.querySelectorAll('.airwaves-jm-skill-category:not(.airwaves-jm-philosophy) h4'),
    ...document.querySelectorAll('.airwaves-jm-skill-category:not(.airwaves-jm-philosophy) li')
  ].filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = `
          transform ${elementAnimationDuration}ms cubic-bezier(0.23, 1, 0.32, 1),
          opacity ${elementAnimationDuration}ms ease-out
        `;
        entry.target.style.transform = 'translateX(0)';
        entry.target.style.opacity = '1';
      } else {
        entry.target.style.transition = `
          transform ${elementExitDuration}ms cubic-bezier(0.55, 0.085, 0.68, 0.53),
          opacity ${elementExitDuration}ms ease-in
        `;
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

  // ========== COLOR UTILITIES ==========
  function interpolateColor(color1, color2, factor) {
    if (color1.startsWith('var(')) {
      color1 = getComputedStyle(document.documentElement)
              .getPropertyValue(color1.slice(4, -1)).trim();
    }
    
    if (color2.startsWith('rgba(')) {
      const rgbaMatch = color2.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (rgbaMatch) {
        return color2; // Return as-is for rgba
      }
    }
    
    const hexToRgb = hex => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : [0, 0, 0];
    };
    
    const [r1, g1, b1] = color1.startsWith('rgb') ? 
      color1.match(/\d+/g).map(Number) : hexToRgb(color1);
    const [r2, g2, b2] = color2.startsWith('rgb') ? 
      color2.match(/\d+/g).map(Number) : hexToRgb(color2);
    
    return `rgb(${
      Math.round(r1 + factor * (r2 - r1))
    }, ${
      Math.round(g1 + factor * (g2 - g1))
    }, ${
      Math.round(b1 + factor * (b2 - b1))
    })`;
  }
});


