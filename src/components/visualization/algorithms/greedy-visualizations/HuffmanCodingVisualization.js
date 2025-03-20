import React, { useState, useEffect } from 'react';
import VisualizationContainer from '../../VisualizationContainer';
import { motion } from 'framer-motion';

class Node {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
    this.code = '';
  }

  isLeaf() {
    return this.left === null && this.right === null;
  }
}

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(node) {
    this.queue.push(node);
    this.sort();
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.queue.shift();
  }

  sort() {
    this.queue.sort((a, b) => a.freq - b.freq);
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  size() {
    return this.queue.length;
  }

  getItems() {
    return [...this.queue];
  }
}

// Visualization component that will be passed to VisualizationContainer
const HuffmanCodingVisualizationComponent = ({ data, step, stepInfo }) => {
  // Use the step prop directly from VisualizationContainer
  // No need to track state separately
  
  // Recursive component to render a node in the tree
  const TreeNode = ({ node, direction, level = 0 }) => {
    if (!node) return null;

    // Calculate connection lines
    const getConnectorClasses = () => {
      if (direction === 'left') {
        return 'border-r border-gray-400 absolute h-8 right-0 top-0 w-1/2';
      } else if (direction === 'right') {
        return 'border-l border-gray-400 absolute h-8 left-0 top-0 w-1/2';
      }
      return '';
    };

    return (
      <div className={`relative flex flex-col items-center ${level === 0 ? 'mt-4' : 'mt-12'}`}>
        {direction && <div className={getConnectorClasses()}></div>}
        
        {/* Node circle with value */}
        <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full 
          ${node.isLeaf?.() ? 'bg-red-100 border-red-300' : 'bg-green-100 border-green-300'} 
          border-2 shadow-sm mb-1`}>
          <div className="text-center">
            <div className="font-medium text-sm">
              {node.char ? `${node.char}` : ''}
            </div>
            <div className="text-xs text-gray-600">{node.freq}</div>
          </div>
        </div>
        
        {/* Edge label (0 for left, 1 for right) */}
        {direction && (
          <div className={`absolute text-xs font-medium text-gray-600
            ${direction === 'left' ? 'top-4 right-1/2 mr-2' : 'top-4 left-1/2 ml-2'}`}>
            {direction === 'left' ? '0' : '1'}
          </div>
        )}
        
        {/* Children */}
        {(node.left || node.right) && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {node.left && <div className="flex-1 min-w-[200px]"><TreeNode node={node.left} direction="left" level={level + 1} /></div>}
            {node.right && <div className="flex-1 min-w-[200px]"><TreeNode node={node.right} direction="right" level={level + 1} /></div>}
          </div>
        )}
      </div>
    );
  };

  // Render the Huffman tree using the TreeNode component
  const renderTree = () => {
    if (!data.huffmanTree) return <div className="w-full h-96 mt-2 flex items-center justify-center text-gray-500">Building tree...</div>;
    
    return (
      <div className="w-full overflow-auto p-4 mt-2 bg-white rounded-lg shadow max-h-96">
        <div className="min-w-[800px] min-h-[300px]">
          <TreeNode node={data.huffmanTree} />
        </div>
      </div>
    );
  };

  // Render the current state of the priority queue
  const renderPriorityQueue = () => {
    if (!data.steps[step]) return null;
    
    const queueItems = data.steps[step].queueAfter;
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Priority Queue</h3>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Character</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {queueItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">{item.char || 'Internal Node'}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{item.freq}</td>
                </tr>
              ))}
              {queueItems.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 px-4 text-sm text-gray-500 text-center">Queue is empty</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render the Huffman codes table
  const renderCodesTable = () => {
    if (Object.keys(data.codes).length === 0) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Huffman Codes</h3>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Character</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Code</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(data.codes).map(([char, code]) => (
                <tr key={char} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">{char}</td>
                  <td className="py-2 px-4 text-sm text-gray-700 font-mono">{code}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{code.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render current step explanation
  const renderStepExplanation = () => {
    if (!data.steps[step]) return null;
    
    const stepInfo = data.steps[step];
    const { extractedLeft, extractedRight, newNode } = stepInfo;
    
    return (
      <div className="mt-4 mb-4 p-4 bg-blue-50 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Current Step</h3>
        <p className="text-gray-700 mb-2">{stepInfo.description}</p>
        
        {extractedLeft && extractedRight && (
          <div className="mt-2">
            <p className="text-gray-700">
              Extracted: 
              {extractedLeft.char ? ` Character '${extractedLeft.char}' (${extractedLeft.freq})` : ` Node (${extractedLeft.freq})`} and 
              {extractedRight.char ? ` Character '${extractedRight.char}' (${extractedRight.freq})` : ` Node (${extractedRight.freq})`}
            </p>
            <p className="text-gray-700 mt-1">
              Created new node with frequency: {newNode.freq}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8">
        {renderStepExplanation()}
        {renderTree()}
      </div>
      <div className="lg:col-span-4">
        {renderPriorityQueue()}
        {step >= data.steps.length - 1 && renderCodesTable()}
      </div>
    </div>
  );
};

const HuffmanCodingVisualization = () => {
  const [characters, setCharacters] = useState('');
  const [frequencies, setFrequencies] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [huffmanTree, setHuffmanTree] = useState(null);
  const [codes, setCodes] = useState({});
  const [steps, setSteps] = useState([]);
  const [queueState, setQueueState] = useState([]);
  const [treeData, setTreeData] = useState(null);

  const defaultData = [
    { char: 'A', freq: 5 },
    { char: 'B', freq: 9 },
    { char: 'C', freq: 12 },
    { char: 'D', freq: 13 },
    { char: 'E', freq: 16 },
    { char: 'F', freq: 45 }
  ];

  // Initialize with default data
  useEffect(() => {
    initializeWithData(defaultData);
  }, []);

  const initializeWithData = (data) => {
    const chars = data.map(item => item.char).join('');
    const freqs = data.map(item => item.freq);
    setCharacters(chars);
    setFrequencies(freqs);
    
    // Create initial nodes
    const initialNodes = data.map(item => new Node(item.char, item.freq));
    setNodes(initialNodes);
    
    // Run the Huffman algorithm to generate steps and results
    const { tree, codeMap, allSteps, queueStates } = buildHuffmanCode(initialNodes);
    setHuffmanTree(tree);
    setCodes(codeMap);
    setSteps(allSteps);
    setQueueState(queueStates);
    
    // Set initial tree visualization data
    if (tree) {
      const hierarchyData = convertToHierarchyData(tree);
      setTreeData(hierarchyData);
    }
  };

  // Function to build Huffman tree and generate codes
  const buildHuffmanCode = (initialNodes) => {
    const pq = new PriorityQueue();
    initialNodes.forEach(node => pq.enqueue(node));
    
    const allSteps = [];
    const queueStates = [];
    
    // Add initial state
    allSteps.push({
      description: 'Initialize leaf nodes for each character with its frequency',
      extractedLeft: null,
      extractedRight: null,
      newNode: null,
      queueBefore: pq.getItems(),
      queueAfter: pq.getItems(),
    });
    queueStates.push(pq.getItems());

    // Build Huffman tree
    while (pq.size() > 1) {
      const left = pq.dequeue();
      const right = pq.dequeue();
      
      const queueBefore = [...pq.getItems(), left, right];
      
      // Create new internal node
      const newNode = new Node(null, left.freq + right.freq, left, right);
      pq.enqueue(newNode);
      
      // Record this step
      allSteps.push({
        description: `Extract nodes with frequencies ${left.freq} and ${right.freq}, combine to create new node with frequency ${newNode.freq}`,
        extractedLeft: left,
        extractedRight: right,
        newNode: newNode,
        queueBefore: queueBefore,
        queueAfter: pq.getItems(),
      });
      queueStates.push(pq.getItems());
    }
    
    // The root of Huffman Tree
    const root = pq.dequeue();
    
    // Record final step
    allSteps.push({
      description: 'Huffman tree is complete. Now we can assign codes to characters.',
      extractedLeft: null,
      extractedRight: null,
      newNode: root,
      queueBefore: [root],
      queueAfter: [],
    });
    queueStates.push([]);
    
    // Generate codes for each character
    const codeMap = {};
    generateCodes(root, '', codeMap);
    
    return { tree: root, codeMap, allSteps, queueStates };
  };

  // Function to generate codes by traversing the tree
  const generateCodes = (node, code, codeMap) => {
    if (node === null) return;
    
    // If this is a leaf node, store the code
    if (node.isLeaf()) {
      codeMap[node.char] = code;
      return;
    }
    
    // Traverse left (add 0 to code)
    generateCodes(node.left, code + '0', codeMap);
    
    // Traverse right (add 1 to code)
    generateCodes(node.right, code + '1', codeMap);
  };

  // Convert the Huffman tree to a hierarchical data structure
  const convertToHierarchyData = (node) => {
    if (!node) return null;
    
    const result = {
      name: node.char ? `${node.char} (${node.freq})` : `${node.freq}`,
      frequency: node.freq,
      children: []
    };
    
    if (node.left) {
      result.children.push(convertToHierarchyData(node.left));
    }
    
    if (node.right) {
      result.children.push(convertToHierarchyData(node.right));
    }
    
    return result;
  };

  // Generate initial data set for the algorithm
  const generateInitialData = () => {
    return {
      characters: characters.split(''),
      frequencies,
      nodes,
      huffmanTree,
      codes,
      steps,
      queueState,
    };
  };

  // Generate steps for the visualization
  const generateVisualizationSteps = (initialData) => {
    return steps.map((step, index) => ({
      title: `Step ${index + 1}`,
      description: step.description,
      data: {
        currentStep: index,
        queueState: queueState[index],
        extractedLeft: step.extractedLeft,
        extractedRight: step.extractedRight,
        newNode: step.newNode,
        huffmanTree,
        codes,
        steps
      }
    }));
  };

  return (
    <VisualizationContainer
      algorithmName="Huffman Coding"
      initialData={generateInitialData()}
      generateSteps={generateVisualizationSteps}
      VisualizationComponent={HuffmanCodingVisualizationComponent}
      description="Huffman coding is a greedy algorithm used for lossless data compression. It assigns variable-length codes to symbols based on their frequencies, with more frequent symbols having shorter codes."
    />
  );
};

export default HuffmanCodingVisualization; 