import React, { useMemo, useState } from 'react';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate a sorted array
const generateSortedArray = (length = 20) => {
  let arr = [];
  let current = Math.floor(Math.random() * 10) + 1;
  
  for (let i = 0; i < length; i++) {
    arr.push(current);
    current += Math.floor(Math.random() * 5) + 1;
  }
  
  return arr;
};

// Generate Fibonacci numbers up to a given limit
const generateFibonacciNumbers = (limit) => {
  const fib = [0, 1];
  let i = 2;
  
  while (fib[i - 1] + fib[i - 2] <= limit) {
    fib[i] = fib[i - 1] + fib[i - 2];
    i++;
  }
  
  return fib;
};

// Generate steps for Fibonacci search visualization
const generateFibonacciSearchSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.array || !Array.isArray(initialData.array) || !initialData.target) {
    return [{
      data: {
        array: [],
        fibNumbers: [],
        offset: 0,
        fibMm2: 0,
        fibMm1: 0,
        fibM: 0,
        index: 0,
        target: 0,
        found: false,
        searchComplete: true
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Extract data from initialData
  const array = [...initialData.array];
  const target = initialData.target;
  const n = array.length;
  
  // Add initial state
  steps.push({
    data: {
      array: [...array],
      fibNumbers: [],
      offset: 0,
      fibMm2: 0,
      fibMm1: 0,
      fibM: 0,
      index: null,
      target,
      found: false,
      searchComplete: false
    },
    description: `Starting Fibonacci search for target value ${target} in the sorted array.`,
    codeHighlight: "procedure fibonacciSearch(A, target, n)"
  });
  
  // Find the smallest Fibonacci number greater than or equal to n
  const fibNumbers = generateFibonacciNumbers(n);
  let m = fibNumbers.length - 1;
  
  steps.push({
    data: {
      array: [...array],
      fibNumbers,
      offset: 0,
      fibMm2: fibNumbers[m - 2],
      fibMm1: fibNumbers[m - 1],
      fibM: fibNumbers[m],
      index: null,
      target,
      found: false,
      searchComplete: false
    },
    description: `Generated Fibonacci numbers: [${fibNumbers.join(', ')}]. The smallest Fibonacci number greater than or equal to array length ${n} is ${fibNumbers[m]}.`,
    codeHighlight: "Find smallest Fibonacci number greater than or equal to n"
  });
  
  // Initialize Fibonacci variables
  let fibM = fibNumbers[m];
  let fibMm1 = fibNumbers[m - 1];
  let fibMm2 = fibNumbers[m - 2];
  
  // Initialize offset
  let offset = -1;
  
  steps.push({
    data: {
      array: [...array],
      fibNumbers,
      offset,
      fibMm2,
      fibMm1,
      fibM,
      index: null,
      target,
      found: false,
      searchComplete: false
    },
    description: `Initialized Fibonacci search with fibM = ${fibM}, fibM-1 = ${fibMm1}, and fibM-2 = ${fibMm2}.`,
    codeHighlight: "fibM = fib[m], fibM-1 = fib[m-1], fibM-2 = fib[m-2], offset = -1"
  });
  
  // Fibonacci search loop
  while (fibM > 1) {
    const index = Math.min(offset + fibMm2, n - 1);
    
    steps.push({
      data: {
        array: [...array],
        fibNumbers,
        offset,
        fibMm2,
        fibMm1,
        fibM,
        index,
        target,
        found: false,
        searchComplete: false
      },
      description: `Comparing element at index ${index} (value ${array[index]}) with target ${target}.`,
      codeHighlight: "index = min(offset + fibM-2, n-1)"
    });
    
    // If target is found
    if (array[index] === target) {
      steps.push({
        data: {
          array: [...array],
          fibNumbers,
          offset,
          fibMm2,
          fibMm1,
          fibM,
          index,
          target,
          found: true,
          searchComplete: true
        },
        description: `Found target ${target} at index ${index}!`,
        codeHighlight: "if A[index] = target then\n    return index"
      });
      
      return steps;
    }
    
    // If target is greater than the value at calculated index, cut the array from offset to index
    if (array[index] < target) {
      fibM = fibMm1;
      fibMm1 = fibMm2;
      fibMm2 = fibM - fibMm1;
      offset = index;
      
      steps.push({
        data: {
          array: [...array],
          fibNumbers,
          offset,
          fibMm2,
          fibMm1,
          fibM,
          index,
          target,
          found: false,
          searchComplete: false
        },
        description: `${array[index]} at index ${index} is less than target ${target}. Moving to right half. New offset = ${offset}.`,
        codeHighlight: "else if A[index] < target then\n    fibM = fibM-1\n    fibM-1 = fibM-2\n    fibM-2 = fibM - fibM-1\n    offset = index"
      });
    } 
    // If target is smaller than the value at calculated index, cut the array after index
    else {
      fibM = fibMm2;
      fibMm1 = fibMm1 - fibMm2;
      fibMm2 = fibM - fibMm1;
      
      steps.push({
        data: {
          array: [...array],
          fibNumbers,
          offset,
          fibMm2,
          fibMm1,
          fibM,
          index,
          target,
          found: false,
          searchComplete: false
        },
        description: `${array[index]} at index ${index} is greater than target ${target}. Moving to left half.`,
        codeHighlight: "else\n    fibM = fibM-2\n    fibM-1 = fibM-1 - fibM-2\n    fibM-2 = fibM - fibM-1"
      });
    }
  }
  
  // Check for the last element
  if (fibMm1 && offset < n - 1) {
    const index = offset + 1;
    
    steps.push({
      data: {
        array: [...array],
        fibNumbers,
        offset,
        fibMm2,
        fibMm1,
        fibM,
        index,
        target,
        found: false,
        searchComplete: false
      },
      description: `Checking one more element at index ${index} (value ${array[index]}).`,
      codeHighlight: "if fibM-1 and offset < n-1 then\n    check A[offset+1]"
    });
    
    if (array[index] === target) {
      steps.push({
        data: {
          array: [...array],
          fibNumbers,
          offset,
          fibMm2,
          fibMm1,
          fibM,
          index,
          target,
          found: true,
          searchComplete: true
        },
        description: `Found target ${target} at index ${index}!`,
        codeHighlight: "if A[offset+1] = target then\n    return offset+1"
      });
      
      return steps;
    }
  }
  
  // If target is not found
  steps.push({
    data: {
      array: [...array],
      fibNumbers,
      offset,
      fibMm2,
      fibMm1,
      fibM,
      index: null,
      target,
      found: false,
      searchComplete: true
    },
    description: `Target ${target} is not found in the array. Search complete.`,
    codeHighlight: "return -1"
  });
  
  return steps;
};

// Create the visualization component for Fibonacci search
const FibonacciSearchVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    array = [], 
    fibNumbers = [],
    offset, 
    fibMm2, 
    fibMm1, 
    fibM, 
    index, 
    target, 
    found, 
    searchComplete 
  } = data || {};
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Array visualization */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-end mb-6">
          {array.map((value, idx) => (
            <div 
              key={`${idx}-${value}-${step}`} 
              className="flex flex-col items-center mx-1"
            >
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                  idx === index 
                    ? found 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-yellow-100 border-yellow-500'
                    : offset !== -1 && idx > offset && (!index || idx < index)
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-300'
                }`}
              >
                <span className={`text-sm font-medium ${
                  idx === index 
                    ? found 
                      ? 'text-green-700' 
                      : 'text-yellow-700'
                    : 'text-gray-700'
                }`}>
                  {value}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500">{idx}</div>
            </div>
          ))}
        </div>
        
        {/* Search indicators and Fibonacci info */}
        <div className="flex flex-col md:flex-row w-full mb-8">
          {/* Left side - Search indicators */}
          <div className="flex flex-col items-start md:w-1/2 mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <div className="w-24 text-right pr-2">
                <span className="text-sm font-medium text-blue-700">Target:</span>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                {target}
              </div>
            </div>
            
            {offset !== -1 && (
              <div className="flex items-center mb-2">
                <div className="w-24 text-right pr-2">
                  <span className="text-sm font-medium text-blue-700">Offset:</span>
                </div>
                <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm font-mono">
                  {offset}
                </div>
              </div>
            )}
            
            {index !== null && (
              <div className="flex items-center mb-2">
                <div className="w-24 text-right pr-2">
                  <span className="text-sm font-medium text-yellow-700">Compare Index:</span>
                </div>
                <div className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-md text-sm font-mono">
                  {index}
                </div>
              </div>
            )}
          </div>
          
          {/* Right side - Fibonacci variables */}
          <div className="flex flex-col items-start md:w-1/2">
            <div className="flex items-center mb-2">
              <div className="w-24 text-right pr-2">
                <span className="text-sm font-medium text-purple-700">FibM:</span>
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-800 rounded-md text-sm font-mono">
                {fibM}
              </div>
            </div>
            
            <div className="flex items-center mb-2">
              <div className="w-24 text-right pr-2">
                <span className="text-sm font-medium text-purple-700">FibM-1:</span>
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-800 rounded-md text-sm font-mono">
                {fibMm1}
              </div>
            </div>
            
            <div className="flex items-center mb-2">
              <div className="w-24 text-right pr-2">
                <span className="text-sm font-medium text-purple-700">FibM-2:</span>
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-800 rounded-md text-sm font-mono">
                {fibMm2}
              </div>
            </div>
          </div>
        </div>
          
        {/* Fibonacci Numbers - now in its own row with more space */}
        {fibNumbers.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg w-full mb-12">
            <div className="text-sm font-medium text-gray-700 mb-1">Fibonacci Numbers:</div>
            <div className="text-xs font-mono text-gray-600 break-all">
              [{fibNumbers.join(', ')}]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FibonacciSearchVisualization = () => {
  // State for the target value
  const [target, setTarget] = useState(null);
  
  // Generate sorted array and a random target
  const initialData = useMemo(() => {
    const sortedArray = generateSortedArray(15);
    
    // Choose a random target from the array (70% of the time) or a value not in the array (30% of the time)
    let randomTarget;
    if (Math.random() < 0.7) {
      // Choose an existing value
      randomTarget = sortedArray[Math.floor(Math.random() * sortedArray.length)];
    } else {
      // Choose a value that might not exist
      const min = sortedArray[0];
      const max = sortedArray[sortedArray.length - 1];
      randomTarget = Math.floor(Math.random() * (max - min + 10)) + min;
    }
    
    setTarget(randomTarget);
    
    return {
      array: sortedArray,
      target: randomTarget
    };
  }, []); // Add key as a dependency to regenerate when needed
  
  return (
    <VisualizationContainer
      algorithmName="Fibonacci Search"
      initialData={initialData}
      generateSteps={generateFibonacciSearchSteps}
      VisualizationComponent={FibonacciSearchVisualizationComponent}
      description="Fibonacci Search is a divide-and-conquer algorithm that uses Fibonacci numbers to divide the array. The Fibonacci search has an optimal search time similar to binary search but is optimized for disk access by using a split that is much closer to the start of the array."
    />
  );
};

export default FibonacciSearchVisualization; 