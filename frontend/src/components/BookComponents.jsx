import { useState } from "react";
import { ArrowRight, Heart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatCreatedAt } from "../utils/format";

const coverUrl = (url) => url?.replace("-L.jpg", "-M.jpg") || "/favicon.svg";

function SearchBar({ value = "" }) {
  const [search, setSearch] = useState(value);
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    navigate(`/books?search=${encodeURIComponent(search)}`);
  };
  return (
    <form className="search-bar" onSubmit={submit}>
      <Search size={18} />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title, author or subject..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

function BookCard({ book, onWishlist, wished }) {
  const navigate = useNavigate();
  const bookId = book._id || book.id;
  const openDetails = () => navigate(`/books/${bookId}`);

  return (
    <article
      className="book-card"
      onClick={openDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetails();
        }
      }}
      role="link"
      tabIndex="0"
    >
      <div className="book-cover">
        <img
          src={coverUrl(book.image)}
          alt={book.title}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.src = "/favicon.svg";
          }}
        />
        <button
          className={`wish-button ${wished ? "active" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onWishlist(book);
          }}
          aria-label="Toggle wishlist"
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="book-card-body">
        <div className="book-meta">
          <span>{book.category}</span>
          <span className="condition-dot">· {book.condition}</span>
          {book.status === "sold" && <span className="sold-badge">· Sold</span>}
        </div>
        <Link to={`/books/${bookId}`} onClick={(event) => event.stopPropagation()}>
          <h3>{book.title}</h3>
        </Link>
        <p className="author">by {book.author}</p>
        {book.createdAt && (
          <p className="listed-date">Listed {formatCreatedAt(book.createdAt)}</p>
        )}
        <div className="card-bottom">
          <div>
            <strong>₹{book.sellingPrice ?? book.price}</strong>
            <del>₹{book.originalPrice}</del>
          </div>
          <Link
            className="arrow-link"
            to={`/books/${bookId}`}
            onClick={(event) => event.stopPropagation()}
          >
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export { SearchBar, BookCard };
