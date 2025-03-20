import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FeedbackForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [hasProblem, setHasProblem] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a server
    console.log({
      hasProblem,
      feedback
    });
    setSubmitted(true);
    // Reset form after a delay
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setHasProblem(null);
      setFeedback('');
    }, 3000);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-md font-medium text-gray-700 mb-2">Visualization Feedback</h3>
      
      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-150"
        >
          Is there a problem with this visualization?
        </button>
      )}
      
      {showForm && !submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">Is there a problem with this visualization?</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasProblem"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={hasProblem === true}
                    onChange={() => setHasProblem(true)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasProblem"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={hasProblem === false}
                    onChange={() => setHasProblem(false)}
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            
            {hasProblem !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4"
              >
                <label className="block text-sm text-gray-700 mb-2">
                  {hasProblem
                    ? "Please describe the problem:"
                    : "Any suggestions for improvement?"}
                </label>
                <textarea
                  className="w-full px-3 py-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="3"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={
                    hasProblem
                      ? "Describe what's not working correctly..."
                      : "Share your ideas for making this better..."
                  }
                ></textarea>
              </motion.div>
            )}
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-150"
                disabled={hasProblem === null}
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 font-medium"
        >
          Thank you for your feedback!
        </motion.div>
      )}
    </div>
  );
};

export default FeedbackForm; 