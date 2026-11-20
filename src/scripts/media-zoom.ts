const dialog = document.querySelector<HTMLDialogElement>('[data-media-zoom]');
const stage = dialog?.querySelector<HTMLElement>('[data-media-zoom-stage]');
const closeBtn = dialog?.querySelector<HTMLButtonElement>('[data-media-zoom-close]');

if (dialog && stage && closeBtn) {
  let restore: HTMLElement | null = null;

  function openZoom(from: HTMLElement) {
    const source = from.matches('img, svg') ? from : from.querySelector('img, svg');
    if (!source || !dialog || !stage) return;
    restore = from instanceof HTMLElement ? from : null;
    stage.replaceChildren(source.cloneNode(true));
    const clone = stage.firstElementChild;
    if (clone instanceof SVGElement) {
      clone.removeAttribute('width');
      clone.removeAttribute('height');
      clone.setAttribute('aria-hidden', 'false');
    }
    if (clone instanceof HTMLImageElement) {
      clone.removeAttribute('width');
      clone.removeAttribute('height');
    }
    dialog.showModal();
    closeBtn?.focus();
  }

  function closeZoom() {
    dialog?.close();
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-media-zoom-close]') || target === dialog) {
      closeZoom();
      return;
    }
    const trigger = target.closest<HTMLElement>('[data-zoom-trigger], .diagram-view, .article-body img, .article-body figure img');
    if (!trigger) return;
    if (trigger.closest('a')) return;
    event.preventDefault();
    openZoom(trigger);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches('[data-zoom-trigger]')) {
        event.preventDefault();
        openZoom(target);
      }
    }
  });

  dialog.addEventListener('close', () => {
    stage.replaceChildren();
    restore?.focus();
    restore = null;
  });
}

function enhanceImages() {
  document.querySelectorAll<HTMLImageElement>('.article-body img, .article img').forEach((img) => {
    if (img.closest('button, a, [data-zoom-trigger]')) return;
    if (img.closest('.diagram')) return;
    img.setAttribute('data-zoom-trigger', '');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    const label = img.getAttribute('alt') ? `View larger: ${img.getAttribute('alt')}` : 'View larger image';
    img.setAttribute('aria-label', label);
  });

  enhanceDiagrams();
}

function enhanceDiagrams() {
  document.querySelectorAll<HTMLElement>('.diagram-view').forEach((view) => {
    view.setAttribute('data-zoom-trigger', '');
    view.setAttribute('tabindex', '0');
    view.setAttribute('role', 'button');
    view.setAttribute('aria-label', 'View larger diagram');
    // The Mermaid SVG has visible text that must not become this button's name.
    view.querySelectorAll('svg').forEach((svg) => {
      svg.setAttribute('aria-hidden', 'true');
    });
  });
}

enhanceImages();
document.documentElement.addEventListener('themechange', () => {
  // Mermaid redraws the SVG; keep the zoom trigger on the view.
  enhanceDiagrams();
});
