import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Canvas Tree Visualization Component
const CanvasTreeVisualization = ({ data, stepInfo }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Constants for drawing
  const NODE_RADIUS = 25;
  const LEVEL_HEIGHT = 100;
  const LINE_WIDTH = 2;
  const FONT_SIZE = '16px';
  const FONT_FAMILY = 'Arial, sans-serif';
  
  // Colors
  const colors = {
    background: '#FFFFFF',
    node: {
      default: '#F3F4F6',
      visited: '#34D399',
      processing: '#FCD34D',
      highlighted: '#60A5FA',
      inserted: '#A7F3D0', // For newly inserted nodes
      deleted: '#FCA5A5'   // For nodes being deleted
    },
    border: {
      default: '#9CA3AF',
      visited: '#059669',
      processing: '#F59E0B',
      highlighted: '#2563EB',
      inserted: '#10B981', // For newly inserted nodes
      deleted: '#EF4444'   // For nodes being deleted
    },
    edge: {
      default: '#9CA3AF',
      highlighted: '#60A5FA'
    },
    text: '#1F2937'
  };

  // Calculate node positions
  const calculatePositions = (node, positions = {}, level = 0, index = 0, totalWidth = 800) => {
    if (!node) return positions;

    // Calculate width for this level
    const levelWidth = totalWidth / Math.pow(2, level);
    
    // Calculate position
    const x = (index + 0.5) * levelWidth;
    const y = level * LEVEL_HEIGHT + 80;
    
    positions[node.id] = { x, y };
    
    // Calculate positions for children
    if (node.left) {
      calculatePositions(
        node.left, 
        positions, 
        level + 1, 
        index * 2, 
        totalWidth
      );
    }
    
    if (node.right) {
      calculatePositions(
        node.right, 
        positions, 
        level + 1, 
        index * 2 + 1, 
        totalWidth
      );
    }
    
    return positions;
  };

  // Draw node
  const drawNode = (ctx, position, value, status) => {
    // Determine colors based on status
    let fillColor = colors.node.default;
    let strokeColor = colors.border.default;
    
    if (status === 'processing') {
      fillColor = colors.node.processing;
      strokeColor = colors.border.processing;
    } else if (status === 'visited') {
      fillColor = colors.node.visited;
      strokeColor = colors.border.visited;
    } else if (status === 'highlighted') {
      fillColor = colors.node.highlighted;
      strokeColor = colors.border.highlighted;
    } else if (status === 'inserted') {
      fillColor = colors.node.inserted;
      strokeColor = colors.border.inserted;
    } else if (status === 'deleted') {
      fillColor = colors.node.deleted;
      strokeColor = colors.border.deleted;
    }
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(position.x, position.y, NODE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    
    // Draw text
    ctx.font = `bold ${FONT_SIZE} ${FONT_FAMILY}`;
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value, position.x, position.y);
  };

  // Draw edge
  const drawEdge = (ctx, start, end, isHighlighted) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = isHighlighted ? colors.edge.highlighted : colors.edge.default;
    ctx.stroke();
  };

  // Draw the entire tree
  const drawTree = (ctx, tree, positions) => {
    if (!tree) return;
    
    // Clear the canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges first (so they're behind nodes)
    drawEdges(ctx, tree, positions);
    
    // Draw nodes
    drawNodes(ctx, tree, positions);
  };

  // Draw all edges
  const drawEdges = (ctx, node, positions) => {
    if (!node) return;
    
    if (node.left && positions[node.left.id]) {
      const isHighlighted = data.highlighted.includes(node.id) && 
                           data.highlighted.includes(node.left.id);
      drawEdge(
        ctx, 
        positions[node.id], 
        positions[node.left.id], 
        isHighlighted
      );
      drawEdges(ctx, node.left, positions);
    }
    
    if (node.right && positions[node.right.id]) {
      const isHighlighted = data.highlighted.includes(node.id) && 
                           data.highlighted.includes(node.right.id);
      drawEdge(
        ctx, 
        positions[node.id], 
        positions[node.right.id], 
        isHighlighted
      );
      drawEdges(ctx, node.right, positions);
    }
  };

  // Draw all nodes
  const drawNodes = (ctx, node, positions) => {
    if (!node || !positions[node.id]) return;
    
    let status = 'default';
    if (node.id === data.processing) {
      status = 'processing';
    } else if (data.visited.includes(node.id)) {
      status = 'visited';
    } else if (data.highlighted.includes(node.id)) {
      status = 'highlighted';
    } else if (node.id === data.inserted) {
      status = 'inserted';
    } else if (node.id === data.deleted) {
      status = 'deleted';
    }
    
    drawNode(ctx, positions[node.id], node.value, status);
    
    if (node.left) drawNodes(ctx, node.left, positions);
    if (node.right) drawNodes(ctx, node.right, positions);
  };

  // Handle canvas resizing and drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Set canvas size
    canvas.width = container.clientWidth;
    canvas.height = 400;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate positions based on canvas size
    const positions = calculatePositions(data.tree, {}, 0, 0, canvas.width);
    
    // Draw tree
    drawTree(ctx, data.tree, positions);
    
    // Handle window resizing
    const handleResize = () => {
      canvas.width = container.clientWidth;
      canvas.height = 400;
      const newPositions = calculatePositions(data.tree, {}, 0, 0, canvas.width);
      drawTree(ctx, data.tree, newPositions);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]); // Redraw whenever data changes

  // Display current operation details
  const [activeTab, setActiveTab] = useState('tree');

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center">
      <div 
        ref={containerRef} 
        className="relative w-full h-[400px] mb-12 flex items-center justify-center overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      
      {/* BST Operation Details */}
      <div className="mt-4 w-full max-w-4xl">
        <div className="flex justify-center gap-4 mb-4">
          <button 
            onClick={() => setActiveTab('tree')}
            className={`px-4 py-2 rounded-md ${activeTab === 'tree' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            BST Visualization
          </button>
          <button 
            onClick={() => setActiveTab('operations')}
            className={`px-4 py-2 rounded-md ${activeTab === 'operations' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            BST Properties
          </button>
        </div>
        
        {activeTab === 'tree' && (
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Current Operation</h3>
            <p className="text-gray-700">{stepInfo.description}</p>
            
            {data.operationLog && data.operationLog.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-gray-800">Operation Log:</h4>
                <div className="bg-white p-3 rounded-md border border-gray-200 max-h-32 overflow-y-auto">
                  {data.operationLog.map((log, index) => (
                    <div key={index} className="text-sm mb-1 text-gray-700">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'operations' && (
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">BST Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <h4 className="font-medium mb-2 text-blue-700">BST Property</h4>
                <p className="text-sm text-gray-700">For every node:</p>
                <ul className="list-disc list-inside text-sm text-gray-700 ml-2">
                  <li>All values in left subtree are &lt; node's value</li>
                  <li>All values in right subtree are &gt; node's value</li>
                </ul>
              </div>
              
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <h4 className="font-medium mb-2 text-blue-700">Time Complexities</h4>
                <ul className="text-sm text-gray-700">
                  <li><span className="font-medium">Search:</span> O(log n) average, O(n) worst</li>
                  <li><span className="font-medium">Insert:</span> O(log n) average, O(n) worst</li>
                  <li><span className="font-medium">Delete:</span> O(log n) average, O(n) worst</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Generate initial BST data
const generateInitialData = () => {
  // Create a balanced initial BST for demonstration
  const tree = {
    id: 1,
    value: 50,
    left: {
      id: 2,
      value: 30,
      left: {
        id: 4,
        value: 20,
      },
      right: {
        id: 5,
        value: 40,
      },
    },
    right: {
      id: 3,
      value: 70,
      left: {
        id: 6,
        value: 60,
      },
      right: {
        id: 7,
        value: 80,
      },
    },
  };

  return {
    tree,
    visited: [],
    processing: null,
    highlighted: [],
    inserted: null,
    deleted: null,
    operationLog: [],
    currentOperation: null
  };
};

// Helper function to find a node in the tree
const findNode = (tree, value) => {
  if (!tree) return null;
  if (tree.value === value) return tree;
  
  if (value < tree.value) {
    return findNode(tree.left, value);
  } else {
    return findNode(tree.right, value);
  }
};

// Helper function to clone the tree to avoid mutations
const cloneTree = (node) => {
  if (!node) return null;
  
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
};

// BST Operations
const insertNode = (tree, value, newId) => {
  if (!tree) {
    return { id: newId, value, left: null, right: null };
  }
  
  if (value < tree.value) {
    return { ...tree, left: insertNode(tree.left, value, newId) };
  } else if (value > tree.value) {
    return { ...tree, right: insertNode(tree.right, value, newId) };
  }
  
  // Value already exists, return the unchanged tree
  return tree;
};

const findMinNode = (node) => {
  let current = node;
  
  while (current && current.left) {
    current = current.left;
  }
  
  return current;
};

const deleteNode = (tree, value) => {
  if (!tree) return null;
  
  if (value < tree.value) {
    return { ...tree, left: deleteNode(tree.left, value) };
  } else if (value > tree.value) {
    return { ...tree, right: deleteNode(tree.right, value) };
  } else {
    // Node with only one or no child
    if (!tree.left) {
      return tree.right;
    } else if (!tree.right) {
      return tree.left;
    }
    
    // Node with two children
    // Get the inorder successor (smallest in the right subtree)
    const minNode = findMinNode(tree.right);
    return {
      ...tree,
      value: minNode.value,
      id: tree.id, // Keep the same ID for the node position
      right: deleteNode(tree.right, minNode.value)
    };
  }
};

// Generate visualization steps for BST operations
const generateVisualizationSteps = (initialData) => {
  const steps = [];
  const operationLog = [];
  let nextId = 8; // Starting ID for new nodes
  
  // Clone the initial tree
  let tree = cloneTree(initialData.tree);
  
  // Initial step - show the BST
  steps.push({
    data: {
      ...initialData,
      tree,
      highlighted: [1], // Highlight the root initially
      operationLog: [...operationLog]
    },
    description: `This is a Binary Search Tree (BST). Each node has a value, with all values in left subtree less than the node's value and all values in right subtree greater than the node's value.`
  });
  
  operationLog.push("Initial BST created with nodes [20, 30, 40, 50, 60, 70, 80]");
  
  // 1. SEARCH OPERATION
  steps.push({
    data: {
      ...initialData,
      tree,
      highlighted: [1], // Start at root
      operationLog: [...operationLog]
    },
    description: `Let's search for value 40 in the BST. We'll start at the root (50).`
  });
  
  // Search for value 40
  let current = tree;
  let path = [current.id];
  
  steps.push({
    data: {
      ...initialData,
      tree,
      processing: current.id,
      operationLog: [...operationLog, "Starting search for value 40 at the root (50)"]
    },
    description: `Compare 40 < 50? Yes, so we go to the left subtree.`
  });
  
  // Move to the left child (30)
  current = current.left;
  path.push(current.id);
  
  steps.push({
    data: {
      ...initialData,
      tree,
      processing: current.id,
      visited: [path[0]],
      operationLog: [...operationLog, "40 < 50, moving to left child (30)"]
    },
    description: `Compare 40 > 30? Yes, so we go to the right subtree.`
  });
  
  // Move to the right child (40)
  current = current.right;
  path.push(current.id);
  
  steps.push({
    data: {
      ...initialData,
      tree,
      processing: current.id,
      visited: [path[0], path[1]],
      operationLog: [...operationLog, "40 > 30, moving to right child (40)", "Found value 40!"]
    },
    description: `Found 40! The search is complete.`
  });
  
  // 2. INSERT OPERATION
  operationLog.push("Search operation completed");
  operationLog.push("Starting insert operation for value 55");
  
  steps.push({
    data: {
      ...initialData,
      tree,
      highlighted: [1],
      operationLog: [...operationLog]
    },
    description: `Now, let's insert a new value 55 into the BST. We start at the root (50).`
  });
  
  // Start insertion process
  steps.push({
    data: {
      ...initialData,
      tree,
      processing: 1, // Root node
      operationLog: [...operationLog, "Starting at root (50)"]
    },
    description: `Compare 55 > 50? Yes, so we go to the right subtree.`
  });
  
  steps.push({
    data: {
      ...initialData,
      tree,
      processing: 3, // Right child (70)
      visited: [1],
      operationLog: [...operationLog, "55 > 50, moving to right child (70)"]
    },
    description: `Compare 55 < 70? Yes, so we go to the left subtree.`
  });
  
  steps.push({
    data: {
      ...initialData,
      tree,
      processing: 6, // Left child of 70 (60)
      visited: [1, 3],
      operationLog: [...operationLog, "55 < 70, moving to left child (60)"]
    },
    description: `Compare 55 < 60? Yes, so we go to the left subtree, but there's no node there.`
  });
  
  // Insert the new node (55)
  const newNode = { id: nextId, value: 55, left: null, right: null };
  tree = cloneTree(tree); // Clone to avoid mutations
  
  // Find node 60 and add 55 as its left child
  const node60 = findNode(tree, 60);
  if (node60) {
    node60.left = newNode;
  }
  
  steps.push({
    data: {
      ...initialData,
      tree,
      inserted: nextId,
      visited: [1, 3, 6],
      operationLog: [...operationLog, "No left child of 60, inserting 55 as new left child"]
    },
    description: `We insert 55 as the left child of node 60.`
  });
  
  nextId++;
  operationLog.push("Insert operation completed for value 55");
  
  // 3. DELETE OPERATION
  operationLog.push("Starting delete operation for value 30");
  
  steps.push({
    data: {
      ...initialData,
      tree,
      highlighted: [1],
      operationLog: [...operationLog]
    },
    description: `Now, let's delete the node with value 30. We start at the root (50).`
  });
  
  // Start deletion process
  steps.push({
    data: {
      ...initialData,
      tree,
      processing: 1, // Root node
      operationLog: [...operationLog, "Starting at root (50)"]
    },
    description: `Compare 30 < 50? Yes, so we go to the left subtree.`
  });
  
  steps.push({
    data: {
      ...initialData,
      tree,
      processing: 2, // Left child (30)
      visited: [1],
      deleted: 2,
      operationLog: [...operationLog, "30 < 50, moving to left child (30)", "Found node to delete (30)"]
    },
    description: `Found the node with value 30. This node has two children, so we need to find its inorder successor.`
  });
  
  steps.push({
    data: {
      ...initialData,
      tree,
      highlighted: [2, 4, 5], // Node 30 and its children
      visited: [1],
      deleted: 2,
      operationLog: [...operationLog, "Node 30 has two children (20, 40)"]
    },
    description: `For a node with two children, we replace it with its inorder successor (the smallest node in its right subtree).`
  });
  
  steps.push({
    data: {
      ...initialData,
      tree,
      highlighted: [5], // Node 40 (successor)
      visited: [1, 2],
      deleted: 2,
      operationLog: [...operationLog, "Inorder successor of 30 is 40 (smallest node in right subtree)"]
    },
    description: `The inorder successor of 30 is 40. We'll replace 30 with 40.`
  });
  
  // Perform the deletion
  tree = deleteNode(cloneTree(tree), 30);
  
  steps.push({
    data: {
      ...initialData,
      tree,
      visited: [1],
      operationLog: [...operationLog, "Replaced node 30 with its successor 40", "Delete operation completed for value 30"]
    },
    description: `After deletion: Node 30 is replaced with 40, and the BST property is maintained.`
  });
  
  // Final step - show the resulting BST
  steps.push({
    data: {
      ...initialData,
      tree,
      highlighted: [1], // Highlight the root
      operationLog: [...operationLog, "All BST operations completed successfully"]
    },
    description: `The Binary Search Tree after all operations: Search (40), Insert (55), Delete (30).`
  });
  
  return steps;
};

// Main visualization container
const BinarySearchTreeVisualization = () => {
  return (
    <VisualizationContainer
      algorithmName="Binary Search Tree Operations"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={CanvasTreeVisualization}
      description="Visualize basic operations (search, insert, delete) on a Binary Search Tree (BST), maintaining the BST property: left child < parent < right child."
    />
  );
};

export default BinarySearchTreeVisualization; 