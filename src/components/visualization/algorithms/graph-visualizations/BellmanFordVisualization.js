import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample weighted graph for Bellman-Ford algorithm
// Includes negative weights to show advantage over Dijkstra
const generateSampleGraph = () => {
  // Create a graph with 7 nodes
  const nodes = [
    { label: "A" },
    { label: "B" },
    { label: "C" },
    { label: "D" },
    { label: "E" },
    { label: "F" },
    { label: "G" }
  ];
  
  // Create weighted edges, including some negative weights
  const edges = [
    { source: 0, target: 1, weight: 6, directed: true },    // A -> B
    { source: 0, target: 2, weight: 5, directed: true },    // A -> C
    { source: 0, target: 3, weight: 5, directed: true },    // A -> D
    { source: 1, target: 4, weight: -1, directed: true },   // B -> E (negative)
    { source: 2, target: 1, weight: -2, directed: true },   // C -> B (negative)
    { source: 2, target: 4, weight: 1, directed: true },    // C -> E
    { source: 3, target: 2, weight: -2, directed: true },   // D -> C (negative)
    { source: 3, target: 5, weight: -1, directed: true },   // D -> F (negative)
    { source: 4, target: 6, weight: 3, directed: true },    // E -> G
    { source: 5, target: 6, weight: 3, directed: true }     // F -> G
  ];
  
  // Start Bellman-Ford from node A (index 0)
  const startNode = 0;
  
  return {
    nodes,
    edges,
    visitedNodes: [],
    activeNodes: [],
    currentNode: null,
    nextNodes: [],
    distances: Array(nodes.length).fill(Infinity),
    previousNodes: Array(nodes.length).fill(null),
    path: [],
    startNode,
    hasNegativeCycle: false
  };
};

// Bellman-Ford algorithm visualization steps generator
const generateBellmanFordSteps = (initialData) => {
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
        distances: [],
        previousNodes: [],
        path: [],
        hasNegativeCycle: false
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  const { nodes, edges, startNode } = data;
  
  // Initialize Bellman-Ford data structures
  const distances = Array(nodes.length).fill(Infinity);
  distances[startNode] = 0;
  const previousNodes = Array(nodes.length).fill(null);
  const path = [];
  let hasNegativeCycle = false;
  
  // Add initial state
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [],
      activeNodes: [],
      currentNode: startNode,
      nextNodes: [],
      distances: [...distances],
      previousNodes: [...previousNodes],
      path: [],
      hasNegativeCycle
    },
    description: "Initialize Bellman-Ford algorithm. Set distance to start node as 0 and all other distances as infinity.",
    codeHighlight: "procedure BellmanFord(G, start):\n    for each vertex v in G do\n        distance[v] := infinity\n        previous[v] := undefined\n    end for\n    distance[start] := 0",
    complexityInfo: "Time Complexity: O(V * E) where V is the number of vertices and E is the number of edges"
  });
  
  // Main relaxation loop - repeat |V| - 1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    let relaxationOccurred = false;
    
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: Array.from({ length: nodes.length }, (_, index) => index),
        activeNodes: [],
        currentNode: null,
        nextNodes: [],
        distances: [...distances],
        previousNodes: [...previousNodes],
        path: [...path],
        hasNegativeCycle
      },
      description: `Starting relaxation iteration ${i + 1} of ${nodes.length - 1}.`,
      codeHighlight: "    for i := 1 to |V| - 1 do",
      complexityInfo: `Iteration ${i + 1} of ${nodes.length - 1}`
    });
    
    // Relax all edges
    for (const edge of edges) {
      const { source, target, weight } = edge;
      
      // Skip if source node is unreachable
      if (distances[source] === Infinity) continue;
      
      // Calculate potential new distance
      const newDistance = distances[source] + weight;
      
      // Current path info for display
      const currentDistance = distances[target];
      
      // Show edge being checked
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: Array.from({ length: nodes.length }, (_, index) => index),
          activeNodes: [source, target],
          currentNode: null,
          nextNodes: [],
          distances: [...distances],
          previousNodes: [...previousNodes],
          path: [...path],
          hasNegativeCycle
        },
        description: `Checking edge from ${nodes[source].label} to ${nodes[target].label} with weight ${weight}: ${distances[source]} + ${weight} = ${newDistance} vs current ${currentDistance === Infinity ? "∞" : currentDistance}.`,
        codeHighlight: "        for each edge (u, v) with weight w in G.edges do\n            if distance[u] + w < distance[v] then",
        complexityInfo: `Checking edge ${nodes[source].label} -> ${nodes[target].label}`
      });
      
      // If new path is shorter, update distance and previous node
      if (newDistance < currentDistance) {
        distances[target] = newDistance;
        previousNodes[target] = source;
        relaxationOccurred = true;
        
        // Update path visualization
        const existingPathIndex = path.findIndex(p => p.target === target);
        if (existingPathIndex !== -1) {
          path.splice(existingPathIndex, 1);
        }
        
        path.push({
          source,
          target
        });
        
        // Show update
        steps.push({
          data: {
            nodes: [...nodes],
            edges: [...edges],
            visitedNodes: Array.from({ length: nodes.length }, (_, index) => index),
            activeNodes: [target],
            currentNode: source,
            nextNodes: [],
            distances: [...distances],
            previousNodes: [...previousNodes],
            path: [...path],
            hasNegativeCycle
          },
          description: `Update: Distance to ${nodes[target].label} reduced from ${currentDistance === Infinity ? "∞" : currentDistance} to ${newDistance}. Previous node set to ${nodes[source].label}.`,
          codeHighlight: "                distance[v] := distance[u] + w\n                previous[v] := u",
          complexityInfo: `New distance to ${nodes[target].label}: ${newDistance}`
        });
      }
    }
    
    // If no relaxation occurred in this iteration, we can terminate early
    if (!relaxationOccurred) {
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: Array.from({ length: nodes.length }, (_, index) => index),
          activeNodes: [],
          currentNode: null,
          nextNodes: [],
          distances: [...distances],
          previousNodes: [...previousNodes],
          path: [...path],
          hasNegativeCycle
        },
        description: `No relaxation occurred in iteration ${i + 1}. Algorithm can terminate early as optimal distances have been found.`,
        codeHighlight: "    // Early termination optimization (not in basic algorithm)",
        complexityInfo: "Early termination detected - algorithm converged"
      });
      break;
    }
  }
  
  // Check for negative weight cycles - one more relaxation iteration
  let relaxationOccurred = false;
  
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: Array.from({ length: nodes.length }, (_, index) => index),
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      distances: [...distances],
      previousNodes: [...previousNodes],
      path: [...path],
      hasNegativeCycle
    },
    description: "Checking for negative weight cycles by running one additional relaxation iteration.",
    codeHighlight: "    // Check for negative-weight cycles\n    for each edge (u, v) with weight w in G.edges do",
    complexityInfo: "Starting negative cycle detection"
  });
  
  // One more relaxation step to detect negative cycles
  for (const edge of edges) {
    const { source, target, weight } = edge;
    
    // Skip if source node is unreachable
    if (distances[source] === Infinity) continue;
    
    // Calculate potential new distance
    const newDistance = distances[source] + weight;
    
    // Show edge being checked for negative cycle
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: Array.from({ length: nodes.length }, (_, index) => index),
        activeNodes: [source, target],
        currentNode: null,
        nextNodes: [],
        distances: [...distances],
        previousNodes: [...previousNodes],
        path: [...path],
        hasNegativeCycle
      },
      description: `Checking edge from ${nodes[source].label} to ${nodes[target].label} for negative cycle: ${distances[source]} + ${weight} = ${newDistance} vs current ${distances[target]}.`,
      codeHighlight: "        if distance[u] + w < distance[v] then",
      complexityInfo: `Checking for negative cycle on edge ${nodes[source].label} -> ${nodes[target].label}`
    });
    
    // If relaxation is still possible, we have a negative cycle
    if (newDistance < distances[target]) {
      hasNegativeCycle = true;
      relaxationOccurred = true;
      
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: Array.from({ length: nodes.length }, (_, index) => index),
          activeNodes: [source, target],
          currentNode: null,
          nextNodes: [],
          distances: [...distances],
          previousNodes: [...previousNodes],
          path: [...path],
          hasNegativeCycle
        },
        description: `Negative weight cycle detected! The distance to ${nodes[target].label} can still be reduced after |V|-1 iterations.`,
        codeHighlight: "            return \"Graph contains a negative-weight cycle\"",
        complexityInfo: "Negative cycle found - optimal shortest paths not possible"
      });
      
      break;
    }
  }
  
  // Final state
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: Array.from({ length: nodes.length }, (_, index) => index),
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      distances: [...distances],
      previousNodes: [...previousNodes],
      path: [...path],
      hasNegativeCycle
    },
    description: hasNegativeCycle 
      ? "Bellman-Ford algorithm complete. A negative weight cycle was detected. Shortest paths are not well-defined." 
      : "Bellman-Ford algorithm complete. The shortest path to each node has been found.",
    codeHighlight: "end procedure",
    complexityInfo: hasNegativeCycle
      ? "Result: Graph contains a negative-weight cycle"
      : `Final distances from ${nodes[startNode].label}: ${distances.map((d, i) => `${nodes[i].label}=${d === Infinity ? "∞" : d}`).join(", ")}`
  });
  
  return steps;
};

const BellmanFordVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Bellman-Ford Algorithm"
      initialData={initialData}
      generateSteps={generateBellmanFordSteps}
      VisualizationComponent={GraphVisualization}
      description="The Bellman-Ford Algorithm finds the shortest paths from a source vertex to all other vertices in a weighted graph. Unlike Dijkstra's algorithm, it can handle graphs with negative weight edges and detect negative weight cycles."
    />
  );
};

export default BellmanFordVisualization; 