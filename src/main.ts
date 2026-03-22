/**
 * Luxe Interiors - Content Loader
 * Fetches JSON files from /content and renders them to the DOM.
 */

async function fetchContent(file: string) {
  try {
    const response = await fetch(`/content/${file}`);

    if (!response.ok) {
      console.warn(`Using fallback for ${file}`);
      return null;
    }

    return await response.json();

  } catch (error) {
    console.error(`Error loading content from ${file}:`, error);
    return null;
  }
}

async function init() {
  // Load Home Content
  const home = await fetchContent('home.json');
  if (home) {
    const heroImg = document.getElementById('hero-image') as HTMLImageElement;
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroDesc = document.getElementById('hero-description');
    const heroCta = document.getElementById('hero-cta');

    if (heroImg) heroImg.src = home.hero.image;
    if (heroTitle) heroTitle.textContent = home.hero.title;
    if (heroSubtitle) heroSubtitle.textContent = home.hero.subtitle;
    if (heroDesc) heroDesc.textContent = home.hero.description;
    if (heroCta) heroCta.textContent = home.hero.cta_text;

    // Animate Hero
    setTimeout(() => {
      [heroSubtitle, heroTitle, heroDesc, heroCta?.parentElement].forEach(el => {
        if (el) {
          el.classList.remove('opacity-0', 'translate-y-4');
          el.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, 100);

    // Render Stats
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer && home.stats) {
      statsContainer.innerHTML = home.stats.map((stat: any) => `
        <div>
          <p class="text-4xl font-serif font-bold text-stone-900 mb-2">${stat.value}</p>
          <p class="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">${stat.label}</p>
        </div>
      `).join('');
    }
  }

  // Load About Content
  const about = await fetchContent('about.json');
  if (about) {
    const aboutImg = document.getElementById('about-image') as HTMLImageElement;
    const aboutTitle = document.getElementById('about-title');
    const aboutDesc = document.getElementById('about-description');
    const aboutMission = document.getElementById('about-mission');

    if (aboutImg) aboutImg.src = about.image;
    if (aboutTitle) aboutTitle.textContent = about.title;
    if (aboutDesc) aboutDesc.textContent = about.description;
    if (aboutMission) aboutMission.textContent = about.mission;
  }

  // Load Services Content
  const services = await fetchContent('services.json');
  if (services) {
    const servicesTitle = document.getElementById('services-title');
    if (servicesTitle) servicesTitle.textContent = services.title;

    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && services.items) {
      servicesGrid.innerHTML = services.items.map((item: any) => `
        <div class="group p-8 bg-stone-50 hover:bg-stone-900 hover:text-white transition-all duration-500 rounded-2xl border border-stone-100">
          <div class="w-12 h-12 bg-emerald-600/10 group-hover:bg-emerald-600/20 rounded-lg flex items-center justify-center mb-6 transition-colors">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-serif mb-4">${item.title}</h3>
          <p class="text-stone-500 group-hover:text-stone-400 leading-relaxed">${item.description}</p>
        </div>
      `).join('');
    }
  }

  // Load Portfolio Content
  const portfolioData = await fetchContent('portfolio.json');
  if (portfolioData && portfolioData.projects) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (portfolioGrid) {
      portfolioGrid.innerHTML = portfolioData.projects.map((project: any) => `
        <div class="group bg-stone-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
          <div class="aspect-[4/3] overflow-hidden">
            <img src="${project.thumbnail}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer">
          </div>
          <div class="p-8">
            <h3 class="text-2xl font-serif text-white mb-3">${project.title}</h3>
            <p class="text-stone-400 mb-6 line-clamp-2">${project.short_description}</p>
            <button class="view-details-btn bg-white text-stone-900 px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-emerald-600 hover:text-white transition-all w-full" data-id="${project.id}">
              View Details
            </button>
          </div>
        </div>
      `).join('');

      // Modal Logic
      const modal = document.getElementById('portfolio-modal');
      const modalContent = document.getElementById('modal-content');
      const closeModal = document.getElementById('close-modal');
      const modalOverlay = document.getElementById('modal-overlay');

      const openModal = (project: any) => {
        if (!modal || !modalContent) return;
        
        document.getElementById('modal-title')!.textContent = project.title;
        document.getElementById('modal-client')!.textContent = project.details.client;
        document.getElementById('modal-location')!.textContent = project.details.location;
        document.getElementById('modal-year')!.textContent = project.details.year;
        document.getElementById('modal-price')!.textContent = project.details.price_range;
        document.getElementById('modal-description')!.textContent = project.details.full_description;
        
        const gallery = document.getElementById('modal-gallery');
        if (gallery) {
          gallery.innerHTML = project.details.images.map((img: string) => `
            <img src="${img}" alt="Gallery Image" class="w-full rounded-lg shadow-md" referrerPolicy="no-referrer">
          `).join('');
        }

        modal.classList.remove('hidden');
        setTimeout(() => {
          modal.classList.remove('opacity-0');
          modal.classList.add('opacity-100');
          modalContent.classList.remove('scale-95');
          modalContent.classList.add('scale-100');
        }, 10);
        document.body.style.overflow = 'hidden';
      };

      const hideModal = () => {
        if (!modal || !modalContent) return;
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
        setTimeout(() => {
          modal.classList.add('hidden');
        }, 300);
        document.body.style.overflow = '';
      };

      document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = (e.currentTarget as HTMLElement).dataset.id;
          const project = portfolioData.projects.find((p: any) => p.id === id);
          if (project) openModal(project);
        });
      });

      closeModal?.addEventListener('click', hideModal);
      modalOverlay?.addEventListener('click', hideModal);
    }
  }

  // Load Contact Content
  const contact = await fetchContent('contact.json');
  if (contact) {
    const contactTitle = document.getElementById('contact-title');
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');
    const contactAddress = document.getElementById('contact-address');

    if (contactTitle) contactTitle.textContent = contact.title;
    if (contactEmail) contactEmail.textContent = contact.email;
    if (contactPhone) contactPhone.textContent = contact.phone;
    if (contactAddress) contactAddress.textContent = contact.address;

    const footerSocials = document.getElementById('footer-socials');
    if (footerSocials && contact.socials) {
      footerSocials.innerHTML = contact.socials.map((social: any) => `
        <a href="${social.url}" class="hover:text-emerald-600 transition-colors">${social.platform}</a>
      `).join('');
    }
  }
  const toggleBtn = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const overlay = document.getElementById('menu-overlay');
const menuIcon = document.getElementById('menu-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');

let isMenuOpen = false;

const openMenu = () => {
  mobileMenu?.classList.remove('translate-x-full');
  overlay?.classList.remove('opacity-0', 'pointer-events-none');

  if (menuIcon) menuIcon.textContent = '✕';
  document.body.style.overflow = 'hidden';

  isMenuOpen = true;
};

const closeMenu = () => {
  mobileMenu?.classList.add('translate-x-full');
  overlay?.classList.add('opacity-0', 'pointer-events-none');

  if (menuIcon) menuIcon.textContent = '☰';
  document.body.style.overflow = '';

  isMenuOpen = false;
};

toggleBtn?.addEventListener('click', () => {
  isMenuOpen ? closeMenu() : openMenu();
});

// close on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// close on overlay click
overlay?.addEventListener('click', closeMenu);
}

// Start the application
document.addEventListener('DOMContentLoaded', init);
