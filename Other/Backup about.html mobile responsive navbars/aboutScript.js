document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navProgress = document.querySelector('.nav-progress');
    const backToTopButton = document.getElementById('backToTop');

    function updateScroll() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Navbar and progress bar logic
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
            if (navProgress) {
                navProgress.style.opacity = '1';
            }
        } else {
            navbar.classList.remove('scrolled');
            if (navProgress) {
                navProgress.style.opacity = '0';
            }
        }

        if (navProgress) {
            const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
            navProgress.style.width = `${scrollPercentage}%`;
        }

        // Back to top button logic
        if (scrollPosition > windowHeight * 0.5) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    }

    window.addEventListener('scroll', updateScroll);
    updateScroll(); // Call once to set initial state
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}




