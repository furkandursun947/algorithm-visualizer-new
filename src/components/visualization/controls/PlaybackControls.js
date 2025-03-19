import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';
import { BsSpeedometer } from 'react-icons/bs';

const PlaybackControls = ({ 
  isPlaying, 
  onPlay, 
  onPause, 
  onStepForward, 
  onStepBackward, 
  onReset,
  playbackSpeed,
  onSpeedChange,
  currentStep,
  totalSteps,
  disableBackward = false,
  disableForward = false
}) => {
  const speedOptions = [0.5, 1, 1.5, 2];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Step: {currentStep} / {totalSteps}
        </div>
        <div className="flex items-center space-x-2">
          <BsSpeedometer className="text-gray-600" />
          <select 
            value={playbackSpeed} 
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="bg-gray-100 rounded px-2 py-1 text-sm"
          >
            {speedOptions.map(speed => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full ${disableBackward ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          onClick={onStepBackward}
          disabled={disableBackward}
          aria-label="Step backward"
        >
          <FaStepBackward size={18} />
        </motion.button>
        
        {isPlaying ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            onClick={onPause}
            aria-label="Pause"
          >
            <FaPause size={18} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            onClick={onPlay}
            aria-label="Play"
          >
            <FaPlay size={18} />
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full ${disableForward ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          onClick={onStepForward}
          disabled={disableForward}
          aria-label="Step forward"
        >
          <FaStepForward size={18} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          onClick={onReset}
          aria-label="Reset"
        >
          <FaRedo size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default PlaybackControls; 