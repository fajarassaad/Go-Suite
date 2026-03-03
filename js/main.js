// ============================================================
// GO SUITE — Mobile-Native Landing Page Scripts
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Scroll-based navbar background ----
    const topNav = document.querySelector('.top-nav');
    if (topNav) {
        window.addEventListener('scroll', () => {
            topNav.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    // ---- IntersectionObserver for fade-in animations ----
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        fadeEls.forEach(el => observer.observe(el));
    }

    // ---- FAQ Accordion ----
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const wasOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item.open').forEach(el => {
                el.classList.remove('open');
            });

            // Toggle clicked
            if (!wasOpen) {
                item.classList.add('open');
            }
        });
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSelector = link.getAttribute('href');
            if (!targetSelector || targetSelector === '#') return;
            const target = document.querySelector(targetSelector);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Active bottom nav based on current page ----
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.bottom-nav a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });

    // ---- Cost comparison bars animation ----
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.cost-bar-fill').forEach(bar => {
                    bar.style.width = bar.dataset.width || bar.style.width;
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.cost-bars').forEach(el => barObserver.observe(el));

    // ---- Tabs Implementation ----
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.closest('.tab-list')._isDragging) return;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // ---- Tab list drag-to-scroll (mouse) ----
    document.querySelectorAll('.tab-list').forEach(tabList => {
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        tabList._isDragging = false;

        tabList.addEventListener('mousedown', (e) => {
            isDown = true;
            tabList._isDragging = false;
            startX = e.pageX - tabList.offsetLeft;
            scrollLeft = tabList.scrollLeft;
            tabList.style.cursor = 'grabbing';
            tabList.style.userSelect = 'none';
        });

        tabList.addEventListener('mouseleave', () => {
            isDown = false;
            tabList.style.cursor = '';
            tabList.style.userSelect = '';
        });

        tabList.addEventListener('mouseup', () => {
            isDown = false;
            tabList.style.cursor = '';
            tabList.style.userSelect = '';
            setTimeout(() => { tabList._isDragging = false; }, 0);
        });

        tabList.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - tabList.offsetLeft;
            const walk = x - startX;
            if (Math.abs(walk) > 5) tabList._isDragging = true;
            tabList.scrollLeft = scrollLeft - walk;
        });
    });

    const sliderWrapper = document.querySelector('.integrated-slider');
    if (sliderWrapper) {
        const sliderTrack = sliderWrapper.querySelector('.integrated-slider-track');
        const sliderDots = sliderWrapper.querySelectorAll('.integrated-slider-dot');
        const totalSlides = sliderTrack ? sliderTrack.children.length : 0;
        let currentSlide = 0;
        let sliderTimer;

        const activateSlide = (index) => {
            if (!sliderTrack) return;
            currentSlide = index;
            sliderTrack.style.transform = `translateX(-${index * 100}%)`;
            sliderDots.forEach(dot => {
                const isActive = Number(dot.getAttribute('data-slide-dot')) === index;
                dot.setAttribute('aria-selected', String(isActive));
            });
        };

        const startSlider = () => {
            sliderTimer = setInterval(() => {
                activateSlide((currentSlide + 1) % totalSlides);
            }, 6000);
        };

        if (totalSlides > 0) {
            sliderDots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const targetIndex = Number(dot.getAttribute('data-slide-dot'));
                    activateSlide(targetIndex);
                    clearInterval(sliderTimer);
                    startSlider();
                });
            });

            sliderWrapper.addEventListener('mouseenter', () => clearInterval(sliderTimer));
            sliderWrapper.addEventListener('mouseleave', () => startSlider());
            startSlider();
        }
    }

    const lightbox = document.getElementById('integratedSliderLightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const openLightbox = (img, captionText) => {
            if (!lightboxImage || !lightboxCaption) return;
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.textContent = captionText;
            lightbox.setAttribute('data-open', 'true');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        const closeLightbox = () => {
            lightbox.setAttribute('data-open', 'false');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        document.querySelectorAll('.integrated-slider-slide img').forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                const slide = img.closest('.integrated-slider-slide');
                const caption = slide ? slide.querySelector('figcaption')?.textContent : '';
                openLightbox(img, caption || img.alt || '');
            });
        });

        const overlayCloseHandler = (event) => {
            if (event.target === lightbox || event.target === closeButton) {
                closeLightbox();
            }
        };

        lightbox.addEventListener('click', overlayCloseHandler);
        closeButton?.addEventListener('click', () => closeLightbox());
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.getAttribute('data-open') === 'true') {
                closeLightbox();
            }
        });
    }

});

// ---- Bottom Sheet Modal (16 Modules) ----
const btnFitur = document.querySelectorAll('.nav-fitur-trigger');
const backdrop = document.getElementById('fiturModalBackdrop');
const bottomSheet = document.getElementById('fiturBottomSheet');
const closeBtn = document.getElementById('closeFiturBtn');

if (backdrop && bottomSheet) {
    btnFitur.forEach(btn => btn.setAttribute('aria-expanded', 'false'));

    const setFiturNavActive = (isActive) => {
        btnFitur.forEach(btn => {
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-expanded', String(isActive));
        });
    };

    const toggleFiturModal = (e) => {
        if (e) e.preventDefault();
        const isOpen = bottomSheet.classList.contains('show');
        if (isOpen) {
            bottomSheet.classList.remove('show');
            backdrop.classList.remove('show');
            document.body.style.overflow = '';
            setFiturNavActive(false);
        } else {
            bottomSheet.classList.add('show');
            backdrop.classList.add('show');
            document.body.style.overflow = 'hidden';
            setFiturNavActive(true);
        }
    };

    btnFitur.forEach(btn => btn.addEventListener('click', toggleFiturModal));
    if (closeBtn) closeBtn.addEventListener('click', toggleFiturModal);
    backdrop.addEventListener('click', toggleFiturModal);

    // Allow swipe down to close
    let startY = 0;
    let currentY = 0;
    const dragHandle = bottomSheet.querySelector('.sheet-drag-handle');
    
    if (dragHandle) {
        dragHandle.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            bottomSheet.style.transition = 'none';
        }, {passive: true});

        dragHandle.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY - startY;
            if (currentY > 0) {
                bottomSheet.style.transform = "translateX(-50%) translateY(" + currentY + "px)";
            }
        }, {passive: true});

        dragHandle.addEventListener('touchend', () => {
            bottomSheet.style.transition = '';
            if (currentY > 100) {
                toggleFiturModal();
            } else {
                bottomSheet.style.transform = '';
            }
            currentY = 0;
        });
    }
}
