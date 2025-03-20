import React, { useState, useEffect } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import { motion } from 'framer-motion';

// Visualization component that will be passed to VisualizationContainer
const RatInMazeVisualizationComponent = ({ data, step, stepInfo }) => {
  const { maze, solution, size, currentPosition, pathHistory, isExploring, isBacktracking } = data;

  // Render the maze
  const renderMaze = () => {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div 
          className="grid gap-0 bg-white rounded-lg shadow-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            aspectRatio: '1/1'
          }}
        >
          {maze.map((row, i) =>
            row.map((cell, j) => {
              const isWall = cell === 0;
              const isPath = solution[i][j] === 1;
              const isCurrentPosition = i === currentPosition[0] && j === currentPosition[1];
              const isSource = i === 0 && j === 0;
              const isDestination = i === size - 1 && j === size - 1;
              
              return (
                <div
                  key={`${i}-${j}`}
                  className={`
                    relative flex items-center justify-center
                    ${isWall ? 'bg-gray-800' : 'bg-white'}
                    ${isPath && !isWall ? 'bg-green-200' : ''}
                    ${isCurrentPosition ? 'ring-2 ring-blue-500' : ''}
                    ${isExploring && isCurrentPosition ? 'bg-yellow-300' : ''}
                    ${isBacktracking && isCurrentPosition ? 'bg-red-300' : ''}
                    ${isSource ? 'bg-blue-400' : ''}
                    ${isDestination ? 'bg-purple-400' : ''}
                    transition-colors duration-200
                    border border-gray-300
                  `}
                  style={{ aspectRatio: '1/1' }}
                >
                  {isSource && (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs font-bold">START</span>
                    </div>
                  )}
                  {isDestination && (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs font-bold">END</span>
                    </div>
                  )}
                  {isPath && !isSource && !isDestination && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Render the current state information
  const renderStateInfo = () => {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Current State</h3>
        <div className="space-y-2">
          <p className="text-gray-700">
            Maze Size: {size}×{size}
          </p>
          <p className="text-gray-700">
            Current Position: ({currentPosition[0] + 1}, {currentPosition[1] + 1})
          </p>
          {isExploring && (
            <p className="text-yellow-600">
              Currently exploring this position
            </p>
          )}
          {isBacktracking && (
            <p className="text-red-600">
              Backtracking from this position (dead end)
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render the path history
  const renderPathHistory = () => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Path History</h3>
        <div className="overflow-y-auto max-h-96 rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Step</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Position</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pathHistory.map((step, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">({step.position[0] + 1}, {step.position[1] + 1})</td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        step.action === 'explore' ? 'bg-yellow-100 text-yellow-800' :
                        step.action === 'path' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {step.action === 'explore' ? 'Explore' : 
                       step.action === 'path' ? 'Add to Path' : 'Backtrack'}
                    </span>
                  </td>
                </tr>
              ))}
              {pathHistory.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-sm text-gray-500 text-center">
                    No steps taken yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8">
        {renderMaze()}
        {renderStateInfo()}
      </div>
      <div className="lg:col-span-4">
        {renderPathHistory()}
      </div>
    </div>
  );
};

const RatInMazeVisualization = () => {
  const [size, setSize] = useState(5);
  const [maze, setMaze] = useState([]);
  const [solution, setSolution] = useState([]);
  const [currentPosition, setCurrentPosition] = useState([0, 0]);
  const [pathHistory, setPathHistory] = useState([]);
  const [isExploring, setIsExploring] = useState(false);
  const [isBacktracking, setIsBacktracking] = useState(false);
  const [steps, setSteps] = useState([]);

  // Initialize the maze with default values
  useEffect(() => {
    // Generate a random maze with a guaranteed solution
    const newMaze = generateRandomMaze(size);
    const newSolution = Array(size).fill().map(() => Array(size).fill(0));
    
    setMaze(newMaze);
    setSolution(newSolution);
    setCurrentPosition([0, 0]);
    setPathHistory([]);
    setIsExploring(false);
    setIsBacktracking(false);
    
    generateSteps(newMaze, newSolution);
  }, [size]);

  // Generate a solvable random maze
  const generateRandomMaze = (n) => {
    // Start with all cells open
    const maze = Array(n).fill().map(() => Array(n).fill(1));
    
    // Randomly block some cells (but ensure a path exists)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // Don't block the start and end positions
        if ((i === 0 && j === 0) || (i === n - 1 && j === n - 1)) {
          continue;
        }
        
        // Randomly block with 30% probability
        // But ensure at least one of right or bottom neighbor is open
        // to guarantee a path exists
        if (Math.random() < 0.3) {
          maze[i][j] = 0;
        }
      }
    }
    
    // Ensure there's at least one path by opening critical cells
    ensurePath(maze, n);
    
    return maze;
  };

  // Ensure there's at least one path from start to end
  const ensurePath = (maze, n) => {
    // Simple implementation: clear a direct path
    // In a real algorithm, you might want a more sophisticated approach
    for (let i = 0; i < n; i++) {
      // Clear a path either along the first row or last column
      if (i < n - 1) {
        maze[0][i] = 1; // First row
      }
      maze[i][n - 1] = 1; // Last column
    }
  };

  // Check if a move is valid
  const isSafe = (maze, x, y) => {
    return (
      x >= 0 && x < size &&
      y >= 0 && y < size &&
      maze[x][y] === 1
    );
  };

  // Generate visualization steps
  const generateSteps = (initialMaze, initialSolution) => {
    const allSteps = [];
    let currentSolution = initialSolution.map(row => [...row]);
    let path = [];

    // Helper function to solve the maze
    const solveMazeUtil = (x, y) => {
      // Base case: if destination is reached
      if (x === size - 1 && y === size - 1) {
        currentSolution[x][y] = 1;
        
        // Record reaching the destination
        allSteps.push({
          maze: initialMaze.map(row => [...row]),
          solution: currentSolution.map(row => [...row]),
          size,
          currentPosition: [x, y],
          pathHistory: [...path, { position: [x, y], action: 'path' }],
          isExploring: false,
          isBacktracking: false,
          description: 'Destination reached! Path found.'
        });
        
        return true;
      }

      // Record exploring this position
      path.push({ position: [x, y], action: 'explore' });
      allSteps.push({
        maze: initialMaze.map(row => [...row]),
        solution: currentSolution.map(row => [...row]),
        size,
        currentPosition: [x, y],
        pathHistory: [...path],
        isExploring: true,
        isBacktracking: false,
        description: `Exploring position (${x + 1}, ${y + 1})`
      });

      // Check if current cell is valid
      if (isSafe(initialMaze, x, y)) {
        // Mark current cell as part of the solution
        currentSolution[x][y] = 1;
        
        // Record adding to path
        path.push({ position: [x, y], action: 'path' });
        allSteps.push({
          maze: initialMaze.map(row => [...row]),
          solution: currentSolution.map(row => [...row]),
          size,
          currentPosition: [x, y],
          pathHistory: [...path],
          isExploring: false,
          isBacktracking: false,
          description: `Added position (${x + 1}, ${y + 1}) to path`
        });

        // Move forward in x direction
        if (solveMazeUtil(x + 1, y)) {
          return true;
        }

        // Move down in y direction
        if (solveMazeUtil(x, y + 1)) {
          return true;
        }

        // If no forward/down works, backtrack
        currentSolution[x][y] = 0;
        
        // Record backtracking
        path.push({ position: [x, y], action: 'backtrack' });
        allSteps.push({
          maze: initialMaze.map(row => [...row]),
          solution: currentSolution.map(row => [...row]),
          size,
          currentPosition: [x, y],
          pathHistory: [...path],
          isExploring: false,
          isBacktracking: true,
          description: `Backtracking from position (${x + 1}, ${y + 1}) - no valid path found`
        });
        
        return false;
      }
      
      // If not safe, record and return
      allSteps.push({
        maze: initialMaze.map(row => [...row]),
        solution: currentSolution.map(row => [...row]),
        size,
        currentPosition: [x, y],
        pathHistory: [...path, { position: [x, y], action: 'backtrack' }],
        isExploring: false,
        isBacktracking: true,
        description: `Position (${x + 1}, ${y + 1}) is blocked or out of bounds`
      });
      
      return false;
    };

    // Start solving from the source
    solveMazeUtil(0, 0);

    // Add final state if not already reached
    if (allSteps[allSteps.length - 1].currentPosition[0] !== size - 1 || 
        allSteps[allSteps.length - 1].currentPosition[1] !== size - 1) {
      allSteps.push({
        maze: initialMaze.map(row => [...row]),
        solution: currentSolution.map(row => [...row]),
        size,
        currentPosition: [0, 0],
        pathHistory: [...path],
        isExploring: false,
        isBacktracking: false,
        description: 'No solution exists for this maze configuration.'
      });
    }

    setSteps(allSteps);
  };

  // Generate initial data set for the algorithm
  const generateInitialData = () => {
    return {
      maze,
      solution,
      size,
      currentPosition,
      pathHistory,
      isExploring,
      isBacktracking,
      steps
    };
  };

  // Generate steps for the visualization
  const generateVisualizationSteps = (initialData) => {
    return steps.map((step, index) => ({
      title: `Step ${index + 1}`,
      description: step.description,
      data: {
        maze: step.maze,
        solution: step.solution,
        size,
        currentPosition: step.currentPosition,
        pathHistory: step.pathHistory,
        isExploring: step.isExploring,
        isBacktracking: step.isBacktracking
      }
    }));
  };

  return (
    <VisualizationContainer
      algorithmName="Rat in a Maze"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={RatInMazeVisualizationComponent}
      description="The Rat in a Maze problem is a classic backtracking problem. A maze is given in the form of a binary matrix, where 1 represents an open cell and 0 represents a blocked cell. A rat starts from the source (0,0) and has to reach the destination (n-1, n-1). The rat can move only in two directions: forward and down."
    />
  );
};

export default RatInMazeVisualization; 