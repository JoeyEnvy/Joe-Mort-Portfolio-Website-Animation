// Wait for DOM and all resources to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');

    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // DOM Elements
    const elements = {
        nav: document.querySelector('nav'),
        navLinks: document.querySelectorAll('nav a'),
        sections: document.querySelectorAll('.section'),
        expertiseCards: document.querySelectorAll('.expertise-card'),
        portfolioItems: document.querySelectorAll('.portfolio-item'),
        techLists: document.querySelectorAll('.tech-list li'),
        experienceItems: document.querySelectorAll('.experience-item'),
        benefitItems: document.querySelectorAll('.benefit-item'),
        backToTop: document.querySelector('.back-to-top'),
        contactBox: document.querySelector('.contact-box'),
        skillItems: document.querySelectorAll('.skill-item'),
        timelineItems: document.querySelectorAll('.timeline-item'),
        projectCards: document.querySelectorAll('.project-card'),
        lightBulb: document.querySelector('.light-bulb-container'),
        heroText: document.querySelector('.hero-text'),
        revealTexts: document.querySelectorAll('.reveal-text'),
        main: document.querySelector('main')
    };

    console.log('Initial checks:');
    console.log('Light bulb element:', elements.lightBulb);
    console.log('Hero text:', elements.heroText);
    console.log('Reveal texts:', elements.revealTexts);

    let isRevealed = false;

    // Page Transition System
    function changePage(targetId) {
        const currentSection = document.querySelector('.section.active');
        const targetSection = document.querySelector(targetId);

        if (currentSection === targetSection) return;

        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        document.body.appendChild(overlay);

        // Animation sequence
        gsap.timeline()
            .to(overlay, {
                scaleY: 1,
                duration: 0.5,
                ease: "power2.inOut"
            })
            .to(currentSection, {
                opacity: 0,
                duration: 0.3
            })
            .call(() => {
                elements.sections.forEach(section => {
                    section.classList.remove('previous', 'active');
                });
                targetSection.classList.add('active');
            })
            .to(targetSection, {
                opacity: 1,
                duration: 0.3
            })
            .to(overlay, {
                scaleY: 0,
                duration: 0.5,
                ease: "power2.inOut",
                transformOrigin: "top",
                onComplete: () => overlay.remove()
            });
    }

    // Navigation System
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            // Update active nav link
            elements.navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            // Trigger page transition
            changePage(targetId);
        });
    });

    // Light Bulb Hero Section
    if (elements.lightBulb) {
        console.log('Light bulb element found and initialized');
        elements.lightBulb.addEventListener('click', () => {
            console.log('Light bulb clicked');
            const bulbIcon = elements.lightBulb.querySelector('.light-bulb');
            if (!isRevealed) {
                // Activate and move left
                console.log('Starting reveal sequence');
                bulbIcon.classList.add('active');
                elements.lightBulb.classList.add('active');
                // Reveal text elements sequentially
                elements.revealTexts.forEach((text, index) => {
                    setTimeout(() => {
                        text.classList.add('active');
                    }, index * 200 + 400);
                });
                elements.heroText.classList.add('active');
                isRevealed = true;
                // Background effect
                gsap.to('.hero-section', {
                    backgroundColor: 'rgba(45, 52, 54, 0.9)',
                    duration: 1,
                    ease: 'power2.out'
                });
            } else {
                // Deactivate and move back
                console.log('Reversing animation');
                bulbIcon.classList.remove('active');
                elements.lightBulb.classList.remove('active');
                // Hide text elements
                elements.revealTexts.forEach(text => {
                    text.classList.remove('active');
                });
                elements.heroText.classList.remove('active');
                isRevealed = false;
                // Reverse background effect
                gsap.to('.hero-section', {
                    backgroundColor: 'rgba(45, 52, 54, 1)',
                    duration: 1,
                    ease: 'power2.out'
                });
            }
        });

        // Hover effects for light bulb
        elements.lightBulb.addEventListener('mouseenter', () => {
            console.log('Light bulb hover enter');
            if (!isRevealed) {
                const bulbIcon = elements.lightBulb.querySelector('.light-bulb');
                gsap.to(bulbIcon, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        elements.lightBulb.addEventListener('mouseleave', () => {
            console.log('Light bulb hover leave');
            if (!isRevealed) {
                const bulbIcon = elements.lightBulb.querySelector('.light-bulb');
                gsap.to(bulbIcon, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    } else {
        console.error('Light bulb element not found in DOM');
    }

    // Animation Initializations
    function initializeAnimations() {
        // Expertise Cards Animation
        elements.expertiseCards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Timeline Items Animation
        if (elements.timelineItems.length) {
            elements.timelineItems.forEach((item, index) => {
                gsap.fromTo(item,
                    { 
                        x: -50,
                        opacity: 0
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }

        // Project Cards Animation
        if (elements.projectCards.length) {
            elements.projectCards.forEach((card, index) => {
                gsap.fromTo(card,
                    {
                        y: 50,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: index * 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );

                // Add hover animation
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });
        }

        // Skills Animation
        if (elements.skillItems.length) {
            elements.skillItems.forEach((item, index) => {
                gsap.fromTo(item,
                    {
                        scale: 0,
                        opacity: 0
                    },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 85%"
                        }
                    }
                );
            });
        }
    }

    // Initialize animations
    initializeAnimations();

    // Performance Optimization
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Scroll effect for navbar and progress bar
    const progressBar = document.querySelector('.scroll-progress-bar');
const scrollThreshold = window.innerHeight * 0.1; // Changed from 0.3 to 0.2 (20vh instead of 30vh)

const handleScroll = () => {
    const scrollPosition = window.pageYOffset;
    const scrollPercentage = (scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  
    if (scrollPosition > scrollThreshold) {
        elements.nav.classList.add('nav-scrolled');
        elements.main.classList.add('nav-scrolled');
    } else {
        elements.nav.classList.remove('nav-scrolled');
        elements.main.classList.remove('nav-scrolled');
        // Force a reflow to ensure the nav height is recalculated
        elements.nav.offsetHeight;
    }
  
    progressBar.style.width = `${scrollPercentage}%`;

    // Back to Top Button Visibility
    if (scrollPosition > scrollThreshold) {
        elements.backToTop?.classList.add('visible');
    } else {
        elements.backToTop?.classList.remove('visible');
    }
};

    const optimizedScroll = debounce(handleScroll, 16);

    window.addEventListener('scroll', optimizedScroll);

    // Interactive Elements
    // Back to Top Functionality
    elements.backToTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Expertise Cards Hover Effect
    elements.expertiseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Intersection Observer for Lazy Loading
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.lazy-load').forEach(element => {
        observer.observe(element);
    });

    // For the hero divider 
    const splitContainer = document.getElementById('splitContainer');
    if (splitContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    splitContainer.classList.add('visible');
                    observer.unobserve(splitContainer);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(splitContainer);
    }

    // Error Handling
    window.addEventListener('error', (e) => {
        console.error('Animation Error:', e);
        // Fallback animations if GSAP fails
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    });
});