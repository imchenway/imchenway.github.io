---
title: 后缀数组与 LCP 的高效构建
date: 2019-11-19
tags: ['#Algorithm', '#String']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 后缀数组简介
后缀数组（Suffix Array）排序字符串的所有后缀。配合 LCP（Longest Common Prefix）数组，可在 O(n log n) 内完成子串查询、重复子串、字典序比较等任务。

# 构建算法
- **倍增算法**：每轮按 2^k 长度排序，复杂度 O(n log n)；
- **SA-IS**：线性算法，复杂但常用库已实现。

```java
class SuffixArray {
    int[] sa, rank, tmp, lcp;
    SuffixArray(String s) {
        int n = s.length();
        sa = new int[n];
        rank = new int[n];
        tmp = new int[n];
        for (int i = 0; i < n; i++) {
            sa[i] = i;
            rank[i] = s.charAt(i);
        }
        for (int k = 1; k < n; k <<= 1) {
            int finalK = k;
            Arrays.sort(sa, (a, b) -> {
                if (rank[a] != rank[b]) return Integer.compare(rank[a], rank[b]);
                int ra = a + finalK < n ? rank[a + finalK] : -1;
                int rb = b + finalK < n ? rank[b + finalK] : -1;
                return Integer.compare(ra, rb);
            });
            tmp[sa[0]] = 0;
            for (int i = 1; i < n; i++) {
                tmp[sa[i]] = tmp[sa[i - 1]] + (compare(sa[i - 1], sa[i], k, n) ? 1 : 0);
            }
            System.arraycopy(tmp, 0, rank, 0, n);
            if (rank[sa[n - 1]] == n - 1) break;
        }
        buildLCP(s);
    }

    private boolean compare(int i, int j, int k, int n) {
        if (rank[i] != rank[j]) return true;
        int ri = i + k < n ? rank[i + k] : -1;
        int rj = j + k < n ? rank[j + k] : -1;
        return ri != rj;
    }

    private void buildLCP(String s) {
        int n = s.length();
        lcp = new int[n - 1];
        int h = 0;
        for (int i = 0; i < n; i++) {
            if (rank[i] == n - 1) { h = 0; continue; }
            int j = sa[rank[i] + 1];
            while (i + h < n && j + h < n && s.charAt(i + h) == s.charAt(j + h)) h++;
            lcp[rank[i]] = h;
            if (h > 0) h--;
        }
    }
}
```

# 应用
- 最长重复子串：`max(lcp)`；
- 子串出现次数：利用 LCP + RMQ；
- 在线匹配：二分 SA + LCP；
- 与后缀自动机互补。 

# 自检清单
- 是否处理排序比较的稳定性与数组越界？
- 是否使用高效排序（如 radix sort）避免 O(n log^2 n)？
- 是否结合 RMQ 计算 LCP 区间？

# 参考资料
- CP-Algorithms Suffix Array：https://cp-algorithms.com/string/suffix-array.html
- Competitive Programming 4 字符串章节
- MIT OCW 字符串算法课程
