/**
 * =============================================
 * PREMIER SCHOOLS EXHIBITION – MAIN JS
 * Vanilla JavaScript | No Frameworks
 * =============================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initGradeDropdown();
    initMobileSliders();
    initMarqueePauseOnHover();
    initStickyHeader();
    initSmoothScrollLinks();
    initFormValidation();
    initAccessibility();
});


/**
 * 1. GRADE DROPDOWN (Custom Select)
 */
function initGradeDropdown() {
    const select = document.getElementById('grade-select');
    const dropdown = document.getElementById('grade-dropdown');
    if (!select || !dropdown) return;

    const textEl = select.querySelector('.form-group__select-text');
    const items = dropdown.querySelectorAll('.form-group__dropdown-item');

    // Toggle dropdown
    select.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = select.getAttribute('aria-expanded') === 'true';
        toggleDropdown(!isOpen);
    });

    // Keyboard support
    select.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const isOpen = select.getAttribute('aria-expanded') === 'true';
            toggleDropdown(!isOpen);
        }
        if (e.key === 'Escape') {
            toggleDropdown(false);
        }
    });

    // Select item
    items.forEach(item => {
        item.addEventListener('click', () => {
            textEl.textContent = item.textContent;
            textEl.style.opacity = '1';
            textEl.dataset.value = item.dataset.value;
            toggleDropdown(false);
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                textEl.textContent = item.textContent;
                textEl.style.opacity = '1';
                textEl.dataset.value = item.dataset.value;
                toggleDropdown(false);
                select.focus();
            }
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!select.contains(e.target) && !dropdown.contains(e.target)) {
            toggleDropdown(false);
        }
    });

    function toggleDropdown(open) {
        select.setAttribute('aria-expanded', String(open));
        dropdown.classList.toggle('form-group__dropdown--open', open);
    }
}


/**
 * 2. MOBILE SLIDERS (Choose School & Must-Visit)
 * Touch-enabled horizontal scroll with dot pagination
 */
function initMobileSliders() {
    setupSlider({
        gridSelector: '.choose__grid',
        dotSelector: '.choose__dots',
        dotClass: 'choose__dot',
        dotActiveClass: 'choose__dot--active'
    });

    setupSlider({
        gridSelector: '.visit__grid',
        dotSelector: '.visit__dots',
        dotClass: 'visit__dot',
        dotActiveClass: 'visit__dot--active'
    });
}

function setupSlider(config) {
    const grid = document.querySelector(config.gridSelector);
    const dotContainer = document.querySelector(config.dotSelector);
    if (!grid || !dotContainer) return;

    const dots = dotContainer.querySelectorAll('.' + config.dotClass);

    // Update dots based on scroll position
    let scrollTimeout;
    grid.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateDots();
        }, 100);
    });

    // Mouse drag support
    let isDown = false;
    let startX;
    let scrollLeft;

    grid.addEventListener('mousedown', (e) => {
        isDown = true;
        grid.style.cursor = 'grabbing';
        startX = e.pageX - grid.offsetLeft;
        scrollLeft = grid.scrollLeft;
    });

    grid.addEventListener('mouseleave', () => {
        isDown = false;
        grid.style.cursor = '';
    });

    grid.addEventListener('mouseup', () => {
        isDown = false;
        grid.style.cursor = '';
    });

    grid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - grid.offsetLeft;
        const walk = (x - startX) * 1.5;
        grid.scrollLeft = scrollLeft - walk;
    });

    // Dot click navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const cards = grid.children;
            if (cards[index]) {
                cards[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
            }
        });
    });

    function updateDots() {
        const scrollPercent = grid.scrollLeft / (grid.scrollWidth - grid.clientWidth);
        const activeIndex = Math.round(scrollPercent * (dots.length - 1));

        dots.forEach((dot, i) => {
            dot.classList.toggle(config.dotActiveClass, i === activeIndex);
            dot.setAttribute('aria-current', i === activeIndex ? 'true' : 'false');
        });
    }
}


/**
 * 3. MARQUEE PAUSE ON HOVER/FOCUS
 */
function initMarqueePauseOnHover() {
    const marqueeWrappers = document.querySelectorAll('.marquee');

    marqueeWrappers.forEach(marquee => {
        const track = marquee.querySelector('.marquee__track');
        if (!track) return;

        marquee.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        marquee.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });

        marquee.addEventListener('focusin', () => {
            track.style.animationPlayState = 'paused';
        });

        marquee.addEventListener('focusout', () => {
            track.style.animationPlayState = 'running';
        });
    });
}


/**
 * 4. STICKY HEADER SHADOW ON SCROLL
 */
function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 10) {
                    header.style.boxShadow = '0 2px 20px rgba(19, 13, 62, 0.08)';
                } else {
                    header.style.boxShadow = 'none';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}


/**
 * 5. SMOOTH SCROLL FOR ANCHOR LINKS
 */
function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


/**
 * 6. FORM VALIDATION
 */
function initFormValidation() {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('parent-name');
        const phone = document.getElementById('phone-number');
        const gradeText = document.querySelector('.form-group__select-text');

        let isValid = true;

        // Validate name
        if (!name.value.trim()) {
            showFieldError(name, 'Please enter your name');
            isValid = false;
        } else {
            clearFieldError(name);
        }

        // Validate phone
        const phoneRegex = /^[+]?[\d\s-]{8,15}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            showFieldError(phone, 'Please enter a valid phone number');
            isValid = false;
        } else {
            clearFieldError(phone);
        }

        // Validate grade selection
        if (!gradeText.dataset.value) {
            const selectEl = document.getElementById('grade-select');
            selectEl.style.borderColor = '#ef4444';
            isValid = false;
        }

        if (isValid) {
            // Simulate submit success
            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.querySelector('.btn__label').textContent;
            submitBtn.querySelector('.btn__label').textContent = 'SUBMITTED ✓';
            submitBtn.style.background = '#22c55e';
            submitBtn.style.color = '#fff';

            setTimeout(() => {
                submitBtn.querySelector('.btn__label').textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                form.reset();
                gradeText.textContent = 'Which grade are you looking for?';
                gradeText.style.opacity = '0.5';
                delete gradeText.dataset.value;
            }, 2500);
        }
    });

    function showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        field.setAttribute('aria-invalid', 'true');

        // Remove existing error
        const existingError = field.parentElement.querySelector('.form-group__error');
        if (existingError) existingError.remove();

        const error = document.createElement('span');
        error.className = 'form-group__error';
        error.textContent = message;
        error.style.cssText = 'color: #ef4444; font-size: 11px; display: block; margin-top: 4px;';
        field.parentElement.appendChild(error);
    }

    function clearFieldError(field) {
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
        const existingError = field.parentElement.querySelector('.form-group__error');
        if (existingError) existingError.remove();
    }
}


/**
 * 7. ACCESSIBILITY HELPERS
 */
function initAccessibility() {
    // Skip link behavior
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
        document.documentElement.classList.add('reduced-motion');
    }

    motionQuery.addEventListener('change', (e) => {
        document.documentElement.classList.toggle('reduced-motion', e.matches);
    });
}
