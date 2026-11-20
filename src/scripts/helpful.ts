const STORAGE_KEY = 'mnafshin.info:helpful';

type Votes = Record<string, 'yes' | 'no'>;

function load(): Votes {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Votes) : {};
  } catch {
    return {};
  }
}

function save(votes: Votes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // Private mode or a full quota should not break the page.
  }
}

document.querySelectorAll<HTMLElement>('[data-helpful]').forEach((root) => {
  const slug = root.dataset.helpfulSlug;
  if (!slug) return;
  const votes = load();
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-helpful-vote]')];
  const thanks = root.querySelector<HTMLElement>('[data-helpful-thanks]');

  function finish() {
    buttons.forEach((button) => {
      button.disabled = true;
    });
    if (thanks) thanks.hidden = false;
    root.setAttribute('data-helpful-done', '');
  }

  if (votes[slug]) {
    finish();
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const vote = button.dataset.helpfulVote;
      if (vote !== 'yes' && vote !== 'no') return;
      votes[slug] = vote;
      save(votes);
      const goat = window.goatcounter;
      if (goat && typeof goat.count === 'function') {
        goat.count({ path: `helpful-${vote}/${slug}`, event: true });
      }
      finish();
    });
  });
});

export {};

declare global {
  interface Window {
    goatcounter?: { count: (hit: { path: string; event: boolean }) => void };
  }
}
