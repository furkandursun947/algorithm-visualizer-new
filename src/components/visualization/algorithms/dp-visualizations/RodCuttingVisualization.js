import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for Rod Cutting problem
const generateInitialData = () => {
  // Sample rod length and prices
  const rodLength = 8;
  // Price array (index represents length of rod piece)
  // prices[0] = 0 (no revenue for length 0)
  const prices = [0, 1, 5, 8, 9, 10, 17, 17, 20];
  
  // Create a DP table to store maximum revenue for each rod length
  const dp = Array(rodLength + 1).fill(0);
  
  // Array to store where to make the cuts
  const cuts = Array(rodLength + 1).fill(0);
  
  return {
    rodLength,
    prices,
    dp,
    cuts,
    currentLength: 0,
    activeIndices: [],
    activeCells: [],
    isComplete: false,
    solution: null
  };
};

// Generate steps for Rod Cutting visualization
const generateRodCuttingSteps = (initialData) => {
  const steps = [];
  const { rodLength, prices } = initialData;
  
  // Create a deep copy of the DP arrays
  let dp = Array(rodLength + 1).fill(0);
  let cuts = Array(rodLength + 1).fill(0);
  
  // Add initial step
  steps.push({
    data: {
      rodLength,
      prices: [...prices],
      dp: [...dp],
      cuts: [...cuts],
      currentLength: 0,
      activeIndices: [],
      activeCells: [],
      isComplete: false,
      solution: null
    },
    description: "Initialize DP table. Base case: dp[0] = 0 (no revenue from a rod of length 0).",
    codeHighlight: "dp[0] = 0; // Base case",
    complexityInfo: "Time Complexity: O(n²) where n is the length of the rod"
  });
  
  // Fill the DP table for each rod length
  for (let i = 1; i <= rodLength; i++) {
    // Add step for considering the current rod length
    steps.push({
      data: {
        rodLength,
        prices: [...prices],
        dp: [...dp],
        cuts: [...cuts],
        currentLength: i,
        activeIndices: [i],
        activeCells: [],
        isComplete: false,
        solution: null
      },
      description: `Computing maximum revenue for rod of length ${i}.`,
      codeHighlight: "for (int i = 1; i <= n; i++) { // Consider each rod length",
      complexityInfo: `Processing rod length ${i} of ${rodLength}`
    });
    
    let maxRevenue = -1;
    let bestCut = 0;
    
    // Try all possible cuts for the current rod length
    for (let j = 1; j <= i; j++) {
      // Current revenue = price of piece of length j + revenue from remaining rod
      const currentRevenue = prices[j] + dp[i - j];
      
      // Add step for trying this cut
      steps.push({
        data: {
          rodLength,
          prices: [...prices],
          dp: [...dp],
          cuts: [...cuts],
          currentLength: i,
          activeIndices: [i],
          activeCells: [[j], [i - j]],
          cutPos: j,
          isComplete: false,
          solution: null
        },
        description: `Trying a cut of length ${j}: price[${j}] + dp[${i-j}] = ${prices[j]} + ${dp[i-j]} = ${prices[j] + dp[i-j]}`,
        codeHighlight: "for (int j = 1; j <= i; j++) { // Try all possible cuts",
        complexityInfo: `Evaluating cut of length ${j} for rod of length ${i}`
      });
      
      // Update max revenue if current is better
      if (currentRevenue > maxRevenue) {
        maxRevenue = currentRevenue;
        bestCut = j;
        
        // Add step for updating maximum revenue
        steps.push({
          data: {
            rodLength,
            prices: [...prices],
            dp: [...dp],
            cuts: [...cuts],
            currentLength: i,
            activeIndices: [i],
            activeCells: [[j], [i - j]],
            cutPos: j,
            newMaxRevenue: maxRevenue,
            isComplete: false,
            solution: null
          },
          description: `Found a better solution with a cut of length ${j}. New maximum revenue: ${maxRevenue}`,
          codeHighlight: "if (currentRevenue > maxRevenue) { maxRevenue = currentRevenue; bestCut = j; }",
          complexityInfo: `Updated maximum revenue to ${maxRevenue}`
        });
      }
    }
    
    // Store best solution for this rod length
    dp[i] = maxRevenue;
    cuts[i] = bestCut;
    
    // Add step for storing the result for this rod length
    steps.push({
      data: {
        rodLength,
        prices: [...prices],
        dp: [...dp],
        cuts: [...cuts],
        currentLength: i,
        activeIndices: [i],
        activeCells: [[i]],
        isComplete: false,
        solution: null
      },
      description: `Optimal solution for rod of length ${i}: Make a cut of length ${bestCut} first. Maximum revenue: ${maxRevenue}`,
      codeHighlight: "dp[i] = maxRevenue; cuts[i] = bestCut;",
      complexityInfo: `Stored optimal solution for rod length ${i}`
    });
  }
  
  // Reconstruct the solution (the cuts to make)
  const solution = reconstructSolution(rodLength, cuts);
  
  // Add final step
  steps.push({
    data: {
      rodLength,
      prices: [...prices],
      dp: [...dp],
      cuts: [...cuts],
      currentLength: rodLength,
      activeIndices: [],
      activeCells: [[rodLength]],
      isComplete: true,
      solution
    },
    description: `Rod cutting problem solved! Maximum revenue: ${dp[rodLength]}. Optimal cuts: ${solution.join(', ')}`,
    codeHighlight: "return dp[n]; // Final result",
    complexityInfo: `Final result: Maximum revenue ${dp[rodLength]}`
  });
  
  return steps;
};

// Function to reconstruct the solution (what cuts to make)
const reconstructSolution = (rodLength, cuts) => {
  const solution = [];
  let remaining = rodLength;
  
  while (remaining > 0) {
    solution.push(cuts[remaining]);
    remaining -= cuts[remaining];
  }
  
  return solution;
};

// Component to visualize the prices
const PriceTableVisualization = ({ data }) => {
  const { prices = [] } = data || {};
  
  if (!prices || prices.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Price Table:</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-2 py-1 bg-gray-50">Length</th>
              {Array.from({ length: prices.length - 1 }, (_, i) => i + 1).map((length) => (
                <th key={length} className="border border-gray-200 px-3 py-1 bg-gray-50">{length}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-2 py-1 bg-gray-50 font-medium">Price</td>
              {Array.from({ length: prices.length - 1 }, (_, i) => i + 1).map((length) => (
                <td key={length} className="border border-gray-200 px-3 py-1 text-center">{prices[length]}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component to visualize the DP table
const DPTableVisualization = ({ data }) => {
  const { dp = [], currentLength = 0, activeCells = [] } = data || {};
  
  if (!dp || dp.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">DP Table (Maximum Revenue):</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-2 py-1 bg-gray-50">Rod Length</th>
              {Array.from({ length: dp.length }, (_, i) => (
                <th key={i} className="border border-gray-200 px-3 py-1 bg-gray-50">{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-2 py-1 bg-gray-50 font-medium">Max Revenue</td>
              {dp.map((value, i) => (
                <td 
                  key={i} 
                  className={`border border-gray-200 px-3 py-1 text-center
                    ${i === currentLength ? 'bg-green-100' : 
                      activeCells.flat().includes(i) ? 'bg-yellow-100' : 
                      'bg-blue-50'}`}
                >
                  {value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component to visualize the rod and cuts
const RodVisualization = ({ data }) => {
  const { rodLength = 0, solution = null, cutPos = null } = data || {};
  
  if (!rodLength) return null;
  
  // For completed solution visualization
  if (solution && data.isComplete) {
    let remainingLength = rodLength;
    const pieces = [];
    
    // Build pieces from solution
    for (const cut of solution) {
      pieces.push(cut);
      remainingLength -= cut;
    }
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Optimal Rod Cutting:</h3>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <div className="w-full h-12 bg-blue-600 rounded flex items-center justify-center text-white font-medium">
              Original Rod (Length {rodLength})
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex w-full">
              {pieces.map((pieceLength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="h-12 bg-green-500 rounded mx-0.5 flex items-center justify-center text-white font-medium"
                  style={{ width: `${(pieceLength / rodLength) * 100}%` }}
                >
                  {pieceLength}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // For in-progress visualization showing current cut being considered
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Rod (Length {rodLength}):</h3>
      <div className="relative w-full h-12 bg-blue-600 rounded flex items-center justify-center text-white font-medium">
        {cutPos && (
          <>
            <div className="absolute top-0 left-0 bottom-0 bg-yellow-500 rounded-l flex items-center justify-center"
                 style={{ width: `${(cutPos / rodLength) * 100}%` }}>
              Cut ({cutPos})
            </div>
            <div className="absolute top-[-20px] left-[calc(var(--cut-position))]" 
                 style={{ '--cut-position': `${(cutPos / rodLength) * 100}%` }}>
              <div className="h-16 border-l-2 border-red-500 border-dashed"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Component to visualize the solution
const SolutionVisualization = ({ data }) => {
  const { dp = [], rodLength = 0, solution = [], isComplete = false } = data || {};
  
  if (!isComplete) return null;
  
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Solution:</h3>
      <p className="text-green-700 font-medium mb-2">
        ✓ Maximum revenue: {dp[rodLength]}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-gray-700">Optimal cuts: </span>
        {solution.map((cut, i) => (
          <motion.span 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
          >
            {cut}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

// Main visualization component
const RodCuttingVisualizationComponent = ({ data, step, stepInfo }) => {
  if (!data) {
    return (
      <div className="w-full flex items-center justify-center p-6 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: No data available for visualization</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <PriceTableVisualization data={data} />
      <RodVisualization data={data} />
      <DPTableVisualization data={data} />
      <SolutionVisualization data={data} />
    </div>
  );
};

// Container component with animation controls
const RodCuttingVisualization = () => {
  // Generate initial data for the Rod Cutting problem
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Rod Cutting Problem (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateRodCuttingSteps}
      VisualizationComponent={RodCuttingVisualizationComponent}
      description="The Rod Cutting Problem involves finding the optimal way to cut a rod into smaller pieces to maximize revenue. Different lengths of the rod have different prices, and the goal is to find the cuts that yield the highest total value."
    />
  );
};

export default RodCuttingVisualization; 