---
title: 根号分治（Sqrt Decomposition）在数组与图问题中的应用
date: 2019-01-19
tags: ['#Algorithm', '#DataStructure']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 基础原理
根号分治将问题拆分为块（block），每块大小约为 √n，通过维护块的摘要信息实现接近 O(√n) 的查询与更新。

# 常见场景
- 数组区间查询：求和、最小值、频率统计；
- 离线查询（莫队算法）：排序查询顺序降低复杂度；
- 图问题：√ 分治处理度数区间、块重构。

# 区间求和示例
```java
class SqrtDecomposition {
    private final int[] arr;
    private final int[] blockSum;
    private final int blockSize;

    SqrtDecomposition(int[] nums) {
        this.arr = nums.clone();
        this.blockSize = (int) Math.ceil(Math.sqrt(nums.length));
        this.blockSum = new int[blockSize];
        for (int i = 0; i < nums.length; i++) {
            blockSum[i / blockSize] += nums[i];
        }
    }

    int query(int l, int r) {
        int sum = 0;
        while (l <= r && l % blockSize != 0) sum += arr[l++];
        while (l + blockSize - 1 <= r) {
            sum += blockSum[l / blockSize];
            l += blockSize;
        }
        while (l <= r) sum += arr[l++];
        return sum;
    }

    void update(int index, int value) {
        blockSum[index / blockSize] += (value - arr[index]);
        arr[index] = value;
    }
}
```

# 莫队算法（Mo's Algorithm）
- 将查询按照块排序，移动指针次数减少；
- 每次移动调整当前答案，适合离线区间统计（颜色计数、不同元素个数）；
- 与 Hilbert Order 结合可进一步优化。

# 复杂度分析
- 传统方法：O(n) 或 O(qn)；
- 根号分治：查询/更新约 O(√n)；
- 莫队：O((n + q) √n)。

# 自检清单
- 是否合理选择块大小（√n）？
- 是否处理边界与离散化问题？
- 是否评估莫队算法对在线查询不适用，需要离线？

# 参考资料
- MIT OCW 6.006 Range Queries：https://ocw.mit.edu/.../lecture-16-range-queries-segment-trees/
- CP-Algorithms Sqrt Decomposition：https://cp-algorithms.com/data_structures/sqrt_decomposition.html
- "Competitive Programming 3" Mo's Algorithm 章节
