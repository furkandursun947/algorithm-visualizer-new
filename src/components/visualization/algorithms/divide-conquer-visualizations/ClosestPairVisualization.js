import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for Closest Pair of Points
const generateInitialData = () => {
  // Generate fixed points for consistent visualization
  const points = [
    { x: 50, y: 120 },
    { x: 100, y: 80 },
    { x: 140, y: 150 },
    { x: 200, y: 60 },
    { x: 220, y: 170 },
    { x: 270, y: 110 },
    { x: 300, y: 50 },
    { x: 320, y: 140 },
    { x: 350, y: 90 },
    { x: 390, y: 130 },
    { x: 410, y: 75 },
    { x: 450, y: 160 },
    { x: 480, y: 30 },
    { x: 500, y: 120 },
    { x: 530, y: 85 }
  ];

  // Sort points by x-coordinate for the algorithm
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  return {
    originalPoints: points,
    points: sortedPoints,
    divideX: null,
    minDistance: Infinity,
    closestPair: null,
    stripPoints: [],
    leftPoints: [],
    rightPoints: [],
    stage: 'initial',
    consideredPairs: []
  };
};

// Calculate Euclidean distance between two points
const distance = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// Find closest pair using brute force approach (for small point sets)
const bruteForce = (points) => {
  if (points.length < 2) return { distance: Infinity, pair: null };
  
  let minDist = Infinity;
  let closestPair = null;
  let consideredPairs = [];
  
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = distance(points[i], points[j]);
      consideredPairs.push({ 
        pair: [points[i], points[j]], 
        distance: dist 
      });
      
      if (dist < minDist) {
        minDist = dist;
        closestPair = [points[i], points[j]];
      }
    }
  }
  
  return { distance: minDist, pair: closestPair, consideredPairs };
};

// Find closest pair in the strip
const findClosestInStrip = (stripPoints, minDist) => {
  // Sort points by y-coordinate
  const sortedByY = [...stripPoints].sort((a, b) => a.y - b.y);
  let closestPair = null;
  let consideredPairs = [];
  
  for (let i = 0; i < sortedByY.length; i++) {
    // Only need to check 7 points ahead (proved mathematically)
    for (let j = i + 1; j < sortedByY.length && (sortedByY[j].y - sortedByY[i].y) < minDist; j++) {
      const dist = distance(sortedByY[i], sortedByY[j]);
      consideredPairs.push({ 
        pair: [sortedByY[i], sortedByY[j]], 
        distance: dist 
      });
      
      if (dist < minDist) {
        minDist = dist;
        closestPair = [sortedByY[i], sortedByY[j]];
      }
    }
  }
  
  return { distance: minDist, pair: closestPair, consideredPairs };
};

// Generate steps for Closest Pair of Points algorithm
const generateClosestPairSteps = (initialData) => {
  const steps = [];
  
  // Add error handling
  if (!initialData || !initialData.points) {
    return [{
      data: {
        originalPoints: [],
        points: [],
        divideX: null,
        minDistance: Infinity,
        closestPair: null,
        stripPoints: [],
        leftPoints: [],
        rightPoints: [],
        stage: 'error',
        consideredPairs: []
      },
      description: "Error: Invalid data for visualization",
      codeHighlight: null,
      complexityInfo: null
    }];
  }

  // Make a deep copy of initial data
  const data = JSON.parse(JSON.stringify(initialData));
  
  // Add initial step showing the points
  steps.push({
    data: {
      ...data,
      stage: 'initial'
    },
    description: "Initial set of 15 random points in 2D space.",
    codeHighlight: "// Given a set of points P in 2D space",
    complexityInfo: "Problem: Find the closest pair among n points."
  });
  
  // Add step showing the points sorted by x-coordinate
  steps.push({
    data: {
      ...data,
      stage: 'sorted'
    },
    description: "First, sort all points by their x-coordinate.",
    codeHighlight: "sort points P by x-coordinate",
    complexityInfo: "Sorting time complexity: O(n log n)"
  });
  
  // Function to recursively find closest pair and generate steps
  const closestPairRecursive = (points, depth, path) => {
    const n = points.length;
    
    // Base case: if there are 2 or 3 points, use brute force
    if (n <= 3) {
      const { distance: minDist, pair, consideredPairs } = bruteForce(points);
      
      // Add step for brute force case
      steps.push({
        data: {
          ...JSON.parse(JSON.stringify(data)),
          points: points,
          minDistance: minDist,
          closestPair: pair,
          stage: 'brute_force',
          consideredPairs: consideredPairs
        },
        description: `With ${n} points, using brute force approach to find closest pair.`,
        codeHighlight: "if n <= 3 then\n    return closest pair using brute force",
        complexityInfo: `Brute force calculates ${n * (n - 1) / 2} distances.`
      });
      
      return { distance: minDist, pair };
    }
    
    // Divide step: Find the middle point
    const mid = Math.floor(n / 2);
    const midX = points[mid].x;
    
    // Add step showing the division
    steps.push({
      data: {
        ...JSON.parse(JSON.stringify(data)),
        points: points,
        divideX: midX,
        leftPoints: points.slice(0, mid),
        rightPoints: points.slice(mid),
        stage: 'divide'
      },
      description: `Divide the points into two halves at x = ${midX !== null ? midX.toFixed(2) : 'N/A'}.`,
      codeHighlight: "mid = n/2\nL = points[0...mid-1]\nR = points[mid...n-1]",
      complexityInfo: "Divide step: O(1)"
    });
    
    // Conquer step: Recursively find closest pairs in left and right halves
    const leftHalf = points.slice(0, mid);
    const rightHalf = points.slice(mid);
    
    // Recursively find closest pair in left half
    const leftResult = closestPairRecursive(leftHalf, depth + 1, [...path, 'L']);
    
    // Recursively find closest pair in right half
    const rightResult = closestPairRecursive(rightHalf, depth + 1, [...path, 'R']);
    
    // Find the minimum of left and right results
    let minDist, closestPair;
    if (leftResult.distance <= rightResult.distance) {
      minDist = leftResult.distance;
      closestPair = leftResult.pair;
      
      steps.push({
        data: {
          ...JSON.parse(JSON.stringify(data)),
          points: points,
          minDistance: minDist,
          closestPair: closestPair,
          divideX: midX,
          leftPoints: leftHalf,
          rightPoints: rightHalf,
          stage: 'min_left_right'
        },
        description: "Left half has the minimum distance.",
        codeHighlight: "delta = min(closest_pair_left.distance, closest_pair_right.distance)",
        complexityInfo: `Minimum distance so far: ${minDist !== null ? minDist.toFixed(2) : 'N/A'}`
      });
    } else {
      minDist = rightResult.distance;
      closestPair = rightResult.pair;
      
      steps.push({
        data: {
          ...JSON.parse(JSON.stringify(data)),
          points: points,
          minDistance: minDist,
          closestPair: closestPair,
          divideX: midX,
          leftPoints: leftHalf,
          rightPoints: rightHalf,
          stage: 'min_left_right'
        },
        description: "Right half has the minimum distance.",
        codeHighlight: "delta = min(closest_pair_left.distance, closest_pair_right.distance)",
        complexityInfo: `Minimum distance so far: ${minDist !== null ? minDist.toFixed(2) : 'N/A'}`
      });
    }
    
    // Find points in the strip
    const stripPoints = points.filter(p => Math.abs(p.x - midX) < minDist);
    
    // Add step showing the strip
    steps.push({
      data: {
        ...JSON.parse(JSON.stringify(data)),
        points: points,
        minDistance: minDist,
        closestPair: closestPair,
        divideX: midX,
        leftPoints: leftHalf,
        rightPoints: rightHalf,
        stripPoints: stripPoints,
        stage: 'strip'
      },
      description: `Check points within distance ${minDist !== null ? minDist.toFixed(2) : 'N/A'} of the dividing line.`,
      codeHighlight: "strip = {p in P : |p.x - mid.x| < delta}",
      complexityInfo: `Strip contains ${stripPoints.length} points.`
    });
    
    // Find closest pair in the strip
    if (stripPoints.length > 1) {
      const stripResult = findClosestInStrip(stripPoints, minDist);
      
      // Add step showing considered pairs in the strip
      steps.push({
        data: {
          ...JSON.parse(JSON.stringify(data)),
          points: points,
          minDistance: minDist,
          closestPair: closestPair,
          divideX: midX,
          leftPoints: leftHalf,
          rightPoints: rightHalf,
          stripPoints: stripPoints,
          stage: 'strip_pairs',
          consideredPairs: stripResult.consideredPairs
        },
        description: "Check pairs of points in the strip.",
        codeHighlight: "for i = 0 to size(strip) - 1:\n  for j = i+1 to min(i+7, size(strip)-1):\n    update minimum distance",
        complexityInfo: "Strip processing time: O(n)"
      });
      
      // If a closer pair is found in the strip
      if (stripResult.distance < minDist) {
        minDist = stripResult.distance;
        closestPair = stripResult.pair;
        
        // Add step showing new closest pair
        steps.push({
          data: {
            ...JSON.parse(JSON.stringify(data)),
            points: points,
            minDistance: minDist,
            closestPair: closestPair,
            divideX: midX,
            leftPoints: leftHalf,
            rightPoints: rightHalf,
            stripPoints: stripPoints,
            stage: 'strip_min'
          },
          description: "Found closer pair across the dividing line!",
          codeHighlight: "if strip_min < delta then\n    update closest pair",
          complexityInfo: `New minimum distance: ${minDist !== null ? minDist.toFixed(2) : 'N/A'}`
        });
      } else {
        // Add step showing no closer pair in strip
        steps.push({
          data: {
            ...JSON.parse(JSON.stringify(data)),
            points: points,
            minDistance: minDist,
            closestPair: closestPair,
            divideX: midX,
            leftPoints: leftHalf,
            rightPoints: rightHalf,
            stripPoints: stripPoints,
            stage: 'strip_no_min'
          },
          description: "No closer pair found across the dividing line.",
          codeHighlight: "if strip_min < delta then\n    update closest pair",
          complexityInfo: `Minimum distance remains: ${minDist !== null ? minDist.toFixed(2) : 'N/A'}`
        });
      }
    }
    
    return { distance: minDist, pair: closestPair };
  };
  
  // Start the recursive process
  const result = closestPairRecursive(data.points, 0, []);
  
  // Add final step
  steps.push({
    data: {
      ...data,
      minDistance: result.distance,
      closestPair: result.pair,
      stage: 'final'
    },
    description: `Algorithm complete! The closest pair has distance ${result.distance !== null ? result.distance.toFixed(2) : 'N/A'}.`,
    codeHighlight: "return closest_pair",
    complexityInfo: "Overall time complexity: O(n log n)"
  });
  
  return steps;
};

// Component to visualize the 2D plane with points
const PointsVisualization = ({ data }) => {
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 300;
  const POINT_RADIUS = 6;
  
  // Extract data with safe defaults
  const {
    points = [],
    divideX = null,
    minDistance = Infinity,
    closestPair = null,
    stripPoints = [],
    leftPoints = [],
    rightPoints = [],
    consideredPairs = [],
    stage = 'initial'
  } = data || {};

  // Helper function to determine point color
  const getPointColor = (point) => {
    if (!point) return '#666';
    
    // Check if the point is in the closest pair - with safer null checks
    if (closestPair && Array.isArray(closestPair) && closestPair.length === 2 && 
        ((closestPair[0] && closestPair[0].x === point.x && closestPair[0].y === point.y) || 
         (closestPair[1] && closestPair[1].x === point.x && closestPair[1].y === point.y))) {
      return 'red';
    }
    
    // Check if point is in considered pairs
    if (consideredPairs && Array.isArray(consideredPairs) && consideredPairs.some(item => 
        item && item.pair && Array.isArray(item.pair) && item.pair.length === 2 && 
        ((item.pair[0] && item.pair[0].x === point.x && item.pair[0].y === point.y) || 
         (item.pair[1] && item.pair[1].x === point.x && item.pair[1].y === point.y))
      )) {
      return 'green';
    }
    
    // Check if point is in strip
    if (stripPoints && Array.isArray(stripPoints) && stripPoints.some(p => p && p.x === point.x && p.y === point.y)) {
      return 'orange';
    }
    
    // Check if point is in left half
    if (leftPoints && Array.isArray(leftPoints) && leftPoints.some(p => p && p.x === point.x && p.y === point.y)) {
      return 'blue';
    }
    
    // Check if point is in right half
    if (rightPoints && Array.isArray(rightPoints) && rightPoints.some(p => p && p.x === point.x && p.y === point.y)) {
      return 'purple';
    }
    
    // Default color
    return '#666';
  };

  // Render info section about current state
  const renderInfoSection = () => {
    const stageText = {
      'initial': 'Initial Points',
      'sorted': 'Sorted by X-coordinate',
      'divide': 'Dividing Points',
      'brute_force': 'Brute Force Comparison',
      'min_left_right': 'Minimum from Left/Right',
      'strip': 'Finding Strip Points',
      'strip_pairs': 'Checking Strip Pairs',
      'strip_min': 'New Minimum in Strip',
      'strip_no_min': 'No New Minimum in Strip',
      'final': 'Final Result'
    };
    
    // Safely format the minimum distance with null checks
    const formatDistance = (dist) => {
      if (dist === null || dist === undefined) return 'N/A';
      if (dist === Infinity) return '∞';
      return typeof dist === 'number' ? dist.toFixed(2) : 'Invalid';
    };
    
    return (
      <div className="bg-white shadow rounded-lg p-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Current Stage:</p>
            <p className="text-sm text-gray-600">{stageText[stage] || 'Unknown'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Current Min Distance:</p>
            <p className="text-sm text-gray-600">{formatDistance(minDistance)}</p>
          </div>
        </div>
        
        {closestPair && Array.isArray(closestPair) && closestPair.length === 2 && 
         closestPair[0] && closestPair[1] && 
         typeof closestPair[0].x === 'number' && typeof closestPair[0].y === 'number' &&
         typeof closestPair[1].x === 'number' && typeof closestPair[1].y === 'number' && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700">Closest Pair:</p>
            <p className="text-sm text-gray-600">
              ({closestPair[0].x}, {closestPair[0].y}) and ({closestPair[1].x}, {closestPair[1].y})
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div 
        className="relative bg-white border border-gray-300 rounded-lg overflow-hidden" 
        style={{ width: '100%', height: `${CANVAS_HEIGHT}px` }}
      >
        {/* Background grid for reference */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-10">
          {Array.from({ length: 12 * 6 }).map((_, i) => (
            <div key={`grid-${i}`} className="border border-gray-400"></div>
          ))}
        </div>
        
        {/* Dividing line */}
        {divideX !== null && (
          <div 
            className="absolute h-full border-l-2 border-dashed border-gray-500" 
            style={{ left: `${divideX}px` }}
          ></div>
        )}
        
        {/* Strip area */}
        {divideX !== null && minDistance !== Infinity && (
          <div 
            className="absolute h-full bg-yellow-100 opacity-30" 
            style={{ 
              left: `${divideX - minDistance}px`, 
              width: `${minDistance * 2}px` 
            }}
          ></div>
        )}
        
        {/* Considered pair lines */}
        {consideredPairs && consideredPairs.map((item, idx) => {
          if (!item || !item.pair || item.pair.length !== 2) return null;
          const [p1, p2] = item.pair;
          if (!p1 || !p2) return null;
          
          return (
            <svg 
              key={`considered-${idx}`}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <line 
                x1={p1.x} 
                y1={p1.y} 
                x2={p2.x} 
                y2={p2.y}
                stroke="#999"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            </svg>
          );
        })}
        
        {/* Closest pair line */}
        {closestPair && closestPair.length === 2 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={closestPair[0].x}
              y1={closestPair[0].y}
              x2={closestPair[1].x}
              y2={closestPair[1].y}
              stroke="red"
              strokeWidth="2"
            />
          </svg>
        )}
        
        {/* Points */}
        {points.map((point, idx) => (
          <div
            key={`point-${point.x}-${point.y}`}
            className="absolute rounded-full border border-gray-800"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              width: `${POINT_RADIUS * 2}px`,
              height: `${POINT_RADIUS * 2}px`,
              backgroundColor: getPointColor(point),
              transform: 'translate(-50%, -50%)',
              transition: 'background-color 0.3s, transform 0.3s',
              zIndex: 10
            }}
          />
        ))}
      </div>
      
      {renderInfoSection()}
      
      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg shadow">
        <p className="text-sm font-medium text-gray-700 mb-2">Legend:</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#666] mr-2"></div>
            <span className="text-xs text-gray-600">Regular Point</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-600">Considered Pair</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-gray-600">Closest Pair</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-xs text-gray-600">Left Half Point</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-xs text-gray-600">Right Half Point</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span className="text-xs text-gray-600">Strip Point</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main visualization component
const ClosestPairVisualizationComponent = ({ data, step, stepInfo }) => {
  return (
    <div className="w-full">
      <PointsVisualization data={data} />
    </div>
  );
};

// Container component with animation controls
const ClosestPairVisualization = () => {
  // Generate initial data
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Closest Pair of Points"
      initialData={initialData}
      generateSteps={generateClosestPairSteps}
      VisualizationComponent={ClosestPairVisualizationComponent}
      description="The Closest Pair of Points algorithm finds the pair of points with the smallest distance between them in a set of points in the plane. This divide-and-conquer approach has O(n log n) complexity, more efficient than the O(n²) brute force approach."
    />
  );
};

export default ClosestPairVisualization; 