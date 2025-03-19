import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Shell sort algorithm visualization steps generator
const generateShellSortSteps = (initialData) => {
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
  const n = array.length;
  
  // Add initial state
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    },
    description: "Starting with the unsorted array. Shell sort is a generalization of insertion sort that allows exchanges of items that are far apart.",
    codeHighlight: "procedure shellSort(A: list of sortable items)\n    n := length(A)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // Start with a large gap, then reduce it
  let gap = Math.floor(n / 2);
  const sortedIndices = [];
  
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: [...sortedIndices]
    },
    description: `Starting with a gap of ${gap}. Elements spaced ${gap} positions apart will be sorted.`,
    codeHighlight: "gap := n/2",
    arrayState: `[${array.join(', ')}]`,
    currentGap: gap
  });
  
  // Continue until gap is 0
  while (gap > 0) {
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Current gap is ${gap}. Performing insertion sort on elements spaced ${gap} positions apart.`,
      codeHighlight: "while gap > 0 do",
      arrayState: `[${array.join(', ')}]`,
      currentGap: gap
    });
    
    // Perform insertion sort for elements at gap positions
    for (let i = gap; i < n; i++) {
      // Save the current element
      const temp = array[i];
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [i],
          comparingIndices: [],
          sortedIndices: [...sortedIndices]
        },
        description: `Considering element at position ${i}: ${array[i]}`,
        codeHighlight: "for i := gap to n-1 do\n    temp := A[i]\n    j := i",
        arrayState: `[${array.join(', ')}]`,
        currentGap: gap
      });
      
      // Shift earlier elements with gap that are greater than temp
      let j = i;
      
      // Show current element and the element gap positions behind
      if (j >= gap) {
        steps.push({
          data: {
            array: [...array],
            activeIndices: [i],
            comparingIndices: [j - gap],
            sortedIndices: [...sortedIndices]
          },
          description: `Comparing ${array[i]} with element ${gap} positions back: ${array[j - gap]}`,
          codeHighlight: "while j >= gap and A[j-gap] > temp do",
          arrayState: `[${array.join(', ')}]`,
          currentGap: gap,
          gapPairs: [[j, j - gap]]
        });
      }
      
      while (j >= gap && array[j - gap] > temp) {
        // Swap elements
        array[j] = array[j - gap];
        
        steps.push({
          data: {
            array: [...array],
            activeIndices: [j, j - gap],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `Element at position ${j - gap} (${array[j]}) is greater than ${temp}, moving it to position ${j}`,
          codeHighlight: "A[j] := A[j-gap]\nj := j - gap",
          arrayState: `[${array.join(', ')}]`,
          currentGap: gap,
          gapPairs: [[j, j - gap]]
        });
        
        j -= gap;
        
        // If we still have a pair to compare, show it
        if (j >= gap) {
          steps.push({
            data: {
              array: [...array],
              activeIndices: [],
              comparingIndices: [j, j - gap],
              sortedIndices: [...sortedIndices]
            },
            description: `Now comparing with element ${gap} positions back: ${array[j - gap]}`,
            codeHighlight: "while j >= gap and A[j-gap] > temp do",
            arrayState: `[${array.join(', ')}]`,
            currentGap: gap,
            gapPairs: [[j, j - gap]]
          });
        }
      }
      
      // Place the temp element in its correct position
      array[j] = temp;
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [j],
          comparingIndices: [],
          sortedIndices: [...sortedIndices]
        },
        description: `Placing element ${temp} at position ${j}`,
        codeHighlight: "A[j] := temp",
        arrayState: `[${array.join(', ')}]`,
        currentGap: gap
      });
    }
    
    // Reduce the gap
    gap = Math.floor(gap / 2);
    
    if (gap > 0) {
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: [...sortedIndices]
        },
        description: `Reducing gap to ${gap}`,
        codeHighlight: "gap := gap/2",
        arrayState: `[${array.join(', ')}]`,
        currentGap: gap
      });
    } else {
      // Mark all elements as sorted when gap becomes 0
      for (let i = 0; i < n; i++) {
        sortedIndices.push(i);
      }
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: [...sortedIndices]
        },
        description: "Gap is now 0. Shell sort is complete, and the array is fully sorted.",
        codeHighlight: "end while\nend procedure",
        arrayState: `[${array.join(', ')}]`,
        currentGap: 0
      });
    }
  }
  
  return steps;
};

// Create a custom visualization component for Shell Sort
const ShellSortVisualizationComponent = ({ data, step, stepInfo }) => {
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
        {array.map((value, index) => {
          // Determine if this element is part of a gap pair
          let isGapElement = false;
          if (stepInfo.gapPairs) {
            isGapElement = stepInfo.gapPairs.some(pair => pair.includes(index));
          }
          
          return (
            <div key={`${index}-${value}-${step}`} className="flex flex-col items-center">
              <div 
                className={`w-8 rounded-t-md transition-all duration-300 ${
                  activeIndices.includes(index) 
                    ? 'bg-green-500' 
                    : comparingIndices.includes(index)
                      ? 'bg-yellow-500'
                      : sortedIndices.includes(index)
                        ? 'bg-purple-500'
                        : isGapElement
                          ? 'bg-blue-400'
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
              <div className="mt-1 text-xs text-gray-500">
                {index}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Display current gap */}
      {stepInfo.currentGap !== undefined && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center">
            <span className="text-sm font-semibold text-blue-700 mr-2">Current Gap:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-mono">
              {stepInfo.currentGap}
            </span>
          </div>
          
          {stepInfo.gapPairs && stepInfo.gapPairs.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-blue-700">
                Comparing elements at positions: {stepInfo.gapPairs.map(pair => `[${pair.join(', ')}]`).join(', ')}
              </span>
            </div>
          )}
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

const ShellSortVisualization = () => {
  // Generate random array for initial display
  const initialData = useMemo(() => {
    const randomArray = generateRandomArray(12, 100);
    return {
      array: randomArray,
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    };
  }, []); // Add key as a dependency to regenerate when needed
  
  return (
    <VisualizationContainer
      algorithmName="Shell Sort"
      initialData={initialData}
      generateSteps={generateShellSortSteps}
      VisualizationComponent={ShellSortVisualizationComponent}
      description="Shell Sort is a generalization of insertion sort that allows the exchange of items that are far apart. The algorithm starts with a large gap between compared elements and gradually reduces the gap, which helps to move elements closer to their correct positions early in the sorting process."
    />
  );
};

export default ShellSortVisualization; 