import normalizeHTML from './normalize-html';

export default function (html) {
  const normalizedHTML = normalizeHTML(html);
  const container = document.createElement('div');

  container.innerHTML = normalizedHTML;

  if (container.children.length !== 1) {
    throw new EvalError('html should contain a single root element');
  }

  return container.firstElementChild;
}
