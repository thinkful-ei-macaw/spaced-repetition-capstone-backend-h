class _Node {
  constructor(value = null, next = null, previous = null) {
    this.value = value;
    this.next = next;
    this.previous = previous;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }
  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }
  insertBefore(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }

    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value !== key) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    previousNode.next = new _Node(item, currNode);
  }
  insertAfter(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }

    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && previousNode.value !== key) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    previousNode.next = new _Node(item, currNode);
  }
  insertAt(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }

    let currNode = this.head;
    let previousNode = this.head;

    for (let i = 1; i < parseInt(key); i++) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    previousNode.next = new _Node(item, currNode);
  }
  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }
  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log("Item not found");
      return;
    }
    while (currNode !== null && previousNode.value !== key) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    previousNode.next = currNode.next;
  }
  moveHead(m) {
    console.log(m);
    let i = 1;
    let oldHead = this.head;
    this.head = this.head.next;
    let temp = this.head;
    while (i < m && temp.next !== null) {
      temp = temp.next;

      i++;
    }
    oldHead.next = temp.next;
    temp.next = oldHead;
  }
}

function display(list) {
  if (list.head === null) {
    throw new Error("List is empty or does not");
  }

  let currNode = list.head;

  while (currNode !== null) {
    console.log(currNode.value);
    currNode = currNode.next;
  }
}

function size(list) {
  if (list.head === null) {
  }

  let currNode = list.head;
  let counter = 0;
  while (currNode !== null) {
    counter++;
    currNode = currNode.next;
  }
  return counter;
}

function isEmpty(list) {
  if (list.head === null) {
    console.log("List is empty");
    return true;
  } else {
    console.log("list is not empty");
    return false;
  }
}

function findPrevious(list, key) {
  if (list.head === null) {
    return;
  }

  let currNode = list.head;
  let previousNode = list.head;

  while (currNode !== null && currNode.value !== key) {
    previousNode = currNode;
    currNode = currNode.next;
  }
  console.log("findPrevious result", previousNode.value);
  return previousNode.value;
}

function findLast(list) {
  if (list.head === null) {
    return;
  }

  let currNode = list.head;
  let previousNode = list.head;

  while (currNode !== null) {
    previousNode = currNode;
    currNode = currNode.next;
  }
  console.log("last node is", previousNode);
  return previousNode;
}

function reverse(list) {
  if (list.head === null) {
    return;
  }
  let previous = null;
  let curr = list.head;
  let nextNode = list.head.next;

  while (curr.next !== null) {
    curr.next = previous;

    previous = curr;
    curr = nextNode;
    nextNode = curr.next;
  }
  list.head = curr;

  curr.next = previous;

  console.log("reverse list is", list);
}

function reverseDouble(list) {
  if (list.head === null) {
    return;
  }
  let previous = null;
  let curr = list.head;
  let nextNode = list.head.next;

  while (curr.next !== null) {
    curr.next = previous;
    curr.previous = nextNode;
    previous = curr;
    curr = nextNode;
    nextNode = curr.next;
  }
  list.head = curr;
  curr.previous = nextNode;
  curr.next = previous;

  console.log("reverse list is", list);
}

function third(list) {
  let id = parseInt(size(list)) - 2;

  let currNode = list.head;
  let previousNode = list.head;

  for (let i = 1; i < parseInt(id); i++) {
    previousNode = currNode;
    currNode = currNode.next;
  }
  return currNode;
}

function findMiddleId(num) {
  if (num % 2 === 0) {
    num = num / 2;
  } else {
    num = Math.floor(num / 2) + 1;
  }
  return num;
}

function findMiddle(list) {
  let middle = parseInt(size(list));

  middle = findMiddleId(middle);

  let currNode = list.head;
  let previousNode = list.head;

  for (let i = 1; i < middle; i++) {
    previousNode = currNode;
    currNode = currNode.next;
  }
  return currNode;
}

function cycle(list) {
  let curr = list.head;
  let ret = false;

  curr.next.next = curr;

  while (curr.next !== null) {
    if (curr.visited === true) {
      ret = true;
      break;
    }
    curr.visited = true;
    curr = curr.next;
  }
  return ret;
}

module.exports = {
  LinkedList,
  display,
  cycle,
  findMiddle,
  third,
  reverseDouble,
  reverse,
  findLast,
  findPrevious,
  isEmpty,
};
