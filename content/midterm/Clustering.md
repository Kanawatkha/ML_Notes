# Clustering

**Clustering (การจัดกลุ่ม)** คือการแบ่งข้อมูล $X$ เป็นกลุ่ม (cluster) ตามความคล้ายกัน โดย **ไม่มี label $Y$** (Unsupervised Learning)

---

## 1. K-Means

**หลักการ** กำหนดจำนวนกลุ่ม $k$ (ค่า config) แล้วหา centroid $c_1,\dots,c_k$ ของแต่ละกลุ่ม โดยเริ่มจาก centroid เริ่มต้น (สุ่ม หรือโจทย์ให้มา)

**ขั้นตอน**

1. กำหนด $k$ และ centroid เริ่มต้น
2. **Assign** คำนวณ distance จากทุกจุดไปทุก centroid แล้วให้ label = centroid ที่ใกล้ที่สุด
3. **Update** คำนวณ centroid ใหม่ของแต่ละกลุ่มเป็นค่าเฉลี่ยของจุดในกลุ่ม
4. ทำซ้ำข้อ 2–3 จน label ไม่เปลี่ยน (หยุด)

**สรุปสูตร**

Distance (Manhattan)

$$d(\vec a,\vec b)=\|\vec a-\vec b\|_1=|a_1-b_1|+|a_2-b_2|+|a_3-b_3|$$

Assign

$$\text{label}(x_i)=\arg\min_{j}\ d(x_i,c_j)$$

Update

$$c_j=\frac{1}{|C_j|}\sum_{x_i\in C_j}x_i$$

### ตัวอย่างโจทย์ 1

จากข้อมูลในตารางต่อไปนี้ จงจัดกลุ่มด้วย K-Means เมื่อ $k=2$ โดยใช้ระยะแบบ Manhattan และ centroid เริ่มต้น $c_1=\begin{bmatrix}1&1&2\end{bmatrix}$, $c_2=\begin{bmatrix}0&0&1\end{bmatrix}$

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th></tr>
  <tr><td align="center">x₁</td><td align="center">1</td><td align="center">1</td><td align="center">2</td></tr>
  <tr><td align="center">x₂</td><td align="center">0</td><td align="center">0</td><td align="center">1</td></tr>
  <tr><td align="center">x₃</td><td align="center">5</td><td align="center">4</td><td align="center">3</td></tr>
  <tr><td align="center">x₄</td><td align="center">6</td><td align="center">3</td><td align="center">2</td></tr>
</table>

#### Sol<sup>n</sup>

**iter 1** Assign จากสูตร

$$d(x_i,c_j)=\sum_{m}|x_{im}-c_{jm}|$$

$$D_{11}=|1-1|+|1-1|+|2-2|=0,\qquad D_{12}=|1-0|+|1-0|+|2-1|=3$$

$$D_{21}=|0-1|+|0-1|+|1-2|=3,\qquad D_{22}=|0-0|+|0-0|+|1-1|=0$$

$$D_{31}=|5-1|+|4-1|+|3-2|=8,\qquad D_{32}=|5-0|+|4-0|+|3-1|=11$$

$$D_{41}=|6-1|+|3-1|+|2-2|=7,\qquad D_{42}=|6-0|+|3-0|+|2-1|=10$$

เลือก centroid ที่ใกล้กว่า (ค่า $D$ น้อยกว่า)

<table align="center">
  <tr><th>D</th><th>c₁</th><th>c₂</th><th>Label</th></tr>
  <tr><th>x₁</th><td align="center">0</td><td align="center">3</td><td align="center">1</td></tr>
  <tr><th>x₂</th><td align="center">3</td><td align="center">0</td><td align="center">2</td></tr>
  <tr><th>x₃</th><td align="center">8</td><td align="center">11</td><td align="center">1</td></tr>
  <tr><th>x₄</th><td align="center">7</td><td align="center">10</td><td align="center">1</td></tr>
</table>

Update จากสูตร

$$c_1=\frac{x_1+x_3+x_4}{3}=\frac{\begin{bmatrix}1&1&2\end{bmatrix}+\begin{bmatrix}5&4&3\end{bmatrix}+\begin{bmatrix}6&3&2\end{bmatrix}}{3}=\begin{bmatrix}4&2.67&2.33\end{bmatrix}$$

$$c_2=x_2=\begin{bmatrix}0&0&1\end{bmatrix}$$

**iter 2** Assign

$$D_{11}=|1-4|+|1-2.67|+|2-2.33|=5,\qquad D_{12}=3$$

$$D_{21}=|0-4|+|0-2.67|+|1-2.33|=8,\qquad D_{22}=0$$

$$D_{31}=|5-4|+|4-2.67|+|3-2.33|=3,\qquad D_{32}=11$$

$$D_{41}=|6-4|+|3-2.67|+|2-2.33|=2.67,\qquad D_{42}=10$$

<table align="center">
  <tr><th>D</th><th>c₁</th><th>c₂</th><th>Label</th></tr>
  <tr><th>x₁</th><td align="center">5</td><td align="center">3</td><td align="center">2</td></tr>
  <tr><th>x₂</th><td align="center">8</td><td align="center">0</td><td align="center">2</td></tr>
  <tr><th>x₃</th><td align="center">3</td><td align="center">11</td><td align="center">1</td></tr>
  <tr><th>x₄</th><td align="center">2.67</td><td align="center">10</td><td align="center">1</td></tr>
</table>

label เปลี่ยน ($x_1$ จาก 1 เป็น 2) จึงทำต่อ Update

$$c_1=\frac{x_3+x_4}{2}=\frac{\begin{bmatrix}5&4&3\end{bmatrix}+\begin{bmatrix}6&3&2\end{bmatrix}}{2}=\begin{bmatrix}5.5&3.5&2.5\end{bmatrix}$$

$$c_2=\frac{x_1+x_2}{2}=\frac{\begin{bmatrix}1&1&2\end{bmatrix}+\begin{bmatrix}0&0&1\end{bmatrix}}{2}=\begin{bmatrix}0.5&0.5&1.5\end{bmatrix}$$

**iter 3** Assign

$$D_{11}=|1-5.5|+|1-3.5|+|2-2.5|=7.5,\qquad D_{12}=|1-0.5|+|1-0.5|+|2-1.5|=1.5$$

$$D_{21}=|0-5.5|+|0-3.5|+|1-2.5|=10.5,\qquad D_{22}=|0-0.5|+|0-0.5|+|1-1.5|=1.5$$

$$D_{31}=|5-5.5|+|4-3.5|+|3-2.5|=1.5,\qquad D_{32}=|5-0.5|+|4-0.5|+|3-1.5|=9.5$$

$$D_{41}=|6-5.5|+|3-3.5|+|2-2.5|=1.5,\qquad D_{42}=|6-0.5|+|3-0.5|+|2-1.5|=8.5$$

<table align="center">
  <tr><th>D</th><th>c₁</th><th>c₂</th><th>Label</th></tr>
  <tr><th>x₁</th><td align="center">7.5</td><td align="center">1.5</td><td align="center">2</td></tr>
  <tr><th>x₂</th><td align="center">10.5</td><td align="center">1.5</td><td align="center">2</td></tr>
  <tr><th>x₃</th><td align="center">1.5</td><td align="center">9.5</td><td align="center">1</td></tr>
  <tr><th>x₄</th><td align="center">1.5</td><td align="center">8.5</td><td align="center">1</td></tr>
</table>

label เหมือน iter 2 ทุกจุด จึงหยุด

**Ans** กลุ่ม 1 = $\{x_3,x_4\}$ มี $c_1=\begin{bmatrix}5.5&3.5&2.5\end{bmatrix}$ และกลุ่ม 2 = $\{x_1,x_2\}$ มี $c_2=\begin{bmatrix}0.5&0.5&1.5\end{bmatrix}$

---

### ตัวอย่างโจทย์ 2

จากข้อมูล 2 มิติในตารางต่อไปนี้ จงจัดกลุ่มด้วย K-Means เมื่อ $k=2$ โดยใช้ระยะแบบ Manhattan และ centroid เริ่มต้น $c_1=\begin{bmatrix}1&1\end{bmatrix}$, $c_2=\begin{bmatrix}2&1\end{bmatrix}$

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th></tr>
  <tr><td align="center">x₁</td><td align="center">1</td><td align="center">1</td></tr>
  <tr><td align="center">x₂</td><td align="center">2</td><td align="center">1</td></tr>
  <tr><td align="center">x₃</td><td align="center">4</td><td align="center">3</td></tr>
  <tr><td align="center">x₄</td><td align="center">5</td><td align="center">4</td></tr>
</table>

#### Sol<sup>n</sup>

**iter 1** Assign จากสูตร

$$d(x_i,c_j)=|x_{i1}-c_{j1}|+|x_{i2}-c_{j2}|$$

$$D_{11}=0+0=0,\qquad D_{12}=|1-2|+|1-1|=1$$

$$D_{21}=|2-1|+0=1,\qquad D_{22}=0$$

$$D_{31}=|4-1|+|3-1|=5,\qquad D_{32}=|4-2|+|3-1|=4$$

$$D_{41}=|5-1|+|4-1|=7,\qquad D_{42}=|5-2|+|4-1|=6$$

<table align="center">
  <tr><th>D</th><th>c₁</th><th>c₂</th><th>Label</th></tr>
  <tr><th>x₁</th><td align="center">0</td><td align="center">1</td><td align="center">1</td></tr>
  <tr><th>x₂</th><td align="center">1</td><td align="center">0</td><td align="center">2</td></tr>
  <tr><th>x₃</th><td align="center">5</td><td align="center">4</td><td align="center">2</td></tr>
  <tr><th>x₄</th><td align="center">7</td><td align="center">6</td><td align="center">2</td></tr>
</table>

Update

$$c_1=x_1=\begin{bmatrix}1&1\end{bmatrix}$$

$$c_2=\frac{x_2+x_3+x_4}{3}=\frac{\begin{bmatrix}2&1\end{bmatrix}+\begin{bmatrix}4&3\end{bmatrix}+\begin{bmatrix}5&4\end{bmatrix}}{3}=\begin{bmatrix}3.67&2.67\end{bmatrix}$$

**iter 2** Assign

$$D_{11}=0,\qquad D_{12}=|1-3.67|+|1-2.67|=4.33$$

$$D_{21}=1,\qquad D_{22}=|2-3.67|+|1-2.67|=3.33$$

$$D_{31}=5,\qquad D_{32}=|4-3.67|+|3-2.67|=0.67$$

$$D_{41}=7,\qquad D_{42}=|5-3.67|+|4-2.67|=2.67$$

<table align="center">
  <tr><th>D</th><th>c₁</th><th>c₂</th><th>Label</th></tr>
  <tr><th>x₁</th><td align="center">0</td><td align="center">4.33</td><td align="center">1</td></tr>
  <tr><th>x₂</th><td align="center">1</td><td align="center">3.33</td><td align="center">1</td></tr>
  <tr><th>x₃</th><td align="center">5</td><td align="center">0.67</td><td align="center">2</td></tr>
  <tr><th>x₄</th><td align="center">7</td><td align="center">2.67</td><td align="center">2</td></tr>
</table>

label เปลี่ยน ($x_2$ จาก 2 เป็น 1) จึงทำต่อ Update

$$c_1=\frac{x_1+x_2}{2}=\frac{\begin{bmatrix}1&1\end{bmatrix}+\begin{bmatrix}2&1\end{bmatrix}}{2}=\begin{bmatrix}1.5&1\end{bmatrix}$$

$$c_2=\frac{x_3+x_4}{2}=\frac{\begin{bmatrix}4&3\end{bmatrix}+\begin{bmatrix}5&4\end{bmatrix}}{2}=\begin{bmatrix}4.5&3.5\end{bmatrix}$$

**iter 3** Assign

$$D_{11}=|1-1.5|+|1-1|=0.5,\qquad D_{12}=|1-4.5|+|1-3.5|=6$$

$$D_{21}=|2-1.5|+|1-1|=0.5,\qquad D_{22}=|2-4.5|+|1-3.5|=5$$

$$D_{31}=|4-1.5|+|3-1|=4.5,\qquad D_{32}=|4-4.5|+|3-3.5|=1$$

$$D_{41}=|5-1.5|+|4-1|=6.5,\qquad D_{42}=|5-4.5|+|4-3.5|=1$$

<table align="center">
  <tr><th>D</th><th>c₁</th><th>c₂</th><th>Label</th></tr>
  <tr><th>x₁</th><td align="center">0.5</td><td align="center">6</td><td align="center">1</td></tr>
  <tr><th>x₂</th><td align="center">0.5</td><td align="center">5</td><td align="center">1</td></tr>
  <tr><th>x₃</th><td align="center">4.5</td><td align="center">1</td><td align="center">2</td></tr>
  <tr><th>x₄</th><td align="center">6.5</td><td align="center">1</td><td align="center">2</td></tr>
</table>

label เหมือน iter 2 ทุกจุด จึงหยุด

<div align="center">
<svg viewBox="0 0 340 240" width="340" role="img" aria-label="ผลการจัดกลุ่ม K-Means 2 มิติ" xmlns="http://www.w3.org/2000/svg">
<line x1="50" y1="210" x2="320" y2="210" stroke="currentColor" stroke-width="1.5"/>
<line x1="50" y1="210" x2="50" y2="20" stroke="currentColor" stroke-width="1.5"/>
<text x="50" y="228" text-anchor="middle" font-size="12" fill="currentColor">0</text>
<text x="95" y="228" text-anchor="middle" font-size="12" fill="currentColor">1</text>
<text x="140" y="228" text-anchor="middle" font-size="12" fill="currentColor">2</text>
<text x="185" y="228" text-anchor="middle" font-size="12" fill="currentColor">3</text>
<text x="230" y="228" text-anchor="middle" font-size="12" fill="currentColor">4</text>
<text x="275" y="228" text-anchor="middle" font-size="12" fill="currentColor">5</text>
<text x="40" y="214" text-anchor="end" font-size="12" fill="currentColor">0</text>
<text x="40" y="176" text-anchor="end" font-size="12" fill="currentColor">1</text>
<text x="40" y="138" text-anchor="end" font-size="12" fill="currentColor">2</text>
<text x="40" y="100" text-anchor="end" font-size="12" fill="currentColor">3</text>
<text x="40" y="62" text-anchor="end" font-size="12" fill="currentColor">4</text>
<text x="315" y="206" text-anchor="end" font-size="13" fill="currentColor">A₁</text>
<text x="58" y="28" text-anchor="start" font-size="13" fill="currentColor">A₂</text>
<circle cx="95" cy="172" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="95" y="160" text-anchor="middle" font-size="13" fill="currentColor">x₁</text>
<circle cx="140" cy="172" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="140" y="160" text-anchor="middle" font-size="13" fill="currentColor">x₂</text>
<circle cx="230" cy="96" r="6" fill="currentColor" stroke="currentColor" stroke-width="2"/>
<text x="230" y="84" text-anchor="middle" font-size="13" fill="currentColor">x₃</text>
<circle cx="275" cy="58" r="6" fill="currentColor" stroke="currentColor" stroke-width="2"/>
<text x="275" y="46" text-anchor="middle" font-size="13" fill="currentColor">x₄</text>
<line x1="111" y1="166" x2="124" y2="178" stroke="currentColor" stroke-width="2"/>
<line x1="124" y1="166" x2="111" y2="178" stroke="currentColor" stroke-width="2"/>
<text x="117" y="196" text-anchor="middle" font-size="13" fill="currentColor">c₁</text>
<line x1="246" y1="71" x2="259" y2="83" stroke="currentColor" stroke-width="2"/>
<line x1="259" y1="71" x2="246" y2="83" stroke="currentColor" stroke-width="2"/>
<text x="266" y="96" text-anchor="start" font-size="13" fill="currentColor">c₂</text>
</svg>
</div>

วงกลมโปร่ง = กลุ่ม 1, วงกลมทึบ = กลุ่ม 2, × = centroid สุดท้าย

**Ans** กลุ่ม 1 = $\{x_1,x_2\}$ มี $c_1=\begin{bmatrix}1.5&1\end{bmatrix}$ และกลุ่ม 2 = $\{x_3,x_4\}$ มี $c_2=\begin{bmatrix}4.5&3.5\end{bmatrix}$

### แบบฝึกหัด 1

จากข้อมูลในตารางต่อไปนี้ จงจัดกลุ่มด้วย K-Means เมื่อ $k=2$ ใช้ระยะแบบ Manhattan เริ่มจาก $c_1=\begin{bmatrix}6&5\end{bmatrix}$, $c_2=\begin{bmatrix}6&3\end{bmatrix}$ ทำซ้ำจนกลุ่มไม่เปลี่ยน แล้วหา centroid สุดท้ายและกลุ่มของแต่ละจุด

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th></tr>
  <tr><td align="center">x₁</td><td align="center">7</td><td align="center">0</td></tr>
  <tr><td align="center">x₂</td><td align="center">6</td><td align="center">3</td></tr>
  <tr><td align="center">x₃</td><td align="center">9</td><td align="center">0</td></tr>
  <tr><td align="center">x₄</td><td align="center">0</td><td align="center">1</td></tr>
  <tr><td align="center">x₅</td><td align="center">6</td><td align="center">5</td></tr>
</table>

### แบบฝึกหัด 2

จากข้อมูลในตารางต่อไปนี้ จงจัดกลุ่มด้วย K-Means เมื่อ $k=2$ ใช้ระยะแบบ Manhattan เริ่มจาก $c_1=\begin{bmatrix}8&2&2\end{bmatrix}$, $c_2=\begin{bmatrix}6&1&0\end{bmatrix}$ ทำซ้ำจนกลุ่มไม่เปลี่ยน แล้วหา centroid สุดท้ายและกลุ่มของแต่ละจุด

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th><th>A₃</th></tr>
  <tr><td align="center">x₁</td><td align="center">3</td><td align="center">5</td><td align="center">3</td></tr>
  <tr><td align="center">x₂</td><td align="center">8</td><td align="center">2</td><td align="center">2</td></tr>
  <tr><td align="center">x₃</td><td align="center">2</td><td align="center">8</td><td align="center">0</td></tr>
  <tr><td align="center">x₄</td><td align="center">7</td><td align="center">3</td><td align="center">2</td></tr>
  <tr><td align="center">x₅</td><td align="center">6</td><td align="center">1</td><td align="center">0</td></tr>
</table>

### แบบฝึกหัด 3

จากข้อมูลในตารางต่อไปนี้ จงจัดกลุ่มด้วย K-Means เมื่อ $k=3$ ใช้ระยะแบบ Manhattan เริ่มจาก $c_1=\begin{bmatrix}8&2\end{bmatrix}$, $c_2=\begin{bmatrix}6&2\end{bmatrix}$, $c_3=\begin{bmatrix}1&0\end{bmatrix}$ ทำซ้ำจนกลุ่มไม่เปลี่ยน แล้วหา centroid สุดท้ายและกลุ่มของแต่ละจุด

<table align="center">
  <tr><th>#</th><th>A₁</th><th>A₂</th></tr>
  <tr><td align="center">x₁</td><td align="center">5</td><td align="center">3</td></tr>
  <tr><td align="center">x₂</td><td align="center">8</td><td align="center">2</td></tr>
  <tr><td align="center">x₃</td><td align="center">6</td><td align="center">9</td></tr>
  <tr><td align="center">x₄</td><td align="center">1</td><td align="center">0</td></tr>
  <tr><td align="center">x₅</td><td align="center">6</td><td align="center">2</td></tr>
  <tr><td align="center">x₆</td><td align="center">0</td><td align="center">2</td></tr>
</table>

