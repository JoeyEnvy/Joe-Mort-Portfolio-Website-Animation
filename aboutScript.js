// Array of colors for the section backgrounds
const sectionColors = [
    '#6c5ce7',  // Dark Blue
    '#00cec9',  // Teal
    '#f9f9f9',  // Light Grey
    '#fd79a8',  // Pink
    '#ffffff',  // White
    '#2d3436',  // Dark Grey
    '#00cec9',  // Teal
    '#2d3436'   // Dark Grey
];

// Main scroll event listener
window.addEventListener('scroll', () => {
    // Get references to important elements
    const navbar = document.getElementById('navbar');
    const main = document.querySelector('main');
    const navProgress = document.querySelector('.nav-progress');
    const sections = document.querySelectorAll('.section');

    // Get current scroll position and window dimensions
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Navbar transformation
    if (scrollPosition > 50) {
        navbar.classList.add('scrolled');
        main.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('scrolled');
        main.classList.remove('nav-scrolled');
    }

    // Update progress bar width based on scroll percentage
    const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
    navProgress.style.width = `${scrollPercentage}%`;

    // Change section background colors based on scroll position
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop - windowHeight / 2 && 
            scrollPosition < sectionTop + sectionHeight - windowHeight / 2) {
            section.style.backgroundColor = sectionColors[index % sectionColors.length];
        }
    });

    // Show or hide the back-to-top button
    var backToTopButton = document.getElementById('backToTop');
    if (scrollPosition > 300) {
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// Function to scroll back to the top of the page smoothly
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add click event listener to the back-to-top button
document.getElementById('backToTop').addEventListener('click', scrollToTop);

