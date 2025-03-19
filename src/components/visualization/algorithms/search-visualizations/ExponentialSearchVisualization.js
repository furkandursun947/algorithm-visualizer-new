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

// Binary search function for the second phase of exponential search
const binarySearch = (array, target, left, right, steps) => {
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      data: {
        array: [...array],
        bounds: null,
        power: null,
        binaryLeft: left,
        binaryRight: right,
        mid,
        target,
        found: false,
        searchComplete: false,
        phase: 'binary'
      },
      description: `Performing binary search for ${target} between indices ${left} and ${right}. Mid point is at index ${mid}.`,
      codeHighlight: "binarySearch(A, target, low, high)"
    });
    
    if (array[mid] === target) {
      steps.push({
        data: {
          array: [...array],
          bounds: null,
          power: null,
          binaryLeft: left,
          binaryRight: right,
          mid,
          target,
          found: true,
          searchComplete: true,
          phase: 'binary'
        },
        description: `Found target ${target} at position ${mid}!`,
        codeHighlight: "if A[mid] = target then\n    return mid"
      });
      
      return true;
    }
    
    if (array[mid] < target) {
      left = mid + 1;
      
      steps.push({
        data: {
          array: [...array],
          bounds: null,
          power: null,
          binaryLeft: left,
          binaryRight: right,
          mid,
          target,
          found: false,
          searchComplete: false,
          phase: 'binary'
        },
        description: `${array[mid]} at position ${mid} is less than target ${target}. Search in the right half (${left} to ${right}).`,
        codeHighlight: "else if A[mid] < target then\n    left = mid + 1"
      });
    } else {
      right = mid - 1;
      
      steps.push({
        data: {
          array: [...array],
          bounds: null,
          power: null,
          binaryLeft: left,
          binaryRight: right,
          mid,
          target,
          found: false,
          searchComplete: false,
          phase: 'binary'
        },
        description: `${array[mid]} at position ${mid} is greater than target ${target}. Search in the left half (${left} to ${right}).`,
        codeHighlight: "else\n    right = mid - 1"
      });
    }
  }
  
  return false;
};

// Generate steps for exponential search visualization
const generateExponentialSearchSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.array || !Array.isArray(initialData.array) || !initialData.target) {
    return [{
      data: {
        array: [],
        bounds: null,
        power: 0,
        binaryLeft: 0,
        binaryRight: 0,
        mid: 0,
        target: 0,
        found: false,
        searchComplete: true,
        phase: 'error'
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Extract data from initialData
  const array = [...initialData.array];
  const target = initialData.target;
  
  // Add initial state
  steps.push({
    data: {
      array: [...array],
      bounds: null,
      power: null,
      binaryLeft: null,
      binaryRight: null,
      mid: null,
      target,
      found: false,
      searchComplete: false,
      phase: 'start'
    },
    description: `Starting exponential search for target value ${target} in the sorted array.`,
    codeHighlight: "procedure exponentialSearch(A, target)"
  });
  
  // Special case: If array is empty
  if (array.length === 0) {
    steps.push({
      data: {
        array: [],
        bounds: null,
        power: null,
        binaryLeft: null,
        binaryRight: null,
        mid: null,
        target,
        found: false,
        searchComplete: true,
        phase: 'end'
      },
      description: `Array is empty. Target ${target} cannot be found.`,
      codeHighlight: "if length(A) = 0 then\n    return -1"
    });
    
    return steps;
  }
  
  // Check if the first element is the target
  if (array[0] === target) {
    steps.push({
      data: {
        array: [...array],
        bounds: 0,
        power: 0,
        binaryLeft: null,
        binaryRight: null,
        mid: 0,
        target,
        found: true,
        searchComplete: true,
        phase: 'end'
      },
      description: `First element at index 0 is equal to target ${target}. Found it!`,
      codeHighlight: "if A[0] = target then\n    return 0"
    });
    
    return steps;
  }
  
  // Start exponential phase
  let i = 1;
  while (i < array.length && array[i] <= target) {
    steps.push({
      data: {
        array: [...array],
        bounds: i,
        power: i,
        binaryLeft: null,
        binaryRight: null,
        mid: null,
        target,
        found: false,
        searchComplete: false,
        phase: 'exponential'
      },
      description: `Checking bound 2^${Math.log2(i).toFixed(0)} = ${i}. Value at index ${i} is ${array[i]}, which is ${array[i] <= target ? 'less than or equal to' : 'greater than'} target ${target}.`,
      codeHighlight: "i = 1\nwhile i < length(A) and A[i] <= target do\n    i = i * 2"
    });
    
    i = i * 2;
  }
  
  // Adjust i to be within array bounds
  const bound = Math.min(i, array.length - 1);
  
  steps.push({
    data: {
      array: [...array],
      bounds: bound,
      power: i,
      binaryLeft: null,
      binaryRight: null,
      mid: null,
      target,
      found: false,
      searchComplete: false,
      phase: 'transition'
    },
    description: `Found upper bound at index ${bound}. Will now perform binary search between indices ${Math.floor(i / 2)} and ${bound}.`,
    codeHighlight: "return binarySearch(A, target, i/2, min(i, length(A)-1))"
  });
  
  // Set the bounds for binary search
  const left = Math.floor(i / 2);
  const right = bound;
  
  // Perform binary search
  const found = binarySearch(array, target, left, right, steps);
  
  // If target is not found after binary search
  if (!found) {
    steps.push({
      data: {
        array: [...array],
        bounds: null,
        power: null,
        binaryLeft: left,
        binaryRight: right,
        mid: null,
        target,
        found: false,
        searchComplete: true,
        phase: 'end'
      },
      description: `Target ${target} is not found in the array. Search complete.`,
      codeHighlight: "return -1"
    });
  }
  
  return steps;
};

// Create the visualization component for exponential search
const ExponentialSearchVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    array = [], 
    bounds, 
    power, 
    binaryLeft, 
    binaryRight, 
    mid, 
    target, 
    found, 
    searchComplete,
    phase
  } = data || {};
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Array visualization */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-end mb-8">
          {array.map((value, index) => (
            <div 
              key={`${index}-${value}-${step}`} 
              className="flex flex-col items-center mx-1"
            >
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                  index === mid 
                    ? found 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-yellow-100 border-yellow-500'
                    : phase === 'exponential' && index <= bounds
                      ? 'bg-purple-50 border-purple-300'
                      : phase === 'binary' && index >= binaryLeft && index <= binaryRight
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-300'
                }`}
              >
                <span className={`text-sm font-medium ${
                  index === mid 
                    ? found 
                      ? 'text-green-700' 
                      : 'text-yellow-700'
                    : 'text-gray-700'
                }`}>
                  {value}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500">{index}</div>
            </div>
          ))}
        </div>
        
        {/* Search indicators */}
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center mb-2">
            <div className="w-20 text-right pr-2">
              <span className="text-sm font-medium text-blue-700">Target:</span>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
              {target}
            </div>
          </div>
          
          {phase === 'exponential' && (
            <div className="flex items-center mb-2">
              <div className="w-20 text-right pr-2">
                <span className="text-sm font-medium text-purple-700">Bound:</span>
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-800 rounded-md text-sm font-mono">
                {bounds} {power !== null && power !== bounds && `(capped from ${power})`}
              </div>
            </div>
          )}
          
          {phase === 'binary' && (
            <>
              <div className="flex items-center mb-2">
                <div className="w-20 text-right pr-2">
                  <span className="text-sm font-medium text-blue-700">Left:</span>
                </div>
                <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm font-mono">
                  {binaryLeft}
                </div>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-20 text-right pr-2">
                  <span className="text-sm font-medium text-blue-700">Right:</span>
                </div>
                <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm font-mono">
                  {binaryRight}
                </div>
              </div>
              
              {mid !== null && (
                <div className="flex items-center mb-2">
                  <div className="w-20 text-right pr-2">
                    <span className="text-sm font-medium text-yellow-700">Mid:</span>
                  </div>
                  <div className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-md text-sm font-mono">
                    {mid}
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg w-full">
            <div className="text-sm font-medium text-gray-700 mb-1">Current Phase:</div>
            <div className="text-sm text-gray-600">
              {phase === 'start' && 'Initialization'}
              {phase === 'exponential' && 'Exponential Probing - Finding search bounds'}
              {phase === 'transition' && 'Transition - Preparing for binary search'}
              {phase === 'binary' && 'Binary Search - Searching within the found bounds'}
              {phase === 'end' && 'Search Complete'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExponentialSearchVisualization = () => {
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
      algorithmName="Exponential Search"
      initialData={initialData}
      generateSteps={generateExponentialSearchSteps}
      VisualizationComponent={ExponentialSearchVisualizationComponent}
      description="Exponential Search is a technique for searching in sorted arrays that works by finding a range where the target might exist (by repeatedly doubling the index) and then performing a binary search within that range."
    />
  );
};

export default ExponentialSearchVisualization; 