import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for the LIS problem
const generateInitialData = () => {
  // Sample array for LIS
  const array = [10, 22, 9, 33, 21, 50, 41, 60];
  
  // Create a DP array where dp[i] represents the length of the LIS ending at index i
  const n = array.length;
  const dp = Array(n).fill(1); // Initially, each element is an LIS of length 1
  const prevIndices = Array(n).fill(-1); // Used to reconstruct the LIS
  
  return {
    array,
    dp,
    prevIndices,
    currentIndex: 0,
    comparingIndex: -1,
    lis: [], // Will store the actual LIS
    lisLength: 0,
    isComplete: false,
    activeIndices: [],
    currentLIS: []
  };
};

// Generate steps for LIS problem visualization
const generateLISSteps = (initialData) => {
  const steps = [];
  const { array } = initialData;
  
  // Clone the initial data to avoid mutating it
  const n = array.length;
  const dp = Array(n).fill(1); // Initialize dp with 1 (single element LIS)
  const prevIndices = Array(n).fill(-1); // Used to reconstruct the LIS
  
  // Add step for initialization
  steps.push({
    data: {
      array: [...array],
      dp: [...dp],
      prevIndices: [...prevIndices],
      currentIndex: -1,
      comparingIndex: -1,
      lis: [],
      lisLength: 0,
      isComplete: false,
      activeIndices: [],
      currentLIS: []
    },
    description: "Initialize the DP array. dp[i] represents the length of the longest increasing subsequence ending at index i. Initially, dp[i] = 1 for all i, as each element forms an LIS of length 1 by itself.",
    codeHighlight: "initialize dp[0...n-1] to 1",
    complexityInfo: "Space complexity: O(n) where n is the length of the array"
  });
  
  // Compute LIS using dynamic programming
  for (let i = 0; i < n; i++) {
    // Add step for starting to process current index
    steps.push({
      data: {
        array: [...array],
        dp: [...dp],
        prevIndices: [...prevIndices],
        currentIndex: i,
        comparingIndex: -1,
        lis: [],
        lisLength: 0,
        isComplete: false,
        activeIndices: [i],
        currentLIS: []
      },
      description: `Processing element array[${i}] = ${array[i]}. We'll look at all previous elements to find if we can extend an existing increasing subsequence.`,
      codeHighlight: "for i from 0 to n-1:",
      complexityInfo: `Processing element at index ${i}`
    });
    
    // Compare with all previous elements
    for (let j = 0; j < i; j++) {
      // Add step for comparison
      steps.push({
        data: {
          array: [...array],
          dp: [...dp],
          prevIndices: [...prevIndices],
          currentIndex: i,
          comparingIndex: j,
          lis: [],
          lisLength: 0,
          isComplete: false,
          activeIndices: [i, j],
          currentLIS: []
        },
        description: `Comparing array[${j}] = ${array[j]} with array[${i}] = ${array[i]}${array[j] < array[i] ? ". Since array[j] < array[i], we can potentially extend the LIS ending at j." : ". Since array[j] >= array[i], we cannot extend the LIS ending at j."}`,
        codeHighlight: "  for j from 0 to i-1:",
        complexityInfo: `Comparing elements at indices ${j} and ${i}`
      });
      
      // If current element is greater than the previous element
      if (array[j] < array[i]) {
        // We can extend the LIS ending at j
        const potentialLength = dp[j] + 1;
        
        // Add step for potential update
        steps.push({
          data: {
            array: [...array],
            dp: [...dp],
            prevIndices: [...prevIndices],
            currentIndex: i,
            comparingIndex: j,
            lis: [],
            lisLength: 0,
            isComplete: false,
            activeIndices: [i, j],
            currentLIS: [],
            potentialUpdate: true,
            potentialLength: potentialLength,
            currentLength: dp[i]
          },
          description: `The current dp[${i}] = ${dp[i]} and dp[${j}] + 1 = ${potentialLength}. ${potentialLength > dp[i] ? "Since dp[j] + 1 > dp[i], we update dp[i]." : "Since dp[j] + 1 <= dp[i], we keep dp[i] unchanged."}`,
          codeHighlight: "    if array[j] < array[i] and dp[j] + 1 > dp[i]:",
          complexityInfo: `Potential update: dp[${i}] = max(dp[${i}], dp[${j}] + 1)`
        });
        
        // If extending the LIS ending at j gives a longer LIS
        if (potentialLength > dp[i]) {
          dp[i] = potentialLength;
          prevIndices[i] = j;
          
          // Add step for actual update
          steps.push({
            data: {
              array: [...array],
              dp: [...dp],
              prevIndices: [...prevIndices],
              currentIndex: i,
              comparingIndex: j,
              lis: [],
              lisLength: 0,
              isComplete: false,
              activeIndices: [i],
              currentLIS: [],
              updated: true
            },
            description: `Updated dp[${i}] = ${dp[i]} and prevIndices[${i}] = ${j}. This means the LIS ending at index ${i} has length ${dp[i]} and the previous element in this LIS is at index ${j}.`,
            codeHighlight: "      dp[i] = dp[j] + 1\n      prev[i] = j",
            complexityInfo: `Updated dp[${i}] to ${dp[i]}`
          });
        }
      }
    }
  }
  
  // Find the index with maximum LIS length
  let maxLengthIndex = 0;
  for (let i = 1; i < n; i++) {
    if (dp[i] > dp[maxLengthIndex]) {
      maxLengthIndex = i;
    }
  }
  
  // Add step for finding the maximum LIS length
  steps.push({
    data: {
      array: [...array],
      dp: [...dp],
      prevIndices: [...prevIndices],
      currentIndex: -1,
      comparingIndex: -1,
      lis: [],
      lisLength: dp[maxLengthIndex],
      isComplete: false,
      activeIndices: [maxLengthIndex],
      currentLIS: []
    },
    description: `Found the maximum LIS length: dp[${maxLengthIndex}] = ${dp[maxLengthIndex]}. The LIS ends at index ${maxLengthIndex} with value ${array[maxLengthIndex]}.`,
    codeHighlight: "find index with maximum dp value",
    complexityInfo: `Maximum LIS length: ${dp[maxLengthIndex]}`
  });
  
  // Reconstruct the LIS
  const lis = [];
  let currentIndex = maxLengthIndex;
  
  while (currentIndex !== -1) {
    lis.unshift(array[currentIndex]);
    
    // Add step for reconstructing the LIS
    const currentLIS = [...lis];
    steps.push({
      data: {
        array: [...array],
        dp: [...dp],
        prevIndices: [...prevIndices],
        currentIndex: currentIndex,
        comparingIndex: -1,
        lis: currentLIS,
        lisLength: dp[maxLengthIndex],
        isComplete: false,
        activeIndices: [currentIndex],
        currentLIS: currentLIS,
        reconstructing: true
      },
      description: `Adding array[${currentIndex}] = ${array[currentIndex]} to the LIS. Current LIS: [${currentLIS.join(', ')}].`,
      codeHighlight: "reconstruct the LIS using prev indices",
      complexityInfo: `Building the LIS: [${currentLIS.join(', ')}]`
    });
    
    currentIndex = prevIndices[currentIndex];
  }
  
  // Add final step
  steps.push({
    data: {
      array: [...array],
      dp: [...dp],
      prevIndices: [...prevIndices],
      currentIndex: -1,
      comparingIndex: -1,
      lis: [...lis],
      lisLength: dp[maxLengthIndex],
      isComplete: true,
      activeIndices: lis.map(val => array.indexOf(val)),
      currentLIS: [...lis]
    },
    description: `LIS problem solved! The Longest Increasing Subsequence has length ${dp[maxLengthIndex]}: [${lis.join(', ')}].`,
    codeHighlight: "return the LIS",
    complexityInfo: `Final solution achieved in O(n²) time and O(n) space`
  });
  
  return steps;
};

// Component to visualize the array and dp values
const ArrayVisualization = ({ data }) => {
  const { array, dp, currentIndex, comparingIndex, activeIndices } = data;
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Array and DP Values:</h3>
      <div className="flex flex-col">
        <div className="flex mb-2">
          <div className="w-16 flex-shrink-0 font-medium text-gray-700">Index:</div>
          <div className="flex flex-1 overflow-x-auto">
            {array.map((_, index) => (
              <div 
                key={`idx-${index}`}
                className="w-12 h-12 flex items-center justify-center border border-gray-300 mx-1"
              >
                {index}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex mb-4">
          <div className="w-16 flex-shrink-0 font-medium text-gray-700">Array:</div>
          <div className="flex flex-1 overflow-x-auto">
            {array.map((value, index) => (
              <motion.div
                key={`arr-${index}`}
                className={`w-12 h-12 flex items-center justify-center border border-gray-300 mx-1 text-lg font-mono
                  ${index === currentIndex ? 'bg-blue-200 font-bold' : 
                    index === comparingIndex ? 'bg-yellow-200' : 
                    activeIndices.includes(index) ? 'bg-green-100' : 'bg-gray-50'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {value}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="flex">
          <div className="w-16 flex-shrink-0 font-medium text-gray-700">DP:</div>
          <div className="flex flex-1 overflow-x-auto">
            {dp.map((value, index) => (
              <motion.div
                key={`dp-${index}`}
                className={`w-12 h-12 flex items-center justify-center border border-gray-300 mx-1
                  ${index === currentIndex ? 'bg-blue-200 font-bold' : 
                    index === comparingIndex ? 'bg-yellow-200' : 
                    activeIndices.includes(index) ? 'bg-green-100' : 'bg-gray-50'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                {value}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to visualize the LIS
const LISVisualizationComponent = ({ data, step, stepInfo }) => {
  const { array, currentLIS, isComplete, lis } = data;
  
  return (
    <div className="w-full">
      <ArrayVisualization data={data} />
      
      {currentLIS.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current LIS:</h3>
          <div className="flex">
            {currentLIS.map((value, index) => (
              <motion.div
                key={`lis-${index}`}
                className="w-12 h-12 flex items-center justify-center text-lg font-mono bg-green-100 border border-green-300 mx-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {value}
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {isComplete && (
        <motion.div 
          className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Final Longest Increasing Subsequence:</h3>
          <div className="flex">
            {lis.map((value, index) => (
              <motion.div
                key={`final-${index}`}
                className="w-12 h-12 flex items-center justify-center text-lg font-mono bg-blue-100 border border-blue-300 mx-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                {value}
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-gray-700">
            Length: <span className="font-bold">{lis.length}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Container component with animation controls
const LISVisualization = () => {
  // Generate initial data for the LIS problem
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Longest Increasing Subsequence (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateLISSteps}
      VisualizationComponent={LISVisualizationComponent}
      description="The Longest Increasing Subsequence (LIS) problem is to find a subsequence of a given sequence in which the subsequence elements are in strictly increasing order, and in which the subsequence is as long as possible. This is a classic example of dynamic programming with a time complexity of O(n²)."
    />
  );
};

export default LISVisualization;