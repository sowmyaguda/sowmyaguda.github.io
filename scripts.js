// Enhanced Portfolio Script with Modern Features
(function() {
  'use strict';

  // Theme Management
  const ThemeManager = {
    init() {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const saved = localStorage.getItem('theme');
      const isLight = saved ? saved === 'light' : prefersLight;
      
      if (isLight) document.documentElement.classList.add('theme-light');
      this.updateThemeIcon(isLight);
      this.bindEvents();
    },

    updateThemeIcon(isLight) {
      const icon = document.querySelector('#themeToggle i');
      if (icon) {
        icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    },

    toggle() {
      const isLight = !document.documentElement.classList.contains('theme-light');
      document.documentElement.classList.toggle('theme-light', isLight);
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      this.updateThemeIcon(isLight);
    },

    bindEvents() {
      document.addEventListener('click', (e) => {
        if (e.target.closest('#themeToggle')) {
          this.toggle();
        }
      });
    }
  };

  // Particle System
  const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: 0, y: 0 },

    init() {
      this.canvas = document.getElementById('particles-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.createParticles();
      this.bindEvents();
      this.animate();
    },

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    createParticles() {
      const particleCount = Math.min(100, Math.floor(window.innerWidth / 15));
      this.particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: Math.random() > 0.5 ? '100, 255, 218' : '245, 125, 255'
        });
      }
    },

    updateParticle(particle) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += dx * force * 0.0001;
        particle.vy += dy * force * 0.0001;
      }

      // Boundaries
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Keep in bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    },

    drawParticle(particle) {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
      this.ctx.fill();

      // Draw connections
      this.particles.forEach(other => {
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(${particle.color}, ${0.1 * (1 - distance / 80)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      });
    },

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach(particle => {
        this.updateParticle(particle);
        this.drawParticle(particle);
      });

      requestAnimationFrame(() => this.animate());
    },

    bindEvents() {
      window.addEventListener('resize', () => this.resize());
      
      this.canvas.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
    }
  };

  // Navigation Enhancement
  const Navigation = {
    init() {
      this.bindEvents();
      this.updateOnScroll();
    },

    bindEvents() {
      // Smooth close mobile navbar on link click
      document.querySelectorAll('.navbar .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href.startsWith('#')) {
            e.preventDefault();
            this.smoothScrollTo(href);
          }
          
          const navCollapse = document.getElementById('navbars');
          if (navCollapse && navCollapse.classList.contains('show')) {
            const collapse = new bootstrap.Collapse(navCollapse);
            collapse.hide();
          }
        });
      });

      // Navbar scroll style
      window.addEventListener('scroll', () => this.updateOnScroll(), { passive: true });
    },

    smoothScrollTo(target) {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    },

    updateOnScroll() {
      const nav = document.querySelector('.navbar-glass');
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50);
      }

      // Update active nav link
      this.updateActiveLink();
    },

    updateActiveLink() {
      const sections = document.querySelectorAll('section[id], header[id]');
      const navLinks = document.querySelectorAll('.navbar .nav-link');
      
      let current = '';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  };

  // Typing Animation
  const TypingAnimation = {
    element: null,
    phrases: [
      'Software Engineer',
      'ML Enthusiast', 
      'Problem Solver',
      'Data-Driven Builder',
      'Full-Stack Developer',
      'AI Researcher'
    ],
    
    init() {
      this.element = document.getElementById('typed');
      if (this.element && window.Typed) {
        new Typed('#typed', {
          strings: this.phrases,
          typeSpeed: 80,
          backSpeed: 50,
          backDelay: 2000,
          startDelay: 500,
          loop: true,
          showCursor: false
        });
      } else {
        // Fallback if Typed.js not loaded
        this.fallbackTyping();
      }
    },

    fallbackTyping() {
      if (!this.element) return;
      
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      
      const type = () => {
        const currentPhrase = this.phrases[phraseIndex];
        
        if (isDeleting) {
          this.element.textContent = currentPhrase.substring(0, charIndex - 1);
          charIndex--;
        } else {
          this.element.textContent = currentPhrase.substring(0, charIndex + 1);
          charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
          typeSpeed = 2000;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % this.phrases.length;
        }
        
        setTimeout(type, typeSpeed);
      };
      
      setTimeout(type, 1000);
    }
  };

  // Scroll Animations
  const ScrollAnimations = {
    init() {
      this.observeElements();
      if (window.AOS) {
        AOS.init({
          duration: 800,
          once: true,
          offset: 100,
          easing: 'ease-out-quart',
          disable: 'mobile'
        });
      } else {
        // Fallback: ensure elements with data-aos are visible if AOS fails to load
        this.enableAOSFallback();
      }
    },

    enableAOSFallback() {
      try {
        document.querySelectorAll('[data-aos]').forEach(el => {
          // Mirror AOS behavior so CSS shows content
          el.classList.add('aos-init', 'aos-animate');
        });
      } catch (_) {
        // no-op
      }
    },

    observeElements() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.animateSkills(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
      });

      // Observe skills section for progress animation
      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        observer.observe(skillsSection);
      }
    },

    animateSkills(target) {
      if (target.id === 'skills') {
        const chips = target.querySelectorAll('.chips span');
        chips.forEach((chip, index) => {
          setTimeout(() => {
            chip.style.transform = 'translateY(0)';
            chip.style.opacity = '1';
          }, index * 100);
        });
      }
    }
  };

  // Project Cards Enhancement
  const ProjectCards = {
    init() {
      this.bindEvents();
    },

    bindEvents() {
      const projectCards = document.querySelectorAll('.project');
      
      projectCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
          this.handleCardHover(e.currentTarget, true);
        });
        
        card.addEventListener('mouseleave', (e) => {
          this.handleCardHover(e.currentTarget, false);
        });
      });
    },

    handleCardHover(card, isHovering) {
      const icon = card.querySelector('.project-icon');
      const links = card.querySelectorAll('.project-link');
      
      if (isHovering) {
        if (icon) {
          icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        links.forEach((link, index) => {
          setTimeout(() => {
            link.style.transform = 'translateY(-3px) scale(1.05)';
          }, index * 50);
        });
      } else {
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
        links.forEach(link => {
          link.style.transform = 'translateY(0) scale(1)';
        });
      }
    }
  };

  // Performance Optimization
  const PerformanceOptimizer = {
    init() {
      this.optimizeAnimations();
      this.lazyLoadImages();
    },

    optimizeAnimations() {
      // Disable animations on low-end devices
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
      }

      // Reduce motion for users who prefer it
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduce-motion');
      }
    },

    lazyLoadImages() {
      const images = document.querySelectorAll('img[loading="lazy"]');
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      }
    }
  };

  // Utility Functions
  const Utils = {
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  };

  // Initialize everything when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Navigation.init();
    ScrollAnimations.init();
    ProjectCards.init();
    PerformanceOptimizer.init();
    
    // Initialize particle system after a short delay
    setTimeout(() => {
      ParticleSystem.init();
    }, 500);
    
    // Initialize typing animation
    if (document.readyState === 'complete') {
      TypingAnimation.init();
    } else {
      window.addEventListener('load', () => {
        TypingAnimation.init();
      });
    }

    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Add smooth scroll behavior to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  });

  // Handle window resize
  window.addEventListener('resize', Utils.debounce(() => {
    if (ParticleSystem.canvas) {
      ParticleSystem.resize();
    }
  }, 250));

  // Preload critical resources
  const preloadCriticalResources = () => {
    const criticalResources = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@400;500&display=swap',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = resource;
      document.head.appendChild(link);
    });
  };

  // Initialize preloading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalResources);
  } else {
    preloadCriticalResources();
  }

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Resume auto-detect: show Download button if assets/resume.pdf exists
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    fetch(resumeBtn.getAttribute('href'), { method: 'HEAD' })
      .then(r => { if (r.ok) resumeBtn.classList.remove('d-none'); })
      .catch(() => {});
  }

  // Back to top button behavior
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleTop = () => backToTop.classList.toggle('show', window.scrollY > 300);
    window.addEventListener('scroll', toggleTop, { passive: true });
    toggleTop();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();
