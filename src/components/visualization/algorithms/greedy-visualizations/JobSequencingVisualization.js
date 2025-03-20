import React, { useState, useEffect } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import { motion } from 'framer-motion';

// Job class for the visualization
class Job {
  constructor(id, name, deadline, profit) {
    this.id = id;
    this.name = name;
    this.deadline = deadline;
    this.profit = profit;
    this.isSelected = false;
    this.timeSlot = -1;
  }
}

// Visualization component that will be passed to VisualizationContainer
const JobSequencingVisualizationComponent = ({ data, step, stepInfo }) => {
  const currentStep = data.step;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-12">
        {renderStepExplanation(currentStep)}
      </div>
      <div className="lg:col-span-6">
        {renderJobTable(currentStep.jobsState)}
      </div>
      <div className="lg:col-span-6">
        {renderTimeSlots(currentStep.sequence, currentStep.slot)}
      </div>
    </div>
  );
};

// Render job table
const renderJobTable = (jobsData) => {
  if (!jobsData || jobsData.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Jobs</h3>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Job</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Deadline</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Profit</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobsData.map((job) => (
              <tr 
                key={job.id}
                className={job.highlighted ? 'bg-yellow-100' : 'hover:bg-gray-50'}
              >
                <td className="py-2 px-4 text-sm text-gray-700">{job.name}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{job.deadline}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{job.profit}</td>
                <td className="py-2 px-4 text-sm">
                  {job.isSelected ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                      Slot {job.timeSlot}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                      Not Scheduled
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

// Render time slots
const renderTimeSlots = (sequence, slots) => {
  if (!sequence || sequence.length === 0) return null;
  
  return (
    <div className="mt-4 mb-4">
      <h3 className="text-lg font-medium mb-2">Time Slots</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {sequence.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`w-20 h-20 flex flex-col justify-center items-center rounded-lg shadow ${
                job 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-xs text-gray-500">Slot {index + 1}</div>
              {job ? (
                <>
                  <div className="text-sm font-medium">{job.name}</div>
                  <div className="text-xs text-gray-500">Profit: {job.profit}</div>
                </>
              ) : (
                <div className="text-xs text-gray-400">Empty</div>
              )}
            </div>
          </motion.div>
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
      
      {step.currentJob && (
        <div className="mt-2 mb-2">
          <p className="text-gray-700">
            Considering {step.currentJob.name} (Profit: {step.currentJob.profit}, Deadline: {step.currentJob.deadline})
          </p>
          {step.allocated !== undefined && (
            <p className={step.allocated ? 'text-green-600' : 'text-red-600'}>
              {step.allocated 
                ? `Successfully scheduled in time slot ${step.currentJob.timeSlot}`
                : 'Could not be scheduled due to no available slots before deadline'}
            </p>
          )}
        </div>
      )}
      
      {step.currentProfit > 0 && (
        <p className="mt-2 font-semibold text-gray-800">
          Current Total Profit: {step.currentProfit}
        </p>
      )}
    </div>
  );
};

const JobSequencingVisualization = () => {
  // Default job data
  const defaultJobs = [
    new Job(1, 'Job 1', 4, 20),
    new Job(2, 'Job 2', 1, 10),
    new Job(3, 'Job 3', 1, 40),
    new Job(4, 'Job 4', 2, 30),
    new Job(5, 'Job 5', 3, 15),
    new Job(6, 'Job 6', 2, 25)
  ];

  // Job sequencing algorithm
  const jobSequencing = (jobData, maxDeadline) => {
    // Sort jobs by profit in decreasing order
    const sortedJobs = [...jobData].sort((a, b) => b.profit - a.profit);
    
    // Initialize result array and slot array
    const sequence = Array(maxDeadline).fill(null);
    const slot = Array(maxDeadline).fill(false);
    
    // Initialize steps for visualization
    const visualizationSteps = [];
    let currentProfit = 0;
    
    // Add initial step
    visualizationSteps.push({
      title: 'Sort jobs by profit',
      description: 'Sort all jobs in decreasing order of profit',
      jobsState: sortedJobs.map(job => ({ ...job })),
      sequence: [...sequence],
      slot: [...slot],
      currentJob: null,
      currentProfit: 0
    });
    
    // Process each job
    for (let i = 0; i < sortedJobs.length; i++) {
      const job = sortedJobs[i];
      
      // Find a free slot for this job
      let allocated = false;
      
      // Make a copy of current job for step
      const currentJob = { ...job };
      
      // Start with the latest possible slot before deadline
      for (let j = Math.min(maxDeadline, job.deadline) - 1; j >= 0; j--) {
        if (!slot[j]) {
          // Allocate this slot
          sequence[j] = job;
          slot[j] = true;
          currentProfit += job.profit;
          
          // Update job properties
          job.isSelected = true;
          job.timeSlot = j + 1;
          allocated = true;
          
          break;
        }
      }
      
      // Create a deep copy of current state for the step
      const jobsStateCopy = sortedJobs.map(j => ({ 
        ...j, 
        highlighted: j.id === job.id 
      }));
      
      // Add step for this job
      visualizationSteps.push({
        title: `Process ${job.name}`,
        description: allocated 
          ? `Scheduled ${job.name} with profit ${job.profit} in time slot ${job.timeSlot}`
          : `Could not schedule ${job.name} as no slots available before its deadline ${job.deadline}`,
        jobsState: jobsStateCopy,
        sequence: [...sequence],
        slot: [...slot],
        currentJob: currentJob,
        allocated: allocated,
        currentProfit: currentProfit
      });
    }
    
    // Add final step
    visualizationSteps.push({
      title: 'Final Schedule',
      description: `Completed job sequencing with total profit: ${currentProfit}`,
      jobsState: sortedJobs.map(job => ({ ...job })),
      sequence: [...sequence],
      slot: [...slot],
      currentJob: null,
      currentProfit: currentProfit
    });
    
    return {
      sequence: sequence,
      profit: currentProfit,
      visualizationSteps: visualizationSteps
    };
  };

  // Generate initial data for the visualization
  const generateInitialData = () => {
    // Find maximum deadline
    const maxDeadline = Math.max(...defaultJobs.map(job => job.deadline));
    
    // Run the job sequencing algorithm
    const { visualizationSteps } = jobSequencing(defaultJobs, maxDeadline);
    
    // Return initial step data
    return {
      step: visualizationSteps[0]
    };
  };
  
  // Generate visualization steps
  const generateVisualizationSteps = (initialData) => {
    // Find maximum deadline
    const maxDeadline = Math.max(...defaultJobs.map(job => job.deadline));
    
    // Run the job sequencing algorithm
    const { visualizationSteps } = jobSequencing(defaultJobs, maxDeadline);
    
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
      algorithmName="Job Sequencing"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={JobSequencingVisualizationComponent}
      description="Job sequencing with deadlines is a greedy algorithm that maximizes profit by scheduling jobs within their deadlines."
    />
  );
};

export default JobSequencingVisualization; 