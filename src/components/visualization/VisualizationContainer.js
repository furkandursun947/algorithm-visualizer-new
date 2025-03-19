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
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="h-64 md:h-96 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <VisualizationComponent 
                key={currentStep}
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
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            <StepInfo
              key={currentStep}
              stepDescription={currentStepInfo.description}
              codeHighlight={currentStepInfo.codeHighlight}
              complexityInfo={currentStepInfo.complexityInfo}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VisualizationContainer; 