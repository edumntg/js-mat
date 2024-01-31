import {mat} from '../mat/Mat';

describe('Testing matrix norm', () => {
    let M: mat.Matrix;
    let expected: number;

    beforeAll(() => {
        // Initialize a 3x3 matrix
        M = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4]
        ]);

        expected = 16.15549442140351;
    });

    test('Test correct value', () => {
        let norm: number = mat.linalg.norm(M);
        expect(Math.abs(norm - expected)).toBeLessThan(1E-6);
    });
});