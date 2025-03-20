import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample graph for Kruskal's algorithm
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
    sortedEdges: [],
    consideredEdge: null,
    mstEdges: [],
    rejectedEdges: [],
    disjointSets: []
  };
};

// Union-Find data structure for cycle detection
class UnionFind {
  constructor(size) {
    this.parent = Array(size).fill().map((_, i) => i);
    this.rank = Array(size).fill(0);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false; // Already in same set
    
    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    
    return true;
  }
  
  // Get the current disjoint sets for visualization
  getSets(n) {
    const sets = {};
    for (let i = 0; i < n; i++) {
      const root = this.find(i);
      if (!sets[root]) sets[root] = [];
      sets[root].push(i);
    }
    return Object.values(sets);
  }
}

// Kruskal's algorithm visualization steps generator
const generateKruskalsSteps = (initialData) => {
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
        sortedEdges: [],
        consideredEdge: null,
        mstEdges: [],
        rejectedEdges: [],
        disjointSets: []
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  const { nodes, edges } = data;
  
  // Initial state
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [],
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      sortedEdges: [],
      consideredEdge: null,
      mstEdges: [],
      rejectedEdges: [],
      disjointSets: nodes.map((_, i) => [i]) // Each node in its own set
    },
    description: "Starting Kruskal's algorithm. We'll build a minimum spanning tree by repeatedly adding the lowest-weight edge that doesn't create a cycle.",
    codeHighlight: "procedure Kruskal(G):\n    A := ∅ // A will contain the edges of the MST\n    for each vertex v in G:\n        Make-Set(v) // Create a set for each vertex",
    complexityInfo: "Time Complexity: O(E log E) or O(E log V) where E is number of edges and V is number of vertices"
  });
  
  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: [],
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      sortedEdges: sortedEdges.map(e => ({ source: e.source, target: e.target, weight: e.weight })),
      consideredEdge: null,
      mstEdges: [],
      rejectedEdges: [],
      disjointSets: nodes.map((_, i) => [i])
    },
    description: "Sort all edges in non-decreasing order of their weight. We'll consider edges in this order.",
    codeHighlight: "    sort edges of G by weight in non-decreasing order",
    complexityInfo: "Sorting takes O(E log E) time"
  });
  
  // Initialize the union-find data structure
  const unionFind = new UnionFind(nodes.length);
  const mstEdges = [];
  const rejectedEdges = [];
  
  // Process each edge in sorted order
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const { source, target, weight } = edge;
    
    // Highlight the edge being considered
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [],
        activeNodes: [source, target],
        currentNode: null,
        nextNodes: [],
        sortedEdges: sortedEdges.map(e => ({ source: e.source, target: e.target, weight: e.weight })),
        consideredEdge: { source, target },
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        disjointSets: unionFind.getSets(nodes.length)
      },
      description: `Considering edge ${nodes[source].label}-${nodes[target].label} with weight ${weight}. Checking if it creates a cycle...`,
      codeHighlight: "    for each edge (u, v) in G, in non-decreasing order of weight:",
      complexityInfo: `Processed ${i}/${sortedEdges.length} edges | MST edges: ${mstEdges.length}/${nodes.length - 1}`
    });
    
    // Check if adding this edge creates a cycle
    if (unionFind.find(source) !== unionFind.find(target)) {
      // Doesn't create a cycle, add to MST
      unionFind.union(source, target);
      mstEdges.push({ source, target, weight });
      
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: [],
          activeNodes: [source, target],
          currentNode: null,
          nextNodes: [],
          sortedEdges: sortedEdges.map(e => ({ source: e.source, target: e.target, weight: e.weight })),
          consideredEdge: null,
          mstEdges: [...mstEdges],
          rejectedEdges: [...rejectedEdges],
          disjointSets: unionFind.getSets(nodes.length)
        },
        description: `Edge ${nodes[source].label}-${nodes[target].label} doesn't create a cycle. Adding it to the MST and merging the sets containing ${nodes[source].label} and ${nodes[target].label}.`,
        codeHighlight: "        if Find-Set(u) ≠ Find-Set(v):\n            A := A ∪ {(u, v)}\n            Union(u, v)",
        complexityInfo: `MST edges: ${mstEdges.length}/${nodes.length - 1}`
      });
      
      // If we've added n-1 edges, we're done
      if (mstEdges.length === nodes.length - 1) {
        break;
      }
    } else {
      // Would create a cycle, reject
      rejectedEdges.push({ source, target, weight });
      
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: [],
          activeNodes: [],
          currentNode: null,
          nextNodes: [],
          sortedEdges: sortedEdges.map(e => ({ source: e.source, target: e.target, weight: e.weight })),
          consideredEdge: null,
          mstEdges: [...mstEdges],
          rejectedEdges: [...rejectedEdges],
          disjointSets: unionFind.getSets(nodes.length)
        },
        description: `Edge ${nodes[source].label}-${nodes[target].label} would create a cycle. Rejecting it.`,
        codeHighlight: "        // Skip this edge as it would create a cycle",
        complexityInfo: `Rejected edges: ${rejectedEdges.length}`
      });
    }
  }
  
  // Final MST
  steps.push({
    data: {
      nodes: [...nodes],
      edges: [...edges],
      visitedNodes: nodes.map((_, i) => i), // All nodes are part of the MST
      activeNodes: [],
      currentNode: null,
      nextNodes: [],
      sortedEdges: sortedEdges.map(e => ({ source: e.source, target: e.target, weight: e.weight })),
      consideredEdge: null,
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      disjointSets: unionFind.getSets(nodes.length)
    },
    description: "Kruskal's algorithm complete! We've constructed the minimum spanning tree.",
    codeHighlight: "    return A // The MST is complete",
    complexityInfo: `MST total weight: ${mstEdges.reduce((sum, edge) => sum + edge.weight, 0)}`
  });
  
  return steps;
};

// Custom visualization component for Kruskal's MST
const KruskalsVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    nodes = [], 
    edges = [], 
    visitedNodes = [], 
    activeNodes = [], 
    mstEdges = [],
    rejectedEdges = [],
    consideredEdge = null,
    disjointSets = []
  } = data || {};

  // Convert MST edges and current consideration to path format for GraphVisualization
  const path = [
    ...mstEdges.map(edge => ({ source: edge.source, target: edge.target })),
    ...(consideredEdge ? [consideredEdge] : [])
  ];
  
  // Render disjoint sets information
  const renderDisjointSets = () => {
    if (!disjointSets || disjointSets.length === 0) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-md overflow-x-auto">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Disjoint Sets</h3>
        <div className="flex flex-wrap gap-2">
          {disjointSets.map((set, i) => (
            <div key={i} className="bg-blue-50 border border-blue-200 rounded-md p-2">
              <div className="text-xs text-blue-800">
                Set {i+1}: {set.map(nodeIdx => nodes[nodeIdx].label).join(', ')}
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
              // Mark rejected edges in red
              if (rejectedEdges.some(e => 
                (e.source === edge.source && e.target === edge.target) || 
                (e.source === edge.target && e.target === edge.source)
              )) {
                return { ...edge, rejectedEdge: true };
              }
              return edge;
            }),
            visitedNodes,
            activeNodes,
            currentNode: null,
            nextNodes: [],
            path
          }}
          step={step}
          stepInfo={stepInfo}
        />
      </div>
      
      {/* Display disjoint sets */}
      {renderDisjointSets()}
      
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

const KruskalsVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Kruskal's Algorithm"
      initialData={initialData}
      generateSteps={generateKruskalsSteps}
      VisualizationComponent={KruskalsVisualizationComponent}
      description="Kruskal's algorithm finds a minimum spanning tree for a connected weighted graph. It follows a greedy approach by adding the edge with the lowest weight that doesn't create a cycle."
    />
  );
};

export default KruskalsVisualization; 