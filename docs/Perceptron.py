import numpy as np
import matplotlib.pyplot as plt

X = np.array([[1, 1, 0],[2, 3, 1], [3, 2, 2], [-8, -5, 3], [-7, -6, 1]])
Y = np.array([1, 1, 1, -1, -1])
W = np.array([-1.,0., 1., 1.])
X_ = Y[:, None] * np.hstack((X, np.ones((len(X), 1))))

while True:
    n = 0
    for x in X_:
        if np.dot(W, x) > 0:
            n += 1
        else:
            W = 0.2*(W+x)
            print(W, n)
            break
    if n == len(X):
        print(W, n)
        break
