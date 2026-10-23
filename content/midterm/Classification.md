# Classification

**Classification (การจำแนกประเภท)** คือการทำนายค่า $Y$ ที่เป็น **ค่าไม่ต่อเนื่อง (Discrete)** จากข้อมูล $X$

---

## 1. K-NN

**ขั้นตอน**

1. คำนวณ distance จาก query ไปทุก sample
2. เรียงจากใกล้สุดไปไกลสุด (Cosine เรียงจากมากไปน้อย)
3. เลือก $k$ ตัวแรก
4. โหวต label เสียงข้างมาก (ถ้าเสมอกัน เลือกตัวแรก)

**สรุปสูตร**

Euclidean

$$d(\vec a,\vec b)=\|\vec a-\vec b\|_2=\sqrt{(a_1-b_1)^2+(a_2-b_2)^2+(a_3-b_3)^2}$$

Cosine

$$\cos\theta=\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}$$

Squared Euclidean

$$d^2(\vec a,\vec b)=\|\vec a-\vec b\|_2^2=(a_1-b_1)^2+(a_2-b_2)^2+(a_3-b_3)^2$$

Manhattan

$$d(\vec a,\vec b)=\|\vec a-\vec b\|_1=|a_1-b_1|+|a_2-b_2|+|a_3-b_3|$$

### 1.1 Euclidean

$$d(\vec a,\vec b)=\|\vec a-\vec b\|_2=\sqrt{(a_1-b_1)^2+(a_2-b_2)^2+(a_3-b_3)^2}$$

#### ตัวอย่างโจทย์

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Euclidean

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">0</td><td align="center">2</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">-1</td><td align="center">-3</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">3</td><td align="center">1</td><td align="center">0</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">0</td><td align="center">1</td><td align="center">1</td><td align="center">?</td></tr>
</table>

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

- $k=1$: $1.73\to(\text{\textcircled{1}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(1.73,3.16)\to(\text{\textcircled{1}},\text{\textcircled{3}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(1.73,3.16,4.90)\to(\text{\textcircled{1}},\text{\textcircled{3}},\text{\textcircled{2}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

### 1.2 Cosine

$$\cos\theta=\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}\qquad\left(\theta=\arccos\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}\right)$$

ค่า $\cos\theta$ มาก = ใกล้กัน (มุมเล็ก) จึงเลือกค่ามากสุด

#### ตัวอย่างโจทย์ 1

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Cosine

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">0</td><td align="center">2</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">-1</td><td align="center">-3</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">3</td><td align="center">1</td><td align="center">0</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">0</td><td align="center">1</td><td align="center">1</td><td align="center">?</td></tr>
</table>

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

- $k=1$: $0.63\to(\text{\textcircled{1}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(0.63,0.22)\to(\text{\textcircled{1}},\text{\textcircled{3}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(0.63,0.22,-0.76)\to(\text{\textcircled{1}},\text{\textcircled{3}},\text{\textcircled{2}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

#### ตัวอย่างโจทย์ 2

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Cosine

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">3</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">3</td><td align="center">2</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">2</td><td align="center">1</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">?</td></tr>
</table>

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

โดย $\vec x_4=[1,1,2]$ ได้ $|\vec x_4|=\sqrt{1+1+4}=\sqrt6$

$$D_{41}=\frac{\vec x_4\cdot\vec x_1}{|\vec x_4||\vec x_1|}=\frac{(1)(1)+(1)(2)+(2)(3)}{\sqrt6\,\sqrt{1+4+9}}=\frac{9}{\sqrt6\,\sqrt{14}}=\frac{9}{\sqrt{84}}\approx0.98$$

$$D_{42}=\frac{\vec x_4\cdot\vec x_2}{|\vec x_4||\vec x_2|}=\frac{(1)(3)+(1)(2)+(2)(1)}{\sqrt6\,\sqrt{9+4+1}}=\frac{7}{\sqrt6\,\sqrt{14}}=\frac{7}{\sqrt{84}}\approx0.76$$

$$D_{43}=\frac{\vec x_4\cdot\vec x_3}{|\vec x_4||\vec x_3|}=\frac{(1)(2)+(1)(1)+(2)(1)}{\sqrt6\,\sqrt{4+1+1}}=\frac{5}{\sqrt6\,\sqrt6}=\frac56\approx0.83$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">0.98</td><td align="center">0.76</td><td align="center">0.83</td><td align="center">1</td></tr>
</table>

Cosine ยิ่งมากยิ่งใกล้ จากตาราง $D$ แถวที่ 4 เรียงจากมากไปน้อย

$$D_{41}=0.98\ >\ D_{43}=0.83\ >\ D_{42}=0.76$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $0.98\to(\text{\textcircled{1}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(0.98,0.83)\to(\text{\textcircled{1}},\text{\textcircled{3}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(0.98,0.83,0.76)\to(\text{\textcircled{1}},\text{\textcircled{3}},\text{\textcircled{2}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

### 1.3 Squared Euclidean

$$d^2(\vec a,\vec b)=\|\vec a-\vec b\|_2^2=(a_1-b_1)^2+(a_2-b_2)^2+(a_3-b_3)^2$$

ไม่ต้องถอดราก เพราะ $x\propto\sqrt x$ ลำดับใกล้-ไกลไม่เปลี่ยน

#### ตัวอย่างโจทย์ 1

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Squared Euclidean

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">0</td><td align="center">2</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">-1</td><td align="center">-3</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">3</td><td align="center">1</td><td align="center">0</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">0</td><td align="center">1</td><td align="center">1</td><td align="center">?</td></tr>
</table>

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

- $k=1$: $3\to(\text{\textcircled{1}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(3,10)\to(\text{\textcircled{1}},\text{\textcircled{3}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(3,10,24)\to(\text{\textcircled{1}},\text{\textcircled{3}},\text{\textcircled{2}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

#### ตัวอย่างโจทย์ 2

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Squared Euclidean

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">3</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">3</td><td align="center">2</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">2</td><td align="center">1</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">?</td></tr>
</table>

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

โดย $\vec x_4=[1,1,2]$

$$D_{41}=\|\vec x_4-\vec x_1\|^2=(1-1)^2+(1-2)^2+(2-3)^2=0+1+1=2$$

$$D_{42}=\|\vec x_4-\vec x_2\|^2=(1-3)^2+(1-2)^2+(2-1)^2=4+1+1=6$$

$$D_{43}=\|\vec x_4-\vec x_3\|^2=(1-2)^2+(1-1)^2+(2-1)^2=1+0+1=2$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">2</td><td align="center">6</td><td align="center">2</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก (ค่าเท่ากันเรียงตามลำดับในตาราง)

$$D_{41}=2\ \le\ D_{43}=2\ <\ D_{42}=6$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $2\to(\text{\textcircled{1}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(2,2)\to(\text{\textcircled{1}},\text{\textcircled{3}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(2,2,6)\to(\text{\textcircled{1}},\text{\textcircled{3}},\text{\textcircled{2}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

### 1.4 Manhattan

$$d(\vec a,\vec b)=\|\vec a-\vec b\|_1=|a_1-b_1|+|a_2-b_2|+|a_3-b_3|$$

#### ตัวอย่างโจทย์

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Manhattan

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">0</td><td align="center">2</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">-1</td><td align="center">-3</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">3</td><td align="center">1</td><td align="center">0</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">0</td><td align="center">1</td><td align="center">1</td><td align="center">?</td></tr>
</table>

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

- $k=1$: $3\to(\text{\textcircled{1}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(3,4)\to(\text{\textcircled{1}},\text{\textcircled{3}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(3,4,8)\to(\text{\textcircled{1}},\text{\textcircled{3}},\text{\textcircled{2}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

## 2. Perceptron

**โมเดล** ($x$ มีเลข 1 ต่อท้ายสำหรับ bias และ $w$ มี $b$ ต่อท้าย)

$$x=\begin{bmatrix}A_1&A_2&\cdots&A_n&1\end{bmatrix}_{1\times(n+1)},\qquad w=\begin{bmatrix}w_1&w_2&\cdots&w_n&b\end{bmatrix}_{1\times(n+1)}$$

$$x\cdot w>0\ \Rightarrow\ +1,\qquad x\cdot w\le0\ \Rightarrow\ -1$$

**เตรียมข้อมูล** ถ้า target เป็น $-1$ ให้คูณ $x$ ด้วย $-1$ (เป็น $y\cdot x$) เพื่อให้ทุกจุดถูกเมื่อ $x\cdot w>0$

$$x_i\leftarrow y_i\,x_i$$

**Perceptron Learning** วนตรวจทุกจุดจนไม่มีจุดผิด

$$x_i\cdot w\le0\ \Rightarrow\ w\leftarrow w+x_i$$

ถ้าโจทย์ให้ learning rate $\eta$ ใช้

$$w\leftarrow\eta\,(w+x_i)$$

**สมการแบ่งกลุ่ม (Hyperplane)**

$$w_1A_1+w_2A_2+\dots+w_nA_n+b=0$$

### ตัวอย่างโจทย์ 1

จากข้อมูลในตารางต่อไปนี้ จงหา $w$ และ $b$ ของ Perceptron เมื่อเริ่มจาก $w_0=\begin{bmatrix}0&0&0&0\end{bmatrix}$

<table align="center">
  <tr><th>#</th><th>a₁</th><th>a₂</th><th>a₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">1</td><td align="center">0</td><td align="center">+1</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">2</td><td align="center">1</td><td align="center">+1</td></tr>
  <tr><td align="center">3</td><td align="center">0</td><td align="center">-1</td><td align="center">-3</td><td align="center">-1</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$x_i\cdot w\le0\ \Rightarrow\ w\leftarrow w+x_i$$

สร้าง $x_i$ (ต่อท้ายด้วย 1 และคูณ $y_i$)

$$x_1=\begin{bmatrix}1&1&0&1\end{bmatrix}_{1\times4},\qquad x_2=\begin{bmatrix}2&2&1&1\end{bmatrix}_{1\times4},\qquad x_3=(-1)\begin{bmatrix}0&-1&-3&1\end{bmatrix}=\begin{bmatrix}0&1&3&-1\end{bmatrix}_{1\times4}$$

เริ่มที่ $w_0=\begin{bmatrix}0&0&0&0\end{bmatrix}$

$$x_1\cdot w_0=0\ \le0\ \times$$

$$w_1=w_0+x_1=\begin{bmatrix}0&0&0&0\end{bmatrix}+\begin{bmatrix}1&1&0&1\end{bmatrix}=\begin{bmatrix}1&1&0&1\end{bmatrix}$$

ตรวจด้วย $w_1$

$$x_1\cdot w_1=(1)(1)+(1)(1)+(0)(0)+(1)(1)=3\ \checkmark$$

$$x_2\cdot w_1=(2)(1)+(2)(1)+(1)(0)+(1)(1)=5\ \checkmark$$

$$x_3\cdot w_1=(0)(1)+(1)(1)+(3)(0)+(-1)(1)=0\ \le0\ \times$$

$$w_2=w_1+x_3=\begin{bmatrix}1&1&0&1\end{bmatrix}+\begin{bmatrix}0&1&3&-1\end{bmatrix}=\begin{bmatrix}1&2&3&0\end{bmatrix}$$

ตรวจด้วย $w_2$

$$x_1\cdot w_2=(1)(1)+(1)(2)+(0)(3)+(1)(0)=3\ \checkmark$$

$$x_2\cdot w_2=(2)(1)+(2)(2)+(1)(3)+(1)(0)=9\ \checkmark$$

$$x_3\cdot w_2=(0)(1)+(1)(2)+(3)(3)+(-1)(0)=11\ \checkmark$$

ถูกทุกจุด จึงหยุด

ดังนั้น $w=\begin{bmatrix}1&2&3\end{bmatrix}$ และ $b=0$

**Ans** $w=[1\ \ 2\ \ 3]$, $b=0$ สมการแบ่งกลุ่ม $a_1+2a_2+3a_3=0$

---

### ตัวอย่างโจทย์ 2

จากข้อมูลในตารางต่อไปนี้ จงหา $w$ และ $b$ ของ Perceptron เมื่อ $\eta=0.2$ และเริ่มจาก $w_0=\begin{bmatrix}-1&0&1&1\end{bmatrix}$

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Y</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">1</td><td align="center">0</td><td align="center">+</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">3</td><td align="center">1</td><td align="center">+</td></tr>
  <tr><td align="center">3</td><td align="center">3</td><td align="center">2</td><td align="center">2</td><td align="center">+</td></tr>
  <tr><td align="center">4</td><td align="center">-8</td><td align="center">-5</td><td align="center">3</td><td align="center">−</td></tr>
  <tr><td align="center">5</td><td align="center">-7</td><td align="center">-6</td><td align="center">1</td><td align="center">−</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$x_i\cdot w\le0\ \Rightarrow\ w\leftarrow\eta\,(w+x_i)$$

สร้าง $x_i$ (ต่อท้ายด้วย 1 และคูณ $y_i$)

$$x_1=\begin{bmatrix}1&1&0&1\end{bmatrix}_{1\times4},\qquad x_2=\begin{bmatrix}2&3&1&1\end{bmatrix}_{1\times4},\qquad x_3=\begin{bmatrix}3&2&2&1\end{bmatrix}_{1\times4}$$

$$x_4=(-1)\begin{bmatrix}-8&-5&3&1\end{bmatrix}=\begin{bmatrix}8&5&-3&-1\end{bmatrix}_{1\times4},\qquad x_5=(-1)\begin{bmatrix}-7&-6&1&1\end{bmatrix}=\begin{bmatrix}7&6&-1&-1\end{bmatrix}_{1\times4}$$

เริ่มที่ $w_0=\begin{bmatrix}-1&0&1&1\end{bmatrix}$

$$x_1\cdot w_0=(1)(-1)+(1)(0)+(0)(1)+(1)(1)=0\ \le0\ \times$$

$$w_1=\eta\,(w_0+x_1)=0.2\left(\begin{bmatrix}-1&0&1&1\end{bmatrix}+\begin{bmatrix}1&1&0&1\end{bmatrix}\right)=0.2\begin{bmatrix}0&1&1&2\end{bmatrix}=\begin{bmatrix}0&0.2&0.2&0.4\end{bmatrix}$$

ตรวจด้วย $w_1$

$$x_1\cdot w_1=0+0.2+0+0.4=0.6\ \checkmark$$

$$x_2\cdot w_1=0+0.6+0.2+0.4=1.2\ \checkmark$$

$$x_3\cdot w_1=0+0.4+0.4+0.4=1.2\ \checkmark$$

$$x_4\cdot w_1=0+1.0-0.6-0.4=0\ \le0\ \times$$

$$w_2=\eta\,(w_1+x_4)=0.2\left(\begin{bmatrix}0&0.2&0.2&0.4\end{bmatrix}+\begin{bmatrix}8&5&-3&-1\end{bmatrix}\right)=0.2\begin{bmatrix}8&5.2&-2.8&-0.6\end{bmatrix}=\begin{bmatrix}1.6&1.04&-0.56&-0.12\end{bmatrix}$$

ตรวจด้วย $w_2$

$$x_1\cdot w_2=1.6+1.04+0-0.12=2.52\ \checkmark$$

$$x_2\cdot w_2=3.2+3.12-0.56-0.12=5.64\ \checkmark$$

$$x_3\cdot w_2=4.8+2.08-1.12-0.12=5.64\ \checkmark$$

$$x_4\cdot w_2=12.8+5.2+1.68+0.12=19.8\ \checkmark$$

$$x_5\cdot w_2=11.2+6.24+0.56+0.12=18.12\ \checkmark$$

ถูกทุกจุด จึงหยุด

ดังนั้น $w=\begin{bmatrix}1.6&1.04&-0.56\end{bmatrix}$ และ $b=-0.12$

**Ans** $w=[1.6\ \ 1.04\ \ -0.56]$, $b=-0.12$ สมการแบ่งกลุ่ม $1.6A_1+1.04A_2-0.56A_3-0.12=0$

---

## 3. FFBP

**Sigmoid**

$$\sigma(x)=\frac1{1+e^{-x}},\qquad \sigma'(x)=\sigma(x)\,(1-\sigma(x))$$

**Forward** (matrix form: $X$ แถวละ 1 ตัวอย่าง, $W$ แถวละ 1 unit, ชั้นถัดไปใช้ $o$ ของชั้นก่อนเป็น $X$, $o$ ของ Hidden เขียนเป็น $O_h$)

$$o=\sigma\left(\sum wx\right)=\sigma(XW^T)$$

**Backward** ($\delta$ ของ Output unit $k$ และ Hidden unit $h$)

$$\delta_k=o_k(1-o_k)(t_k-o_k)$$

$$\delta_h=o_h(1-o_h)\sum_{k}w_{kh}\,\delta_k$$

matrix form: $\delta_o=o\odot(1-o)\odot(T-o)$, $\delta_h=O_h\odot(1-O_h)\odot(\delta_oW_o)$

**Update** ($x$ คือค่าที่เข้า weight นั้น: weight ของ Output ใช้ $O_h$, weight ของ Hidden ใช้ input $X$)

$$w'=w+\eta\,\delta\,x$$

matrix form: $W_o'=W_o+\eta\,\delta_o^T\,O_h$, $W_h'=W_h+\eta\,\delta_h^T\,X$

**จำนวนพารามิเตอร์** โครงข่าย $n_0-n_1-\dots-n_L$ ($n_0$ = input, $n_L$ = output, bias 1 ตัวต่อ 1 node)

$$\#P=\underbrace{\sum_{l=1}^{L}n_{l-1}n_l}_{\text{weight}}+\underbrace{\sum_{l=1}^{L}n_l}_{\text{bias}}$$

2-2-1

$$\text{weight}=2(2)+2(1)=4+2=6,\qquad \text{bias}=2+1=3,\qquad \#P=6+3=9$$

4-8-6-2

$$\text{weight}=4(8)+8(6)+6(2)=32+48+12=92,\qquad \text{bias}=8+6+2=16,\qquad \#P=92+16=108$$

10-2-5-6-8

$$\text{weight}=10(2)+2(5)+5(6)+6(8)=20+10+30+48=108,\qquad \text{bias}=2+5+6+8=21,\qquad \#P=108+21=129$$

**ขนาด input / output** ของโครงข่ายจากตารางข้อมูล

- input = จำนวน attribute (attribute หมวดหมู่ที่มี $N$ ค่า แปลงเป็น $N-1$ ตัว)
- output = จำนวน class (target 2 ค่าใช้ 1 ตัว)

### ตัวอย่างโจทย์

จากโครงข่าย 2-2-1 ดังรูป (ใช้ sigmoid ทุกชั้น bias เป็น 0 และค่า $w_1$ ถึง $w_6$ ดังรูป) และข้อมูลในตารางต่อไปนี้ จงปรับ weight ทั้งหมด ($w_1$ ถึง $w_6$) ด้วย Backpropagation 1 ครั้ง (ใช้ทั้ง 2 ตัวอย่างพร้อมกัน) เมื่อ $\eta=0.1$

<div align="center">
<svg viewBox="0 0 480 285" width="480" role="img" aria-label="โครงข่าย 2-2-1 พร้อมค่า weight" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" fill="currentColor"/></marker></defs>
<line x1="90.0" y1="230.0" x2="90.0" y2="163.0" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr)"/>
<line x1="108.2" y1="241.7" x2="309.1" y2="149.6" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr)"/>
<line x1="311.8" y1="241.7" x2="110.9" y2="149.6" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr)"/>
<line x1="330.0" y1="230.0" x2="330.0" y2="163.0" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr)"/>
<line x1="105.4" y1="127.2" x2="192.3" y2="54.7" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr)"/>
<line x1="314.6" y1="127.2" x2="227.7" y2="54.7" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr)"/>
<circle cx="90" cy="250" r="20" fill="none" stroke="currentColor" stroke-width="2"/><text x="90" y="255" text-anchor="middle" font-size="15" fill="currentColor">x₁</text>
<circle cx="330" cy="250" r="20" fill="none" stroke="currentColor" stroke-width="2"/><text x="330" y="255" text-anchor="middle" font-size="15" fill="currentColor">x₂</text>
<circle cx="90" cy="140" r="20" fill="none" stroke="currentColor" stroke-width="2"/><text x="90" y="145" text-anchor="middle" font-size="15" fill="currentColor">h₁</text>
<circle cx="330" cy="140" r="20" fill="none" stroke="currentColor" stroke-width="2"/><text x="330" y="145" text-anchor="middle" font-size="15" fill="currentColor">h₂</text>
<circle cx="210" cy="40" r="20" fill="none" stroke="currentColor" stroke-width="2"/><text x="210" y="45" text-anchor="middle" font-size="15" fill="currentColor">o</text>
<text x="368" y="255" text-anchor="start" font-size="14" fill="currentColor">Input</text>
<text x="368" y="145" text-anchor="start" font-size="14" fill="currentColor">Hidden (ชั้น 1)</text>
<text x="250" y="45" text-anchor="start" font-size="14" fill="currentColor">Output (ชั้น 2)</text>
<text x="80" y="200" text-anchor="end" font-size="14" fill="currentColor">w₃ = 0.5</text>
<text x="340" y="200" text-anchor="start" font-size="14" fill="currentColor">w₆ = 0.4</text>
<text x="140" y="244" text-anchor="start" font-size="14" fill="currentColor">w₅ = 0.3</text>
<text x="280" y="244" text-anchor="end" font-size="14" fill="currentColor">w₄ = 0.2</text>
<text x="140" y="95" text-anchor="end" font-size="14" fill="currentColor">w₁ = 0.1</text>
<text x="280" y="95" text-anchor="start" font-size="14" fill="currentColor">w₂ = 0.2</text>
</svg>
</div>

<table align="center">
  <tr><th></th><th>x₁</th><th>x₂</th><th>Y</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">1</td><td align="center">1</td></tr>
  <tr><td align="center">2</td><td align="center">-1</td><td align="center">-1</td><td align="center">0</td></tr>
</table>

#### Sol<sup>n</sup>

**1. Forward** จากสูตร

$$o=\sigma(XW^T),\qquad \sigma(x)=\frac{1}{1+e^{-x}}$$

เขียนเป็นเมทริกซ์ (1 ตัวอย่าง = 1 แถว, $o$ ของ Hidden เขียนเป็น $O_h$)

$$X=\begin{bmatrix}1&1\\-1&-1\end{bmatrix}_{2\times2},\quad T=\begin{bmatrix}1\\0\end{bmatrix}_{2\times1},\quad W_h=\begin{bmatrix}w_3&w_4\\w_5&w_6\end{bmatrix}=\begin{bmatrix}0.5&0.2\\0.3&0.4\end{bmatrix}_{2\times2},\quad W_o=\begin{bmatrix}w_1&w_2\end{bmatrix}=\begin{bmatrix}0.1&0.2\end{bmatrix}_{1\times2}$$

Hidden

$$O_h=\sigma(XW_h^T)=\sigma\left(\begin{bmatrix}1&1\\-1&-1\end{bmatrix}_{2\times2}\begin{bmatrix}0.5&0.3\\0.2&0.4\end{bmatrix}_{2\times2}\right)=\sigma\left(\begin{bmatrix}0.7&0.7\\-0.7&-0.7\end{bmatrix}\right)=\begin{bmatrix}0.67&0.67\\0.33&0.33\end{bmatrix}_{2\times2}$$

Output

$$o=\sigma(O_hW_o^T)=\sigma\left(\begin{bmatrix}0.67&0.67\\0.33&0.33\end{bmatrix}_{2\times2}\begin{bmatrix}0.1\\0.2\end{bmatrix}_{2\times1}\right)=\sigma\left(\begin{bmatrix}0.201\\0.099\end{bmatrix}\right)=\begin{bmatrix}0.55\\0.52\end{bmatrix}_{2\times1}$$

$$T-o=\begin{bmatrix}1\\0\end{bmatrix}-\begin{bmatrix}0.55\\0.52\end{bmatrix}=\begin{bmatrix}0.45\\-0.52\end{bmatrix}_{2\times1}$$

ดังนั้น

<table align="center">
  <tr><th></th><th>x₁</th><th>x₂</th><th>Y</th><th>Output</th><th>t − o</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">1</td><td align="center">1</td><td align="center">0.55</td><td align="center">0.45</td></tr>
  <tr><td align="center">2</td><td align="center">-1</td><td align="center">-1</td><td align="center">0</td><td align="center">0.52</td><td align="center">-0.52</td></tr>
</table>

**2. Backward** จากสูตร ($\odot$ = คูณทีละช่อง, ใช้ $W_o$ ค่าเดิมก่อนปรับ)

$$\delta_o=o\odot(1-o)\odot(T-o),\qquad \delta_h=O_h\odot(1-O_h)\odot(\delta_oW_o)$$

Output

$$\delta_o=\begin{bmatrix}0.55(1-0.55)(0.45)\\0.52(1-0.52)(-0.52)\end{bmatrix}=\begin{bmatrix}0.11\\-0.13\end{bmatrix}_{2\times1}$$

Hidden

$$\delta_oW_o=\begin{bmatrix}0.11\\-0.13\end{bmatrix}_{2\times1}\begin{bmatrix}0.1&0.2\end{bmatrix}_{1\times2}=\begin{bmatrix}0.011&0.022\\-0.013&-0.026\end{bmatrix}_{2\times2}$$

$$O_h\odot(1-O_h)=\begin{bmatrix}0.67(0.33)&0.67(0.33)\\0.33(0.67)&0.33(0.67)\end{bmatrix}=\begin{bmatrix}0.2211&0.2211\\0.2211&0.2211\end{bmatrix}_{2\times2}$$

$$\delta_h=\begin{bmatrix}0.2211&0.2211\\0.2211&0.2211\end{bmatrix}\odot\begin{bmatrix}0.011&0.022\\-0.013&-0.026\end{bmatrix}=\begin{bmatrix}0.0024&0.0049\\-0.0029&-0.0057\end{bmatrix}_{2\times2}$$

**3. Update** จากสูตร ($x$ คือค่าที่เข้า weight นั้น)

$$W_o'=W_o+\eta\,\delta_o^T\,O_h,\qquad W_h'=W_h+\eta\,\delta_h^T\,X$$

Output ($x=O_h$)

$$W_o'=\begin{bmatrix}0.1&0.2\end{bmatrix}_{1\times2}+0.1\begin{bmatrix}0.11&-0.13\end{bmatrix}_{1\times2}\begin{bmatrix}0.67&0.67\\0.33&0.33\end{bmatrix}_{2\times2}$$

$$=\begin{bmatrix}0.1&0.2\end{bmatrix}+0.1\begin{bmatrix}0.11(0.67)-0.13(0.33)&0.11(0.67)-0.13(0.33)\end{bmatrix}=\begin{bmatrix}0.1&0.2\end{bmatrix}+0.1\begin{bmatrix}0.0308&0.0308\end{bmatrix}$$

$$=\begin{bmatrix}0.1&0.2\end{bmatrix}+\begin{bmatrix}0.0031&0.0031\end{bmatrix}=\begin{bmatrix}0.1031&0.2031\end{bmatrix}_{1\times2}$$

Hidden ($x=X$)

$$W_h'=\begin{bmatrix}0.5&0.2\\0.3&0.4\end{bmatrix}_{2\times2}+0.1\begin{bmatrix}0.0024&-0.0029\\0.0049&-0.0057\end{bmatrix}_{2\times2}\begin{bmatrix}1&1\\-1&-1\end{bmatrix}_{2\times2}$$

$$=\begin{bmatrix}0.5&0.2\\0.3&0.4\end{bmatrix}+0.1\begin{bmatrix}0.0024+0.0029&0.0024+0.0029\\0.0049+0.0057&0.0049+0.0057\end{bmatrix}=\begin{bmatrix}0.5&0.2\\0.3&0.4\end{bmatrix}+0.1\begin{bmatrix}0.0053&0.0053\\0.0106&0.0106\end{bmatrix}$$

$$=\begin{bmatrix}0.5&0.2\\0.3&0.4\end{bmatrix}+\begin{bmatrix}0.0005&0.0005\\0.0011&0.0011\end{bmatrix}=\begin{bmatrix}0.5005&0.2005\\0.3011&0.4011\end{bmatrix}_{2\times2}$$

**Ans** $w_1=0.1031$, $w_2=0.2031$, $w_3=0.5005$, $w_4=0.2005$, $w_5=0.3011$, $w_6=0.4011$

---

## 4. ID3

**โครงสร้างข้อมูลของต้นไม้** เก็บเป็นตาราง 4 คอลัมน์ 1 แถวต่อ 1 node

- **id** = เลขแถว (เรียงตามชั้น จากบนลงล่าง ซ้ายไปขวา)
- **Parent** = id ของ node แม่ (ราก = 0)
- **Node** = ชื่อ attribute หรือ class
- **Branch** = ค่าบนกิ่งที่มาจากแม่ (ราก ไม่มี ใช้ —)

**Entropy และ Information Gain** (log ฐาน 10, $p_c$ = สัดส่วนของ class $c$ ใน $S$)

$$\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c$$

$$\text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)$$

**ขั้นตอน** เลือก attribute ที่ Gain มากที่สุดเป็น node แล้วแบ่งข้อมูลตามค่าของ attribute นั้น ทำซ้ำในแต่ละกิ่ง (ไม่ใช้ attribute เดิม) จนกลุ่มบริสุทธิ์ (Entropy = 0) เป็น leaf

### ตัวอย่างโจทย์ 1

จากต้นไม้ในรูป (ตัวเลขในวงเล็บคือค่าบนกิ่ง) จงเขียนโครงสร้างข้อมูลแบบตาราง (id, Parent, Node, Branch)

<div align="center">
<svg viewBox="0 0 520 310" width="520" role="img" aria-label="ต้นไม้ A ถึง J พร้อมค่าบนกิ่ง" xmlns="http://www.w3.org/2000/svg">
<line x1="230" y1="58" x2="100" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="154" y="84" text-anchor="end" font-size="13" fill="currentColor">1</text>
<line x1="230" y1="58" x2="220" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="214" y="84" text-anchor="end" font-size="13" fill="currentColor">2</text>
<line x1="230" y1="58" x2="360" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="306" y="84" text-anchor="start" font-size="13" fill="currentColor">3</text>
<line x1="100" y1="138" x2="60" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="69" y="164" text-anchor="end" font-size="13" fill="currentColor">8</text>
<line x1="100" y1="138" x2="140" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="131" y="164" text-anchor="start" font-size="13" fill="currentColor">9</text>
<line x1="360" y1="138" x2="300" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="319" y="164" text-anchor="end" font-size="13" fill="currentColor">4</text>
<line x1="360" y1="138" x2="420" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="401" y="164" text-anchor="start" font-size="13" fill="currentColor">5</text>
<line x1="420" y1="218" x2="380" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="389" y="244" text-anchor="end" font-size="13" fill="currentColor">6</text>
<line x1="420" y1="218" x2="460" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="451" y="244" text-anchor="start" font-size="13" fill="currentColor">7</text>
<circle cx="230" cy="40" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="230" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
<circle cx="100" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="100" y="125" text-anchor="middle" font-size="15" fill="currentColor">B</text>
<circle cx="220" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="220" y="125" text-anchor="middle" font-size="15" fill="currentColor">C</text>
<circle cx="360" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="360" y="125" text-anchor="middle" font-size="15" fill="currentColor">D</text>
<circle cx="60" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="60" y="205" text-anchor="middle" font-size="15" fill="currentColor">I</text>
<circle cx="140" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="140" y="205" text-anchor="middle" font-size="15" fill="currentColor">J</text>
<circle cx="300" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="300" y="205" text-anchor="middle" font-size="15" fill="currentColor">E</text>
<circle cx="420" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="420" y="205" text-anchor="middle" font-size="15" fill="currentColor">F</text>
<circle cx="380" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="380" y="285" text-anchor="middle" font-size="15" fill="currentColor">G</text>
<circle cx="460" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="460" y="285" text-anchor="middle" font-size="15" fill="currentColor">H</text>
</svg>
</div>

#### Sol<sup>n</sup>

ให้ id ตามชั้น จากบนลงล่าง ซ้ายไปขวา

- ชั้น 1: A = 1
- ชั้น 2: B = 2, C = 3, D = 4
- ชั้น 3: I = 5, J = 6 (ลูกของ B), E = 7, F = 8 (ลูกของ D)
- ชั้น 4: G = 9, H = 10 (ลูกของ F)

เติม Parent = id ของแม่ และ Branch = ค่าบนกิ่งที่ลงมาหา node นั้น

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">B</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">C</td><td align="center">2</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">D</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">I</td><td align="center">8</td></tr>
  <tr><td align="center">6</td><td align="center">2</td><td align="center">J</td><td align="center">9</td></tr>
  <tr><td align="center">7</td><td align="center">4</td><td align="center">E</td><td align="center">4</td></tr>
  <tr><td align="center">8</td><td align="center">4</td><td align="center">F</td><td align="center">5</td></tr>
  <tr><td align="center">9</td><td align="center">8</td><td align="center">G</td><td align="center">6</td></tr>
  <tr><td align="center">10</td><td align="center">8</td><td align="center">H</td><td align="center">7</td></tr>
</table>

**Ans** ตารางข้างบน

---

### ตัวอย่างโจทย์ 2

จากตารางโครงสร้างข้อมูลของต้นไม้ต่อไปนี้ จงวาดต้นไม้

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">B</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">C</td><td align="center">2</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">D</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">I</td><td align="center">8</td></tr>
  <tr><td align="center">6</td><td align="center">2</td><td align="center">J</td><td align="center">9</td></tr>
  <tr><td align="center">7</td><td align="center">4</td><td align="center">E</td><td align="center">4</td></tr>
  <tr><td align="center">8</td><td align="center">4</td><td align="center">F</td><td align="center">5</td></tr>
  <tr><td align="center">9</td><td align="center">8</td><td align="center">G</td><td align="center">6</td></tr>
  <tr><td align="center">10</td><td align="center">8</td><td align="center">H</td><td align="center">7</td></tr>
</table>

#### Sol<sup>n</sup>

แถวที่ Parent = 0 คือราก ได้ A (id 1)

หาลูกของแต่ละ node โดยดูแถวที่ Parent เท่ากับ id ของ node นั้น

- ลูกของ A (id 1): แถวที่ Parent = 1 ได้ B (กิ่ง 1), C (กิ่ง 2), D (กิ่ง 3)
- ลูกของ B (id 2): แถวที่ Parent = 2 ได้ I (กิ่ง 8), J (กิ่ง 9)
- ลูกของ C (id 3): ไม่มีแถวที่ Parent = 3 จึงเป็น leaf
- ลูกของ D (id 4): แถวที่ Parent = 4 ได้ E (กิ่ง 4), F (กิ่ง 5)
- ลูกของ F (id 8): แถวที่ Parent = 8 ได้ G (กิ่ง 6), H (กิ่ง 7)
- I, J, E, G, H ไม่มีลูก จึงเป็น leaf

<div align="center">
<svg viewBox="0 0 520 310" width="520" role="img" aria-label="ต้นไม้ A ถึง J พร้อมค่าบนกิ่ง" xmlns="http://www.w3.org/2000/svg">
<line x1="230" y1="58" x2="100" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="154" y="84" text-anchor="end" font-size="13" fill="currentColor">1</text>
<line x1="230" y1="58" x2="220" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="214" y="84" text-anchor="end" font-size="13" fill="currentColor">2</text>
<line x1="230" y1="58" x2="360" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="306" y="84" text-anchor="start" font-size="13" fill="currentColor">3</text>
<line x1="100" y1="138" x2="60" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="69" y="164" text-anchor="end" font-size="13" fill="currentColor">8</text>
<line x1="100" y1="138" x2="140" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="131" y="164" text-anchor="start" font-size="13" fill="currentColor">9</text>
<line x1="360" y1="138" x2="300" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="319" y="164" text-anchor="end" font-size="13" fill="currentColor">4</text>
<line x1="360" y1="138" x2="420" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="401" y="164" text-anchor="start" font-size="13" fill="currentColor">5</text>
<line x1="420" y1="218" x2="380" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="389" y="244" text-anchor="end" font-size="13" fill="currentColor">6</text>
<line x1="420" y1="218" x2="460" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="451" y="244" text-anchor="start" font-size="13" fill="currentColor">7</text>
<circle cx="230" cy="40" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="230" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
<circle cx="100" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="100" y="125" text-anchor="middle" font-size="15" fill="currentColor">B</text>
<circle cx="220" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="220" y="125" text-anchor="middle" font-size="15" fill="currentColor">C</text>
<circle cx="360" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="360" y="125" text-anchor="middle" font-size="15" fill="currentColor">D</text>
<circle cx="60" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="60" y="205" text-anchor="middle" font-size="15" fill="currentColor">I</text>
<circle cx="140" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="140" y="205" text-anchor="middle" font-size="15" fill="currentColor">J</text>
<circle cx="300" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="300" y="205" text-anchor="middle" font-size="15" fill="currentColor">E</text>
<circle cx="420" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="420" y="205" text-anchor="middle" font-size="15" fill="currentColor">F</text>
<circle cx="380" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="380" y="285" text-anchor="middle" font-size="15" fill="currentColor">G</text>
<circle cx="460" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="460" y="285" text-anchor="middle" font-size="15" fill="currentColor">H</text>
</svg>
</div>

**Ans** ต้นไม้ข้างบน

---

### ตัวอย่างโจทย์ 3

จากข้อมูลในตารางต่อไปนี้ จงสร้างต้นไม้ ID3 (เลือก attribute ด้วย Information Gain) ให้ครบทุกกิ่ง แล้วเขียนเป็นตารางโครงสร้างข้อมูล

<table align="center">
  <tr><th>Day</th><th>Outlook</th><th>Temp</th><th>Humidity</th><th>Wind</th><th>Play Tennis</th></tr>
  <tr><td align="center">1</td><td align="center">Sunny</td><td align="center">Hot</td><td align="center">High</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">2</td><td align="center">Sunny</td><td align="center">Hot</td><td align="center">High</td><td align="center">Strong</td><td align="center">No</td></tr>
  <tr><td align="center">3</td><td align="center">Overcast</td><td align="center">Hot</td><td align="center">High</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">4</td><td align="center">Rain</td><td align="center">Mild</td><td align="center">High</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">5</td><td align="center">Rain</td><td align="center">Cool</td><td align="center">Normal</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">6</td><td align="center">Rain</td><td align="center">Cool</td><td align="center">Normal</td><td align="center">Strong</td><td align="center">No</td></tr>
  <tr><td align="center">7</td><td align="center">Overcast</td><td align="center">Cool</td><td align="center">Normal</td><td align="center">Strong</td><td align="center">Yes</td></tr>
  <tr><td align="center">8</td><td align="center">Sunny</td><td align="center">Mild</td><td align="center">High</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">9</td><td align="center">Sunny</td><td align="center">Cool</td><td align="center">Normal</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">10</td><td align="center">Rain</td><td align="center">Mild</td><td align="center">Normal</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">11</td><td align="center">Sunny</td><td align="center">Mild</td><td align="center">Normal</td><td align="center">Strong</td><td align="center">Yes</td></tr>
  <tr><td align="center">12</td><td align="center">Overcast</td><td align="center">Mild</td><td align="center">High</td><td align="center">Strong</td><td align="center">Yes</td></tr>
  <tr><td align="center">13</td><td align="center">Overcast</td><td align="center">Hot</td><td align="center">Normal</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">14</td><td align="center">Rain</td><td align="center">Mild</td><td align="center">High</td><td align="center">Strong</td><td align="center">No</td></tr>
</table>

#### Sol<sup>n</sup>

**1. หา node ราก**

จากสูตร

$$\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c,\qquad \text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)$$

$S$ มี $9+,5-$ (รวม 14)

$$\text{Entropy}(S)=-\frac9{14}\log_{10}\frac9{14}-\frac5{14}\log_{10}\frac5{14}=0.2831$$

**Outlook** (Sunny $2+,3-$, Overcast $4+,0-$, Rain $3+,2-$)

$$\text{Entropy}(S_{Sunny})=-\frac25\log_{10}\frac25-\frac35\log_{10}\frac35=0.2923,\qquad \text{Entropy}(S_{Overcast})=0,\qquad \text{Entropy}(S_{Rain})=0.2923$$

$$\text{Gain}(S,Outlook)=0.2831-\frac5{14}(0.2923)-\frac4{14}(0)-\frac5{14}(0.2923)=0.0743$$

**Temp** (Hot $2+,2-$, Mild $4+,2-$, Cool $3+,1-$)

$$\text{Entropy}(S_{Hot})=0.3010,\qquad \text{Entropy}(S_{Mild})=0.2764,\qquad \text{Entropy}(S_{Cool})=0.2442$$

$$\text{Gain}(S,Temp)=0.2831-\frac4{14}(0.3010)-\frac6{14}(0.2764)-\frac4{14}(0.2442)=0.0089$$

**Humidity** (High $3+,4-$, Normal $6+,1-$)

$$\text{Entropy}(S_{High})=0.2966,\qquad \text{Entropy}(S_{Normal})=0.1781$$

$$\text{Gain}(S,Humidity)=0.2831-\frac7{14}(0.2966)-\frac7{14}(0.1781)=0.0458$$

**Wind** (Weak $6+,2-$, Strong $3+,3-$)

$$\text{Entropy}(S_{Weak})=0.2442,\qquad \text{Entropy}(S_{Strong})=0.3010$$

$$\text{Gain}(S,Wind)=0.2831-\frac8{14}(0.2442)-\frac6{14}(0.3010)=0.0146$$

เปรียบเทียบ

$$\text{Gain}(S,Outlook)=0.0743\ >\ \text{Gain}(S,Humidity)=0.0458\ >\ \text{Gain}(S,Wind)=0.0146\ >\ \text{Gain}(S,Temp)=0.0089$$

Outlook มี Gain มากที่สุด จึงเป็น node ราก

**2. แบ่งข้อมูลตาม Outlook**

<div align="center">
<svg viewBox="0 0 520 210" width="520" role="img" aria-label="ต้นไม้หลังแบ่งด้วย Outlook" xmlns="http://www.w3.org/2000/svg">
<line x1="260" y1="58" x2="110" y2="112" stroke="currentColor" stroke-width="1.5"/>
<text x="169" y="89" text-anchor="end" font-size="13" fill="currentColor">Sunny</text>
<line x1="260" y1="58" x2="260" y2="116" stroke="currentColor" stroke-width="1.5"/>
<text x="271" y="91" text-anchor="start" font-size="13" fill="currentColor">Overcast</text>
<line x1="260" y1="58" x2="410" y2="112" stroke="currentColor" stroke-width="1.5"/>
<text x="351" y="89" text-anchor="start" font-size="13" fill="currentColor">Rain</text>
<ellipse cx="260" cy="40" rx="44" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="260" y="45" text-anchor="middle" font-size="15" fill="currentColor">Outlook</text>
<rect x="86" y="116" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="110" y="135" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<rect x="236" y="116" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="260" y="135" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<rect x="386" y="116" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="410" y="135" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<text x="110" y="168" text-anchor="middle" font-size="13" fill="currentColor">Day 1,2,8,9,11</text>
<text x="110" y="186" text-anchor="middle" font-size="13" fill="currentColor">2+, 3-</text>
<text x="260" y="168" text-anchor="middle" font-size="13" fill="currentColor">Day 3,7,12,13</text>
<text x="260" y="186" text-anchor="middle" font-size="13" fill="currentColor">4+, 0-</text>
<text x="410" y="168" text-anchor="middle" font-size="13" fill="currentColor">Day 4,5,6,10,14</text>
<text x="410" y="186" text-anchor="middle" font-size="13" fill="currentColor">3+, 2-</text>
</svg>
</div>

กิ่ง Overcast มี $4+,0-$ (Entropy = 0) จึงเป็น leaf **Yes** ส่วนกิ่ง Sunny และ Rain ยังมีทั้ง Yes และ No ต้องแบ่งต่อ (ไม่ใช้ Outlook ซ้ำ)

**3. กิ่ง Sunny** พิจารณาเฉพาะตารางที่เหลือ

<table align="center">
  <tr><th>Day</th><th>Temp</th><th>Humidity</th><th>Wind</th><th>Play Tennis</th></tr>
  <tr><td align="center">1</td><td align="center">Hot</td><td align="center">High</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">2</td><td align="center">Hot</td><td align="center">High</td><td align="center">Strong</td><td align="center">No</td></tr>
  <tr><td align="center">8</td><td align="center">Mild</td><td align="center">High</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">9</td><td align="center">Cool</td><td align="center">Normal</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">11</td><td align="center">Mild</td><td align="center">Normal</td><td align="center">Strong</td><td align="center">Yes</td></tr>
</table>

$$\text{Entropy}(S_{Sunny})=-\frac25\log_{10}\frac25-\frac35\log_{10}\frac35=0.2923$$

**Temp** (Hot $0+,2-$, Mild $1+,1-$, Cool $1+,0-$)

$$\text{Entropy}(S_{Hot})=0,\qquad \text{Entropy}(S_{Mild})=0.3010,\qquad \text{Entropy}(S_{Cool})=0$$

$$\text{Gain}(S_{Sunny},Temp)=0.2923-\frac25(0)-\frac25(0.3010)-\frac15(0)=0.1719$$

**Humidity** (High $0+,3-$, Normal $2+,0-$)

$$\text{Entropy}(S_{High})=0,\qquad \text{Entropy}(S_{Normal})=0$$

$$\text{Gain}(S_{Sunny},Humidity)=0.2923-\frac35(0)-\frac25(0)=0.2923$$

**Wind** (Weak $1+,2-$, Strong $1+,1-$)

$$\text{Entropy}(S_{Weak})=0.2764,\qquad \text{Entropy}(S_{Strong})=0.3010$$

$$\text{Gain}(S_{Sunny},Wind)=0.2923-\frac35(0.2764)-\frac25(0.3010)=0.0061$$

Humidity มี Gain มากที่สุด จึงเป็น node ของกิ่ง Sunny ได้ High $\to$ **No** และ Normal $\to$ **Yes** (Entropy = 0 ทั้งคู่ จึงเป็น leaf)

<div align="center">
<svg viewBox="0 0 520 260" width="520" role="img" aria-label="ต้นไม้หลังเสร็จกิ่ง Sunny" xmlns="http://www.w3.org/2000/svg">
<line x1="260" y1="58" x2="110" y2="112" stroke="currentColor" stroke-width="1.5"/>
<text x="169" y="89" text-anchor="end" font-size="13" fill="currentColor">Sunny</text>
<line x1="260" y1="58" x2="260" y2="116" stroke="currentColor" stroke-width="1.5"/>
<text x="271" y="91" text-anchor="start" font-size="13" fill="currentColor">Overcast</text>
<line x1="260" y1="58" x2="410" y2="112" stroke="currentColor" stroke-width="1.5"/>
<text x="351" y="89" text-anchor="start" font-size="13" fill="currentColor">Rain</text>
<line x1="110" y1="148" x2="60" y2="206" stroke="currentColor" stroke-width="1.5"/>
<text x="69" y="181" text-anchor="end" font-size="13" fill="currentColor">High</text>
<line x1="110" y1="148" x2="160" y2="206" stroke="currentColor" stroke-width="1.5"/>
<text x="151" y="181" text-anchor="start" font-size="13" fill="currentColor">Normal</text>
<ellipse cx="260" cy="40" rx="44" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="260" y="45" text-anchor="middle" font-size="15" fill="currentColor">Outlook</text>
<ellipse cx="110" cy="130" rx="44" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="110" y="135" text-anchor="middle" font-size="15" fill="currentColor">Humidity</text>
<rect x="236" y="116" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="260" y="135" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<rect x="386" y="116" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="410" y="135" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<rect x="36" y="206" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="60" y="225" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<rect x="136" y="206" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="160" y="225" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
</svg>
</div>

**4. กิ่ง Rain** พิจารณาเฉพาะตารางที่เหลือ

<table align="center">
  <tr><th>Day</th><th>Temp</th><th>Humidity</th><th>Wind</th><th>Play Tennis</th></tr>
  <tr><td align="center">4</td><td align="center">Mild</td><td align="center">High</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">5</td><td align="center">Cool</td><td align="center">Normal</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">6</td><td align="center">Cool</td><td align="center">Normal</td><td align="center">Strong</td><td align="center">No</td></tr>
  <tr><td align="center">10</td><td align="center">Mild</td><td align="center">Normal</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">14</td><td align="center">Mild</td><td align="center">High</td><td align="center">Strong</td><td align="center">No</td></tr>
</table>

$$\text{Entropy}(S_{Rain})=-\frac35\log_{10}\frac35-\frac25\log_{10}\frac25=0.2923$$

**Temp** (Mild $2+,1-$, Cool $1+,1-$)

$$\text{Entropy}(S_{Mild})=0.2764,\qquad \text{Entropy}(S_{Cool})=0.3010$$

$$\text{Gain}(S_{Rain},Temp)=0.2923-\frac35(0.2764)-\frac25(0.3010)=0.0061$$

**Humidity** (High $1+,1-$, Normal $2+,1-$)

$$\text{Entropy}(S_{High})=0.3010,\qquad \text{Entropy}(S_{Normal})=0.2764$$

$$\text{Gain}(S_{Rain},Humidity)=0.2923-\frac25(0.3010)-\frac35(0.2764)=0.0061$$

**Wind** (Weak $3+,0-$, Strong $0+,2-$)

$$\text{Entropy}(S_{Weak})=0,\qquad \text{Entropy}(S_{Strong})=0$$

$$\text{Gain}(S_{Rain},Wind)=0.2923-\frac35(0)-\frac25(0)=0.2923$$

Wind มี Gain มากที่สุด จึงเป็น node ของกิ่ง Rain ได้ Weak $\to$ **Yes** และ Strong $\to$ **No** (Entropy = 0 ทั้งคู่ จึงเป็น leaf)

<div align="center">
<svg viewBox="0 0 520 260" width="520" role="img" aria-label="ต้นไม้หลังเสร็จกิ่ง Rain" xmlns="http://www.w3.org/2000/svg">
<line x1="260" y1="58" x2="110" y2="112" stroke="currentColor" stroke-width="1.5"/>
<text x="169" y="89" text-anchor="end" font-size="13" fill="currentColor">Sunny</text>
<line x1="260" y1="58" x2="260" y2="116" stroke="currentColor" stroke-width="1.5"/>
<text x="271" y="91" text-anchor="start" font-size="13" fill="currentColor">Overcast</text>
<line x1="260" y1="58" x2="410" y2="112" stroke="currentColor" stroke-width="1.5"/>
<text x="351" y="89" text-anchor="start" font-size="13" fill="currentColor">Rain</text>
<line x1="110" y1="148" x2="60" y2="206" stroke="currentColor" stroke-width="1.5"/>
<text x="69" y="181" text-anchor="end" font-size="13" fill="currentColor">High</text>
<line x1="110" y1="148" x2="160" y2="206" stroke="currentColor" stroke-width="1.5"/>
<text x="151" y="181" text-anchor="start" font-size="13" fill="currentColor">Normal</text>
<line x1="410" y1="148" x2="360" y2="206" stroke="currentColor" stroke-width="1.5"/>
<text x="369" y="181" text-anchor="end" font-size="13" fill="currentColor">Strong</text>
<line x1="410" y1="148" x2="460" y2="206" stroke="currentColor" stroke-width="1.5"/>
<text x="451" y="181" text-anchor="start" font-size="13" fill="currentColor">Weak</text>
<ellipse cx="260" cy="40" rx="44" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="260" y="45" text-anchor="middle" font-size="15" fill="currentColor">Outlook</text>
<ellipse cx="110" cy="130" rx="44" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="110" y="135" text-anchor="middle" font-size="15" fill="currentColor">Humidity</text>
<rect x="236" y="116" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="260" y="135" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<ellipse cx="410" cy="130" rx="44" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="410" y="135" text-anchor="middle" font-size="15" fill="currentColor">Wind</text>
<rect x="36" y="206" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="60" y="225" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<rect x="136" y="206" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="160" y="225" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<rect x="336" y="206" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="360" y="225" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<rect x="436" y="206" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="460" y="225" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
</svg>
</div>

เขียน id ตามชั้น จากบนลงล่าง ซ้ายไปขวา

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">Outlook</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">Humidity</td><td align="center">Sunny</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">Yes</td><td align="center">Overcast</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">Wind</td><td align="center">Rain</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">No</td><td align="center">High</td></tr>
  <tr><td align="center">6</td><td align="center">2</td><td align="center">Yes</td><td align="center">Normal</td></tr>
  <tr><td align="center">7</td><td align="center">4</td><td align="center">No</td><td align="center">Strong</td></tr>
  <tr><td align="center">8</td><td align="center">4</td><td align="center">Yes</td><td align="center">Weak</td></tr>
</table>

**Ans** ต้นไม้ข้างบนและตารางโครงสร้างข้อมูล
