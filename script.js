/* ==========================================================================
   TJKT SMART NETWORK - ENTERPRISE INTERACTIVITY SCRIPT (2026 EDITION)
   Fitur: Preloader Screen, Hero Particle Canvas, Sticky Glass Navbar,
          Stats Counter Up, Scroll Reveal, Gallery Lightbox Modal,
          Testimonial Auto Slider, Accordion FAQ, & Contact Form Handler.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ----------------------------------------------------------------------
    // 1. PRELOADER SCREEN CONTROLLER
    // ----------------------------------------------------------------------
    const preloader = document.getElementById("preloader");
    const preloaderProgress = document.getElementById("preloaderProgress");
    const preloaderText = document.getElementById("preloaderText");

    let progress = 0;
    const progressInterval = setInterval(function () {
        progress += Math.floor(Math.random() * 15) + 10;
        if (progress > 100) progress = 100;

        if (preloaderProgress) {
            preloaderProgress.style.width = progress + "%";
        }

        if (progress === 100) {
            clearInterval(progressInterval);
            if (preloaderText) preloaderText.textContent = "Sistem Siap!";
            setTimeout(function () {
                if (preloader) preloader.classList.add("fade-out");
            }, 300);
        }
    }, 80);

    // ----------------------------------------------------------------------
    // 2. HERO NETWORK PARTICLE CANVAS
    // ----------------------------------------------------------------------
    const canvas = document.getElementById("particleCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", function () {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const numParticles = Math.min(Math.floor(width / 25), 45);

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2.5 + 1.5
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);

            // Draw line connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw dots
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            }

            requestAnimationFrame(drawParticles);
        }

        drawParticles();
    }

    // ----------------------------------------------------------------------
    // 3. NAVBAR STICKY, HAMBURGER & SCROLLSPY HIGHLIGHT
    // ----------------------------------------------------------------------
    const header = document.getElementById("mainHeader");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const backToTopBtn = document.getElementById("backToTop");

    // Hamburger Toggle
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener("click", function () {
            hamburgerBtn.classList.toggle("open");
            navMenu.classList.toggle("open");
        });

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener("click", function () {
                hamburgerBtn.classList.remove("open");
                navMenu.classList.remove("open");
            });
        });
    }

    // Handle Scroll Effects
    function handleScroll() {
        const scrollY = window.scrollY;

        // Sticky Navbar Glassmorphism
        if (header) {
            if (scrollY > 50) {
                header.classList.add("scroll");
            } else {
                header.classList.remove("scroll");
            }
        }

        // Back To Top Button
        if (backToTopBtn) {
            if (scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        }

        // Highlight Active Page Menu Link (Multi-Page Site)
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            link.classList.remove("active");
            if (href === currentPage || (currentPage === "" && href === "index.html")) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // Back to Top Click
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ----------------------------------------------------------------------
    // 4. STATISTIK COUNTER-UP ANIMATION
    // ----------------------------------------------------------------------
    const counters = document.querySelectorAll(".counter");
    let counterTriggered = false;

    function runCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute("data-target"), 10);
            let count = 0;
            const speed = target / 50;

            function updateCount() {
                count += speed;
                if (count < target) {
                    counter.textContent = Math.ceil(count);
                    setTimeout(updateCount, 30);
                } else {
                    counter.textContent = target;
                }
            }
            updateCount();
        });
    }

    const statsSection = document.getElementById("statistik");
    if (statsSection && "IntersectionObserver" in window) {
        const statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterTriggered) {
                    counterTriggered = true;
                    runCounters();
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    } else if (statsSection) {
        runCounters();
    }

    // ----------------------------------------------------------------------
    // 5. SCROLL REVEAL OBSERVER
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("active"));
    }

    // ----------------------------------------------------------------------
    // 6. GALERI LIGHTBOX MODAL
    // ----------------------------------------------------------------------
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxDesc = document.getElementById("lightboxDesc");
    const lightboxClose = document.getElementById("lightboxClose");

    if (lightboxModal && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener("click", function () {
                const src = item.getAttribute("data-src");
                const title = item.getAttribute("data-title");
                const desc = item.getAttribute("data-desc");

                if (lightboxImg) lightboxImg.src = src;
                if (lightboxTitle) lightboxTitle.textContent = title;
                if (lightboxDesc) lightboxDesc.textContent = desc;

                lightboxModal.classList.add("open");
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener("click", function () {
                lightboxModal.classList.remove("open");
            });
        }

        lightboxModal.addEventListener("click", function (e) {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove("open");
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && lightboxModal.classList.contains("open")) {
                lightboxModal.classList.remove("open");
            }
        });
    }

    // ----------------------------------------------------------------------
    // 7. TESTIMONIAL CAROUSEL SLIDER
    // ----------------------------------------------------------------------
    const slides = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.getElementById("slidePrev");
    const nextBtn = document.getElementById("slideNext");
    let currentSlide = 0;
    let slideTimer;

    function showSlide(index) {
        if (slides.length === 0) return;
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === currentSlide) slide.classList.add("active");
        });

        dots.forEach((dot, i) => {
            dot.classList.remove("active");
            if (i === currentSlide) dot.classList.add("active");
        });
    }

    function startAutoSlide() {
        slideTimer = setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(slideTimer);
        startAutoSlide();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", function () {
            showSlide(currentSlide - 1);
            resetAutoSlide();
        });

        nextBtn.addEventListener("click", function () {
            showSlide(currentSlide + 1);
            resetAutoSlide();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener("click", function () {
            showSlide(i);
            resetAutoSlide();
        });
    });

    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
    }

    // ----------------------------------------------------------------------
    // 8. ACCORDION FAQ
    // ----------------------------------------------------------------------
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const header = item.querySelector(".faq-header");
        const body = item.querySelector(".faq-body");

        if (header && body) {
            header.addEventListener("click", function () {
                const isActive = item.classList.contains("active");

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove("active");
                    const otherBody = otherItem.querySelector(".faq-body");
                    if (otherBody) otherBody.style.maxHeight = null;
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add("active");
                    body.style.maxHeight = body.scrollHeight + "px";
                }
            });
        }
    });

    // ----------------------------------------------------------------------
    // 9. FORM KONTAK HANDLER
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("formName")?.value || "";
            const email = document.getElementById("formEmail")?.value || "";
            const service = document.getElementById("formService")?.value || "";
            const message = document.getElementById("formMessage")?.value || "";

            const waMessage = `Halo TJKT Smart Network,\nSaya ${name} (${email}).\nIngin berkonsultasi mengenai: ${service}.\n\nPesan: ${message}`;
            const waUrl = `https://wa.me/6285875139458?text=${encodeURIComponent(waMessage)}`;

            window.open(waUrl, "_blank");
            contactForm.reset();
        });
    }

    // ----------------------------------------------------------------------
    // 10. EFEK SATISFYING CLICK PADA FEATURE CARDS (01 - 06)
    // ----------------------------------------------------------------------
    const featureCards = document.querySelectorAll(".feature-card");

    function playSatisfyingClickSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            // Oscillator 1: High crisp pop
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (err) {
            // Audio context gesture fallback
        }
    }

    featureCards.forEach(card => {
        card.addEventListener("click", function (e) {
            // 1. Play synthesized soft pop sound
            playSatisfyingClickSound();

            // 2. Create shockwave ripple effect at click coordinates
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement("span");
            ripple.className = "card-ripple";
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            card.appendChild(ripple);

            setTimeout(() => ripple.remove(), 700);

            // 3. Trigger bounce animation
            card.classList.remove("clicked");
            void card.offsetWidth; // Trigger reflow
            card.classList.add("clicked");

            // 4. Toggle active status
            const isSelected = card.classList.contains("active-selected");
            featureCards.forEach(c => c.classList.remove("active-selected"));
            
            const tag = card.querySelector(".card-status-tag");
            if (!isSelected) {
                card.classList.add("active-selected");
                if (tag) tag.innerHTML = "✓ Terpilih & Terverifikasi";
            } else {
                if (tag) tag.innerHTML = "✦ Klik untuk detail";
            }
        });
    });

});