import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlaybackControls from './controls/PlaybackControls';
import StepInfo from './common/StepInfo';

const VisualizationContainer = ({ 
  algorithmName,
  initialData,
  generateSteps,
  VisualizationComponent,
  description
}) => {
  // Visualization state
  const [data, setData] = useState(initialData);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Timer ref for animation
  const timerRef = useRef(null);
  
  // Generate steps on initialization or when data changes
  useEffect(() => {
    const generatedSteps = generateSteps(initialData);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setData(initialData);
    setIsPlaying(false);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [initialData, generateSteps]);

  // Handle animation timing
  useEffect(() => {
    if (isPlaying) {
      if (currentStep < steps.length - 1) {
        // Calculate delay based on playback speed
        const delay = 1500 / playbackSpeed;
        
        timerRef.current = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setData(steps[currentStep + 1].data);
        }, delay);
      } else {
        // End of animation
        setIsPlaying(false);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, steps, playbackSpeed]);
  
  // Playback controls
  const handlePlay = () => {
    if (currentStep === steps.length - 1) {
      // If at the end, start from beginning
      setCurrentStep(0);
      setData(steps[0].data);
    }
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setIsPlaying(false);
      setCurrentStep(prev => prev + 1);
      setData(steps[currentStep + 1].data);
    }
  };
  
  const handleStepBackward = () => {
    if (currentStep > 0) {
      setIsPlaying(false);
      setCurrentStep(prev => prev - 1);
      setData(steps[currentStep - 1].data);
    }
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setData(steps[0].data);
  };
  
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };
  
  // Get current step information
  const currentStepInfo = steps[currentStep] || { description: "", codeHighlight: null };
  
  return (
    <div className="bg-slate-50 rounded-lg p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{algorithmName} Visualization</h2>
        <p className="text-gray-600">{description}</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Algorithm visualization */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 overflow-hidden">
          <div className="min-h-64 md:min-h-96 h-auto flex flex-col overflow-visible">
            <AnimatePresence mode="sync">
              <VisualizationComponent 
                data={data}
                step={currentStep}
                stepInfo={currentStepInfo}
              />
            </AnimatePresence>
          </div>
          
          <div className="mt-6">
            <PlaybackControls 
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              playbackSpeed={playbackSpeed}
              onSpeedChange={handleSpeedChange}
              currentStep={currentStep + 1}
              totalSteps={steps.length}
              disableBackward={currentStep === 0}
              disableForward={currentStep === steps.length - 1}
            />
          </div>
        </div>
        
        {/* Right side: Step information */}
        <div className="lg:col-span-1 relative">
          <AnimatePresence mode="wait">
            <StepInfo
              key={currentStep}
              stepDescription={currentStepInfo.description}
              codeHighlight={currentStepInfo.codeHighlight}
              complexityInfo={currentStepInfo.complexityInfo}
            />
          </AnimatePresence>
          
          <motion.div
            className="absolute bottom-0 m-auto w-full mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload for new example
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationContainer; 