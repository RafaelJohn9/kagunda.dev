---
title: "Mastering Dynamic Programming: A Comprehensive Guide"
description: "Learn how to solve dynamic programming problems effectively, utilizing various techniques and strategies to optimize your solutions."
pubDate: 2025-12-24
tags: ["algorithms", "dynamic-programming", "python", "optimization", "leetcode"]
category: "tutorials"
featured: true
draft: false
---


> **Table of Contents:**
>
> - [What is Dynamic Programming?](#what-is-dynamic-programming)
> - [Key Characteristics](#key-characteristics)
> - [Top-Down vs Bottom-Up](#top-down-vs-bottom-up)
> - [Basic Patterns](#basic-patterns)
> - [1D DP Problems](#1d-dp-problems)
> - [2D DP Problems](#2d-dp-problems)
> - [Knapsack Variants](#knapsack-variants)
> - [Advanced Concepts](#advanced-concepts)
> - [How to Approach DP](#how-to-approach-dp)

---

## What is Dynamic Programming?

Dynamic Programming (DP) is a **problem-solving strategy**—not just an algorithm. It applies when problems have:

- **Optimal substructure**: Solutions can be built from optimal solutions of subproblems
- **Overlapping subproblems**: The same subproblems are solved repeatedly

**Core Idea**: *Cache expensive computations to avoid redundant work.*

---

## Key Characteristics

DP problems typically feature:

- Recursion recomputing the same subproblems (exponential time)
- Choices to make (take/skip, include/exclude)
- Definable states (e.g., `dp[i][j]` = max value using first `i` items with weight `j`)

---

## Top-Down vs Bottom-Up

| **Top-Down (Memoization)** | **Bottom-Up (Tabulation)** |
|---|---|
| Recursion + cache | Iterative, fills table from base |
| Intuitive (mimics recursion) | No stack overflow risk |
| Example: `@lru_cache` decorator | Example: nested loops |

---

## Basic Patterns

### Fibonacci Sequence

Naive recursion recomputes: `fib(5) = fib(4) + fib(3)`, but `fib(3)` is computed twice.

**Top-Down**:

```python
def fib(n: int) -> int:
    memo = {}
    def helper(x):
        if x in memo:
            return memo[x]
        if x <= 1:
            return x
        memo[x] = helper(x - 1) + helper(x - 2)
        return memo[x]
    return helper(n)
```

**Bottom-Up**:

```python
def fib(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
```

**LeetCode**: [509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)

---

### Climbing Stairs

**Problem**: Climb 1 or 2 steps per move. Count distinct ways to reach the top.

> This **is Fibonacci**! `ways(n) = ways(n-1) + ways(n-2)`

```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
```

**LeetCode**: [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)

---

## 1D DP Problems

### House Robber

**State**: `dp[i]` = max money robbed up to house `i`

**Choice**: Rob or skip?

- Rob: `dp[i-2] + nums[i]`
- Skip: `dp[i-1]`

```python
def rob(nums: List[int]) -> int:
    prev2, prev1 = 0, 0
    for num in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + num)
    return prev1
```

**LeetCode**: [198. House Robber](https://leetcode.com/problems/house-robber/)

---

### Maximum Subarray (Kadane's Algorithm)

**State**: `dp[i]` = max sum **ending at** index `i`

**Transition**: `dp[i] = max(nums[i], dp[i-1] + nums[i])`

```python
def maxSubArray(nums: List[int]) -> int:
    current_sum = max_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum
```

**LeetCode**: [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

---

## 2D DP Problems

### Unique Paths

**State**: `dp[i][j]` = paths to reach cell `(i, j)`

**Transition**: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`

```python
def uniquePaths(m: int, n: int) -> int:
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]
```

**LeetCode**: [62. Unique Paths](https://leetcode.com/problems/unique-paths/)

---

### Longest Common Subsequence

**State**: `dp[i][j]` = LCS length of `text1[:i]` and `text2[:j]`

**Transition**:

- Match: `dp[i][j] = 1 + dp[i-1][j-1]`
- Mismatch: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = 1 + dp[i-1][j-1]
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]
```

**LeetCode**: [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)

---

## Knapsack Variants

### 0/1 Knapsack

**State**: `dp[w]` = max value with weight limit `w`

**Transition**: For each item, either take it or skip it.

```python
def knapsack(weights, values, W):
    dp = [0] * (W + 1)
    for i in range(len(values)):
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[W]
```

**LeetCode**: [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

---

### Coin Change

**State**: `dp[a]` = min coins to make amount `a`

**Transition**: Try each coin, pick minimum.

```python
def coinChange(coins: List[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], 1 + dp[a - coin])
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

**LeetCode**: [322. Coin Change](https://leetcode.com/problems/coin-change/)

---

## Advanced Concepts

### DP with Bitmasking

Track subsets using bitmasks (e.g., TSP, subset problems).

**Example**: [943. Find the Shortest Superstring](https://leetcode.com/problems/find-the-shortest-superstring/)

**State**: `dp[mask][i]` = min length using strings in `mask`, ending with `i`

---

### DP on Trees

**Example**: [337. House Robber III](https://leetcode.com/problems/house-robber-iii/)

Return `(rob_root, skip_root)` for each node.

```python
def rob(root: TreeNode) -> int:
    def dfs(node):
        if not node:
            return (0, 0)
        left_rob, left_skip = dfs(node.left)
        right_rob, right_skip = dfs(node.right)
        
        rob = node.val + left_skip + right_skip
        skip = max(left_rob, left_skip) + max(right_rob, right_skip)
        
        return (rob, skip)
    
    return max(dfs(root))
```

---

### Digit DP

Count numbers ≤ N with specific digit properties.

**States**: `(position, tight_constraint, started, digit_mask)`

```python
from functools import lru_cache

def countSpecialNumbers(n: int) -> int:
    s = str(n)
    @lru_cache(maxsize=None)
    def dp(pos, tight, started, mask):
        if pos == len(s):
            return 1 if started else 0
        limit = int(s[pos]) if tight else 9
        res = 0
        for d in range(0, limit + 1):
            if started and (mask >> d) & 1:
                continue  # digit already used
            new_mask = mask | (1 << d) if (started or d > 0) else mask
            res += dp(pos + 1, tight and (d == limit), started or (d > 0), new_mask)
        return res
    return dp(0, True, False, 0)
```

---

## How to Approach DP

1. **Identify DP**: Look for "max/min", "count ways", "optimal"
2. **Define state**: What does `dp[...]` mean?
3. **Write recurrence**: How to compute from previous states?
4. **Base cases**: When does recursion stop?
5. **Choose approach**: Top-down (memoization) or bottom-up (tabulation)?
6. **Optimize space**: Can you reduce dimensions?

---

## Recommended Learning Path

**Easy**: 70, 509, 198, 53, 62  
**Medium**: 64, 322, 1143, 416, 1137  
**Hard**: 818, 943, 1012, 1420  

> **Pro Tip**: Start with brute force → add memoization → convert to tabulation → optimize space.

---

*Master DP through consistent practice. Every pattern you learn unlocks a dozen problems.*
