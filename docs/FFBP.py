import numpy as np
import matplotlib.pyplot as plt
# XOR
X = np.array([[0, 0],[0, 1], [1, 0], [1, 1]]) # 4 x 2
Y = np.array([0, 1, 1, 0]) # 4
def sigmoid(x):
    return 1 / (1 + np.exp(-x))
def pad_one(x):
    return np.hstack((x, np.ones((len(x), 1))))
# 2 -> 2 -> 1
# Initialization
lr = 0.2
W0 = np.random.rand(3, 2)
W1 = np.random.rand(3, 1)
for epoch in range(5000):
    # Forward
    input0 = pad_one(X) # 4 x 3
    z0 = input0 @ W0 # 4 x 3 @ 3 x 2
    input1 = sigmoid(z0) # 4 x 2
    input1 = pad_one(input1) # 4 x 3
    z1 = input1 @ W1 # 4 x 3 @ 3 x 1
    output = sigmoid(z1) # 4 x 1
    # Backward
    #output
    e = Y[:, None] - output
    mse = np.mean(e ** 2)
    print(epoch, mse)
    delta = output * (1 - output) * e # 4 x 1
    W1 = W1 + lr * (input1.T @ delta) # 3 x 4 @ 4 x 1 =  3 x 1
    #hidden
    delta = input1 * (1 - input1) * (delta @ W1.T) # 4 x 1 @ 1 x 3  = 4 x 3
    delta = delta[:, :-1] # 4 x 2
    W0 = W0 + lr * (input0.T @ delta) # 3 x 4 @ 4 x 2 = 3 x 2
print(np.round(output))