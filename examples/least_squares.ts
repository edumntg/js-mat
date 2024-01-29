// In this example we solve a system of equations using the Least Squares method
//  coefficients = inv(A.T@A)@b
// Example:
//      Given the formula: a + b*x + c*x^2 + d*x^3, find the coefficients a, b, c and d
//      The following points of the equation are given:
//      (-2, -59.62), (0.7, 4.9883), (1.2, 10.0248), (3, 113.73)
//
//      The solution for the coefficients are:
//          a = 2.7
//          b = 3.5
//          c = -3.83
//          d = 5.00
import {mat} from '../mat/Mat'

// Construct A
let A: mat.Matrix = new mat.Matrix([
    [1, -2, 4, -8],
    [1, 0.7, 0.49, 0.343],
    [1, 1.2, 1.44, 1.7280],
    [1, 3, 9, 27]
]);

// Construct b
let b: mat.Matrix = new mat.Matrix([[-59.62, 4.9883, 10.0248, 113.73]]).T; // transpose to convert to a column vector

// now, solve
let x_sol: mat.Matrix = (A.T.multiply(A).inv()).multiply(A.T).multiply(b);

console.log(x_sol);
//    [ 2.6999999999961837 ],
//    [ 3.5000000000030482 ],
//    [ -3.8299999999998673 ],
//    [ 5.000000000000288 ]