import React, { useEffect, useRef } from 'react';
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
      highlighted: '#60A5FA'
    },
    border: {
      default: '#9CA3AF',
      visited: '#059669',
      processing: '#F59E0B',
      highlighted: '#2563EB'
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
    if (data.processing === node.id) {
      status = 'processing';
    } else if (data.visited.includes(node.value)) {
      status = 'visited';
    } else if (data.highlighted.includes(node.id)) {
      status = 'highlighted';
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

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center">
      <div 
        ref={containerRef} 
        className="relative w-full h-[400px] mb-12 flex items-center justify-center overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="mt-8 text-center w-full max-w-3xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Current Traversal</h3>
        <div className="flex flex-wrap gap-4 justify-center items-center p-6 bg-gray-50 rounded-xl shadow-sm">
          {data.result.map((value, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg text-blue-800 font-semibold text-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {value}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Generate initial data
const generateInitialData = () => {
  const tree = {
    id: 1,
    value: 4,
    left: {
      id: 2,
      value: 2,
      left: {
        id: 4,
        value: 1,
      },
      right: {
        id: 5,
        value: 3,
      },
    },
    right: {
      id: 3,
      value: 6,
      left: {
        id: 6,
        value: 5,
      },
      right: {
        id: 7,
        value: 7,
      },
    },
  };

  return {
    tree,
    visited: [],
    processing: null,
    highlighted: [],
    result: [],
  };
};

// Generate visualization steps - modified for preorder traversal (root, left, right)
const generateVisualizationSteps = (initialData) => {
  const steps = [];
  const result = [];

  const preorderTraversal = (node, path = []) => {
    if (!node) return;

    // Highlight current node and path to it
    steps.push({
      data: {
        ...initialData,
        tree: initialData.tree,
        highlighted: [...path, node.id],
        processing: null,
        visited: [...result],
        result: [...result],
      },
      description: `Moving to node ${node.value}`,
    });

    // Visit current node first (root)
    result.push(node.value);
    steps.push({
      data: {
        ...initialData,
        tree: initialData.tree,
        highlighted: [...path, node.id],
        processing: node.id,
        visited: [...result],
        result: [...result],
      },
      description: `Visiting node ${node.value} (root first). Current traversal: [${result.join(', ')}]`,
    });

    // Process left subtree
    if (node.left) {
      steps.push({
        data: {
          ...initialData,
          tree: initialData.tree,
          highlighted: [...path, node.id],
          processing: node.id,
          visited: [...result],
          result: [...result],
        },
        description: `Going to traverse left subtree of node ${node.value}`,
      });
      preorderTraversal(node.left, [...path, node.id]);
    }

    // Process right subtree
    if (node.right) {
      steps.push({
        data: {
          ...initialData,
          tree: initialData.tree,
          highlighted: [...path, node.id],
          processing: node.id,
          visited: [...result],
          result: [...result],
        },
        description: `Going to traverse right subtree of node ${node.value}`,
      });
      preorderTraversal(node.right, [...path, node.id]);
    }
  };

  preorderTraversal(initialData.tree);

  // Add final step
  steps.push({
    data: {
      ...initialData,
      tree: initialData.tree,
      highlighted: [],
      processing: null,
      visited: result,
      result: result,
    },
    description: `Preorder traversal complete! Result: [${result.join(', ')}]`,
  });

  return steps;
};

// Main visualization container
const PreorderTraversalVisualization = () => {
  return (
    <VisualizationContainer
      algorithmName="Preorder Traversal"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={CanvasTreeVisualization}
      description="Visualize how preorder traversal visits nodes in a binary tree in the order: root, left subtree, right subtree."
    />
  );
};

export default PreorderTraversalVisualization; 