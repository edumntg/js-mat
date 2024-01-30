import {mat} from '../mat/Mat'

describe('Testing matrix dot-product functionality', () => {
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
            [1, 2, 3]
        ])

        M4 = new mat.Matrix([
            [5, 6, 7]
        ]);

        expected1 = new mat.Matrix([
            [89, 10, -15, 94],
            [26, -18, -3, 39],
            [33, -3, -9, 56]
        ]);

        expected2 = new mat.Matrix([
            [38],
        ]);
    });

    test('Test correct values after matrix dot-product', () => {
        let M12 = M1.dot(M2);
        expect(M12.diff(expected1).norm()).toBeLessThan(1E-6);
    });

    test('Test correct size after matrix multiplication', () => {
        let M12 = M1.dot(M2);
        expect(M12.shape).toStrictEqual([3, 4]);
    });

    test('Test correct values after dot-product between two vectors', () => {
        let M34 = M3.dot(M4);
        expect(M34.diff(expected2).norm()).toBeLessThan(1E-6);
    });

    test('Test correct values after dot-product between two vectors with different orientations', () => {
        let M34 = M3.dot(M4.T);
        expect(M34.diff(expected2).norm()).toBeLessThan(1E-6);
    });
})