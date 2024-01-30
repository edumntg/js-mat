import {mat} from '../mat/Mat'

describe('Testing matrix multiplication functionality', () => {
    let M1: mat.Matrix;
    let M2: mat.Matrix;
    let M3: mat.Matrix;
    let k: number;
    let expected1: mat.Matrix;
    let expected2: mat.Matrix;

    beforeAll(() => {
        // Initialize a 3x3 matrix
        M1 = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4]
        ]);

        // Initialize a 3x3 matrix
        M2 = new mat.Matrix([
            [7, 5, -3],
            [8, -1, 0],
            [-9, -3, 0]
        ]);

        // 3x4 matrix
        M3 = new mat.Matrix([
            [7, 5, -3, 17],
            [8, -1, 0, -21.5],
            [-9, -3, 0, 12]
        ]);

        k = 25;

        expected1 = new mat.Matrix([
            [-2, 4, 5],
            [-7, 9, 5],
            [12, 9, 4]
        ]);

        expected2 = new mat.Matrix([
            [-20, -16, -23],
            [-24, -17, -20],
            [-22, -19, -21]
        ]);
    });

    test('Test correct values after matrix subtraction', () => {
        let M12 = M1.diff(M2);
        expect(M12.diff(expected1).norm()).toBeLessThan(1E-6);
    });

    test('Test correct size after matrix subtraction', () => {
        let M12 = M1.diff(M2);
        expect(M12.shape).toStrictEqual([3, 3]);
    });

    test('Test correct values after scalar subtraction', () => {
        let M1k = M1.diff(k);
        expect(M1k.diff(expected2).norm()).toBeLessThan(1E-6);
    });

    test('Test correct size after scalar subtraction', () => {
        let M1k = M1.diff(k);
        expect(M1k.shape).toStrictEqual(M1.shape);
    });

    test('Test correct error message when shapes does not match', () => {
        try {
            M2.add(M3);
        } catch(error) {
            // @ts-ignore
            expect(error.message).toEqual("Matrices must have the same shape");
        }
    });
})