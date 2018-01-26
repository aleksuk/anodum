import domParser from '../src/dom-parser';
import traverseNode from '../src/traverse-node';

describe('traverseNode', () => {
  it('TypeError is thrown is node is not a Node', () => {
    expect(() => traverseNode(1)).toThrowError(TypeError);
  });

  it('TypeError is thrown is onStep is not a Function', () => {
    expect(() => traverseNode(document.body, 1)).toThrowError(TypeError);
  });

  it('all dom nodes are reached', () => {
    const html = '<html><head></head><body></body></html>';
    const dom = domParser.parseFromString(html, 'text/html');
    let nodes = ['HTML', 'HEAD', 'BODY'];

    traverseNode(dom, (node) => {
      let index = nodes.indexOf(node.tagName);
      nodes.splice(index, 1);
    });

    expect(nodes.length).toBe(0);
  });

  it('single node tree is passed', () => {
    const element = document.createElement("div");
    let nodes = ['DIV'];

    traverseNode(element, (node) => {
      let index = nodes.indexOf(node.tagName);
      nodes.splice(index, 1);
    });

    expect(nodes.length).toBe(0);
  });

  it('paths are built correctly', () => {
    const element = document.createElement('div');
    element.innerHTML = '<section><!--comment--><h1></h1></section>text';
    let paths = {
      DIV: '0',
      SECTION: '0,0',
      comment: '0,0,0',
      H1: '0,0,1',
      text: '0,1'
    };

    traverseNode(element, (node, path) => {
      const id = node.tagName || node.textContent;
      expect(paths[id]).toBe(path.toString());
    }, true);
  });

  it('traverse is breakable', () => {
    let onStep = jasmine.createSpy();

    traverseNode(document, function(){
      onStep();
      return true;
    });
    expect(onStep).toHaveBeenCalledTimes(1);
  });
});
