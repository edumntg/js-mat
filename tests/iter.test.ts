import {mat} from '../mat/Mat'

describe('Testing matrix iter generator', () => {
    let M: mat.Matrix;

    beforeAll(() => {
        // Initialize a 3x3 matrix
        M = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4]
        ]);

    });

    test('Test correct values returned', () => {
        const iter = M.iter();
        for(let i = 0; i < M.nrows; i++) {
            for(let j = 0; j < M.ncols; j++) {
                expect(iter.next().value).toStrictEqual(M.get(i,j));
            }
        }
    });
})