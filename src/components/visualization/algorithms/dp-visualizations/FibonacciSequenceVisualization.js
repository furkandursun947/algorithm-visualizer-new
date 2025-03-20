import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for Fibonacci sequence calculation
const generateInitialData = (n = 10) => {
  // Create an array to store Fibonacci numbers
  const fibArray = Array(n + 1).fill(null);
  
  // Set base cases
  fibArray[0] = 0;
  fibArray[1] = 1;
  
  return {
    n,
    fibArray,
    currentIndex: 2,
    isComplete: false,
    activeIndices: []
  };
};

// Generate steps for Fibonacci calculation
const generateFibonacciSteps = (initialData) => {
  const steps = [];
  const { n, fibArray } = initialData;
  
  // Clone the initial data to avoid mutating it
  const fibNumbers = [...fibArray];
  
  // Add step for initialization
  steps.push({
    data: {
      n,
      fibArray: [...fibNumbers],
      currentIndex: 0,
      isComplete: false,
      activeIndices: []
    },
    description: "Initialize the array to store Fibonacci numbers.",
    codeHighlight: "create array fib[0...n]",
    complexityInfo: "Space complexity: O(n)"
  });
  
  // Add step for setting F(0)
  steps.push({
    data: {
      n,
      fibArray: [...fibNumbers],
      currentIndex: 0,
      isComplete: false,
      activeIndices: [0]
    },
    description: "Set the base case F(0) = 0.",
    codeHighlight: "fib[0] := 0",
    complexityInfo: "Base case initialization"
  });
  
  // Add step for setting F(1)
  steps.push({
    data: {
      n,
      fibArray: [...fibNumbers],
      currentIndex: 1,
      isComplete: false,
      activeIndices: [1]
    },
    description: "Set the base case F(1) = 1.",
    codeHighlight: "fib[1] := 1",
    complexityInfo: "Base case initialization"
  });
  
  // Build the Fibonacci sequence
  for (let i = 2; i <= n; i++) {
    // Calculate F(i) = F(i-1) + F(i-2)
    fibNumbers[i] = fibNumbers[i-1] + fibNumbers[i-2];
    
    // Add step showing the calculation
    steps.push({
      data: {
        n,
        fibArray: [...fibNumbers],
        currentIndex: i,
        isComplete: false,
        activeIndices: [i-2, i-1]
      },
      description: `Computing F(${i}) by adding F(${i-1}) = ${fibNumbers[i-1]} and F(${i-2}) = ${fibNumbers[i-2]}.`,
      codeHighlight: "fib[i] := fib[i-1] + fib[i-2]",
      complexityInfo: `Current operation: F(${i}) = F(${i-1}) + F(${i-2}) = ${fibNumbers[i-1]} + ${fibNumbers[i-2]} = ${fibNumbers[i]}`
    });
    
    // Add step showing the result
    steps.push({
      data: {
        n,
        fibArray: [...fibNumbers],
        currentIndex: i,
        isComplete: false,
        activeIndices: [i]
      },
      description: `Stored F(${i}) = ${fibNumbers[i]} in the array.`,
      codeHighlight: "fib[i] := fib[i-1] + fib[i-2]",
      complexityInfo: `Fibonacci number F(${i}) = ${fibNumbers[i]}`
    });
  }
  
  // Add final step
  steps.push({
    data: {
      n,
      fibArray: [...fibNumbers],
      currentIndex: n,
      isComplete: true,
      activeIndices: [n]
    },
    description: `Fibonacci calculation complete. F(${n}) = ${fibNumbers[n]}.`,
    codeHighlight: "return fib[n]",
    complexityInfo: `Final result: F(${n}) = ${fibNumbers[n]}`
  });
  
  return steps;
};

// Component to visualize the Fibonacci array
const FibonacciArrayVisualization = ({ data, step }) => {
  const { fibArray, currentIndex, activeIndices } = data;
  
  // Find the maximum value for scaling
  const maxValue = Math.max(...fibArray.filter(val => val !== null));
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Fibonacci Sequence:</h3>
        <div className="flex flex-wrap gap-2">
          {fibArray.map((value, index) => (
            <motion.div
              key={index}
              className={`flex flex-col items-center border rounded-md p-2 min-w-[60px] 
                ${index === currentIndex ? 'bg-green-100 border-green-500' : 
                  activeIndices.includes(index) ? 'bg-yellow-100 border-yellow-500' : 
                  value !== null ? 'bg-blue-50 border-blue-300' : 
                  'bg-gray-50 border-gray-200'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="text-xs text-gray-500 mb-1">F({index})</div>
              <div className="text-lg font-semibold">
                {value !== null ? value : '?'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Visualization:</h3>
        <div className="flex items-end h-60 border-b border-gray-300">
          {fibArray.map((value, index) => (
            value !== null && (
              <motion.div
                key={index}
                className={`relative mx-1 w-8 rounded-t
                  ${index === currentIndex ? 'bg-green-500' : 
                    activeIndices.includes(index) ? 'bg-yellow-500' : 
                    'bg-blue-500'}`}
                initial={{ height: 0 }}
                animate={{ 
                  height: `${(value / maxValue) * 100}%`,
                  minHeight: 5
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="absolute bottom-0 left-0 right-0 -mb-6 text-center text-xs">
                  {index}
                </div>
                <div className="absolute -top-6 left-0 right-0 text-center text-xs font-medium">
                  {value}
                </div>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

// Main visualization component for Fibonacci Sequence
const FibonacciSequenceVisualizationComponent = ({ data, step, stepInfo }) => {
  return (
    <div className="w-full">
      <FibonacciArrayVisualization data={data} step={step} />
    </div>
  );
};

// Container component with animation controls
const FibonacciSequenceVisualization = () => {
  // Generate initial data with a Fibonacci sequence up to F(10)
  const initialData = useMemo(() => {
    return generateInitialData(10);
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Fibonacci Sequence (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateFibonacciSteps}
      VisualizationComponent={FibonacciSequenceVisualizationComponent}
      description="The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1. Dynamic programming is used to efficiently compute Fibonacci numbers by storing previously calculated values to avoid redundant calculations."
    />
  );
};

export default FibonacciSequenceVisualization; 