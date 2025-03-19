import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 20) => {
  // Using a smaller max value for counting sort to be more efficient
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Counting sort algorithm visualization steps generator
const generateCountingSortSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.array || !Array.isArray(initialData.array)) {
    return [{
      data: {
        array: [],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: []
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null,
      arrayState: "[]"
    }];
  }
  
  // Extract the array from the initialData object
  const array = [...initialData.array];
  
  // Add initial state
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    },
    description: "Starting with the unsorted array. Counting sort works by counting occurrences of each element and determining their positions in the sorted output.",
    codeHighlight: "procedure countingSort(A: list of integers, k: maximum value)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // Find the maximum value in the array
  const max = Math.max(...array);
  
  // Create count array
  const count = new Array(max + 1).fill(0);
  
  // Step 1: Count occurrences of each element
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    },
    description: `Initializing count array of size ${max + 1} (0 to ${max}) with zeros.`,
    codeHighlight: "count[0...k] := new array of size k+1 initialized to 0",
    arrayState: `[${array.join(', ')}]`,
    countArray: `[${count.join(', ')}]`
  });
  
  // Count occurrences
  for (let i = 0; i < array.length; i++) {
    count[array[i]]++;
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [i],
        comparingIndices: [],
        sortedIndices: []
      },
      description: `Incrementing count for element ${array[i]} (count[${array[i]}] = ${count[array[i]]})`,
      codeHighlight: "for i := 0 to n-1 do\n    count[A[i]] := count[A[i]] + 1",
      arrayState: `[${array.join(', ')}]`,
      countArray: `[${count.join(', ')}]`
    });
  }
  
  // Step 2: Update count array to store position
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    },
    description: "Converting count array to cumulative count to determine position of each element.",
    codeHighlight: "for i := 1 to k do\n    count[i] := count[i] + count[i-1]",
    arrayState: `[${array.join(', ')}]`,
    countArray: `[${count.join(', ')}]`
  });
  
  // Calculate cumulative count
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: []
      },
      description: `Updating cumulative count: count[${i}] = count[${i}] + count[${i-1}] = ${count[i]}`,
      codeHighlight: "for i := 1 to k do\n    count[i] := count[i] + count[i-1]",
      arrayState: `[${array.join(', ')}]`,
      countArray: `[${count.join(', ')}]`
    });
  }
  
  // Step 3: Place elements in output array
  const output = new Array(array.length).fill(0);
  const sortedIndices = [];
  
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: [...sortedIndices]
    },
    description: "Placing elements in output array based on their counts.",
    codeHighlight: "for i := n-1 downto 0 do\n    output[count[A[i]]-1] := A[i]\n    count[A[i]] := count[A[i]] - 1",
    arrayState: `[${array.join(', ')}]`,
    outputArray: `[${output.join(', ')}]`
  });
  
  // Place elements in sorted positions
  for (let i = array.length - 1; i >= 0; i--) {
    const element = array[i];
    output[count[element] - 1] = element;
    count[element]--;
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [i],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Placing element ${element} at position ${count[element]} in output array.`,
      codeHighlight: "output[count[A[i]]-1] := A[i]\ncount[A[i]] := count[A[i]] - 1",
      arrayState: `[${array.join(', ')}]`,
      outputArray: `[${output.join(', ')}]`
    });
  }
  
  // Step 4: Copy output array back to original array
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: [...sortedIndices]
    },
    description: "Copying output array back to the original array.",
    codeHighlight: "for i := 0 to n-1 do\n    A[i] := output[i]",
    arrayState: `[${array.join(', ')}]`,
    outputArray: `[${output.join(', ')}]`
  });
  
  // Copy output to original array
  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    sortedIndices.push(i);
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [i],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Copying element from output[${i}] = ${output[i]} to array[${i}]`,
      codeHighlight: "A[i] := output[i]",
      arrayState: `[${array.join(', ')}]`,
      outputArray: `[${output.join(', ')}]`
    });
  }
  
  // Final state
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: sortedIndices
    },
    description: "Counting sort complete. The array is now fully sorted.",
    codeHighlight: "end procedure",
    arrayState: `[${array.join(', ')}]`
  });
  
  return steps;
};

// Create a custom visualization component that extends SortingVisualization
const CountingSortVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    array = [], 
    activeIndices = [], 
    comparingIndices = [], 
    sortedIndices = [] 
  } = data || {};
  
  // Find the maximum value in the array for scaling
  const maxValue = Math.max(...array);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end justify-center space-x-1 sm:space-x-2">
        {array.map((value, index) => (
          <div key={`${index}-${value}-${step}`} className="flex flex-col items-center">
            <div 
              className={`w-8 rounded-t-md transition-all duration-300 ${
                activeIndices.includes(index) 
                  ? 'bg-green-500' 
                  : comparingIndices.includes(index)
                    ? 'bg-yellow-500'
                    : sortedIndices.includes(index)
                      ? 'bg-purple-500'
                      : 'bg-blue-500'
              }`}
              style={{ 
                height: `${(value / maxValue) * 100}%`, 
                minHeight: '5px'
              }}
            ></div>
            <div className="mt-1 text-xs text-gray-600">
              {value}
            </div>
          </div>
        ))}
      </div>
      
      {/* Display count array if available */}
      {stepInfo.countArray && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm font-semibold text-gray-700 mb-1">Count Array:</p>
          <div className="flex flex-wrap gap-2">
            {stepInfo.countArray.split('[')[1].split(']')[0].split(',').map((count, index) => (
              <div key={`count-${index}`} className="flex flex-col items-center">
                <div className="text-xs text-gray-500">{index}</div>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {count.trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Display output array if available */}
      {stepInfo.outputArray && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm font-semibold text-gray-700 mb-1">Output Array:</p>
          <div className="flex flex-wrap gap-2">
            {stepInfo.outputArray.split('[')[1].split(']')[0].split(',').map((value, index) => (
              <div key={`output-${index}`} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                {value.trim() || '0'}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {stepInfo.arrayState && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs sm:text-sm">
          <p className="font-mono text-gray-700">
            {stepInfo.arrayState}
          </p>
        </div>
      )}
    </div>
  );
};

const CountingSortVisualization = () => {
  // Generate random array for initial display
  const initialData = useMemo(() => {
    const randomArray = generateRandomArray(12, 20);
    return {
      array: randomArray,
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    };
  }, []); // Add key as a dependency to regenerate when needed
  
  return (
    <VisualizationContainer
      algorithmName="Counting Sort"
      initialData={initialData}
      generateSteps={generateCountingSortSteps}
      VisualizationComponent={CountingSortVisualizationComponent}
      description="Counting Sort is a non-comparison based sorting algorithm that counts occurrences of each element and uses that information to place elements in their correct sorted positions. It works efficiently when the range of input values is not significantly larger than the number of elements."
    />
  );
};

export default CountingSortVisualization; 