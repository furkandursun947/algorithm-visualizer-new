import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GraphVisualization = ({ 
  data, 
  step, 
  stepInfo 
}) => {
  const { 
    nodes = [], 
    edges = [], 
    visitedNodes = [], 
    activeNodes = [], 
    currentNode = null,
    nextNodes = [], 
    path = []
  } = data || {};
  
  // Calculate the graph layout (position of each node)
  const width = 600;
  const height = 300; // Reduce height to make more room for the distance matrix
  const nodeRadius = 25;
  // Add padding to ensure nodes aren't cut off at the edges
  const padding = nodeRadius * 2;
  
  // Create a simple circle layout if positions aren't provided
  const nodePositions = nodes.map((node, index) => {
    if (node.position) return node.position;
    
    const angle = (2 * Math.PI * index) / nodes.length;
    // Reduce the radius to ensure nodes fit within the viewable area with padding
    const radius = Math.min(width, height) * 0.35;
    return {
      x: width / 2 + radius * Math.cos(angle),
      y: height / 2 + radius * Math.sin(angle)
    };
  });
  
  // Edge rendering helper
  const renderEdge = (edge, index) => {
    const sourcePos = nodePositions[edge.source];
    const targetPos = nodePositions[edge.target];
    
    // Calculate angle for arrowhead
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Adjust end point to be on the edge of the node circle
    const length = Math.sqrt(dx * dx + dy * dy);
    const targetX = sourcePos.x + (dx * (length - nodeRadius)) / length;
    const targetY = sourcePos.y + (dy * (length - nodeRadius)) / length;
    
    // Check if edge is part of the current path
    const isInPath = path.some(p => 
      p.source === edge.source && p.target === edge.target || 
      (!edge.directed && p.source === edge.target && p.target === edge.source)
    );
    
    // Check if edge is part of the MST (for Kruskal's algorithm)
    const isMSTEdge = edge.mstEdge === true;
    
    // Check if edge is rejected (for Kruskal's algorithm)
    const isRejectedEdge = edge.rejectedEdge === true;
    
    // Check if edge is currently being considered (for Prim's algorithm)
    const isCurrentEdge = edge.currentEdge === true;
    
    return (
      <g key={`edge-${edge.source}-${edge.target}`}>
        <motion.line
          initial={{ pathLength: 1, opacity: 1 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            stroke: isMSTEdge ? "#10B981" : isRejectedEdge ? "#EF4444" : isCurrentEdge ? "#F59E0B" : isInPath ? "#10B981" : "#94A3B8",
            strokeWidth: isMSTEdge || isInPath ? 3 : isRejectedEdge ? 1 : isCurrentEdge ? 2.5 : 2,
            strokeDasharray: isRejectedEdge ? "4,4" : "none"
          }}
          transition={{ duration: 0.5 }}
          x1={sourcePos.x}
          y1={sourcePos.y}
          x2={targetX}
          y2={targetY}
          markerEnd={edge.directed ? "url(#arrowhead)" : undefined}
        />
        {edge.weight !== undefined && (
          <text
            x={(sourcePos.x + targetPos.x) / 2}
            y={(sourcePos.y + targetPos.y) / 2 - 8}
            fill={isMSTEdge ? "#047857" : isRejectedEdge ? "#B91C1C" : isCurrentEdge ? "#B45309" : "#4B5563"}
            textAnchor="middle"
            fontSize="12"
            fontWeight={isMSTEdge || isCurrentEdge ? "600" : "500"}
            className="edge-weight"
          >
            {edge.weight}
          </text>
        )}
      </g>
    );
  };
  
  // Node rendering helper
  const renderNode = (node, index) => {
    const position = nodePositions[index];
    
    // Determine node style based on its state
    let fillColor = "#F3F4F6";
    let textColor = "#1F2937";
    let ringColor = "none";
    
    if (index === currentNode) {
      fillColor = "#ECFDF5";
      textColor = "#047857";
      ringColor = "#10B981";
    } else if (activeNodes.includes(index)) {
      fillColor = "#FEF3C7";
      textColor = "#92400E";
      ringColor = "#F59E0B";
    } else if (nextNodes.includes(index)) {
      fillColor = "#EFF6FF";
      textColor = "#1E40AF";
      ringColor = "#3B82F6";
    } else if (visitedNodes.includes(index)) {
      fillColor = "#F9FAFB";
      textColor = "#6B7280";
      ringColor = "#9CA3AF";
    }
    
    return (
      <motion.g 
        key={`node-${index}`}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
      >
        {/* Node circle */}
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={nodeRadius}
          initial={{
            fill: "#F3F4F6",
            stroke: "none",
            strokeWidth: 1
          }}
          animate={{
            fill: fillColor,
            stroke: ringColor === "none" ? "#E5E7EB" : ringColor,
            strokeWidth: ringColor === "none" ? 1 : 3
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Node label */}
        <motion.text
          x={position.x}
          y={position.y + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="600"
          initial={{ fill: "#1F2937" }}
          animate={{ fill: textColor }}
          transition={{ duration: 0.3 }}
        >
          {node.label || index}
        </motion.text>
      </motion.g>
    );
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <svg 
        width={width} 
        height={height} 
        className="graph-visualization"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Define the arrowhead marker for directed edges */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
          </marker>
        </defs>
        
        {/* Render edges first so they're below the nodes */}
        <g className="edges">
          {edges.map(renderEdge)}
        </g>
        
        {/* Render nodes */}
        <g className="nodes">
          {nodes.map(renderNode)}
        </g>
      </svg>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center mt-4 text-sm">
        <div className="flex items-center mx-2">
          <div className="w-3 h-3 rounded-full bg-white border border-gray-300 mr-1"></div>
          <span className="text-gray-600">Unvisited</span>
        </div>
        {currentNode !== null && (
          <div className="flex items-center mx-2">
            <div className="w-3 h-3 rounded-full bg-green-50 border-2 border-green-500 mr-1"></div>
            <span className="text-green-700">Current</span>
          </div>
        )}
        {activeNodes.length > 0 && (
          <div className="flex items-center mx-2">
            <div className="w-3 h-3 rounded-full bg-yellow-50 border-2 border-yellow-500 mr-1"></div>
            <span className="text-yellow-700">Active</span>
          </div>
        )}
        {nextNodes.length > 0 && (
          <div className="flex items-center mx-2">
            <div className="w-3 h-3 rounded-full bg-blue-50 border-2 border-blue-500 mr-1"></div>
            <span className="text-blue-700">Next</span>
          </div>
        )}
        {visitedNodes.length > 0 && (
          <div className="flex items-center mx-2">
            <div className="w-3 h-3 rounded-full bg-gray-100 border-2 border-gray-400 mr-1"></div>
            <span className="text-gray-600">Visited</span>
          </div>
        )}
        {/* Show MST edges in legend for Kruskal's algorithm */}
        {edges.some(e => e.mstEdge) && (
          <div className="flex items-center mx-2">
            <div className="w-6 h-1 bg-green-500 mr-1"></div>
            <span className="text-green-700">MST Edge</span>
          </div>
        )}
        {/* Show current edges in legend for Prim's algorithm */}
        {edges.some(e => e.currentEdge) && (
          <div className="flex items-center mx-2">
            <div className="w-6 h-1 bg-yellow-500 mr-1"></div>
            <span className="text-yellow-700">Current Edge</span>
          </div>
        )}
        {/* Show rejected edges in legend for Kruskal's algorithm */}
        {edges.some(e => e.rejectedEdge) && (
          <div className="flex items-center mx-2">
            <div className="w-6 h-1 bg-red-500 border-0 border-dashed mr-1" style={{ borderTopStyle: 'dashed' }}></div>
            <span className="text-red-700">Rejected Edge</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphVisualization; 