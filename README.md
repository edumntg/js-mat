# js-mat
JavaScript library for representation and mathematical operations using matrix

# Usage
Import the package as:
```javascript
import {mat} from '../mat/Mat'
```
Create a matrix of random values:
```javascript
var M: mat.Matrix = mat.rand(3,3); // create a 3x3 matrix
```

Create a null matrix:
```javascript
var M: mat.Matrix = mat.zeros(2,5); // create a 2x5 null matrix
```

Create a matrix of ones:
```javascript
var M: mat.Matrix = mat.ones(2,2) // create a 2x2 matrix of ones
```

Create an identity matrix:
```javascript
var I: mat.Matrix = mat.eye(4); // identity matrix of size 4x4
```

Create a matrix from a 2D array:
```javascript
// We show you two ways of doing it

// Using constructor
var M: mat.matrix = new mat.Matrix([
    [1,2,3],
    [4,5,6],
    [7,8,9]
]);

// Using the matrix function
var M: mat.Matrix = mat.matrix([
    [1,2,3],
    [4,5,6],
    [7,8,9]
]);
```

Create a matrix from another matrix
```javascript
var M1: mat.Matrix = mat.rand(3,6);
var M2: mat.Matrix = new mat.Matrix(M1); // equal to M1
```

# Operations
Addition:
```javascript
var M1 = new Matrix([
    [12,7,9],
    [5,-2,3]
]);
var M2 = new Matrix([
    [-3.6, 0, 5.4],
    [-12,-2,7]
]);

var result = M1.add(M2);
// [8.4, 7, 14.4]
// [-7, -4, -10]
```

Substraction:
```javascript
var M1 = new Matrix([
    [12,7,9],
    [5,-2,3]
]);
var M2 = new Matrix([
    [-3.6, 0, 5.4],
    [-12,-2,7]
]);

var result = M1.subtract(M2); // M1.diff(M2) also works
// [15.6, 7.0, 3.6]
// [17.0, 0, -4.0]
```

Multiplication:
```javascript
// Multiply two matrices
var M1 = new Matrix([
    [1, 2, 9],
    [-3, 7, 1]
]);

var M2 = new Matrix([
    [-5, 1],
    [3, 12],
    [1, 1]
]);

var result = M1.multiply(M2); // M1.dot(M2) also works
// [10, 34]
// [37, 82]
```

```javascript
// Multiply a matrix by a constant
var M1 = new Matrix([
    [1, 2, 9],
    [-3, 7, 1]
]);

var result = M1.multiply(5);
// [5, 10, 45]
// [-15, 35, 5]
```

Determinant:
```javascript
var M = new Matrix([
    [5, -2, 2, 7],
    [1, 0, 0, 3],
    [-3, 1, 5, 0],
    [3, -1, -9, 4]
]);

M.det(); // returns 88
```

Inverse:
```javascript
var M = new Matrix([
    [5, -2, 2, 7],
    [1, 0, 0, 3],
    [-3, 1, 5, 0],
    [3, -1, -9, 4]
]);

M.inv();

// [-0.1364,    0.8636,   -0.6818,   -0.4091]
// [-0.6364,    2.3636,   -0.9318,   -0.6591]
// [0.0455,    0.0455,   -0.0227,   -0.1136]
// [0.0455,    0.0455,    0.2273,    0.1364]
```

Transpose:
```javascript
var M = new Matrix([
    [5, -2, 2, 7],
    [1, 0, 0, 3],
    [-3, 1, 5, 0]
]);

M.T; // or also M.transpose()
// [5, 1, -3]
// [-2, 0, 1]
// [2, 0, 5]
// [7, 3, 0]
```

Cofactor Matrix:
```javascript
var M = new Matrix([
    [5, -2, 2, 7],
    [1, 0, 0, 3],
    [-3, 1, 5, 0],
    [3, -1, -9, 4]
]);

M.cof();

// [-12, -56, 4, 4]
// [76, 208, 4, 4]
// [-60, -82, -2, 20]
// [-36, -58, -10, 12]
```

Adjoint:
```javascript
var M = new Matrix([
    [5, -2, 2, 7],
    [1, 0, 0, 3],
    [-3, 1, 5, 0],
    [3, -1, -9, 4]
]);

M.adj();

//  [ -12, 76, -60, -36 ]
//  [ -56, 208, -82, -58 ]
//  [ 4, 4, -2, -10 ]
//  [ 4, 4, 20, 12 ]
```

Minor:
```javascript
// Calculate the determinant when removing the given row and column indexes
var M = new Matrix([
    [5, -2, 2, 7],
    [1, 0, 0, 3],
    [-3, 1, 5, 0],
    [3, -1, -9, 4]
]);

M.minor(0,1); // returns 56
```

And more matrix operations including:
* Horizontal concatenation: ```M1.horzcat(M2)```
* Vetical concatenation: ```M1.vertcat(M2)```
* Add row: ```M.addRow(row)```
* Add column: ```M.addColumn(column)```
* Remove row: ```M.deleteRow(index)```
* Delete column: ```M.deleteColumn(index)```
* Compare: ```M1.equals(M2)```
* map/apply: ```M.map(x => x**2), M.apply(x => x**2)```
* arange: ```Matrix.arange(2, 10, 0.5)```
* linspace: ```Matrix.linspace(0, 10, 100)```
* reshape: ```M.reshape([2,3])```
* flatten/ravel: ```M.flatten(), M.ravel()```
* diag: ```M.diag()```

# Examples
* [Solve a system of linear equations using Least Squares method](https://github.com/edumntg/js-mat/blob/main/examples/least_squares.ts)
* [Find the roots of a system of equations using Newton-Raphson method](https://github.com/edumntg/js-mat/blob/main/examples/newton_raphson.ts)
* [Perform Linear Regression method](https://github.com/edumntg/js-mat/blob/main/examples/linear_regression.ts)
* [Perform Logistic Regression](https://github.com/edumntg/js-mat/blob/main/examples/logistic_regression.ts)
Note: There are a lot more examples. but we highlights the ones that implements a lot of the functionalities mentioned above