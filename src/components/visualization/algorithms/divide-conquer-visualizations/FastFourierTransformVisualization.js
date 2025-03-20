import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Helper functions for complex number operations
const Complex = {
  add: (a, b) => ({ real: a.real + b.real, imag: a.imag + b.imag }),
  subtract: (a, b) => ({ real: a.real - b.real, imag: a.imag - b.imag }),
  multiply: (a, b) => ({
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real
  }),
  magnitude: (a) => Math.sqrt(a.real * a.real + a.imag * a.imag),
  phase: (a) => Math.atan2(a.imag, a.real),
  toString: (a) => {
    if (Math.abs(a.imag) < 0.001) return a.real.toFixed(2);
    return `${a.real.toFixed(2)}${a.imag >= 0 ? '+' : ''}${a.imag.toFixed(2)}i`;
  }
};

// Helper function to generate a sample signal
const generateSampleSignal = () => {
  // Create a sample signal with a few frequency components
  // For visualization purposes, we'll use a simple signal
  const signalLength = 8; // Must be a power of 2 for FFT
  
  // Create a simple signal with a main frequency component
  const signal = [];
  for (let i = 0; i < signalLength; i++) {
    // Combination of a constant, a cosine wave, and a sine wave
    const value = 2 + 3 * Math.cos(2 * Math.PI * i / signalLength) 
               + 1.5 * Math.sin(4 * Math.PI * i / signalLength);
    signal.push({ real: value, imag: 0 });
  }
  
  return signal;
};

// Function to generate initial data for FFT visualization
const generateInitialData = () => {
  const signal = generateSampleSignal();
  
  return {
    signal,
    result: null,
    stages: [],
    currentStage: 0,
    depth: 0,
    step: 'initial'
  };
};

// Calculate binary logarithm (log base 2)
const log2 = (n) => Math.log(n) / Math.log(2);

// Bit reversal for FFT
const bitReverse = (n, bits) => {
  let reversed = 0;
  for (let i = 0; i < bits; i++) {
    reversed = (reversed << 1) | (n & 1);
    n >>= 1;
  }
  return reversed;
};

// Reorder array using bit reversal
const reorderArray = (array) => {
  const n = array.length;
  const bits = log2(n);
  const reordered = new Array(n);
  
  for (let i = 0; i < n; i++) {
    reordered[bitReverse(i, bits)] = array[i];
  }
  
  return reordered;
};

// Generate steps for FFT
const generateFFTSteps = (initialData) => {
  const steps = [];
  const { signal } = initialData;
  const n = signal.length;
  
  // Add initial step
  steps.push({
    data: {
      ...initialData,
      step: 'initial'
    },
    description: "Fast Fourier Transform (FFT) converts a signal from time domain to frequency domain.",
    codeHighlight: "// Start FFT algorithm with input signal",
    complexityInfo: "Regular DFT: O(n²), FFT: O(n log n)"
  });
  
  // Add step to explain bit reversal permutation
  steps.push({
    data: {
      ...initialData,
      step: 'bit-reversal',
      reordered: reorderArray(signal)
    },
    description: "Perform bit reversal permutation to prepare for in-place FFT calculation.",
    codeHighlight: "// Reorder array elements using bit reversal\nfor (i = 0; i < n; i++) {\n  j = bitReverse(i, log2(n));\n  if (i < j) swap(x[i], x[j]);\n}",
    complexityInfo: "Time complexity for reordering: O(n)"
  });
  
  // Iterative FFT using Cooley-Tukey algorithm
  let workingArray = [...signal];
  
  // Bit reversal ordering
  workingArray = reorderArray(workingArray);
  
  // Store all intermediate stages for visualization
  const stages = [workingArray.map(x => ({ ...x }))];
  
  // Main FFT loops
  for (let s = 1; s <= log2(n); s++) {
    const m = 1 << s; // 2^s
    const halfM = m / 2;
    
    // Calculate twiddle factor
    const omega = { real: Math.cos(2 * Math.PI / m), imag: -Math.sin(2 * Math.PI / m) };
    
    // Store the current state of butterfly operations for this stage
    const stageData = {
      stage: s,
      butterflyGroups: [],
      workingArray: [...workingArray.map(x => ({ ...x }))]
    };
    
    // Apply butterfly operations for this stage
    for (let k = 0; k < n; k += m) {
      let omegaPow = { real: 1, imag: 0 }; // ω^0 = 1
      
      const butterflies = [];
      
      for (let j = 0; j < halfM; j++) {
        const t = Complex.multiply(omegaPow, workingArray[k + j + halfM]);
        const u = workingArray[k + j];
        
        butterflies.push({
          index1: k + j,
          index2: k + j + halfM,
          before: {
            value1: { ...workingArray[k + j] },
            value2: { ...workingArray[k + j + halfM] }
          }
        });
        
        // Butterfly operation
        workingArray[k + j] = Complex.add(u, t);
        workingArray[k + j + halfM] = Complex.subtract(u, t);
        
        // Update butterfly data with after values
        butterflies[butterflies.length - 1].after = {
          value1: { ...workingArray[k + j] },
          value2: { ...workingArray[k + j + halfM] }
        };
        
        // Update omega power for next iteration
        omegaPow = Complex.multiply(omegaPow, omega);
      }
      
      stageData.butterflyGroups.push({ butterflies });
    }
    
    // Add this stage to our collection
    stages.push(workingArray.map(x => ({ ...x })));
    
    // Add step for this FFT stage
    steps.push({
      data: {
        ...initialData,
        signal: initialData.signal,
        result: workingArray,
        stageData: stageData,
        stages: stages,
        currentStage: s,
        step: 'butterfly-stage'
      },
      description: `Stage ${s}: Apply butterfly operations with distance ${halfM}.`,
      codeHighlight: `// Stage ${s}: Process butterflies of size ${m}\nfor (k = 0; k < n; k += ${m}) {\n  omega_m = e^(-2πi/${m});\n  for (j = 0; j < ${halfM}; j++) {\n    t = ω^j * x[k+j+${halfM}];\n    u = x[k+j];\n    x[k+j] = u + t;\n    x[k+j+${halfM}] = u - t;\n  }\n}`,
      complexityInfo: `Processing ${n/m} groups with ${halfM} butterfly operations each`
    });
  }
  
  // Add final result step
  steps.push({
    data: {
      ...initialData,
      signal: initialData.signal,
      result: workingArray,
      stages: stages,
      step: 'final'
    },
    description: "FFT computation complete. The result shows the frequency components of the input signal.",
    codeHighlight: "// Return the computed DFT\nreturn x;",
    complexityInfo: `Total operations: O(n log n) = O(${n} * ${log2(n)}) = O(${n * log2(n)})`
  });
  
  return steps;
};

// Component to display signal in time domain
const TimeDomainVisualization = ({ signal, width = 400, height = 150 }) => {
  const padding = 20;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;
  
  // Find the range of values
  let maxMagnitude = 0;
  for (let i = 0; i < signal.length; i++) {
    const magnitude = Complex.magnitude(signal[i]);
    if (magnitude > maxMagnitude) maxMagnitude = magnitude;
  }
  
  // Add a little padding to the max
  maxMagnitude = Math.ceil(maxMagnitude * 1.2);
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">Time Domain Signal</h3>
      <svg width={width} height={height} className="bg-white rounded shadow">
        {/* X and Y axis */}
        <line
          x1={padding}
          y1={height/2}
          x2={width - padding}
          y2={height/2}
          stroke="#ccc"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#ccc"
          strokeWidth="1"
        />
        
        {/* Signal plot */}
        <polyline
          points={signal.map((point, i) => {
            const x = padding + (i / (signal.length - 1)) * graphWidth;
            const y = (height / 2) - (point.real / maxMagnitude) * (graphHeight / 2);
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {signal.map((point, i) => {
          const x = padding + (i / (signal.length - 1)) * graphWidth;
          const y = (height / 2) - (point.real / maxMagnitude) * (graphHeight / 2);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#2563eb"
            />
          );
        })}
        
        {/* Labels */}
        <text x={width/2} y={height-5} textAnchor="middle" fill="#666" fontSize="12">Sample Index</text>
        <text x={5} y={height/2} textAnchor="start" fill="#666" fontSize="12" transform={`rotate(-90, 5, ${height/2})`}>Amplitude</text>
      </svg>
    </div>
  );
};

// Component to display signal in frequency domain
const FrequencyDomainVisualization = ({ signal, width = 400, height = 150 }) => {
  const padding = 20;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;
  
  // Calculate magnitudes of frequency components
  const magnitudes = signal.map(Complex.magnitude);
  
  // Find max magnitude for scaling
  const maxMagnitude = Math.max(...magnitudes, 0.1);
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">Frequency Domain</h3>
      <svg width={width} height={height} className="bg-white rounded shadow">
        {/* X and Y axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#ccc"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#ccc"
          strokeWidth="1"
        />
        
        {/* Frequency bars */}
        {magnitudes.map((magnitude, i) => {
          const barWidth = graphWidth / magnitudes.length * 0.7;
          const x = padding + (i / magnitudes.length) * graphWidth + barWidth * 0.15;
          const barHeight = (magnitude / maxMagnitude) * graphHeight;
          const y = height - padding - barHeight;
          
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#4ade80"
              stroke="#166534"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Labels */}
        <text x={width/2} y={height-5} textAnchor="middle" fill="#666" fontSize="12">Frequency</text>
        <text x={5} y={height/2} textAnchor="start" fill="#666" fontSize="12" transform={`rotate(-90, 5, ${height/2})`}>Magnitude</text>
      </svg>
    </div>
  );
};

// Component to visualize butterfly operations
const ButterflyVisualization = ({ stageData, width = 400, height = 200 }) => {
  if (!stageData || !stageData.butterflyGroups) return null;
  
  const { butterflyGroups, stage, workingArray } = stageData;
  const n = workingArray.length;
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">Butterfly Operations (Stage {stage})</h3>
      <div className="bg-white p-4 rounded shadow max-h-80 overflow-auto">
        {butterflyGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Group {groupIndex + 1}</h4>
            <div className="space-y-3">
              {group.butterflies.map((butterfly, bfIndex) => {
                const { index1, index2, before, after } = butterfly;
                
                return (
                  <div key={bfIndex} className="grid grid-cols-7 gap-2 items-center text-sm">
                    <div className="text-right">{`x[${index1}]`}</div>
                    <div className="bg-blue-100 px-2 py-1 rounded">{Complex.toString(before.value1)}</div>
                    <div className="text-center">→</div>
                    <div className="bg-green-100 px-2 py-1 rounded">{Complex.toString(after.value1)}</div>
                    
                    <div className="col-span-3 text-xs text-gray-500 text-center">
                      {`x[${index1}] = x[${index1}] + ω^j × x[${index2}]`}
                    </div>
                    
                    <div className="text-right">{`x[${index2}]`}</div>
                    <div className="bg-blue-100 px-2 py-1 rounded">{Complex.toString(before.value2)}</div>
                    <div className="text-center">→</div>
                    <div className="bg-green-100 px-2 py-1 rounded">{Complex.toString(after.value2)}</div>
                    
                    <div className="col-span-3 text-xs text-gray-500 text-center">
                      {`x[${index2}] = x[${index1}] - ω^j × x[${index2}]`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to display bit reversal
const BitReversalVisualization = ({ signal, reordered }) => {
  if (!signal || !reordered) return null;
  
  const n = signal.length;
  const bits = log2(n);
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">Bit Reversal Permutation</h3>
      <div className="bg-white p-4 rounded shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Index</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Binary</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Reversed</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">New Index</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Original Value</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Reordered Value</th>
              </tr>
            </thead>
            <tbody>
              {signal.map((value, index) => {
                const binaryIndex = index.toString(2).padStart(bits, '0');
                const reversedBinary = binaryIndex.split('').reverse().join('');
                const newIndex = parseInt(reversedBinary, 2);
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-3 text-sm text-gray-900">{index}</td>
                    <td className="py-2 px-3 text-sm text-gray-900 font-mono">{binaryIndex}</td>
                    <td className="py-2 px-3 text-sm text-gray-900 font-mono">{reversedBinary}</td>
                    <td className="py-2 px-3 text-sm text-gray-900">{newIndex}</td>
                    <td className="py-2 px-3 text-sm text-gray-900">{Complex.toString(value)}</td>
                    <td className="py-2 px-3 text-sm text-gray-900">{Complex.toString(reordered[index])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component to display the result table
const ResultTable = ({ original, result }) => {
  if (!original || !result) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">FFT Result</h3>
      <div className="bg-white p-4 rounded shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Frequency Bin</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Complex Value</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Magnitude</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Phase (radians)</th>
              </tr>
            </thead>
            <tbody>
              {result.map((value, index) => {
                const magnitude = Complex.magnitude(value);
                const phase = Complex.phase(value);
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-3 text-sm text-gray-900">{index}</td>
                    <td className="py-2 px-3 text-sm text-gray-900 font-mono">{Complex.toString(value)}</td>
                    <td className="py-2 px-3 text-sm text-gray-900">{magnitude.toFixed(4)}</td>
                    <td className="py-2 px-3 text-sm text-gray-900">{phase.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main FFT visualization component
const FFTVisualizationStep = ({ data, step }) => {
  const { signal, result, stageData } = data;
  
  // Determine what to render based on current step
  const renderVisualization = () => {
    switch (data.step) {
      case 'initial':
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Fast Fourier Transform (FFT)</h3>
              <p className="text-gray-600 mb-4">
                The FFT is an algorithm that computes the Discrete Fourier Transform (DFT) of a sequence,
                converting a signal from time domain to frequency domain. It reduces the complexity from 
                O(n²) to O(n log n) by using a divide-and-conquer approach.
              </p>
              
              <div className="mt-4">
                <TimeDomainVisualization signal={signal} />
              </div>
            </div>
          </div>
        );
        
      case 'bit-reversal':
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Bit Reversal Permutation</h3>
              <p className="text-gray-600 mb-4">
                The first step in FFT is to reorder the input by bit-reversing the indices.
                This prepares the array for in-place calculation of butterfly operations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeDomainVisualization signal={signal} />
              <BitReversalVisualization signal={signal} reordered={data.reordered} />
            </div>
          </div>
        );
        
      case 'butterfly-stage':
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Butterfly Operations - Stage {data.currentStage}
              </h3>
              <p className="text-gray-600 mb-4">
                FFT uses butterfly operations to combine smaller DFTs into larger ones.
                In each stage, pairs of values are combined using complex math operations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeDomainVisualization signal={signal} />
              <FrequencyDomainVisualization signal={result} />
              <div className="lg:col-span-2">
                <ButterflyVisualization stageData={stageData} />
              </div>
            </div>
          </div>
        );
        
      case 'final':
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">FFT Complete</h3>
              <p className="text-gray-600 mb-4">
                The FFT is now complete. The output array contains the frequency components of the input signal.
                Each element represents the amplitude and phase of a specific frequency component.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeDomainVisualization signal={signal} />
              <FrequencyDomainVisualization signal={result} />
              <div className="lg:col-span-2">
                <ResultTable original={signal} result={result} />
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return <div className="w-full">{renderVisualization()}</div>;
};

// Main visualization component
const FFTVisualizationComponent = ({ data, step, stepInfo }) => {
  return (
    <div className="w-full">
      <FFTVisualizationStep data={data} step={step} />
    </div>
  );
};

// Container component with animation controls
const FastFourierTransformVisualization = () => {
  // Generate initial data
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Fast Fourier Transform (FFT)"
      initialData={initialData}
      generateSteps={generateFFTSteps}
      VisualizationComponent={FFTVisualizationComponent}
      description="The Fast Fourier Transform (FFT) is an algorithm that computes the Discrete Fourier Transform (DFT) of a sequence. It converts a signal from the time domain to the frequency domain with O(n log n) complexity instead of O(n²) using a divide-and-conquer approach."
    />
  );
};

export default FastFourierTransformVisualization; 