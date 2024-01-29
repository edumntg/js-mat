import {mat} from '../mat/Mat'

describe('Testing matrix diagonal', () => {
    let vector: mat.Matrix;
    let expected: mat.Matrix;

    beforeAll(() => {
        vector = new mat.Matrix([[5,8,4]]);
        expected = new mat.Matrix([
            [5, 0, 0],
            [0, 8, 0],
            [0, 0, 4]
        ]);
    });

    test('Test correct values', () => {
        let newM = mat.diag(vector);
        expect(newM.diff(expected).norm()).toBeLessThan(1E-6);
    });
})