// Main application logic
(function() {
  'use strict';

  // DOM Elements
  const listEl = document.getElementById('product-list');
  const filtersEl = document.getElementById('filters');
  const yearEl = document.getElementById('year');
  const search = document.getElementById('search');

  // WhatsApp Configuration
  const WA_NUMBER = '62895374651500';
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  // Set current year in footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== PRODUCT RENDERING =====
  
  // Format currency
  function formatMoney(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Render products
  function renderProducts(items = PRODUCTS) {
    if (!listEl) return;
    
    if (items.length === 0) {
      listEl.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">Tidak ada produk ditemukan</p>';
      return;
    }

    listEl.innerHTML = items.map(product => `
      <article class="card" data-id="${product.id}">
        <img src="${product.img}" alt="${product.title}" loading="lazy" />
        <div class="card-body">
          <div class="card-title">${product.title}</div>
          <div class="card-desc">${product.desc}</div>
          <div class="card-row">
            <div class="price">${formatMoney(product.price)}</div>
            <a class="btn btn-ghost btn-sm" 
               href="${waLink('Halo Ka, saya mau pesan: ' + product.title)}" 
               target="_blank"
               rel="noopener">
              Beli
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // ===== FILTERS =====
  
  // Get unique categories
  const categories = ['Semua', ...new Set(PRODUCTS.map(p => p.category))];
  
  // Render filter chips
  if (filtersEl) {
    filtersEl.innerHTML = categories.map(cat => 
      `<button class="chip ${cat === 'Semua' ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');

    // Filter click handler
    filtersEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const category = btn.dataset.cat;
      const filteredProducts = category === 'Semua' 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.category === category);

      renderProducts(filteredProducts);

      // Update active state
      filtersEl.querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b === btn);
      });
    });
  }

  // ===== SEARCH =====
  
  if (search) {
    search.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query === '') {
        // Show all sections
        document.querySelectorAll('.layanan-card, .app-item').forEach(item => {
          item.style.display = '';
        });
        return;
      }
      
      // Search in layanan akademik
      const layananCards = document.querySelectorAll('.layanan-card');
      layananCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
      });
      
      // Search in digital apps
      const appItems = document.querySelectorAll('.app-item');
      const appsList = document.getElementById('digitalAppsList');
      let hasVisibleApps = false;
      
      appItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const isVisible = text.includes(query);
        item.style.display = isVisible ? '' : 'none';
        if (isVisible) hasVisibleApps = true;
      });
      
      // Auto-expand apps list if search matches apps
      if (hasVisibleApps && appsList && !appsList.classList.contains('open')) {
        toggleDigitalApps();
      }
    });
  }

  // ===== SERVICE FUNCTIONS =====
  
  // Turnitin Order
  window.orderTurnitin = function() {
    window.open(waLink('Halo Ka, Saya Mau Cek Turnitin'), '_blank');
  };

  // Parafrase Order
  window.orderParafrase = function() {
    window.open('https://s.id/cekbiayaparafrase', '_blank');
  };

  // Perbaikan Naskah
  window.orderNaskah = function() {
    window.open(waLink('Halo Ka, Saya Mau Jasa Perbaikan Naskah (Daftar Isi, Daftar Pustaka, Mendeley, Margin, atau lainnya)'), '_blank');
  };

  // Publish Jurnal
  window.orderJurnal = function() {
    window.open(waLink('Halo Ka, Saya Mau Konsultasi untuk Publish Jurnal'), '_blank');
  };

  // Toggle Digital Apps List
  window.toggleDigitalApps = function() {
    const appsList = document.getElementById('digitalAppsList');
    const toggleBtn = document.querySelector('.digital-toggle');
    
    if (appsList) {
      appsList.classList.toggle('open');
    }
    
    if (toggleBtn) {
      toggleBtn.classList.toggle('active');
    }
  };

  // Order Specific App (without price parameter)
  window.orderApp = function(appName) {
    const message = `Halo Ka, saya mau order ${appName}`;
    window.open(waLink(message), '_blank');
  };

  // Order Custom App
  window.orderCustomApp = function() {
    const customApp = prompt('Sebutkan nama aplikasi yang Anda inginkan:');
    if (customApp) {
      window.open(waLink('Halo Ka, saya mau order aplikasi: ' + customApp), '_blank');
    }
  };

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Close mobile menu if open
        const nav = document.getElementById('mainNav');
        if (nav && nav.classList.contains('mobile-open')) {
          nav.classList.remove('mobile-open');
        }
      }
    });
  });

  // ===== MOBILE MENU TOGGLE =====
  
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
      const isOpen = mainNav.classList.contains('mobile-open');
      mobileMenuToggle.querySelector('span').textContent = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header') && mainNav.classList.contains('mobile-open')) {
        mainNav.classList.remove('mobile-open');
        mobileMenuToggle.querySelector('span').textContent = '☰';
      }
    });
  }

  // ===== INITIAL RENDER =====
  
  // No longer render products grid since we have collapsible list
  // renderProducts();

  // ===== SIMPLE ANIMATIONS =====
  
  // Simple Counter Animation
  const animateCounter = (element, target, duration = 2000) => {
    let start = 1;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  };

  // Observe stats section for counter animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const counterElements = entry.target.querySelectorAll('.stat-number[data-target]');
        counterElements.forEach((element, index) => {
          const target = parseInt(element.getAttribute('data-target'));
          setTimeout(() => animateCounter(element, target), index * 200);
        });
      }
    });
  }, { threshold: 0.5 });

  const homeStats = document.querySelector('.home-stats');
  if (homeStats) {
    statsObserver.observe(homeStats);
  }

  // Stagger animation for service cards with enhanced effects
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          entry.target.classList.add('animated');
        }, index * 100);
        staggerObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards with enhanced transition
  document.querySelectorAll('.layanan-card, .app-item, .disclaimer-content').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px) scale(0.9)';
    card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    staggerObserver.observe(card);
  });

  // Floating animation for hero CTA buttons
  const ctaButtons = document.querySelectorAll('.hero-cta .btn');
  ctaButtons.forEach((btn, index) => {
    btn.style.animation = `floatIn 0.8s ease forwards ${0.5 + index * 0.2}s`;
    btn.style.opacity = '0';
  });

  // Magnetic effect for buttons
  const magneticButtons = document.querySelectorAll('.btn-primary, .service-card-clean, .app-item');
  magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0) scale(1)';
    });
  });

  // Smooth reveal for about section
  const aboutContent = document.querySelector('.about-content');
  if (aboutContent) {
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
          aboutObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    aboutContent.style.opacity = '0';
    aboutObserver.observe(aboutContent);
  }

  // Pulse animation for section dividers
  const dividers = document.querySelectorAll('.section-divider');
  dividers.forEach(divider => {
    const dividerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'expandWidth 0.8s ease forwards';
          dividerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    divider.style.width = '0';
    dividerObserver.observe(divider);
  });

  // Animated gradient background
  let angle = 0;
  const hero = document.querySelector('.hero');
  if (hero) {
    setInterval(() => {
      angle = (angle + 1) % 360;
      hero.style.background = `linear-gradient(${135 + angle * 0.1}deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)`;
    }, 50);
  }

  // Ripple effect on service cards click
  document.querySelectorAll('.service-card-clean, .app-item').forEach(card => {
    card.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Typing effect for hero title (on load)
  const heroTitle = document.querySelector('.hero-copy h1');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    
    let index = 0;
    const typeWriter = () => {
      if (index < text.length) {
        heroTitle.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 50);
      }
    };
    
    setTimeout(typeWriter, 500);
  }

  // Smooth number increment animation when digital apps open
  const originalToggle = window.toggleDigitalApps;
  window.toggleDigitalApps = function() {
    originalToggle();
    
    const appsList = document.getElementById('digitalAppsList');
    if (appsList && appsList.classList.contains('open')) {
      const apps = appsList.querySelectorAll('.app-item');
      apps.forEach((app, index) => {
        app.style.animation = `slideInLeft 0.4s ease forwards ${index * 0.05}s`;
        app.style.opacity = '0';
      });
    }
  };

  // Logo rotation on hover
  const logo = document.querySelector('.logo-img');
  if (logo) {
    logo.addEventListener('mouseenter', () => {
      logo.style.animation = 'rotate360 0.6s ease';
    });
    logo.addEventListener('animationend', () => {
      logo.style.animation = '';
    });
  }

  // Enhanced particles effect on hero (more dramatic)
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
    particle.style.opacity = Math.random() * 0.6 + 0.3;
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.appendChild(particle);
      setTimeout(() => particle.remove(), 7000);
    }
  };

  // Create more particles for dramatic effect
  setInterval(createParticle, 200);
  
  // Parallax scroll effect for hero section
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const logoSection = document.querySelector('.logo-section');
        
        if (hero) {
          hero.style.transform = `translateY(${scrolled * 0.4}px)`;
          hero.style.opacity = 1 - (scrolled / 600);
        }
        
        if (logoSection && scrolled < 400) {
          logoSection.style.transform = `translateY(${scrolled * 0.2}px) scale(${1 - scrolled / 2000})`;
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });

  // Add shimmer effect to price tags
  const prices = document.querySelectorAll('.app-price, .service-price-clean');
  prices.forEach(price => {
    price.addEventListener('mouseenter', () => {
      price.style.animation = 'shimmer 0.6s ease';
    });
    price.addEventListener('animationend', () => {
      price.style.animation = '';
    });
  });

  // ===== BACKGROUND MUSIC AUTO-PLAY =====
  
  // Handle music autoplay with user interaction fallback
  const bgMusic = document.getElementById('bgMusic');
  
  if (bgMusic) {
    // Try to play music immediately
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay is blocked, play on first user interaction
        const playOnInteraction = () => {
          bgMusic.play().catch(() => {});
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
          document.removeEventListener('scroll', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
        document.addEventListener('scroll', playOnInteraction);
      });
    }
    
    // Set volume to comfortable level
    bgMusic.volume = 0.3;
  }

})();
