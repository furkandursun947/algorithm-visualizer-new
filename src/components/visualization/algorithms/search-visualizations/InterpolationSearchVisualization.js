import React, { useMemo, useState } from 'react';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate a sorted array with somewhat uniform distribution
const generateSortedArray = (length = 20) => {
  // Start with a small number and increment by a somewhat uniform amount
  let arr = [];
  let current = Math.floor(Math.random() * 10) + 1;
  
  for (let i = 0; i < length; i++) {
    arr.push(current);
    // Add a somewhat uniform increment (with slight randomness for realism)
    current += Math.floor(Math.random() * 5) + 1;
  }
  
  return arr;
};

// Generate steps for interpolation search visualization
const generateInterpolationSearchSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.array || !Array.isArray(initialData.array) || !initialData.target) {
    return [{
      data: {
        array: [],
        low: 0,
        high: 0,
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
  let low = 0;
  let high = array.length - 1;
  
  // Add initial state
  steps.push({
    data: {
      array: [...array],
      low,
      high,
      mid: null,
      target,
      found: false,
      searchComplete: false
    },
    description: `Starting interpolation search for target value ${target} in the sorted array.`,
    codeHighlight: "procedure interpolationSearch(A, target)",
    interpolationFormula: null
  });
  
  // Perform interpolation search and record steps
  while (low <= high && target >= array[low] && target <= array[high]) {
    // Calculate the probable position using interpolation formula
    const pos = low + Math.floor(
      ((high - low) / (array[high] - array[low])) * (target - array[low])
    );
    
    // Show the interpolation formula calculation
    const formula = `pos = low + floor(((high - low) / (A[high] - A[low])) * (target - A[low]))
    = ${low} + floor(((${high} - ${low}) / (${array[high]} - ${array[low]})) * (${target} - ${array[low]}))
    = ${pos}`;
    
    steps.push({
      data: {
        array: [...array],
        low,
        high,
        mid: pos,
        target,
        found: false,
        searchComplete: false
      },
      description: `Using interpolation formula to estimate the position of ${target} between indices ${low} and ${high}.`,
      codeHighlight: "pos = low + floor(((high - low) / (A[high] - A[low])) * (target - A[low]))",
      interpolationFormula: formula
    });
    
    // Check if the element at calculated position is the target
    if (array[pos] === target) {
      steps.push({
        data: {
          array: [...array],
          low,
          high,
          mid: pos,
          target,
          found: true,
          searchComplete: true
        },
        description: `Found target ${target} at position ${pos}!`,
        codeHighlight: "if A[pos] = target then\n    return pos",
        interpolationFormula: null
      });
      
      return steps;
    }
    
    // If the element at calculated position is less than target, search in the right half
    if (array[pos] < target) {
      low = pos + 1;
      
      steps.push({
        data: {
          array: [...array],
          low,
          high,
          mid: pos,
          target,
          found: false,
          searchComplete: false
        },
        description: `${array[pos]} at position ${pos} is less than target ${target}. Search in the right half (${low} to ${high}).`,
        codeHighlight: "else if A[pos] < target then\n    low = pos + 1",
        interpolationFormula: null
      });
    } 
    // If the element at calculated position is greater than target, search in the left half
    else {
      high = pos - 1;
      
      steps.push({
        data: {
          array: [...array],
          low,
          high,
          mid: pos,
          target,
          found: false,
          searchComplete: false
        },
        description: `${array[pos]} at position ${pos} is greater than target ${target}. Search in the left half (${low} to ${high}).`,
        codeHighlight: "else\n    high = pos - 1",
        interpolationFormula: null
      });
    }
  }
  
  // If target is not found
  steps.push({
    data: {
      array: [...array],
      low,
      high,
      mid: null,
      target,
      found: false,
      searchComplete: true
    },
    description: `Target ${target} is not found in the array. Search complete.`,
    codeHighlight: "return -1",
    interpolationFormula: null
  });
  
  return steps;
};

// Create the visualization component for interpolation search
const InterpolationSearchVisualizationComponent = ({ data, step, stepInfo }) => {
  const { array = [], low, high, mid, target, found, searchComplete } = data || {};
  
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
                    : index >= low && index <= high && !searchComplete
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
        
        {/* Search range indicators */}
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
              <span className="text-sm font-medium text-blue-700">Low:</span>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm font-mono">
              {low}
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <div className="w-20 text-right pr-2">
              <span className="text-sm font-medium text-blue-700">High:</span>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm font-mono">
              {high}
            </div>
          </div>
          
          {mid !== null && (
            <div className="flex items-center mb-2">
              <div className="w-20 text-right pr-2">
                <span className="text-sm font-medium text-yellow-700">Position:</span>
              </div>
              <div className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-md text-sm font-mono">
                {mid}
              </div>
            </div>
          )}
          
          {stepInfo.interpolationFormula && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg w-full">
              <div className="text-sm font-medium text-gray-700 mb-1">Interpolation Formula:</div>
              <pre className="text-xs font-mono text-gray-600 whitespace-pre-wrap">
                {stepInfo.interpolationFormula}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InterpolationSearchVisualization = () => {
  // State for the target value
  const [target, setTarget] = useState(null);
  
  // Generate sorted array and a random target within its range
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
      algorithmName="Interpolation Search"
      initialData={initialData}
      generateSteps={generateInterpolationSearchSteps}
      VisualizationComponent={InterpolationSearchVisualizationComponent}
      description="Interpolation Search is an improved variant of Binary Search for uniformly distributed data. It uses a position formula based on the value being searched for, rather than always choosing the middle element."
    />
  );
};

export default InterpolationSearchVisualization; 