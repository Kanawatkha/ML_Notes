# Regression

## 1. Regression คืออะไร

- **Regression (การถดถอย)** = วิธีทำนายค่า $Y$ ที่เป็น **ค่าต่อเนื่อง** จากข้อมูล $X$ เป็น **Supervised Learning** เพราะมีทั้ง $X$ และ $Y$

| กลุ่ม | งาน | ข้อมูลที่ใช้ |
|---|---|---|
| **Supervised Learning** | Classification (การจำแนกประเภท) | $X,\ Y$ |
| | **Regression (การถดถอย)** | $X,\ Y$ |
| **Unsupervised Learning** | Clustering (การจัดกลุ่ม) | $X$ |
| อื่นๆ | Optimization (การทำให้เหมาะสมที่สุด) | |

### ชนิดของ $Y$

| ชนิด | ตัวอย่าง | งาน |
|---|---|---|
| **Discrete** | Y/N, M/F, Dog/Cat | Classification |
| **Continuous** | Age, Weight, Height | **Regression** |

---

## 2. Linear Regression

หา **เส้นตรง** ที่เหมาะสมที่สุดผ่านข้อมูล

$$y=ax+b$$

- $a$ = ความชัน ($\tan\theta$), $b$ = จุดตัดแกน $y$ คือเส้นตรงผ่านจุด $(0,b)$
- ตัวอย่างความหมาย: กฎของโอห์ม $V=IR+0$ เทียบกับ $y=ax+c$ ($V\leftrightarrow y$, $R\leftrightarrow a$, $I\leftrightarrow x$)

### 2.1 Error และ Optimum line

- ข้อมูล $(x_i,y_i)\big|_{i=1}^{N}$
- $e_i$ = ระยะตั้งจากจุดข้อมูลถึงเส้นตรง
- รวม error ทุกจุดด้วยการหา **mean** (aggregate) ได้ error metric

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|e_i|\qquad\text{MSE}=\frac1N\sum_{i=1}^{N}e_i^2$$

- **Optimum line** = เส้นที่ error metric น้อยที่สุด
- เส้นที่ผ่านทุกจุดพอดี (เส้นหยัก) คือ **Overfitting** ✗ ส่วนเส้นตรงที่จับแนวโน้มรวม คือ **generalization** ✓

### 2.2 Least Square

ใช้ $x^2$ (MSE) หาค่าต่ำสุด โดยหา derivative แล้วให้เท่ากับ 0

$$f'(x)=0\ \Rightarrow\ \text{จุดต่ำสุด}$$

| ฟังก์ชัน | Derivative |
|---|---|
| $\lvert x\rvert$ | $\dfrac{x}{\lvert x\rvert}$ |
| $x^2$ | $2x$ |

### 2.3 Matrix Form

ให้

$$X=[x_1\ x_2\ x_3\ \cdots\ x_N],\qquad Y=[y_1\ y_2\ y_3\ \cdots\ y_N]$$

แปลง $(x,y)\to(x,y,1)$ เพื่อรวม $b$ เข้าไปด้วย

$$X=\begin{bmatrix}x_1&x_2&x_3&\cdots&x_N\\1&1&1&\cdots&1\end{bmatrix}$$

จาก $y=ax+b\cdot1$ เขียนเป็นเมทริกซ์ ($1$ สมการ, $2$ ตัวแปร คือ $a,b$)

$$\boxed{Y=RX}\qquad R=[a\ \ b]$$

| เมทริกซ์ | ขนาด |
|---|---|
| $Y$ | $1\times N$ |
| $R$ | $1\times2$ |
| $X$ | $2\times N$ |

### 2.4 หา $R$

กฎคูณเมทริกซ์: $A_{m\times n}\,B_{n\times q}=C_{m\times q}$ และ $AB\ne BA$

**ขั้นที่ 1:** คูณ $X^T$ ทั้งสองข้าง ($X^T$ ขนาด $N\times2$)

$$Y\cdot X^T=R\,(X\cdot X^T)$$

**ขั้นที่ 2:** คูณ $(XX^T)^{-1}$ ทั้งสองข้าง โดย $(XX^T)(XX^T)^{-1}=I$ และ $A\cdot I=A$

$$\boxed{R=Y\cdot X^T\,(XX^T)^{-1}}$$

### 2.5 กรณี $\det=0$

$(XX^T)^{-1}=\dfrac{\text{adj}(XX^T)}{\det(XX^T)}$ ถ้า $\det\to0$ จะหา inverse ไม่ได้

แก้โดยบวก $\varepsilon I$ เข้าที่เส้นทแยงมุม เช่นเมทริกซ์ทแยงมุม

$$\begin{bmatrix}a&0&0\\0&b&0\\0&0&c\end{bmatrix}+\varepsilon I=\begin{bmatrix}a+\varepsilon&0&0\\0&b+\varepsilon&0\\0&0&c+\varepsilon\end{bmatrix}$$

ได้สูตร

$$\boxed{R=Y\cdot X^T\,(XX^T+\varepsilon I)^{-1}}$$

### 2.6 โจทย์ตัวอย่าง

จากข้อมูลในตารางต่อไปนี้ จงหาเส้นตรง $y=ax+b$ ด้วยวิธี Least Square และทำนายค่า $y$ เมื่อ $x=6$

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">2</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">3</td></tr>
  <tr><td align="center">3</td><td align="center">3</td><td align="center">5</td></tr>
  <tr><td align="center">4</td><td align="center">4</td><td align="center">4</td></tr>
  <tr><td align="center">5</td><td align="center">5</td><td align="center">6</td></tr>
</table>

#### Sol<sup>n</sup>

**ขั้นที่ 1: สร้าง $X$ และ $Y$** ($N=5$)

$$X=\begin{bmatrix}1&2&3&4&5\\1&1&1&1&1\end{bmatrix}\ (2\times5),\qquad Y=[2\ \ 3\ \ 5\ \ 4\ \ 6]\ (1\times5)$$

**ขั้นที่ 2: หา $XX^T$** ($2\times5$ คูณ $5\times2$ ได้ $2\times2$)

$$XX^T=\begin{bmatrix}1^2+2^2+3^2+4^2+5^2&1+2+3+4+5\\1+2+3+4+5&5\end{bmatrix}=\begin{bmatrix}55&15\\15&5\end{bmatrix}$$

**ขั้นที่ 3: หา $YX^T$** ($1\times5$ คูณ $5\times2$ ได้ $1\times2$)

$$YX^T=[(2)(1)+(3)(2)+(5)(3)+(4)(4)+(6)(5),\ \ 2+3+5+4+6]=[69,\ 20]$$

**ขั้นที่ 4: หา $(XX^T)^{-1}$**

$$\det(XX^T)=(55)(5)-(15)(15)=275-225=50$$

$$\text{adj}(XX^T)=\begin{bmatrix}5&-15\\-15&55\end{bmatrix}$$

$$(XX^T)^{-1}=\frac1{50}\begin{bmatrix}5&-15\\-15&55\end{bmatrix}$$

**ขั้นที่ 5: หา $R$**

จากสูตร $R=Y\,X^T(XX^T)^{-1}$

$$R=[69,\ 20]\cdot\frac1{50}\begin{bmatrix}5&-15\\-15&55\end{bmatrix}=\frac1{50}[\,69(5)+20(-15),\ \ 69(-15)+20(55)\,]$$

$$=\frac1{50}[\,345-300,\ \ -1035+1100\,]=\frac1{50}[45,\ 65]=[0.9,\ 1.3]$$

ดังนั้น $a=0.9$, $b=1.3$

$$y=0.9x+1.3$$

**ขั้นที่ 6: ทำนายที่ $x=6$**

$$y=0.9(6)+1.3=5.4+1.3=6.7$$

**Ans** $y=0.9x+1.3$ และ $y(6)=6.7$

---

### 2.7 โจทย์ตัวอย่าง: หา Error (MAE, MSE)

จากข้อ 2.6 จงหา MAE และ MSE ของเส้นตรง $y=0.9x+1.3$

#### Sol<sup>n</sup>

หา $e_i=y_i-\hat y_i$ เมื่อ $\hat y_i=0.9x_i+1.3$

$$e_1=2-(0.9(1)+1.3)=2-2.2=-0.2$$

$$e_2=3-(0.9(2)+1.3)=3-3.1=-0.1$$

$$e_3=5-(0.9(3)+1.3)=5-4.0=1.0$$

$$e_4=4-(0.9(4)+1.3)=4-4.9=-0.9$$

$$e_5=6-(0.9(5)+1.3)=6-5.8=0.2$$

จากสูตร MAE

$$\text{MAE}=\frac1N\sum|e_i|=\frac{|-0.2|+|-0.1|+|1.0|+|-0.9|+|0.2|}{5}=\frac{0.2+0.1+1.0+0.9+0.2}{5}=\frac{2.4}{5}=0.48$$

จากสูตร MSE

$$\text{MSE}=\frac1N\sum e_i^2=\frac{(-0.2)^2+(-0.1)^2+(1.0)^2+(-0.9)^2+(0.2)^2}{5}=\frac{0.04+0.01+1+0.81+0.04}{5}=\frac{1.9}{5}=0.38$$

**Ans** $\text{MAE}=0.48$, $\text{MSE}=0.38$

---

### 2.8 โจทย์ตัวอย่าง: กรณี $\det=0$

จากข้อมูลในตารางต่อไปนี้ จงหาเส้นตรง $y=ax+b$ เมื่อกำหนด $\varepsilon=1$

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">2</td><td align="center">1</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">2</td></tr>
  <tr><td align="center">3</td><td align="center">2</td><td align="center">3</td></tr>
</table>

#### Sol<sup>n</sup>

**ขั้นที่ 1: สร้าง $X$ และ $Y$** ($N=3$)

$$X=\begin{bmatrix}2&2&2\\1&1&1\end{bmatrix},\qquad Y=[1\ \ 2\ \ 3]$$

**ขั้นที่ 2: หา $XX^T$ และตรวจ $\det$**

$$XX^T=\begin{bmatrix}2^2+2^2+2^2&2+2+2\\2+2+2&3\end{bmatrix}=\begin{bmatrix}12&6\\6&3\end{bmatrix}$$

$$\det(XX^T)=(12)(3)-(6)(6)=36-36=0$$

$\det=0$ ไม่มี $(XX^T)^{-1}$ จึงใช้สูตร $R=Y\,X^T(XX^T+\varepsilon I)^{-1}$

**ขั้นที่ 3: หา $YX^T$**

$$YX^T=[(1)(2)+(2)(2)+(3)(2),\ \ 1+2+3]=[12,\ 6]$$

**ขั้นที่ 4: หา $(XX^T+\varepsilon I)^{-1}$** เมื่อ $\varepsilon=1$

$$XX^T+\varepsilon I=\begin{bmatrix}12&6\\6&3\end{bmatrix}+\begin{bmatrix}1&0\\0&1\end{bmatrix}=\begin{bmatrix}13&6\\6&4\end{bmatrix}$$

$$\det=(13)(4)-(6)(6)=52-36=16$$

$$\text{adj}=\begin{bmatrix}4&-6\\-6&13\end{bmatrix}\ \Rightarrow\ (XX^T+\varepsilon I)^{-1}=\frac1{16}\begin{bmatrix}4&-6\\-6&13\end{bmatrix}$$

**ขั้นที่ 5: หา $R$**

$$R=[12,\ 6]\cdot\frac1{16}\begin{bmatrix}4&-6\\-6&13\end{bmatrix}=\frac1{16}[\,12(4)+6(-6),\ \ 12(-6)+6(13)\,]$$

$$=\frac1{16}[\,48-36,\ \ -72+78\,]=\frac1{16}[12,\ 6]=[0.75,\ 0.375]$$

**Ans** $y=0.75x+0.375$

---

## 3. Nonlinear Regression (Polynomial)

ใช้ **พหุนาม** แทนเส้นตรง เช่นพาราโบลา $y=x^2$ (มีจุดโฟกัส $f$ เหมือนจานรับสัญญาณ)

$$y=ax^2+bx+c\cdot1\qquad(\text{Degree }2)$$

เทียบกับ $y=ax^1+b$ (Degree 1) สมการทั้งสองเขียนเป็น $Y=RX$ และหา $R$ ด้วยสูตรเดียวกัน

$$R=Y\,X^T(XX^T)^{-1}$$

สิ่งที่เปลี่ยนมีแค่การสร้างเมทริกซ์ $X$ ซึ่งเพิ่มแถวของ $x$ ยกกำลัง

| ระดับ | เมทริกซ์ $X$ |
|---|---|
| ข้อมูล | $[x_1\ x_2\ x_3\ x_4]$ |
| Degree 1 (Linear) | $\begin{bmatrix}x_1&x_2&x_3&x_4\\1&1&1&1\end{bmatrix}$ |
| **Degree 2** | $\begin{bmatrix}x_1^2&x_2^2&x_3^2&x_4^2\\x_1&x_2&x_3&x_4\\1&1&1&1\end{bmatrix}$ |

### รูปทั่วไป

$$y=a_1x^{n}+a_2x^{n-1}+a_3x^{n-2}+\dots+a_{n+1}\qquad(n=\text{Degree})$$

| Degree | ชื่อ | จุดเปลี่ยนทิศของกราฟ |
|---|---|---|
| 1 | Linear | เส้นตรง |
| 2 | Parabola | 1 ครั้ง |
| 3 | | 2 ครั้ง |
| $n$ | | $n-1$ ครั้ง |

### 3.1 โจทย์ตัวอย่าง

จากข้อมูลในตารางต่อไปนี้ จงหา

- ก) เส้นตรง $y=ax+b$ (Degree 1)
- ข) พาราโบลา $y=ax^2+bx+c$ (Degree 2)
- ค) เปรียบเทียบ MAE ของทั้งสองแบบ แล้วทำนายค่า $y$ เมื่อ $x=3$ ด้วยแบบที่ดีกว่า

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">-2</td><td align="center">3</td></tr>
  <tr><td align="center">2</td><td align="center">-1</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">0</td><td align="center">1</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">7</td></tr>
</table>

#### Sol<sup>n</sup>

**ก) Degree 1**

$$X=\begin{bmatrix}-2&-1&0&1&2\\1&1&1&1&1\end{bmatrix}\ (2\times5),\qquad Y=[3\ \ 1\ \ 1\ \ 3\ \ 7]$$

$$XX^T=\begin{bmatrix}4+1+0+1+4&-2-1+0+1+2\\0&5\end{bmatrix}=\begin{bmatrix}10&0\\0&5\end{bmatrix}$$

$$YX^T=[(3)(-2)+(1)(-1)+(1)(0)+(3)(1)+(7)(2),\ \ 3+1+1+3+7]=[-6-1+0+3+14,\ \ 15]=[10,\ 15]$$

$$\det(XX^T)=(10)(5)-(0)(0)=50,\qquad \text{adj}=\begin{bmatrix}5&0\\0&10\end{bmatrix},\qquad (XX^T)^{-1}=\frac1{50}\begin{bmatrix}5&0\\0&10\end{bmatrix}$$

จากสูตร $R=Y\,X^T(XX^T)^{-1}$

$$R=[10,\ 15]\cdot\frac1{50}\begin{bmatrix}5&0\\0&10\end{bmatrix}=\frac1{50}[50,\ 150]=[1,\ 3]$$

ดังนั้น $y=x+3$

**ข) Degree 2**

$$X=\begin{bmatrix}4&1&0&1&4\\-2&-1&0&1&2\\1&1&1&1&1\end{bmatrix}\ (3\times5),\qquad Y=[3\ \ 1\ \ 1\ \ 3\ \ 7]$$

หา $XX^T$ ($3\times5$ คูณ $5\times3$ ได้ $3\times3$)

$$XX^T=\begin{bmatrix}\sum x^4&\sum x^3&\sum x^2\\\sum x^3&\sum x^2&\sum x\\\sum x^2&\sum x&5\end{bmatrix}$$

$$\sum x^4=16+1+0+1+16=34,\quad \sum x^3=-8-1+0+1+8=0,\quad \sum x^2=4+1+0+1+4=10,\quad \sum x=0$$

$$XX^T=\begin{bmatrix}34&0&10\\0&10&0\\10&0&5\end{bmatrix}$$

หา $YX^T$

$$YX^T=[\sum x^2y,\ \sum xy,\ \sum y]$$

$$\sum x^2y=(4)(3)+(1)(1)+(0)(1)+(1)(3)+(4)(7)=12+1+0+3+28=44$$

$$\sum xy=(-2)(3)+(-1)(1)+(0)(1)+(1)(3)+(2)(7)=-6-1+0+3+14=10$$

$$\sum y=3+1+1+3+7=15$$

$$YX^T=[44,\ 10,\ 15]$$

หา $(XX^T)^{-1}$

$$\det(XX^T)=34(10\cdot5-0\cdot0)-0+10(0\cdot0-10\cdot10)=34(50)+10(-100)=1700-1000=700$$

Cofactor ($C_{ij}=(-1)^{i+j}M_{ij}$)

$$C_{11}=50,\ C_{12}=0,\ C_{13}=-100$$
$$C_{21}=0,\ C_{22}=70,\ C_{23}=0$$
$$C_{31}=-100,\ C_{32}=0,\ C_{33}=340$$

$$\text{adj}(XX^T)=C^T=\begin{bmatrix}50&0&-100\\0&70&0\\-100&0&340\end{bmatrix}$$

$$(XX^T)^{-1}=\frac1{700}\begin{bmatrix}50&0&-100\\0&70&0\\-100&0&340\end{bmatrix}$$

จากสูตร $R=Y\,X^T(XX^T)^{-1}$

$$R=[44,\ 10,\ 15]\cdot\frac1{700}\begin{bmatrix}50&0&-100\\0&70&0\\-100&0&340\end{bmatrix}$$

$$=\frac1{700}[\,44(50)+10(0)+15(-100),\ \ 44(0)+10(70)+15(0),\ \ 44(-100)+10(0)+15(340)\,]$$

$$=\frac1{700}[\,2200-1500,\ \ 700,\ \ -4400+5100\,]=\frac1{700}[700,\ 700,\ 700]=[1,\ 1,\ 1]$$

ดังนั้น $y=x^2+x+1$

**ค) เปรียบเทียบ MAE**

Degree 1: $\hat y=x+3$

$$e=[\,3-1,\ 1-2,\ 1-3,\ 3-4,\ 7-5\,]=[2,\ -1,\ -2,\ -1,\ 2]$$

$$\text{MAE}_1=\frac{2+1+2+1+2}{5}=\frac85=1.6$$

Degree 2: $\hat y=x^2+x+1$

$$\hat y=[\,4-2+1,\ 1-1+1,\ 0+0+1,\ 1+1+1,\ 4+2+1\,]=[3,\ 1,\ 1,\ 3,\ 7]$$

$$e=[0,\ 0,\ 0,\ 0,\ 0]\ \Rightarrow\ \text{MAE}_2=0$$

$\text{MAE}_2<\text{MAE}_1$ ดังนั้น Degree 2 ฟิตข้อมูลได้ดีกว่า

ทำนายที่ $x=3$ ด้วย Degree 2

$$y=3^2+3+1=13$$

**Ans** ก) $y=x+3$ ข) $y=x^2+x+1$ ค) $\text{MAE}=1.6$ (Degree 1), $0$ (Degree 2) ใช้ Degree 2 ได้ $y(3)=13$

---

## 4. K-NN Regression

ใช้ K-NN เป็น **regressor** สำหรับ $Y$ ที่เป็นค่าต่อเนื่อง

1. หา distance จาก query ไปทุก sample (วิธีเดียวกับ K-NN Classification ดู `Classification.md` ข้อ 2.2)
2. เลือก $k$ ตัวที่ใกล้สุด
3. ค่าทำนาย = **ค่าเฉลี่ย (Avg)** ของ $Y$ ทั้ง $k$ ตัว

$$\hat y=\frac1k\sum_{i=1}^{k}y_i$$

เช่น $k=3$ เฉลี่ย $Y$ ของจุดที่ใกล้ที่สุด 3 จุด
