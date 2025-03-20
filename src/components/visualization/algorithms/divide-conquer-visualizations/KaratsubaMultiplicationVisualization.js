import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationContainer from '../../VisualizationContainer';

// Function to generate initial data for Karatsuba Multiplication
const generateInitialData = () => {
  // Using relatively small numbers for clarity in visualization
  const num1 = 1234;
  const num2 = 5678;
  
  return {
    num1,
    num2,
    result: null,
    steps: [],
    currentStep: 0,
    subproblems: [],
    depth: 0,
    stage: 'initial'
  };
};

// Helper function to split a number into two parts
const splitNumber = (num, m) => {
  const high = Math.floor(num / Math.pow(10, m));
  const low = num % Math.pow(10, m);
  return { high, low };
};

// Helper function to get the number of digits
const getDigits = (num) => {
  return Math.floor(Math.log10(num)) + 1;
};

// Basic multiplication for small numbers (base case)
const baseMultiply = (x, y) => {
  return {
    result: x * y,
    steps: [`Basic multiplication: ${x} × ${y} = ${x * y}`],
    operations: 1
  };
};

// Generate steps for the Karatsuba algorithm
const generateKaratsubaSteps = (initialData) => {
  const steps = [];
  const { num1, num2 } = initialData;
  
  // Add initial step
  steps.push({
    data: {
      ...initialData,
      stage: 'initial'
    },
    description: `Starting Karatsuba multiplication for ${num1} × ${num2}`,
    codeHighlight: "// Given two large integers x and y",
    complexityInfo: "Traditional multiplication: O(n²), Karatsuba: O(n^log₂3) ≈ O(n^1.585)"
  });
  
  // Recursive function to perform Karatsuba multiplication
  const karatsuba = (x, y, depth = 0, path = '') => {
    // Create a unique ID for this recursive call
    const id = path || 'root';
    
    // Base case: if numbers are small enough, use basic multiplication
    if (x < 10 || y < 10) {
      const result = baseMultiply(x, y);
      
      steps.push({
        data: {
          ...initialData,
          num1: x,
          num2: y,
          result: result.result,
          subproblems: [],
          depth,
          stage: 'base_case'
        },
        description: `Base case: Numbers are small enough, using basic multiplication.`,
        codeHighlight: "if x < 10 or y < 10:\n    return x * y",
        complexityInfo: `Operations needed: ${result.operations}`
      });
      
      return {
        result: result.result,
        steps: result.steps,
        operations: result.operations,
        id
      };
    }
    
    // Calculate the size of the numbers
    const n = Math.max(getDigits(x), getDigits(y));
    const m = Math.floor(n / 2);
    
    // Step 1: Split the numbers into two parts
    const { high: a, low: b } = splitNumber(x, m);
    const { high: c, low: d } = splitNumber(y, m);
    
    steps.push({
      data: {
        ...initialData,
        num1: x,
        num2: y,
        subproblems: [
          { label: 'a', value: a },
          { label: 'b', value: b },
          { label: 'c', value: c },
          { label: 'd', value: d }
        ],
        depth,
        stage: 'split'
      },
      description: `Split ${x} into a=${a} and b=${b}, ${y} into c=${c} and d=${d}`,
      codeHighlight: "// Split x into a and b, y into c and d\na = ⌊x/10^(n/2)⌋\nb = x mod 10^(n/2)\nc = ⌊y/10^(n/2)⌋\nd = y mod 10^(n/2)",
      complexityInfo: `Numbers split into halves, each with approximately ${m} digits.`
    });
    
    // Step 2: Recursively compute three products
    // P1 = a * c
    const p1 = karatsuba(a, c, depth + 1, `${id}-p1`);
    
    steps.push({
      data: {
        ...initialData,
        num1: a,
        num2: c,
        result: p1.result,
        subproblems: [
          { label: 'a', value: a },
          { label: 'c', value: c },
          { label: 'ac', value: p1.result }
        ],
        depth,
        stage: 'compute_p1'
      },
      description: `Compute first product: P1 = a × c = ${a} × ${c} = ${p1.result}`,
      codeHighlight: "P1 = karatsuba(a, c) // First recursive call",
      complexityInfo: `Computed P1 in ${p1.operations} operations.`
    });
    
    // P2 = b * d
    const p2 = karatsuba(b, d, depth + 1, `${id}-p2`);
    
    steps.push({
      data: {
        ...initialData,
        num1: b,
        num2: d,
        result: p2.result,
        subproblems: [
          { label: 'b', value: b },
          { label: 'd', value: d },
          { label: 'bd', value: p2.result }
        ],
        depth,
        stage: 'compute_p2'
      },
      description: `Compute second product: P2 = b × d = ${b} × ${d} = ${p2.result}`,
      codeHighlight: "P2 = karatsuba(b, d) // Second recursive call",
      complexityInfo: `Computed P2 in ${p2.operations} operations.`
    });
    
    // P3 = (a + b) * (c + d) - P1 - P2
    const p3Sum1 = a + b;
    const p3Sum2 = c + d;
    const p3Prod = karatsuba(p3Sum1, p3Sum2, depth + 1, `${id}-p3`);
    const p3 = p3Prod.result - p1.result - p2.result;
    
    steps.push({
      data: {
        ...initialData,
        num1: p3Sum1,
        num2: p3Sum2,
        result: p3Prod.result,
        subproblems: [
          { label: 'a+b', value: p3Sum1 },
          { label: 'c+d', value: p3Sum2 },
          { label: '(a+b)(c+d)', value: p3Prod.result },
          { label: 'P3', value: p3 }
        ],
        depth,
        stage: 'compute_p3'
      },
      description: `Compute third product: P3 = (a+b)(c+d) - P1 - P2 = ${p3Sum1} × ${p3Sum2} - ${p1.result} - ${p2.result} = ${p3Prod.result} - ${p1.result} - ${p2.result} = ${p3}`,
      codeHighlight: "P3 = karatsuba(a+b, c+d) - P1 - P2  // Third recursive call",
      complexityInfo: `Computed P3 in ${p3Prod.operations + 2} operations (including 2 subtractions).`
    });
    
    // Final result: P1 * 10^(2*m) + P3 * 10^m + P2
    const result = p1.result * Math.pow(10, 2 * m) + p3 * Math.pow(10, m) + p2.result;
    
    steps.push({
      data: {
        ...initialData,
        num1: x,
        num2: y,
        result: result,
        subproblems: [
          { label: 'P1', value: p1.result },
          { label: 'P2', value: p2.result },
          { label: 'P3', value: p3 },
          { label: 'Result', value: result }
        ],
        depth,
        stage: 'combine'
      },
      description: `Combine the results: ${x} × ${y} = (${p1.result} × 10^${2*m}) + (${p3} × 10^${m}) + ${p2.result} = ${result}`,
      codeHighlight: "return P1 * 10^(2*m) + P3 * 10^m + P2",
      complexityInfo: `Final result computed with a total of ${p1.operations + p2.operations + p3Prod.operations + 2 + 2} operations.`
    });
    
    return {
      result,
      steps: [
        ...p1.steps,
        ...p2.steps,
        `Compute (a+b)(c+d): ${p3Sum1} × ${p3Sum2} = ${p3Prod.result}`,
        `Compute P3 = (a+b)(c+d) - P1 - P2: ${p3Prod.result} - ${p1.result} - ${p2.result} = ${p3}`,
        `Combine: ${p1.result} × 10^${2*m} + ${p3} × 10^${m} + ${p2.result} = ${result}`
      ],
      operations: p1.operations + p2.operations + p3Prod.operations + 4, // 3 products + 2 subtractions + 2 shifts
      id
    };
  };
  
  // Start the Karatsuba multiplication
  const result = karatsuba(num1, num2);
  
  // Add final step
  steps.push({
    data: {
      ...initialData,
      num1,
      num2,
      result: result.result,
      stage: 'final'
    },
    description: `Final result: ${num1} × ${num2} = ${result.result}`,
    codeHighlight: "// Final result",
    complexityInfo: `Traditional method would require ${getDigits(num1) * getDigits(num2)} multiplications, but Karatsuba only needed approximately ${result.operations}.`
  });
  
  return steps;
};

// Component to display each step of the Karatsuba algorithm visually
const KaratsubaStep = ({ data, step }) => {
  const {
    num1,
    num2,
    result,
    subproblems,
    stage,
    depth
  } = data;
  
  // Helper function to render the splitting of numbers
  const renderSplitStep = () => {
    if (!subproblems || subproblems.length !== 4) return null;
    
    const [a, b, c, d] = subproblems;
    const n = Math.max(getDigits(num1), getDigits(num2));
    const m = Math.floor(n / 2);
    
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Splitting Numbers</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-3 rounded bg-blue-50">
            <p className="font-medium">First Number: {num1}</p>
            <div className="flex mt-2">
              <div className="bg-blue-100 p-2 rounded">
                a = {a.value} (high part)
              </div>
              <div className="ml-2 bg-blue-100 p-2 rounded">
                b = {b.value} (low part)
              </div>
            </div>
            <p className="text-sm mt-2 text-gray-600">Split at 10^{m}</p>
          </div>
          
          <div className="border p-3 rounded bg-purple-50">
            <p className="font-medium">Second Number: {num2}</p>
            <div className="flex mt-2">
              <div className="bg-purple-100 p-2 rounded">
                c = {c.value} (high part)
              </div>
              <div className="ml-2 bg-purple-100 p-2 rounded">
                d = {d.value} (low part)
              </div>
            </div>
            <p className="text-sm mt-2 text-gray-600">Split at 10^{m}</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Helper function to render the recursive multiplications
  const renderMultiplicationStep = () => {
    if (!subproblems || subproblems.length < 2) return null;
    
    const labels = subproblems.map(p => p.label);
    const title = stage === 'compute_p1' ? 'Computing P1 = a × c' :
                 stage === 'compute_p2' ? 'Computing P2 = b × d' :
                 stage === 'compute_p3' ? 'Computing P3 = (a+b)(c+d) - P1 - P2' :
                 'Multiplication';
    
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="text-3xl">{subproblems[0].value}</div>
          <div className="text-3xl">×</div>
          <div className="text-3xl">{subproblems[1].value}</div>
          <div className="text-3xl">=</div>
          <div className="text-3xl font-bold">{result}</div>
        </div>
        
        {stage === 'compute_p3' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded">
            <p className="font-medium">To compute P3:</p>
            <p>(a+b)(c+d) - P1 - P2 = {subproblems[2].value} - P1 - P2</p>
            {subproblems.length >= 4 && (
              <p className="font-medium mt-2">Final P3 = {subproblems[3].value}</p>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Helper function to render the combining of results
  const renderCombineStep = () => {
    if (!subproblems || subproblems.length !== 4) return null;
    
    const [p1, p2, p3, finalResult] = subproblems;
    const n = Math.max(getDigits(num1), getDigits(num2));
    const m = Math.floor(n / 2);
    
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Combining Results</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-20 font-medium">P1 =</div>
            <div className="bg-blue-100 p-2 rounded">{p1.value}</div>
          </div>
          
          <div className="flex items-center">
            <div className="w-20 font-medium">P2 =</div>
            <div className="bg-green-100 p-2 rounded">{p2.value}</div>
          </div>
          
          <div className="flex items-center">
            <div className="w-20 font-medium">P3 =</div>
            <div className="bg-yellow-100 p-2 rounded">{p3.value}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium">Final formula:</div>
            <div>(P1 × 10^{2*m}) + (P3 × 10^{m}) + P2</div>
            <div>= ({p1.value} × 10^{2*m}) + ({p3.value} × 10^{m}) + {p2.value}</div>
            <div className="font-bold mt-2">= {finalResult.value}</div>
          </div>
        </div>
      </div>
    );
  };
  
  // Helper function to render the final result
  const renderFinalStep = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Final Result</h3>
        
        <div className="text-center p-4">
          <div className="text-xl">
            {num1} × {num2} = 
            <span className="font-bold text-2xl ml-2">{result}</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p>Karatsuba's algorithm reduces the number of multiplications from O(n²) to O(n^1.585),</p>
          <p>making it much more efficient for large numbers.</p>
        </div>
      </div>
    );
  };
  
  // Render the appropriate visualization based on the current stage
  const renderVisualization = () => {
    switch (stage) {
      case 'initial':
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Karatsuba Multiplication</h3>
            <div className="text-center p-4">
              <div className="text-xl">{num1} × {num2}</div>
              <p className="mt-4 text-gray-600">
                The Karatsuba algorithm is a divide-and-conquer approach that reduces the number of multiplications
                needed for large integer multiplication.
              </p>
            </div>
          </div>
        );
      case 'split':
        return renderSplitStep();
      case 'compute_p1':
      case 'compute_p2':
      case 'compute_p3':
      case 'base_case':
        return renderMultiplicationStep();
      case 'combine':
        return renderCombineStep();
      case 'final':
        return renderFinalStep();
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {renderVisualization()}
      
      {/* Recursive depth indicator */}
      {depth > 0 && (
        <div className="p-2 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">Recursion depth: {depth}</p>
        </div>
      )}
    </div>
  );
};

// Main visualization component
const KaratsubaVisualizationComponent = ({ data, step, stepInfo }) => {
  return (
    <div className="w-full">
      <KaratsubaStep data={data} step={step} />
    </div>
  );
};

// Container component with animation controls
const KaratsubaMultiplicationVisualization = () => {
  // Generate initial data
  const initialData = useMemo(() => {
    return generateInitialData();
  }, []);
  
  return (
    <VisualizationContainer
      algorithmName="Karatsuba Multiplication"
      initialData={initialData}
      generateSteps={generateKaratsubaSteps}
      VisualizationComponent={KaratsubaVisualizationComponent}
      description="Karatsuba's algorithm is a fast multiplication algorithm that uses a divide-and-conquer approach to multiply two numbers. The algorithm reduces the number of multiplications from O(n²) to O(n^log₂3) ≈ O(n^1.585), making it more efficient for large integer multiplication."
    />
  );
};

export default KaratsubaMultiplicationVisualization; 