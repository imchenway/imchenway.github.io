---
title: 后缀自动机（Suffix Automaton）原理与实现
date: 2019-07-19
lang: zh-CN
tags: ['#Algorithm', '#Automaton', '#String']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 后缀自动机简介
后缀自动机（SAM）是描述所有后缀集合的最小 DFA，支持在 O(|S|) 时间构建、O(|T|) 时间匹配。可用于子串统计、不同子串数量、最长公共子串等问题。

# 数据结构
- `link`：后缀链接，指向最长合法后缀状态；
- `len`：该状态表示的最长串长度；
- `next`：状态转移映射。

# 构建算法
```java
class SuffixAutomaton {
    static class State {
        int len, link;
        Map<Character, Integer> next = new HashMap<>();
    }
    private final List<State> st = new ArrayList<>();
    private int last;

    SuffixAutomaton(String s) {
        st.add(new State());
        last = 0;
        for (char c : s.toCharArray()) extend(c);
    }

    private void extend(char c) {
        int cur = st.size();
        State state = new State();
        state.len = st.get(last).len + 1;
        st.add(state);

        int p = last;
        while (p >= 0 && !st.get(p).next.containsKey(c)) {
            st.get(p).next.put(c, cur);
            p = st.get(p).link;
        }
        if (p == -1) {
            state.link = 0;
        } else {
            int q = st.get(p).next.get(c);
            if (st.get(p).len + 1 == st.get(q).len) {
                state.link = q;
            } else {
                int clone = st.size();
                State cloned = new State();
                cloned.len = st.get(p).len + 1;
                cloned.next.putAll(st.get(q).next);
                cloned.link = st.get(q).link;
                st.add(cloned);
                while (p >= 0 && st.get(p).next.get(c) == q) {
                    st.get(p).next.put(c, clone);
                    p = st.get(p).link;
                }
                st.get(q).link = cloned.link = clone;
                state.link = clone;
            }
        }
        last = cur;
    }

    boolean contains(String t) {
        int v = 0;
        for (char c : t.toCharArray()) {
            Integer nxt = st.get(v).next.get(c);
            if (nxt == null) return false;
            v = nxt;
        }
        return true;
    }
}
```

# 应用
- **不同子串数量**：`sum(len[v] - len[link[v]])`；
- **最长公共子串**：在 SAM 上匹配另一个串；
- **出现次数统计**：拓扑排序计算 state 的出现次数。

# 自检清单
- 是否在构建完成后通过拓扑顺序传播状态计数？
- 是否使用数组而非 Map 以提升常数（若字符集小）？
- 是否考虑内存占用（O(n)）且清理资源？

# 参考资料
- CP-Algorithms Suffix Automaton：https://cp-algorithms.com/string/suffix-automaton.html
- emaxx.ru SAM 教程
- Competitive Programming 4 字符串章节
