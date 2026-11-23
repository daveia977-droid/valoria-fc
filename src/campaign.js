/**
 * VALORIA FC / V8 campaign
 * Native swipe and scroll-snap on phones; no autoplay, no canvas, no extra libraries.
 */
export function initCampaign() {
  const section = document.querySelector('#campagne');
  if (!section) return;
  const rail = section.querySelector('#campaign-v8-rail');
  const cards = [...rail.querySelectorAll('.campaign-v8-card')];
  const counter = section.querySelector('#campaign-v8-current');
  const previous = section.querySelector('#campaign-v8-prev');
  const next = section.querySelector('#campaign-v8-next');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = -1;
  let frame = 0;

  function indexFromScroll() {
    const left = rail.getBoundingClientRect().left + 20;
    let nearest = 0, distance = Infinity;
    cards.forEach((card, i) => {
      const current = Math.abs(card.getBoundingClientRect().left - left);
      if (current < distance) { distance = current; nearest = i; }
    });
    return nearest;
  }

  function sync() {
    frame = 0;
    const index = indexFromScroll();
    if (index === activeIndex) return;
    activeIndex = index;
    counter.textContent = String(index + 1).padStart(2, '0');
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(sync);
  }

  function move(step) {
    const nextIndex = Math.max(0, Math.min(cards.length - 1, activeIndex + step));
    const left = cards[nextIndex].getBoundingClientRect().left
      - rail.getBoundingClientRect().left + rail.scrollLeft - 20;
    const pause = document.documentElement.classList.contains('static-motion');
    rail.scrollTo({ left, behavior: reduced.matches || pause ? 'instant' : 'smooth' });
    // Set the count immediately for assistive technology; scroll-snap remains native.
    activeIndex = -1;
    schedule();
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  rail.addEventListener('scroll', schedule, { passive: true });
  rail.addEventListener('keydown', event => {
    if (event.target !== rail || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  addEventListener('resize', schedule, { passive: true });

  // The gallery is functional and visible without animation or JavaScript.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      section.classList.add('is-visible');
      observer.disconnect();
    }, { threshold: .06, rootMargin: '0px 0px -7% 0px' });
    observer.observe(section);
    section.classList.add('is-enhanced');
  }
  sync();
}

