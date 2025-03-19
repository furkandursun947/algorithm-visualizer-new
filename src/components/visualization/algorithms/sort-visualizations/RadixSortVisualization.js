import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Helper function to get digit at position
const getDigit = (num, position) => {
  return Math.floor(Math.abs(num) / Math.pow(10, position)) % 10;
};

// Helper function to get number of digits
const getNumDigits = (num) => {
  if (num === 0) return 1;
  return Math.floor(Math.log10(Math.abs(num))) + 1;
};

// Helper function to get maximum number of digits in array
const getMaxDigits = (arr) => {
  return Math.max(...arr.map(getNumDigits));
};

// Radix sort algorithm visualization steps generator
const generateRadixSortSteps = (initialData) => {
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
    description: "Starting with the unsorted array. Radix sort is a non-comparison based sorting algorithm that sorts numbers by their digits.",
    codeHighlight: "procedure radixSort(A: list of numbers)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // Track sorted indices
  const sortedIndices = [];
  
  // Get maximum number of digits
  const maxDigits = getMaxDigits(array);
  
  // Create buckets for each digit (0-9)
  const buckets = Array.from({ length: 10 }, () => []);
  
  // Process each digit position
  for (let digit = 0; digit < maxDigits; digit++) {
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: [...sortedIndices]
      },
      description: `Processing digit position ${digit} (${Math.pow(10, digit)}'s place)`,
      codeHighlight: `for digit := 0 to maxDigits - 1 do\n    for i := 0 to n - 1 do\n        bucket := getDigit(A[i], digit)`,
      arrayState: `[${array.join(', ')}]`
    });
    
    // Distribute numbers into buckets based on current digit
    for (let i = 0; i < array.length; i++) {
      const currentDigit = getDigit(array[i], digit);
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [i],
          comparingIndices: [],
          sortedIndices: [...sortedIndices]
        },
        description: `Number ${array[i]} has digit ${currentDigit} at position ${digit}`,
        codeHighlight: `bucket := getDigit(A[i], digit)\nappend A[i] to buckets[bucket]`,
        arrayState: `[${array.join(', ')}]`
      });
      
      buckets[currentDigit].push(array[i]);
    }
    
    // Collect numbers from buckets back into array
    let arrayIndex = 0;
    for (let bucket = 0; bucket < 10; bucket++) {
      while (buckets[bucket].length > 0) {
        const num = buckets[bucket].shift();
        array[arrayIndex] = num;
        
        steps.push({
          data: {
            array: [...array],
            activeIndices: [arrayIndex],
            comparingIndices: [],
            sortedIndices: [...sortedIndices]
          },
          description: `Placing ${num} from bucket ${bucket} at position ${arrayIndex}`,
          codeHighlight: `while buckets[bucket] is not empty do\n    A[arrayIndex] := remove from buckets[bucket]\n    arrayIndex := arrayIndex + 1`,
          arrayState: `[${array.join(', ')}]`
        });
        
        arrayIndex++;
      }
    }
    
    // If this is the last digit, mark all indices as sorted
    if (digit === maxDigits - 1) {
      sortedIndices.push(...Array.from({ length: array.length }, (_, i) => i));
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: sortedIndices
        },
        description: "Radix sort complete. The array is now fully sorted.",
        codeHighlight: "end procedure",
        arrayState: `[${array.join(', ')}]`
      });
    }
  }
  
  return steps;
};

const RadixSortVisualization = () => {
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
      algorithmName="Radix Sort"
      initialData={initialData}
      generateSteps={generateRadixSortSteps}
      VisualizationComponent={SortingVisualization}
      description="Radix Sort is a non-comparison based sorting algorithm that sorts numbers by processing their digits from least significant to most significant. It uses buckets to group numbers by each digit."
    />
  );
};

export default RadixSortVisualization; 