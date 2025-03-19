import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Merge sort algorithm visualization steps generator
const generateMergeSortSteps = (initialData) => {
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
    description: "Starting with the unsorted array. Merge sort is a divide-and-conquer algorithm that divides the array in half, sorts each half recursively, and then merges the sorted halves.",
    codeHighlight: "procedure mergeSort(A: list of sortable items)",
    arrayState: `[${array.join(', ')}]`
  });

  // Auxiliary array for merging
  const auxArray = [...array];
  
  // Collection of recursive calls to track
  const calls = [];
  
  // Main function to simulate recursive merge sort
  const mergeSortSimulation = (start, end, depth = 0) => {
    // Base case: single element is already sorted
    if (start >= end) {
      return;
    }
    
    // Calculate middle point
    const mid = Math.floor((start + end) / 2);
    
    // Highlight current region being divided
    steps.push({
      data: {
        array: [...array],
        activeIndices: Array.from({ length: end - start + 1 }, (_, i) => start + i),
        comparingIndices: [],
        sortedIndices: []
      },
      description: `Dividing array segment [${start}...${end}] into two halves: [${start}...${mid}] and [${mid+1}...${end}]`,
      codeHighlight: "mid := length(A)/2\nleft := mergeSort(A[0...mid-1])\nright := mergeSort(A[mid...length(A)-1])",
      complexityInfo: `Dividing phase: O(log n) levels of recursion`
    });
    
    // Save the recursive calls to process them in order
    calls.push({ type: 'divide', start, mid, end, depth });
    
    // Recursively process left and right halves
    mergeSortSimulation(start, mid, depth + 1);
    mergeSortSimulation(mid + 1, end, depth + 1);
    
    // Add merge operation to calls
    calls.push({ type: 'merge', start, mid, end, depth });
  };
  
  // Start the simulation
  mergeSortSimulation(0, array.length - 1);
  
  // Process all the recursive calls in order of execution
  let sortedIndices = [];
  
  // Helper function to perform the merge and generate steps
  const performMerge = (start, mid, end) => {
    // Copy the segments to auxiliary array
    for (let i = start; i <= end; i++) {
      auxArray[i] = array[i];
    }
    
    // Highlight the two subarrays to be merged
    steps.push({
      data: {
        array: [...array],
        activeIndices: Array.from({ length: end - start + 1 }, (_, i) => start + i),
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Merging two sorted subarrays: [${start}...${mid}] and [${mid+1}...${end}]`,
      codeHighlight: "return merge(left, right)",
      arrayState: `[${array.join(', ')}]`
    });
    
    // Merge the two halves
    let i = start; // Index for left subarray
    let j = mid + 1; // Index for right subarray
    let k = start; // Index for merged array
    
    while (i <= mid && j <= end) {
      // Compare elements from both halves
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [i, j],
          sortedIndices: [...sortedIndices]
        },
        description: `Comparing elements ${auxArray[i]} at index ${i} and ${auxArray[j]} at index ${j}`,
        codeHighlight: "if left[0] ≤ right[0] then",
        arrayState: `[${array.join(', ')}]`
      });
      
      if (auxArray[i] <= auxArray[j]) {
        // Take from left subarray
        array[k] = auxArray[i];
        
        steps.push({
          data: {
            array: [...array],
            activeIndices: [k],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `${auxArray[i]} ≤ ${auxArray[j]}, placing ${auxArray[i]} at position ${k}`,
          codeHighlight: "append left[0] to result\nleft := left[1...left.length-1]",
          arrayState: `[${array.join(', ')}]`
        });
        
        i++;
      } else {
        // Take from right subarray
        array[k] = auxArray[j];
        
        steps.push({
          data: {
            array: [...array],
            activeIndices: [k],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `${auxArray[i]} > ${auxArray[j]}, placing ${auxArray[j]} at position ${k}`,
          codeHighlight: "append right[0] to result\nright := right[1...right.length-1]",
          arrayState: `[${array.join(', ')}]`
        });
        
        j++;
      }
      
      k++;
    }
    
    // Copy remaining elements from left subarray
    while (i <= mid) {
      array[k] = auxArray[i];
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [k],
          comparingIndices: [],
          sortedIndices: [...sortedIndices]
        },
        description: `Copying remaining element ${auxArray[i]} from left subarray to position ${k}`,
        codeHighlight: "append remaining elements of left to result",
        arrayState: `[${array.join(', ')}]`
      });
      
      i++;
      k++;
    }
    
    // Copy remaining elements from right subarray
    while (j <= end) {
      array[k] = auxArray[j];
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [k],
          comparingIndices: [],
          sortedIndices: [...sortedIndices]
        },
        description: `Copying remaining element ${auxArray[j]} from right subarray to position ${k}`,
        codeHighlight: "append remaining elements of right to result",
        arrayState: `[${array.join(', ')}]`
      });
      
      j++;
      k++;
    }
    
    // Mark the entire segment as sorted
    const newSortedIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    sortedIndices = [...sortedIndices, ...newSortedIndices].filter((v, i, a) => a.indexOf(v) === i);
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Completed merging segment [${start}...${end}]. This segment is now sorted.`,
      codeHighlight: "return result",
      complexityInfo: `Merge operation: O(n) comparisons`
    });
  };
  
  // Process the calls
  for (const call of calls) {
    if (call.type === 'merge') {
      performMerge(call.start, call.mid, call.end);
    }
  }
  
  // Add final state if not already marked as sorted
  if (sortedIndices.length !== array.length) {
    sortedIndices = Array.from({ length: array.length }, (_, i) => i);
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: sortedIndices
      },
      description: "Merge sort complete. The array is now fully sorted.",
      codeHighlight: "end procedure",
      arrayState: `[${array.join(', ')}]`
    });
  }
  
  return steps;
};

const MergeSortVisualization = () => {
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
      algorithmName="Merge Sort"
      initialData={initialData}
      generateSteps={generateMergeSortSteps}
      VisualizationComponent={SortingVisualization}
      description="Merge Sort is a divide-and-conquer algorithm that divides the array into two halves, sorts them recursively, and then merges the sorted halves to produce the final sorted array."
    />
  );
};

export default MergeSortVisualization; 