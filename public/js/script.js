const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const loader = document.getElementById('loader');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const estimateForm = document.getElementById('estimateForm');
const estimateResult = document.getElementById('estimateResult');
const leadModalBackdrop = document.getElementById('leadModalBackdrop');
const leadCloseBtn = document.getElementById('modalCloseBtn');
const leadForm = document.getElementById('leadForm');
const leadFeedback = document.getElementById('leadFeedback');
const faqItems = document.querySelectorAll('.faq-item');
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

// ── Navigation toggle ─────────────────────────
function toggleMenu() {
  mainNav.classList.toggle('open');
  navToggle.classList.toggle('open');
}

navToggle.addEventListener('click', toggleMenu);

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (mainNav.classList.contains('open')) {
      toggleMenu();
    }
  });
});

// ── Scroll behaviours ─────────────────────────
window.addEventListener('scroll', () => {
  const offset = window.scrollY;
  if (offset > 450) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
  revealOnScroll();
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Mobile CTA bar — scroll into contact section links
const mobileCTABar = document.getElementById('mobileCTABar');
if (mobileCTABar) {
  mobileCTABar.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Reveal on scroll ──────────────────────────
function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;
  revealElements.forEach((element) => {
    const top = element.getBoundingClientRect().top;
    if (top < trigger) {
      element.classList.add('visible');
    }
  });
}

// ── Lead modal ────────────────────────────────
function openLeadModal() {
  leadModalBackdrop.classList.add('visible');
  leadModalBackdrop.setAttribute('aria-hidden', 'false');
}

function closeLeadModal() {
  leadModalBackdrop.classList.remove('visible');
  leadModalBackdrop.setAttribute('aria-hidden', 'true');
}

window.addEventListener('load', () => {
  revealOnScroll();
  setTimeout(() => {
    loader.style.opacity = 0;
    loader.style.pointerEvents = 'none';
  }, 600);
  setTimeout(() => {
    openLeadModal();
  }, 10000);
});

leadCloseBtn.addEventListener('click', closeLeadModal);
leadModalBackdrop.addEventListener('click', (event) => {
  if (event.target === leadModalBackdrop) {
    closeLeadModal();
  }
});

leadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(leadForm);
  const name = formData.get('name').trim();
  const contact = formData.get('contact').trim();

  if (!name || !contact) {
    leadFeedback.textContent = 'Please provide your name and preferred contact method.';
    return;
  }

  leadFeedback.textContent = 'We have received your request. Someone from Arana Developers will follow up shortly.';
  leadForm.reset();
  setTimeout(closeLeadModal, 1500);
});

// ── FAQ accordion ─────────────────────────────
faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  button.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    faqItems.forEach((el) => el.classList.remove('active'));
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// ── Contact form ──────────────────────────────
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const message = formData.get('message').trim();

  if (!name || !email || !message) {
    formFeedback.textContent = 'Please complete all fields before submitting.';
    return;
  }

  formFeedback.textContent = 'Thanks! Your request has been sent. We will reach out soon.';
  contactForm.reset();
});

// ── IMPROVEMENT 4: Cost calculator fixed for ₹ ─
// Helper: format number in Indian style (lakhs/crores)
function formatIndianCurrency(amount) {
  if (amount >= 10000000) {
    const crores = (amount / 10000000).toFixed(2);
    return '₹' + crores + ' Crores';
  } else if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(2);
    return '₹' + lakhs + ' Lakhs';
  } else {
    return '₹' + amount.toLocaleString('en-IN');
  }
}

estimateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const areaInput = document.getElementById('projectArea');
  const packageRateEl = document.getElementById('packageType');
  const packageRate = parseInt(packageRateEl.value, 10);
  const area = parseInt(areaInput.value, 10);
  const packageText = packageRateEl.options[packageRateEl.selectedIndex].text;

  if (!area || area < 200) {
    estimateResult.innerHTML = '<h3>Estimate Summary</h3><p class="estimate-value">Please enter a valid project area of at least 200 sq ft.</p>';
    return;
  }

  const totalCost = area * packageRate;
  const formattedTotal = formatIndianCurrency(totalCost);

  // Calculate GST breakdown (GST already included in the rate, so extract 18%)
  const baseBeforeGST = Math.round(totalCost / 1.18);
  const gstAmount = totalCost - baseBeforeGST;

  estimateResult.innerHTML = `
    <h3>Estimate Summary</h3>
    <p style="color: var(--muted); font-size: 0.9rem; margin: 0 0 0.5rem;">
      ${area.toLocaleString('en-IN')} sq ft &times; ₹${packageRate.toLocaleString('en-IN')}/sqft (${packageText})
    </p>
    <p class="estimate-highlight">${formattedTotal}</p>
    <ul class="estimate-breakdown">
      <li>Base cost (ex-GST): ${formatIndianCurrency(baseBeforeGST)}</li>
      <li>GST (included): ${formatIndianCurrency(gstAmount)}</li>
      <li>Total (incl. GST): <strong>${formattedTotal}</strong></li>
    </ul>
    <p style="color: var(--muted); font-size: 0.82rem; margin: 0.5rem 0 0;">
      * This is an approximate estimate. Actual costs may vary based on site conditions and design choices.
      <a href="#contact" style="color: var(--primary); font-weight: 600; text-decoration: none;">Contact us</a> for a detailed quote.
    </p>
  `;
});

// ── Pricing accordion ─────────────────────────
document.querySelectorAll('.accordion-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // Close all in same card
    const card = btn.closest('.pricing-card');
    card.querySelectorAll('.accordion-item.open').forEach((el) => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── City pills hover effect (non-js enhancement) ──
// (all hover effects handled in CSS)

// ── Keyboard accessibility: close modal on Esc ──
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && leadModalBackdrop.classList.contains('visible')) {
    closeLeadModal();
  }
});

// ── Active nav highlight on scroll ────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav a');

function highlightNavOnScroll() {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--primary)';
    }
  });
}

window.addEventListener('scroll', highlightNavOnScroll);