// Hover, focus, keyboard and tap/click for Termsplained term popovers.

const wraps = document.querySelectorAll<HTMLElement>('.term-wrap');
if (wraps.length > 0) {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const wrap = target.closest<HTMLElement>('.term-wrap');
    if (wrap) {
      const button = wrap.querySelector<HTMLButtonElement>('.term-tip');
      if (button && (target === button || button.contains(target))) {
        event.preventDefault();
        const open = button.getAttribute('aria-expanded') === 'true';
        closeAll();
        if (!open) openTip(wrap);
      }
      return;
    }
    closeAll();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });

  wraps.forEach((wrap) => {
    const button = wrap.querySelector<HTMLButtonElement>('.term-tip');
    if (!button) return;
    wrap.addEventListener('mouseenter', () => openTip(wrap));
    wrap.addEventListener('mouseleave', () => closeTip(wrap));
    button.addEventListener('focus', () => openTip(wrap));
    button.addEventListener('blur', () => {
      // Keep the popover open if focus moves into the link inside it.
      window.setTimeout(() => {
        if (!wrap.contains(document.activeElement)) closeTip(wrap);
      }, 0);
    });
  });
}

function openTip(wrap: HTMLElement) {
  const button = wrap.querySelector<HTMLButtonElement>('.term-tip');
  const tip = wrap.querySelector<HTMLElement>('.term-popover');
  if (!button || !tip) return;
  button.setAttribute('aria-expanded', 'true');
  tip.hidden = false;
}

function closeTip(wrap: HTMLElement) {
  const button = wrap.querySelector<HTMLButtonElement>('.term-tip');
  const tip = wrap.querySelector<HTMLElement>('.term-popover');
  if (!button || !tip) return;
  button.setAttribute('aria-expanded', 'false');
  tip.hidden = true;
}

function closeAll() {
  document.querySelectorAll<HTMLElement>('.term-wrap').forEach(closeTip);
}
