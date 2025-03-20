import React, { useState, useEffect } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import { motion } from 'framer-motion';

// Visualization component that will be passed to VisualizationContainer
const NQueensVisualizationComponent = ({ data, step, stepInfo }) => {
  const { board, size, currentRow, threatenedSquares, placedQueens } = data;

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
              const isQueen = cell === 1;
              const isThreatened = threatenedSquares.some(([r, c]) => r === i && c === j);
              const isCurrentRow = i === currentRow;
              
              return (
                <div
                  key={`${i}-${j}`}
                  className={`
                    relative flex items-center justify-center
                    ${(i + j) % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300'}
                    ${isThreatened ? 'bg-red-100' : ''}
                    ${isCurrentRow ? 'ring-2 ring-blue-500' : ''}
                    transition-colors duration-200
                  `}
                >
                  {isQueen && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        <path d="M10 6a4 4 0 100 8 4 4 0 000-8zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
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
            Queens Placed: {placedQueens.length}
          </p>
          <p className="text-gray-700">
            Current Row: {currentRow + 1}
          </p>
          {threatenedSquares.length > 0 && (
            <p className="text-red-600">
              Threatened Squares: {threatenedSquares.length}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render the placed queens list
  const renderQueensList = () => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Placed Queens</h3>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Row</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Column</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {placedQueens.map(([row, col], index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">{row + 1}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{col + 1}</td>
                </tr>
              ))}
              {placedQueens.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 px-4 text-sm text-gray-500 text-center">
                    No queens placed yet
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
        {renderQueensList()}
      </div>
    </div>
  );
};

const NQueensVisualization = () => {
  const [size, setSize] = useState(8);
  const [board, setBoard] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [placedQueens, setPlacedQueens] = useState([]);
  const [threatenedSquares, setThreatenedSquares] = useState([]);
  const [steps, setSteps] = useState([]);

  // Initialize the board
  useEffect(() => {
    const newBoard = Array(size).fill().map(() => Array(size).fill(0));
    setBoard(newBoard);
    setCurrentRow(0);
    setPlacedQueens([]);
    setThreatenedSquares([]);
    generateSteps(newBoard);
  }, [size]);

  // Check if a position is safe for a queen
  const isSafe = (board, row, col) => {
    // Check row
    for (let j = 0; j < col; j++) {
      if (board[row][j] === 1) return false;
    }

    // Check upper diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }

    // Check lower diagonal
    for (let i = row, j = col; i < size && j >= 0; i++, j--) {
      if (board[i][j] === 1) return false;
    }

    return true;
  };

  // Get threatened squares for a given position
  const getThreatenedSquares = (board, row, col) => {
    const threatened = [];
    
    // Check row
    for (let j = 0; j < size; j++) {
      if (j !== col) threatened.push([row, j]);
    }

    // Check column
    for (let i = 0; i < size; i++) {
      if (i !== row) threatened.push([i, col]);
    }

    // Check diagonals
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i !== row && j !== col && 
            (Math.abs(i - row) === Math.abs(j - col))) {
          threatened.push([i, j]);
        }
      }
    }

    return threatened;
  };

  // Generate visualization steps
  const generateSteps = (initialBoard) => {
    const allSteps = [];
    let currentBoard = initialBoard.map(row => [...row]);
    let queens = [];
    let row = 0;
    let col = 0;

    const solveNQueens = (board, col) => {
      if (col >= size) {
        return true;
      }

      for (let i = 0; i < size; i++) {
        // Record attempt
        allSteps.push({
          board: board.map(row => [...row]),
          currentRow: i,
          placedQueens: [...queens],
          threatenedSquares: getThreatenedSquares(board, i, col),
          description: `Trying to place queen at row ${i + 1}, column ${col + 1}`
        });

        if (isSafe(board, i, col)) {
          board[i][col] = 1;
          queens.push([i, col]);

          // Record successful placement
          allSteps.push({
            board: board.map(row => [...row]),
            currentRow: i,
            placedQueens: [...queens],
            threatenedSquares: getThreatenedSquares(board, i, col),
            description: `Successfully placed queen at row ${i + 1}, column ${col + 1}`
          });

          if (solveNQueens(board, col + 1)) {
            return true;
          }

          // Backtrack
          board[i][col] = 0;
          queens.pop();

          // Record backtracking
          allSteps.push({
            board: board.map(row => [...row]),
            currentRow: i,
            placedQueens: [...queens],
            threatenedSquares: getThreatenedSquares(board, i, col),
            description: `Backtracking from row ${i + 1}, column ${col + 1}`
          });
        }
      }

      return false;
    };

    solveNQueens(currentBoard, 0);

    // Add final state
    allSteps.push({
      board: currentBoard.map(row => [...row]),
      currentRow: size - 1,
      placedQueens: [...queens],
      threatenedSquares: [],
      description: queens.length === size 
        ? 'Solution found! All queens are placed safely.'
        : 'No solution exists for this board size.'
    });

    setSteps(allSteps);
  };

  // Generate initial data set for the algorithm
  const generateInitialData = () => {
    return {
      board,
      size,
      currentRow,
      placedQueens,
      threatenedSquares,
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
        size,
        currentRow: step.currentRow,
        placedQueens: step.placedQueens,
        threatenedSquares: step.threatenedSquares
      }
    }));
  };

  return (
    <VisualizationContainer
      algorithmName="N-Queens Problem"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={NQueensVisualizationComponent}
      description="The N-Queens problem is a classic backtracking problem where we need to place N queens on an N×N chessboard so that no two queens threaten each other. Queens can attack horizontally, vertically, and diagonally."
    />
  );
};

export default NQueensVisualization; 