document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navProgress = document.querySelector('.nav-progress');
    const backToTopButton = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section');
    const gradients = [
        'linear-gradient(135deg, #2d3436 0%, #6c5ce7 100%)', // Dark grey to dark blue
        'linear-gradient(135deg, #2d3436 0%, #00cec9 100%)', // Dark grey to teal
        'linear-gradient(135deg, #ffffff 0%, #00cec9 100%)', // White to teal (web design section)
        'linear-gradient(135deg, #2d3436 0%, #fd79a8 100%)', // Dark grey to pink
        'linear-gradient(135deg, #6c5ce7 0%, #2d3436 100%)', // Dark blue to dark grey
        'linear-gradient(135deg, #00cec9 0%, #2d3436 100%)', // Teal to dark grey
        'linear-gradient(135deg, #fd79a8 0%, #2d3436 100%)', // Pink to dark grey
        'linear-gradient(135deg, #2d3436 0%, #6c5ce7 50%, #00cec9 100%)' // Dark grey to dark blue to teal
    ];
    let currentSection = 0;
    let isScrolling = false;


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
        const body = document.body;
        const targetGradient = gradients[targetSection % gradients.length];

        body.style.backgroundImage = targetGradient;
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
        sections[targetSection].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            isScrolling = false;
            if (currentSection !== targetSection) {
                changeBackgroundGradient(targetSection);
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


