---
title: FFT 与 NTT：快速多项式与卷积运算
date: 2019-04-26
tags: ['#Algorithm', '#FFT']
categories:
  - Algorithms
---

### 本文目录
<!-- toc -->

# 背景
快速傅里叶变换（FFT）用于 O(n log n) 求解多项式乘法、卷积等问题。Number Theoretic Transform (NTT) 是在模数域实现的变种，避免浮点误差，适合大整数与组合计数。

# Cooley-Tukey FFT 模板
```java
class FFT {
    static void fft(Complex[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; ++i) {
            int bit = n >> 1;
            for (; j >= bit; bit >>= 1) j -= bit;
            j += bit;
            if (i < j) {
                Complex tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
        }
        for (int len = 2; len <= n; len <<= 1) {
            double ang = 2 * Math.PI / len * (invert ? -1 : 1);
            Complex wlen = new Complex(Math.cos(ang), Math.sin(ang));
            for (int i = 0; i < n; i += len) {
                Complex w = new Complex(1, 0);
                for (int j = 0; j < len / 2; ++j) {
                    Complex u = a[i + j];
                    Complex v = a[i + j + len / 2].multiply(w);
                    a[i + j] = u.add(v);
                    a[i + j + len / 2] = u.subtract(v);
                    w = w.multiply(wlen);
                }
            }
        }
        if (invert) {
            for (int i = 0; i < n; ++i) a[i] = a[i].divide(n);
        }
    }
}
```

# 多项式乘法步骤
1. Pad 到 2 的幂次长度；
2. 对两序列执行 FFT；
3. 点乘结果；
4. 执行逆 FFT；
5. 处理四舍五入。

# NTT 要点
- 选择模数 p = k * 2^n + 1，模意义下存在原根；
- 常见模数：998244353 (primitive root 3)；
- NTT 避免浮点误差，适合大整数卷积、组合计数。

# 应用场景
- 大整数乘法、卷积、字符串匹配（FFT + hash）；
- 图算法（卷积计数）、组合数学；
- 图像处理中的快速卷积。

# 自检清单
- 是否处理精度误差（FFT）或模数选择（NTT）？
- 是否对向量长度取最近的 2 次幂？
- 是否在逆变换后进行四舍五入/取模？

# 参考资料
- CP-Algorithms FFT & NTT：https://cp-algorithms.com/algebra/fft.html
- MIT OCW 6.046 FFT 讲义：https://ocw.mit.edu/.../lecture-18-fast-fourier-transform/
- Competitive Programming 4 FFT 章节
