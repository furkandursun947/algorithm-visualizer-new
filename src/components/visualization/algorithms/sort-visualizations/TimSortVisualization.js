import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate random array
const generateRandomArray = (length = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
};

// Tim sort algorithm visualization steps generator
const generateTimSortSteps = (initialData) => {
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
    description: "Starting with the unsorted array. Tim Sort is a hybrid sorting algorithm derived from merge sort and insertion sort.",
    codeHighlight: "procedure timSort(A: list of sortable items)",
    arrayState: `[${array.join(', ')}]`
  });
  
  // For visualization, use a smaller run size than typical TimSort
  // (TimSort typically uses 32 or 64, but we'll use a smaller value for better visualization)
  const RUN = Math.max(2, Math.floor(n / 4));
  
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    },
    description: `Determined run size: ${RUN}. Tim Sort first sorts small subarrays of this size using insertion sort.`,
    codeHighlight: "RUN := determineBestRunSize()",
    arrayState: `[${array.join(', ')}]`
  });
  
  // First, sort individual subarrays of size 'RUN'
  for (let i = 0; i < n; i += RUN) {
    // Determine the end index for this run
    const end = Math.min(i + RUN - 1, n - 1);
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: Array.from({ length: end - i + 1 }, (_, idx) => i + idx),
        comparingIndices: [],
        sortedIndices: []
      },
      description: `Starting insertion sort for subarray from index ${i} to ${end}`,
      codeHighlight: "// Sort individual subarrays of size RUN using insertion sort",
      arrayState: `[${array.join(', ')}]`,
      runInfo: {
        currentRunStart: i,
        currentRunEnd: end,
        allRuns: Math.ceil(n / RUN),
        currentRunNumber: Math.floor(i / RUN) + 1
      }
    });
    
    // Perform insertion sort on this subarray
    insertionSortRange(array, i, end, steps);
  }
  
  // Start merging from size RUN. It will merge
  // to form size 2*RUN, then 4*RUN, 8*RUN and so on
  for (let size = RUN; size < n; size = 2 * size) {
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: []
      },
      description: `Now merging subarrays of size ${size} to create subarrays of size ${2 * size}`,
      codeHighlight: "// Start merging from size RUN",
      arrayState: `[${array.join(', ')}]`,
      mergeInfo: {
        currentSize: size,
        nextSize: 2 * size
      }
    });
    
    // Pick starting point of left subarray. We
    // merge arr[left..left+size-1] and arr[left+size, left+2*size-1]
    for (let left = 0; left < n; left += 2 * size) {
      // Find ending point of left subarray
      // mid+1 is starting point of right subarray
      const mid = Math.min(n - 1, left + size - 1);
      
      // Find the ending point of right subarray
      const right = Math.min(left + 2 * size - 1, n - 1);
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: []
        },
        description: `Merging subarrays [${left}...${mid}] and [${mid + 1}...${right}]`,
        codeHighlight: "// Merge subarrays arr[left..mid] and arr[mid+1..right]",
        arrayState: `[${array.join(', ')}]`,
        mergeInfo: {
          leftStart: left,
          leftEnd: mid,
          rightStart: mid + 1,
          rightEnd: right
        }
      });
      
      // Merge subarrays arr[left...mid] & arr[mid+1...right]
      if (mid < right) {
        merge(array, left, mid, right, steps);
      }
    }
  }
  
  // Mark all elements as sorted
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: Array.from({ length: n }, (_, i) => i)
    },
    description: "Tim Sort complete. The array is now fully sorted.",
    codeHighlight: "end procedure",
    arrayState: `[${array.join(', ')}]`
  });
  
  return steps;
};

// Insertion sort for a range
const insertionSortRange = (array, start, end, steps) => {
  // Perform insertion sort on the range
  for (let i = start + 1; i <= end; i++) {
    const key = array[i];
    let j = i - 1;
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [i],
        comparingIndices: [j],
        sortedIndices: []
      },
      description: `Insertion sort: considering element ${key} at position ${i}`,
      codeHighlight: "key = arr[i]\nj = i - 1",
      arrayState: `[${array.join(', ')}]`
    });
    
    while (j >= start && array[j] > key) {
      steps.push({
        data: {
          array: [...array],
          activeIndices: [i],
          comparingIndices: [j],
          sortedIndices: []
        },
        description: `${array[j]} > ${key}, shifting element to the right`,
        codeHighlight: "while j >= start and arr[j] > key\n    arr[j+1] = arr[j]\n    j = j - 1",
        arrayState: `[${array.join(', ')}]`
      });
      
      array[j + 1] = array[j];
      j--;
    }
    
    array[j + 1] = key;
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [j + 1],
        comparingIndices: [],
        sortedIndices: []
      },
      description: `Placed ${key} at position ${j + 1}`,
      codeHighlight: "arr[j+1] = key",
      arrayState: `[${array.join(', ')}]`
    });
  }
  
  // Mark the entire range as temporarily sorted
  const tempSortedIndices = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: tempSortedIndices
    },
    description: `Completed insertion sort for subarray from index ${start} to ${end}`,
    codeHighlight: "// Subarray is now sorted",
    arrayState: `[${array.join(', ')}]`
  });
};

// Merge function
const merge = (array, left, mid, right, steps) => {
  // Create temporary arrays
  const n1 = mid - left + 1;
  const n2 = right - mid;
  
  const leftArray = new Array(n1);
  const rightArray = new Array(n2);
  
  // Copy data to temporary arrays
  for (let i = 0; i < n1; i++) {
    leftArray[i] = array[left + i];
  }
  
  for (let j = 0; j < n2; j++) {
    rightArray[j] = array[mid + 1 + j];
  }
  
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: []
    },
    description: `Created temporary arrays for merging:\nLeft: [${leftArray.join(', ')}]\nRight: [${rightArray.join(', ')}]`,
    codeHighlight: "// Copy data to temp arrays leftArray[] and rightArray[]",
    arrayState: `[${array.join(', ')}]`,
    mergeInfo: {
      leftArray,
      rightArray,
      leftStart: left,
      rightEnd: right
    }
  });
  
  // Merge temporary arrays back into original array
  let i = 0; // Initial index of first subarray
  let j = 0; // Initial index of second subarray
  let k = left; // Initial index of merged subarray
  
  while (i < n1 && j < n2) {
    steps.push({
      data: {
        array: [...array],
        activeIndices: [],
        comparingIndices: [left + i, mid + 1 + j],
        sortedIndices: Array.from({ length: k - left }, (_, idx) => left + idx)
      },
      description: `Comparing ${leftArray[i]} from left array with ${rightArray[j]} from right array`,
      codeHighlight: "if leftArray[i] <= rightArray[j] then\n    arr[k] = leftArray[i]\n    i++\nelse\n    arr[k] = rightArray[j]\n    j++",
      arrayState: `[${array.join(', ')}]`,
      mergeProgress: {
        leftArrayPos: i,
        rightArrayPos: j,
        mergedArrayPos: k - left
      }
    });
    
    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      i++;
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [k],
          comparingIndices: [],
          sortedIndices: Array.from({ length: k - left }, (_, idx) => left + idx)
        },
        description: `Placed ${array[k]} from left array at position ${k}`,
        codeHighlight: "arr[k] = leftArray[i]\ni++",
        arrayState: `[${array.join(', ')}]`,
        mergeProgress: {
          leftArrayPos: i,
          rightArrayPos: j,
          mergedArrayPos: k - left + 1
        }
      });
    } else {
      array[k] = rightArray[j];
      j++;
      
      steps.push({
        data: {
          array: [...array],
          activeIndices: [k],
          comparingIndices: [],
          sortedIndices: Array.from({ length: k - left }, (_, idx) => left + idx)
        },
        description: `Placed ${array[k]} from right array at position ${k}`,
        codeHighlight: "arr[k] = rightArray[j]\nj++",
        arrayState: `[${array.join(', ')}]`,
        mergeProgress: {
          leftArrayPos: i,
          rightArrayPos: j,
          mergedArrayPos: k - left + 1
        }
      });
    }
    
    k++;
  }
  
  // Copy remaining elements of leftArray, if any
  while (i < n1) {
    array[k] = leftArray[i];
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [k],
        comparingIndices: [],
        sortedIndices: Array.from({ length: k - left }, (_, idx) => left + idx)
      },
      description: `Copied remaining element ${leftArray[i]} from left array to position ${k}`,
      codeHighlight: "// Copy remaining elements of leftArray[]",
      arrayState: `[${array.join(', ')}]`
    });
    
    i++;
    k++;
  }
  
  // Copy remaining elements of rightArray, if any
  while (j < n2) {
    array[k] = rightArray[j];
    
    steps.push({
      data: {
        array: [...array],
        activeIndices: [k],
        comparingIndices: [],
        sortedIndices: Array.from({ length: k - left }, (_, idx) => left + idx)
      },
      description: `Copied remaining element ${rightArray[j]} from right array to position ${k}`,
      codeHighlight: "// Copy remaining elements of rightArray[]",
      arrayState: `[${array.join(', ')}]`
    });
    
    j++;
    k++;
  }
  
  // Mark the entire merged range as temporarily sorted
  const mergedIndices = Array.from({ length: right - left + 1 }, (_, idx) => left + idx);
  
  steps.push({
    data: {
      array: [...array],
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: mergedIndices
    },
    description: `Completed merging subarrays from index ${left} to ${right}`,
    codeHighlight: "// Merged subarray is now sorted",
    arrayState: `[${array.join(', ')}]`
  });
};

// Create a custom visualization component for Tim Sort
const TimSortVisualizationComponent = ({ data, step, stepInfo }) => {
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
          // Determine if this element is part of the current run or merge
          let isRunElement = false;
          let isMergeLeft = false;
          let isMergeRight = false;
          
          if (stepInfo.runInfo) {
            isRunElement = index >= stepInfo.runInfo.currentRunStart && 
                          index <= stepInfo.runInfo.currentRunEnd;
          }
          
          if (stepInfo.mergeInfo) {
            if (stepInfo.mergeInfo.leftStart !== undefined) {
              isMergeLeft = index >= stepInfo.mergeInfo.leftStart && 
                            index <= stepInfo.mergeInfo.leftEnd;
              isMergeRight = index >= stepInfo.mergeInfo.rightStart && 
                             index <= stepInfo.mergeInfo.rightEnd;
            }
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
                        : isMergeLeft
                          ? 'bg-blue-400'
                          : isMergeRight
                            ? 'bg-teal-400'
                            : isRunElement
                              ? 'bg-indigo-400'
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
      
      {/* Display run information */}
      {stepInfo.runInfo && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-md">
          <div className="flex items-center">
            <span className="text-sm font-semibold text-indigo-700 mr-2">Run Information:</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded font-mono">
              Run {stepInfo.runInfo.currentRunNumber} of {stepInfo.runInfo.allRuns}
              {' '}[{stepInfo.runInfo.currentRunStart}...{stepInfo.runInfo.currentRunEnd}]
            </span>
          </div>
        </div>
      )}
      
      {/* Display merge information */}
      {stepInfo.mergeInfo && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center flex-wrap">
            <span className="text-sm font-semibold text-blue-700 mr-2">Merge Information:</span>
            {stepInfo.mergeInfo.currentSize && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-mono mr-2">
                Merging size {stepInfo.mergeInfo.currentSize} → {stepInfo.mergeInfo.nextSize}
              </span>
            )}
            {stepInfo.mergeInfo.leftStart !== undefined && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-mono">
                Left [{stepInfo.mergeInfo.leftStart}...{stepInfo.mergeInfo.leftEnd}] 
                Right [{stepInfo.mergeInfo.rightStart}...{stepInfo.mergeInfo.rightEnd}]
              </span>
            )}
          </div>
          
          {stepInfo.mergeInfo.leftArray && (
            <div className="mt-2 flex flex-col space-y-1">
              <div className="flex items-center">
                <span className="text-xs text-blue-700 mr-2">Left array:</span>
                <span className="text-xs font-mono bg-blue-100 px-2 py-1 rounded">
                  [{stepInfo.mergeInfo.leftArray.join(', ')}]
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-teal-700 mr-2">Right array:</span>
                <span className="text-xs font-mono bg-teal-100 px-2 py-1 rounded">
                  [{stepInfo.mergeInfo.rightArray.join(', ')}]
                </span>
              </div>
            </div>
          )}
          
          {stepInfo.mergeProgress && (
            <div className="mt-2">
              <span className="text-xs text-blue-700">
                Progress: Left[{stepInfo.mergeProgress.leftArrayPos}], 
                Right[{stepInfo.mergeProgress.rightArrayPos}], 
                Merged[{stepInfo.mergeProgress.mergedArrayPos}]
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

const TimSortVisualization = () => {
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
      algorithmName="Tim Sort"
      initialData={initialData}
      generateSteps={generateTimSortSteps}
      VisualizationComponent={TimSortVisualizationComponent}
      description="Tim Sort is a hybrid sorting algorithm combining insertion sort and merge sort. It first divides the array into small runs and sorts them using insertion sort, then repeatedly merges these runs using a merge sort technique."
    />
  );
};

export default TimSortVisualization; 