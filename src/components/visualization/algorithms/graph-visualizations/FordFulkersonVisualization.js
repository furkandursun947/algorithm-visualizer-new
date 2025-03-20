import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample flow network for Ford-Fulkerson algorithm
const generateSampleFlowNetwork = () => {
  // Create a simple flow network with 6 nodes
  const nodes = [
    { label: "S", isSource: true },  // Source
    { label: "A" },
    { label: "B" },
    { label: "C" },
    { label: "D" },
    { label: "T", isSink: true }     // Sink
  ];
  
  // Define positions for a clearer visualization
  const positions = [
    { x: 100, y: 150 },  // S
    { x: 225, y: 75 },   // A
    { x: 225, y: 225 },  // B
    { x: 350, y: 75 },   // C
    { x: 350, y: 225 },  // D
    { x: 475, y: 150 }   // T
  ];
  
  // Assign positions to nodes
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].position = positions[i];
  }
  
  // Create edges with capacities (original capacities of the flow network)
  const edges = [
    { source: 0, target: 1, capacity: 10, flow: 0, directed: true },  // S -> A
    { source: 0, target: 2, capacity: 8, flow: 0, directed: true },   // S -> B
    { source: 1, target: 2, capacity: 2, flow: 0, directed: true },   // A -> B
    { source: 1, target: 3, capacity: 5, flow: 0, directed: true },   // A -> C
    { source: 2, target: 3, capacity: 4, flow: 0, directed: true },   // B -> C
    { source: 2, target: 4, capacity: 10, flow: 0, directed: true },  // B -> D
    { source: 3, target: 5, capacity: 10, flow: 0, directed: true },  // C -> T
    { source: 4, target: 3, capacity: 6, flow: 0, directed: true },   // D -> C
    { source: 4, target: 5, capacity: 10, flow: 0, directed: true }   // D -> T
  ];
  
  return {
    nodes,
    edges,
    visitedNodes: [],
    activeNodes: [],
    currentNode: null,
    nextNodes: [],
    sourceNode: 0,
    sinkNode: 5,
    maxFlow: 0,
    currentPath: [],
    bottleneck: 0,
    residualGraph: [],
    phase: "initial"
  };
};

// Helper function to find an augmenting path using BFS
const findAugmentingPath = (residualGraph, source, sink, nodes) => {
  const numNodes = nodes.length;
  const visited = Array(numNodes).fill(false);
  const parent = Array(numNodes).fill(-1);
  const queue = [source];
  
  visited[source] = true;
  
  // BFS to find a path from source to sink
  while (queue.length > 0) {
    const u = queue.shift();
    
    for (let v = 0; v < numNodes; v++) {
      // If not visited and there is residual capacity
      if (!visited[v] && residualGraph[u][v] > 0) {
        parent[v] = u;
        
        if (v === sink) {
          // Reconstruct the path
          const path = [];
          let current = sink;
          
          while (current !== source) {
            path.unshift({ source: parent[current], target: current });
            current = parent[current];
          }
          
          return { 
            found: true,
            path,
            parent
          };
        }
        
        visited[v] = true;
        queue.push(v);
      }
    }
  }
  
  return { found: false, path: [], parent };
};

// Find the bottleneck (minimum residual capacity) along the path
const findBottleneck = (residualGraph, path) => {
  let bottleneck = Infinity;
  
  for (const edge of path) {
    bottleneck = Math.min(bottleneck, residualGraph[edge.source][edge.target]);
  }
  
  return bottleneck;
};

// Ford-Fulkerson algorithm visualization steps generator
const generateFordFulkersonSteps = (initialData) => {
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
        sourceNode: 0,
        sinkNode: 0,
        maxFlow: 0,
        currentPath: [],
        bottleneck: 0,
        residualGraph: [],
        phase: "error"
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  const { nodes, edges, sourceNode, sinkNode } = data;
  const numNodes = nodes.length;
  
  // Initialize residual graph (adjacency matrix)
  const residualGraph = Array(numNodes).fill().map(() => Array(numNodes).fill(0));
  
  // Set capacities in the residual graph
  for (const edge of edges) {
    residualGraph[edge.source][edge.target] = edge.capacity;
  }
  
  // Add initial state
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [],
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      sourceNode,
      sinkNode,
      maxFlow: 0,
      currentPath: [],
      bottleneck: 0,
      residualGraph: JSON.parse(JSON.stringify(residualGraph)),
      phase: "initial"
    },
    description: "Initialize Ford-Fulkerson algorithm. All edges start with zero flow.",
    codeHighlight: "function FordFulkerson(graph, source, sink):\n    // Initialize flow to 0 for all edges\n    for each edge (u,v) in graph:\n        flow[u,v] := 0\n        flow[v,u] := 0\n    \n    // Residual graph initially equals the original graph\n    residualGraph := graph",
    complexityInfo: "Time Complexity: O(E * max_flow) where E is the number of edges"
  });
  
  // Track the maximum flow
  let maxFlow = 0;
  let iteration = 1;
  
  // Main loop of Ford-Fulkerson algorithm
  while (true) {
    // Find an augmenting path in the residual graph
    const { found, path, parent } = findAugmentingPath(residualGraph, sourceNode, sinkNode, nodes);
    
    // If no augmenting path exists
    if (!found) {
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: [],
          activeNodes: [],
          currentNode: null,
          nextNodes: [],
          sourceNode,
          sinkNode,
          maxFlow,
          currentPath: [],
          bottleneck: 0,
          residualGraph: JSON.parse(JSON.stringify(residualGraph)),
          phase: "no_path"
        },
        description: "No more augmenting paths found. The maximum flow is " + maxFlow + ".",
        codeHighlight: "    // While there is an augmenting path from source to sink\n    while path := findAugmentingPath(residualGraph, source, sink):",
        complexityInfo: `Maximum flow achieved: ${maxFlow}`
      });
      break;
    }
    
    // Highlight the augmenting path
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [],
        activeNodes: path.map(edge => edge.target),
        currentNode: sourceNode,
        nextNodes: [],
        sourceNode,
        sinkNode,
        maxFlow,
        currentPath: path,
        bottleneck: 0,
        residualGraph: JSON.parse(JSON.stringify(residualGraph)),
        phase: "path_found"
      },
      description: `Iteration ${iteration}: Found an augmenting path from source to sink.`,
      codeHighlight: "    // While there is an augmenting path from source to sink\n    while path := findAugmentingPath(residualGraph, source, sink):",
      complexityInfo: `Path: ${path.map(edge => nodes[edge.source].label + ' → ' + nodes[edge.target].label).join(' → ')}`
    });
    
    // Find the bottleneck capacity
    const bottleneck = findBottleneck(residualGraph, path);
    
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [],
        activeNodes: path.map(edge => edge.target),
        currentNode: sourceNode,
        nextNodes: [],
        sourceNode,
        sinkNode,
        maxFlow,
        currentPath: path,
        bottleneck,
        residualGraph: JSON.parse(JSON.stringify(residualGraph)),
        phase: "bottleneck"
      },
      description: `Found bottleneck capacity of ${bottleneck} along the augmenting path.`,
      codeHighlight: "        // Find the bottleneck capacity\n        bottleneck := min{ residualGraph[u,v] for each edge (u,v) in path }",
      complexityInfo: `Bottleneck value: ${bottleneck}`
    });
    
    // Update residual graph capacities
    for (const edge of path) {
      const u = edge.source;
      const v = edge.target;
      
      // Forward edge: decrease capacity
      residualGraph[u][v] -= bottleneck;
      
      // Backward edge: increase capacity
      residualGraph[v][u] += bottleneck;
      
      // Update the flow in the original graph
      for (const originalEdge of edges) {
        if (originalEdge.source === u && originalEdge.target === v) {
          originalEdge.flow += bottleneck;
          break;
        }
      }
    }
    
    // Update max flow
    maxFlow += bottleneck;
    
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [],
        activeNodes: [],
        currentNode: null,
        nextNodes: [],
        sourceNode,
        sinkNode,
        maxFlow,
        currentPath: path,
        bottleneck,
        residualGraph: JSON.parse(JSON.stringify(residualGraph)),
        phase: "update_flow"
      },
      description: `Updated the flow along the path by ${bottleneck}. Current maximum flow: ${maxFlow}.`,
      codeHighlight: "        // Update residual graph\n        for each edge (u,v) in path:\n            // Forward edge: decrease capacity\n            residualGraph[u,v] := residualGraph[u,v] - bottleneck\n            // Backward edge: increase capacity\n            residualGraph[v,u] := residualGraph[v,u] + bottleneck\n            \n            // Update actual flow\n            if (u,v) is in original graph:\n                flow[u,v] := flow[u,v] + bottleneck\n            else:\n                flow[v,u] := flow[v,u] - bottleneck\n        \n        maxFlow := maxFlow + bottleneck",
      complexityInfo: `Current maximum flow: ${maxFlow}`
    });
    
    iteration++;
  }
  
  // Final state - highlight the min-cut
  // Find all vertices reachable from source in the final residual graph
  const visited = Array(numNodes).fill(false);
  const queue = [sourceNode];
  visited[sourceNode] = true;
  
  while (queue.length > 0) {
    const u = queue.shift();
    
    for (let v = 0; v < numNodes; v++) {
      if (!visited[v] && residualGraph[u][v] > 0) {
        visited[v] = true;
        queue.push(v);
      }
    }
  }
  
  // Identify the min-cut edges
  const minCutEdges = [];
  for (let i = 0; i < numNodes; i++) {
    if (!visited[i]) continue;
    
    for (let j = 0; j < numNodes; j++) {
      if (!visited[j]) {
        // i is reachable from source, j is not
        for (const edge of edges) {
          if (edge.source === i && edge.target === j) {
            minCutEdges.push(edge);
          }
        }
      }
    }
  }
  
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      sourceNode,
      sinkNode,
      maxFlow,
      currentPath: [],
      bottleneck: 0,
      residualGraph: JSON.parse(JSON.stringify(residualGraph)),
      minCutEdges,
      phase: "min_cut"
    },
    description: `Ford-Fulkerson algorithm complete. The maximum flow is ${maxFlow}. The highlighted vertices form the source side of the min-cut.`,
    codeHighlight: "    return maxFlow",
    complexityInfo: `Final maximum flow: ${maxFlow}, Min-cut capacity: ${maxFlow}`
  });
  
  return steps;
};

// Custom visualization component for Ford-Fulkerson algorithm
const FordFulkersonVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    nodes = [], 
    edges = [], 
    visitedNodes = [], 
    activeNodes = [], 
    currentNode = null,
    nextNodes = [],
    sourceNode = 0,
    sinkNode = 0,
    maxFlow = 0,
    currentPath = [],
    bottleneck = 0,
    residualGraph = [],
    minCutEdges = [],
    phase = "initial"
  } = data || {};
  
  // Process edges to show flow/capacity
  const processedEdges = edges.map(edge => {
    // Check if edge is part of current augmenting path
    const isPathEdge = currentPath.some(p => 
      p.source === edge.source && p.target === edge.target
    );
    
    // Check if edge is part of min-cut
    const isMinCutEdge = minCutEdges && minCutEdges.some(e => 
      e.source === edge.source && e.target === edge.target
    );
    
    // Label for edge showing flow/capacity
    const label = `${edge.flow}/${edge.capacity}`;
    
    return {
      ...edge,
      weight: label,
      isPathEdge,
      isMinCutEdge,
      originalWeight: edge.capacity
    };
  });
  
  // Render a table showing the residual graph
  const renderResidualGraph = () => {
    if (!residualGraph || residualGraph.length === 0) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Residual Graph</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From\To</th>
              {nodes.map((node, idx) => (
                <th key={idx} className="px-3 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {node.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {residualGraph.map((row, sourceIdx) => (
              <tr key={sourceIdx}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {nodes[sourceIdx]?.label}
                </td>
                {row.map((capacity, targetIdx) => {
                  // Highlight cells that are part of the current path
                  const isPathCell = currentPath.some(p => 
                    p.source === sourceIdx && p.target === targetIdx
                  );
                  
                  return (
                    <td 
                      key={targetIdx} 
                      className={`px-3 py-2 whitespace-nowrap text-sm text-gray-500 ${
                        isPathCell ? 'bg-yellow-100 font-medium' : capacity > 0 ? 'bg-gray-50' : ''
                      }`}
                    >
                      {capacity}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Extend the graph data with flow information
  const graphData = {
    nodes,
    edges: processedEdges.map(edge => ({
      ...edge,
      // Highlight min-cut edges in the min-cut phase
      mstEdge: phase === "min_cut" && edge.isMinCutEdge,
      // Highlight path edges during the algorithm
      currentEdge: edge.isPathEdge
    })),
    visitedNodes,
    activeNodes,
    currentNode,
    nextNodes,
    path: currentPath
  };
  
  // Status message based on current phase
  const renderStatusMessage = () => {
    switch (phase) {
      case "initial":
        return "Initial flow network with zero flow";
      case "path_found":
        return `Found an augmenting path from ${nodes[sourceNode].label} to ${nodes[sinkNode].label}`;
      case "bottleneck":
        return `Calculated bottleneck capacity: ${bottleneck}`;
      case "update_flow":
        return `Updated flow along the path, increasing maximum flow to ${maxFlow}`;
      case "no_path":
        return `No more augmenting paths. Maximum flow is ${maxFlow}`;
      case "min_cut":
        return `Min-cut identified. Maximum flow = Min-cut capacity = ${maxFlow}`;
      default:
        return "";
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <GraphVisualization 
          data={graphData} 
          step={step} 
          stepInfo={stepInfo} 
        />
      </div>
      
      {/* Status bar */}
      <div className="bg-blue-50 p-2 text-blue-700 text-center rounded-md mt-2">
        {renderStatusMessage()}
      </div>
      
      {/* Maximum flow display */}
      <div className="mt-2 p-2 bg-green-50 text-green-700 text-center rounded-md">
        Maximum Flow: {maxFlow}
      </div>
      
      {renderResidualGraph()}
    </div>
  );
};

const FordFulkersonVisualization = () => {
  // Generate sample flow network for initial display
  const initialData = useMemo(() => {
    return generateSampleFlowNetwork();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Ford-Fulkerson Algorithm"
      initialData={initialData}
      generateSteps={generateFordFulkersonSteps}
      VisualizationComponent={FordFulkersonVisualizationComponent}
      description="The Ford-Fulkerson Algorithm finds the maximum flow in a flow network by repeatedly finding augmenting paths through the residual graph and pushing flow through these paths until no more augmenting paths exist. The final flow equals the capacity of the minimum cut in the network."
    />
  );
};

export default FordFulkersonVisualization; 