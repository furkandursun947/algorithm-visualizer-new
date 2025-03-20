import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample graph for Prim's algorithm
// Using the same graph structure as Kruskal's for comparison
const generateSampleGraph = () => {
  // Create a connected graph with 7 nodes
  const nodes = [
    { label: "A" },
    { label: "B" },
    { label: "C" },
    { label: "D" },
    { label: "E" },
    { label: "F" },
    { label: "G" }
  ];
  
  // Create weighted undirected edges
  const edges = [
    { source: 0, target: 1, weight: 7 },  // A-B: 7
    { source: 0, target: 3, weight: 5 },  // A-D: 5
    { source: 1, target: 2, weight: 8 },  // B-C: 8
    { source: 1, target: 3, weight: 9 },  // B-D: 9
    { source: 1, target: 4, weight: 7 },  // B-E: 7
    { source: 2, target: 4, weight: 5 },  // C-E: 5
    { source: 3, target: 4, weight: 15 }, // D-E: 15
    { source: 3, target: 5, weight: 6 },  // D-F: 6
    { source: 4, target: 5, weight: 8 },  // E-F: 8
    { source: 4, target: 6, weight: 9 },  // E-G: 9
    { source: 5, target: 6, weight: 11 }  // F-G: 11
  ];
  
  return {
    nodes,
    edges,
    visitedNodes: [],
    activeNodes: [],
    currentNode: null,
    nextNodes: [],
    mstEdges: [],
    currentEdges: [],
    consideredEdge: null,
    minHeap: []
  };
};

// Helper function for Min Heap/Priority Queue operations
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(edge, weight) {
    this.heap.push({ edge, weight });
    this.bubbleUp();
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown();
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    const element = this.heap[index];
    
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      
      if (element.weight >= parent.weight) {
        break;
      }
      
      this.heap[parentIndex] = element;
      this.heap[index] = parent;
      index = parentIndex;
    }
  }

  sinkDown() {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[0];
    
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;
      
      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild.weight < element.weight) {
          swap = leftChildIndex;
        }
      }
      
      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild.weight < element.weight) || 
          (swap !== null && rightChild.weight < leftChild.weight)
        ) {
          swap = rightChildIndex;
        }
      }
      
      if (swap === null) {
        break;
      }
      
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }

  getHeap() {
    return [...this.heap];
  }
}

// Prim's algorithm visualization steps generator
const generatePrimsSteps = (initialData) => {
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
        mstEdges: [],
        currentEdges: [],
        consideredEdge: null,
        minHeap: []
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  const { nodes, edges } = data;
  
  // Create adjacency list representation of the graph
  const adjList = Array(nodes.length).fill().map(() => []);
  for (const edge of edges) {
    // For undirected graph, add edges in both directions
    adjList[edge.source].push({ target: edge.target, weight: edge.weight });
    adjList[edge.target].push({ target: edge.source, weight: edge.weight });
  }
  
  // Initial state
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [],
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      mstEdges: [],
      currentEdges: [],
      consideredEdge: null,
      minHeap: []
    },
    description: "Starting Prim's algorithm. We'll build a minimum spanning tree by adding vertices one at a time, always choosing the lowest-weight edge that connects a vertex in the MST to a vertex outside the MST.",
    codeHighlight: "procedure Prim(G: graph):\n    Let T be a single vertex from G\n    While T has fewer than |V| vertices:\n        Choose the lowest-weight edge (u,v) such that u is in T and v is not\n        Add v to T\n        Add edge (u,v) to the MST",
    complexityInfo: "Time Complexity: O(E log V) with a binary heap implementation"
  });
  
  // Start from vertex 0 (arbitrary choice)
  const startVertex = 0;
  const visitedNodes = [startVertex];
  const mstEdges = [];
  const pq = new PriorityQueue();
  
  // Add first vertex to MST
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [...visitedNodes],
      activeNodes: [startVertex],
      currentNode: startVertex,
      nextNodes: [],
      mstEdges: [],
      currentEdges: adjList[startVertex].map(edge => ({
        source: startVertex,
        target: edge.target,
        weight: edge.weight
      })),
      consideredEdge: null,
      minHeap: []
    },
    description: `Starting with vertex ${nodes[startVertex].label} as our initial MST.`,
    codeHighlight: "    Let T be a single vertex from G",
    complexityInfo: "MST vertices: 1 (out of " + nodes.length + ")"
  });
  
  // Add all edges from start vertex to PQ
  for (const neighbor of adjList[startVertex]) {
    pq.enqueue({ source: startVertex, target: neighbor.target }, neighbor.weight);
  }
  
  // Show edges in PQ
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [...visitedNodes],
      activeNodes: [],
      currentNode: startVertex,
      nextNodes: adjList[startVertex].map(edge => edge.target),
      mstEdges: [],
      currentEdges: adjList[startVertex].map(edge => ({
        source: startVertex,
        target: edge.target,
        weight: edge.weight
      })),
      consideredEdge: null,
      minHeap: pq.getHeap()
    },
    description: `Add all edges from ${nodes[startVertex].label} to the priority queue, ordered by weight.`,
    codeHighlight: "    Add all edges from start vertex to the priority queue",
    complexityInfo: "Priority queue now contains " + pq.heap.length + " edges"
  });
  
  // Main Prim's algorithm
  while (!pq.isEmpty() && visitedNodes.length < nodes.length) {
    // Get the lowest weight edge
    const { edge, weight } = pq.dequeue();
    const { source, target } = edge;
    
    // Skip if target vertex already in MST
    if (visitedNodes.includes(target)) {
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: [...visitedNodes],
          activeNodes: [source, target],
          currentNode: null,
          nextNodes: [],
          mstEdges: [...mstEdges],
          currentEdges: [],
          consideredEdge: { source, target },
          minHeap: pq.getHeap()
        },
        description: `Considering edge ${nodes[source].label}-${nodes[target].label} with weight ${weight}, but ${nodes[target].label} is already in our MST. Skipping this edge.`,
        codeHighlight: "        If vertex v is already in T, skip this edge",
        complexityInfo: `Skipped edge because target vertex is already in MST`
      });
      continue;
    }
    
    // Add this vertex to MST
    visitedNodes.push(target);
    mstEdges.push({ source, target, weight });
    
    // Show the edge being added
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [...visitedNodes],
        activeNodes: [source, target],
        currentNode: target,
        nextNodes: [],
        mstEdges: [...mstEdges],
        currentEdges: [],
        consideredEdge: { source, target },
        minHeap: pq.getHeap()
      },
      description: `Selected lowest-weight edge ${nodes[source].label}-${nodes[target].label} with weight ${weight}. Adding vertex ${nodes[target].label} to our MST.`,
      codeHighlight: "        Choose the lowest-weight edge (u,v) such that u is in T and v is not\n        Add v to T\n        Add edge (u,v) to the MST",
      complexityInfo: `MST edges: ${mstEdges.length}/${nodes.length - 1}`
    });
    
    // Add all edges from new vertex to PQ if the other end is not in MST
    const newEdges = [];
    for (const neighbor of adjList[target]) {
      if (!visitedNodes.includes(neighbor.target)) {
        pq.enqueue({ source: target, target: neighbor.target }, neighbor.weight);
        newEdges.push({ source: target, target: neighbor.target, weight: neighbor.weight });
      }
    }
    
    if (newEdges.length > 0) {
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: [...visitedNodes],
          activeNodes: [],
          currentNode: target,
          nextNodes: newEdges.map(edge => edge.target),
          mstEdges: [...mstEdges],
          currentEdges: newEdges,
          consideredEdge: null,
          minHeap: pq.getHeap()
        },
        description: `Adding edges from ${nodes[target].label} to the priority queue if they lead to unvisited vertices.`,
        codeHighlight: "        For each edge (v,x) where x is not in T:\n            Add edge (v,x) to the priority queue",
        complexityInfo: `Added ${newEdges.length} new edges to priority queue | Total in queue: ${pq.heap.length}`
      });
    }
  }
  
  // Final MST
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [...visitedNodes],
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      mstEdges: [...mstEdges],
      currentEdges: [],
      consideredEdge: null,
      minHeap: []
    },
    description: "Prim's algorithm complete! We've constructed the minimum spanning tree.",
    codeHighlight: "    return MST",
    complexityInfo: `MST total weight: ${mstEdges.reduce((sum, edge) => sum + edge.weight, 0)}`
  });
  
  return steps;
};

// Custom visualization component for Prim's MST
const PrimsVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    nodes = [], 
    edges = [], 
    visitedNodes = [], 
    activeNodes = [], 
    currentNode = null,
    mstEdges = [],
    consideredEdge = null,
    currentEdges = [],
    minHeap = []
  } = data || {};

  // Convert MST edges and current consideration to path format for GraphVisualization
  const path = [
    ...mstEdges.map(edge => ({ source: edge.source, target: edge.target })),
    ...(consideredEdge ? [consideredEdge] : [])
  ];
  
  // Render priority queue information
  const renderPriorityQueue = () => {
    if (!minHeap || minHeap.length === 0) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-md overflow-x-auto">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Priority Queue (Edge Weights)</h3>
        <div className="flex flex-wrap gap-2">
          {minHeap.map((item, i) => (
            <div key={i} className="bg-blue-50 border border-blue-200 rounded-md p-2">
              <div className="text-xs text-blue-800">
                {nodes[item.edge.source].label}-{nodes[item.edge.target].label}: {item.weight}
              </div>
            </div>
          ))}
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
            edges: edges.map(edge => {
              // Mark MST edges in green
              if (mstEdges.some(e => 
                (e.source === edge.source && e.target === edge.target) || 
                (e.source === edge.target && e.target === edge.source)
              )) {
                return { ...edge, mstEdge: true };
              }
              // Mark current edges being considered in yellow
              if (currentEdges.some(e => 
                (e.source === edge.source && e.target === edge.target) || 
                (e.source === edge.target && e.target === edge.source)
              )) {
                return { ...edge, currentEdge: true };
              }
              return edge;
            }),
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
      
      {/* Display priority queue */}
      {renderPriorityQueue()}
      
      {/* Display MST weight information */}
      {mstEdges.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <h3 className="text-sm font-medium text-green-700 mb-2">MST Edges</h3>
          <ul className="text-xs space-y-1">
            {mstEdges.map((edge, i) => (
              <li key={i} className="flex justify-between">
                <span>{nodes[edge.source].label} — {nodes[edge.target].label}</span>
                <span className="font-medium">Weight: {edge.weight}</span>
              </li>
            ))}
            <li className="border-t border-green-200 pt-1 mt-1 font-medium">
              Total MST Weight: {mstEdges.reduce((sum, edge) => sum + edge.weight, 0)}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const PrimsVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Prim's Algorithm"
      initialData={initialData}
      generateSteps={generatePrimsSteps}
      VisualizationComponent={PrimsVisualizationComponent}
      description="Prim's algorithm finds a minimum spanning tree for a connected weighted graph. It starts with a single vertex and grows the MST one vertex at a time, always adding the minimum weight edge that connects a vertex in the MST to a vertex outside it."
    />
  );
};

export default PrimsVisualization; 