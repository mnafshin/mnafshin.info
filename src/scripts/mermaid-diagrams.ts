const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)');

function isDark() {
  return document.documentElement.classList.contains('dark');
}

function themeVariables() {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => styles.getPropertyValue(name).trim();
  const bg = read('--bg-elevated') || (isDark() ? '#292524' : '#fffcf7');
  const text = read('--text') || (isDark() ? '#f5f5f4' : '#1c1917');
  const muted = read('--muted') || (isDark() ? '#d6d3d1' : '#57534e');
  const border = read('--border') || (isDark() ? '#44403c' : '#e7e0d4');
  const accent = read('--accent') || (isDark() ? '#2dd4bf' : '#0f766e');
  const soft = read('--accent-soft') || (isDark() ? '#134e4a' : '#ccfbf1');
  return {
    background: bg,
    primaryColor: soft,
    primaryTextColor: text,
    primaryBorderColor: accent,
    secondaryColor: bg,
    secondaryTextColor: text,
    secondaryBorderColor: border,
    tertiaryColor: bg,
    tertiaryTextColor: text,
    tertiaryBorderColor: border,
    lineColor: muted,
    textColor: text,
    mainBkg: soft,
    nodeBorder: accent,
    clusterBkg: bg,
    clusterBorder: border,
    titleColor: text,
    edgeLabelBackground: bg,
    noteBkgColor: soft,
    noteTextColor: text,
    noteBorderColor: accent,
  };
}

async function renderAll() {
  const figures = document.querySelectorAll<HTMLElement>('[data-diagram]');
  if (figures.length === 0) return;

  const mermaid = (await import('mermaid')).default;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: themeVariables(),
    flowchart: { htmlLabels: false, curve: REDUCE.matches ? 'linear' : 'basis' },
  });

  await Promise.all(
    [...figures].map(async (figure, index) => {
      const source = figure.querySelector('.diagram-src')?.textContent?.trim();
      const view = figure.querySelector<HTMLElement>('.diagram-view');
      if (!source || !view) return;
      try {
        const id = `mermaid-${index}-${Math.random().toString(36).slice(2, 8)}`;
        const { svg } = await mermaid.render(id, source);
        view.innerHTML = svg;
        const svgEl = view.querySelector('svg');
        if (svgEl) {
          svgEl.setAttribute('role', 'img');
          if (!svgEl.getAttribute('aria-label')) {
            svgEl.setAttribute('aria-label', 'Diagram');
          }
          svgEl.removeAttribute('style');
        }
      } catch (error) {
        view.textContent = 'This diagram could not be drawn.';
        view.classList.add('diagram-error');
      }
    }),
  );
}

if (document.querySelector('[data-diagram]')) {
  void renderAll();
  document.documentElement.addEventListener('themechange', () => {
    void renderAll();
  });
}
