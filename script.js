/* ========================================
   有风无界 - 宣传网站交互
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Guide accordion
    const guideTriggers = document.querySelectorAll('.guide-trigger');
    
    guideTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.guide-item');
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.guide-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        observer.observe(item);
    });

    // Observe contact cards
    document.querySelectorAll('.contact-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });

    // Add animate-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);

    // Active nav link highlight
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('nav-link--active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav-link--active');
                    }
                });
            }
        });
    });

    // Changelog collapse/expand
    document.querySelectorAll('.timeline-list').forEach(list => {
        const items = list.querySelectorAll('li');
        if (items.length < 5) return;

        const extra = document.createElement('div');
        extra.className = 'timeline-extra';
        for (let i = 2; i < items.length; i++) {
            extra.appendChild(items[i]);
        }
        list.appendChild(extra);

        const btn = document.createElement('button');
        btn.className = 'timeline-expand-btn';
        btn.textContent = `展开全部 (共 ${items.length} 条)`;
        list.parentElement.appendChild(btn);

        btn.addEventListener('click', () => {
            const expanded = list.classList.toggle('expanded');
            btn.textContent = expanded
                ? '收起'
                : `展开全部 (共 ${items.length} 条)`;
        });
    });

    // Back to Top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Hero phone carousel
    const slides = document.querySelectorAll('.phone-slide');
    if (slides.length > 1) {
        let current = 0;
        let timer = null;
        const carousel = document.querySelector('.phone-carousel');
        const prevBtn = document.querySelector('.carousel-btn--prev');
        const nextBtn = document.querySelector('.carousel-btn--next');

        function goTo(index) {
            slides[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
        }

        function resetTimer() {
            clearInterval(timer);
            timer = setInterval(() => goTo(current + 1), 3000);
        }

        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current - 1); resetTimer(); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current + 1); resetTimer(); });

        if (carousel) {
            carousel.addEventListener('mouseenter', () => clearInterval(timer));
            carousel.addEventListener('mouseleave', () => resetTimer());
        }

        resetTimer();
    }
});
