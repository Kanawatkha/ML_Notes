import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PlusMinusIcon } from '@/components/ui/PlusMinusIcon';
import { ExampleCard } from '@/components/content/ExampleCard';
import { UI_TEXT } from '@/config/site';
import type { Block } from '@/content/types';
import { HomeHero } from '@/features/home/HomeHero';
import { Overview, SectionPart } from '@/features/topic/TopicParts';
import { fileOf, homeFile } from '@/test/content';

const classification = fileOf('classification');
const section = classification.root.children[0];
const example = classification.root.children
  .flatMap((n) => [...n.examples, ...n.children.flatMap((c) => c.examples)])
  .find((b): b is Extract<Block, { t: 'example' }> => b.t === 'example');

describe('entrances (A1, A8, A9)', () => {
  it('a section header grows its rule and fades its parts up, but the header itself stays put', () => {
    const { container } = render(<SectionPart node={section} blocks={[]} />);
    const header = container.querySelector('header') as HTMLElement;
    expect(header).toHaveAttribute('data-reveal', 'parts');
    // no IntersectionObserver in jsdom: shown at once, nothing is left hidden
    expect(header).toHaveAttribute('data-shown');
    expect(header.querySelector('.rule-grow')).toHaveAttribute('aria-hidden', 'true');
    expect(header.querySelectorAll('.fade-up')).toHaveLength(2);
  });

  it('a sub-topic header fades its tag and title up', () => {
    const subtopic = classification.root.children[0].children[0];
    const { container } = render(<SectionPart node={subtopic} blocks={[]} />);
    expect(container.querySelector('header')).toHaveAttribute('data-reveal', 'parts');
    expect(container.querySelectorAll('header .fade-up')).toHaveLength(2);
  });

  it('the overview panel rises when it comes into view', () => {
    const { container } = render(<Overview id="x/overview" blocks={[]} />);
    expect(container.querySelector('section')).toHaveAttribute('data-reveal', 'rise');
  });

  it('an example card rises on a topic page, and not inside the Home diagram', () => {
    expect(example).toBeDefined();
    const { container, rerender } = render(
      <ExampleCard block={example as NonNullable<typeof example>} level={3} reveal />,
    );
    expect(container.querySelector('article')).toHaveAttribute('data-reveal', 'rise');
    rerender(<ExampleCard block={example as NonNullable<typeof example>} level={3} />);
    expect(container.querySelector('article')).not.toHaveAttribute('data-reveal');
  });

  it('the Home title and lead have their entrance classes, the counts are plain numbers', () => {
    render(
      <MemoryRouter>
        <HomeHero home={homeFile} diagramId="d" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('title-rise');
    expect(screen.getByText(UI_TEXT.homeLead)).toHaveClass('lead-rise');
    expect(screen.getByText(UI_TEXT.statExamples).previousElementSibling).toHaveTextContent(
      String(homeFile.stats.examples),
    );
  });

  it('the phone link scrolls to the diagram heading', () => {
    const target = document.createElement('h2');
    target.id = 'd';
    document.body.appendChild(target);
    render(
      <MemoryRouter>
        <HomeHero home={homeFile} diagramId="d" />
      </MemoryRouter>,
    );
    const spy = vi.spyOn(target, 'scrollIntoView');
    fireEvent.click(screen.getByRole('button', { name: /แผนผังแนวข้อสอบ/ }));
    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    target.remove();
  });

  it('the diagram root icon turns its vertical bar flat when open (A7)', () => {
    const { container, rerender } = render(<PlusMinusIcon open={false} />);
    expect(container.querySelector('svg')).not.toHaveAttribute('data-open');
    rerender(<PlusMinusIcon open />);
    expect(container.querySelector('svg')).toHaveAttribute('data-open');
    expect(container.querySelectorAll('path')).toHaveLength(2);
  });
});
