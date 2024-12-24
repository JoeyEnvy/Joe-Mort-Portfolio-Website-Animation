//image bacgkround change and nav effects

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navProgress = document.querySelector('.nav-progress');
    const backToTopButton = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section');
const gradients = [
    'linear-gradient(to right, #00cec9, #6c5ce7)', // Teal to Dark Blue
    'linear-gradient(to right, #2d3436, #fd79a8)', // Grey to Pink
'linear-gradient(to right, #0f0f0f, #1a2a40, #3d5470, #4e657b)', // Black to Slate

    'linear-gradient(to right, #2d3436, #4b4b6a, #6c5ce7)', // Grey to Dark Purple
    'linear-gradient(to right, #fd79a8, #6c5ce7)', // Pink to Dark Blue
    'linear-gradient(to right, #00cec9, #ffffff)', // Teal to White
    'linear-gradient(to right, #6c5ce7, #2d3436)', // Dark Blue to Grey
    'linear-gradient(to right, #ffffff, #fd79a8)' // White to Pink
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
        document.body.style.backgroundImage = gradients[targetSection % gradients.length];
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
                currentSection = targetSection;
                changeBackgroundGradient(targetSection);
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
        const newSection = Math.floor((scrollPosition + windowHeight * 0.25) / windowHeight);
        if (newSection !== currentSection) {
            currentSection = newSection;
            changeBackgroundGradient(newSection);
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
    changeBackgroundGradient(0);
    handleScroll();
    setActiveSection();
});



//image bacgkround change and nav effects END HERE


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


//web design section animations 

//bottom right images web design 

document.addEventListener('DOMContentLoaded', () => {
    const galleries = document.querySelectorAll('.gallery-item');
    
    galleries.forEach(gallery => {
        const previewImages = gallery.querySelectorAll('.image-preview img');
        const allImages = [...gallery.querySelectorAll('img')];
        let currentIndex = 0;
        
        function slideImages() {
            previewImages.forEach((img, index) => {
                const nextIndex = (currentIndex + index) % allImages.length;
                
                // Create temporary image to preload
                const tempImg = new Image();
                tempImg.src = allImages[nextIndex].src;
                
                // Once preloaded, update the source
                tempImg.onload = () => {
                    img.style.opacity = '0';
                    
                    setTimeout(() => {
                        img.src = tempImg.src;
                        img.style.opacity = '1';
                        
                        // Reapply hover functionality
                        img.style.zIndex = '1';
                        img.addEventListener('mouseenter', () => {
                            img.style.zIndex = '100';
                        });
                        img.addEventListener('mouseleave', () => {
                            setTimeout(() => {
                                img.style.zIndex = '1';
                            }, 300);
                        });
                    }, 300);
                };
            });
            
            currentIndex = (currentIndex + 1) % (allImages.length - 2);
        }
        
        // Start sliding every 4 seconds
        setInterval(slideImages, 4000);
        
        // Initial hover setup
        previewImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.zIndex = '100';
            });
            img.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    img.style.zIndex = '1';
                }, 300);
            });
        });
    });
});



