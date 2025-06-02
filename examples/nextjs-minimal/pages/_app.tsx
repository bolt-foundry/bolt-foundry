import type { AppProps } from 'next/app'
import '../styles/globals.css'

// Minimal Next.js app wrapper
// This component wraps all pages and provides global styles
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}