---
name: verify-math
description: Verify machine-learning hand calculations by program before writing them into the Markdown content - regression matrices (X, Y, R, inverse, determinant, adjugate, epsilon variant, MAE, MSE), K-NN distances and votes, Perceptron passes, FFBP forward/backward/update in matrix form, ID3 entropy and information gain (log base 10), K-Means iterations, parameter counts - plus KaTeX and SVG validity. Use before adding or changing any number, table value, answer or figure.
---

# verify-math

Nothing is written into `content/` unless a program has confirmed it. Use Python with NumPy for the numbers (run with `python -I` from a scratch folder) and Node + KaTeX for formula checks. Report what was verified and how; report any mismatch instead of adjusting the content to hide it.

## 0. Rounding

- Compute at full precision, then reproduce the chain **at the rounding the notes show** (the reader repeats the steps with rounded intermediates). If the rounded chain and the full-precision result differ in the last shown digit, say so and pick the number of decimals that keeps them equal (ID3 uses 4 decimals for this reason).
- Keep the same rounding as the surrounding steps.

## 1. Regression

```python
import numpy as np
x = np.array([1, 2, 3, 4, 5.]); y = np.array([2, 3, 5, 4, 6.])
X = np.vstack([x, np.ones_like(x)])            # degree 1; degree 2: np.vstack([x**2, x, 1])
A = X @ X.T
print(np.linalg.det(A))                          # det; if 0 use A + eps * I
R = y @ X.T @ np.linalg.inv(A)                   # [a, b]
yhat = R @ X
print(R, np.abs(y - yhat).mean(), ((y - yhat) ** 2).mean())   # MAE, MSE (1/N form)
```

- Check the adjugate by hand formula (2x2: `[[s, -q], [-r, p]]`; 3x3: cofactor matrix transposed) against `inv(A) * det(A)`.
- K-NN regression: `|x_q - x_i|` for 1-D, sort ascending (ties: first in table order), mean of the first k `y`.

## 2. K-NN classification

```python
def euclid(a, b): return np.sqrt(((a - b) ** 2).sum())
def sq(a, b): return ((a - b) ** 2).sum()
def manhattan(a, b): return np.abs(a - b).sum()
def cosine(a, b): return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))   # larger = closer
```

- Sort ascending for distances, descending for cosine. Majority vote of the first k; a tie takes the first neighbour's label.

## 3. Perceptron (vector form)

- Append 1 to every x and b to w; multiply x by -1 when the target is -1.
- Replay passes in table order: a point with `x · w <= 0` is wrong; update `w <- w + x` (or `w <- eta * (w + x)` when the problem gives eta, as the notes do); restart checking from the first point after each update; stop when a full pass has no error. Print every dot product.

## 4. FFBP (matrix form)

```python
s = lambda z: 1 / (1 + np.exp(-z))
X = np.array([[1, 1], [-1, -1.]]); T = np.array([[1], [0.]])
Wh = np.array([[.5, .2], [.3, .4]]); Wo = np.array([[.1, .2]]); eta = .1
Oh = s(X @ Wh.T); o = s(Oh @ Wo.T)
do = o * (1 - o) * (T - o); dh = Oh * (1 - Oh) * (do @ Wo)    # Wo before the update
Wo2 = Wo + eta * do.T @ Oh; Wh2 = Wh + eta * dh.T @ X
```

- Rows of X are examples; rows of W are units. Then replay with the rounded intermediates shown in the notes (`0.67`, `0.55`, `0.11`, ...) and compare.
- Parameter count: `sum(n[l-1] * n[l]) + sum(n[l])` over the layers; check each product and sum.

## 5. ID3

```python
from math import log10
def H(*counts):
    n = sum(counts); return -sum(c / n * log10(c / n) for c in counts if c)
def gain(parent, parts):            # parts: list of (pos, neg)
    n = sum(map(sum, parts)); return H(*parent) - sum(sum(p) / n * H(*p) for p in parts)
```

- Recount every subset from the table (do not trust counts copied from slides).
- Log base 10, 4 decimals; replay with the rounded entropies the notes show.
- The chosen attribute per node is the largest gain; every branch ends in a pure leaf. Check the data-structure table (id, Parent, Node, Branch) against the tree: ids by level, top to bottom, left to right; root parent 0.

## 6. K-Means

```python
X = np.array([[1, 1, 2], [0, 0, 1], [5, 4, 3], [6, 3, 2.]]); C = X[[0, 1]].copy()
prev = None
while True:
    D = np.abs(X[:, None, :] - C[None]).sum(2)    # Manhattan; Euclidean: np.linalg.norm(..., axis=2)
    lab = D.argmin(1)
    if prev is not None and (lab == prev).all(): break
    prev = lab; C = np.array([X[lab == j].mean(0) for j in range(len(C))])
```

- Print every D table, label column and centroid. Stop when the labels do not change. Ties take the first centroid.

## 7. KaTeX, tables and SVG

```js
// node: every formula must compile in strict mode
katex.renderToString(tex, { throwOnError: true, strict: 'error', displayMode });
```

- No blank line inside any `<svg>`: `python -I -c "import re,sys;t=open(sys.argv[1],encoding='utf8').read();print(sum('\n\n' in m for m in re.findall(r'<svg.*?</svg>',t,re.S)))" file.md` must print `0`.
- No control characters in the file other than newlines (catches `\t`/`\f` damage from scripted writes).
- Render every new or changed SVG to PNG (PyMuPDF opens SVG) and look at it.
- Every `<table>` has the same number of cells per row (counting row headers).
