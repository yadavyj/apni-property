document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('site-header');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const searchPanel = document.getElementById('search-panel');
  const searchButton = document.querySelector('.search-button');

  function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (searchButton && searchPanel) {
    searchButton.addEventListener('click', function () {
      const hidden = searchPanel.hasAttribute('hidden');
      if (hidden) {
        searchPanel.removeAttribute('hidden');
      } else {
        searchPanel.setAttribute('hidden', 'hidden');
      }
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09 });

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('reveal-active'));
  }

  const heroSlide = document.getElementById('hero-slide');
  const heroSpot = document.getElementById('hero-spotlight');
  const indicatorsWrap = document.getElementById('hero-indicators');

  const slides = [
    { name: 'purple', colors: ['#0f172a', '#7c3aed', '#a78bfa'], accent: '#a78bfa' },
    { name: 'blue', colors: ['#020617', '#1d4ed8', '#60a5fa'], accent: '#60a5fa' },
    { name: 'amber', colors: ['#0f172a', '#b45309', '#f59e0b'], accent: '#f59e0b' },
  ];

  let currentIndex = 0;

  function renderIndicators() {
    if (!indicatorsWrap) return;
    indicatorsWrap.innerHTML = '';
    slides.forEach((slide, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Show slide ' + (idx + 1));
      btn.className = 'hero-indicator' + (idx === currentIndex ? ' active' : '');
      btn.addEventListener('click', () => showSlide(idx));
      indicatorsWrap.appendChild(btn);
    });
  }

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    if (!heroSlide) return;

    const slide = slides[currentIndex];
    heroSlide.style.background = 'radial-gradient(circle at 20% 18%, rgba(255,255,255,0.18), transparent 24%), linear-gradient(135deg, ' + slide.colors[0] + ' 0%, ' + slide.colors[1] + ' 42%, ' + slide.colors[2] + ' 100%)';

    if (heroSpot) {
      heroSpot.style.background = 'radial-gradient(circle, ' + slide.accent + '55 0%, transparent 58%)';
    }

    const buttons = indicatorsWrap ? indicatorsWrap.querySelectorAll('.hero-indicator') : [];
    buttons.forEach((button, idx) => {
      button.classList.toggle('active', idx === currentIndex);
    });
  }

  if (heroSlide) {
    renderIndicators();
    showSlide(0);
    setInterval(() => showSlide(currentIndex + 1), 6000);
  }

  if (heroSpot && heroSlide) {
    const heroSection = document.getElementById('hero');
    heroSection.addEventListener('mousemove', function (event) {
      const rect = heroSection.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      heroSpot.style.left = (x - 220) + 'px';
      heroSpot.style.top = (y - 200) + 'px';
    });
  }

  const locationData = ['Rani Dinha', 'Rajahi', 'Motiram Adda', 'Sonbarsha', 'Kashipuram Colony', 'Deoria Road'];
  const locationTrack = document.getElementById('location-track');
  if (locationTrack) {
    [...locationData, ...locationData].forEach((label) => {
      const item = document.createElement('div');
      item.className = 'marquee-item';
      item.innerHTML = '<span class="dot">•</span><span>' + label + '</span><span class="verified-badge">Verified</span>';
      locationTrack.appendChild(item);
    });
  }

  const trustData = ['Verified Registry', '0% Interest EMI on Select Plots', 'Real Photos & Videos', 'Registry & Kabza Tatkal'];
  const trustTrack = document.getElementById('trust-track');
  if (trustTrack) {
    [...trustData, ...trustData].forEach((label) => {
      const item = document.createElement('div');
      item.className = 'marquee-item trust-item';
      item.textContent = label;
      trustTrack.appendChild(item);
    });
  }

  const properties = [
    { title: 'Sunny Plot near Bypass', location: 'Gorakhpur', category: 'plot', price: '₹24L', size: '30x50 ft', tag: 'Verified', palette: ['#111827', '#7c3aed', '#a78bfa'] },
    { title: 'Greenfield Land Parcel', location: 'Gorakhpur', category: 'plot', price: '₹18L', size: '25x40 ft', tag: 'New', palette: ['#0f172a', '#0ea5e9', '#7dd3fc'] },
    { title: 'Residential Plot', location: 'Gorakhpur', category: 'plot', price: '₹22L', size: '28x45 ft', tag: 'Hot', palette: ['#111827', '#f59e0b', '#fcd34d'] },
    { title: 'City House with Garden', location: 'Lucknow', category: 'house', price: '₹62L', size: '3 BHK', tag: 'Move In', palette: ['#111827', '#10b981', '#6ee7b7'] },
  ];

  const tabs = document.querySelectorAll('.tab');
  const featuredGrid = document.getElementById('featured-grid');

  function renderFeatured(filter) {
    if (!featuredGrid) return;
    featuredGrid.innerHTML = '';

    const subset = filter === 'all' ? properties : properties.filter((p) => p.category === filter);

    subset.forEach((property) => {
      const article = document.createElement('article');
      article.className = 'property-card';
      article.innerHTML = '
        <div class="property-visual" style="background: linear-gradient(135deg, ' + property.palette[0] + ' 0%, ' + property.palette[1] + ' 40%, ' + property.palette[2] + ' 100%);"></div>
        <div class="property-card-body">
          <div class="property-topline">
            <span class="property-price">' + property.price + '</span>
            <span class="property-tag">' + property.tag + '</span>
          </div>
          <h3 class="property-title">' + property.title + '</h3>
          <div class="property-meta">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.25a7.5 7.5 0 0 1 7.5 7.5c0 5.54-7.5 12.75-7.5 12.75S4.5 15.29 4.5 9.75A7.5 7.5 0 0 1 12 2.25Zm0 3a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9Z" fill="currentColor"/></svg>
            <span>' + property.location + '</span>
          </div>
          <div class="property-bottomline">
            <span class="property-size">' + property.size + '</span>
            <span class="property-cta">View</span>
          </div>
        </div>
      ';
      featuredGrid.appendChild(article);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      tabs.forEach((item) => item.classList.toggle('active', item === tab));
      renderFeatured(tab.dataset.cat);
    });
  });

  renderFeatured('all');

  const steps = [
    { title: 'Browse Listings', desc: 'Explore verified plots, homes and commercial spaces with real photos and videos.', badge: 1 },
    { title: 'Chat on WhatsApp', desc: 'Message us directly for pricing, availability or any question — no waiting on calls.', badge: 2 },
    { title: 'Visit the Site', desc: 'We arrange a convenient site visit so you can see the property in person before deciding.', badge: 3 },
    { title: 'Registry & Kabza', desc: 'We help complete registry and handover paperwork so ownership transfers smoothly.', badge: 4 },
  ];

  const stepsWrap = document.getElementById('how-steps');
  if (stepsWrap) {
    steps.forEach((step) => {
      const card = document.createElement('div');
      card.className = 'step-card';
      card.innerHTML = '
        <span class="step-number">0' + step.badge + '</span>
        <span class="step-badge step-' + step.badge + '">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10.5 3.75a6.75 6.75 0 1 1 0 13.5a6.75 6.75 0 0 1 0-13.5Zm0 1.5a5.25 5.25 0 1 0 0 10.5a5.25 5.25 0 0 0 0-10.5Zm8.7 18.75l-5.2-5.2l1.06-1.06l5.2 5.2l-1.06 1.06Z" fill="currentColor"/>
          </svg>
        </span>
        <h3 class="step-title">' + step.title + '</h3>
        <p>' + step.desc + '</p>
      ';
      stepsWrap.appendChild(card);
    });
  }

  const categories = [
    { title: 'Plot', desc: 'Residential and investment plots, ready to build or hold.', palette: ['#0f172a', '#8b5cf6', '#a78bfa'] },
    { title: 'Flat', desc: 'Ready and under-construction flats across the city.', palette: ['#111827', '#2563eb', '#60a5fa'] },
    { title: 'House', desc: 'Independent houses with clear registry and kabza.', palette: ['#111827', '#f59e0b', '#fbbf24'] },
    { title: 'Commercial', desc: 'Shops and commercial spaces on high-visibility roads.', palette: ['#111827', '#f43f5e', '#fb7185'] },
    { title: 'Agricultural', desc: 'Farmland and agricultural land on the outskirts.', palette: ['#0f172a', '#10b981', '#6ee7b7'] },
  ];

  const categoryGrid = document.getElementById('category-grid');
  if (categoryGrid) {
    categories.forEach((category) => {
      const item = document.createElement('div');
      item.className = 'category-card';
      item.innerHTML = '
        <div class="category-visual" style="background: linear-gradient(135deg, ' + category.palette[0] + ' 0%, ' + category.palette[1] + ' 40%, ' + category.palette[2] + ' 100%);"></div>
        <h4>' + category.title + '</h4>
        <p>' + category.desc + '</p>
      ';
      categoryGrid.appendChild(item);
    });
  }

  const reasons = [
    { title: 'Verified Registry', desc: 'Every listing is checked for clear registry and legal standing before it goes live.', kind: 'brand' },
    { title: 'Market Expertise', desc: 'Deep, on-ground knowledge of local growth corridors and land value trends.', kind: 'blue' },
    { title: 'Flexible EMI Options', desc: 'Many properties come with EMI plans, making ownership easier to plan for.', kind: 'amber' },
    { title: 'Direct WhatsApp Support', desc: 'Talk to us directly, get quick answers and schedule visits without any hassle.', kind: 'emerald' },
  ];

  const whyGrid = document.getElementById('why-grid');
  if (whyGrid) {
    reasons.forEach((reason) => {
      const card = document.createElement('div');
      card.className = 'feature-card ' + reason.kind;
      card.innerHTML = '<span class="feature-icon">✓</span><h4>' + reason.title + '</h4><p>' + reason.desc + '</p>';
      whyGrid.appendChild(card);
    });
  }

  const testimonialData = [
    { name: 'Rakesh Yadav', role: 'Verified Buyer, Rani Dinha', text: 'Registry aur kabza dono ek hi hafte mein complete ho gaye. No middlemen, no surprises — bilkul jaisa website pe likha tha.' },
    { name: 'Sunita Devi', role: 'Verified Buyer, Motiram Adda', text: 'WhatsApp pe hi saari details mil gayi, site visit bhi turant arrange ho gaya. Pricing bhi bilkul transparent thi.' },
    { name: 'Ajay Singh', role: 'Verified Buyer, Sonbarsha', text: '0% EMI plan ki wajah se plot lena aasan ho gaya. Team ne har step pe support kiya, bahut satisfied hoon.' },
    { name: 'Meena Kumari', role: 'Verified Buyer, Kashipuram Colony', text: 'Documents pehle hi verify the, isliye registry ke time koi dikkat nahi aayi. Bahut hi smooth experience raha.' },
  ];

  const testimonialTrack = document.getElementById('testimonial-track');
  if (testimonialTrack) {
    [...testimonialData, ...testimonialData].forEach((item) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      const initials = item.name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
      card.innerHTML = '
        <div class="quote-mark">“</div>
        <div class="stars">★★★★★</div>
        <p>“' + item.text + '”</p>
        <div class="person">
          <span class="avatar">' + initials + '</span>
          <div>
            <strong>' + item.name + '</strong>
            <small>' + item.role + '</small>
          </div>
        </div>
      ';
      testimonialTrack.appendChild(card);
    });
  }

  const faqData = [
    {
      q: 'What does "registry and kabza tatkal" mean?',
      a: 'It means the property\'s registry (legal ownership transfer) and kabza (physical possession) can both be completed immediately, with no waiting period after you decide to buy.'
    },
    {
      q: 'Do you offer EMI options on plots?',
      a: 'Yes, select listings come with EMI plans, including 0% interest options on some plots. Look for the "EMI Available" badge on a listing, or ask us on WhatsApp.'
    },
    {
      q: 'Can I visit a property before buying?',
      a: 'Absolutely. Message us on WhatsApp with the listing you\'re interested in, and we\'ll arrange a convenient site visit for you.'
    },
    {
      q: 'Which areas do you cover?',
      a: 'We list plots, homes, and commercial spaces across all key active sectors, with new locations added regularly. Explore our interactive locations map above to see where our listings are concentrated.'
    },
    {
      q: 'How do I get more details about a listing?',
      a: 'Every listing has a "Contact on WhatsApp" button that opens a chat with us at +918381910274, or use the enquiry form on the listing page and we\'ll get back to you.'
    }
  ];

  const faqList = document.getElementById('faq-list');
  if (faqList) {
    faqData.forEach((item, index) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item' + (index === 0 ? ' open' : '');
      faqItem.innerHTML = '
        <button type="button" class="faq-question" aria-expanded="' + (index === 0 ? 'true' : 'false') + '">
          <span>
            <svg class="faq-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a9 9 0 1 1 0 18a9 9 0 0 1 0-18Zm1 5h-2v5h5v-2h-3V7Zm-1 9.5a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 0 0 0-2.5Z" fill="currentColor"/></svg>
            ' + item.q + '
          </span>
          <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6l1.41-1.41Z" fill="currentColor"/></svg>
        </button>
        <div class="faq-answer">' + item.a + '</div>
      ';
      faqList.appendChild(faqItem);

      const button = faqItem.querySelector('.faq-question');
      button.addEventListener('click', function () {
        const isOpen = faqItem.classList.toggle('open');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }
});

