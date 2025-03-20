import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for the LCS problem
const generateInitialData = () => {
  // Sample sequences for LCS
  const sequence1 = "ABCBDAB";
  const sequence2 = "BDCABA";
  
  // Create a DP table initialized with zeros
  // dp[i][j] will hold the length of LCS of sequence1[0...i-1] and sequence2[0...j-1]
  const m = sequence1.length;
  const n = sequence2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  return {
    sequence1,
    sequence2,
    dp,
    currentI: 0,
    currentJ: 0,
    lcs: "", // Will store the actual subsequence
    isComplete: false,
    activeIndices: {
      seq1: [],
      seq2: []
    }
  };
};

// Generate steps for LCS problem visualization
const generateLCSSteps = (initialData) => {
  const steps = [];
  const { sequence1, sequence2 } = initialData;
  
  // Clone the initial data to avoid mutating it
  const m = sequence1.length;
  const n = sequence2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Add step for initialization
  steps.push({
    data: {
      sequence1,
      sequence2,
      dp: JSON.parse(JSON.stringify(dp)),
      currentI: 0,
      currentJ: 0,
      lcs: "",
      isComplete: false,
      activeIndices: {
        seq1: [],
        seq2: []
      }
    },
    description: "Initialize the DP table. dp[i][j] will store the length of the Longest Common Subsequence between sequence1[0...i-1] and sequence2[0...j-1].",
    codeHighlight: "create table dp[0...m][0...n] initialized to 0",
    complexityInfo: "Space complexity: O(m*n) where m and n are the lengths of the sequences"
  });
  
  // Build the DP table
  // Base case: First row and first column are already 0
  
  // Fill the dp table using bottom-up approach
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // If the current characters match
      if (sequence1[i - 1] === sequence2[j - 1]) {
        // Add step for showing the match
        steps.push({
          data: {
            sequence1,
            sequence2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            lcs: "",
            isComplete: false,
            activeIndices: {
              seq1: [i - 1],
              seq2: [j - 1]
            },
            matched: true
          },
          description: `Characters match: ${sequence1[i - 1]} at position ${i} in sequence1 and position ${j} in sequence2.`,
          codeHighlight: "if sequence1[i-1] = sequence2[j-1] then",
          complexityInfo: `Found matching characters at positions ${i-1} in sequence1 and ${j-1} in sequence2`
        });
        
        // Update the DP table
        dp[i][j] = dp[i - 1][j - 1] + 1;
        
        // Add step for updating the DP table
        steps.push({
          data: {
            sequence1,
            sequence2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            lcs: "",
            isComplete: false,
            activeIndices: {
              seq1: [i - 1],
              seq2: [j - 1]
            },
            updateCell: true
          },
          description: `Add 1 to the diagonal value: dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}.`,
          codeHighlight: "dp[i][j] := dp[i-1][j-1] + 1",
          complexityInfo: `Updated dp[${i}][${j}] to ${dp[i][j]}`
        });
      } else {
        // If the characters don't match
        // Add step for showing the mismatch
        steps.push({
          data: {
            sequence1,
            sequence2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            lcs: "",
            isComplete: false,
            activeIndices: {
              seq1: [i - 1],
              seq2: [j - 1]
            },
            mismatched: true
          },
          description: `Characters don't match: ${sequence1[i - 1]} at position ${i} in sequence1 and ${sequence2[j - 1]} at position ${j} in sequence2.`,
          codeHighlight: "else",
          complexityInfo: `Comparing characters at positions ${i-1} in sequence1 and ${j-1} in sequence2`
        });
        
        // Take the maximum of the left and upper cells
        const maxValue = Math.max(dp[i - 1][j], dp[i][j - 1]);
        
        // Add step for comparing the upper and left cells
        steps.push({
          data: {
            sequence1,
            sequence2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            lcs: "",
            isComplete: false,
            activeIndices: {
              seq1: [],
              seq2: []
            },
            comparingCells: true,
            upperCell: dp[i - 1][j],
            leftCell: dp[i][j - 1]
          },
          description: `Take the maximum of the upper cell (${dp[i - 1][j]}) and the left cell (${dp[i][j - 1]}).`,
          codeHighlight: "dp[i][j] := max(dp[i-1][j], dp[i][j-1])",
          complexityInfo: `Choosing the maximum value: ${maxValue}`
        });
        
        // Update the DP table
        dp[i][j] = maxValue;
        
        // Add step for updating the DP table
        steps.push({
          data: {
            sequence1,
            sequence2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            lcs: "",
            isComplete: false,
            activeIndices: {
              seq1: [],
              seq2: []
            },
            updateCell: true
          },
          description: `Updated dp[${i}][${j}] = ${dp[i][j]}.`,
          codeHighlight: "dp[i][j] := max(dp[i-1][j], dp[i][j-1])",
          complexityInfo: `Updated dp[${i}][${j}] to ${dp[i][j]}`
        });
      }
    }
  }
  
  // Find the LCS from the DP table
  let i = m, j = n;
  let lcs = "";
  const lcsIndices = [];
  
  while (i > 0 && j > 0) {
    // If the current characters match
    if (sequence1[i - 1] === sequence2[j - 1]) {
      // Add the character to the LCS
      lcs = sequence1[i - 1] + lcs;
      lcsIndices.push({ i: i - 1, j: j - 1 });
      i--;
      j--;
      
      // Add step for adding character to LCS
      steps.push({
        data: {
          sequence1,
          sequence2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          lcs,
          isComplete: false,
          activeIndices: {
            seq1: [i],
            seq2: [j]
          },
          addingToLCS: true
        },
        description: `Characters match: Add '${sequence1[i]}' to the LCS. Current LCS: '${lcs}'.`,
        codeHighlight: "if sequence1[i-1] = sequence2[j-1] then add sequence1[i-1] to LCS",
        complexityInfo: `Added character '${sequence1[i]}' to LCS`
      });
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      // Move up in the table
      i--;
      
      // Add step for moving up
      steps.push({
        data: {
          sequence1,
          sequence2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          lcs,
          isComplete: false,
          activeIndices: {
            seq1: [i],
            seq2: []
          },
          movingUp: true
        },
        description: `Moving up in the table to dp[${i}][${j}].`,
        codeHighlight: "if dp[i-1][j] > dp[i][j-1] then i := i - 1",
        complexityInfo: `Moving to the cell above`
      });
    } else {
      // Move left in the table
      j--;
      
      // Add step for moving left
      steps.push({
        data: {
          sequence1,
          sequence2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          lcs,
          isComplete: false,
          activeIndices: {
            seq1: [],
            seq2: [j]
          },
          movingLeft: true
        },
        description: `Moving left in the table to dp[${i}][${j}].`,
        codeHighlight: "else j := j - 1",
        complexityInfo: `Moving to the cell to the left`
      });
    }
  }
  
  // Add final step
  steps.push({
    data: {
      sequence1,
      sequence2,
      dp: JSON.parse(JSON.stringify(dp)),
      currentI: 0,
      currentJ: 0,
      lcs,
      isComplete: true,
      activeIndices: {
        seq1: lcsIndices.map(index => index.i),
        seq2: lcsIndices.map(index => index.j)
      }
    },
    description: `LCS problem solved! The Longest Common Subsequence is '${lcs}' with length ${lcs.length}.`,
    codeHighlight: "return LCS",
    complexityInfo: `Final solution achieved in O(m*n) time and O(m*n) space`
  });
  
  return steps;
};

// Component to visualize the LCS table
const LCSTableVisualization = ({ data }) => {
  const { dp, currentI, currentJ, sequence1, sequence2 } = data;
  
  return (
    <div className="overflow-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-2">DP Table (LCS Lengths):</h3>
      <div className="relative overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300"></th>
              <th className="p-2 border border-gray-300">_</th>
              {sequence2.split('').map((char, idx) => (
                <th 
                  key={idx} 
                  className={`p-2 border border-gray-300 text-center 
                    ${data.activeIndices.seq2.includes(idx) ? 'bg-yellow-100' : ''}`}
                >
                  {char}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="p-2 border border-gray-300">_</td>
              {dp[0].map((cell, j) => (
                <td 
                  key={j} 
                  className={`p-2 border border-gray-300 text-center 
                    ${(currentI === 0 && currentJ === j) ? 'bg-blue-200 font-bold' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
            {sequence1.split('').map((char, i) => (
              <tr 
                key={i} 
                className={`${data.activeIndices.seq1.includes(i) ? 'bg-green-50' : 'bg-white'}`}
              >
                <td 
                  className={`p-2 border border-gray-300 font-medium 
                    ${data.activeIndices.seq1.includes(i) ? 'bg-yellow-100' : ''}`}
                >
                  {char}
                </td>
                {dp[i + 1] && dp[i + 1].map((cell, j) => (
                  <td 
                    key={j} 
                    className={`p-2 border border-gray-300 text-center 
                      ${(currentI === i + 1 && currentJ === j) ? 'bg-blue-200 font-bold' : 
                        (data.activeIndices.seq1.includes(i) && data.activeIndices.seq2.includes(j - 1)) ? 'bg-green-200' : ''}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component to visualize the sequences and the LCS
const SequenceVisualization = ({ data }) => {
  const { sequence1, sequence2, lcs, isComplete } = data;
  
  // Highlight the characters that are part of the LCS
  const seq1Highlight = Array(sequence1.length).fill(false);
  const seq2Highlight = Array(sequence2.length).fill(false);
  
  if (isComplete && lcs) {
    // Find the positions of LCS characters in the original sequences
    let lcsIndex = 0;
    for (let i = 0; i < sequence1.length && lcsIndex < lcs.length; i++) {
      if (sequence1[i] === lcs[lcsIndex]) {
        seq1Highlight[i] = true;
        lcsIndex++;
      }
    }
    
    lcsIndex = 0;
    for (let i = 0; i < sequence2.length && lcsIndex < lcs.length; i++) {
      if (sequence2[i] === lcs[lcsIndex]) {
        seq2Highlight[i] = true;
        lcsIndex++;
      }
    }
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Sequences and LCS:</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Sequence 1:</h4>
          <div className="flex">
            {sequence1.split('').map((char, index) => (
              <motion.div
                key={index}
                className={`w-8 h-8 flex items-center justify-center text-lg font-mono 
                  ${data.activeIndices.seq1.includes(index) ? 'bg-yellow-100' : 
                    seq1Highlight[index] ? 'bg-green-100' : 'bg-gray-50'} 
                  border border-gray-300 m-1`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Sequence 2:</h4>
          <div className="flex">
            {sequence2.split('').map((char, index) => (
              <motion.div
                key={index}
                className={`w-8 h-8 flex items-center justify-center text-lg font-mono 
                  ${data.activeIndices.seq2.includes(index) ? 'bg-yellow-100' : 
                    seq2Highlight[index] ? 'bg-green-100' : 'bg-gray-50'} 
                  border border-gray-300 m-1`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
        
        {data.lcs.length > 0 && (
          <motion.div 
            className="border rounded-lg p-4 bg-blue-50 border-blue-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h4 className="font-medium text-gray-700 mb-2">Longest Common Subsequence:</h4>
            <div className="flex">
              {data.lcs.split('').map((char, index) => (
                <motion.div
                  key={index}
                  className="w-8 h-8 flex items-center justify-center text-lg font-mono bg-green-100 border border-green-300 m-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Main visualization component for LCS Problem
const LCSVisualizationComponent = ({ data, step, stepInfo }) => {
  return (
    <div className="w-full">
      <LCSTableVisualization data={data} />
      <SequenceVisualization data={data} />
    </div>
  );
};

// Container component with animation controls
const LCSVisualization = () => {
  // Generate initial data for the LCS problem
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Longest Common Subsequence (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateLCSSteps}
      VisualizationComponent={LCSVisualizationComponent}
      description="The Longest Common Subsequence (LCS) problem finds the longest subsequence that is present in both given sequences. A subsequence is a sequence that appears in the same relative order but not necessarily contiguous. This is a classic example of dynamic programming."
    />
  );
};

export default LCSVisualization; 