/**
 * PRANAV GHOSH - DEDICATED PRODUCT CASE STUDY INTERACTIVITY
 * 1. Ultra-Smooth Scroll-Reveal Intersection Observer
 * 2. Sticky 6-Part Narrative ScrollSpy (rAF Throttled for 120Hz display smoothness)
 * 3. Interactive Revenue Model Calculator (Live Formulas & Assumptions)
 * 4. Specular 3D Lighting & Damped Tilt for Web Window Preview
 * 5. Canvas Preview Screenshot Renderer (1440x900)
 * 6. Mobile Navigation & WhatsApp CTAs
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------
  // 1. Ultra-Smooth Scroll-Reveal Intersection Observer
  // -------------------------------------------------------------
  const initScrollReveal = () => {
    const revealTargets = document.querySelectorAll(
      '.cs-section, .workflow-card, .impact-metric-pill, .proof-card, .pipeline-step, .calculator-container, .cs-conversion-cta, .cs-meta-pill, .cs-web-window, .cs-comparison-grid, .cs-formula-card, .frontier-card'
    );

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealTargets.forEach((el) => {
      if (!el.classList.contains('revealed')) {
        el.classList.add('scroll-reveal');
        observer.observe(el);
      }
    });
  };

  initScrollReveal();

  // -------------------------------------------------------------
  // 2. Sticky Narrative ScrollSpy (rAF Throttled)
  // -------------------------------------------------------------
  const storyLinks = document.querySelectorAll('.cs-story-link');
  const sections = document.querySelectorAll('.cs-section');

  let ticking = false;
  const onScroll = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    storyLinks.forEach((link) => {
      const href = link.getAttribute('href')?.replace('#', '');
      if (href === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  // Smooth click scroll
  storyLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href')?.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // -------------------------------------------------------------
  // 3. Specular Glow for Web Window Preview (Smooth morphing without tilt)
  // -------------------------------------------------------------
  if (!prefersReducedMotion) {
    const webWindows = document.querySelectorAll('.cs-web-window');
    webWindows.forEach((win) => {
      let rect = null;

      const onMouseEnter = () => {
        rect = win.getBoundingClientRect();
        win.style.setProperty('--spot-opacity', '1');
      };

      const onMouseMove = (e) => {
        if (!rect) rect = win.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;

        win.style.setProperty('--mouse-x', `${px.toFixed(1)}%`);
        win.style.setProperty('--mouse-y', `${py.toFixed(1)}%`);
      };

      const onMouseLeave = () => {
        win.style.setProperty('--spot-opacity', '0');
        rect = null;
      };

      win.addEventListener('mouseenter', onMouseEnter, { passive: true });
      win.addEventListener('mousemove', onMouseMove, { passive: true });
      win.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  // -------------------------------------------------------------
  // 4. Interactive Revenue Model Calculator
  // -------------------------------------------------------------
  const calcContainer = document.querySelector('.calculator-container');
  if (calcContainer) {
    const volInput = document.getElementById('calc-vol');
    const priceInput = document.getElementById('calc-price');
    const volValDisplay = document.getElementById('calc-vol-val');
    const priceValDisplay = document.getElementById('calc-price-val');

    const outMrr = document.getElementById('out-mrr');
    const outCogs = document.getElementById('out-cogs');
    const outContribution = document.getElementById('out-contribution');
    const outMargin = document.getElementById('out-margin');

    // Unit cost model from data attributes (default fallback)
    const unitCost = parseFloat(calcContainer.dataset.unitCost || '0.02');
    const isPerUnit = calcContainer.dataset.modelType === 'per-unit'; // e.g. per-document vs subscription

    const updateCalculator = () => {
      const vol = parseFloat(volInput?.value || 0);
      const price = parseFloat(priceInput?.value || 0);

      if (volValDisplay) {
        volValDisplay.textContent = vol.toLocaleString();
      }
      if (priceValDisplay) {
        priceValDisplay.textContent = `$${price.toFixed(2)}`;
      }

      let mrr = 0;
      let cogs = 0;

      if (isPerUnit) {
        // e.g. Documents per month * Price per document
        mrr = vol * price;
        cogs = vol * unitCost;
      } else {
        // e.g. Subscribing organizations * Monthly subscription fee
        mrr = vol * price;
        // Assume variable cloud/API cost per active account
        cogs = vol * unitCost;
      }

      const contribution = Math.max(0, mrr - cogs);
      const marginPct = mrr > 0 ? (contribution / mrr) * 100 : 0;

      if (outMrr) outMrr.textContent = `$${Math.round(mrr).toLocaleString()}`;
      if (outCogs) outCogs.textContent = `$${Math.round(cogs).toLocaleString()}`;
      if (outContribution) outContribution.textContent = `$${Math.round(contribution).toLocaleString()}`;
      if (outMargin) outMargin.textContent = `${marginPct.toFixed(1)}%`;
    };

    volInput?.addEventListener('input', updateCalculator);
    priceInput?.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // -------------------------------------------------------------
  // 5. Navbar Navigation & Connect Modal
  // -------------------------------------------------------------
  const brandAnchor = document.querySelector('.brand-anchor');
  brandAnchor?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../index.html#overview';
  });

  const pillConsultant = document.getElementById('nav-pill-consultant');
  pillConsultant?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../index.html#dashboard';
  });

  const pillBuilder = document.getElementById('nav-pill-builder');
  pillBuilder?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../index.html#products';
  });

  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  mobileToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../index.html#products';
  });

  const btnConnect = document.getElementById('btn-open-connect-modal');
  const connectModal = document.getElementById('connect-modal');
  const connectClose = document.getElementById('connect-modal-close');

  btnConnect?.addEventListener('click', () => {
    connectModal?.classList.add('open');
  });

  const closeModal = () => connectModal?.classList.remove('open');
  connectClose?.addEventListener('click', closeModal);

  connectModal?.addEventListener('click', (e) => {
    if (e.target === connectModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && connectModal?.classList.contains('open')) {
      closeModal();
    }
  });

  const copyEmailBtn = document.getElementById('btn-copy-email');
  copyEmailBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText('pranavghosh19@gmail.com').then(() => {
      copyEmailBtn.textContent = 'COPIED!';
      setTimeout(() => {
        copyEmailBtn.textContent = 'COPY EMAIL';
      }, 2000);
    });
  });

  // -------------------------------------------------------------
  // 6. Canvas Preview Screenshot Renderer (1440x900)
  // -------------------------------------------------------------
  const previewCanvases = document.querySelectorAll('.cs-preview-canvas');
  previewCanvases.forEach((canvas) => {
    const src = canvas.dataset.previewSrc;
    if (!src) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = src;

    const render = () => {
      canvas.width = 1440;
      canvas.height = 900;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, 1440, 900);
      canvas.classList.add('rendered');
    };

    img.onload = render;
    if (img.complete && img.naturalWidth) {
      render();
    }
  });

  const refreshBtns = document.querySelectorAll('.btn-refresh-window');
  refreshBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const windowEl = btn.closest('.cs-web-window');
      const canvas = windowEl?.querySelector('.cs-preview-canvas');
      if (canvas) {
        canvas.classList.remove('animate-blurIn');
        void canvas.offsetWidth;
        canvas.classList.add('animate-blurIn');
      }
    });
  });
});
