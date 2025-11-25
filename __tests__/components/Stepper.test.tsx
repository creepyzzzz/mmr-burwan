import { render, screen } from '@testing-library/react';
import Stepper from '../../components/ui/Stepper';

describe('Stepper', () => {
  const steps = [
    { id: '1', label: 'Step 1', description: 'First step' },
    { id: '2', label: 'Step 2', description: 'Second step' },
    { id: '3', label: 'Step 3', description: 'Third step' },
  ];

  it('renders all steps', () => {
    render(<Stepper steps={steps} currentStep={0} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('highlights current step', () => {
    render(<Stepper steps={steps} currentStep={1} />);
    const step2 = screen.getByText('Step 2').closest('div');
    expect(step2).toHaveClass('bg-gold-100');
  });

  it('marks completed steps', () => {
    render(<Stepper steps={steps} currentStep={2} completedSteps={[0, 1]} />);
    const step1 = screen.getByText('Step 1').closest('div');
    expect(step1).toHaveClass('bg-gold-500');
  });
});

