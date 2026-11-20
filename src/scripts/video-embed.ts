document.querySelectorAll<HTMLElement>('[data-video-embed]').forEach((root) => {
  const button = root.querySelector<HTMLButtonElement>('[data-video-play]');
  const id = root.dataset.youtubeId;
  const title = root.dataset.videoTitle ?? 'Video';
  if (!button || !id) return;
  button.addEventListener('click', () => play(root, id, title));
});

function play(root: HTMLElement, id: string, title: string) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1`;
  iframe.title = title;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  root.replaceChildren(iframe);
  iframe.focus();
}
