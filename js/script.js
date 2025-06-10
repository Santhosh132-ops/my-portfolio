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

    // --- Read more/less functionality for About section ---
    const readMoreBtn = document.getElementById('read-more-btn');
    const moreContent = document.querySelector('.more-content');

    if (readMoreBtn && moreContent) {
        readMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (moreContent.style.display === 'none' || moreContent.style.display === '') {
                moreContent.style.display = 'inline'; // Use inline to flow with text
                this.textContent = 'Read less';
            } else {
                moreContent.style.display = 'none';
                this.textContent = 'Read more';
            }
        });
        // Hide on initial load
        moreContent.style.display = 'none';
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
});
document.addEventListener('DOMContentLoaded', function() {
    // ... (Your existing smooth scrolling, read more, contact form code) ...

    // --- Infinite Blog Card Carousel Animation ---
    const blogsInner = document.querySelector('.blogs-carousel-inner');

    if (blogsInner) {
        // We need the width of one full set of unique cards.
        // We'll assume the first half of the blogsInner contains one full set of unique cards.
        // Get the total scrollable width of the *entire* blogs-carousel-inner content.
        const totalContentWidth = blogsInner.scrollWidth;

        // The animation distance should be exactly half of the total content width,
        // because we have duplicated the content.
        const distanceToScroll = totalContentWidth / 2;

        // Set a CSS variable with this calculated distance
        blogsInner.style.setProperty('--scroll-distance', `-${distanceToScroll}px`);

        // Dynamically create/update style tag for the keyframes
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

        // The animation is already applied in CSS. The JS just ensures --scroll-distance is correct.

        // Optional: Ensure it's responsive if window resizes
        // This is important because card widths and gaps might change on resize.
        window.addEventListener('resize', () => {
            const reCalcTotalContentWidth = blogsInner.scrollWidth;
            const reCalcDistanceToScroll = reCalcTotalContentWidth / 2;
            blogsInner.style.setProperty('--scroll-distance', `-${reCalcDistanceToScroll}px`);
        });
    }
});
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
            // or if you want system preference to always override
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches);
            }
        });
        document.addEventListener('DOMContentLoaded', () => {

    // --- Skills Section Animation Script ---
    const animationPath = document.getElementById('animationPath');
    const glowingOrb = document.getElementById('glowing-orb');
    const skillBoxes = document.querySelectorAll('.skill-box');
    const skillsSection = document.getElementById('skills-section');

    // Check if essential elements exist
    if (!animationPath || !glowingOrb || skillBoxes.length === 0 || !skillsSection) {
        console.error("Required elements for skills animation not found. Skipping animation.");
        // Ensure skill boxes are visible even without animation
        skillBoxes.forEach(box => {
            box.style.opacity = 1;
            box.style.transform = 'translateY(0)';
        });
        return; // Exit if elements are missing
    }

    const pathLength = animationPath.getTotalLength();
    glowingOrb.style.opacity = 0; // Ensure orb is hidden initially

    // Define positions of skill boxes relative to the SVG's coordinate system (viewBox 0 0 1000 600)
    // These points should be roughly where the dot should trigger the skill box appearance.
    // Fine-tune these (x, y) values based on your SVG path and skill box placement.
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
            if (!revealedBoxes.has(index)) {
                // Calculate actual pixel coordinates of the skill box element
                const boxRect = trigger.boxElement.getBoundingClientRect();
                const wrapperRect = trigger.boxElement.parentElement.getBoundingClientRect();

                // Convert skill box's percentage-based left/top to SVG coordinates
                // Assuming skill-box positions are relative to the wrapper which also contains the SVG
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


    // Optional: About section "Read More" functionality
    const readMoreBtn = document.getElementById('read-more-btn');
    const moreContent = document.querySelector('.more-content');

    if (readMoreBtn && moreContent) {
        readMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (moreContent.style.maxHeight) {
                moreContent.style.maxHeight = null;
                moreContent.style.opacity = 0;
                moreContent.style.overflow = 'hidden';
                this.textContent = 'Read more';
            } else {
                moreContent.style.maxHeight = moreContent.scrollHeight + 'px';
                moreContent.style.opacity = 1;
                moreContent.style.overflow = 'visible';
                this.textContent = 'Read less';
            }
        });
        // Set initial state for 'more-content' to be hidden
        moreContent.style.maxHeight = '0';
        moreContent.style.opacity = '0';
        moreContent.style.overflow = 'hidden';
        moreContent.style.transition = 'max-height 0.5s ease-out, opacity 0.5s ease-out';
    }


    // Optional: Smooth scroll for navigation links
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

});