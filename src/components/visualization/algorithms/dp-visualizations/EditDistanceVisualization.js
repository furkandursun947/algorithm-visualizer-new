import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for Edit Distance calculation
const generateInitialData = () => {
  // Sample strings
  const str1 = "kitten";
  const str2 = "sitting";
  
  // Create DP table with dimensions (str1.length + 1) x (str2.length + 1)
  const dpTable = Array(str1.length + 1).fill().map(() => Array(str2.length + 1).fill(0));
  
  // Initialize DP table for base cases
  for (let i = 0; i <= str1.length; i++) {
    dpTable[i][0] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    dpTable[0][j] = j;
  }
  
  return {
    str1,
    str2,
    dpTable,
    currentI: 0,
    currentJ: 0,
    isComputing: false,
    isComplete: false,
    operations: [],
    activeOperation: null,
    activeCell: null,
    backtrackPath: []
  };
};

// Generate steps for Edit Distance calculation
const generateEditDistanceSteps = (initialData) => {
  const steps = [];
  const { str1, str2 } = initialData;
  
  // Clone the initial data to avoid mutating it
  const dpTable = initialData.dpTable.map(row => [...row]);
  
  // Add step for initialization (describing the problem)
  steps.push({
    data: {
      str1,
      str2,
      dpTable: dpTable.map(row => [...row]),
      currentI: 0,
      currentJ: 0,
      isComputing: false,
      isComplete: false,
      operations: [],
      activeOperation: null,
      activeCell: null,
      backtrackPath: []
    },
    description: "The Edit Distance problem is to find the minimum number of operations (insertions, deletions, or substitutions) required to convert one string into another.",
    codeHighlight: "// Initialize DP table for edit distance",
    complexityInfo: "Time Complexity: O(m*n), Space Complexity: O(m*n) where m and n are the lengths of the strings"
  });
  
  // Add step for DP table initialization
  steps.push({
    data: {
      str1,
      str2,
      dpTable: dpTable.map(row => [...row]),
      currentI: 0,
      currentJ: 0,
      isComputing: false,
      isComplete: false,
      operations: [],
      activeOperation: null,
      activeCell: null,
      backtrackPath: []
    },
    description: "Initialize the DP table. If first string is empty, we need to insert all characters from second string. If second string is empty, we need to delete all characters from first string.",
    codeHighlight: "// Base cases\nfor i := 0 to len(str1) do\n    dp[i][0] := i\nfor j := 0 to len(str2) do\n    dp[0][j] := j",
    complexityInfo: "Initializing base cases with O(m+n) operations"
  });
  
  // Fill the DP table
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      // Highlight current cell being computed
      steps.push({
        data: {
          str1,
          str2,
          dpTable: dpTable.map(row => [...row]),
          currentI: i,
          currentJ: j,
          isComputing: true,
          isComplete: false,
          operations: [],
          activeOperation: null,
          activeCell: [i, j],
          backtrackPath: []
        },
        description: `Computing edit distance for prefixes "${str1.substring(0, i)}" and "${str2.substring(0, j)}"`,
        codeHighlight: "for i := 1 to len(str1) do\n    for j := 1 to len(str2) do",
        complexityInfo: `Processing cell (${i},${j})`
      });
      
      // Calculate minimum edit distance
      const deleteOp = dpTable[i-1][j] + 1;
      const insertOp = dpTable[i][j-1] + 1;
      const substituteOp = dpTable[i-1][j-1] + (str1[i-1] === str2[j-1] ? 0 : 1);
      
      // Show the options for current cell
      steps.push({
        data: {
          str1,
          str2,
          dpTable: dpTable.map(row => [...row]),
          currentI: i,
          currentJ: j,
          isComputing: true,
          isComplete: false,
          operations: [
            { type: 'delete', cost: deleteOp },
            { type: 'insert', cost: insertOp },
            { type: 'substitute', cost: substituteOp, isMatch: str1[i-1] === str2[j-1] }
          ],
          activeOperation: null,
          activeCell: [i, j],
          backtrackPath: []
        },
        description: `Considering operations: Delete (${deleteOp}), Insert (${insertOp}), ${str1[i-1] === str2[j-1] ? 'Match' : 'Substitute'} (${substituteOp})`,
        codeHighlight: "        // Calculate min of three operations\n        delete_cost := dp[i-1][j] + 1\n        insert_cost := dp[i][j-1] + 1\n        substitute_cost := dp[i-1][j-1] + (str1[i-1] != str2[j-1] ? 1 : 0)",
        complexityInfo: "Evaluating three possible operations"
      });
      
      // Determine minimum operation
      let minOp = Math.min(deleteOp, insertOp, substituteOp);
      let opType = '';
      
      if (minOp === deleteOp) {
        opType = 'delete';
        steps.push({
          data: {
            str1,
            str2,
            dpTable: dpTable.map(row => [...row]),
            currentI: i,
            currentJ: j,
            isComputing: true,
            isComplete: false,
            operations: [
              { type: 'delete', cost: deleteOp },
              { type: 'insert', cost: insertOp },
              { type: 'substitute', cost: substituteOp, isMatch: str1[i-1] === str2[j-1] }
            ],
            activeOperation: 'delete',
            activeCell: [i, j],
            backtrackPath: []
          },
          description: `Deletion is the minimum cost operation. dp[${i}][${j}] = dp[${i-1}][${j}] + 1 = ${deleteOp}`,
          codeHighlight: "        dp[i][j] := min(delete_cost, insert_cost, substitute_cost)",
          complexityInfo: `Selected operation: Delete, Cost: ${deleteOp}`
        });
      } else if (minOp === insertOp) {
        opType = 'insert';
        steps.push({
          data: {
            str1,
            str2,
            dpTable: dpTable.map(row => [...row]),
            currentI: i,
            currentJ: j,
            isComputing: true,
            isComplete: false,
            operations: [
              { type: 'delete', cost: deleteOp },
              { type: 'insert', cost: insertOp },
              { type: 'substitute', cost: substituteOp, isMatch: str1[i-1] === str2[j-1] }
            ],
            activeOperation: 'insert',
            activeCell: [i, j],
            backtrackPath: []
          },
          description: `Insertion is the minimum cost operation. dp[${i}][${j}] = dp[${i}][${j-1}] + 1 = ${insertOp}`,
          codeHighlight: "        dp[i][j] := min(delete_cost, insert_cost, substitute_cost)",
          complexityInfo: `Selected operation: Insert, Cost: ${insertOp}`
        });
      } else {
        opType = str1[i-1] === str2[j-1] ? 'match' : 'substitute';
        steps.push({
          data: {
            str1,
            str2,
            dpTable: dpTable.map(row => [...row]),
            currentI: i,
            currentJ: j,
            isComputing: true,
            isComplete: false,
            operations: [
              { type: 'delete', cost: deleteOp },
              { type: 'insert', cost: insertOp },
              { type: 'substitute', cost: substituteOp, isMatch: str1[i-1] === str2[j-1] }
            ],
            activeOperation: 'substitute',
            activeCell: [i, j],
            backtrackPath: []
          },
          description: `${str1[i-1] === str2[j-1] ? 'Match' : 'Substitution'} is the minimum cost operation. dp[${i}][${j}] = dp[${i-1}][${j-1}] + ${str1[i-1] === str2[j-1] ? '0' : '1'} = ${substituteOp}`,
          codeHighlight: "        dp[i][j] := min(delete_cost, insert_cost, substitute_cost)",
          complexityInfo: `Selected operation: ${str1[i-1] === str2[j-1] ? 'Match' : 'Substitute'}, Cost: ${substituteOp}`
        });
      }
      
      // Update DP table with the minimum value
      dpTable[i][j] = minOp;
      
      // Add step to show updated DP table
      steps.push({
        data: {
          str1,
          str2,
          dpTable: dpTable.map(row => [...row]),
          currentI: i,
          currentJ: j,
          isComputing: false,
          isComplete: false,
          operations: [],
          activeOperation: null,
          activeCell: [i, j],
          backtrackPath: []
        },
        description: `Set dp[${i}][${j}] = ${minOp}, the minimum edit distance between "${str1.substring(0, i)}" and "${str2.substring(0, j)}"`,
        codeHighlight: "        dp[i][j] := min(delete_cost, insert_cost, substitute_cost)",
        complexityInfo: `Cell (${i},${j}) computed with value ${minOp}`
      });
    }
  }
  
  // Backtrack to find the sequence of operations
  const backtrackPath = [];
  let i = str1.length;
  let j = str2.length;
  
  while (i > 0 || j > 0) {
    backtrackPath.push([i, j]);
    
    if (i === 0) {
      // Only option is to insert
      j--;
    } else if (j === 0) {
      // Only option is to delete
      i--;
    } else {
      // Determine which operation was used
      const deleteOp = dpTable[i-1][j];
      const insertOp = dpTable[i][j-1];
      const substituteOp = dpTable[i-1][j-1];
      
      if (str1[i-1] === str2[j-1] && dpTable[i][j] === substituteOp) {
        // Match
        i--;
        j--;
      } else if (dpTable[i][j] === substituteOp + 1) {
        // Substitution
        i--;
        j--;
      } else if (dpTable[i][j] === deleteOp + 1) {
        // Deletion
        i--;
      } else {
        // Insertion
        j--;
      }
    }
  }
  
  // Reverse the path to get the correct order
  backtrackPath.reverse();
  
  // Add final step
  steps.push({
    data: {
      str1,
      str2,
      dpTable: dpTable.map(row => [...row]),
      currentI: str1.length,
      currentJ: str2.length,
      isComputing: false,
      isComplete: true,
      operations: [],
      activeOperation: null,
      activeCell: [str1.length, str2.length],
      backtrackPath
    },
    description: `Edit Distance computation complete. The minimum number of operations required to transform "${str1}" to "${str2}" is ${dpTable[str1.length][str2.length]}.`,
    codeHighlight: "return dp[len(str1)][len(str2)]",
    complexityInfo: `Final result: ${dpTable[str1.length][str2.length]} operations`
  });
  
  return steps;
};

// Component to visualize the strings and their transformation
const StringsVisualization = ({ data }) => {
  const { str1, str2, currentI, currentJ, isComplete, backtrackPath } = data;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Strings:</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-md p-4 bg-blue-50">
          <h4 className="font-medium text-blue-800 mb-2">String 1:</h4>
          <div className="flex flex-wrap">
            {str1.split('').map((char, index) => (
              <motion.div
                key={index}
                className={`w-8 h-8 flex items-center justify-center m-1 border rounded-md ${
                  index < currentI ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="border rounded-md p-4 bg-green-50">
          <h4 className="font-medium text-green-800 mb-2">String 2:</h4>
          <div className="flex flex-wrap">
            {str2.split('').map((char, index) => (
              <motion.div
                key={index}
                className={`w-8 h-8 flex items-center justify-center m-1 border rounded-md ${
                  index < currentJ ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {isComplete && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-md">
          <h4 className="font-medium text-indigo-800 mb-2">Optimal Transformation Path:</h4>
          <div className="text-gray-700">
            {backtrackPath.map((pos, index) => {
              const [i, j] = pos;
              const prevI = index > 0 ? backtrackPath[index - 1][0] : 0;
              const prevJ = index > 0 ? backtrackPath[index - 1][1] : 0;
              
              let operation = '';
              if (i > prevI && j > prevJ) {
                if (str1[i-1] === str2[j-1]) {
                  operation = `Match: Keep "${str1[i-1]}"`;
                } else {
                  operation = `Substitute: Change "${str1[i-1]}" to "${str2[j-1]}"`;
                }
              } else if (i > prevI) {
                operation = `Delete: Remove "${str1[i-1]}"`;
              } else if (j > prevJ) {
                operation = `Insert: Add "${str2[j-1]}"`;
              }
              
              return (
                <div key={index} className="p-2 mb-1 bg-indigo-100 rounded">
                  Step {index + 1}: {operation}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Component to visualize the DP table
const DPTableVisualization = ({ data }) => {
  const { str1, str2, dpTable, activeCell, operations, activeOperation } = data;
  
  // Helper function to determine cell class based on its state
  const getCellClass = (i, j) => {
    if (activeCell && activeCell[0] === i && activeCell[1] === j) {
      return "bg-yellow-200 font-bold"; // Current cell being computed
    }
    
    // Base case cells
    if (i === 0 || j === 0) {
      return "bg-gray-100";
    }
    
    // Cells that are referenced for current operation
    if (operations.length > 0 && activeCell) {
      if ((activeOperation === 'delete' && i === activeCell[0] - 1 && j === activeCell[1]) ||
          (activeOperation === 'insert' && i === activeCell[0] && j === activeCell[1] - 1) ||
          ((activeOperation === 'substitute' || activeOperation === 'match') && 
           i === activeCell[0] - 1 && j === activeCell[1] - 1)) {
        return "bg-blue-100";
      }
    }
    
    return "bg-white";
  };
  
  return (
    <div className="mb-6 overflow-x-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-2">DP Table:</h3>
      <table className="min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100"></th>
            <th className="border p-2 bg-gray-100">ε</th>
            {str2.split('').map((char, index) => (
              <th key={index} className="border p-2 bg-gray-100">{char}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="border p-2 bg-gray-100">ε</th>
            {dpTable[0].map((value, j) => (
              <td 
                key={j} 
                className={`border p-2 text-center ${getCellClass(0, j)}`}
              >
                {value}
              </td>
            ))}
          </tr>
          {str1.split('').map((char, i) => (
            <tr key={i}>
              <th className="border p-2 bg-gray-100">{char}</th>
              {dpTable[i+1].map((value, j) => (
                <td 
                  key={j} 
                  className={`border p-2 text-center ${getCellClass(i+1, j)}`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {operations.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">Operations:</h4>
          <div className="flex flex-wrap gap-2">
            {operations.map((op, index) => {
              let opClass = "p-2 border rounded";
              let opLabel = "";
              
              switch (op.type) {
                case 'delete':
                  opLabel = `Delete: ${op.cost}`;
                  opClass += activeOperation === 'delete' ? " bg-red-100 border-red-400" : " bg-white border-gray-300";
                  break;
                case 'insert':
                  opLabel = `Insert: ${op.cost}`;
                  opClass += activeOperation === 'insert' ? " bg-green-100 border-green-400" : " bg-white border-gray-300";
                  break;
                case 'substitute':
                  opLabel = op.isMatch ? `Match: ${op.cost}` : `Substitute: ${op.cost}`;
                  opClass += activeOperation === 'substitute' ? " bg-blue-100 border-blue-400" : " bg-white border-gray-300";
                  break;
                default:
                  opLabel = `Unknown: ${op.cost}`;
              }
              
              return (
                <div key={index} className={opClass}>
                  {opLabel}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Main visualization component for Edit Distance
const EditDistanceVisualizationComponent = ({ data, step, stepInfo }) => {
  return (
    <div className="w-full">
      <StringsVisualization data={data} />
      <DPTableVisualization data={data} />
    </div>
  );
};

// Container component with animation controls
const EditDistanceVisualization = () => {
  // Generate initial data for the Edit Distance problem
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Edit Distance (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateEditDistanceSteps}
      VisualizationComponent={EditDistanceVisualizationComponent}
      description="The Edit Distance algorithm calculates the minimum number of operations (insertions, deletions, or substitutions) required to transform one string into another. It's a fundamental problem in computer science with applications in spell checking, DNA sequence alignment, and natural language processing."
    />
  );
};

export default EditDistanceVisualization; 