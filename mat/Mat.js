"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mat = void 0;
const assert_1 = require("assert");
const fs_1 = require("fs");
var mat;
(function (mat) {
    class Matrix {
        /**
         * Constructs a new Matrix object
         * @param m (nullable): Matrix or 2D array of numbers
         */
        constructor(m) {
            /**
             * Represents a Matrix
             */
            this.arr = [];
            this.nrows = 0;
            this.ncols = 0;
            if (m instanceof Matrix) {
                this.construct_fromMatrix(m);
            }
            else if (Array.isArray(m)) {
                this.construct_fromArray(m);
            }
            else {
                this.construct_empty();
            }
        }
        /**
         * Constructs an empty matrix
         * @private
         */
        construct_empty() {
            this.arr = [];
            this.nrows = 0;
            this.ncols = 0;
            return this;
        }
        /**
         * Construct a new Matrix object from an existing Matrix object
         * This one basically creates a copy of the given matrix
         * @param m: Matrix
         * @private
         */
        construct_fromMatrix(m) {
            let copy = m.copy();
            this.arr = copy.arr;
            this.nrows = copy.nrows;
            this.ncols = copy.ncols;
            return this;
        }
        /**
         * Creates a new Matrix object from a 2D array of numbers
         * @param arr: 2D array of numbers
         * @private
         */
        construct_fromArray(arr) {
            // Check that given argument is an array
            (0, assert_1.strict)(Array.isArray(arr), "Argument must be of array type");
            // Check that the array contains numbers only
            (0, assert_1.strict)(arr.every(item => item.every(x => typeof (x) === 'number')), "Argument must be an array of numbers");
            // get size
            let rows = arr.length;
            let columns = Array.isArray(arr[0]) ? arr[0].length : 1;
            this.arr = JSON.parse(JSON.stringify(arr));
            this.nrows = rows;
            this.ncols = columns;
            return this;
        }
        /**
         * Returns true if matrix is square
         */
        isSquare() {
            return this.nrows === this.ncols;
        }
        /**
         * Returns true if matrix is singular (i.e: determinant close to zero)
         */
        isSingular() {
            return this.det() <= Matrix.MIN_DET;
        }
        /**
         * Performs matrix-matrix multiplication and scalar-matrix multiplication
         * @param multiplier: Scalar or Matrix object
         */
        multiply(multiplier) {
            if (multiplier instanceof Matrix) {
                return this.matmul(multiplier);
            }
            else if (typeof (multiplier) === 'number') {
                return this.kmatmul(multiplier);
            }
            else {
                throw new Error("Parameter given for multiplication is invalid.");
            }
        }
        /**
         * Applies linear multiplication between elements in both matrix
         * e.g: result[0,0] = a[0,0]*b[0,0]
         * @param multiplier
         */
        linmul(M) {
            (0, assert_1.strict)(M.shape[0] === this.shape[0] && M.shape[1] === this.shape[1], "Matrices must have same size");
            let matrix = this.copy();
            for (let i = 0; i < this.nrows; i++) {
                for (let j = 0; j < this.ncols; j++) {
                    matrix.set(i, j, matrix.get(i, j) * M.get(i, j));
                }
            }
            return matrix;
        }
        /**
         * Peforms matrix-matrix multiplication only
         * @param m: Matrix object
         */
        matmul(m) {
            // get shape of each matrix to validate their dimensions
            let rows1 = this.nrows;
            let cols1 = this.ncols;
            let rows2 = m.nrows;
            let cols2 = m.ncols;
            // Check that shapes of matrices are valid
            (0, assert_1.strict)(cols1 === rows2, `Invalid matrices dimensions. Got [${this.shape}]x[${m.shape}]`);
            // Create empty matrix to store result
            let matrix = zeros(rows1, cols2);
            // Now, multiply
            for (let i = 0; i < rows1; i++) {
                for (let j = 0; j < cols2; j++) {
                    for (let k = 0; k < rows2; k++) {
                        matrix.set(i, j, matrix.get(i, j) + this.get(i, k) * m.get(k, j));
                    }
                }
            }
            return matrix;
        }
        /**
         * Performs scalar-matrix multiplication only
         * @param k
         */
        kmatmul(k) {
            // Check that multiplier is a number
            (0, assert_1.strict)(typeof (k) === 'number', "Argument must be a constant");
            // create a copy
            let copy = zeros(this.nrows, this.ncols);
            // Multiply
            let rows = copy.nrows;
            for (let i = 0; i < this.nrows; i++) {
                for (let j = 0; j < this.ncols; j++) {
                    copy.set(i, j, this.get(i, j) * k);
                }
            }
            return copy;
        }
        /**
         * Performs dot product a.*b of two arrays/matrix
         *  - If a and b are 1-D arrays, it is inner product of vectors
         *  - If both a and b are 2D arrays, it is matrix multiplication
         * @param M
         */
        dot(M) {
            if ((this.shape[0] === M.shape[0] && this.shape[1] === M.shape[1]) &&
                this.ndims === 1 &&
                M.ndims === 1) { // vectors
                return inner_prod(this, M);
            }
            else {
                return this.multiply(M);
            }
        }
        /**
         * Performs matrix addition
         * @param M: Matrix object
         */
        add(M) {
            if (M instanceof Matrix) {
                // Check that both matrices have the same size
                (0, assert_1.strict)(this.shape[0] === M.shape[0] && this.shape[1] === M.shape[1], "Matrices must have the same shape");
                return matrix_addition(this, M);
            }
            // If we reach this point, then M is a number
            return scalar_addition(this, M);
        }
        /**
         * Performs matrix subtraction
         * @param M: Matrix object
         */
        sub(M) {
            if (M instanceof Matrix) {
                // Check that both matrices have the same size
                (0, assert_1.strict)(this.shape[0] === M.shape[0] && this.shape[1] === M.shape[1], "Matrices must have the same shape");
                return matrix_subtraction(this, M);
            }
            // If we reach this point, then M is a number
            return scalar_subtraction(this, M);
        }
        subtract(M) {
            return this.sub(M);
        }
        diff(M) {
            return this.sub(M);
        }
        /**
         * Returns requested row as a 1D array of numbers
         * @param rowIndex: Index of row
         */
        getRow(rowIndex) {
            (0, assert_1.strict)(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
            let row = this.arr[rowIndex];
            if (typeof (row) === 'number') {
                row = [row];
            }
            return row;
        }
        /**
         * Changes rowIndex-th row of the Matrix
         * @param rowIndex: Row index
         * @param row: Row (array)
         */
        setRow(rowIndex, row) {
            // Check that rowIndex is valid
            (0, assert_1.strict)(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
            // Check that given row is an array
            (0, assert_1.strict)(Array.isArray(row), "Row parameter must be an array of numbers");
            // Check that row is a 1D array
            (0, assert_1.strict)(row.every(item => typeof (item) === 'number'), "Row parameter must be a 1D array");
            // Check that new row has a valid size
            (0, assert_1.strict)(this.ncols === row.length, "New row must have the same number of columns");
            // set row
            this.arr[rowIndex] = row;
            return this;
        }
        /**
         * Returns requested column as a 1D array of numbers
         * @param columnIndex: Index of column
         */
        getColumn(columnIndex) {
            // Validate column index
            (0, assert_1.strict)(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
            let column = [];
            // Insert values from column
            for (let i = 0; i < this.nrows; i++) {
                column.push(this.get(i, columnIndex));
            }
            return column;
        }
        /**
         * Changes columnIndex-th column of the Matrix
         * @param columnIndex: Column index
         * @param column: Column (array)
         */
        setColumn(columnIndex, column) {
            // Validate column index
            (0, assert_1.strict)(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
            // Check that column is an array
            (0, assert_1.strict)(Array.isArray(column), "Column must be an array");
            // Check that column contains numbers only
            (0, assert_1.strict)(column.every(item => typeof (item) === 'number'), "New column must contains numbers only.");
            // Check that column has a valid length
            (0, assert_1.strict)(column.length === this.nrows, "New column must have the same number of rows");
            // set column
            for (let i = 0; i < this.nrows; i++) {
                this.set(i, columnIndex, column[i]);
            }
            return this;
        }
        /**
         * Set (rowIndex, columnIndex)-th element in the Matrix
         * @param rowIndex: Row index
         * @param columnIndex: Column indeex
         * @param value: Value to set
         */
        set(rowIndex, columnIndex, value) {
            (0, assert_1.strict)(typeof (rowIndex) === 'number' && rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
            (0, assert_1.strict)(typeof (columnIndex) === 'number' && columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
            this.arr[rowIndex][columnIndex] = value;
            return this;
        }
        /**
         * Returns (rowIndex, columnIndex)-th element in the Matrix
         * @param rowIndex: Row index
         * @param columnIndex: Column index
         */
        get(rowIndex, columnIndex) {
            (0, assert_1.strict)(typeof (rowIndex) === 'number' && rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
            (0, assert_1.strict)(typeof (columnIndex) === 'number' && columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
            return this.arr[rowIndex][columnIndex];
        }
        /**
         * Returns the number of elements in the matrix
         */
        size() {
            return this.shape[0] * this.shape[1];
        }
        /**
         * Returns an array of 2 elements containing the size of the matrix.
         * The array contains: [number of rows, number of columns]
         */
        get shape() {
            return [this.nrows, this.ncols];
        }
        /**
         * Returns the number of dimensions in the Matrix
         */
        get ndims() {
            let is_flat = this.nrows === 1 || this.ncols === 1;
            return is_flat ? 1 : 2;
        }
        /**
         * Computes and returns the determinant of the matrix
         */
        det() {
            // Check if matrix is square
            (0, assert_1.strict)(this.nrows === this.ncols, "Matrix is not square");
            if (this.nrows === 1) {
                return this.get(0, 0);
            }
            else if (this.nrows == 2) {
                return this.get(0, 0) * this.get(1, 1) - this.get(1, 0) * this.get(0, 1);
            }
            else {
                // Calculate determinant
                let sums = 0;
                let retInDet = 1;
                let size = this.nrows;
                for (let colDet = 0; colDet < size; colDet++) {
                    // Create empty matrix of size - 1
                    let innerMatrix = zeros(size - 1, size - 1);
                    for (let row = 1, rowInner = 0; row < size; row++) {
                        for (let column = 0, columnInner = 0; column < size; column++) {
                            if (column === colDet) {
                                continue;
                            }
                            innerMatrix.set(rowInner, columnInner, this.get(row, column));
                            columnInner++;
                        }
                        rowInner++;
                    }
                    sums += retInDet * this.get(0, colDet) * innerMatrix.det();
                    retInDet *= -1;
                }
                return sums;
            }
        }
        /**
         * Returns the LU decomposition of the Matrix, as an array of two matrix [L, U]
         */
        LU() {
            (0, assert_1.strict)(this.nrows === this.ncols, "Matrix must be square");
            let size = this.nrows;
            let L = zeros(size, size);
            let U = zeros(size, size);
            // Decomposing into Upper and Lower triangular
            let sum;
            for (let i = 0; i < size; i++) {
                for (let k = i; k < size; k++) {
                    sum = 0;
                    for (let j = 0; j < i; j++) {
                        sum += L.get(i, j) * U.get(j, k);
                    }
                    // Evaluate U(i,k)
                    U.set(i, k, this.get(i, k) - sum);
                }
                for (let k = i; k < size; k++) {
                    if (i === k) {
                        L.set(i, i, 1); // identity
                    }
                    else {
                        sum = 0;
                        for (let j = 0; j < i; j++) {
                            sum += L.get(k, j) * U.get(j, i);
                        }
                        // Evaluate L(k,i)
                        L.set(k, i, (this.get(k, i) - sum) / U.get(i, i));
                    }
                }
            }
            return [L, U];
        }
        /**
         * Removes rowIndex-th row from the matrix
         * @param rowIndex
         */
        deleteRow(rowIndex) {
            (0, assert_1.strict)(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
            this.arr.splice(rowIndex, 1);
            this.nrows--;
            return this;
        }
        /**
         * Removes columnIndex-th column from the Matrix
         * @param columnIndex
         */
        deleteColumn(columnIndex) {
            (0, assert_1.strict)(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
            let arr = [];
            for (let i = 0; i < this.nrows; i++) {
                let row = this.getRow(i);
                row.splice(columnIndex, 1);
                arr.push(row);
            }
            this.arr = arr;
            this.ncols--;
            return this;
        }
        /**
         * Calculates the (i,j)-th minor matrix
         * @param i
         * @param j
         */
        minor(i, j) {
            // Create a copy of the matrix
            let matrix = this.copy();
            // Delete the given row and column
            matrix.deleteRow(i);
            matrix.deleteColumn(j);
            return matrix.det();
        }
        /**
         * Calculates the (i,j)-th cofactor of the matrix
         * @param i
         * @param j
         */
        cofactor(i, j) {
            //return Math.pow((-1), (row + column)) * this.minor(i, j);
            (0, assert_1.strict)(this.isSquare(), "Matrix is not square");
            return Math.pow(-1, i + j) * this.minor(i, j);
        }
        /**
         * Calculates the matrix of cofactors
         */
        cof() {
            // Generate an empty matrix
            let matrix = zeros(this.nrows, this.ncols);
            for (let i = 0; i < this.nrows; i++) {
                let row = [];
                for (let j = 0; j < this.ncols; j++) {
                    row.push(this.cofactor(i, j));
                }
                matrix.setRow(i, row);
            }
            return matrix;
        }
        /**
         * Returns a smaller sub-matrix constructed from the element of the original Matrix.
         * @param starrow: Starting row
         * @param endrow: Ending row
         * @param startcol: Starting column
         * @param endcol: Ending column
         */
        submat(starrow, endrow, startcol, endcol) {
            let rows = (endrow - starrow) + 1;
            let columns = (endcol - startcol) + 1;
            let matrix = zeros(rows, columns);
            let rowi = 0;
            let coli = 0;
            for (let i = starrow; i <= endrow; i++) {
                for (let j = startcol; j <= endcol; j++) {
                    matrix.set(rowi, coli, this.get(i, j));
                    coli++;
                }
                rowi++;
                coli = 0;
            }
            return matrix;
        }
        /**
         * Computes the adjoint matrix
         */
        adj() {
            return this.cof().T;
        }
        /**
         * Computes the inverse of the matrix
         */
        inv() {
            // Check that matrix is square
            (0, assert_1.strict)(this.isSquare(), "Matrix must be square");
            // Check that matrix is not singular
            (0, assert_1.strict)(!this.isSingular(), "Matrix is singular");
            return this.adj().multiply(1.0 / this.det());
        }
        /**
         * Returns the matrix transposed
         */
        transpose() {
            let transposed = zeros(this.ncols, this.nrows);
            for (let i = 0; i < this.nrows; i++) {
                for (let j = 0; j < this.ncols; j++) {
                    transposed.set(j, i, this.get(i, j));
                }
            }
            return transposed;
        }
        /**
         * To be used like numpy .T property. Return the transpose of the matrix
         */
        get T() {
            return this.transpose();
        }
        /**
         * Returns a copy of the matrix but with all elements positive
         */
        abs() {
            // Return the same matrix but with all positive values
            let matrix = this.copy();
            for (let i = 0; i < this.nrows; i++) {
                for (let j = 0; j < this.ncols; j++) {
                    matrix.set(i, j, Math.abs(this.get(i, j)));
                }
            }
            return matrix;
        }
        /**
         * Adds a new row to the matrix at the bottom
         * @param row: New row to be added
         */
        addRow(row) {
            (0, assert_1.strict)(row.length === this.ncols, "New row must have the same number of columns");
            this.arr.push(row);
            this.nrows++;
            return this;
        }
        /**
         * Adds a new column to the matrix at the right
         * @param column: New column to be added
         */
        addColumn(column) {
            (0, assert_1.strict)(column.length === this.nrows, "New column must have the same number of rows");
            for (let i = 0; i < this.nrows; i++) {
                let value = column[i];
                this.arr[i].push(value);
            }
            this.ncols++;
            return this;
        }
        /**
         * Simple but efficient way to compare if two matrices are equal
         * @param M: Matrix to be compared with
         */
        equals(M) {
            return JSON.stringify(this) === JSON.stringify(M);
        }
        /**
         * Applies a given function to each element in the matrix
         * @param callback: Function to be applied to each element
         */
        map(callback) {
            // Create a new copy matrix
            let matrix = this.copy();
            for (let i = 0; i < this.nrows; i++) {
                for (let j = 0; j < this.ncols; j++) {
                    //arr[i][j] = callback(arr[i][j]);
                    matrix.set(i, j, callback(matrix.get(i, j)));
                }
            }
            return matrix;
        }
        /**
         * Same as map(), applies a given function to each element in the matrix
         * @param callback: Function
         */
        apply(callback) {
            this.map(callback);
            return this;
        }
        /**
         * Reshapes the matrix to a new shape, if possible
         * @param shape. New shape
         */
        reshape(shape) {
            (0, assert_1.strict)(Array.isArray(shape), "Invalid shape");
            (0, assert_1.strict)(shape.length > 1, "New shape must contain at least 2 dimensions");
            (0, assert_1.strict)(shape.every(item => item > 0), "Invalid shape");
            (0, assert_1.strict)(shape[0] * shape[1] === this.size(), "Invalid shape");
            // Check if shape is valid
            let expectedNElements = shape.reduce((total, dim) => total = total * dim, 1);
            let nElements = this.shape[0] * this.shape[1];
            //assert(nElements === expectedNElements, "New shape is impossible");
            // First, put all elements from this matrix into a vector/flattened matrix
            let flattened = this.flatten();
            // Now, create the new matrix and insert the values
            let matrix = zeros(shape[0], shape[1]);
            let count = 0;
            for (let i = 0; i < matrix.nrows; i++) {
                for (let j = 0; j < matrix.ncols; j++) {
                    matrix.set(i, j, flattened.get(0, count++));
                }
            }
            return matrix;
        }
        /**
         * Flattens the matrix to a new Matrix with 1 row and this.size() columns
         */
        flatten() {
            // Create new matrix of 1 row and N columns where N is equal to the number of elements in the matrix
            let matrix = zeros(1, this.size());
            let n = 0;
            for (let i = 0; i < this.nrows; i++) {
                for (let j = 0; j < this.ncols; j++) {
                    matrix.set(0, n, this.get(i, j));
                    n++;
                }
            }
            return matrix;
        }
        /**
         * Same as flatten()
         */
        ravel() {
            return this.flatten();
        }
        /**
         * Extracts the diagonal of the matrix and returns it in a 1D array
         */
        diag() {
            // Return an array with the diagonal elements
            let diagonal = [];
            for (let i = 0; i < this.ncols; i++) {
                diagonal.push(this.get(i, i));
            }
            return diagonal;
        }
        /**
         * Returns the max value in the matrix
         */
        max() {
            if (this.nrows === 1) {
                return Math.max(...this.arr[0]);
            }
            let max_val = this.get(0, 0);
            for (let i = 0; i < this.nrows; i++) {
                let this_max = Math.max(...this.getRow(i));
                if (this_max > max_val) {
                    max_val = this_max;
                }
            }
            return max_val;
        }
        /**
         * Computes and returns the Frobenius norm of the matrix
         */
        norm() {
            // Returns the Frobenius norm of the matrix
            let norm = 0.0;
            for (let i = 0; i < this.shape[0]; i++) {
                for (let j = 0; j < this.shape[1]; j++) {
                    norm += Math.pow(Math.abs(this.get(i, j)), 2.0);
                }
            }
            return Math.sqrt(norm);
        }
        /**
         * Returns a generator(iterator) containing all rows as 1D-array of Matrix
         * @param as_matrix: If true, the returned rows will be Matrix objects
         */
        *iterrows(as_matrix = false) {
            for (let i = 0; i < this.nrows; i++) {
                let row = this.getRow(i);
                if (as_matrix) {
                    row = new Matrix([row]);
                }
                yield row;
            }
        }
        /**
         * Returns a generator(iterator) containing all columns as 1D-array of Matrix
         * @param as_matrix: If true, the returned columns will be Matrix objects
         */
        *itercolumns(as_matrix = false) {
            for (let i = 0; i < this.ncols; i++) {
                let column = this.getColumn(i);
                if (as_matrix) {
                    column = new Matrix([column]);
                }
                yield column;
            }
        }
        /**
         * Returns a generator(iterator) containing all elements of the Matrix
         */
        *iter() {
            // Return an iterator that iterates through all elements in the matrix
            for (let i = 0; i < this.nrows; i++) {
                for (let j = 0; j < this.ncols; j++) {
                    yield this.get(i, j);
                }
            }
        }
        /**
         * Returns the sum of all elements in the matrix
         */
        sum() {
            return sum(this);
        }
        /**
         * Returns the mean value of all elements in the matrix
         */
        mean() {
            return mean(this);
        }
        /**
         * Returns a matrix with all elements to the power of n
         * @param n: power
         */
        pow(n) {
            for (let i = 0; i < this.nrows; i++) {
                for (let j = 0; j < this.ncols; j++) {
                    this.set(i, j, Math.pow(this.get(i, j), n));
                }
            }
            return this;
        }
        /**
         * Only for matrix with a single element. Returns the value inside the matrix
         */
        as_scalar() {
            (0, assert_1.strict)(this.size() === 1, "Calling scalar value only works for Matrix with 1 element");
            return this.arr[0][0];
        }
        /**
         * Returns the matrix with all elements multiplied by -1
         */
        neg() {
            let matrix = this.copy();
            matrix.apply((x) => {
                return -1.0 * x;
            });
            return matrix;
        }
        /**
         * Shuffles the rows/columns in the array
         * if axis = 0, shuffles the rows
         * if axis = 1, shuffles the columns
         */
        shuffle(axis = 0) {
            for (let i = 0; i < this.nrows; i++) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = this.arr[i];
                this.arr[i] = this.arr[j];
                this.arr[j] = temp;
            }
            return this;
        }
        /**
         * The following function converts all NaN values in the matrix to 'n'
         * @param n: number
         */
        nanto(n) {
            this.arr = this.arr.map(row => row.map(x => isNaN(x) ? 0 : x));
            return this;
        }
        /**
         * Returns a deep copy of current matrix
         */
        copy() {
            // Create an empty matrix
            let matrix = new Matrix(null);
            matrix.arr = JSON.parse(JSON.stringify(this.arr));
            matrix.nrows = this.nrows;
            matrix.ncols = this.ncols;
            return matrix;
        }
    }
    Matrix.MIN_DET = 1e-9; // Min. value of a matrix's determinant to be considered singular
    mat.Matrix = Matrix;
    /**
     * Static method that creates a Matrix of random numbers
     * @param rows: Number of rows
     * @param columns: Number of  columns
     */
    function rand(rows, columns) {
        // Create empty array
        let arr = [];
        // fill with rows of random values
        let row;
        for (let i = 0; i < rows; i++) {
            row = Array.from({ length: columns }, () => Math.random());
            arr.push(row);
        }
        // Now create matrix
        return fromArray(arr);
    }
    mat.rand = rand;
    /**
     * Returns an empty matrix of size (0,0)
     */
    function empty() {
        return zeros(0, 0);
    }
    mat.empty = empty;
    /**
     * Returns a Matrix filled with zeros
     * @param rows: Number of rows
     * @param columns: Number of columns
     */
    function zeros(rows, columns) {
        let matrix = new Matrix(null);
        matrix.nrows = rows;
        matrix.ncols = columns;
        let row = new Array(columns).fill(0);
        for (let i = 0; i < rows; i++) {
            matrix.arr.push([...row]);
        }
        return matrix;
    }
    mat.zeros = zeros;
    /**
     * Returns a Matrix filled with ones
     * @param rows: Number of rows
     * @param columns: Number of columns
     */
    function ones(rows, columns) {
        // create a matrix of zeros
        let matrix = zeros(rows, columns);
        // Fill with 1
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                matrix.set(i, j, 1);
            }
        }
        return matrix;
    }
    mat.ones = ones;
    /**
     * Creates a new matrix from a 2D-array of numbers
     * @param arr: 2D array of numbers
     */
    function fromArray(arr) {
        // Check that given argument is an array
        (0, assert_1.strict)(Array.isArray(arr), "Argument must be of array type");
        // Check that given argument is a 2D array
        (0, assert_1.strict)(arr.every(item => Array.isArray(item)), "Argument must be a 2D array.");
        // Check that all rows have the same length
        let rows_length = arr[0].length;
        (0, assert_1.strict)(arr.every(item => item.length === rows_length, "All rows in the given 2D array must have the same length."));
        // Check that all elements in the array are numbers
        (0, assert_1.strict)(arr.every(item => item.every(x => typeof (x) === 'number')), "All elements in the array must be numbers.");
        // get size
        let rows = arr.length;
        let columns = Array.isArray(arr[0]) ? arr[0].length : 1;
        // Now, create a new matrix and set parameters
        let matrix = new Matrix(null);
        matrix.arr = JSON.parse(JSON.stringify(arr));
        matrix.nrows = rows;
        matrix.ncols = columns;
        return matrix;
    }
    mat.fromArray = fromArray;
    /**
     * Creates a new matrix from a Matrix object
     * @param m: Matrix
     */
    function fromMatrix(m) {
        // get size of matrix
        let rows = m.nrows;
        let columns = m.ncols;
        // Create an empty matrix
        let matrix = zeros(rows, columns);
        // Fill
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                matrix.set(i, j, m.get(i, j));
            }
        }
        return matrix;
    }
    mat.fromMatrix = fromMatrix;
    /**
     * Returns a Matrix of 1-row with a range of values
     * @param start: Starting number
     * @param end: Ending number
     * @param step: Step size
     */
    function arange(start, end, step) {
        (0, assert_1.strict)(start > 0 && end > 0, "Invalid range");
        (0, assert_1.strict)(end > start, "Invalid range");
        (0, assert_1.strict)(step > 0, "Invalid step");
        // calculate number of elements
        let n = (end - start) / step;
        let matrix = zeros(1, n);
        for (let i = 0; i < n; i++) {
            matrix.set(0, i, start + step * i);
        }
        return matrix;
    }
    mat.arange = arange;
    /**
     * Returns a Matrix of 1-row with N elements given a range of values
     * @param start: Starting number
     * @param end: Ending number
     * @param N: Number of elements
     */
    function linspace(start, end, N) {
        (0, assert_1.strict)(end > start, "Invalid range");
        (0, assert_1.strict)(N > 0, "Invalid number of elements");
        // calculate step
        let step = (end - start) / (N - 1);
        // calculate number of elements
        let matrix = zeros(1, N);
        for (let i = 0; i < N; i++) {
            matrix.set(0, i, start + step * i);
        }
        return matrix;
    }
    mat.linspace = linspace;
    /**
     * Returns an identity matrix of given size
     * @param size: number
     */
    function eye(size) {
        (0, assert_1.strict)(typeof (size) === 'number' && size > 0, "Param argument must be a positive number");
        // Create an empty matrix filled with zeros
        let matrix = zeros(size, size);
        // Fill diagonal
        for (let i = 0; i < size; i++) {
            matrix.set(i, i, 1);
        }
        return matrix;
    }
    mat.eye = eye;
    /**
     * Performs scalar multiplication for a given row and returns it as a 1D array
     * @param row: 1D array of numbers
     * @param k: Scalar/multiplier
     */
    function row_kmatmul(row, k) {
        return row.map(x => x * k);
    }
    mat.row_kmatmul = row_kmatmul;
    /**
     * Construct a Matrix filled with zeros except its diagonal, which contains the given elements
     * @param vector: 2D array or Matrix
     */
    function diag(vector) {
        // Accept vectors with only 1 row
        if (Array.isArray(vector)) {
            (0, assert_1.strict)(vector.length === 1, `Expected vector with 1 row. Got vector with ${vector.length} rows`);
        }
        else {
            // It is a matrix
            (0, assert_1.strict)(vector.shape[0] === 1, `Expected vector with 1 row. Got vector with ${vector.shape[0]} rows`);
        }
        // Construct a matrix with elements from 'vector' in the diagonal
        if (Array.isArray(vector)) {
            vector = new Matrix(vector);
        }
        // Construct new matrix
        let M = zeros(vector.size(), vector.size());
        let i = 0;
        for (let i = 0; i < M.shape[0]; i++) {
            M.set(i, i, vector.get(0, i));
        }
        return M;
    }
    mat.diag = diag;
    function inner_prod(a, b) {
        let a_shape = a.shape;
        b = b.reshape(a_shape);
        let result = 0.0;
        for (let i = 0; i < a_shape[0]; i++) {
            for (let j = 0; j < a.shape[1]; j++) {
                result += a.get(i, j) * b.get(i, j);
            }
        }
        return new Matrix([[result]]);
    }
    /**
     * Performs addition between two Matrix
     * @param a: Matrix
     * @param b: Matrix
     * @private
     */
    function matrix_addition(a, b) {
        // Check that both matrices have the same size
        (0, assert_1.strict)(a.shape[0] === b.shape[0] && a.shape[1] === b.shape[1], "Matrices must have the same shape");
        // Create a copy of this matrix
        let result = b.copy();
        // Now add
        for (let i = 0; i < a.nrows; i++) {
            for (let j = 0; j < a.ncols; j++) {
                result.set(i, j, a.get(i, j) + b.get(i, j));
            }
        }
        return result;
    }
    /**
     * Performs addition between a matrix and a scalar value
     * @param a: Matrix
     * @param b: Scalar
     * @private
     */
    function scalar_addition(a, b) {
        // Create a copy of current matrix
        let result = a.copy();
        // Now add the scalar to each element
        for (let i = 0; i < result.nrows; i++) {
            for (let j = 0; j < result.ncols; j++) {
                result.set(i, j, result.get(i, j) + b);
            }
        }
        return result;
    }
    /**
     * Performs subtraction between two Matrix
     * @param a: Matrix
     * @param b: Matrix
     * @private
     */
    function matrix_subtraction(a, b) {
        // Check that both matrices have the same size
        (0, assert_1.strict)(a.shape[0] === b.shape[0] && a.shape[1] === b.shape[1], "Matrices must have the same shape");
        // Create a copy of this matrix
        let result = zeros(a.shape[0], a.shape[1]);
        // Now add
        for (let i = 0; i < a.nrows; i++) {
            for (let j = 0; j < a.ncols; j++) {
                result.set(i, j, a.get(i, j) - b.get(i, j));
            }
        }
        return result;
    }
    /**
     * Performs subtraction between a matrix and a scalar value
     * @param a: Matrix
     * @param b: Scalar
     * @private
     */
    function scalar_subtraction(a, b) {
        // Create a copy of current matrix
        let result = a.copy();
        // Now add the scalar to each element
        for (let i = 0; i < result.nrows; i++) {
            for (let j = 0; j < result.ncols; j++) {
                result.set(i, j, result.get(i, j) - b);
            }
        }
        return result;
    }
    /**
     * Sums all elements in the matrix
     * @param a
     */
    function sum(a) {
        let result = 0.0;
        for (let i = 0; i < a.nrows; i++) {
            for (let j = 0; j < a.ncols; j++) {
                result += a.get(i, j);
            }
        }
        return new Matrix([[result]]);
    }
    mat.sum = sum;
    /**
     * Computes the mean for each row in the matrix.
     * Returns a column-vector/matrix
     * @param M: Matrix
     */
    function row_mean(M) {
        // Create a new matrix with size (m,1) where m is the number of rows in M
        let matrix = mat.zeros(M.nrows, 1);
        // Now, assign the means
        let rmean;
        let i = 0;
        for (let row of M.iterrows(true)) {
            row = row;
            rmean = row.sum().as_scalar() / row.size();
            matrix.set(i, 0, rmean);
        }
        return matrix;
    }
    mat.row_mean = row_mean;
    /**
     * Computes the mean for each column in the matrix.
     * Returns a row-vector/matrix
     * @param M: Matrix
     */
    function column_mean(M) {
        // Create a new matrix with size (1,n) where n is the number of columns in M
        let matrix = mat.zeros(1, M.ncols);
        // Now, assign the means
        let cmean;
        let i = 0;
        for (let column of M.itercolumns(true)) {
            column = column;
            cmean = column.sum().as_scalar() / column.size();
            matrix.set(0, i, cmean);
        }
        return matrix;
    }
    mat.column_mean = column_mean;
    /**
     * Calculates the mean value between all elements in the matrix
     * @param a
     */
    function mean(M, axis = 0) {
        if (axis === 0) { // return column mean
            return column_mean(M);
        }
        else {
            return row_mean(M);
        }
    }
    mat.mean = mean;
    /**
     * Concatenates the new matrix at the right of the current matrix
     * @param M: Matrix to be concatenated
     */
    function horzcat(a, b) {
        (0, assert_1.strict)(a.nrows === b.nrows, "Both matrices must have the same number of rows for horizontal concatenation");
        // Create a copy of the current matrix
        let matrix = a.copy();
        // Now add the columns of the other matrix
        for (let i = 0; i < b.ncols; i++) {
            matrix.addColumn(b.getColumn(i));
        }
        return matrix;
    }
    mat.horzcat = horzcat;
    /**
     * Concatenates the new matrix at the bottom of the current matrix
     * @param M: Matrix to be concatenated
     */
    function vertcat(a, b) {
        (0, assert_1.strict)(a.ncols === b.ncols, "Both matrices must have the same number of columns for vertical concatenation");
        // Create a copy of the current matrix
        let matrix = a.copy();
        // Now add the rows of the other matrix
        for (let i = 0; i < b.nrows; i++) {
            matrix.addRow(b.getRow(i));
        }
        return matrix;
    }
    mat.vertcat = vertcat;
    /**
     * Computes the ln(x) of each element in the matrix
     */
    function log(M) {
        let matrix = M.copy();
        matrix = matrix.apply((x) => {
            return Math.log(x);
        });
        return matrix;
    }
    mat.log = log;
    function load_txt(filename, delimiter = ',', header = false) {
        let data = (0, fs_1.readFileSync)(filename, 'utf-8');
        // Split by lines
        let rows = data.split('\n');
        // If not header, remove first row
        if (!header) {
            rows = rows.slice(1);
        }
        // Now, split each row by delimiter
        let all_data = rows.map(row => row.split(delimiter));
        return all_data;
    }
    mat.load_txt = load_txt;
    let linalg;
    (function (linalg) {
        /**
         * Static method that computes the Frobenius norm of the matrix
         * @param M: Matrix
         */
        function norm(M) {
            // Returns the Frobenius norm of the matrix
            let norm = 0.0;
            for (let i = 0; i < M.shape[0]; i++) {
                for (let j = 0; j < M.shape[1]; j++) {
                    norm += Math.pow(Math.abs(M.get(i, j)), 2.0);
                }
            }
            return Math.sqrt(norm);
        }
        linalg.norm = norm;
    })(linalg = mat.linalg || (mat.linalg = {}));
    function copy(M) {
        // Create an empty matrix
        let matrix = new Matrix(null);
        matrix.arr = JSON.parse(JSON.stringify(M.arr));
        matrix.nrows = M.nrows;
        matrix.ncols = M.ncols;
        return matrix;
    }
    mat.copy = copy;
    /**
     * Creates a new matrix with given size
     * @param nrows: If it is a number, it is assumed as number of rows. If it is an array, it is assumed as an array of 2 elements containing the shape
     * @param ncols: Number of columns
     */
    function matrix(data) {
        return fromArray(data);
    }
    mat.matrix = matrix;
})(mat || (exports.mat = mat = {}));
