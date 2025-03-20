import React, { useState, useEffect } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import { motion } from 'framer-motion';

// Activity class for the visualization
class Activity {
  constructor(id, name, start, finish) {
    this.id = id;
    this.name = name;
    this.start = start;
    this.finish = finish;
    this.selected = false;
  }
}

// Visualization component that will be passed to VisualizationContainer
const ActivitySelectionVisualizationComponent = ({ data, step, stepInfo }) => {
  const currentStep = data.step;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-12">
        {renderStepExplanation(currentStep)}
      </div>
      <div className="lg:col-span-6">
        {renderActivityTable(currentStep.activities)}
      </div>
      <div className="lg:col-span-6">
        {renderSelectedActivities(currentStep.activities)}
        {renderTimeline(currentStep.activities, currentStep.timeRange)}
      </div>
    </div>
  );
};

// Render activity table
const renderActivityTable = (activitiesData) => {
  if (!activitiesData || activitiesData.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Activities</h3>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Activity</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Start Time</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Finish Time</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activitiesData.map((activity) => (
              <tr 
                key={activity.id}
                className={activity.highlighted ? 'bg-yellow-100' : 'hover:bg-gray-50'}
              >
                <td className="py-2 px-4 text-sm text-gray-700">{activity.name}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{activity.start}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{activity.finish}</td>
                <td className="py-2 px-4 text-sm">
                  {activity.selected ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                      Selected
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                      Not Selected
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Render selected activities
const renderSelectedActivities = (activitiesData) => {
  if (!activitiesData) return null;
  
  const selectedActivities = activitiesData.filter(activity => activity.selected);
  
  if (selectedActivities.length === 0) return null;
  
  return (
    <div className="mt-4 mb-4">
      <h3 className="text-lg font-medium mb-2">Selected Activities</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedActivities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="px-3 py-2 bg-green-50 rounded-lg border border-green-200 shadow-sm"
          >
            <div className="text-sm font-medium">{activity.name}</div>
            <div className="text-xs text-gray-500">
              {activity.start} - {activity.finish}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get timeline min/max scale
const getTimelineScale = (activities) => {
  if (!activities || activities.length === 0) return { min: 0, max: 10 };
  const min = Math.min(...activities.map(a => a.start));
  const max = Math.max(...activities.map(a => a.finish));
  return { min, max };
};

// Render timeline visualization
const renderTimeline = (activitiesData, timeRange) => {
  if (!activitiesData || activitiesData.length === 0) return null;
  
  const { min, max } = timeRange || getTimelineScale(activitiesData);
  const range = max - min;
  const timelineWidth = 100; // percentage
  
  return (
    <div className="mt-4 mb-4">
      <h3 className="text-lg font-medium mb-2">Timeline</h3>
      <div className="relative my-8 mx-4">
        {/* Timeline base */}
        <div className="absolute left-0 right-0 h-1 bg-gray-300 top-0"></div>
        
        {/* Time markers */}
        {Array.from({ length: range + 1 }, (_, i) => min + i).map(time => (
          <div 
            key={time} 
            className="absolute h-3 w-0.5 bg-gray-400 -top-1"
            style={{ left: `${((time - min) / range) * timelineWidth}%` }}
          >
            <div className="absolute -left-2 -bottom-6 text-xs text-gray-600">{time}</div>
          </div>
        ))}
        
        {/* Activity bars */}
        {activitiesData.map((activity, index) => (
          <div 
            key={activity.id}
            className={`absolute h-6 rounded-sm ${
              activity.selected 
                ? 'bg-green-500' 
                : activity.highlighted 
                  ? 'bg-yellow-500' 
                  : 'bg-blue-300'
            }`}
            style={{
              left: `${((activity.start - min) / range) * timelineWidth}%`,
              width: `${((activity.finish - activity.start) / range) * timelineWidth}%`,
              top: `${12 + index * 10}px`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
              {activity.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Render current step explanation
const renderStepExplanation = (step) => {
  if (!step) return null;
  
  return (
    <div className="mt-4 mb-4 p-4 bg-blue-50 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Current Step: {step.title}</h3>
      <p className="text-gray-700 mb-2">{step.description}</p>
      
      {step.currentActivity && (
        <div className="mt-2 mb-2">
          <p className="text-gray-700">
            Considering {step.currentActivity.name} (Start: {step.currentActivity.start}, Finish: {step.currentActivity.finish})
          </p>
          {step.isCompatible !== undefined && (
            <p className={step.isCompatible ? 'text-green-600' : 'text-red-600'}>
              {step.isCompatible 
                ? `Compatible with the last selected activity - adding to selection`
                : `Incompatible with the last selected activity - skipping`}
            </p>
          )}
        </div>
      )}
      
      {step.selectedActivities && step.selectedActivities.length > 0 && (
        <p className="mt-2 font-semibold text-gray-800">
          Current selection: {step.selectedActivities.map(a => a.name).join(', ')}
        </p>
      )}
    </div>
  );
};

const ActivitySelectionVisualization = () => {
  // Default activities data
  const defaultActivities = [
    new Activity(1, 'Activity 1', 1, 4),
    new Activity(2, 'Activity 2', 3, 5),
    new Activity(3, 'Activity 3', 0, 6),
    new Activity(4, 'Activity 4', 5, 7),
    new Activity(5, 'Activity 5', 3, 9),
    new Activity(6, 'Activity 6', 5, 9),
    new Activity(7, 'Activity 7', 6, 10),
    new Activity(8, 'Activity 8', 8, 11),
    new Activity(9, 'Activity 9', 8, 12),
    new Activity(10, 'Activity 10', 2, 14),
    new Activity(11, 'Activity 11', 12, 16)
  ];

  // Activity selection algorithm
  const activitySelection = (activitiesData) => {
    // First, sort activities by finish time
    const sortedActivities = [...activitiesData].sort((a, b) => a.finish - b.finish);
    
    // Array to hold selected activities
    const selectedActivities = [];
    
    // Initialize steps for visualization
    const visualizationSteps = [];
    const timeRange = getTimelineScale(activitiesData);
    
    // Add initial step
    visualizationSteps.push({
      title: 'Sort activities by finish time',
      description: 'Sort all activities in increasing order of finish time',
      activities: sortedActivities.map(activity => ({ ...activity })),
      selectedActivities: [],
      currentActivity: null,
      timeRange
    });
    
    // Select first activity (with earliest finish time)
    const firstActivity = sortedActivities[0];
    firstActivity.selected = true;
    selectedActivities.push(firstActivity);
    
    // Add step for selecting first activity
    visualizationSteps.push({
      title: 'Select first activity',
      description: `Select the activity with earliest finish time: ${firstActivity.name} (${firstActivity.start}-${firstActivity.finish})`,
      activities: sortedActivities.map(activity => ({
        ...activity,
        highlighted: activity.id === firstActivity.id
      })),
      selectedActivities: [...selectedActivities],
      currentActivity: { ...firstActivity },
      isCompatible: true,
      timeRange
    });
    
    // Initialize last selected activity
    let lastSelected = firstActivity;
    
    // Process remaining activities
    for (let i = 1; i < sortedActivities.length; i++) {
      const currentActivity = sortedActivities[i];
      
      // Check if current activity is compatible with last selected
      const isCompatible = currentActivity.start >= lastSelected.finish;
      
      // Create a copy of current activity for step
      const currentActivityCopy = { ...currentActivity };
      
      // If compatible, select this activity
      if (isCompatible) {
        currentActivity.selected = true;
        selectedActivities.push(currentActivity);
        lastSelected = currentActivity;
      }
      
      // Create a deep copy of current state for the step
      const activitiesStateCopy = sortedActivities.map(a => ({
        ...a,
        highlighted: a.id === currentActivity.id
      }));
      
      // Add step for this activity
      visualizationSteps.push({
        title: `Process ${currentActivity.name}`,
        description: isCompatible 
          ? `${currentActivity.name} starts at ${currentActivity.start} which is after or equal to the finish time of the last selected activity (${lastSelected.finish}), so it's selected`
          : `${currentActivity.name} starts at ${currentActivity.start} which is before the finish time of the last selected activity (${lastSelected.finish}), so it's skipped`,
        activities: activitiesStateCopy,
        selectedActivities: [...selectedActivities],
        currentActivity: currentActivityCopy,
        isCompatible,
        timeRange
      });
    }
    
    // Add final step
    visualizationSteps.push({
      title: 'Final Selection',
      description: `Completed activity selection with ${selectedActivities.length} activities selected`,
      activities: sortedActivities.map(activity => ({ ...activity })),
      selectedActivities: [...selectedActivities],
      currentActivity: null,
      timeRange
    });
    
    return {
      selected: selectedActivities,
      visualizationSteps
    };
  };

  // Generate initial data for the visualization
  const generateInitialData = () => {
    // Run the activity selection algorithm
    const { visualizationSteps } = activitySelection(defaultActivities);
    
    // Return initial step data
    return {
      step: visualizationSteps[0]
    };
  };
  
  // Generate visualization steps
  const generateVisualizationSteps = (initialData) => {
    // Run the activity selection algorithm
    const { visualizationSteps } = activitySelection(defaultActivities);
    
    // Format steps for the visualization container
    return visualizationSteps.map((step, index) => ({
      description: step.description,
      data: {
        step: step
      }
    }));
  };

  return (
    <VisualizationContainer
      algorithmName="Activity Selection"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={ActivitySelectionVisualizationComponent}
      description="The activity selection problem is a greedy algorithm that selects the maximum number of non-overlapping activities that can be performed by a single person."
    />
  );
};

export default ActivitySelectionVisualization; 