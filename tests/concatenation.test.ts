import {mat} from '../mat/Mat'

describe('Testing matrix concatenation', () => {
    let M1: mat.Matrix;
    let M2: mat.Matrix;
    let M3: mat.Matrix;
    let M4: mat.Matrix;
    let expected1: mat.Matrix;
    let expected2: mat.Matrix;

    beforeAll(() => {
        // Initialize a 3x3 matrix
        M1 = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4]
        ]);

        // Initialize a 3x4 matrix
        M2 = new mat.Matrix([
            [7, 5, -3, 12],
            [8, -1, 0, 4],
            [-9, -3, 0, -1]
        ]);

        M3 = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4]
        ]);

        // Initialize a 3x4 matrix
        M4 = new mat.Matrix([
            [7, 5, -3],
            [8, -1, 0],
            [-9, -3, 0],
            [21, -6, 3]
        ]);

        expected1 = new mat.Matrix([
            [5, 9, 2, 7, 5, -3, 12],
            [1, 8, 5, 8, -1, 0, 4],
            [3, 6, 4, -9, -3, 0, -1]
        ]);

        expected2 = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4],
            [7, 5, -3],
            [8, -1, 0],
            [-9, -3, 0],
            [21, -6, 3]
        ]);
    });

    test('Test correct values after horizontal concatenation', () => {
        let M12 = mat.horzcat(M1, M2);
        expect(M12.diff(expected1).norm()).toBeLessThan(1E-6);
    });

    test('Test correct size after horizontal concatenation', () => {
        let M12 = mat.horzcat(M1, M2);
        expect(M12.shape).toStrictEqual([3, 7]);
    });

    test('Test correct values after vertical concatenation', () => {
        let M34 = mat.vertcat(M3, M4);
        expect(M34.diff(expected2).norm()).toBeLessThan(1E-6);
    });

    test('Test correct size after vertical concatenation', () => {
        let M34 = mat.vertcat(M3, M4);
        expect(M34.shape).toStrictEqual([7, 3]);
    });
})