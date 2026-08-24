/**
 * Markdown → sanitised HTML for blog post bodies.
 *
 * Post content is rendered with `dangerouslySetInnerHTML`, so it must be
 * sanitised. `marked` deliberately passes raw HTML in the source straight
 * through — its own `sanitize` option was removed years ago in favour of
 * delegating to a real sanitiser — so without this step a `<script>` or an
 * `onerror=` attribute in post content would execute.
 *
 * Today the only author is the firm's own admin, which makes this low-risk
 * rather than no-risk. It stops being low-risk the moment content arrives from
 * the live API, a second author, or a compromised admin session.
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true,
  breaks: false,
});

/** Force every rendered link to open safely in a new tab. */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export function renderMarkdown(markdown: string): string {
  const raw = marked.parse(markdown, { async: false }) as string;

  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      'p', 'br', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'em', 'del', 'blockquote',
      'ul', 'ol', 'li',
      'a', 'img',
      'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span',
    ],
    ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'width', 'height', 'target', 'rel'],
    // Block javascript:, data: and other exotic schemes in href/src.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
  });
}
