import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample graph for BFS
const generateSampleGraph = () => {
  // Create a simple connected graph with 8 nodes
  const nodes = [
    { label: "A" },
    { label: "B" },
    { label: "C" },
    { label: "D" },
    { label: "E" },
    { label: "F" },
    { label: "G" },
    { label: "H" }
  ];
  
  // Create undirected edges between nodes
  const edges = [
    { source: 0, target: 1 }, // A - B
    { source: 0, target: 2 }, // A - C
    { source: 1, target: 3 }, // B - D
    { source: 1, target: 4 }, // B - E
    { source: 2, target: 5 }, // C - F
    { source: 2, target: 6 }, // C - G
    { source: 3, target: 7 }, // D - H
    { source: 4, target: 7 }, // E - H
    { source: 5, target: 7 }, // F - H
    { source: 6, target: 7 }  // G - H
  ];
  
  // Start BFS from node A (index 0)
  const startNode = 0;
  
  return {
    nodes,
    edges,
    visitedNodes: [],
    activeNodes: [],
    currentNode: null,
    nextNodes: [startNode],
    queue: [],
    path: []
  };
};

// BFS algorithm visualization steps generator
const generateBFSSteps = (initialData) => {
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
        queue: [],
        path: []
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  const { nodes, edges } = data;
  
  // Generate adjacency list for the graph
  const adjacencyList = Array(nodes.length).fill().map(() => []);
  edges.forEach(edge => {
    adjacencyList[edge.source].push(edge.target);
    // For undirected graphs, add the reverse edge as well
    if (!edge.directed) {
      adjacencyList[edge.target].push(edge.source);
    }
  });
  
  // Initialize BFS data structures
  const visited = Array(nodes.length).fill(false);
  const queue = [0]; // Start BFS from the first node (index 0)
  const visitedNodes = [];
  const path = [];
  
  // Add initial state
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [],
      activeNodes: [],
      currentNode: null,
      nextNodes: [0], // Start node
      queue: [0],
      path: []
    },
    description: "Starting BFS from node A. All nodes are initially unvisited, and we add the start node to the queue.",
    codeHighlight: "procedure BFS(G, start):\n    let Q be a queue\n    label start as discovered\n    Q.enqueue(start)",
    complexityInfo: "Time Complexity: O(V + E) where V is number of vertices and E is number of edges"
  });
  
  // BFS traversal
  while (queue.length > 0) {
    // Dequeue a vertex from queue
    const currentNode = queue.shift();
    
    // Skip if already visited (shouldn't happen with proper BFS, but just in case)
    if (visited[currentNode]) continue;
    
    // Mark current node as visited
    visited[currentNode] = true;
    visitedNodes.push(currentNode);
    
    // Add step for visiting the current node
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [...visitedNodes],
        activeNodes: [],
        currentNode,
        nextNodes: [],
        queue: [...queue],
        path: [...path]
      },
      description: `Dequeue node ${nodes[currentNode].label} from the queue and mark it as visited.`,
      codeHighlight: "    while Q is not empty do:\n        v := Q.dequeue()",
      complexityInfo: `Visited ${visitedNodes.length} out of ${nodes.length} nodes`
    });
    
    // Get all adjacent vertices
    const neighbors = adjacencyList[currentNode];
    const unvisitedNeighbors = neighbors.filter(neighbor => !visited[neighbor]);
    
    // If there are neighbors to process
    if (unvisitedNeighbors.length > 0) {
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: [...visitedNodes],
          activeNodes: unvisitedNeighbors,
          currentNode,
          nextNodes: [],
          queue: [...queue],
          path: [...path]
        },
        description: `Checking unvisited neighbors of node ${nodes[currentNode].label}: ${unvisitedNeighbors.map(n => nodes[n].label).join(", ")}.`,
        codeHighlight: "        for all edges from v to w in G.adjacentEdges(v) do:",
        complexityInfo: `Found ${unvisitedNeighbors.length} unvisited neighbors`
      });
    }
    
    // Process neighbors
    for (const neighbor of unvisitedNeighbors) {
      // Add neighbor to queue if not visited
      if (!visited[neighbor]) {
        queue.push(neighbor);
        
        // Add edge to the path
        path.push({
          source: currentNode,
          target: neighbor
        });
        
        // Add step for each neighbor being added to queue
        steps.push({
          data: {
            nodes: [...nodes],
            edges: [...edges],
            visitedNodes: [...visitedNodes],
            activeNodes: [neighbor],
            currentNode,
            nextNodes: [...queue],
            queue: [...queue],
            path: [...path]
          },
          description: `Add unvisited neighbor ${nodes[neighbor].label} to the queue.`,
          codeHighlight: "            if w is not labeled as discovered then\n                label w as discovered\n                Q.enqueue(w)",
          complexityInfo: `Queue now contains ${queue.length} nodes`
        });
      }
    }
  }
  
  // Add final state
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [...visitedNodes],
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      queue: [],
      path: [...path]
    },
    description: "BFS traversal complete. We have visited all reachable nodes from the starting node.",
    codeHighlight: "end procedure",
    complexityInfo: `Total nodes visited: ${visitedNodes.length}`
  });
  
  return steps;
};

const BFSVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Breadth-First Search (BFS)"
      initialData={initialData}
      generateSteps={generateBFSSteps}
      VisualizationComponent={GraphVisualization}
      description="Breadth-First Search is a graph traversal algorithm that explores all neighbor nodes at the present depth before moving to nodes at the next depth level."
    />
  );
};

export default BFSVisualization; 