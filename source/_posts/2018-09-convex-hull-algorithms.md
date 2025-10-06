---
title: 凸包算法：Graham Scan 与 Andrew Monotone Chain
date: 2018-09-19
lang: zh-CN
tags: ['#Algorithm', '#ComputationalGeometry']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 凸包问题
给定平面点集，求其凸包（最小凸多边形）。常用算法：Graham Scan、Andrew Monotone Chain、QuickHull。

# Andrew 单调链算法
- 时间复杂度 O(n log n)（排序）；
- 对点按 x、y 排序；
- 分别构建下凸壳与上凸壳。

```java
List<Point> convexHull(List<Point> points) {
    points.sort(Comparator.<Point>comparingInt(p -> p.x).thenComparingInt(p -> p.y));
    if (points.size() <= 1) return points;

    List<Point> lower = new ArrayList<>();
    for (Point p : points) {
        while (lower.size() >= 2 && cross(lower.get(lower.size() - 2), lower.get(lower.size() - 1), p) <= 0) {
            lower.remove(lower.size() - 1);
        }
        lower.add(p);
    }

    List<Point> upper = new ArrayList<>();
    for (int i = points.size() - 1; i >= 0; i--) {
        Point p = points.get(i);
        while (upper.size() >= 2 && cross(upper.get(upper.size() - 2), upper.get(upper.size() - 1), p) <= 0) {
            upper.remove(upper.size() - 1);
        }
        upper.add(p);
    }

    lower.remove(lower.size() - 1);
    upper.remove(upper.size() - 1);
    lower.addAll(upper);
    return lower;
}

long cross(Point a, Point b, Point c) {
    return (long)(b.x - a.x) * (c.y - a.y) - (long)(b.y - a.y) * (c.x - a.x);
}
```

# Graham Scan
- 选取最低点作为起点，按极角排序；
- 使用栈维护凸壳，遇到非左转点弹栈。

# 工程要点
- 处理重复点与共线；
- 使用 long 避免溢出；
- 对精度要求高的场景使用 BigDecimal 或预处理坐标。

# 自检清单
- 是否正确处理共线点？
- 是否确保点集数量足够（n >= 3）？
- 是否测试边界情况（所有点共线、重复点）？

# 参考资料
- MIT OCW 6.851 Geometric Algorithms：https://ocw.mit.edu/.../lecture-3-convex-hull-problem/
- Computational Geometry (de Berg) Chapter 1
- CP-Algorithms Convex Hull：https://cp-algorithms.com/geometry/convex_hull.html
