// Enhanced JavaScript with Modern Interactions

// Global Variables
let currentTestimonial = 0;
let isLoading = true;
let animationObserver;

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');
const loadingPercentage = document.getElementById('loading-percentage');
const scrollProgress = document.getElementById('scroll-progress');
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Loading Screen Animation
document.addEventListener('DOMContentLoaded', function() {
    simulateLoading();
});

function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = progress + '%';
        loadingPercentage.textContent = Math.floor(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                isLoading = false;
                initializeWebsite();
            }, 500);
        }
    }, 100);
}

// Initialize Website After Loading
function initializeWebsite() {
    initializeScrollEffects();
    initializeNavigationEffects();
    initializeAnimationObserver();
    initializeCounterAnimations();
    initializeTestimonialCarousel();
    initializeContactForm();
    initializeFloatingElements();
    initializeProgressCircles();
    initializeParallaxEffects();
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', handleScroll);
    
    function handleScroll() {
        if (isLoading) return;
        
        updateScrollProgress();
        updateHeaderBackground();
        updateParallaxElements();
    }
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
    
    function updateHeaderBackground() {
        const scrolled = window.pageYOffset > 100;
        header.classList.toggle('scrolled', scrolled);
    }
    
    function updateParallaxElements() {
        const scrollTop = window.pageYOffset;
        
        // Hero parallax effect
        const heroShapes = document.querySelectorAll('.shape');
        heroShapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = scrollTop * speed;
            shape.style.transform = `translateY(${yPos}px)`;
        });
        
        // Floating emojis parallax
        const floatingEmojis = document.querySelectorAll('.floating-emoji');
        floatingEmojis.forEach((emoji, index) => {
            const speed = 0.3 + (index * 0.05);
            const yPos = scrollTop * speed;
            emoji.style.transform = `translateY(${yPos}px) rotate(${scrollTop * 0.1}deg)`;
        });
    }
}

// Navigation Effects
function initializeNavigationEffects() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking nav links
    document.querySelectorAll('.nav-link-enhanced').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        animateHamburger();
    }
    
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        resetHamburger();
    }
    
    function animateHamburger() {
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            resetHamburger();
        }
    }
    
    function resetHamburger() {
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'rotate(0) translate(0, 0)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0) translate(0, 0)';
    }
}

// Animation Observer for Scroll Animations
function initializeAnimationObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .service-card-enhanced,
        .about-card,
        .featured-content,
        .instructor-card-enhanced,
        .schedule-card,
        .info-card
    `);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        animationObserver.observe(element);
    });
}

// Counter Animations
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let hasAnimated = false;
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    if (counters.length > 0) {
        counterObserver.observe(counters[0].closest('.hero-stats-enhanced'));
    }
    
    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }
}

// Testimonial Carousel
function initializeTestimonialCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card-enhanced');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    if (testimonialCards.length === 0) return;
    
    // Initialize carousel
    showTestimonial(0);
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', previousTestimonial);
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Auto-advance carousel
    setInterval(nextTestimonial, 5000);
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show selected testimonial
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
            dots[index]?.classList.add('active');
            currentTestimonial = index;
        }
    }
    
    function nextTestimonial() {
        const nextIndex = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(nextIndex);
    }
    
    function previousTestimonial() {
        const prevIndex = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(prevIndex);
    }
}

// Enhanced Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactFormEnhanced');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmission);
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidationError);
    });
    
    async function handleFormSubmission(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.btn-submit');
        
        // Show loading state
        setLoadingState(submitBtn, true);
        
        try {
            // Create WhatsApp message
            const whatsappMessage = createWhatsAppMessage(formData);
            
            // Submit form
            const response = await fetch('enhanced-contact.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('Thank you! Your message has been sent successfully. Redirecting to WhatsApp...', 'success');
                contactForm.reset();
                
                // Redirect to WhatsApp after 2 seconds
                setTimeout(() => {
                    window.open('https://wa.me/918209490538?text=' + encodeURIComponent(whatsappMessage), '_blank');
                }, 2000);
            } else {
                showMessage(result.message || 'Sorry, there was an error. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('Network error. Redirecting to WhatsApp...', 'error');
            
            // Fallback to WhatsApp
            const whatsappMessage = createWhatsAppMessage(formData);
            setTimeout(() => {
                window.open('https://wa.me/918209490538?text=' + encodeURIComponent(whatsappMessage), '_blank');
            }, 1000);
        } finally {
            setLoadingState(submitBtn, false);
        }
    }
    
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        
        // Remove existing error styling
        field.classList.remove('error');
        removeFieldError(field);
        
        // Validate based on field type
        if (field.required && !value) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[+]?[0-9]{10,15}$/;
            if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    function removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function clearValidationError(e) {
        const field = e.target;
        field.classList.remove('error');
        removeFieldError(field);
    }
    
    function setLoadingState(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
    
    function createWhatsAppMessage(formData) {
        const name = formData.get('name');
        const phone = formData.get('phone');
        const service = formData.get('service');
        const message = formData.get('message');
        
        let whatsappText = `Hi! I'm interested in joining U-Can Fitness Studio.\n\n`;
        whatsappText += `Name: ${name}\n`;
        whatsappText += `Phone: ${phone}\n`;
        whatsappText += `Program Interest: ${getServiceDisplayName(service)}\n`;
        
        if (message) {
            whatsappText += `Message: ${message}\n`;
        }
        
        whatsappText += `\nPlease contact me for more information about classes and schedules.`;
        
        return whatsappText;
    }
    
    function getServiceDisplayName(value) {
        const serviceNames = {
            'trampoline': '🏆 Trampoline Zumba (Signature)',
            'zumba': '🎵 Zumba Fitness',
            'hiit': '🔥 HIIT Training',
            'aerobics': '🏃 Aerobics',
            'yoga': '🧘 Power Yoga',
            'meditation': '☮️ Meditation',
            'all': '🎯 All Programs'
        };
        
        return serviceNames[value] || value;
    }
    
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;
        
        // Insert before form
        contactForm.parentNode.insertBefore(messageDiv, contactForm);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Floating Elements Animation
function initializeFloatingElements() {
    // Animate service cards on hover
    const serviceCards = document.querySelectorAll('.service-card-enhanced');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate about cards
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Animate buttons with ripple effect
    const animatedButtons = document.querySelectorAll('.btn-primary-enhanced, .btn-secondary-enhanced, .btn-featured, .service-btn');
    animatedButtons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
    
    function createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // WhatsApp button floating animation
    const whatsappBtn = document.querySelector('.floating-whatsapp');
    if (whatsappBtn) {
        setInterval(() => {
            whatsappBtn.style.animation = 'none';
            setTimeout(() => {
                whatsappBtn.style.animation = 'float 3s ease-in-out infinite';
            }, 10);
        }, 5000);
    }
}

// Progress Circles Animation
function initializeProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle[data-progress]');
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const progress = parseInt(circle.getAttribute('data-progress'));
                animateProgress(circle, progress);
                progressObserver.unobserve(circle);
            }
        });
    }, { threshold: 0.5 });
    
    progressCircles.forEach(circle => {
        progressObserver.observe(circle);
    });
    
    function animateProgress(circle, targetProgress) {
        let currentProgress = 0;
        const duration = 2000;
        const increment = targetProgress / (duration / 16);
        
        const timer = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= targetProgress) {
                currentProgress = targetProgress;
                clearInterval(timer);
            }
            
            circle.style.setProperty('--progress', currentProgress);
        }, 16);
    }
}

// Parallax Effects
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-shapes, .floating-emojis');
    
    window.addEventListener('scroll', () => {
        if (isLoading) return;
        
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const elementHeight = rect.height;
            
            if (scrollTop + windowHeight >= elementTop && scrollTop <= elementTop + elementHeight) {
                const speed = element.classList.contains('hero-shapes') ? 0.5 : 0.3;
                const yPos = (scrollTop - elementTop) * speed;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

// Intersection Observer for Progressive Enhancement
function createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
    };
    
    return new IntersectionObserver(callback, defaultOptions);
}

// Utility Functions
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .field-error {
        color: #EF4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #EF4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
`;
document.head.appendChild(rippleStyle);

// Enhanced Performance Monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime);
        }
    }
});

// Observe performance metrics
if ('PerformanceObserver' in window) {
    performanceObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
}

// Service Worker Registration for Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful');
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Final initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components when page is fully loaded
    console.log('U-Can Fitness Studio website loaded successfully!');
    
    // Add final touches
    document.body.classList.add('loaded');
});

// Error handling for production
window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
});

// Enhanced user experience optimizations
if ('IntersectionObserver' in window) {
    // Modern browser optimizations
    console.log('Enhanced features enabled');
} else {
    // Fallback for older browsers
    console.log('Basic features enabled');
}
