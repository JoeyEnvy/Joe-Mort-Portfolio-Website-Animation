document.addEventListener('DOMContentLoaded', () => {
    const fullpageContainer = document.getElementById('fullpage-container');
    const sections = document.querySelectorAll('.section');
    const footer = document.querySelector('footer');
    const arrowHint = document.querySelector('.arrow-hint');
    const topArrowHint = document.querySelector('.top-arrow-hint');
    const backToTop = document.getElementById('backToTop');
    const nav = document.querySelector('nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    const loadBar = document.createElement('div');
    loadBar.classList.add('load-bar');
    nav.appendChild(loadBar);

    let currentSection = 0;
    let isAnimating = false;
    const allSections = [...sections, footer];

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    function changeBackgroundColor(index) {
        const colors = ['#2d3436', '#6c5ce7', '#00cec9', '#fd79a8', '#ffffff'];
        fullpageContainer.style.backgroundColor = colors[index % colors.length];
    }

    function moveSplineScene(scrollPosition) {
        const splineContainer = document.querySelector('.spline-container');
        if (splineContainer) {
            const scrollThreshold = window.innerHeight * 0.1;
if (scrollPosition > scrollThreshold) {
            const translateX = (scrollPosition - scrollThreshold) * 1.5; // Increase movement speed
                splineContainer.style.transform = `translateX(${translateX}px)`;
            } else {
                splineContainer.style.transform = 'translateX(0)';
            }
        }
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
        
        changeBackgroundColor(index);
        
        setTimeout(() => {
            isAnimating = false;
            updateArrowVisibility();
        }, 500);
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
            topArrowHint.style.display = 'none';
        } else {    
            arrowHint.style.opacity = '1';    
            topArrowHint.style.display = 'block';
        }    
    }

    function handleNavbarTransition() {
        const scrollPosition = fullpageContainer.scrollTop;
        const firstSectionHeight = sections[0].offsetHeight;

        if (scrollPosition >= firstSectionHeight * 0.25) {
            nav.classList.add('top-nav');
            fullpageContainer.classList.add('top-nav-active');
        } else {
            nav.classList.remove('top-nav');
            fullpageContainer.classList.remove('top-nav-active');
        }
    }

    arrowHint.addEventListener('click', goToNextSection);
    topArrowHint.addEventListener('click', goToPrevSection);

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

    backToTop.addEventListener('click', () => {
        goToSection(0);
    });

    fullpageContainer.addEventListener('scroll', debounce(() => {
        const scrollPosition = fullpageContainer.scrollTop;

        handleNavbarTransition();
        moveSplineScene(scrollPosition);

        const maxScroll = fullpageContainer.scrollHeight - fullpageContainer.clientHeight;
        const scrollPercentage = (scrollPosition / maxScroll) * 100;
        loadBar.style.width = `${scrollPercentage}%`;

        if (scrollPosition > window.innerHeight) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        if (scrollPosition > 0) {
            fullpageContainer.classList.add('scrolled');
        } else {
            fullpageContainer.classList.remove('scrolled');
        }

        const currentSectionIndex = Math.floor(scrollPosition / window.innerHeight);
        changeBackgroundColor(currentSectionIndex);
    }, 10));

    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    updateArrowVisibility();
    handleNavbarTransition();
    changeBackgroundColor(0);
});


//page loader 

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader-wrapper');
    loader.style.transform = 'translateY(-100%)';
    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
    });
  }, 1750);
//1750 are the seconds 
});




