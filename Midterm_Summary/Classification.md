# Classification

## 1. Classification คืออะไร

- **Classification (การจำแนกประเภท)** = วิธีทำนายค่า $Y$ ที่เป็น **ค่าไม่ต่อเนื่อง (Discrete)** จากข้อมูล $X$ เป็น **Supervised Learning** เพราะมีทั้ง $X$ และ $Y$
- ตัวอย่างของ $Y$: Y/N, M/F, Dog/Cat

| หัวข้อ | เนื้อหา |
|---|---|
| 2. K-NN | ทำนายจาก $k$ ตัวอย่างที่ใกล้ที่สุด |
| 3. Perceptron | แบบ Vector |
| 4. FFBP | แบบ Matrix form |
| 5. ID3 | Data structure ของต้นไม้ตัดสินใจ |

---

## 2. K-NN

### 2.1 K-NN คืออะไร

- **K-Nearest Neighbors** = วิธีทำนายแบบ **Supervised Learning** ที่ดูจาก **k ตัวอย่างที่ "ใกล้" query ที่สุด** ในข้อมูลที่มี label
- **Non-parametric:** ไม่สมมติรูปแบบการแจกแจงของข้อมูล
- **Lazy learning:** ไม่มีขั้นตอนเทรนโมเดล แค่จำข้อมูลไว้ แล้วค่อยคำนวณตอนมี query เข้ามา (ตอนทำนายต้องคำนวณระยะทางไปทุก sample)
- ใช้ได้ 2 แบบ:

| งาน | วิธีทำนายจาก k เพื่อนบ้าน |
|---|---|
| **Classification** | **โหวตเสียงข้างมาก** ของ label |
| **Regression** | **เฉลี่ย** ค่า target ของ k ตัว |

Sources (ส่วนนิยาม K-NN): [Wikipedia: k-nearest neighbors algorithm](https://static.hlt.bme.hu/semantics/external/pages/LSTM/en.wikipedia.org/wiki/K-nearest_neighbors_algorithm.html), [IBM: What is KNN](https://www.ibm.com/think/topics/knn), [GeeksforGeeks: KNN](https://www.geeksforgeeks.org/k-nearest-neighbours/)

---

### 2.2 Distance

#### 2.2.1 Euclidean ($\ell_2$-norm)

**แบบปกติ (วัดความยาว)**

ที่มา: $\vec a+\vec n-\vec b=\vec 0\Rightarrow\vec n=\vec b-\vec a$

$$d(\vec a,\vec b)=\|\vec b-\vec a\|_2=\sqrt{\Delta A_1^2+\Delta A_2^2+\Delta A_3^2}$$

**แบบ Cosine (วัดมุม)**

$$\boxed{\cos\theta=\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}}\qquad\left(\theta=\arccos\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}\right)$$

- มาจาก $\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta$
- วัด **มุม** ระหว่าง 2 vector ไม่ใช่ความยาว
- **ค่ามาก = ใกล้กัน** (มุมเล็ก, cos สูง) → เลือก **ค่ามากสุด** (ตรงข้ามกับ distance ที่เลือกค่าน้อยสุด)
- กราฟ $\cos\theta$: ลดลงเมื่อ $\theta$ เพิ่ม (เริ่มที่ 1 ที่ $\theta=0$)

#### 2.2.2 Squared Euclidean
$$d^2=\Delta A_1^2+\Delta A_2^2+\Delta A_3^2$$

- ไม่ต้องถอดราก เพราะ $x\propto\sqrt x$
- เช่น $4>3\Rightarrow\sqrt4>\sqrt3$ → **ลำดับใกล้-ไกลไม่เปลี่ยน**
- จึงเรียงลำดับด้วยค่ากำลังสองได้เลย

#### 2.2.3 Manhattan ($\ell_1$-norm)
$$d=|x_1-x_2|+|y_1-y_2|=\|\vec a-\vec b\|_1$$

- เดินตามบล็อก (แนวนอน + แนวตั้ง) ไม่ตัดเฉียง

#### + เสริม: $\ell_p$-norm
$$\|\vec a\|_p=\left(\sum_{i=1}^{n}a_i^p\right)^{\frac1p}=\sqrt[p]{a_1^p+a_2^p+a_3^p}$$

| norm | p | ชื่อ | หมายเหตุ |
|---|---|---|---|
| $\ell_1$ | 1 | Manhattan | MAE |
| $\ell_2$ | 2 | Euclidean | MSE |
| $\ell_p$ | 1.5, 0.5, 3 | ตัวอย่างที่อาจารย์เขียน | |

Unit ball (จุดที่ห่างจากจุดกำเนิดเท่ากัน) บนแกน 2 มิติ:
- $\ell_{0.5}$ = ดาวแหลมเว้าเข้า
- $\ell_1$ = ข้าวหลามตัด (diamond)
- $\ell_{1.5}$ = ระหว่าง diamond กับวงกลม
- $\ell_2$ = วงกลม

---

### 2.3 โจทย์ตัวอย่างที่ 1

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">0</td><td align="center">2</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">-1</td><td align="center">-3</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">3</td><td align="center">1</td><td align="center">0</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">0</td><td align="center">1</td><td align="center">1</td><td align="center">?</td></tr>
</table>

#### 2.3.1 ระยะทางแบบ Euclidean

##### Sol<sup>n</sup>

ตาราง $D$ (Euclidean) ทำเฉพาะแถวที่ 4 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">D₄₁</td><td align="center">D₄₂</td><td align="center">D₄₃</td><td align="center">0</td></tr>
</table>

จากสูตร Euclidean

$$\|\vec x_i-\vec x_j\|_2=\sqrt{\Delta A_1^2+\Delta A_2^2+\Delta A_3^2}$$

โดย $\vec x_4=[0,1,1]$

$$D_{41}=\|\vec x_4-\vec x_1\|_2=\sqrt{(0-1)^2+(1-0)^2+(1-2)^2}=\sqrt{1+1+1}=\sqrt3\approx1.73$$

$$D_{42}=\|\vec x_4-\vec x_2\|_2=\sqrt{(0-2)^2+(1-(-1))^2+(1-(-3))^2}=\sqrt{4+4+16}=\sqrt{24}\approx4.90$$

$$D_{43}=\|\vec x_4-\vec x_3\|_2=\sqrt{(0-3)^2+(1-1)^2+(1-0)^2}=\sqrt{9+0+1}=\sqrt{10}\approx3.16$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">1.73</td><td align="center">4.90</td><td align="center">3.16</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{41}=1.73\ <\ D_{43}=3.16\ <\ D_{42}=4.90$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $1.73\to(①)\to(Y)$ ดังนั้น **Y**
- $k=2$: $(1.73,3.16)\to(①,③)\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(1.73,3.16,4.90)\to(①,③,②)\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

#### 2.3.2 ระยะทางแบบ Cosine

##### Sol<sup>n</sup>

ตาราง $D$ (Cosine) ทำเฉพาะแถวที่ 4 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">D₄₁</td><td align="center">D₄₂</td><td align="center">D₄₃</td><td align="center">1</td></tr>
</table>

จากสูตร Cosine

$$\cos\theta=\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}$$

โดย $\vec x_4=[0,1,1]$ ได้ $|\vec x_4|=\sqrt{0+1+1}=\sqrt2$

$$D_{41}=\frac{\vec x_4\cdot\vec x_1}{|\vec x_4||\vec x_1|}=\frac{(0)(1)+(1)(0)+(1)(2)}{\sqrt2\,\sqrt{1+0+4}}=\frac{2}{\sqrt2\,\sqrt5}=\frac{2}{\sqrt{10}}\approx0.63$$

$$D_{42}=\frac{\vec x_4\cdot\vec x_2}{|\vec x_4||\vec x_2|}=\frac{(0)(2)+(1)(-1)+(1)(-3)}{\sqrt2\,\sqrt{4+1+9}}=\frac{-4}{\sqrt2\,\sqrt{14}}=\frac{-4}{\sqrt{28}}\approx-0.76$$

$$D_{43}=\frac{\vec x_4\cdot\vec x_3}{|\vec x_4||\vec x_3|}=\frac{(0)(3)+(1)(1)+(1)(0)}{\sqrt2\,\sqrt{9+1+0}}=\frac{1}{\sqrt2\,\sqrt{10}}=\frac{1}{\sqrt{20}}\approx0.22$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">0.63</td><td align="center">-0.76</td><td align="center">0.22</td><td align="center">1</td></tr>
</table>

Cosine ยิ่งมากยิ่งใกล้ จากตาราง $D$ แถวที่ 4 เรียงจากมากไปน้อย

$$D_{41}=0.63\ >\ D_{43}=0.22\ >\ D_{42}=-0.76$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $0.63\to(①)\to(Y)$ ดังนั้น **Y**
- $k=2$: $(0.63,0.22)\to(①,③)\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(0.63,0.22,-0.76)\to(①,③,②)\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

#### 2.3.3 ระยะทางแบบ Squared Euclidean

##### Sol<sup>n</sup>

ตาราง $D$ (Squared Euclidean) ทำเฉพาะแถวที่ 4 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">D₄₁</td><td align="center">D₄₂</td><td align="center">D₄₃</td><td align="center">0</td></tr>
</table>

จากสูตร Squared Euclidean

$$\|\vec x_i-\vec x_j\|^2=\Delta A_1^2+\Delta A_2^2+\Delta A_3^2$$

โดย $\vec x_4=[0,1,1]$

$$D_{41}=\|\vec x_4-\vec x_1\|^2=(0-1)^2+(1-0)^2+(1-2)^2=1+1+1=3$$

$$D_{42}=\|\vec x_4-\vec x_2\|^2=(0-2)^2+(1-(-1))^2+(1-(-3))^2=4+4+16=24$$

$$D_{43}=\|\vec x_4-\vec x_3\|^2=(0-3)^2+(1-1)^2+(1-0)^2=9+0+1=10$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">3</td><td align="center">24</td><td align="center">10</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{41}=3\ <\ D_{43}=10\ <\ D_{42}=24$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $3\to(①)\to(Y)$ ดังนั้น **Y**
- $k=2$: $(3,10)\to(①,③)\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(3,10,24)\to(①,③,②)\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

#### 2.3.4 ระยะทางแบบ Manhattan

##### Sol<sup>n</sup>

ตาราง $D$ (Manhattan) ทำเฉพาะแถวที่ 4 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">D₄₁</td><td align="center">D₄₂</td><td align="center">D₄₃</td><td align="center">0</td></tr>
</table>

จากสูตร Manhattan

$$\|\vec x_i-\vec x_j\|_1=|\Delta A_1|+|\Delta A_2|+|\Delta A_3|$$

โดย $\vec x_4=[0,1,1]$

$$D_{41}=\|\vec x_4-\vec x_1\|_1=|0-1|+|1-0|+|1-2|=1+1+1=3$$

$$D_{42}=\|\vec x_4-\vec x_2\|_1=|0-2|+|1-(-1)|+|1-(-3)|=2+2+4=8$$

$$D_{43}=\|\vec x_4-\vec x_3\|_1=|0-3|+|1-1|+|1-0|=3+0+1=4$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">3</td><td align="center">8</td><td align="center">4</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{41}=3\ <\ D_{43}=4\ <\ D_{42}=8$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $3\to(①)\to(Y)$ ดังนั้น **Y**
- $k=2$: $(3,4)\to(①,③)\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(3,4,8)\to(①,③,②)\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

### 2.4 โจทย์ตัวอย่างที่ 2

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 6 ด้วย K-NN เมื่อ $k=1,2,3$

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">6</td><td align="center">5</td><td align="center">2</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">3</td><td align="center">4</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">4</td><td align="center">1</td><td align="center">0</td><td align="center">Y</td></tr>
  <tr><td align="center">4</td><td align="center">6</td><td align="center">3</td><td align="center">4</td><td align="center">N</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">3</td><td align="center">0</td><td align="center">N</td></tr>
  <tr><td align="center">6</td><td align="center">3</td><td align="center">0</td><td align="center">1</td><td align="center">?</td></tr>
</table>

#### 2.4.1 ระยะทางแบบ Euclidean

##### Sol<sup>n</sup>

ตาราง $D$ (Euclidean) ทำเฉพาะแถวที่ 6 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>5</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>6</th><td align="center">D₆₁</td><td align="center">D₆₂</td><td align="center">D₆₃</td><td align="center">D₆₄</td><td align="center">D₆₅</td><td align="center">0</td></tr>
</table>

จากสูตร Euclidean

$$\|\vec x_i-\vec x_j\|_2=\sqrt{\Delta A_1^2+\Delta A_2^2+\Delta A_3^2}$$

โดย $\vec x_6=[3,0,1]$

$$D_{61}=\|\vec x_6-\vec x_1\|_2=\sqrt{(3-6)^2+(0-5)^2+(1-2)^2}=\sqrt{9+25+1}=\sqrt{35}\approx5.92$$

$$D_{62}=\|\vec x_6-\vec x_2\|_2=\sqrt{(3-2)^2+(0-3)^2+(1-4)^2}=\sqrt{1+9+9}=\sqrt{19}\approx4.36$$

$$D_{63}=\|\vec x_6-\vec x_3\|_2=\sqrt{(3-4)^2+(0-1)^2+(1-0)^2}=\sqrt{1+1+1}=\sqrt3\approx1.73$$

$$D_{64}=\|\vec x_6-\vec x_4\|_2=\sqrt{(3-6)^2+(0-3)^2+(1-4)^2}=\sqrt{9+9+9}=\sqrt{27}\approx5.20$$

$$D_{65}=\|\vec x_6-\vec x_5\|_2=\sqrt{(3-2)^2+(0-3)^2+(1-0)^2}=\sqrt{1+9+1}=\sqrt{11}\approx3.32$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>5</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>6</th><td align="center">5.92</td><td align="center">4.36</td><td align="center">1.73</td><td align="center">5.20</td><td align="center">3.32</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 6 เรียงจากน้อยไปมาก

$$D_{63}=1.73\ <\ D_{65}=3.32\ <\ D_{62}=4.36\ <\ D_{64}=5.20\ <\ D_{61}=5.92$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $1.73\to(③)\to(Y)$ ดังนั้น **Y**
- $k=2$: $(1.73,3.32)\to(③,⑤)\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(1.73,3.32,4.36)\to(③,⑤,②)\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

#### 2.4.2 ระยะทางแบบ Cosine

##### Sol<sup>n</sup>

ตาราง $D$ (Cosine) ทำเฉพาะแถวที่ 6 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>5</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>6</th><td align="center">D₆₁</td><td align="center">D₆₂</td><td align="center">D₆₃</td><td align="center">D₆₄</td><td align="center">D₆₅</td><td align="center">1</td></tr>
</table>

จากสูตร Cosine

$$\cos\theta=\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}$$

โดย $\vec x_6=[3,0,1]$ ได้ $|\vec x_6|=\sqrt{9+0+1}=\sqrt{10}$

$$D_{61}=\frac{\vec x_6\cdot\vec x_1}{|\vec x_6||\vec x_1|}=\frac{(3)(6)+(0)(5)+(1)(2)}{\sqrt{10}\,\sqrt{36+25+4}}=\frac{20}{\sqrt{10}\,\sqrt{65}}=\frac{20}{\sqrt{650}}\approx0.78$$

$$D_{62}=\frac{\vec x_6\cdot\vec x_2}{|\vec x_6||\vec x_2|}=\frac{(3)(2)+(0)(3)+(1)(4)}{\sqrt{10}\,\sqrt{4+9+16}}=\frac{10}{\sqrt{10}\,\sqrt{29}}=\frac{10}{\sqrt{290}}\approx0.59$$

$$D_{63}=\frac{\vec x_6\cdot\vec x_3}{|\vec x_6||\vec x_3|}=\frac{(3)(4)+(0)(1)+(1)(0)}{\sqrt{10}\,\sqrt{16+1+0}}=\frac{12}{\sqrt{10}\,\sqrt{17}}=\frac{12}{\sqrt{170}}\approx0.92$$

$$D_{64}=\frac{\vec x_6\cdot\vec x_4}{|\vec x_6||\vec x_4|}=\frac{(3)(6)+(0)(3)+(1)(4)}{\sqrt{10}\,\sqrt{36+9+16}}=\frac{22}{\sqrt{10}\,\sqrt{61}}=\frac{22}{\sqrt{610}}\approx0.89$$

$$D_{65}=\frac{\vec x_6\cdot\vec x_5}{|\vec x_6||\vec x_5|}=\frac{(3)(2)+(0)(3)+(1)(0)}{\sqrt{10}\,\sqrt{4+9+0}}=\frac{6}{\sqrt{10}\,\sqrt{13}}=\frac{6}{\sqrt{130}}\approx0.53$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>5</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>6</th><td align="center">0.78</td><td align="center">0.59</td><td align="center">0.92</td><td align="center">0.89</td><td align="center">0.53</td><td align="center">1</td></tr>
</table>

Cosine ยิ่งมากยิ่งใกล้ จากตาราง $D$ แถวที่ 6 เรียงจากมากไปน้อย

$$D_{63}=0.92\ >\ D_{64}=0.89\ >\ D_{61}=0.78\ >\ D_{62}=0.59\ >\ D_{65}=0.53$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $0.92\to(③)\to(Y)$ ดังนั้น **Y**
- $k=2$: $(0.92,0.89)\to(③,④)\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(0.92,0.89,0.78)\to(③,④,①)\to(Y,N,Y)$ ดังนั้น **Y**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **Y**

---

#### 2.4.3 ระยะทางแบบ Squared Euclidean

##### Sol<sup>n</sup>

ตาราง $D$ (Squared Euclidean) ทำเฉพาะแถวที่ 6 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>5</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>6</th><td align="center">D₆₁</td><td align="center">D₆₂</td><td align="center">D₆₃</td><td align="center">D₆₄</td><td align="center">D₆₅</td><td align="center">0</td></tr>
</table>

จากสูตร Squared Euclidean

$$\|\vec x_i-\vec x_j\|^2=\Delta A_1^2+\Delta A_2^2+\Delta A_3^2$$

โดย $\vec x_6=[3,0,1]$

$$D_{61}=\|\vec x_6-\vec x_1\|^2=(3-6)^2+(0-5)^2+(1-2)^2=9+25+1=35$$

$$D_{62}=\|\vec x_6-\vec x_2\|^2=(3-2)^2+(0-3)^2+(1-4)^2=1+9+9=19$$

$$D_{63}=\|\vec x_6-\vec x_3\|^2=(3-4)^2+(0-1)^2+(1-0)^2=1+1+1=3$$

$$D_{64}=\|\vec x_6-\vec x_4\|^2=(3-6)^2+(0-3)^2+(1-4)^2=9+9+9=27$$

$$D_{65}=\|\vec x_6-\vec x_5\|^2=(3-2)^2+(0-3)^2+(1-0)^2=1+9+1=11$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>5</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>6</th><td align="center">35</td><td align="center">19</td><td align="center">3</td><td align="center">27</td><td align="center">11</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 6 เรียงจากน้อยไปมาก

$$D_{63}=3\ <\ D_{65}=11\ <\ D_{62}=19\ <\ D_{64}=27\ <\ D_{61}=35$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $3\to(③)\to(Y)$ ดังนั้น **Y**
- $k=2$: $(3,11)\to(③,⑤)\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(3,11,19)\to(③,⑤,②)\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

#### 2.4.4 ระยะทางแบบ Manhattan

##### Sol<sup>n</sup>

ตาราง $D$ (Manhattan) ทำเฉพาะแถวที่ 6 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>5</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>6</th><td align="center">D₆₁</td><td align="center">D₆₂</td><td align="center">D₆₃</td><td align="center">D₆₄</td><td align="center">D₆₅</td><td align="center">0</td></tr>
</table>

จากสูตร Manhattan

$$\|\vec x_i-\vec x_j\|_1=|\Delta A_1|+|\Delta A_2|+|\Delta A_3|$$

โดย $\vec x_6=[3,0,1]$

$$D_{61}=\|\vec x_6-\vec x_1\|_1=|3-6|+|0-5|+|1-2|=3+5+1=9$$

$$D_{62}=\|\vec x_6-\vec x_2\|_1=|3-2|+|0-3|+|1-4|=1+3+3=7$$

$$D_{63}=\|\vec x_6-\vec x_3\|_1=|3-4|+|0-1|+|1-0|=1+1+1=3$$

$$D_{64}=\|\vec x_6-\vec x_4\|_1=|3-6|+|0-3|+|1-4|=3+3+3=9$$

$$D_{65}=\|\vec x_6-\vec x_5\|_1=|3-2|+|0-3|+|1-0|=1+3+1=5$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>5</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>6</th><td align="center">9</td><td align="center">7</td><td align="center">3</td><td align="center">9</td><td align="center">5</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 6 เรียงจากน้อยไปมาก

$$D_{63}=3\ <\ D_{65}=5\ <\ D_{62}=7\ <\ D_{61}=D_{64}=9$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $3\to(③)\to(Y)$ ดังนั้น **Y**
- $k=2$: $(3,5)\to(③,⑤)\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(3,5,7)\to(③,⑤,②)\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

## 3. Perceptron

*(ยังไม่ได้เขียน)*

---

## 4. FFBP

*(ยังไม่ได้เขียน)*

---

## 5. ID3

*(ยังไม่ได้เขียน)*
