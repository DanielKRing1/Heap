export default class Heap<T> {
    _list: (T | undefined)[];
    _nextLeafIndex: number;

    _comparator: (a: T, b: T) => number;
    _initialCapacity: number;
    _canGrow: boolean;

    /**
     * 
     * @param comparator Function returns a value:
     *                      > 0 to sort b before a
     *                      < 0 to sort a before b
     *                      == 0 for same value:
     *                          In this case, if the heap is full and == 0 is returned, then
     *                          the new value will be discarded
     * @param capacity 
     * @param canGrow 
     */
    constructor(comparator: (a: T, b: T) => number, capacity: number, canGrow: boolean = false) {
        this._list = new Array(capacity);
        this._nextLeafIndex = 0;
        this._comparator = comparator;

        this._initialCapacity = capacity;
        this._canGrow = canGrow;
    }

    size(): number {
        return this._list.length;
    }

    hasSpace(): boolean {
        return this._nextLeafIndex < this.size();
    }

    /**
     * 
     * @param a 
     * @param b 
     * @returns true if comparator(a, b) > 0, else false
     */
    hasPriority(a: T, b: T): boolean {
        return this._comparator(a, b) > 0
    }

    /**
     * Call after this.pop() to check if the Heap has grown but is now mostly empty
     */
    cleanHeap() {
        const hasGrown: boolean = this.size() > this._initialCapacity;
        const halfIndex: number = this.size() / 2;
        const isHalfEmpty: boolean = this._nextLeafIndex <= halfIndex;
        if(hasGrown && isHalfEmpty) this._list = this._list.slice(0, halfIndex)
    }

    /**
     * 
     * @param item 
     * @returns True if pushed into Heap, else false
     *              (in the case that the heap is full, was configured to not grow,
     *                  and the current item did not have priority over the last leaf in the Heap)
     */
    push(item: T): boolean {
        const hasSpace: boolean = this.hasSpace();
        const hasPriority: boolean = this._comparator(item, this._getLastLeafNode()!) > 0;
        if (hasSpace || hasPriority) this._setLastLeafNode(item);

        this._bubbleUp(this._nextLeafIndex);

        this._incLastLeaf();

        return hasSpace || hasPriority;
    }

    peek(): T | undefined {
        return this._list[0];
    }

    pop(): T | undefined {
        if(this._nextLeafIndex == 0) return undefined;

        // 1. Save top element
        const item: T | undefined = this.peek();

        // 2. Find last leaf that is not undefined
        let lastIndex: number = this._nextLeafIndex;

        while (lastIndex >= 0 && this._list[lastIndex] == undefined) lastIndex--;

        // 3. Swap top with last leaf
        this._swap(0, lastIndex);
        // 4. Remove last leaf (the popped root)
        delete this._list[lastIndex];
        this._decLastLeaf();

        // 5. Reorder heap
        this._bubbleDown(0);

        this.cleanHeap();

        return item;
    }

    _setLastLeafNode(item: T): void {
        this._list[this._nextLeafIndex] = item;
    }

    _getLastLeafNode(): T | undefined {
        return this._list[this._nextLeafIndex];
    }

    _bubbleDown(parentIndex: number): void {
        const leftChild: T | undefined = this._getLeftChild(parentIndex);
        const rightChild: T | undefined = this._getRightChild(parentIndex);

        // 1. Is a leaf node
        if (leftChild === undefined && rightChild === undefined) return;

        // 2. Choose direction to bubble down
        let largerChildIndex: number;
        if (leftChild === undefined) largerChildIndex = this._getRightChildIndex(parentIndex);
        else if (rightChild === undefined) largerChildIndex = this._getLeftChildIndex(parentIndex);
        // else largerChildIndex = this._comparator(leftChild, rightChild) > 0 ? this._getLeftChildIndex(parentIndex) : this._getRightChildIndex(parentIndex);
        else largerChildIndex = this._comparator(leftChild, rightChild) > 0 ? this._getLeftChildIndex(parentIndex) : this._getRightChildIndex(parentIndex);

        // 3. Check if should bubble down
        const parentNode: T | undefined = this._list[parentIndex];
        const largerChild: T | undefined = this._list[largerChildIndex];
        if (!parentNode || !largerChild) return;

        // 4. Parent is smaller than larger child
        const lessThanChild: boolean = this._comparator(parentNode, largerChild) < 0;
        if (lessThanChild) {
            this._swap(parentIndex, largerChildIndex);
            this._bubbleDown(largerChildIndex);
        }
    }

    _bubbleUp(childIndex: number): void {
        if (childIndex === 0) return;

        const childNode: T | undefined = this._list[childIndex];
        const parentNode: T | undefined = this._getParent(childIndex);

        if (!childNode || !parentNode) return;

        const greaterThanParent: boolean = this._comparator(childNode, parentNode) > 0;
        if (greaterThanParent) {
            const parentIndex: number = this._getParentIndex(childIndex);
            this._swap(childIndex, parentIndex);
            this._bubbleUp(parentIndex);
        }
    }

    _swap(i1: number, i2: number): void {
        const temp: T | undefined = this._list[i1];
        this._list[i1] = this._list[i2];
        this._list[i2] = temp;
    }

    _incLastLeaf(): number {
        // 1. Check if full
        if (this._nextLeafIndex >= this.size() - 1) {
            // 2. Double capacity
            if (this._canGrow) {
                this._list = this._list.concat(new Array(this.size()));

                this._nextLeafIndex++;
            }
        }
        // 2. Inc last leaf index
        else {
            this._nextLeafIndex++;
        }

        return this._nextLeafIndex;
    }

    _decLastLeaf() {
        this._nextLeafIndex--;
        return this._nextLeafIndex;
    }

    _getLeftChildIndex(parentIndex: number): number {
        return parentIndex * 2 + 1;
    }

    _getRightChildIndex(parentIndex: number): number {
        return parentIndex * 2 + 2;
    }

    _getLeftChild(parentIndex: number): T | undefined {
        return this._list[this._getLeftChildIndex(parentIndex)];
    }

    _getRightChild(parentIndex: number): T | undefined {
        return this._list[this._getRightChildIndex(parentIndex)];
    }

    _getParentIndex(childIndex: number): number {
        return Math.floor((childIndex - 1) / 2);
    }

    _getParent(childIndex: number): T | undefined {
        return this._list[this._getParentIndex(childIndex)];
    }
}
