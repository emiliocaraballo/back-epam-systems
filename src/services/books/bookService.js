const Book = require('./models/Book');
const { logger } = require('../../utils/logger');

class BookService {
  async getAllBooks(filters = {}) {
    try {
      logger.debug(`Building query with filters: ${JSON.stringify(filters)}`);
      let query = {
        userId: filters.userId // Añadir userId al query
      };
      let sort = {};
      
      // Apply filters
      if (filters.title) {
        query.title = { $regex: filters.title, $options: 'i' };
        logger.debug(`Added title filter: ${filters.title}`);
      }
      
      if (filters.author) {
        query.author = { $regex: filters.author, $options: 'i' };
        logger.debug(`Added author filter: ${filters.author}`);
      }
      
      if (filters.excludeNoReview) {
        query.review = { $exists: true, $ne: '' };
        logger.debug('Added excludeNoReview filter');
      }
      
      // Apply sorting
      if (filters.sortByRating === 'asc') {
        sort.rating = 1;
        logger.debug('Added ascending rating sort');
      } else if (filters.sortByRating === 'desc') {
        sort.rating = -1;
        logger.debug('Added descending rating sort');
      }
      
      logger.debug(`Executing query: ${JSON.stringify(query)}`);
      const result = await Book.find(query).sort(sort);
      logger.debug(`Query returned ${result.length} books`);
      return result;
    } catch (error) {
      logger.error(`Database error in getAllBooks: ${error.message}`);
      throw new Error('Error fetching books');
    }
  }

  async getBookById(id, userId) {
    try {
      logger.debug(`Fetching book with ID: ${id} for user: ${userId}`);
      const book = await Book.findOne({ _id: id, userId });
      if (!book) {
        logger.warn(`Book not found or unauthorized access - ID: ${id}, User: ${userId}`);
        throw new Error('Book not found or unauthorized');
      }
      logger.debug(`Successfully retrieved book: ${book.title}`);
      return book;
    } catch (error) {
      logger.error(`Error in getBookById: ${error.message}`);
      throw new Error('Book not found or unauthorized');
    }
  }

  async createBook(bookData) {
    try {
      logger.debug(`Creating new book: ${JSON.stringify(bookData)}`);
      const book = new Book(bookData);
      const savedBook = await book.save();
      logger.info(`Successfully created book with ID: ${savedBook._id}`);
      return savedBook;
    } catch (error) {
      logger.error(`Error creating book: ${error.message}`);
      if (error.name === 'ValidationError') {
        logger.warn(`Validation error in createBook: ${error.message}`);
        throw new Error(`Validation error: ${error.message}`);
      }
      throw new Error('Error creating book');
    }
  }

  async updateBook(id, bookData) {
    try {
      const book = await Book.findByIdAndUpdate(id, bookData, { new: true });
      if (!book) throw new Error('Book not found');
      return book;
    } catch (error) {
      throw new Error('Error updating book');
    }
  }

  async updateBookReview(id, userId, updateData) {
    try {
      logger.debug(`Updating book review - ID: ${id}, User: ${userId}`);
      logger.debug(`Update data: ${JSON.stringify(updateData)}`);

      const book = await Book.findOneAndUpdate(
        { _id: id, userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!book) {
        logger.warn(`Book not found or unauthorized access - ID: ${id}, User: ${userId}`);
        throw new Error('Book not found or unauthorized');
      }

      logger.info(`Successfully updated book review for: ${book.title}`);
      return book;
    } catch (error) {
      logger.error(`Error updating book review: ${error.message}`);
      if (error.name === 'ValidationError') {
        logger.warn(`Validation error in updateBookReview: ${error.message}`);
        throw new Error(`Validation error: ${error.message}`);
      }
      throw new Error('Book not found or unauthorized');
    }
  }

  async deleteBook(id, userId) {
    try {
      logger.debug(`Attempting to delete book - ID: ${id}, User: ${userId}`);
      
      const book = await Book.findOneAndDelete({ _id: id, userId });
      if (!book) {
        logger.warn(`Book not found or unauthorized access - ID: ${id}, User: ${userId}`);
        throw new Error('Book not found or unauthorized');
      }
      
      logger.info(`Successfully deleted book: ${book.title}`);
      return book;
    } catch (error) {
      logger.error(`Error deleting book: ${error.message}`);
      throw new Error('Book not found or unauthorized');
    }
  }
}

module.exports = new BookService();
