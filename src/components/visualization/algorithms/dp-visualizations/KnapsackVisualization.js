import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for the Knapsack problem
const generateInitialData = () => {
  // Sample items with their values and weights
  const items = [
    { name: "Item 1", value: 60, weight: 10 },
    { name: "Item 2", value: 100, weight: 20 },
    { name: "Item 3", value: 120, weight: 30 },
    { name: "Item 4", value: 80, weight: 15 },
    { name: "Item 5", value: 40, weight: 5 }
  ];
  
  // Knapsack capacity
  const capacity = 50;
  
  // Create a DP table initialized with zeros
  // dp[i][w] will hold the maximum value that can be obtained with the first i items and weight constraint w
  const n = items.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  return {
    items,
    capacity,
    dp,
    currentItem: 0,
    currentWeight: 0,
    selectedItems: [],
    isComplete: false,
    activeIndices: []
  };
};

// Generate steps for Knapsack problem visualization
const generateKnapsackSteps = (initialData) => {
  const steps = [];
  const { items, capacity } = initialData;
  
  // Clone the initial data to avoid mutating it
  const dp = Array(items.length + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  // Add step for initialization
  steps.push({
    data: {
      items: [...items],
      capacity,
      dp: JSON.parse(JSON.stringify(dp)),
      currentItem: 0,
      currentWeight: 0,
      selectedItems: [],
      isComplete: false,
      activeIndices: []
    },
    description: "Initialize the DP table. dp[i][w] will store the maximum value that can be obtained using the first i items and with maximum weight w.",
    codeHighlight: "create table dp[0...n][0...W] initialized to 0",
    complexityInfo: "Space complexity: O(n*W) where n is the number of items and W is the knapsack capacity"
  });
  
  // Build the DP table
  const n = items.length;
  
  // Fill the dp table using bottom-up approach
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // If the current item's weight is less than or equal to the current weight capacity
      const currentItemWeight = items[i - 1].weight;
      const currentItemValue = items[i - 1].value;
      
      // Compare the value with and without the current item
      if (currentItemWeight <= w) {
        // Add step for considering whether to include the current item
        steps.push({
          data: {
            items: [...items],
            capacity,
            dp: JSON.parse(JSON.stringify(dp)),
            currentItem: i,
            currentWeight: w,
            selectedItems: [],
            isComplete: false,
            activeIndices: [i - 1],
            compareWeight: true
          },
          description: `Considering item ${i} (value: ${currentItemValue}, weight: ${currentItemWeight}) with available weight ${w}.`,
          codeHighlight: "if weights[i-1] ≤ w then",
          complexityInfo: `Current item can fit in the knapsack (${currentItemWeight} ≤ ${w})`
        });
        
        // Value if we include the current item
        const valueWithItem = dp[i - 1][w - currentItemWeight] + currentItemValue;
        // Value if we exclude the current item
        const valueWithoutItem = dp[i - 1][w];
        
        // Add step for showing the comparison
        steps.push({
          data: {
            items: [...items],
            capacity,
            dp: JSON.parse(JSON.stringify(dp)),
            currentItem: i,
            currentWeight: w,
            selectedItems: [],
            isComplete: false,
            activeIndices: [i - 1],
            comparingValues: true,
            valueWithItem,
            valueWithoutItem
          },
          description: `Comparing value with item ${i} (${valueWithItem}) vs. without item ${i} (${valueWithoutItem}).`,
          codeHighlight: "dp[i][w] := max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1])",
          complexityInfo: `Deciding whether to include item ${i}`
        });
        
        // Choose the maximum value
        dp[i][w] = Math.max(valueWithItem, valueWithoutItem);
        
        // Add step for showing the decision
        steps.push({
          data: {
            items: [...items],
            capacity,
            dp: JSON.parse(JSON.stringify(dp)),
            currentItem: i,
            currentWeight: w,
            selectedItems: [],
            isComplete: false,
            activeIndices: [i - 1],
            decision: valueWithItem > valueWithoutItem ? "include" : "exclude"
          },
          description: `Decision: ${valueWithItem > valueWithoutItem ? "Include" : "Exclude"} item ${i}. Updated dp[${i}][${w}] = ${dp[i][w]}.`,
          codeHighlight: "dp[i][w] := max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1])",
          complexityInfo: `Choosing maximum value: ${dp[i][w]}`
        });
      } else {
        // If the item is too heavy, we can't include it
        dp[i][w] = dp[i - 1][w];
        
        // Add step for the case where the item is too heavy
        steps.push({
          data: {
            items: [...items],
            capacity,
            dp: JSON.parse(JSON.stringify(dp)),
            currentItem: i,
            currentWeight: w,
            selectedItems: [],
            isComplete: false,
            activeIndices: [i - 1],
            tooHeavy: true
          },
          description: `Item ${i} (weight: ${currentItemWeight}) is too heavy for current capacity ${w}. Keep previous value: dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}.`,
          codeHighlight: "else dp[i][w] := dp[i-1][w]",
          complexityInfo: `Item is too heavy to include (${currentItemWeight} > ${w})`
        });
      }
    }
  }
  
  // Find the selected items
  const selectedItems = [];
  let remainingCapacity = capacity;
  let i = n;
  
  while (i > 0 && remainingCapacity > 0) {
    // If the value came from including this item
    if (dp[i][remainingCapacity] !== dp[i - 1][remainingCapacity]) {
      selectedItems.push(i - 1); // 0-indexed item
      remainingCapacity -= items[i - 1].weight;
    }
    i--;
  }
  
  // Add final step
  steps.push({
    data: {
      items: [...items],
      capacity,
      dp: JSON.parse(JSON.stringify(dp)),
      currentItem: n,
      currentWeight: capacity,
      selectedItems,
      isComplete: true,
      activeIndices: selectedItems
    },
    description: `Knapsack problem solved! Maximum value: ${dp[n][capacity]}. Selected items: ${selectedItems.map(i => items[i].name).join(', ')}.`,
    codeHighlight: "return dp[n][W]",
    complexityInfo: `Final solution achieved in O(nW) time and O(nW) space`
  });
  
  return steps;
};

// Component to visualize the Knapsack table
const KnapsackTableVisualization = ({ data }) => {
  const { dp, currentItem, currentWeight, items, capacity } = data;
  
  return (
    <div className="overflow-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-2">DP Table (Maximum Values):</h3>
      <div className="relative overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300">Items / Weight</th>
              {Array.from({ length: capacity + 1 }, (_, i) => (
                <th 
                  key={i} 
                  className={`p-2 border border-gray-300 text-center ${i === currentWeight ? 'bg-yellow-100' : ''}`}
                >
                  {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr 
                key={i} 
                className={`${i === currentItem ? 'bg-green-50' : 'bg-white'}`}
              >
                <td className="p-2 border border-gray-300 font-medium">
                  {i === 0 ? "No items" : `${i} item${i > 1 ? 's' : ''}`}
                </td>
                {row.map((cell, j) => (
                  <td 
                    key={j} 
                    className={`p-2 border border-gray-300 text-center 
                      ${(i === currentItem && j === currentWeight) ? 'bg-blue-200 font-bold' : 
                        (i === currentItem || j === currentWeight) ? 'bg-blue-50' : ''}`}
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

// Component to visualize the Knapsack items
const ItemsVisualization = ({ data }) => {
  const { items, selectedItems, activeIndices, capacity } = data;
  
  // Calculate the total weight and value of selected items
  const totalWeight = selectedItems.reduce((sum, idx) => sum + items[idx].weight, 0);
  const totalValue = selectedItems.reduce((sum, idx) => sum + items[idx].value, 0);
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Items:</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`border rounded-lg p-3 
              ${selectedItems.includes(index) ? 'bg-green-100 border-green-500' : 
                activeIndices.includes(index) ? 'bg-yellow-100 border-yellow-500' : 
                'bg-white border-gray-300'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="mt-1 text-sm">
              <div>Value: <span className="font-semibold text-blue-600">{item.value}</span></div>
              <div>Weight: <span className="font-semibold text-red-600">{item.weight}</span></div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {data.isComplete && (
        <motion.div
          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="font-medium text-gray-900">Solution:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p>Selected items: {selectedItems.map(i => items[i].name).join(', ')}</p>
              <p>Total weight: {totalWeight}/{capacity}</p>
            </div>
            <div>
              <p>Total value: {totalValue}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(totalWeight / capacity) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Main visualization component for Knapsack Problem
const KnapsackVisualizationComponent = ({ data, step, stepInfo }) => {
  return (
    <div className="w-full">
      <KnapsackTableVisualization data={data} />
      <ItemsVisualization data={data} />
    </div>
  );
};

// Container component with animation controls
const KnapsackVisualization = () => {
  // Generate initial data for the Knapsack problem
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Knapsack Problem (Dynamic Programming)"
      initialData={initialData}
      generateSteps={generateKnapsackSteps}
      VisualizationComponent={KnapsackVisualizationComponent}
      description="The 0-1 Knapsack problem is about selecting items with maximum total value while respecting a weight constraint. Dynamic programming is used to build a table of optimal solutions to subproblems, avoiding redundant calculations."
    />
  );
};

export default KnapsackVisualization; 