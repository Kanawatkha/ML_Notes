import { CLASSIFICATION } from './data';
import { IllustrationFrame } from './IllustrationFrame';
import { at, stagger } from './timing';

const { a, b, query, radius } = CLASSIFICATION;

/**
 * K-NN (A4): two classes of points and a query point; a circle grows out of the query until it
 * holds its k nearest points (k = 3: two white, one soft coral), and the query takes the colour of
 * the majority.
 */
export function ClassificationIllustration() {
  const circleAt = 80 + (a.length + b.length) * 40 + 400;
  return (
    <IllustrationFrame tone="topic">
      {a.map(([x, y], i) => (
        <circle
          key={`a${x}`}
          cx={x}
          cy={y}
          r="6"
          className="ill-pop fill-on-dark"
          style={stagger(i * 2, 80)}
        />
      ))}
      {b.map(([x, y], i) => (
        <circle
          key={`b${x}`}
          cx={x}
          cy={y}
          r="6"
          className="ill-pop fill-coral-soft"
          style={stagger(i * 2 + 1, 80)}
        />
      ))}
      <circle
        cx={query[0]}
        cy={query[1]}
        r={radius}
        fill="none"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        vectorEffect="non-scaling-stroke"
        className="ill-grow stroke-on-dark/70"
        style={at(circleAt)}
      />
      <circle
        cx={query[0]}
        cy={query[1]}
        r="9"
        fill="none"
        strokeWidth="2"
        className="ill-pop stroke-coral"
        style={at(circleAt - 300)}
      />
      <circle
        cx={query[0]}
        cy={query[1]}
        r="5"
        className="ill-fade fill-on-dark"
        style={at(circleAt + 1000)}
      />
    </IllustrationFrame>
  );
}
