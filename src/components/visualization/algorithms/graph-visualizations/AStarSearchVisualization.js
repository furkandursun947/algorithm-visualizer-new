import React, { useMemo } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import GraphVisualization from '../../GraphVisualization';

// Function to generate a sample weighted graph for A* algorithm
const generateSampleGraph = () => {
  // Create nodes in a grid-like pattern for a more intuitive A* visualization
  const nodes = [
    { label: "S", isStart: true },  // Start node
    { label: "A" },
    { label: "B" },
    { label: "C" },
    { label: "D" },
    { label: "E" },
    { label: "F" },
    { label: "G", isGoal: true }    // Goal node
  ];
  
  // Define positions for the nodes in a more grid-like layout to visualize heuristic better
  const positions = [
    { x: 100, y: 150 },  // S
    { x: 200, y: 75 },   // A
    { x: 200, y: 225 },  // B
    { x: 300, y: 50 },   // C
    { x: 300, y: 150 },  // D
    { x: 300, y: 250 },  // E
    { x: 400, y: 100 },  // F
    { x: 500, y: 150 }   // G
  ];
  
  // Assign positions to nodes
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].position = positions[i];
  }
  
  // Create weighted edges between nodes
  const edges = [
    { source: 0, target: 1, weight: 3 },  // S - A
    { source: 0, target: 2, weight: 2 },  // S - B
    { source: 1, target: 3, weight: 3 },  // A - C
    { source: 1, target: 4, weight: 5 },  // A - D
    { source: 2, target: 4, weight: 4 },  // B - D
    { source: 2, target: 5, weight: 3 },  // B - E
    { source: 3, target: 6, weight: 4 },  // C - F
    { source: 4, target: 6, weight: 2 },  // D - F
    { source: 4, target: 5, weight: 2 },  // D - E
    { source: 5, target: 7, weight: 6 },  // E - G
    { source: 6, target: 7, weight: 4 }   // F - G
  ];
  
  const startNode = 0;
  const goalNode = 7;
  
  return {
    nodes,
    edges,
    visitedNodes: [],
    activeNodes: [],
    currentNode: null,
    nextNodes: [],
    openSet: [],
    closedSet: [],
    gValues: Array(nodes.length).fill(Infinity),
    hValues: Array(nodes.length).fill(0),
    fValues: Array(nodes.length).fill(Infinity),
    path: [],
    startNode,
    goalNode
  };
};

// Heuristic function: Euclidean distance to goal
const calculateHeuristic = (node, goalNode, nodes) => {
  const dx = nodes[goalNode].position.x - nodes[node].position.x;
  const dy = nodes[goalNode].position.y - nodes[node].position.y;
  return Math.sqrt(dx * dx + dy * dy) / 30; // Scale down for better visualization
};

// Helper function to find the node with minimum f value
const findNodeWithMinF = (fValues, openSet) => {
  let minF = Infinity;
  let minNode = -1;
  
  for (const node of openSet) {
    if (fValues[node] < minF) {
      minF = fValues[node];
      minNode = node;
    }
  }
  
  return minNode;
};

// A* algorithm visualization steps generator
const generateAStarSteps = (initialData) => {
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
        openSet: [],
        closedSet: [],
        gValues: [],
        hValues: [],
        fValues: [],
        path: []
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null
    }];
  }
  
  // Create deep copy of the initial data for the simulation
  const data = JSON.parse(JSON.stringify(initialData));
  const { nodes, edges, startNode, goalNode } = data;
  
  // Generate adjacency list for the graph
  const adjacencyList = Array(nodes.length).fill().map(() => []);
  edges.forEach(edge => {
    adjacencyList[edge.source].push({ node: edge.target, weight: edge.weight });
    // For undirected graphs, add the reverse edge as well
    if (!edge.directed) {
      adjacencyList[edge.target].push({ node: edge.source, weight: edge.weight });
    }
  });
  
  // Initialize A* data structures
  const gValues = Array(nodes.length).fill(Infinity);
  gValues[startNode] = 0;
  
  // Calculate heuristic values for each node to the goal
  const hValues = nodes.map((_, index) => 
    calculateHeuristic(index, goalNode, nodes)
  );
  
  // Calculate f values (f = g + h)
  const fValues = nodes.map((_, index) => 
    gValues[index] === Infinity ? Infinity : gValues[index] + hValues[index]
  );
  
  const openSet = [startNode];
  const closedSet = [];
  const cameFrom = Array(nodes.length).fill(null);
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
      openSet: [...openSet],
      closedSet: [...closedSet],
      gValues: [...gValues],
      hValues: [...hValues],
      fValues: [...fValues],
      path: []
    },
    description: "Initialize A* Search algorithm. Add start node to open set with g=0 and calculate heuristic values for all nodes.",
    codeHighlight: "function AStar(graph, start, goal):\n    // Initialize open and closed lists\n    openSet := {start}\n    closedSet := {}\n    \n    // Initialize costs\n    g[start] := 0 // Cost from start to start\n    // Initialize estimated total cost from start to goal\n    f[start] := g[start] + heuristic(start, goal)",
    complexityInfo: `Heuristic value for the start node: h(${nodes[startNode].label}) = ${hValues[startNode].toFixed(2)}`
  });
  
  // Main loop of A* algorithm
  while (openSet.length > 0) {
    // Find the node in openSet with the lowest fValue
    const currentNode = findNodeWithMinF(fValues, openSet);
    
    // If we reached the goal
    if (currentNode === goalNode) {
      // Reconstruct the path
      let current = goalNode;
      const reconstructedPath = [];
      
      while (current !== null && current !== startNode) {
        const prev = cameFrom[current];
        reconstructedPath.push({
          source: prev,
          target: current
        });
        current = prev;
      }
      
      steps.push({
        data: {
          nodes: [...nodes],
          edges: [...edges],
          visitedNodes: [...closedSet],
          activeNodes: [],
          currentNode,
          nextNodes: [],
          openSet: [...openSet],
          closedSet: [...closedSet],
          gValues: [...gValues],
          hValues: [...hValues],
          fValues: [...fValues],
          path: reconstructedPath
        },
        description: `Goal reached! Found path from ${nodes[startNode].label} to ${nodes[goalNode].label} with a total cost of ${gValues[goalNode]}.`,
        codeHighlight: "        if current = goal:\n            return reconstructPath(cameFrom, current)",
        complexityInfo: `Path cost: ${gValues[goalNode]}`
      });
      
      break;
    }
    
    // Remove current from openSet
    openSet.splice(openSet.indexOf(currentNode), 1);
    
    // Add current to closedSet
    closedSet.push(currentNode);
    
    // Add step for selecting the current node
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [...closedSet],
        activeNodes: [],
        currentNode,
        nextNodes: [],
        openSet: [...openSet],
        closedSet: [...closedSet],
        gValues: [...gValues],
        hValues: [...hValues],
        fValues: [...fValues],
        path: [...path]
      },
      description: `Select node ${nodes[currentNode].label} with the lowest f-value: f(${nodes[currentNode].label}) = ${fValues[currentNode].toFixed(2)} (g=${gValues[currentNode].toFixed(2)}, h=${hValues[currentNode].toFixed(2)}).`,
      codeHighlight: "        // Current := the node in openSet with the lowest f-value\n        current := node in openSet with minimum f[node]\n        \n        remove current from openSet\n        add current to closedSet",
      complexityInfo: `Closed set size: ${closedSet.length}, Open set size: ${openSet.length}`
    });
    
    // Get neighbors of the current node
    const neighbors = adjacencyList[currentNode];
    
    // Check if there are neighbors to process
    if (neighbors.length > 0) {
      const unvisitedNeighbors = neighbors.filter(neighbor => !closedSet.includes(neighbor.node));
      
      if (unvisitedNeighbors.length > 0) {
        steps.push({
          data: {
            nodes: [...nodes],
            edges: [...edges],
            visitedNodes: [...closedSet],
            activeNodes: unvisitedNeighbors.map(n => n.node),
            currentNode,
            nextNodes: [],
            openSet: [...openSet],
            closedSet: [...closedSet],
            gValues: [...gValues],
            hValues: [...hValues],
            fValues: [...fValues],
            path: [...path]
          },
          description: `Checking neighbors of node ${nodes[currentNode].label}.`,
          codeHighlight: "        for each neighbor of current:",
          complexityInfo: `Found ${unvisitedNeighbors.length} neighbors not in closed set`
        });
      }
      
      // Process each neighbor to update g and f values
      for (const { node: neighborNode, weight } of neighbors) {
        // Skip if in closedSet
        if (closedSet.includes(neighborNode)) {
          steps.push({
            data: {
              nodes: [...nodes],
              edges: [...edges],
              visitedNodes: [...closedSet],
              activeNodes: [neighborNode],
              currentNode,
              nextNodes: [],
              openSet: [...openSet],
              closedSet: [...closedSet],
              gValues: [...gValues],
              hValues: [...hValues],
              fValues: [...fValues],
              path: [...path]
            },
            description: `Skip neighbor ${nodes[neighborNode].label} as it is already in the closed set.`,
            codeHighlight: "            if neighbor in closedSet:\n                continue",
            complexityInfo: `Neighbor ${nodes[neighborNode].label} is in closed set`
          });
          continue;
        }
        
        // Calculate tentative g value
        const tentativeG = gValues[currentNode] + weight;
        
        // Current g value for display
        const currentG = gValues[neighborNode];
        
        // Check if this path to neighbor is better than any previous one
        const isNewPathBetter = tentativeG < currentG;
        
        // Add step for checking the neighbor
        steps.push({
          data: {
            nodes: [...nodes],
            edges: [...edges],
            visitedNodes: [...closedSet],
            activeNodes: [neighborNode],
            currentNode,
            nextNodes: [],
            openSet: [...openSet],
            closedSet: [...closedSet],
            gValues: [...gValues],
            hValues: [...hValues],
            fValues: [...fValues],
            path: [...path]
          },
          description: `Check path to ${nodes[neighborNode].label}: tentative g=${tentativeG.toFixed(2)} vs current g=${currentG === Infinity ? "∞" : currentG.toFixed(2)}. h(${nodes[neighborNode].label})=${hValues[neighborNode].toFixed(2)}`,
          codeHighlight: "            // tentative_g is the distance from start to neighbor through current\n            tentative_g := g[current] + distance(current, neighbor)",
          complexityInfo: `Current g(${nodes[neighborNode].label})=${currentG === Infinity ? "∞" : currentG.toFixed(2)}, h(${nodes[neighborNode].label})=${hValues[neighborNode].toFixed(2)}`
        });
        
        // If new path is better, update g and f values
        if (isNewPathBetter) {
          // Update gValue, fValue, and cameFrom
          gValues[neighborNode] = tentativeG;
          fValues[neighborNode] = tentativeG + hValues[neighborNode];
          cameFrom[neighborNode] = currentNode;
          
          // Add/update the path
          // First, check if there's already a path to this node and remove it
          path.forEach((p, i) => {
            if (p.target === neighborNode) {
              path.splice(i, 1);
            }
          });
          
          // Add the new path segment
          path.push({
            source: currentNode,
            target: neighborNode
          });
          
          // Add to openSet if not already in it
          if (!openSet.includes(neighborNode)) {
            openSet.push(neighborNode);
            
            steps.push({
              data: {
                nodes: [...nodes],
                edges: [...edges],
                visitedNodes: [...closedSet],
                activeNodes: [neighborNode],
                currentNode,
                nextNodes: openSet.filter(n => n !== neighborNode),
                openSet: [...openSet],
                closedSet: [...closedSet],
                gValues: [...gValues],
                hValues: [...hValues],
                fValues: [...fValues],
                path: [...path]
              },
              description: `Add ${nodes[neighborNode].label} to open set with g=${tentativeG.toFixed(2)}, h=${hValues[neighborNode].toFixed(2)}, f=${fValues[neighborNode].toFixed(2)}.`,
              codeHighlight: "                if neighbor not in openSet:\n                    add neighbor to openSet",
              complexityInfo: `Updated f(${nodes[neighborNode].label})=${fValues[neighborNode].toFixed(2)}`
            });
          } else {
            steps.push({
              data: {
                nodes: [...nodes],
                edges: [...edges],
                visitedNodes: [...closedSet],
                activeNodes: [neighborNode],
                currentNode,
                nextNodes: openSet.filter(n => n !== neighborNode),
                openSet: [...openSet],
                closedSet: [...closedSet],
                gValues: [...gValues],
                hValues: [...hValues],
                fValues: [...fValues],
                path: [...path]
              },
              description: `Update ${nodes[neighborNode].label} in open set with new g=${tentativeG.toFixed(2)}, same h=${hValues[neighborNode].toFixed(2)}, new f=${fValues[neighborNode].toFixed(2)}.`,
              codeHighlight: "            if neighbor not in openSet or tentative_g < g[neighbor]:\n                cameFrom[neighbor] := current\n                g[neighbor] := tentative_g\n                f[neighbor] := g[neighbor] + heuristic(neighbor, goal)",
              complexityInfo: `Updated f(${nodes[neighborNode].label})=${fValues[neighborNode].toFixed(2)}`
            });
          }
        } else {
          // No update needed
          steps.push({
            data: {
              nodes: [...nodes],
              edges: [...edges],
              visitedNodes: [...closedSet],
              activeNodes: [],
              currentNode,
              nextNodes: openSet,
              openSet: [...openSet],
              closedSet: [...closedSet],
              gValues: [...gValues],
              hValues: [...hValues],
              fValues: [...fValues],
              path: [...path]
            },
            description: `No update needed for ${nodes[neighborNode].label} as the current path is better.`,
            codeHighlight: "            if neighbor not in openSet or tentative_g < g[neighbor]:",
            complexityInfo: `Keeping g(${nodes[neighborNode].label})=${gValues[neighborNode].toFixed(2)}, f(${nodes[neighborNode].label})=${fValues[neighborNode].toFixed(2)}`
          });
        }
      }
    }
  }
  
  // If the open set is empty and we haven't found the goal
  if (openSet.length === 0 && !closedSet.includes(goalNode)) {
    steps.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [...closedSet],
        activeNodes: [],
        currentNode: null,
        nextNodes: [],
        openSet: [],
        closedSet: [...closedSet],
        gValues: [...gValues],
        hValues: [...hValues],
        fValues: [...fValues],
        path: []
      },
      description: `No path found from ${nodes[startNode].label} to ${nodes[goalNode].label}. The open set is empty.`,
      codeHighlight: "    // Open set is empty but goal was never reached\n    return failure",
      complexityInfo: "A* Search terminated without finding a path"
    });
  }
  
  return steps;
};

// Custom visualization component for A* algorithm
const AStarVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    nodes = [], 
    edges = [], 
    visitedNodes = [], 
    activeNodes = [], 
    currentNode = null,
    nextNodes = [],
    openSet = [],
    closedSet = [],
    gValues = [],
    hValues = [],
    fValues = [],
    path = []
  } = data || {};
  
  // Render a table showing g, h, and f values for nodes
  const renderValuesTable = () => {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-2">A* Values</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Node</th>
              <th className="px-3 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">g(n)</th>
              <th className="px-3 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">h(n)</th>
              <th className="px-3 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">f(n) = g(n) + h(n)</th>
              <th className="px-3 py-2 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nodes.map((node, index) => {
              let statusText = "Unvisited";
              let statusColor = "text-gray-500";
              
              if (index === currentNode) {
                statusText = "Current";
                statusColor = "text-green-600";
              } else if (closedSet.includes(index)) {
                statusText = "Closed";
                statusColor = "text-red-600";
              } else if (openSet.includes(index)) {
                statusText = "Open";
                statusColor = "text-blue-600";
              }
              
              return (
                <tr key={index} className={index === currentNode ? "bg-green-50" : openSet.includes(index) ? "bg-blue-50" : closedSet.includes(index) ? "bg-red-50" : ""}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{node.label}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {gValues[index] === Infinity ? "∞" : gValues[index].toFixed(2)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {hValues[index].toFixed(2)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {fValues[index] === Infinity ? "∞" : fValues[index].toFixed(2)}
                  </td>
                  <td className={`px-3 py-2 whitespace-nowrap text-sm ${statusColor}`}>
                    {statusText}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Extend the graph data with open and closed set information
  const graphData = {
    nodes,
    edges,
    visitedNodes: closedSet,  // Use closedSet as visitedNodes
    activeNodes,
    currentNode,
    nextNodes: openSet.filter(node => node !== currentNode),  // Use openSet as nextNodes
    path
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
      {renderValuesTable()}
    </div>
  );
};

const AStarSearchVisualization = () => {
  // Generate sample graph for initial display
  const initialData = useMemo(() => {
    return generateSampleGraph();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="A* Search Algorithm"
      initialData={initialData}
      generateSteps={generateAStarSteps}
      VisualizationComponent={AStarVisualizationComponent}
      description="A* is a best-first search algorithm that finds the shortest path from a start node to a goal node in a weighted graph. It uses a heuristic function to guide the search more efficiently than algorithms like Dijkstra's by prioritizing paths that appear to be heading toward the goal."
    />
  );
};

export default AStarSearchVisualization; 