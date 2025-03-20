import React, { useState, useEffect, useRef } from 'react';
import VisualizationContainer from '../../VisualizationContainer';

// Generate initial data for the visualization
const generateInitialData = () => {
  // Example Sudoku puzzle (0 represents empty cells)
  const board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];
  
  return {
    board,
    currentRow: null,
    currentCol: null,
    currentValue: null,
    isValid: null,
    isBacktracking: false,
    cellHighlights: Array(9).fill().map(() => Array(9).fill(null)),
    steps: []
  };
};

// Generate steps for the Sudoku Solver visualization
const generateVisualizationSteps = (initialData) => {
  const { board } = initialData;
  const steps = [];
  const stepHistory = [];
  
  // Create a deep copy of the board to work with
  const workingBoard = board.map(row => [...row]);
  const cellHighlights = Array(9).fill().map(() => Array(9).fill(null));
  
  // Step 1: Initial state
  steps.push({
    title: "Step 1: Initial Board",
    description: "Starting with the initial Sudoku puzzle. Empty cells are represented by 0.",
    data: {
      board: workingBoard.map(row => [...row]),
      currentRow: null,
      currentCol: null,
      currentValue: null,
      isValid: null,
      isBacktracking: false,
      cellHighlights: cellHighlights.map(row => [...row]),
      steps: [...stepHistory]
    }
  });
  
  // Find an empty cell and try to solve the puzzle
  const emptyCell = findEmptyCell(workingBoard);
  
  // If there's an empty cell, start solving
  if (emptyCell) {
    const [startRow, startCol] = emptyCell;
    solveSudoku(workingBoard, 0, 0, steps, stepHistory, cellHighlights);
  } else {
    // No empty cells, puzzle is already solved
    steps.push({
      title: "Puzzle Already Solved",
      description: "The initial Sudoku puzzle is already complete!",
      data: {
        board: workingBoard.map(row => [...row]),
        currentRow: null,
        currentCol: null,
        currentValue: null,
        isValid: true,
        isBacktracking: false,
        cellHighlights: cellHighlights.map(row => [...row]),
        steps: [...stepHistory]
      }
    });
  }
  
  // Add final step if not already added
  if (steps.length > 0 && steps[steps.length - 1].title !== "Puzzle Solved!") {
    const isSolved = !findEmptyCell(workingBoard);
    
    steps.push({
      title: isSolved ? "Puzzle Solved!" : "No Solution Found",
      description: isSolved ? 
        "The Sudoku puzzle has been completely solved!" : 
        "No solution exists for this Sudoku puzzle.",
      data: {
        board: workingBoard.map(row => [...row]),
        currentRow: null,
        currentCol: null,
        currentValue: null,
        isValid: isSolved,
        isBacktracking: false,
        cellHighlights: cellHighlights.map(row => [...row]),
        steps: [...stepHistory]
      }
    });
  }
  
  return steps;
};

// Find an empty cell in the Sudoku board
const findEmptyCell = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null; // No empty cell found - board is full
};

// Check if a digit is valid in the specified position
const isValid = (board, row, col, digit) => {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === digit) {
      return false;
    }
  }
  
  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === digit) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === digit) {
        return false;
      }
    }
  }
  
  return true;
};

// Recursive solve function that also generates visualization steps
const solveSudoku = (board, startRow, startCol, steps, stepHistory, cellHighlights) => {
  // Find an empty cell
  const emptyCell = findEmptyCell(board);
  
  // Base case: if no empty cells, the puzzle is solved
  if (!emptyCell) {
    stepHistory.push("No more empty cells - Sudoku solved!");
    
    steps.push({
      title: "Puzzle Solved!",
      description: "The Sudoku puzzle has been completely solved!",
      data: {
        board: board.map(row => [...row]),
        currentRow: null,
        currentCol: null,
        currentValue: null,
        isValid: true,
        isBacktracking: false,
        cellHighlights: cellHighlights.map(row => [...row]),
        steps: [...stepHistory]
      }
    });
    
    return true;
  }
  
  const [row, col] = emptyCell;
  cellHighlights[row][col] = "current";
  
  // Try digits 1-9 for this empty cell
  for (let digit = 1; digit <= 9; digit++) {
    // Check if this digit is valid here
    const valid = isValid(board, row, col, digit);
    
    stepHistory.push(`Trying ${digit} at position (${row+1},${col+1}) - ${valid ? "Valid" : "Invalid"}`);
    
    // Record the attempt
    steps.push({
      title: `Trying Digit ${digit}`,
      description: `Checking if ${digit} is valid at position (${row+1},${col+1})`,
      data: {
        board: board.map(row => [...row]),
        currentRow: row,
        currentCol: col,
        currentValue: digit,
        isValid: valid,
        isBacktracking: false,
        cellHighlights: cellHighlights.map(row => [...row]),
        steps: [...stepHistory]
      }
    });
    
    if (valid) {
      // Place the digit
      board[row][col] = digit;
      cellHighlights[row][col] = "placed";
      
      stepHistory.push(`Placed ${digit} at position (${row+1},${col+1})`);
      
      steps.push({
        title: `Placed Digit ${digit}`,
        description: `${digit} is valid at (${row+1},${col+1}). Moving to next empty cell.`,
        data: {
          board: board.map(row => [...row]),
          currentRow: row,
          currentCol: col,
          currentValue: digit,
          isValid: true,
          isBacktracking: false,
          cellHighlights: cellHighlights.map(row => [...row]),
          steps: [...stepHistory]
        }
      });
      
      // Recursively try to fill the rest of the board
      if (solveSudoku(board, row, col, steps, stepHistory, cellHighlights)) {
        return true;
      }
      
      // If we get here, this digit didn't work - backtrack
      board[row][col] = 0;
      cellHighlights[row][col] = "backtrack";
      
      stepHistory.push(`Backtracking from ${digit} at position (${row+1},${col+1})`);
      
      steps.push({
        title: "Backtracking",
        description: `Placing ${digit} at (${row+1},${col+1}) didn't lead to a solution. Removing it and trying another digit.`,
        data: {
          board: board.map(row => [...row]),
          currentRow: row,
          currentCol: col,
          currentValue: null,
          isValid: false,
          isBacktracking: true,
          cellHighlights: cellHighlights.map(row => [...row]),
          steps: [...stepHistory]
        }
      });
    }
  }
  
  // If we get here, no digit worked in this cell
  cellHighlights[row][col] = null;
  return false;
};

// The main visualization component
const SudokuSolverVisualizationComponent = ({ data, step, stepInfo }) => {
  const { 
    board, 
    currentRow, 
    currentCol, 
    isValid, 
    cellHighlights,
  } = data || {
    board: Array(9).fill().map(() => Array(9).fill(0)),
    cellHighlights: Array(9).fill().map(() => Array(9).fill(null))
  };
  
  // Helper function to get cell background color
  const getCellBackground = (row, col) => {
    if (currentRow === row && currentCol === col) {
      return isValid ? "#e6ffed" : "#ffebe6";
    }
    
    if (cellHighlights[row][col] === "current") return "#fffde7";
    if (cellHighlights[row][col] === "placed") return "#e6ffed";
    if (cellHighlights[row][col] === "backtrack") return "#ffebe6";
    
    // Highlight the 3x3 box with a light background
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    
    return (boxRow + boxCol) % 2 === 0 ? "#f5f5f5" : "#ffffff";
  };
  
  // Render the Sudoku board
  const renderBoard = () => {
    return (
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-700">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={`
                flex items-center justify-center
                w-10 h-10 text-lg font-medium
                ${(colIndex + 1) % 3 === 0 && colIndex < 8 ? 'border-r-2 border-gray-700' : 'border-r border-gray-300'}
                ${(rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-2 border-gray-700' : 'border-b border-gray-300'}
                transition-colors duration-300
              `}
              style={{ backgroundColor: getCellBackground(rowIndex, colIndex) }}
            >
              {cell !== 0 ? cell : ""}
            </div>
          ))
        ))}
      </div>
    );
  };
  
  // Render step information
  const renderStepInfo = () => {
    return (
      <div>
        <h4 className="font-medium mb-1">{step !== undefined ? `Step ${step + 1}` : 'Step 1'}</h4>
        <p>{stepInfo?.description || "No description available"}</p>
      </div>
    );
  };
  
  // Render step history
  const renderStepHistory = () => {
    const steps = data?.steps || [];
    
    if (steps.length === 0) {
      return (
        <div className="p-4 text-gray-500 italic">
          No steps have been performed yet.
        </div>
      );
    }
    
    return (
      <div className="p-2">
        <div className="overflow-y-auto max-h-60">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {steps.map((action, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {typeof action === 'string' ? action : (action?.title || 'Unknown step')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Sudoku Board</h3>
            <p className="text-sm text-gray-500">
              The Sudoku board is a 9×9 grid with some pre-filled digits. The goal is to fill the empty cells with digits 1-9 so that
              each row, column, and 3×3 box contains all digits from 1 to 9 without repetition.
            </p>
          </div>
          <div className="p-6 flex justify-center">
            {renderBoard()}
          </div>
          <div className="p-4 border-t border-gray-200">
            {renderStepInfo()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Sudoku Rules</h3>
          </div>
          <div className="p-4">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Each row must contain the digits 1-9 without repetition.</li>
              <li>Each column must contain the digits 1-9 without repetition.</li>
              <li>Each of the nine 3×3 boxes must contain the digits 1-9 without repetition.</li>
              <li>The Sudoku board is initially partially filled.</li>
              <li>The solver finds a valid digit for each empty cell using backtracking.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Solution Steps</h3>
            <p className="text-sm text-gray-500">
              History of steps taken to solve the Sudoku puzzle.
            </p>
          </div>
          {renderStepHistory()}
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Algorithm Information</h3>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-1">Current Step:</h4>
              <div className="p-2 bg-blue-50 rounded">
                <p className="text-sm">
                  {step !== undefined && stepInfo && stepInfo.totalSteps
                    ? `Step ${step + 1} of ${stepInfo.totalSteps}`
                    : `Step ${step !== undefined ? step + 1 : '?'}`}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Progress:</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ 
                    width: (step !== undefined && stepInfo && stepInfo.totalSteps) 
                      ? `${((step + 1) / stepInfo.totalSteps) * 100}%` 
                      : `${step !== undefined ? (step + 1) * 10 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-sm text-gray-700 mb-1">Cell Colors:</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white border border-gray-300"></div>
                  <span className="ml-2 text-sm text-gray-600">Empty cell</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#fffde7] border border-gray-300"></div>
                  <span className="ml-2 text-sm text-gray-600">Current cell being evaluated</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#e6ffed] border border-gray-300"></div>
                  <span className="ml-2 text-sm text-gray-600">Valid placement</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#ffebe6] border border-gray-300"></div>
                  <span className="ml-2 text-sm text-gray-600">Invalid/Backtracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component that wraps everything
const SudokuSolverVisualization = () => {
  // Debug the structure of our visualization container
  useEffect(() => {
    console.log("SudokuSolverVisualization: Initializing component");
    console.log("Initial data:", generateInitialData());
    console.log("Generated steps:", generateVisualizationSteps(generateInitialData()));
  }, []);

  return (
    <VisualizationContainer
      algorithmName="Sudoku Solver"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={SudokuSolverVisualizationComponent}
      description="The Sudoku Solver uses backtracking to fill a 9×9 grid with digits so that each row, column, and 3×3 box contains all digits from 1 to 9 without repetition."
    />
  );
};

export default SudokuSolverVisualization; 