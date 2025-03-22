import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaClock, FaMemory, FaCode, FaListOl } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import algorithmData from '../data/algorithms.json';
import { useLenis } from '../context/LenisContext';
import BubbleSortVisualization from '../components/visualization/algorithms/sort-visualizations/BubbleSortVisualization';
import SelectionSortVisualization from '../components/visualization/algorithms/sort-visualizations/SelectionSortVisualization';
import InsertionSortVisualization from '../components/visualization/algorithms/sort-visualizations/InsertionSortVisualization';
import MergeSortVisualization from '../components/visualization/algorithms/sort-visualizations/MergeSortVisualization';
import QuickSortVisualization from '../components/visualization/algorithms/sort-visualizations/QuickSortVisualization';
import HeapSortVisualization from '../components/visualization/algorithms/sort-visualizations/HeapSortVisualization';
import RadixSortVisualization from '../components/visualization/algorithms/sort-visualizations/RadixSortVisualization';
import CountingSortVisualization from '../components/visualization/algorithms/sort-visualizations/CountingSortVisualization';
import ShellSortVisualization from '../components/visualization/algorithms/sort-visualizations/ShellSortVisualization';
import TimSortVisualization from '../components/visualization/algorithms/sort-visualizations/TimSortVisualization';
import BucketSortVisualization from '../components/visualization/algorithms/sort-visualizations/BucketSortVisualization';
import LinearSearchVisualization from '../components/visualization/algorithms/search-visualizations/LinearSearchVisualization';
import BinarySearchVisualization from '../components/visualization/algorithms/search-visualizations/BinarySearchVisualization';
import JumpSearchVisualization from '../components/visualization/algorithms/search-visualizations/JumpSearchVisualization';
import InterpolationSearchVisualization from '../components/visualization/algorithms/search-visualizations/InterpolationSearchVisualization';
import ExponentialSearchVisualization from '../components/visualization/algorithms/search-visualizations/ExponentialSearchVisualization';
import FibonacciSearchVisualization from '../components/visualization/algorithms/search-visualizations/FibonacciSearchVisualization';
import TernarySearchVisualization from '../components/visualization/algorithms/search-visualizations/TernarySearchVisualization';
import BFSVisualization from '../components/visualization/algorithms/graph-visualizations/BFSVisualization';
import DFSVisualization from '../components/visualization/algorithms/graph-visualizations/DFSVisualization';
import DijkstraVisualization from '../components/visualization/algorithms/graph-visualizations/DijkstraVisualization';
import BellmanFordVisualization from '../components/visualization/algorithms/graph-visualizations/BellmanFordVisualization';
import FloydWarshallVisualization from '../components/visualization/algorithms/graph-visualizations/FloydWarshallVisualization';
import KruskalsVisualization from '../components/visualization/algorithms/graph-visualizations/KruskalsVisualization';
import PrimsVisualization from '../components/visualization/algorithms/graph-visualizations/PrimsVisualization';
import TopologicalSortVisualization from '../components/visualization/algorithms/graph-visualizations/TopologicalSortVisualization';
import JohnsonsVisualization from '../components/visualization/algorithms/graph-visualizations/JohnsonsVisualization';
import AStarSearchVisualization from '../components/visualization/algorithms/graph-visualizations/AStarSearchVisualization';
import FordFulkersonVisualization from '../components/visualization/algorithms/graph-visualizations/FordFulkersonVisualization';
import FibonacciSequenceVisualization from '../components/visualization/algorithms/dp-visualizations/FibonacciSequenceVisualization';
import KnapsackVisualization from '../components/visualization/algorithms/dp-visualizations/KnapsackVisualization';
import LCSVisualization from '../components/visualization/algorithms/dp-visualizations/LCSVisualization';
import LISVisualization from '../components/visualization/algorithms/dp-visualizations/LISVisualization';
import MatrixChainMultiplicationVisualization from '../components/visualization/algorithms/dp-visualizations/MatrixChainMultiplicationVisualization';
import EditDistanceVisualization from '../components/visualization/algorithms/dp-visualizations/EditDistanceVisualization';
import CoinChangeVisualization from '../components/visualization/algorithms/dp-visualizations/CoinChangeVisualization';
import SubsetSumVisualization from '../components/visualization/algorithms/dp-visualizations/SubsetSumVisualization';
import RodCuttingVisualization from '../components/visualization/algorithms/dp-visualizations/RodCuttingVisualization';
import ShortestCommonSupersequenceVisualization from '../components/visualization/algorithms/dp-visualizations/ShortestCommonSupersequenceVisualization';
import StrassenMatrixMultiplicationVisualization from '../components/visualization/algorithms/divide-conquer-visualizations/StrassenMatrixMultiplicationVisualization';
import ClosestPairVisualization from '../components/visualization/algorithms/divide-conquer-visualizations/ClosestPairVisualization';
import FastFourierTransformVisualization from '../components/visualization/algorithms/divide-conquer-visualizations/FastFourierTransformVisualization';
import KaratsubaMultiplicationVisualization from '../components/visualization/algorithms/divide-conquer-visualizations/KaratsubaMultiplicationVisualization';
import HuffmanCodingVisualization from '../components/visualization/algorithms/greedy-visualizations/HuffmanCodingVisualization';
import JobSequencingVisualization from '../components/visualization/algorithms/greedy-visualizations/JobSequencingVisualization';
import FractionalKnapsackVisualization from '../components/visualization/algorithms/greedy-visualizations/FractionalKnapsackVisualization';
import ActivitySelectionVisualization from '../components/visualization/algorithms/greedy-visualizations/ActivitySelectionVisualization';
import NQueensVisualization from '../components/visualization/algorithms/backtracking-visualizations/NQueensVisualization';
import RatInMazeVisualization from '../components/visualization/algorithms/backtracking-visualizations/RatInMazeVisualization';
import KnightsTourVisualization from '../components/visualization/algorithms/backtracking-visualizations/KnightsTourVisualization';
import HamiltonianCycleVisualization from '../components/visualization/algorithms/backtracking-visualizations/HamiltonianCycleVisualization';
import SudokuSolverVisualization from '../components/visualization/algorithms/backtracking-visualizations/SudokuSolverVisualization';
import NaivePatternSearchingVisualization from '../components/visualization/algorithms/string-visualizations/NaivePatternSearchingVisualization';
import KMPVisualization from '../components/visualization/algorithms/string-visualizations/KMPVisualization';
import RabinKarpVisualization from '../components/visualization/algorithms/string-visualizations/RabinKarpVisualization';
import ZAlgorithmVisualization from '../components/visualization/algorithms/string-visualizations/ZAlgorithmVisualization';
import BoyerMooreVisualization from '../components/visualization/algorithms/string-visualizations/BoyerMooreVisualization';
import InorderTraversalVisualization from '../components/visualization/algorithms/tree-visualizations/InorderTraversalVisualization';
import PreorderTraversalVisualization from "../components/visualization/algorithms/tree-visualizations/PreorderTraversalVisualization";
import PostorderTraversalVisualization from "../components/visualization/algorithms/tree-visualizations/PostorderTraversalVisualization";
import LevelOrderTraversalVisualization from "../components/visualization/algorithms/tree-visualizations/LevelOrderTraversalVisualization";
import BinarySearchTreeVisualization from "../components/visualization/algorithms/tree-visualizations/BinarySearchTreeVisualization";
import AVLTreeVisualization from "../components/visualization/algorithms/tree-visualizations/AVLTreeVisualization";

// Helper function to render HTML content safely
const renderHtmlContent = (htmlArray) => {
  if (!htmlArray || !Array.isArray(htmlArray)) return null;
  
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlArray.join('') }} />
  );
};

const AlgorithmDetail = () => {
  const { categoryId, algorithmId } = useParams();
  const [algorithm, setAlgorithm] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const lenis = useLenis();
  const titleRef = useRef(null);

  useEffect(() => {
    // Scroll to top when component mounts
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    
    // Find the category and algorithm
    const foundCategory = algorithmData.categories.find(cat => cat.id === categoryId);
    
    if (foundCategory) {
      setCategory(foundCategory);
      const foundAlgorithm = foundCategory.algorithms.find(algo => algo.id === algorithmId);
      
      if (foundAlgorithm) {
        setAlgorithm(foundAlgorithm);
      } else {
        // Algorithm not found, redirect to the category page
        navigate(`/algorithms#${categoryId}`);
      }
    } else {
      // Category not found, redirect to algorithms page
      navigate('/algorithms');
    }
    
    setLoading(false);
  }, [categoryId, algorithmId, navigate, lenis]);

  // Helper function to render the appropriate visualization based on algorithm ID
  const renderAlgorithmVisualization = () => {
    if (!algorithm) return null;
    
    const visualizationKey = `${algorithm.id}-${Date.now()}`;
    
    switch (algorithm.id) {
      case 'bubble-sort':
        return <BubbleSortVisualization key={visualizationKey} />;
      case 'selection-sort':
        return <SelectionSortVisualization key={visualizationKey} />;
      case 'insertion-sort':
        return <InsertionSortVisualization key={visualizationKey} />;
      case 'merge-sort':
        return <MergeSortVisualization key={visualizationKey} />;
      case 'quick-sort':
        return <QuickSortVisualization key={visualizationKey} />;
      case 'heap-sort':
        return <HeapSortVisualization key={visualizationKey} />;
      case 'radix-sort':
        return <RadixSortVisualization key={visualizationKey} />;
      case 'counting-sort':
        return <CountingSortVisualization key={visualizationKey} />;
      case 'shell-sort':
        return <ShellSortVisualization key={visualizationKey} />;
      case 'bucket-sort':
        return <BucketSortVisualization key={visualizationKey} />;
      case 'tim-sort':
        return <TimSortVisualization key={visualizationKey} />;
      case 'linear-search':
        return <LinearSearchVisualization key={visualizationKey} />;
      case 'binary-search':
        return <BinarySearchVisualization key={visualizationKey} />;
      case 'jump-search':
        return <JumpSearchVisualization key={visualizationKey} />;
      case 'interpolation-search':
        return <InterpolationSearchVisualization key={visualizationKey} />;
      case 'exponential-search':
        return <ExponentialSearchVisualization key={visualizationKey} />;
      case 'fibonacci-search':
        return <FibonacciSearchVisualization key={visualizationKey} />;
      case 'ternary-search':
        return <TernarySearchVisualization key={visualizationKey} />;
      case 'bfs':
        return <BFSVisualization key={visualizationKey} />;
      case 'dfs':
        return <DFSVisualization key={visualizationKey} />;
      case 'dijkstra':
        return <DijkstraVisualization key={visualizationKey} />;
      case 'bellman-ford':
        return <BellmanFordVisualization key={visualizationKey} />;
      case 'floyd-warshall':
        return <FloydWarshallVisualization key={visualizationKey} />;
      case 'kruskals':
        return <KruskalsVisualization key={visualizationKey} />;
      case 'prims':
        return <PrimsVisualization key={visualizationKey} />;
      case 'topological-sort':
        return <TopologicalSortVisualization key={visualizationKey} />;
      case 'johnsons':
        return <JohnsonsVisualization key={visualizationKey} />;
      case 'astar':
        return <AStarSearchVisualization key={visualizationKey} />;
      case 'ford-fulkerson':
        return <FordFulkersonVisualization key={visualizationKey} />;
      case 'fibonacci':
        return <FibonacciSequenceVisualization key={visualizationKey} />;
      case 'knapsack':
        return <KnapsackVisualization key={visualizationKey} />;
      case 'lcs':
        return <LCSVisualization key={visualizationKey} />;
      case 'lis':
        return <LISVisualization key={visualizationKey} />;
      case 'matrix-chain-multiplication':
        return <MatrixChainMultiplicationVisualization key={visualizationKey} />;
      case 'edit-distance':
        return <EditDistanceVisualization key={visualizationKey} />;
      case 'coin-change':
        return <CoinChangeVisualization key={visualizationKey} />;
      case 'subset-sum':
        return <SubsetSumVisualization key={visualizationKey} />;
      case 'rod-cutting':
        return <RodCuttingVisualization key={visualizationKey} />;
      case 'shortest-common-supersequence':
        return <ShortestCommonSupersequenceVisualization key={visualizationKey} />;
      case 'strassen-matrix-multiplication':
        return <StrassenMatrixMultiplicationVisualization key={visualizationKey} />;
      case 'closest-pair':
        return <ClosestPairVisualization key={visualizationKey} />;
      case 'karatsuba':
        return <KaratsubaMultiplicationVisualization key={visualizationKey} />;
      case 'fft':
        return <FastFourierTransformVisualization key={visualizationKey} />;
      case 'huffman-coding':
        return <HuffmanCodingVisualization key={visualizationKey} />;
      case 'job-sequencing':
        return <JobSequencingVisualization key={visualizationKey} />;
      case 'fractional-knapsack':
        return <FractionalKnapsackVisualization key={visualizationKey} />;
      case 'activity-selection':
        return <ActivitySelectionVisualization key={visualizationKey} />;
      case 'n-queens':
        return <NQueensVisualization key={visualizationKey} />;
      case 'rat-in-maze':
        return <RatInMazeVisualization key={visualizationKey} />;
      case 'knights-tour':
        return <KnightsTourVisualization key={visualizationKey} />;
      case 'hamiltonian-cycle':
        return <HamiltonianCycleVisualization key={visualizationKey} />;
      case 'sudoku-solver':
        return <SudokuSolverVisualization key={visualizationKey} />;
      case 'naive-pattern-searching':
        return <NaivePatternSearchingVisualization key={visualizationKey} />;
      case 'kmp':
        return <KMPVisualization key={visualizationKey} />;
      case 'rabin-karp':
        return <RabinKarpVisualization key={visualizationKey} />;
      case 'z-algorithm':
        return <ZAlgorithmVisualization key={visualizationKey} />;
      case 'boyer-moore':
        return <BoyerMooreVisualization key={visualizationKey} />;
      case 'inorder-traversal':
        return <InorderTraversalVisualization />;
      case 'preorder-traversal':
        return <PreorderTraversalVisualization />;
      case 'postorder-traversal':
        return <PostorderTraversalVisualization />;
      case 'level-order-traversal':
        return <LevelOrderTraversalVisualization />;
      case 'binary-search-tree':
        return <BinarySearchTreeVisualization />;
      case 'avl-tree':
        return <AVLTreeVisualization />;
      default:
        return (
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Visualization for {algorithm.name} will be available soon!</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!algorithm || !category) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Algorithm not found</h2>
          <p className="mt-2 text-gray-600">The algorithm you are looking for does not exist.</p>
          <Link 
            to="/algorithms" 
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaArrowLeft className="mr-2" /> Back to Algorithms
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        className="py-8 bg-slate-50 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-blue-600">Home</Link>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link to="/algorithms" className="ml-2 text-gray-500 hover:text-blue-600">
                    Algorithms
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link to={`/algorithms#${category.id}`} className="ml-2 text-gray-500 hover:text-blue-600">
                    {category?.name}
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-blue-600 font-medium" aria-current="page">
                    {algorithm?.name}
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to={`/algorithms#${category.id}`} 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaArrowLeft className="mr-2" /> Back to {category?.name}
            </Link>
          </div>

          {/* Algorithm Header */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-8 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {algorithm.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {algorithm.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FaClock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Time Complexity</h3>
                  <ul className="mt-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="font-medium mr-2">Best:</span> {algorithm.timeComplexity.best}
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium mr-2">Average:</span> {algorithm.timeComplexity.average}
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium mr-2">Worst:</span> {algorithm.timeComplexity.worst}
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FaMemory className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Space Complexity</h3>
                  <p className="mt-2 text-gray-600">{algorithm.spaceComplexity}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How Algorithm Works */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-8 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How {algorithm.name} Works</h2>
            <div className="prose max-w-none text-gray-600">
              {/* Render content from algorithm.howItWorks field if available */}
              {algorithm.howItWorks ? (
                renderHtmlContent(algorithm.howItWorks)
              ) : (
                <>
                    <p>This section will provide a detailed explanation of how the {algorithm.name} algorithm works, including its underlying mechanics, step-by-step process, and key insights into why it's effective.</p>
                </>
              )}
            </div>
          </motion.div>

          {/* Algorithm Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Pseudocode */}
            <motion.div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center bg-gray-50 px-6 py-4 border-b">
                <FaCode className="h-5 w-5 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Pseudocode</h2>
              </div>
              <div className="p-6">
                {algorithm && algorithm.pseudocode && Array.isArray(algorithm.pseudocode) ? (
                  <pre className="bg-gray-50 p-4 rounded-md text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
                    {algorithm.pseudocode.join('\n')}
                  </pre>
                ) : (
                  <p className="text-gray-600">Pseudocode will be available soon!</p>
                )}
              </div>
            </motion.div>

            {/* Visualization Steps */}
            <motion.div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center bg-gray-50 px-6 py-4 border-b">
                <FaListOl className="h-5 w-5 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Visualization Steps</h2>
              </div>
              <div className="p-6">
                {algorithm && algorithm.visualizationSteps && Array.isArray(algorithm.visualizationSteps) ? (
                  <ol className="list-decimal list-inside space-y-2">
                    {algorithm.visualizationSteps.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-600">Visualization steps will be available soon!</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Interactive Visualization */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-8 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Visualization</h2>
            <p className="text-gray-600 mb-8">
              Watch how {algorithm.name} works step by step with our interactive visualization.
            </p>
            
            {/* Dynamic visualization rendering */}
            {renderAlgorithmVisualization()}
          </motion.div>

          {/* Related Algorithms */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Algorithms</h2>
            <p className="text-gray-600 mb-6">
              Explore other {category.name.toLowerCase()}.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category && category.algorithms && Array.isArray(category.algorithms) && 
                category.algorithms
                  .filter(algo => algo.id !== algorithm.id)
                  .slice(0, 3)
                  .map(algo => (
                    <Link 
                      key={algo.id}
                      to={`/algorithms/${category.id}/${algo.id}`}
                      className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-1">{algo.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{algo.description}</p>
                    </Link>
                  ))}
              {(!category || !category.algorithms || !Array.isArray(category.algorithms) || category.algorithms.filter(algo => algo.id !== algorithm.id).length === 0) && (
                <p className="text-gray-600 col-span-3 text-center">No related algorithms available.</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AlgorithmDetail; 