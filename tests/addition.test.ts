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
            [12, 14, -1],
            [9, 7, 5],
            [-6, 3, 4]
        ]);

        expected2 = new mat.Matrix([
            [30, 34, 27],
            [26, 33, 30],
            [28, 31, 29]
        ]);
    });

    test('Test correct values after matrix addition', () => {
        let M12 = M1.add(M2);
        expect(M12.diff(expected1).norm()).toBeLessThan(1E-6);
    });

    test('Test correct size after matrix addition', () => {
        let M12 = M1.add(M2);
        expect(M12.shape).toStrictEqual([3, 3]);
    });

    test('Test correct values after scalar addition', () => {
        let M1k = M1.add(k);
        expect(M1k.diff(expected2).norm()).toBeLessThan(1E-6);
    });

    test('Test correct size after scalar addition', () => {
        let M1k = M1.add(k);
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