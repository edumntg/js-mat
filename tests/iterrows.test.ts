import {mat} from '../mat/Mat'

describe('Testing matrix iterrows generator', () => {
    let M: mat.Matrix;

    beforeAll(() => {
        // Initialize a 3x3 matrix
        M = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4]
        ]);

    });

    test('Test correct rows returned', () => {
        const iter = M.iterrows();
        expect(iter.next().value).toStrictEqual([5, 9, 2]);
        expect(iter.next().value).toStrictEqual([1,8,5]);
        expect(iter.next().value).toStrictEqual([3,6,4]);
    });

    test('Test correct Array-type returned', () => {
        for(let row of M.iterrows()) {
            expect(row).toBeInstanceOf(Array);
        }
    });

    test('Test correct Matrix-type returned', () => {
        for(let row of M.iterrows( true)) {
            expect(row).toBeInstanceOf(mat.Matrix);
        }
    });
})