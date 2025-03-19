import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample graph for DFS
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
  
  // Start DFS from node A (index 0)
  const startNode = 0;
  
  return {
    nodes,
    edges,
    visitedNodes: [],
    activeNodes: [],
    currentNode: null,
    nextNodes: [startNode],
    stack: [],
    path: []
  };
};

// DFS algorithm visualization steps generator
const generateDFSSteps = (initialData) => {
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
        stack: [],
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
  
  // Initialize DFS data structures
  const visited = Array(nodes.length).fill(false);
  const stack = [0]; // Start DFS from the first node (index 0)
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
      stack: [0],
      path: []
    },
    description: "Starting DFS from node A. All nodes are initially unvisited, and we add the start node to the stack.",
    codeHighlight: "procedure DFS(G, v):\n    label v as discovered",
    complexityInfo: "Time Complexity: O(V + E) where V is number of vertices and E is number of edges"
  });
  
  // Helper function for recursive DFS
  const dfsRecursive = (node, depth = 0) => {
    // Mark current node as visited
    visited[node] = true;
    visitedNodes.push(node);
    
    // Add step for visiting the current node
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [...visitedNodes],
        activeNodes: [],
        currentNode: node,
        nextNodes: [],
        stack: [...stack],
        path: [...path]
      },
      description: `Visit node ${nodes[node].label} and mark it as discovered.`,
      codeHighlight: "    label v as discovered",
      complexityInfo: `Visited ${visitedNodes.length} out of ${nodes.length} nodes | Recursion depth: ${depth}`
    });
    
    // Get all adjacent vertices that aren't visited
    const neighbors = adjacencyList[node];
    const unvisitedNeighbors = neighbors.filter(neighbor => !visited[neighbor]);
    
    // If there are neighbors to process
    if (unvisitedNeighbors.length > 0) {
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: [...visitedNodes],
          activeNodes: unvisitedNeighbors,
          currentNode: node,
          nextNodes: [],
          stack: [...stack],
          path: [...path]
        },
        description: `Checking unvisited neighbors of node ${nodes[node].label}: ${unvisitedNeighbors.map(n => nodes[n].label).join(", ")}.`,
        codeHighlight: "    for all edges from v to w in G.adjacentEdges(v) do",
        complexityInfo: `Found ${unvisitedNeighbors.length} unvisited neighbors`
      });
    }
    
    // Process neighbors in DFS order
    for (const neighbor of unvisitedNeighbors) {
      // Only process if neighbor is not visited
      if (!visited[neighbor]) {
        // Push neighbor to stack to visualize the execution stack
        stack.push(neighbor);
        
        // Add edge to the path
        path.push({
          source: node,
          target: neighbor
        });
        
        // Add step for each neighbor being processed
        steps.push({
          data: {
            nodes: [...nodes],
            edges: [...edges],
            visitedNodes: [...visitedNodes],
            activeNodes: [neighbor],
            currentNode: node,
            nextNodes: [neighbor],
            stack: [...stack],
            path: [...path]
          },
          description: `Preparing to explore unvisited neighbor ${nodes[neighbor].label}.`,
          codeHighlight: "        if w is not labeled as discovered then\n            recursively call DFS(G, w)",
          complexityInfo: `Stack size: ${stack.length}`
        });
        
        // Recursive call
        dfsRecursive(neighbor, depth + 1);
        
        // Pop from stack when returning from recursion
        stack.pop();
        
        // Add backtracking step
        if (stack.length > 0) {
          steps.push({
            data: {
              nodes: [...nodes],
              edges: [...edges],
              visitedNodes: [...visitedNodes],
              activeNodes: [],
              currentNode: stack[stack.length - 1],
              nextNodes: [],
              stack: [...stack],
              path: [...path]
            },
            description: `Backtracking to node ${nodes[stack[stack.length - 1]].label} after exploring all paths from ${nodes[neighbor].label}.`,
            codeHighlight: "        end if\n    end for",
            complexityInfo: `Stack size after backtracking: ${stack.length}`
          });
        }
      }
    }
  };
  
  // Start DFS from the first node
  dfsRecursive(0);
  
  // Add final state
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [...visitedNodes],
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      stack: [],
      path: [...path]
    },
    description: "DFS traversal complete. We have visited all reachable nodes from the starting node.",
    codeHighlight: "end procedure",
    complexityInfo: `Total nodes visited: ${visitedNodes.length}`
  });
  
  return steps;
};

const DFSVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Depth-First Search (DFS)"
      initialData={initialData}
      generateSteps={generateDFSSteps}
      VisualizationComponent={GraphVisualization}
      description="Depth-First Search is a graph traversal algorithm that explores as far as possible along each branch before backtracking, using a stack data structure (implicitly via recursion)."
    />
  );
};

export default DFSVisualization; 