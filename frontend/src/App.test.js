import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

console.log(screen);

import App from './App';
import store from './store';

test('renders learn react link', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // const { getByText } = screen;

  const linkElement = screen.getByText(/Orema/i);
  const anotherEl = screen.getByText(/Latest/i);
  expect(linkElement).toBeInTheDocument();
  expect(anotherEl).toBeInTheDocument();
});
