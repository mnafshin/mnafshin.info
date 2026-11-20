const toc = document.querySelector<HTMLElement>('[data-article-toc]');
if (toc) {
  const fab = toc.querySelector<HTMLButtonElement>('[data-toc-open]');
  const sheet = toc.querySelector<HTMLDialogElement>('[data-toc-sheet]');
  const closeBtn = toc.querySelector<HTMLButtonElement>('[data-toc-close]');
  const links = [...toc.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')];

  const headings = links
    .map((link) => {
      const id = decodeURIComponent(link.hash.replace(/^#/, ''));
      const heading = id ? document.getElementById(id) : null;
      return heading ? { link, heading } : null;
    })
    .filter((item): item is { link: HTMLAnchorElement; heading: HTMLElement } => item !== null);

  function setCurrent(id: string | null) {
    for (const { link, heading } of headings) {
      const on = heading.id === id;
      if (on) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  if (headings.length > 0 && 'IntersectionObserver' in window) {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        let best: string | null = null;
        let ratio = 0;
        for (const { heading } of headings) {
          const value = visible.get(heading.id) ?? 0;
          if (value > ratio) {
            ratio = value;
            best = heading.id;
          }
        }
        if (!best) {
          // If none are intersecting (e.g. between sections), keep the last one above the fold.
          const fromTop = headings.filter(({ heading }) => heading.getBoundingClientRect().top <= 120);
          best = fromTop.at(-1)?.heading.id ?? headings[0]?.heading.id ?? null;
        }
        setCurrent(best);
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    headings.forEach(({ heading }) => observer.observe(heading));
  }

  function openSheet() {
    if (!sheet || sheet.open) return;
    sheet.showModal();
    closeBtn?.focus();
  }

  function closeSheet() {
    if (sheet?.open) sheet.close();
  }

  fab?.addEventListener('click', () => openSheet());
  closeBtn?.addEventListener('click', () => closeSheet());
  sheet?.addEventListener('click', (event) => {
    if (event.target === sheet) closeSheet();
  });

  toc.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a[href^="#"]');
    if (!link) return;
    if (sheet?.open) closeSheet();
  });

  if (fab && sheet) {
    document.documentElement.classList.add('has-toc-fab');
  }
}
