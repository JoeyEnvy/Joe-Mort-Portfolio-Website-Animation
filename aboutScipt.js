// Wait for DOM and all resources to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // DOM Elements
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav a');
    const loader = document.querySelector('.loader');
    const projectCards = document.querySelectorAll('.project-card');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const skillItems = document.querySelectorAll('.skill-item');

    // =========================================
    // Loading State Management
    // =========================================
    window.addEventListener('load', () => {
        if (loader) {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loader.style.display = 'none';
                    initializeAnimations();
                }
            });
        } else {
            initializeAnimations();
        }
    });

    // =========================================
    // Page Transition Function
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
    // Navigation Event Handlers
    // =========================================
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');

            // Trigger page transition
            changePage(targetId);
        });
    });

    // =========================================
    // Animation Initializations
    // =========================================
    function initializeAnimations() {
        // Timeline Items Animation
        if (timelineItems.length) {
            timelineItems.forEach((item, index) => {
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
        if (projectCards.length) {
            projectCards.forEach((card, index) => {
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

        // Skills Items Animation
        if (skillItems.length) {
            skillItems.forEach((item, index) => {
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

    // =========================================
    // Scroll To Top Functionality
    // =========================================
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // =========================================
    // Error Handling
    // =========================================
    window.addEventListener('error', (e) => {
        console.error('Animation Error:', e);
        // Fallback to basic transitions if GSAP fails
        sections.forEach(section => {
            section.style.transition = 'opacity 0.3s ease';
        });
    });
});