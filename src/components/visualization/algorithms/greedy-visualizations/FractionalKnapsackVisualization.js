import React, { useState, useEffect } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import { motion } from 'framer-motion';

// Item class for the visualization
class Item {
  constructor(id, name, value, weight) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.weight = weight;
    this.ratio = value / weight;
    this.selected = 0; // Fraction selected (0 to 1)
  }
}

// Visualization component that will be passed to VisualizationContainer
const FractionalKnapsackVisualizationComponent = ({ data, step, stepInfo }) => {
  const currentStep = data.step;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-12">
        {renderStepExplanation(currentStep)}
      </div>
      <div className="lg:col-span-6">
        {renderItemTable(currentStep.items)}
      </div>
      <div className="lg:col-span-6">
        {renderKnapsack(currentStep.currentWeight, currentStep.totalValue)}
        {renderSelectedItems(currentStep.items)}
      </div>
    </div>
  );
};

// Render items table
const renderItemTable = (itemsData) => {
  if (!itemsData || itemsData.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Items</h3>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Item</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Value</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Weight</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Value/Weight</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Selection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {itemsData.map((item) => (
              <tr 
                key={item.id}
                className={item.highlighted ? 'bg-yellow-100' : 'hover:bg-gray-50'}
              >
                <td className="py-2 px-4 text-sm text-gray-700">{item.name}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{item.value}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{item.weight}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{item.ratio.toFixed(2)}</td>
                <td className="py-2 px-4 text-sm">
                  {item.selected > 0 ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                      {item.selected === 1 ? 'Full' : `${(item.selected * 100).toFixed(0)}%`}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                      Not Selected
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Render knapsack
const renderKnapsack = (currentWeight, totalValue) => {
  const knapsackCapacity = 15; // Max weight
  const fillPercentage = (currentWeight / knapsackCapacity) * 100;
  
  return (
    <div className="mt-4 mb-4">
      <h3 className="text-lg font-medium mb-2">Knapsack Status</h3>
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Weight Used: {currentWeight} / {knapsackCapacity}</span>
          <span className="text-sm font-medium text-gray-700">Total Value: {totalValue.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full" 
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Render selected items
const renderSelectedItems = (itemsData) => {
  if (!itemsData) return null;
  
  const selectedItems = itemsData.filter(item => item.selected > 0);
  
  if (selectedItems.length === 0) return null;
  
  return (
    <div className="mt-4 mb-4">
      <h3 className="text-lg font-medium mb-2">Selected Items</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-blue-50 rounded-lg border border-blue-200 shadow-sm"
          >
            <div className="text-sm font-medium">{item.name}</div>
            <div className="text-xs text-gray-500">Value: {item.value}</div>
            <div className="text-xs text-gray-500">
              {item.selected === 1 
                ? `Weight: ${item.weight}` 
                : `Weight: ${(item.selected * item.weight).toFixed(2)} of ${item.weight}`}
            </div>
            <div className="text-xs text-gray-500">
              {item.selected === 1 
                ? 'Fully selected' 
                : `Partially selected (${(item.selected * 100).toFixed(0)}%)`}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Render current step explanation
const renderStepExplanation = (step) => {
  if (!step) return null;
  
  return (
    <div className="mt-4 mb-4 p-4 bg-blue-50 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Current Step: {step.title}</h3>
      <p className="text-gray-700 mb-2">{step.description}</p>
      
      {step.currentItem && (
        <div className="mt-2 mb-2">
          <p className="text-gray-700">
            Considering {step.currentItem.name} (Value: {step.currentItem.value}, Weight: {step.currentItem.weight}, Ratio: {step.currentItem.ratio.toFixed(2)})
          </p>
          {step.fractionSelected !== undefined && (
            <p className="text-green-600">
              {step.fractionSelected === 1 
                ? `Added the entire item to the knapsack` 
                : step.fractionSelected > 0 
                  ? `Added ${(step.fractionSelected * 100).toFixed(0)}% of the item to the knapsack` 
                  : `Knapsack is full, cannot add more items`}
            </p>
          )}
        </div>
      )}
      
      {step.totalValue > 0 && step.currentWeight > 0 && (
        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="font-semibold text-gray-800">Current Status</p>
          <p className="text-gray-700">Total Weight: {step.currentWeight} / {step.capacity}</p>
          <p className="text-gray-700">Total Value: {step.totalValue.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

const FractionalKnapsackVisualization = () => {
  // Default items data
  const defaultItems = [
    new Item(1, "Item 1", 60, 10),
    new Item(2, "Item 2", 100, 20),
    new Item(3, "Item 3", 120, 30),
    new Item(4, "Item 4", 80, 15),
    new Item(5, "Item 5", 40, 5),
    new Item(6, "Item 6", 70, 8),
  ];
  
  // Knapsack capacity
  const capacity = 15;

  // Fractional Knapsack algorithm
  const fractionalKnapsack = (itemData, knapsackWeight) => {
    // Sort items by value/weight ratio in decreasing order
    const sortedItems = [...itemData].sort((a, b) => b.ratio - a.ratio);
    
    // Initialize variables
    let currentWeight = 0;
    let totalValue = 0;
    
    // Initialize steps for visualization
    const visualizationSteps = [];
    
    // Add initial step
    visualizationSteps.push({
      title: 'Sort items by value/weight ratio',
      description: 'Sort all items in decreasing order of value/weight ratio',
      items: sortedItems.map(item => ({ ...item })),
      currentWeight: 0,
      totalValue: 0,
      currentItem: null,
      capacity: knapsackWeight
    });
    
    // Process each item
    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      
      // Make a copy of current item for step
      const currentItem = { ...item };
      
      // Calculate how much of the item we can add
      const remainingCapacity = knapsackWeight - currentWeight;
      let fractionSelected = 0;
      
      if (remainingCapacity > 0) {
        if (item.weight <= remainingCapacity) {
          // We can add the entire item
          fractionSelected = 1;
          currentWeight += item.weight;
          totalValue += item.value;
          item.selected = 1;
        } else {
          // We can add only a fraction of the item
          fractionSelected = remainingCapacity / item.weight;
          currentWeight += remainingCapacity;
          totalValue += item.value * fractionSelected;
          item.selected = fractionSelected;
        }
      }
      
      // Create a deep copy of current state for the step
      const itemsStateCopy = sortedItems.map(i => ({ 
        ...i,
        highlighted: i.id === item.id
      }));
      
      // Add step for this item
      visualizationSteps.push({
        title: `Process ${item.name}`,
        description: fractionSelected === 1 
          ? `Added ${item.name} completely to the knapsack (weight: ${item.weight}, value: ${item.value})`
          : fractionSelected > 0 
            ? `Added ${(fractionSelected * 100).toFixed(0)}% of ${item.name} to the knapsack (weight: ${(fractionSelected * item.weight).toFixed(2)}, value: ${(fractionSelected * item.value).toFixed(2)})`
            : `Cannot add ${item.name} as the knapsack is full`,
        items: itemsStateCopy,
        currentWeight,
        totalValue,
        currentItem,
        fractionSelected,
        capacity: knapsackWeight
      });
      
      // If knapsack is full, break
      if (currentWeight >= knapsackWeight) {
        break;
      }
    }
    
    // Add final step
    visualizationSteps.push({
      title: 'Final Result',
      description: `Completed knapsack filling with maximum value: ${totalValue.toFixed(2)}`,
      items: sortedItems.map(item => ({ ...item })),
      currentWeight,
      totalValue,
      currentItem: null,
      capacity: knapsackWeight
    });
    
    return {
      selectedItems: sortedItems.filter(item => item.selected > 0),
      totalWeight: currentWeight,
      totalValue,
      visualizationSteps
    };
  };

  // Generate initial data for the visualization
  const generateInitialData = () => {
    // Run the fractional knapsack algorithm
    const { visualizationSteps } = fractionalKnapsack(defaultItems, capacity);
    
    // Return initial step data
    return {
      step: visualizationSteps[0]
    };
  };
  
  // Generate visualization steps
  const generateVisualizationSteps = (initialData) => {
    // Run the fractional knapsack algorithm
    const { visualizationSteps } = fractionalKnapsack(defaultItems, capacity);
    
    // Format steps for the visualization container
    return visualizationSteps.map((step, index) => ({
      description: step.description,
      data: {
        step: step
      }
    }));
  };

  return (
    <VisualizationContainer
      algorithmName="Fractional Knapsack"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={FractionalKnapsackVisualizationComponent}
      description="The fractional knapsack problem is a greedy algorithm that maximizes value by selecting items or fractions of items based on their value-to-weight ratio."
    />
  );
};

export default FractionalKnapsackVisualization; 