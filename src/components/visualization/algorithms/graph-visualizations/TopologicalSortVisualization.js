import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample directed acyclic graph (DAG) for Topological Sort
const generateSampleGraph = () => {
  // Create a DAG representing course prerequisites or task dependencies
  const nodes = [
    { label: "A" }, // Task A or Course A
    { label: "B" }, // Task B or Course B
    { label: "C" }, // Task C or Course C
    { label: "D" }, // Task D or Course D
    { label: "E" }, // Task E or Course E
    { label: "F" }, // Task F or Course F
    { label: "G" }  // Task G or Course G
  ];
  
  // Create directed edges representing dependencies (from prerequisite to dependent)
  // For example, A -> B means A must be completed before B
  const edges = [
    { source: 0, target: 1, directed: true }, // A -> B
    { source: 0, target: 2, directed: true }, // A -> C
    { source: 1, target: 3, directed: true }, // B -> D
    { source: 1, target: 4, directed: true }, // B -> E
    { source: 2, target: 4, directed: true }, // C -> E
    { source: 2, target: 5, directed: true }, // C -> F
    { source: 3, target: 6, directed: true }, // D -> G
    { source: 4, target: 6, directed: true }, // E -> G
    { source: 5, target: 6, directed: true }  // F -> G
  ];
  
  return {
    nodes,
    edges,
    visitedNodes: [],
    activeNodes: [],
    currentNode: null,
    nextNodes: [],
    processedNodes: [],
    inDegree: Array(nodes.length).fill(0), // Track in-degree of each node
    topologicalOrder: []
  };
};

// Calculate initial in-degree for each node
const calculateInDegree = (nodes, edges) => {
  const inDegree = Array(nodes.length).fill(0);
  
  for (const edge of edges) {
    inDegree[edge.target]++;
  }
  
  return inDegree;
};

// Topological Sort algorithm visualization steps generator
const generateTopologicalSortSteps = (initialData) => {
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
        processedNodes: [],
        inDegree: [],
        topologicalOrder: []
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  const { nodes, edges } = data;
  
  // Calculate in-degree for each node
  const inDegree = calculateInDegree(nodes, edges);
  data.inDegree = [...inDegree];
  
  // Find all nodes with in-degree 0 to start
  const nodesWithZeroInDegree = [];
  for (let i = 0; i < inDegree.length; i++) {
    if (inDegree[i] === 0) {
      nodesWithZeroInDegree.push(i);
    }
  }
  
  // Add initial state
  steps.push({
    data: {
      ...data,
      nextNodes: [...nodesWithZeroInDegree],
      topologicalOrder: []
    },
    description: "Starting Topological Sort. Identifying nodes with no incoming edges (in-degree zero).",
    codeHighlight: "L := Empty list that will contain the sorted vertices\nS := Set of all vertices with no incoming edges (in-degree zero)"
  });
  
  // Initialize topological order and processed nodes
  const topologicalOrder = [];
  const processedNodes = [];
  const remainingEdges = [...edges]; // Track remaining edges
  
  // Process nodes with zero in-degree
  while (nodesWithZeroInDegree.length > 0) {
    // Remove a node from the set of zero in-degree nodes
    const node = nodesWithZeroInDegree.shift();
    topologicalOrder.push(node);
    processedNodes.push(node);
    
    steps.push({
      data: {
        ...data,
        currentNode: node,
        activeNodes: [],
        visitedNodes: [...processedNodes],
        nextNodes: [...nodesWithZeroInDegree],
        processedNodes: [...processedNodes],
        topologicalOrder: [...topologicalOrder]
      },
      description: `Removed node ${nodes[node].label} from the zero in-degree set and added it to the topological ordering.`,
      codeHighlight: "remove a vertex n from S\nadd n to the end of L"
    });
    
    // Find all neighbors of the current node
    const outgoingEdges = edges.filter(edge => edge.source === node);
    const neighbors = outgoingEdges.map(edge => edge.target);
    
    if (neighbors.length > 0) {
      steps.push({
        data: {
          ...data,
          currentNode: node,
          activeNodes: [...neighbors],
          visitedNodes: [...processedNodes],
          nextNodes: [...nodesWithZeroInDegree],
          processedNodes: [...processedNodes],
          topologicalOrder: [...topologicalOrder]
        },
        description: `Finding all neighbors of node ${nodes[node].label}: ${neighbors.map(n => nodes[n].label).join(", ")}.`,
        codeHighlight: "for each vertex m with an edge e from n to m do"
      });
    }
    
    // Process each neighbor (reduce in-degree)
    for (const neighbor of neighbors) {
      // Find and remove the edge from current node to neighbor
      const edgeIndex = remainingEdges.findIndex(e => e.source === node && e.target === neighbor);
      if (edgeIndex !== -1) {
        remainingEdges.splice(edgeIndex, 1);
      }
      
      // Decrease in-degree of the neighbor
      inDegree[neighbor]--;
      
      steps.push({
        data: {
          ...data,
          currentNode: node,
          activeNodes: [neighbor],
          visitedNodes: [...processedNodes],
          nextNodes: [...nodesWithZeroInDegree],
          processedNodes: [...processedNodes],
          topologicalOrder: [...topologicalOrder],
          inDegree: [...inDegree],
          edges: [...remainingEdges]
        },
        description: `Removed edge from ${nodes[node].label} to ${nodes[neighbor].label}. Decreased in-degree of ${nodes[neighbor].label} to ${inDegree[neighbor]}.`,
        codeHighlight: "remove edge e from the graph"
      });
      
      // If the neighbor's in-degree becomes 0, add it to the zero in-degree set
      if (inDegree[neighbor] === 0) {
        nodesWithZeroInDegree.push(neighbor);
        
        steps.push({
          data: {
            ...data,
            currentNode: node,
            activeNodes: [neighbor],
            visitedNodes: [...processedNodes],
            nextNodes: [...nodesWithZeroInDegree],
            processedNodes: [...processedNodes],
            topologicalOrder: [...topologicalOrder],
            inDegree: [...inDegree],
            edges: [...remainingEdges]
          },
          description: `Node ${nodes[neighbor].label} now has in-degree 0. Adding it to the set of nodes to process.`,
          codeHighlight: "if m has no other incoming edges then\n    insert m into S\nend if"
        });
      }
    }
  }
  
  // Check if all nodes were included in the topological sort
  const hasAllNodes = topologicalOrder.length === nodes.length;
  
  // Final state
  steps.push({
    data: {
      ...data,
      currentNode: null,
      activeNodes: [],
      visitedNodes: [...processedNodes],
      nextNodes: [],
      processedNodes: [...processedNodes],
      topologicalOrder: [...topologicalOrder],
      inDegree: [...inDegree],
      edges: [...remainingEdges]
    },
    description: hasAllNodes 
      ? `Topological Sort complete! The ordering is: ${topologicalOrder.map(n => nodes[n].label).join(" → ")}`
      : "The graph contains at least one cycle. Topological sort is only possible for directed acyclic graphs (DAGs).",
    codeHighlight: hasAllNodes 
      ? "return L (a topologically sorted order)"
      : "return error (graph has at least one cycle)"
  });
  
  return steps;
};

// Create custom visualization component for Topological Sort
const TopologicalSortVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    nodes = [], 
    edges = [], 
    visitedNodes = [], 
    activeNodes = [], 
    currentNode = null,
    nextNodes = [],
    topologicalOrder = []
  } = data || {};
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Graph visualization */}
      <div className="flex-1">
        <GraphVisualization 
          data={data} 
          step={step} 
          stepInfo={stepInfo} 
        />
      </div>
      
      {/* Topological Order Display */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Topological Order</h3>
        <div className="flex flex-wrap items-center">
          {topologicalOrder.length > 0 ? (
            topologicalOrder.map((nodeIndex, index) => (
              <React.Fragment key={nodeIndex}>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-medium">
                  {nodes[nodeIndex].label}
                </div>
                {index < topologicalOrder.length - 1 && (
                  <div className="mx-2">
                    <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z" fill="#4B5563"/>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <p className="text-gray-500">No nodes processed yet</p>
          )}
        </div>
      </div>
      
      {/* In-degree Information */}
      {data && data.inDegree && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Node In-degrees</h3>
          <div className="flex flex-wrap gap-2">
            {data.inDegree.map((degree, index) => (
              <div 
                key={index}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  degree === 0 && !visitedNodes.includes(index)
                    ? 'bg-yellow-100 text-yellow-800'
                    : visitedNodes.includes(index)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {nodes[index].label}: {degree}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TopologicalSortVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Topological Sort"
      initialData={initialData}
      generateSteps={generateTopologicalSortSteps}
      VisualizationComponent={TopologicalSortVisualizationComponent}
      description="Topological Sort produces a linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge (u, v), vertex u comes before vertex v in the ordering. It's often used for scheduling jobs with dependencies or determining course prerequisites."
    />
  );
};

export default TopologicalSortVisualization; 