document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navProgress = document.querySelector('.nav-progress');
    const backToTopButton = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section');
    const gradients = [
    'linear-gradient(135deg, #1a1c1d 0%, #4a3b9f 50%, #6c5ce7 100%)', // Dark grey to dark purple to dark blue (unchanged)
    'linear-gradient(45deg, #2d3436 0%, #1e0f30 50%, #f0f0f0 100%)', // Dark grey to very dark purple to off-white
    'radial-gradient(circle at top left, #6c5ce7, #2d3436)', // Dark blue to dark grey radial
    'linear-gradient(to right, #2d3436, #00cec9, #6c5ce7)', // Dark grey to teal to dark blue
    'linear-gradient(to bottom right, #fd79a8, #6c5ce7, #2d3436)', // Pink to dark blue to dark grey
    'radial-gradient(circle at bottom right, #00cec9, #2d3436)', // Teal to dark grey radial
    'linear-gradient(45deg, #2d3436 0%, #6c5ce7 25%, #00cec9 50%, #fd79a8 75%, #ffffff 100%)', // Rainbow gradient
    'linear-gradient(to right, #2d3436 0%, #6c5ce7 100%)' // Dark grey to dark blue
    ];

    let currentSection = 0;
    let isScrolling = false;
    let isChangingGradient = false;

    function updateNavbar() {
        const scrollPosition = window.pageYOffset;
        if (scrollPosition > 0) {
            navbar.classList.add('scrolled');
            if (navProgress) navProgress.style.opacity = '1';
        } else {
            navbar.classList.remove('scrolled');
            if (navProgress) navProgress.style.opacity = '0';
        }
    }

    function updateProgressBar() {
        if (navProgress) {
            const scrollPosition = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
            navProgress.style.width = `${scrollPercentage}%`;
        }
    }

    function updateBackToTopButton() {
        if (currentSection >= 1) {
            backToTopButton.style.display = 'block';
            setTimeout(() => backToTopButton.style.opacity = '1', 50);
        } else {
            backToTopButton.style.opacity = '0';
            setTimeout(() => backToTopButton.style.display = 'none', 500);
        }
    }

    function changeBackgroundGradient(targetSection) {
        if (isChangingGradient) return;
        isChangingGradient = true;

        const body = document.body;
        const targetGradient = gradients[targetSection % gradients.length];

        // Start the transition immediately
        body.style.transition = 'background-image 3s ease'; // Increased duration for smoother effect
        body.style.backgroundImage = targetGradient;

        setTimeout(() => {
            body.style.transition = ''; // Remove the transition after it's complete
            isChangingGradient = false;
        }, 3000); // Match this with the transition duration
    }

    function setActiveSection() {
        sections.forEach((section, index) => {
            if (index === currentSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    function smoothScrollToSection(targetSection) {
        if (isScrolling || targetSection === currentSection) return;
        isScrolling = true;
        
        // Change background gradient immediately when scrolling starts
        changeBackgroundGradient(targetSection);
        
        sections[targetSection].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            isScrolling = false;
            if (currentSection !== targetSection) {
                currentSection = targetSection;
                setActiveSection();
            }
            updateNavbar();
            updateProgressBar();
            updateBackToTopButton();
        }, 1000);
    }

    function handleScroll() {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const newSection = Math.floor(scrollPosition / windowHeight);
        if (newSection !== currentSection) {
            changeBackgroundGradient(newSection);
            currentSection = newSection;
            setActiveSection();
        }
        updateNavbar();
        updateProgressBar();
        updateBackToTopButton();
    }

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(handleScroll);
        }
    });

    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;

        let targetSection = currentSection;
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            targetSection++;
        } else if (e.deltaY < 0 && currentSection > 0) {
            targetSection--;
        }

        if (targetSection !== currentSection) {
            smoothScrollToSection(targetSection);
        }
    }, { passive: false });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollToSection(0);
    });

    // Initialize
    handleScroll();
    changeBackgroundGradient(0);
    setActiveSection();
});


//hero section 

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero');
    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');
    const darkGreyBar = document.querySelector('.dark-grey-bar');
    let lastScrollTop = 0;
    let scrollThreshold = 50;

    // Initial load animations
    setTimeout(() => {
        heroRight.classList.add('loaded');
        heroLeft.classList.add('loaded');
    }, 100);

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            heroSection.classList.remove('animate-in');
            heroSection.classList.add('animate-out');
        } else if (scrollTop <= scrollThreshold) {
            heroSection.classList.remove('animate-out');
            heroSection.classList.add('animate-in');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
});


//about section joe mort 

document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add('active');
                section.classList.remove('exit');
            } else {
                section.classList.remove('active');
                section.classList.add('exit');
            }
        });
    }, { threshold: 0.5 });

    observer.observe(section);
});

document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('#about.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add('active');
                section.classList.remove('exit');
            } else {
                section.classList.remove('active');
                section.classList.add('exit');
            }
        });
    }, { threshold: 0.5 });

    observer.observe(section);
});



