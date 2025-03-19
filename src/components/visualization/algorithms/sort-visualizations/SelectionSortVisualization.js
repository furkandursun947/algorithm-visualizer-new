import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Selection sort algorithm visualization steps generator
const generateSelectionSortSteps = (initialData) => {
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
    description: "Starting with the unsorted array. Selection sort works by repeatedly finding the minimum element from the unsorted region and placing it at the beginning of the sorted region.",
    codeHighlight: "procedure selectionSort(A: list of sortable items)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // Track sorted region (left side)
  const sortedIndices = [];
  
  // For each position in the array
  for (let i = 0; i < array.length - 1; i++) {
    // Find minimum element in unsorted region
    let minIndex = i;
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [minIndex],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Starting iteration ${i + 1}. Looking for minimum element in unsorted region starting at index ${i}.`,
      codeHighlight: "minIndex := i",
      complexityInfo: `Current operation: O(n) for finding minimum`
    });
    
    // Compare with each element in unsorted region
    for (let j = i + 1; j < array.length; j++) {
      steps.push({
        data: {
          array: [...array],
          activeIndices: [minIndex],
          comparingIndices: [j],
          sortedIndices: [...sortedIndices]
        },
        description: `Comparing current minimum ${array[minIndex]} with element ${array[j]} at index ${j}`,
        codeHighlight: "if A[j] < A[minIndex] then",
        arrayState: `[${array.join(', ')}]`
      });
      
      if (array[j] < array[minIndex]) {
        minIndex = j;
        
        steps.push({
          data: {
            array: [...array],
            activeIndices: [minIndex],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `Found new minimum: ${array[minIndex]} at index ${minIndex}`,
          codeHighlight: "minIndex := j",
          arrayState: `[${array.join(', ')}]`
        });
      } else {
        steps.push({
          data: {
            array: [...array],
            activeIndices: [minIndex],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `${array[j]} is not smaller than current minimum ${array[minIndex]}`,
          codeHighlight: "end if",
          arrayState: `[${array.join(', ')}]`
        });
      }
    }
    
    // If minimum is not at current position, swap
    if (minIndex !== i) {
      // Swap elements
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [i, minIndex],
          comparingIndices: [],
          sortedIndices: [...sortedIndices]
        },
        description: `Swapping minimum element ${array[i]} with element at position ${i}`,
        codeHighlight: "swap(A[i], A[minIndex])",
        arrayState: `[${array.join(', ')}]`
      });
    }
    
    // Mark current position as sorted
    sortedIndices.push(i);
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Completed iteration ${i + 1}. Element at position ${i} is now in its correct position.`,
      codeHighlight: "end for",
      complexityInfo: `Completed iteration ${i + 1} of ${array.length - 1}`
    });
  }
  
  // Mark last element as sorted
  sortedIndices.push(array.length - 1);
  
  // Add final state
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: [...sortedIndices]
    },
    description: "Selection sort complete. The array is now fully sorted.",
    codeHighlight: "end procedure",
    arrayState: `[${array.join(', ')}]`
  });
  
  return steps;
};

const SelectionSortVisualization = () => {
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
      algorithmName="Selection Sort"
      initialData={initialData}
      generateSteps={generateSelectionSortSteps}
      VisualizationComponent={SortingVisualization}
      description="Selection Sort is an in-place comparison sorting algorithm that divides the input list into a sorted and an unsorted region, and repeatedly selects the minimum element from the unsorted region to add to the sorted region."
    />
  );
};

export default SelectionSortVisualization; 