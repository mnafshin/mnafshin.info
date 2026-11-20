import githubLight from '@shikijs/themes/github-light';
import githubDark from '@shikijs/themes/github-dark';

/**
 * github-light / github-dark, with token foregrounds lifted to WCAG AA
 * (≥ 4.5:1) against the code-block background. Hue is kept; only
 * lightness changes, and only for colours that failed AA.
 */
const LIGHT_FG: Record<string, string> = {
  // variables (was 3.49:1 on #fff)
  '#e36209': '#c04e08',
  // almost-invisible git/editor chrome; map to the existing comment grey
  '#fafbfc': '#6a737d',
  '#f6f8fa': '#6a737d',
};

const DARK_FG: Record<string, string> = {
  // comments (was 3.05:1 on #24292e)
  '#6a737d': '#8b949e',
  // almost-invisible git/editor chrome; use the same AA comment grey
  '#24292e': '#8b949e',
  '#2f363d': '#8b949e',
};

function remap(color: string, map: Record<string, string>) {
  return map[color.toLowerCase()] ?? color;
}

function patchTheme<T extends { name?: string; tokenColors?: unknown; colors?: Record<string, string> }>(
  theme: T,
  map: Record<string, string>,
  name: string,
): T {
  const next = structuredClone(theme);
  next.name = name;
  const tokens = next.tokenColors as { settings?: { foreground?: string } }[] | undefined;
  if (tokens) {
    for (const token of tokens) {
      if (token.settings?.foreground) {
        token.settings.foreground = remap(token.settings.foreground, map);
      }
    }
  }
  if (next.colors) {
    // Do not remap the editor background itself (it may share a hex
    // with a failing token, e.g. github-dark carriage-return #24292e).
    for (const [key, value] of Object.entries(next.colors)) {
      if (typeof value !== 'string') continue;
      if (key === 'editor.background' || key.endsWith('.background')) continue;
      next.colors[key] = remap(value, map);
    }
  }
  return next;
}

export const accessibleGithubLight = patchTheme(githubLight, LIGHT_FG, 'github-light-aa');
export const accessibleGithubDark = patchTheme(githubDark, DARK_FG, 'github-dark-aa');
