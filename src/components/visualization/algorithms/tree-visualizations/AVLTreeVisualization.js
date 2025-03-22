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
      inserted: '#A7F3D0',    // For newly inserted nodes
      deleted: '#FCA5A5',     // For nodes being deleted
      rotated: '#C4B5FD',     // For nodes involved in rotation
      balanceFactor: '#FEF3C7' // For nodes with balance factor check
    },
    border: {
      default: '#9CA3AF',
      visited: '#059669',
      processing: '#F59E0B',
      highlighted: '#2563EB',
      inserted: '#10B981',    // For newly inserted nodes
      deleted: '#EF4444',     // For nodes being deleted
      rotated: '#7C3AED',     // For nodes involved in rotation
      balanceFactor: '#D97706' // For nodes with balance factor check
    },
    edge: {
      default: '#9CA3AF',
      highlighted: '#60A5FA',
      rotating: '#7C3AED'     // For edges involved in rotation
    },
    text: '#1F2937',
    balanceFactor: '#EF4444'  // For displaying balance factor numbers
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
  const drawNode = (ctx, position, node, status) => {
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
    } else if (status === 'rotated') {
      fillColor = colors.node.rotated;
      strokeColor = colors.border.rotated;
    } else if (status === 'balanceFactor') {
      fillColor = colors.node.balanceFactor;
      strokeColor = colors.border.balanceFactor;
    }
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(position.x, position.y, NODE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    
    // Draw value
    ctx.font = `bold ${FONT_SIZE} ${FONT_FAMILY}`;
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value, position.x, position.y);
    
    // Draw balance factor if it exists and status is 'balanceFactor' or 'rotated'
    if ((status === 'balanceFactor' || status === 'rotated') && node.balanceFactor !== undefined) {
      const balanceFactorText = node.balanceFactor.toString();
      const balanceX = position.x + NODE_RADIUS * 0.8;
      const balanceY = position.y - NODE_RADIUS * 0.8;
      
      // Draw small circle for balance factor
      ctx.beginPath();
      ctx.arc(balanceX, balanceY, NODE_RADIUS / 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.balanceFactor;
      ctx.stroke();
      
      // Draw balance factor text
      ctx.font = `bold ${FONT_SIZE * 0.7} ${FONT_FAMILY}`;
      ctx.fillStyle = colors.balanceFactor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(balanceFactorText, balanceX, balanceY);
    }
  };

  // Draw edge
  const drawEdge = (ctx, start, end, status) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = LINE_WIDTH;
    
    if (status === 'rotating') {
      ctx.strokeStyle = colors.edge.rotating;
      ctx.lineWidth = LINE_WIDTH * 1.5;
    } else if (status === 'highlighted') {
      ctx.strokeStyle = colors.edge.highlighted;
    } else {
      ctx.strokeStyle = colors.edge.default;
    }
    
    ctx.stroke();
  };

  // Draw the entire tree
  const drawTree = (ctx, tree, positions, edgeStatus, nodeStatus) => {
    if (!tree) return;
    
    // Clear the canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges first (so they're behind nodes)
    drawEdges(ctx, tree, positions, edgeStatus || {});
    
    // Draw nodes
    drawNodes(ctx, tree, positions, nodeStatus || {});
  };

  // Draw all edges
  const drawEdges = (ctx, node, positions, edgeStatus) => {
    if (!node) return;
    
    if (node.left && positions[node.left.id]) {
      const startPos = positions[node.id];
      const endPos = positions[node.left.id];
      const edgeId = `${node.id}-${node.left.id}`;
      const status = edgeStatus[edgeId] || 'default';
      
      drawEdge(ctx, startPos, endPos, status);
      drawEdges(ctx, node.left, positions, edgeStatus);
    }
    
    if (node.right && positions[node.right.id]) {
      const startPos = positions[node.id];
      const endPos = positions[node.right.id];
      const edgeId = `${node.id}-${node.right.id}`;
      const status = edgeStatus[edgeId] || 'default';
      
      drawEdge(ctx, startPos, endPos, status);
      drawEdges(ctx, node.right, positions, edgeStatus);
    }
  };

  // Draw all nodes
  const drawNodes = (ctx, node, positions, nodeStatus) => {
    if (!node) return;
    
    const position = positions[node.id];
    if (position) {
      const status = nodeStatus[node.id] || 'default';
      drawNode(ctx, position, node, status);
    }
    
    if (node.left) drawNodes(ctx, node.left, positions, nodeStatus);
    if (node.right) drawNodes(ctx, node.right, positions, nodeStatus);
  };
  
  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      
      const container = containerRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match container
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Redraw with updated dimensions
      if (data && data.tree) {
        const ctx = canvas.getContext('2d');
        const totalWidth = canvas.width;
        const positions = calculatePositions(data.tree, {}, 0, 0, totalWidth);
        drawTree(ctx, data.tree, positions, data.edgeStatus, data.nodeStatus);
      }
    };
    
    // Set initial size
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);
  
  // Draw whenever data changes
  useEffect(() => {
    if (!canvasRef.current || !data || !data.tree) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const totalWidth = canvas.width;
    const positions = calculatePositions(data.tree, {}, 0, 0, totalWidth);
    
    drawTree(ctx, data.tree, positions, data.edgeStatus, data.nodeStatus);
  }, [data]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative"
      style={{ minHeight: '400px' }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      {stepInfo && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-2">{stepInfo.title}</h3>
          <p>{stepInfo.description}</p>
        </motion.div>
      )}
    </div>
  );
};

// Generate initial tree data
const generateInitialData = () => {
  return {
    tree: null,
    nodeStatus: {},
    edgeStatus: {}
  };
};

// Helper to find a node in the tree
const findNode = (tree, value) => {
  if (!tree) return null;
  if (tree.value === value) return tree;
  
  if (value < tree.value) {
    return findNode(tree.left, value);
  } else {
    return findNode(tree.right, value);
  }
};

// Helper to clone a tree
const cloneTree = (node) => {
  if (!node) return null;
  
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
};

// Calculate height of node
const getHeight = (node) => {
  if (!node) return 0;
  return node.height || 0;
};

// Calculate balance factor for a node
const getBalanceFactor = (node) => {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
};

// Right rotation
const rightRotate = (y, idCounter) => {
  const x = y.left;
  const T2 = x.right;
  
  // Perform rotation
  x.right = y;
  y.left = T2;
  
  // Update heights
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  
  // Update balance factors
  y.balanceFactor = getBalanceFactor(y);
  x.balanceFactor = getBalanceFactor(x);
  
  return x;
};

// Left rotation
const leftRotate = (x, idCounter) => {
  const y = x.right;
  const T2 = y.left;
  
  // Perform rotation
  y.left = x;
  x.right = T2;
  
  // Update heights
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  
  // Update balance factors
  x.balanceFactor = getBalanceFactor(x);
  y.balanceFactor = getBalanceFactor(y);
  
  return y;
};

// Insert a node into AVL tree
const insertNode = (root, value, idCounter) => {
  // Standard BST insert
  if (!root) {
    return {
      id: `node-${idCounter.current++}`,
      value,
      left: null,
      right: null,
      height: 1,
      balanceFactor: 0
    };
  }
  
  if (value < root.value) {
    root.left = insertNode(root.left, value, idCounter);
  } else if (value > root.value) {
    root.right = insertNode(root.right, value, idCounter);
  } else {
    // Duplicate value, return unchanged
    return root;
  }
  
  // Update height
  root.height = Math.max(getHeight(root.left), getHeight(root.right)) + 1;
  
  // Calculate balance factor
  const balance = getBalanceFactor(root);
  root.balanceFactor = balance;
  
  // Left heavy
  if (balance > 1) {
    // Left-Left Case
    if (value < root.left.value) {
      return rightRotate(root, idCounter);
    }
    // Left-Right Case
    else {
      root.left = leftRotate(root.left, idCounter);
      return rightRotate(root, idCounter);
    }
  }
  
  // Right heavy
  if (balance < -1) {
    // Right-Right Case
    if (value > root.right.value) {
      return leftRotate(root, idCounter);
    }
    // Right-Left Case
    else {
      root.right = rightRotate(root.right, idCounter);
      return leftRotate(root, idCounter);
    }
  }
  
  return root;
};

// Find the node with minimum value in a tree
const findMinNode = (node) => {
  let current = node;
  while (current && current.left) {
    current = current.left;
  }
  return current;
};

// Delete a node from AVL tree
const deleteNode = (root, value, idCounter) => {
  if (!root) return null;
  
  // Standard BST delete
  if (value < root.value) {
    root.left = deleteNode(root.left, value, idCounter);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value, idCounter);
  } else {
    // Node with only one child or no child
    if (!root.left) {
      return root.right;
    } else if (!root.right) {
      return root.left;
    }
    
    // Node with two children
    const temp = findMinNode(root.right);
    root.value = temp.value;
    root.right = deleteNode(root.right, temp.value, idCounter);
  }
  
  // Update height
  root.height = Math.max(getHeight(root.left), getHeight(root.right)) + 1;
  
  // Calculate balance factor
  const balance = getBalanceFactor(root);
  root.balanceFactor = balance;
  
  // Balance the tree if needed
  // Left heavy
  if (balance > 1) {
    // Left-Left Case
    if (getBalanceFactor(root.left) >= 0) {
      return rightRotate(root, idCounter);
    }
    // Left-Right Case
    else {
      root.left = leftRotate(root.left, idCounter);
      return rightRotate(root, idCounter);
    }
  }
  
  // Right heavy
  if (balance < -1) {
    // Right-Right Case
    if (getBalanceFactor(root.right) <= 0) {
      return leftRotate(root, idCounter);
    }
    // Right-Left Case
    else {
      root.right = rightRotate(root.right, idCounter);
      return leftRotate(root, idCounter);
    }
  }
  
  return root;
};

// Generate visualization steps for the AVL tree operations
const generateVisualizationSteps = (initialData) => {
  const steps = [];
  const idCounter = { current: 1 };
  
  // Initial step
  steps.push({
    data: { 
      ...initialData 
    },
    info: {
      title: 'Initial AVL Tree',
      description: 'We start with an empty AVL tree. Each node will store a value and maintain balance information.'
    }
  });
  
  // Add some nodes to demonstrate insertions
  const insertValues = [10, 20, 30, 15, 5, 25, 40];
  
  // Insert nodes one by one
  let currentTree = null;
  
  for (const value of insertValues) {
    // Step: Start insertion process
    steps.push({
      data: {
        tree: cloneTree(currentTree),
        nodeStatus: {},
        edgeStatus: {}
      },
      info: {
        title: `Insert ${value}`,
        description: `We will insert the value ${value} into the AVL tree while maintaining balance.`
      }
    });
    
    // Step: BST insertion
    const bstTree = cloneTree(currentTree);
    let insertedNode = null;
    
    if (!bstTree) {
      insertedNode = {
        id: `node-${idCounter.current}`,
        value,
        height: 1,
        balanceFactor: 0,
        left: null,
        right: null
      };
    } else {
      // Simulate standard BST insertion to highlight the path
      let current = bstTree;
      let lastNode = null;
      let lastDir = '';
      const path = [];
      
      while (current) {
        path.push(current.id);
        lastNode = current;
        
        if (value < current.value) {
          if (!current.left) break;
          current = current.left;
          lastDir = 'left';
        } else if (value > current.value) {
          if (!current.right) break;
          current = current.right;
          lastDir = 'right';
        } else {
          // Duplicate, just return
          break;
        }
      }
      
      // Show path traversal
      const nodeStatus = {};
      path.forEach(id => {
        nodeStatus[id] = 'processing';
      });
      
      steps.push({
        data: {
          tree: cloneTree(bstTree),
          nodeStatus,
          edgeStatus: {}
        },
        info: {
          title: `Standard BST Insertion`,
          description: `Following BST rules, we traverse the tree to find the correct position for ${value}.`
        }
      });
      
      // Insert the new node in the visualization
      if (lastNode && value !== lastNode.value) {
        insertedNode = {
          id: `node-${idCounter.current}`,
          value,
          height: 1,
          balanceFactor: 0,
          left: null,
          right: null
        };
        
        if (lastDir === 'left') {
          lastNode.left = insertedNode;
        } else {
          lastNode.right = insertedNode;
        }
      }
    }
    
    if (insertedNode) {
      idCounter.current++;
      // Show the newly inserted node
      const nodeStatus = {};
      nodeStatus[insertedNode.id] = 'inserted';
      
      steps.push({
        data: {
          tree: cloneTree(bstTree),
          nodeStatus,
          edgeStatus: {}
        },
        info: {
          title: `Node Inserted`,
          description: `The value ${value} has been inserted as a leaf node following BST rules.`
        }
      });
    }
    
    // Step: Update heights and check balance
    const updatedTree = cloneTree(currentTree);
    currentTree = insertNode(updatedTree, value, idCounter);
    
    // Identify nodes with updated heights and balance factors
    const nodesWithNewHeights = [];
    const findNodesWithUpdatedHeights = (oldTree, newTree, path = []) => {
      if (!oldTree && !newTree) return;
      if (!oldTree || !newTree) {
        if (newTree) nodesWithNewHeights.push(newTree.id);
        return;
      }
      
      if (oldTree.height !== newTree.height || 
          oldTree.balanceFactor !== newTree.balanceFactor) {
        nodesWithNewHeights.push(newTree.id);
      }
      
      findNodesWithUpdatedHeights(oldTree.left, newTree.left, [...path, 'left']);
      findNodesWithUpdatedHeights(oldTree.right, newTree.right, [...path, 'right']);
    };
    
    findNodesWithUpdatedHeights(bstTree, currentTree);
    
    // Show nodes with updated heights and balance factors
    if (nodesWithNewHeights.length > 0) {
      const nodeStatus = {};
      nodesWithNewHeights.forEach(id => {
        nodeStatus[id] = 'balanceFactor';
      });
      
      steps.push({
        data: {
          tree: cloneTree(currentTree),
          nodeStatus,
          edgeStatus: {}
        },
        info: {
          title: `Update Heights and Balance Factors`,
          description: `After insertion, we update the height and calculate the balance factor for affected nodes. A node is balanced if its balance factor is -1, 0, or 1.`
        }
      });
    }
    
    // Check if rotations are needed
    const unbalancedNode = findUnbalancedNode(bstTree);
    if (unbalancedNode) {
      // Highlight the unbalanced node
      const nodeStatus = {};
      nodeStatus[unbalancedNode.id] = 'balanceFactor';
      
      steps.push({
        data: {
          tree: cloneTree(bstTree),
          nodeStatus,
          edgeStatus: {}
        },
        info: {
          title: `Unbalanced Node Detected`,
          description: `The node with value ${unbalancedNode.value} has become unbalanced with a balance factor of ${unbalancedNode.balanceFactor}. We need to perform a rotation to restore balance.`
        }
      });
      
      // Identify rotation type
      let rotationType = '';
      const balance = unbalancedNode.balanceFactor;
      
      if (balance > 1) {
        if (unbalancedNode.left && value < unbalancedNode.left.value) {
          rotationType = 'Right Rotation (Left-Left Case)';
        } else {
          rotationType = 'Left-Right Rotation';
        }
      } else if (balance < -1) {
        if (unbalancedNode.right && value > unbalancedNode.right.value) {
          rotationType = 'Left Rotation (Right-Right Case)';
        } else {
          rotationType = 'Right-Left Rotation';
        }
      }
      
      // Show nodes involved in rotation
      const nodeStatus2 = {};
      nodeStatus2[unbalancedNode.id] = 'rotated';
      
      if (unbalancedNode.left) nodeStatus2[unbalancedNode.left.id] = 'rotated';
      if (unbalancedNode.right) nodeStatus2[unbalancedNode.right.id] = 'rotated';
      
      const edgeStatus = {};
      if (unbalancedNode.left) edgeStatus[`${unbalancedNode.id}-${unbalancedNode.left.id}`] = 'rotating';
      if (unbalancedNode.right) edgeStatus[`${unbalancedNode.id}-${unbalancedNode.right.id}`] = 'rotating';
      
      steps.push({
        data: {
          tree: cloneTree(bstTree),
          nodeStatus: nodeStatus2,
          edgeStatus
        },
        info: {
          title: `Perform ${rotationType}`,
          description: `To restore balance, we perform a ${rotationType.toLowerCase()} on the subtree rooted at ${unbalancedNode.value}.`
        }
      });
    }
    
    // Show the final balanced tree
    steps.push({
      data: {
        tree: cloneTree(currentTree),
        nodeStatus: {},
        edgeStatus: {}
      },
      info: {
        title: `Balanced AVL Tree`,
        description: `After insertion and any necessary rotations, the tree is now balanced. All nodes have a balance factor between -1 and 1.`
      }
    });
  }
  
  // Demonstrate deletion
  const deleteValue = 20;
  
  steps.push({
    data: {
      tree: cloneTree(currentTree),
      nodeStatus: {},
      edgeStatus: {}
    },
    info: {
      title: `Delete ${deleteValue}`,
      description: `We will delete the node with value ${deleteValue} from the AVL tree while maintaining balance.`
    }
  });
  
  // Find the node to delete
  const nodeToDelete = findNode(currentTree, deleteValue);
  if (nodeToDelete) {
    // Highlight the node to delete
    const nodeStatus = {};
    nodeStatus[nodeToDelete.id] = 'deleted';
    
    steps.push({
      data: {
        tree: cloneTree(currentTree),
        nodeStatus,
        edgeStatus: {}
      },
      info: {
        title: `Locate Node to Delete`,
        description: `We first locate the node with value ${deleteValue} that we want to delete.`
      }
    });
    
    // Perform the deletion
    const updatedTree = cloneTree(currentTree);
    currentTree = deleteNode(updatedTree, deleteValue, idCounter);
    
    // Show nodes with updated heights and balance factors
    const nodesWithNewHeights = [];
    const findNodesWithUpdatedHeights = (oldTree, newTree) => {
      if (!oldTree && !newTree) return;
      if (!oldTree || !newTree) return;
      
      if (oldTree.height !== newTree.height || 
          oldTree.balanceFactor !== newTree.balanceFactor) {
        nodesWithNewHeights.push(newTree.id);
      }
      
      findNodesWithUpdatedHeights(oldTree.left, newTree.left);
      findNodesWithUpdatedHeights(oldTree.right, newTree.right);
    };
    
    findNodesWithUpdatedHeights(updatedTree, currentTree);
    
    if (nodesWithNewHeights.length > 0) {
      const nodeStatus = {};
      nodesWithNewHeights.forEach(id => {
        nodeStatus[id] = 'balanceFactor';
      });
      
      steps.push({
        data: {
          tree: cloneTree(currentTree),
          nodeStatus,
          edgeStatus: {}
        },
        info: {
          title: `Update Heights and Balance Factors`,
          description: `After deletion, we update the height and calculate the balance factor for affected nodes.`
        }
      });
    }
    
    // Show the final balanced tree after deletion
    steps.push({
      data: {
        tree: cloneTree(currentTree),
        nodeStatus: {},
        edgeStatus: {}
      },
      info: {
        title: `Final Balanced AVL Tree`,
        description: `After deletion and any necessary rotations, the tree is now balanced. All nodes have a balance factor between -1 and 1.`
      }
    });
  }
  
  return steps;
};

// Helper function to find an unbalanced node in the tree
const findUnbalancedNode = (node) => {
  if (!node) return null;
  
  const balance = getBalanceFactor(node);
  if (balance > 1 || balance < -1) return node;
  
  const leftUnbalanced = findUnbalancedNode(node.left);
  if (leftUnbalanced) return leftUnbalanced;
  
  return findUnbalancedNode(node.right);
};

// AVL Tree Visualization Component that will be passed to the container
const AVLTreeVisualizationComponent = ({ data, stepInfo }) => {
  return (
    <div className="h-full">
      <CanvasTreeVisualization data={data} stepInfo={stepInfo} />
    </div>
  );
};

// Main AVL Tree Visualization Component
const AVLTreeVisualization = () => {
  const initialData = generateInitialData();
  
  return (
    <VisualizationContainer
      algorithmName="AVL Tree Operations"
      initialData={initialData}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={AVLTreeVisualizationComponent}
      description="Demonstrates insertion and deletion operations on an AVL tree with automatic balancing via rotations."
    />
  );
};

export default AVLTreeVisualization; 