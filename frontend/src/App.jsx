import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Layout from "./components/Layout";
import { api } from "./services/api";
import { Home, BooksPage, Detail } from "./pages/MarketplacePages";
import {
  Auth,
  EditBook,
  MyListings,
  Sell,
  WishlistPage,
} from "./pages/AccountPages";
import { ProtectedRoute, PublicOnlyRoute, SimplePage } from "./app/RouteGuards";

function useSession() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("kitabghar-user") || "null"),
  );
  const save = useCallback((next) => {
    setUser(next);
    if (next) localStorage.setItem("kitabghar-user", JSON.stringify(next));
    else localStorage.removeItem("kitabghar-user");
  }, []);
  useEffect(() => {
    api
      .getCurrentUser()
      .then(save)
      .catch(() => save(null));
  }, [save]);
  return useMemo(() => ({ user, save }), [user, save]);
}

function App() {
  const session = useSession();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!session.user) return;
    api
      .getWishlist()
      .then((books) => setWishlist(books.map((book) => book._id)))
      .catch(() => setWishlist([]));
  }, [session]);

  const onWishlist = async (book) => {
    if (!session.user) {
      window.location.href = "/login";
      return false;
    }
    try {
      if (wishlist.includes(book._id)) {
        await api.removeFromWishlist(book._id);
        setWishlist((current) => current.filter((id) => id !== book._id));
      } else {
        await api.addToWishlist(book._id);
        setWishlist((current) => [...current, book._id]);
      }
      return true;
    } catch (error) {
      window.alert(error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Unable to clear the server session:", error);
    } finally {
      session.save(null);
      setWishlist([]);
    }
  };

  return (
    <BrowserRouter>
      <Layout user={session.user} onLogout={logout}>
        <Routes>
          <Route
            path="/"
            element={<Home onWishlist={onWishlist} wishlist={wishlist} />}
          />
          <Route
            path="/books"
            element={<BooksPage onWishlist={onWishlist} wishlist={wishlist} />}
          />
          <Route
            path="/books/:id"
            element={
              <Detail
                onWishlist={onWishlist}
                wishlist={wishlist}
                user={session.user}
              />
            }
          />
          <Route
            path="/books/:id/edit"
            element={
              <ProtectedRoute user={session.user}>
                <EditBook user={session.user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute user={session.user}>
                <Auth mode="login" onLogin={session.save} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute user={session.user}>
                <Auth mode="register" onLogin={session.save} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <ProtectedRoute user={session.user}>
                <Sell user={session.user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute user={session.user}>
                <WishlistPage onWishlist={onWishlist} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <SimplePage
                title={
                  <>
                    Stories have a way
                    <br />
                    <em>of finding us.</em>
                  </>
                }
              >
                <p className="lead">
                  KitabGhar is a small marketplace with a big belief: books
                  shouldn’t stop being useful just because they’ve been read
                  once.
                </p>
                <div className="manifesto about-manifesto">
                  <Sparkles />
                  <p>
                    We connect curious readers with affordable, pre-loved books
                    — and make it easy to pass yours on when you’re ready.
                  </p>
                </div>
              </SimplePage>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={session.user}>
                <SimplePage title="Your reading room.">
                  <div className="profile-card">
                    <span className="avatar large">
                      {session.user?.name?.[0]}
                    </span>
                    <h2>{session.user?.name}</h2>
                    <p>{session.user?.email}</p>
                    <Link to="/sell" className="button button-dark">
                      List a book <ArrowRight size={17} />
                    </Link>
                  </div>
                  <MyListings />
                </SimplePage>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
