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

// Generate steps for jump search visualization
const generateJumpSearchSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.array || !Array.isArray(initialData.array) || !initialData.target) {
    return [{
      data: {
        array: [],
        prev: 0,
        step: 0,
        current: 0,
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
  const n = array.length;
  
  // Add initial state
  steps.push({
    data: {
      array: [...array],
      prev: 0,
      step: Math.floor(Math.sqrt(n)),
      current: 0,
      target,
      found: false,
      searchComplete: false,
      phase: 'start'
    },
    description: `Starting jump search for target value ${target} in the sorted array. Initial jump step size: ${Math.floor(Math.sqrt(n))}.`,
    codeHighlight: "procedure jumpSearch(A, target)"
  });
  
  // Jump phase
  let prev = 0;
  let step = Math.floor(Math.sqrt(n));
  let current = step;
  
  while (current < n && array[current] <= target) {
    steps.push({
      data: {
        array: [...array],
        prev,
        step,
        current,
        target,
        found: false,
        searchComplete: false,
        phase: 'jump'
      },
      description: `Jumping to index ${current}. Value at ${current} is ${array[current]}, which is ${array[current] <= target ? 'less than or equal to' : 'greater than'} target ${target}.`,
      codeHighlight: "while current < n and A[current] <= target do\n    prev := current\n    current += step"
    });
    
    prev = current;
    current += step;
  }
  
  // Adjust current to be within array bounds
  current = Math.min(current, n - 1);
  
  steps.push({
    data: {
      array: [...array],
      prev,
      step,
      current,
      target,
      found: false,
      searchComplete: false,
      phase: 'transition'
    },
    description: `Found upper bound at index ${current}. Will now perform linear search between indices ${prev} and ${current}.`,
    codeHighlight: "Perform linear search between prev and current"
  });
  
  // Linear search phase
  for (let i = prev; i <= current; i++) {
    steps.push({
      data: {
        array: [...array],
        prev,
        step,
        current,
        target,
        found: false,
        searchComplete: false,
        phase: 'linear',
        linearIndex: i
      },
      description: `Checking element at index ${i} (value ${array[i]}) with target ${target}.`,
      codeHighlight: "while i <= current do\n    if A[i] = target then\n        return i"
    });
    
    if (array[i] === target) {
      steps.push({
        data: {
          array: [...array],
          prev,
          step,
          current,
          target,
          found: true,
          searchComplete: true,
          phase: 'end',
          linearIndex: i
        },
        description: `Found target ${target} at position ${i}!`,
        codeHighlight: "return i"
      });
      
      return steps;
    }
  }
  
  // If target is not found
  steps.push({
    data: {
      array: [...array],
      prev,
      step,
      current,
      target,
      found: false,
      searchComplete: true,
      phase: 'end',
      linearIndex: current
    },
    description: `Target ${target} is not found in the array. Search complete.`,
    codeHighlight: "return -1"
  });
  
  return steps;
};

// Create the visualization component for jump search
const JumpSearchVisualizationComponent = ({ data, currentStepIndex, stepInfo }) => {
  const { 
    array = [], 
    prev, 
    step, 
    current, 
    target, 
    found, 
    phase,
    linearIndex
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
                  index === linearIndex 
                    ? found 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-yellow-100 border-yellow-500'
                    : phase === 'jump' && index === current
                      ? 'bg-purple-100 border-purple-500'
                      : phase === 'linear' && index >= prev && index <= current
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-300'
                }`}
              >
                <span className={`text-sm font-medium ${
                  index === linearIndex 
                    ? found 
                      ? 'text-green-700' 
                      : 'text-yellow-700'
                    : phase === 'jump' && index === current
                      ? 'text-purple-700'
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
          
          {phase === 'jump' && (
            <>
              <div className="flex items-center mb-2">
                <div className="w-20 text-right pr-2">
                  <span className="text-sm font-medium text-purple-700">Jump Step:</span>
                </div>
                <div className="px-3 py-1 bg-purple-50 text-purple-800 rounded-md text-sm font-mono">
                  {step}
                </div>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-20 text-right pr-2">
                  <span className="text-sm font-medium text-purple-700">Current:</span>
                </div>
                <div className="px-3 py-1 bg-purple-50 text-purple-800 rounded-md text-sm font-mono">
                  {current}
                </div>
              </div>
            </>
          )}
          
          {phase === 'linear' && (
            <>
              <div className="flex items-center mb-2">
                <div className="w-20 text-right pr-2">
                  <span className="text-sm font-medium text-blue-700">Search Range:</span>
                </div>
                <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm font-mono">
                  {prev} to {current}
                </div>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-20 text-right pr-2">
                  <span className="text-sm font-medium text-yellow-700">Current:</span>
                </div>
                <div className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-md text-sm font-mono">
                  {linearIndex}
                </div>
              </div>
            </>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg w-full">
            <div className="text-sm font-medium text-gray-700 mb-1">Current Phase:</div>
            <div className="text-sm text-gray-600">
              {phase === 'start' && 'Initialization'}
              {phase === 'jump' && 'Jump Phase - Finding search block'}
              {phase === 'transition' && 'Transition - Preparing for linear search'}
              {phase === 'linear' && 'Linear Search - Searching within block'}
              {phase === 'end' && (found ? 'Target found!' : 'Target not found')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JumpSearchVisualization = () => {
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
      algorithmName="Jump Search"
      initialData={initialData}
      generateSteps={generateJumpSearchSteps}
      VisualizationComponent={JumpSearchVisualizationComponent}
      description="Jump Search is a search algorithm for sorted arrays that works by jumping ahead by fixed steps (√n) and then performing a linear search in the block where the target might be present."
    />
  );
};

export default JumpSearchVisualization; 