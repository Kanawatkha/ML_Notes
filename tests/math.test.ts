// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { renderMath } from '../scripts/build-content/math';

describe('renderMath', () => {
  it('draws a circled sample number as a span with the class ring around its digit', () => {
    const html = renderMath(String.raw`(\text{\textcircled{3}})`, false);
    expect(html).toMatch(/<span class="[^"]*\bring\b[^"]*"><span class="mord">3<\/span><\/span>/);
  });

  it('keeps the digit in the MathML for screen readers', () => {
    expect(renderMath(String.raw`\text{\textcircled{2}}`, false)).toContain('<mtext>2</mtext>');
  });

  it('still fails the build on anything strict mode rejects', () => {
    expect(() => renderMath('\\text{①}', false)).toThrow();
  });

  it('gives no class to any html command other than the ring macro', () => {
    const html = renderMath(String.raw`\htmlClass{evil}{x}`, false);
    expect(html).not.toMatch(/class="[^"]*evil/);
  });
});
