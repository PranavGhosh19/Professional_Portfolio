/**
 * PRANAV GHOSH - DASHBOARD INTERACTIVITY & PAGE ROUTER
 * Page-Based Architecture (Landing Page = Dashboard)
 * Role Perspective Switching (Data & AI Consultant vs AI Product Builder)
 * Hierarchical Sidebar Navigation, Journey Timeline, Live Search, AI Copilot
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. Ambient Cursor Follower Glow
  // -------------------------------------------------------------
  const cursorAmbient = document.getElementById('cursor-ambient-glow');
  if (cursorAmbient) {
    let curX = window.innerWidth / 2, curY = window.innerHeight / 2;
    let targetX = curX, targetY = curY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    const updateCursor = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      cursorAmbient.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(updateCursor);
    };
    updateCursor();
  }

  // -------------------------------------------------------------
  // 2. PAGE-BASED DASHBOARD ROUTER ARCHITECTURE
  // -------------------------------------------------------------
  const allPageViews = document.querySelectorAll('.page-view');
  const navBtnDashboard = document.getElementById('nav-btn-dashboard');
  const navGroupHeaders = document.querySelectorAll('.nav-group-header');
  const navSublinks = document.querySelectorAll('.nav-sublink');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  const breadcrumbRoot = document.querySelector('.breadcrumb-root');
  const brandAnchor = document.querySelector('.brand-anchor');

  const cardToPageMap = {
    // Journey
    'card-journey-bca': 'journey',
    'card-journey-kagolf': 'journey',
    'card-journey-swingstatspro': 'journey',
    'card-journey-masters': 'journey',
    'card-journey-globallogic': 'journey',
    'card-journey-bsk': 'journey',
    'card-journey-ai-builder': 'journey',

    // Experience
    'card-bcg': 'experience',
    'card-globallogic': 'experience',
    'card-kagolf': 'experience',

    // Products (6 Founded AI Products)
    'card-shadowanalytics': 'products',
    'card-wisely': 'products',
    'card-swingstatspro': 'products',
    'card-shipcargo': 'products',
    'card-torquecare': 'products',
    'card-nirvana': 'products',
    'card-niravana': 'products',

    // Projects
    'card-urlguard': 'projects',
    'card-delivery': 'projects',
    'card-movie': 'projects',
    'card-banking': 'projects',
    'card-theeye': 'projects',
    'card-excel': 'projects',

    // Skills
    'card-skill-tech': 'skills',
    'card-skill-bi': 'skills',
    'card-skill-genai': 'skills',
    'card-skill-ml': 'skills',
    'card-skill-de': 'skills',

    // Education
    'card-edu-christ': 'education',
    'card-cert-powerbi': 'education',
    'card-languages': 'education'
  };

  const pageTitles = {
    'dashboard': 'Landing Overview',
    'journey': 'Professional Journey',
    'experience': 'Consulting & Analytics Experience',
    'products': 'AI Product Builder',
    'projects': 'Projects & Case Studies',
    'skills': 'Skills & Capabilities',
    'education': 'Education & Credentials'
  };

  let currentPage = 'dashboard';
  let currentMode = 'consultant'; // 'consultant' | 'builder'

  // -------------------------------------------------------------
  // 2b. Role Mode Switcher (Consultant vs AI Product Builder)
  // When in Consultant mode, hide AI Product Builder from sidebar.
  // When in Builder mode, hide Experience from sidebar.
  // -------------------------------------------------------------
  function setRoleMode(mode, navigate = true) {
    currentMode = mode;
    const sidebar = document.getElementById('dashboard-sidebar');
    if (sidebar) {
      sidebar.setAttribute('data-active-mode', mode);
    }

    const sliderTrack = document.getElementById('nav-role-slider-track');
    if (sliderTrack) {
      sliderTrack.setAttribute('data-mode', mode);
    }

    const pillConsultant = document.getElementById('nav-pill-consultant');
    const pillBuilder = document.getElementById('nav-pill-builder');

    const statusConsultant = document.querySelector('.sidebar-profile-status.status-consultant');
    const statusBuilder = document.querySelector('.sidebar-profile-status.status-builder');

    if (mode === 'consultant') {
      pillConsultant?.classList.add('active');
      pillBuilder?.classList.remove('active');
      statusConsultant?.classList.add('active');
      statusBuilder?.classList.remove('active');
      if (navigate && currentPage === 'products') {
        switchPage('dashboard');
      }
    } else {
      pillBuilder?.classList.add('active');
      pillConsultant?.classList.remove('active');
      statusBuilder?.classList.add('active');
      statusConsultant?.classList.remove('active');
      if (navigate && currentPage !== 'products') {
        switchPage('products');
      }
    }
  }

  // -------------------------------------------------------------
  // Ultra-Smooth Scroll-Reveal Intersection Observer
  // -------------------------------------------------------------
  function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
      '.dashboard-card, .kpi-card, .experience-card-horizontal, .journey-v-card, .landing-welcome-card, .landing-section-header, .product-overview-card, .skill-category-card, .project-compact-card, .metric-box-hero'
    );

    if ('IntersectionObserver' in window) {
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
          rootMargin: '0px 0px -30px 0px'
        }
      );

      revealTargets.forEach((el) => {
        if (!el.classList.contains('revealed')) {
          el.classList.add('scroll-reveal');
          observer.observe(el);
        }
      });
    } else {
      revealTargets.forEach((el) => el.classList.add('revealed'));
    }
  }

  function switchPage(pageId, targetCardId = null, customBreadcrumb = null, openAccordion = true) {
    if (!pageId) pageId = 'dashboard';
    currentPage = pageId;

    // Set active page attribute for layout-level styling (e.g. removing sidebar on products page)
    document.body.setAttribute('data-active-page', pageId);
    const dashboardLayout = document.querySelector('.dashboard-layout');
    if (dashboardLayout) {
      dashboardLayout.setAttribute('data-active-page', pageId);
    }

    // Automatically align role mode when switching to role-specific pages
    if (pageId === 'experience' || pageId === 'dashboard') {
      setRoleMode('consultant', false);
    } else if (pageId === 'products') {
      setRoleMode('builder', false);
    }

    // Synchronize 3D Spatial Motion Scene (Camera transition & sculpture morph)
    if (window.motionScene && typeof window.motionScene.onPageChange === 'function') {
      window.motionScene.onPageChange(pageId);
    }

    // 1. Hide all page views and reveal active target
    allPageViews.forEach((page) => {
      page.classList.remove('active');
    });

    const targetPageView = document.getElementById(`page-${pageId}`);
    if (targetPageView) {
      targetPageView.classList.add('active');
      // Ensure all cards within this page are visible and trigger smooth reveal
      targetPageView.querySelectorAll('.dashboard-card').forEach((c) => {
        c.style.display = 'flex';
      });
      setTimeout(() => initScrollReveal(), 60);
    }

    // 2. Update Sidebar Active Navigation States
    document.querySelectorAll('.nav-direct-link').forEach((link) => {
      const p = link.getAttribute('data-page');
      if (p === pageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    navGroupHeaders.forEach((header) => {
      const p = header.getAttribute('data-page') || header.getAttribute('data-target');
      const parentGrp = header.closest('.nav-group');
      if (p === pageId) {
        header.classList.add('active');
        if (openAccordion) {
          parentGrp?.classList.add('open');
        }
      } else {
        header.classList.remove('active');
        parentGrp?.classList.remove('open');
      }
    });

    if (pageId === 'dashboard' || pageId === 'journey') {
      navSublinks.forEach((s) => s.classList.remove('active'));
    }

    // 3. Update Breadcrumb Text (if element exists)
    if (breadcrumbCurrent) {
      if (customBreadcrumb) {
        breadcrumbCurrent.innerHTML = customBreadcrumb;
      } else {
        breadcrumbCurrent.textContent = pageTitles[pageId] || pageId;
      }
    }

    // 4. Scroll & Card Illumination
    if (targetCardId) {
      const targetCard = document.getElementById(targetCardId);
      if (targetCard) {
        setTimeout(() => {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.querySelectorAll('.dashboard-card').forEach((c) => c.classList.remove('highlighted'));
          targetCard.classList.add('highlighted');
          setTimeout(() => targetCard.classList.remove('highlighted'), 2800);
        }, 80);
      }
    } else {
      window.scrollTo(0, 0);
      const mainContent = document.querySelector('.dashboard-main');
      if (mainContent) {
        mainContent.scrollTo(0, 0);
      }
    }

    // 5. Close Mobile Sidebar Drawer if open
    document.getElementById('dashboard-sidebar')?.classList.remove('mobile-open');
  }

  // Brand and Breadcrumb Return to Dashboard Landing Page
  brandAnchor?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-group').forEach((grp) => grp.classList.remove('open'));
    setRoleMode('consultant', false);
    switchPage('dashboard');
  });

  breadcrumbRoot?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-group').forEach((grp) => grp.classList.remove('open'));
    setRoleMode('consultant', false);
    switchPage('dashboard');
  });

  // Direct Page Buttons (Dashboard, Journey, etc. - non-expanding)
  document.querySelectorAll('.nav-direct-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Close all accordion groups when switching to direct page
      document.querySelectorAll('.nav-group').forEach((grp) => grp.classList.remove('open'));
      const targetPage = btn.getAttribute('data-page');
      if (targetPage) switchPage(targetPage);
    });
  });

  // Navbar Role Buttons: Click to toggle perspective & view
  const navPillConsultant = document.getElementById('nav-pill-consultant');
  const navPillBuilder = document.getElementById('nav-pill-builder');

  navPillConsultant?.addEventListener('click', () => {
    setRoleMode('consultant', true);
    if (currentPage === 'products') {
      switchPage('dashboard');
    }
  });

  navPillBuilder?.addEventListener('click', () => {
    setRoleMode('builder', true);
    if (currentPage !== 'products') {
      switchPage('products');
    }
  });

  // Parent Group Accordion Click: Exclusive Accordion (Closes all other tabs to reduce sidebar space)
  navGroupHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const parentGroup = header.closest('.nav-group');
      const targetPage = header.getAttribute('data-page') || header.getAttribute('data-target');
      const wasOpen = parentGroup?.classList.contains('open');

      // 1. Immediately close ALL other groups to conserve sidebar space
      document.querySelectorAll('.nav-group').forEach((grp) => {
        if (grp !== parentGroup) {
          grp.classList.remove('open');
        }
      });

      // 2. Toggle the clicked group
      if (wasOpen) {
        parentGroup.classList.remove('open');
      } else {
        parentGroup?.classList.add('open');
        if (targetPage && currentPage !== targetPage) {
          switchPage(targetPage, null, null, false);
        }
      }
    });
  });

  // Sub-items click (BCG, GlobalLogic, Torque Care, Niravana, Journey, etc.)
  navSublinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-page') || 'dashboard';
      const cardId = link.getAttribute('data-card');

      navSublinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      const parentGroupLabel = link.closest('.nav-group')?.querySelector('.group-header-label span:last-child')?.textContent || '';
      const subItemText = link.textContent.trim();
      const breadcrumbHtml = `${parentGroupLabel} &gt; <span style="color: var(--yellow-subtle); font-weight: 600;">${subItemText}</span>`;

      switchPage(targetPage, cardId, breadcrumbHtml);
    });
  });

  // Route navigation for cards and action buttons with [data-route]
  document.querySelectorAll('[data-route]').forEach((elem) => {
    elem.addEventListener('click', () => {
      const route = elem.getAttribute('data-route');
      if (route) switchPage(route);
    });
  });

  // Handle in-page smooth deep linking to cards (#card-*) and sections (#section-*)
  document.querySelectorAll('a[href^="#card-"], a[href^="#section-"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        // Ensure parent page is active
        const parentPage = targetEl.closest('.page-view');
        if (parentPage) {
          const pageId = parentPage.id.replace('page-', '');
          if (currentPage !== pageId) {
            switchPage(pageId, targetId);
            return;
          }
        }
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.remove('pulse-target');
        void targetEl.offsetWidth; // re-trigger reflow
        targetEl.classList.add('pulse-target');
        setTimeout(() => targetEl.classList.remove('pulse-target'), 2600);
      }
    });
  });


  // Action buttons with data-page (e.g. "View All Projects →")
  document.querySelectorAll('[data-page]').forEach((el) => {
    if (!el.classList.contains('nav-sublink') && !el.classList.contains('nav-direct-link') && !el.classList.contains('nav-group-header')) {
      el.addEventListener('click', (e) => {
        const page = el.getAttribute('data-page');
        if (page) {
          e.preventDefault();
          switchPage(page);
        }
      });
    }
  });

  // Availability Card Click opens Connect Modal
  const availabilityKpiCard = document.getElementById('kpi-availability-card');
  availabilityKpiCard?.addEventListener('click', () => {
    document.getElementById('connect-modal')?.classList.add('open');
  });

  // Sidebar Footer Profile Click opens Connect Modal
  const sidebarFooterProfile = document.querySelector('.sidebar-footer-profile');
  sidebarFooterProfile?.addEventListener('click', () => {
    document.getElementById('connect-modal')?.classList.add('open');
  });

  // Mobile Sidebar Toggle Button
  const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
  const dashboardSidebar = document.getElementById('dashboard-sidebar');

  mobileSidebarToggle?.addEventListener('click', () => {
    dashboardSidebar?.classList.toggle('mobile-open');
  });

  // -------------------------------------------------------------
  // 3b. AI Product Cards - Direct Click Navigation to Dedicated Case Study Page
  // Clicking anywhere inside a case-study-card opens its dedicated product case study
  // -------------------------------------------------------------
  const caseStudyCards = document.querySelectorAll('.case-study-card');
  caseStudyCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on the live external deployment link, allow native target="_blank"
      const liveLink = e.target.closest('.case-study-live-link');
      if (liveLink) return;

      // If user is selecting text (e.g. copying content), don't navigate
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) return;

      const caseStudyUrl = card.getAttribute('data-case-study-url') || card.getAttribute('data-external-url');
      if (caseStudyUrl) {
        if (e.metaKey || e.ctrlKey) {
          window.open(caseStudyUrl, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = caseStudyUrl;
        }
      }
    });
  });


  // -------------------------------------------------------------
  // 3. Live Dashboard Search Filter (Multi-Page Smart Discovery)
  // -------------------------------------------------------------
  const searchInput = document.getElementById('dashboard-search-input');
  const dashboardCards = document.querySelectorAll('.dashboard-card');

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
      // Restore clean page view state
      switchPage(currentPage);
      dashboardCards.forEach((c) => (c.style.display = 'flex'));
      return;
    }

    let matchCount = 0;
    allPageViews.forEach((page) => {
      let pageHasMatch = false;
      const cardsInPage = page.querySelectorAll('.dashboard-card');
      cardsInPage.forEach((card) => {
        const cardText = card.textContent.toLowerCase();
        if (cardText.includes(query)) {
          card.style.display = 'flex';
          pageHasMatch = true;
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (pageHasMatch) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    if (breadcrumbCurrent) {
      breadcrumbCurrent.innerHTML = `Search: "<span style="color: var(--yellow-subtle);">${query}</span>" (${matchCount} found)`;
    }
  });

  // -------------------------------------------------------------
  // 4. Connect Modal Controls
  // -------------------------------------------------------------
  const connectModal = document.getElementById('connect-modal');
  const openConnectBtn = document.getElementById('btn-open-connect-modal');
  const closeConnectBtn = document.getElementById('connect-modal-close');
  const copyEmailBtn = document.getElementById('btn-copy-email');

  openConnectBtn?.addEventListener('click', () => {
    connectModal?.classList.add('open');
  });

  closeConnectBtn?.addEventListener('click', () => {
    connectModal?.classList.remove('open');
  });

  connectModal?.addEventListener('click', (e) => {
    if (e.target === connectModal) {
      connectModal.classList.remove('open');
    }
  });

  copyEmailBtn?.addEventListener('click', () => {
    const email = "pranavghosh19@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      const original = copyEmailBtn.textContent;
      copyEmailBtn.textContent = "COPIED!";
      copyEmailBtn.style.color = "var(--yellow-subtle)";
      setTimeout(() => {
        copyEmailBtn.textContent = original;
        copyEmailBtn.style.color = "";
      }, 2000);
    });
  });

  // -------------------------------------------------------------
  // 5. Interactive AI Copilot ("Ask Pranav AI")
  // -------------------------------------------------------------
  const copilotOverlay = document.getElementById('copilot-modal');
  const openCopilotBtns = document.querySelectorAll('.trigger-copilot-btn, .btn-trigger-copilot');
  const closeCopilotBtn = document.getElementById('copilot-close-btn');
  const copilotInput = document.getElementById('copilot-input');
  const copilotSendBtn = document.getElementById('copilot-send-btn');
  const copilotMessages = document.getElementById('copilot-messages');
  const promptChips = document.querySelectorAll('.prompt-chip');

  const openCopilot = () => {
    copilotOverlay?.classList.add('open');
    copilotInput?.focus();
  };

  const closeCopilot = () => {
    copilotOverlay?.classList.remove('open');
  };

  openCopilotBtns.forEach((btn) => btn.addEventListener('click', openCopilot));
  closeCopilotBtn?.addEventListener('click', closeCopilot);

  copilotOverlay?.addEventListener('click', (e) => {
    if (e.target === copilotOverlay) closeCopilot();
  });

  // Grounded Knowledge Base for Pranav Ghosh
  const copilotKnowledge = [
    {
      keywords: ['journey', 'timeline', 'career', 'path', 'story'],
      reply: "Pranav's professional journey spans:\n\n• **2025 – May 2026**: Outside Consultant at **Boston Consulting Group (BCG)** (via **PERSOLKELLY Consulting**) across 3 client accounts: **BCG Global HRIS** (Replacing Workday with BCG Global HRIS, Power BI + Copilot Studio AI Agents), **Visa** (Data lineage, STTM/CDE feasibility, automated BI reporting), and **Novartis** (Pharma Commercial Analytics, Power BI reports & dashboards).\n• **2024 – Present**: Founder & Architect of 6 AI platforms (**Shadow Analytics**, **The Wisely App**, **SwingStatsPro**, **ShipCargo**, **Torque Care**, **Nirvana**).\n• **2024 – 2025**: Associate Analyst at **GlobalLogic** across 2 clients: **Wood Mackenzie** & **Continuous**.\n• **2021**: Executive – Data Analytics & Operations at **K&A Golf** (Excel & VBA Automation, Looker Studio BI, AI Product: **SwingStatsPro**).\n• **2021 – 2023**: **M.Sc. in Data Science** at Christ University & Microsoft Certified Power BI Analyst."
    },
    {
      keywords: ['bcg', 'boston consulting', 'consultant', 'experience', 'work', 'visa', 'global hris', 'global hr', 'novartis', 'pharma', 'persolkelly', 'clients'],
      reply: "At **Boston Consulting Group (BCG)** (hired via **PERSOLKELLY Consulting**), Pranav served as an Outside Consultant across **3 Client Engagements**:\n\n1. **BCG Global HRIS**: Spearheaded the launch of BCG Global HRIS to replace Workday (eliminating Workday subscription costs and elevating performance). Built end-to-end Power BI solutions integrating Power Apps, SharePoint, SQL, Python, REST APIs, and Copilot Studio AI Agents—reducing manual reporting efforts by 80%, designing star schema models with 50% performance gains, and creating 20+ client-facing dashboards.\n2. **Visa**: Extracted critical KPIs from Tableau workbooks, analyzed PySpark & Airflow ETL pipelines, performed STTM feasibility checks, and validated Critical Data Elements (CDEs) for Tableau-to-Power BI modernization.\n3. **Novartis**: Developed Power BI reports and interactive commercial analytics dashboards to analyze pharmaceutical sales, brand positioning, market share, and product performance. Designed patient analytics dashboards tracking reach, consumption patterns, and treatment adoption, while integrating field reporting insights for commercial decision-making.\n\n• **Core Tech**: Power BI, Microsoft Copilot Studio, Power Apps, SharePoint, SQL, Python, REST APIs, DAX & Star Schema, Tableau, PySpark, Airflow, and STTM."
    },
    {
      keywords: ['globallogic', 'associate analyst', 'wood mackenzie', 'continuous'],
      reply: "At **GlobalLogic** (July 2024 – September 2025), Pranav was an **Associate Analyst** across **2 Client Engagements**:\n\n1. **Wood Mackenzie**: Conducted financial and market research (Bloomberg, SEC 10-Ks), financial parameters extraction, variance analysis, Excel/VBA workflow automation, and SQL data engineering.\n2. **Continuous**: Engineered multi-domain data extraction solutions (legal, BFSI, automobile), Python document intelligence (Selenium, BeautifulSoup), predictive analytics, and automated reporting.\n\n• **AI Product Built**: **Shadow Analytics** (OCR + Gemini LLM document intelligence SaaS)."
    },
    {
      keywords: ['kagolf', 'k&a golf', 'k&a', 'golf', 'swingstats', 'swingstatspro'],
      reply: "At **K&A Golf**, Pranav served as an **Executive – Data Analytics & Operations**, focusing on data processing, Excel automation, and business intelligence:\n\n• **Excel & VBA Automation**: Built automation solutions using VBA, Macros, and advanced formulas (VLOOKUP, INDEX-MATCH, SUMIFS) to streamline scoring, automate calculations, and eliminate repetitive manual data processing.\n• **Scoring Logic & Metrics**: Engineered custom scoring algorithms and performance models to evaluate player performance, track handicap progression, and monitor shot-level metrics.\n• **Looker Studio BI Dashboards**: Designed interactive Looker Studio dashboards to visualize player performance, scoring patterns, event statistics, and business KPIs for data-driven decision-making.\n• **Market Research & Reporting**: Produced 30+ executive analytical presentations and conducted multi-city market research across 3+ sports products.\n• **AI Product Built**: Conceptualized and developed **SwingStatsPro**, an AI sports telemetry platform combining simulator sensor feeds, launch angle calculations, and pose analysis for automated swing kinematics diagnostics."
    },
    {
      keywords: ['shadow analytics', 'shadow', 'document intelligence', 'ocr', 'gemini'],
      reply: "**Shadow Analytics** (https://shadowanalytics19.vercel.app/) is an AI document intelligence SaaS platform founded and built by Pranav Ghosh.\n\nIt extracts structured information from scanned PDFs using **Tesseract OCR** and **Google Gemini LLM**, with user-defined schemas, bounding boxes, confidence scores, and Excel export."
    },
    {
      keywords: ['wisely', 'the wisely app', 'splitwise', 'expense', 'finance'],
      reply: "**The Wisely App (Better than Splitwise)** (https://www.thewiselyapp.com) is an AI-powered personal and group finance platform founded by Pranav as an enhanced alternative to Splitwise, featuring net position calculations, automated budget optimization, spending alerts, and offline caching."
    },
    {
      keywords: ['swingstatspro', 'swingstats', 'golf ai', 'sports tech'],
      reply: "**SwingStatsPro** is an AI sports analytics and golf telemetry platform created in connection with Pranav's work at **K&A Golf**.\n\nIt combines **computer vision pose estimation** with **simulator telemetry** (clubhead speed, launch angle, spin rate, and carry distance) to evaluate swing kinematics and provide automated practice drills."
    },
    {
      keywords: ['shipcargo', 'cargo', 'freight', 'logistics', 'shipping', 'containers'],
      reply: "**ShipCargo** is an intelligent freight and global logistics coordination platform engineered by Pranav.\n\nIt simplifies cross-border cargo bookings, dynamic route pricing, real-time container vessel telemetry (e.g. Singapore to Rotterdam), and customs workflow automation to eliminate transit delays."
    },
    {
      keywords: ['torque care', 'torque', 'vehicle', 'automotive', 'car care', 'wash'],
      reply: "**Torque Care** is an AI-powered vehicle diagnostic, wash verification, and predictive maintenance platform founded and designed by Pranav.\n\nIt analyzes real-time sensor telemetry, decodes OBD-II diagnostic trouble codes into plain English using generative AI, tracks missed vehicle wash routines, and ensures transparent billing."
    },
    {
      keywords: ['niravana', 'nirvana', 'wellness', 'mindfulness', 'companion', 'mental health'],
      reply: "**Nirvana** is an AI mental wellness and habit-building platform founded by Pranav.\n\nIt features empathetic conversational LLM agents with personalized behavioral memory, emotional sentiment tracking, and acoustic ambient sound synthesis via the Web Audio API to help users de-stress and sustain healthier routines."
    },
    {
      keywords: ['domain', 'retail', 'bfsi', 'people', 'hr', 'energy', 'legal', 'automation', 'pharma', 'life science'],
      reply: "Pranav's domain expertise spans **Retail, BFSI (Banking, Financial Services, Insurance), People & HR Analytics, Energy, Legal, Automation, Pharma, and Life Science**.\n\nHe has delivered end-to-end data analytics, executive dashboard reporting, and workflow automation across these core sectors."
    },
    {
      keywords: ['skills', 'stack', 'technologies', 'tools', 'python', 'sql', 'power bi'],
      reply: "Pranav's core skills include:\n\n• **Data Analytics & BI**: Advanced Excel, Power BI (DAX, Star Schema, RLS), Tableau, SQL, Google Spreadsheets, EDA.\n• **Programming & ML**: Python (Pandas, NumPy, Scikit-learn), R Programming, Regression, Classification, Clustering, CNNs.\n• **GenAI & Document Intelligence**: LLMs, Google Gemini API, Tesseract OCR, RAG, Prompt Engineering, Copilot Studio.\n• **Data Engineering**: ETL Pipelines, Source-to-Target Mapping (STDM), Data Validation, Power Query, VBA."
    },
    {
      keywords: ['education', 'degree', 'christ', 'university', 'certification', 'master'],
      reply: "Pranav holds an **Academic Degree (Highest Degree): M.Sc in Data Science** from **Christ University** and is a **Microsoft Certified: Power BI Data Analyst Associate**."
    },
    {
      keywords: ['availability', 'join', 'hire', 'location', 'delhi', 'relocate', 'notice period'],
      reply: "Pranav is based in **Delhi, India** and is an **Immediate Joiner**. He is completely open to relocation and remote opportunities globally.\n\nEmail: pranavghosh19@gmail.com\nLinkedIn: https://www.linkedin.com/in/pranavghosh19/\nCV: https://drive.google.com/file/d/1pM4QU5h2h_4ncfhvDfFU4LmVK_NWsJRH/view?usp=sharing"
    }
  ];

  const handleCopilotSend = () => {
    const text = copilotInput?.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    copilotInput.value = '';

    setTimeout(() => {
      const lower = text.toLowerCase();
      let matchedReply = null;

      for (const item of copilotKnowledge) {
        if (item.keywords.some((kw) => lower.includes(kw))) {
          matchedReply = item.reply;
          break;
        }
      }

      if (!matchedReply) {
        matchedReply = `Pranav has **2.7+ years of Consulting & Analytic Experience** (Strategy Consulting, Strategy and Ops, Data, Business & Insights, Data Visualisations, Data Scientist), an **M.Sc in Data Science**, domain depth in **Retail, BFSI, People & HR Analytics, Energy, Legal, Automation, Pharma & Life Science**, and is the founder/architect of **6 AI platforms** (**Shadow Analytics**, **The Wisely App**, **SwingStatsPro**, **ShipCargo**, **Torque Care**, and **Nirvana**). Feel free to ask about his **career journey**, **client engagements**, **6 AI Products**, **skills**, or **immediate availability**!`;
      }

      appendMessage(matchedReply, 'assistant');
    }, 400);
  };

  const appendMessage = (content, sender) => {
    if (!copilotMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    bubble.innerHTML = formatted;
    copilotMessages.appendChild(bubble);
    copilotMessages.scrollTop = copilotMessages.scrollHeight;
  };

  copilotSendBtn?.addEventListener('click', handleCopilotSend);
  copilotInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCopilotSend();
  });

  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (copilotInput) {
        copilotInput.value = chip.textContent.trim();
        handleCopilotSend();
      }
    });
  });

  // -------------------------------------------------------------
  // 3D SPATIAL MOTION, SCROLL DEPTH & HOLOGRAPHIC CARD TILT ENGINE
  // -------------------------------------------------------------

  // 1. Interactive 3D Holographic Card Tilt & Specular Shine
  const interactiveCards = document.querySelectorAll(
    '.dashboard-card, .kpi-card, .experience-card-horizontal, .journey-v-card, .landing-welcome-card'
  );

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    interactiveCards.forEach((card) => {
      let isHovered = false;
      let curRotX = 0, curRotY = 0, curZ = 0;
      let targetRotX = 0, targetRotY = 0, targetZ = 0;
      let rafId = null;

      const updateTilt = () => {
        curRotX += (targetRotX - curRotX) * 0.16;
        curRotY += (targetRotY - curRotY) * 0.16;
        curZ += (targetZ - curZ) * 0.16;

        if (isHovered || Math.abs(curRotX) > 0.05 || Math.abs(curRotY) > 0.05) {
          card.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) translateZ(${curZ.toFixed(1)}px)`;
          rafId = requestAnimationFrame(updateTilt);
        } else {
          card.style.transform = '';
          rafId = null;
        }
      };

      card.addEventListener('pointerenter', () => {
        isHovered = true;
        targetZ = 14;
        card.style.setProperty('--spot-opacity', '1');
        if (!rafId) rafId = requestAnimationFrame(updateTilt);
      });

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const normX = (x - cx) / cx; // -1 to 1
        const normY = (y - cy) / cy; // -1 to 1

        targetRotX = -normY * 9.5; // Max 9.5 deg tilt
        targetRotY = normX * 9.5;

        // Dynamic Specular Highlight Reflection
        card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);

        if (!rafId) rafId = requestAnimationFrame(updateTilt);
      });

      card.addEventListener('pointerleave', () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        targetZ = 0;
        card.style.setProperty('--spot-opacity', '0');
      });
    });
  }

  // 2. 3D Scroll Depth Parallax Driver
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let scrollVelocityDecay = 0;
  let scrollTicking = false;

  const handleScrollUpdate = () => {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );

    // Calculate instantaneous velocity with damping
    scrollVelocity = (scrollY - lastScrollY);
    lastScrollY = scrollY;
    scrollVelocityDecay = scrollVelocityDecay * 0.85 + scrollVelocity * 0.15;

    // Send update to Three.js 3D Motion Scene
    if (window.motionScene && typeof window.motionScene.onScroll === 'function') {
      window.motionScene.onScroll(scrollY, maxScroll, scrollVelocityDecay);
    }

    // Set CSS variables on root for composited scroll parallax
    document.documentElement.style.setProperty('--scroll-px', `${scrollY}`);
    document.documentElement.style.setProperty('--scroll-velocity', `${scrollVelocityDecay.toFixed(2)}`);

    scrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(handleScrollUpdate);
      scrollTicking = true;
    }
  }, { passive: true });

  // 3. Interactive Click Shockwave
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input, textarea, select')) return;

    if (window.motionScene && typeof window.motionScene.triggerShockwave === 'function') {
      window.motionScene.triggerShockwave(e.clientX, e.clientY);
    }

    const ripple = document.createElement('div');
    ripple.className = 'click-shockwave';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 700);
  });

  // 4. Magnetic Interactive Buttons
  const magneticItems = document.querySelectorAll(
    '.nav-connect-btn, .nav-role-btn, .copilot-send-btn, .trigger-copilot-btn, .card-action-btn'
  );

  magneticItems.forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      if (reducedMotion) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const pullX = (x / (rect.width / 2)) * 5;
      const pullY = (y / (rect.height / 2)) * 4;

      btn.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 12px) scale(1.03)`;
    });

    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });

  // Ensure default architectural light theme (clean up any residual theme state)
  document.body.classList.remove('batman-theme');
  try { localStorage.removeItem('pranav_theme'); } catch (e) {}

  // Initial page synchronization on boot (Hash routing or default dashboard)
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash === 'products' || initialHash === 'page-products') {
    switchPage('products');
  } else if (cardToPageMap[initialHash]) {
    switchPage(cardToPageMap[initialHash], initialHash);
  } else if (pageTitles[initialHash]) {
    switchPage(initialHash);
  } else {
    switchPage('dashboard');
  }

  // Initial synchronization with 3D engine on load
  if (window.motionScene && typeof window.motionScene.onPageChange === 'function') {
    window.motionScene.onPageChange(currentPage);
  }
});
