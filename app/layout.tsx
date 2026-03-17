// app/layout.tsx v5.6.0
import type {Metadata, Viewport} from 'next';
import { Noto_Serif_SC } from 'next/font/google';
import './globals.css'; // Global styles
import { ThemeProvider } from '@/components/theme-provider';

const notoSerif = Noto_Serif_SC({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-serif' 
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'LaughterBox v5.6.0',
  description: '最全面的短篇笑话集合，每篇控制在 100 字以内。',
  keywords: '笑话, 幽默, 极简, 段子',
  authors: [{ name: 'Sut' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LaughterBox',
  },
  robots: 'index, follow',
  other: {
    'geo.region': 'CN-ZH',
    'geo.placename': 'China',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning id="root-html">
      <body id="root-body" className={`${notoSerif.variable} font-serif antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors duration-300 text-xl`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div id="app-container" className="min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
