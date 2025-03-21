import React from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Generate initial data for the visualization
const generateInitialData = () => {
  return {
    text: "ABABDABACDABABCABAB",
    pattern: "ABABC",
    combinedString: "", // Pattern + $ + Text
    zArray: [],
    textIndex: 0,
    patternIndex: 0,
    matches: [],
    comparisons: 0,
    highlightText: Array(20).fill(null),
    highlightPattern: Array(5).fill(null),
    highlightZ: Array(26).fill(null),
    currentWindow: 0,
    calculatingZ: true, // Flag to indicate Z-array calculation phase
    l: 0, // Left boundary of Z-box
    r: 0, // Right boundary of Z-box
    currentZCalculation: null, // Details about current Z calculation
    phase: "Preprocessing" // "Preprocessing" or "Matching"
  };
};

// Calculate Z array for a string
const calculateZArray = (str) => {
  const n = str.length;
  const z = Array(n).fill(0);
  let l = 0, r = 0;
  
  // For the first element, Z value is 0 (no prefix)
  z[0] = 0;
  
  const steps = [];
  
  // Step 0: Initialize
  steps.push({
    title: "Z Array Initialization",
    description: "Initialize Z[0] = 0 as the first character cannot match a proper prefix.",
    z: [...z],
    l,
    r,
    index: 0,
    highlightZ: Array(n).fill(null),
    highlightString: Array(n).fill(null)
  });
  
  // Calculate Z value for each position
  for (let i = 1; i < n; i++) {
    const highlightZ = Array(n).fill(null);
    const highlightString = Array(n).fill(null);
    
    if (i > r) {
      // Case 1: i is outside the Z-box, calculate Z[i] naively
      l = i;
      r = i;
      
      // Explicit comparison
      while (r < n && str[r - l] === str[r]) {
        r++;
      }
      
      z[i] = r - l;
      r = r - 1;
      
      // Highlight the current position and its Z-value
      highlightZ[i] = "current";
      
      // Highlight the substring that was compared
      for (let j = l; j <= r; j++) {
        highlightString[j] = "window";
      }
      
      // Mark matched characters
      for (let j = 0; j < z[i]; j++) {
        highlightString[j] = "match";
        highlightString[i + j] = "match";
      }
      
      steps.push({
        title: "Z Value Calculation (Naive)",
        description: `For position ${i}, we're outside the Z-box. Computing Z[${i}] by comparing characters.`,
        z: [...z],
        l,
        r,
        index: i,
        highlightZ,
        highlightString
      });
    } else {
      // Case 2: i is inside the Z-box, use previously computed values
      const k = i - l; // Corresponding position in prefix
      
      // If Z[k] is less than remaining Z-box size
      if (z[k] < r - i + 1) {
        z[i] = z[k]; // We can directly use the value
        
        // Highlight the current position and its Z-value
        highlightZ[i] = "current";
        highlightZ[k] = "reference";
        
        // Highlight the relationship
        highlightString[i] = "current";
        highlightString[k] = "reference";
        
        steps.push({
          title: "Z Value Calculation (Optimized)",
          description: `For position ${i}, we're inside the Z-box. Z[${i}] = Z[${k}] = ${z[k]} since Z[${k}] < remaining Z-box size (${r - i + 1}).`,
          z: [...z],
          l,
          r,
          index: i,
          highlightZ,
          highlightString
        });
      } else {
        // We need to extend the Z-box
        l = i;
        let matched = r - i + 1; // Characters already matched
        
        // Continue matching from r+1
        while (r + 1 < n && str[r + 1] === str[r + 1 - l]) {
          r++;
          matched++;
        }
        
        z[i] = matched;
        
        // Highlight the current position and its Z-value
        highlightZ[i] = "current";
        highlightZ[k] = "reference";
        
        // Highlight the existing matched part
        for (let j = i; j <= r - (matched - z[k]); j++) {
          highlightString[j] = "window";
        }
        
        // Highlight the newly matched part
        for (let j = r - (matched - z[k]) + 1; j <= r; j++) {
          highlightString[j] = "extend";
        }
        
        // Mark all matched characters
        for (let j = 0; j < z[i]; j++) {
          highlightString[j] = "match";
          highlightString[i + j] = "match";
        }
        
        steps.push({
          title: "Z Value Calculation (Extended)",
          description: `For position ${i}, we need to extend the Z-box. Z[${i}] = ${z[i]} after extending the match.`,
          z: [...z],
          l,
          r,
          index: i,
          highlightZ,
          highlightString
        });
      }
    }
  }
  
  // Final Z array
  const highlightZ = Array(n).fill(null);
  steps.push({
    title: "Z Array Computation Complete",
    description: `The Z array is now fully computed: [${z.join(", ")}].`,
    z: [...z],
    l,
    r,
    index: -1,
    highlightZ,
    highlightString: Array(n).fill(null)
  });
  
  return { z, steps };
};

// Generate steps for the Z algorithm visualization
const generateVisualizationSteps = (initialData) => {
  const { text, pattern } = initialData;
  const steps = [];
  const n = text.length;
  const m = pattern.length;
  let comparisons = 0;
  const matches = [];
  
  // Create the combined string: pattern + $ + text
  const combinedString = pattern + "$" + text;
  const totalLength = combinedString.length;
  
  // Initial step
  steps.push({
    title: "Initialization",
    description: `Creating combined string: ${pattern} + $ + ${text}`,
    data: {
      ...initialData,
      combinedString,
      phase: "Preprocessing",
      calculatingZ: true
    }
  });
  
  // Calculate Z array for the combined string
  const { z: zArray, steps: zSteps } = calculateZArray(combinedString);
  
  // Add Z array calculation steps to the visualization
  for (const zStep of zSteps) {
    const highlightText = Array(n).fill(null);
    const highlightPattern = Array(m).fill(null);
    const highlightZ = Array(totalLength).fill(null);
    
    // Map highlights from the combined string to pattern and text
    if (zStep.highlightString) {
      for (let i = 0; i < m; i++) {
        highlightPattern[i] = zStep.highlightString[i];
      }
      
      for (let i = 0; i < n; i++) {
        highlightText[i] = zStep.highlightString[m + 1 + i];
      }
    }
    
    if (zStep.highlightZ) {
      for (let i = 0; i < totalLength; i++) {
        highlightZ[i] = zStep.highlightZ[i];
      }
    }
    
    steps.push({
      title: zStep.title,
      description: zStep.description,
      data: {
        ...initialData,
        combinedString,
        zArray,
        textIndex: 0,
        patternIndex: zStep.index >= 0 ? zStep.index : 0,
        l: zStep.l,
        r: zStep.r,
        phase: "Preprocessing",
        calculatingZ: true,
        highlightText,
        highlightPattern,
        highlightZ,
        currentZCalculation: `Z[${zStep.index}] = ${zArray[zStep.index]}`
      }
    });
  }
  
  // Pattern matching phase
  steps.push({
    title: "Starting Pattern Matching",
    description: "Z array calculation complete. Now checking for pattern matches in text.",
    data: {
      ...initialData,
      combinedString,
      zArray,
      phase: "Matching",
      calculatingZ: false,
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null),
      highlightZ: Array(totalLength).fill(null)
    }
  });
  
  // Find matches using Z array
  for (let i = m + 1; i < totalLength; i++) {
    const textPosition = i - (m + 1);
    const highlightText = Array(n).fill(null);
    const highlightPattern = Array(m).fill(null);
    const highlightZ = Array(totalLength).fill(null);
    
    // Highlight current Z value
    highlightZ[i] = "current";
    
    // If Z value equals pattern length, we found a match
    if (zArray[i] === m) {
      matches.push(textPosition);
      
      // Highlight the match in text
      for (let j = 0; j < m; j++) {
        highlightText[textPosition + j] = "match";
        highlightPattern[j] = "match";
      }
      
      steps.push({
        title: "Pattern Match Found",
        description: `Found match at position ${textPosition} in the text. Z[${i}] = ${zArray[i]} equals pattern length ${m}.`,
        data: {
          ...initialData,
          combinedString,
          zArray,
          textIndex: textPosition,
          patternIndex: 0,
          matches: [...matches],
          comparisons,
          phase: "Matching",
          calculatingZ: false,
          highlightText,
          highlightPattern,
          highlightZ,
          currentWindow: textPosition
        }
      });
    } else {
      // Highlight the current window in text
      for (let j = 0; j < zArray[i]; j++) {
        highlightText[textPosition + j] = "window";
        highlightPattern[j] = "window";
      }
      
      // If there's a partial match, highlight it
      if (zArray[i] > 0) {
        steps.push({
          title: "Partial Match",
          description: `Partial match of length ${zArray[i]} at position ${textPosition} in the text.`,
          data: {
            ...initialData,
            combinedString,
            zArray,
            textIndex: textPosition,
            patternIndex: 0,
            matches: [...matches],
            comparisons,
            phase: "Matching",
            calculatingZ: false,
            highlightText,
            highlightPattern,
            highlightZ,
            currentWindow: textPosition
          }
        });
      } else {
        steps.push({
          title: "No Match",
          description: `No match at position ${textPosition} in the text. Z[${i}] = 0.`,
          data: {
            ...initialData,
            combinedString,
            zArray,
            textIndex: textPosition,
            patternIndex: 0,
            matches: [...matches],
            comparisons,
            phase: "Matching",
            calculatingZ: false,
            highlightText,
            highlightPattern,
            highlightZ,
            currentWindow: textPosition
          }
        });
      }
    }
    
    // Increment comparison count
    comparisons++;
  }
  
  // Final step
  steps.push({
    title: "Search Complete",
    description: `Found ${matches.length} occurrences of the pattern in the text.`,
    data: {
      ...initialData,
      combinedString,
      zArray,
      textIndex: n,
      patternIndex: 0,
      matches,
      comparisons,
      phase: "Complete",
      calculatingZ: false,
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null),
      highlightZ: Array(totalLength).fill(null),
      currentWindow: 0
    }
  });
  
  return steps;
};

// The main visualization component
const ZAlgorithmVisualizationComponent = ({ data, step, stepInfo }) => {
  const {
    text,
    pattern,
    combinedString,
    zArray,
    textIndex,
    patternIndex,
    l,
    r,
    highlightText,
    highlightPattern,
    highlightZ,
    calculatingZ,
    phase,
    currentWindow,
    matches,
    comparisons,
    currentZCalculation
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
            Z Algorithm - {phase} Phase
          </h3>
          
          <div className="flex flex-col space-y-6">
            {/* Display the combined string during Z array calculation */}
            {calculatingZ && (
              <div>
                <div className="flex items-center mb-2">
                  <span className="font-medium mr-2">Combined String:</span>
                  <div className="flex">
                    {combinedString && combinedString.split('').map((char, index) => {
                      let bgColor = "bg-gray-50";
                      let borderColor = "border-gray-200";
                      
                      if (index < pattern.length) {
                        // Pattern section
                        bgColor = "bg-yellow-50";
                        borderColor = "border-yellow-200";
                      } else if (index === pattern.length) {
                        // Separator
                        bgColor = "bg-red-50";
                        borderColor = "border-red-200";
                      } else {
                        // Text section
                        bgColor = "bg-blue-50";
                        borderColor = "border-blue-200";
                      }
                      
                      // Highlight based on the Z calculation state
                      if (highlightZ && highlightZ[index] === "current") {
                        bgColor = "bg-purple-200";
                        borderColor = "border-purple-500";
                      } else if (highlightZ && highlightZ[index] === "reference") {
                        bgColor = "bg-indigo-200";
                        borderColor = "border-indigo-500";
                      }
                      
                      return (
                        <motion.div
                          key={`combined-${index}`}
                          className={`w-8 h-8 flex items-center justify-center border ${bgColor} ${borderColor} ${index === l || index === r ? "ring-2 ring-purple-500" : ""}`}
                          initial={{ scale: 1 }}
                          animate={{ 
                            scale: (index === l || index === r) ? 1.1 : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {char}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Index markers below combined string */}
                <div className="flex ml-14">
                  {combinedString && combinedString.split('').map((_, index) => (
                    <div key={`combined-index-${index}`} className="w-8 text-xs text-center text-gray-500">
                      {index}
                    </div>
                  ))}
                </div>
                
                {/* Z Array display */}
                <div className="mt-4 flex items-center">
                  <span className="font-medium mr-2">Z Array:</span>
                  <div className="flex">
                    {zArray && zArray.map((value, index) => (
                      <motion.div
                        key={`z-${index}`}
                        className={`w-8 h-8 flex items-center justify-center border ${
                          highlightZ && highlightZ[index] === "current" ? "bg-purple-200 border-purple-500" :
                          highlightZ && highlightZ[index] === "reference" ? "bg-indigo-200 border-indigo-500" :
                          "bg-gray-50 border-gray-200"
                        }`}
                        initial={{ scale: 1 }}
                        animate={{ 
                          scale: highlightZ && highlightZ[index] ? 1.1 : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {value !== undefined ? value : "?"}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Index markers below Z array */}
                <div className="flex ml-14">
                  {zArray && zArray.map((_, index) => (
                    <div key={`z-index-${index}`} className="w-8 text-xs text-center text-gray-500">
                      {index}
                    </div>
                  ))}
                </div>
                
                {/* Z-box boundaries */}
                <div className="mt-4 bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-1">Z-box Boundaries</h4>
                  <div className="text-sm">
                    <p><span className="font-medium">Left (l):</span> {l}</p>
                    <p><span className="font-medium">Right (r):</span> {r}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Text display in pattern matching phase */}
            {!calculatingZ && (
              <div>
                <div className="flex items-center mb-2">
                  <span className="font-medium mr-2">Text:</span>
                  <div className="flex">
                    {text && text.split('').map((char, index) => (
                      <motion.div
                        key={`text-${index}`}
                        className={`w-8 h-8 flex items-center justify-center border ${
                          highlightText && highlightText[index] === "match" ? "bg-green-200 border-green-500" :
                          highlightText && highlightText[index] === "window" ? "bg-blue-100 border-blue-300" :
                          "bg-gray-50 border-gray-200"
                        } ${index === textIndex ? "ring-2 ring-blue-500" : ""}`}
                        initial={{ scale: 1 }}
                        animate={{ 
                          scale: index === textIndex ? 1.1 : 1,
                          backgroundColor: highlightText && highlightText[index] === "match" ? "#bbf7d0" :
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
                
                {/* Pattern display with character boxes */}
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <span className="font-medium mr-2">Pattern:</span>
                    <div className="flex ml-0">
                      {/* Add spacing based on current window position */}
                      {currentWindow > 0 && (
                        <div style={{ width: `${currentWindow * 2}rem` }}></div>
                      )}
                      
                      {pattern && pattern.split('').map((char, index) => (
                        <motion.div
                          key={`pattern-${index}`}
                          className={`w-8 h-8 flex items-center justify-center border ${
                            highlightPattern && highlightPattern[index] === "match" ? "bg-green-200 border-green-500" :
                            highlightPattern && highlightPattern[index] === "window" ? "bg-blue-100 border-blue-300" :
                            "bg-gray-50 border-gray-200"
                          } ${index === patternIndex ? "ring-2 ring-blue-500" : ""}`}
                          initial={{ scale: 1 }}
                          animate={{ 
                            scale: index === patternIndex ? 1.1 : 1,
                            backgroundColor: highlightPattern && highlightPattern[index] === "match" ? "#bbf7d0" :
                                            highlightPattern && highlightPattern[index] === "window" ? "#dbeafe" : "#f9fafb"
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {char}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Z array reference */}
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <span className="font-medium mr-2">Z Array:</span>
                    <div className="flex">
                      {zArray && zArray.map((value, index) => (
                        <motion.div
                          key={`z-${index}`}
                          className={`w-8 h-8 flex items-center justify-center border ${
                            highlightZ && highlightZ[index] === "current" ? "bg-purple-200 border-purple-500" :
                            "bg-gray-50 border-gray-200"
                          }`}
                          initial={{ scale: 1 }}
                          animate={{ 
                            scale: highlightZ && highlightZ[index] === "current" ? 1.1 : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {value}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Index markers below Z array */}
                  <div className="flex ml-14">
                    {zArray && zArray.map((_, index) => (
                      <div key={`z-index-${index}`} className="w-8 text-xs text-center text-gray-500">
                        {index}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Z Calculation Info */}
            {currentZCalculation && (
              <div className="bg-blue-50 p-3 rounded-lg mt-2">
                <h4 className="font-medium mb-1">Z Calculation</h4>
                <div className="font-mono text-sm text-blue-800">{currentZCalculation}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Statistics and results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Statistics</h4>
            <div className="text-sm">
              <p><span className="font-medium">Current Phase:</span> {phase}</p>
              {!calculatingZ && (
                <>
                  <p><span className="font-medium">Comparisons:</span> {comparisons}</p>
                  <p><span className="font-medium">Current Position:</span> {textIndex}</p>
                </>
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

const ZAlgorithmVisualization = () => {
  return (
    <VisualizationContainer
      algorithmName="Z Algorithm"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={ZAlgorithmVisualizationComponent}
      description="The Z Algorithm is a linear-time string matching algorithm that uses a Z array to efficiently find all occurrences of a pattern in a text without backtracking."
    />
  );
};

export default ZAlgorithmVisualization; 