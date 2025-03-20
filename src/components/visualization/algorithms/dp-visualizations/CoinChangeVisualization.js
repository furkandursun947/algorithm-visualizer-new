import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for Coin Change problem
const generateInitialData = () => {
  // Sample coin denominations
  const coins = [1, 2, 5, 10, 25];
  
  // Target amount
  const amount = 30;
  
  // Initialize DP table with zeros
  // dp[i] represents the number of ways to make change for amount i
  const dp = Array(amount + 1).fill(0);
  
  // Base case: there is 1 way to make change for 0 (using no coins)
  dp[0] = 1;
  
  return {
    coins,
    amount,
    dp,
    currentCoinIndex: -1,
    currentAmount: 0,
    isComplete: false,
    highlightedCells: [],
    highlightedCoins: [],
    stepType: 'init', // init, process-coin, update-dp, complete
    combinations: []  // To store visualizations of different combinations
  };
};

// Generate steps for Coin Change computation
const generateCoinChangeSteps = (initialData) => {
  const steps = [];
  const { coins, amount } = initialData;
  
  // Clone the initial data to avoid mutating it
  const dp = [...initialData.dp];
  
  // Add step for initialization
  steps.push({
    data: {
      coins: [...coins],
      amount,
      dp: [...dp],
      currentCoinIndex: -1,
      currentAmount: 0,
      isComplete: false,
      highlightedCells: [],
      highlightedCoins: [],
      stepType: 'init',
      combinations: []
    },
    description: "Initialize the DP table. dp[i] will store the number of ways to make change for amount i.",
    codeHighlight: "// Initialize DP table\ndp = new array of size (amount + 1) filled with 0\ndp[0] = 1  // Base case: one way to make change for 0",
    complexityInfo: "Time Complexity: O(n*m) where n is the amount and m is the number of coin denominations"
  });
  
  // Add step for explaining the base case
  steps.push({
    data: {
      coins: [...coins],
      amount,
      dp: [...dp],
      currentCoinIndex: -1,
      currentAmount: 0,
      isComplete: false,
      highlightedCells: [0],
      highlightedCoins: [],
      stepType: 'init',
      combinations: []
    },
    description: "Set the base case: dp[0] = 1, there is exactly one way to make change for amount 0 (by using no coins).",
    codeHighlight: "dp[0] = 1  // Base case: one way to make change for 0",
    complexityInfo: "Base case initialization"
  });
  
  // Generate all combinations (this is just for visualization)
  const allCombinations = [];
  
  // Iterate through each coin
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    
    // Add step to show which coin we're currently processing
    steps.push({
      data: {
        coins: [...coins],
        amount,
        dp: [...dp],
        currentCoinIndex: i,
        currentAmount: 0,
        isComplete: false,
        highlightedCells: [],
        highlightedCoins: [i],
        stepType: 'process-coin',
        combinations: [...allCombinations]
      },
      description: `Processing coin of denomination ${coin}.`,
      codeHighlight: "// For each coin\nfor i = 0 to coins.length - 1",
      complexityInfo: `Using coin denomination: ${coin}`
    });
    
    // Iterate through all amounts from coin value to target amount
    for (let j = coin; j <= amount; j++) {
      // Calculate how many ways we can make amount j using the current coin
      // i.e., add number of ways to make amount (j - coin)
      const prevWays = dp[j];
      const newWays = dp[j] + dp[j - coin];
      
      // Add step to show the DP calculation
      steps.push({
        data: {
          coins: [...coins],
          amount,
          dp: [...dp],
          currentCoinIndex: i,
          currentAmount: j,
          isComplete: false,
          highlightedCells: [j, j - coin],
          highlightedCoins: [i],
          stepType: 'update-dp',
          combinations: [...allCombinations]
        },
        description: `Computing ways to make ${j} using coin ${coin}: dp[${j}] += dp[${j} - ${coin}] = ${prevWays} + ${dp[j - coin]} = ${newWays}`,
        codeHighlight: "    // For each amount from coin to target\n    for j = coin to amount\n        dp[j] += dp[j - coin]",
        complexityInfo: `dp[${j}] += dp[${j - coin}]: ${prevWays} + ${dp[j - coin]} = ${newWays}`
      });
      
      // Update the dp array
      dp[j] += dp[j - coin];
      
      // Add step to show the updated DP array
      steps.push({
        data: {
          coins: [...coins],
          amount,
          dp: [...dp],
          currentCoinIndex: i,
          currentAmount: j,
          isComplete: false,
          highlightedCells: [j],
          highlightedCoins: [i],
          stepType: 'update-dp',
          combinations: [...allCombinations]
        },
        description: `Updated dp[${j}] = ${dp[j]}, which is the number of ways to make ${j} using coins up to ${coin}.`,
        codeHighlight: "        dp[j] += dp[j - coin]",
        complexityInfo: `dp[${j}] = ${dp[j]}`
      });
      
      // If we're processing the target amount, add some combinations for visualization
      if (j === amount && dp[j] > 0) {
        // For visualization, generate some examples of combinations
        // In a real implementation, we would backtrack to find actual combinations
        // but here we'll just generate some plausible ones
        const newCombination = generateCombinationExample(coins.slice(0, i + 1), amount);
        if (newCombination.length > 0) {
          allCombinations.push(newCombination);
        }
      }
    }
  }
  
  // Add final step
  steps.push({
    data: {
      coins: [...coins],
      amount,
      dp: [...dp],
      currentCoinIndex: coins.length - 1,
      currentAmount: amount,
      isComplete: true,
      highlightedCells: [amount],
      highlightedCoins: [],
      stepType: 'complete',
      combinations: [...allCombinations]
    },
    description: `Coin Change computation complete. There are ${dp[amount]} different ways to make change for amount ${amount} using the given coins.`,
    codeHighlight: "return dp[amount]",
    complexityInfo: `Final result: ${dp[amount]} ways | Time complexity: O(amount * coins.length)`
  });
  
  return steps;
};

// Helper function to generate an example combination for visualization
// This is not part of the actual algorithm but helps in visualizing the result
const generateCombinationExample = (availableCoins, targetAmount) => {
  const result = [];
  let remaining = targetAmount;
  
  // Start with largest denomination and work backwards
  for (let i = availableCoins.length - 1; i >= 0; i--) {
    const coin = availableCoins[i];
    // Use as many of this coin as possible
    while (remaining >= coin) {
      result.push(coin);
      remaining -= coin;
    }
  }
  
  // Only return if we made exact change
  return remaining === 0 ? result : [];
};

// Component to visualize the coins
const CoinsVisualization = ({ data }) => {
  const { coins, highlightedCoins, currentCoinIndex } = data;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Available Coins:</h3>
      <div className="flex flex-wrap gap-3">
        {coins.map((coin, index) => {
          const isActive = highlightedCoins.includes(index);
          const isProcessed = index < currentCoinIndex;
          
          return (
            <motion.div
              key={index}
              className={`
                w-16 h-16 rounded-full flex items-center justify-center 
                ${isActive ? 'bg-yellow-200 border-yellow-400' : isProcessed ? 'bg-green-100 border-green-400' : 'bg-blue-50 border-blue-300'} 
                border-2 shadow-md
              `}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className="text-lg font-bold">${coin}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Component to visualize the DP table
const DPTableVisualization = ({ data }) => {
  const { dp, highlightedCells, currentAmount } = data;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">DP Table (Number of ways to make each amount):</h3>
      <div className="overflow-x-auto">
        <div className="flex">
          {dp.map((value, index) => {
            const isHighlighted = highlightedCells.includes(index);
            const isCurrent = index === currentAmount;
            
            let bgColor = "bg-white";
            if (isCurrent) bgColor = "bg-green-200";
            else if (isHighlighted) bgColor = "bg-yellow-100";
            else if (index === 0) bgColor = "bg-blue-100"; // Base case
            
            return (
              <div key={index} className="flex flex-col items-center mx-1">
                <div className="text-xs text-gray-600 mb-1">${index}</div>
                <motion.div
                  className={`w-10 h-10 flex items-center justify-center border rounded-md ${bgColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  {value}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Component to visualize example combinations
const CombinationsVisualization = ({ data }) => {
  const { combinations, amount } = data;
  
  if (combinations.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Example Combinations for ${amount}:</h3>
      <div className="space-y-4">
        {combinations.map((combination, index) => (
          <motion.div
            key={index}
            className="p-4 bg-gray-50 rounded-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="text-sm text-gray-600 mb-2">Combination {index + 1}:</div>
            <div className="flex flex-wrap gap-2">
              {combination.map((coin, coinIndex) => (
                <div
                  key={coinIndex}
                  className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center"
                >
                  ${coin}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Main visualization component for Coin Change
const CoinChangeVisualizationComponent = ({ data, step, stepInfo }) => {
  return (
    <div className="w-full">
      <CoinsVisualization data={data} />
      <DPTableVisualization data={data} />
      <CombinationsVisualization data={data} />
    </div>
  );
};

// Container component with animation controls
const CoinChangeVisualization = () => {
  // Generate initial data for the Coin Change problem
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Coin Change Problem (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateCoinChangeSteps}
      VisualizationComponent={CoinChangeVisualizationComponent}
      description="The Coin Change Problem counts the number of different ways to make change for a given amount using a set of coin denominations. This is a classic dynamic programming problem with applications in currency systems, payment processing, and financial algorithms."
    />
  );
};

export default CoinChangeVisualization; 