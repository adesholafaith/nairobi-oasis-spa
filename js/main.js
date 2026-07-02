// NAVIGATION
const nav = document.getElementById("mainNav");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

let lastScroll = 0;

// Hamburger Toggle
hamburger?.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");

  hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
});

// Close menu when a link is clicked
mobileMenu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

// Scroll Behaviour
window.addEventListener("scroll", () => {

  // Background change
  if (window.scrollY > 60) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }

  // Only run hide/show on mobile
  if (window.innerWidth <= 768) {

    const currentScroll = window.scrollY;

    // Close menu while scrolling
    if (mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }

    // Ignore tiny scroll movements
    if (Math.abs(currentScroll - lastScroll) > 5) {

      // Hide when scrolling down
      if (currentScroll > lastScroll && currentScroll > 80) {
        nav.classList.add("nav-hidden");
      }
      // Show when scrolling up
      else {
        nav.classList.remove("nav-hidden");
      }

      lastScroll = currentScroll;
    }
  }

});


// VIDEOS
document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('.hero-video');
  if (video) video.playbackRate = 0.5;
});

// TESTIMONIALS
(function () {
  const track = document.getElementById('testimonialsTrack');
  const viewport = document.getElementById('testimonialsViewport');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!track || !viewport || !dotsContainer) return;

  const cards = track.querySelectorAll('.testimonial-card');

  let currentIndex = 0;
  let intervalId = null;
  let resumeTimeout = null;

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const SWIPE_THRESHOLD = 50;

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function buildDots() {
    dotsContainer.innerHTML = '';

    const pageCount = maxIndex() + 1;

    for (let i = 0; i < pageCount; i++) {
      const dot = document.createElement('span');

      if (i === currentIndex) dot.classList.add('active');

      dot.addEventListener('click', () => {
        pauseAutoSlide();
        goTo(i);
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('span');

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;

    track.style.transform =
      `translateX(-${currentIndex * (cardWidth + gap)}px)`;

    updateDots();
  }

  function slideNext() {
    if (currentIndex >= maxIndex()) {
      goTo(0);
    } else {
      goTo(currentIndex + 1);
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    intervalId = setInterval(slideNext, 5000);
  }

  function stopAutoSlide() {
    clearInterval(intervalId);
  }

  function pauseAutoSlide() {
    stopAutoSlide();

    clearTimeout(resumeTimeout);

    resumeTimeout = setTimeout(() => {
      startAutoSlide();
    }, 20000);
  }

  // Hover pause
  viewport.addEventListener('mouseenter', stopAutoSlide);

  viewport.addEventListener('mouseleave', () => {
    pauseAutoSlide();
  });

  // -----------------------
  // TOUCH SWIPE
  // -----------------------

  viewport.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    currentX = startX;

    pauseAutoSlide();
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    const distance = startX - currentX;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {

      if (distance > 0) {
        goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1);
      } else {
        goTo(currentIndex <= 0 ? maxIndex() : currentIndex - 1);
      }

    }

    pauseAutoSlide();
  });

  // -----------------------
  // DESKTOP DRAG
  // -----------------------

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;

    startX = e.clientX;
    currentX = startX;

    pauseAutoSlide();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    currentX = e.clientX;
  });

  window.addEventListener('mouseup', () => {

    if (!isDragging) return;

    isDragging = false;

    const distance = startX - currentX;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {

      if (distance > 0) {
        goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1);
      } else {
        goTo(currentIndex <= 0 ? maxIndex() : currentIndex - 1);
      }

    }

    pauseAutoSlide();

  });

  // Resize
  let resizeTimeout;

  window.addEventListener('resize', () => {

    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      buildDots();
      goTo(Math.min(currentIndex, maxIndex()));
    }, 150);

  });

  buildDots();
  goTo(0);
  startAutoSlide();

})();

// SCROLL REVEAL 
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initReveal);

// SERVICE SLIDER (home page)
(function () {
  const grid = document.querySelector('.services-grid');
  const prevBtn = document.querySelector('.slider-btn-prev');
  const nextBtn = document.querySelector('.slider-btn-next');
  const dotsContainer = document.querySelector('.slider-dots');
  if (!grid || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = grid.querySelectorAll('.service-card');
  let currentIndex = 0;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('span');

  function updateDots() {
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function goTo(index) {
    if (!isMobile()) return;
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    const cardWidth = grid.clientWidth + 16; // width + gap
    grid.scrollTo({ left: currentIndex * cardWidth, behavior: 'smooth' });
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Keep index in sync if user swipes manually
  let scrollTimeout;
  grid.addEventListener('scroll', () => {
    if (!isMobile()) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const cardWidth = grid.clientWidth + 16;
      currentIndex = Math.round(grid.scrollLeft / cardWidth);
      updateDots();
    }, 100);
  });

  window.addEventListener('resize', () => {
    if (isMobile()) goTo(currentIndex);
  });
})();

// THERAPIST TABS + CAROUSELS (home page preview section)
(function () {
  function isMobile() {
    return window.innerWidth <= 768;
  }

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const carousels = {};

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Stop whichever carousel was active before switching
      Object.values(carousels).forEach((c) => c.stop());

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');

      const name = btn.dataset.tab.replace('-tab', '');
      carousels[name]?.refresh();
    });
  });

  function initCarousel(name) {
    const grid = document.querySelector(
      `[data-carousel="${name}"].therapist-grid, [data-carousel="${name}"].mystery-therapist-grid`
    );
    const prevBtn = document.querySelector(`.carousel-prev[data-carousel="${name}"]`);
    const nextBtn = document.querySelector(`.carousel-next[data-carousel="${name}"]`);
    const dotsContainer = document.querySelector(`.carousel-dots[data-carousel="${name}"]`);
    if (!grid || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = grid.querySelectorAll('.therapist-card');
    let currentIndex = 0;

    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('span');

    function updateDots() {
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goTo(index) {
      if (!isMobile()) return;
      currentIndex = Math.max(0, Math.min(index, cards.length - 1));
      const cardWidth = grid.clientWidth + 16;
      grid.scrollTo({ left: currentIndex * cardWidth, behavior: 'smooth' });
      updateDots();
    }

    // ---- Auto-slide ----
    let autoSlideInterval = null;

    function startAutoSlide() {
      if (!isMobile()) return;
      stopAutoSlide(); // avoid stacking multiple intervals
      autoSlideInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % cards.length;
        goTo(nextIndex);
      }, 3000);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    grid.addEventListener('mouseenter', stopAutoSlide);
    grid.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    let scrollTimeout;
    grid.addEventListener('scroll', () => {
      if (!isMobile()) return;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const cardWidth = grid.clientWidth + 16;
        currentIndex = Math.round(grid.scrollLeft / cardWidth);
        updateDots();
      }, 100);
    });

    window.addEventListener('resize', () => {
      if (isMobile()) goTo(currentIndex);
    });

    carousels[name] = {
      refresh() {
        if (isMobile()) {
          const cardWidth = grid.clientWidth + 16;
          grid.scrollTo({ left: currentIndex * cardWidth, behavior: 'auto' });
          startAutoSlide();
        }
      },
      stop: stopAutoSlide
    };
  }

  initCarousel('female');
  initCarousel('male');
  initCarousel('mystery');
})();

// FAQ ACCORDION
document.addEventListener('click', (e) => {
  const faqQ = e.target.closest('.faq-q');
  if (faqQ) {
    const item = faqQ.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  }
});

// THERAPIST PROFILES DATA
const therapists = {
  daisy: {
    img: 'img/Daisy.jpg',
    name: 'Daisy', gender: 'Female',
    specialty: 'Wellness Therapist',
    tagline: 'Where tension meets its match',
    experience: '2 years', rating: '★ 4.9', height: "5'4\"",
    languages: 'English, Swahili',
    bio: [
      'Sometimes the best thing you can do for yourself is slow down, breathe and allow yourself to be cared for.',
      "Daisy is known for her warm personality, gentle approach and ability to create a calming atmosphere that helps clients truly relax. Whether you're looking to unwind after a long day, ease muscle tension or simply enjoy a moment of self-care, Daisy is dedicated to making every session feel comfortable, personalized and refreshing."
    ],
    services: [
      { name: 'Deep Tissue Massage' },
      { name: 'Aromatherapy Massage' },
      { name: 'Full Body Massage' },
      { name: 'Couples Massage' },
    ],
    specialties: ['Verified', 'Certified Therapist', 'Background Checked'],
    button: {
      text: 'Reserve with Daisy',
      link: 'https://wa.me/254143001962?text=Hello%20Nairobi%20Oasis!%20I%20would%20like%20to%20reserve%20a%20massage%20session%20with%20Daisy.'
    }    
  },

  maya: {
    img: 'img/Maya-4.jpeg',
    name: 'Maya', gender: 'Female',
    specialty: 'Wellness Therapist',
    tagline: 'Gentle touch, profound healing',
    experience: '2 years', rating: '★ 5.0', height: "5'4\"",
    languages: 'English, Swahili',
    bio: [
      'Experience the perfect balance of relaxation, care and professionalism with Maya.',
      'Maya is passionate about helping clients unwind, recharge and feel their absolute best. With a calming presence and attention to detail, she creates personalized wellness experiences designed to ease tension, promote relaxation and leave you feeling refreshed.'
    ],
    services: [
      { name: 'Deep Tissue Massage' },
      { name: 'Aromatherapy Massage' },
      { name: 'Full Body Massage' },
      { name: 'Couples Massage' },
    ],
    specialties: ['Verified', 'Certified Therapist', 'Background Checked'],
    button: {
      text: 'Reserve with Maya',
      link: 'https://wa.me/254143001962?text=Hello%20Nairobi%20Oasis!%20I%20would%20like%20to%20reserve%20a%20massage%20session%20with%20Maya.'
    }  
  },

  dan: {
    img: 'img/Dan-2.png',
    name: 'Dan', gender: 'Male',
    specialty: 'Wellness Therapist',
    tagline: 'Precision recovery for peak performance',
    experience: '8 years', rating: '★ 4.8', height: "6'3\"",
    languages: 'English, Swahili',
    bio: [
      'Sometimes your body just needs the right hands to help it recover, relax and feel good again.',
      'Dan is known for his calm approach, professionalism and ability to work through muscle tension while ensuring clients remain comfortable throughout their session.',
      "Whether you're looking to unwind after a long week, recover from physical activity or simply take time for yourself, Dan is dedicated to helping you feel refreshed, relaxed and restored."
    ],
    services: [
      { name: 'Deep Tissue Massage' },
      { name: 'Aromatherapy Massage' },
      { name: 'Full Body Massage' },
      { name: 'Couples Massage' },
    ],
    specialties: ['Verified', 'Certified Therapist', 'Background Checked'],
    button: {
      text: 'Reserve with Dan',
      link: 'https://wa.me/254143001962?text=Hello%20Nairobi%20Oasis!%20I%20would%20like%20to%20reserve%20a%20massage%20session%20with%20Dan.'
    }  
  },

  nora: {
    img: 'img/Nora-2.png',
    name: 'Nora', gender: 'Female',
    specialty: 'Wellness Therapist',
    tagline: 'Ancient warmth, modern wellness',
    experience: '2 years', rating: '★ 4.9', height: "5'3\"",
    languages: 'English, Swahili',
    bio: [
      'Nora specializes in creating deeply relaxing and rejuvenating wellness experiences tailored to your needs. ',
      "Whether you're seeking stress relief, muscle recovery, or pure relaxation, she delivers every treatment with care, professionalism, and attention to detail."
    ],
    services: [
      { name: 'Deep Tissue Massage' },
      { name: 'Aromatherapy Massage' },
      { name: 'Full Body Massage' },
      { name: 'Couples Massage' },
    ],
    specialties: ['Verified', 'Certified Therapist', 'Background Checked'],
    button: {
      text: 'Reserve with Nora',
      link: 'https://wa.me/254143001962?text=Hello%20Nairobi%20Oasis!%20I%20would%20like%20to%20reserve%20a%20massage%20session%20with%20Nora.'
    }
  },

  alison: {
    img: 'img/Alison-2.png',
    name: 'Alison', gender: 'Male',
    specialty: 'Wellness Therapist',
    tagline: 'Unlock your body\'s full potential',
    experience: '7 years', rating: '★ 4.7', height: "6'3\"",
    languages: 'English, Swahili',
    bio: [
      "A great massage isn't just about relaxation—it's about feeling better, moving better, and taking time to care for yourself.",
      'Alison is known for his friendly personality, professional approach and ability to help clients feel comfortable from the moment they arrive.',
      "Whether you're dealing with muscle tension, recovering from a busy week or simply looking to unwind, Alison is dedicated to providing a relaxing and rejuvenating experience tailored to your needs."
    ],
    services: [
      { name: 'Deep Tissue Massage' },
      { name: 'Aromatherapy Massage' },
      { name: 'Full Body Massage' },
      { name: 'Couples Massage' },
    ],
    specialties: ['Verified', 'Certified Therapist', 'Background Checked'],
    button: {
      text: 'Reserve with Alison',
      link: 'https://wa.me/254143001962?text=Hello%20Nairobi%20Oasis!%20I%20would%20like%20to%20reserve%20a%20massage%20session%20with%20Alison.'
    }
  },

  sally: {
    img: 'img/Sally3.png',
    name: 'Sally', gender: 'Female',
    specialty: 'Wellness Therapist',
    tagline: 'Helping you relax, recharge, and feel your best.',
    experience: '2 years', rating: '★ 4.0', height: "5'2\"",
    languages: 'English, Swahili',
    bio: [
      'Sally is a professional wellness therapist dedicated to helping clients relax, recharge, and restore balance through personalized massage experiences. She is available for home, hotel, and private bookings within Nairobi.'
    ],
    services: [
      { name: 'Deep Tissue Massage' },
      { name: 'Aromatherapy Massage' },
      { name: 'Full Body Massage' },
      { name: 'Couples Massage' },
    ],
    specialties: ['Verified', 'Certified Therapist', 'Background Checked'],
    button: {
      text: 'Reserve with Sally',
      link: 'https://wa.me/254143001962?text=Hello%20Nairobi%20Oasis!%20I%20would%20like%20to%20reserve%20a%20massage%20session%20with%20Sally.'
    }
  },

  'mystery-male': {
    img: 'img/default-m.jpg',
    name: 'Mystery Male Therapist',
    gender: 'Male',
    specialty: 'Wellness Therapist',
    tagline: 'Book now to discover your expert therapist',
    experience: 'Varies',
    rating: '★ 5.0',
    height: 'TBA',
    languages: 'English, Swahili',
    bio: [
      'Our mystery male therapist arrives fully prepared with premium tools and a tailored treatment designed to exceed your expectations.',
      'Enjoy a professional session with a trusted therapist chosen to match your needs, whether you seek deep muscle release, relaxation, or recovery support.'
    ],
    services: [
      { name: 'Tailored to your needs' }
    ],
    specialties: ['Verified', 'Certified Therapist', 'Background Checked'],
    
  },

  'mystery-female': {
    img: 'img/default-f.jpg',
    name: 'Mystery Female Therapist',
    gender: 'Female',
    specialty: 'Wellness Therapist',
    tagline: 'Book now to discover your expert therapist',
    experience: 'Varies',
    rating: '★ 5.0',
    height: 'TBA',
    languages: 'English, Swahili',
    bio: [
      'Our mystery female therapist arrives fully prepared with premium tools and a tailored treatment designed to exceed your expectations.',
      'Enjoy a professional session with a trusted therapist chosen to match your needs, whether you seek deep muscle release, relaxation, or recovery support.'
    ],
    services: [
      { name: 'Tailored to your needs' }
    ],
    specialties: ['Verified', 'Certified Therapist', 'Background Checked']
  }
};

// Renders a therapist's profile into #therapist-profile-content.
// Used by therapist-profile.html, which passes the ?id= from the URL.
function loadTherapistProfile(id) {
  const t = therapists[id];
  const el = document.getElementById('therapist-profile-content');
  if (!el) return false;
  if (!t) {
    el.innerHTML = `
      <section class="section">
        <div class="container" style="text-align:center;">
          <p class="eyebrow">Not Found</p>
          <h2>We couldn't find that therapist</h2>
          <p style="margin-top:1rem;"><a href="therapists.html" class="btn btn-outline">← Back to Therapists</a></p>
        </div>
      </section>
    `;
    return false;
  }
  el.innerHTML = `
    <div class="page-hero">
      <div class="container">
        <nav class="breadcrumb">
          <a href="index.html">Home</a>
          <span>/</span>
          <a href="therapists.html">Our Therapists</a>
          <span>/</span>
          <span>${t.name}</span>
        </nav>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="therapist-profile-grid">
          <div class="therapist-profile-img">
            <img src="${t.img}" alt="${t.name}" class="therapist-profile-image">
            <div class="profile-badge">
              <div class="profile-badge-row"><span>Experience</span><span>${t.experience}</span></div>
              <div class="profile-badge-row"><span>Rating</span><span class="rating"> ${t.rating}</span></div>
              <div class="profile-badge-row"><span>Height</span><span>${t.height}</span></div>
              <div class="profile-badge-row"><span>Languages</span><span>${t.languages}</span></div>
            </div>
          </div>
          <div class="therapist-profile-info">
            <p class="eyebrow">${t.gender} Therapist · ${t.specialty}</p>
            <h1>${t.name}</h1>
            <p class="tagline">"${t.tagline}"</p>
            <div class="profile-bio">
              ${t.bio.map(p => `<p>${p}</p>`).join('')}
            </div>
            <h3 style="margin-bottom:0.5rem;">Specialties</h3>
            <div class="profile-services-list">
              ${t.services.map(s => `
                <div class="profile-service-item">
                  <span class="profile-service-name">${s.name}</span>
                </div>
              `).join('')}
            </div>
            <div class="profile-specialties">
              ${t.specialties.map(s => `<span class="specialty-tag"><img src="icons/check.png" alt="" class="specialty-icon">${s}</span>`).join('')}
            </div>
            <a href="${t.button.link}" class="btn btn-outline reserve-btn" target="_blank" rel="noopener">
              ${t.button.text}
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
  requestAnimationFrame(() => {
    el.classList.add("loaded");
  });
  if (typeof initTherapistProfileGallery === 'function') {
    initTherapistProfileGallery();
  }
  return true;
}

function initTherapistProfileGallery() {
  const gallery = document.querySelector('.profile-gallery');
  if (!gallery) return;

  const images = Array.from(gallery.querySelectorAll('img'));
  if (!images.length) return;

  let current = 0;

  setInterval(() => {
    images[current].classList.remove('active');
    current = (current + 1) % images.length;
    images[current].classList.add('active');
  }, 3000);

  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      images.forEach(i => i.classList.remove('active'));
      img.classList.add('active');
      current = index;
    });
  });
}

// On therapist-profile.html, read ?id= from the URL and render that therapist
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('therapist-profile-content')) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  loadTherapistProfile(id);
});


// CONTACT FORM
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get('name');
  const service = data.get('service');
  const msg = data.get('message') || 'I would like to book a session.';
  const text = encodeURIComponent(`Hi Nairobi Oasis!\n\nName: ${name}\nService: ${service}\n\n${msg}`);
  window.open(`https://wa.me/254143001962?text=${text}`, '_blank');
});

// BOOKING FORM
const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(bookingForm);
  const name = data.get('name');
  const service = data.get('service');
  const date = data.get('date');
  const time = data.get('time');
  const location = data.get('location');
  const channel = data.get('channel');
  const text = encodeURIComponent(`🌿 *Nairobi Oasis Booking Request*\n\nName: ${name}\nService: ${service}\nDate: ${date}\nTime: ${time}\nLocation: ${location}`);
  if (channel === 'telegram') {
    window.open(`https://t.me/NairobiOasis?text=${text}`, '_blank');
  } else {
    window.open(`https://wa.me/254143001962?text=${text}`, '_blank');
  }
});