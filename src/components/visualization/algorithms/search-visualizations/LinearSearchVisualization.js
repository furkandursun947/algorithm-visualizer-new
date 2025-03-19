import React, { useMemo, useState } from 'react';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate a random array
const generateRandomArray = (length = 15) => {
  let arr = [];
  let current = Math.floor(Math.random() * 10) + 1;
  
  for (let i = 0; i < length; i++) {
    arr.push(current);
    current += Math.floor(Math.random() * 5) + 1;
  }
  
  return arr;
};

// Generate steps for linear search visualization
const generateLinearSearchSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.array || !Array.isArray(initialData.array) || !initialData.target) {
    return [{
      data: {
        array: [],
        currentIndex: 0,
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
  
  // Add initial state
  steps.push({
    data: {
      array: [...array],
      currentIndex: 0,
      target,
      found: false,
      searchComplete: false
    },
    description: `Starting linear search for target value ${target} in the array.`,
    codeHighlight: "procedure linearSearch(A, target)"
  });
  
  // Perform linear search and record steps
  for (let i = 0; i < array.length; i++) {
    steps.push({
      data: {
        array: [...array],
        currentIndex: i,
        target,
        found: false,
        searchComplete: false
      },
      description: `Checking element at index ${i} (value ${array[i]}) with target ${target}.`,
      codeHighlight: "if A[i] = target then\n    return i"
    });
    
    if (array[i] === target) {
      steps.push({
        data: {
          array: [...array],
          currentIndex: i,
          target,
          found: true,
          searchComplete: true
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
      currentIndex: array.length - 1,
      target,
      found: false,
      searchComplete: true
    },
    description: `Target ${target} is not found in the array. Search complete.`,
    codeHighlight: "return -1"
  });
  
  return steps;
};

// Create the visualization component for linear search
const LinearSearchVisualizationComponent = ({ data, step, stepInfo }) => {
  const { array = [], currentIndex, target, found, searchComplete } = data || {};
  
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
                  index === currentIndex 
                    ? found 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-yellow-100 border-yellow-500'
                    : index < currentIndex
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-300'
                }`}
              >
                <span className={`text-sm font-medium ${
                  index === currentIndex 
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
              <span className="text-sm font-medium text-yellow-700">Current:</span>
            </div>
            <div className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-md text-sm font-mono">
              {currentIndex}
            </div>
          </div>
          
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

const LinearSearchVisualization = () => {
  // State for the target value
  const [target, setTarget] = useState(null);
  
  // Generate random array and a random target
  const initialData = useMemo(() => {
    const randomArray = generateRandomArray(15);
    
    // Choose a random target from the array (70% of the time) or a value not in the array (30% of the time)
    let randomTarget;
    if (Math.random() < 0.7) {
      // Choose an existing value
      randomTarget = randomArray[Math.floor(Math.random() * randomArray.length)];
    } else {
      // Choose a value that might not exist
      const min = randomArray[0];
      const max = randomArray[randomArray.length - 1];
      randomTarget = Math.floor(Math.random() * (max - min + 10)) + min;
    }
    
    setTarget(randomTarget);
    
    return {
      array: randomArray,
      target: randomTarget
    };
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Linear Search"
      initialData={initialData}
      generateSteps={generateLinearSearchSteps}
      VisualizationComponent={LinearSearchVisualizationComponent}
      description="Linear Search is a simple search algorithm that sequentially checks each element in a list until it finds the target value or reaches the end of the list."
    />
  );
};

export default LinearSearchVisualization; 