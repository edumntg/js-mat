// Create a matrix filled with random numbers
import {mat} from '../mat/Mat'

// Matrix filled with random numbers from 0 and 1
let M: mat.Matrix = mat.rand(5, 8);
console.log(M);

// Matrix filled with random numbers from 0 to 20
M = mat.rand(5,8).multiply(20);
console.log(M);