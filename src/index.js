/*
validator's isValidXML function receives a string, checks if a string is a valid xml, and returns a boolean.

<a /> => true
<a></a> => true
<a>test</a> => true
<a><b></b></a> => true
<a></a><b></b> => true

<a> => false
<<a></a> => false
<a><b></a></b> => false

IMPORTANT: Please note that we have our own internal rules about validity.
1. A node cannot contain a node with the same tag. ex) <a><a></a></a> => false
2. A node cannot be followed by a node with the same tag. ex) <a></a><a></a> => false
3. An xml cannot be more than 2 levels deep. ex) <a><b><c><d></d></c></b></a> => false

IMPORTANT: Feel free to use open source libraries you find necessary.
IMPORTANT: Don't worry about XML declaration, node attributes, or unicode characters.

For further examples, please check basic_spec.js file.

DO NOT MODIFY
*/

/*
@param xmlString: a string, possibly a valid xml string
@return boolean;
*/
class Element {
  constructor(parent, depth) {
    this.parent = parent;
    this.depth = depth || 0; // root has no parent
    this.closeTag = false;
    this.selfCloseTag = false;
    this.isCompleted = parent ? false : true;
    this.name = parent ? '' : 'root';
    this.children = [];
  }

  isRoot() {
    return this.depth === 0;
  }

  isCloser() {
    return this.closeTag === true;
  }

  addNameByte(byte) {
    this.name += byte;
  }

  complete() {
    this.isCompleted = true;
  }

  setCloser() {
    this.closeTag = true;
  }

  createChild(depth) {
    const element = new Element(this, depth);
    this.children.push(element);
    return element;
  }
}

exports.isValidXML = xmlString => {
  if (xmlString.length === 0) {
    return false;
  }
  const xmlBytes = xmlString.split('');
  const rootElement = new Element();
  let previousByte;
  let currentElement = rootElement;
  let lastElement;
  const swapElement = (element) => {
    lastElement = currentElement;
    currentElement = element;
  }
  for (const byte of xmlBytes) {
    if (byte === '<') {
      // <<a></a> => false
      if (!currentElement.isCompleted) {
        return false;
      }
      const depth = currentElement.depth + 1;
      swapElement(
        currentElement.isRoot() ?
          currentElement.createChild(depth)
        : currentElement.parent.createChild(depth)
      );
    } else if (byte === '/') {
      currentElement.setCloser();
      // <a><b /></a> => true
      if (lastElement.name !== currentElement.name) {
        currentElement.selfCloseTag = true;
      }
    } else if (byte === '>') {
      currentElement.complete();
      if (currentElement.isCloser()) {
        currentElement.depth -= 1;
        // An xml cannot be more than 2 levels deep. ex) <a><b><c><d></d></c></b></a> => false
        if (currentElement.depth >= 3) {
          return false;
        }
        // <a /> => true
        if (!currentElement.selfCloseTag && lastElement.name !== currentElement.name) {
          return false;
        }
        // <a><b></a></b> => false
        const myIndex = currentElement.parent.children.findIndex(x => x === currentElement);
        const prevElement = currentElement.parent.children[myIndex - 1];
        if (
          prevElement
          && !prevElement.isCloser()
          && prevElement.name !== currentElement.name
        ) {
          return false;
        }
        swapElement(currentElement.parent);
      } else {
        // A node cannot contain a node with the same tag. ex) <a><a></a></a> => false
        if (currentElement.name === currentElement.parent.name) {
          return false;
        }
        //  A node cannot be followed by a node with the same tag. ex) <a></a><a></a> => false
        const myIndex = currentElement.parent.children.findIndex(x => x === currentElement);
        const prevElement = currentElement.parent.children[myIndex - 1];
        if (prevElement && prevElement.name === currentElement.name) {
          return false;
        }
      }
    } else {
      if (
        !currentElement.isCompleted && (
          (byte >= 'a' && byte <= 'z')
          || (byte >= 'A' && byte <= 'Z')
          || (byte >= '0' && byte <= '9')
          || byte === '-'
        )
      ) {
        currentElement.addNameByte(byte);
      }
    }
  }
  // <a> => false
  if (currentElement !== rootElement) {
    return false;
  }
  return true;
};
