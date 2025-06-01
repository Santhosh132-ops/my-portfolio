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