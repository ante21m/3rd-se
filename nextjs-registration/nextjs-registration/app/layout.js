import './globals.css';

export const metadata = {
  title: { default: 'Registration Example', template: '%s | Registration Example' },
  description: 'Next.js user registration module for classroom use',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
