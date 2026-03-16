/**
 * Luisana Beauty Spa - Main JavaScript
 * Web Design by Christian Herencia
 * https://christian-freelance.us/
 */

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // Language Toggle Functionality
    // ========================================
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        
        // Update button states
        langButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update all translatable elements
        const translatableElements = document.querySelectorAll('[data-en][data-es]');
        translatableElements.forEach(element => {
            const text = element.getAttribute('data-' + lang);
            if (text) {
                // Check if element has only text content (no child elements with text)
                if (element.children.length === 0) {
                    element.textContent = text;
                } else {
                    // For elements with children, update carefully
                    // Don't update if it's a complex element
                    if (element.classList.contains('nav-link') || 
                        element.classList.contains('btn') ||
                        element.classList.contains('stat-label') ||
                        element.classList.contains('stat-number') ||
                        element.tagName === 'CITE' ||
                        element.tagName === 'STRONG') {
                        element.textContent = text;
                    }
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update title
        const title = document.querySelector('title');
        if (title && title.getAttribute('data-' + lang)) {
            title.textContent = title.getAttribute('data-' + lang);
        }

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && metaDesc.getAttribute('data-' + lang)) {
            metaDesc.setAttribute('content', metaDesc.getAttribute('data-' + lang));
        }

        // Save preference
        localStorage.setItem('preferredLanguage', lang);
        
        console.log('Language changed to:', lang);
    }

    // Add click events to language buttons
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setLanguage(this.dataset.lang);
        });
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLang);

    // ========================================
    // Navigation Scroll Effect
    // ========================================
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');

    function handleScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            if (scrollTopBtn) {
                scrollTopBtn.classList.add('visible');
            }
        } else {
            navbar.classList.remove('scrolled');
            if (scrollTopBtn) {
                scrollTopBtn.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', handleScroll);

    // ========================================
    // Scroll to Top
    // ========================================
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ========================================
    // Active Navigation Link on Scroll
    // ========================================
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ========================================
    // Hero Carousel / Slideshow
    // ========================================
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    console.log('Carousel slides found:', carouselSlides.length);

    function showSlide(index) {
        carouselSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselSlides.length;
        console.log('Changing to slide:', currentSlide);
        showSlide(currentSlide);
    }

    // Auto-advance slides
    if (carouselSlides.length > 0) {
        let slideTimer = setInterval(nextSlide, slideInterval);

        // Pause on hover
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', function() {
                clearInterval(slideTimer);
                console.log('Carousel paused');
            });

            hero.addEventListener('mouseleave', function() {
                slideTimer = setInterval(nextSlide, slideInterval);
                console.log('Carousel resumed');
            });
        }
    }

    // ========================================
    // Portfolio Filter
    // ========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            // Filter items
            portfolioItems.forEach(item => {
                const category = item.dataset.category;

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ========================================
    // Portfolio Lightbox
    // ========================================
    const lightbox = document.getElementById('portfolioLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImageIndex = 0;
    let visibleImages = [];

    // Get all visible portfolio images
    function getVisibleImages() {
        const items = document.querySelectorAll('.portfolio-item');
        visibleImages = Array.from(items).filter(item => item.style.display !== 'none');
        return visibleImages;
    }

    // Open lightbox
    function openLightbox(index) {
        const items = getVisibleImages();
        if (items.length === 0) return;
        
        currentImageIndex = index;
        const item = items[currentImageIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.portfolio-overlay span');
        
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        updateNavButtons();
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigate images
    function showImage(index) {
        const items = getVisibleImages();
        if (items.length === 0) return;
        
        // Handle wrap-around
        if (index < 0) {
            currentImageIndex = items.length - 1;
        } else if (index >= items.length) {
            currentImageIndex = 0;
        } else {
            currentImageIndex = index;
        }
        
        const item = items[currentImageIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.portfolio-overlay span');
        
        // Fade out
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            // Fade in
            lightboxImage.style.opacity = '1';
        }, 200);
        
        updateNavButtons();
    }

    function updateNavButtons() {
        // Update aria labels for accessibility
        lightboxPrev.setAttribute('aria-label', 'Previous image');
        lightboxNext.setAttribute('aria-label', 'Next image');
    }

    // Add click events to portfolio items
    getVisibleImages().forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
        
        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Open image in lightbox');
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Re-attach events when filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                getVisibleImages().forEach((item, index) => {
                    item.onclick = function() {
                        openLightbox(index);
                    };
                });
            }, 100);
        });
    });

    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Navigation buttons
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() {
            showImage(currentImageIndex - 1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() {
            showImage(currentImageIndex + 1);
        });
    }

    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showImage(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showImage(currentImageIndex + 1);
        }
    });

    // Image transition
    if (lightboxImage) {
        lightboxImage.style.transition = 'opacity 0.2s ease';
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========================================
    // Privacy Modal
    // ========================================
    const privacyModal = document.getElementById('privacyModal');
    const modalClose = document.getElementById('modalClose');
    const legalLinks = document.querySelectorAll('.legal-link');

    if (legalLinks.length > 0) {
        legalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (privacyModal) {
                    privacyModal.classList.add('active');
                }
            });
        });
    }

    if (modalClose && privacyModal) {
        modalClose.addEventListener('click', function() {
            privacyModal.classList.remove('active');
        });

        privacyModal.addEventListener('click', function(e) {
            if (e.target === privacyModal) {
                privacyModal.classList.remove('active');
            }
        });
    }

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && privacyModal && privacyModal.classList.contains('active')) {
            privacyModal.classList.remove('active');
        }
    });

    // ========================================
    // Current Year in Footer
    // ========================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ========================================
    // Intersection Observer for Animations
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Add stagger animation for grid items
                if (entry.target.classList.contains('service-card') || 
                    entry.target.classList.contains('portfolio-item') ||
                    entry.target.classList.contains('testimonial-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = (index * 0.1) + 's';
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .about-content, .contact-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // ========================================
    // Stats Counter Animation
    // ========================================
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateStats(element) {
        const statNumbers = element.querySelectorAll('.stat-number');

        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const hasK = text.includes('K');
            const hasPlus = text.includes('+');
            const number = parseFloat(text.replace(/[^0-9.]/g, ''));

            if (!isNaN(number)) {
                let current = 0;
                const increment = number / 50;
                const duration = 2000;
                const stepTime = duration / 50;

                const timer = setInterval(function() {
                    current += increment;
                    if (current >= number) {
                        current = number;
                        clearInterval(timer);
                    }

                    let display = current.toFixed(0);
                    if (hasK) display += 'K';
                    if (hasPlus) display += '+';

                    stat.textContent = display;
                }, stepTime);
            }
        });
    }

    // ========================================
    // Service Cards Hover Effect
    // ========================================
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // ========================================
    // Console Branding
    // ========================================
    console.log('%c🌸 Luisana Beauty Spa 🌸', 'font-size: 20px; font-weight: bold; color: #d4a5a5;');
    console.log('%cWeb Design by Christian Herencia', 'font-size: 14px; color: #666;');
    console.log('%chttps://christian-freelance.us/', 'font-size: 12px; color: #d4a5a5;');

});
