import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import Account from './Account';

describe('<Account />', () => {
  it('renders without crashing', () => {
    render(<Account />);
  });
});
