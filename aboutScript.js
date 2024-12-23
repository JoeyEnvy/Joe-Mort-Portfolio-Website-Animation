document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navProgress = document.querySelector('.nav-progress');
    const backToTopButton = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section');
    const colors = ['#fd79a8', '#6c5ce7', '#00cec9', '#2d3436', '#ffffff'];
    let currentSection = 0;
    let isScrolling = false;

    function updateNavbar() {
        const scrollPosition = window.pageYOffset;
        if (scrollPosition > 50) {
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

    function changeBackgroundColor() {
        document.body.style.transition = 'background-color 0.5s ease';
        document.body.style.backgroundColor = colors[currentSection % colors.length];
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
        isScrolling = true;
        sections[targetSection].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            isScrolling = false;
            changeBackgroundColor();
            setActiveSection();
            updateNavbar();
            updateProgressBar();
            updateBackToTopButton();
        }, 500);
    }

    function handleScroll() {
        if (!isScrolling) {
            const scrollPosition = window.pageYOffset;
            const windowHeight = window.innerHeight;
            currentSection = Math.floor(scrollPosition / windowHeight);
            updateNavbar();
            updateProgressBar();
            updateBackToTopButton();
        }
    }

    window.addEventListener('scroll', handleScroll);

    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;

        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            currentSection++;
        } else if (e.deltaY < 0 && currentSection > 0) {
            currentSection--;
        }

        smoothScrollToSection(currentSection);
    }, { passive: false });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        currentSection = 0;
        smoothScrollToSection(currentSection);
    });

    // Initialize
    handleScroll();
    changeBackgroundColor();
    setActiveSection();
});

