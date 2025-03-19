import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Quick sort algorithm visualization steps generator
const generateQuickSortSteps = (initialData) => {
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
    description: "Starting with the unsorted array. Quick sort is a divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around it.",
    codeHighlight: "procedure quickSort(A: list of sortable items, low, high: indices)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // Track sorted indices
  const sortedIndices = [];
  
  // Collection of recursive calls to track
  const calls = [];
  
  // Main quick sort function to generate visualization steps
  const quickSortSimulation = (low, high, depth = 0) => {
    // Base case: If the partition has one or fewer elements
    if (low >= high) {
      if (low === high) {
        // Single element is already sorted
        sortedIndices.push(low);
        
        steps.push({
          data: {
            array: [...array],
            activeIndices: [low],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `Partition with single element at index ${low} is already sorted.`,
          codeHighlight: "if low < high then",
          arrayState: `[${array.join(', ')}]`
        });
      }
      return;
    }
    
    // Add the recursive call to the list
    calls.push({ type: 'partition', low, high, depth });
  };
  
  // Function to perform partitioning and generate steps
  const partition = (low, high, depth) => {
    // Choose the rightmost element as pivot
    const pivotIndex = high;
    const pivotValue = array[pivotIndex];
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [pivotIndex],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Selecting element at index ${pivotIndex} (value: ${pivotValue}) as the pivot.`,
      codeHighlight: "pivot := A[high]",
      arrayState: `[${array.join(', ')}]`,
      complexityInfo: `Partition depth: ${depth}`
    });
    
    // Initialize partition index
    let i = low - 1;
    
    // Highlight the current partition
    steps.push({
      data: {
        array: [...array],
        activeIndices: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
        comparingIndices: [pivotIndex],
        sortedIndices: [...sortedIndices]
      },
      description: `Partitioning elements from index ${low} to ${high} around the pivot.`,
      codeHighlight: "i := low - 1",
      arrayState: `[${array.join(', ')}]`
    });
    
    // Process each element in the partition
    for (let j = low; j < high; j++) {
      // Compare element with pivot
      steps.push({
        data: {
          array: [...array],
          activeIndices: [pivotIndex],
          comparingIndices: [j],
          sortedIndices: [...sortedIndices]
        },
        description: `Comparing element ${array[j]} at index ${j} with pivot ${pivotValue}.`,
        codeHighlight: "if A[j] ≤ pivot then",
        arrayState: `[${array.join(', ')}]`
      });
      
      // If current element is less than or equal to pivot
      if (array[j] <= pivotValue) {
        i++;
        
        // Swap elements if needed
        if (i !== j) {
          steps.push({
            data: {
              array: [...array],
              activeIndices: [i, j],
              comparingIndices: [],
              sortedIndices: [...sortedIndices]
            },
            description: `${array[j]} ≤ ${pivotValue}, swapping elements at indices ${i} and ${j}.`,
            codeHighlight: "i := i + 1\nswap(A[i], A[j])",
            arrayState: `[${array.join(', ')}]`
          });
          
          // Perform swap
          [array[i], array[j]] = [array[j], array[i]];
          
          // Show array after swap
          steps.push({
            data: {
              array: [...array],
              activeIndices: [i, j],
              comparingIndices: [],
              sortedIndices: [...sortedIndices]
            },
            description: `Array after swapping: element ${array[i]} is now at index ${i} and element ${array[j]} is now at index ${j}.`,
            codeHighlight: "swap(A[i], A[j])",
            arrayState: `[${array.join(', ')}]`
          });
        } else {
          // No swap needed
          steps.push({
            data: {
              array: [...array],
              activeIndices: [i],
              comparingIndices: [],
              sortedIndices: [...sortedIndices]
            },
            description: `${array[j]} ≤ ${pivotValue}, increment i to ${i}.`,
            codeHighlight: "i := i + 1",
            arrayState: `[${array.join(', ')}]`
          });
        }
      } else {
        // Element is greater than pivot, no action needed
        steps.push({
          data: {
            array: [...array],
            activeIndices: [],
            comparingIndices: [j],
            sortedIndices: [...sortedIndices]
          },
          description: `${array[j]} > ${pivotValue}, no action needed.`,
          codeHighlight: "end if",
          arrayState: `[${array.join(', ')}]`
        });
      }
    }
    
    // Place pivot in its correct position by swapping with element at i+1
    const newPivotIndex = i + 1;
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [newPivotIndex, pivotIndex],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Placing pivot in its correct position by swapping elements at indices ${newPivotIndex} and ${pivotIndex}.`,
      codeHighlight: "swap(A[i + 1], A[high])",
      arrayState: `[${array.join(', ')}]`
    });
    
    // Perform the swap
    [array[newPivotIndex], array[pivotIndex]] = [array[pivotIndex], array[newPivotIndex]];
    
    // Mark pivot as sorted
    sortedIndices.push(newPivotIndex);
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [newPivotIndex],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Pivot ${pivotValue} is now in its correct position at index ${newPivotIndex}.`,
      codeHighlight: "return i + 1",
      arrayState: `[${array.join(', ')}]`
    });
    
    // Add recursive calls for the left and right subarrays
    calls.push({ type: 'quick', low, high: newPivotIndex - 1, depth: depth + 1 });
    calls.push({ type: 'quick', low: newPivotIndex + 1, high, depth: depth + 1 });
    
    // Return the pivot index for the simulation
    return newPivotIndex;
  };
  
  // Start the simulation
  quickSortSimulation(0, array.length - 1);
  
  // Process all the recursive calls in order
  while (calls.length > 0) {
    const call = calls.shift();
    
    if (call.type === 'partition') {
      const pivotIndex = partition(call.low, call.high, call.depth);
      
      // Add recursive calls to process subarrays
      if (call.low < pivotIndex - 1) {
        quickSortSimulation(call.low, pivotIndex - 1, call.depth + 1);
      }
      
      if (pivotIndex + 1 < call.high) {
        quickSortSimulation(pivotIndex + 1, call.high, call.depth + 1);
      }
    } else if (call.type === 'quick') {
      quickSortSimulation(call.low, call.high, call.depth);
    }
  }
  
  // Mark all elements as sorted in the final state
  const allIndices = Array.from({ length: array.length }, (_, i) => i);
  
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: allIndices
    },
    description: "Quick sort complete. The array is now fully sorted.",
    codeHighlight: "end procedure",
    arrayState: `[${array.join(', ')}]`
  });
  
  return steps;
};

const QuickSortVisualization = () => {
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
      algorithmName="Quick Sort"
      initialData={initialData}
      generateSteps={generateQuickSortSteps}
      VisualizationComponent={SortingVisualization}
      description="Quick Sort is a divide-and-conquer algorithm that selects a 'pivot' element and partitions the array so that elements less than the pivot are before it and elements greater than the pivot are after it."
    />
  );
};

export default QuickSortVisualization; 