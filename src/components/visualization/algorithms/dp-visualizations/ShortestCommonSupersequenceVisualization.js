import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for Shortest Common Supersequence problem
const generateInitialData = () => {
  // Sample strings
  const string1 = "ABCBDAB";
  const string2 = "BDCABA";
  
  // Initialize DP table for SCS calculation
  // dp[i][j] represents the length of the SCS for 
  // string1[0...i-1] and string2[0...j-1]
  const m = string1.length;
  const n = string2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  return {
    string1,
    string2,
    dp,
    currentIndex1: 0,
    currentIndex2: 0,
    activeIndices: [],
    activeCells: [],
    isComplete: false,
    supersequence: "",
    reconstructionPath: []
  };
};

// Generate steps for Shortest Common Supersequence visualization
const generateSCSSteps = (initialData) => {
  const steps = [];
  const { string1, string2 } = initialData;
  const m = string1.length;
  const n = string2.length;
  
  // Create a deep copy of the DP table
  let dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Add initial step
  steps.push({
    data: {
      string1,
      string2,
      dp: JSON.parse(JSON.stringify(dp)),
      currentIndex1: 0,
      currentIndex2: 0,
      activeIndices: [],
      activeCells: [],
      isComplete: false,
      supersequence: "",
      reconstructionPath: []
    },
    description: "Initialize DP table for Shortest Common Supersequence calculation.",
    codeHighlight: "dp[0...m][0...n] = 0",
    complexityInfo: "Time Complexity: O(m×n) where m and n are lengths of the input strings"
  });
  
  // Fill the first row: SCS of empty string and string2[0...j-1]
  for (let j = 1; j <= n; j++) {
    dp[0][j] = j;
    
    steps.push({
      data: {
        string1,
        string2,
        dp: JSON.parse(JSON.stringify(dp)),
        currentIndex1: 0,
        currentIndex2: j - 1,
        activeIndices: [],
        activeCells: [[0, j]],
        isComplete: false,
        supersequence: "",
        reconstructionPath: []
      },
      description: `Base case: The SCS of an empty string and "${string2.substring(0, j)}" has length ${j}.`,
      codeHighlight: "dp[0][j] = j; // Base case for empty string1",
      complexityInfo: "Initializing base cases"
    });
  }
  
  // Fill the first column: SCS of string1[0...i-1] and empty string
  for (let i = 1; i <= m; i++) {
    dp[i][0] = i;
    
    steps.push({
      data: {
        string1,
        string2,
        dp: JSON.parse(JSON.stringify(dp)),
        currentIndex1: i - 1,
        currentIndex2: 0,
        activeIndices: [],
        activeCells: [[i, 0]],
        isComplete: false,
        supersequence: "",
        reconstructionPath: []
      },
      description: `Base case: The SCS of "${string1.substring(0, i)}" and an empty string has length ${i}.`,
      codeHighlight: "dp[i][0] = i; // Base case for empty string2",
      complexityInfo: "Initializing base cases"
    });
  }
  
  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Highlight current characters being compared
      steps.push({
        data: {
          string1,
          string2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentIndex1: i - 1,
          currentIndex2: j - 1,
          activeIndices: [[0, i - 1], [1, j - 1]],
          activeCells: [],
          isComplete: false,
          supersequence: "",
          reconstructionPath: []
        },
        description: `Comparing characters: ${string1[i-1]} and ${string2[j-1]}`,
        codeHighlight: "// Compare characters string1[i-1] and string2[j-1]",
        complexityInfo: `Processing characters at positions ${i-1} and ${j-1}`
      });
      
      // If current characters match
      if (string1[i - 1] === string2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        
        steps.push({
          data: {
            string1,
            string2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentIndex1: i - 1,
            currentIndex2: j - 1,
            activeIndices: [[0, i - 1], [1, j - 1]],
            activeCells: [[i, j], [i - 1, j - 1]],
            isComplete: false,
            supersequence: "",
            reconstructionPath: []
          },
          description: `Characters match (${string1[i-1]}), so we take diagonal value plus 1: dp[${i}][${j}] = 1 + dp[${i-1}][${j-1}] = ${dp[i][j]}`,
          codeHighlight: "if (string1[i-1] === string2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];",
          complexityInfo: "Characters match, only need to include once in SCS"
        });
      } 
      // If characters don't match
      else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1]);
        const chosenCell = dp[i - 1][j] <= dp[i][j - 1] ? [i - 1, j] : [i, j - 1];
        
        steps.push({
          data: {
            string1,
            string2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentIndex1: i - 1,
            currentIndex2: j - 1,
            activeIndices: [[0, i - 1], [1, j - 1]],
            activeCells: [[i, j], [i - 1, j], [i, j - 1], chosenCell],
            isComplete: false,
            supersequence: "",
            reconstructionPath: []
          },
          description: `Characters don't match, so we take minimum of top and left values plus 1: dp[${i}][${j}] = 1 + min(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}`,
          codeHighlight: "else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1]);",
          complexityInfo: "Characters don't match, need to include both in SCS"
        });
      }
    }
  }
  
  // Reconstruct the shortest common supersequence
  let i = m, j = n;
  let scs = "";
  let reconstructionPath = [];
  
  // Add step for starting reconstruction
  steps.push({
    data: {
      string1,
      string2,
      dp: JSON.parse(JSON.stringify(dp)),
      currentIndex1: -1,
      currentIndex2: -1,
      activeIndices: [],
      activeCells: [[m, n]],
      isComplete: false,
      supersequence: scs,
      reconstructionPath: [...reconstructionPath]
    },
    description: "SCS calculation complete. Starting to reconstruct the actual sequence from the bottom-right of the DP table.",
    codeHighlight: "// Start from the bottom-right of the DP table",
    complexityInfo: "Reconstruction phase"
  });
  
  // Trace back from bottom right
  while (i > 0 && j > 0) {
    // If current characters match
    if (string1[i - 1] === string2[j - 1]) {
      scs = string1[i - 1] + scs;
      reconstructionPath.unshift([i, j, "diagonal"]);
      
      steps.push({
        data: {
          string1,
          string2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentIndex1: i - 1,
          currentIndex2: j - 1,
          activeIndices: [[0, i - 1], [1, j - 1]],
          activeCells: [[i, j]],
          isComplete: false,
          supersequence: scs,
          reconstructionPath: [...reconstructionPath]
        },
        description: `Characters match (${string1[i-1]}), so add it once to the supersequence and move diagonally.`,
        codeHighlight: "if (string1[i-1] === string2[j-1]) { scs = string1[i-1] + scs; i--; j--; }",
        complexityInfo: `Current SCS: "${scs}"`
      });
      
      i--; j--;
    }
    // If taking from top cell is better
    else if (dp[i - 1][j] <= dp[i][j - 1]) {
      scs = string1[i - 1] + scs;
      reconstructionPath.unshift([i, j, "up"]);
      
      steps.push({
        data: {
          string1,
          string2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentIndex1: i - 1,
          currentIndex2: j - 1,
          activeIndices: [[0, i - 1]],
          activeCells: [[i, j], [i - 1, j]],
          isComplete: false,
          supersequence: scs,
          reconstructionPath: [...reconstructionPath]
        },
        description: `Take character from string1 (${string1[i-1]}) and move up.`,
        codeHighlight: "else if (dp[i-1][j] <= dp[i][j-1]) { scs = string1[i-1] + scs; i--; }",
        complexityInfo: `Current SCS: "${scs}"`
      });
      
      i--;
    }
    // If taking from left cell is better
    else {
      scs = string2[j - 1] + scs;
      reconstructionPath.unshift([i, j, "left"]);
      
      steps.push({
        data: {
          string1,
          string2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentIndex1: i - 1,
          currentIndex2: j - 1,
          activeIndices: [[1, j - 1]],
          activeCells: [[i, j], [i, j - 1]],
          isComplete: false,
          supersequence: scs,
          reconstructionPath: [...reconstructionPath]
        },
        description: `Take character from string2 (${string2[j-1]}) and move left.`,
        codeHighlight: "else { scs = string2[j-1] + scs; j--; }",
        complexityInfo: `Current SCS: "${scs}"`
      });
      
      j--;
    }
  }
  
  // If string1 is not completely processed
  while (i > 0) {
    scs = string1[i - 1] + scs;
    reconstructionPath.unshift([i, j, "up"]);
    
    steps.push({
      data: {
        string1,
        string2,
        dp: JSON.parse(JSON.stringify(dp)),
        currentIndex1: i - 1,
        currentIndex2: -1,
        activeIndices: [[0, i - 1]],
        activeCells: [[i, j]],
        isComplete: false,
        supersequence: scs,
        reconstructionPath: [...reconstructionPath]
      },
      description: `Add remaining character from string1 (${string1[i-1]}).`,
      codeHighlight: "while (i > 0) { scs = string1[i-1] + scs; i--; }",
      complexityInfo: `Current SCS: "${scs}"`
    });
    
    i--;
  }
  
  // If string2 is not completely processed
  while (j > 0) {
    scs = string2[j - 1] + scs;
    reconstructionPath.unshift([i, j, "left"]);
    
    steps.push({
      data: {
        string1,
        string2,
        dp: JSON.parse(JSON.stringify(dp)),
        currentIndex1: -1,
        currentIndex2: j - 1,
        activeIndices: [[1, j - 1]],
        activeCells: [[i, j]],
        isComplete: false,
        supersequence: scs,
        reconstructionPath: [...reconstructionPath]
      },
      description: `Add remaining character from string2 (${string2[j-1]}).`,
      codeHighlight: "while (j > 0) { scs = string2[j-1] + scs; j--; }",
      complexityInfo: `Current SCS: "${scs}"`
    });
    
    j--;
  }
  
  // Final step
  steps.push({
    data: {
      string1,
      string2,
      dp: JSON.parse(JSON.stringify(dp)),
      currentIndex1: -1,
      currentIndex2: -1,
      activeIndices: [],
      activeCells: [],
      isComplete: true,
      supersequence: scs,
      reconstructionPath: [...reconstructionPath]
    },
    description: `Shortest Common Supersequence found: "${scs}" with length ${scs.length}`,
    codeHighlight: "// Return the reconstructed SCS",
    complexityInfo: `Final SCS length: ${scs.length}, SCS: "${scs}"`
  });
  
  return steps;
};

// Component to visualize the strings
const StringsVisualization = ({ data }) => {
  const { string1, string2, currentIndex1, currentIndex2, activeIndices = [] } = data || {};
  
  if (!string1 || !string2) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Input Strings:</h3>
      
      {/* String 1 */}
      <div className="mb-4">
        <div className="text-sm text-gray-700 font-medium mb-1">String 1:</div>
        <div className="flex">
          {string1.split('').map((char, index) => (
            <motion.div 
              key={`s1-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`w-9 h-9 flex items-center justify-center font-mono text-lg rounded-md border-2 mx-0.5
                ${index === currentIndex1 ? 'bg-green-100 border-green-500' : 
                  activeIndices.some(([strIdx, idx]) => strIdx === 0 && idx === index) ? 'bg-yellow-100 border-yellow-500' : 
                  'bg-blue-50 border-blue-300'}`}
            >
              {char}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* String 2 */}
      <div>
        <div className="text-sm text-gray-700 font-medium mb-1">String 2:</div>
        <div className="flex">
          {string2.split('').map((char, index) => (
            <motion.div 
              key={`s2-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`w-9 h-9 flex items-center justify-center font-mono text-lg rounded-md border-2 mx-0.5
                ${index === currentIndex2 ? 'bg-green-100 border-green-500' : 
                  activeIndices.some(([strIdx, idx]) => strIdx === 1 && idx === index) ? 'bg-yellow-100 border-yellow-500' : 
                  'bg-blue-50 border-blue-300'}`}
            >
              {char}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component to visualize the DP table
const DPTableVisualization = ({ data }) => {
  const { string1, string2, dp, activeCells = [], reconstructionPath = [] } = data || {};
  
  if (!dp || dp.length === 0) return null;
  
  // Create mapping for reconstructionPath for styling
  const pathMap = {};
  reconstructionPath.forEach(([i, j, direction]) => {
    pathMap[`${i},${j}`] = direction;
  });
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">DP Table (SCS Length):</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-2 py-1 bg-gray-50"></th>
              <th className="border border-gray-200 px-2 py-1 bg-gray-50">&epsilon;</th>
              {string2.split('').map((char, j) => (
                <th key={j} className="border border-gray-200 px-3 py-1 bg-gray-50">{char}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-2 py-1 bg-gray-50 font-medium">&epsilon;</td>
              {dp[0].map((value, j) => (
                <td 
                  key={j} 
                  className={`border border-gray-200 px-3 py-1 text-center
                    ${activeCells.some(([a, b]) => a === 0 && b === j) ? 'bg-yellow-100' : 'bg-blue-50'}`}
                >
                  {value}
                </td>
              ))}
            </tr>
            {string1.split('').map((char, i) => (
              <tr key={i}>
                <td className="border border-gray-200 px-2 py-1 bg-gray-50 font-medium">{char}</td>
                {dp[i + 1] && dp[i + 1].map((value, j) => {
                  const cellKey = `${i+1},${j}`;
                  const direction = pathMap[cellKey];
                  let directionIndicator = '';
                  
                  if (direction === 'diagonal') {
                    directionIndicator = '↖';
                  } else if (direction === 'up') {
                    directionIndicator = '↑';
                  } else if (direction === 'left') {
                    directionIndicator = '←';
                  }
                  
                  return (
                    <td 
                      key={j} 
                      className={`border border-gray-200 px-3 py-1 text-center relative
                        ${activeCells.some(([a, b]) => a === i + 1 && b === j) ? 'bg-yellow-100' : 
                          direction ? 'bg-green-100' : 'bg-blue-50'}`}
                    >
                      {value}
                      {directionIndicator && (
                        <span className="absolute top-0 right-0 text-xs text-green-700">
                          {directionIndicator}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component to visualize the supersequence
const SupersequenceVisualization = ({ data }) => {
  const { supersequence = "", string1, string2, isComplete } = data || {};
  
  if (!supersequence) return null;
  
  // For the final solution, highlight which characters come from which string
  let s1Map = {};
  let s2Map = {};
  
  if (isComplete && string1 && string2) {
    // First, mark all characters in string1
    let s1Pos = 0;
    for (let i = 0; i < supersequence.length && s1Pos < string1.length; i++) {
      if (supersequence[i] === string1[s1Pos]) {
        s1Map[i] = true;
        s1Pos++;
      }
    }
    
    // Then, mark all characters in string2
    let s2Pos = 0;
    for (let i = 0; i < supersequence.length && s2Pos < string2.length; i++) {
      if (supersequence[i] === string2[s2Pos]) {
        s2Map[i] = true;
        s2Pos++;
      }
    }
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isComplete ? "Final Supersequence:" : "Current Supersequence:"}
      </h3>
      <div className="flex flex-wrap">
        {supersequence.split('').map((char, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`w-9 h-9 flex items-center justify-center font-mono text-lg rounded-md border-2 mx-0.5
              ${s1Map[index] && s2Map[index] ? 'bg-purple-100 border-purple-500' : 
                s1Map[index] ? 'bg-blue-100 border-blue-500' : 
                s2Map[index] ? 'bg-green-100 border-green-500' : 
                'bg-gray-100 border-gray-300'}`}
          >
            {char}
          </motion.div>
        ))}
      </div>
      
      {isComplete && (
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded mr-2"></div>
            <span className="text-sm">From String 1 only</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-500 rounded mr-2"></div>
            <span className="text-sm">From String 2 only</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 border border-purple-500 rounded mr-2"></div>
            <span className="text-sm">From both strings</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main visualization component
const SCSVisualizationComponent = ({ data, step, stepInfo }) => {
  if (!data) {
    return (
      <div className="w-full flex items-center justify-center p-6 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: No data available for visualization</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <StringsVisualization data={data} />
      <DPTableVisualization data={data} />
      <SupersequenceVisualization data={data} />
    </div>
  );
};

// Container component with animation controls
const ShortestCommonSupersequenceVisualization = () => {
  // Generate initial data for the SCS problem
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Shortest Common Supersequence (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateSCSSteps}
      VisualizationComponent={SCSVisualizationComponent}
      description="The Shortest Common Supersequence (SCS) problem finds the shortest string that has both input strings as subsequences. This is solved using dynamic programming by building a table that combines the two strings optimally, including common characters just once."
    />
  );
};

export default ShortestCommonSupersequenceVisualization; 