const axios = require("axios");
const Book = require("../models/Book");
const SearchHistory = require("../models/SearchHistory");

class OpenLibraryService {
  async searchBooks(query) {
    try {
      await SearchHistory.create({ query });

      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          query
        )}&limit=10`
      );
      const results = response.data.docs;

      const savedBooks = await Book.find({
        openLibraryId: { $in: results.map((book) => book.key) },
      });

      const savedBooksMap = savedBooks.reduce((acc, book) => {
        acc[book.openLibraryId] = book;
        return acc;
      }, {});

      return results.map((book) => ({
        title: book.title,
        author: book.author_name ? book.author_name[0] : "Unknown",
        publishYear: book.first_publish_year,
        openLibraryId: book.key,
        cover: savedBooksMap[book.key]
          ? `/api/books/library/front-cover/${savedBooksMap[book.key]._id}`
          : book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
      }));
    } catch (error) {
      throw new Error("Error searching books in Open Library");
    }
  }

  async getLastSearches(limit = 5) {
    try {
      const searches = await SearchHistory.aggregate([
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$query",
            createdAt: { $first: "$createdAt" },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: limit },
        { $project: { query: "$_id", _id: 0 } },
      ]);
      return searches;
    } catch (error) {
      throw new Error("Error fetching last searches");
    }
  }

  async deleteSearch(query) {
    try {
      const result = await SearchHistory.deleteMany({ query });
      return {
        success: true,
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      throw new Error("Error deleting search");
    }
  }
}

module.exports = new OpenLibraryService();
