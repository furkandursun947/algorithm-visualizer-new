import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Helper function to get parent index
const getParentIndex = (index) => Math.floor((index - 1) / 2);

// Helper function to get left child index
const getLeftChildIndex = (index) => 2 * index + 1;

// Helper function to get right child index
const getRightChildIndex = (index) => 2 * index + 2;

// Heap sort algorithm visualization steps generator
const generateHeapSortSteps = (initialData) => {
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
    description: "Starting with the unsorted array. Heap sort works by building a max heap and repeatedly extracting the maximum element.",
    codeHighlight: "procedure heapSort(A: list of sortable items)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // Track sorted indices
  const sortedIndices = [];
  
  // Function to heapify a subtree
  const heapify = (n, i) => {
    let largest = i;
    const left = getLeftChildIndex(i);
    const right = getRightChildIndex(i);
    
    // Compare with left child
    if (left < n) {
      steps.push({
        data: {
          array: [...array],
          activeIndices: [i],
          comparingIndices: [left],
          sortedIndices: [...sortedIndices]
        },
        description: `Comparing parent ${array[i]} with left child ${array[left]}`,
        codeHighlight: "if left < n and A[left] > A[largest] then",
        arrayState: `[${array.join(', ')}]`
      });
      
      if (array[left] > array[largest]) {
        largest = left;
        steps.push({
          data: {
            array: [...array],
            activeIndices: [largest],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `Left child ${array[left]} is larger than parent ${array[i]}`,
          codeHighlight: "largest := left",
          arrayState: `[${array.join(', ')}]`
        });
      }
    }
    
    // Compare with right child
    if (right < n) {
      steps.push({
        data: {
          array: [...array],
          activeIndices: [largest],
          comparingIndices: [right],
          sortedIndices: [...sortedIndices]
        },
        description: `Comparing current largest ${array[largest]} with right child ${array[right]}`,
        codeHighlight: "if right < n and A[right] > A[largest] then",
        arrayState: `[${array.join(', ')}]`
      });
      
      if (array[right] > array[largest]) {
        largest = right;
        steps.push({
          data: {
            array: [...array],
            activeIndices: [largest],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `Right child ${array[right]} is larger than current largest ${array[largest]}`,
          codeHighlight: "largest := right",
          arrayState: `[${array.join(', ')}]`
        });
      }
    }
    
    // If largest is not root
    if (largest !== i) {
      steps.push({
        data: {
          array: [...array],
          activeIndices: [i, largest],
          comparingIndices: [],
          sortedIndices: [...sortedIndices]
        },
        description: `Swapping root ${array[i]} with largest child ${array[largest]}`,
        codeHighlight: "if largest ≠ i then\n    swap(A[i], A[largest])",
        arrayState: `[${array.join(', ')}]`
      });
      
      // Swap elements
      [array[i], array[largest]] = [array[largest], array[i]];
      
      // Recursively heapify affected subtree
      heapify(n, largest);
    }
  };
  
  // Build max heap
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: [...sortedIndices]
    },
    description: "Building max heap from the array",
    codeHighlight: "for i := n/2 - 1 downto 0 do\n    heapify(n, i)",
    arrayState: `[${array.join(', ')}]`
  });
  
  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    heapify(array.length, i);
  }
  
  // Extract elements from heap one by one
  for (let i = array.length - 1; i > 0; i--) {
    steps.push({
      data: {
        array: [...array],
        activeIndices: [0, i],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Moving current root ${array[0]} to end of array at index ${i}`,
      codeHighlight: "swap(A[0], A[i])",
      arrayState: `[${array.join(', ')}]`
    });
    
    // Move current root to end
    [array[0], array[i]] = [array[i], array[0]];
    
    // Add to sorted indices
    sortedIndices.push(i);
    
    // Call max heapify on reduced heap
    heapify(i, 0);
  }
  
  // Add final sorted element
  sortedIndices.push(0);
  
  // Add final state
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: sortedIndices
    },
    description: "Heap sort complete. The array is now fully sorted.",
    codeHighlight: "end procedure",
    arrayState: `[${array.join(', ')}]`
  });
  
  return steps;
};

const HeapSortVisualization = () => {
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
      algorithmName="Heap Sort"
      initialData={initialData}
      generateSteps={generateHeapSortSteps}
      VisualizationComponent={SortingVisualization}
      description="Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It first builds a max heap from the input array, then repeatedly extracts the maximum element from the heap and places it at the end of the array."
    />
  );
};

export default HeapSortVisualization; 