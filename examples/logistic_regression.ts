/**
 * Logistic Regression implementation
 */

import {mat} from '../mat/Mat'
import {join} from 'path';

// Load breast-cancer dataset
let data: string[][] = mat.load_txt(join(__dirname, './data/breast-cancer.csv'));

// Remove first column which contains ID
data = data.map(row => row.slice(1));

// Now, convert the first column from string to binary
for(let row of data) {
    row[0] = row[0] === 'B' ? '0' : '1';
}

// Now, convert all elements in the array to number
let num_data: number[][] = data.map(row => row.map(x => parseFloat(x)));

// Finally, create a matrix
let mat_data: mat.Matrix = new mat.Matrix(num_data);

// Shuffle
mat_data.shuffle();

// Take only the first 20 rows
mat_data = mat_data.submat(0, 20, 0, mat_data.ncols-1);

// Split into X and y
let y: mat.Matrix = new mat.Matrix([mat_data.getColumn(0)]).T;
let x: mat.Matrix = mat_data.deleteColumn(0);

// Initialize weights and bias
let w: mat.Matrix = mat.rand(x.shape[1] + 1,1); // + 1 because of intercept

// Helper variables we will use
let y_hat: mat.Matrix;
let loss: mat.Matrix;
let dw: mat.Matrix;
let z: mat.Matrix;
let h: mat.Matrix;
let acc: number;

// Add intercept to x
x = mat.horzcat(mat.ones(x.shape[0],1), x);

// Declare the sigmoid function
const sigmoid = (z: mat.Matrix) => {
    return z.map((n: number) => {
        return 1.0/(1.0 + Math.exp(-n));
    })
}

// Function to calculate predicted labels
const predict = (x: mat.Matrix, w: mat.Matrix) => {
    let z_pred: mat.Matrix = x.dot(w);
    let h_pred: mat.Matrix = sigmoid(z_pred);

    return h_pred.apply((x: number) => {
        return x >= 0.5 ? 1.0 : 0.0;
    });
}

// Function to compute accuracy
const accuracy_score = (y_real: mat.Matrix, y_hat: mat.Matrix) => {
    let equal: number = 0;
    for(let i = 0; i < y_real.nrows; i++) {
        for(let j = 0; j < y_real.ncols; j++) {
            if(y_real.get(i,j) == y_hat.get(i,j)) {
                equal += 1;
            }
        }
    }

    return equal / y_real.size();
};

// Learning rate and number of epochs
let lr: number = 0.01;
let epochs: number = 10;

// Perform linear regression
for(let epoch = 0; epoch < epochs; epoch++) {
    // Calculate z values
    z = x.dot(w); // [100,3]*[3,1] = [100,1]

    // Compute probabilities (h values)
    h = sigmoid(z); // [100,1]

    loss = (
        y.neg() // -y [100,1]
            .linmul(mat.log(h)) // ... *log(h)
            .diff(
                y.neg().add(1.0) // 1 - y
                    .linmul(mat.log(h.neg().add(1.0))) // log(1-h)
            )
    ).mean();

    // Calculate gradients
    dw = x.T.dot(h.diff(y)).multiply(1.0 / y.size());

    // Update values
    w = w.diff(dw.multiply(lr)); // w = w - lr*dw

    // Predict labels
    y_hat = predict(x, w);

    // Compute accuracy
    acc = accuracy_score(y, y_hat);

    console.log(`Epoch ${epoch+1}, loss: `, loss.as_scalar(), 'accuracy:', acc);
}
