import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample weighted graph for Dijkstra's algorithm
const generateSampleGraph = () => {
  // Create a simple weighted graph with 8 nodes
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
  
  // Create weighted edges between nodes
  const edges = [
    { source: 0, target: 1, weight: 4 },  // A - B
    { source: 0, target: 2, weight: 3 },  // A - C
    { source: 1, target: 3, weight: 5 },  // B - D
    { source: 1, target: 4, weight: 2 },  // B - E
    { source: 2, target: 5, weight: 6 },  // C - F
    { source: 2, target: 6, weight: 1 },  // C - G
    { source: 3, target: 7, weight: 3 },  // D - H
    { source: 4, target: 7, weight: 7 },  // E - H
    { source: 5, target: 7, weight: 8 },  // F - H
    { source: 6, target: 7, weight: 4 }   // G - H
  ];
  
  // Start Dijkstra's algorithm from node A (index 0)
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
    startNode
  };
};

// Helper function to find the node with minimum distance
const findMinDistanceNode = (distances, visited) => {
  let minDistance = Infinity;
  let minNode = -1;
  
  for (let i = 0; i < distances.length; i++) {
    if (!visited[i] && distances[i] < minDistance) {
      minDistance = distances[i];
      minNode = i;
    }
  }
  
  return minNode;
};

// Dijkstra's algorithm visualization steps generator
const generateDijkstraSteps = (initialData) => {
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
        path: []
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  const { nodes, edges, startNode } = data;
  
  // Generate adjacency list for the graph
  const adjacencyList = Array(nodes.length).fill().map(() => []);
  edges.forEach(edge => {
    adjacencyList[edge.source].push({ node: edge.target, weight: edge.weight });
    // For undirected graphs, add the reverse edge as well
    if (!edge.directed) {
      adjacencyList[edge.target].push({ node: edge.source, weight: edge.weight });
    }
  });
  
  // Initialize Dijkstra data structures
  const distances = Array(nodes.length).fill(Infinity);
  distances[startNode] = 0;
  const previousNodes = Array(nodes.length).fill(null);
  const visited = Array(nodes.length).fill(false);
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
      nextNodes: [startNode],
      distances: [...distances],
      previousNodes: [...previousNodes],
      path: []
    },
    description: "Initialize Dijkstra's algorithm. Set distance to start node as 0 and all other distances as infinity.",
    codeHighlight: "procedure Dijkstra(G, start):\n    for each vertex v in G do\n        distance[v] := infinity\n        previous[v] := undefined\n        visited[v] := false\n    end for\n    distance[start] := 0",
    complexityInfo: "Time Complexity: O((V + E) log V) with priority queue implementation"
  });
  
  // Main loop of Dijkstra's algorithm
  for (let i = 0; i < nodes.length; i++) {
    // Find the node with the minimum distance
    const currentNode = findMinDistanceNode(distances, visited);
    
    // If no reachable node found or all remaining nodes have infinite distance
    if (currentNode === -1 || distances[currentNode] === Infinity) {
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: [...visitedNodes],
          activeNodes: [],
          currentNode: null,
          nextNodes: [],
          distances: [...distances],
          previousNodes: [...previousNodes],
          path: [...path]
        },
        description: "No more nodes can be reached. Algorithm terminating early.",
        codeHighlight: "    if distance[u] = infinity then\n        break",
        complexityInfo: `Visited ${visitedNodes.length} out of ${nodes.length} nodes`
      });
      break;
    }
    
    // Mark current node as visited
    visited[currentNode] = true;
    visitedNodes.push(currentNode);
    
    // Add step for selecting the current node
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [...visitedNodes],
        activeNodes: [],
        currentNode,
        nextNodes: [],
        distances: [...distances],
        previousNodes: [...previousNodes],
        path: [...path]
      },
      description: `Select node ${nodes[currentNode].label} with the minimum distance of ${distances[currentNode]}.`,
      codeHighlight: "    u := vertex in Q with minimum distance[u]\n    remove u from Q\n    visited[u] := true",
      complexityInfo: `Visited ${visitedNodes.length} out of ${nodes.length} nodes`
    });
    
    // Get neighbors of the current node
    const neighbors = adjacencyList[currentNode];
    
    // Check if there are neighbors to process
    if (neighbors.length > 0) {
      const unvisitedNeighbors = neighbors.filter(neighbor => !visited[neighbor.node]);
      
      if (unvisitedNeighbors.length > 0) {
        steps.push({
          data: {
            nodes: [...nodes],
            edges: [...edges],
            visitedNodes: [...visitedNodes],
            activeNodes: unvisitedNeighbors.map(n => n.node),
            currentNode,
            nextNodes: [],
            distances: [...distances],
            previousNodes: [...previousNodes],
            path: [...path]
          },
          description: `Checking neighbors of node ${nodes[currentNode].label}.`,
          codeHighlight: "    for each neighbor v of u do",
          complexityInfo: `Found ${unvisitedNeighbors.length} unvisited neighbors`
        });
      }
      
      // Process each neighbor to update distances
      for (const { node: neighborNode, weight } of neighbors) {
        // Skip if already visited
        if (visited[neighborNode]) continue;
        
        // Calculate new distance through current node
        const newDistance = distances[currentNode] + weight;
        
        // Current path info for display
        const currentDistance = distances[neighborNode];
        
        // Check if new path is shorter
        const isNewPathShorter = newDistance < currentDistance;
        
        // Add step for checking the neighbor
        steps.push({
          data: {
            nodes: [...nodes],
            edges: [...edges],
            visitedNodes: [...visitedNodes],
            activeNodes: [neighborNode],
            currentNode,
            nextNodes: [],
            distances: [...distances],
            previousNodes: [...previousNodes],
            path: [...path]
          },
          description: `Check if path to ${nodes[neighborNode].label} through ${nodes[currentNode].label} is shorter: ${distances[currentNode]} + ${weight} = ${newDistance} vs current ${currentDistance === Infinity ? "∞" : currentDistance}.`,
          codeHighlight: "        if not visited[v] then\n            alt := distance[u] + length(u, v)",
          complexityInfo: `Current distance to ${nodes[neighborNode].label}: ${currentDistance === Infinity ? "∞" : currentDistance}`
        });
        
        // If new path is shorter, update distance and previous node
        if (isNewPathShorter) {
          distances[neighborNode] = newDistance;
          previousNodes[neighborNode] = currentNode;
          
          // Add edge to the path
          // First, check if there's already a path to this node and remove it
          const existingPathIndex = path.findIndex(p => p.target === neighborNode);
          if (existingPathIndex !== -1) {
            path.splice(existingPathIndex, 1);
          }
          
          // Add the new path
          path.push({
            source: currentNode,
            target: neighborNode
          });
          
          // Add step for updating the distance
          steps.push({
            data: {
              nodes: [...nodes],
              edges: [...edges],
              visitedNodes: [...visitedNodes],
              activeNodes: [neighborNode],
              currentNode,
              nextNodes: [],
              distances: [...distances],
              previousNodes: [...previousNodes],
              path: [...path]
            },
            description: `Update distance to ${nodes[neighborNode].label} to ${newDistance} and set previous node to ${nodes[currentNode].label}.`,
            codeHighlight: "            if alt < distance[v] then\n                distance[v] := alt\n                previous[v] := u",
            complexityInfo: `New distance to ${nodes[neighborNode].label}: ${newDistance}`
          });
        } else {
          // No update needed
          steps.push({
            data: {
              nodes: [...nodes],
              edges: [...edges],
              visitedNodes: [...visitedNodes],
              activeNodes: [],
              currentNode,
              nextNodes: [],
              distances: [...distances],
              previousNodes: [...previousNodes],
              path: [...path]
            },
            description: `No update needed for ${nodes[neighborNode].label} as the current path is shorter.`,
            codeHighlight: "            end if",
            complexityInfo: `Distance to ${nodes[neighborNode].label} remains: ${currentDistance === Infinity ? "∞" : currentDistance}`
          });
        }
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
      distances: [...distances],
      previousNodes: [...previousNodes],
      path: [...path]
    },
    description: "Dijkstra's algorithm complete. The shortest path to each node has been found.",
    codeHighlight: "end procedure",
    complexityInfo: `Final distances from ${nodes[startNode].label}: ${distances.map((d, i) => `${nodes[i].label}=${d === Infinity ? "∞" : d}`).join(", ")}`
  });
  
  return steps;
};

const DijkstraVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Dijkstra's Algorithm"
      initialData={initialData}
      generateSteps={generateDijkstraSteps}
      VisualizationComponent={GraphVisualization}
      description="Dijkstra's Algorithm finds the shortest paths from a source vertex to all other vertices in a weighted graph, using a greedy approach that selects the unvisited vertex with the smallest tentative distance."
    />
  );
};

export default DijkstraVisualization; 