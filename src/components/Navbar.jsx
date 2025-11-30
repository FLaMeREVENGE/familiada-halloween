import Link from 'next/link';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href="/home" className="navbar-logo">
          FAMILIADA
        </Link>
      </div>
    </nav>
  );
}
