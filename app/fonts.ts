import localFont from 'next/font/local'

export const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/satoshi/Satoshi-Variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})

// Note: Place your Satoshi .woff2 files in `public/fonts/satoshi/` with the exact filename used above.
