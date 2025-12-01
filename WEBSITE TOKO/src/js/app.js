// Simplified application logic - smooth and fast
(function() {
  'use strict';

  // ===== WELCOME SCREEN & MUSIC TRIGGER =====
  const welcomeScreen = document.getElementById('welcomeScreen');
  const enterBtn = document.getElementById('enterWebsite');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  let isMusicPlaying = false;

  if (enterBtn && welcomeScreen && bgMusic) {
    enterBtn.addEventListener('click', () => {
      // Start music
      bgMusic.volume = 0.3;
      const playPromise = bgMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicPlaying = true;
          musicIcon.textContent = '🔊';
          if (musicToggle) {
            musicToggle.classList.add('playing');
            musicToggle.style.display = 'flex';
          }
        }).catch(() => {
          console.log('Autoplay prevented');
        });
      }
      
      // Hide welcome screen with animation
      welcomeScreen.style.opacity = '0';
      setTimeout(() => {
        welcomeScreen.style.display = 'none';
      }, 500);
    });
  }

  // Music toggle button
  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
      if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        musicIcon.textContent = '🔇';
        musicToggle.classList.remove('playing');
      } else {
        bgMusic.play().then(() => {
          isMusicPlaying = true;
          musicIcon.textContent = '🔊';
          musicToggle.classList.add('playing');
        }).catch(() => {});
      }
    });
  }

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

  // ===== SERVICE FUNCTIONS =====
  
  window.orderTurnitin = function() {
    window.open(waLink('Halo Ka, Saya Mau Cek Turnitin'), '_blank');
  };

  window.orderParafrase = function() {
    window.open('https://s.id/cekbiayaparafrase', '_blank');
  };

  window.orderNaskah = function() {
    window.open(waLink('Halo Ka, Saya Mau Jasa Perbaikan Naskah (Daftar Isi, Daftar Pustaka, Mendeley, Margin, atau lainnya)'), '_blank');
  };

  window.orderJurnal = function() {
    window.open(waLink('Halo Ka, Saya Mau Konsultasi untuk Publish Jurnal'), '_blank');
  };

  window.orderPowerPoint = function() {
    window.open(waLink('Halo Ka, Saya Mau Jasa Pembuatan PowerPoint'), '_blank');
  };

  window.orderCustom = function() {
    window.open(waLink('Halo Ka, saya mau order layanan lainnya (sebutkan layanan yang anda inginkan)'), '_blank');
  };

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

  window.orderApp = function(appName) {
    const message = `Halo Ka, saya mau order ${appName}`;
    window.open(waLink(message), '_blank');
  };

  window.orderCustomApp = function() {
    const message = 'Halo Ka, saya mau order apk (apk yang anda inginkan) apakah ada?';
    window.open(waLink(message), '_blank');
  };

  // ===== SEARCH FUNCTIONALITY =====
  
  if (search) {
    search.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      
      // Search in layanan cards
      const layananCards = document.querySelectorAll('.layanan-card');
      layananCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? '' : 'none';
      });
      
      // Search in app items
      const appItems = document.querySelectorAll('.app-item');
      const appsList = document.getElementById('digitalAppsList');
      let hasVisibleApp = false;
      
      appItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const isVisible = text.includes(searchTerm);
        item.style.display = isVisible ? '' : 'none';
        if (isVisible) hasVisibleApp = true;
      });
      
      // Auto-expand apps list if searching and found results
      if (searchTerm && hasVisibleApp && appsList && !appsList.classList.contains('open')) {
        toggleDigitalApps();
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
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

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header') && mainNav.classList.contains('mobile-open')) {
        mainNav.classList.remove('mobile-open');
        mobileMenuToggle.querySelector('span').textContent = '☰';
      }
    });
  }

  // ===== SIMPLE COUNTER ANIMATION =====
  
  const animateCounter = (element, target) => {
    let start = 1;
    const duration = 2000;
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

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const counterElements = entry.target.querySelectorAll('.stat-number[data-target]');
        counterElements.forEach((element) => {
          const target = parseInt(element.getAttribute('data-target'));
          animateCounter(element, target);
        });
      }
    });
  }, { threshold: 0.5 });

  const homeStats = document.querySelector('.home-stats');
  if (homeStats) {
    statsObserver.observe(homeStats);
  }

  // ===== SIMPLE SLIDE-IN ANIMATIONS =====
  
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // Layanan cards - alternate from left/right
  document.querySelectorAll('.layanan-card').forEach((card, index) => {
    card.classList.add('slide-in');
    card.classList.add(index % 2 === 0 ? 'from-left' : 'from-right');
    slideObserver.observe(card);
  });

  // App items - from bottom
  document.querySelectorAll('.app-item').forEach(item => {
    item.classList.add('slide-in', 'from-bottom');
    slideObserver.observe(item);
  });

  // Other sections
  document.querySelectorAll('.contact-box, .disclaimer-content').forEach(el => {
    el.classList.add('slide-in', 'from-bottom');
    slideObserver.observe(el);
  });

})();
