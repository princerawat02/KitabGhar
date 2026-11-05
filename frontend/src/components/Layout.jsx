function Layout({ children, user, onLogout }) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark">
            <BookOpen size={18} />
          </span>
          <span className="logo-word">
            Kitab<span>Ghar</span>
          </span>
        </Link>
        <nav className={`main-nav ${menu ? "is-open" : ""}`}>
          <Link to="/books">Browse books</Link>
          {user && <Link to="/sell">Sell a book</Link>}
          <Link to="/about">Our story</Link>
        </nav>
        <div className="header-tools">
          <Link to="/wishlist" className="icon-link" aria-label="Wishlist">
            <Heart size={19} />
            <span>Wishlist</span>
          </Link>
          {user ? (
            <div className="user-menu">
              <Link to="/profile">
                <span className="avatar">{user.name?.[0]}</span>
                <span>{user.name.split(" ")[0]}</span>
              </Link>
              <button onClick={onLogout} className="text-button">
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              Log in <ArrowRight size={16} />
            </Link>
          )}
          <button
            className="menu-toggle"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-main">
          <div>
            <Link to="/" className="logo footer-logo">
              <span className="logo-mark">
                <BookOpen size={18} />
              </span>
              <span className="logo-word">
                Kitab<span>Ghar</span>
              </span>
            </Link>
            <p>
              A second life for good books.
              <br />A better price for you.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <b>Explore</b>
              <Link to="/books">All books</Link>
              <Link to="/about">Our story</Link>
            </div>
            <div>
              <b>For readers</b>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/sell">Sell a book</Link>
            </div>
            <div>
              <b>Need help?</b>
              <span>
                Contact sellers directly
                <br />
                from their listings.
              </span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 KitabGhar</span>
          <span>Made for readers, by readers.</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

import { useState } from "react";
import { BookOpen, Heart, Menu, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
