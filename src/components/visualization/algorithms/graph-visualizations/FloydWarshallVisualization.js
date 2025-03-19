import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample weighted graph for Floyd-Warshall algorithm
const generateSampleGraph = () => {
  // Create a graph with 5 nodes for clarity
  const nodes = [
    { label: "A" },
    { label: "B" },
    { label: "C" },
    { label: "D" },
    { label: "E" }
  ];
  
  // Create weighted edges (some with negative weights)
  const edges = [
    { source: 0, target: 1, weight: 3, directed: true },   // A -> B
    { source: 0, target: 2, weight: 8, directed: true },   // A -> C
    { source: 1, target: 2, weight: 4, directed: true },   // B -> C
    { source: 1, target: 3, weight: 1, directed: true },   // B -> D
    { source: 2, target: 4, weight: 7, directed: true },   // C -> E
    { source: 3, target: 2, weight: -5, directed: true },  // D -> C (negative)
    { source: 3, target: 4, weight: 6, directed: true },   // D -> E
  ];
  
  // Initialize distance matrix for all-pairs shortest paths
  const numNodes = nodes.length;
  const distMatrix = Array(numNodes).fill().map(() => Array(numNodes).fill(Infinity));
  
  // Set distance to self to 0
  for (let i = 0; i < numNodes; i++) {
    distMatrix[i][i] = 0;
  }
  
  // Set direct edges weights
  for (const edge of edges) {
    distMatrix[edge.source][edge.target] = edge.weight;
  }
  
  return {
    nodes,
    edges,
    visitedNodes: [],
    activeNodes: [],
    currentNode: null,
    nextNodes: [],
    distMatrix: distMatrix,
    path: [],
    currentK: -1,  // For tracking the k value in the algorithm
    currentPair: [-1, -1], // For tracking the current pair being considered
    hasNegativeCycle: false
  };
};

// Floyd-Warshall algorithm visualization steps generator
const generateFloydWarshallSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.nodes || !initialData.edges) {
    return [{
      data: {
        nodes: [],
        edges: [],
        visitedNodes: [],
        activeNodes: [],
        currentNode: null,
        nextNodes: [],
        distMatrix: [],
        path: [],
        currentK: -1,
        currentPair: [-1, -1],
        hasNegativeCycle: false
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  const { nodes, edges, distMatrix } = data;
  const numNodes = nodes.length;
  
  // Add initial state - distance matrix before algorithm begins
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [],
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      distMatrix: JSON.parse(JSON.stringify(distMatrix)),
      path: [],
      currentK: -1,
      currentPair: [-1, -1],
      hasNegativeCycle: false
    },
    description: "Initialize the Floyd-Warshall algorithm with the distance matrix. Direct edges have their weights, diagonals are 0, and all other pairs are infinity.",
    codeHighlight: "procedure FloydWarshall(G: graph with n vertices):\n    // Initialize distance matrix dist\n    let dist be a n×n matrix\n    for i := 1 to n do\n        for j := 1 to n do\n            if i = j then\n                dist[i][j] := 0\n            else if edge (i, j) exists in G then\n                dist[i][j] := weight of edge (i, j)\n            else\n                dist[i][j] := infinity\n    end initialization",
    complexityInfo: "Time Complexity: O(V³) where V is the number of vertices"
  });
  
  // Main Floyd-Warshall algorithm
  // For each vertex as an intermediate point
  for (let k = 0; k < numNodes; k++) {
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: Array.from({ length: k }, (_, i) => i),
        activeNodes: [k],
        currentNode: k,
        nextNodes: [],
        distMatrix: JSON.parse(JSON.stringify(distMatrix)),
        path: [],
        currentK: k,
        currentPair: [-1, -1],
        hasNegativeCycle: false
      },
      description: `Starting iteration with ${nodes[k].label} as the intermediate vertex (k=${k}).`,
      codeHighlight: "    for k := 1 to n do",
      complexityInfo: `Intermediate vertex: ${nodes[k].label} (${k+1}/${numNodes})`
    });
    
    // For each pair of vertices
    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        // Skip self-connections as they're always 0
        if (i === j) continue;
        
        // Current direct distance
        const directDist = distMatrix[i][j];
        
        // Distance through intermediate vertex k
        const throughK = distMatrix[i][k] + distMatrix[k][j];
        
        // Visual paths for this step
        const currentPath = [];
        if (distMatrix[i][j] !== Infinity) {
          // If there's a direct edge
          const edgeIdx = edges.findIndex(e => e.source === i && e.target === j);
          if (edgeIdx !== -1) {
            currentPath.push({ source: i, target: j });
          }
        }
        
        // Highlight the current pair being evaluated
        steps.push({
          data: {
            nodes: [...nodes],
            edges: [...edges],
            visitedNodes: Array.from({ length: k }, (_, idx) => idx),
            activeNodes: [i, j],
            currentNode: k,
            nextNodes: [],
            distMatrix: JSON.parse(JSON.stringify(distMatrix)),
            path: currentPath,
            currentK: k,
            currentPair: [i, j],
            hasNegativeCycle: false
          },
          description: `Checking if path from ${nodes[i].label} to ${nodes[j].label} can be improved by going through ${nodes[k].label}.
                        Current distance: ${directDist === Infinity ? "∞" : directDist}
                        Distance through ${nodes[k].label}: ${distMatrix[i][k] === Infinity || distMatrix[k][j] === Infinity ? "∞" : `${distMatrix[i][k]} + ${distMatrix[k][j]} = ${throughK}`}`,
          codeHighlight: "        for i := 1 to n do\n            for j := 1 to n do\n                if dist[i][j] > dist[i][k] + dist[k][j] then",
          complexityInfo: `Evaluating path: ${nodes[i].label} -> ${nodes[k].label} -> ${nodes[j].label}`
        });
        
        // If path through k is shorter, update the distance
        if (distMatrix[i][k] !== Infinity && distMatrix[k][j] !== Infinity && directDist > throughK) {
          distMatrix[i][j] = throughK;
          
          // Update path visualization for the improved path
          const improvedPath = [
            { source: i, target: k },
            { source: k, target: j }
          ];
          
          steps.push({
            data: {
              nodes: [...nodes],
              edges: [...edges],
              visitedNodes: Array.from({ length: k }, (_, idx) => idx),
              activeNodes: [],
              currentNode: k,
              nextNodes: [],
              distMatrix: JSON.parse(JSON.stringify(distMatrix)),
              path: improvedPath,
              currentK: k,
              currentPair: [i, j],
              hasNegativeCycle: false
            },
            description: `Path improved! Updated distance from ${nodes[i].label} to ${nodes[j].label} to ${throughK} by going through ${nodes[k].label}.`,
            codeHighlight: "                    dist[i][j] := dist[i][k] + dist[k][j]",
            complexityInfo: `New distance from ${nodes[i].label} to ${nodes[j].label}: ${throughK}`
          });
        }
      }
    }
  }
  
  // Check for negative cycles (if any vertex has a negative distance to itself)
  let hasNegativeCycle = false;
  for (let i = 0; i < numNodes; i++) {
    if (distMatrix[i][i] < 0) {
      hasNegativeCycle = true;
      
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: Array.from({ length: numNodes }, (_, idx) => idx),
          activeNodes: [i],
          currentNode: null,
          nextNodes: [],
          distMatrix: JSON.parse(JSON.stringify(distMatrix)),
          path: [],
          currentK: numNodes - 1,
          currentPair: [i, i],
          hasNegativeCycle: true
        },
        description: `Negative cycle detected! Vertex ${nodes[i].label} has a negative distance (${distMatrix[i][i]}) to itself.`,
        codeHighlight: "    // Check for negative cycles\n    for i := 1 to n do\n        if dist[i][i] < 0 then\n            return \"Graph contains a negative cycle\"",
        complexityInfo: "Negative cycle found - some shortest paths are not well-defined"
      });
      
      break;
    }
  }
  
  // Final state - complete distance matrix
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: Array.from({ length: numNodes }, (_, idx) => idx),
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      distMatrix: JSON.parse(JSON.stringify(distMatrix)),
      path: [],
      currentK: numNodes - 1,
      currentPair: [-1, -1],
      hasNegativeCycle: hasNegativeCycle
    },
    description: hasNegativeCycle 
      ? "Floyd-Warshall algorithm complete. A negative cycle was detected, meaning some shortest paths are not well-defined." 
      : "Floyd-Warshall algorithm complete. The distance matrix now contains the shortest path distances between all pairs of vertices.",
    codeHighlight: "end procedure",
    complexityInfo: "Algorithm completed with time complexity O(V³)"
  });
  
  return steps;
};

// Custom visualization component for Floyd-Warshall that shows the distance matrix
const FloydWarshallVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    nodes = [], 
    edges = [], 
    visitedNodes = [], 
    activeNodes = [], 
    currentNode = null,
    distMatrix = [],
    path = [],
    currentK = -1,
    currentPair = [-1, -1],
    hasNegativeCycle = false
  } = data || {};

  const renderDistanceMatrix = () => {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-md overflow-x-auto">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Distance Matrix</h3>
        <div className="min-h-[200px]">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className="p-2 border border-gray-300 bg-gray-100 w-12"></th>
                {nodes.map((node, idx) => (
                  <th 
                    key={`header-${idx}`} 
                    className={`p-2 border border-gray-300 text-center w-12 ${
                      idx === currentK ? 'bg-purple-100' : 'bg-gray-100'
                    }`}
                  >
                    {node.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {distMatrix.map((row, i) => (
                <tr key={`row-${i}`}>
                  <th 
                    className={`p-2 border border-gray-300 text-center w-12 ${
                      i === currentK ? 'bg-purple-100' : 'bg-gray-100'
                    }`}
                  >
                    {nodes[i]?.label}
                  </th>
                  {row.map((dist, j) => (
                    <td 
                      key={`cell-${i}-${j}`} 
                      className={`p-2 border border-gray-300 text-center w-12 ${
                        (i === currentPair[0] && j === currentPair[1]) 
                          ? 'bg-yellow-100' 
                          : (i === j && dist < 0) 
                            ? 'bg-red-100'
                            : ''
                      }`}
                    >
                      {dist === Infinity ? '∞' : dist}
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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow">
        <GraphVisualization 
          data={{
            nodes,
            edges,
            visitedNodes,
            activeNodes,
            currentNode,
            nextNodes: [],
            path
          }}
          step={step}
          stepInfo={stepInfo}
        />
      </div>
      {renderDistanceMatrix()}
    </div>
  );
};

const FloydWarshallVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Floyd-Warshall Algorithm"
      initialData={initialData}
      generateSteps={generateFloydWarshallSteps}
      VisualizationComponent={FloydWarshallVisualizationComponent}
      description="The Floyd-Warshall Algorithm finds the shortest paths between all pairs of vertices in a weighted graph. It works with both positive and negative edge weights, though it cannot handle negative cycles."
    />
  );
};

export default FloydWarshallVisualization; 