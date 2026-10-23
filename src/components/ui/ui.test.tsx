import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Button, ButtonLink } from '@/components/ui/Button';
import { buttonClass } from '@/components/ui/buttonClass';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { StatRow } from '@/components/ui/StatRow';
import { Toast } from '@/components/ui/Toast';
import { PAGES } from '@/config/site';
import { BAND_CLASS } from '@/lib/bands';

describe('Button', () => {
  it('is a near-black pill by default and an outlined pill for the outline variant', () => {
    render(
      <>
        <Button>go</Button>
        <Button variant="outline">tab</Button>
        <Button variant="secondary">link</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'go' })).toHaveClass('bg-primary', 'rounded-pill');
    expect(screen.getByRole('button', { name: 'tab' })).toHaveClass('border-primary', 'rounded-xl');
    expect(screen.getByRole('button', { name: 'link' })).toHaveClass('underline');
  });

  it('is a plain button that never submits a form by accident', () => {
    render(<Button>go</Button>);
    expect(screen.getByRole('button', { name: 'go' })).toHaveAttribute('type', 'button');
  });

  it('renders a link with the same classes through ButtonLink and buttonClass', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/regression">open</ButtonLink>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: 'open' });
    expect(link).toHaveAttribute('href', '/regression');
    expect(link.className).toBe(buttonClass('primary'));
  });
});

describe('Chip', () => {
  it('uses an outline for the coral tone, never coral text', () => {
    render(<Chip tone="coral">EX 01</Chip>);
    const chip = screen.getByText('EX 01');
    expect(chip).toHaveClass('border-coral', 'text-ink');
    expect(chip.className).not.toMatch(/text-coral/);
  });
});

describe('StatRow', () => {
  it('shows each number with its label', () => {
    render(
      <StatRow
        stats={[
          { value: 3, label: 'หัวข้อใหญ่' },
          { value: 18, label: 'ตัวอย่างโจทย์' },
        ]}
      />,
    );
    expect(screen.getByText('18').closest('dd')).not.toBeNull();
    expect(screen.getByText('ตัวอย่างโจทย์').tagName).toBe('DT');
    expect(screen.getAllByText(/^\d+$/).map((n) => n.textContent)).toEqual(['3', '18']);
  });
});

describe('Toast, Skeleton and Icon', () => {
  it('announces a toast politely with its action', () => {
    render(<Toast action={<button>reload</button>}>new version</Toast>);
    expect(screen.getByRole('status')).toHaveTextContent('new version');
    expect(screen.getByRole('button', { name: 'reload' })).toBeInTheDocument();
  });

  it('marks the skeleton as busy', () => {
    const { container } = render(<PageSkeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true');
  });

  it('hides decorative icons from screen readers', () => {
    const { container } = render(<Icon name="share" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('topic colours', () => {
  it('has a fill and a text class for every band used by a page', () => {
    for (const page of PAGES) {
      expect(BAND_CLASS[page.band].bg, page.id).toMatch(/^bg-/);
      expect(BAND_CLASS[page.band].text, page.id).toBe('text-on-dark');
    }
  });
});
