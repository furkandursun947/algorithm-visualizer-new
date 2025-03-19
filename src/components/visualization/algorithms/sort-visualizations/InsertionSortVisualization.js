import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Insertion sort algorithm visualization steps generator
const generateInsertionSortSteps = (initialData) => {
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
      sortedIndices: [0] // Initially, first element is considered sorted
    },
    description: "Starting with the first element considered sorted. Insertion sort builds the final sorted array one item at a time by inserting each element into its correct position.",
    codeHighlight: "procedure insertionSort(A: list of sortable items)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // Start with index 1 (second element) since we consider first element already sorted
  for (let i = 1; i < array.length; i++) {
    // Highlight current element to be inserted
    steps.push({
      data: {
        array: [...array],
        activeIndices: [i],
        comparingIndices: [],
        sortedIndices: Array.from({ length: i }, (_, index) => index) // 0 to i-1 are sorted
      },
      description: `Starting iteration ${i}. Inserting element ${array[i]} into the sorted portion of the array.`,
      codeHighlight: "for i := 1 to length(A) - 1 inclusive do",
      complexityInfo: `Current operation: O(n) in worst case for insertion`
    });
    
    // Save the current element to insert
    const currentElement = array[i];
    let j = i;
    
    // Compare with previous elements to find insertion point
    while (j > 0 && array[j - 1] > currentElement) {
      // Compare current element with previous element
      steps.push({
        data: {
          array: [...array],
          activeIndices: [i],
          comparingIndices: [j - 1],
          sortedIndices: Array.from({ length: i }, (_, index) => index)
        },
        description: `Comparing ${currentElement} with ${array[j - 1]} at position ${j - 1}`,
        codeHighlight: "while j > 0 and A[j-1] > A[j] do",
        arrayState: `[${array.join(', ')}]`
      });
      
      // Shift element to the right
      array[j] = array[j - 1];
      
      // Show the shift
      steps.push({
        data: {
          array: [...array],
          activeIndices: [j - 1, j],
          comparingIndices: [],
          sortedIndices: Array.from({ length: i }, (_, index) => index)
        },
        description: `${array[j - 1]} > ${currentElement}, shifting ${array[j - 1]} one position to the right`,
        codeHighlight: "swap(A[j], A[j-1])",
        arrayState: `[${array.join(', ')}]`
      });
      
      j--;
    }
    
    // Insert the element at the correct position
    array[j] = currentElement;
    
    // If element moved from its original position
    if (j !== i) {
      steps.push({
        data: {
          array: [...array],
          activeIndices: [j],
          comparingIndices: [],
          sortedIndices: Array.from({ length: i + 1 }, (_, index) => index)
        },
        description: `Inserting ${currentElement} at position ${j}`,
        codeHighlight: "// Element inserted at correct position",
        arrayState: `[${array.join(', ')}]`
      });
    } else {
      // Element is already in the correct position
      steps.push({
        data: {
          array: [...array],
          activeIndices: [j],
          comparingIndices: [],
          sortedIndices: Array.from({ length: i + 1 }, (_, index) => index)
        },
        description: `${currentElement} is already at its correct position ${j}`,
        codeHighlight: "// Element already in correct position",
        arrayState: `[${array.join(', ')}]`
      });
    }
    
    // Mark sorted portion
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: Array.from({ length: i + 1 }, (_, index) => index)
      },
      description: `Completed insertion of element at index ${i}. Elements from index 0 to ${i} are now sorted.`,
      codeHighlight: "end while",
      complexityInfo: `Completed iteration ${i} of ${array.length - 1}`
    });
  }
  
  // Add final state
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: Array.from({ length: array.length }, (_, index) => index)
    },
    description: "Insertion sort complete. The array is now fully sorted.",
    codeHighlight: "end procedure",
    arrayState: `[${array.join(', ')}]`
  });
  
  return steps;
};

const InsertionSortVisualization = () => {
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
      algorithmName="Insertion Sort"
      initialData={initialData}
      generateSteps={generateInsertionSortSteps}
      VisualizationComponent={SortingVisualization}
      description="Insertion Sort builds the sorted array one item at a time by taking elements from the unsorted part and inserting them at the correct position in the sorted part, similar to how you would sort cards in your hand."
    />
  );
};

export default InsertionSortVisualization; 