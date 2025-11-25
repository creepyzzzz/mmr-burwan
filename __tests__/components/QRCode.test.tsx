import { render, screen } from '@testing-library/react';
import QRCode from '../../components/ui/QRCode';

describe('QRCode', () => {
  it('renders QR code with value', () => {
    render(<QRCode value="test-data" />);
    const qrElement = document.querySelector('svg');
    expect(qrElement).toBeInTheDocument();
  });

  it('applies custom size', () => {
    render(<QRCode value="test-data" size={300} />);
    const qrElement = document.querySelector('svg');
    expect(qrElement).toHaveAttribute('width', '300');
  });
});

