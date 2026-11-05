import { useEffect, useState } from "react";
import { ArrowRight, Check, Heart } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { BookCard } from "../components/BookComponents";
import BookForm from "../components/BookForm";
import { SimplePage } from "../app/RouteGuards";

function Auth({ mode, onLogin }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await api.authenticate(
        isLogin ? "login" : "register",
        form,
      );
      onLogin(result.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">WELCOME TO KITABGHAR</p>
        <h1>{isLogin ? "Welcome back." : "Start your story."}</h1>
        <p>
          {isLogin
            ? "Pick up where you left off."
            : "Join a community that keeps good books moving."}
        </p>
        <form onSubmit={submit}>
          {!isLogin && (
            <label>
              Your name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aarav Sharma"
              />
            </label>
          )}
          {!isLogin && (
            <label>
              Phone number <span className="field-note">optional</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </label>
          )}
          <label>
            Email address
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              required
              minLength="6"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-dark" type="submit">
            {isLogin ? "Log in" : "Create account"} <ArrowRight size={17} />
          </button>
        </form>
        <p className="auth-switch">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <Link to={isLogin ? "/register" : "/login"}>
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </div>
    </main>
  );
}

function Sell({ user }) {
  const [sent, setSent] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = Object.fromEntries(form.entries());
    try {
      await api.createBook({
        title: fields.title,
        author: fields.author,
        category: fields.category,
        condition: fields.condition,
        sellingPrice: Number(fields.sellingPrice),
        originalPrice: Number(fields.originalPrice),
        description: fields.description,
        image: fields.image,
      });
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  };
  const [error, setError] = useState("");
  return (
    <main className="form-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PASS IT ON</p>
          <h1>
            Give a book
            <br />
            <em>another chapter.</em>
          </h1>
        </div>
        <p className="page-description">
          List a book in a few minutes.
          <br />
          Keep the good stories going.
        </p>
      </div>
      {sent ? (
        <div className="success-card">
          <Check size={30} />
          <h2>Your book is on its way.</h2>
          <p>We’ve saved the listing for {user?.name || "you"}.</p>
          <Link to="/books" className="button button-dark">
            Browse books <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <BookForm
          onSubmit={submit}
          submitLabel="Publish listing"
          error={error}
        />
      )}
    </main>
  );
}

function WishlistPage({ onWishlist }) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .getWishlist()
      .then(setBooks)
      .catch((err) => setError(err.message));
  }, []);
  const removeFromWishlist = async (book) => {
    const removed = await onWishlist(book);
    if (removed)
      setBooks((current) => current.filter((item) => item._id !== book._id));
  };
  return (
    <SimplePage title="Your saved stories.">
      <p className="lead">Books you’ve kept close for later.</p>
      {error ? (
        <div className="empty-state">
          <h3>Could not load your wishlist</h3>
          <p>{error}</p>
        </div>
      ) : books.length ? (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onWishlist={removeFromWishlist}
              wished
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={35} />
          <h3>Your wishlist is waiting</h3>
          <p>Save a book and it will appear here.</p>
          <Link to="/books" className="button button-dark">
            Explore books
          </Link>
        </div>
      )}
    </SimplePage>
  );
}

function EditBook({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getBook(id)
      .then((listing) => {
        if (
          !listing.seller?._id ||
          String(listing.seller._id) !== String(user.id)
        ) {
          setError("Only the user who created this listing can edit it.");
          return;
        }
        setBook(listing);
      })
      .catch((err) => setError(err.message));
  }, [id, user.id]);

  const save = async (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    try {
      await api.updateBook(id, {
        title: fields.title,
        author: fields.author,
        category: fields.category,
        condition: fields.condition,
        sellingPrice: Number(fields.sellingPrice),
        originalPrice: Number(fields.originalPrice),
        description: fields.description,
        image: fields.image,
      });
      navigate(`/books/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error)
    return (
      <main className="form-page">
        <div className="empty-state">
          <h3>Unable to edit this listing</h3>
          <p>{error}</p>
          <Link to={`/books/${id}`} className="button button-dark">
            Back to book
          </Link>
        </div>
      </main>
    );
  if (!book)
    return (
      <main className="form-page">
        <p className="loading">Loading listing...</p>
      </main>
    );

  return (
    <main className="form-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">EDIT LISTING</p>
          <h1>
            Update your
            <br />
            <em>book listing.</em>
          </h1>
        </div>
      </div>
      <BookForm book={book} onSubmit={save} error={error} />
    </main>
  );
}

function MyListings() {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getMyBooks()
      .then(setBooks)
      .catch((err) => setError(err.message));
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.deleteBook(id);
      setBooks((current) => current.filter((book) => book._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleSold = async (book) => {
    const status = book.status === "sold" ? "available" : "sold";
    try {
      const updated = await api.updateBook(book._id, { status });
      setBooks((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    try {
      const book = await api.updateBook(editing._id, {
        title: fields.title,
        author: fields.author,
        category: fields.category,
        condition: fields.condition,
        sellingPrice: Number(fields.sellingPrice),
        originalPrice: Number(fields.originalPrice),
        description: fields.description,
        image: fields.image,
      });
      setBooks((current) =>
        current.map((item) => (item._id === book._id ? book : item)),
      );
      setEditing(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (editing) {
    return (
      <section className="listings-section">
        <div className="section-intro">
          <div>
            <p className="eyebrow">EDIT LISTING</p>
            <h2>Update your book</h2>
          </div>
          <button className="text-button" onClick={() => setEditing(null)}>
            Cancel
          </button>
        </div>
        <BookForm book={editing} onSubmit={save} error={error} />
      </section>
    );
  }

  return (
    <section className="listings-section">
      <div className="section-intro">
        <div>
          <p className="eyebrow">YOUR LISTINGS</p>
          <h2>Books you’re passing on</h2>
        </div>
        <Link to="/sell" className="under-link">
          List another <ArrowRight size={16} />
        </Link>
      </div>
      {error && <p className="form-error">{error}</p>}
      {books.length ? (
        <div className="my-listings">
          {books.map((book) => (
            <article className="my-listing" key={book._id}>
              <Link to={`/books/${book._id}`}>
                <img
                  src={
                    book.image?.replace("-L.jpg", "-M.jpg") || "/favicon.svg"
                  }
                  alt={book.title}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.src = "/favicon.svg";
                  }}
                />
              </Link>
              <div>
                <p className="book-meta">
                  {book.category} · {book.status}
                </p>
                <Link to={`/books/${book._id}`}>
                  <h3>{book.title}</h3>
                </Link>
                <p className="author">
                  ₹{book.sellingPrice} · {book.condition}
                </p>
              </div>
              <div className="listing-actions">
                <button
                  className="button button-outline"
                  onClick={() => setEditing(book)}
                >
                  Edit
                </button>
                <button
                  className="button button-outline"
                  onClick={() => toggleSold(book)}
                >
                  {book.status === "sold" ? "Mark available" : "Mark sold"}
                </button>
                <button
                  className="text-button danger-button"
                  onClick={() => remove(book._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>You have no listings yet</h3>
          <p>Share a book with the community.</p>
          <Link to="/sell" className="button button-dark">
            List a book
          </Link>
        </div>
      )}
    </section>
  );
}

export { Auth, EditBook, Sell, WishlistPage, MyListings };
