// HTML sanitization utility for rendering user/admin-generated HTML content.
// Uses DOMPurify to prevent XSS attacks via dangerouslySetInnerHTML.

import DOMPurify from "dompurify";

/**
 * Sanitize HTML content before rendering with dangerouslySetInnerHTML.
 * Allows common formatting tags but strips scripts, event handlers, and dangerous attributes.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "dl", "dt", "dd",
      "a", "blockquote", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td", "caption",
      "img", "figure", "figcaption",
      "div", "span", "section", "article",
      "hr",
    ],
    ALLOWED_ATTR: [
      "href", "title", "alt", "src", "srcset",
      "width", "height", "class", "id",
      "colspan", "rowspan",
      "target", "rel",
    ],
    // Only allow safe URL schemes
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}
