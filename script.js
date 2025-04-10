/**
 * WEBSITE CONTROLLER CLASS
 * Manages scroll interactions, including:
 * - Navigation state (compact/expanded)
 * - Scroll progress bar
 * - Spline scene full-width expansion
 */
class WebsiteController {
  constructor() {
    // Scroll behavior configuration
    this.scrollThreshold = 100;  // Pixels to scroll before triggering changes
    this.lastScrollPosition = 0; // Tracks previous scroll position
    this.scrollingDown = false;  // Scroll direction flag
    this.scrollTicking = false;  // Throttles scroll events

    // Initialize DOM references and events
    this.initializeElements();
    this.setupEventListeners();
    this.checkInitialScroll();
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    this.elements = {
      nav: document.querySelector('nav'),              // Navigation bar
      navProgressBar: document.querySelector('.nav-progress'), // Scroll progress bar
      main: document.querySelector('main'),            // Main content wrapper
      heroSection: document.querySelector('.jj-hero-section'), // Hero section
      splineViewer: document.querySelector('spline-viewer')    // Spline 3D scene
    };
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Use passive scrolling for performance
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  }

  /**
   * Check initial scroll position on page load
   */
  checkInitialScroll() {
    if (window.pageYOffset > this.scrollThreshold) {
      this.toggleNavState(true);
      this.updateSplineWidth(window.pageYOffset); // Initialize Spline width
    }
  }

  /**
   * Throttled scroll event handler
   */
  handleScroll() {
    if (!this.scrollTicking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        
        // Determine scroll direction
        this.scrollingDown = currentScroll > this.lastScrollPosition;
        
        // Update all scroll-dependent elements
        this.updateScrollProgress(currentScroll);
        this.updateNavState(currentScroll);
        this.updateSplineWidth(currentScroll); // Handle Spline expansion
        
        this.lastScrollPosition = currentScroll;
        this.scrollTicking = false;
      });
      this.scrollTicking = true;
    }
  }

  /**
   * Updates the scroll progress bar
   * @param {number} currentScroll - Current scroll position (px)
   */
  updateScrollProgress(currentScroll) {
    if (!this.elements.navProgressBar) return;
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(100, (currentScroll / totalHeight) * 100);
    
    // Show/hide progress bar based on scroll position
    if (currentScroll > this.scrollThreshold) {
      this.elements.navProgressBar.style.width = `${scrollProgress}%`;
      this.elements.navProgressBar.style.opacity = '1';
    } else {
      this.elements.navProgressBar.style.width = '0%';
      this.elements.navProgressBar.style.opacity = '0';
    }
  }

  /**
   * Manages navbar state (compact/expanded)
   * @param {number} currentScroll - Current scroll position (px)
   */
  updateNavState(currentScroll) {
    const pastThreshold = currentScroll > this.scrollThreshold;
    
    // Reset to default state at page top
    if (currentScroll <= this.scrollThreshold) {
      this.toggleNavState(false);
      return;
    }

    // Compact nav when scrolling down
    if (this.scrollingDown && pastThreshold) {
      this.toggleNavState(true);
    }
    // Expanded nav when scrolling up
    else if (!this.scrollingDown) {
      this.toggleNavState(true);
    }
  }

  /**
   * Toggles CSS classes for scroll states
   * @param {boolean} shouldScroll - Whether scroll threshold is passed
   */
  toggleNavState(shouldScroll) {
    this.elements.nav?.classList.toggle('scrolled', shouldScroll);
    this.elements.main?.classList.toggle('scrolled', shouldScroll);
    this.elements.heroSection?.classList.toggle('jj-nav-scrolled', shouldScroll);
  }

  /**
   * NEW: Handles Spline scene width expansion
   * @param {number} currentScroll - Current scroll position (px)
   */
  updateSplineWidth(currentScroll) {
    if (!this.elements.splineViewer) return;
    
    // Expand to full viewport width after threshold
    if (currentScroll > this.scrollThreshold) {
      this.elements.splineViewer.style.width = '100vw';
      this.elements.splineViewer.style.left = '0';
      this.elements.splineViewer.style.right = 'auto';
    } 
    // Reset to default position
    else {
      this.elements.splineViewer.style.width = '';
      this.elements.splineViewer.style.left = '';
      this.elements.splineViewer.style.right = '0';
    }
  }
}

// Initialize controller when DOM is fully loaded
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
  // Configuration
  const animationDuration = 600;
  const section = document.getElementById('joe-mort-about');
  
  // Get colors
  const greyColor = getComputedStyle(document.documentElement)
                   .getPropertyValue('--nav-bg').trim();
  const whiteColor = '#ffffff';

  // Set initial state
  section.style.backgroundColor = greyColor;
  section.style.transition = `background-color ${animationDuration}ms ease-out`;
  section.style.willChange = 'background-color';

  // Track state
  let lastScrollPosition = window.scrollY;
  let isInSection = false;

  // Smart scroll handler
  function handleScroll() {
    const currentScroll = window.scrollY;
    const scrollDirection = Math.sign(currentScroll - lastScrollPosition);
    lastScrollPosition = currentScroll;
    
    const sectionRect = section.getBoundingClientRect();
    const sectionMiddle = sectionRect.top + (sectionRect.height / 2);
    const viewportMiddle = window.innerHeight / 2;
    
    // Check if section is in view
    const isSectionVisible = sectionRect.top < window.innerHeight && 
                            sectionRect.bottom > 0;
    
    // When entering section (from any direction)
    if (isSectionVisible && !isInSection) {
      isInSection = true;
      animateToWhite();
    } 
    // When completely leaving section (from any direction)
    else if (!isSectionVisible && isInSection) {
      isInSection = false;
      animateToGrey();
    }
    // When scrolling up through section bottom
    else if (isInSection && scrollDirection < 0 && 
             sectionRect.bottom < viewportMiddle) {
      animateToWhite(); // Re-white when scrolling up into section
    }
  }

  // Smooth transition to white
  function animateToWhite() {
    let start = null;
    const duration = animationDuration;
    const currentColor = getComputedStyle(section).backgroundColor;
    
    // Only animate if not already white
    if (currentColor === 'rgb(255, 255, 255)') return;
    
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      section.style.backgroundColor = interpolateColor(currentColor, whiteColor, easedProgress);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    
    window.requestAnimationFrame(step);
  }

  // Smooth transition to grey
  function animateToGrey() {
    let start = null;
    const duration = animationDuration;
    const currentColor = getComputedStyle(section).backgroundColor;
    
    // Only animate if not already grey
    if (currentColor === greyColor) return;
    
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easedProgress = Math.pow(progress, 3);
      section.style.backgroundColor = interpolateColor(currentColor, greyColor, easedProgress);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    
    window.requestAnimationFrame(step);
  }

  // Optimized scroll listener with debounce
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

  // Initialize element animations (unchanged)
  const elementsToAnimate = [
    // Your elements array
  ].filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateX(0)';
        entry.target.style.opacity = '1';
      } else {
        entry.target.style.transform = 'translateX(50vw)';
        entry.target.style.opacity = '0';
      }
    });
  }, { threshold: 0.1 });

  elementsToAnimate.forEach(el => {
    el.style.transform = 'translateX(50vw)';
    el.style.opacity = '0';
    el.style.transition = `
      transform ${animationDuration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28),
      opacity ${animationDuration}ms ease-out
    `;
    observer.observe(el);
  });

  // Color interpolation helper (unchanged)
  function interpolateColor(color1, color2, factor) {
    if (color1.startsWith('var(')) {
      color1 = getComputedStyle(document.documentElement)
              .getPropertyValue(color1.slice(4, -1)).trim();
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
    
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    
    return `rgb(${
      Math.round(r1 + factor * (r2 - r1))
    }, ${
      Math.round(g1 + factor * (r2 - r1))
    }, ${
      Math.round(b1 + factor * (r2 - r1))
    })`;
  }
});
