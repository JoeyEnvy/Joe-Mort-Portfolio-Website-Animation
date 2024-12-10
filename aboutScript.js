// scroll by 100vh function 

document.addEventListener('DOMContentLoaded', () => {
    const fullpageContainer = document.getElementById('fullpage-container');
    const sections = document.querySelectorAll('.section');
    const footer = document.querySelector('footer');
    const arrowHint = document.querySelector('.arrow-hint');
    const backToTop = document.getElementById('backToTop');
    let currentSection = 0;
    let isAnimating = false;

    // Include footer in the sections NodeList
    const allSections = [...sections, footer];

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    function goToSection(index) {
        if (isAnimating) return;
        isAnimating = true;
        currentSection = index;
        const targetPosition = allSections[index].offsetTop;
        fullpageContainer.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        setTimeout(() => {
            isAnimating = false;
            updateArrowVisibility();
        }, 1000);
    }

    const goToNextSection = debounce(() => {
        if (currentSection < allSections.length - 1) {
            goToSection(currentSection + 1);
        }
    }, 50);

    const goToPrevSection = debounce(() => {
        if (currentSection > 0) {
            goToSection(currentSection - 1);
        }
    }, 50);

    function updateArrowVisibility() {
        if (currentSection === allSections.length - 1) {
            arrowHint.style.opacity = '0';
        } else {
            arrowHint.style.opacity = '1';
        }
    }

    arrowHint.addEventListener('click', goToNextSection);

    fullpageContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            goToNextSection();
        } else {
            goToPrevSection();
        }
    }, { passive: false });

    let touchStartY = 0;
    fullpageContainer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    fullpageContainer.addEventListener('touchmove', (e) => {
        const touchEndY = e.touches[0].clientY;
        if (touchEndY < touchStartY) {
            goToNextSection();
        } else if (touchEndY > touchStartY) {
            goToPrevSection();
        }
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            goToNextSection();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            goToPrevSection();
        }
    });

    // Back to Top functionality
    backToTop.addEventListener('click', () => {
        goToSection(0);
    });

fullpageContainer.addEventListener('scroll', debounce(() => {
    if (fullpageContainer.scrollTop > 0) {
        fullpageContainer.classList.add('scrolled');
    } else {
        fullpageContainer.classList.remove('scrolled');
    }
}, 200));

});