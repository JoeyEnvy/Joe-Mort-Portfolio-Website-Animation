document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navProgress = document.querySelector('.nav-progress');
    const backToTopButton = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section');
    const gradients = [
        'linear-gradient(to right, #00cec9, #6c5ce7)', // First section
        '#2d3436', // Second section
        '#ffffff', // Third section
        '#333333', // Fourth section
        '#ffffff', // Fifth section
        '#333333', // Sixth section
        '#2d3436', // Seventh section
        '#ffffff', // Eighth section
        '#ff5733'  // New color for the new section (e.g., vibrant orange)
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

    function updateBackgroundColor() {
        document.body.style.background = gradients[currentSection % gradients.length];
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
                updateBackgroundColor();
                setActiveSection();
            }
            updateNavbar();
            updateProgressBar();
            updateBackToTopButton();
        }, 1000);
    }

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

    const handleScroll = debounce(() => {
        updateNavbar();
        updateProgressBar();
        updateBackToTopButton();
    }, 10);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const index = Array.from(sections).indexOf(entry.target);
                if (index !== currentSection) {
                    currentSection = index;
                    updateBackgroundColor();
                    setActiveSection();
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    window.addEventListener('scroll', handleScroll);

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
    updateBackgroundColor();
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


// About section Joe Mort
document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.section');
    const aboutSection = document.querySelector('#about.section');
    const splineScene = document.querySelector('.spline-container'); // Assuming your spline scene is in this container

    // Observer for the general section (if needed)
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

    observer.observe(section); // Observe the general section

    // Observer specifically for the About section
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When the About section is in view
                splineScene.classList.add('active');
                splineScene.classList.remove('exit');
            } else {
                // When the About section is out of view
                splineScene.classList.remove('active');
                splineScene.classList.add('exit');
            }
        });
    }, { threshold: 0.5 });

    aboutObserver.observe(aboutSection); // Start observing the About section
});

//web design section animations 

//top right  images web design 

document.addEventListener('DOMContentLoaded', () => {
    const webDesignSection = document.getElementById('web-design');
    const galleryContainer = document.querySelector('.gallery-container');
    const fullscreenView = document.querySelector('.fullscreen-view');
    const fullscreenImage = fullscreenView.querySelector('img');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let animationFrameId = null;
    let targetTranslateX = 100; // Start off-screen

    function animate() {
        const currentTranslateX = parseFloat(galleryContainer.style.transform.replace('translateX(', '').replace('%)', '') || 100);
        const diff = targetTranslateX - currentTranslateX;
        const newTranslateX = currentTranslateX + diff * 0.15; // Reduced to 0.15 for a slightly longer animation duration

        galleryContainer.style.transform = `translateX(${newTranslateX}%)`;

        if (Math.abs(diff) > 0.1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            galleryContainer.style.transform = `translateX(${targetTranslateX}%)`;
            animationFrameId = null;
        }
    }

    function handleScroll() {
        const sectionRect = webDesignSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        const viewportHeight = window.innerHeight;

        // Keep the early start and early finish
        if (sectionTop <= viewportHeight * 2.5 && sectionBottom >= viewportHeight * 0.5) {
            const progress = Math.min(1, (viewportHeight * 2.5 - sectionTop) / (viewportHeight * 2));
            targetTranslateX = 100 - progress * 100;
        } else {
            targetTranslateX = 100; // Reset to off-screen position
        }

        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Rest of your code (openFullscreenView, closeFullscreenView, startEnhancedSlider, etc.) remains the same

    // Initial call to set the correct position
    handleScroll();
});

//top and bottom right animate in and out 

document.addEventListener('DOMContentLoaded', () => {
    const webDesignSection = document.getElementById('web-design');
    const topRightQuadrant = document.getElementById('tr-web-design-2024');
    const bottomRightQuadrant = document.querySelector('.gallery-quadrant');
    const fullscreenView = document.querySelector('.fullscreen-view');
    const fullscreenImage = fullscreenView.querySelector('img');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function handleScroll() {
        const sectionRect = webDesignSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionBottom = sectionRect.bottom;
        const viewportHeight = window.innerHeight;

        if (sectionTop <= viewportHeight * 0.5 && sectionBottom >= viewportHeight * 0.5) {
            topRightQuadrant.classList.add('visible');
            bottomRightQuadrant.classList.add('visible');
        } else {
            topRightQuadrant.classList.remove('visible');
            bottomRightQuadrant.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Fullscreen view functionality
    function openFullscreenView(imageSrc) {
        fullscreenImage.src = imageSrc;
        fullscreenView.classList.add('active');
    }

    function closeFullscreenView() {
        fullscreenView.classList.remove('active');
    }

    galleryItems.forEach(item => {
        const images = item.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('click', () => openFullscreenView(img.src));
        });
    });

    fullscreenView.addEventListener('click', closeFullscreenView);

    // Initial call to set the correct position
    handleScroll();
});

//web design bottom right 

document.addEventListener('DOMContentLoaded', () => {
    const mobileVideo = document.querySelector('.mobile-video');
    const monitorVideo = document.querySelector('.monitor-video');
    const fullscreenShowcase = document.querySelector('.fullscreen-showcase');
    const fullscreenVideo = document.querySelector('.fullscreen-video');
    const prevButton = document.querySelector('.prev-video');
    const nextButton = document.querySelector('.next-video');
    const closeButton = document.querySelector('.close-fullscreen');
    const deviceShowcase = document.querySelector('.device-showcase');

    const mobileVideos = ['A.mp4', 'B.mp4', 'C.mp4', 'D.mp4', 'E.mp4', 'F.mp4', 'G.mp4', 'H.mp4'];
    const monitorVideos = ['1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4', '6.mp4', '7.mp4', '8.mp4'];
    let currentMobileIndex = 0;
    let currentMonitorIndex = 0;

    function changeVideo(video, videoList, index) {
        return new Promise((resolve, reject) => {
            video.src = `showcase slideshow videos/${videoList[index]}`;
            video.load();
            video.oncanplay = () => {
                video.play().then(resolve).catch(reject);
            };
            video.onerror = (e) => reject(new Error(`Video load error: ${e.target.error.message}`));
        });
    }

    function nextVideo(video, videoList, indexVar) {
        indexVar = (indexVar + 1) % videoList.length;
        changeVideo(video, videoList, indexVar).catch(e => console.error("Next video error:", e));
        return indexVar;
    }

    function prevVideo(video, videoList, indexVar) {
        indexVar = (indexVar - 1 + videoList.length) % videoList.length;
        changeVideo(video, videoList, indexVar).catch(e => console.error("Previous video error:", e));
        return indexVar;
    }

    // Auto-change videos
    setInterval(() => {
        currentMobileIndex = nextVideo(mobileVideo, mobileVideos, currentMobileIndex);
    }, 5000);

    setInterval(() => {
        currentMonitorIndex = nextVideo(monitorVideo, monitorVideos, currentMonitorIndex);
    }, 5000);

    // Fullscreen functionality
    function openFullscreen(video, videoList, index) {
        fullscreenShowcase.style.display = 'block';
        changeVideo(fullscreenVideo, videoList, index).catch(e => console.error("Fullscreen video error:", e));
    }

    mobileVideo.addEventListener('click', () => openFullscreen(fullscreenVideo, mobileVideos, currentMobileIndex));
    monitorVideo.addEventListener('click', () => openFullscreen(fullscreenVideo, monitorVideos, currentMonitorIndex));

    closeButton.addEventListener('click', () => {
        fullscreenShowcase.style.display = 'none';
    });

    // Fullscreen navigation
    let isFullscreenMobile = true;
    let fullscreenIndex = 0;

    prevButton.addEventListener('click', () => {
        fullscreenIndex = prevVideo(fullscreenVideo, isFullscreenMobile ? mobileVideos : monitorVideos, fullscreenIndex);
    });

    nextButton.addEventListener('click', () => {
        fullscreenIndex = nextVideo(fullscreenVideo, isFullscreenMobile ? mobileVideos : monitorVideos, fullscreenIndex);
    });

    // Initialize videos
    changeVideo(mobileVideo, mobileVideos, currentMobileIndex).catch(e => console.error("Initial mobile video error:", e));
    changeVideo(monitorVideo, monitorVideos, currentMonitorIndex).catch(e => console.error("Initial monitor video error:", e));

    // Error handling
    mobileVideo.addEventListener('error', (e) => console.error("Mobile video error:", e));
    monitorVideo.addEventListener('error', (e) => console.error("Monitor video error:", e));
    fullscreenVideo.addEventListener('error', (e) => console.error("Fullscreen video error:", e));

    // Slide-in and slide-out effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                deviceShowcase.style.transform = 'translateX(0)';
            } else {
                deviceShowcase.style.transform = 'translateX(100%)';
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    observer.observe(document.querySelector('#web-design .bottom-right'));
});

//pricing link to bottom of the page contact section on web design 

document.querySelectorAll('.get-started-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelector('#contact').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

//animation section 

// Select all video elements in both columns
const videos = document.querySelectorAll('.video-column video');

// Function to get a random time within the video's duration
function getRandomTime(video) {
    return Math.random() * video.duration;
}

// Function to autoplay videos without sound when entering the section
function autoplayVideos() {
    videos.forEach(video => {
        video.muted = true;
        video.currentTime = getRandomTime(video);
        video.play();
    });
}

// Function to enter fullscreen mode
function openFullscreen(video) {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { // Safari
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { // IE11
        video.msRequestFullscreen();
    }
}

// Add event listeners for hover effect, sound, and fullscreen
videos.forEach(video => {
    video.addEventListener('mouseenter', () => {
        video.volume = 1; // Turn on sound
        video.play(); // Ensure video is playing
        video.style.transform = 'scale(1.1)'; // Make video slightly larger
    });

    video.addEventListener('mouseleave', () => {
        video.volume = 0; // Mute the video
        video.style.transform = 'scale(1)'; // Return to original size
    });

    // Fullscreen functionality on click
    video.addEventListener('click', () => {
        openFullscreen(video);
    });
});

// Function to scroll left column
function scrollLeft() {
    const leftColumn = document.querySelector('.left-column');
    leftColumn.scrollBy({
        left: -leftColumn.offsetWidth / 2, // Scroll by one video width (half the column)
        behavior: 'smooth' // Smooth scrolling effect
    });
}

// Function to scroll right column
function scrollRight() {
    const rightColumn = document.querySelector('.right-column');
    rightColumn.scrollBy({
        left: rightColumn.offsetWidth / 2, // Scroll by one video width (half the column)
        behavior: 'smooth' // Smooth scrolling effect
    });
}

// Start autoplay when entering the video gallery section
document.getElementById('video-gallery').addEventListener('mouseenter', autoplayVideos);

// Pause videos when leaving the section to save resources
document.getElementById('video-gallery').addEventListener('mouseleave', () => {
    videos.forEach(video => video.pause());
});

