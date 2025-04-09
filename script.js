class WebsiteController {
    constructor() {
        this.scrollThreshold = 100; // Pixels before navbar changes
        this.lastScrollPosition = 0;
        this.scrollingDown = false;
        this.scrollTicking = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.checkInitialScroll();
    }

    initializeElements() {
        this.elements = {
            nav: document.querySelector('nav'),
            navProgressBar: document.querySelector('.nav-progress'),
            main: document.querySelector('main'),
            heroSection: document.querySelector('.jj-hero-section')
        };
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    checkInitialScroll() {
        // Set correct state on page load
        if (window.pageYOffset > this.scrollThreshold) {
            this.toggleNavState(true);
        }
    }

    handleScroll() {
        if (!this.scrollTicking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                this.scrollingDown = currentScroll > this.lastScrollPosition;
                
                this.updateScrollProgress(currentScroll);
                this.updateNavState(currentScroll);
                
                this.lastScrollPosition = currentScroll;
                this.scrollTicking = false;
            });
            this.scrollTicking = true;
        }
    }

    updateScrollProgress(currentScroll) {
        if (!this.elements.navProgressBar) return;
        
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(100, (currentScroll / totalHeight) * 100);
        
        // Only show progress bar when scrolled past threshold
        if (currentScroll > this.scrollThreshold) {
            this.elements.navProgressBar.style.width = `${scrollProgress}%`;
            this.elements.navProgressBar.style.opacity = '1';
        } else {
            this.elements.navProgressBar.style.width = '0%';
            this.elements.navProgressBar.style.opacity = '0';
        }
    }

    updateNavState(currentScroll) {
        const pastThreshold = currentScroll > this.scrollThreshold;
        
        // Always show navbar when scrolling up
        if (!this.scrollingDown) {
            this.toggleNavState(true);
        } 
        // Only hide when scrolling down past threshold
        else if (pastThreshold) {
            this.toggleNavState(true);
        } 
        // Show full navbar at top of page
        else {
            this.toggleNavState(false);
        }
    }

    toggleNavState(shouldScroll) {
        this.elements.nav?.classList.toggle('scrolled', shouldScroll);
        this.elements.main?.classList.toggle('scrolled', shouldScroll);
        this.elements.heroSection?.classList.toggle('jj-nav-scrolled', shouldScroll);
    }
}

// Initialize when DOM is loaded
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

