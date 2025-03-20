import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample graph for Johnson's algorithm
const generateSampleGraph = () => {
  // Create a directed graph with 6 nodes
  const nodes = [
    { label: "A" },
    { label: "B" },
    { label: "C" },
    { label: "D" },
    { label: "E" },
    { label: "F" }
  ];
  
  // Create directed edges with weights (including some negative weights but no negative cycles)
  const edges = [
    { source: 0, target: 1, weight: 3, directed: true },  // A -> B: 3
    { source: 0, target: 2, weight: 2, directed: true },  // A -> C: 2
    { source: 1, target: 2, weight: -2, directed: true }, // B -> C: -2
    { source: 1, target: 3, weight: 1, directed: true },  // B -> D: 1
    { source: 2, target: 4, weight: 4, directed: true },  // C -> E: 4
    { source: 3, target: 4, weight: -3, directed: true }, // D -> E: -3
    { source: 3, target: 5, weight: 2, directed: true },  // D -> F: 2
    { source: 4, target: 5, weight: 2, directed: true }   // E -> F: 2
  ];
  
  return {
    nodes,
    edges,
    visitedNodes: [],
    activeNodes: [],
    currentNode: null,
    nextNodes: [],
    hValues: {},
    reweightedEdges: [],
    distanceMatrix: [],
    phase: "initial",
    currentSourceNode: null,
    auxiliaryNode: null
  };
};

// Utility function to find the minimum distance node
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

// Bellman-Ford algorithm for step 2 of Johnson's algorithm
const bellmanFord = (nodes, edges, source) => {
  const distances = Array(nodes.length).fill(Infinity);
  distances[source] = 0;
  const predecessors = Array(nodes.length).fill(null);
  
  // Relax all edges |V| - 1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    for (const edge of edges) {
      if (distances[edge.source] !== Infinity) {
        const newDist = distances[edge.source] + edge.weight;
        if (newDist < distances[edge.target]) {
          distances[edge.target] = newDist;
          predecessors[edge.target] = edge.source;
        }
      }
    }
  }
  
  // Check for negative weight cycles
  for (const edge of edges) {
    if (distances[edge.source] !== Infinity) {
      if (distances[edge.source] + edge.weight < distances[edge.target]) {
        // Negative weight cycle detected
        return { hasNegativeCycle: true, distances: null, predecessors: null };
      }
    }
  }
  
  return { hasNegativeCycle: false, distances, predecessors };
};

// Dijkstra's algorithm for step 4 of Johnson's algorithm
const dijkstra = (nodes, edges, source) => {
  const distances = Array(nodes.length).fill(Infinity);
  distances[source] = 0;
  const visited = Array(nodes.length).fill(false);
  const predecessors = Array(nodes.length).fill(null);
  
  // Create adjacency list for directed graph
  const adjacencyList = Array(nodes.length).fill().map(() => []);
  for (const edge of edges) {
    adjacencyList[edge.source].push({ target: edge.target, weight: edge.weight });
  }
  
  while (true) {
    const u = findMinDistanceNode(distances, visited);
    if (u === -1) break;
    
    visited[u] = true;
    
    for (const neighbor of adjacencyList[u]) {
      const v = neighbor.target;
      if (!visited[v]) {
        const alt = distances[u] + neighbor.weight;
        if (alt < distances[v]) {
          distances[v] = alt;
          predecessors[v] = u;
        }
      }
    }
  }
  
  return { distances, predecessors };
};

// Johnson's algorithm visualization steps generator
const generateJohnsonsSteps = (initialData) => {
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
        hValues: {},
        reweightedEdges: [],
        distanceMatrix: [],
        phase: "error",
        currentSourceNode: null,
        auxiliaryNode: null
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  let { nodes, edges } = data;
  
  // Step 1: Add auxiliary vertex q with zero-weight edges to all vertices
  const qNodeIndex = nodes.length;
  const auxiliaryNode = { label: "q" };
  const qEdges = nodes.map((_, index) => ({
    source: qNodeIndex,
    target: index,
    weight: 0,
    directed: true,
    isAuxiliary: true
  }));
  
  // Add initial state
  steps.push({
    data: {
      ...data,
      phase: "initial",
      currentSourceNode: null,
      auxiliaryNode: null
    },
    description: "Initial graph with 6 vertices and 8 edges, including some negative weights.",
    codeHighlight: "function Johnson(G):"
  });
  
  // Add step for adding auxiliary vertex
  const nodesWithQ = [...nodes, auxiliaryNode];
  const edgesWithQ = [...edges, ...qEdges];
  
  steps.push({
    data: {
      ...data,
      nodes: nodesWithQ,
      edges: edgesWithQ,
      phase: "add_auxiliary",
      auxiliaryNode: qNodeIndex,
      activeNodes: [qNodeIndex]
    },
    description: "Step 1: Add an auxiliary vertex q with zero-weight edges to all original vertices.",
    codeHighlight: "    // Step 1: Add a new vertex q with zero-weight edges to all vertices\n    G' = G with a new vertex q\n    for each vertex v in G\n        add edge from q to v with weight 0"
  });
  
  // Step 2: Run Bellman-Ford from q to detect negative cycles and compute h values
  const bellmanFordResult = bellmanFord(nodesWithQ, edgesWithQ, qNodeIndex);
  
  if (bellmanFordResult.hasNegativeCycle) {
    // Negative cycle detected
    steps.push({
      data: {
        ...data,
        nodes: nodesWithQ,
        edges: edgesWithQ,
        phase: "negative_cycle",
        auxiliaryNode: qNodeIndex
      },
      description: "Step 2: Negative weight cycle detected! Johnson's algorithm cannot proceed.",
      codeHighlight: "    // Step 2: Run Bellman-Ford from q to compute h values\n    if Bellman-Ford(G', q) returns negative cycle detected\n        return \"Graph contains a negative cycle\""
    });
    
    return steps;
  }
  
  // No negative cycle, get h values
  const hValues = {};
  for (let i = 0; i < nodes.length; i++) {
    hValues[i] = bellmanFordResult.distances[i];
  }
  
  steps.push({
    data: {
      ...data,
      nodes: nodesWithQ,
      edges: edgesWithQ,
      phase: "compute_h_values",
      hValues,
      auxiliaryNode: qNodeIndex,
      visitedNodes: Array.from({ length: nodes.length }, (_, i) => i)
    },
    description: "Step 2: Run Bellman-Ford algorithm from vertex q to compute h(v) values for each vertex.",
    codeHighlight: "    for each vertex v in G\n        h(v) = distance from q to v in G'"
  });
  
  // Step 3: Reweight the edges using h values
  const reweightedEdges = edges.map(edge => {
    const originalWeight = edge.weight;
    const newWeight = originalWeight + hValues[edge.source] - hValues[edge.target];
    return {
      ...edge,
      originalWeight,
      weight: newWeight
    };
  });
  
  steps.push({
    data: {
      ...data,
      nodes,
      edges: reweightedEdges,
      phase: "reweight_edges",
      hValues,
      reweightedEdges: [...reweightedEdges]
    },
    description: "Step 3: Reweight all edges using the formula w'(u,v) = w(u,v) + h(u) - h(v). This ensures all edges have non-negative weights.",
    codeHighlight: "    // Step 3: Reweight the edges using h values\n    for each edge (u,v) with weight w in G\n        w'(u,v) = w + h(u) - h(v)"
  });
  
  // Step 4: Run Dijkstra's algorithm from each vertex on the reweighted graph
  const distanceMatrix = Array(nodes.length).fill().map(() => Array(nodes.length).fill(Infinity));
  
  // For each vertex as source
  for (let source = 0; source < nodes.length; source++) {
    steps.push({
      data: {
        ...data,
        nodes,
        edges: reweightedEdges,
        phase: "dijkstra_start",
        hValues,
        reweightedEdges: [...reweightedEdges],
        currentSourceNode: source,
        activeNodes: [source],
        distanceMatrix: JSON.parse(JSON.stringify(distanceMatrix))
      },
      description: `Step 4: Run Dijkstra's algorithm from vertex ${nodes[source].label} on the reweighted graph.`,
      codeHighlight: "    // Step 4: Run Dijkstra from each vertex on reweighted graph\n    for each vertex u in G\n        run Dijkstra's algorithm from u on reweighted graph"
    });
    
    // Run Dijkstra's algorithm
    const dijkstraResult = dijkstra(nodes, reweightedEdges, source);
    
    // Update distance matrix with reweighted distances
    for (let target = 0; target < nodes.length; target++) {
      if (dijkstraResult.distances[target] !== Infinity) {
        distanceMatrix[source][target] = dijkstraResult.distances[target];
      }
    }
    
    steps.push({
      data: {
        ...data,
        nodes,
        edges: reweightedEdges,
        phase: "dijkstra_complete",
        hValues,
        reweightedEdges: [...reweightedEdges],
        currentSourceNode: source,
        visitedNodes: Array.from({ length: nodes.length }, (_, i) => i),
        distanceMatrix: JSON.parse(JSON.stringify(distanceMatrix))
      },
      description: `Completed Dijkstra's algorithm from vertex ${nodes[source].label}, updating the distance matrix with shortest paths to all reachable vertices.`,
      codeHighlight: "        for each vertex v in G\n            D[u][v] = distance from u to v in reweighted graph"
    });
  }
  
  // Step 5: Convert distances back to original graph
  const originalDistanceMatrix = Array(nodes.length).fill().map(() => Array(nodes.length).fill(Infinity));
  
  for (let u = 0; u < nodes.length; u++) {
    for (let v = 0; v < nodes.length; v++) {
      if (distanceMatrix[u][v] !== Infinity) {
        originalDistanceMatrix[u][v] = distanceMatrix[u][v] - hValues[u] + hValues[v];
      }
    }
  }
  
  steps.push({
    data: {
      ...data,
      nodes,
      edges, // Show original edges again
      phase: "convert_distances",
      hValues,
      distanceMatrix: originalDistanceMatrix
    },
    description: "Step 5: Convert the shortest paths in the reweighted graph back to the original graph using: dist(u,v) = dist'(u,v) - h(u) + h(v).",
    codeHighlight: "    // Step 5: Convert distances back to original graph\n    for each pair of vertices u,v in G\n        D[u][v] = D[u][v] - h(u) + h(v)"
  });
  
  // Final result
  steps.push({
    data: {
      ...data,
      nodes,
      edges,
      phase: "complete",
      hValues,
      distanceMatrix: originalDistanceMatrix
    },
    description: "Johnson's algorithm complete. The distance matrix now contains the shortest path distances between all pairs of vertices.",
    codeHighlight: "    return D"
  });
  
  return steps;
};

// Custom visualization component for Johnson's Algorithm
const JohnsonsVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    nodes = [], 
    edges = [], 
    visitedNodes = [], 
    activeNodes = [], 
    currentNode = null,
    hValues = {},
    distanceMatrix = [],
    phase = "initial",
    currentSourceNode = null,
    auxiliaryNode = null
  } = data || {};
  
  // Render the distance matrix
  const renderDistanceMatrix = () => {
    // Only show if we have data in the matrix
    if (!distanceMatrix.length) return null;
    
    // Format distance for display
    const formatDistance = (distance) => {
      if (distance === Infinity) return "∞";
      return distance;
    };
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm overflow-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Distance Matrix</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 bg-gray-100">From\To</th>
                {nodes.map((node, idx) => (
                  <th key={idx} className={`px-3 py-2 text-center bg-gray-100 ${idx === currentSourceNode ? 'bg-blue-100' : ''}`}>
                    {node.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {distanceMatrix.map((row, sourceIdx) => (
                <tr key={sourceIdx}>
                  <td className={`px-3 py-2 font-medium ${sourceIdx === currentSourceNode ? 'bg-blue-100' : 'bg-gray-50'}`}>
                    {nodes[sourceIdx]?.label}
                  </td>
                  {row.map((distance, targetIdx) => (
                    <td 
                      key={targetIdx} 
                      className={`px-3 py-2 text-center ${
                        sourceIdx === currentSourceNode && targetIdx === currentSourceNode ? 'bg-green-100' :
                        sourceIdx === currentSourceNode ? 'bg-blue-50' :
                        distance !== Infinity ? 'bg-gray-50' : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {formatDistance(distance)}
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
  
  // Render h values table
  const renderHValues = () => {
    if (!Object.keys(hValues).length) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-2">h(v) Values</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(hValues).map(([nodeIdx, value]) => (
            <div 
              key={nodeIdx}
              className="px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm"
            >
              h({nodes[nodeIdx]?.label}) = {value}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render edge weights table for reweighting phase
  const renderEdgeWeights = () => {
    if (phase !== "reweight_edges" && phase !== "dijkstra_start" && phase !== "dijkstra_complete") return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm overflow-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Edge Reweighting</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 bg-gray-100">Edge</th>
                <th className="px-3 py-2 bg-gray-100">Original Weight</th>
                <th className="px-3 py-2 bg-gray-100">h(u)</th>
                <th className="px-3 py-2 bg-gray-100">h(v)</th>
                <th className="px-3 py-2 bg-gray-100">New Weight = w + h(u) - h(v)</th>
              </tr>
            </thead>
            <tbody>
              {edges.filter(edge => !edge.isAuxiliary).map((edge, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2 font-medium">
                    {nodes[edge.source]?.label} → {nodes[edge.target]?.label}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {edge.originalWeight !== undefined ? edge.originalWeight : edge.weight}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {hValues[edge.source] !== undefined ? hValues[edge.source] : '?'}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {hValues[edge.target] !== undefined ? hValues[edge.target] : '?'}
                  </td>
                  <td className="px-3 py-2 text-center font-medium">
                    {edge.weight} {edge.weight >= 0 ? '(≥0)' : '(<0)'}
                  </td>
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
      {/* Graph visualization */}
      <div className={`flex-1 ${phase === "negative_cycle" ? 'opacity-50' : ''}`}>
        <GraphVisualization 
          data={{
            nodes,
            edges,
            visitedNodes,
            activeNodes,
            currentNode: currentNode !== null ? currentNode : currentSourceNode,
            nextNodes: []
          }} 
          step={step} 
          stepInfo={stepInfo} 
        />
      </div>
      
      {/* Current phase indicator */}
      <div className="mt-4 p-2 bg-blue-50 rounded-md text-sm text-blue-800 font-medium text-center">
        {phase === "initial" && "Initial Graph"}
        {phase === "add_auxiliary" && "Step 1: Adding Auxiliary Vertex"}
        {phase === "compute_h_values" && "Step 2: Computing h(v) Values"}
        {phase === "reweight_edges" && "Step 3: Reweighting Edges"}
        {phase === "dijkstra_start" && `Step 4: Running Dijkstra from ${nodes[currentSourceNode]?.label}`}
        {phase === "dijkstra_complete" && `Dijkstra Complete from ${nodes[currentSourceNode]?.label}`}
        {phase === "convert_distances" && "Step 5: Converting Back to Original Distances"}
        {phase === "complete" && "Algorithm Complete"}
        {phase === "negative_cycle" && "Error: Negative Cycle Detected"}
      </div>
      
      {/* Display h values when applicable */}
      {(phase === "compute_h_values" || phase === "reweight_edges" || phase === "dijkstra_start" || phase === "dijkstra_complete" || phase === "convert_distances" || phase === "complete") && 
        renderHValues()
      }
      
      {/* Display edge weights table when applicable */}
      {(phase === "reweight_edges" || phase === "dijkstra_start" || phase === "dijkstra_complete") && 
        renderEdgeWeights()
      }
      
      {/* Display distance matrix when applicable */}
      {(phase === "dijkstra_start" || phase === "dijkstra_complete" || phase === "convert_distances" || phase === "complete") && 
        renderDistanceMatrix()
      }
      
      {/* Error message for negative cycle */}
      {phase === "negative_cycle" && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Negative weight cycle detected!</p>
          <p className="mt-1">Johnson's algorithm cannot find shortest paths in graphs with negative cycles.</p>
        </div>
      )}
    </div>
  );
};

const JohnsonsVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Johnson's Algorithm"
      initialData={initialData}
      generateSteps={generateJohnsonsSteps}
      VisualizationComponent={JohnsonsVisualizationComponent}
      description="Johnson's algorithm finds all-pairs shortest paths in a sparse directed graph with positive or negative edge weights (but no negative cycles). It combines Bellman-Ford and Dijkstra's algorithms to achieve better performance than Floyd-Warshall on sparse graphs."
    />
  );
};

export default JohnsonsVisualization; 