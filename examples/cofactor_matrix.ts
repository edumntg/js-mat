// Compute the cofactor matrix
import {mat} from '../mat/Mat'

// Create a matrix from an array
let M: mat.Matrix = new mat.Matrix([
    [5, 9, 2],
    [1, 8, 5],
    [3, 6, 4]
]);

// Calculate its inverse and print it
console.log(M.cof());