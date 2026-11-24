const portfolioNavigation = document.getElementById('sideNav');
const portfolioToggle = portfolioNavigation.querySelector('.portfolio-nav-toggle');
const portfolioSections = Array.from(document.querySelectorAll('.resume-section[id]'));
const portfolioSectionLinks = new Map(
  Array.from(portfolioNavigation.querySelectorAll('.nav-link[href^="#"]'), link => [link.hash, link])
);
const portfolioMobile = window.matchMedia('(max-width: 991px)');
let portfolioCurrentLink = portfolioSectionLinks.get('#sobre');

function setPortfolioMenu(open) {
  portfolioNavigation.toggleAttribute('data-open', open);
  portfolioToggle.setAttribute('aria-expanded', String(open));
}

portfolioNavigation.dataset.ready = '';
portfolioToggle.addEventListener('click', () => setPortfolioMenu(!portfolioNavigation.hasAttribute('data-open')));
portfolioMobile.addEventListener('change', () => setPortfolioMenu(false));

portfolioNavigation.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link && portfolioMobile.matches) setPortfolioMenu(false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && portfolioNavigation.hasAttribute('data-open')) {
    setPortfolioMenu(false);
    portfolioToggle.focus();
  }
});

function updatePortfolioLocation() {
  const marker = portfolioMobile.matches ? 120 : 100;
  const section = portfolioSections.findLast(item => item.getBoundingClientRect().top <= marker);
  const hashTarget = document.getElementById(location.hash.slice(1));
  const hashSection = hashTarget?.closest('.resume-section');
  const nestedLink = section && hashSection === section ? portfolioSectionLinks.get(location.hash) : null;
  const nextLink = nestedLink || portfolioSectionLinks.get(section ? '#' + section.id : '#sobre');
  if (!nextLink || nextLink === portfolioCurrentLink) return;
  portfolioCurrentLink?.removeAttribute('aria-current');
  nextLink.setAttribute('aria-current', 'location');
  portfolioCurrentLink = nextLink;
}

window.addEventListener('scroll', updatePortfolioLocation, { passive: true });
function revealPortfolioDestination() {
  const group = portfolioSectionLinks.get(location.hash)?.closest('.portfolio-nav-group');
  if (group) group.open = true;
  updatePortfolioLocation();
}

window.addEventListener('hashchange', revealPortfolioDestination);
revealPortfolioDestination();
