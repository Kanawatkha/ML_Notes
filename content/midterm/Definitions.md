# Definitions

**นิยาม (Definitions)** รวบรวมความหมายของทุกหัวข้อในขอบเขตสอบกลางภาคแบบกระชับ เรียงตามหัวข้อ ส่วนที่ 1 อธิบายนิยามทีละเรื่อง ส่วนที่ 2 เปรียบเทียบเรื่องที่มักถูกถามให้แยกให้ออก

---

## 1. นิยาม

### 1.1 ภาพรวมของ Machine Learning

**Machine Learning (การเรียนรู้ของเครื่อง)** คือการให้เครื่องเรียนรู้รูปแบบจากข้อมูล แล้วนำไปทำนายหรือจัดกลุ่มข้อมูลใหม่ เขียนเป็นกล่องที่รับข้อมูล $X$ แล้วให้ผลลัพธ์ $Z$

**ข้อมูล** แต่ละแถวของตารางคือ 1 ตัวอย่าง (sample, observation)

- $X$ = ค่า attribute (feature) ของตัวอย่าง
- $Y$ = ค่าที่เราต้องการ เรียกว่า target หรือ label (ป้ายกำกับ)

**Supervised Learning (การเรียนรู้แบบมีผู้สอน)** คือการเรียนรู้จากข้อมูลที่มีทั้ง $X$ และ $Y$

- $Y$ คือ label ที่ติดไว้ให้แล้วโดยคน (labeling)
- โมเดลนำผลทำนาย $Z$ (หรือ $\hat y$) ไปเทียบกับ $Y$ จริง ความต่างที่วัดได้คือ loss (เช่น MAE, MSE) แล้วปรับโมเดลให้ $Z$ ใกล้ $Y$ (K-NN ไม่มีการปรับโมเดล ใช้ $Y$ ของตัวอย่างที่ใกล้ที่สุดโดยตรง)
- แบ่งเป็น 2 งาน คือ Classification และ Regression (K-NN ใช้ได้ทั้งสองงาน)

**Unsupervised Learning (การเรียนรู้แบบไม่มีผู้สอน)** คือการเรียนรู้จากข้อมูลที่มีแค่ $X$ ไม่ใช้ $Y$ (ไม่มี class label)

- ไม่มี $Y$ ให้เทียบ จึงไม่มี loss แบบ supervised
- งานหลักคือ Clustering (เช่น K-Means)

**ค่า Discrete และ Continuous** ใช้บอกชนิดของ $Y$

- **Discrete (ไม่ต่อเนื่อง)** คือค่าที่เป็นหมวดหรือนับได้ เช่น Y/N, M/F, Dog/Cat, 1, 2, 3, 4
- **Continuous (ต่อเนื่อง)** คือค่าตัวเลขที่ละเอียดได้เรื่อยๆ เช่น อายุ น้ำหนัก ส่วนสูง

**Training set และ Test set**

- **Training set** คือข้อมูลที่รู้ $Y$ แล้ว ใช้เรียนรู้ (ในโจทย์ K-NN คือแถวที่มี Target)
- **Test set** คือข้อมูลที่ต้องทำนาย (แถวที่ Target เป็น ?)

**Error metric (MAE, MSE)** คือค่าวัดความต่างระหว่างค่าจริง $y_i$ กับค่าทำนาย $\hat y_i$

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|,\qquad \text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2$$

**Generalization และ Overfitting**

- **Generalization** คือความสามารถในการทำนายข้อมูลใหม่ที่ไม่เคยเห็น
- **Overfitting** คือโมเดลจำข้อมูลที่ใช้เรียนรู้ได้ดีมาก (เช่น เส้นโค้งผ่านทุกจุด) แต่ทำนายข้อมูลใหม่ได้แย่ลง ตัวอย่าง วัด 10 จุด พหุนามดีกรี 9 ผ่านครบทุกจุด แต่เส้นตรงที่ไม่ผ่านทุกจุดมักทำนายข้อมูลใหม่ได้ดีกว่า

### 1.2 Regression

**Regression (การถดถอย)** คือการทำนายค่า $Y$ ที่เป็นค่าต่อเนื่อง (Continuous) จากข้อมูล $X$ เป็นงาน supervised

**Linear Regression (การถดถอยเชิงเส้น)** คือการหาเส้นตรง $y=ax+b$ ที่เข้ากับข้อมูลที่สุด

- $a$ คือความชัน และ $b$ คือจุดตัดแกน $y$
- เส้นที่ดีที่สุด (optimum line) คือเส้นที่ผลรวมของ error กำลังสองน้อยที่สุด วิธีนี้เรียก Least Square
- หาด้วยเมทริกซ์ $R=Y\,X^T(XX^T)^{-1}$ โดยแถวล่างของ $X$ เป็น 1 เสมอ (เพื่อรวม $b$ เข้าเมทริกซ์)
- ถ้า $XX^T$ หา inverse ไม่ได้ ($\det=0$) ใช้ $R=Y\,X^T(XX^T+\varepsilon I)^{-1}$ โดย $\varepsilon$ เป็นค่าเล็กๆ

**Nonlinear Regression (Polynomial)** คือการหาพหุนามดีกรี $n$ แทนเส้นตรง ใช้สูตรเมทริกซ์เดียวกัน เพียงเพิ่มแถว $x^n,\dots,x^2,x$ ลงใน $X$

<table align="center">
  <tr><th>Degree</th><th>เรียกว่า</th><th>รูปร่าง</th></tr>
  <tr><td align="center">1</td><td align="center">Linear</td><td align="center">เส้นตรง</td></tr>
  <tr><td align="center">2</td><td align="center">Parabola</td><td align="center">โค้ง 1 ครั้ง</td></tr>
  <tr><td align="center">3</td><td align="center">Polynomial</td><td align="center">โค้ง 2 ครั้ง</td></tr>
  <tr><td align="center">n</td><td align="center">Polynomial</td><td align="center">โค้ง n − 1 ครั้ง</td></tr>
</table>

**K-NN Regression** คือการทำนาย $y$ ของข้อมูลใหม่ด้วยค่าเฉลี่ย (aggregation) ของ $y$ จาก $k$ จุดที่ใกล้ที่สุด ไม่มีสมการและไม่ต้องเรียนรู้ล่วงหน้า

### 1.3 Classification และ K-NN

**Classification (การจำแนกประเภท)** คือการทำนายค่า $Y$ ที่เป็นค่าไม่ต่อเนื่อง (Discrete) จากข้อมูล $X$ เป็นงาน supervised

**K-NN (k-Nearest Neighbors)** คือวิธีจำแนกข้อมูลใหม่ตาม label ของ $k$ ตัวอย่างที่ใกล้ที่สุด

- โหวตเสียงข้างมากของ $k$ ตัว ถ้าเสมอกันเลือกตัวที่ใกล้ที่สุด
- $k=1$ เรียกว่า nearest neighbor
- ข้อดี แม่นยำ ไม่ไวต่อ outlier ไม่ต้อง train และไม่ต้องสมมติรูปแบบข้อมูล ข้อเสีย คำนวณหนักและใช้หน่วยความจำมาก

**Distance และ Norm** ระยะระหว่างจุดคือความยาวของเวกเตอร์ผลต่าง ส่วน norm คือการนิยามความยาวเวกเตอร์ให้ใช้ได้กับทุกมิติ

- **Euclidean ($l_2$-norm)** คือความยาวเส้นตรงระหว่างสองจุด $\sqrt{\sum_m(x_{im}-x_{jm})^2}$
- **Squared Euclidean** คือ Euclidean ที่ไม่ถอดราก $\sum_m(x_{im}-x_{jm})^2$ ลำดับใกล้-ไกลไม่เปลี่ยน
- **Manhattan ($l_1$-norm, city block, taxicab)** คือผลรวมของผลต่างสัมบูรณ์ $\sum_m|x_{im}-x_{jm}|$ เหมือนเดินตามตารางถนน
- **Cosine** วัดมุมระหว่างเวกเตอร์ $\cos\theta=\dfrac{\vec x_i\cdot\vec x_j}{|\vec x_i||\vec x_j|}$ ค่ามากคือใกล้กัน
- **$l_p$-norm** คือรูปทั่วไป $\left(\sum|a_i|^p\right)^{1/p}$ ($p=1$ ได้ Manhattan, $p=2$ ได้ Euclidean, $p\to\infty$ ได้ $l_\infty$ หรือ Chebyshev คือผลต่างที่มากที่สุดในแต่ละมิติ)
- **Mahalanobis** ปรับตำแหน่งและสเกลของข้อมูลก่อนวัดระยะ ($z=\dfrac{x-\mu}{\sigma}$) โดยใช้ covariance matrix $\Sigma$ ของข้อมูล $\sqrt{(\vec x-\vec\mu)\,\Sigma^{-1}(\vec x-\vec\mu)^T}$

### 1.4 Perceptron

**Artificial Neural Network (ANN)** คือโมเดลที่ได้แรงบันดาลใจจากระบบประสาท ประกอบด้วยหน่วยคำนวณ (neuron) ที่ต่อกันด้วยค่าน้ำหนัก (weight)

**Neuron** รวมอินพุตแบบถ่วงน้ำหนักแล้วส่งผ่านฟังก์ชัน activation

$$\text{net}=\sum_i w_ix_i+b,\qquad o=f(\text{net})$$

**Perceptron** คือ neuron ตัวเดียวที่ใช้ activation แบบ hard-limit (ผลลัพธ์เป็น $+1$ หรือ $-1$) ใช้จำแนก 2 กลุ่ม

- เรียนรู้โดยวนตรวจทุกจุด ถ้าจุดไหนผิด ($x_i\cdot w\le0$ เมื่อ $x_i=t_i\,x$ คือคูณ target $\pm1$ เข้าไปแล้ว) ให้ปรับ $w\leftarrow w+x_i$ จนไม่มีจุดผิด
- ถ้าโจทย์ให้ learning rate $\eta$ ใช้ $w\leftarrow\eta\,(w+x_i)$
- รับประกันว่าหยุด เมื่อข้อมูลแยกด้วยเส้นตรงได้ (linearly separable) และ $\eta$ เล็กพอ ถ้าแยกด้วยเส้นตรงไม่ได้ จะไม่หยุด

**Hyperplane (ระนาบแบ่งกลุ่ม)** คือขอบเขตแบ่งกลุ่มที่ perceptron ได้ $w_1A_1+\dots+w_nA_n+b=0$ ใน 2 มิติเป็นเส้นตรง ใน $n$ มิติเป็น hyperplane

**Bias ($b$)** คือค่าเลื่อนขอบเขตแบ่งกลุ่ม ใส่เลข 1 ต่อท้าย $x$ และ $b$ ต่อท้าย $w$ เพื่อคำนวณรวมกัน

**Learning rate ($\eta$)** คือตัวคูณที่กำหนดว่าปรับ weight ครั้งละมากน้อยเพียงใด

**ข้อจำกัด** Perceptron แก้ปัญหาที่ข้อมูลแบ่งด้วยเส้นตรงเส้นเดียวไม่ได้ (non-linearly separable) เช่น XOR

### 1.5 FFBP

**Multi-layer Network** คือโครงข่ายที่เพิ่ม hidden layer คั่นระหว่าง input กับ output

- hidden layer คือ "feature ของ feature" เพราะสร้างลักษณะใหม่จาก input ให้ output ใช้
- ทำให้แก้ปัญหาที่แบ่งด้วยเส้นตรงไม่ได้ เช่น XOR ได้

**Sigmoid** คือ activation ที่ใช้ใน FFBP

$$\sigma(x)=\frac1{1+e^{-x}},\qquad \sigma'(x)=\sigma(x)\,(1-\sigma(x))$$

- ผลลัพธ์อยู่ระหว่าง 0 ถึง 1 เป็นเส้นโค้งต่อเนื่อง และหาอนุพันธ์ได้ จึงใช้แทน hard-limit ที่หาอนุพันธ์ไม่ได้
- อนุพันธ์คำนวณง่ายจากค่า $\sigma$ เอง

**Feed-forward** คือการส่งข้อมูลทางเดียวจาก input ผ่าน hidden ไป output เพื่อคำนวณผลลัพธ์

**Backpropagation** คือการเรียนรู้ weight ของโครงข่ายหลายชั้น โดยใช้ gradient descent ลด error ระหว่าง output กับ target

- ส่ง error ย้อนกลับจาก output ไป hidden แล้วปรับ weight ทุกชั้น $w'=w+\eta\,\delta\,x$
- $\delta_k=o_k(1-o_k)(t_k-o_k)$ สำหรับ output และ $\delta_h=o_h(1-o_h)\sum_k w_{kh}\delta_k$ สำหรับ hidden
- ไม่รับประกันว่าจะได้ค่าที่ดีที่สุดทั้งระบบ (อาจติด local optima)

**FFBP** คือ Feed-Forward Backpropagation ทำ forward แล้ว backward แล้วปรับ weight เป็น 1 รอบ

**Epoch** คือการป้อนข้อมูลสอนครบทุกตัวอย่าง 1 รอบ

**จำนวนพารามิเตอร์** ของโครงข่าย $n_0-n_1-\dots-n_L$ คือ weight ($\sum n_{l-1}n_l$) บวก bias ($\sum n_l$)

**ขนาด input และ output** ของโครงข่ายจากตาราง

- input = จำนวน attribute โดย attribute หมวดหมู่ที่มี $N$ ค่าแปลงเป็น $N-1$ ตัว (one-hot ลด 1 ตัว)
- output = จำนวน class (target 2 ค่าใช้ 1 ตัว)

### 1.6 ID3

**Decision Tree (ต้นไม้ตัดสินใจ)** คือโครงสร้างต้นไม้ที่แบ่งข้อมูลทีละขั้น (divide and conquer)

- **Node** คือการทดสอบค่า attribute
- **Branch** คือค่าของ attribute (ใน ID3 1 กิ่งต่อ 1 ค่า)
- **Leaf** คือ class ที่ได้
- แปลงเป็นกฎ IF-THEN ได้ และใช้ได้ทั้ง classification และ regression

**ID3 (Iterative Dichotomiser 3)** คืออัลกอริทึมสร้าง decision tree โดยเลือก attribute ที่มี Information Gain มากที่สุดเป็น node

- ต้นไม้ 1 node แตกได้หลายกิ่งตามค่าของ attribute (n-ary tree)
- แบ่งต่อจนข้อมูลในกิ่งเป็น class เดียว (leaf) หรือ attribute หมด (ใช้ class ที่พบมากสุด) ถ้ากิ่งไหนไม่มีข้อมูลเลย ใช้ class ที่พบมากสุดของ node แม่
- attribute ที่ใช้แล้วในเส้นทางเดียวกัน ไม่ใช้ซ้ำ

**Entropy** คือค่าความไม่บริสุทธิ์ (impurity, disorder) ของข้อมูลชุดหนึ่ง

$$\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c$$

- ข้อมูลเป็น class เดียวทั้งหมด Entropy เท่ากับ 0
- ผสมกันเท่าๆ กัน Entropy มากที่สุด (2 class: log ฐาน 10 ได้ 0.3010, log ฐาน 2 ได้ 1) เปลี่ยนฐาน log แล้วค่าเปลี่ยนเป็นสัดส่วนเดียวกัน ลำดับของ Gain จึงไม่เปลี่ยน ให้ใช้ฐานตามที่โจทย์กำหนด

**Information Gain** คือค่า Entropy ที่ลดลงจากการแบ่งข้อมูลด้วย attribute นั้น (ค่ามากคือแบ่งแล้วบริสุทธิ์ขึ้นมาก)

$$\text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)$$

**Pure node** คือ node ที่ข้อมูลเป็น class เดียว (Entropy = 0) จึงเป็น leaf

**โครงสร้างข้อมูลของต้นไม้** เก็บเป็นตาราง id, Parent, Node, Branch โดย 1 แถวต่อ 1 node

**Overfitting ของต้นไม้** คือต้นไม้ที่ลึกและละเอียดจนจำ noise ของข้อมูลสอน แก้ด้วย pruning

- **Pre-pruning** คือหยุดสร้างต้นไม้ก่อนเมื่อข้อมูลไม่พอให้ตัดสินใจ
- **Post-pruning** คือสร้างต้นไม้เต็มแล้วตัด node ที่หลักฐานไม่พอทิ้ง

### 1.7 Clustering

**Clustering (การจัดกลุ่ม)** คือการแบ่งข้อมูล $X$ เป็นกลุ่ม (cluster) ตามความคล้ายกัน โดยไม่มี label $Y$ เป็นงาน unsupervised

**K-Means** คือวิธีจัดกลุ่มโดยกำหนดจำนวนกลุ่ม $k$ แล้วหาจุดศูนย์กลาง (centroid) ของแต่ละกลุ่ม

- $k$ เป็นค่าที่ผู้ใช้กำหนดเอง (config) ไม่ได้มาจากข้อมูล
- เริ่มจาก centroid ที่สุ่มหรือกำหนดไว้ แล้วทำซ้ำ 2 ขั้น คือ Assign (ให้ label ตาม centroid ที่ใกล้ที่สุด) และ Update (centroid ใหม่ = ค่าเฉลี่ยของสมาชิกกลุ่ม)
- หยุดเมื่อ label ไม่เปลี่ยน (เท่ากับ centroid ไม่เปลี่ยน) ระยะที่ใช้ในวิชานี้คือ Manhattan

**Centroid** คือจุดศูนย์กลางของกลุ่ม คำนวณจากค่าเฉลี่ยของสมาชิกในกลุ่ม

**Fuzzy C-means** คล้าย K-Means แต่ให้จุดหนึ่งเป็นสมาชิกได้หลายกลุ่มพร้อมกัน ด้วยค่า membership ที่รวมกันได้ 1 (ค่า fuzziness $m$ ประมาณ 2)

---

## 2. เปรียบเทียบ

### 2.1 Supervised และ Unsupervised

<table align="center">
  <tr><th></th><th>Supervised</th><th>Unsupervised</th></tr>
  <tr><th>ข้อมูลที่ใช้</th><td align="center">$X$ และ $Y$</td><td align="center">$X$ อย่างเดียว</td></tr>
  <tr><th>label</th><td align="center">มี ($Y$)</td><td align="center">ไม่มี</td></tr>
  <tr><th>loss เทียบกับ $Y$</th><td align="center">ทำได้ (MAE, MSE)</td><td align="center">ทำไม่ได้</td></tr>
  <tr><th>งานหลัก</th><td align="center">Classification, Regression</td><td align="center">Clustering</td></tr>
  <tr><th>ตัวอย่างวิธี</th><td align="center">K-NN, Perceptron, FFBP, ID3, Linear</td><td align="center">K-Means</td></tr>
</table>

### 2.2 Classification และ Regression

<table align="center">
  <tr><th></th><th>Classification</th><th>Regression</th></tr>
  <tr><th>ชนิดของ $Y$</th><td align="center">Discrete</td><td align="center">Continuous</td></tr>
  <tr><th>ตัวอย่าง $Y$</th><td align="center">Y/N, M/F, Dog/Cat</td><td align="center">อายุ น้ำหนัก ส่วนสูง</td></tr>
  <tr><th>ผลลัพธ์</th><td align="center">class (ป้ายกำกับ)</td><td align="center">ค่าตัวเลข</td></tr>
  <tr><th>วิธีในวิชานี้</th><td align="center">K-NN, Perceptron, FFBP, ID3</td><td align="center">Linear, Polynomial, K-NN Regression</td></tr>
</table>

### 2.3 Classification และ Clustering

<table align="center">
  <tr><th></th><th>Classification</th><th>Clustering</th></tr>
  <tr><th>ประเภทการเรียนรู้</th><td align="center">Supervised</td><td align="center">Unsupervised</td></tr>
  <tr><th>กลุ่มที่ได้</th><td align="center">class ที่กำหนดด้วย label $Y$ ไว้ก่อน</td><td align="center">กลุ่มที่พบจากความคล้ายกันของ $X$</td></tr>
  <tr><th>จำนวนกลุ่ม</th><td align="center">เท่ากับจำนวน class ใน $Y$</td><td align="center">กำหนดเอง ($k$)</td></tr>
  <tr><th>ผลลัพธ์</th><td align="center">class ของข้อมูลใหม่</td><td align="center">กลุ่มและ centroid</td></tr>
</table>

### 2.4 Linear และ Polynomial Regression

<table align="center">
  <tr><th></th><th>Linear</th><th>Polynomial (Degree n)</th></tr>
  <tr><th>สมการ</th><td align="center">$y=ax+b$</td><td align="center">$y=a_1x^n+\dots+a_{n+1}$</td></tr>
  <tr><th>รูปร่าง</th><td align="center">เส้นตรง</td><td align="center">เส้นโค้ง (โค้ง n − 1 ครั้ง)</td></tr>
  <tr><th>จำนวนสัมประสิทธิ์</th><td align="center">2</td><td align="center">$n+1$</td></tr>
  <tr><th>แถวของ $X$</th><td align="center">2 แถว ($x$, 1)</td><td align="center">$n+1$ แถว ($x^n,\dots,x$, 1)</td></tr>
  <tr><th>สูตรหา $R$</th><td align="center">$R=Y\,X^T(XX^T)^{-1}$</td><td align="center">สูตรเดียวกัน</td></tr>
  <tr><th>ข้อควรระวัง</th><td align="center">เส้นตรงอาจไม่พอกับข้อมูลโค้ง</td><td align="center">Degree สูงเกินเสี่ยง overfitting</td></tr>
</table>

### 2.5 K-NN Classifier และ K-NN Regressor

<table align="center">
  <tr><th></th><th>K-NN Classifier</th><th>K-NN Regressor</th></tr>
  <tr><th>ชนิดของ $Y$</th><td align="center">Discrete (label)</td><td align="center">Continuous (ตัวเลข)</td></tr>
  <tr><th>รวมผลจาก $k$ ตัว</th><td align="center">โหวตเสียงข้างมาก</td><td align="center">เฉลี่ยค่า $y$ (aggregation)</td></tr>
  <tr><th>กรณีเสมอ</th><td align="center">เลือกตัวที่ใกล้ที่สุด</td><td align="center">ไม่มี (ค่าเฉลี่ยมีค่าเดียว)</td></tr>
  <tr><th>ผลลัพธ์</th><td align="center">class</td><td align="center">ค่าตัวเลข</td></tr>
</table>

### 2.6 ระยะแบบต่างๆ ของ K-NN

<table align="center">
  <tr><th></th><th>Euclidean</th><th>Squared Euclidean</th><th>Manhattan</th><th>Cosine</th></tr>
  <tr><th>วัดอะไร</th><td align="center">ระยะเส้นตรง</td><td align="center">กำลังสองของระยะเส้นตรง</td><td align="center">ผลรวมผลต่างสัมบูรณ์</td><td align="center">มุมระหว่างเวกเตอร์</td></tr>
  <tr><th>norm</th><td align="center">$l_2$</td><td align="center">$l_2$ ยกกำลังสอง</td><td align="center">$l_1$</td><td align="center">ไม่ใช่ norm</td></tr>
  <tr><th>ใกล้กันคือ</th><td align="center">ค่าน้อย</td><td align="center">ค่าน้อย</td><td align="center">ค่าน้อย</td><td align="center">ค่ามาก</td></tr>
  <tr><th>เรียงลำดับ</th><td align="center">น้อยไปมาก</td><td align="center">น้อยไปมาก</td><td align="center">น้อยไปมาก</td><td align="center">มากไปน้อย</td></tr>
  <tr><th>ถอดราก</th><td align="center">มี</td><td align="center">ไม่มี (ลำดับเหมือน Euclidean)</td><td align="center">ไม่มี</td><td align="center">มี (ในตัวส่วน)</td></tr>
</table>

### 2.7 MAE และ MSE

<table align="center">
  <tr><th></th><th>MAE</th><th>MSE</th></tr>
  <tr><th>สูตร</th><td align="center">$\frac1N\sum\lvert y_i-\hat y_i\rvert$</td><td align="center">$\frac1N\sum(y_i-\hat y_i)^2$</td></tr>
  <tr><th>ที่มา</th><td align="center">สอดคล้องกับ $l_1$-norm</td><td align="center">สอดคล้องกับ $l_2$-norm</td></tr>
  <tr><th>ผล error ใหญ่</th><td align="center">นับตามขนาดจริง</td><td align="center">ถูกยกกำลังสอง ทำให้ error ใหญ่มีน้ำหนักมาก</td></tr>
</table>

### 2.8 Perceptron และ FFBP

<table align="center">
  <tr><th></th><th>Perceptron</th><th>FFBP (Multi-layer)</th></tr>
  <tr><th>ชั้น</th><td align="center">neuron เดียว ไม่มี hidden</td><td align="center">มี hidden layer ตั้งแต่ 1 ชั้นขึ้นไป</td></tr>
  <tr><th>activation</th><td align="center">hard-limit ($+1$ หรือ $-1$)</td><td align="center">sigmoid</td></tr>
  <tr><th>การปรับ weight</th><td align="center">ปรับเมื่อจุดผิด $w\leftarrow w+x_i$ (หรือ $\eta(w+x_i)$)</td><td align="center">ส่ง error ย้อนกลับ ปรับ weight ทุกชั้น</td></tr>
  <tr><th>เส้นแบ่งกลุ่ม</th><td align="center">เส้นตรง (hyperplane)</td><td align="center">ไม่เป็นเส้นตรงได้</td></tr>
  <tr><th>XOR</th><td align="center">แก้ไม่ได้</td><td align="center">แก้ได้</td></tr>
  <tr><th>รูปแบบข้อมูลในวิชานี้</th><td align="center">Vector form ($x$ ต่อท้ายด้วย 1)</td><td align="center">Matrix form ($X$ แถวละ 1 ตัวอย่าง)</td></tr>
</table>

### 2.9 Hard-limit และ Sigmoid

<table align="center">
  <tr><th></th><th>Hard-limit</th><th>Sigmoid</th></tr>
  <tr><th>ผลลัพธ์</th><td align="center">$+1$ หรือ $-1$</td><td align="center">ค่าต่อเนื่อง 0 ถึง 1</td></tr>
  <tr><th>ความต่อเนื่อง</th><td align="center">ขาดที่ศูนย์ หาอนุพันธ์ไม่ได้</td><td align="center">ต่อเนื่อง หาอนุพันธ์ได้</td></tr>
  <tr><th>อนุพันธ์</th><td align="center">ใช้ไม่ได้</td><td align="center">$\sigma(1-\sigma)$</td></tr>
  <tr><th>ใช้ใน</th><td align="center">Perceptron</td><td align="center">FFBP</td></tr>
</table>

### 2.10 K-NN และ K-Means

<table align="center">
  <tr><th></th><th>K-NN (Classifier)</th><th>K-Means</th></tr>
  <tr><th>ประเภท</th><td align="center">Supervised</td><td align="center">Unsupervised</td></tr>
  <tr><th>ความหมายของ $k$</th><td align="center">จำนวนเพื่อนบ้านที่ใช้ตัดสิน</td><td align="center">จำนวนกลุ่ม</td></tr>
  <tr><th>ข้อมูลที่ต้องมี</th><td align="center">training set ที่มี $Y$</td><td align="center">$X$ อย่างเดียว</td></tr>
  <tr><th>การเรียนรู้ล่วงหน้า</th><td align="center">ไม่ต้อง (เทียบกับข้อมูลทุกตัวตอนทำนาย)</td><td align="center">ทำซ้ำ Assign และ Update จน label ไม่เปลี่ยน</td></tr>
  <tr><th>ผลลัพธ์</th><td align="center">label ของข้อมูลใหม่</td><td align="center">label ของกลุ่มและ centroid</td></tr>
  <tr><th>ที่เหมือนกัน</th><td align="center">ใช้ระยะ (distance) ระหว่างจุดตัดสินใจ</td><td align="center">ใช้ระยะ (distance) ระหว่างจุดตัดสินใจ</td></tr>
</table>

### 2.11 ID3 และ CART

<table align="center">
  <tr><th></th><th>ID3</th><th>CART</th></tr>
  <tr><th>รูปร่างต้นไม้</th><td align="center">แตกหลายกิ่งตามค่า attribute (n-ary)</td><td align="center">แตก 2 กิ่งเสมอ (binary)</td></tr>
  <tr><th>node คือ</th><td align="center">ชื่อ attribute</td><td align="center">คำถามใช่/ไม่ใช่ เช่น $G>200$</td></tr>
  <tr><th>เกณฑ์เลือก</th><td align="center">Information Gain (Entropy)</td><td align="center">Gini</td></tr>
  <tr><th>ใช้ attribute ซ้ำ</th><td align="center">ไม่ได้ (ในเส้นทางเดียวกัน)</td><td align="center">ได้</td></tr>
  <tr><th>ชนิด attribute</th><td align="center">แบบ discrete (แตกตามค่า)</td><td align="center">รองรับค่าต่อเนื่อง โดยใช้ threshold เช่น $G>200$</td></tr>
  <tr><th>งาน</th><td align="center">Classification</td><td align="center">Classification และ Regression</td></tr>
</table>

### 2.12 Entropy และ Information Gain

<table align="center">
  <tr><th></th><th>Entropy</th><th>Information Gain</th></tr>
  <tr><th>วัดอะไร</th><td align="center">ความไม่บริสุทธิ์ของข้อมูลชุดเดียว</td><td align="center">Entropy ที่ลดลงหลังแบ่งด้วย attribute</td></tr>
  <tr><th>ค่าน้อย</th><td align="center">บริสุทธิ์ (0 คือ class เดียว)</td><td align="center">แบ่งแล้วไม่ช่วยเท่าไร</td></tr>
  <tr><th>ค่ามาก</th><td align="center">ผสมกันมาก</td><td align="center">แบ่งแล้วบริสุทธิ์ขึ้นมาก</td></tr>
  <tr><th>ใช้ทำอะไร</th><td align="center">เป็นส่วนประกอบของ Gain</td><td align="center">เลือก attribute ที่ Gain มากที่สุดเป็น node</td></tr>
</table>

### 2.13 K-Means (Hard) และ Fuzzy C-means

<table align="center">
  <tr><th></th><th>K-Means (Hard c-means)</th><th>Fuzzy C-means</th></tr>
  <tr><th>การเป็นสมาชิก</th><td align="center">จุดเดียวอยู่ได้ 1 กลุ่ม (membership 1 หรือ 0)</td><td align="center">อยู่ได้หลายกลุ่ม (membership เป็นค่า 0 ถึง 1)</td></tr>
  <tr><th>ผลรวม membership ของ 1 จุด</th><td align="center">1</td><td align="center">1 (เช่น 0.6, 0.3, 0.1)</td></tr>
  <tr><th>centroid</th><td align="center">ค่าเฉลี่ยของสมาชิกในกลุ่ม</td><td align="center">ค่าเฉลี่ยถ่วงน้ำหนักด้วย membership ($\mu^m$) ของทุกจุด</td></tr>
</table>
