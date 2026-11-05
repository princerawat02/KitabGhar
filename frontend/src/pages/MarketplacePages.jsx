import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { BookCard, SearchBar } from "../components/BookComponents";
import { categories } from "../data/bookOptions";
import { formatCreatedAt } from "../utils/format";

function Home({ onWishlist, wishlist }) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .getBooks({})
      .then(setBooks)
      .catch((err) => setError(err.message));
  }, []);
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={14} /> THE BETTER WAY TO READ
          </p>
          <h1>
            Every book
            <br />
            <em>deserves</em> another story.
          </h1>
          <p className="hero-text">
            Discover pre-loved books, share your favourites and give great
            stories a new home.
          </p>
          <div className="hero-actions">
            <Link to="/books" className="button button-dark">
              Explore books <ArrowRight size={17} />
            </Link>
            <Link to="/sell" className="button button-quiet">
              I want to sell <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-note">
            curated with
            <br />
            care<span>✦</span>
          </div>
          <div className="book-stack stack-one">
            The
            <br />
            Creative
            <br />
            <i>Act</i>
          </div>
          <div className="book-stack stack-two">
            The
            <br />
            <i>Alchemist</i>
          </div>
          <div className="book-stack stack-three">
            Do
            <br />
            Less
          </div>
          <div className="sun-shape" />
        </div>
      </section>
      <section className="home-section">
        <div className="section-intro">
          <div>
            <p className="eyebrow">JUST IN</p>
            <h2>Freshly listed</h2>
          </div>
          <Link to="/books" className="under-link">
            See all books <ArrowRight size={16} />
          </Link>
        </div>
        {error ? (
          <div className="empty-state">
            <h3>Could not load the bookshelf</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.slice(0, 4).map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onWishlist={onWishlist}
                wished={wishlist.includes(book._id)}
              />
            ))}
          </div>
        )}
        {!error && !books.length && (
          <div className="empty-state">
            <BookOpen size={35} />
            <h3>No books listed yet</h3>
            <p>Be the first reader to list a book.</p>
          </div>
        )}
      </section>
      <section className="category-panel">
        <div>
          <p className="eyebrow">FIND YOUR NEXT READ</p>
          <h2>
            Browse by
            <br />
            <em>chapter.</em>
          </h2>
        </div>
        <div className="category-list">
          {categories.slice(1).map((category, index) => (
            <Link to={`/books?category=${category}`} key={category}>
              <span>0{index + 1}</span>
              {category}
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </section>
      <section className="manifesto">
        <ShieldCheck size={25} />
        <div>
          <p className="eyebrow">WHY KITABGHAR</p>
          <h2>
            Good books should
            <br />
            <em>keep moving.</em>
          </h2>
        </div>
        <p>
          We make it simple to pass stories on. No complicated checkout, no
          inflated prices — just readers meeting readers.
        </p>
      </section>
    </main>
  );
}

function BooksPage({ onWishlist, wishlist }) {
  const [params, setParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const search = params.get("search") || "";
  const category = params.get("category") || "All Books";
  useEffect(() => {
    api
      .getBooks(Object.fromEntries(params))
      .then(setBooks)
      .catch((err) => setError(err.message));
  }, [params]);
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">THE BOOKSHELF</p>
          <h1>
            Find your next
            <br />
            <em>favourite.</em>
          </h1>
        </div>
        <p className="page-description">
          Well-loved books, looking for a<br />
          new shelf to call home.
        </p>
      </div>
      <SearchBar value={search} />
      <div className="filter-row">
        <div className="filter-scroll">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() =>
                setParams({ ...(search ? { search } : {}), category: item })
              }
            >
              {item}
            </button>
          ))}
        </div>
        <select
          aria-label="Sort books"
          onChange={(e) =>
            setParams({
              ...(search ? { search } : {}),
              ...(category !== "All Books" ? { category } : {}),
              sort: e.target.value,
            })
          }
        >
          <option value="">Recently added</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>
      {error ? (
        <div className="empty-state">
          <h3>Could not load the bookshelf</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onWishlist={onWishlist}
              wished={wishlist.includes(book._id)}
            />
          ))}
        </div>
      )}
      {!error && !books.length && (
        <div className="empty-state">
          <BookOpen size={35} />
          <h3>No books found</h3>
          <p>Try a different search or category.</p>
        </div>
      )}
    </main>
  );
}

function Detail({ onWishlist, wishlist, user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .getBook(id)
      .then(setBook)
      .catch((err) => setError(err.message));
  }, [id]);
  if (error)
    return (
      <main className="detail-page">
        <div className="empty-state">
          <h3>Could not load this book</h3>
          <p>{error}</p>
          <Link to="/books" className="button button-dark">
            Back to bookshelf
          </Link>
        </div>
      </main>
    );
  if (!book)
    return (
      <main className="detail-page">
        <p className="loading">Loading book details...</p>
      </main>
    );
  const seller = book.seller;
  const sellerContact = seller?.email || seller?.phone;
  const isOwner =
    user?.id && seller?._id && String(user.id) === String(seller._id);
  const saving = Math.max(
    0,
    Math.round((1 - book.sellingPrice / book.originalPrice) * 100),
  );
  return (
    <main className="detail-page">
      <Link to="/books" className="back-link">
        ← Back to bookshelf
      </Link>
      <div className="detail-layout">
        <div className="detail-cover">
          <img
            src={book.image?.replace("-L.jpg", "-M.jpg") || "/favicon.svg"}
            alt={book.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={(event) => {
              event.currentTarget.src = "/favicon.svg";
            }}
          />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">
            {book.category} · {book.condition}
            {book.status === "sold" && " · SOLD"}
          </p>
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>
          {book.createdAt && (
            <p className="listed-date">
              Listed {formatCreatedAt(book.createdAt)}
            </p>
          )}
          <div className="detail-price">
            <strong>₹{book.sellingPrice}</strong>
            <del>₹{book.originalPrice}</del>
            <span>Save {saving}%</span>
          </div>
          <p className="detail-description">{book.description}</p>
          <div className="seller-card">
            <span className="avatar large">{seller?.name?.[0] || "R"}</span>
            <div>
              <small>LISTED BY</small>
              <strong>{seller?.name || "KitabGhar member"}</strong>
              <span>
                {seller?.phone ||
                  seller?.email ||
                  "Contact available through KitabGhar"}
              </span>
            </div>
            {sellerContact && (
              <a
                href={
                  seller.email
                    ? `mailto:${seller.email}`
                    : `tel:${seller.phone}`
                }
              >
                Contact seller ↗
              </a>
            )}
          </div>
          {book.status === "sold" && (
            <p className="sold-notice">
              This book has been marked as sold by the seller.
            </p>
          )}
          <div className="detail-actions">
            {isOwner && (
              <Link
                className="button button-outline"
                to={`/books/${book._id}/edit`}
              >
                Edit your listing
              </Link>
            )}
            <button
              className={`button ${wishlist.includes(book._id) ? "button-outline" : "button-dark"}`}
              onClick={() => onWishlist(book)}
            >
              <Heart
                size={18}
                fill={wishlist.includes(book._id) ? "currentColor" : "none"}
              />
              {wishlist.includes(book._id)
                ? "Saved to wishlist"
                : "Save to wishlist"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export { Home, BooksPage, Detail };
