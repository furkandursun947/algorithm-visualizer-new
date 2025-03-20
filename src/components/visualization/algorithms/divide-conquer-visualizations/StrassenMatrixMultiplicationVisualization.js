import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for the algorithm
const generateInitialData = () => {
  // Start with simple 2x2 matrices to clearly show the Strassen's algorithm
  const matrixA = [
    [2, 3],
    [4, 1]
  ];
  
  const matrixB = [
    [5, 7],
    [6, 8]
  ];
  
  return {
    matrixA,
    matrixB,
    resultMatrix: null,
    submatrices: {
      a11: [[matrixA[0][0]]], a12: [[matrixA[0][1]]], 
      a21: [[matrixA[1][0]]], a22: [[matrixA[1][1]]],
      b11: [[matrixB[0][0]]], b12: [[matrixB[0][1]]], 
      b21: [[matrixB[1][0]]], b22: [[matrixB[1][1]]]
    },
    products: null,
    resultQuadrants: null,
    computationStage: 'initial', // initial, divided, products, result
    currentStep: 0,
    isAnimating: false
  };
};

// Helper function for matrix addition
const addMatrices = (A, B) => {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = A[i][j] + B[i][j];
    }
  }
  return result;
};

// Helper function for matrix subtraction
const subtractMatrices = (A, B) => {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = A[i][j] - B[i][j];
    }
  }
  return result;
};

// Helper function to extract quadrant from a matrix
const getQuadrant = (matrix, row, col) => {
  const n = matrix.length / 2;
  const quadrant = [];
  for (let i = 0; i < n; i++) {
    quadrant[i] = [];
    for (let j = 0; j < n; j++) {
      quadrant[i][j] = matrix[i + row * n][j + col * n];
    }
  }
  return quadrant;
};

// Helper function to combine quadrants
const combineQuadrants = (c11, c12, c21, c22) => {
  const n = c11.length;
  const result = Array(2 * n).fill().map(() => Array(2 * n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i][j] = c11[i][j];
      result[i][j + n] = c12[i][j];
      result[i + n][j] = c21[i][j];
      result[i + n][j + n] = c22[i][j];
    }
  }
  
  return result;
};

// Function to generate the steps of the algorithm
const generateStrassenSteps = (initialData) => {
  const steps = [];
  const { matrixA, matrixB } = initialData;
  
  // Check if matrices can be multiplied
  if (!matrixA || !matrixB || matrixA[0].length !== matrixB.length) {
    steps.push({
      data: {
        ...initialData,
        error: true,
        description: "Error: Matrix dimensions do not allow multiplication."
      },
      description: "Error: Matrix dimensions do not allow multiplication.",
      codeHighlight: "if A.cols != B.rows then\n    return error",
      complexityInfo: "Time: O(1)"
    });
    return steps;
  }
  
  // Check if matrix dimensions are power of 2
  const n = matrixA.length;
  if (n !== matrixB.length || n !== matrixB[0].length || n & (n - 1) !== 0) {
    if (n !== 2) {
      steps.push({
        data: {
          ...initialData,
          note: true,
          description: "Note: For simplicity, this visualization uses 2x2 matrices. Strassen's algorithm works with matrices whose dimensions are powers of 2."
        },
        description: "Note: For simplicity, this visualization uses 2x2 matrices. Strassen's algorithm works with matrices whose dimensions are powers of 2.",
        codeHighlight: "// Check for power of 2 dimension",
        complexityInfo: "Time: O(1)"
      });
    }
  }
  
  // Step 1: Initialize and divide matrices
  steps.push({
    data: {
      ...initialData,
      computationStage: 'divided',
      submatrices: {
        a11: [[matrixA[0][0]]], a12: [[matrixA[0][1]]], 
        a21: [[matrixA[1][0]]], a22: [[matrixA[1][1]]],
        b11: [[matrixB[0][0]]], b12: [[matrixB[0][1]]], 
        b21: [[matrixB[1][0]]], b22: [[matrixB[1][1]]]
      }
    },
    description: "Matrices are initialized. Strassen's algorithm begins by dividing each matrix into four quadrants.",
    codeHighlight: "// Divide matrices into quadrants\na11, a12, a21, a22 := divide A into quadrants\nb11, b12, b21, b22 := divide B into quadrants",
    complexityInfo: "Time: O(n²)"
  });
  
  // Calculate the 7 products
  const a11 = [[matrixA[0][0]]];
  const a12 = [[matrixA[0][1]]];
  const a21 = [[matrixA[1][0]]];
  const a22 = [[matrixA[1][1]]];
  const b11 = [[matrixB[0][0]]];
  const b12 = [[matrixB[0][1]]];
  const b21 = [[matrixB[1][0]]];
  const b22 = [[matrixB[1][1]]];
  
  // For 2x2 matrices, we calculate the products directly since there's no recursion needed
  const p1 = [[addMatrices(a11, a22)[0][0] * addMatrices(b11, b22)[0][0]]];
  const p2 = [[addMatrices(a21, a22)[0][0] * b11[0][0]]];
  const p3 = [[a11[0][0] * subtractMatrices(b12, b22)[0][0]]];
  const p4 = [[a22[0][0] * subtractMatrices(b21, b11)[0][0]]];
  const p5 = [[addMatrices(a11, a12)[0][0] * b22[0][0]]];
  const p6 = [[subtractMatrices(a21, a11)[0][0] * addMatrices(b11, b12)[0][0]]];
  const p7 = [[subtractMatrices(a12, a22)[0][0] * addMatrices(b21, b22)[0][0]]];
  
  // Step 2: Calculate the 7 Strassen products
  steps.push({
    data: {
      ...initialData,
      computationStage: 'products',
      submatrices: {
        a11, a12, a21, a22,
        b11, b12, b21, b22
      },
      products: { p1, p2, p3, p4, p5, p6, p7 }
    },
    description: "Strassen's algorithm calculates 7 products, which will be used to compute the quadrants of the result matrix. These 7 products require only 7 multiplications instead of the 8 required by the standard algorithm.",
    codeHighlight: "// Calculate 7 products\np1 := (a11 + a22) * (b11 + b22)\np2 := (a21 + a22) * b11\np3 := a11 * (b12 - b22)\np4 := a22 * (b21 - b11)\np5 := (a11 + a12) * b22\np6 := (a21 - a11) * (b11 + b12)\np7 := (a12 - a22) * (b21 + b22)",
    complexityInfo: "Time: O(n^2.81)"
  });
  
  // Step 3: Calculate the result quadrants
  const c11 = [[p1[0][0] + p4[0][0] - p5[0][0] + p7[0][0]]];
  const c12 = [[p3[0][0] + p5[0][0]]];
  const c21 = [[p2[0][0] + p4[0][0]]];
  const c22 = [[p1[0][0] - p2[0][0] + p3[0][0] + p6[0][0]]];
  
  steps.push({
    data: {
      ...initialData,
      computationStage: 'quadrants',
      submatrices: {
        a11, a12, a21, a22,
        b11, b12, b21, b22
      },
      products: { p1, p2, p3, p4, p5, p6, p7 },
      resultQuadrants: { c11, c12, c21, c22 }
    },
    description: "Using the 7 products, we can now calculate the four quadrants of the result matrix according to Strassen's formulas.",
    codeHighlight: "// Calculate result quadrants\nc11 := p1 + p4 - p5 + p7\nc12 := p3 + p5\nc21 := p2 + p4\nc22 := p1 - p2 + p3 + p6",
    complexityInfo: "Time: O(n²)"
  });
  
  // Step 4: Combine the quadrants to get the final result
  const resultMatrix = [
    [c11[0][0], c12[0][0]],
    [c21[0][0], c22[0][0]]
  ];
  
  steps.push({
    data: {
      ...initialData,
      computationStage: 'result',
      submatrices: {
        a11, a12, a21, a22,
        b11, b12, b21, b22
      },
      products: { p1, p2, p3, p4, p5, p6, p7 },
      resultQuadrants: { c11, c12, c21, c22 },
      resultMatrix
    },
    description: "Finally, we combine the four quadrants to form the complete result matrix.",
    codeHighlight: "// Combine quadrants into result matrix\nreturn combine(c11, c12, c21, c22)",
    complexityInfo: "Time: O(n²)"
  });
  
  return steps;
};

// Component for displaying a matrix
const MatrixDisplay = ({ matrix, title, highlight }) => {
  return (
    <div className="flex flex-col items-center">
      {title && <div className="text-center font-semibold mb-2">{title}</div>}
      <div className={`grid grid-flow-row gap-1 p-3 border-2 ${highlight ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="w-12 h-10 flex items-center justify-center border border-gray-200 bg-white mx-1">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for displaying quadrants
const QuadrantsDisplay = ({ quadrants, title, subtitle }) => {
  const { a11, a12, a21, a22 } = quadrants;
  
  return (
    <div className="flex flex-col items-center mb-4">
      {title && <div className="text-center font-semibold mb-2">{title}</div>}
      {subtitle && <div className="text-center text-sm text-gray-600 mb-2">{subtitle}</div>}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 border border-blue-300 bg-blue-50">
          <div className="text-xs text-center mb-1">a11</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {a11[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-green-300 bg-green-50">
          <div className="text-xs text-center mb-1">a12</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {a12[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-red-300 bg-red-50">
          <div className="text-xs text-center mb-1">a21</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {a21[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-purple-300 bg-purple-50">
          <div className="text-xs text-center mb-1">a22</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {a22[0][0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for displaying the 7 products
const ProductsDisplay = ({ products, title }) => {
  const { p1, p2, p3, p4, p5, p6, p7 } = products;
  
  return (
    <div className="flex flex-col items-center mb-4">
      {title && <div className="text-center font-semibold mb-2">{title}</div>}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 border border-blue-300 bg-blue-50">
          <div className="text-xs text-center mb-1">p1</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {p1[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-green-300 bg-green-50">
          <div className="text-xs text-center mb-1">p2</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {p2[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-red-300 bg-red-50">
          <div className="text-xs text-center mb-1">p3</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {p3[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-purple-300 bg-purple-50">
          <div className="text-xs text-center mb-1">p4</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {p4[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-yellow-300 bg-yellow-50">
          <div className="text-xs text-center mb-1">p5</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {p5[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-teal-300 bg-teal-50">
          <div className="text-xs text-center mb-1">p6</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {p6[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-indigo-300 bg-indigo-50">
          <div className="text-xs text-center mb-1">p7</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {p7[0][0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for displaying the result quadrants
const ResultQuadrantsDisplay = ({ quadrants, title }) => {
  const { c11, c12, c21, c22 } = quadrants;
  
  return (
    <div className="flex flex-col items-center mb-4">
      {title && <div className="text-center font-semibold mb-2">{title}</div>}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 border border-blue-300 bg-blue-50">
          <div className="text-xs text-center mb-1">c11</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {c11[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-green-300 bg-green-50">
          <div className="text-xs text-center mb-1">c12</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {c12[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-red-300 bg-red-50">
          <div className="text-xs text-center mb-1">c21</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {c21[0][0]}
            </div>
          </div>
        </div>
        <div className="p-2 border border-purple-300 bg-purple-50">
          <div className="text-xs text-center mb-1">c22</div>
          <div className="flex justify-center">
            <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white">
              {c22[0][0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for displaying the formula
const FormulaDisplay = () => {
  return (
    <div className="flex flex-col items-center mt-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-semibold mb-2">Strassen's Formulas</h3>
      <div className="text-sm">
        <p className="mb-1">p1 = (a11 + a22) * (b11 + b22)</p>
        <p className="mb-1">p2 = (a21 + a22) * b11</p>
        <p className="mb-1">p3 = a11 * (b12 - b22)</p>
        <p className="mb-1">p4 = a22 * (b21 - b11)</p>
        <p className="mb-1">p5 = (a11 + a12) * b22</p>
        <p className="mb-1">p6 = (a21 - a11) * (b11 + b12)</p>
        <p className="mb-1">p7 = (a12 - a22) * (b21 + b22)</p>
      </div>
      <div className="border-t border-gray-200 my-2 w-full"></div>
      <div className="text-sm">
        <p className="mb-1">c11 = p1 + p4 - p5 + p7</p>
        <p className="mb-1">c12 = p3 + p5</p>
        <p className="mb-1">c21 = p2 + p4</p>
        <p className="mb-1">c22 = p1 - p2 + p3 + p6</p>
      </div>
    </div>
  );
};

// Main visualization component
const StrassenMatrixMultiplicationVisualizationComponent = ({ data, step, stepInfo }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading visualization...
      </div>
    );
  }
  
  if (data.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-300 rounded-md text-red-700">
        {stepInfo.description}
      </div>
    );
  }
  
  const { matrixA, matrixB, computationStage, submatrices, products, resultQuadrants, resultMatrix } = data;
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
        <MatrixDisplay matrix={matrixA} title="Matrix A" />
        <div className="text-2xl font-bold">×</div>
        <MatrixDisplay matrix={matrixB} title="Matrix B" />
        {computationStage === 'result' && (
          <>
            <div className="text-2xl font-bold">=</div>
            <MatrixDisplay matrix={resultMatrix} title="Result Matrix" highlight={true} />
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {/* Divide and conquer steps */}
          {computationStage !== 'initial' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Step 1: Divide Matrices into Quadrants</h3>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <QuadrantsDisplay quadrants={submatrices} title="Matrix A Quadrants" />
                <QuadrantsDisplay 
                  quadrants={{
                    a11: submatrices.b11,
                    a12: submatrices.b12,
                    a21: submatrices.b21,
                    a22: submatrices.b22
                  }} 
                  title="Matrix B Quadrants" 
                />
              </div>
            </div>
          )}
          
          {/* Show products if available */}
          {computationStage === 'products' || computationStage === 'quadrants' || computationStage === 'result' ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Step 2: Calculate the 7 Strassen Products</h3>
              <ProductsDisplay products={products} />
            </div>
          ) : null}
        </div>
        
        <div>
          {/* Show result quadrants if available */}
          {(computationStage === 'quadrants' || computationStage === 'result') && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Step 3: Calculate Result Quadrants</h3>
              <ResultQuadrantsDisplay quadrants={resultQuadrants} />
            </div>
          )}
          
          {/* Show the formula for reference */}
          <FormulaDisplay />
        </div>
      </div>
      
      {/* Show the final result */}
      {computationStage === 'result' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Final Result</h3>
          <p>
            The product of matrices A and B calculated using Strassen's algorithm is shown above.
            This algorithm requires only 7 multiplications instead of the 8 required by the standard algorithm,
            making it more efficient for large matrices.
          </p>
        </div>
      )}
    </div>
  );
};

// Main container component
const StrassenMatrixMultiplicationVisualization = () => {
  // Generate initial data for the visualization
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Strassen's Matrix Multiplication"
      initialData={initialData}
      generateSteps={generateStrassenSteps}
      VisualizationComponent={StrassenMatrixMultiplicationVisualizationComponent}
      description="Strassen's algorithm is a divide-and-conquer approach that reduces the number of recursive calls required for matrix multiplication, improving efficiency from O(n³) to approximately O(n^2.81)."
    />
  );
};

export default StrassenMatrixMultiplicationVisualization; 