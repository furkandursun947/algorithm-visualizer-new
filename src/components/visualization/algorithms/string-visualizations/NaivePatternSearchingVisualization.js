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
    matches: [],
    comparisons: 0,
    highlightText: Array(20).fill(null),
    highlightPattern: Array(10).fill(null),
    currentWindow: 0
  };
};

// Generate steps for the Naive Pattern Searching visualization
const generateVisualizationSteps = (initialData) => {
  const { text, pattern } = initialData;
  const steps = [];
  const n = text.length;
  const m = pattern.length;
  let comparisons = 0;
  const matches = [];
  
  steps.push({
    title: "Initialization",
    description: "Starting with the pattern at the beginning of the text.",
    data: {
      ...initialData,
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null),
      currentWindow: 0,
      comparisons: 0,
      matches: []
    }
  });
  
  // Loop through the text
  for (let i = 0; i <= n - m; i++) {
    let windowMatch = true;
    
    // Highlight the current window
    const highlightText = Array(n).fill(null);
    for (let k = i; k < i + m && k < n; k++) {
      highlightText[k] = "window";
    }
    
    steps.push({
      title: `Window Position ${i+1}`,
      description: `Checking pattern starting at position ${i} in the text.`,
      data: {
        ...initialData,
        textIndex: i,
        patternIndex: 0,
        highlightText,
        highlightPattern: Array(m).fill(null),
        currentWindow: i,
        comparisons,
        matches: [...matches]
      }
    });
    
    // Check for pattern match character by character
    for (let j = 0; j < m; j++) {
      comparisons++;
      
      // Create highlight arrays for this comparison
      const highlightTextCurrent = Array(n).fill(null);
      const highlightPatternCurrent = Array(m).fill(null);
      
      // Highlight the window in text
      for (let k = i; k < i + m && k < n; k++) {
        highlightTextCurrent[k] = "window";
      }
      
      // Highlight the current characters being compared
      highlightTextCurrent[i + j] = text[i + j] === pattern[j] ? "match" : "mismatch";
      highlightPatternCurrent[j] = text[i + j] === pattern[j] ? "match" : "mismatch";
      
      steps.push({
        title: `Character Comparison`,
        description: `Comparing text[${i + j}]='${text[i + j]}' with pattern[${j}]='${pattern[j]}'`,
        data: {
          ...initialData,
          textIndex: i + j,
          patternIndex: j,
          highlightText: highlightTextCurrent,
          highlightPattern: highlightPatternCurrent,
          currentWindow: i,
          comparisons,
          matches: [...matches]
        }
      });
      
      // If there's a mismatch, stop checking this window
      if (text[i + j] !== pattern[j]) {
        windowMatch = false;
        
        steps.push({
          title: `Mismatch Found`,
          description: `Mismatch at position ${j} of pattern. Moving window to the next position.`,
          data: {
            ...initialData,
            textIndex: i + j,
            patternIndex: j,
            highlightText: highlightTextCurrent,
            highlightPattern: highlightPatternCurrent,
            currentWindow: i,
            comparisons,
            matches: [...matches]
          }
        });
        
        break;
      }
      
      // If we reached the end of the pattern, it's a match
      if (j === m - 1) {
        matches.push(i);
        
        // Highlight the entire match
        const highlightTextMatch = Array(n).fill(null);
        const highlightPatternMatch = Array(m).fill("match");
        
        for (let k = i; k < i + m; k++) {
          highlightTextMatch[k] = "match";
        }
        
        steps.push({
          title: `Pattern Found!`,
          description: `Match found at position ${i} in the text.`,
          data: {
            ...initialData,
            textIndex: i + m - 1,
            patternIndex: m - 1,
            highlightText: highlightTextMatch,
            highlightPattern: highlightPatternMatch,
            currentWindow: i,
            comparisons,
            matches: [...matches]
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
      patternIndex: m,
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null),
      comparisons,
      matches
    }
  });
  
  return steps;
};

// The main visualization component
const NaivePatternSearchingVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    text, 
    pattern, 
    textIndex, 
    patternIndex, 
    highlightText, 
    highlightPattern, 
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
          <h3 className="text-lg font-medium mb-2">Pattern Searching</h3>
          <div className="flex flex-col space-y-6">
            {/* Text display with character boxes */}
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
            
            {/* Pattern display with character boxes */}
            <div>
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
            </div>
          </div>
        </div>
        
        {/* Statistics and results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Statistics</h4>
            <div className="text-sm">
              <p><span className="font-medium">Comparisons:</span> {comparisons}</p>
              <p><span className="font-medium">Current Window:</span> Position {currentWindow}</p>
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

const NaivePatternSearchingVisualization = () => {
  return (
    <VisualizationContainer
      algorithmName="Naive Pattern Searching"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={NaivePatternSearchingVisualizationComponent}
      description="Naive Pattern Searching is a simple string matching algorithm that checks for all possible positions of the pattern in the text by sliding the pattern one by one."
    />
  );
};

export default NaivePatternSearchingVisualization; 