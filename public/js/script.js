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
const counters = document.querySelectorAll('.counter');
const faqItems = document.querySelectorAll('.faq-item');
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

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

window.addEventListener('scroll', () => {
  const offset = window.scrollY;
  if (offset > 450) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;
  revealElements.forEach((element) => {
    const top = element.getBoundingClientRect().top;
    if (top < trigger) {
      element.classList.add('visible');
    }
  });
}

function animateCounters() {
  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.dataset.target;
      const current = +counter.innerText;
      const increment = Math.ceil(target / 120);
      if (current < target) {
        counter.innerText = current + increment;
        setTimeout(updateCount, 18);
      } else {
        counter.innerText = target;
      }
    };
    const bounds = counter.getBoundingClientRect();
    if (bounds.top < window.innerHeight && !counter.classList.contains('animated')) {
      counter.classList.add('animated');
      updateCount();
    }
  });
}

window.addEventListener('scroll', () => {
  revealOnScroll();
  animateCounters();
});

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
  setTimeout(() => {
    loader.style.opacity = 0;
    loader.style.pointerEvents = 'none';
  }, 600);
  setTimeout(() => {
    openLeadModal();
  }, 60000);
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

estimateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const areaInput = document.getElementById('projectArea');
  const packageRate = +document.getElementById('packageType').value;
  const area = +areaInput.value;

  if (!area || area < 200) {
    estimateResult.innerHTML = '<p class="estimate-value">Please enter a valid project area of at least 200 sq ft.</p>';
    return;
  }

  const base = area * packageRate;
  const total = base.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  estimateResult.innerHTML = `
    <h3>Estimate Summary</h3>
    <p class="estimate-value">Estimated construction cost: <strong>${total}</strong></p>
    <p>Based on ${area} sq ft and selected package level.</p>
  `;
});


// Pricing accordion
document.querySelectorAll('.accordion-trigger').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // close all in same card
    const card = btn.closest('.pricing-card');
    card.querySelectorAll('.accordion-item.open').forEach((el) => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});