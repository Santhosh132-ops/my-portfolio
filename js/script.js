document.addEventListener('DOMContentLoaded', function() {

    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default jump behavior

            // Get the target element using the href attribute
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Enable smooth scrolling
                });
            }
        });
    });

    // Optional: Smooth scroll for general navigation links (if different from above)
    // This seems redundant with the first one, but keeping it if there's a subtle difference
    // in the selectors or behavior you intended. If not, you can remove this block.
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Read more/less functionality for About section ---
    const readMoreBtn = document.getElementById('read-more-btn');
    const moreContent = document.querySelector('.more-content');

    if (readMoreBtn && moreContent) {
        // Initial state for 'more-content' to be hidden
        moreContent.style.maxHeight = '0';
        moreContent.style.opacity = '0';
        moreContent.style.overflow = 'hidden';
        moreContent.style.transition = 'max-height 0.5s ease-out, opacity 0.5s ease-out';

        readMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (moreContent.style.maxHeight && moreContent.style.maxHeight !== '0px') {
                moreContent.style.maxHeight = '0';
                moreContent.style.opacity = '0';
                moreContent.style.overflow = 'hidden';
                this.textContent = 'Read more';
            } else {
                moreContent.style.maxHeight = moreContent.scrollHeight + 'px'; // Expand to full height
                moreContent.style.opacity = 1;
                moreContent.style.overflow = 'visible'; // Allow content to be seen
                this.textContent = 'Read less';
            }
        });
    }


    // --- Contact Form Submission ---
    const contactForm = document.querySelector('.contact-form');
    const formMessages = document.getElementById('form-messages');

    if (contactForm && formMessages) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json' // Essential for Formspree AJAX
                }
            });

            if (response.ok) {
                formMessages.textContent = 'Thank you for your message! I will get back to you soon.';
                formMessages.classList.add('success-message');
                formMessages.classList.remove('error-message');
                contactForm.reset(); // Clear the form
            } else {
                const data = await response.json();
                if (Object.hasOwnProperty.call(data, 'errors')) {
                    formMessages.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    formMessages.textContent = 'Oops! There was a problem submitting your form.';
                }
                formMessages.classList.add('error-message');
                formMessages.classList.remove('success-message');
            }
            // Clear message after a few seconds
            setTimeout(() => {
                formMessages.textContent = '';
                formMessages.classList.remove('success-message', 'error-message');
            }, 7000); // Message disappears after 7 seconds
        });
    }


    // --- Manual Blog Carousel / Slider with Arrows ---
    // IMPORTANT: Remove any CSS animation for automatic scrolling on .blogs-carousel-inner
    const blogsCarouselContainer = document.querySelector('.blogs-carousel-container');
    const prevArrow = document.querySelector('.blogs-carousel-wrapper .prev-arrow');
    const nextArrow = document.querySelector('.blogs-carousel-wrapper .next-arrow');

    if (blogsCarouselContainer && prevArrow && nextArrow) {
        // Function to check if scrolling is needed and update arrow visibility
        function checkScrollButtons() {
            const scrollLeft = blogsCarouselContainer.scrollLeft;
            const scrollWidth = blogsCarouselContainer.scrollWidth;
            const clientWidth = blogsCarouselContainer.clientWidth;

            // Hide/show arrows based on scroll position
            if (scrollLeft <= 1) { // Use a small tolerance for 0
                prevArrow.style.opacity = '0.5'; // Indicate no more scroll left
                prevArrow.style.cursor = 'default';
            } else {
                prevArrow.style.opacity = '1';
                prevArrow.style.cursor = 'pointer';
            }

            if (scrollLeft + clientWidth >= scrollWidth - 1) { // -1 for slight tolerance
                nextArrow.style.opacity = '0.5'; // Indicate no more scroll right
                nextArrow.style.cursor = 'default';
            } else {
                nextArrow.style.opacity = '1';
                nextArrow.style.cursor = 'pointer';
            }

            // If content fits completely, hide both arrows
            if (scrollWidth <= clientWidth + 2) { // +2 for slight tolerance
                prevArrow.style.display = 'none';
                nextArrow.style.display = 'none';
            } else {
                prevArrow.style.display = 'flex'; // Use flex to center icon
                nextArrow.style.display = 'flex'; // Use flex to center icon
            }
        }

        // Calculate scroll amount dynamically if possible, or use a fixed value
        // A good scroll amount is the width of one card + its gap
        // You might need to get the first card's computed width
        const firstCard = document.querySelector('.blogs-carousel-inner .blog-post-card');
        let scrollAmount = 420; // Default if card not found

        if (firstCard) {
            const cardStyle = window.getComputedStyle(firstCard);
            const cardWidth = firstCard.offsetWidth; // Includes padding and border
            const cardMarginRight = parseFloat(cardStyle.marginRight); // Get gap if set as margin
            const cardGap = parseFloat(window.getComputedStyle(firstCard.parentElement).gap); // Get gap from parent

            // Prioritize gap from parent, otherwise use margin
            scrollAmount = cardWidth + (cardGap || cardMarginRight || 0);
            // Add a small buffer for smoother appearance if cards are perfectly aligned
            scrollAmount += 10;
        }


        prevArrow.addEventListener('click', () => {
            blogsCarouselContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextArrow.addEventListener('click', () => {
            blogsCarouselContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update arrow visibility on scroll and resize
        blogsCarouselContainer.addEventListener('scroll', checkScrollButtons);
        window.addEventListener('resize', checkScrollButtons);

        // Initial check on load
        checkScrollButtons();
    }


    // --- Infinite Blog Card Carousel Animation (DISABLED - AS PER USER REQUEST) ---
    // This section is commented out because the user wants manual navigation.
    // If you uncomment this, it will likely conflict with the manual arrow navigation.
    /*
    const blogsInner = document.querySelector('.blogs-carousel-inner');
    if (blogsInner) {
        const totalContentWidth = blogsInner.scrollWidth;
        const distanceToScroll = totalContentWidth / 2;
        blogsInner.style.setProperty('--scroll-distance', `-${distanceToScroll}px`);

        let styleSheet = document.getElementById('blog-carousel-animation-styles');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'blog-carousel-animation-styles';
            styleSheet.type = 'text/css';
            document.head.appendChild(styleSheet);
        }
        styleSheet.innerText = `
            @keyframes scrollBlogsSeamless {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(var(--scroll-distance));
                }
            }
        `;
        window.addEventListener('resize', () => {
            const reCalcTotalContentWidth = blogsInner.scrollWidth;
            const reCalcDistanceToScroll = reCalcTotalContentWidth / 2;
            blogsInner.style.setProperty('--scroll-distance', `-${reCalcDistanceToScroll}px`);
        });
    }
    */


    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to set the theme
    function setTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode (click to go light)
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for light mode (click to go dark)
            localStorage.setItem('theme', 'light');
        }
    }

    // Check for saved theme preference or system preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else if (prefersDarkMode.matches) {
        setTheme(true); // Default to dark if system prefers it and no preference saved
    } else {
        setTheme(false); // Default to light if no preference saved and system prefers light
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        setTheme(!body.classList.contains('dark-mode'));
    });

    // Listen for system theme changes
    prefersDarkMode.addEventListener('change', (e) => {
        // Only react to system changes if no explicit preference is set
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });


    // --- Skills Section Animation Script ---
    const animationPath = document.getElementById('animationPath');
    const glowingOrb = document.getElementById('glowing-orb');
    const skillBoxes = document.querySelectorAll('.skill-box');
    const skillsSection = document.getElementById('skills-section');

    // Check if essential elements exist
    if (!animationPath || !glowingOrb || skillBoxes.length === 0 || !skillsSection) {
        console.warn("Required elements for skills animation not found. Skipping animation.");
        // Ensure skill boxes are visible even without animation
        skillBoxes.forEach(box => {
            box.style.opacity = 1;
            box.style.transform = 'translateY(0)';
        });
        // return; // Don't return, as other parts of JS might still be needed
    } else { // Only run animation logic if elements are found
        const pathLength = animationPath.getTotalLength();
        glowingOrb.style.opacity = 0; // Ensure orb is hidden initially

        // Define positions of skill boxes relative to the SVG's coordinate system (viewBox 0 0 1000 600)
        const skillBoxTriggerPoints = [
            { x: 150, y: 50, boxElement: skillBoxes[0] }, // Skill Box 1 (React.js)
            { x: 100, y: 250, boxElement: skillBoxes[1] }, // Skill Box 2 (Node.js)
            { x: 250, y: 300, boxElement: skillBoxes[2] }, // Skill Box 3 (MongoDB)
            { x: 500, y: 300, boxElement: skillBoxes[3] }, // Skill Box 4 (AWS Services)
            { x: 450, y: 450, boxElement: skillBoxes[4] }, // Skill Box 5 (CI/CD)
            { x: 600, y: 450, boxElement: skillBoxes[5] }, // Skill Box 6 (Git & GitHub)
            { x: 750, y: 300, boxElement: skillBoxes[6] }, // Skill Box 7 (Unit & Integration)
            { x: 900, y: 450, boxElement: skillBoxes[7] }, // Skill Box 8 (UI/UX Principles)
        ];

        const revealedBoxes = new Set();
        let animationFrameId = null; // To store the requestAnimationFrame ID

        function animateDotJourney(timestamp) {
            if (!animateDotJourney.startTime) {
                animateDotJourney.startTime = timestamp;
            }

            const elapsed = timestamp - animateDotJourney.startTime;
            const animationDuration = 15000; // Total duration for one full loop of the dot
            const progress = (elapsed % animationDuration) / animationDuration; // Loop progress from 0 to 1

            const point = animationPath.getPointAtLength(pathLength * progress);

            // Position the glowing orb
            glowingOrb.style.left = `${(point.x / 1000) * 100}%`; // Convert SVG x to percentage of wrapper width
            glowingOrb.style.top = `${(point.y / 600) * 100}%`;   // Convert SVG y to percentage of wrapper height

            // Make orb visible and start glow pulse animation
            if (glowingOrb.style.opacity === '0') {
                glowingOrb.style.opacity = 1;
                glowingOrb.classList.add('active'); // Add class for glow pulse
            }

            // Reveal skill boxes
            skillBoxTriggerPoints.forEach((trigger, index) => {
                if (!revealedBoxes.has(index) && trigger.boxElement) { // Added check for boxElement
                    const boxRect = trigger.boxElement.getBoundingClientRect();
                    const wrapperRect = skillsSection.getBoundingClientRect(); // Use skillsSection as wrapper

                    // Convert skill box's pixel coordinates to SVG coordinates
                    const boxX = (boxRect.left + boxRect.width / 2 - wrapperRect.left) * (1000 / wrapperRect.width);
                    const boxY = (boxRect.top + boxRect.height / 2 - wrapperRect.top) * (600 / wrapperRect.height);

                    const distance = Math.sqrt(
                        Math.pow(point.x - boxX, 2) + Math.pow(point.y - boxY, 2)
                    );

                    const revealThreshold = 100; // Increase threshold if boxes are large or path is far

                    if (distance < revealThreshold) {
                        trigger.boxElement.style.opacity = 1;
                        trigger.boxElement.style.transform = 'translateY(0)';
                        revealedBoxes.add(index);
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animateDotJourney);
        }

        // Use Intersection Observer to start/stop the animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start animation if entering viewport
                    if (!animationFrameId) { // Only start if not already running
                        animateDotJourney.startTime = null; // Reset time for continuous loop
                        animationFrameId = requestAnimationFrame(animateDotJourney);
                    }
                } else {
                    // Stop animation if leaving viewport
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                        glowingOrb.style.opacity = 0; // Hide orb when off-screen
                        glowingOrb.classList.remove('active'); // Remove glow pulse
                    }
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

        observer.observe(skillsSection);
    }
});