import { ArrowRight } from "lucide-react";
import { bookCategories } from "../data/bookOptions";

function BookForm({ book = {}, onSubmit, submitLabel = "Save changes", error }) {
  return (
    <form className="listing-form" onSubmit={onSubmit}>
      <div className="form-columns">
        <label>
          Book title
          <input name="title" defaultValue={book.title} required placeholder="e.g. The Midnight Library" />
        </label>
        <label>
          Author
          <input name="author" defaultValue={book.author} required placeholder="e.g. Matt Haig" />
        </label>
        <label>
          Category
          <select name="category" defaultValue={book.category || bookCategories[0]}>
            {bookCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          Condition
          <select name="condition" defaultValue={book.condition || "Like New"}>
            <option>Like New</option>
            <option>Good</option>
            <option>Acceptable</option>
          </select>
        </label>
        <label>
          Selling price
          <input name="sellingPrice" type="number" defaultValue={book.sellingPrice} required placeholder="₹ 250" />
        </label>
        <label>
          Original price
          <input name="originalPrice" type="number" defaultValue={book.originalPrice} required placeholder="₹ 500" />
        </label>
      </div>
      <label>
        Description
        <textarea name="description" rows="4" defaultValue={book.description} required placeholder="Tell readers a little about the copy..." />
      </label>
      <label>
        Cover image URL
        <input name="image" type="url" defaultValue={book.image} required placeholder="https://..." />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="button button-dark" type="submit">
        {submitLabel} <ArrowRight size={17} />
      </button>
    </form>
  );
}

export default BookForm;
