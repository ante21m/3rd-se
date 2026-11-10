import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <div className="card">
        <h1>Next.js Registration Example</h1>
        <p>A teaching example of a user registration module.</p>
        <Link href="/register" className="link-button">Go to registration</Link>
      </div>
    </main>
  );
}
