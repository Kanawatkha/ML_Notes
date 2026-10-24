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

#### ตัวอย่างโจทย์ 1

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

#### ตัวอย่างโจทย์ 2

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Euclidean

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">3</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">3</td><td align="center">2</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">2</td><td align="center">1</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">?</td></tr>
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

โดย $\vec x_4=[1,1,2]$

$$D_{41}=\|\vec x_4-\vec x_1\|_2=\sqrt{(1-1)^2+(1-2)^2+(2-3)^2}=\sqrt{0+1+1}=\sqrt{2}\approx1.41$$

$$D_{42}=\|\vec x_4-\vec x_2\|_2=\sqrt{(1-3)^2+(1-2)^2+(2-1)^2}=\sqrt{4+1+1}=\sqrt{6}\approx2.45$$

$$D_{43}=\|\vec x_4-\vec x_3\|_2=\sqrt{(1-2)^2+(1-1)^2+(2-1)^2}=\sqrt{1+0+1}=\sqrt{2}\approx1.41$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">1.41</td><td align="center">2.45</td><td align="center">1.41</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{41}=1.41\ \le\ D_{43}=1.41\ <\ D_{42}=2.45$$

ค่าเท่ากันเรียงตามลำดับในตาราง

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $1.41\to(\text{\textcircled{1}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(1.41,1.41)\to(\text{\textcircled{1}},\text{\textcircled{3}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(1.41,1.41,2.45)\to(\text{\textcircled{1}},\text{\textcircled{3}},\text{\textcircled{2}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

#### แบบฝึกหัด 1

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Euclidean

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">-3</td><td align="center">7</td><td align="center">-2</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">4</td><td align="center">7</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">3</td><td align="center">5</td><td align="center">-2</td><td align="center">Y</td></tr>
  <tr><td align="center">4</td><td align="center">8</td><td align="center">1</td><td align="center">2</td><td align="center">?</td></tr>
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

โดย $\vec x_4=[8,1,2]$

$$D_{41}=\|\vec x_4-\vec x_1\|_2=\sqrt{(8-(-3))^2+(1-7)^2+(2-(-2))^2}=\sqrt{121+36+16}=\sqrt{173}\approx13.15$$

$$D_{42}=\|\vec x_4-\vec x_2\|_2=\sqrt{(8-4)^2+(1-7)^2+(2-1)^2}=\sqrt{16+36+1}=\sqrt{53}\approx7.28$$

$$D_{43}=\|\vec x_4-\vec x_3\|_2=\sqrt{(8-3)^2+(1-5)^2+(2-(-2))^2}=\sqrt{25+16+16}=\sqrt{57}\approx7.55$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">13.15</td><td align="center">7.28</td><td align="center">7.55</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{42}=7.28\ <\ D_{43}=7.55\ <\ D_{41}=13.15$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $7.28\to(\text{\textcircled{2}})\to(N)$ ดังนั้น **N**
- $k=2$: $(7.28,7.55)\to(\text{\textcircled{2}},\text{\textcircled{3}})\to(N,Y)$ เสมอกัน เลือกตัวแรก ดังนั้น **N**
- $k=3$: $(7.28,7.55,13.15)\to(\text{\textcircled{2}},\text{\textcircled{3}},\text{\textcircled{1}})\to(N,Y,Y)$ ดังนั้น **Y**

**Ans** $k=1$ ได้ **N**, $k=2$ ได้ **N**, $k=3$ ได้ **Y**

#### แบบฝึกหัด 2

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Euclidean

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">-3</td><td align="center">5</td><td align="center">7</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">3</td><td align="center">1</td><td align="center">-3</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">-2</td><td align="center">9</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">4</td><td align="center">4</td><td align="center">4</td><td align="center">?</td></tr>
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

โดย $\vec x_4=[4,4,4]$

$$D_{41}=\|\vec x_4-\vec x_1\|_2=\sqrt{(4-(-3))^2+(4-5)^2+(4-7)^2}=\sqrt{49+1+9}=\sqrt{59}\approx7.68$$

$$D_{42}=\|\vec x_4-\vec x_2\|_2=\sqrt{(4-3)^2+(4-1)^2+(4-(-3))^2}=\sqrt{1+9+49}=\sqrt{59}\approx7.68$$

$$D_{43}=\|\vec x_4-\vec x_3\|_2=\sqrt{(4-(-2))^2+(4-9)^2+(4-1)^2}=\sqrt{36+25+9}=\sqrt{70}\approx8.37$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">7.68</td><td align="center">7.68</td><td align="center">8.37</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{41}=7.68\ \le\ D_{42}=7.68\ <\ D_{43}=8.37$$

ค่าเท่ากันเรียงตามลำดับในตาราง

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $7.68\to(\text{\textcircled{1}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(7.68,7.68)\to(\text{\textcircled{1}},\text{\textcircled{2}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(7.68,7.68,8.37)\to(\text{\textcircled{1}},\text{\textcircled{2}},\text{\textcircled{3}})\to(Y,N,N)$ ดังนั้น **N**

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

#### แบบฝึกหัด 1

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Cosine

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">8</td><td align="center">4</td><td align="center">0</td><td align="center">N</td></tr>
  <tr><td align="center">2</td><td align="center">-3</td><td align="center">5</td><td align="center">-1</td><td align="center">Y</td></tr>
  <tr><td align="center">3</td><td align="center">-2</td><td align="center">1</td><td align="center">0</td><td align="center">Y</td></tr>
  <tr><td align="center">4</td><td align="center">4</td><td align="center">2</td><td align="center">-3</td><td align="center">?</td></tr>
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

โดย $\vec x_4=[4,2,-3]$ ได้ $|\vec x_4|=\sqrt{16+4+9}=\sqrt{29}$

$$D_{41}=\frac{\vec x_4\cdot\vec x_1}{|\vec x_4||\vec x_1|}=\frac{(4)(8)+(2)(4)+((-3))(0)}{\sqrt{29}\,\sqrt{64+16+0}}=\frac{40}{\sqrt{29}\,\sqrt{80}}=\frac{40}{\sqrt{2320}}\approx0.83$$

$$D_{42}=\frac{\vec x_4\cdot\vec x_2}{|\vec x_4||\vec x_2|}=\frac{(4)((-3))+(2)(5)+((-3))((-1))}{\sqrt{29}\,\sqrt{9+25+1}}=\frac{1}{\sqrt{29}\,\sqrt{35}}=\frac{1}{\sqrt{1015}}\approx0.03$$

$$D_{43}=\frac{\vec x_4\cdot\vec x_3}{|\vec x_4||\vec x_3|}=\frac{(4)((-2))+(2)(1)+((-3))(0)}{\sqrt{29}\,\sqrt{4+1+0}}=\frac{-6}{\sqrt{29}\,\sqrt{5}}=\frac{-6}{\sqrt{145}}\approx-0.50$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">0.83</td><td align="center">0.03</td><td align="center">-0.50</td><td align="center">1</td></tr>
</table>

Cosine ยิ่งมากยิ่งใกล้ จากตาราง $D$ แถวที่ 4 เรียงจากมากไปน้อย

$$D_{41}=0.83\ >\ D_{42}=0.03\ >\ D_{43}=-0.50$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $0.83\to(\text{\textcircled{1}})\to(N)$ ดังนั้น **N**
- $k=2$: $(0.83,0.03)\to(\text{\textcircled{1}},\text{\textcircled{2}})\to(N,Y)$ เสมอกัน เลือกตัวแรก ดังนั้น **N**
- $k=3$: $(0.83,0.03,-0.50)\to(\text{\textcircled{1}},\text{\textcircled{2}},\text{\textcircled{3}})\to(N,Y,Y)$ ดังนั้น **Y**

**Ans** $k=1$ ได้ **N**, $k=2$ ได้ **N**, $k=3$ ได้ **Y**

#### แบบฝึกหัด 2

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Cosine

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">4</td><td align="center">0</td><td align="center">-3</td><td align="center">N</td></tr>
  <tr><td align="center">2</td><td align="center">-3</td><td align="center">0</td><td align="center">4</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">4</td><td align="center">-2</td><td align="center">0</td><td align="center">Y</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">-2</td><td align="center">1</td><td align="center">?</td></tr>
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

โดย $\vec x_4=[1,-2,1]$ ได้ $|\vec x_4|=\sqrt{1+4+1}=\sqrt{6}$

$$D_{41}=\frac{\vec x_4\cdot\vec x_1}{|\vec x_4||\vec x_1|}=\frac{(1)(4)+((-2))(0)+(1)((-3))}{\sqrt{6}\,\sqrt{16+0+9}}=\frac{1}{\sqrt{6}\,\sqrt{25}}=\frac{1}{\sqrt{150}}\approx0.08$$

$$D_{42}=\frac{\vec x_4\cdot\vec x_2}{|\vec x_4||\vec x_2|}=\frac{(1)((-3))+((-2))(0)+(1)(4)}{\sqrt{6}\,\sqrt{9+0+16}}=\frac{1}{\sqrt{6}\,\sqrt{25}}=\frac{1}{\sqrt{150}}\approx0.08$$

$$D_{43}=\frac{\vec x_4\cdot\vec x_3}{|\vec x_4||\vec x_3|}=\frac{(1)(4)+((-2))((-2))+(1)(0)}{\sqrt{6}\,\sqrt{16+4+0}}=\frac{8}{\sqrt{6}\,\sqrt{20}}=\frac{8}{\sqrt{120}}\approx0.73$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">0.08</td><td align="center">0.08</td><td align="center">0.73</td><td align="center">1</td></tr>
</table>

Cosine ยิ่งมากยิ่งใกล้ จากตาราง $D$ แถวที่ 4 เรียงจากมากไปน้อย

$$D_{43}=0.73\ >\ D_{41}=0.08\ =\ D_{42}=0.08$$

ค่าเท่ากันเรียงตามลำดับในตาราง

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $0.73\to(\text{\textcircled{3}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(0.73,0.08)\to(\text{\textcircled{3}},\text{\textcircled{1}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(0.73,0.08,0.08)\to(\text{\textcircled{3}},\text{\textcircled{1}},\text{\textcircled{2}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

### 1.3 Squared Euclidean

$$d^2(\vec a,\vec b)=\|\vec a-\vec b\|_2^2=(a_1-b_1)^2+(a_2-b_2)^2+(a_3-b_3)^2$$

ไม่ต้องถอดราก เพราะ $\sqrt{\ }$ เป็นฟังก์ชันเพิ่ม ลำดับใกล้-ไกลไม่เปลี่ยน

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

#### แบบฝึกหัด 1

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Squared Euclidean

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">7</td><td align="center">-3</td><td align="center">-1</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">0</td><td align="center">5</td><td align="center">8</td><td align="center">Y</td></tr>
  <tr><td align="center">3</td><td align="center">4</td><td align="center">5</td><td align="center">3</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">0</td><td align="center">6</td><td align="center">-2</td><td align="center">?</td></tr>
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

$$\|\vec x_i-\vec x_j\|_2^2=\Delta A_1^2+\Delta A_2^2+\Delta A_3^2$$

โดย $\vec x_4=[0,6,-2]$

$$D_{41}=\|\vec x_4-\vec x_1\|_2^2=(0-7)^2+(6-(-3))^2+((-2)-(-1))^2=49+81+1=131$$

$$D_{42}=\|\vec x_4-\vec x_2\|_2^2=(0-0)^2+(6-5)^2+((-2)-8)^2=0+1+100=101$$

$$D_{43}=\|\vec x_4-\vec x_3\|_2^2=(0-4)^2+(6-5)^2+((-2)-3)^2=16+1+25=42$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">131</td><td align="center">101</td><td align="center">42</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{43}=42\ <\ D_{42}=101\ <\ D_{41}=131$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $42\to(\text{\textcircled{3}})\to(N)$ ดังนั้น **N**
- $k=2$: $(42,101)\to(\text{\textcircled{3}},\text{\textcircled{2}})\to(N,Y)$ เสมอกัน เลือกตัวแรก ดังนั้น **N**
- $k=3$: $(42,101,131)\to(\text{\textcircled{3}},\text{\textcircled{2}},\text{\textcircled{1}})\to(N,Y,Y)$ ดังนั้น **Y**

**Ans** $k=1$ ได้ **N**, $k=2$ ได้ **N**, $k=3$ ได้ **Y**

#### แบบฝึกหัด 2

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Squared Euclidean

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">8</td><td align="center">0</td><td align="center">8</td><td align="center">N</td></tr>
  <tr><td align="center">2</td><td align="center">-3</td><td align="center">7</td><td align="center">7</td><td align="center">Y</td></tr>
  <tr><td align="center">3</td><td align="center">5</td><td align="center">1</td><td align="center">3</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">0</td><td align="center">6</td><td align="center">0</td><td align="center">?</td></tr>
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

$$\|\vec x_i-\vec x_j\|_2^2=\Delta A_1^2+\Delta A_2^2+\Delta A_3^2$$

โดย $\vec x_4=[0,6,0]$

$$D_{41}=\|\vec x_4-\vec x_1\|_2^2=(0-8)^2+(6-0)^2+(0-8)^2=64+36+64=164$$

$$D_{42}=\|\vec x_4-\vec x_2\|_2^2=(0-(-3))^2+(6-7)^2+(0-7)^2=9+1+49=59$$

$$D_{43}=\|\vec x_4-\vec x_3\|_2^2=(0-5)^2+(6-1)^2+(0-3)^2=25+25+9=59$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">164</td><td align="center">59</td><td align="center">59</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{42}=59\ \le\ D_{43}=59\ <\ D_{41}=164$$

ค่าเท่ากันเรียงตามลำดับในตาราง

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $59\to(\text{\textcircled{2}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(59,59)\to(\text{\textcircled{2}},\text{\textcircled{3}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(59,59,164)\to(\text{\textcircled{2}},\text{\textcircled{3}},\text{\textcircled{1}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

### 1.4 Manhattan

$$d(\vec a,\vec b)=\|\vec a-\vec b\|_1=|a_1-b_1|+|a_2-b_2|+|a_3-b_3|$$

#### ตัวอย่างโจทย์ 1

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

#### ตัวอย่างโจทย์ 2

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Manhattan

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">3</td><td align="center">Y</td></tr>
  <tr><td align="center">2</td><td align="center">3</td><td align="center">2</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">3</td><td align="center">2</td><td align="center">1</td><td align="center">1</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">?</td></tr>
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

โดย $\vec x_4=[1,1,2]$

$$D_{41}=\|\vec x_4-\vec x_1\|_1=|1-1|+|1-2|+|2-3|=0+1+1=2$$

$$D_{42}=\|\vec x_4-\vec x_2\|_1=|1-3|+|1-2|+|2-1|=2+1+1=4$$

$$D_{43}=\|\vec x_4-\vec x_3\|_1=|1-2|+|1-1|+|2-1|=1+0+1=2$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">2</td><td align="center">4</td><td align="center">2</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{41}=2\ \le\ D_{43}=2\ <\ D_{42}=4$$

ค่าเท่ากันเรียงตามลำดับในตาราง

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $2\to(\text{\textcircled{1}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(2,2)\to(\text{\textcircled{1}},\text{\textcircled{3}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(2,2,4)\to(\text{\textcircled{1}},\text{\textcircled{3}},\text{\textcircled{2}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

#### แบบฝึกหัด 1

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Manhattan

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">4</td><td align="center">8</td><td align="center">3</td><td align="center">N</td></tr>
  <tr><td align="center">2</td><td align="center">3</td><td align="center">5</td><td align="center">8</td><td align="center">Y</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">5</td><td align="center">-3</td><td align="center">Y</td></tr>
  <tr><td align="center">4</td><td align="center">-3</td><td align="center">7</td><td align="center">4</td><td align="center">?</td></tr>
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

โดย $\vec x_4=[-3,7,4]$

$$D_{41}=\|\vec x_4-\vec x_1\|_1=|(-3)-4|+|7-8|+|4-3|=7+1+1=9$$

$$D_{42}=\|\vec x_4-\vec x_2\|_1=|(-3)-3|+|7-5|+|4-8|=6+2+4=12$$

$$D_{43}=\|\vec x_4-\vec x_3\|_1=|(-3)-1|+|7-5|+|4-(-3)|=4+2+7=13$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">9</td><td align="center">12</td><td align="center">13</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{41}=9\ <\ D_{42}=12\ <\ D_{43}=13$$

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $9\to(\text{\textcircled{1}})\to(N)$ ดังนั้น **N**
- $k=2$: $(9,12)\to(\text{\textcircled{1}},\text{\textcircled{2}})\to(N,Y)$ เสมอกัน เลือกตัวแรก ดังนั้น **N**
- $k=3$: $(9,12,13)\to(\text{\textcircled{1}},\text{\textcircled{2}},\text{\textcircled{3}})\to(N,Y,Y)$ ดังนั้น **Y**

**Ans** $k=1$ ได้ **N**, $k=2$ ได้ **N**, $k=3$ ได้ **Y**

#### แบบฝึกหัด 2

จากข้อมูลในตารางต่อไปนี้ จงทำนาย Target ของข้อมูลลำดับที่ 4 ด้วย K-NN เมื่อ $k=1,2,3$ โดยใช้ระยะแบบ Manhattan

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">7</td><td align="center">6</td><td align="center">6</td><td align="center">N</td></tr>
  <tr><td align="center">2</td><td align="center">5</td><td align="center">2</td><td align="center">1</td><td align="center">Y</td></tr>
  <tr><td align="center">3</td><td align="center">0</td><td align="center">7</td><td align="center">8</td><td align="center">N</td></tr>
  <tr><td align="center">4</td><td align="center">2</td><td align="center">0</td><td align="center">1</td><td align="center">?</td></tr>
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

โดย $\vec x_4=[2,0,1]$

$$D_{41}=\|\vec x_4-\vec x_1\|_1=|2-7|+|0-6|+|1-6|=5+6+5=16$$

$$D_{42}=\|\vec x_4-\vec x_2\|_1=|2-5|+|0-2|+|1-1|=3+2+0=5$$

$$D_{43}=\|\vec x_4-\vec x_3\|_1=|2-0|+|0-7|+|1-8|=2+7+7=16$$

ดังนั้น

<table align="center">
  <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
  <tr><th>1</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>2</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>3</th><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td><td align="center">&nbsp;</td></tr>
  <tr><th>4</th><td align="center">16</td><td align="center">5</td><td align="center">16</td><td align="center">0</td></tr>
</table>

จากตาราง $D$ แถวที่ 4 เรียงจากน้อยไปมาก

$$D_{42}=5\ <\ D_{41}=16\ \le\ D_{43}=16$$

ค่าเท่ากันเรียงตามลำดับในตาราง

เลือก $k$ ตัวแรก แล้วดู Target

- $k=1$: $5\to(\text{\textcircled{2}})\to(Y)$ ดังนั้น **Y**
- $k=2$: $(5,16)\to(\text{\textcircled{2}},\text{\textcircled{1}})\to(Y,N)$ เสมอกัน เลือกตัวแรก ดังนั้น **Y**
- $k=3$: $(5,16,16)\to(\text{\textcircled{2}},\text{\textcircled{1}},\text{\textcircled{3}})\to(Y,N,N)$ ดังนั้น **N**

**Ans** $k=1$ ได้ **Y**, $k=2$ ได้ **Y**, $k=3$ ได้ **N**

---

## 2. Perceptron (Vector Form)

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

### แบบฝึกหัด 1

จากข้อมูลในตารางต่อไปนี้ จงหา $w$ และ $b$ ของ Perceptron เมื่อเริ่มจาก $w_0=\begin{bmatrix}0&0&0&0\end{bmatrix}$ และเขียนสมการแบ่งกลุ่ม

<table align="center">
  <tr><th>#</th><th>a₁</th><th>a₂</th><th>a₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">3</td><td align="center">5</td><td align="center">-2</td><td align="center">+1</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">2</td><td align="center">-3</td><td align="center">+1</td></tr>
  <tr><td align="center">3</td><td align="center">5</td><td align="center">3</td><td align="center">4</td><td align="center">-1</td></tr>
  <tr><td align="center">4</td><td align="center">2</td><td align="center">-2</td><td align="center">-3</td><td align="center">-1</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$x_i\cdot w\le0\ \Rightarrow\ w\leftarrow w+x_i$$

สร้าง $x_i$ (ต่อท้ายด้วย 1 และคูณ $y_i$)

$$x_1=\begin{bmatrix}3&5&-2&1\end{bmatrix}_{1\times4},\qquad x_2=\begin{bmatrix}2&2&-3&1\end{bmatrix}_{1\times4}$$

$$x_3=(-1)\begin{bmatrix}5&3&4&1\end{bmatrix}=\begin{bmatrix}-5&-3&-4&-1\end{bmatrix}_{1\times4},\qquad x_4=(-1)\begin{bmatrix}2&-2&-3&1\end{bmatrix}=\begin{bmatrix}-2&2&3&-1\end{bmatrix}_{1\times4}$$

เริ่มที่ $w_0=\begin{bmatrix}0&0&0&0\end{bmatrix}$

$$x_1\cdot w_0=(3)(0)+(5)(0)+(-2)(0)+(1)(0)=0\ \le0\ \times$$

$$w_1=w_0+x_1=\begin{bmatrix}0&0&0&0\end{bmatrix}+\begin{bmatrix}3&5&-2&1\end{bmatrix}=\begin{bmatrix}3&5&-2&1\end{bmatrix}$$

$$x_1\cdot w_1=(3)(3)+(5)(5)+(-2)(-2)+(1)(1)=39\ \checkmark$$

$$x_2\cdot w_1=(2)(3)+(2)(5)+(-3)(-2)+(1)(1)=23\ \checkmark$$

$$x_3\cdot w_1=(-5)(3)+(-3)(5)+(-4)(-2)+(-1)(1)=-23\ \le0\ \times$$

$$w_2=w_1+x_3=\begin{bmatrix}3&5&-2&1\end{bmatrix}+\begin{bmatrix}-5&-3&-4&-1\end{bmatrix}=\begin{bmatrix}-2&2&-6&0\end{bmatrix}$$

$$x_1\cdot w_2=(3)(-2)+(5)(2)+(-2)(-6)+(1)(0)=16\ \checkmark$$

$$x_2\cdot w_2=(2)(-2)+(2)(2)+(-3)(-6)+(1)(0)=18\ \checkmark$$

$$x_3\cdot w_2=(-5)(-2)+(-3)(2)+(-4)(-6)+(-1)(0)=28\ \checkmark$$

$$x_4\cdot w_2=(-2)(-2)+(2)(2)+(3)(-6)+(-1)(0)=-10\ \le0\ \times$$

$$w_3=w_2+x_4=\begin{bmatrix}-2&2&-6&0\end{bmatrix}+\begin{bmatrix}-2&2&3&-1\end{bmatrix}=\begin{bmatrix}-4&4&-3&-1\end{bmatrix}$$

$$x_1\cdot w_3=(3)(-4)+(5)(4)+(-2)(-3)+(1)(-1)=13\ \checkmark$$

$$x_2\cdot w_3=(2)(-4)+(2)(4)+(-3)(-3)+(1)(-1)=8\ \checkmark$$

$$x_3\cdot w_3=(-5)(-4)+(-3)(4)+(-4)(-3)+(-1)(-1)=21\ \checkmark$$

$$x_4\cdot w_3=(-2)(-4)+(2)(4)+(3)(-3)+(-1)(-1)=8\ \checkmark$$

ทุกจุดถูก ($x_i\cdot w>0$ ทุกจุด) จึงหยุด ได้ $w=\begin{bmatrix}-4&4&-3\end{bmatrix}$, $b=-1$

**Ans** $w=\begin{bmatrix}-4&4&-3\end{bmatrix}$, $b=-1$ และสมการแบ่งกลุ่ม $-4A_1+4A_2-3A_3-1=0$

### แบบฝึกหัด 2

จากข้อมูลในตารางต่อไปนี้ จงหา $w$ และ $b$ ของ Perceptron เมื่อเริ่มจาก $w_0=\begin{bmatrix}1&-1&0\end{bmatrix}$ และ learning rate $\eta=0.5$ (ใช้ $w\leftarrow\eta\,(w+x_i)$) และเขียนสมการแบ่งกลุ่ม

<table align="center">
  <tr><th>#</th><th>a₁</th><th>a₂</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">-4</td><td align="center">4</td><td align="center">-1</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">3</td><td align="center">+1</td></tr>
  <tr><td align="center">3</td><td align="center">0</td><td align="center">-1</td><td align="center">-1</td></tr>
  <tr><td align="center">4</td><td align="center">5</td><td align="center">6</td><td align="center">+1</td></tr>
  <tr><td align="center">5</td><td align="center">0</td><td align="center">1</td><td align="center">-1</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$x_i\cdot w\le0\ \Rightarrow\ w\leftarrow\eta\,(w+x_i)$$

สร้าง $x_i$ (ต่อท้ายด้วย 1 และคูณ $y_i$)

$$x_1=(-1)\begin{bmatrix}-4&4&1\end{bmatrix}=\begin{bmatrix}4&-4&-1\end{bmatrix}_{1\times3},\qquad x_2=\begin{bmatrix}1&3&1\end{bmatrix}_{1\times3}$$

$$x_3=(-1)\begin{bmatrix}0&-1&1\end{bmatrix}=\begin{bmatrix}0&1&-1\end{bmatrix}_{1\times3},\qquad x_4=\begin{bmatrix}5&6&1\end{bmatrix}_{1\times3}$$

$$x_5=(-1)\begin{bmatrix}0&1&1\end{bmatrix}=\begin{bmatrix}0&-1&-1\end{bmatrix}_{1\times3}$$

เริ่มที่ $w_0=\begin{bmatrix}1&-1&0\end{bmatrix}$

$$x_1\cdot w_0=(4)(1)+(-4)(-1)+(-1)(0)=8\ \checkmark$$

$$x_2\cdot w_0=(1)(1)+(3)(-1)+(1)(0)=-2\ \le0\ \times$$

$$w_1=\eta(w_0+x_2)=0.5\left(\begin{bmatrix}1&-1&0\end{bmatrix}+\begin{bmatrix}1&3&1\end{bmatrix}\right)=0.5\begin{bmatrix}2&2&1\end{bmatrix}=\begin{bmatrix}1&1&0.5\end{bmatrix}$$

$$x_1\cdot w_1=(4)(1)+(-4)(1)+(-1)(0.5)=-0.5\ \le0\ \times$$

$$w_2=\eta(w_1+x_1)=0.5\left(\begin{bmatrix}1&1&0.5\end{bmatrix}+\begin{bmatrix}4&-4&-1\end{bmatrix}\right)=0.5\begin{bmatrix}5&-3&-0.5\end{bmatrix}=\begin{bmatrix}2.5&-1.5&-0.25\end{bmatrix}$$

$$x_1\cdot w_2=(4)(2.5)+(-4)(-1.5)+(-1)(-0.25)=16.25\ \checkmark$$

$$x_2\cdot w_2=(1)(2.5)+(3)(-1.5)+(1)(-0.25)=-2.25\ \le0\ \times$$

$$w_3=\eta(w_2+x_2)=0.5\left(\begin{bmatrix}2.5&-1.5&-0.25\end{bmatrix}+\begin{bmatrix}1&3&1\end{bmatrix}\right)=0.5\begin{bmatrix}3.5&1.5&0.75\end{bmatrix}=\begin{bmatrix}1.75&0.75&0.375\end{bmatrix}$$

$$x_1\cdot w_3=(4)(1.75)+(-4)(0.75)+(-1)(0.375)=3.625\ \checkmark$$

$$x_2\cdot w_3=(1)(1.75)+(3)(0.75)+(1)(0.375)=4.375\ \checkmark$$

$$x_3\cdot w_3=(0)(1.75)+(1)(0.75)+(-1)(0.375)=0.375\ \checkmark$$

$$x_4\cdot w_3=(5)(1.75)+(6)(0.75)+(1)(0.375)=13.625\ \checkmark$$

$$x_5\cdot w_3=(0)(1.75)+(-1)(0.75)+(-1)(0.375)=-1.125\ \le0\ \times$$

$$w_4=\eta(w_3+x_5)=0.5\left(\begin{bmatrix}1.75&0.75&0.375\end{bmatrix}+\begin{bmatrix}0&-1&-1\end{bmatrix}\right)=0.5\begin{bmatrix}1.75&-0.25&-0.625\end{bmatrix}=\begin{bmatrix}0.875&-0.125&-0.3125\end{bmatrix}$$

$$x_1\cdot w_4=(4)(0.875)+(-4)(-0.125)+(-1)(-0.3125)=4.3125\ \checkmark$$

$$x_2\cdot w_4=(1)(0.875)+(3)(-0.125)+(1)(-0.3125)=0.1875\ \checkmark$$

$$x_3\cdot w_4=(0)(0.875)+(1)(-0.125)+(-1)(-0.3125)=0.1875\ \checkmark$$

$$x_4\cdot w_4=(5)(0.875)+(6)(-0.125)+(1)(-0.3125)=3.3125\ \checkmark$$

$$x_5\cdot w_4=(0)(0.875)+(-1)(-0.125)+(-1)(-0.3125)=0.4375\ \checkmark$$

ทุกจุดถูก ($x_i\cdot w>0$ ทุกจุด) จึงหยุด ได้ $w=\begin{bmatrix}0.875&-0.125\end{bmatrix}$, $b=-0.3125$

**Ans** $w=\begin{bmatrix}0.875&-0.125\end{bmatrix}$, $b=-0.3125$ และสมการแบ่งกลุ่ม $0.875A_1-0.125A_2-0.3125=0$

### แบบฝึกหัด 3

จากข้อมูลในตารางต่อไปนี้ จงหา $w$ และ $b$ ของ Perceptron เมื่อเริ่มจาก $w_0=\begin{bmatrix}0&0&0&0\end{bmatrix}$ และเขียนสมการแบ่งกลุ่ม

<table align="center">
  <tr><th>#</th><th>a₁</th><th>a₂</th><th>a₃</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">-5</td><td align="center">6</td><td align="center">5</td><td align="center">-1</td></tr>
  <tr><td align="center">2</td><td align="center">6</td><td align="center">-4</td><td align="center">2</td><td align="center">-1</td></tr>
  <tr><td align="center">3</td><td align="center">-4</td><td align="center">-1</td><td align="center">2</td><td align="center">+1</td></tr>
  <tr><td align="center">4</td><td align="center">-3</td><td align="center">-3</td><td align="center">1</td><td align="center">+1</td></tr>
  <tr><td align="center">5</td><td align="center">-3</td><td align="center">-2</td><td align="center">0</td><td align="center">+1</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$x_i\cdot w\le0\ \Rightarrow\ w\leftarrow w+x_i$$

สร้าง $x_i$ (ต่อท้ายด้วย 1 และคูณ $y_i$)

$$x_1=(-1)\begin{bmatrix}-5&6&5&1\end{bmatrix}=\begin{bmatrix}5&-6&-5&-1\end{bmatrix}_{1\times4},\qquad x_2=(-1)\begin{bmatrix}6&-4&2&1\end{bmatrix}=\begin{bmatrix}-6&4&-2&-1\end{bmatrix}_{1\times4}$$

$$x_3=\begin{bmatrix}-4&-1&2&1\end{bmatrix}_{1\times4},\qquad x_4=\begin{bmatrix}-3&-3&1&1\end{bmatrix}_{1\times4}$$

$$x_5=\begin{bmatrix}-3&-2&0&1\end{bmatrix}_{1\times4}$$

เริ่มที่ $w_0=\begin{bmatrix}0&0&0&0\end{bmatrix}$

$$x_1\cdot w_0=(5)(0)+(-6)(0)+(-5)(0)+(-1)(0)=0\ \le0\ \times$$

$$w_1=w_0+x_1=\begin{bmatrix}0&0&0&0\end{bmatrix}+\begin{bmatrix}5&-6&-5&-1\end{bmatrix}=\begin{bmatrix}5&-6&-5&-1\end{bmatrix}$$

$$x_1\cdot w_1=(5)(5)+(-6)(-6)+(-5)(-5)+(-1)(-1)=87\ \checkmark$$

$$x_2\cdot w_1=(-6)(5)+(4)(-6)+(-2)(-5)+(-1)(-1)=-43\ \le0\ \times$$

$$w_2=w_1+x_2=\begin{bmatrix}5&-6&-5&-1\end{bmatrix}+\begin{bmatrix}-6&4&-2&-1\end{bmatrix}=\begin{bmatrix}-1&-2&-7&-2\end{bmatrix}$$

$$x_1\cdot w_2=(5)(-1)+(-6)(-2)+(-5)(-7)+(-1)(-2)=44\ \checkmark$$

$$x_2\cdot w_2=(-6)(-1)+(4)(-2)+(-2)(-7)+(-1)(-2)=14\ \checkmark$$

$$x_3\cdot w_2=(-4)(-1)+(-1)(-2)+(2)(-7)+(1)(-2)=-10\ \le0\ \times$$

$$w_3=w_2+x_3=\begin{bmatrix}-1&-2&-7&-2\end{bmatrix}+\begin{bmatrix}-4&-1&2&1\end{bmatrix}=\begin{bmatrix}-5&-3&-5&-1\end{bmatrix}$$

$$x_1\cdot w_3=(5)(-5)+(-6)(-3)+(-5)(-5)+(-1)(-1)=19\ \checkmark$$

$$x_2\cdot w_3=(-6)(-5)+(4)(-3)+(-2)(-5)+(-1)(-1)=29\ \checkmark$$

$$x_3\cdot w_3=(-4)(-5)+(-1)(-3)+(2)(-5)+(1)(-1)=12\ \checkmark$$

$$x_4\cdot w_3=(-3)(-5)+(-3)(-3)+(1)(-5)+(1)(-1)=18\ \checkmark$$

$$x_5\cdot w_3=(-3)(-5)+(-2)(-3)+(0)(-5)+(1)(-1)=20\ \checkmark$$

ทุกจุดถูก ($x_i\cdot w>0$ ทุกจุด) จึงหยุด ได้ $w=\begin{bmatrix}-5&-3&-5\end{bmatrix}$, $b=-1$

**Ans** $w=\begin{bmatrix}-5&-3&-5\end{bmatrix}$, $b=-1$ และสมการแบ่งกลุ่ม $-5A_1-3A_2-5A_3-1=0$

---

## 3. FFBP (Matrix Form)

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

2-2-3-4-5-1

$$\text{weight}=2(2)+2(3)+3(4)+4(5)+5(1)=4+6+12+20+5=47,\qquad \text{bias}=2+3+4+5+1=15,\qquad \#P=47+15=62$$

**ขนาด input / output** ของโครงข่ายจากตารางข้อมูล

- input = จำนวน attribute (attribute หมวดหมู่ที่มี $N$ ค่า แปลงเป็น $N-1$ ตัว)
- output = จำนวน class (target 2 ค่าใช้ 1 ตัว)

### ตัวอย่างโจทย์ 1

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

### ตัวอย่างโจทย์ 2

จากโครงข่าย 2-2-1 ดังรูป (ใช้ sigmoid ทุกชั้น bias เป็น 0 และ weight ทุกตัวเริ่มต้นที่ 0) และข้อมูลในตารางต่อไปนี้ จงปรับ weight ทั้งหมด ($w_1$ ถึง $w_6$) ด้วย Backpropagation 1 ครั้ง (ใช้ทั้ง 2 ตัวอย่างพร้อมกัน) เมื่อ $\eta=0.1$

<div align="center">
<svg viewBox="0 0 480 285" width="480" role="img" aria-label="โครงข่าย 2-2-1 ที่ weight ทุกตัวเป็น 0" xmlns="http://www.w3.org/2000/svg">
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
<text x="80" y="200" text-anchor="end" font-size="14" fill="currentColor">w₃ = 0</text>
<text x="340" y="200" text-anchor="start" font-size="14" fill="currentColor">w₆ = 0</text>
<text x="140" y="244" text-anchor="start" font-size="14" fill="currentColor">w₅ = 0</text>
<text x="280" y="244" text-anchor="end" font-size="14" fill="currentColor">w₄ = 0</text>
<text x="140" y="95" text-anchor="end" font-size="14" fill="currentColor">w₁ = 0</text>
<text x="280" y="95" text-anchor="start" font-size="14" fill="currentColor">w₂ = 0</text>
</svg>
</div>

<table align="center">
  <tr><th></th><th>x₁</th><th>x₂</th><th>Y</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">-1</td><td align="center">1</td></tr>
  <tr><td align="center">2</td><td align="center">-1</td><td align="center">1</td><td align="center">0</td></tr>
</table>

#### Sol<sup>n</sup>

**1. Forward** จากสูตร

$$o=\sigma(XW^T),\qquad \sigma(x)=\frac{1}{1+e^{-x}}$$

เขียนเป็นเมทริกซ์ (1 ตัวอย่าง = 1 แถว)

$$X=\begin{bmatrix}1&-1\\-1&1\end{bmatrix}_{2\times2},\quad T=\begin{bmatrix}1\\0\end{bmatrix}_{2\times1},\quad W_h=\begin{bmatrix}0&0\\0&0\end{bmatrix}_{2\times2},\quad W_o=\begin{bmatrix}0&0\end{bmatrix}_{1\times2}$$

Hidden

$$XW_h^T=\begin{bmatrix}0&0\\0&0\end{bmatrix}\ \Rightarrow\ O_h=\sigma\left(XW_h^T\right)=\begin{bmatrix}0.5&0.5\\0.5&0.5\end{bmatrix}_{2\times2}$$

Output

$$O_hW_o^T=\begin{bmatrix}0\\0\end{bmatrix}\ \Rightarrow\ o=\sigma\left(O_hW_o^T\right)=\begin{bmatrix}0.5\\0.5\end{bmatrix}_{2\times1}$$

<table align="center">
  <tr><th></th><th>x₁</th><th>x₂</th><th>Y</th><th>Output</th><th>t-o</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">-1</td><td align="center">1</td><td align="center">0.5</td><td align="center">0.5</td></tr>
  <tr><td align="center">2</td><td align="center">-1</td><td align="center">1</td><td align="center">0</td><td align="center">0.5</td><td align="center">-0.5</td></tr>
</table>

**2. Backward** จากสูตร

$$\delta_o=o\odot(1-o)\odot(T-o),\qquad \delta_h=O_h\odot(1-O_h)\odot(\delta_oW_o)$$

Output

$$\delta_o=\begin{bmatrix}0.5\\0.5\end{bmatrix}\odot\begin{bmatrix}0.5\\0.5\end{bmatrix}\odot\begin{bmatrix}0.5\\-0.5\end{bmatrix}=\begin{bmatrix}0.125\\-0.125\end{bmatrix}_{2\times1}$$

Hidden (ใช้ $W_o$ ก่อนปรับ ซึ่งเป็น 0)

$$\delta_oW_o=\begin{bmatrix}0.125\\-0.125\end{bmatrix}_{2\times1}\begin{bmatrix}0&0\end{bmatrix}_{1\times2}=\begin{bmatrix}0&0\\0&0\end{bmatrix}_{2\times2}\ \Rightarrow\ \delta_h=\begin{bmatrix}0.25&0.25\\0.25&0.25\end{bmatrix}\odot\begin{bmatrix}0&0\\0&0\end{bmatrix}=\begin{bmatrix}0&0\\0&0\end{bmatrix}_{2\times2}$$

**3. Update** จากสูตร

$$W_o'=W_o+\eta\,\delta_o^T\,O_h,\qquad W_h'=W_h+\eta\,\delta_h^T\,X$$

Output

$$W_o'=\begin{bmatrix}0&0\end{bmatrix}+0.1\begin{bmatrix}0.125&-0.125\end{bmatrix}_{1\times2}\begin{bmatrix}0.5&0.5\\0.5&0.5\end{bmatrix}_{2\times2}=\begin{bmatrix}0&0\end{bmatrix}+0.1\begin{bmatrix}0&0\end{bmatrix}=\begin{bmatrix}0&0\end{bmatrix}_{1\times2}$$

Hidden

$$W_h'=\begin{bmatrix}0&0\\0&0\end{bmatrix}+0.1\begin{bmatrix}0&0\\0&0\end{bmatrix}_{2\times2}\begin{bmatrix}1&-1\\-1&1\end{bmatrix}_{2\times2}=\begin{bmatrix}0&0\\0&0\end{bmatrix}_{2\times2}$$

เพราะ $\delta_o$ ของสองตัวอย่างมีขนาดเท่ากันและเครื่องหมายตรงข้าม ในขณะที่ $O_h$ ของทั้งสองตัวอย่างเท่ากัน ผลรวมจึงหักล้างเป็น 0

**Ans** $w_1=w_2=w_3=w_4=w_5=w_6=0$ (weight ทุกตัวไม่เปลี่ยน)

### แบบฝึกหัด 1

จากโครงข่าย 2-2-1 ดังรูป (ใช้ sigmoid ทุกชั้น bias เป็น 0 และค่า $w_1$ ถึง $w_6$ ดังรูป) และข้อมูลในตารางต่อไปนี้ จงปรับ weight ทั้งหมด ($w_1$ ถึง $w_6$) ด้วย Backpropagation 1 ครั้ง (ใช้ทั้ง 2 ตัวอย่างพร้อมกัน) เมื่อ $\eta=0.2$

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
<text x="80" y="200" text-anchor="end" font-size="14" fill="currentColor">w₃ = 0.3</text>
<text x="340" y="200" text-anchor="start" font-size="14" fill="currentColor">w₆ = 0.1</text>
<text x="140" y="244" text-anchor="start" font-size="14" fill="currentColor">w₅ = 0.4</text>
<text x="280" y="244" text-anchor="end" font-size="14" fill="currentColor">w₄ = -0.2</text>
<text x="140" y="95" text-anchor="end" font-size="14" fill="currentColor">w₁ = 0.5</text>
<text x="280" y="95" text-anchor="start" font-size="14" fill="currentColor">w₂ = -0.3</text>
</svg>
</div>

<table align="center">
  <tr><th></th><th>x₁</th><th>x₂</th><th>Y</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">0</td><td align="center">1</td></tr>
  <tr><td align="center">2</td><td align="center">0</td><td align="center">1</td><td align="center">0</td></tr>
</table>

#### Sol<sup>n</sup>

**1. Forward** จากสูตร

$$o=\sigma(XW^T),\qquad \sigma(x)=\frac{1}{1+e^{-x}}$$

เขียนเป็นเมทริกซ์ (1 ตัวอย่าง = 1 แถว)

$$X=\begin{bmatrix}1&0\\0&1\end{bmatrix}_{2\times2},\quad T=\begin{bmatrix}1\\0\end{bmatrix}_{2\times1},\quad W_h=\begin{bmatrix}w_3&w_4\\w_5&w_6\end{bmatrix}=\begin{bmatrix}0.3&-0.2\\0.4&0.1\end{bmatrix}_{2\times2},\quad W_o=\begin{bmatrix}w_1&w_2\end{bmatrix}=\begin{bmatrix}0.5&-0.3\end{bmatrix}_{1\times2}$$

Hidden

$$O_h=\sigma(XW_h^T)=\sigma\left(\begin{bmatrix}0.3&0.4\\-0.2&0.1\end{bmatrix}_{2\times2}\right)=\begin{bmatrix}0.5744&0.5987\\0.4502&0.525\end{bmatrix}_{2\times2}$$

Output

$$o=\sigma(O_hW_o^T)=\sigma\left(\begin{bmatrix}0.1076\\0.0676\end{bmatrix}_{2\times1}\right)=\begin{bmatrix}0.5269\\0.5169\end{bmatrix}_{2\times1}$$

$$T-o=\begin{bmatrix}1\\0\end{bmatrix}_{2\times1}-\begin{bmatrix}0.5269\\0.5169\end{bmatrix}_{2\times1}=\begin{bmatrix}0.4731\\-0.5169\end{bmatrix}_{2\times1}$$

**2. Backward** จากสูตร

$$\delta_o=o\odot(1-o)\odot(T-o),\qquad \delta_h=O_h\odot(1-O_h)\odot(\delta_oW_o)$$

Output

$$\delta_o=\begin{bmatrix}0.1179\\-0.1291\end{bmatrix}_{2\times1}$$

Hidden (ใช้ $W_o$ ก่อนปรับ)

$$\delta_oW_o=\begin{bmatrix}0.059&-0.0354\\-0.0645&0.0387\end{bmatrix}_{2\times2}\ \Rightarrow\ \delta_h=\begin{bmatrix}0.0144&-0.0085\\-0.016&0.0097\end{bmatrix}_{2\times2}$$

**3. Update** จากสูตร

$$W_o'=W_o+\eta\,\delta_o^T\,O_h,\qquad W_h'=W_h+\eta\,\delta_h^T\,X$$

Output

$$W_o'=\begin{bmatrix}0.5&-0.3\end{bmatrix}_{1\times2}+0.2\begin{bmatrix}0.1179&-0.1291\end{bmatrix}_{1\times2}\begin{bmatrix}0.5744&0.5987\\0.4502&0.525\end{bmatrix}_{2\times2}=\begin{bmatrix}0.5&-0.3\end{bmatrix}_{1\times2}+\begin{bmatrix}0.00192&0.00056\end{bmatrix}_{1\times2}=\begin{bmatrix}0.5019&-0.2994\end{bmatrix}_{1\times2}$$

Hidden

$$W_h'=\begin{bmatrix}0.3&-0.2\\0.4&0.1\end{bmatrix}_{2\times2}+0.2\begin{bmatrix}0.0144&-0.016\\-0.0085&0.0097\end{bmatrix}_{2\times2}\begin{bmatrix}1&0\\0&1\end{bmatrix}_{2\times2}=\begin{bmatrix}0.3&-0.2\\0.4&0.1\end{bmatrix}_{2\times2}+\begin{bmatrix}0.00288&-0.0032\\-0.0017&0.00194\end{bmatrix}_{2\times2}=\begin{bmatrix}0.3029&-0.2032\\0.3983&0.1019\end{bmatrix}_{2\times2}$$

**Ans** $w_1=0.5019$, $w_2=-0.2994$, $w_3=0.3029$, $w_4=-0.2032$, $w_5=0.3983$, $w_6=0.1019$

### แบบฝึกหัด 2

จงหาจำนวนพารามิเตอร์ (weight และ bias) ของโครงข่ายต่อไปนี้ (เขียนเป็น $n_0$-$n_1$-$\dots$-$n_L$)

1. 3-4-2
2. 5-6-4-1
3. 6-8-5-3-2

#### Sol<sup>n</sup>

จากสูตร

$$\#P=\underbrace{\sum_{l=1}^{L}n_{l-1}n_l}_{\text{weight}}+\underbrace{\sum_{l=1}^{L}n_l}_{\text{bias}}$$

3-4-2

$$\text{weight}=3(4)+4(2)=12+8=20,\qquad \text{bias}=4+2=6,\qquad \#P=20+6=26$$

5-6-4-1

$$\text{weight}=5(6)+6(4)+4(1)=30+24+4=58,\qquad \text{bias}=6+4+1=11,\qquad \#P=58+11=69$$

6-8-5-3-2

$$\text{weight}=6(8)+8(5)+5(3)+3(2)=48+40+15+6=109,\qquad \text{bias}=8+5+3+2=18,\qquad \#P=109+18=127$$

**Ans** 3-4-2 ได้ 26, 5-6-4-1 ได้ 69, 6-8-5-3-2 ได้ 127

### แบบฝึกหัด 3

จากข้อมูลในตารางต่อไปนี้ ต้องการสร้างโครงข่ายที่ทำนาย Class จงหาขนาด input และ output ของโครงข่าย และหาจำนวนพารามิเตอร์ของโครงข่ายที่มี hidden 1 ชั้น 4 node

<table align="center">
  <tr><th>#</th><th>Age</th><th>Gender</th><th>Color</th><th>Weight</th><th>Class</th></tr>
  <tr><td align="center">1</td><td align="center">15</td><td align="center">M</td><td align="center">Red</td><td align="center">80</td><td align="center">A</td></tr>
  <tr><td align="center">2</td><td align="center">30</td><td align="center">F</td><td align="center">Green</td><td align="center">60</td><td align="center">B</td></tr>
  <tr><td align="center">3</td><td align="center">22</td><td align="center">F</td><td align="center">Blue</td><td align="center">55</td><td align="center">C</td></tr>
  <tr><td align="center">4</td><td align="center">41</td><td align="center">M</td><td align="center">Red</td><td align="center">72</td><td align="center">B</td></tr>
</table>

#### Sol<sup>n</sup>

ตามกฎ: attribute ตัวเลขใช้ 1 ตัว, attribute หมวดหมู่ที่มี $N$ ค่าใช้ $N-1$ ตัว, output = จำนวน class (2 class ใช้ 1 ตัว)

<table align="center">
  <tr><th>attribute</th><th>ชนิด</th><th>จำนวน input</th></tr>
  <tr><td align="center">Age</td><td align="center">ตัวเลข</td><td align="center">1</td></tr>
  <tr><td align="center">Gender</td><td align="center">หมวดหมู่ 2 ค่า</td><td align="center">1</td></tr>
  <tr><td align="center">Color</td><td align="center">หมวดหมู่ 3 ค่า</td><td align="center">2</td></tr>
  <tr><td align="center">Weight</td><td align="center">ตัวเลข</td><td align="center">1</td></tr>
</table>

$$\text{input}=1+1+2+1=5,\qquad \text{output}=3\ (\text{Class มี }3\text{ ค่า})$$

โครงข่าย 5-4-3

$$\text{weight}=5(4)+4(3)=20+12=32,\qquad \text{bias}=4+3=7,\qquad \#P=32+7=39$$

**Ans** input = 5, output = 3, จำนวนพารามิเตอร์ = 39

---

## 4. ID3 (Log Base 10)

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
  <tr><td align="center">4</td><td align="center">2</td><td align="center">G</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">3</td><td align="center">D</td><td align="center">4</td></tr>
  <tr><td align="center">6</td><td align="center">4</td><td align="center">H</td><td align="center">5</td></tr>
  <tr><td align="center">7</td><td align="center">5</td><td align="center">E</td><td align="center">6</td></tr>
  <tr><td align="center">8</td><td align="center">5</td><td align="center">F</td><td align="center">7</td></tr>
</table>

#### Sol<sup>n</sup>

แถวที่ Parent = 0 คือราก ได้ A (id 1)

หาลูกของแต่ละ node โดยดูแถวที่ Parent เท่ากับ id ของ node นั้น

- ลูกของ A (id 1): แถวที่ Parent = 1 ได้ B (กิ่ง 1), C (กิ่ง 2)
- ลูกของ B (id 2): แถวที่ Parent = 2 ได้ G (กิ่ง 3)
- ลูกของ C (id 3): แถวที่ Parent = 3 ได้ D (กิ่ง 4)
- ลูกของ G (id 4): แถวที่ Parent = 4 ได้ H (กิ่ง 5)
- ลูกของ D (id 5): แถวที่ Parent = 5 ได้ E (กิ่ง 6), F (กิ่ง 7)
- H, E, F ไม่มีแถวที่ Parent ตรงกับ id ของตัวเอง จึงเป็น leaf

<div align="center">
<svg viewBox="0 0 280 320" width="280" role="img" aria-label="ต้นไม้ที่ได้จากตาราง" xmlns="http://www.w3.org/2000/svg">
<line x1="100" y1="58" x2="40" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="64" y="78" text-anchor="end" font-size="13" fill="currentColor">1</text>
<line x1="100" y1="58" x2="160" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="138" y="78" text-anchor="start" font-size="13" fill="currentColor">2</text>
<line x1="40" y1="138" x2="40" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="48" y="158" text-anchor="start" font-size="13" fill="currentColor">3</text>
<line x1="160" y1="138" x2="160" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="168" y="158" text-anchor="start" font-size="13" fill="currentColor">4</text>
<line x1="40" y1="218" x2="40" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="48" y="238" text-anchor="start" font-size="13" fill="currentColor">5</text>
<line x1="160" y1="218" x2="120" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="134" y="238" text-anchor="end" font-size="13" fill="currentColor">6</text>
<line x1="160" y1="218" x2="200" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="188" y="238" text-anchor="start" font-size="13" fill="currentColor">7</text>
<circle cx="100" cy="40" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="100" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
<circle cx="40" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="125" text-anchor="middle" font-size="15" fill="currentColor">B</text>
<circle cx="160" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="160" y="125" text-anchor="middle" font-size="15" fill="currentColor">C</text>
<circle cx="40" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="205" text-anchor="middle" font-size="15" fill="currentColor">G</text>
<circle cx="160" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="160" y="205" text-anchor="middle" font-size="15" fill="currentColor">D</text>
<circle cx="40" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="285" text-anchor="middle" font-size="15" fill="currentColor">H</text>
<circle cx="120" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="120" y="285" text-anchor="middle" font-size="15" fill="currentColor">E</text>
<circle cx="200" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="285" text-anchor="middle" font-size="15" fill="currentColor">F</text>
</svg>
</div>

**Ans** ต้นไม้ข้างบน

---

### ตัวอย่างโจทย์ 3

จากต้นไม้ในรูป (ตัวเลขที่กิ่งคือค่าบนกิ่ง) จงเขียนโครงสร้างข้อมูลแบบตาราง (id, Parent, Node, Branch)

<div align="center">
<svg viewBox="0 0 440 240" width="440" role="img" aria-label="ต้นไม้ A ถึง D พร้อม leaf Y และ N" xmlns="http://www.w3.org/2000/svg">
<line x1="200" y1="58" x2="80" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="134" y="78" text-anchor="end" font-size="13" fill="currentColor">1</text>
<line x1="200" y1="58" x2="200" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="208" y="78" text-anchor="start" font-size="13" fill="currentColor">2</text>
<line x1="200" y1="58" x2="320" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="268" y="78" text-anchor="start" font-size="13" fill="currentColor">3</text>
<line x1="80" y1="138" x2="40" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="54" y="158" text-anchor="end" font-size="13" fill="currentColor">4</text>
<line x1="80" y1="138" x2="120" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="108" y="158" text-anchor="start" font-size="13" fill="currentColor">5</text>
<line x1="200" y1="138" x2="200" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="208" y="158" text-anchor="start" font-size="13" fill="currentColor">6</text>
<line x1="320" y1="138" x2="280" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="294" y="158" text-anchor="end" font-size="13" fill="currentColor">7</text>
<line x1="320" y1="138" x2="360" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="348" y="158" text-anchor="start" font-size="13" fill="currentColor">8</text>
<circle cx="200" cy="40" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
<circle cx="80" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="80" y="125" text-anchor="middle" font-size="15" fill="currentColor">B</text>
<circle cx="200" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="125" text-anchor="middle" font-size="15" fill="currentColor">C</text>
<circle cx="320" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="320" y="125" text-anchor="middle" font-size="15" fill="currentColor">D</text>
<circle cx="40" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="205" text-anchor="middle" font-size="15" fill="currentColor">Y</text>
<circle cx="120" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="120" y="205" text-anchor="middle" font-size="15" fill="currentColor">N</text>
<circle cx="200" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="205" text-anchor="middle" font-size="15" fill="currentColor">Y</text>
<circle cx="280" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="280" y="205" text-anchor="middle" font-size="15" fill="currentColor">N</text>
<circle cx="360" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="360" y="205" text-anchor="middle" font-size="15" fill="currentColor">Y</text>
</svg>
</div>

#### Sol<sup>n</sup>

ให้ id ตามชั้น จากบนลงล่าง ซ้ายไปขวา

- ชั้น 1: A = 1
- ชั้น 2: B = 2, C = 3, D = 4
- ชั้น 3: Y = 5, N = 6 (ลูกของ B), Y = 7 (ลูกของ C), N = 8, Y = 9 (ลูกของ D)

เติม Parent = id ของแม่ และ Branch = ค่าบนกิ่งที่ลงมาหา node นั้น

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">B</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">C</td><td align="center">2</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">D</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">Y</td><td align="center">4</td></tr>
  <tr><td align="center">6</td><td align="center">2</td><td align="center">N</td><td align="center">5</td></tr>
  <tr><td align="center">7</td><td align="center">3</td><td align="center">Y</td><td align="center">6</td></tr>
  <tr><td align="center">8</td><td align="center">4</td><td align="center">N</td><td align="center">7</td></tr>
  <tr><td align="center">9</td><td align="center">4</td><td align="center">Y</td><td align="center">8</td></tr>
</table>

**Ans** ตารางข้างบน

---

### ตัวอย่างโจทย์ 4

จากตารางโครงสร้างข้อมูลของต้นไม้ต่อไปนี้ จงวาดต้นไม้

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">B</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">E</td><td align="center">2</td></tr>
  <tr><td align="center">4</td><td align="center">2</td><td align="center">C</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">F</td><td align="center">4</td></tr>
  <tr><td align="center">6</td><td align="center">3</td><td align="center">H</td><td align="center">5</td></tr>
  <tr><td align="center">7</td><td align="center">3</td><td align="center">I</td><td align="center">6</td></tr>
  <tr><td align="center">8</td><td align="center">4</td><td align="center">G</td><td align="center">7</td></tr>
</table>

#### Sol<sup>n</sup>

แถวที่ Parent = 0 คือราก ได้ A (id 1)

หาลูกของแต่ละ node โดยดูแถวที่ Parent เท่ากับ id ของ node นั้น

- ลูกของ A (id 1): แถวที่ Parent = 1 ได้ B (กิ่ง 1), E (กิ่ง 2)
- ลูกของ B (id 2): แถวที่ Parent = 2 ได้ C (กิ่ง 3), F (กิ่ง 4)
- ลูกของ E (id 3): แถวที่ Parent = 3 ได้ H (กิ่ง 5), I (กิ่ง 6)
- ลูกของ C (id 4): แถวที่ Parent = 4 ได้ G (กิ่ง 7)
- F, H, I, G ไม่มีแถวที่ Parent ตรงกับ id ของตัวเอง จึงเป็น leaf

<div align="center">
<svg viewBox="0 0 360 320" width="360" role="img" aria-label="ต้นไม้ที่ได้จากตาราง" xmlns="http://www.w3.org/2000/svg">
<line x1="160" y1="58" x2="80" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="114" y="78" text-anchor="end" font-size="13" fill="currentColor">1</text>
<line x1="160" y1="58" x2="240" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="208" y="78" text-anchor="start" font-size="13" fill="currentColor">2</text>
<line x1="80" y1="138" x2="40" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="54" y="158" text-anchor="end" font-size="13" fill="currentColor">3</text>
<line x1="80" y1="138" x2="120" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="108" y="158" text-anchor="start" font-size="13" fill="currentColor">4</text>
<line x1="240" y1="138" x2="200" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="214" y="158" text-anchor="end" font-size="13" fill="currentColor">5</text>
<line x1="240" y1="138" x2="280" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="268" y="158" text-anchor="start" font-size="13" fill="currentColor">6</text>
<line x1="40" y1="218" x2="40" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="48" y="238" text-anchor="start" font-size="13" fill="currentColor">7</text>
<circle cx="160" cy="40" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="160" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
<circle cx="80" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="80" y="125" text-anchor="middle" font-size="15" fill="currentColor">B</text>
<circle cx="240" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="240" y="125" text-anchor="middle" font-size="15" fill="currentColor">E</text>
<circle cx="40" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="205" text-anchor="middle" font-size="15" fill="currentColor">C</text>
<circle cx="120" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="120" y="205" text-anchor="middle" font-size="15" fill="currentColor">F</text>
<circle cx="200" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="205" text-anchor="middle" font-size="15" fill="currentColor">H</text>
<circle cx="280" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="280" y="205" text-anchor="middle" font-size="15" fill="currentColor">I</text>
<circle cx="40" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="285" text-anchor="middle" font-size="15" fill="currentColor">G</text>
</svg>
</div>

**Ans** ต้นไม้ข้างบน

---

### ตัวอย่างโจทย์ 5

จากต้นไม้ในรูป (ตัวเลขที่กิ่งคือค่าบนกิ่ง) จงเขียนโครงสร้างข้อมูลแบบตาราง (id, Parent, Node, Branch)

<div align="center">
<svg viewBox="0 0 440 320" width="440" role="img" aria-label="ต้นไม้ A ถึง F พร้อม leaf Y และ N" xmlns="http://www.w3.org/2000/svg">
<line x1="230" y1="58" x2="140" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="179" y="78" text-anchor="end" font-size="13" fill="currentColor">1</text>
<line x1="230" y1="58" x2="320" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="283" y="78" text-anchor="start" font-size="13" fill="currentColor">2</text>
<line x1="140" y1="138" x2="80" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="104" y="158" text-anchor="end" font-size="13" fill="currentColor">3</text>
<line x1="140" y1="138" x2="200" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="178" y="158" text-anchor="start" font-size="13" fill="currentColor">4</text>
<line x1="320" y1="138" x2="280" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="294" y="158" text-anchor="end" font-size="13" fill="currentColor">5</text>
<line x1="320" y1="138" x2="360" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="348" y="158" text-anchor="start" font-size="13" fill="currentColor">6</text>
<line x1="80" y1="218" x2="40" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="54" y="238" text-anchor="end" font-size="13" fill="currentColor">7</text>
<line x1="80" y1="218" x2="120" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="108" y="238" text-anchor="start" font-size="13" fill="currentColor">8</text>
<line x1="200" y1="218" x2="200" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="208" y="238" text-anchor="start" font-size="13" fill="currentColor">9</text>
<circle cx="230" cy="40" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="230" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
<circle cx="140" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="140" y="125" text-anchor="middle" font-size="15" fill="currentColor">B</text>
<circle cx="320" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="320" y="125" text-anchor="middle" font-size="15" fill="currentColor">N</text>
<circle cx="80" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="80" y="205" text-anchor="middle" font-size="15" fill="currentColor">Y</text>
<circle cx="200" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="205" text-anchor="middle" font-size="15" fill="currentColor">N</text>
<circle cx="280" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="280" y="205" text-anchor="middle" font-size="15" fill="currentColor">C</text>
<circle cx="360" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="360" y="205" text-anchor="middle" font-size="15" fill="currentColor">D</text>
<circle cx="40" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="285" text-anchor="middle" font-size="15" fill="currentColor">Y</text>
<circle cx="120" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="120" y="285" text-anchor="middle" font-size="15" fill="currentColor">F</text>
<circle cx="200" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="285" text-anchor="middle" font-size="15" fill="currentColor">E</text>
</svg>
</div>

#### Sol<sup>n</sup>

ให้ id ตามชั้น จากบนลงล่าง ซ้ายไปขวา

- ชั้น 1: A = 1
- ชั้น 2: B = 2, N = 3
- ชั้น 3: Y = 4, N = 5 (ลูกของ B), C = 6, D = 7 (ลูกของ N id 3)
- ชั้น 4: Y = 8, F = 9 (ลูกของ Y id 4), E = 10 (ลูกของ N id 5)

เติม Parent = id ของแม่ และ Branch = ค่าบนกิ่งที่ลงมาหา node นั้น

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">B</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">N</td><td align="center">2</td></tr>
  <tr><td align="center">4</td><td align="center">2</td><td align="center">Y</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">N</td><td align="center">4</td></tr>
  <tr><td align="center">6</td><td align="center">3</td><td align="center">C</td><td align="center">5</td></tr>
  <tr><td align="center">7</td><td align="center">3</td><td align="center">D</td><td align="center">6</td></tr>
  <tr><td align="center">8</td><td align="center">4</td><td align="center">Y</td><td align="center">7</td></tr>
  <tr><td align="center">9</td><td align="center">4</td><td align="center">F</td><td align="center">8</td></tr>
  <tr><td align="center">10</td><td align="center">5</td><td align="center">E</td><td align="center">9</td></tr>
</table>

**Ans** ตารางข้างบน

---

### ตัวอย่างโจทย์ 6

จากข้อมูลที่มี attribute แบบ Boolean 2 ตัว (A, B) ดังตารางต่อไปนี้ (ช่อง จำนวน คือจำนวนตัวอย่างที่มีค่าเหล่านั้น) จงเลือก attribute สำหรับ node ราก ระหว่าง A กับ B ด้วย Information Gain

<table align="center">
  <tr><th>A</th><th>B</th><th>Target</th><th>จำนวน</th></tr>
  <tr><td align="center">0</td><td align="center">0</td><td align="center">-</td><td align="center">50</td></tr>
  <tr><td align="center">0</td><td align="center">1</td><td align="center">-</td><td align="center">50</td></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">+</td><td align="center">100</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c,\qquad \text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)$$

$S$ มี $100+,100-$ (รวม 200)

$$\text{Entropy}(S)=-\frac{100}{200}\log_{10}\frac{100}{200}-\frac{100}{200}\log_{10}\frac{100}{200}=0.3010$$

**A** (0 $0+,100-$, 1 $100+,0-$)

$$\text{Entropy}(S_{A=0})=0,\qquad \text{Entropy}(S_{A=1})=0$$

$$\text{Gain}(S,A)=0.3010-\frac{100}{200}(0)-\frac{100}{200}(0)=0.3010$$

**B** (0 $0+,50-$, 1 $100+,50-$)

$$\text{Entropy}(S_{B=0})=0,\qquad \text{Entropy}(S_{B=1})=0.2764$$

$$\text{Gain}(S,B)=0.3010-\frac{50}{200}(0)-\frac{150}{200}(0.2764)=0.0937$$

เปรียบเทียบ

$$\text{Gain}(S,A)=0.3010\ >\ \text{Gain}(S,B)=0.0937$$

A แบ่งแล้วได้กิ่งที่บริสุทธิ์ทั้งสองกิ่ง (Entropy = 0) จึงเป็น leaf ทั้งสอง ส่วน B ยังเหลือกิ่ง $B=1$ ที่มีทั้ง + และ -

<div align="center">
<svg viewBox="0 0 260 176" width="260" role="img" aria-label="ต้นไม้ที่ใช้ A เป็น node ราก" xmlns="http://www.w3.org/2000/svg">
<line x1="130" y1="58" x2="65" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="58" x2="195" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="130" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="92" y="88" text-anchor="end" font-size="13" fill="currentColor">0</text>
<text x="65" y="141" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="170" y="88" text-anchor="start" font-size="13" fill="currentColor">1</text>
<text x="195" y="141" text-anchor="middle" font-size="15" fill="currentColor">+</text>
<text x="130" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
</svg>
</div>

เขียนเป็นตารางโครงสร้างข้อมูล

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">-</td><td align="center">0</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">+</td><td align="center">1</td></tr>
</table>

**Ans** ใช้ A เป็น node ราก (Gain = 0.3010 มากกว่า B ที่ได้ 0.0937) และได้ต้นไม้ตามรูปข้างบน

---

### ตัวอย่างโจทย์ 7

จากข้อมูลที่มี attribute แบบ Boolean 2 ตัว (A, B) ดังตารางต่อไปนี้ (ช่อง จำนวน คือจำนวนตัวอย่างที่มีค่าเหล่านั้น) จงเลือก attribute สำหรับ node ราก ระหว่าง A กับ B ด้วย Information Gain

<table align="center">
  <tr><th>A</th><th>B</th><th>Target</th><th>จำนวน</th></tr>
  <tr><td align="center">0</td><td align="center">0</td><td align="center">-</td><td align="center">50</td></tr>
  <tr><td align="center">0</td><td align="center">1</td><td align="center">-</td><td align="center">50</td></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">-</td><td align="center">3</td></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">+</td><td align="center">100</td></tr>
</table>

#### Sol<sup>n</sup>

จากสูตร

$$\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c,\qquad \text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)$$

$S$ มี $100+,103-$ (รวม 203)

$$\text{Entropy}(S)=-\frac{100}{203}\log_{10}\frac{100}{203}-\frac{103}{203}\log_{10}\frac{103}{203}=0.3010$$

**A** (0 $0+,100-$, 1 $100+,3-$)

$$\text{Entropy}(S_{A=0})=0,\qquad \text{Entropy}(S_{A=1})=0.0572$$

$$\text{Gain}(S,A)=0.3010-\frac{100}{203}(0)-\frac{103}{203}(0.0572)=0.2720$$

**B** (0 $0+,53-$, 1 $100+,50-$)

$$\text{Entropy}(S_{B=0})=0,\qquad \text{Entropy}(S_{B=1})=0.2764$$

$$\text{Gain}(S,B)=0.3010-\frac{53}{203}(0)-\frac{150}{203}(0.2764)=0.0968$$

เปรียบเทียบ

$$\text{Gain}(S,A)=0.2720\ >\ \text{Gain}(S,B)=0.0968$$

A ได้กิ่ง $A=0$ ที่บริสุทธิ์ (Entropy = 0) และกิ่ง $A=1$ ที่เหลือเพียง $100+,3-$ จึงเลือก A เป็น node ราก

ต้นไม้หลังเลือก node ราก (? คือกิ่งที่ต้องแบ่งต่อ)

<div align="center">
<svg viewBox="0 0 260 232" width="260" role="img" aria-label="ต้นไม้หลังเลือก node ราก" xmlns="http://www.w3.org/2000/svg">
<line x1="130" y1="58" x2="65" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="58" x2="195" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="130" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="92" y="88" text-anchor="end" font-size="13" fill="currentColor">0</text>
<text x="65" y="141" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="65" y="174" text-anchor="middle" font-size="13" fill="currentColor">0+, 100-</text>
<text x="170" y="88" text-anchor="start" font-size="13" fill="currentColor">1</text>
<text x="195" y="141" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<text x="195" y="174" text-anchor="middle" font-size="13" fill="currentColor">100+, 3-</text>
<text x="130" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
</svg>
</div>

กิ่ง $A=1$ ยังมีทั้ง + และ - ต้องแบ่งต่อด้วย B (เหลือ attribute เดียว) ได้ $B=0\to$ **-** และ $B=1\to$ **+**

<div align="center">
<svg viewBox="0 0 390 272" width="390" role="img" aria-label="ต้นไม้ที่ใช้ A เป็น node ราก แล้วแบ่งต่อด้วย B" xmlns="http://www.w3.org/2000/svg">
<line x1="162" y1="58" x2="65" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="162" y1="58" x2="260" y2="118" stroke="currentColor" stroke-width="1.5"/>
<line x1="260" y1="154" x2="195" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="260" y1="154" x2="325" y2="218" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="260" cy="136" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="162" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="108" y="88" text-anchor="end" font-size="13" fill="currentColor">0</text>
<text x="65" y="141" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="219" y="86" text-anchor="start" font-size="13" fill="currentColor">1</text>
<text x="222" y="184" text-anchor="end" font-size="13" fill="currentColor">0</text>
<text x="195" y="237" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="300" y="184" text-anchor="start" font-size="13" fill="currentColor">1</text>
<text x="325" y="237" text-anchor="middle" font-size="15" fill="currentColor">+</text>
<text x="260" y="141" text-anchor="middle" font-size="15" fill="currentColor">B</text>
<text x="162" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
</svg>
</div>

เขียนเป็นตารางโครงสร้างข้อมูล

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">-</td><td align="center">0</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">B</td><td align="center">1</td></tr>
  <tr><td align="center">4</td><td align="center">3</td><td align="center">-</td><td align="center">0</td></tr>
  <tr><td align="center">5</td><td align="center">3</td><td align="center">+</td><td align="center">1</td></tr>
</table>

**Ans** ใช้ A เป็น node ราก (Gain = 0.2720 มากกว่า B ที่ได้ 0.0968) และได้ต้นไม้ตามรูปข้างบน

---

### ตัวอย่างโจทย์ 8

จากข้อมูลในตารางต่อไปนี้ จงสร้างต้นไม้ ID3 (เลือก attribute ด้วย Information Gain) ให้ครบทุกกิ่ง แล้วเขียนเป็นตารางโครงสร้างข้อมูล

<table align="center">
  <tr><th>#</th><th>Size</th><th>Color</th><th>Shape</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">big</td><td align="center">red</td><td align="center">circle</td><td align="center">+</td></tr>
  <tr><td align="center">2</td><td align="center">small</td><td align="center">red</td><td align="center">circle</td><td align="center">+</td></tr>
  <tr><td align="center">3</td><td align="center">small</td><td align="center">red</td><td align="center">square</td><td align="center">-</td></tr>
  <tr><td align="center">4</td><td align="center">big</td><td align="center">blue</td><td align="center">circle</td><td align="center">-</td></tr>
</table>

#### Sol<sup>n</sup>

**1. หา node ราก**

จากสูตร

$$\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c,\qquad \text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)$$

$S$ มี $2+,2-$ (รวม 4)

$$\text{Entropy}(S)=-\frac{2}{4}\log_{10}\frac{2}{4}-\frac{2}{4}\log_{10}\frac{2}{4}=0.3010$$

**Size** (big $1+,1-$, small $1+,1-$)

$$\text{Entropy}(S_{Size=big})=0.3010,\qquad \text{Entropy}(S_{Size=small})=0.3010$$

$$\text{Gain}(S,Size)=0.3010-\frac{2}{4}(0.3010)-\frac{2}{4}(0.3010)=0.0000$$

**Color** (red $2+,1-$, blue $0+,1-$)

$$\text{Entropy}(S_{Color=red})=0.2764,\qquad \text{Entropy}(S_{Color=blue})=0$$

$$\text{Gain}(S,Color)=0.3010-\frac{3}{4}(0.2764)-\frac{1}{4}(0)=0.0937$$

**Shape** (circle $2+,1-$, square $0+,1-$)

$$\text{Entropy}(S_{Shape=circle})=0.2764,\qquad \text{Entropy}(S_{Shape=square})=0$$

$$\text{Gain}(S,Shape)=0.3010-\frac{3}{4}(0.2764)-\frac{1}{4}(0)=0.0937$$

เปรียบเทียบ

$$\text{Gain}(S,Color)=0.0937\ =\ \text{Gain}(S,Shape)=0.0937\ >\ \text{Gain}(S,Size)=0.0000$$

Color และ Shape มี Gain เท่ากันและมากที่สุด เลือกตัวแรกตามลำดับในตาราง จึงเลือก Color เป็น node ราก

กิ่งที่ Entropy = 0 เป็น leaf: blue $\to$ **-**

ต้นไม้หลังเลือก node ราก (? คือกิ่งที่ต้องแบ่งต่อ)

<div align="center">
<svg viewBox="0 0 260 232" width="260" role="img" aria-label="ต้นไม้หลังเลือก node ราก" xmlns="http://www.w3.org/2000/svg">
<line x1="130" y1="58" x2="65" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="58" x2="195" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="130" cy="40" rx="43" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="92" y="88" text-anchor="end" font-size="13" fill="currentColor">red</text>
<text x="65" y="141" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<text x="65" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 1,2,3</text>
<text x="65" y="192" text-anchor="middle" font-size="13" fill="currentColor">2+, 1-</text>
<text x="170" y="88" text-anchor="start" font-size="13" fill="currentColor">blue</text>
<text x="195" y="141" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="195" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 4</text>
<text x="195" y="192" text-anchor="middle" font-size="13" fill="currentColor">0+, 1-</text>
<text x="130" y="45" text-anchor="middle" font-size="15" fill="currentColor">Color</text>
</svg>
</div>

**2. กิ่ง red** พิจารณาเฉพาะตารางที่เหลือ

<table align="center">
  <tr><th>#</th><th>Size</th><th>Shape</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">big</td><td align="center">circle</td><td align="center">+</td></tr>
  <tr><td align="center">2</td><td align="center">small</td><td align="center">circle</td><td align="center">+</td></tr>
  <tr><td align="center">3</td><td align="center">small</td><td align="center">square</td><td align="center">-</td></tr>
</table>

$$\text{Entropy}(S_{Color=red})=-\frac{2}{3}\log_{10}\frac{2}{3}-\frac{1}{3}\log_{10}\frac{1}{3}=0.2764$$

**Size** (big $1+,0-$, small $1+,1-$)

$$\text{Entropy}(S_{Size=big})=0,\qquad \text{Entropy}(S_{Size=small})=0.3010$$

$$\text{Gain}(S_{Color=red},Size)=0.2764-\frac{1}{3}(0)-\frac{2}{3}(0.3010)=0.0757$$

**Shape** (circle $2+,0-$, square $0+,1-$)

$$\text{Entropy}(S_{Shape=circle})=0,\qquad \text{Entropy}(S_{Shape=square})=0$$

$$\text{Gain}(S_{Color=red},Shape)=0.2764-\frac{2}{3}(0)-\frac{1}{3}(0)=0.2764$$

เปรียบเทียบ

$$\text{Gain}(S_{Color=red},Shape)=0.2764\ >\ \text{Gain}(S_{Color=red},Size)=0.0757$$

Shape มี Gain มากที่สุด จึงเป็น node ของกิ่ง red

กิ่งที่ Entropy = 0 เป็น leaf: circle $\to$ **+**, square $\to$ **-**

**ต้นไม้ที่ได้**

<div align="center">
<svg viewBox="0 0 390 272" width="390" role="img" aria-label="ต้นไม้ ID3 ของข้อมูลรูปทรง" xmlns="http://www.w3.org/2000/svg">
<line x1="228" y1="58" x2="130" y2="118" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="154" x2="65" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="154" x2="195" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="228" y1="58" x2="325" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="130" cy="136" rx="43" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="228" cy="40" rx="43" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="173" y="86" text-anchor="end" font-size="13" fill="currentColor">red</text>
<text x="92" y="184" text-anchor="end" font-size="13" fill="currentColor">circle</text>
<text x="65" y="237" text-anchor="middle" font-size="15" fill="currentColor">+</text>
<text x="170" y="184" text-anchor="start" font-size="13" fill="currentColor">square</text>
<text x="195" y="237" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="130" y="141" text-anchor="middle" font-size="15" fill="currentColor">Shape</text>
<text x="284" y="88" text-anchor="start" font-size="13" fill="currentColor">blue</text>
<text x="325" y="141" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="228" y="45" text-anchor="middle" font-size="15" fill="currentColor">Color</text>
</svg>
</div>

เขียนเป็นตารางโครงสร้างข้อมูล (id ตามชั้น จากบนลงล่าง ซ้ายไปขวา)

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">Color</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">Shape</td><td align="center">red</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">-</td><td align="center">blue</td></tr>
  <tr><td align="center">4</td><td align="center">2</td><td align="center">+</td><td align="center">circle</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">-</td><td align="center">square</td></tr>
</table>

**Ans** ต้นไม้และตารางข้างบน

---

### ตัวอย่างโจทย์ 9

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

---

### ตัวอย่างโจทย์ 10

จากข้อมูลในตารางต่อไปนี้ จงสร้างต้นไม้ ID3 (เลือก attribute ด้วย Information Gain) ให้ครบทุกกิ่ง แล้วเขียนเป็นตารางโครงสร้างข้อมูล

<table align="center">
  <tr><th>#</th><th>A</th><th>B</th><th>C</th><th>D</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">1</td><td align="center">2</td><td align="center">+</td></tr>
  <tr><td align="center">2</td><td align="center">2</td><td align="center">1</td><td align="center">1</td><td align="center">2</td><td align="center">-</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">2</td><td align="center">2</td><td align="center">2</td><td align="center">+</td></tr>
  <tr><td align="center">4</td><td align="center">3</td><td align="center">2</td><td align="center">2</td><td align="center">1</td><td align="center">-</td></tr>
  <tr><td align="center">5</td><td align="center">1</td><td align="center">2</td><td align="center">4</td><td align="center">2</td><td align="center">+</td></tr>
  <tr><td align="center">6</td><td align="center">3</td><td align="center">2</td><td align="center">1</td><td align="center">2</td><td align="center">-</td></tr>
  <tr><td align="center">7</td><td align="center">1</td><td align="center">2</td><td align="center">1</td><td align="center">3</td><td align="center">-</td></tr>
  <tr><td align="center">8</td><td align="center">2</td><td align="center">1</td><td align="center">1</td><td align="center">1</td><td align="center">-</td></tr>
</table>

#### Sol<sup>n</sup>

**1. หา node ราก**

จากสูตร

$$\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c,\qquad \text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)$$

$S$ มี $3+,5-$ (รวม 8)

$$\text{Entropy}(S)=-\frac{3}{8}\log_{10}\frac{3}{8}-\frac{5}{8}\log_{10}\frac{5}{8}=0.2873$$

**A** (1 $3+,1-$, 2 $0+,2-$, 3 $0+,2-$)

$$\text{Entropy}(S_{A=1})=0.2442,\qquad \text{Entropy}(S_{A=2})=0,\qquad \text{Entropy}(S_{A=3})=0$$

$$\text{Gain}(S,A)=0.2873-\frac{4}{8}(0.2442)-\frac{2}{8}(0)-\frac{2}{8}(0)=0.1652$$

**B** (2 $3+,3-$, 1 $0+,2-$)

$$\text{Entropy}(S_{B=2})=0.3010,\qquad \text{Entropy}(S_{B=1})=0$$

$$\text{Gain}(S,B)=0.2873-\frac{6}{8}(0.3010)-\frac{2}{8}(0)=0.0616$$

**C** (1 $1+,4-$, 2 $1+,1-$, 4 $1+,0-$)

$$\text{Entropy}(S_{C=1})=0.2173,\qquad \text{Entropy}(S_{C=2})=0.3010,\qquad \text{Entropy}(S_{C=4})=0$$

$$\text{Gain}(S,C)=0.2873-\frac{5}{8}(0.2173)-\frac{2}{8}(0.3010)-\frac{1}{8}(0)=0.0762$$

**D** (2 $3+,2-$, 1 $0+,2-$, 3 $0+,1-$)

$$\text{Entropy}(S_{D=2})=0.2923,\qquad \text{Entropy}(S_{D=1})=0,\qquad \text{Entropy}(S_{D=3})=0$$

$$\text{Gain}(S,D)=0.2873-\frac{5}{8}(0.2923)-\frac{2}{8}(0)-\frac{1}{8}(0)=0.1046$$

เปรียบเทียบ

$$\text{Gain}(S,A)=0.1652\ >\ \text{Gain}(S,D)=0.1046\ >\ \text{Gain}(S,C)=0.0762\ >\ \text{Gain}(S,B)=0.0616$$

A มี Gain มากที่สุด จึงเป็น node ราก

กิ่งที่ Entropy = 0 เป็น leaf: 2 $\to$ **-**, 3 $\to$ **-**

ต้นไม้หลังเลือก node ราก (? คือกิ่งที่ต้องแบ่งต่อ)

<div align="center">
<svg viewBox="0 0 390 232" width="390" role="img" aria-label="ต้นไม้หลังเลือก node ราก" xmlns="http://www.w3.org/2000/svg">
<line x1="195" y1="58" x2="65" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="195" y1="58" x2="195" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="195" y1="58" x2="325" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="195" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="124" y="88" text-anchor="end" font-size="13" fill="currentColor">1</text>
<text x="65" y="141" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<text x="65" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 1,3,5,7</text>
<text x="65" y="192" text-anchor="middle" font-size="13" fill="currentColor">3+, 1-</text>
<text x="203" y="88" text-anchor="start" font-size="13" fill="currentColor">2</text>
<text x="195" y="141" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="195" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 2,8</text>
<text x="195" y="192" text-anchor="middle" font-size="13" fill="currentColor">0+, 2-</text>
<text x="268" y="88" text-anchor="start" font-size="13" fill="currentColor">3</text>
<text x="325" y="141" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="325" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 4,6</text>
<text x="325" y="192" text-anchor="middle" font-size="13" fill="currentColor">0+, 2-</text>
<text x="195" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
</svg>
</div>

**2. กิ่ง A = 1** พิจารณาเฉพาะตารางที่เหลือ

<table align="center">
  <tr><th>#</th><th>B</th><th>C</th><th>D</th><th>Target</th></tr>
  <tr><td align="center">1</td><td align="center">2</td><td align="center">1</td><td align="center">2</td><td align="center">+</td></tr>
  <tr><td align="center">3</td><td align="center">2</td><td align="center">2</td><td align="center">2</td><td align="center">+</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">4</td><td align="center">2</td><td align="center">+</td></tr>
  <tr><td align="center">7</td><td align="center">2</td><td align="center">1</td><td align="center">3</td><td align="center">-</td></tr>
</table>

$$\text{Entropy}(S_{A=1})=-\frac{3}{4}\log_{10}\frac{3}{4}-\frac{1}{4}\log_{10}\frac{1}{4}=0.2442$$

**B** (2 $3+,1-$)

$$\text{Entropy}(S_{B=2})=0.2442$$

$$\text{Gain}(S_{A=1},B)=0.2442-\frac{4}{4}(0.2442)=0.0000$$

**C** (1 $1+,1-$, 2 $1+,0-$, 4 $1+,0-$)

$$\text{Entropy}(S_{C=1})=0.3010,\qquad \text{Entropy}(S_{C=2})=0,\qquad \text{Entropy}(S_{C=4})=0$$

$$\text{Gain}(S_{A=1},C)=0.2442-\frac{2}{4}(0.3010)-\frac{1}{4}(0)-\frac{1}{4}(0)=0.0937$$

**D** (2 $3+,0-$, 3 $0+,1-$)

$$\text{Entropy}(S_{D=2})=0,\qquad \text{Entropy}(S_{D=3})=0$$

$$\text{Gain}(S_{A=1},D)=0.2442-\frac{3}{4}(0)-\frac{1}{4}(0)=0.2442$$

เปรียบเทียบ

$$\text{Gain}(S_{A=1},D)=0.2442\ >\ \text{Gain}(S_{A=1},C)=0.0937\ >\ \text{Gain}(S_{A=1},B)=0.0000$$

D มี Gain มากที่สุด จึงเป็น node ของกิ่ง A = 1

กิ่งที่ Entropy = 0 เป็น leaf: 2 $\to$ **+**, 3 $\to$ **-**

**ต้นไม้ที่ได้**

<div align="center">
<svg viewBox="0 0 520 272" width="520" role="img" aria-label="ต้นไม้ ID3 ของข้อมูล A B C D" xmlns="http://www.w3.org/2000/svg">
<line x1="292" y1="58" x2="130" y2="118" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="154" x2="65" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="154" x2="195" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="292" y1="58" x2="325" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="292" y1="58" x2="455" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="130" cy="136" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="431" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="292" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="205" y="86" text-anchor="end" font-size="13" fill="currentColor">1</text>
<text x="92" y="184" text-anchor="end" font-size="13" fill="currentColor">2</text>
<text x="65" y="237" text-anchor="middle" font-size="15" fill="currentColor">+</text>
<text x="170" y="184" text-anchor="start" font-size="13" fill="currentColor">3</text>
<text x="195" y="237" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="130" y="141" text-anchor="middle" font-size="15" fill="currentColor">D</text>
<text x="317" y="88" text-anchor="start" font-size="13" fill="currentColor">2</text>
<text x="325" y="141" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="382" y="88" text-anchor="start" font-size="13" fill="currentColor">3</text>
<text x="455" y="141" text-anchor="middle" font-size="15" fill="currentColor">-</text>
<text x="292" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
</svg>
</div>

เขียนเป็นตารางโครงสร้างข้อมูล (id ตามชั้น จากบนลงล่าง ซ้ายไปขวา)

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">D</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">-</td><td align="center">2</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">-</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">+</td><td align="center">2</td></tr>
  <tr><td align="center">6</td><td align="center">2</td><td align="center">-</td><td align="center">3</td></tr>
</table>

**Ans** ต้นไม้และตารางข้างบน

---

### แบบฝึกหัด 1

จากต้นไม้ในรูป (ตัวเลขที่กิ่งคือค่าบนกิ่ง) จงเขียนโครงสร้างข้อมูลแบบตาราง (id, Parent, Node, Branch)

<div align="center">
<svg viewBox="0 0 440 320" width="440" role="img" aria-label="ต้นไม้ A ถึง J พร้อมค่าบนกิ่ง" xmlns="http://www.w3.org/2000/svg">
<line x1="200" y1="58" x2="80" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="134" y="78" text-anchor="end" font-size="13" fill="currentColor">1</text>
<line x1="200" y1="58" x2="200" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="208" y="78" text-anchor="start" font-size="13" fill="currentColor">2</text>
<line x1="200" y1="58" x2="320" y2="102" stroke="currentColor" stroke-width="1.5"/>
<text x="268" y="78" text-anchor="start" font-size="13" fill="currentColor">3</text>
<line x1="80" y1="138" x2="40" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="54" y="158" text-anchor="end" font-size="13" fill="currentColor">4</text>
<line x1="80" y1="138" x2="120" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="108" y="158" text-anchor="start" font-size="13" fill="currentColor">5</text>
<line x1="200" y1="138" x2="200" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="208" y="158" text-anchor="start" font-size="13" fill="currentColor">6</text>
<line x1="320" y1="138" x2="280" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="294" y="158" text-anchor="end" font-size="13" fill="currentColor">7</text>
<line x1="320" y1="138" x2="360" y2="182" stroke="currentColor" stroke-width="1.5"/>
<text x="348" y="158" text-anchor="start" font-size="13" fill="currentColor">8</text>
<line x1="200" y1="218" x2="200" y2="262" stroke="currentColor" stroke-width="1.5"/>
<text x="208" y="238" text-anchor="start" font-size="13" fill="currentColor">9</text>
<circle cx="200" cy="40" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
<circle cx="80" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="80" y="125" text-anchor="middle" font-size="15" fill="currentColor">B</text>
<circle cx="200" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="125" text-anchor="middle" font-size="15" fill="currentColor">C</text>
<circle cx="320" cy="120" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="320" y="125" text-anchor="middle" font-size="15" fill="currentColor">D</text>
<circle cx="40" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="205" text-anchor="middle" font-size="15" fill="currentColor">E</text>
<circle cx="120" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="120" y="205" text-anchor="middle" font-size="15" fill="currentColor">F</text>
<circle cx="200" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="205" text-anchor="middle" font-size="15" fill="currentColor">G</text>
<circle cx="280" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="280" y="205" text-anchor="middle" font-size="15" fill="currentColor">H</text>
<circle cx="360" cy="200" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="360" y="205" text-anchor="middle" font-size="15" fill="currentColor">I</text>
<circle cx="200" cy="280" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="200" y="285" text-anchor="middle" font-size="15" fill="currentColor">J</text>
</svg>
</div>

#### Sol<sup>n</sup>

เรียง id ตามชั้นของต้นไม้ จากบนลงล่าง และซ้ายไปขวา (Parent คือ id ของ node แม่ ราก = 0, Branch คือค่าบนกิ่งที่ลงมาถึง node นั้น)

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">B</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">C</td><td align="center">2</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">D</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">E</td><td align="center">4</td></tr>
  <tr><td align="center">6</td><td align="center">2</td><td align="center">F</td><td align="center">5</td></tr>
  <tr><td align="center">7</td><td align="center">3</td><td align="center">G</td><td align="center">6</td></tr>
  <tr><td align="center">8</td><td align="center">4</td><td align="center">H</td><td align="center">7</td></tr>
  <tr><td align="center">9</td><td align="center">4</td><td align="center">I</td><td align="center">8</td></tr>
  <tr><td align="center">10</td><td align="center">7</td><td align="center">J</td><td align="center">9</td></tr>
</table>

**Ans** ตารางข้างบน

### แบบฝึกหัด 2

จากตารางโครงสร้างข้อมูลของต้นไม้ต่อไปนี้ จงวาดต้นไม้

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">A</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">B</td><td align="center">1</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">C</td><td align="center">2</td></tr>
  <tr><td align="center">4</td><td align="center">2</td><td align="center">Y</td><td align="center">3</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">N</td><td align="center">4</td></tr>
  <tr><td align="center">6</td><td align="center">3</td><td align="center">D</td><td align="center">5</td></tr>
  <tr><td align="center">7</td><td align="center">3</td><td align="center">Y</td><td align="center">6</td></tr>
  <tr><td align="center">8</td><td align="center">6</td><td align="center">N</td><td align="center">7</td></tr>
  <tr><td align="center">9</td><td align="center">6</td><td align="center">Y</td><td align="center">8</td></tr>
</table>

#### Sol<sup>n</sup>

id 1 ไม่มี Parent (Parent = 0) จึงเป็น node ราก แล้วต่อ node ลูกตามคอลัมน์ Parent

- ลูกของ A (id 1): B (id 2) และ C (id 3)
- ลูกของ B (id 2): Y (id 4) และ N (id 5)
- ลูกของ C (id 3): D (id 6) และ Y (id 7)
- ลูกของ D (id 6): N (id 8) และ Y (id 9)

<div align="center">
<svg viewBox="0 0 650 368" width="560" role="img" aria-label="ต้นไม้จากตารางโครงสร้างข้อมูล" xmlns="http://www.w3.org/2000/svg">
<line x1="309" y1="58" x2="130" y2="118" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="154" x2="65" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="154" x2="195" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="309" y1="58" x2="488" y2="118" stroke="currentColor" stroke-width="1.5"/>
<line x1="488" y1="154" x2="390" y2="214" stroke="currentColor" stroke-width="1.5"/>
<line x1="390" y1="250" x2="325" y2="314" stroke="currentColor" stroke-width="1.5"/>
<line x1="390" y1="250" x2="455" y2="314" stroke="currentColor" stroke-width="1.5"/>
<line x1="488" y1="154" x2="585" y2="218" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="130" cy="136" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="314" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="431" y="314" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="390" cy="232" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="561" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="488" cy="136" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="309" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="213" y="86" text-anchor="end" font-size="13" fill="currentColor">1</text>
<text x="92" y="184" text-anchor="end" font-size="13" fill="currentColor">3</text>
<text x="65" y="237" text-anchor="middle" font-size="15" fill="currentColor">Y</text>
<text x="170" y="184" text-anchor="start" font-size="13" fill="currentColor">4</text>
<text x="195" y="237" text-anchor="middle" font-size="15" fill="currentColor">N</text>
<text x="130" y="141" text-anchor="middle" font-size="15" fill="currentColor">B</text>
<text x="406" y="86" text-anchor="start" font-size="13" fill="currentColor">2</text>
<text x="433" y="182" text-anchor="end" font-size="13" fill="currentColor">5</text>
<text x="352" y="280" text-anchor="end" font-size="13" fill="currentColor">7</text>
<text x="325" y="333" text-anchor="middle" font-size="15" fill="currentColor">N</text>
<text x="430" y="280" text-anchor="start" font-size="13" fill="currentColor">8</text>
<text x="455" y="333" text-anchor="middle" font-size="15" fill="currentColor">Y</text>
<text x="390" y="237" text-anchor="middle" font-size="15" fill="currentColor">D</text>
<text x="544" y="184" text-anchor="start" font-size="13" fill="currentColor">6</text>
<text x="585" y="237" text-anchor="middle" font-size="15" fill="currentColor">Y</text>
<text x="488" y="141" text-anchor="middle" font-size="15" fill="currentColor">C</text>
<text x="309" y="45" text-anchor="middle" font-size="15" fill="currentColor">A</text>
</svg>
</div>

**Ans** ต้นไม้ข้างบน

### แบบฝึกหัด 3

จากข้อมูลในตารางต่อไปนี้ จงสร้างต้นไม้ ID3 (เลือก attribute ด้วย Information Gain) ให้ครบทุกกิ่ง แล้วเขียนเป็นตารางโครงสร้างข้อมูล

<table align="center">
  <tr><th>#</th><th>Age</th><th>Income</th><th>Student</th><th>Buy</th></tr>
  <tr><td align="center">1</td><td align="center">Middle</td><td align="center">Low</td><td align="center">No</td><td align="center">No</td></tr>
  <tr><td align="center">2</td><td align="center">Young</td><td align="center">Low</td><td align="center">Yes</td><td align="center">Yes</td></tr>
  <tr><td align="center">3</td><td align="center">Young</td><td align="center">High</td><td align="center">No</td><td align="center">Yes</td></tr>
  <tr><td align="center">4</td><td align="center">Old</td><td align="center">High</td><td align="center">No</td><td align="center">No</td></tr>
  <tr><td align="center">5</td><td align="center">Young</td><td align="center">Low</td><td align="center">No</td><td align="center">No</td></tr>
  <tr><td align="center">6</td><td align="center">Old</td><td align="center">Low</td><td align="center">Yes</td><td align="center">No</td></tr>
  <tr><td align="center">7</td><td align="center">Young</td><td align="center">Low</td><td align="center">Yes</td><td align="center">Yes</td></tr>
  <tr><td align="center">8</td><td align="center">Middle</td><td align="center">High</td><td align="center">Yes</td><td align="center">No</td></tr>
</table>

#### Sol<sup>n</sup>

**1. หา node ราก**

จากสูตร

$$\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c,\qquad \text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)$$

$S$ มี $3+,5-$ (รวม 8)

$$\text{Entropy}(S)=-\frac{3}{8}\log_{10}\frac{3}{8}-\frac{5}{8}\log_{10}\frac{5}{8}=0.2873$$

**Age** (Middle $0+,2-$, Young $3+,1-$, Old $0+,2-$)

$$\text{Entropy}(S_{Age=Middle})=0,\qquad \text{Entropy}(S_{Age=Young})=0.2442,\qquad \text{Entropy}(S_{Age=Old})=0$$

$$\text{Gain}(S,Age)=0.2873-\frac{2}{8}(0)-\frac{4}{8}(0.2442)-\frac{2}{8}(0)=0.1652$$

**Income** (Low $2+,3-$, High $1+,2-$)

$$\text{Entropy}(S_{Income=Low})=0.2923,\qquad \text{Entropy}(S_{Income=High})=0.2764$$

$$\text{Gain}(S,Income)=0.2873-\frac{5}{8}(0.2923)-\frac{3}{8}(0.2764)=0.0010$$

**Student** (No $1+,3-$, Yes $2+,2-$)

$$\text{Entropy}(S_{Student=No})=0.2442,\qquad \text{Entropy}(S_{Student=Yes})=0.3010$$

$$\text{Gain}(S,Student)=0.2873-\frac{4}{8}(0.2442)-\frac{4}{8}(0.3010)=0.0147$$

เปรียบเทียบ

$$\text{Gain}(S,Age)=0.1652\ >\ \text{Gain}(S,Student)=0.0147\ >\ \text{Gain}(S,Income)=0.0010$$

Age มี Gain มากที่สุด จึงเป็น node ราก

กิ่งที่ Entropy = 0 เป็น leaf: Middle $\to$ **No**, Old $\to$ **No**

ต้นไม้หลังเลือก node ราก (? คือกิ่งที่ต้องแบ่งต่อ)

<div align="center">
<svg viewBox="0 0 390 232" width="390" role="img" aria-label="ต้นไม้หลังเลือก node ราก" xmlns="http://www.w3.org/2000/svg">
<line x1="195" y1="58" x2="65" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="195" y1="58" x2="195" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="195" y1="58" x2="325" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="195" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="124" y="88" text-anchor="end" font-size="13" fill="currentColor">Middle</text>
<text x="65" y="141" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="65" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 1,8</text>
<text x="65" y="192" text-anchor="middle" font-size="13" fill="currentColor">0+, 2-</text>
<text x="203" y="88" text-anchor="start" font-size="13" fill="currentColor">Young</text>
<text x="195" y="141" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<text x="195" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 2,3,5,7</text>
<text x="195" y="192" text-anchor="middle" font-size="13" fill="currentColor">3+, 1-</text>
<text x="268" y="88" text-anchor="start" font-size="13" fill="currentColor">Old</text>
<text x="325" y="141" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="325" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 4,6</text>
<text x="325" y="192" text-anchor="middle" font-size="13" fill="currentColor">0+, 2-</text>
<text x="195" y="45" text-anchor="middle" font-size="15" fill="currentColor">Age</text>
</svg>
</div>

**2. กิ่ง Young** พิจารณาเฉพาะตารางที่เหลือ

<table align="center">
  <tr><th>#</th><th>Income</th><th>Student</th><th>Buy</th></tr>
  <tr><td align="center">2</td><td align="center">Low</td><td align="center">Yes</td><td align="center">Yes</td></tr>
  <tr><td align="center">3</td><td align="center">High</td><td align="center">No</td><td align="center">Yes</td></tr>
  <tr><td align="center">5</td><td align="center">Low</td><td align="center">No</td><td align="center">No</td></tr>
  <tr><td align="center">7</td><td align="center">Low</td><td align="center">Yes</td><td align="center">Yes</td></tr>
</table>

$$\text{Entropy}(S_{Age=Young})=-\frac{3}{4}\log_{10}\frac{3}{4}-\frac{1}{4}\log_{10}\frac{1}{4}=0.2442$$

**Income** (Low $2+,1-$, High $1+,0-$)

$$\text{Entropy}(S_{Income=Low})=0.2764,\qquad \text{Entropy}(S_{Income=High})=0$$

$$\text{Gain}(S_{Age=Young},Income)=0.2442-\frac{3}{4}(0.2764)-\frac{1}{4}(0)=0.0369$$

**Student** (Yes $2+,0-$, No $1+,1-$)

$$\text{Entropy}(S_{Student=Yes})=0,\qquad \text{Entropy}(S_{Student=No})=0.3010$$

$$\text{Gain}(S_{Age=Young},Student)=0.2442-\frac{2}{4}(0)-\frac{2}{4}(0.3010)=0.0937$$

เปรียบเทียบ

$$\text{Gain}(S_{Age=Young},Student)=0.0937\ >\ \text{Gain}(S_{Age=Young},Income)=0.0369$$

Student มี Gain มากที่สุด จึงเป็น node ของกิ่ง Young

กิ่งที่ Entropy = 0 เป็น leaf: Yes $\to$ **Yes**

ต้นไม้หลังเลือก node ของกิ่ง Young (? คือกิ่งที่ต้องแบ่งต่อ)

<div align="center">
<svg viewBox="0 0 520 328" width="520" role="img" aria-label="ต้นไม้หลังเลือก node ของกิ่ง Young" xmlns="http://www.w3.org/2000/svg">
<line x1="260" y1="58" x2="65" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="260" y1="58" x2="260" y2="118" stroke="currentColor" stroke-width="1.5"/>
<line x1="260" y1="154" x2="195" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="260" y1="154" x2="325" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="260" y1="58" x2="455" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="260" cy="136" rx="53" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="431" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="260" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="156" y="88" text-anchor="end" font-size="13" fill="currentColor">Middle</text>
<text x="65" y="141" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="65" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 1,8</text>
<text x="65" y="192" text-anchor="middle" font-size="13" fill="currentColor">0+, 2-</text>
<text x="268" y="86" text-anchor="start" font-size="13" fill="currentColor">Young</text>
<text x="222" y="184" text-anchor="end" font-size="13" fill="currentColor">Yes</text>
<text x="195" y="237" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<text x="195" y="270" text-anchor="middle" font-size="13" fill="currentColor"># 2,7</text>
<text x="195" y="288" text-anchor="middle" font-size="13" fill="currentColor">2+, 0-</text>
<text x="300" y="184" text-anchor="start" font-size="13" fill="currentColor">No</text>
<text x="325" y="237" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<text x="325" y="270" text-anchor="middle" font-size="13" fill="currentColor"># 3,5</text>
<text x="325" y="288" text-anchor="middle" font-size="13" fill="currentColor">1+, 1-</text>
<text x="260" y="141" text-anchor="middle" font-size="15" fill="currentColor">Student</text>
<text x="366" y="88" text-anchor="start" font-size="13" fill="currentColor">Old</text>
<text x="455" y="141" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="455" y="174" text-anchor="middle" font-size="13" fill="currentColor"># 4,6</text>
<text x="455" y="192" text-anchor="middle" font-size="13" fill="currentColor">0+, 2-</text>
<text x="260" y="45" text-anchor="middle" font-size="15" fill="currentColor">Age</text>
</svg>
</div>

**3. กิ่ง No** พิจารณาเฉพาะตารางที่เหลือ

<table align="center">
  <tr><th>#</th><th>Income</th><th>Buy</th></tr>
  <tr><td align="center">3</td><td align="center">High</td><td align="center">Yes</td></tr>
  <tr><td align="center">5</td><td align="center">Low</td><td align="center">No</td></tr>
</table>

$$\text{Entropy}(S_{Student=No})=-\frac{1}{2}\log_{10}\frac{1}{2}-\frac{1}{2}\log_{10}\frac{1}{2}=0.3010$$

**Income** (High $1+,0-$, Low $0+,1-$)

$$\text{Entropy}(S_{Income=High})=0,\qquad \text{Entropy}(S_{Income=Low})=0$$

$$\text{Gain}(S_{Student=No},Income)=0.3010-\frac{1}{2}(0)-\frac{1}{2}(0)=0.3010$$

เปรียบเทียบ

$$\text{Gain}(S_{Student=No},Income)=0.3010$$

Income มี Gain มากที่สุด จึงเป็น node ของกิ่ง No

กิ่งที่ Entropy = 0 เป็น leaf: High $\to$ **Yes**, Low $\to$ **No**

**ต้นไม้ที่ได้**

<div align="center">
<svg viewBox="0 0 650 368" width="560" role="img" aria-label="ต้นไม้ ID3 ของข้อมูลการซื้อ" xmlns="http://www.w3.org/2000/svg">
<line x1="325" y1="58" x2="65" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="325" y1="58" x2="292" y2="118" stroke="currentColor" stroke-width="1.5"/>
<line x1="292" y1="154" x2="195" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="292" y1="154" x2="390" y2="214" stroke="currentColor" stroke-width="1.5"/>
<line x1="390" y1="250" x2="325" y2="314" stroke="currentColor" stroke-width="1.5"/>
<line x1="390" y1="250" x2="455" y2="314" stroke="currentColor" stroke-width="1.5"/>
<line x1="325" y1="58" x2="585" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="314" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="431" y="314" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="390" cy="232" rx="48" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="292" cy="136" rx="53" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="561" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="325" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="189" y="88" text-anchor="end" font-size="13" fill="currentColor">Middle</text>
<text x="65" y="141" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="303" y="86" text-anchor="end" font-size="13" fill="currentColor">Young</text>
<text x="238" y="184" text-anchor="end" font-size="13" fill="currentColor">Yes</text>
<text x="195" y="237" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<text x="349" y="182" text-anchor="start" font-size="13" fill="currentColor">No</text>
<text x="352" y="280" text-anchor="end" font-size="13" fill="currentColor">High</text>
<text x="325" y="333" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<text x="430" y="280" text-anchor="start" font-size="13" fill="currentColor">Low</text>
<text x="455" y="333" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="390" y="237" text-anchor="middle" font-size="15" fill="currentColor">Income</text>
<text x="292" y="141" text-anchor="middle" font-size="15" fill="currentColor">Student</text>
<text x="463" y="88" text-anchor="start" font-size="13" fill="currentColor">Old</text>
<text x="585" y="141" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="325" y="45" text-anchor="middle" font-size="15" fill="currentColor">Age</text>
</svg>
</div>

เขียนเป็นตารางโครงสร้างข้อมูล (id ตามชั้น จากบนลงล่าง ซ้ายไปขวา)

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">Age</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">No</td><td align="center">Middle</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">Student</td><td align="center">Young</td></tr>
  <tr><td align="center">4</td><td align="center">1</td><td align="center">No</td><td align="center">Old</td></tr>
  <tr><td align="center">5</td><td align="center">3</td><td align="center">Yes</td><td align="center">Yes</td></tr>
  <tr><td align="center">6</td><td align="center">3</td><td align="center">Income</td><td align="center">No</td></tr>
  <tr><td align="center">7</td><td align="center">6</td><td align="center">Yes</td><td align="center">High</td></tr>
  <tr><td align="center">8</td><td align="center">6</td><td align="center">No</td><td align="center">Low</td></tr>
</table>

**Ans** ต้นไม้และตารางข้างบน

### แบบฝึกหัด 4

จากข้อมูลในตารางต่อไปนี้ จงสร้างต้นไม้ ID3 (เลือก attribute ด้วย Information Gain) ให้ครบทุกกิ่ง แล้วเขียนเป็นตารางโครงสร้างข้อมูล

<table align="center">
  <tr><th>Day</th><th>Weather</th><th>Temp</th><th>Wind</th><th>Play</th></tr>
  <tr><td align="center">1</td><td align="center">Rainy</td><td align="center">Cool</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">2</td><td align="center">Sunny</td><td align="center">Cool</td><td align="center">Strong</td><td align="center">Yes</td></tr>
  <tr><td align="center">3</td><td align="center">Sunny</td><td align="center">Hot</td><td align="center">Strong</td><td align="center">No</td></tr>
  <tr><td align="center">4</td><td align="center">Cloudy</td><td align="center">Cool</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">5</td><td align="center">Sunny</td><td align="center">Hot</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">6</td><td align="center">Cloudy</td><td align="center">Hot</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">7</td><td align="center">Rainy</td><td align="center">Cool</td><td align="center">Strong</td><td align="center">Yes</td></tr>
  <tr><td align="center">8</td><td align="center">Sunny</td><td align="center">Cool</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">9</td><td align="center">Rainy</td><td align="center">Hot</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">10</td><td align="center">Cloudy</td><td align="center">Cool</td><td align="center">Strong</td><td align="center">Yes</td></tr>
</table>

#### Sol<sup>n</sup>

**1. หา node ราก**

จากสูตร

$$\text{Entropy}(S)=-\sum_{c}p_c\log_{10}p_c,\qquad \text{Gain}(S,A)=\text{Entropy}(S)-\sum_{v\in A}\frac{|S_v|}{|S|}\,\text{Entropy}(S_v)$$

$S$ มี $4+,6-$ (รวม 10)

$$\text{Entropy}(S)=-\frac{4}{10}\log_{10}\frac{4}{10}-\frac{6}{10}\log_{10}\frac{6}{10}=0.2923$$

**Weather** (Rainy $2+,1-$, Sunny $1+,3-$, Cloudy $1+,2-$)

$$\text{Entropy}(S_{Weather=Rainy})=0.2764,\qquad \text{Entropy}(S_{Weather=Sunny})=0.2442,\qquad \text{Entropy}(S_{Weather=Cloudy})=0.2764$$

$$\text{Gain}(S,Weather)=0.2923-\frac{3}{10}(0.2764)-\frac{4}{10}(0.2442)-\frac{3}{10}(0.2764)=0.0288$$

**Temp** (Cool $4+,2-$, Hot $0+,4-$)

$$\text{Entropy}(S_{Temp=Cool})=0.2764,\qquad \text{Entropy}(S_{Temp=Hot})=0$$

$$\text{Gain}(S,Temp)=0.2923-\frac{6}{10}(0.2764)-\frac{4}{10}(0)=0.1265$$

**Wind** (Weak $1+,5-$, Strong $3+,1-$)

$$\text{Entropy}(S_{Wind=Weak})=0.1957,\qquad \text{Entropy}(S_{Wind=Strong})=0.2442$$

$$\text{Gain}(S,Wind)=0.2923-\frac{6}{10}(0.1957)-\frac{4}{10}(0.2442)=0.0772$$

เปรียบเทียบ

$$\text{Gain}(S,Temp)=0.1265\ >\ \text{Gain}(S,Wind)=0.0772\ >\ \text{Gain}(S,Weather)=0.0288$$

Temp มี Gain มากที่สุด จึงเป็น node ราก

กิ่งที่ Entropy = 0 เป็น leaf: Hot $\to$ **No**

ต้นไม้หลังเลือก node ราก (? คือกิ่งที่ต้องแบ่งต่อ)

<div align="center">
<svg viewBox="0 0 260 232" width="260" role="img" aria-label="ต้นไม้หลังเลือก node ราก" xmlns="http://www.w3.org/2000/svg">
<line x1="130" y1="58" x2="65" y2="122" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="58" x2="195" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="130" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="92" y="88" text-anchor="end" font-size="13" fill="currentColor">Cool</text>
<text x="65" y="141" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<text x="65" y="174" text-anchor="middle" font-size="13" fill="currentColor">Day 1,2,4,7,8,10</text>
<text x="65" y="192" text-anchor="middle" font-size="13" fill="currentColor">4+, 2-</text>
<text x="170" y="88" text-anchor="start" font-size="13" fill="currentColor">Hot</text>
<text x="195" y="141" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="195" y="174" text-anchor="middle" font-size="13" fill="currentColor">Day 3,5,6,9</text>
<text x="195" y="192" text-anchor="middle" font-size="13" fill="currentColor">0+, 4-</text>
<text x="130" y="45" text-anchor="middle" font-size="15" fill="currentColor">Temp</text>
</svg>
</div>

**2. กิ่ง Cool** พิจารณาเฉพาะตารางที่เหลือ

<table align="center">
  <tr><th>Day</th><th>Weather</th><th>Wind</th><th>Play</th></tr>
  <tr><td align="center">1</td><td align="center">Rainy</td><td align="center">Weak</td><td align="center">Yes</td></tr>
  <tr><td align="center">2</td><td align="center">Sunny</td><td align="center">Strong</td><td align="center">Yes</td></tr>
  <tr><td align="center">4</td><td align="center">Cloudy</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">7</td><td align="center">Rainy</td><td align="center">Strong</td><td align="center">Yes</td></tr>
  <tr><td align="center">8</td><td align="center">Sunny</td><td align="center">Weak</td><td align="center">No</td></tr>
  <tr><td align="center">10</td><td align="center">Cloudy</td><td align="center">Strong</td><td align="center">Yes</td></tr>
</table>

$$\text{Entropy}(S_{Temp=Cool})=-\frac{4}{6}\log_{10}\frac{4}{6}-\frac{2}{6}\log_{10}\frac{2}{6}=0.2764$$

**Weather** (Rainy $2+,0-$, Sunny $1+,1-$, Cloudy $1+,1-$)

$$\text{Entropy}(S_{Weather=Rainy})=0,\qquad \text{Entropy}(S_{Weather=Sunny})=0.3010,\qquad \text{Entropy}(S_{Weather=Cloudy})=0.3010$$

$$\text{Gain}(S_{Temp=Cool},Weather)=0.2764-\frac{2}{6}(0)-\frac{2}{6}(0.3010)-\frac{2}{6}(0.3010)=0.0757$$

**Wind** (Weak $1+,2-$, Strong $3+,0-$)

$$\text{Entropy}(S_{Wind=Weak})=0.2764,\qquad \text{Entropy}(S_{Wind=Strong})=0$$

$$\text{Gain}(S_{Temp=Cool},Wind)=0.2764-\frac{3}{6}(0.2764)-\frac{3}{6}(0)=0.1382$$

เปรียบเทียบ

$$\text{Gain}(S_{Temp=Cool},Wind)=0.1382\ >\ \text{Gain}(S_{Temp=Cool},Weather)=0.0757$$

Wind มี Gain มากที่สุด จึงเป็น node ของกิ่ง Cool

กิ่งที่ Entropy = 0 เป็น leaf: Strong $\to$ **Yes**

ต้นไม้หลังเลือก node ของกิ่ง Cool (? คือกิ่งที่ต้องแบ่งต่อ)

<div align="center">
<svg viewBox="0 0 390 328" width="390" role="img" aria-label="ต้นไม้หลังเลือก node ของกิ่ง Cool" xmlns="http://www.w3.org/2000/svg">
<line x1="228" y1="58" x2="130" y2="118" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="154" x2="65" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="154" x2="195" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="228" y1="58" x2="325" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="130" cy="136" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="228" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="173" y="86" text-anchor="end" font-size="13" fill="currentColor">Cool</text>
<text x="92" y="184" text-anchor="end" font-size="13" fill="currentColor">Weak</text>
<text x="65" y="237" text-anchor="middle" font-size="15" fill="currentColor">?</text>
<text x="65" y="270" text-anchor="middle" font-size="13" fill="currentColor">Day 1,4,8</text>
<text x="65" y="288" text-anchor="middle" font-size="13" fill="currentColor">1+, 2-</text>
<text x="170" y="184" text-anchor="start" font-size="13" fill="currentColor">Strong</text>
<text x="195" y="237" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<text x="195" y="270" text-anchor="middle" font-size="13" fill="currentColor">Day 2,7,10</text>
<text x="195" y="288" text-anchor="middle" font-size="13" fill="currentColor">3+, 0-</text>
<text x="130" y="141" text-anchor="middle" font-size="15" fill="currentColor">Wind</text>
<text x="284" y="88" text-anchor="start" font-size="13" fill="currentColor">Hot</text>
<text x="325" y="141" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="325" y="174" text-anchor="middle" font-size="13" fill="currentColor">Day 3,5,6,9</text>
<text x="325" y="192" text-anchor="middle" font-size="13" fill="currentColor">0+, 4-</text>
<text x="228" y="45" text-anchor="middle" font-size="15" fill="currentColor">Temp</text>
</svg>
</div>

**3. กิ่ง Weak** พิจารณาเฉพาะตารางที่เหลือ

<table align="center">
  <tr><th>Day</th><th>Weather</th><th>Play</th></tr>
  <tr><td align="center">1</td><td align="center">Rainy</td><td align="center">Yes</td></tr>
  <tr><td align="center">4</td><td align="center">Cloudy</td><td align="center">No</td></tr>
  <tr><td align="center">8</td><td align="center">Sunny</td><td align="center">No</td></tr>
</table>

$$\text{Entropy}(S_{Wind=Weak})=-\frac{1}{3}\log_{10}\frac{1}{3}-\frac{2}{3}\log_{10}\frac{2}{3}=0.2764$$

**Weather** (Rainy $1+,0-$, Cloudy $0+,1-$, Sunny $0+,1-$)

$$\text{Entropy}(S_{Weather=Rainy})=0,\qquad \text{Entropy}(S_{Weather=Cloudy})=0,\qquad \text{Entropy}(S_{Weather=Sunny})=0$$

$$\text{Gain}(S_{Wind=Weak},Weather)=0.2764-\frac{1}{3}(0)-\frac{1}{3}(0)-\frac{1}{3}(0)=0.2764$$

เปรียบเทียบ

$$\text{Gain}(S_{Wind=Weak},Weather)=0.2764$$

Weather มี Gain มากที่สุด จึงเป็น node ของกิ่ง Weak

กิ่งที่ Entropy = 0 เป็น leaf: Rainy $\to$ **Yes**, Cloudy $\to$ **No**, Sunny $\to$ **No**

**ต้นไม้ที่ได้**

<div align="center">
<svg viewBox="0 0 650 368" width="560" role="img" aria-label="ต้นไม้ ID3 ของข้อมูลการเล่น" xmlns="http://www.w3.org/2000/svg">
<line x1="455" y1="58" x2="325" y2="118" stroke="currentColor" stroke-width="1.5"/>
<line x1="325" y1="154" x2="195" y2="214" stroke="currentColor" stroke-width="1.5"/>
<line x1="195" y1="250" x2="65" y2="314" stroke="currentColor" stroke-width="1.5"/>
<line x1="195" y1="250" x2="195" y2="314" stroke="currentColor" stroke-width="1.5"/>
<line x1="195" y1="250" x2="325" y2="314" stroke="currentColor" stroke-width="1.5"/>
<line x1="325" y1="154" x2="455" y2="218" stroke="currentColor" stroke-width="1.5"/>
<line x1="455" y1="58" x2="585" y2="122" stroke="currentColor" stroke-width="1.5"/>
<rect x="41" y="314" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="171" y="314" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="301" y="314" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="195" cy="232" rx="53" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="431" y="218" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="325" cy="136" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="561" y="122" width="48" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
<ellipse cx="455" cy="40" rx="40" ry="18" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="384" y="86" text-anchor="end" font-size="13" fill="currentColor">Cool</text>
<text x="254" y="182" text-anchor="end" font-size="13" fill="currentColor">Weak</text>
<text x="124" y="280" text-anchor="end" font-size="13" fill="currentColor">Rainy</text>
<text x="65" y="333" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<text x="203" y="280" text-anchor="start" font-size="13" fill="currentColor">Cloudy</text>
<text x="195" y="333" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="268" y="280" text-anchor="start" font-size="13" fill="currentColor">Sunny</text>
<text x="325" y="333" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="195" y="237" text-anchor="middle" font-size="15" fill="currentColor">Weather</text>
<text x="398" y="184" text-anchor="start" font-size="13" fill="currentColor">Strong</text>
<text x="455" y="237" text-anchor="middle" font-size="15" fill="currentColor">Yes</text>
<text x="325" y="141" text-anchor="middle" font-size="15" fill="currentColor">Wind</text>
<text x="528" y="88" text-anchor="start" font-size="13" fill="currentColor">Hot</text>
<text x="585" y="141" text-anchor="middle" font-size="15" fill="currentColor">No</text>
<text x="455" y="45" text-anchor="middle" font-size="15" fill="currentColor">Temp</text>
</svg>
</div>

เขียนเป็นตารางโครงสร้างข้อมูล (id ตามชั้น จากบนลงล่าง ซ้ายไปขวา)

<table align="center">
  <tr><th>id</th><th>Parent</th><th>Node</th><th>Branch</th></tr>
  <tr><td align="center">1</td><td align="center">0</td><td align="center">Temp</td><td align="center">—</td></tr>
  <tr><td align="center">2</td><td align="center">1</td><td align="center">Wind</td><td align="center">Cool</td></tr>
  <tr><td align="center">3</td><td align="center">1</td><td align="center">No</td><td align="center">Hot</td></tr>
  <tr><td align="center">4</td><td align="center">2</td><td align="center">Weather</td><td align="center">Weak</td></tr>
  <tr><td align="center">5</td><td align="center">2</td><td align="center">Yes</td><td align="center">Strong</td></tr>
  <tr><td align="center">6</td><td align="center">4</td><td align="center">Yes</td><td align="center">Rainy</td></tr>
  <tr><td align="center">7</td><td align="center">4</td><td align="center">No</td><td align="center">Cloudy</td></tr>
  <tr><td align="center">8</td><td align="center">4</td><td align="center">No</td><td align="center">Sunny</td></tr>
</table>

**Ans** ต้นไม้และตารางข้างบน
