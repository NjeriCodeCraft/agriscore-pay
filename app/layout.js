// app/layout.js  ← ROOT layout — this is the ONLY one with <html> and <body>
import './globals.css';

export const metadata = {
  title: 'AgriScore-Pay | Buy Now, Pay at Harvest',
  description: 'Farm credit powered by ML and Interswitch',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}