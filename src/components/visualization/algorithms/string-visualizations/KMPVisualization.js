import React from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Generate initial data for the visualization
const generateInitialData = () => {
  return {
    text: "ABABDABACDABABCABAB",
    pattern: "ABABCABAB",
    textIndex: 0,
    patternIndex: 0,
    lps: [], // Longest Prefix Suffix array
    lpsIndex: -1,
    currentlyComputingLPS: true,
    matches: [],
    comparisons: 0,
    highlightText: Array(20).fill(null),
    highlightPattern: Array(10).fill(null),
    highlightLPS: Array(10).fill(null),
    currentWindow: 0
  };
};

// Compute the LPS (Longest Prefix Suffix) array for the pattern
const computeLPS = (pattern) => {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  
  let len = 0;
  let i = 1;
  
  const steps = [];
  
  // Step 0: Initialize
  steps.push({
    title: "LPS Initialization",
    description: "Set lps[0] = 0 since a pattern of length 1 has no proper prefix that is also a suffix.",
    lps: [...lps],
    index: 0,
    comparedIndices: []
  });
  
  // Compute LPS for the rest of the pattern
  while (i < m) {
    const comparedIndices = [i, len];
    
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      steps.push({
        title: "LPS Match",
        description: `Characters match at indices ${i} and ${len-1}: '${pattern[i]}' = '${pattern[len-1]}'. Set lps[${i}] = ${len}.`,
        lps: [...lps],
        index: i,
        comparedIndices
      });
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
        steps.push({
          title: "LPS Mismatch, Using Previous Value",
          description: `Characters don't match. Fall back to previous LPS value: len = lps[${len-1}] = ${len}.`,
          lps: [...lps],
          index: i,
          comparedIndices
        });
      } else {
        lps[i] = 0;
        steps.push({
          title: "LPS Mismatch, Reset",
          description: `Characters don't match and len = 0. Set lps[${i}] = 0.`,
          lps: [...lps],
          index: i,
          comparedIndices: [i, len]
        });
        i++;
      }
    }
  }
  
  steps.push({
    title: "LPS Computation Complete",
    description: `The LPS array is now fully computed: [${lps.join(", ")}].`,
    lps: [...lps],
    index: -1,
    comparedIndices: []
  });
  
  return { lps, steps };
};

// Generate steps for the KMP algorithm visualization
const generateVisualizationSteps = (initialData) => {
  const { text, pattern } = initialData;
  const steps = [];
  const n = text.length;
  const m = pattern.length;
  let comparisons = 0;
  const matches = [];
  
  // Compute LPS array first
  const { lps, steps: lpsSteps } = computeLPS(pattern);
  
  // Add LPS computation steps to visualization
  for (const lpsStep of lpsSteps) {
    const highlightPattern = Array(m).fill(null);
    const highlightLPS = Array(m).fill(null);
    
    // Highlight compared positions in pattern for LPS calculation
    if (lpsStep.comparedIndices.length === 2) {
      const [i, len] = lpsStep.comparedIndices;
      if (len < m && i < m) {
        highlightPattern[i] = pattern[i] === pattern[len] ? "match" : "mismatch";
        if (len > 0) {
          highlightPattern[len-1] = pattern[i] === pattern[len-1] ? "match" : "mismatch";
        }
      }
    }
    
    // Highlight current LPS position
    if (lpsStep.index >= 0 && lpsStep.index < m) {
      highlightLPS[lpsStep.index] = "current";
    }
    
    steps.push({
      title: lpsStep.title,
      description: lpsStep.description,
      data: {
        ...initialData,
        textIndex: 0,
        patternIndex: lpsStep.index >= 0 ? lpsStep.index : 0,
        lps: lpsStep.lps,
        lpsIndex: lpsStep.index,
        currentlyComputingLPS: true,
        matches: [],
        comparisons: 0,
        highlightText: Array(n).fill(null),
        highlightPattern,
        highlightLPS,
        currentWindow: 0
      }
    });
  }
  
  // Now start the actual search using KMP
  steps.push({
    title: "Starting KMP Search",
    description: "Using the precomputed LPS array to efficiently search for the pattern in the text.",
    data: {
      ...initialData,
      lps,
      currentlyComputingLPS: false,
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null),
      highlightLPS: Array(m).fill(null)
    }
  });
  
  let i = 0; // index for text
  let j = 0; // index for pattern
  
  while (i < n) {
    comparisons++;
    
    // Highlight current windows and positions
    const highlightText = Array(n).fill(null);
    const highlightPattern = Array(m).fill(null);
    const highlightLPS = Array(m).fill(null);
    
    // Highlight window
    for (let k = i - j; k < i - j + m && k < n; k++) {
      if (k >= 0) highlightText[k] = "window";
    }
    
    // Highlight current comparison
    if (i < n && j < m) {
      highlightText[i] = text[i] === pattern[j] ? "match" : "mismatch";
      highlightPattern[j] = text[i] === pattern[j] ? "match" : "mismatch";
    }
    
    steps.push({
      title: "Character Comparison",
      description: `Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'`,
      data: {
        ...initialData,
        textIndex: i,
        patternIndex: j,
        lps,
        currentlyComputingLPS: false,
        matches: [...matches],
        comparisons,
        highlightText,
        highlightPattern,
        highlightLPS,
        currentWindow: i - j
      }
    });
    
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }
    
    if (j === m) {
      // Found a match
      matches.push(i - j);
      
      // Highlight the entire match
      const matchHighlightText = Array(n).fill(null);
      for (let k = i - j; k < i; k++) {
        matchHighlightText[k] = "match";
      }
      
      steps.push({
        title: "Pattern Found!",
        description: `Match found at position ${i - j} in the text.`,
        data: {
          ...initialData,
          textIndex: i,
          patternIndex: j,
          lps,
          currentlyComputingLPS: false,
          matches: [...matches],
          comparisons,
          highlightText: matchHighlightText,
          highlightPattern: Array(m).fill("match"),
          highlightLPS,
          currentWindow: i - j
        }
      });
      
      // Use LPS for next position in pattern
      j = lps[j - 1];
      
      // Highlight LPS value used
      if (j > 0) {
        highlightLPS[j - 1] = "current";
      }
      
      steps.push({
        title: "Shift Pattern Using LPS",
        description: `After finding a match, KMP shifts the pattern using lps[${j-1}] = ${j}.`,
        data: {
          ...initialData,
          textIndex: i,
          patternIndex: j,
          lps,
          currentlyComputingLPS: false,
          matches: [...matches],
          comparisons,
          highlightText: Array(n).fill(null),
          highlightPattern: Array(m).fill(null),
          highlightLPS,
          currentWindow: i - j
        }
      });
    } else if (i < n && text[i] !== pattern[j]) {
      // Mismatch
      if (j !== 0) {
        // Use LPS for efficient shifting
        const oldJ = j;
        j = lps[j - 1];
        
        // Highlight LPS value used
        const shiftHighlightLPS = Array(m).fill(null);
        if (oldJ > 0) {
          shiftHighlightLPS[oldJ - 1] = "current";
        }
        
        steps.push({
          title: "Mismatch - Shift Using LPS",
          description: `Mismatch found. KMP shifts the pattern using lps[${oldJ-1}] = ${j} to avoid redundant comparisons.`,
          data: {
            ...initialData,
            textIndex: i,
            patternIndex: j,
            lps,
            currentlyComputingLPS: false,
            matches: [...matches],
            comparisons,
            highlightText,
            highlightPattern: Array(m).fill(null),
            highlightLPS: shiftHighlightLPS,
            currentWindow: i - j
          }
        });
      } else {
        i++;
        
        steps.push({
          title: "Mismatch - Move Text Pointer",
          description: "Mismatch at the start of pattern. Moving to the next character in the text.",
          data: {
            ...initialData,
            textIndex: i,
            patternIndex: j,
            lps,
            currentlyComputingLPS: false,
            matches: [...matches],
            comparisons,
            highlightText,
            highlightPattern: Array(m).fill(null),
            highlightLPS: Array(m).fill(null),
            currentWindow: i - j
          }
        });
      }
    }
  }
  
  // Final step
  steps.push({
    title: "Search Complete",
    description: `Found ${matches.length} occurrences of the pattern. Made ${comparisons} character comparisons.`,
    data: {
      ...initialData,
      textIndex: n,
      patternIndex: 0,
      lps,
      currentlyComputingLPS: false,
      matches,
      comparisons,
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null),
      highlightLPS: Array(m).fill(null),
      currentWindow: 0
    }
  });
  
  return steps;
};

// The main visualization component
const KMPVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    text, 
    pattern, 
    textIndex, 
    patternIndex, 
    lps,
    lpsIndex,
    currentlyComputingLPS,
    highlightText, 
    highlightPattern,
    highlightLPS,
    currentWindow, 
    comparisons, 
    matches 
  } = data || {};
  
  // Render step information
  const renderStepInfo = () => {
    if (!stepInfo) return "No step information available";
    
    return (
      <div className="mb-4">
        <h4 className="font-medium mb-1">{stepInfo.title || `Step ${step + 1}`}</h4>
        <p className="text-gray-600">{stepInfo.description || "No description available"}</p>
      </div>
    );
  };
  
  // Render the visualization
  const renderVisualization = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">
            {currentlyComputingLPS ? "Computing LPS Array" : "KMP Pattern Searching"}
          </h3>
          <div className="flex flex-col space-y-6">
            {/* Only show text when we're done computing LPS */}
            {!currentlyComputingLPS && (
              <div>
                <div className="flex items-center mb-2">
                  <span className="font-medium mr-2">Text:</span>
                  <div className="flex">
                    {text && text.split('').map((char, index) => (
                      <motion.div
                        key={`text-${index}`}
                        className={`w-8 h-8 flex items-center justify-center border ${
                          highlightText && highlightText[index] === "match" ? "bg-green-200 border-green-500" :
                          highlightText && highlightText[index] === "mismatch" ? "bg-red-200 border-red-500" :
                          highlightText && highlightText[index] === "window" ? "bg-blue-100 border-blue-300" :
                          "bg-gray-50 border-gray-200"
                        } ${index === textIndex ? "ring-2 ring-blue-500" : ""}`}
                        initial={{ scale: 1 }}
                        animate={{ 
                          scale: index === textIndex ? 1.1 : 1,
                          backgroundColor: highlightText && highlightText[index] === "match" ? "#bbf7d0" :
                                          highlightText && highlightText[index] === "mismatch" ? "#fecaca" :
                                          highlightText && highlightText[index] === "window" ? "#dbeafe" : "#f9fafb"
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {char}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Index markers below text */}
                <div className="flex ml-14">
                  {text && text.split('').map((_, index) => (
                    <div key={`index-${index}`} className="w-8 text-xs text-center text-gray-500">
                      {index}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pattern display with character boxes */}
            <div>
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Pattern:</span>
                <div className="flex ml-0">
                  {/* Add spacing based on current window position */}
                  {!currentlyComputingLPS && currentWindow > 0 && (
                    <div style={{ width: `${currentWindow * 2}rem` }}></div>
                  )}
                  
                  {pattern && pattern.split('').map((char, index) => (
                    <motion.div
                      key={`pattern-${index}`}
                      className={`w-8 h-8 flex items-center justify-center border ${
                        highlightPattern && highlightPattern[index] === "match" ? "bg-green-200 border-green-500" :
                        highlightPattern && highlightPattern[index] === "mismatch" ? "bg-red-200 border-red-500" :
                        "bg-gray-50 border-gray-200"
                      } ${index === patternIndex ? "ring-2 ring-blue-500" : ""}`}
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: index === patternIndex ? 1.1 : 1,
                        backgroundColor: highlightPattern && highlightPattern[index] === "match" ? "#bbf7d0" :
                                        highlightPattern && highlightPattern[index] === "mismatch" ? "#fecaca" : "#f9fafb"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {char}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Index markers below pattern */}
              <div className="flex ml-14">
                {pattern && pattern.split('').map((_, index) => (
                  <div key={`pattern-index-${index}`} className="w-8 text-xs text-center text-gray-500">
                    {index}
                  </div>
                ))}
              </div>
            </div>
            
            {/* LPS Array display */}
            <div>
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">LPS Array:</span>
                <div className="flex">
                  {lps && lps.map((value, index) => (
                    <motion.div
                      key={`lps-${index}`}
                      className={`w-8 h-8 flex items-center justify-center border ${
                        highlightLPS && highlightLPS[index] === "current" ? "bg-purple-200 border-purple-500" :
                        "bg-gray-50 border-gray-200"
                      } ${index === lpsIndex ? "ring-2 ring-purple-500" : ""}`}
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: index === lpsIndex ? 1.1 : 1,
                        backgroundColor: highlightLPS && highlightLPS[index] === "current" ? "#e9d5ff" : "#f9fafb"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {value !== undefined ? value : "?"}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Index markers below LPS */}
              <div className="flex ml-14">
                {lps && lps.map((_, index) => (
                  <div key={`lps-index-${index}`} className="w-8 text-xs text-center text-gray-500">
                    {index}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics and results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Statistics</h4>
            <div className="text-sm">
              <p><span className="font-medium">Current Phase:</span> {currentlyComputingLPS ? "Computing LPS Array" : "Searching Pattern"}</p>
              <p><span className="font-medium">Comparisons:</span> {comparisons}</p>
              {!currentlyComputingLPS && (
                <p><span className="font-medium">Current Window:</span> Position {currentWindow}</p>
              )}
              <p><span className="font-medium">Text Length:</span> {text?.length || 0}</p>
              <p><span className="font-medium">Pattern Length:</span> {pattern?.length || 0}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Matches Found</h4>
            {matches && matches.length > 0 ? (
              <div className="text-sm">
                <ul className="list-disc list-inside">
                  {matches.map((pos, idx) => (
                    <li key={idx}>Position {pos} to {pos + pattern.length - 1}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No matches found yet.</p>
            )}
          </div>
        </div>
        
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {renderStepInfo()}
      {renderVisualization()}
    </div>
  );
};

const KMPVisualization = () => {
  return (
    <VisualizationContainer
      algorithmName="KMP Algorithm"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={KMPVisualizationComponent}
      description="The Knuth-Morris-Pratt (KMP) algorithm is an efficient string searching algorithm that uses preprocessed information about the pattern to avoid redundant comparisons."
    />
  );
};

export default KMPVisualization; 