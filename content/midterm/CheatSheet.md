# Cheat Sheet

โพยสรุปนิยามและสูตรของข้อสอบกลางภาค

---

## 1. นิยามและสูตร

### 1.1 ภาพรวมของ Machine Learning

- **Machine Learning** ให้เครื่องเรียนรู้รูปแบบจากข้อมูล แล้วทำนายหรือจัดกลุ่มข้อมูลใหม่ $\ X\to\boxed{\text{ML}}\to Z$ ($Z$ = ค่าทำนาย)
- **Supervised** เรียนจาก $X$ ที่มีคำตอบ $Y$ (label ที่คนติดไว้) กำกับ เทียบผลทำนายกับ $Y$ เพื่อปรับโมเดล ได้แก่ Classification และ Regression
- **Unsupervised** เรียนจาก $X$ อย่างเดียว ไม่มี $Y$ (ไม่มี class label) ได้แก่ Clustering
- **$X$** = ข้อมูลนำเข้า (attribute, feature) / **$Y$** = คำตอบ (target, label) / **Sample** = 1 ตัวอย่าง หรือ 1 แถวของตาราง
- **Discrete** = ค่าไม่ต่อเนื่อง เช่น Y/N, M/F, Dog/Cat / **Continuous** = ค่าต่อเนื่อง เช่น อายุ น้ำหนัก ส่วนสูง
- **Training set** = ข้อมูลที่รู้ $Y$ ใช้เรียนรู้ / **Test set** = ข้อมูลที่ต้องทำนาย
- **MAE, MSE** = ค่าวัดความต่างระหว่างค่าจริงกับค่าทำนาย (เฉลี่ยค่าสัมบูรณ์ / เฉลี่ยกำลังสอง)
- **Overfitting** = จำข้อมูลสอนได้ดีแต่ทำนายข้อมูลใหม่แย่ / **Generalization** = ทำนายข้อมูลใหม่ได้ดี

$$\text{MAE}=\frac1N\sum_{i=1}^{N}\lvert y_i-\hat y_i\rvert$$

$$\text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2$$

### 1.2 Regression

- **Regression** ทำนาย $Y$ ที่เป็นค่าต่อเนื่อง (Supervised)
- **Linear** หาเส้นตรงที่เข้ากับข้อมูลที่สุด (ผลรวม error กำลังสองน้อยสุด เรียก Least Square)
- **Polynomial** หาเส้นโค้งพหุนามดีกรี $n$: Degree 1 = เส้นตรง, Degree 2 = Parabola (โค้ง 1 ครั้ง), Degree $n$ โค้ง $n-1$ ครั้ง / ดีกรีสูงเกินเสี่ยง Overfitting
- **K-NN Regression** ทำนายด้วยค่าเฉลี่ยของ $y$ จาก $k$ จุดที่ใกล้ที่สุด (ระยะ Manhattan) ไม่ต้อง train
- แถวล่างของ $X$ เป็น 1 เสมอ เรียงกำลังมากไปน้อย

$$y=ax+b\qquad y=ax^2+bx+c\qquad y=a_1x^n+\dots+a_{n+1}$$

$$X=\begin{bmatrix}x_1&\cdots&x_N\\1&\cdots&1\end{bmatrix}_{2\times N}\qquad Y=\begin{bmatrix}y_1&\cdots&y_N\end{bmatrix}_{1\times N}$$

$$R=\begin{bmatrix}a&b\end{bmatrix}_{1\times2}\qquad\text{Degree 2: }X=\begin{bmatrix}x_1^2&\cdots&x_N^2\\x_1&\cdots&x_N\\1&\cdots&1\end{bmatrix}_{3\times N}$$

$$Y=RX\qquad\htmlClass{pen-red}{R=Y\,X^T(XX^T)^{-1}}\qquad\hat y=RX$$

$$\det(XX^T)=0:\quad R=Y\,X^T(XX^T+\varepsilon I)^{-1}$$

$$A^{-1}=\frac{\text{adj}A}{\det A}\qquad2\times2:\ \det A=ps-qr,\ \ \text{adj}A=\begin{bmatrix}s&-q\\-r&p\end{bmatrix}$$

$$3\times3:\quad C_{ij}=(-1)^{i+j}M_{ij},\quad\text{adj}A=C^T$$

$$\det A=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}$$

$$\text{K-NN Regression:}\quad\hat y=\frac1k\sum_{i=1}^{k}y_i\qquad d(x_i,x_j)=\lvert x_i-x_j\rvert$$

### 1.3 Classification และ K-NN

- **Classification** ทำนาย $Y$ ที่เป็นค่าไม่ต่อเนื่อง (class) (Supervised)
- **K-NN** จำแนกข้อมูลใหม่ตาม label ของ $k$ ตัวอย่างที่ใกล้ที่สุด โหวตเสียงข้างมาก เสมอเลือกตัวที่ใกล้ที่สุด / $k=1$ = nearest neighbor / ไม่ต้อง train แต่คำนวณหนัก
- ขั้นตอน: คำนวณระยะจาก query ไปทุกตัว → เรียงน้อยไปมาก (Cosine มากไปน้อย) → เลือก $k$ ตัวแรก → โหวต
- **Euclidean** ระยะเส้นตรง / **Squared Euclidean** ไม่ถอดราก ลำดับเหมือน Euclidean / **Manhattan** ผลรวมผลต่างสัมบูรณ์ เหมือนเดินตามตารางถนน / **Cosine** วัดมุมระหว่างเวกเตอร์ ค่ามาก = ใกล้

$$\htmlClass{pen-blue}{\text{Euclid}}\quad\|\vec x_i-\vec x_j\|_2=\sqrt{\Delta A_1^2+\Delta A_2^2+\Delta A_3^2}$$

$$\htmlClass{pen-blue}{\text{Squared}}\quad\|\vec x_i-\vec x_j\|_2^2=\Delta A_1^2+\Delta A_2^2+\Delta A_3^2$$

$$\htmlClass{pen-blue}{\text{Manhattan}}\quad\|\vec x_i-\vec x_j\|_1=\lvert\Delta A_1\rvert+\lvert\Delta A_2\rvert+\lvert\Delta A_3\rvert$$

$$\htmlClass{pen-blue}{\text{Cosine}}\quad\cos\theta=\frac{\vec x_i\cdot\vec x_j}{\lvert\vec x_i\rvert\lvert\vec x_j\rvert}\qquad\theta=\arccos\frac{\vec x_i\cdot\vec x_j}{\lvert\vec x_i\rvert\lvert\vec x_j\rvert}$$

### 1.4 Perceptron

- **Perceptron** = neuron ตัวเดียว ให้ผลลัพธ์ $+1$ หรือ $-1$ (hard-limit) ใช้จำแนก 2 กลุ่มด้วยเส้นตรง
- **Neuron** รวมอินพุตแบบถ่วงน้ำหนัก (weight) แล้วส่งผ่านฟังก์ชัน activation
- **Hyperplane** = ขอบเขตแบ่งกลุ่มที่ perceptron หาได้ (เส้นตรงใน 2 มิติ)
- **Bias** $b$ = ค่าเลื่อนขอบเขต / **$\eta$** = learning rate ตัวคูณกำหนดขนาดการปรับ weight
- หยุดแน่เมื่อข้อมูลแยกด้วยเส้นตรงได้ (linearly separable) / แก้ XOR ไม่ได้ / $w$ เริ่มต้นตามโจทย์

$$x=\begin{bmatrix}A_1&\cdots&A_n&1\end{bmatrix}\qquad w=\begin{bmatrix}w_1&\cdots&w_n&b\end{bmatrix}$$

$$x\cdot w>0\Rightarrow+1\qquad x\cdot w\le0\Rightarrow-1\qquad x_i\leftarrow y_i\,x_i$$

$$\htmlClass{pen-red}{x_i\cdot w\le0\Rightarrow w\leftarrow w+x_i}\qquad\text{มี }\eta:\ w\leftarrow\eta\,(w+x_i)$$

$$\text{Hyperplane:}\quad w_1A_1+\dots+w_nA_n+b=0$$

### 1.5 FFBP

- **FFBP** ส่งข้อมูลไปข้างหน้า (feed-forward) แล้วส่ง error ย้อนกลับ (backpropagation) เพื่อปรับ weight ให้ output ใกล้ target
- **Hidden layer** = ชั้นระหว่าง input กับ output ("feature ของ feature") ทำให้แก้ปัญหาที่แบ่งด้วยเส้นตรงไม่ได้ เช่น XOR
- **Sigmoid** ต่อเนื่องและหาอนุพันธ์ได้ ให้ผลลัพธ์ 0 ถึง 1 (hard-limit หาอนุพันธ์ไม่ได้)
- **Epoch** = ป้อนข้อมูลสอนครบทุกตัวอย่าง 1 รอบ / อาจติด local optima
- matrix form: $X$ แถวละ 1 ตัวอย่าง, $W$ แถวละ 1 unit, ชั้นถัดไปใช้ $o$ เป็น $X$, ใช้ $W_o$ ก่อนปรับ
- input = จำนวน attribute (หมวดหมู่ $N$ ค่า → $N-1$ ตัว) / output = จำนวน class (2 class ใช้ 1)

$$\sigma(x)=\frac1{1+e^{-x}}\qquad\sigma'(x)=\sigma(x)(1-\sigma(x))$$

$$o=\sigma\Big(\sum wx\Big)=\sigma(XW^T)$$

$$\delta_k=o_k(1-o_k)(t_k-o_k)\qquad\delta_h=o_h(1-o_h)\sum_kw_{kh}\delta_k$$

$$\delta_o=o\odot(1-o)\odot(T-o)\qquad\delta_h=O_h\odot(1-O_h)\odot(\delta_oW_o)$$

$$w'=w+\eta\,\delta\,x\qquad W_o'=W_o+\eta\,\delta_o^T\,O_h\qquad W_h'=W_h+\eta\,\delta_h^T\,X$$

$$\#P=\sum_{l=1}^{L}n_{l-1}n_l\ \ (\text{weight})\ +\ \sum_{l=1}^{L}n_l\ \ (\text{bias})$$

### 1.6 ID3

- **Decision Tree** แบ่งข้อมูลทีละขั้น: node = attribute, กิ่ง = ค่าของ attribute, leaf = class
- **ID3** เลือก attribute ที่ Information Gain มากสุดเป็น node แตกหลายกิ่งตามค่า ไม่ใช้ attribute ซ้ำในเส้นทางเดียวกัน
- **Entropy** = ความไม่บริสุทธิ์ของข้อมูล class เดียว = 0 (leaf) ผสมเท่าๆ กันมากสุด
- **Information Gain** = Entropy ที่ลดลงหลังแบ่งด้วย attribute นั้น
- **Overfitting ของต้นไม้** = ลึกจนจำ noise แก้ด้วย pruning (หยุดสร้างก่อน หรือสร้างเต็มแล้วตัดทิ้ง)
- ตารางต้นไม้: `id` เรียงชั้น บนลงล่าง ซ้ายไปขวา, `Parent` = id ของแม่ (ราก = 0), `Node`, `Branch` (ราก = —)

$$\htmlClass{pen-red}{\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c}$$

$$\text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{\lvert S_v\rvert}{\lvert S\rvert}\text{Entropy}(S_v)$$

### 1.7 Clustering

- **Clustering** แบ่งข้อมูล $X$ เป็นกลุ่มตามความคล้ายกัน ไม่มี label (Unsupervised)
- **K-Means** ผู้ใช้กำหนดจำนวนกลุ่ม $k$ เอง วนทำซ้ำ Assign และ Update จน $\htmlClass{hl}{\text{label ไม่เปลี่ยน}}$ ระยะที่ใช้ Manhattan
- **Centroid** = จุดศูนย์กลางของกลุ่ม (ค่าเฉลี่ยของสมาชิก)
- **Fuzzy C-means** = K-Means ที่จุดหนึ่งอยู่ได้หลายกลุ่ม ด้วยค่า membership ที่รวมกันได้ 1 / K-Means คือ Hard (1 หรือ 0)

$$\htmlClass{pen-blue}{\text{Assign}}\quad\text{label}(x_i)=\arg\min_j d(x_i,c_j)$$

$$d(x_i,c_j)=\sum_m\lvert x_{im}-c_{jm}\rvert$$

$$\htmlClass{pen-blue}{\text{Update}}\quad c_j=\frac1{\lvert C_j\rvert}\sum_{x_i\in C_j}x_i$$

---

## 2. เปรียบเทียบ

### 2.1 Supervised และ Unsupervised

- **Supervised** ใช้ $X$ พร้อมคำตอบ $Y$ (label) เทียบผลทำนายกับ $Y$ ได้ ทำ Classification และ Regression เช่น K-NN, Perceptron, FFBP, ID3, Linear
- **Unsupervised** ใช้ $X$ อย่างเดียว ไม่มี $Y$ ให้เทียบ ทำ Clustering เช่น K-Means

### 2.2 Classification, Regression และ Clustering

- **Classification** Supervised ทำนาย class (Discrete) ตามจำนวน class ใน $Y$ เช่น K-NN, Perceptron, FFBP, ID3
- **Regression** Supervised ทำนายค่าตัวเลข (Continuous) เช่น Linear, Polynomial, K-NN Regression
- **Clustering** Unsupervised แบ่งกลุ่มจาก $X$ ไม่มี label ผู้ใช้กำหนดจำนวนกลุ่ม $k$ เอง ได้กลุ่มและ centroid เช่น K-Means

### 2.3 ระยะของ K-NN

- **Euclidean** วัดระยะเส้นตรง ค่าน้อยคือใกล้กัน / **Squared Euclidean** คือ Euclidean ที่ไม่ถอดราก ค่าน้อยคือใกล้ ลำดับเหมือน Euclidean
- **Manhattan** ผลรวมผลต่างสัมบูรณ์ในแต่ละมิติ ค่าน้อยคือใกล้กัน / **Cosine** วัดมุมระหว่างเวกเตอร์ ค่ามากคือใกล้กัน เรียงมากไปน้อย

### 2.4 Perceptron และ FFBP

- **Perceptron** neuron เดียว ไม่มี hidden layer ใช้ hard-limit ($+1$ หรือ $-1$) ที่หาอนุพันธ์ไม่ได้ แบ่งกลุ่มด้วยเส้นตรงเท่านั้น จึงแก้ XOR ไม่ได้
- **FFBP** มี hidden layer ใช้ sigmoid (0 ถึง 1) ที่หาอนุพันธ์ได้ ส่ง error ย้อนกลับปรับ weight ทุกชั้น แบ่งกลุ่มไม่เป็นเส้นตรงได้ จึงแก้ XOR ได้

### 2.5 K-NN Classifier, K-NN Regressor และ K-Means

- **K-NN Classifier** Supervised โหวตเสียงข้างมากจาก label ของ $k$ เพื่อนบ้านที่ใกล้ที่สุด ได้ class
- **K-NN Regressor** Supervised เฉลี่ยค่า $y$ ของ $k$ เพื่อนบ้านที่ใกล้ที่สุด ได้ค่าตัวเลข
- **K-Means** Unsupervised $k$ คือจำนวนกลุ่มที่ผู้ใช้กำหนดเอง ได้กลุ่มและ centroid

### 2.6 ID3 และ CART

- **ID3** แตกหลายกิ่งตามค่าของ attribute, node คือชื่อ attribute, เลือกด้วย Information Gain, ไม่ใช้ attribute ซ้ำในเส้นทางเดียวกัน
- **CART** แตก 2 กิ่งเสมอ, node คือคำถามใช่/ไม่ใช่ เช่น $G>200$, เลือกด้วย Gini, ใช้ attribute ซ้ำได้
