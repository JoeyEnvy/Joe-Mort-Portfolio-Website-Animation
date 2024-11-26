// Wait for DOM and all resources to load
document.addEventListener('DOMContentLoaded', () => {
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
        // Light bulb elements
        lightBulb: document.querySelector('.light-bulb'),
        heroText: document.querySelector('.hero-text'),
        revealTexts: document.querySelectorAll('.reveal-text')
    };

    let isRevealed = false;

    // =========================================
    // Page Transition System
    // =========================================
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
                sections.forEach(section => {
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

    // =========================================
    // Navigation System
    // =========================================
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
    // =========================================
    // Light Bulb Hero Section
    // =========================================
    if (elements.lightBulb) {
        console.log('Light bulb element found:', elements.lightBulb);
        console.log('Reveal texts found:', elements.revealTexts.length);
        console.log('Hero text element found:', elements.heroText);

        elements.lightBulb.addEventListener('click', () => {
            console.log('Light bulb clicked');
            if (!isRevealed) {
                console.log('Starting reveal sequence');
                // Activate light bulb
                elements.lightBulb.classList.add('active');
                console.log('Light bulb activated');
                
                // Reveal text elements sequentially
                elements.revealTexts.forEach((text, index) => {
                    console.log('Setting up reveal for text:', index);
                    setTimeout(() => {
                        text.classList.add('active');
                        console.log('Text revealed:', index);
                    }, index * 200);
                });

                // Add glow effect to hero section
                elements.heroText.classList.add('active');
                console.log('Hero text activated');
                
                isRevealed = true;
                console.log('Reveal completed');

                // Optional: Add ambient light effect
                gsap.to('.hero-section', {
                    backgroundColor: 'rgba(45, 52, 54, 0.9)',
                    duration: 1,
                    ease: 'power2.out',
                    onComplete: () => console.log('Background animation completed')
                });
            }
        });

        // Optional: Add hover effect on light bulb
        elements.lightBulb.addEventListener('mouseenter', () => {
            console.log('Light bulb hover enter');
            if (!isRevealed) {
                gsap.to(elements.lightBulb, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => console.log('Hover enter animation completed')
                });
            }
        });

        elements.lightBulb.addEventListener('mouseleave', () => {
            console.log('Light bulb hover leave');
            if (!isRevealed) {
                gsap.to(elements.lightBulb, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => console.log('Hover leave animation completed')
                });
            }
        });
    } else {
        console.error('Light bulb element not found in DOM');
    }

    // =========================================
    // Animation Initializations
    // =========================================
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

    // =========================================
    // Scroll-Based UI Updates
    // =========================================
    let lastScroll = 0;
    const scrollThreshold = 500;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Back to Top Button Visibility
        if (currentScroll > scrollThreshold) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }

        // Navbar Hide/Show on Scroll
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            elements.nav.style.transform = 'translateY(-100%)';
        } else {
            elements.nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // =========================================
    // Interactive Elements
    // =========================================
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

    // =========================================
    // Performance Optimization
    // =========================================
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

    // Optimize scroll event
    const optimizedScroll = debounce(() => {
        // Scroll-based calculations
    }, 16);

    window.addEventListener('scroll', optimizedScroll);

    // =========================================
    // Intersection Observer for Lazy Loading
    // =========================================
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

    // =========================================
    // Error Handling
    // =========================================
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