import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const request = async (promise) => {
  try {
    const { data } = await promise;
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Unable to connect to KitabGhar server.",
      { cause: error },
    );
  }
};

export const api = {
  getBooks: (params) =>
    request(client.get("/books", { params })).then((data) => data.books),
  getBook: (id) =>
    request(client.get(`/books/${id}`)).then((data) => data.book),
  authenticate: (mode, form) => request(client.post(`/auth/${mode}`, form)),
  logout: () => request(client.post("/auth/logout")),
  getCurrentUser: () =>
    request(client.get("/auth/me")).then((data) => data.user),
  updateProfile: (form) =>
    request(client.put("/auth/profile", form)).then((data) => data.user),
  createBook: (book) =>
    request(client.post("/books", book)).then((data) => data.book),
  getMyBooks: () =>
    request(client.get("/books/mine")).then((data) => data.books),
  updateBook: (id, book) =>
    request(client.put(`/books/${id}`, book)).then((data) => data.book),
  deleteBook: (id) => request(client.delete(`/books/${id}`)),
  getWishlist: () =>
    request(client.get("/wishlist")).then((data) => data.books),
  addToWishlist: (id) => request(client.post(`/wishlist/${id}`)),
  removeFromWishlist: (id) => request(client.delete(`/wishlist/${id}`)),
};
