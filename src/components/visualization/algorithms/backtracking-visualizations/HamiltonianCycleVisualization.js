import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Generate initial data for the visualization
const generateInitialData = () => {
  // Example graph represented as an adjacency matrix
  const graph = [
    [0, 1, 0, 1, 0],
    [1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ];
  
  return {
    graph,
    path: [],
    visited: [],
    currentVertex: null,
    isExploring: false,
    isBacktracking: false,
    pathHistory: []
  };
};

// Fixed node positions in a pentagon shape
const calculateNodePositions = (graph, size = 400) => {
  if (!graph || graph.length === 0) return [];
  
  const numNodes = graph.length;
  const positions = [];
  const radius = size * 0.35; // Use 35% of the SVG size as radius
  const center = 0; // Center offset (will be added in the transform)
  
  // Place nodes in a pentagon shape (works well for Hamiltonian Cycle example)
  // For 5 nodes, we'll place them in a pentagon shape
  for (let i = 0; i < numNodes; i++) {
    // Calculate angle (72 degrees per node for pentagon)
    const angle = (i * 2 * Math.PI / numNodes) - Math.PI / 2; // Start from top
    
    // Calculate x and y position
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    
    positions.push({ x, y });
  }
  
  return positions;
};

// Generate steps for the Hamiltonian Cycle visualization
const generateVisualizationSteps = (initialData) => {
  const { graph } = initialData;
  const steps = [];
  
  // Initial state
  steps.push({
    title: "Step 1: Initialization",
    description: "Starting with vertex 0",
    data: {
      graph: graph,
      path: [0],
      visited: [0],
      currentVertex: 0,
      isExploring: false,
      isBacktracking: false,
      pathHistory: ["Start at vertex 0"]
    }
  });
  
  // Example step 2: Add vertex 1 to path
  steps.push({
    title: "Step 2: Explore Neighbors",
    description: "Add vertex 1 to the path",
    data: {
      graph: graph,
      path: [0, 1],
      visited: [0, 1],
      currentVertex: 1,
      isExploring: true,
      isBacktracking: false,
      pathHistory: ["Start at vertex 0", "Add vertex 1 to path"]
    }
  });
  
  // Example step 3: Add vertex 2 to path
  steps.push({
    title: "Step 3: Continue Path",
    description: "Add vertex 2 to the path",
    data: {
      graph: graph,
      path: [0, 1, 2],
      visited: [0, 1, 2],
      currentVertex: 2,
      isExploring: true,
      isBacktracking: false,
      pathHistory: ["Start at vertex 0", "Add vertex 1 to path", "Add vertex 2 to path"]
    }
  });
  
  // Example step 4: Add vertex 4 to path
  steps.push({
    title: "Step 4: Continue Path",
    description: "Add vertex 4 to the path",
    data: {
      graph: graph,
      path: [0, 1, 2, 4],
      visited: [0, 1, 2, 4],
      currentVertex: 4,
      isExploring: true,
      isBacktracking: false,
      pathHistory: ["Start at vertex 0", "Add vertex 1 to path", "Add vertex 2 to path", "Add vertex 4 to path"]
    }
  });
  
  // Example step 5: Add vertex 3 to path (complete cycle)
  steps.push({
    title: "Step 5: Complete Path",
    description: "Add vertex 3 to form a potential cycle",
    data: {
      graph: graph,
      path: [0, 1, 2, 4, 3],
      visited: [0, 1, 2, 3, 4],
      currentVertex: 3,
      isExploring: true,
      isBacktracking: false,
      pathHistory: ["Start at vertex 0", "Add vertex 1 to path", "Add vertex 2 to path", "Add vertex 4 to path", "Add vertex 3 to path"]
    }
  });
  
  // Example step 6: Check if cycle exists
  steps.push({
    title: "Step 6: Verify Cycle",
    description: "Check if last vertex connects back to start",
    data: {
      graph: graph,
      path: [0, 1, 2, 4, 3],
      visited: [0, 1, 2, 3, 4],
      currentVertex: 0,
      isExploring: false,
      isBacktracking: false,
      pathHistory: ["Start at vertex 0", "Add vertex 1 to path", "Add vertex 2 to path", "Add vertex 4 to path", "Add vertex 3 to path", "Check connection back to vertex 0"]
    }
  });
  
  // Example step 7: Hamiltonian cycle found
  steps.push({
    title: "Step 7: Hamiltonian Cycle Found",
    description: "Complete Hamiltonian cycle: 0 → 1 → 2 → 4 → 3 → 0",
    data: {
      graph: graph,
      path: [0, 1, 2, 4, 3],
      visited: [0, 1, 2, 3, 4],
      currentVertex: null,
      isExploring: false,
      isBacktracking: false,
      pathHistory: ["Start at vertex 0", "Add vertex 1 to path", "Add vertex 2 to path", "Add vertex 4 to path", "Add vertex 3 to path", "Hamiltonian cycle found!"]
    }
  });
  
  return steps;
};

// The main visualization component
const HamiltonianCycleVisualizationComponent = ({ data, step, stepInfo }) => {
  const { graph, path, visited, currentVertex, isExploring, isBacktracking, pathHistory } = data || {};
  
  // Calculate node positions
  const nodePositions = useMemo(() => {
    if (!graph) return [];
    return calculateNodePositions(graph);
  }, [graph]);

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

  // Render the graph visualization
  const renderGraph = () => {
    if (!graph || !Array.isArray(graph) || graph.length === 0) return null;

    const size = 400;
    const center = size / 2;
    const nodeRadius = 25;

    return (
      <div className="relative w-full max-w-2xl mx-auto aspect-square border border-gray-200 rounded-lg">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
          style={{ background: 'white' }}
        >
          {/* Draw edges */}
          {graph.map((row, i) => (
            row.map((hasEdge, j) => {
              if (hasEdge && i !== j) {
                const start = nodePositions[i];
                const end = nodePositions[j];
                if (!start || !end) return null;
                
                const isInPath = path && path.includes(i) && path.includes(j) &&
                  Math.abs(path.indexOf(i) - path.indexOf(j)) === 1;

                return (
                  <motion.line
                    key={`edge-${i}-${j}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    x1={center + start.x}
                    y1={center + start.y}
                    x2={center + end.x}
                    y2={center + end.y}
                    stroke={isInPath ? "#4CAF50" : "#E5E7EB"}
                    strokeWidth={isInPath ? 3 : 2}
                    strokeLinecap="round"
                  />
                );
              }
              return null;
            })
          ))}

          {/* Draw nodes */}
          {nodePositions.map((pos, i) => {
            if (!pos) return null;
            
            let fillColor = "#F3F4F6"; // Default light gray
            let strokeColor = "#9CA3AF"; // Default border
            let strokeWidth = 2;
            
            if (i === currentVertex) {
              fillColor = "#FEF3C7"; // Light yellow
              strokeColor = "#F59E0B"; // Yellow border
              strokeWidth = 3;
            } else if (path && path.includes(i)) {
              fillColor = "#D1FAE5"; // Light green
              strokeColor = "#4CAF50"; // Green border
              strokeWidth = 3;
            } else if (visited && visited.includes(i)) {
              fillColor = "#DBEAFE"; // Light blue
              strokeColor = "#3B82F6"; // Blue border
              strokeWidth = 3;
            }

            return (
              <motion.g
                key={`node-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                transform={`translate(${center + pos.x}, ${center + pos.y})`}
              >
                <circle
                  r={nodeRadius}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="shadow-lg"
                />
                <text
                  fill={strokeColor}
                  textAnchor="middle"
                  dy="0.3em"
                  fontSize="16"
                  fontWeight="600"
                >
                  {i}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Render path history
  const renderPathHistory = () => {
    if (!pathHistory || pathHistory.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Path History:</h4>
        <ul className="space-y-1">
          {pathHistory.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-sm text-gray-600"
            >
              {step}
            </motion.li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderStepInfo()}
      {renderGraph()}
      {renderPathHistory()}
    </div>
  );
};

const HamiltonianCycleVisualization = () => {
  return (
    <VisualizationContainer
      algorithmName="Hamiltonian Cycle"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={HamiltonianCycleVisualizationComponent}
      description="The Hamiltonian Cycle problem is to find a cycle that visits each vertex exactly once in a graph."
    />
  );
};

export default HamiltonianCycleVisualization; 