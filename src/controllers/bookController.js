const bookService = require('../services/bookService');
const openLibraryService = require('../services/openLibraryService');
const { logger } = require('../utils/logger');

class BookController {
 
  async getBooks(req, res) {
    try {
      const filters = {
        title: req.query.title,
        author: req.query.author,
        excludeNoReview: req.query.excludeNoReview === 'true',
        sortByRating: req.query.sortByRating,
        userId: req.user.id // Añadir el userId del token
      };
      logger.info(`Getting books with filters: ${JSON.stringify(filters)}`);
      const books = await bookService.getAllBooks(filters);
      logger.info(`Found ${books.length} books`);
      res.json(books);
    } catch (error) {
      logger.error(`Error getting books: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  async getBook(req, res) {
    try {
      const book = await bookService.getBookById(req.params.id, req.user.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createBook(req, res) {
    try {
      const bookData = {
        ...req.body,
        userId: req.user.id // Añadir el userId del token
      };
      logger.info(`Creating new book: ${bookData.title} by ${bookData.author}`);
      const book = await bookService.createBook(bookData);
      logger.info(`Book created successfully with ID: ${book._id}`);
      res.status(201).json(book);
    } catch (error) {
      logger.error(`Error creating book: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }

  async updateBookReview(req, res) {
    try {
      const { review, rating } = req.body;
      const updateData = {};
      if (review !== undefined) updateData.review = review;
      if (rating !== undefined) updateData.rating = rating;

      logger.info(`Updating book review for ID: ${req.params.id}, User ID: ${req.user.id}`);
      logger.debug(`Update data: ${JSON.stringify(updateData)}`);

      const book = await bookService.updateBookReview(
        req.params.id,
        req.user.id, // Añadir el userId para verificación
        updateData
      );
      logger.info(`Book review updated successfully for ID: ${req.params.id}`);
      res.json(book);
    } catch (error) {
      logger.error(`Error updating book review: ${error.message}`);
      if (error.message === 'Book not found or unauthorized') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteBook(req, res) {
    try {
      logger.info(`Attempting to delete book ID: ${req.params.id} by user ID: ${req.user.id}`);
      await bookService.deleteBook(req.params.id, req.user.id);
      logger.info(`Book successfully deleted: ${req.params.id}`);
      res.status(204).end();
    } catch (error) {
      logger.error(`Error deleting book: ${error.message}`);
      if (error.message === 'Book not found or unauthorized') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  
  async searchBooks(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        logger.warn('Search attempt without query parameter');
        return res.status(400).json({ message: 'Search query is required' });
      }
      logger.info(`Searching books with query: ${q}`);
      const results = await openLibraryService.searchBooks(q);
      logger.info(`Found ${results.length} books in OpenLibrary search`);
      res.json(results);
    } catch (error) {
      logger.error(`Error searching books: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  async getLastSearches(req, res) {
    try {
      logger.info('Fetching last searches');
      const searches = await openLibraryService.getLastSearches();
      logger.info(`Retrieved ${searches.length} recent searches`);
      res.json(searches);
    } catch (error) {
      logger.error(`Error fetching last searches: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

   async deleteSearch(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        logger.warn('Delete search attempt without query parameter');
        return res.status(400).json({ message: "Query parameter is required" });
      }

      logger.info(`Deleting search history for query: ${q}`);
      const result = await openLibraryService.deleteSearch(q);
      logger.info('Search history deleted successfully');
      res.json(result);
    } catch (error) {
      logger.error(`Error deleting search history: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new BookController();
