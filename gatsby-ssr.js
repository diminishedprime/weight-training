import * as React from 'react';
import AuthProvider from './src/components/Layout/AuthProvider';

export const wrapPageElement = ({ element }) => {
  return <AuthProvider>{element}</AuthProvider>;
};
