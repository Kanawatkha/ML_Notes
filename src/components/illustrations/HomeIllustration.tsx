import { Axes } from './Axes';
import { HOME } from './data';
import { IllustrationFrame } from './IllustrationFrame';
import { at, stagger } from './timing';

const { points, groups, line, boundary, centroids, start } = HOME;

const MEAN: readonly [number, number] = [
  points.reduce((sum, p) => sum + p[0], 0) / points.length,
  points.reduce((sum, p) => sum + p[1], 0) / points.length,
];
const TILT_DEG = (Math.atan2(line[1][1] - line[0][1], line[1][0] - line[0][0]) * 180) / Math.PI;

/**
 * The Home plot (A3), about 3.5 s: the points pop in; a fitted line is drawn through them
 * (Regression) and goes; the points split into two colours with a dashed boundary (Classification);
 * two coral centroids glide to the middle of their groups (Clustering). It rests on that last frame.
 */
export function HomeIllustration() {
  const fitAt = 80 + points.length * 40 + 100;
  const splitAt = fitAt + 1400;
  const centroidsAt = splitAt + 500;
  return (
    <IllustrationFrame tone="home">
      <Axes />
      <line
        x1={line[0][0]}
        y1={line[0][1]}
        x2={line[1][0]}
        y2={line[1][1]}
        pathLength="1"
        strokeWidth="2"
        data-flash=""
        className="ill-line stroke-on-dark/70"
        style={at(fitAt, {
          '--tilt': `${-TILT_DEG}deg`,
          '--ox': `${MEAN[0]}px`,
          '--oy': `${MEAN[1]}px`,
        })}
      />
      <line
        x1={boundary[0][0]}
        y1={boundary[0][1]}
        x2={boundary[1][0]}
        y2={boundary[1][1]}
        strokeWidth="1.5"
        strokeDasharray="5 6"
        className="ill-fade stroke-on-dark/70"
        style={at(splitAt + 100)}
      />
      {points.map(([x, y], i) => (
        <g key={`p${x}-${y}`}>
          <circle cx={x} cy={y} r="5" className="ill-pop fill-on-dark" style={stagger(i, 80)} />
          {groups[i] === 1 ? (
            <circle cx={x} cy={y} r="5" className="ill-fade fill-coral-soft" style={at(splitAt)} />
          ) : null}
        </g>
      ))}
      {centroids.map(([x, y], k) => (
        <g key={`c${x}`} transform={`translate(${x} ${y})`}>
          <g
            className="ill-move"
            data-single=""
            style={at(centroidsAt, {
              '--x0': `${start[k][0] - x}px`,
              '--y0': `${start[k][1] - y}px`,
            })}
          >
            <rect
              x="-7"
              y="-7"
              width="14"
              height="14"
              rx="2"
              strokeWidth="2"
              className="fill-coral stroke-on-dark"
            />
          </g>
        </g>
      ))}
    </IllustrationFrame>
  );
}
