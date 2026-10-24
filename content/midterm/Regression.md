# Regression

**Regression (การถดถอย)** คือการทำนายค่า $Y$ ที่เป็น **ค่าต่อเนื่อง (Continuous)** จากข้อมูล $X$

---

**Linear (Degree 1)**

สมการ

$$y=ax+b$$

$X$, $Y$, $R$

$$X=\begin{bmatrix}x_1&x_2&\cdots&x_N\\1&1&\cdots&1\end{bmatrix}_{2\times N},\qquad Y=\begin{bmatrix}y_1&y_2&\cdots&y_N\end{bmatrix}_{1\times N},\qquad R=\begin{bmatrix}a&b\end{bmatrix}_{1\times2}$$

ทำนาย

$$\hat y=RX=ax+b\qquad\text{โดย }X=\begin{bmatrix}x\\1\end{bmatrix}_{2\times1}$$

**Polynomial (Degree 2 และ N)**

Degree 2

$$y=ax^2+bx+c$$

$$X=\begin{bmatrix}x_1^2&x_2^2&\cdots&x_N^2\\x_1&x_2&\cdots&x_N\\1&1&\cdots&1\end{bmatrix}_{3\times N},\qquad Y=\begin{bmatrix}y_1&y_2&\cdots&y_N\end{bmatrix}_{1\times N},\qquad R=\begin{bmatrix}a&b&c\end{bmatrix}_{1\times3}$$

$$\hat y=RX=ax^2+bx+c\qquad\text{โดย }X=\begin{bmatrix}x^2\\x\\1\end{bmatrix}_{3\times1}$$

Degree $n$

$$y=a_1x^{n}+a_2x^{n-1}+\dots+a_{n+1}$$

$$X=\begin{bmatrix}x_1^n&x_2^n&\cdots&x_N^n\\\vdots&\vdots&&\vdots\\x_1&x_2&\cdots&x_N\\1&1&\cdots&1\end{bmatrix}_{(n+1)\times N},\qquad Y=\begin{bmatrix}y_1&y_2&\cdots&y_N\end{bmatrix}_{1\times N},\qquad R=\begin{bmatrix}a_1&a_2&\cdots&a_{n+1}\end{bmatrix}_{1\times(n+1)}$$

**ส่วนที่ใช้ร่วมกัน (Linear และ Polynomial)**

Matrix Form (แถวล่างสุดของ $X$ เป็น 1 เสมอ เรียงกำลังจากมากไปน้อย)

$$Y=RX$$

สูตรหา $R$

$$R=Y\,X^T(XX^T)^{-1}$$

กรณี $\det(XX^T)=0$ (ใช้แทนสูตรหา $R$) โดย $\varepsilon$ เป็นค่าเล็กๆ เช่น $0.1$

$$R=Y\,X^T(XX^T+\varepsilon I)^{-1}$$

Error (MAE, MSE) เมื่อ $\hat y$ คือค่าทำนาย

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|$$

$$\text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2$$

หา inverse

$$A^{-1}=\frac{\text{adj}A}{\det A}$$

$$2\times2:\quad A=\begin{bmatrix}p&q\\r&s\end{bmatrix},\qquad \det A=ps-qr,\qquad \text{adj}A=\begin{bmatrix}s&-q\\-r&p\end{bmatrix}$$

$$3\times3:\quad C_{ij}=(-1)^{i+j}M_{ij},\qquad \text{adj}A=C^T,\qquad \det A=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}$$

**K-NN Regression** ระยะ Manhattan

$$d(\vec a,\vec b)=\sum_{j=1}^{n}|a_j-b_j|$$

ข้อมูล 1 มิติ ($x$ ตัวเดียว) ได้ $d(x_q,x_i)=|x_q-x_i|$ แล้วทำนายด้วยค่าเฉลี่ยของ $y$ ของ $k$ จุดที่ใกล้ที่สุด

$$\hat y=\frac1k\sum_{i=1}^{k}y_i$$

---

## 1. Linear Regression

$y=ax+b$

### ตัวอย่างโจทย์

จากข้อมูลในตารางต่อไปนี้ จงหาเส้นตรง $y=ax+b$ ด้วยวิธีเมทริกซ์ ทำนายค่า $y$ เมื่อ $x=5$ และหา MAE และ MSE

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">2</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">3</td></tr>
  <tr><td align="center">3</td><td align="center">3</td><td align="center">6</td></tr>
  <tr><td align="center">4</td><td align="center">4</td><td align="center">5</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$R=Y\,X^T(XX^T)^{-1}$$

สร้าง $X$ และ $Y$

$$X=\begin{bmatrix}1&2&3&4\\1&1&1&1\end{bmatrix}_{2\times4},\qquad Y=\begin{bmatrix}2&3&6&5\end{bmatrix}_{1\times4}$$

หา $XX^T$

$$XX^T=\begin{bmatrix}1&2&3&4\\1&1&1&1\end{bmatrix}_{2\times4}\begin{bmatrix}1&1\\2&1\\3&1\\4&1\end{bmatrix}_{4\times2}=\begin{bmatrix}30&10\\10&4\end{bmatrix}_{2\times2}$$

หา $YX^T$

$$YX^T=\begin{bmatrix}2&3&6&5\end{bmatrix}_{1\times4}\begin{bmatrix}1&1\\2&1\\3&1\\4&1\end{bmatrix}_{4\times2}=\begin{bmatrix}46&16\end{bmatrix}_{1\times2}$$

หา $(XX^T)^{-1}$ จากสูตร $A^{-1}=\dfrac{\text{adj}A}{\det A}$ เมื่อ $A=\begin{bmatrix}p&q\\r&s\end{bmatrix}_{2\times2}$

$$\det(XX^T)=ps-qr=(30)(4)-(10)(10)=120-100=20$$

$$\text{adj}(XX^T)=\begin{bmatrix}s&-q\\-r&p\end{bmatrix}_{2\times2}=\begin{bmatrix}4&-10\\-10&30\end{bmatrix}_{2\times2}$$

$$(XX^T)^{-1}=\frac{\text{adj}(XX^T)}{\det(XX^T)}=\frac1{20}\begin{bmatrix}4&-10\\-10&30\end{bmatrix}_{2\times2}$$

แทนค่าในสูตร

$$R=\begin{bmatrix}46&16\end{bmatrix}_{1\times2}\cdot\frac1{20}\begin{bmatrix}4&-10\\-10&30\end{bmatrix}_{2\times2}=\frac1{20}\begin{bmatrix}46(4)+16(-10)&46(-10)+16(30)\end{bmatrix}_{1\times2}$$

$$=\frac1{20}\begin{bmatrix}24&20\end{bmatrix}_{1\times2}=\begin{bmatrix}1.2&1\end{bmatrix}_{1\times2}$$

ดังนั้น $a=1.2$, $b=1$

$$y=1.2x+1$$

ทำนายที่ $x=5$

$$\begin{array}{c|c}\textbf{แบบสมการ}&\textbf{แบบ Matrix Form}\\\hline\\[-6pt]\qquad\hat y=1.2(5)+1=7\qquad&\qquad\hat y=RX=\begin{bmatrix}1.2&1\end{bmatrix}_{1\times2}\begin{bmatrix}5\\1\end{bmatrix}_{2\times1}=\begin{bmatrix}1.2(5)+1(1)\end{bmatrix}_{1\times1}=\begin{bmatrix}7\end{bmatrix}_{1\times1}\qquad\end{array}$$

หา Error จาก $\hat y=1.2x+1$

<table align="center">
  <tr><th>x</th><th>y</th><th>ŷ</th><th>|y − ŷ|</th><th>(y − ŷ)²</th></tr>
  <tr><td align="center">1</td><td align="center">2</td><td align="center">2.2</td><td align="center">0.2</td><td align="center">0.04</td></tr>
  <tr><td align="center">2</td><td align="center">3</td><td align="center">3.4</td><td align="center">0.4</td><td align="center">0.16</td></tr>
  <tr><td align="center">3</td><td align="center">6</td><td align="center">4.6</td><td align="center">1.4</td><td align="center">1.96</td></tr>
  <tr><td align="center">4</td><td align="center">5</td><td align="center">5.8</td><td align="center">0.8</td><td align="center">0.64</td></tr>
  <tr><th>sum</th><td></td><td></td><td align="center"><b>2.8</b></td><td align="center"><b>2.8</b></td></tr>
</table>

แทนค่าในสูตร

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|=\frac{2.8}{4}=0.7$$

$$\text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2=\frac{2.8}{4}=0.7$$

**Ans** $y=1.2x+1$, $\hat y(5)=7$, $\text{MAE}=0.7$, $\text{MSE}=0.7$

---

### ตัวอย่างโจทย์: กรณี $\det=0$

จากข้อมูลในตารางต่อไปนี้ จงหาเส้นตรง $y=ax+b$ เมื่อกำหนด $\varepsilon=1$ ทำนายค่า $y$ เมื่อ $x=4$ และหา MAE และ MSE

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">2</td><td align="center">1</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">2</td></tr>
  <tr><td align="center">3</td><td align="center">2</td><td align="center">3</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$R=Y\,X^T(XX^T)^{-1}$$

สร้าง $X$ และ $Y$

$$X=\begin{bmatrix}2&2&2\\1&1&1\end{bmatrix}_{2\times3},\qquad Y=\begin{bmatrix}1&2&3\end{bmatrix}_{1\times3}$$

หา $XX^T$

$$XX^T=\begin{bmatrix}2&2&2\\1&1&1\end{bmatrix}_{2\times3}\begin{bmatrix}2&1\\2&1\\2&1\end{bmatrix}_{3\times2}=\begin{bmatrix}12&6\\6&3\end{bmatrix}_{2\times2}$$

ตรวจ $\det$

$$\det(XX^T)=(12)(3)-(6)(6)=36-36=0$$

$\det=0$ ไม่มี $(XX^T)^{-1}$ จึงใช้สูตร

$$R=Y\,X^T(XX^T+\varepsilon I)^{-1}$$

หา $YX^T$

$$YX^T=\begin{bmatrix}1&2&3\end{bmatrix}_{1\times3}\begin{bmatrix}2&1\\2&1\\2&1\end{bmatrix}_{3\times2}=\begin{bmatrix}12&6\end{bmatrix}_{1\times2}$$

หา $XX^T+\varepsilon I$ เมื่อ $\varepsilon=1$

$$XX^T+\varepsilon I=\begin{bmatrix}12&6\\6&3\end{bmatrix}_{2\times2}+\begin{bmatrix}1&0\\0&1\end{bmatrix}_{2\times2}=\begin{bmatrix}13&6\\6&4\end{bmatrix}_{2\times2}$$

หา $(XX^T+\varepsilon I)^{-1}$ จากสูตร $A^{-1}=\dfrac{\text{adj}A}{\det A}$ เมื่อ $A=\begin{bmatrix}p&q\\r&s\end{bmatrix}_{2\times2}$

$$\det(XX^T+\varepsilon I)=ps-qr=(13)(4)-(6)(6)=52-36=16$$

$$\text{adj}(XX^T+\varepsilon I)=\begin{bmatrix}s&-q\\-r&p\end{bmatrix}_{2\times2}=\begin{bmatrix}4&-6\\-6&13\end{bmatrix}_{2\times2}$$

$$(XX^T+\varepsilon I)^{-1}=\frac{\text{adj}(XX^T+\varepsilon I)}{\det(XX^T+\varepsilon I)}=\frac1{16}\begin{bmatrix}4&-6\\-6&13\end{bmatrix}_{2\times2}$$

แทนค่าในสูตร

$$R=\begin{bmatrix}12&6\end{bmatrix}_{1\times2}\cdot\frac1{16}\begin{bmatrix}4&-6\\-6&13\end{bmatrix}_{2\times2}=\frac1{16}\begin{bmatrix}12(4)+6(-6)&12(-6)+6(13)\end{bmatrix}_{1\times2}$$

$$=\frac1{16}\begin{bmatrix}12&6\end{bmatrix}_{1\times2}=\begin{bmatrix}0.75&0.375\end{bmatrix}_{1\times2}$$

ดังนั้น $a=0.75$, $b=0.375$

$$y=0.75x+0.375$$

ทำนายที่ $x=4$

$$\begin{array}{c|c}\textbf{แบบสมการ}&\textbf{แบบ Matrix Form}\\\hline\\[-6pt]\qquad\hat y=0.75(4)+0.375=3.375\qquad&\qquad\hat y=RX=\begin{bmatrix}0.75&0.375\end{bmatrix}_{1\times2}\begin{bmatrix}4\\1\end{bmatrix}_{2\times1}=\begin{bmatrix}0.75(4)+0.375(1)\end{bmatrix}_{1\times1}=\begin{bmatrix}3.375\end{bmatrix}_{1\times1}\qquad\end{array}$$

หา Error จาก $\hat y=0.75x+0.375$

<table align="center">
  <tr><th>x</th><th>y</th><th>ŷ</th><th>|y − ŷ|</th><th>(y − ŷ)²</th></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">1.875</td><td align="center">0.875</td><td align="center">0.765625</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">1.875</td><td align="center">0.125</td><td align="center">0.015625</td></tr>
  <tr><td align="center">2</td><td align="center">3</td><td align="center">1.875</td><td align="center">1.125</td><td align="center">1.265625</td></tr>
  <tr><th>sum</th><td></td><td></td><td align="center"><b>2.125</b></td><td align="center"><b>2.046875</b></td></tr>
</table>

แทนค่าในสูตร

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|=\frac{2.125}{3}\approx0.7083$$

$$\text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2=\frac{2.046875}{3}\approx0.6823$$

**Ans** $y=0.75x+0.375$, $\hat y(4)=3.375$, $\text{MAE}\approx0.7083$, $\text{MSE}\approx0.6823$

### แบบฝึกหัด 1

จากข้อมูลในตารางต่อไปนี้ จงหา $R$ ของ Linear Regression $y=ax+b$ ด้วยรูปแบบเมทริกซ์ แล้วทำนายค่า $y$ เมื่อ $x=4$ และหา MAE

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">2</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">3</td></tr>
  <tr><td align="center">3</td><td align="center">2</td><td align="center">8</td></tr>
  <tr><td align="center">4</td><td align="center">3</td><td align="center">9</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$R=Y\,X^T(XX^T)^{-1}$$

สร้าง $X$ และ $Y$

$$X=\begin{bmatrix}0&1&2&3\\1&1&1&1\end{bmatrix}_{2\times4},\qquad Y=\begin{bmatrix}2&3&8&9\end{bmatrix}_{1\times4}$$

หา $XX^T$

$$XX^T=\begin{bmatrix}0&1&2&3\\1&1&1&1\end{bmatrix}_{2\times4}\begin{bmatrix}0&1\\1&1\\2&1\\3&1\end{bmatrix}_{4\times2}=\begin{bmatrix}14&6\\6&4\end{bmatrix}_{2\times2}$$

หา $YX^T$

$$YX^T=\begin{bmatrix}2&3&8&9\end{bmatrix}_{1\times4}\begin{bmatrix}0&1\\1&1\\2&1\\3&1\end{bmatrix}_{4\times2}=\begin{bmatrix}46&22\end{bmatrix}_{1\times2}$$

หา $(XX^T)^{-1}$ จากสูตร $A^{-1}=\dfrac{\text{adj}A}{\det A}$ เมื่อ $A=\begin{bmatrix}p&q\\r&s\end{bmatrix}_{2\times2}$

$$\det(XX^T)=ps-qr=(14)(4)-(6)(6)=56-36=20$$

$$\text{adj}(XX^T)=\begin{bmatrix}s&-q\\-r&p\end{bmatrix}_{2\times2}=\begin{bmatrix}4&-6\\-6&14\end{bmatrix}_{2\times2}$$

$$(XX^T)^{-1}=\frac{\text{adj}(XX^T)}{\det(XX^T)}=\frac1{20}\begin{bmatrix}4&-6\\-6&14\end{bmatrix}_{2\times2}$$

แทนค่าในสูตร

$$R=\begin{bmatrix}46&22\end{bmatrix}_{1\times2}\cdot\frac1{20}\begin{bmatrix}4&-6\\-6&14\end{bmatrix}_{2\times2}=\frac1{20}\begin{bmatrix}46(4)+22(-6)&46(-6)+22(14)\end{bmatrix}_{1\times2}$$

$$=\frac1{20}\begin{bmatrix}52&32\end{bmatrix}_{1\times2}=\begin{bmatrix}2.6&1.6\end{bmatrix}_{1\times2}$$

ดังนั้น $a=2.6$, $b=1.6$

$$y=2.6x+1.6$$

ทำนายที่ $x=4$

$$\begin{array}{c|c}\textbf{แบบสมการ}&\textbf{แบบ Matrix Form}\\\hline\\[-6pt]\qquad\hat y=2.6(4)+1.6=12\qquad&\qquad\hat y=RX=\begin{bmatrix}2.6&1.6\end{bmatrix}_{1\times2}\begin{bmatrix}4\\1\end{bmatrix}_{2\times1}=\begin{bmatrix}2.6(4)+1.6(1)\end{bmatrix}_{1\times1}=\begin{bmatrix}12\end{bmatrix}_{1\times1}\qquad\end{array}$$

หา Error จาก $\hat y=2.6x+1.6$

<table align="center">
  <tr><th>x</th><th>y</th><th>ŷ</th><th>|y − ŷ|</th><th>(y − ŷ)²</th></tr>
  <tr><td align="center">0</td><td align="center">2</td><td align="center">1.6</td><td align="center">0.4</td><td align="center">0.16</td></tr>
  <tr><td align="center">1</td><td align="center">3</td><td align="center">4.2</td><td align="center">1.2</td><td align="center">1.44</td></tr>
  <tr><td align="center">2</td><td align="center">8</td><td align="center">6.8</td><td align="center">1.2</td><td align="center">1.44</td></tr>
  <tr><td align="center">3</td><td align="center">9</td><td align="center">9.4</td><td align="center">0.4</td><td align="center">0.16</td></tr>
  <tr><th>sum</th><td></td><td></td><td align="center"><b>3.2</b></td><td align="center"><b>3.2</b></td></tr>
</table>

แทนค่าในสูตร

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|=\frac{3.2}{4}=0.8$$

$$\text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2=\frac{3.2}{4}=0.8$$

**Ans** $y=2.6x+1.6$, $\hat y(4)=12$, $\text{MAE}=0.8$, $\text{MSE}=0.8$

### แบบฝึกหัด 2

จากข้อมูลในตารางต่อไปนี้ จงหา $R$ ของ Linear Regression $y=ax+b$ ด้วยรูปแบบเมทริกซ์ แล้วทำนายค่า $y$ เมื่อ $x=6$ และหา MAE

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">1</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">5</td></tr>
  <tr><td align="center">3</td><td align="center">4</td><td align="center">8</td></tr>
  <tr><td align="center">4</td><td align="center">5</td><td align="center">11</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$R=Y\,X^T(XX^T)^{-1}$$

สร้าง $X$ และ $Y$

$$X=\begin{bmatrix}1&2&4&5\\1&1&1&1\end{bmatrix}_{2\times4},\qquad Y=\begin{bmatrix}1&5&8&11\end{bmatrix}_{1\times4}$$

หา $XX^T$

$$XX^T=\begin{bmatrix}1&2&4&5\\1&1&1&1\end{bmatrix}_{2\times4}\begin{bmatrix}1&1\\2&1\\4&1\\5&1\end{bmatrix}_{4\times2}=\begin{bmatrix}46&12\\12&4\end{bmatrix}_{2\times2}$$

หา $YX^T$

$$YX^T=\begin{bmatrix}1&5&8&11\end{bmatrix}_{1\times4}\begin{bmatrix}1&1\\2&1\\4&1\\5&1\end{bmatrix}_{4\times2}=\begin{bmatrix}98&25\end{bmatrix}_{1\times2}$$

หา $(XX^T)^{-1}$ จากสูตร $A^{-1}=\dfrac{\text{adj}A}{\det A}$ เมื่อ $A=\begin{bmatrix}p&q\\r&s\end{bmatrix}_{2\times2}$

$$\det(XX^T)=ps-qr=(46)(4)-(12)(12)=184-144=40$$

$$\text{adj}(XX^T)=\begin{bmatrix}s&-q\\-r&p\end{bmatrix}_{2\times2}=\begin{bmatrix}4&-12\\-12&46\end{bmatrix}_{2\times2}$$

$$(XX^T)^{-1}=\frac{\text{adj}(XX^T)}{\det(XX^T)}=\frac1{40}\begin{bmatrix}4&-12\\-12&46\end{bmatrix}_{2\times2}$$

แทนค่าในสูตร

$$R=\begin{bmatrix}98&25\end{bmatrix}_{1\times2}\cdot\frac1{40}\begin{bmatrix}4&-12\\-12&46\end{bmatrix}_{2\times2}=\frac1{40}\begin{bmatrix}98(4)+25(-12)&98(-12)+25(46)\end{bmatrix}_{1\times2}$$

$$=\frac1{40}\begin{bmatrix}92&-26\end{bmatrix}_{1\times2}=\begin{bmatrix}2.3&-0.65\end{bmatrix}_{1\times2}$$

ดังนั้น $a=2.3$, $b=-0.65$

$$y=2.3x-0.65$$

ทำนายที่ $x=6$

$$\begin{array}{c|c}\textbf{แบบสมการ}&\textbf{แบบ Matrix Form}\\\hline\\[-6pt]\qquad\hat y=2.3(6)+-0.65=13.15\qquad&\qquad\hat y=RX=\begin{bmatrix}2.3&-0.65\end{bmatrix}_{1\times2}\begin{bmatrix}6\\1\end{bmatrix}_{2\times1}=\begin{bmatrix}2.3(6)+-0.65(1)\end{bmatrix}_{1\times1}=\begin{bmatrix}13.15\end{bmatrix}_{1\times1}\qquad\end{array}$$

หา Error จาก $\hat y=2.3x-0.65$

<table align="center">
  <tr><th>x</th><th>y</th><th>ŷ</th><th>|y − ŷ|</th><th>(y − ŷ)²</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">1.65</td><td align="center">0.65</td><td align="center">0.4225</td></tr>
  <tr><td align="center">2</td><td align="center">5</td><td align="center">3.95</td><td align="center">1.05</td><td align="center">1.1025</td></tr>
  <tr><td align="center">4</td><td align="center">8</td><td align="center">8.55</td><td align="center">0.55</td><td align="center">0.3025</td></tr>
  <tr><td align="center">5</td><td align="center">11</td><td align="center">10.85</td><td align="center">0.15</td><td align="center">0.0225</td></tr>
  <tr><th>sum</th><td></td><td></td><td align="center"><b>2.4</b></td><td align="center"><b>1.85</b></td></tr>
</table>

แทนค่าในสูตร

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|=\frac{2.4}{4}=0.6$$

$$\text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2=\frac{1.85}{4}=0.4625$$

**Ans** $y=2.3x-0.65$, $\hat y(6)=13.15$, $\text{MAE}=0.6$, $\text{MSE}=0.4625$

---

## 2. Nonlinear Regression (Polynomial)

$y=ax^2+bx+c$ (Degree 2)

### ตัวอย่างโจทย์

จากข้อมูลในตารางต่อไปนี้ จงหาพหุนาม Degree 2 ด้วยวิธีเมทริกซ์ ทำนายค่า $y$ เมื่อ $x=3$ และหา MAE และ MSE

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">-1</td><td align="center">-1</td></tr>
  <tr><td align="center">2</td><td align="center">0</td><td align="center">0</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">-2</td></tr>
  <tr><td align="center">4</td><td align="center">2</td><td align="center">3</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$R=Y\,X^T(XX^T)^{-1}$$

สร้าง $X$ และ $Y$

$$X=\begin{bmatrix}1&0&1&4\\-1&0&1&2\\1&1&1&1\end{bmatrix}_{3\times4},\qquad Y=\begin{bmatrix}-1&0&-2&3\end{bmatrix}_{1\times4}$$

หา $XX^T$

$$XX^T=\begin{bmatrix}1&0&1&4\\-1&0&1&2\\1&1&1&1\end{bmatrix}_{3\times4}\begin{bmatrix}1&-1&1\\0&0&1\\1&1&1\\4&2&1\end{bmatrix}_{4\times3}$$

$$=\begin{bmatrix}1+0+1+16&-1+0+1+8&1+0+1+4\\-1+0+1+8&1+0+1+4&-1+0+1+2\\1+0+1+4&-1+0+1+2&4\end{bmatrix}_{3\times3}=\begin{bmatrix}18&8&6\\8&6&2\\6&2&4\end{bmatrix}_{3\times3}$$

หา $YX^T$

$$YX^T=\begin{bmatrix}-1&0&-2&3\end{bmatrix}_{1\times4}\begin{bmatrix}1&-1&1\\0&0&1\\1&1&1\\4&2&1\end{bmatrix}_{4\times3}$$

$$=\begin{bmatrix}-1+0-2+12&1+0-2+6&-1+0-2+3\end{bmatrix}_{1\times3}=\begin{bmatrix}9&5&0\end{bmatrix}_{1\times3}$$

หา $(XX^T)^{-1}$ จากสูตร $A^{-1}=\dfrac{\text{adj}A}{\det A}$ เมื่อ $C_{ij}=(-1)^{i+j}M_{ij}$, $\text{adj}A=C^T$ และ $\det A=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}$

$$C_{11}=(6)(4)-(2)(2)=20,\quad C_{12}=-[(8)(4)-(2)(6)]=-20,\quad C_{13}=(8)(2)-(6)(6)=-20$$

$$C_{21}=-[(8)(4)-(6)(2)]=-20,\quad C_{22}=(18)(4)-(6)(6)=36,\quad C_{23}=-[(18)(2)-(8)(6)]=12$$

$$C_{31}=(8)(2)-(6)(6)=-20,\quad C_{32}=-[(18)(2)-(6)(8)]=12,\quad C_{33}=(18)(6)-(8)(8)=44$$

$$\det(XX^T)=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}=(18)(20)+(8)(-20)+(6)(-20)=80$$

$$\text{adj}(XX^T)=C^T=\begin{bmatrix}20&-20&-20\\-20&36&12\\-20&12&44\end{bmatrix}_{3\times3}$$

$$(XX^T)^{-1}=\frac{\text{adj}(XX^T)}{\det(XX^T)}=\frac1{80}\begin{bmatrix}20&-20&-20\\-20&36&12\\-20&12&44\end{bmatrix}_{3\times3}$$

แทนค่าในสูตร

$$R=\begin{bmatrix}9&5&0\end{bmatrix}_{1\times3}\cdot\frac1{80}\begin{bmatrix}20&-20&-20\\-20&36&12\\-20&12&44\end{bmatrix}_{3\times3}$$

$$=\frac1{80}\begin{bmatrix}9(20)+5(-20)+0(-20)&9(-20)+5(36)+0(12)&9(-20)+5(12)+0(44)\end{bmatrix}_{1\times3}$$

$$=\frac1{80}\begin{bmatrix}80&0&-120\end{bmatrix}_{1\times3}=\begin{bmatrix}1&0&-1.5\end{bmatrix}_{1\times3}$$

ดังนั้น $a=1$, $b=0$, $c=-1.5$

$$y=x^2-1.5$$

ทำนายที่ $x=3$

$$\begin{array}{c|c}\textbf{แบบสมการ}&\textbf{แบบ Matrix Form}\\\hline\\[-6pt]\qquad\hat y=(1)(3)^2+(0)(3)+-1.5=7.5\qquad&\qquad\hat y=RX=\begin{bmatrix}1&0&-1.5\end{bmatrix}_{1\times3}\begin{bmatrix}9\\3\\1\end{bmatrix}_{3\times1}=\begin{bmatrix}1(9)+0(3)+-1.5(1)\end{bmatrix}_{1\times1}=\begin{bmatrix}7.5\end{bmatrix}_{1\times1}\qquad\end{array}$$

หา Error จาก $\hat y=x^2-1.5$

<table align="center">
  <tr><th>x</th><th>y</th><th>ŷ</th><th>|y − ŷ|</th><th>(y − ŷ)²</th></tr>
  <tr><td align="center">-1</td><td align="center">-1</td><td align="center">-0.5</td><td align="center">0.5</td><td align="center">0.25</td></tr>
  <tr><td align="center">0</td><td align="center">0</td><td align="center">-1.5</td><td align="center">1.5</td><td align="center">2.25</td></tr>
  <tr><td align="center">1</td><td align="center">-2</td><td align="center">-0.5</td><td align="center">1.5</td><td align="center">2.25</td></tr>
  <tr><td align="center">2</td><td align="center">3</td><td align="center">2.5</td><td align="center">0.5</td><td align="center">0.25</td></tr>
  <tr><th>sum</th><td></td><td></td><td align="center"><b>4</b></td><td align="center"><b>5</b></td></tr>
</table>

แทนค่าในสูตร

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|=\frac{4}{4}=1$$

$$\text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2=\frac{5}{4}=1.25$$

**Ans** $y=x^2-1.5$, $\hat y(3)=7.5$, $\text{MAE}=1$, $\text{MSE}=1.25$

### แบบฝึกหัด 1

จากข้อมูลในตารางต่อไปนี้ จงหา $R$ ของ Polynomial Regression degree 2 $y=ax^2+bx+c$ ด้วยรูปแบบเมทริกซ์ แล้วทำนายค่า $y$ เมื่อ $x=4$ และหา MSE

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">6</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">2</td><td align="center">0</td></tr>
  <tr><td align="center">4</td><td align="center">3</td><td align="center">5</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$R=Y\,X^T(XX^T)^{-1}$$

สร้าง $X$ และ $Y$

$$X=\begin{bmatrix}0&1&4&9\\0&1&2&3\\1&1&1&1\end{bmatrix}_{3\times4},\qquad Y=\begin{bmatrix}6&1&0&5\end{bmatrix}_{1\times4}$$

หา $XX^T$

$$XX^T=\begin{bmatrix}0&1&4&9\\0&1&2&3\\1&1&1&1\end{bmatrix}_{3\times4}\begin{bmatrix}0&0&1\\1&1&1\\4&2&1\\9&3&1\end{bmatrix}_{4\times3}$$

$$=\begin{bmatrix}0+1+16+81&0+1+8+27&0+1+4+9\\0+1+8+27&0+1+4+9&0+1+2+3\\0+1+4+9&0+1+2+3&4\end{bmatrix}_{3\times3}=\begin{bmatrix}98&36&14\\36&14&6\\14&6&4\end{bmatrix}_{3\times3}$$

หา $YX^T$

$$YX^T=\begin{bmatrix}6&1&0&5\end{bmatrix}_{1\times4}\begin{bmatrix}0&0&1\\1&1&1\\4&2&1\\9&3&1\end{bmatrix}_{4\times3}$$

$$=\begin{bmatrix}0+1+0+45&0+1+0+15&6+1+0+5\end{bmatrix}_{1\times3}=\begin{bmatrix}46&16&12\end{bmatrix}_{1\times3}$$

หา $(XX^T)^{-1}$ จากสูตร $A^{-1}=\dfrac{\text{adj}A}{\det A}$ เมื่อ $C_{ij}=(-1)^{i+j}M_{ij}$, $\text{adj}A=C^T$ และ $\det A=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}$

$$C_{11}=(14)(4)-(6)(6)=20,\quad C_{12}=-[(36)(4)-(6)(14)]=-60,\quad C_{13}=(36)(6)-(14)(14)=20$$

$$C_{21}=-[(36)(4)-(14)(6)]=-60,\quad C_{22}=(98)(4)-(14)(14)=196,\quad C_{23}=-[(98)(6)-(36)(14)]=-84$$

$$C_{31}=(36)(6)-(14)(14)=20,\quad C_{32}=-[(98)(6)-(14)(36)]=-84,\quad C_{33}=(98)(14)-(36)(36)=76$$

$$\det(XX^T)=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}=(98)(20)+(36)(-60)+(14)(20)=80$$

$$\text{adj}(XX^T)=C^T=\begin{bmatrix}20&-60&20\\-60&196&-84\\20&-84&76\end{bmatrix}_{3\times3}$$

$$(XX^T)^{-1}=\frac{\text{adj}(XX^T)}{\det(XX^T)}=\frac1{80}\begin{bmatrix}20&-60&20\\-60&196&-84\\20&-84&76\end{bmatrix}_{3\times3}$$

แทนค่าในสูตร

$$R=\begin{bmatrix}46&16&12\end{bmatrix}_{1\times3}\cdot\frac1{80}\begin{bmatrix}20&-60&20\\-60&196&-84\\20&-84&76\end{bmatrix}_{3\times3}$$

$$=\frac1{80}\begin{bmatrix}46(20)+16(-60)+12(20)&46(-60)+16(196)+12(-84)&46(20)+16(-84)+12(76)\end{bmatrix}_{1\times3}$$

$$=\frac1{80}\begin{bmatrix}200&-632&488\end{bmatrix}_{1\times3}=\begin{bmatrix}2.5&-7.9&6.1\end{bmatrix}_{1\times3}$$

ดังนั้น $a=2.5$, $b=-7.9$, $c=6.1$

$$y=2.5x^2-7.9x+6.1$$

ทำนายที่ $x=4$

$$\begin{array}{c|c}\textbf{แบบสมการ}&\textbf{แบบ Matrix Form}\\\hline\\[-6pt]\qquad\hat y=(2.5)(4)^2+(-7.9)(4)+6.1=14.5\qquad&\qquad\hat y=RX=\begin{bmatrix}2.5&-7.9&6.1\end{bmatrix}_{1\times3}\begin{bmatrix}16\\4\\1\end{bmatrix}_{3\times1}=\begin{bmatrix}2.5(16)+-7.9(4)+6.1(1)\end{bmatrix}_{1\times1}=\begin{bmatrix}14.5\end{bmatrix}_{1\times1}\qquad\end{array}$$

หา Error จาก $\hat y=2.5x^2-7.9x+6.1$

<table align="center">
  <tr><th>x</th><th>y</th><th>ŷ</th><th>|y − ŷ|</th><th>(y − ŷ)²</th></tr>
  <tr><td align="center">0</td><td align="center">6</td><td align="center">6.1</td><td align="center">0.1</td><td align="center">0.01</td></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">0.7</td><td align="center">0.3</td><td align="center">0.09</td></tr>
  <tr><td align="center">2</td><td align="center">0</td><td align="center">0.3</td><td align="center">0.3</td><td align="center">0.09</td></tr>
  <tr><td align="center">3</td><td align="center">5</td><td align="center">4.9</td><td align="center">0.1</td><td align="center">0.01</td></tr>
  <tr><th>sum</th><td></td><td></td><td align="center"><b>0.8</b></td><td align="center"><b>0.2</b></td></tr>
</table>

แทนค่าในสูตร

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|=\frac{0.8}{4}=0.2$$

$$\text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2=\frac{0.2}{4}=0.05$$

**Ans** $y=2.5x^2-7.9x+6.1$, $\hat y(4)=14.5$, $\text{MAE}=0.2$, $\text{MSE}=0.05$

### แบบฝึกหัด 2

จากข้อมูลในตารางต่อไปนี้ จงหา $R$ ของ Polynomial Regression degree 2 $y=ax^2+bx+c$ ด้วยรูปแบบเมทริกซ์ แล้วทำนายค่า $y$ เมื่อ $x=2$ และหา MSE

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">-3</td><td align="center">0</td></tr>
  <tr><td align="center">2</td><td align="center">-1</td><td align="center">0</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">1</td></tr>
  <tr><td align="center">4</td><td align="center">3</td><td align="center">9</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$R=Y\,X^T(XX^T)^{-1}$$

สร้าง $X$ และ $Y$

$$X=\begin{bmatrix}9&1&1&9\\-3&-1&1&3\\1&1&1&1\end{bmatrix}_{3\times4},\qquad Y=\begin{bmatrix}0&0&1&9\end{bmatrix}_{1\times4}$$

หา $XX^T$

$$XX^T=\begin{bmatrix}9&1&1&9\\-3&-1&1&3\\1&1&1&1\end{bmatrix}_{3\times4}\begin{bmatrix}9&-3&1\\1&-1&1\\1&1&1\\9&3&1\end{bmatrix}_{4\times3}$$

$$=\begin{bmatrix}81+1+1+81&-27-1+1+27&9+1+1+9\\-27-1+1+27&9+1+1+9&-3-1+1+3\\9+1+1+9&-3-1+1+3&4\end{bmatrix}_{3\times3}=\begin{bmatrix}164&0&20\\0&20&0\\20&0&4\end{bmatrix}_{3\times3}$$

หา $YX^T$

$$YX^T=\begin{bmatrix}0&0&1&9\end{bmatrix}_{1\times4}\begin{bmatrix}9&-3&1\\1&-1&1\\1&1&1\\9&3&1\end{bmatrix}_{4\times3}$$

$$=\begin{bmatrix}0+0+1+81&0+0+1+27&0+0+1+9\end{bmatrix}_{1\times3}=\begin{bmatrix}82&28&10\end{bmatrix}_{1\times3}$$

หา $(XX^T)^{-1}$ จากสูตร $A^{-1}=\dfrac{\text{adj}A}{\det A}$ เมื่อ $C_{ij}=(-1)^{i+j}M_{ij}$, $\text{adj}A=C^T$ และ $\det A=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}$

$$C_{11}=(20)(4)-(0)(0)=80,\quad C_{12}=-[(0)(4)-(0)(20)]=0,\quad C_{13}=(0)(0)-(20)(20)=-400$$

$$C_{21}=-[(0)(4)-(20)(0)]=0,\quad C_{22}=(164)(4)-(20)(20)=256,\quad C_{23}=-[(164)(0)-(0)(20)]=0$$

$$C_{31}=(0)(0)-(20)(20)=-400,\quad C_{32}=-[(164)(0)-(20)(0)]=0,\quad C_{33}=(164)(20)-(0)(0)=3280$$

$$\det(XX^T)=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}=(164)(80)+(0)(0)+(20)(-400)=5120$$

$$\text{adj}(XX^T)=C^T=\begin{bmatrix}80&0&-400\\0&256&0\\-400&0&3280\end{bmatrix}_{3\times3}$$

$$(XX^T)^{-1}=\frac{\text{adj}(XX^T)}{\det(XX^T)}=\frac1{5120}\begin{bmatrix}80&0&-400\\0&256&0\\-400&0&3280\end{bmatrix}_{3\times3}$$

แทนค่าในสูตร

$$R=\begin{bmatrix}82&28&10\end{bmatrix}_{1\times3}\cdot\frac1{5120}\begin{bmatrix}80&0&-400\\0&256&0\\-400&0&3280\end{bmatrix}_{3\times3}$$

$$=\frac1{5120}\begin{bmatrix}82(80)+28(0)+10(-400)&82(0)+28(256)+10(0)&82(-400)+28(0)+10(3280)\end{bmatrix}_{1\times3}$$

$$=\frac1{5120}\begin{bmatrix}2560&7168&0\end{bmatrix}_{1\times3}=\begin{bmatrix}0.5&1.4&0\end{bmatrix}_{1\times3}$$

ดังนั้น $a=0.5$, $b=1.4$, $c=0$

$$y=0.5x^2+1.4x$$

ทำนายที่ $x=2$

$$\begin{array}{c|c}\textbf{แบบสมการ}&\textbf{แบบ Matrix Form}\\\hline\\[-6pt]\qquad\hat y=(0.5)(2)^2+(1.4)(2)+0=4.8\qquad&\qquad\hat y=RX=\begin{bmatrix}0.5&1.4&0\end{bmatrix}_{1\times3}\begin{bmatrix}4\\2\\1\end{bmatrix}_{3\times1}=\begin{bmatrix}0.5(4)+1.4(2)+0(1)\end{bmatrix}_{1\times1}=\begin{bmatrix}4.8\end{bmatrix}_{1\times1}\qquad\end{array}$$

หา Error จาก $\hat y=0.5x^2+1.4x$

<table align="center">
  <tr><th>x</th><th>y</th><th>ŷ</th><th>|y − ŷ|</th><th>(y − ŷ)²</th></tr>
  <tr><td align="center">-3</td><td align="center">0</td><td align="center">0.3</td><td align="center">0.3</td><td align="center">0.09</td></tr>
  <tr><td align="center">-1</td><td align="center">0</td><td align="center">-0.9</td><td align="center">0.9</td><td align="center">0.81</td></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">1.9</td><td align="center">0.9</td><td align="center">0.81</td></tr>
  <tr><td align="center">3</td><td align="center">9</td><td align="center">8.7</td><td align="center">0.3</td><td align="center">0.09</td></tr>
  <tr><th>sum</th><td></td><td></td><td align="center"><b>2.4</b></td><td align="center"><b>1.8</b></td></tr>
</table>

แทนค่าในสูตร

$$\text{MAE}=\frac1N\sum_{i=1}^{N}|y_i-\hat y_i|=\frac{2.4}{4}=0.6$$

$$\text{MSE}=\frac1N\sum_{i=1}^{N}(y_i-\hat y_i)^2=\frac{1.8}{4}=0.45$$

**Ans** $y=0.5x^2+1.4x$, $\hat y(2)=4.8$, $\text{MAE}=0.6$, $\text{MSE}=0.45$

---

## 3. K-NN Regression

$\hat y=\dfrac1k\sum_{i=1}^{k}y_i$ เมื่อ $y_i$ คือค่า $y$ ของ $k$ จุดที่ใกล้ที่สุด (ระยะ Manhattan)

### ตัวอย่างโจทย์

จากข้อมูลในตารางต่อไปนี้ จงทำนายค่า $y$ ของข้อมูลลำดับที่ 4 ด้วย K-NN Regression เมื่อ $k=1,2,3$

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">9</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">7</td></tr>
  <tr><td align="center">3</td><td align="center">8</td><td align="center">1</td></tr>
  <tr><td align="center">4</td><td align="center">4</td><td align="center">?</td></tr>
</table>

#### Sol<sup>n</sup>

ตาราง $D$ (Manhattan) ทำเฉพาะแถวที่ 4 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td align="center">D₄₁</td><td align="center">D₄₂</td><td align="center">D₄₃</td><td align="center">0</td></tr>
</table>

จากสูตร Manhattan

$$d(x_i,x_j)=|x_i-x_j|$$

โดย $x_4=4$

$$D_{41}=|x_4-x_1|=|4-1|=3$$

$$D_{42}=|x_4-x_2|=|4-2|=2$$

$$D_{43}=|x_4-x_3|=|4-8|=4$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td align="center">3</td><td align="center">2</td><td align="center">4</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{42}=2\ <\ D_{41}=3\ <\ D_{43}=4$$

เลือก $k$ ตัวแรก แล้วเฉลี่ยค่า $y$

- $k=1$: $2\to(\text{\textcircled{2}})\to(y=7)$ ดังนั้น $\hat y=7$
- $k=2$: $(2,3)\to(\text{\textcircled{2}},\text{\textcircled{1}})\to(y=7,9)$ ดังนั้น $\hat y=\dfrac{7+9}{2}=8$
- $k=3$: $(2,3,4)\to(\text{\textcircled{2}},\text{\textcircled{1}},\text{\textcircled{3}})\to(y=7,9,1)$ ดังนั้น $\hat y=\dfrac{7+9+1}{3}=5.6666666667$

**Ans** $k=1$ ได้ $\hat y=7$, $k=2$ ได้ $\hat y=8$, $k=3$ ได้ $\hat y=5.6666666667$

### แบบฝึกหัด 1

จากข้อมูลในตารางต่อไปนี้ จงทำนายค่า $y$ ของ $x=4$ ด้วย K-NN Regression เมื่อ $k=1,2,3$ (ระยะ $|x_q-x_i|$ และใช้ค่าเฉลี่ยของ $y$)

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">5</td><td align="center">11</td></tr>
  <tr><td align="center">2</td><td align="center">6</td><td align="center">3</td></tr>
  <tr><td align="center">3</td><td align="center">10</td><td align="center">4</td></tr>
</table>

#### Sol<sup>n</sup>

ตาราง $D$ (Manhattan) ทำเฉพาะแถวที่ 4 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td align="center">D₄₁</td><td align="center">D₄₂</td><td align="center">D₄₃</td><td align="center">0</td></tr>
</table>

จากสูตร Manhattan

$$d(x_i,x_j)=|x_i-x_j|$$

โดย $x_4=4$

$$D_{41}=|x_4-x_1|=|4-5|=1$$

$$D_{42}=|x_4-x_2|=|4-6|=2$$

$$D_{43}=|x_4-x_3|=|4-10|=6$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td align="center">1</td><td align="center">2</td><td align="center">6</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{41}=1\ <\ D_{42}=2\ <\ D_{43}=6$$

เลือก $k$ ตัวแรก แล้วเฉลี่ยค่า $y$

- $k=1$: $1\to(\text{\textcircled{1}})\to(y=11)$ ดังนั้น $\hat y=11$
- $k=2$: $(1,2)\to(\text{\textcircled{1}},\text{\textcircled{2}})\to(y=11,3)$ ดังนั้น $\hat y=\dfrac{11+3}{2}=7$
- $k=3$: $(1,2,6)\to(\text{\textcircled{1}},\text{\textcircled{2}},\text{\textcircled{3}})\to(y=11,3,4)$ ดังนั้น $\hat y=\dfrac{11+3+4}{3}=6$

**Ans** $k=1$ ได้ $\hat y=11$, $k=2$ ได้ $\hat y=7$, $k=3$ ได้ $\hat y=6$

### แบบฝึกหัด 2

จากข้อมูลในตารางต่อไปนี้ จงทำนายค่า $y$ ของ $x=9$ ด้วย K-NN Regression เมื่อ $k=1,2,3$ (ระยะ $|x_q-x_i|$ และใช้ค่าเฉลี่ยของ $y$)

<table align="center">
  <tr><th>#</th><th>x</th><th>y</th></tr>
  <tr><td align="center">1</td><td align="center">2</td><td align="center">11</td></tr>
  <tr><td align="center">2</td><td align="center">7</td><td align="center">11</td></tr>
  <tr><td align="center">3</td><td align="center">11</td><td align="center">9</td></tr>
</table>

#### Sol<sup>n</sup>

ตาราง $D$ (Manhattan) ทำเฉพาะแถวที่ 4 ที่สนใจ

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td align="center">D₄₁</td><td align="center">D₄₂</td><td align="center">D₄₃</td><td align="center">0</td></tr>
</table>

จากสูตร Manhattan

$$d(x_i,x_j)=|x_i-x_j|$$

โดย $x_4=9$

$$D_{41}=|x_4-x_1|=|9-2|=7$$

$$D_{42}=|x_4-x_2|=|9-7|=2$$

$$D_{43}=|x_4-x_3|=|9-11|=2$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>2</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>3</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
  <tr><th>4</th><td align="center">7</td><td align="center">2</td><td align="center">2</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{42}=2\ \le\ D_{43}=2\ <\ D_{41}=7$$

ค่าเท่ากันเรียงตามลำดับในตาราง

เลือก $k$ ตัวแรก แล้วเฉลี่ยค่า $y$

- $k=1$: $2\to(\text{\textcircled{2}})\to(y=11)$ ดังนั้น $\hat y=11$
- $k=2$: $(2,2)\to(\text{\textcircled{2}},\text{\textcircled{3}})\to(y=11,9)$ ดังนั้น $\hat y=\dfrac{11+9}{2}=10$
- $k=3$: $(2,2,7)\to(\text{\textcircled{2}},\text{\textcircled{3}},\text{\textcircled{1}})\to(y=11,9,11)$ ดังนั้น $\hat y=\dfrac{11+9+11}{3}=10.3333333333$

**Ans** $k=1$ ได้ $\hat y=11$, $k=2$ ได้ $\hat y=10$, $k=3$ ได้ $\hat y=10.3333333333$
