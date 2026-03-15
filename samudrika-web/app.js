document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    const tl = gsap.timeline();
    
    tl.fromTo(".nav-container", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(".hero-left > *", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
        "-=0.4"
    )
    .fromTo(".hero-right", 
        { x: 50, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.6"
    );

    // Scroll Animations for Bento Box Array
    gsap.utils.toArray('.stagger-element').forEach((element) => {
        gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            }
        );
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const rootEl = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? (savedTheme === 'dark') : window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDark) {
        rootEl.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (rootEl.getAttribute('data-theme') === 'dark') {
                rootEl.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                rootEl.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Floating Action Bar Reveal
    const floatingBar = document.querySelector('.floating-action-bar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            floatingBar.classList.add('visible');
        } else {
            floatingBar.classList.remove('visible');
        }
    });

    // Interactive Image Slider Logic
    const sliderHandle = document.querySelector('.slider-handle');
    const beforeImage = document.querySelector('.before-img');
    const cardBody = document.querySelector('.card-body');

    let isDragging = false;

    // Helper to calculate and bound percentage
    const setSliderPosition = (e) => {
        const rect = cardBody.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let percentage = (x / rect.width) * 100;

        // Bound strictly to 0-100%
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        sliderHandle.style.left = `${percentage}%`;
        beforeImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    };

    // Auto-animate slider once globally
    gsap.to(sliderHandle, {
        left: '75%',
        duration: 2,
        ease: "power2.inOut",
        delay: 1.5,
        onUpdate: function() {
            let percentage = parseFloat(this.targets()[0].style.left);
            beforeImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        }
    });

    cardBody.addEventListener('mousedown', (e) => {
        isDragging = true;
        setSliderPosition(e); // jump on click
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setSliderPosition(e);
    });
});
