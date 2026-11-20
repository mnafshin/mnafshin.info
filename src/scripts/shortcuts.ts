// Article learning-path shortcuts. "/" already opens search (see search.ts).

const help = document.querySelector<HTMLDialogElement>('[data-shortcut-help]');
help?.querySelector('[data-shortcut-help-close]')?.addEventListener('click', () => help.close());
help?.addEventListener('click', (event) => {
  if (event.target === help) help.close();
});

document.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (isTyping(event.target)) return;
  if (searchOpen()) return;
  const openDialog = document.querySelector('dialog[open]');
  if (openDialog && openDialog !== help) return;

  if (event.key === '?' && help) {
    event.preventDefault();
    if (help.open) help.close();
    else help.showModal();
    return;
  }

  if (help?.open) return;

  const key = event.key;
  if (key !== 'j' && key !== 'k' && key !== 'J' && key !== 'K' && key !== 'ArrowRight' && key !== 'ArrowLeft') {
    return;
  }

  const next = document.querySelector<HTMLAnchorElement>('a[rel="next"]');
  const prev = document.querySelector<HTMLAnchorElement>('a[rel="prev"]');
  const go = key === 'j' || key === 'J' || key === 'ArrowRight' ? next : prev;
  if (!go) return;
  event.preventDefault();
  window.location.href = go.href;
});

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function searchOpen() {
  return Boolean(document.querySelector<HTMLDialogElement>('[data-search-dialog][open]'));
}
