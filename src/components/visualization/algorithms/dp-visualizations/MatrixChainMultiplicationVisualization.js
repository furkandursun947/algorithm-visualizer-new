import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for Matrix Chain Multiplication
const generateInitialData = () => {
  // Sample matrix dimensions
  // For matrices A, B, C, D, E, F
  // dimensions[i-1] x dimensions[i] gives the dimensions of matrix i
  // Example: dimensions = [30, 35, 15, 5, 10, 20, 25]
  // Matrix A: 30x35, Matrix B: 35x15, Matrix C: 15x5, Matrix D: 5x10, Matrix E: 10x20, Matrix F: 20x25
  const dimensions = [30, 35, 15, 5, 10, 20, 25];
  const n = dimensions.length - 1; // Number of matrices
  
  // Initialize DP table for minimum number of operations
  const m = Array(n + 1).fill().map(() => Array(n + 1).fill(Infinity));
  
  // Initialize table for optimal split positions
  const s = Array(n + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialize single matrices (cost = 0)
  for (let i = 1; i <= n; i++) {
    m[i][i] = 0;
  }
  
  return {
    dimensions,
    m,
    s,
    n,
    currentLength: 1,
    currentI: 0,
    currentJ: 0,
    currentK: 0,
    isComputing: false,
    isComplete: false,
    activeIndices: [],
    highlightedCells: [],
    optimalParenthesization: ''
  };
};

// Generate steps for Matrix Chain Multiplication
const generateMatrixChainSteps = (initialData) => {
  const steps = [];
  const { dimensions, n } = initialData;
  
  // Clone the initial data to avoid mutating it
  const m = initialData.m.map(row => [...row]);
  const s = initialData.s.map(row => [...row]);
  
  // Add step for initialization
  steps.push({
    data: {
      dimensions: [...dimensions],
      m: m.map(row => [...row]),
      s: s.map(row => [...row]),
      n,
      currentLength: 0,
      currentI: 0,
      currentJ: 0,
      currentK: 0,
      isComputing: false,
      isComplete: false,
      activeIndices: [],
      highlightedCells: [],
      optimalParenthesization: ''
    },
    description: "Initialize the DP tables. m[i][j] will store the minimum number of operations to multiply matrices i through j. s[i][j] will store the optimal split point.",
    codeHighlight: "for i := 1 to n do\n    m[i,i] := 0\nend for",
    complexityInfo: "Space complexity: O(n²) for the two tables"
  });
  
  // Add step for initializing diagonal (single matrices)
  const diagonalCells = [];
  for (let i = 1; i <= n; i++) {
    diagonalCells.push([i, i]);
  }
  
  steps.push({
    data: {
      dimensions: [...dimensions],
      m: m.map(row => [...row]),
      s: s.map(row => [...row]),
      n,
      currentLength: 1,
      currentI: 0,
      currentJ: 0,
      currentK: 0,
      isComputing: false,
      isComplete: false,
      activeIndices: [],
      highlightedCells: diagonalCells,
      optimalParenthesization: ''
    },
    description: "Set the cost of multiplying a single matrix to 0 on the diagonal of the table.",
    codeHighlight: "for i := 1 to n do\n    m[i,i] := 0\nend for",
    complexityInfo: "Initializing the base cases with O(n) operations"
  });
  
  // Fill the DP table
  // L is the chain length (l+1 matrices)
  for (let l = 1; l < n; l++) {
    // Consider chains of length l+1
    for (let i = 1; i <= n - l; i++) {
      const j = i + l;
      
      // Initialize m[i][j] to infinity
      m[i][j] = Infinity;
      
      // Highlight current subproblem
      steps.push({
        data: {
          dimensions: [...dimensions],
          m: m.map(row => [...row]),
          s: s.map(row => [...row]),
          n,
          currentLength: l + 1,
          currentI: i,
          currentJ: j,
          currentK: 0,
          isComputing: true,
          isComplete: false,
          activeIndices: Array.from({ length: l + 1 }, (_, idx) => i + idx - 1),
          highlightedCells: [[i, j]],
          optimalParenthesization: ''
        },
        description: `Computing optimal multiplication cost for matrices ${i} through ${j} (chain length: ${l+1}).`,
        codeHighlight: "for l := 1 to n-1 do\n    for i := 1 to n-l do\n        j := i+l",
        complexityInfo: `Subproblem: finding cost of multiplying matrices ${i} through ${j}`
      });
      
      // Try each possible split point
      for (let k = i; k < j; k++) {
        // Calculate cost of splitting at position k
        // cost = cost of left subchain + cost of right subchain + cost of multiplying resulting matrices
        const cost = m[i][k] + m[k+1][j] + dimensions[i-1] * dimensions[k] * dimensions[j];
        
        // Highlight the current split and component costs
        steps.push({
          data: {
            dimensions: [...dimensions],
            m: m.map(row => [...row]),
            s: s.map(row => [...row]),
            n,
            currentLength: l + 1,
            currentI: i,
            currentJ: j,
            currentK: k,
            isComputing: true,
            isComplete: false,
            activeIndices: Array.from({ length: l + 1 }, (_, idx) => i + idx - 1),
            highlightedCells: [[i, k], [k+1, j], [i, j]],
            optimalParenthesization: ''
          },
          description: `Trying split at k=${k}: Cost = m[${i}][${k}] + m[${k+1}][${j}] + dimensions[${i-1}]*dimensions[${k}]*dimensions[${j}] = ${m[i][k]} + ${m[k+1][j]} + ${dimensions[i-1] * dimensions[k] * dimensions[j]} = ${cost}`,
          codeHighlight: "        for k := i to j-1 do\n            q := m[i,k] + m[k+1,j] + d[i-1]*d[k]*d[j]\n            if q < m[i,j] then\n                m[i,j] := q\n                s[i,j] := k\n            end if\n        end for",
          complexityInfo: `Evaluating split at k=${k} with cost ${cost}`
        });
        
        // If this split is better than the current best
        if (cost < m[i][j]) {
          m[i][j] = cost;
          s[i][j] = k;
          
          // Update best split found so far
          steps.push({
            data: {
              dimensions: [...dimensions],
              m: m.map(row => [...row]),
              s: s.map(row => [...row]),
              n,
              currentLength: l + 1,
              currentI: i,
              currentJ: j,
              currentK: k,
              isComputing: true,
              isComplete: false,
              activeIndices: Array.from({ length: l + 1 }, (_, idx) => i + idx - 1),
              highlightedCells: [[i, j]],
              optimalParenthesization: ''
            },
            description: `Found better split at k=${k} with cost ${cost}. Updating m[${i}][${j}] = ${cost} and s[${i}][${j}] = ${k}.`,
            codeHighlight: "            if q < m[i,j] then\n                m[i,j] := q\n                s[i,j] := k\n            end if",
            complexityInfo: `New best split found with cost ${cost}`
          });
        }
      }
      
      // Finalize subproblem solution
      steps.push({
        data: {
          dimensions: [...dimensions],
          m: m.map(row => [...row]),
          s: s.map(row => [...row]),
          n,
          currentLength: l + 1,
          currentI: i,
          currentJ: j,
          currentK: s[i][j],
          isComputing: false,
          isComplete: false,
          activeIndices: Array.from({ length: l + 1 }, (_, idx) => i + idx - 1),
          highlightedCells: [[i, j]],
          optimalParenthesization: ''
        },
        description: `Completed computation for matrices ${i} through ${j}. Optimal cost: ${m[i][j]} with split at k=${s[i][j]}.`,
        codeHighlight: "        m[i,j] := q\n        s[i,j] := k",
        complexityInfo: `Completed subproblem (${i},${j}) with optimal cost ${m[i][j]}`
      });
    }
  }
  
  // Function to generate the optimal parenthesization string
  const printOptimalParenthesization = (i, j, matrixNames) => {
    if (i === j) {
      return matrixNames[i-1];
    }
    
    return "(" + 
      printOptimalParenthesization(i, s[i][j], matrixNames) + 
      printOptimalParenthesization(s[i][j] + 1, j, matrixNames) + 
      ")";
  };
  
  // Generate matrix names (A, B, C, etc.)
  const matrixNames = [];
  for (let i = 0; i < n; i++) {
    matrixNames.push(String.fromCharCode(65 + i)); // A, B, C, ...
  }
  
  // Generate optimal parenthesization
  const optimalParenthesization = printOptimalParenthesization(1, n, matrixNames);
  
  // Add final step
  steps.push({
    data: {
      dimensions: [...dimensions],
      m: m.map(row => [...row]),
      s: s.map(row => [...row]),
      n,
      currentLength: n,
      currentI: 1,
      currentJ: n,
      currentK: s[1][n],
      isComputing: false,
      isComplete: true,
      activeIndices: Array.from({ length: n }, (_, idx) => idx),
      highlightedCells: [[1, n]],
      optimalParenthesization
    },
    description: `Matrix Chain Multiplication complete. The minimum number of operations required is ${m[1][n]}. The optimal parenthesization is ${optimalParenthesization}.`,
    codeHighlight: "return m[1,n] and optimal parenthesization",
    complexityInfo: `Total time complexity: O(n³) | Final result: ${m[1][n]} operations`
  });
  
  return steps;
};

// Component to visualize the matrix chain and dimensions
const MatrixVisualization = ({ data }) => {
  const { dimensions, activeIndices } = data;
  const n = dimensions.length - 1;
  
  // Generate matrix names (A, B, C, etc.)
  const matrixNames = [];
  for (let i = 0; i < n; i++) {
    matrixNames.push(String.fromCharCode(65 + i)); // A, B, C, ...
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Matrices:</h3>
      <div className="flex flex-wrap gap-3">
        {matrixNames.map((name, index) => {
          const isActive = activeIndices.includes(index);
          return (
            <motion.div
              key={index}
              className={`border rounded-md p-3 ${isActive ? 'bg-yellow-100 border-yellow-500' : 'bg-blue-50 border-blue-300'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="text-center font-semibold mb-1">{name}</div>
              <div className="text-sm text-gray-600 text-center">
                {dimensions[index]} × {dimensions[index + 1]}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Component to visualize the DP tables
const DPTableVisualization = ({ data }) => {
  const { m, s, n, highlightedCells, currentI, currentJ, currentK } = data;
  
  // Generate matrix names (A, B, C, etc.)
  const matrixNames = [];
  for (let i = 1; i <= n; i++) {
    matrixNames.push(String.fromCharCode(64 + i)); // A, B, C, ...
  }
  
  // Helper function to determine cell class based on its role
  const getCellClass = (i, j, table) => {
    if (i > j) return "bg-gray-100 text-gray-400"; // Invalid cells
    if (i === j) return "bg-blue-100"; // Diagonal (base cases)
    
    // Check if this cell is highlighted
    const isHighlighted = highlightedCells.some(([hi, hj]) => hi === i && hj === j);
    
    if (isHighlighted) {
      if (table === 'm' && i === currentI && j === currentJ) {
        return "bg-green-200 font-bold"; // Current cell being computed
      }
      return "bg-yellow-100"; // Other highlighted cells
    }
    
    return "bg-white"; // Regular cells
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* M table (minimum operations) */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">M Table (Minimum Operations):</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100"></th>
                {matrixNames.map((name, i) => (
                  <th key={i} className="border p-2 bg-gray-100">{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixNames.map((name, i) => (
                <tr key={i}>
                  <th className="border p-2 bg-gray-100">{name}</th>
                  {Array.from({ length: n }, (_, j) => j + 1).map(j => (
                    <td 
                      key={j} 
                      className={`border p-2 text-center ${getCellClass(i + 1, j, 'm')}`}
                    >
                      {i + 1 <= j && m[i + 1][j] !== Infinity ? m[i + 1][j] : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* S table (split positions) */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">S Table (Split Positions):</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100"></th>
                {matrixNames.map((name, i) => (
                  <th key={i} className="border p-2 bg-gray-100">{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixNames.map((name, i) => (
                <tr key={i}>
                  <th className="border p-2 bg-gray-100">{name}</th>
                  {Array.from({ length: n }, (_, j) => j + 1).map(j => (
                    <td 
                      key={j} 
                      className={`border p-2 text-center ${getCellClass(i + 1, j, 's')}`}
                    >
                      {i + 1 < j ? s[i + 1][j] : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component to visualize the parenthesization
const ParenthesizationVisualization = ({ data }) => {
  const { optimalParenthesization, isComplete } = data;
  
  if (!isComplete || !optimalParenthesization) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Optimal Parenthesization:</h3>
      <motion.div 
        className="p-4 bg-green-100 rounded-md text-center text-lg font-mono"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {optimalParenthesization}
      </motion.div>
    </div>
  );
};

// Main visualization component for Matrix Chain Multiplication
const MatrixChainMultiplicationVisualizationComponent = ({ data, step, stepInfo }) => {
  return (
    <div className="w-full overflow-x-auto">
      <MatrixVisualization data={data} />
      <DPTableVisualization data={data} />
      <ParenthesizationVisualization data={data} />
    </div>
  );
};

// Container component with animation controls
const MatrixChainMultiplicationVisualization = () => {
  // Generate initial data for the Matrix Chain problem
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Matrix Chain Multiplication (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateMatrixChainSteps}
      VisualizationComponent={MatrixChainMultiplicationVisualizationComponent}
      description="Matrix Chain Multiplication is a classic dynamic programming problem that determines the most efficient way to multiply a sequence of matrices. The algorithm finds the optimal order of multiplications to minimize the total number of scalar operations, using a bottom-up approach to build solutions for increasingly larger subproblems."
    />
  );
};

export default MatrixChainMultiplicationVisualization; 