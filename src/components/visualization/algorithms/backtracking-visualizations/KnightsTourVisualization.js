import React, { useState, useEffect } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import { motion } from 'framer-motion';

// Visualization component that will be passed to VisualizationContainer
const KnightsTourVisualizationComponent = ({ data, step, stepInfo }) => {
  const { board, solution, size, currentPosition, moveHistory, isExploring, isBacktracking, moveNumber } = data;

  // Render the chessboard
  const renderChessboard = () => {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div 
          className="grid gap-0 bg-white rounded-lg shadow-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            aspectRatio: '1/1'
          }}
        >
          {board.map((row, i) =>
            row.map((cell, j) => {
              const isKnightPosition = i === currentPosition[0] && j === currentPosition[1];
              const moveValue = solution[i][j];
              const isVisited = moveValue !== -1;
              const isLastMove = moveValue === moveNumber;
              
              return (
                <div
                  key={`${i}-${j}`}
                  className={`
                    relative flex items-center justify-center
                    ${(i + j) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'}
                    ${isKnightPosition ? 'ring-2 ring-blue-500' : ''}
                    ${isExploring && isKnightPosition ? 'bg-yellow-300' : ''}
                    ${isBacktracking && isKnightPosition ? 'bg-red-300' : ''}
                    ${isLastMove && !isKnightPosition ? 'bg-green-200' : ''}
                    transition-colors duration-200
                    border border-gray-300
                    p-1
                  `}
                  style={{ aspectRatio: '1/1' }}
                >
                  {isVisited && (
                    <div className={`
                      w-full h-full rounded-full flex items-center justify-center
                      ${isKnightPosition ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}
                      ${isLastMove ? 'bg-green-500 text-white' : ''}
                      font-bold text-xs sm:text-sm
                    `}>
                      {moveValue}
                    </div>
                  )}
                  {isKnightPosition && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-xl sm:text-2xl">♞</span>
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
            Board Size: {size}×{size}
          </p>
          <p className="text-gray-700">
            Current Position: ({currentPosition[0] + 1}, {currentPosition[1] + 1})
          </p>
          <p className="text-gray-700">
            Move Number: {moveNumber} of {size * size - 1}
          </p>
          {isExploring && (
            <p className="text-yellow-600">
              Exploring possible moves from this position
            </p>
          )}
          {isBacktracking && (
            <p className="text-red-600">
              Backtracking from this position (no valid next move)
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render the move history
  const renderMoveHistory = () => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Move History</h3>
        <div className="overflow-y-auto max-h-96 rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Move</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Position</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {moveHistory.map((move, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">{move.moveNumber}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">({move.position[0] + 1}, {move.position[1] + 1})</td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        move.action === 'explore' ? 'bg-yellow-100 text-yellow-800' :
                        move.action === 'place' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {move.action === 'explore' ? 'Explore' : 
                       move.action === 'place' ? 'Place Knight' : 'Backtrack'}
                    </span>
                  </td>
                </tr>
              ))}
              {moveHistory.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-sm text-gray-500 text-center">
                    No moves taken yet
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
        {renderChessboard()}
        {renderStateInfo()}
      </div>
      <div className="lg:col-span-4">
        {renderMoveHistory()}
      </div>
    </div>
  );
};

const KnightsTourVisualization = () => {
  const [size, setSize] = useState(5);
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [currentPosition, setCurrentPosition] = useState([0, 0]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isExploring, setIsExploring] = useState(false);
  const [isBacktracking, setIsBacktracking] = useState(false);
  const [moveNumber, setMoveNumber] = useState(0);
  const [steps, setSteps] = useState([]);

  // Knight's possible moves
  const xMove = [2, 1, -1, -2, -2, -1, 1, 2];
  const yMove = [1, 2, 2, 1, -1, -2, -2, -1];

  // Initialize the board with default values
  useEffect(() => {
    // Create empty board
    const newBoard = Array(size).fill().map(() => Array(size).fill(0));
    // Initialize solution matrix with -1 (unvisited)
    const newSolution = Array(size).fill().map(() => Array(size).fill(-1));
    // Set starting position to 0
    newSolution[0][0] = 0;
    
    setBoard(newBoard);
    setSolution(newSolution);
    setCurrentPosition([0, 0]);
    setMoveHistory([]);
    setIsExploring(false);
    setIsBacktracking(false);
    setMoveNumber(0);
    
    generateSteps(newBoard, newSolution);
  }, [size]);

  // Check if a move is valid
  const isSafe = (x, y, sol) => {
    return (
      x >= 0 && x < size &&
      y >= 0 && y < size &&
      sol[x][y] === -1
    );
  };

  // Generate visualization steps
  const generateSteps = (initialBoard, initialSolution) => {
    const allSteps = [];
    let currentSolution = initialSolution.map(row => [...row]);
    let history = [];
    
    // Add initial step - starting position
    allSteps.push({
      board: initialBoard.map(row => [...row]),
      solution: currentSolution.map(row => [...row]),
      size,
      currentPosition: [0, 0],
      moveHistory: [],
      isExploring: false,
      isBacktracking: false,
      moveNumber: 0,
      description: 'Starting Knight\'s Tour at position (1, 1) with move number 0.'
    });
    
    history.push({ position: [0, 0], moveNumber: 0, action: 'place' });

    // Recursive function to solve the Knight's Tour
    const solveKnightsTour = (x, y, moveCount) => {
      // If all squares are visited, we found a solution
      if (moveCount === size * size - 1) {
        allSteps.push({
          board: initialBoard.map(row => [...row]),
          solution: currentSolution.map(row => [...row]),
          size,
          currentPosition: [x, y],
          moveHistory: [...history],
          isExploring: false,
          isBacktracking: false,
          moveNumber: moveCount,
          description: 'Tour completed! All squares have been visited exactly once.'
        });
        return true;
      }

      // Try all 8 possible moves
      for (let k = 0; k < 8; k++) {
        const nextX = x + xMove[k];
        const nextY = y + yMove[k];
        
        // Record exploring this potential move
        history.push({ position: [nextX, nextY], moveNumber: moveCount + 1, action: 'explore' });
        allSteps.push({
          board: initialBoard.map(row => [...row]),
          solution: currentSolution.map(row => [...row]),
          size,
          currentPosition: [x, y],
          moveHistory: [...history],
          isExploring: true,
          isBacktracking: false,
          moveNumber: moveCount,
          description: `Exploring potential move to (${nextX + 1}, ${nextY + 1}).`
        });
        
        // If the move is valid
        if (isSafe(nextX, nextY, currentSolution)) {
          // Place the knight at this position
          currentSolution[nextX][nextY] = moveCount + 1;
          
          // Record placing the knight
          history.push({ position: [nextX, nextY], moveNumber: moveCount + 1, action: 'place' });
          allSteps.push({
            board: initialBoard.map(row => [...row]),
            solution: currentSolution.map(row => [...row]),
            size,
            currentPosition: [nextX, nextY],
            moveHistory: [...history],
            isExploring: false,
            isBacktracking: false,
            moveNumber: moveCount + 1,
            description: `Placed knight at (${nextX + 1}, ${nextY + 1}) with move number ${moveCount + 1}.`
          });
          
          // Recursively solve for the rest of the tour
          if (solveKnightsTour(nextX, nextY, moveCount + 1)) {
            return true;
          }
          
          // Backtrack if no solution found
          currentSolution[nextX][nextY] = -1;
          
          // Record backtracking
          history.push({ position: [nextX, nextY], moveNumber: moveCount + 1, action: 'backtrack' });
          allSteps.push({
            board: initialBoard.map(row => [...row]),
            solution: currentSolution.map(row => [...row]),
            size,
            currentPosition: [x, y],
            moveHistory: [...history],
            isExploring: false,
            isBacktracking: true,
            moveNumber: moveCount,
            description: `Backtracking from (${nextX + 1}, ${nextY + 1}) - this path doesn't lead to a solution.`
          });
        }
      }

      return false;
    };

    // Start the tour from position (0,0)
    solveKnightsTour(0, 0, 0);

    // If no solution is found, add final step
    if (allSteps[allSteps.length - 1].moveNumber !== size * size - 1) {
      allSteps.push({
        board: initialBoard.map(row => [...row]),
        solution: currentSolution.map(row => [...row]),
        size,
        currentPosition: [0, 0],
        moveHistory: history,
        isExploring: false,
        isBacktracking: false,
        moveNumber: 0,
        description: 'No solution exists for this board configuration.'
      });
    }

    setSteps(allSteps.slice(0, 100)); // Limit steps for performance
  };

  // Generate initial data set for the algorithm
  const generateInitialData = () => {
    return {
      board,
      solution,
      size,
      currentPosition,
      moveHistory,
      isExploring,
      isBacktracking,
      moveNumber,
      steps
    };
  };

  // Generate steps for the visualization
  const generateVisualizationSteps = (initialData) => {
    return steps.map((step, index) => ({
      title: `Step ${index + 1}`,
      description: step.description,
      data: {
        board: step.board,
        solution: step.solution,
        size,
        currentPosition: step.currentPosition,
        moveHistory: step.moveHistory,
        isExploring: step.isExploring,
        isBacktracking: step.isBacktracking,
        moveNumber: step.moveNumber
      }
    }));
  };

  return (
    <VisualizationContainer
      algorithmName="Knight's Tour Problem"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={KnightsTourVisualizationComponent}
      description="The Knight's Tour Problem is a classic backtracking problem that aims to find a sequence of moves for a knight to visit every square on an n×n chessboard exactly once. The knight can only move according to chess rules - in an L-shape (2 squares in one direction and then 1 square perpendicular to that direction)."
    />
  );
};

export default KnightsTourVisualization; 