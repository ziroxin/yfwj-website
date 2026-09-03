/* ========================================
   有风无界 - 使用说明书交互（侧边栏版）
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const sections = document.querySelectorAll('.content-section');

    // Mobile sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            toggleBackdrop(sidebar.classList.contains('active'));
        });
    }

    // Backdrop overlay for mobile sidebar
    function toggleBackdrop(show) {
        let backdrop = document.querySelector('.sidebar-backdrop');
        if (show) {
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.className = 'sidebar-backdrop';
                document.body.appendChild(backdrop);
                backdrop.addEventListener('click', () => {
                    sidebar.classList.remove('active');
                    toggleBackdrop(false);
                });
            }
            backdrop.classList.add('active');
        } else if (backdrop) {
            backdrop.classList.remove('active');
        }
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            toggleBackdrop(false);
        }
    });

    // Mobile nav toggle (top-right hamburger → right drawer)
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    const navClose = document.getElementById('navClose');

    function toggleNavBackdrop(show) {
        let bd = document.querySelector('.nav-backdrop');
        if (show) {
            if (!bd) {
                bd = document.createElement('div');
                bd.className = 'nav-backdrop';
                document.body.appendChild(bd);
                bd.addEventListener('click', closeNav);
            }
            bd.classList.add('active');
        } else if (bd) {
            bd.classList.remove('active');
        }
    }

    function closeNav() {
        if (navMobile) navMobile.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        toggleNavBackdrop(false);
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMobile.classList.toggle('active');
            menuToggle.classList.toggle('active');
            toggleNavBackdrop(isOpen);
        });
    }

    if (navClose) {
        navClose.addEventListener('click', closeNav);
    }

    // Click anywhere on header bar to close
    const navHeader = document.querySelector('.nav-mobile-header');
    if (navHeader) {
        navHeader.addEventListener('click', closeNav);
    }

    // Close nav drawer when clicking nav links
    if (navMobile) {
        navMobile.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeNav);
        });
    }

    // Helper: collapse all submenus
    function collapseAllSubmenus() {
        sidebarItems.forEach(item => {
            item._userExpanded = false;
            item.classList.remove('expanded');
            const link = item.querySelector('.sidebar-link');
            if (link) link.classList.remove('expanded');
            const sub = item.querySelector('.sidebar-submenu');
            if (sub) sub.classList.remove('active');
        });
    }

    // Helper: expand a specific submenu
    function expandSubmenu(item) {
        const submenu = item.querySelector('.sidebar-submenu');
        if (!submenu) return;
        item._userExpanded = true;
        item.classList.add('expanded');
        const link = item.querySelector('.sidebar-link');
        if (link) link.classList.add('expanded');
        submenu.classList.add('active');
    }

    // Primary link click: expand own submenu (if any), collapse others, scroll
    sidebarItems.forEach(item => {
        const primaryLink = item.querySelector('.sidebar-link');

        primaryLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            collapseAllSubmenus();
            expandSubmenu(item);

            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            primaryLink.classList.add('active');

            // Scroll to section
            const sectionId = primaryLink.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                const headerOffset = 80;
                const offset = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offset, behavior: 'instant' });
            }

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                toggleBackdrop(false);
            }
        });
    });

    // Sidebar link click — submenu links only
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('sidebar-link--sub')) {
                e.preventDefault();

                const parentItem = link.closest('.sidebar-item');
                collapseAllSubmenus();
                expandSubmenu(parentItem);

                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                const parentLink = parentItem.querySelector('.sidebar-link');
                if (parentLink) parentLink.classList.add('active');

                const href = link.getAttribute('href');
                const targetSection = href ? document.querySelector(href) : null;
                if (targetSection) {
                    const headerOffset = 80;
                    const offset = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offset, behavior: 'instant' });
                }

                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    toggleBackdrop(false);
                }
            }
        });
    });

    // Scroll spy - highlight current section and expand its submenu
    let lastSectionId = '';
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId === lastSectionId) return;
                lastSectionId = sectionId;

                // Find the primary link for this section
                let matchedPrimaryItem = null;
                sidebarItems.forEach(item => {
                    const link = item.querySelector('.sidebar-link');
                    if (link && link.getAttribute('data-section') === sectionId) {
                        matchedPrimaryItem = item;
                    }
                });

                // Also check sub-links
                if (!matchedPrimaryItem) {
                    sidebarLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.substring(1) === sectionId && link.classList.contains('sidebar-link--sub')) {
                            matchedPrimaryItem = link.closest('.sidebar-item');
                        }
                    });
                }

                if (matchedPrimaryItem) {
                    collapseAllSubmenus();
                    expandSubmenu(matchedPrimaryItem);
                }

                // Update active state
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    const linkHref = link.getAttribute('href');
                    const matchSection = link.getAttribute('data-section') === sectionId;
                    const matchSub = linkHref && linkHref.substring(1) === sectionId;
                    if (matchSection || matchSub) {
                        link.classList.add('active');
                        if (link.classList.contains('sidebar-link--sub')) {
                            const parentItem = link.closest('.sidebar-item');
                            if (parentItem) {
                                const parentLink = parentItem.querySelector('.sidebar-link');
                                if (parentLink) parentLink.classList.add('active');
                            }
                        }
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all sections and h2 sub-sections
    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
    document.querySelectorAll('h2[id]').forEach(h2 => {
        observer.observe(h2);
    });

    // FAQ accordion
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Smooth scroll for anchor links (fallback)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
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

    // Lightbox
    const allImages = Array.from(document.querySelectorAll('.doc-img'));
    if (allImages.length > 0) {
        let currentIndex = 0;

        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <button class="lightbox-close" aria-label="关闭">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <button class="lightbox-nav lightbox-prev" aria-label="上一张">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button class="lightbox-nav lightbox-next" aria-label="下一张">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
            </button>
            <div class="lightbox-container">
                <img class="lightbox-img" src="" alt="">
            </div>
            <div class="lightbox-toolbar">
                <button class="lb-zoom-out" aria-label="缩小">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </button>
                <span class="lightbox-counter">1 / 39</span>
                <button class="lb-zoom-in" aria-label="放大">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </button>
            </div>
        `;
        document.body.appendChild(overlay);

        const lbImg = overlay.querySelector('.lightbox-img');
        const counter = overlay.querySelector('.lightbox-counter');
        let scale = 1, translateX = 0, translateY = 0;
        let isDragging = false, dragStartX = 0, dragStartY = 0, imgStartX = 0, imgStartY = 0;

        function applyTransform() {
            lbImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            lbImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
        }

        function updateSlide() {
            lbImg.src = allImages[currentIndex].src;
            lbImg.alt = allImages[currentIndex].alt;
            counter.textContent = `${currentIndex + 1} / ${allImages.length}`;
            scale = 1;
            translateX = 0;
            translateY = 0;
            applyTransform();
        }

        function openLightbox(index) {
            currentIndex = index;
            updateSlide();
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        allImages.forEach((img, i) => {
            img.addEventListener('click', () => openLightbox(i));
        });

        overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });

        overlay.querySelector('.lightbox-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
            updateSlide();
        });

        overlay.querySelector('.lightbox-next').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % allImages.length;
            updateSlide();
        });

        overlay.querySelector('.lb-zoom-in').addEventListener('click', (e) => {
            e.stopPropagation();
            scale = Math.min(scale + 0.25, 3);
            applyTransform();
        });

        overlay.querySelector('.lb-zoom-out').addEventListener('click', (e) => {
            e.stopPropagation();
            scale = Math.max(scale - 0.25, 0.5);
            applyTransform();
        });

        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
                updateSlide();
            }
            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % allImages.length;
                updateSlide();
            }
        });

        overlay.addEventListener('wheel', (e) => {
            if (!overlay.classList.contains('active')) return;
            e.preventDefault();
            if (e.deltaY < 0) {
                scale = Math.min(scale + 0.1, 3);
            } else {
                scale = Math.max(scale - 0.1, 0.5);
            }
            applyTransform();
        }, { passive: false });

        // Drag to pan
        lbImg.addEventListener('mousedown', (e) => {
            if (scale <= 1) return;
            e.preventDefault();
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            imgStartX = translateX;
            imgStartY = translateY;
            lbImg.style.cursor = 'grabbing';
            lbImg.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            translateX = imgStartX + (e.clientX - dragStartX);
            translateY = imgStartY + (e.clientY - dragStartY);
            applyTransform();
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            lbImg.style.transition = '';
            applyTransform();
        });
    }
});
