import { createHeap, Heap } from '../src';

describe("Heaps labeled to grow", () => {
    it("Should grow when pushed and shrink when popped", () => {
        const maxHeap: Heap<number, number> = createHeap((a, b) => b - a, 8, true);
        for (let i = 0; i < 20; i++) {
            const randNum: number = Math.random() * 10;
            maxHeap.push({ key: randNum, value: randNum });
            // console.log(maxHeap._list);
            // console.log(maxHeap._lastLeaf);
        }
        // console.log(maxHeap._list);

        expect(maxHeap.getListCopy().length).toBe(32);
        

        // console.log(maxHeap.pop());
        // console.log(maxHeap._list);
        // console.log(maxHeap.pop());
        // console.log(maxHeap._list);

        // console.log(maxHeap._list);
        for (let i = 0; i < 26; i++) {
            maxHeap.pop();
            // console.log(`${i}: ${maxHeap.pop()}`);
            // console.log(maxHeap._list.slice(0, 7));
        }
        // console.log(maxHeap._list);

        // expect(maxHeap._list.length).toBe(8);

        // console.log(maxHeap._list);
    });

    it("Should keep the max element at the top, even after popped", () => {
        // CHECK THIS 10 TIMES (SOME CASES MAY PASS AND FAIL OTHER TIMES, GIVEN THE TET INPUT)
        for(let iterations = 0; iterations < 10; iterations++) {

            const maxHeap: Heap<number, number> = createHeap((a, b) => a - b, 8, true);

            for (let i = 0; i < 20; i++) {
                const randNum: number = Math.random() * 10;
                maxHeap.push({ key: randNum, value: randNum });
                // console.log(maxHeap._list);
                // console.log(maxHeap._lastLeaf);
            }
            // console.log(maxHeap._list);
            
            expect(maxHeap.getListCopy().length).toBe(32);
            
            
            // console.log(maxHeap.pop());
            // console.log(maxHeap._list);
            // console.log(maxHeap.pop());
            // console.log(maxHeap._list);
            
            // console.log(maxHeap._list);
            const poppedList: number[] = [];
            for (let i = 0; i < 26; i++) {
                // console.log(maxHeap._list);
                poppedList.push(maxHeap.pop());
                // console.log(`${i}: ${maxHeap.pop()}`);
                // console.log(maxHeap._list.slice(0, 7));
            }
            // console.log(maxHeap._list);
            
            // console.log(poppedList);
            
            for(let i = 0; i < poppedList.length - 1; i++) {
                const a: number = poppedList[i];
                const b: number = poppedList[i + 1];
                if(a != undefined && b != undefined) expect(poppedList[i]).toBeGreaterThan(poppedList[i + 1]);
            }
            
            // console.log(maxHeap._list);
        }
    });

    it("Should be able to grow again again, even after shrinking", () => {
        const maxHeap: Heap<number, number> = createHeap((a, b) => b - a, 8, true);

        for(let iterations = 0; iterations < 10; iterations++) {

            // console.log(maxHeap.size());
            for (let i = 0; i < 20; i++) {
                const randNum: number = Math.random() * 10;
                maxHeap.push({ key: randNum, value: randNum });
                // console.log(maxHeap._nextLeafIndex);
                // console.log(maxHeap.size());
            }
            
            expect(maxHeap.getListCopy().length).toBe(32);
            
            for (let i = 0; i < 26; i++) {
                maxHeap.pop();
            }

            expect(maxHeap.getListCopy().length).toBe(8);
        }
    });
});

describe("Heaps labeled not to grow", () => {
    it("Should not grow when pushed pasted its limit and stay the same size when popped", () => {
        const maxHeap: Heap<number, number> = createHeap((a, b) => b - a, 8, false);
        for (let i = 0; i < 20; i++) {
            const randNum: number = Math.random() * 10;
            maxHeap.push({ key: randNum, value: randNum });
            // console.log(maxHeap._list);
            // console.log(maxHeap._lastLeaf);
        }
        // console.log(maxHeap._list);

        expect(maxHeap.getListCopy().length).toBe(8);
        

        // console.log(maxHeap.pop());
        // console.log(maxHeap._list);
        // console.log(maxHeap.pop());
        // console.log(maxHeap._list);

        // console.log(maxHeap._list);
        for (let i = 0; i < 26; i++) {
            maxHeap.pop();
            // console.log(`${i}: ${maxHeap.pop()}`);
            // console.log(maxHeap._list.slice(0, 7));
        }
        // console.log(maxHeap._list);

        // expect(maxHeap._list.length).toBe(8);

        // console.log(maxHeap._list);
    });

    it("Should keep the max element at the top, even after popped", () => {
        // CHECK THIS 10 TIMES (SOME CASES MAY PASS AND FAIL OTHER TIMES, GIVEN THE TET INPUT)
        for(let iterations = 0; iterations < 10; iterations++) {

            const maxHeap: Heap<number, number> = createHeap((a, b) => a - b, 8, false);

            for (let i = 0; i < 20; i++) {
                const randNum: number = Math.random() * 10;
                maxHeap.push({ key: randNum, value: randNum });
                // console.log(maxHeap._list);
                // console.log(maxHeap._lastLeaf);
            }
            // console.log(maxHeap._list);
            
            expect(maxHeap.getListCopy().length).toBe(8);
            
            
            // console.log(maxHeap.pop());
            // console.log(maxHeap._list);
            // console.log(maxHeap.pop());
            // console.log(maxHeap._list);
            
            // console.log(maxHeap._list);
            const poppedList: number[] = [];
            for (let i = 0; i < 26; i++) {
                // console.log(maxHeap._list);
                poppedList.push(maxHeap.pop());
                // console.log(`${i}: ${maxHeap.pop()}`);
                // console.log(maxHeap._list.slice(0, 7));
            }
            // console.log(maxHeap._list);
            
            // console.log(poppedList);
            
            for(let i = 0; i < poppedList.length - 1; i++) {
                const a: number = poppedList[i];
                const b: number = poppedList[i + 1];
                if(a != undefined && b != undefined) expect(poppedList[i]).toBeGreaterThan(poppedList[i + 1]);
            }
            
            // console.log(maxHeap._list);
        }
    });
});
