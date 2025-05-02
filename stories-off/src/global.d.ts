/// <reference types="vite/client" />

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'react-router-dom' {
  export * from 'react-router-dom';
}

declare module '@mui/material' {
  export * from '@mui/material';
}

declare module '@mui/icons-material/*' {
  export * from '@mui/icons-material/*';
}

declare module '@mui/material/styles' {
  export * from '@mui/material/styles';
}

declare module 'framer-motion' {
  export * from 'framer-motion';
}

declare module 'axios' {
  export * from 'axios';
} 