// nav move vertical to top and load bar animation 

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const main = document.querySelector('main');
    const navProgress = document.querySelector('.nav-progress');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition > 50) {
        navbar.classList.add('scrolled');
        main.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('scrolled');
        main.classList.remove('nav-scrolled');
    }

    // Update progress bar
    const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
    navProgress.style.width = `${scrollPercentage}%`;
});

//back to top fixed button 

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show or hide the back-to-top button based on scroll position
window.addEventListener('scroll', function() {
    var backToTopButton = document.getElementById('backToTop');
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.style.display = 'none';
    }
});

