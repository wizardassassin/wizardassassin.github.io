/**
 * In place Fisher–Yates Shuffle.
 * @param {Array} arr
 */
function shuffle(arr) {
    let i = arr.length;
    while (i > 1) {
        const pos = Math.floor(Math.random() * i);
        [arr[pos], arr[i - 1]] = [arr[i - 1], arr[pos]];
        i--;
    }
}
/**
 * In place Fisher–Yates Shuffle. 2D Arrays.
 * @param {Array<Array>} arr
 */
function shuffle2D(arr) {
    const rows = arr.length;
    const cols = arr[0].length;
    let a = rows * cols - 1;
    while (a > 0) {
        const pos = Math.floor(Math.random() * (a + 1));
        const [iPos1, jPos1] = convert1Dto2D(pos, rows, cols);
        const [iPos2, jPos2] = convert1Dto2D(a, rows, cols);
        [arr[iPos1][jPos1], arr[iPos2][jPos2]] = [
            arr[iPos2][jPos2],
            arr[iPos1][jPos1],
        ];
        a--;
    }
}

function swap2D(arr, row1, col1, row2, col2) {
    [arr[row1][col1], arr[row2][col2]] = [arr[row2][col2], arr[row1][col1]];
}

function swap(arr, pos1, pos2) {
    [arr[pos1], arr[pos2]] = [arr[pos2], arr[pos1]];
}

function convert1Dto2D(pos, rows, cols) {
    const i = Math.floor(pos / rows);
    const j = pos % cols;
    return [i, j];
}

function testShuffle() {
    let b = {};
    for (let i = 0; i < 10000; i++) {
        let a = [1, 2, 3];
        shuffle(a);
        const id = a.toString();
        if (!b[id]) {
            b[id] = 0;
        }
        b[id] += 1;
    }
    return b;
}

function testShuffle2D() {
    let b = {};
    for (let i = 0; i < 10000; i++) {
        let a = [
            [1, 4],
            [2, 6],
        ];
        shuffle2D(a);
        const id = a.toString();
        if (!b[id]) {
            b[id] = 0;
        }
        b[id] += 1;
    }
    return b;
}

function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

/**
 * Node of a linked list.
 */
class LLNode {
    data;
    /** @type {LLNode} */
    next;
    /** @type {LLNode} */
    prev;

    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

/**
 * A native implimentation of a linked list
 * would be cool.
 */
class LinkedList {
    /** @type {LLNode} */
    firstNode;
    /** @type {LLNode} */
    lastNode;
    length;

    constructor() {
        this.firstNode = null;
        this.lastNode = null;
        this.length = 0;
    }

    /**
     *
     * @callback findNodeCallback
     * @param {LLNode} nodeIter
     * @returns {Boolean}
     */

    /**
     *
     * @param {findNodeCallback} func
     */
    findNode(func) {
        let nodeIter = this.firstNode;
        while (nodeIter !== null && !func(nodeIter)) {
            nodeIter = nodeIter.next;
        }
        return nodeIter;
    }

    /**
     *
     * @param {LLNode} node
     */
    pushNode(node) {
        this.length++;
        if (!this.firstNode && !this.lastNode) {
            this.firstNode = node;
            this.lastNode = node;
            return;
        }
        node.prev = this.lastNode;
        this.lastNode.next = node;
        this.lastNode = node;
    }

    /**
     *
     * @param {LLNode} node
     */
    unshiftNode(node) {
        this.length++;
        if (!this.firstNode && !this.lastNode) {
            this.firstNode = node;
            this.lastNode = node;
            return;
        }
        node.next = this.firstNode;
        this.firstNode.prev = node;
        this.firstNode = node;
    }

    /**
     *
     * @param {LLNode} node
     */
    removeNode(node) {
        this.length--;
        if (node.prev) {
            node.prev.next = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        }
    }

    popNode() {
        const retNode = this.lastNode;
        if (this.firstNode === this.lastNode) {
            this.length--;
            this.firstNode = null;
            this.lastNode = null;
            return retNode;
        }
        this.removeNode(this.lastNode);
        this.lastNode = this.lastNode.prev;
        return retNode;
    }

    shiftNode() {
        const retNode = this.firstNode;
        if (this.firstNode === this.lastNode) {
            this.length--;
            this.firstNode = null;
            this.lastNode = null;
            return retNode;
        }
        this.removeNode(this.firstNode);
        this.firstNode = this.firstNode.next;
        return retNode;
    }
}
