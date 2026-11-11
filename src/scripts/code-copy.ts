// Adds a "Copy" button to every code block in an article.

function announce(message: string) {
  let region = document.getElementById('copy-status');
  if (!region) {
    region = document.createElement('p');
    region.id = 'copy-status';
    region.className = 'visually-hidden';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  region.textContent = '';
  // A new text node after a tick makes screen readers repeat the message.
  window.setTimeout(() => {
    if (region) region.textContent = message;
  }, 50);
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard not available');
  await navigator.clipboard.writeText(text);
}

function enhance(pre: HTMLPreElement) {
  if (pre.parentElement?.classList.contains('code-block')) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block';
  pre.replaceWith(wrapper);
  wrapper.append(pre);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-code';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy code to clipboard');
  let reset: number | undefined;

  button.addEventListener('click', async () => {
    const code = pre.querySelector('code') ?? pre;
    try {
      await copyText((code.textContent ?? '').replace(/\n$/, ''));
      button.textContent = 'Copied';
      button.dataset.state = 'copied';
      announce('Code copied to clipboard');
    } catch {
      button.textContent = 'Press Ctrl+C';
      button.dataset.state = 'error';
      announce('Could not copy. Select the code and copy it by hand.');
    }
    window.clearTimeout(reset);
    reset = window.setTimeout(() => {
      button.textContent = 'Copy';
      delete button.dataset.state;
    }, 2000);
  });

  wrapper.append(button);
}

document.querySelectorAll<HTMLPreElement>('.article pre').forEach(enhance);
