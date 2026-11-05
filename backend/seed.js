require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Book = require("./models/Book");

const demoUsers = [
  {
    name: "KitabGhar Demo Seller",
    email: "demo@kitabghar.in",
    phone: "9999999999",
  },
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@kitabghar.in",
    phone: "9999999991",
  },
  {
    name: "Ananya Gupta",
    email: "ananya.gupta@kitabghar.in",
    phone: "9999999992",
  },
  {
    name: "Vivaan Mehta",
    email: "vivaan.mehta@kitabghar.in",
    phone: "9999999993",
  },
  {
    name: "Ishita Verma",
    email: "ishita.verma@kitabghar.in",
    phone: "9999999994",
  },
  {
    name: "Kabir Singh",
    email: "kabir.singh@kitabghar.in",
    phone: "9999999995",
  },
  { name: "Meera Nair", email: "meera.nair@kitabghar.in", phone: "9999999996" },
  {
    name: "Arjun Kapoor",
    email: "arjun.kapoor@kitabghar.in",
    phone: "9999999997",
  },
  { name: "Diya Patel", email: "diya.patel@kitabghar.in", phone: "9999999998" },
  { name: "Rohan Das", email: "rohan.das@kitabghar.in", phone: "9999999990" },
];

const demoBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Business",
    description:
      "A practical guide to building better habits and breaking bad ones.",
    originalPrice: 499,
    sellingPrice: 199,
    condition: "Like New",
    image: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    description:
      "A timeless story about following your dreams and listening to your heart.",
    originalPrice: 299,
    sellingPrice: 120,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "Business",
    description:
      "An accessible introduction to financial literacy and personal finance.",
    originalPrice: 399,
    sellingPrice: 150,
    condition: "Like New",
    image: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Business",
    description:
      "Timeless lessons about wealth, greed, risk and making better money decisions.",
    originalPrice: 399,
    sellingPrice: 180,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    description:
      "A moving novel about the infinite possibilities of the life we choose.",
    originalPrice: 499,
    sellingPrice: 230,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    description:
      "A foundational guide to writing readable, maintainable software.",
    originalPrice: 799,
    sellingPrice: 350,
    condition: "Acceptable",
    image: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
  },
  {
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    category: "Self Help",
    description:
      "A classic guide to personal effectiveness, purpose and lasting change.",
    originalPrice: 599,
    sellingPrice: 250,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9781982137274-L.jpg",
  },
  {
    title: "Concepts of Physics",
    author: "H. C. Verma",
    category: "Academic",
    description:
      "A trusted physics textbook for students building strong fundamentals.",
    originalPrice: 650,
    sellingPrice: 300,
    condition: "Acceptable",
    image: "https://covers.openlibrary.org/b/isbn/9788177091878-L.jpg",
  },
  {
    title: "Ikigai",
    author: "Héctor García and Francesc Miralles",
    category: "Self Help",
    description:
      "A practical exploration of the Japanese way to find purpose and joy.",
    originalPrice: 399,
    sellingPrice: 175,
    condition: "Like New",
    image: "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg",
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    description:
      "A powerful dystopian novel about surveillance, truth and freedom.",
    originalPrice: 299,
    sellingPrice: 125,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    description:
      "An engaging history of humankind from the Stone Age to the modern era.",
    originalPrice: 599,
    sellingPrice: 280,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Technology",
    description:
      "A comprehensive reference for understanding algorithms and data structures.",
    originalPrice: 999,
    sellingPrice: 550,
    condition: "Acceptable",
    image: "https://covers.openlibrary.org/b/isbn/9780262046305-L.jpg",
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    category: "Fiction",
    description: "A moving story of friendship, family, guilt and redemption.",
    originalPrice: 399,
    sellingPrice: 160,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg",
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "Business",
    description:
      "A method for building products through continuous learning and experimentation.",
    originalPrice: 499,
    sellingPrice: 220,
    condition: "Like New",
    image: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg",
  },
  {
    title: "Wings of Fire",
    author: "A. P. J. Abdul Kalam",
    category: "Biography",
    description:
      "The inspiring autobiography of India's former president and scientist.",
    originalPrice: 250,
    sellingPrice: 100,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9788173711466-L.jpg",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    description:
      "A classic American novel about ambition, love and the illusion of success.",
    originalPrice: 299,
    sellingPrice: 130,
    condition: "Acceptable",
    image: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "Self Help",
    description: "Strategies for focused success in a distracted world.",
    originalPrice: 499,
    sellingPrice: 225,
    condition: "Like New",
    image: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
  },
  {
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "Academic",
    description:
      "A detailed introduction to database architecture, design and implementation.",
    originalPrice: 899,
    sellingPrice: 450,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9780073523323-L.jpg",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    description: "A landmark novel about justice, empathy and growing up.",
    originalPrice: 349,
    sellingPrice: 150,
    condition: "Good",
    image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
  },
  {
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    category: "Finance",
    description:
      "A classic guide to value investing and long-term financial discipline.",
    originalPrice: 699,
    sellingPrice: 320,
    condition: "Acceptable",
    image: "https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg",
  },
];

async function seed() {
  if (!process.env.MONGO_URI)
    throw new Error("MONGO_URI is not set in backend/.env");
  await mongoose.connect(process.env.MONGO_URI);

  const password = await bcrypt.hash("kitabghar123", 10);
  const users = await Promise.all(
    demoUsers.map(({ name, email, phone }) =>
      User.findOneAndUpdate(
        { email },
        { name, email, password, phone },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );
  const userIds = users.map((user) => user._id);

  await Book.deleteMany({ seller: { $in: userIds } });
  await Book.insertMany(
    demoBooks.map((book, index) => ({
      ...book,
      seller: userIds[index < 11 ? 0 : ((index - 11) % (userIds.length - 1)) + 1],
    })),
  );

  console.log(`Seeded ${users.length} users and ${demoBooks.length} books.`);
  console.log("Demo login: demo@kitabghar.in / kitabghar123");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Unable to seed demo data:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
