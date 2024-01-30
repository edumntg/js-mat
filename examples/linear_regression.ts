/**
 * Linear Regression implementation
 */

import {mat} from '../mat/Mat'

// First, we create a synthetic data
let x: mat.Matrix = mat.linspace(0, 5, 100).T;
let y: mat.Matrix = x.multiply(12.5).add(21); // 5x + 20

// Initialize weights and bias
let w: mat.Matrix = mat.rand(1,1);
let b: number = Math.random()*20; // random number between 0 and 20

// Learning rate and number of epochs
let lr: number = 0.01;
let epochs: number = 1000;

// Helper variables we will use
let y_hat: mat.Matrix;
let loss: mat.Matrix;
let dw: mat.Matrix;
let db: mat.Matrix;

// Perform linear regression
for(let epoch = 0; epoch < epochs; epoch++) {
    // First, predict values
    y_hat = x.dot(w).add(b);

    // Calculate loss
    loss = y.diff(y_hat).pow(2).sum().multiply(1.0 / y.size());

    // Calculate gradient
    dw = x.T.dot(y.diff(y_hat)).sum().multiply(-2.0 / y.size());
    db = y.diff(y_hat).sum().multiply(-2.0 / y.size());

    // Update values
    w = w.diff(dw.multiply(lr));
    b -= lr*db.arr[0][0];

    console.log(`Epoch ${epoch+1}, loss:`, loss.as_scalar());
}

// Print solution
console.log(w,b)