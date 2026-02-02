import DOMPurify from 'dompurify';

export function domPurify(description) {
  return DOMPurify.sanitize(String(description).replace(/\n/g, '<br/>'));
}
