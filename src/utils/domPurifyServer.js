const ALLOWED_TAGS = new Set([
  'br',
  'strong',
  'em',
  'u',
  'p',
  'ul',
  'ol',
  'li',
  'a',
  'b',
  'i',
]);

export function domPurifyServer(description = '') {
  let input = String(description);

  input = input.replace(/\n/g, '<br>');

  let safe = '';
  let i = 0;
  const len = input.length;

  while (i < len) {
    const tagStart = input.indexOf('<', i);
    if (tagStart === -1) {
      safe += escapeHtml(input.slice(i));
      break;
    }

    safe += escapeHtml(input.slice(i, tagStart));
    i = tagStart;

    const tagEnd = input.indexOf('>', tagStart + 1);
    if (tagEnd === -1) {
      safe += escapeHtml(input.slice(tagStart));
      break;
    }

    const fullTag = input.slice(tagStart, tagEnd + 1);
    let tagContent = input.slice(tagStart + 1, tagEnd);

    const isClosing = tagContent.startsWith('/');

    if (isClosing) tagContent = tagContent.slice(1);

    const isSelfClosing = tagContent.endsWith('/') || /\/\s*$/.test(tagContent);
    if (isSelfClosing) {
      tagContent = tagContent.replace(/\/\s*$/, '').trim();
    }

    const spaceIndex = tagContent.search(/\s|$/);
    const tagName = tagContent.slice(0, spaceIndex).toLowerCase();

    if (ALLOWED_TAGS.has(tagName)) {
      if (isClosing) {
        safe += fullTag;
      } else {
        let attrsPart = tagContent.slice(spaceIndex);
        let safeAttrs = '';

        if (tagName === 'a') {
          const attrRegex = /(\s[a-zA-Z:-]+)=["']([^"']*)["']/g;
          let attrMatch;
          while ((attrMatch = attrRegex.exec(attrsPart)) !== null) {
            let attrName = attrMatch[1].trim().toLowerCase();
            let attrValue = attrMatch[2];

            if (attrName === 'href') {
              attrValue = attrValue
                .replace(/^javascript:/gi, '')
                .replace(/^data:/gi, '')
                .trim();
              if (attrValue) {
                safeAttrs += ` href="${escapeHtml(attrValue)}"`;
              }
            } else if (attrName === 'target' && attrValue === '_blank') {
              safeAttrs += ' target="_blank"';
            } else if (attrName === 'rel') {
              safeAttrs += ' rel="noopener noreferrer"';
            }
          }
        }

        safe += `<${tagName}${safeAttrs}>`;
      }
    }

    i = tagEnd + 1;
  }

  return safe;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
