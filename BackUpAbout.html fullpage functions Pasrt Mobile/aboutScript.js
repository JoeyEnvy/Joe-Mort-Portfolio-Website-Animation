document.addEventListener('DOMContentLoaded', () => {

	// Get references to important elements.
	const fullpageContainer = document.getElementById('fullpage-container');
	const sections = document.querySelectorAll('.section');
	const footer = document.querySelector('footer');
	const arrowHint = document.querySelector('.arrow-hint');
	const backToTop = document.getElementById('backToTop');
	const nav = document.querySelector('nav');
	const navToggle = document.querySelector('.nav-toggle'); // Hamburger menu icon.
	const navLinks = document.querySelector('.nav-links'); // Navigation links.

	// Create and append the load bar to the navigation.
	const loadBar = document.createElement('div');
	loadBar.classList.add('load-bar');
	nav.appendChild(loadBar);

	let currentSection = 0;
	let isAnimating = false;

	// Include footer in the sections NodeList.
	const allSections = [...sections, footer];

	// Debounce function to limit how often a function is called.
	function debounce(func, wait) {
		let timeout;

		return function() {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, arguments), wait);
		};
	}

	// Function to scroll to a specific section.
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

	// Function to go to the next section.
	const goToNextSection = debounce(() => {
		if (currentSection < allSections.length - 1) {
			goToSection(currentSection + 1);
		}
	},50);

	// Function to go to the previous section.
	const goToPrevSection=debounce(()=>{
	   if(currentSection>0){
	      goToSection(currentSection-1)
	   }
	},50)

	function updateArrowVisibility() {	
	    if(currentSection===allSections.length-1){	
	        arrowHint.style.opacity='0';	
	    }else{	
	        arrowHint.style.opacity='1';	
	    }	
	}	

	// Event listener for arrow hint click.
	arrowHint.addEventListener('click', goToNextSection);

	fullpageContainer.addEventListener('wheel', (e) => {

	    e.preventDefault();

	    if(e.deltaY >  0){
	        goToNextSection();
	    }else{
	        goToPrevSection();
	    }
	}, {passive:false});

	let touchStartY=  0;

	fullpageContainer.addEventListener('touchstart',(e)=>{
	    touchStartY=e.touches[  0].clientY;

	},{passive:true});

	fullpageContainer.addEventListener('touchmove',(e)=>{
	    const touchEndY=e.touches[  0].clientY;

	    if(touchEndY<touchStartY){
	        goToNextSection();
	    }else if(touchEndY>touchStartY){
	        goToPrevSection();
	    }
	},{passive:false});

	window.addEventListener('keydown',(e)=>{
	    if(e.key==='ArrowDown'|| e.key==='ArrowRight'){
	        goToNextSection();
	    }else if(e.key==='ArrowUp'|| e.key==='ArrowLeft'){
	        goToPrevSection();
	    }
	});

	backToTop.addEventListener('click', () => {

	    goToSection(0);
	});

	fullpageContainer.addEventListener('scroll', debounce(() => {

	    const scrollPosition=fullpageContainer.scrollTop;

	    const firstSectionHeight=sections[  0].offsetHeight;

	    const maxScroll=fullpageContainer.scrollHeight-fullpageContainer.clientHeight;

	    if(window.innerWidth>768){

	        if(scrollPosition>=firstSectionHeight*  .25){

	            nav.classList.add('top-nav');

	            fullpageContainer.classList.add('top-nav-active');

	        }else{

	            nav.classList.remove('top-nav');

	            fullpageContainer.classList.remove('top-nav-active');

	        }
	    }

	    const scrollPercentage=(scrollPosition/maxScroll)*100;

	    loadBar.style.width=`${scrollPercentage}%`;

	    if(scrollPosition>window.innerHeight){

	        backToTop.classList.add('visible');

	    }else{

	        backToTop.classList.remove('visible');

	    }

	    if(scrollPosition>  0){

	        fullpageContainer.classList.add('scrolled');

	    }else{

	        fullpageContainer.classList.remove('scrolled');

	    }

	  },10));

	  navToggle.addEventListener("click", () => {

	      navLinks.classList.toggle("active"); 

	  });

	  updateArrowVisibility();

});