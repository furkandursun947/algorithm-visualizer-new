import React from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Generate initial data for the visualization
const generateInitialData = () => {
  return {
    text: "ABABDABACDABABCABAB",
    pattern: "ABABC",
    textIndex: 0,
    patternIndex: 0,
    badCharTable: {},
    goodSuffixTable: [],
    matches: [],
    comparisons: 0,
    highlightText: Array(20).fill(null),
    highlightPattern: Array(5).fill(null),
    currentWindow: 0,
    skipDistance: 0,
    shiftReason: "", // "bad character" or "good suffix"
    phase: "Preprocessing", // "Preprocessing" or "Matching"
    preprocessingStep: "badChar" // "badChar" or "goodSuffix"
  };
};

// Utility function to compute last occurrence of character in pattern
const computeBadCharTable = (pattern) => {
  const table = {};
  // Initialize table with -1 for all possible characters
  for (let i = 0; i < 256; i++) {
    table[String.fromCharCode(i)] = -1;
  }
  
  // Fill the actual occurrences
  for (let i = 0; i < pattern.length; i++) {
    table[pattern[i]] = i;
  }
  
  return table;
};

// Utility function to find border position
const findBorderPosition = (pattern, position) => {
  const suffix = pattern.slice(position + 1);
  const m = pattern.length;
  
  for (let i = 0; i <= position; i++) {
    if (pattern.slice(i, i + suffix.length) === suffix && 
        (i === 0 || pattern.slice(0, i) !== pattern.slice(position + 1 - i, position + 1))) {
      return i;
    }
  }
  
  return -1;
};

// Utility function to compute good suffix table
const computeGoodSuffixTable = (pattern) => {
  const m = pattern.length;
  const table = Array(m).fill(m);
  
  // Case 1: Suffix appears elsewhere in pattern
  for (let i = m - 1; i >= 0; i--) {
    const borderPos = findBorderPosition(pattern, i);
    if (borderPos !== -1) {
      table[i] = m - 1 - i + borderPos;
    }
  }
  
  // Case 2: A prefix of pattern is a suffix of the suffix starting at position i
  let j = 0;
  for (let i = 0; i < m - 1; i++) {
    let isSuffix = true;
    for (let k = 0; k <= i; k++) {
      if (pattern[k] !== pattern[m - i - 1 + k]) {
        isSuffix = false;
        break;
      }
    }
    
    if (isSuffix) {
      j = i + 1;
    }
    
    if (i + 1 === m - j) {
      table[i + 1] = Math.min(table[i + 1], i + 1);
    }
  }
  
  return table;
};

// Generate steps for the Boyer-Moore algorithm visualization
const generateVisualizationSteps = (initialData) => {
  const { text, pattern } = initialData;
  const steps = [];
  const n = text.length;
  const m = pattern.length;
  let comparisons = 0;
  const matches = [];
  
  // Initial step
  steps.push({
    title: "Initialization",
    description: "Starting Boyer-Moore algorithm preprocessing phase.",
    data: {
      ...initialData,
      phase: "Preprocessing",
      preprocessingStep: "badChar"
    }
  });
  
  // Compute Bad Character Table
  const badCharTable = computeBadCharTable(pattern);
  
  steps.push({
    title: "Bad Character Rule Table",
    description: "Preprocessing: Computed the table for bad character rule. This shows the last position of each character in the pattern.",
    data: {
      ...initialData,
      badCharTable,
      phase: "Preprocessing",
      preprocessingStep: "badChar"
    }
  });
  
  // Compute Good Suffix Table
  const goodSuffixTable = computeGoodSuffixTable(pattern);
  
  steps.push({
    title: "Good Suffix Rule Table",
    description: "Preprocessing: Computed the table for good suffix rule. This helps skip comparisons based on matching suffixes.",
    data: {
      ...initialData,
      badCharTable,
      goodSuffixTable,
      phase: "Preprocessing",
      preprocessingStep: "goodSuffix"
    }
  });
  
  // Start matching phase
  steps.push({
    title: "Starting Matching Phase",
    description: "Preprocessing complete. Beginning the pattern matching process.",
    data: {
      ...initialData,
      badCharTable,
      goodSuffixTable,
      phase: "Matching",
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null)
    }
  });
  
  // Boyer-Moore algorithm
  let i = 0; // text position
  
  while (i <= n - m) {
    let j = m - 1; // pattern position (starting from end)
    let skipDistance = 0;
    let shiftReason = "";
    
    // Highlight current window
    const highlightText = Array(n).fill(null);
    const highlightPattern = Array(m).fill(null);
    
    // Mark the current window in text
    for (let k = 0; k < m; k++) {
      highlightText[i + k] = "window";
    }
    
    steps.push({
      title: "Comparing Window",
      description: `Aligning pattern with text starting at position ${i}.`,
      data: {
        ...initialData,
        badCharTable,
        goodSuffixTable,
        textIndex: i,
        patternIndex: m - 1,
        highlightText,
        highlightPattern,
        currentWindow: i,
        phase: "Matching",
        comparisons,
        matches: [...matches]
      }
    });
    
    // Compare characters from right to left
    while (j >= 0 && (pattern[j] === text[i + j])) {
      comparisons++;
      
      // Create new arrays for highlighting
      const matchHighlightText = [...highlightText];
      const matchHighlightPattern = [...highlightPattern];
      
      // Mark the current match
      matchHighlightText[i + j] = "match";
      matchHighlightPattern[j] = "match";
      
      steps.push({
        title: "Character Match",
        description: `Matching character: pattern[${j}] = text[${i + j}] = "${pattern[j]}"`,
        data: {
          ...initialData,
          badCharTable,
          goodSuffixTable,
          textIndex: i + j,
          patternIndex: j,
          highlightText: matchHighlightText,
          highlightPattern: matchHighlightPattern,
          currentWindow: i,
          phase: "Matching",
          comparisons,
          matches: [...matches]
        }
      });
      
      j--;
    }
    
    // If we matched the entire pattern
    if (j < 0) {
      matches.push(i);
      
      // Highlight entire match
      const matchHighlightText = Array(n).fill(null);
      const matchHighlightPattern = Array(m).fill(null);
      
      for (let k = 0; k < m; k++) {
        matchHighlightText[i + k] = "match";
        matchHighlightPattern[k] = "match";
      }
      
      steps.push({
        title: "Pattern Found!",
        description: `Found complete match of the pattern at position ${i}.`,
        data: {
          ...initialData,
          badCharTable,
          goodSuffixTable,
          textIndex: i,
          patternIndex: j,
          highlightText: matchHighlightText,
          highlightPattern: matchHighlightPattern,
          currentWindow: i,
          phase: "Matching",
          comparisons,
          matches: [...matches]
        }
      });
      
      // Shift by 1 (simplified for visualization)
      skipDistance = 1;
      shiftReason = "pattern found, shifting by 1";
    }
    else {
      comparisons++;
      
      // Mismatch occurred, highlight it
      const mismatchHighlightText = [...highlightText];
      const mismatchHighlightPattern = [...highlightPattern];
      
      mismatchHighlightText[i + j] = "mismatch";
      mismatchHighlightPattern[j] = "mismatch";
      
      steps.push({
        title: "Character Mismatch",
        description: `Mismatch found: pattern[${j}] = "${pattern[j]}" ≠ text[${i + j}] = "${text[i + j]}"`,
        data: {
          ...initialData,
          badCharTable,
          goodSuffixTable,
          textIndex: i + j,
          patternIndex: j,
          highlightText: mismatchHighlightText,
          highlightPattern: mismatchHighlightPattern,
          currentWindow: i,
          phase: "Matching",
          comparisons,
          matches: [...matches]
        }
      });
      
      // Calculate shift using bad character rule
      const badCharShift = Math.max(1, j - (badCharTable[text[i + j]] || -1));
      
      // Calculate shift using good suffix rule
      const goodSuffixShift = (j < m - 1) ? goodSuffixTable[j + 1] : 1;
      
      // Use the maximum shift distance
      if (badCharShift >= goodSuffixShift) {
        skipDistance = badCharShift;
        shiftReason = "bad character rule";
      } else {
        skipDistance = goodSuffixShift;
        shiftReason = "good suffix rule";
      }
      
      steps.push({
        title: "Calculating Shift",
        description: `Using ${shiftReason}: shifting pattern by ${skipDistance} positions.`,
        data: {
          ...initialData,
          badCharTable,
          goodSuffixTable,
          textIndex: i + j,
          patternIndex: j,
          highlightText: mismatchHighlightText,
          highlightPattern: mismatchHighlightPattern,
          currentWindow: i,
          skipDistance,
          shiftReason,
          phase: "Matching",
          comparisons,
          matches: [...matches]
        }
      });
    }
    
    // Shift pattern
    i += skipDistance;
  }
  
  // Final step
  steps.push({
    title: "Search Complete",
    description: `Found ${matches.length} occurrences of the pattern. Made ${comparisons} character comparisons.`,
    data: {
      ...initialData,
      badCharTable,
      goodSuffixTable,
      textIndex: -1,
      patternIndex: -1,
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null),
      currentWindow: -1,
      phase: "Complete",
      comparisons,
      matches
    }
  });
  
  return steps;
};

// Format the bad character table for display
const formatBadCharTable = (table) => {
  const entries = Object.entries(table).filter(([char, position]) => position !== -1);
  return entries.map(([char, position]) => `${char}: ${position}`).join(', ');
};

// The main visualization component
const BoyerMooreVisualizationComponent = ({ data, step, stepInfo }) => {
  const {
    text,
    pattern,
    badCharTable,
    goodSuffixTable,
    textIndex,
    patternIndex,
    highlightText,
    highlightPattern,
    currentWindow,
    skipDistance,
    shiftReason,
    phase,
    preprocessingStep,
    matches,
    comparisons
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
            Boyer-Moore Algorithm - {phase} Phase
          </h3>
          
          <div className="flex flex-col space-y-6">
            {/* Preprocessing display */}
            {phase === "Preprocessing" && (
              <div className="grid grid-cols-1 gap-4">
                {preprocessingStep === "badChar" && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Bad Character Rule Table</h4>
                    <div className="text-sm">
                      <p className="mb-2">This table stores the rightmost position of each character in the pattern:</p>
                      <div className="bg-white p-2 rounded font-mono">
                        {badCharTable && Object.keys(badCharTable).length > 0 ? 
                          formatBadCharTable(badCharTable) : 
                          "Computing bad character table..."}
                      </div>
                      <p className="mt-2 text-xs">
                        When a mismatch occurs, this table helps skip comparisons by moving the pattern past the mismatched character.
                      </p>
                    </div>
                  </div>
                )}
                
                {preprocessingStep === "goodSuffix" && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Good Suffix Rule Table</h4>
                    <div className="text-sm">
                      <p className="mb-2">This table determines shift distances based on matching suffixes:</p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="py-2 px-4 text-left">Position</th>
                              {goodSuffixTable && goodSuffixTable.map((_, idx) => (
                                <th key={idx} className="py-2 px-4 text-center">{idx}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2 px-4 border-t font-medium">Shift</td>
                              {goodSuffixTable && goodSuffixTable.map((value, idx) => (
                                <td key={idx} className="py-2 px-4 text-center border-t">{value}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-2 text-xs">
                        When a mismatch occurs after matching some suffix, this table determines how far to shift based on other occurrences of that suffix.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Text display */}
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
                  {currentWindow > 0 && currentWindow !== -1 && (
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
            
            {/* Shift information */}
            {phase === "Matching" && skipDistance > 0 && (
              <div className="bg-indigo-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Shift Information</h4>
                <div className="text-sm">
                  <p><span className="font-medium">Rule Used:</span> {shiftReason}</p>
                  <p><span className="font-medium">Shift Distance:</span> {skipDistance} positions</p>
                  {shiftReason === "bad character rule" && textIndex >= 0 && (
                    <p className="mt-1 text-xs">
                      The mismatched character '{text[textIndex]}' last appears at position {badCharTable[text[textIndex]] || "-1"} in the pattern.
                      We shift by max(1, {patternIndex} - {badCharTable[text[textIndex]] || "-1"}) = {skipDistance}.
                    </p>
                  )}
                  {shiftReason === "good suffix rule" && patternIndex < pattern.length - 1 && (
                    <p className="mt-1 text-xs">
                      We matched a suffix of length {pattern.length - patternIndex - 1}.
                      The good suffix table gives a shift of {skipDistance} for this position.
                    </p>
                  )}
                </div>
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
              <p><span className="font-medium">Comparisons:</span> {comparisons}</p>
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

const BoyerMooreVisualization = () => {
  return (
    <VisualizationContainer
      algorithmName="Boyer-Moore Algorithm"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={BoyerMooreVisualizationComponent}
      description="The Boyer-Moore string matching algorithm uses two preprocessed rules (bad character and good suffix) to skip unnecessary comparisons, making it very efficient in practice."
    />
  );
};

export default BoyerMooreVisualization; 