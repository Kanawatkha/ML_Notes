# Definitions

**นิยาม (Definitions)** สรุปความหมายของหัวข้อและศัพท์สำคัญในขอบเขตสอบกลางภาคแบบสั้นๆ ส่วนที่ 1 คือนิยาม ส่วนที่ 2 คือตารางเปรียบเทียบเรื่องที่มักถูกถามให้แยกให้ออก

---

## 1. นิยาม

### 1.1 ภาพรวมของ Machine Learning

**Machine Learning (การเรียนรู้ของเครื่อง)** คือการให้เครื่องเรียนรู้รูปแบบจากข้อมูล แล้วนำไปทำนายหรือจัดกลุ่มข้อมูลใหม่

**Supervised Learning (การเรียนรู้แบบมีผู้สอน)** คือการเรียนรู้จากข้อมูล $X$ ที่มีคำตอบ $Y$ (label ที่คนติดไว้) กำกับ แล้วเทียบผลทำนายกับ $Y$ เพื่อปรับโมเดล ได้แก่ Classification และ Regression

**Unsupervised Learning (การเรียนรู้แบบไม่มีผู้สอน)** คือการเรียนรู้จากข้อมูล $X$ อย่างเดียว ไม่มี $Y$ ได้แก่ Clustering

**ศัพท์พื้นฐาน**

- **$X$** คือข้อมูลนำเข้า (attribute, feature) และ **$Y$** คือคำตอบ (target, label)
- **Sample (observation)** คือข้อมูล 1 ตัวอย่าง หรือ 1 แถวของตาราง
- **Discrete** คือค่าไม่ต่อเนื่อง เช่น Y/N, M/F, Dog/Cat และ **Continuous** คือค่าต่อเนื่อง เช่น อายุ น้ำหนัก ส่วนสูง
- **Training set** คือข้อมูลที่รู้ $Y$ ใช้เรียนรู้ และ **Test set** คือข้อมูลที่ต้องทำนาย
- **MAE, MSE** คือค่าวัดความต่างระหว่างค่าจริงกับค่าทำนาย (MAE เฉลี่ยค่าสัมบูรณ์ MSE เฉลี่ยกำลังสอง)
- **Overfitting** คือโมเดลจำข้อมูลสอนได้ดีแต่ทำนายข้อมูลใหม่ได้แย่ ส่วน **Generalization** คือความสามารถทำนายข้อมูลใหม่ได้ดี

### 1.2 Regression

**Regression (การถดถอย)** คือการทำนายค่า $Y$ ที่เป็นค่าต่อเนื่อง

- **Linear Regression** คือการหาเส้นตรงที่เข้ากับข้อมูลที่สุด (error กำลังสองรวมน้อยที่สุด เรียก Least Square)
- **Polynomial Regression** คือการหาเส้นโค้งพหุนามดีกรี $n$ (Degree 1 = เส้นตรง, Degree 2 = Parabola โค้ง 1 ครั้ง, Degree $n$ โค้ง $n-1$ ครั้ง) ดีกรีสูงเกินเสี่ยง overfitting
- **K-NN Regression** คือการทำนายด้วยค่าเฉลี่ยของ $y$ จาก $k$ จุดที่ใกล้ที่สุด

### 1.3 Classification และ K-NN

**Classification (การจำแนกประเภท)** คือการทำนายค่า $Y$ ที่เป็นค่าไม่ต่อเนื่อง (class)

**K-NN (k-Nearest Neighbors)** คือวิธีจำแนกข้อมูลใหม่ตาม label ของ $k$ ตัวอย่างที่ใกล้ที่สุด โดยโหวตเสียงข้างมาก (เสมอกันเลือกตัวที่ใกล้ที่สุด) ไม่ต้อง train แต่คำนวณหนัก

**ระยะที่ใช้วัดความใกล้**

- **Euclidean** คือระยะเส้นตรง และ **Squared Euclidean** คือ Euclidean ที่ไม่ถอดราก (ลำดับใกล้-ไกลเหมือนกัน)
- **Manhattan** คือผลรวมผลต่างสัมบูรณ์ในแต่ละมิติ เหมือนเดินตามตารางถนน
- **Cosine** วัดมุมระหว่างเวกเตอร์ ค่ามากคือใกล้กัน

### 1.4 Perceptron

**Perceptron** คือ neuron ตัวเดียวที่ให้ผลลัพธ์เป็น $+1$ หรือ $-1$ ใช้จำแนก 2 กลุ่มด้วยเส้นตรง

- **Neuron** คือหน่วยคำนวณที่รวมอินพุตแบบถ่วงน้ำหนัก (weight) แล้วส่งผ่านฟังก์ชัน activation
- **Hyperplane** คือขอบเขตแบ่งกลุ่มที่ perceptron หาได้ (เส้นตรงใน 2 มิติ)
- **Bias** คือค่าเลื่อนขอบเขตแบ่งกลุ่ม และ **Learning rate ($\eta$)** คือตัวคูณกำหนดขนาดการปรับ weight
- หยุดได้แน่เมื่อข้อมูลแยกด้วยเส้นตรงได้ (linearly separable) แก้ XOR ไม่ได้

### 1.5 FFBP

**FFBP (Feed-Forward Backpropagation)** คือโครงข่ายหลายชั้นที่ส่งข้อมูลไปข้างหน้า (feed-forward) แล้วส่ง error ย้อนกลับ (backpropagation) เพื่อปรับ weight ให้ผลลัพธ์ใกล้ target

- **Hidden layer** คือชั้นระหว่าง input กับ output ทำให้แก้ปัญหาที่แบ่งด้วยเส้นตรงไม่ได้ เช่น XOR
- **Sigmoid** คือ activation ที่ต่อเนื่องและหาอนุพันธ์ได้ ให้ผลลัพธ์ระหว่าง 0 ถึง 1
- **Epoch** คือการป้อนข้อมูลสอนครบทุกตัวอย่าง 1 รอบ

### 1.6 ID3

**Decision Tree (ต้นไม้ตัดสินใจ)** คือต้นไม้ที่แบ่งข้อมูลทีละขั้น node คือ attribute กิ่งคือค่าของ attribute และ leaf คือ class

**ID3** คืออัลกอริทึมสร้าง decision tree โดยเลือก attribute ที่ Information Gain มากที่สุดเป็น node แตกกิ่งตามค่าของ attribute และไม่ใช้ attribute ซ้ำในเส้นทางเดียวกัน

- **Entropy** คือความไม่บริสุทธิ์ของข้อมูล เป็น 0 เมื่อเป็น class เดียว และมากที่สุดเมื่อผสมเท่าๆ กัน
- **Information Gain** คือ Entropy ที่ลดลงหลังแบ่งด้วย attribute นั้น
- **Overfitting ของต้นไม้** คือต้นไม้ลึกจนจำ noise แก้ด้วย pruning (หยุดสร้างก่อน หรือสร้างเต็มแล้วตัดทิ้ง)

### 1.7 Clustering

**Clustering (การจัดกลุ่ม)** คือการแบ่งข้อมูล $X$ เป็นกลุ่มตามความคล้ายกัน โดยไม่มี label

- **K-Means** คือวิธีจัดกลุ่มที่ผู้ใช้กำหนดจำนวนกลุ่ม $k$ เอง วนทำซ้ำ Assign (ให้ label ตาม centroid ที่ใกล้ที่สุด) และ Update (ย้าย centroid ไปที่ค่าเฉลี่ยของกลุ่ม) จน label ไม่เปลี่ยน
- **Centroid** คือจุดศูนย์กลางของกลุ่ม
- **Fuzzy C-means** คือ K-Means ที่ให้จุดหนึ่งอยู่ได้หลายกลุ่มพร้อมกัน ด้วยค่า membership ที่รวมกันได้ 1

---

## 2. เปรียบเทียบ

### 2.1 Supervised และ Unsupervised

<table align="center">
  <tr><th></th><th>Supervised</th><th>Unsupervised</th></tr>
  <tr><th>ข้อมูล</th><td align="center">$X$ และ $Y$</td><td align="center">$X$ อย่างเดียว</td></tr>
  <tr><th>งาน</th><td align="center">Classification, Regression</td><td align="center">Clustering</td></tr>
  <tr><th>ตัวอย่างวิธี</th><td align="center">K-NN, Perceptron, FFBP, ID3, Linear</td><td align="center">K-Means</td></tr>
</table>

### 2.2 Classification, Regression และ Clustering

<table align="center">
  <tr><th></th><th>Classification</th><th>Regression</th><th>Clustering</th></tr>
  <tr><th>ประเภท</th><td align="center">Supervised</td><td align="center">Supervised</td><td align="center">Unsupervised</td></tr>
  <tr><th>ผลลัพธ์</th><td align="center">class (Discrete)</td><td align="center">ตัวเลข (Continuous)</td><td align="center">กลุ่มและ centroid</td></tr>
  <tr><th>จำนวนกลุ่ม</th><td align="center">ตามจำนวน class ใน $Y$</td><td align="center">ไม่มี</td><td align="center">กำหนดเอง ($k$)</td></tr>
  <tr><th>วิธีในวิชานี้</th><td align="center">K-NN, Perceptron, FFBP, ID3</td><td align="center">Linear, Polynomial, K-NN</td><td align="center">K-Means</td></tr>
</table>

### 2.3 ระยะของ K-NN

<table align="center">
  <tr><th></th><th>Euclidean</th><th>Squared Euclidean</th><th>Manhattan</th><th>Cosine</th></tr>
  <tr><th>วัดอะไร</th><td align="center">ระยะเส้นตรง</td><td align="center">ระยะเส้นตรงกำลังสอง</td><td align="center">ผลรวมผลต่างสัมบูรณ์</td><td align="center">มุมระหว่างเวกเตอร์</td></tr>
  <tr><th>ใกล้กันคือ</th><td align="center">ค่าน้อย</td><td align="center">ค่าน้อย</td><td align="center">ค่าน้อย</td><td align="center">ค่ามาก</td></tr>
</table>

### 2.4 Perceptron และ FFBP

<table align="center">
  <tr><th></th><th>Perceptron</th><th>FFBP</th></tr>
  <tr><th>โครงสร้าง</th><td align="center">neuron เดียว ไม่มี hidden layer</td><td align="center">มี hidden layer</td></tr>
  <tr><th>activation</th><td align="center">hard-limit ($+1$ หรือ $-1$) หาอนุพันธ์ไม่ได้</td><td align="center">sigmoid (0 ถึง 1) หาอนุพันธ์ได้</td></tr>
  <tr><th>เส้นแบ่งกลุ่ม</th><td align="center">เส้นตรงเท่านั้น แก้ XOR ไม่ได้</td><td align="center">ไม่ใช่เส้นตรงได้ แก้ XOR ได้</td></tr>
</table>

### 2.5 K-NN (Classifier), K-NN (Regressor) และ K-Means

<table align="center">
  <tr><th></th><th>K-NN Classifier</th><th>K-NN Regressor</th><th>K-Means</th></tr>
  <tr><th>ประเภท</th><td align="center">Supervised</td><td align="center">Supervised</td><td align="center">Unsupervised</td></tr>
  <tr><th>ความหมายของ $k$</th><td align="center">จำนวนเพื่อนบ้านที่โหวต</td><td align="center">จำนวนเพื่อนบ้านที่เฉลี่ย</td><td align="center">จำนวนกลุ่ม</td></tr>
  <tr><th>ผลลัพธ์</th><td align="center">class ที่ได้เสียงมากสุด</td><td align="center">ค่าเฉลี่ยของ $y$</td><td align="center">กลุ่มและ centroid</td></tr>
</table>

### 2.6 ID3 และ CART

<table align="center">
  <tr><th></th><th>ID3</th><th>CART</th></tr>
  <tr><th>รูปร่างต้นไม้</th><td align="center">แตกหลายกิ่งตามค่า attribute</td><td align="center">แตก 2 กิ่งเสมอ</td></tr>
  <tr><th>node</th><td align="center">ชื่อ attribute</td><td align="center">คำถามใช่/ไม่ใช่ เช่น $G>200$</td></tr>
  <tr><th>เกณฑ์เลือก</th><td align="center">Information Gain</td><td align="center">Gini</td></tr>
  <tr><th>ใช้ attribute ซ้ำ</th><td align="center">ไม่ได้ (ในเส้นทางเดียวกัน)</td><td align="center">ได้</td></tr>
</table>
