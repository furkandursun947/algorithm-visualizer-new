import React, { useMemo, useState } from 'react';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate a sorted array
const generateSortedArray = (length = 15) => {
  let arr = [];
  let current = Math.floor(Math.random() * 10) + 1;
  
  for (let i = 0; i < length; i++) {
    arr.push(current);
    current += Math.floor(Math.random() * 5) + 1;
  }
  
  return arr;
};

// Generate steps for binary search visualization
const generateBinarySearchSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.array || !Array.isArray(initialData.array) || !initialData.target) {
    return [{
      data: {
        array: [],
        left: 0,
        right: 0,
        mid: 0,
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
  let left = 0;
  let right = array.length - 1;
  
  // Add initial state
  steps.push({
    data: {
      array: [...array],
      left,
      right,
      mid: null,
      target,
      found: false,
      searchComplete: false
    },
    description: `Starting binary search for target value ${target} in the sorted array.`,
    codeHighlight: "procedure binarySearch(A, target)"
  });
  
  // Perform binary search and record steps
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      data: {
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        searchComplete: false
      },
      description: `Calculating mid point: (${left} + ${right}) / 2 = ${mid}. Comparing element at index ${mid} (value ${array[mid]}) with target ${target}.`,
      codeHighlight: "mid := (left + right) / 2\nif A[mid] = target then\n    return mid"
    });
    
    if (array[mid] === target) {
      steps.push({
        data: {
          array: [...array],
          left,
          right,
          mid,
          target,
          found: true,
          searchComplete: true
        },
        description: `Found target ${target} at position ${mid}!`,
        codeHighlight: "return mid"
      });
      
      return steps;
    }
    
    if (array[mid] < target) {
      left = mid + 1;
      
      steps.push({
        data: {
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          searchComplete: false
        },
        description: `${array[mid]} at position ${mid} is less than target ${target}. Search in the right half (${left} to ${right}).`,
        codeHighlight: "else if A[mid] < target then\n    left := mid + 1"
      });
    } else {
      right = mid - 1;
      
      steps.push({
        data: {
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          searchComplete: false
        },
        description: `${array[mid]} at position ${mid} is greater than target ${target}. Search in the left half (${left} to ${right}).`,
        codeHighlight: "else\n    right := mid - 1"
      });
    }
  }
  
  // If target is not found
  steps.push({
    data: {
      array: [...array],
      left,
      right,
      mid: null,
      target,
      found: false,
      searchComplete: true
    },
    description: `Target ${target} is not found in the array. Search complete.`,
    codeHighlight: "return -1"
  });
  
  return steps;
};

// Create the visualization component for binary search
const BinarySearchVisualizationComponent = ({ data, step, stepInfo }) => {
  const { array = [], left, right, mid, target, found, searchComplete } = data || {};
  
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
                    : index >= left && index <= right && !searchComplete
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
          
          <div className="flex items-center mb-2">
            <div className="w-20 text-right pr-2">
              <span className="text-sm font-medium text-blue-700">Left:</span>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm font-mono">
              {left}
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <div className="w-20 text-right pr-2">
              <span className="text-sm font-medium text-blue-700">Right:</span>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm font-mono">
              {right}
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
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg w-full">
            <div className="text-sm font-medium text-gray-700 mb-1">Search Status:</div>
            <div className="text-sm text-gray-600">
              {found ? 'Target found!' : searchComplete ? 'Target not found' : 'Searching...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BinarySearchVisualization = () => {
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
      algorithmName="Binary Search"
      initialData={initialData}
      generateSteps={generateBinarySearchSteps}
      VisualizationComponent={BinarySearchVisualizationComponent}
      description="Binary Search is an efficient algorithm for finding an element in a sorted array. It repeatedly divides the search interval in half, eliminating half of the remaining elements at each step."
    />
  );
};

export default BinarySearchVisualization; 