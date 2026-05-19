const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const loader = document.getElementById('loader');
const siteHeader = document.getElementById('siteHeader');
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
const newsletterBtn = document.getElementById('newsletterBtn');

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
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (mainNav.classList.contains('open')) toggleMenu();
  });
});

// ── Scroll behaviours ─────────────────────────
window.addEventListener('scroll', () => {
  const offset = window.scrollY;

  // Scroll-to-top button
  scrollTopBtn.classList.toggle('visible', offset > 450);

  // Header scroll shadow
  siteHeader.classList.toggle('scrolled', offset > 60);

  revealOnScroll();
  highlightNavOnScroll();
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Mobile CTA bar links ──────────────────────
const mobileCTABar = document.getElementById('mobileCTABar');
if (mobileCTABar) {
  mobileCTABar.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ── Reveal on scroll ──────────────────────────
function revealOnScroll() {
  const trigger = window.innerHeight * 0.88;
  revealElements.forEach((el) => {
    if (el.getBoundingClientRect().top < trigger) el.classList.add('visible');
  });
}

// ── Stat counter animation ────────────────────
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  const statEls = document.querySelectorAll('.stat-number[data-target]');
  if (!statEls.length) return;

  // Check if first stat is visible
  const firstRect = statEls[0].getBoundingClientRect();
  if (firstRect.top > window.innerHeight) return;

  countersStarted = true;

  statEls.forEach((el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '+';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + (progress < 1 ? '' : suffix);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
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
  animateCounters();

  // Hide loader
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
  }, 700);

  // Open lead modal after 28 seconds (less intrusive)
  setTimeout(openLeadModal, 28000);
});

window.addEventListener('scroll', animateCounters, { passive: true });

leadCloseBtn.addEventListener('click', closeLeadModal);
leadModalBackdrop.addEventListener('click', (event) => {
  if (event.target === leadModalBackdrop) closeLeadModal();
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

  leadFeedback.textContent = 'Thank you! Someone from Arana Developers will follow up shortly.';
  leadForm.reset();
  setTimeout(closeLeadModal, 1800);
});

// ── FAQ accordion ─────────────────────────────
faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  button.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    faqItems.forEach((el) => el.classList.remove('active'));
    if (!isActive) item.classList.add('active');
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

  formFeedback.textContent = '✓ Thanks! Your request has been sent. We will reach out soon.';
  contactForm.reset();
});

// ── Cost calculator (₹ Indian format) ─────────
function formatIndianCurrency(amount) {
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + ' Crores';
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(2) + ' Lakhs';
  return '₹' + amount.toLocaleString('en-IN');
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
  const baseBeforeGST = Math.round(totalCost / 1.18);
  const gstAmount = totalCost - baseBeforeGST;

  estimateResult.innerHTML = `
    <h3>Estimate Summary</h3>
    <p style="color:var(--muted);font-size:0.9rem;margin:0 0 0.5rem;">
      ${area.toLocaleString('en-IN')} sq ft × ₹${packageRate.toLocaleString('en-IN')}/sqft (${packageText})
    </p>
    <p class="estimate-highlight">${formattedTotal}</p>
    <ul class="estimate-breakdown">
      <li>Base cost (ex-GST): ${formatIndianCurrency(baseBeforeGST)}</li>
      <li>GST (included): ${formatIndianCurrency(gstAmount)}</li>
      <li>Total (incl. GST): <strong>${formattedTotal}</strong></li>
    </ul>
    <p style="color:var(--muted);font-size:0.82rem;margin:0.5rem 0 0;">
      * Approximate estimate. Actual costs may vary based on site conditions and design choices.
      <a href="#contact" style="color:var(--primary);font-weight:600;text-decoration:none;">Contact us</a> for a detailed quote.
    </p>
  `;
});

// ── Pricing accordion ─────────────────────────
document.querySelectorAll('.accordion-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    const card = btn.closest('.pricing-card');
    card.querySelectorAll('.accordion-item.open').forEach((el) => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Newsletter ────────────────────────────────
if (newsletterBtn) {
  newsletterBtn.addEventListener('click', () => {
    const input = newsletterBtn.previousElementSibling;
    if (input && input.value.includes('@')) {
      newsletterBtn.textContent = '✓ Subscribed!';
      newsletterBtn.style.background = '#2a9d5c';
      input.value = '';
      setTimeout(() => {
        newsletterBtn.textContent = 'Subscribe';
        newsletterBtn.style.background = '';
      }, 3000);
    } else {
      input && input.focus();
    }
  });
}

// ── Keyboard: close modal on Esc ─────────────
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
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}
