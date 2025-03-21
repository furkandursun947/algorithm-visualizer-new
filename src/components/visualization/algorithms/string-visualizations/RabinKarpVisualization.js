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
    prime: 101,
    d: 256, // Number of characters in input alphabet
    patternHash: 0,
    textWindowHash: 0,
    h: 1, // d^(m-1) % prime
    matches: [],
    comparisons: 0,
    spuriousHits: 0, // Hash matches but strings don't match
    highlightText: Array(20).fill(null),
    highlightPattern: Array(5).fill(null),
    currentWindow: 0,
    calculatingHash: true, // Flag to indicate hash calculation phase
    currentHashCalculation: null // Details about current hash calculation
  };
};

// Generate steps for the Rabin-Karp algorithm visualization
const generateVisualizationSteps = (initialData) => {
  const { text, pattern, prime, d } = initialData;
  const steps = [];
  const n = text.length;
  const m = pattern.length;
  let comparisons = 0;
  let spuriousHits = 0;
  const matches = [];
  
  // Calculate the hash value for pattern and the first window of text
  let patternHash = 0;
  let textWindowHash = 0;
  
  // Calculate h = d^(m-1) % prime
  let h = 1;
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % prime;
  }
  
  // Initial hash calculation for pattern and first window of text
  steps.push({
    title: "Initialization",
    description: "Preparing to calculate hash values for pattern and text.",
    data: {
      ...initialData,
      calculatingHash: true,
      currentHashCalculation: "Calculating d^(m-1) % prime = " + h
    }
  });
  
  // Calculate hash for pattern
  for (let i = 0; i < m; i++) {
    patternHash = (d * patternHash + pattern.charCodeAt(i)) % prime;
    
    const highlightPattern = Array(m).fill(null);
    highlightPattern[i] = "current";
    
    steps.push({
      title: "Pattern Hash Calculation",
      description: `Adding character '${pattern[i]}' to pattern hash. Current hash: ${patternHash}`,
      data: {
        ...initialData,
        patternHash,
        h,
        textWindowHash,
        calculatingHash: true,
        highlightPattern,
        currentHashCalculation: `patternHash = (${d} * ${i > 0 ? patternHash - ((pattern.charCodeAt(i) * d) % prime) : 0} + ${pattern.charCodeAt(i)}) % ${prime} = ${patternHash}`
      }
    });
  }
  
  // Calculate hash for first window of text
  for (let i = 0; i < m; i++) {
    textWindowHash = (d * textWindowHash + text.charCodeAt(i)) % prime;
    
    const highlightText = Array(n).fill(null);
    // Highlight the window
    for (let j = 0; j < i + 1; j++) {
      highlightText[j] = "window";
    }
    highlightText[i] = "current";
    
    steps.push({
      title: "Text Window Hash Calculation",
      description: `Adding character '${text[i]}' to text window hash. Current hash: ${textWindowHash}`,
      data: {
        ...initialData,
        patternHash,
        h,
        textWindowHash,
        calculatingHash: true,
        highlightText,
        currentHashCalculation: `textWindowHash = (${d} * ${i > 0 ? textWindowHash - ((text.charCodeAt(i) * d) % prime) : 0} + ${text.charCodeAt(i)}) % ${prime} = ${textWindowHash}`
      }
    });
  }
  
  // Start the search
  steps.push({
    title: "Starting Search",
    description: "Initial hash values calculated. Beginning to slide the pattern over text.",
    data: {
      ...initialData,
      patternHash,
      h,
      textWindowHash,
      calculatingHash: false,
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null),
    }
  });
  
  // Search for pattern in text using Rabin-Karp
  for (let i = 0; i <= n - m; i++) {
    const currentTextWindow = text.substring(i, i + m);
    const hashesMatch = patternHash === textWindowHash;
    
    // Highlight current window
    const highlightText = Array(n).fill(null);
    for (let j = i; j < i + m; j++) {
      highlightText[j] = "window";
    }
    
    steps.push({
      title: "Comparing Hash Values",
      description: `Comparing hash value of text window "${currentTextWindow}" (${textWindowHash}) with pattern hash (${patternHash}).`,
      data: {
        ...initialData,
        patternHash,
        h,
        textWindowHash,
        textIndex: i,
        highlightText,
        calculatingHash: false,
        comparisons,
        spuriousHits,
        matches: [...matches],
        currentWindow: i
      }
    });
    
    // If hashes match, check for actual match
    if (hashesMatch) {
      let match = true;
      
      // Compare each character
      for (let j = 0; j < m; j++) {
        comparisons++;
        
        const highlightText = Array(n).fill(null);
        const highlightPattern = Array(m).fill(null);
        
        // Highlight the window
        for (let k = i; k < i + m; k++) {
          highlightText[k] = "window";
        }
        
        // Highlight current comparison
        if (text[i + j] === pattern[j]) {
          highlightText[i + j] = "match";
          highlightPattern[j] = "match";
        } else {
          highlightText[i + j] = "mismatch";
          highlightPattern[j] = "mismatch";
          match = false;
        }
        
        steps.push({
          title: "Character Comparison",
          description: `Hashes match! Comparing text[${i + j}]='${text[i + j]}' with pattern[${j}]='${pattern[j]}'`,
          data: {
            ...initialData,
            patternHash,
            h,
            textWindowHash,
            textIndex: i + j,
            patternIndex: j,
            highlightText,
            highlightPattern,
            calculatingHash: false,
            comparisons,
            spuriousHits,
            matches: [...matches],
            currentWindow: i
          }
        });
        
        if (!match) {
          spuriousHits++;
          steps.push({
            title: "Spurious Hit",
            description: "The hash values matched but the strings don't match. This is called a spurious hit.",
            data: {
              ...initialData,
              patternHash,
              h,
              textWindowHash,
              textIndex: i + j,
              patternIndex: j,
              highlightText,
              highlightPattern,
              calculatingHash: false,
              comparisons,
              spuriousHits,
              matches: [...matches],
              currentWindow: i
            }
          });
          break;
        }
      }
      
      if (match) {
        // Found a match
        matches.push(i);
        
        // Highlight the entire match
        const matchHighlightText = Array(n).fill(null);
        for (let j = i; j < i + m; j++) {
          matchHighlightText[j] = "match";
        }
        
        steps.push({
          title: "Pattern Found!",
          description: `Match found at position ${i} in the text.`,
          data: {
            ...initialData,
            patternHash,
            h,
            textWindowHash,
            textIndex: i + m - 1,
            patternIndex: m - 1,
            highlightText: matchHighlightText,
            highlightPattern: Array(m).fill("match"),
            calculatingHash: false,
            comparisons,
            spuriousHits,
            matches: [...matches],
            currentWindow: i
          }
        });
      }
    }
    
    // Calculate hash for next window using rolling hash
    if (i < n - m) {
      const oldTextWindowHash = textWindowHash;
      textWindowHash = (d * (textWindowHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % prime;
      
      // Handle negative hash values
      if (textWindowHash < 0) {
        textWindowHash += prime;
      }
      
      const highlightText = Array(n).fill(null);
      highlightText[i] = "remove"; // Character being removed
      highlightText[i + m] = "add"; // Character being added
      
      steps.push({
        title: "Rolling Hash Calculation",
        description: `Calculating hash for next window by removing '${text[i]}' and adding '${text[i + m]}'.`,
        data: {
          ...initialData,
          patternHash,
          h,
          textWindowHash,
          textIndex: i + m,
          highlightText,
          calculatingHash: false,
          comparisons,
          spuriousHits,
          matches: [...matches],
          currentWindow: i + 1,
          currentHashCalculation: `textWindowHash = (${d} * (${oldTextWindowHash} - ${text.charCodeAt(i)} * ${h}) + ${text.charCodeAt(i + m)}) % ${prime} = ${textWindowHash}`
        }
      });
    }
  }
  
  // Final step
  steps.push({
    title: "Search Complete",
    description: `Found ${matches.length} occurrences of the pattern. Made ${comparisons} character comparisons with ${spuriousHits} spurious hits.`,
    data: {
      ...initialData,
      patternHash,
      h,
      textWindowHash,
      textIndex: n,
      patternIndex: 0,
      highlightText: Array(n).fill(null),
      highlightPattern: Array(m).fill(null),
      calculatingHash: false,
      comparisons,
      spuriousHits,
      matches,
      currentWindow: 0
    }
  });
  
  return steps;
};

// The main visualization component
const RabinKarpVisualizationComponent = ({ data, step, stepInfo }) => {
  const {
    text,
    pattern,
    textIndex,
    patternIndex,
    patternHash,
    textWindowHash,
    h,
    prime,
    d,
    highlightText,
    highlightPattern,
    calculatingHash,
    currentWindow,
    comparisons,
    spuriousHits,
    matches,
    currentHashCalculation
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
            {calculatingHash ? "Computing Hash Values" : "Rabin-Karp Pattern Searching"}
          </h3>
          
          <div className="flex flex-col space-y-6">
            {/* Text with character boxes */}
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
                        highlightText && highlightText[index] === "current" ? "bg-yellow-200 border-yellow-500" :
                        highlightText && highlightText[index] === "add" ? "bg-green-100 border-green-300" :
                        highlightText && highlightText[index] === "remove" ? "bg-red-100 border-red-300" :
                        "bg-gray-50 border-gray-200"
                      } ${index === textIndex ? "ring-2 ring-blue-500" : ""}`}
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: index === textIndex ? 1.1 : 1,
                        backgroundColor: highlightText && highlightText[index] === "match" ? "#bbf7d0" :
                                        highlightText && highlightText[index] === "mismatch" ? "#fecaca" :
                                        highlightText && highlightText[index] === "window" ? "#dbeafe" :
                                        highlightText && highlightText[index] === "current" ? "#fef08a" :
                                        highlightText && highlightText[index] === "add" ? "#dcfce7" :
                                        highlightText && highlightText[index] === "remove" ? "#fee2e2" : "#f9fafb"
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
                  {!calculatingHash && currentWindow > 0 && (
                    <div style={{ width: `${currentWindow * 2}rem` }}></div>
                  )}
                  
                  {pattern && pattern.split('').map((char, index) => (
                    <motion.div
                      key={`pattern-${index}`}
                      className={`w-8 h-8 flex items-center justify-center border ${
                        highlightPattern && highlightPattern[index] === "match" ? "bg-green-200 border-green-500" :
                        highlightPattern && highlightPattern[index] === "mismatch" ? "bg-red-200 border-red-500" :
                        highlightPattern && highlightPattern[index] === "current" ? "bg-yellow-200 border-yellow-500" :
                        "bg-gray-50 border-gray-200"
                      } ${index === patternIndex ? "ring-2 ring-blue-500" : ""}`}
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: index === patternIndex ? 1.1 : 1,
                        backgroundColor: highlightPattern && highlightPattern[index] === "match" ? "#bbf7d0" :
                                        highlightPattern && highlightPattern[index] === "mismatch" ? "#fecaca" :
                                        highlightPattern && highlightPattern[index] === "current" ? "#fef08a" : "#f9fafb"
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
            
            {/* Hash Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Pattern Hash</h4>
                <div className="text-2xl font-mono text-blue-600">{patternHash}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Text Window Hash</h4>
                <div className="text-2xl font-mono text-blue-600">{textWindowHash}</div>
              </div>
            </div>
            
            {/* Hash Calculation */}
            {currentHashCalculation && (
              <div className="bg-blue-50 p-3 rounded-lg mt-2">
                <h4 className="font-medium mb-1">Hash Calculation</h4>
                <div className="font-mono text-sm text-blue-800">{currentHashCalculation}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Statistics and results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Statistics</h4>
            <div className="text-sm">
              <p><span className="font-medium">Current Phase:</span> {calculatingHash ? "Computing Hash Values" : "Searching Pattern"}</p>
              <p><span className="font-medium">Comparisons:</span> {comparisons}</p>
              <p><span className="font-medium">Spurious Hits:</span> {spuriousHits}</p>
              {!calculatingHash && (
                <p><span className="font-medium">Current Window:</span> Position {currentWindow}</p>
              )}
              <p><span className="font-medium">Text Length:</span> {text?.length || 0}</p>
              <p><span className="font-medium">Pattern Length:</span> {pattern?.length || 0}</p>
              <p><span className="font-medium">Prime Number:</span> {prime}</p>
              <p><span className="font-medium">Hash Multiplier (d):</span> {d}</p>
              <p><span className="font-medium">h (d^(m-1) % prime):</span> {h}</p>
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

const RabinKarpVisualization = () => {
  return (
    <VisualizationContainer
      algorithmName="Rabin-Karp Algorithm"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={RabinKarpVisualizationComponent}
      description="The Rabin-Karp algorithm is a string searching algorithm that uses hashing to find patterns in text. It quickly eliminates most non-matching positions with hash comparisons before performing character checks."
    />
  );
};

export default RabinKarpVisualization; 