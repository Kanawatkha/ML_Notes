import { CLUSTERING } from './data';
import { IllustrationFrame } from './IllustrationFrame';
import { at, stagger } from './timing';

const { points, init, assign1, mid, assign2, final } = CLUSTERING;
const FILL = ['fill-on-dark', 'fill-coral-soft'] as const;

/**
 * K-Means (A4): grey points, two centroids appear, every point takes the colour of its nearest
 * centroid, the centroids move to the means of their points, the points that are now nearer to the
 * other centroid change colour, and the centroids move once more to rest. Two iterations, the
 * second of which changes nothing further.
 */
export function ClusteringIllustration() {
  const popEnd = 80 + points.length * 40;
  const centroidsAt = popEnd + 200;
  const moveAt = centroidsAt + 700;
  return (
    <IllustrationFrame tone="topic">
      {points.map(([x, y], i) => (
        <g key={`p${x}-${y}`}>
          <circle cx={x} cy={y} r="5" className="ill-pop fill-on-dark/40" style={stagger(i, 80)} />
          <circle
            cx={x}
            cy={y}
            r="5"
            className={`ill-fade ${FILL[assign1[i]]}`}
            style={at(centroidsAt + 400)}
          />
          {assign2[i] !== assign1[i] ? (
            <circle
              cx={x}
              cy={y}
              r="5"
              className={`ill-fade ${FILL[assign2[i]]}`}
              style={at(moveAt + 1000)}
            />
          ) : null}
        </g>
      ))}
      {final.map(([x, y], k) => (
        <g key={`c${x}`} transform={`translate(${x} ${y})`}>
          <g
            className="ill-move"
            style={at(moveAt, {
              '--x0': `${init[k][0] - x}px`,
              '--y0': `${init[k][1] - y}px`,
              '--x1': `${mid[k][0] - x}px`,
              '--y1': `${mid[k][1] - y}px`,
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
