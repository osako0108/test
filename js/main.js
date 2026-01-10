/**
 * SAKURA Restaurant - Main JavaScript
 * Mobile-first interactive functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Loader.init();
    Navigation.init();
    ScrollEffects.init();
    MenuTabs.init();
    TestimonialSlider.init();
    ReservationForm.init();
    AOSAnimation.init();
});

/**
 * Page Loader
 */
const Loader = {
    init() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        // Hide loader after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 800);
        });

        // Prevent scroll while loading
        document.body.style.overflow = 'hidden';
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    navbar: null,
    hamburger: null,
    navMenu: null,
    navLinks: null,

    init() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        if (!this.navbar || !this.hamburger || !this.navMenu) return;

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMenu());

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Scroll event for navbar
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink(), { passive: true });
    },

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        const isOpen = this.navMenu.classList.contains('active');
        this.hamburger.setAttribute('aria-expanded', isOpen);
        this.hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    },

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.hamburger.setAttribute('aria-label', 'メニューを開く');
        document.body.style.overflow = '';
    },

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

/**
 * Scroll Effects Module
 */
const ScrollEffects = {
    backToTop: null,

    init() {
        this.backToTop = document.getElementById('back-to-top');
        if (!this.backToTop) return;

        this.bindEvents();
        this.initSmoothScroll();
    },

    bindEvents() {
        // Show/hide back to top button
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        }, { passive: true });

        // Scroll to top
        this.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/**
 * Menu Tabs Module
 */
const MenuTabs = {
    tabs: null,
    panels: null,

    init() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.panels = document.querySelectorAll('.menu-panel');

        if (this.tabs.length === 0) return;

        this.bindEvents();
    },

    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });

        // Touch swipe support for mobile
        this.initSwipeSupport();
    },

    switchTab(selectedTab) {
        const targetId = selectedTab.dataset.tab;

        // Update tabs
        this.tabs.forEach(tab => tab.classList.remove('active'));
        selectedTab.classList.add('active');

        // Update panels
        this.panels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === targetId) {
                panel.classList.add('active');
            }
        });
    },

    initSwipeSupport() {
        const menuContent = document.querySelector('.menu-content');
        if (!menuContent) return;

        let touchStartX = 0;
        let touchEndX = 0;

        menuContent.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        menuContent.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    },

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        const currentIndex = Array.from(this.tabs).findIndex(tab => tab.classList.contains('active'));

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < this.tabs.length - 1) {
                // Swipe left - next tab
                this.switchTab(this.tabs[currentIndex + 1]);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous tab
                this.switchTab(this.tabs[currentIndex - 1]);
            }
        }
    }
};

/**
 * Testimonial Slider Module
 */
const TestimonialSlider = {
    track: null,
    cards: null,
    prevBtn: null,
    nextBtn: null,
    dotsContainer: null,
    currentIndex: 0,
    autoPlayInterval: null,

    init() {
        this.track = document.getElementById('testimonial-track');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.dotsContainer = document.getElementById('testimonial-dots');

        if (!this.track) return;

        this.cards = this.track.querySelectorAll('.testimonial-card');
        this.createDots();
        this.bindEvents();
        this.startAutoPlay();
    },

    createDots() {
        if (!this.dotsContainer) return;

        this.cards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    },

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Touch support
        this.initTouchSupport();

        // Pause on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.track.addEventListener('mouseleave', () => this.startAutoPlay());
    },

    initTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            this.stopAutoPlay();
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            this.startAutoPlay();
        }, { passive: true });
    },

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    },

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateSlider();
    },

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updateSlider();
    },

    updateSlider() {
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        // Update dots
        const dots = this.dotsContainer?.querySelectorAll('.dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    },

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    },

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
};

/**
 * Reservation Form Module
 */
const ReservationForm = {
    form: null,

    init() {
        this.form = document.getElementById('reservation-form');
        if (!this.form) return;

        this.bindEvents();
        this.setMinDate();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input animations
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    },

    setMinDate() {
        const dateInput = this.form.querySelector('#date');
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.min = tomorrow.toISOString().split('T')[0];
        }
    },

    handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Simple validation
        if (!this.validateForm(data)) return;

        // Show confirmation (in production, send to server)
        this.showConfirmation(data);
    },

    validateForm(data) {
        const required = ['name', 'phone', 'date', 'time', 'guests'];

        for (const field of required) {
            if (!data[field]) {
                this.showError(`${this.getFieldLabel(field)}を入力してください`);
                return false;
            }
        }

        // Phone validation
        const phoneRegex = /^[0-9-]{10,}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            this.showError('正しい電話番号を入力してください');
            return false;
        }

        return true;
    },

    getFieldLabel(field) {
        const labels = {
            name: 'お名前',
            phone: '電話番号',
            date: 'ご希望日',
            time: 'ご希望時間',
            guests: '人数'
        };
        return labels[field] || field;
    },

    showError(message) {
        // Create toast notification
        this.showToast(message, 'error');
    },

    showConfirmation(data) {
        const message = `
            ご予約を受け付けました！

            お名前: ${data.name}様
            日時: ${data.date} ${data.time}
            人数: ${data.guests}名

            確認のお電話を差し上げます。
        `;

        this.showToast('ご予約ありがとうございます！確認のご連絡を差し上げます。', 'success');
        this.form.reset();
    },

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideUp 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;

        // Add animation keyframes
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

/**
 * AOS-like Animation Module
 */
const AOSAnimation = {
    elements: null,
    observer: null,

    init() {
        this.elements = document.querySelectorAll('[data-aos]');
        if (this.elements.length === 0) return;

        this.createObserver();
        this.observe();
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.aosDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                }
            });
        }, options);
    },

    observe() {
        this.elements.forEach(el => {
            this.observer.observe(el);
        });
    }
};

/**
 * Gallery Lightbox (Optional Enhancement)
 */
const GalleryLightbox = {
    init() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // In production, open lightbox modal
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 200);
            });
        });
    }
};

// Initialize gallery after DOM load
document.addEventListener('DOMContentLoaded', () => {
    GalleryLightbox.init();
});

/**
 * Performance Optimization
 * Debounce function for scroll events
 */
function debounce(func, wait = 10) {
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

/**
 * Parallax Effect for Hero (Optional)
 */
const ParallaxEffect = {
    init() {
        const hero = document.querySelector('.hero-bg');
        if (!hero) return;

        // Only on desktop
        if (window.innerWidth < 1024) return;

        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.scrollY;
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }), { passive: true });
    }
};

// Initialize parallax on larger screens
if (window.innerWidth >= 1024) {
    document.addEventListener('DOMContentLoaded', () => {
        ParallaxEffect.init();
    });
}
