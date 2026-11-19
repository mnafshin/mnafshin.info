import { pageUrl, upsertProgress } from './progress';

const QUIZ_KEY = 'mnafshin.info:quiz';
const root = document.querySelector<HTMLElement>('[data-check-yourself]');
if (root) {
  try {
    init(root);
  } catch {
    /* localStorage can be unavailable */
  }
}

function init(root: HTMLElement) {
  const questions = [...root.querySelectorAll<HTMLElement>('[data-check-question]')];
  const url = pageUrl();
  const stored = loadAnswers(url);

  questions.forEach((question, index) => {
    const answer = Number(question.dataset.answer);
    const feedback = question.querySelector<HTMLElement>('[data-check-feedback]');
    const inputs = [...question.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
    const saved = stored[index];
    if (typeof saved === 'number' && inputs[saved]) {
      inputs[saved].checked = true;
      showFeedback(question, feedback, saved, answer);
    }
    inputs.forEach((input) => {
      input.addEventListener('change', () => {
        const choice = Number(input.value);
        showFeedback(question, feedback, choice, answer);
        persist(url, questions);
      });
    });
  });
}

function showFeedback(
  question: HTMLElement,
  feedback: HTMLElement | null,
  choice: number,
  answer: number,
) {
  if (!feedback) return;
  const ok = choice === answer;
  question.classList.toggle('is-correct', ok);
  question.classList.toggle('is-wrong', !ok);
  feedback.hidden = false;
  feedback.textContent = `${ok ? 'Right.' : 'Not quite.'} ${feedback.dataset.explain ?? ''}`;
}

function persist(url: string, questions: HTMLElement[]) {
  const answers = questions.map((question) => {
    const picked = question.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    return picked ? Number(picked.value) : null;
  });
  const all = loadAll();
  all[url] = answers;
  localStorage.setItem(QUIZ_KEY, JSON.stringify(all));

  if (answers.every((value) => value !== null)) {
    const actions = document.querySelector<HTMLElement>('[data-article-actions]');
    upsertProgress({
      url,
      title: actions?.dataset.title ?? document.title,
      section: actions?.dataset.section ?? '',
      read: true,
      quizComplete: true,
    });
    const readButton = actions?.querySelector<HTMLButtonElement>('[data-read-toggle]');
    const readLabel = actions?.querySelector<HTMLElement>('[data-read-label]');
    if (readButton) {
      readButton.setAttribute('aria-pressed', 'true');
      readButton.setAttribute('aria-label', 'Mark as unread');
      readButton.classList.add('is-on');
    }
    if (readLabel) readLabel.textContent = 'Read';
  }
}

function loadAnswers(url: string): Array<number | null> {
  const row = loadAll()[url];
  return Array.isArray(row) ? row : [];
}

function loadAll(): Record<string, Array<number | null>> {
  const raw = localStorage.getItem(QUIZ_KEY);
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') return {};
  return parsed as Record<string, Array<number | null>>;
}
