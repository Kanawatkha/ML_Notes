import { Axes } from './Axes';
import { REGRESSION } from './data';
import { IllustrationFrame } from './IllustrationFrame';
import { at, stagger } from './timing';

const { points, line, mean, slope, intercept } = REGRESSION;
const TILT_DEG = (Math.atan(slope) * 180) / Math.PI;

/**
 * Regression (A4): the points appear, then the least squares line is drawn through them while it
 * tilts from flat into its slope, and the vertical residuals (the errors the line minimises) are
 * drawn from each point to the line.
 */
export function RegressionIllustration() {
  const lineStart = 80 + points.length * 40;
  return (
    <IllustrationFrame tone="topic">
      <Axes />
      {points.map(([x, y], i) => (
        <line
          key={`r${x}`}
          x1={x}
          y1={y}
          x2={x}
          y2={intercept + slope * x}
          pathLength="1"
          strokeWidth="1"
          className="ill-ticks stroke-coral"
          style={stagger(i, lineStart + 900, 30)}
        />
      ))}
      <line
        x1={line[0][0]}
        y1={line[0][1]}
        x2={line[1][0]}
        y2={line[1][1]}
        pathLength="1"
        strokeWidth="2"
        strokeLinecap="butt"
        className="ill-line stroke-on-dark/70"
        style={at(lineStart, {
          '--tilt': `${-TILT_DEG}deg`,
          '--ox': `${mean[0]}px`,
          '--oy': `${mean[1]}px`,
        })}
      />
      {points.map(([x, y], i) => (
        <circle
          key={`p${x}`}
          cx={x}
          cy={y}
          r="5"
          className="ill-pop fill-on-dark"
          style={stagger(i, 80)}
        />
      ))}
    </IllustrationFrame>
  );
}
