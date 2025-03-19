import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Bubble sort algorithm visualization steps generator
const generateBubbleSortSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.array || !Array.isArray(initialData.array)) {
    // Return a minimal set of steps with a message about invalid data
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
    description: "Starting with the unsorted array. Bubble sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order.",
    codeHighlight: "procedure bubbleSort(A: list of sortable items)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // Track sorted elements (from the end)
  const sortedIndices = [];
  let swapped;
  
  // For each pass
  for (let i = 0; i < array.length; i++) {
    swapped = false;
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Starting pass ${i+1}. Each pass places the next largest element in its correct position.`,
      codeHighlight: "repeat",
      complexityInfo: `Current operation: O(n) for this pass`
    });
    
    // For each comparison in this pass
    for (let j = 0; j < array.length - i - 1; j++) {
      // Mark current elements being compared
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [j, j+1],
          sortedIndices: [...sortedIndices]
        },
        description: `Comparing elements at positions ${j} and ${j+1}: ${array[j]} and ${array[j+1]}`,
        codeHighlight: "if A[i-1] > A[i] then",
        arrayState: `[${array.join(', ')}]`
      });
      
      // If elements need to be swapped
      if (array[j] > array[j+1]) {
        // Swap elements
        [array[j], array[j+1]] = [array[j+1], array[j]];
        swapped = true;
        
        steps.push({
          data: {
            array: [...array],
            activeIndices: [j, j+1],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `${array[j+1]} > ${array[j]}, swapping elements at positions ${j} and ${j+1}`,
          codeHighlight: "swap(A[i-1], A[i])\nswapped := true",
          arrayState: `[${array.join(', ')}]`
        });
      } else {
        steps.push({
          data: {
            array: [...array],
            activeIndices: [],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `${array[j]} ≤ ${array[j+1]}, no swap needed`,
          codeHighlight: "end if",
          arrayState: `[${array.join(', ')}]`
        });
      }
    }
    
    // Mark the last element of this pass as sorted
    sortedIndices.push(array.length - i - 1);
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `End of pass ${i+1}. Element at position ${array.length - i - 1} (value: ${array[array.length - i - 1]}) is now in its correct position.`,
      codeHighlight: "until not swapped",
      complexityInfo: `Completed pass ${i+1} of ${array.length-1}`
    });
    
    // If no swaps made, array is sorted
    if (!swapped) {
      // Mark all elements as sorted
      const allIndices = Array.from({ length: array.length }, (_, i) => i);
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: allIndices
        },
        description: "No swaps made during this pass. The array is now sorted.",
        codeHighlight: "end procedure",
        arrayState: `[${array.join(', ')}]`
      });
      
      break;
    }
  }
  
  // Add final state if not already added
  if (steps[steps.length - 1].data.sortedIndices.length !== array.length) {
    const allIndices = Array.from({ length: array.length }, (_, i) => i);
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: allIndices
      },
      description: "Bubble sort complete. The array is now fully sorted.",
      codeHighlight: "end procedure",
      arrayState: `[${array.join(', ')}]`
    });
  }
  
  return steps;
};

const BubbleSortVisualization = () => {
  // Generate random array for initial display
  const initialData = useMemo(() => {
    const randomArray = generateRandomArray(12, 80);
    return {
      array: randomArray,
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    };
  }, []); // Add key as a dependency to regenerate when needed
  
  return (
    <VisualizationContainer
      algorithmName="Bubble Sort"
      initialData={initialData}
      generateSteps={generateBubbleSortSteps}
      VisualizationComponent={SortingVisualization}
      description="Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
    />
  );
};

export default BubbleSortVisualization; 