import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import SortingVisualization from '../../SortingVisualization';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Helper function to perform insertion sort on a bucket
const insertionSort = (array) => {
  const result = [...array];
  for (let i = 1; i < result.length; i++) {
    const key = result[i];
    let j = i - 1;
    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }
    result[j + 1] = key;
  }
  return result;
};

// Bucket sort algorithm visualization steps generator
const generateBucketSortSteps = (initialData) => {
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
  
  // Find the minimum and maximum values in the array
  const min = Math.min(...array);
  const max = Math.max(...array);
  
  // Add initial state
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    },
    description: "Starting with the unsorted array. Bucket sort distributes elements into a number of buckets, sorts each bucket, and then concatenates them.",
    codeHighlight: "procedure bucketSort(A: list of sortable items)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // Create buckets
  // For visualization purposes, use a reasonable number of buckets
  const bucketCount = Math.min(Math.ceil(Math.sqrt(n)), 10);
  const buckets = Array.from({ length: bucketCount }, () => []);
  
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    },
    description: `Created ${bucketCount} empty buckets for distributing elements.`,
    codeHighlight: "create array of n empty buckets",
    arrayState: `[${array.join(', ')}]`,
    bucketInfo: {
      buckets: [...buckets],
      bucketCount: bucketCount,
      minValue: min,
      maxValue: max
    }
  });
  
  // Distribute elements into buckets
  for (let i = 0; i < n; i++) {
    // Calculate bucket index
    // For values in range [min, max], distribute into [0, bucketCount-1]
    const bucketIndex = Math.min(
      Math.floor(bucketCount * (array[i] - min) / (max - min + 1)), 
      bucketCount - 1
    );
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [i],
        comparingIndices: [],
        sortedIndices: []
      },
      description: `Placing element ${array[i]} into bucket ${bucketIndex}`,
      codeHighlight: "insert A[i] into bucket[n*A[i]]",
      arrayState: `[${array.join(', ')}]`,
      bucketInfo: {
        buckets: [...buckets.map(bucket => [...bucket])],
        currentElement: array[i],
        currentBucket: bucketIndex,
        minValue: min,
        maxValue: max
      }
    });
    
    buckets[bucketIndex].push(array[i]);
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: []
      },
      description: `Placed element ${array[i]} into bucket ${bucketIndex}`,
      codeHighlight: "insert A[i] into bucket[n*A[i]]",
      arrayState: `[${array.join(', ')}]`,
      bucketInfo: {
        buckets: [...buckets.map(bucket => [...bucket])],
        highlightBucket: bucketIndex,
        minValue: min,
        maxValue: max
      }
    });
  }
  
  // Sort individual buckets
  const sortedBuckets = [...buckets];
  
  for (let i = 0; i < bucketCount; i++) {
    if (sortedBuckets[i].length <= 1) {
      // Bucket with 0 or 1 element is already sorted
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: []
        },
        description: `Bucket ${i} has ${sortedBuckets[i].length} elements and is already sorted.`,
        codeHighlight: "sort bucket[i] using insertion sort",
        arrayState: `[${array.join(', ')}]`,
        bucketInfo: {
          buckets: [...sortedBuckets.map(bucket => [...bucket])],
          sortingBucket: i,
          sortedBuckets: [...Array(i).keys()],
          minValue: min,
          maxValue: max
        }
      });
    } else {
      // Bucket needs sorting
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: []
        },
        description: `Sorting bucket ${i} with ${sortedBuckets[i].length} elements using insertion sort.`,
        codeHighlight: "sort bucket[i] using insertion sort",
        arrayState: `[${array.join(', ')}]`,
        bucketInfo: {
          buckets: [...sortedBuckets.map(bucket => [...bucket])],
          sortingBucket: i,
          sortedBuckets: [...Array(i).keys()],
          minValue: min,
          maxValue: max
        }
      });
      
      // Sort the bucket (using insertion sort)
      sortedBuckets[i] = insertionSort(sortedBuckets[i]);
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: []
        },
        description: `Bucket ${i} has been sorted: [${sortedBuckets[i].join(', ')}]`,
        codeHighlight: "sort bucket[i] using insertion sort",
        arrayState: `[${array.join(', ')}]`,
        bucketInfo: {
          buckets: [...sortedBuckets.map(bucket => [...bucket])],
          sortedBuckets: [...Array(i + 1).keys()],
          minValue: min,
          maxValue: max
        }
      });
    }
  }
  
  // Concatenate buckets
  let index = 0;
  const sortedArray = [...array];
  
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    },
    description: `All buckets are now sorted. Concatenating buckets back into the original array.`,
    codeHighlight: "concatenate all buckets into A",
    arrayState: `[${array.join(', ')}]`,
    bucketInfo: {
      buckets: [...sortedBuckets.map(bucket => [...bucket])],
      sortedBuckets: [...Array(bucketCount).keys()],
      concatenating: true,
      minValue: min,
      maxValue: max
    }
  });
  
  // Track which elements have been placed back into the array
  const placedIndices = [];
  
  // Concatenate each bucket
  for (let i = 0; i < bucketCount; i++) {
    for (let j = 0; j < sortedBuckets[i].length; j++) {
      sortedArray[index] = sortedBuckets[i][j];
      placedIndices.push(index);
      
      steps.push({
        data: {
          array: [...sortedArray],
          activeIndices: [index],
          comparingIndices: [],
          sortedIndices: [...placedIndices]
        },
        description: `Placing element ${sortedBuckets[i][j]} from bucket ${i} at position ${index} in the final array.`,
        codeHighlight: "concatenate all buckets into A",
        arrayState: `[${sortedArray.join(', ')}]`,
        bucketInfo: {
          buckets: [...sortedBuckets.map(bucket => [...bucket])],
          sortedBuckets: [...Array(bucketCount).keys()],
          currentBucket: i,
          concatenating: true,
          currentBucketIndex: j,
          minValue: min,
          maxValue: max
        }
      });
      
      index++;
    }
  }
  
  // Final state
  steps.push({
    data: {
      array: [...sortedArray],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: Array.from({ length: n }, (_, i) => i)
    },
    description: "Bucket sort complete. The array is now fully sorted.",
    codeHighlight: "end procedure",
    arrayState: `[${sortedArray.join(', ')}]`
  });
  
  return steps;
};

// Create a custom visualization component for Bucket Sort
const BucketSortVisualizationComponent = ({ data, step, stepInfo }) => {
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
      {/* Main array visualization */}
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
            <div className="mt-1 text-xs text-gray-500">
              {index}
            </div>
          </div>
        ))}
      </div>
      
      {/* Buckets visualization */}
      {stepInfo.bucketInfo && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Buckets:</h3>
            {stepInfo.bucketInfo.currentElement !== undefined && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Placing {stepInfo.bucketInfo.currentElement} in Bucket {stepInfo.bucketInfo.currentBucket}
              </span>
            )}
            {stepInfo.bucketInfo.sortingBucket !== undefined && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Sorting Bucket {stepInfo.bucketInfo.sortingBucket}
              </span>
            )}
            {stepInfo.bucketInfo.concatenating && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Concatenating Buckets
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {stepInfo.bucketInfo.buckets.map((bucket, bucketIndex) => {
              const isSortedBucket = stepInfo.bucketInfo.sortedBuckets && 
                                    stepInfo.bucketInfo.sortedBuckets.includes(bucketIndex);
              const isCurrentBucket = stepInfo.bucketInfo.currentBucket === bucketIndex;
              const isSortingBucket = stepInfo.bucketInfo.sortingBucket === bucketIndex;
              const isHighlighted = stepInfo.bucketInfo.highlightBucket === bucketIndex;
              
              return (
                <div 
                  key={`bucket-${bucketIndex}`} 
                  className={`border rounded-md p-2 ${
                    isCurrentBucket && stepInfo.bucketInfo.concatenating
                      ? 'border-purple-400 bg-purple-50'
                      : isSortingBucket
                        ? 'border-yellow-400 bg-yellow-50' 
                        : isSortedBucket
                          ? 'border-green-400 bg-green-50'
                          : isHighlighted
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300'
                  }`}
                >
                  <div className="text-xs font-medium mb-1 flex justify-between">
                    <span>Bucket {bucketIndex}</span>
                    <span>{bucket.length} items</span>
                  </div>
                  <div className="min-h-[50px] flex flex-wrap gap-1 items-center">
                    {bucket.map((value, i) => (
                      <span 
                        key={`bucket-${bucketIndex}-item-${i}`}
                        className={`inline-block px-2 py-1 text-xs rounded-md ${
                          stepInfo.bucketInfo.concatenating && 
                          isCurrentBucket && 
                          i === stepInfo.bucketInfo.currentBucketIndex
                            ? 'bg-purple-500 text-white'
                            : isSortedBucket
                              ? 'bg-green-200'
                              : 'bg-gray-200'
                        }`}
                      >
                        {value}
                      </span>
                    ))}
                    {bucket.length === 0 && (
                      <span className="text-xs text-gray-400 italic">Empty</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Range information */}
          <div className="mt-4 text-xs text-gray-600">
            <p>Value Range: [{stepInfo.bucketInfo.minValue}, {stepInfo.bucketInfo.maxValue}]</p>
            <p className="mt-1">
              Bucket Distribution: Values are distributed into buckets based on their position within the range.
            </p>
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

const BucketSortVisualization = () => {
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
      algorithmName="Bucket Sort"
      initialData={initialData}
      generateSteps={generateBucketSortSteps}
      VisualizationComponent={BucketSortVisualizationComponent}
      description="Bucket Sort is a distribution sorting algorithm that works by distributing elements into a number of buckets, sorting each bucket individually, and then concatenating the sorted buckets."
    />
  );
};

export default BucketSortVisualization; 