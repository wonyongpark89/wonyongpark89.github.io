/* Shared interactions for project galleries and publication categories. */
(() => {
  'use strict';

  document.querySelectorAll('.carousel-section').forEach(section => {
    const carousel = section.querySelector('.carousel');
    const track = section.querySelector('.carousel-track');
    const slides = [...section.querySelectorAll('.carousel-slide')];
    const previous = section.querySelector('.carousel-btn.prev');
    const next = section.querySelector('.carousel-btn.next');
    const caption = section.querySelector('.carousel-caption');
    const dotsContainer = section.querySelector('.carousel-dots');
    if (!carousel || !track || !slides.length || !previous || !next || !caption || !dotsContainer) return;

    let index = 0;
    let pointerStart = null;
    dotsContainer.replaceChildren();
    const dots = slides.map((slide, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'carousel-dot';
      button.setAttribute('aria-label', `Show photograph ${i + 1} of ${slides.length}`);
      button.addEventListener('click', () => show(i));
      dotsContainer.append(button);
      return button;
    });

    function show(requested) {
      index = Math.max(0, Math.min(slides.length - 1, requested));
      track.style.transform = `translateX(${-index * 100}%)`;
      slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', String(i !== index));
        slide.inert = i !== index;
        dots[i].setAttribute('aria-current', String(i === index));
      });
      caption.textContent = slides[index].dataset.caption || '';
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    }

    previous.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    carousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    carousel.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.target.closest('button, a')) return;
      pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    });
    carousel.addEventListener('pointerup', event => {
      if (!pointerStart || pointerStart.id !== event.pointerId) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    });
    carousel.addEventListener('pointercancel', () => { pointerStart = null; });
    carousel.addEventListener('pointerleave', () => { pointerStart = null; });
    carousel.dataset.ready = 'true';
    if (slides.length === 1) {
      previous.hidden = true;
      next.hidden = true;
      dotsContainer.hidden = true;
    }
    show(0);
  });

  const tablist = document.querySelector('.sidebar-tabs');
  if (!tablist) return;
  const tabs = [...tablist.querySelectorAll('a[href^="#"]')];
  const panels = [...document.querySelectorAll('.tab-content')];
  if (!tabs.length || !panels.length) return;
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Publication categories');
  tablist.setAttribute('aria-orientation', 'vertical');

  tabs.forEach(tab => {
    const id = tab.hash.slice(1);
    const panel = document.getElementById(id);
    if (!panel) return;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', id);
    tab.parentElement.setAttribute('role', 'presentation');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    const count = tab.querySelector('.count');
    if (count) count.textContent = String(panel.querySelectorAll('.pub-entry').length);
    tab.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.pushState(null, '', tab.hash);
      activate(id);
    });
    tab.addEventListener('keydown', event => {
      const current = tabs.indexOf(tab);
      let destination;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') destination = (current + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') destination = (current - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') destination = 0;
      if (event.key === 'End') destination = tabs.length - 1;
      if (destination !== undefined) {
        event.preventDefault();
        tabs[destination].focus();
        tabs[destination].click();
      } else if (event.key === ' ') {
        event.preventDefault();
        tab.click();
      }
    });
  });

  function activate(id) {
    panels.forEach(panel => {
      const active = panel.id === id;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
    tabs.forEach(tab => {
      const active = tab.hash === '#' + id;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
  }

  function restoreFromLocation() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ''; }
    const target = id && document.getElementById(id);
    const panel = target && (target.classList.contains('tab-content') ? target : target.closest('.tab-content'));
    activate(panel ? panel.id : 'journals');
    if (target && panel && target !== panel) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }

  window.addEventListener('hashchange', restoreFromLocation);
  window.addEventListener('popstate', restoreFromLocation);
  restoreFromLocation();
})();
