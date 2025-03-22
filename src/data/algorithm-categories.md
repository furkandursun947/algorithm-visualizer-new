# Algorithm Types and Categories

## Introduction

Algorithms are step-by-step procedures for solving problems or accomplishing tasks. This document categorizes various algorithm types to provide a comprehensive overview of the algorithmic landscape, particularly useful for visualization purposes.

## Table of Contents

- [Sorting Algorithms](#sorting-algorithms)
- [Searching Algorithms](#searching-algorithms)
- [Graph Algorithms](#graph-algorithms)
- [Dynamic Programming](#dynamic-programming)
- [Divide and Conquer](#divide-and-conquer)
- [Greedy Algorithms](#greedy-algorithms)
- [Backtracking](#backtracking)
- [String Algorithms](#string-algorithms)
- [Tree Algorithms](#tree-algorithms)
- [Mathematical Algorithms](#mathematical-algorithms)
- [Computational Geometry](#computational-geometry)
- [Bit Manipulation](#bit-manipulation)
- [Hashing Algorithms](#hashing-algorithms)
- [Randomized Algorithms](#randomized-algorithms)
- [Algorithm Design Paradigms](#algorithm-design-paradigms)
- [Algorithm Complexity](#algorithm-complexity)

## Sorting Algorithms

Algorithms that arrange elements in a specific order (ascending or descending).

- **Bubble Sort**: Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
- **Selection Sort**: Divides the input list into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.
- **Insertion Sort**: Builds the final sorted array one item at a time, similar to sorting playing cards in your hand.
- **Merge Sort**: Divides the array into halves, sorts them recursively, and then merges the sorted halves.
- **Quick Sort**: Selects a 'pivot' element and partitions the array around it, recursively sorting the sub-arrays.
- **Heap Sort**: Uses a binary heap data structure to sort elements.
- **Radix Sort**: Sorts integers by processing individual digits.
- **Counting Sort**: Counts occurrences of each element and reconstructs the sorted array.
- **Bucket Sort**: Distributes elements into buckets and sorts each bucket individually.
- **Shell Sort**: Generalization of insertion sort that allows the exchange of items that are far apart.
- **Tim Sort**: Hybrid sorting algorithm derived from merge sort and insertion sort.

## Searching Algorithms

Algorithms that find the position of a target value within a data structure.

- **Linear Search**: Sequentially checks each element until the target is found or the list ends.
- **Binary Search**: Repeatedly divides a sorted array in half and searches the half that may contain the target.
- **Jump Search**: Jumps ahead by fixed steps and then uses linear search.
- **Interpolation Search**: Improved binary search that uses the value of the target to estimate its position.
- **Exponential Search**: Finds a range where the element might be present and then uses binary search.
- **Fibonacci Search**: Uses Fibonacci numbers to divide the array.
- **Ternary Search**: Divides the array into three parts instead of two.

## Graph Algorithms

Algorithms that operate on graphs, which consist of vertices (nodes) and edges connecting these vertices.

- **Breadth-First Search (BFS)**: Explores all neighbor nodes at the present depth before moving to nodes at the next depth level.
- **Depth-First Search (DFS)**: Explores as far as possible along each branch before backtracking.
- **Dijkstra's Algorithm**: Finds the shortest paths from a source vertex to all other vertices in a weighted graph.
- **Bellman-Ford Algorithm**: Computes shortest paths from a single source vertex to all other vertices, handling negative weight edges.
- **Floyd-Warshall Algorithm**: Finds shortest paths between all pairs of vertices in a weighted graph.
- **Kruskal's Algorithm**: Finds a minimum spanning tree for a connected weighted graph.
- **Prim's Algorithm**: Finds a minimum spanning tree for a connected weighted graph.
- **Topological Sort**: Linear ordering of vertices such that for every directed edge (u, v), vertex u comes before v.
- **Johnson's Algorithm**: Finds all-pairs shortest paths in a sparse, weighted, directed graph.
- **A\* Search Algorithm**: Finds the shortest path from a start node to a goal node using heuristics.
- **Ford-Fulkerson Algorithm**: Computes the maximum flow in a flow network.

## Dynamic Programming

A method for solving complex problems by breaking them down into simpler subproblems and storing the results of overlapping subproblems.

- **Fibonacci Sequence**: Computes Fibonacci numbers efficiently.
- **Longest Common Subsequence**: Finds the longest subsequence common to all sequences in a set.
- **Longest Increasing Subsequence**: Finds a subsequence of a given sequence in which the elements are in sorted order.
- **Matrix Chain Multiplication**: Determines the most efficient way to multiply a given sequence of matrices.
- **Edit Distance**: Calculates the minimum number of operations required to transform one string into another.
- **Knapsack Problem**: Selects items with maximum total value while respecting a weight constraint.
- **Coin Change Problem**: Counts the number of ways to make change using a given set of coins.
- **Rod Cutting Problem**: Maximizes revenue by cutting a rod into pieces of different lengths with different prices.
- **Subset Sum Problem**: Determines if there is a subset with a sum equal to a given target.
- **Shortest Common Supersequence**: Finds the shortest supersequence that contains all sequences as subsequences.

## Divide and Conquer

Algorithms that recursively break down a problem into two or more sub-problems until these become simple enough to solve directly.

- **Binary Search**: Divides a sorted array in half repeatedly to find a target value.
- **Merge Sort**: Divides an array into halves, sorts them, and then merges them.
- **Quick Sort**: Partitions an array around a pivot element and recursively sorts the sub-arrays.
- **Strassen's Matrix Multiplication**: Reduces the complexity of matrix multiplication.
- **Closest Pair of Points**: Finds the closest pair of points in a set of points in the plane.
- **Karatsuba Algorithm**: Fast multiplication algorithm for large integers.
- **Fast Fourier Transform**: Efficiently computes the discrete Fourier transform.

## Greedy Algorithms

Algorithms that make locally optimal choices at each stage with the hope of finding a global optimum.

- **Kruskal's Algorithm**: Finds a minimum spanning tree by adding edges in ascending order of weight.
- **Prim's Algorithm**: Builds a minimum spanning tree by adding the cheapest edge that connects a tree vertex to a non-tree vertex.
- **Dijkstra's Algorithm**: Finds shortest paths by repeatedly selecting the vertex with the minimum distance.
- **Huffman Coding**: Creates optimal prefix codes for data compression.
- **Job Sequencing Problem**: Schedules jobs to maximize profit, where each job has a deadline and profit.
- **Fractional Knapsack Problem**: Maximizes value by taking fractions of items with weight constraints.
- **Activity Selection Problem**: Selects the maximum number of non-overlapping activities.

## Backtracking

Algorithms that build candidates to solutions incrementally and abandon a candidate as soon as it determines that the candidate cannot lead to a valid solution.

- **N-Queens Problem**: Places N queens on an N×N chessboard so that no queen can attack another.
- **Rat in a Maze**: Finds a path from source to destination in a maze.
- **Knight's Tour Problem**: Finds a sequence of moves for a knight to visit every square on a chessboard exactly once.
- **Subset Sum Problem**: Finds a subset of elements that sum to a given target.
- **Hamiltonian Cycle**: Finds a cycle in a graph that visits each vertex exactly once.
- **Graph Coloring**: Assigns colors to vertices such that no adjacent vertices have the same color.
- **Sudoku Solver**: Fills a partially filled 9×9 grid with digits so each column, row, and 3×3 box contains all digits from 1 to 9.

## String Algorithms

Algorithms specifically designed for string processing and manipulation.

- **Naive Pattern Searching**: Checks for pattern occurrences at each position in the text.
- **KMP Algorithm**: Efficiently finds occurrences of a pattern in a text without backtracking.
- **Rabin-Karp Algorithm**: Uses hashing to find pattern occurrences in a text.
- **Z Algorithm**: Finds occurrences of a pattern in a text in linear time.
- **Boyer-Moore Algorithm**: Skips sections of the text when searching for a pattern.
- **Aho-Corasick Algorithm**: Searches for multiple patterns simultaneously.
- **Suffix Array**: Data structure for quick pattern matching in a string.
- **Suffix Tree**: Data structure representing all substrings of a string.
- **Longest Palindromic Substring**: Finds the longest substring that reads the same backward as forward.

## Tree Algorithms

Algorithms that operate on tree data structures, which are hierarchical structures with a root node and child nodes.

- **Binary Tree Traversals**: Methods to visit all nodes in a binary tree:
  - **Inorder Traversal**: Left subtree, root, right subtree
  - **Preorder Traversal**: Root, left subtree, right subtree
  - **Postorder Traversal**: Left subtree, right subtree, root
  - **Level Order Traversal**: Nodes at each level from top to bottom
- **Binary Search Tree Operations**: Insert, delete, search operations on a BST.
- **AVL Tree**: Self-balancing binary search tree with height-balance conditions.
- **Red-Black Tree**: Self-balancing binary search tree with color-based balancing.
- **B-Tree**: Self-balancing tree data structure that maintains sorted data for efficient insertion, deletion, and search.
- **Trie**: Tree data structure used for efficient retrieval of keys in a dataset of strings.
- **Segment Tree**: Tree data structure for interval queries and updates.
- **Fenwick Tree (Binary Indexed Tree)**: Data structure that efficiently updates elements and calculates prefix sums.

## Mathematical Algorithms

Algorithms that implement mathematical formulas and processes.

- **Sieve of Eratosthenes**: Finds all prime numbers up to a specified limit.
- **Euler's Totient Function**: Counts the positive integers up to a given integer that are relatively prime to it.
- **Prime Factorization**: Decomposes a number into its prime factors.
- **Chinese Remainder Theorem**: Solves a system of linear congruences.
- **Modular Exponentiation**: Efficiently computes large powers modulo a number.
- **GCD and LCM**: Calculates the greatest common divisor and least common multiple.
- **Lucas Theorem**: Computes binomial coefficients modulo a prime.
- **Catalan Numbers**: Sequence of natural numbers with various combinatorial interpretations.

## Computational Geometry

Algorithms that solve geometric problems algorithmically.

- **Convex Hull**: Computes the smallest convex set that contains all points in a set.
  - **Graham Scan**: Finds a convex hull by sorting points by polar angle.
  - **Jarvis March**: Computes a convex hull by finding the leftmost point and proceeding counterclockwise.
- **Line Intersection**: Determines if two line segments intersect.
- **Point in Polygon**: Checks if a point is inside a polygon.
- **Closest Pair of Points**: Finds the pair of points with the smallest distance between them.
- **Voronoi Diagrams**: Partitions a plane into regions based on distance to points.
- **Delaunay Triangulation**: Maximizes the minimum angle of all triangles in a triangulation.
- **Sweep Line Algorithm**: Paradigm for solving problems by moving a line across the plane.

## Bit Manipulation

Algorithms that use bitwise operations to perform operations on individual bits of integers.

- **Count Set Bits**: Counts the number of 1s in the binary representation of a number.
- **Power of 2**: Checks if a number is a power of 2.
- **Find Missing Number**: Finds a missing number in a sequence using XOR.
- **Find Duplicate Number**: Identifies a duplicate in an array using bit operations.
- **Bitwise Operations**: Basic operations like AND, OR, XOR, NOT, and their applications.
- **Bit Shifting**: Left and right shift operations and their applications.
- **Brian Kernighan's Algorithm**: Efficiently counts set bits in an integer.

## Hashing Algorithms

Algorithms that convert data of arbitrary size to data of fixed size, used for efficient data lookup.

- **Hash Table**: Data structure that maps keys to values for efficient lookup.
- **Separate Chaining**: Collision resolution technique using linked lists.
- **Open Addressing**: Collision resolution technique that places colliding elements in alternate locations.
  - **Linear Probing**: Searches for the next available slot linearly.
  - **Quadratic Probing**: Uses quadratic function to find the next slot.
  - **Double Hashing**: Uses a second hash function to find the next slot.
- **Cuckoo Hashing**: Uses two hash functions and guarantees constant worst-case lookup time.
- **Consistent Hashing**: Distributes load across multiple servers with minimal reorganization.
- **Bloom Filters**: Space-efficient probabilistic data structure for membership queries.

## Randomized Algorithms

Algorithms that use random numbers to make decisions.

- **Random Sampling**: Selects a random subset from a larger set.
- **Monte Carlo Algorithms**: Algorithms that may produce incorrect results with small probability.
- **Las Vegas Algorithms**: Randomized algorithms that always produce correct results but have varying runtime.
- **Randomized Quicksort**: Variation of quicksort that randomly selects a pivot.
- **Karger's Algorithm**: Finds the minimum cut of a graph through random contractions.
- **Reservoir Sampling**: Selects a random sample of k items from a stream of items.
- **Skip List**: Probabilistic data structure that allows fast search in an ordered sequence.

## Algorithm Design Paradigms

High-level approaches or strategies for designing algorithms.

- **Divide and Conquer**: Breaks a problem into smaller subproblems, solves them, and combines their solutions.
- **Dynamic Programming**: Solves complex problems by breaking them into subproblems and storing their solutions.
- **Greedy Approach**: Makes locally optimal choices at each stage.
- **Backtracking**: Builds solutions incrementally and abandons a candidate as soon as it's invalid.
- **Branch and Bound**: Systematically enumerates candidate solutions by checking against upper and lower bounds.
- **Randomized Algorithms**: Makes random choices during execution.
- **Approximation Algorithms**: Finds approximate solutions to optimization problems.
- **Online Algorithms**: Processes input piece-by-piece without having the entire input available from the start.
- **Parallel Algorithms**: Executes multiple operations simultaneously.
- **Distributed Algorithms**: Runs on multiple machines with their own memory.

## Algorithm Complexity

Categorization of algorithms based on their time and space requirements.

### Time Complexity

- **Constant Time**: O(1) - Execution time doesn't depend on input size.
- **Logarithmic Time**: O(log n) - Execution time grows logarithmically with input size.
- **Linear Time**: O(n) - Execution time grows linearly with input size.
- **Linearithmic Time**: O(n log n) - Common in efficient sorting algorithms.
- **Quadratic Time**: O(n²) - Execution time grows quadratically with input size.
- **Cubic Time**: O(n³) - Execution time grows cubically with input size.
- **Exponential Time**: O(2^n) - Execution time doubles with each addition to the input.
- **Factorial Time**: O(n!) - Execution time grows factorially with input size.

### Space Complexity

- **Constant Space**: O(1) - Memory usage doesn't depend on input size.
- **Logarithmic Space**: O(log n) - Memory usage grows logarithmically with input size.
- **Linear Space**: O(n) - Memory usage grows linearly with input size.
- **Quadratic Space**: O(n²) - Memory usage grows quadratically with input size.

## Visualization Considerations

When visualizing algorithms, consider:

- **State Representation**: How to represent the algorithm's state visually.
- **Transitions**: How to animate changes between states.
- **Speed Control**: Allow users to adjust visualization speed.
- **Step-by-Step Execution**: Enable users to step through the algorithm.
- **Data Structure Visualization**: Show relevant data structures clearly.
- **Algorithm Comparison**: Allow users to compare different algorithms.
- **Metrics Display**: Show time complexity, space complexity, and other performance metrics.
