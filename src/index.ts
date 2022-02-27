type HeapKV<K, V> = {
    key: K;
    value: V;
};

type HeapComparator<K> = (key1: K, k2: K) => number;

export type Heap<K, V> = {
    push: (kv: HeapKV<K, V>) => boolean;
    pop: () => V | undefined;

    empty: () => boolean;
    hasSpace: () => boolean;
    capacity: () => number;
    getListCopy: () => HeapKV<K, V>[];
    count: () => number;
};

export function createHeap<K, V> (comparator: HeapComparator<K>, initialSize: number, canGrow: boolean): Heap<K, V> {
    let _initialCapacity = initialSize;

    let _list: HeapKV<K, V>[] = new Array(initialSize);

    let _nextEmptyIndex: number = 0;

    const push = (kv: HeapKV<K, V>): boolean => {
        // 1. If does not have space for more items, try to grow the _list
        if(!hasSpace()) {
            const grew: boolean = grow();
            if(!grew) return false;
        }

        // 2. Assign new value to leftmost leaf
        const assignedIndex: number = _assignLMLeaf(kv);

        // 3. Bubble up
        _bubbleUp(assignedIndex);
    }

    const pop = (): V => {
        if(empty()) return undefined;

        // 1. Record, then delete root
        const root: HeapKV<K, V> = _list[0];
        delete _list[0];

        // 2. Get leftmost leaf node
        const lmLeafNode: HeapKV<K, V> = _pluckLMLeaf();

        // 3. Replace root with leftmost leaf node
        _list[0] = lmLeafNode;

        // 4. Trickle down
        _trickleDown(0);

        _cleanHeap();

        return root.value;
    }

    const getListCopy = () => _list.slice();

    const empty = () => count() == 0;

    const capacity = () => _list.length;
    const hasSpace = () => count() < capacity();
    const count = (): number => _nextEmptyIndex;
    const grow = (): boolean => {
        // 1.1. Short circuit if cannot grow
        if(!canGrow) return false;

        // 1.2. Grow capacity
        _list = _list.concat(new Array(capacity()));
        return true;
    }

    /**
     * Call after this.pop() to check if the Heap has grown but is now mostly empty
     */
    const _cleanHeap = () => {
        const canShrink: boolean = capacity() > _initialCapacity;
        const halfIndex: number = capacity() / 2;
        const isHalfEmpty: boolean = _nextEmptyIndex <= halfIndex;
        if(canShrink && isHalfEmpty) _list = _list.slice(0, halfIndex)
    }

    const _assignLMLeaf = (kv: HeapKV<K, V>): number => {
        const index: number = _nextEmptyIndex;
        _list[index] = kv;

        _nextEmptyIndex++;

        return index;
    }

    const _pluckLMLeaf = (): HeapKV<K, V> => {
        const leftMostLeafIndex: number = _nextEmptyIndex - 1;
        const lmLeaf: HeapKV<K, V> = _list[leftMostLeafIndex]
        delete _list[leftMostLeafIndex];

        _nextEmptyIndex--;

        return lmLeaf;
    }

    // BUBBLE UP/ TRICKLE DOWN UTILS

    const _bubbleUp = (index: number): void => {
        // 1. Is the only node in the Heap, so short circuit
        if(index <= 0) return;
        
        const childNode: HeapKV<K, V> = _list[index];
        const parentNode: HeapKV<K, V> = _getParent(index);

        const childHasPriority: boolean = _hasPriority(childNode.key, parentNode.key);
        if(childHasPriority) {
            const parentIndex: number = _getParentIndex(index);

            _swap(parentIndex, index);
            _bubbleUp(parentIndex);
        }
    }

    const _trickleDown = (index: number) => {
        // 1. Get left and right children
        const leftChild: HeapKV<K, V> = _getLeftChild(index);
        const rightChild: HeapKV<K, V> = _getRightChild(index);

        // 2. Is a leaf node, so short circuit
        if (leftChild === undefined && rightChild === undefined) return;
        
        // 3. Choose direction to bubble down
        let largerChildIndex: number;

        // 3.1. Left child undefined, so check right
        if(leftChild == undefined) largerChildIndex = _getRightChildIndex(index);
        // 3.2. Right child undefined, so check left
        else if(rightChild == undefined) largerChildIndex = _getLeftChildIndex(index);
        // 3.3. Compare left vs right children to determine larger child
        else largerChildIndex = _hasPriority(leftChild.key, rightChild.key) ? _getLeftChildIndex(index) : _getRightChildIndex(index);

        // 4. Get Heap nodes corresponding to the current indexes
        const largerChildNode: HeapKV<K, V> = _list[largerChildIndex];
        const parentNode: HeapKV<K, V> = _list[index];

        // 5. Parent does not exist, so short circuitf
        if(!parentNode) {
            console.log('Parent does not exist')
            console.log('Short circuiting');
            console.log(index);
            console.log(parentNode);
            console.log(largerChildIndex);
            console.log(largerChildNode);
            return;
        }
        
        const childHasPriority: boolean = _hasPriority(largerChildNode.key, parentNode.key);
        if(childHasPriority) {
            _swap(largerChildIndex, index);
            _trickleDown(largerChildIndex);
        }
    }

    const _swap = (parentIndex: number, childIndex: number): void => {
        const temp: HeapKV<K, V> = _list[parentIndex];

        _list[parentIndex] = _list[childIndex];
        _list[childIndex] = temp;
    }

    const _hasPriority = (childKey: K, parentKey: K): boolean => comparator(childKey, parentKey) > 0;

    // CHILD/ PARENT UTILS
    
    const _getLeftChildIndex = (parentIndex: number): number => {
        return parentIndex * 2 + 1;
    }
    const _getLeftChild = (parentIndex: number): HeapKV<K, V> | undefined => {
        return _list[_getLeftChildIndex(parentIndex)];
    }

    const _getRightChildIndex = (parentIndex: number): number => {
        return parentIndex * 2 + 2;
    }
    const _getRightChild = (parentIndex: number): HeapKV<K, V> | undefined => {
        return _list[_getRightChildIndex(parentIndex)];
    }

    const _getParentIndex = (childIndex: number): number => {
        return Math.floor((childIndex - 1) / 2);
    }
    const _getParent = (childIndex: number): HeapKV<K, V> | undefined => {
        return _list[_getParentIndex(childIndex)];
    }


    const heap: Heap<K, V> = {
        push,
        pop,

        getListCopy,
        empty,
        hasSpace,
        capacity,
        count,
    };
    
    return heap;
}
