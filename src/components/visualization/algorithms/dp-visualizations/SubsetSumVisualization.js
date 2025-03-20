import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for Subset Sum problem
const generateInitialData = () => {
  // Sample array and target sum
  const array = [3, 34, 4, 12, 5, 2];
  const targetSum = 9;
  
  // Number of elements in array
  const n = array.length;
  
  // Create a DP table to store whether a sum is possible
  // dp[i][j] = true if subset of array[0...i-1] has sum equal to j
  const dp = Array(n + 1).fill().map(() => Array(targetSum + 1).fill(false));
  
  // Base case: an empty subset can form a sum of 0
  dp[0][0] = true;
  
  return {
    array,
    targetSum,
    dp,
    currentIndex: 0,
    currentSum: 0,
    activeIndices: [],
    activeCells: [],
    isComplete: false,
    solution: null
  };
};

// Generate steps for Subset Sum visualization
const generateSubsetSumSteps = (initialData) => {
  const steps = [];
  const { array, targetSum } = initialData;
  const n = array.length;
  
  // Create a deep copy of the DP table
  let dp = Array(n + 1).fill().map(() => Array(targetSum + 1).fill(false));
  
  // Base case: empty subset can form sum 0
  dp[0][0] = true;
  
  // Add initial step
  steps.push({
    data: {
      array: [...array],
      targetSum,
      dp: JSON.parse(JSON.stringify(dp)),
      currentIndex: 0,
      currentSum: 0,
      activeIndices: [],
      activeCells: [[0, 0]],
      isComplete: false,
      solution: null
    },
    description: "Initialize DP table. Base case: An empty subset can form a sum of 0, so dp[0][0] = true.",
    codeHighlight: "dp[0][0] = true; // Base case",
    complexityInfo: "Time Complexity: O(n × sum) where n is the number of elements and sum is the target sum"
  });
  
  // Fill the DP table row by row (for each element)
  for (let i = 1; i <= n; i++) {
    const currentElement = array[i - 1];
    
    // Add step for considering the current element
    steps.push({
      data: {
        array: [...array],
        targetSum,
        dp: JSON.parse(JSON.stringify(dp)),
        currentIndex: i - 1,
        currentSum: 0,
        activeIndices: [i - 1],
        activeCells: [],
        isComplete: false,
        solution: null
      },
      description: `Considering element ${currentElement} at index ${i - 1}.`,
      codeHighlight: "for (int i = 1; i <= n; i++) { // Consider each element",
      complexityInfo: `Processing element ${i} of ${n}`
    });
    
    // For each possible sum j
    for (let j = 0; j <= targetSum; j++) {
      // Exclude the current element (copy from previous row)
      dp[i][j] = dp[i - 1][j];
      
      const activeCells = [[i - 1, j], [i, j]];
      
      // Add step for excluding the current element
      steps.push({
        data: {
          array: [...array],
          targetSum,
          dp: JSON.parse(JSON.stringify(dp)),
          currentIndex: i - 1,
          currentSum: j,
          activeIndices: [i - 1],
          activeCells,
          isComplete: false,
          solution: null
        },
        description: `For sum ${j}, first assume we don't include element ${currentElement}. dp[${i}][${j}] = dp[${i-1}][${j}] = ${dp[i-1][j]}.`,
        codeHighlight: "dp[i][j] = dp[i-1][j]; // Exclude current element",
        complexityInfo: `Checking if sum ${j} is possible without element ${currentElement}`
      });
      
      // Include the current element if possible
      if (j >= currentElement && dp[i - 1][j - currentElement]) {
        dp[i][j] = true;
        activeCells.push([i - 1, j - currentElement]);
        
        // Add step for including the current element
        steps.push({
          data: {
            array: [...array],
            targetSum,
            dp: JSON.parse(JSON.stringify(dp)),
            currentIndex: i - 1,
            currentSum: j,
            activeIndices: [i - 1],
            activeCells,
            isComplete: false,
            solution: null
          },
          description: `For sum ${j}, we can also include element ${currentElement} if sum ${j - currentElement} was possible with previous elements. Since dp[${i-1}][${j - currentElement}] = true, dp[${i}][${j}] = true.`,
          codeHighlight: "if (j >= arr[i-1] && dp[i-1][j-arr[i-1]]) dp[i][j] = true; // Include current element",
          complexityInfo: `Including element ${currentElement} helps achieve sum ${j}`
        });
      }
    }
  }
  
  // Find a solution if target sum is possible
  let solution = null;
  if (dp[n][targetSum]) {
    solution = findSolution(array, dp, targetSum);
  }
  
  // Add final step
  steps.push({
    data: {
      array: [...array],
      targetSum,
      dp: JSON.parse(JSON.stringify(dp)),
      currentIndex: -1,
      currentSum: targetSum,
      activeIndices: [],
      activeCells: [[n, targetSum]],
      isComplete: true,
      solution
    },
    description: dp[n][targetSum] 
      ? `Subset sum problem solved! A subset with sum ${targetSum} exists.` 
      : `Subset sum problem solved! No subset with sum ${targetSum} exists.`,
    codeHighlight: "return dp[n][sum]; // Final result",
    complexityInfo: `Final result: ${dp[n][targetSum] ? 'Subset exists' : 'No subset exists'}`
  });
  
  return steps;
};

// Function to find an actual solution (one of possibly many)
const findSolution = (array, dp, targetSum) => {
  const n = array.length;
  const subset = [];
  let sum = targetSum;
  
  // Trace back from dp[n][targetSum]
  for (let i = n; i > 0 && sum > 0; i--) {
    // If this item contributes to the sum
    if (dp[i][sum] && !dp[i-1][sum]) {
      subset.push(array[i-1]);
      sum -= array[i-1];
    }
  }
  
  return subset;
};

// Component to visualize the array
const ArrayVisualization = ({ data }) => {
  const { array = [], currentIndex = -1, activeIndices = [], solution = null } = data || {};
  
  if (!array || !array.length) {
    return <div className="mb-6 text-gray-500">No array data available</div>;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Input Array:</h3>
      <div className="flex flex-wrap gap-2">
        {array.map((num, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`
              flex items-center justify-center w-12 h-12 rounded-lg border-2
              ${currentIndex === index ? 'bg-green-100 border-green-500' : 
                activeIndices.includes(index) ? 'bg-yellow-100 border-yellow-500' : 
                solution && solution.includes(num) ? 'bg-purple-100 border-purple-500' :
                'bg-blue-50 border-blue-300'}
            `}
          >
            <span className="text-lg font-semibold">{num}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Component to visualize the DP table
const DPTableVisualization = ({ data }) => {
  const { dp, targetSum, activeCells = [] } = data;
  
  // Check if dp is initialized
  if (!dp || dp.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">DP Table:</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-2 py-1 bg-gray-50">Element \ Sum</th>
              {Array.from({ length: targetSum + 1 }, (_, i) => (
                <th key={i} className="border border-gray-200 px-3 py-1 bg-gray-50">{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <td className="border border-gray-200 px-2 py-1 bg-gray-50 font-medium">
                  {i === 0 ? "[]" : `[0...${i-1}]`}
                </td>
                {row.map((cell, j) => (
                  <td 
                    key={j} 
                    className={`border border-gray-200 px-3 py-1 text-center
                      ${activeCells.some(([a, b]) => a === i && b === j) ? 'bg-yellow-100' : 
                        cell ? 'bg-green-100' : 'bg-red-50'}`}
                  >
                    {cell ? "T" : "F"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component to visualize the solution
const SolutionVisualization = ({ data }) => {
  const { solution = null, targetSum = 0, isComplete = false } = data || {};
  
  if (!isComplete) return null;
  
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Solution:</h3>
      {solution ? (
        <div>
          <p className="text-green-700 font-medium mb-2">
            ✓ A subset with sum {targetSum} exists!
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-gray-700">One possible solution: </span>
            {solution.map((num, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
              >
                {num}
              </motion.span>
            ))}
            <span className="text-gray-700"> = {targetSum}</span>
          </div>
        </div>
      ) : (
        <p className="text-red-600 font-medium">
          ✗ No subset with sum {targetSum} exists.
        </p>
      )}
    </div>
  );
};

// Main visualization component
const SubsetSumVisualizationComponent = ({ data, step, stepInfo }) => {
  if (!data) {
    return (
      <div className="w-full flex items-center justify-center p-6 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: No data available for visualization</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <ArrayVisualization data={data} />
      <DPTableVisualization data={data} />
      <SolutionVisualization data={data} />
    </div>
  );
};

// Container component with animation controls
const SubsetSumVisualization = () => {
  // Generate initial data for the Subset Sum problem
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Subset Sum Problem (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateSubsetSumSteps}
      VisualizationComponent={SubsetSumVisualizationComponent}
      description="The Subset Sum Problem is to determine if there exists a subset of a given set of numbers that sums to a specific target value. This problem is solved using dynamic programming with a time complexity of O(n×sum), where n is the number of elements and sum is the target sum."
    />
  );
};

export default SubsetSumVisualization; 