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

// Generate steps for ternary search visualization
const generateTernarySearchSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.array || !Array.isArray(initialData.array) || !initialData.target) {
    return [{
      data: {
        array: [],
        left: 0,
        right: 0,
        mid1: 0,
        mid2: 0,
        target: 0,
        found: false,
        foundAt: null,
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
      mid1: null,
      mid2: null,
      target,
      found: false,
      foundAt: null,
      searchComplete: false
    },
    description: `Starting ternary search for target value ${target} in the sorted array.`,
    codeHighlight: "procedure ternarySearch(A, target, left, right)"
  });
  
  // Perform ternary search and record steps
  const ternarySearchRecursive = (l, r, depth = 0) => {
    if (depth > 10) {  // Safety check to prevent infinite recursion in visualization
      return null;
    }
    
    if (l > r) {
      return null;  // Element not found
    }
    
    // Calculate the two midpoints
    const mid1 = Math.floor(l + (r - l) / 3);
    const mid2 = Math.floor(r - (r - l) / 3);
    
    steps.push({
      data: {
        array: [...array],
        left: l,
        right: r,
        mid1,
        mid2,
        target,
        found: false,
        foundAt: null,
        searchComplete: false
      },
      description: `Calculating midpoints: mid1 = ${l} + (${r} - ${l}) / 3 = ${mid1}, mid2 = ${r} - (${r} - ${l}) / 3 = ${mid2}. Comparing elements at indices ${mid1} and ${mid2} with target ${target}.`,
      codeHighlight: "mid1 := left + (right - left) / 3\nmid2 := right - (right - left) / 3"
    });
    
    // Compare with mid1
    if (array[mid1] === target) {
      steps.push({
        data: {
          array: [...array],
          left: l,
          right: r,
          mid1,
          mid2,
          target,
          found: true,
          foundAt: mid1,
          searchComplete: true
        },
        description: `Found target ${target} at position ${mid1}!`,
        codeHighlight: "if A[mid1] = target then\n    return mid1"
      });
      
      return mid1;
    }
    
    // Compare with mid2
    if (array[mid2] === target) {
      steps.push({
        data: {
          array: [...array],
          left: l,
          right: r,
          mid1,
          mid2,
          target,
          found: true,
          foundAt: mid2,
          searchComplete: true
        },
        description: `Found target ${target} at position ${mid2}!`,
        codeHighlight: "if A[mid2] = target then\n    return mid2"
      });
      
      return mid2;
    }
    
    // If target is less than mid1, search in the left part
    if (target < array[mid1]) {
      steps.push({
        data: {
          array: [...array],
          left: l,
          right: r,
          mid1,
          mid2,
          target,
          found: false,
          foundAt: null,
          searchComplete: false
        },
        description: `${target} is less than ${array[mid1]} at position ${mid1}. Search in the left part (${l} to ${mid1-1}).`,
        codeHighlight: "if target < A[mid1] then\n    return ternarySearch(A, target, left, mid1 - 1)"
      });
      
      return ternarySearchRecursive(l, mid1 - 1, depth + 1);
    } 
    // If target is greater than mid2, search in the right part
    else if (target > array[mid2]) {
      steps.push({
        data: {
          array: [...array],
          left: l,
          right: r,
          mid1,
          mid2,
          target,
          found: false,
          foundAt: null,
          searchComplete: false
        },
        description: `${target} is greater than ${array[mid2]} at position ${mid2}. Search in the right part (${mid2+1} to ${r}).`,
        codeHighlight: "else if target > A[mid2] then\n    return ternarySearch(A, target, mid2 + 1, right)"
      });
      
      return ternarySearchRecursive(mid2 + 1, r, depth + 1);
    } 
    // If target is between mid1 and mid2, search in the middle part
    else {
      steps.push({
        data: {
          array: [...array],
          left: l,
          right: r,
          mid1,
          mid2,
          target,
          found: false,
          foundAt: null,
          searchComplete: false
        },
        description: `${target} is between ${array[mid1]} at position ${mid1} and ${array[mid2]} at position ${mid2}. Search in the middle part (${mid1+1} to ${mid2-1}).`,
        codeHighlight: "else\n    return ternarySearch(A, target, mid1 + 1, mid2 - 1)"
      });
      
      return ternarySearchRecursive(mid1 + 1, mid2 - 1, depth + 1);
    }
  };
  
  // Start the ternary search
  const result = ternarySearchRecursive(left, right);
  
  // If target is not found
  if (result === null) {
    steps.push({
      data: {
        array: [...array],
        left,
        right,
        mid1: null,
        mid2: null,
        target,
        found: false,
        foundAt: null,
        searchComplete: true
      },
      description: `Target ${target} is not found in the array. Search complete.`,
      codeHighlight: "return -1"
    });
  }
  
  return steps;
};

// Create the visualization component for ternary search
const TernarySearchVisualizationComponent = ({ data, step, stepInfo }) => {
  const { array = [], left, right, mid1, mid2, target, found, foundAt, searchComplete } = data || {};
  
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
                  index === foundAt
                    ? 'bg-green-100 border-green-500'
                    : index === mid1
                      ? 'bg-yellow-100 border-yellow-500'
                      : index === mid2
                        ? 'bg-orange-100 border-orange-500'
                        : index >= left && index <= right && !searchComplete
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-300'
                }`}
              >
                <span className={`text-sm font-medium ${
                  index === foundAt
                    ? 'text-green-700'
                    : index === mid1
                      ? 'text-yellow-700'
                      : index === mid2
                        ? 'text-orange-700'
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
          
          {mid1 !== null && (
            <div className="flex items-center mb-2">
              <div className="w-20 text-right pr-2">
                <span className="text-sm font-medium text-yellow-700">Mid1:</span>
              </div>
              <div className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-md text-sm font-mono">
                {mid1}
              </div>
            </div>
          )}
          
          {mid2 !== null && (
            <div className="flex items-center mb-2">
              <div className="w-20 text-right pr-2">
                <span className="text-sm font-medium text-orange-700">Mid2:</span>
              </div>
              <div className="px-3 py-1 bg-orange-50 text-orange-800 rounded-md text-sm font-mono">
                {mid2}
              </div>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg w-full">
            <div className="text-sm font-medium text-gray-700 mb-1">Search Status:</div>
            <div className="text-sm text-gray-600">
              {found ? `Target found at position ${foundAt}!` : searchComplete ? 'Target not found' : 'Searching...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TernarySearchVisualization = () => {
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
    
    return {
      array: sortedArray,
      target: randomTarget
    };
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Ternary Search"
      initialData={initialData}
      generateSteps={generateTernarySearchSteps}
      VisualizationComponent={TernarySearchVisualizationComponent}
      description="Ternary Search is a divide-and-conquer algorithm that divides the search space into three parts using two midpoints, and determines which part the target element is likely to be in."
    />
  );
};

export default TernarySearchVisualization; 