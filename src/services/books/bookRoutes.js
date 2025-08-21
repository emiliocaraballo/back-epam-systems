const express = require('express');
const router = express.Router();
const bookController = require('./bookController');
const authMiddleware = require('../../middleware/auth');

router.get('/search', bookController.searchBooks);
router.get('/last-search', bookController.getLastSearches);
router.delete("/search",  bookController.deleteSearch);

router.get('/my-library', authMiddleware, bookController.getBooks);
router.get('/my-library/:id', authMiddleware,  bookController.getBook);
router.post('/my-library', authMiddleware, bookController.createBook);
router.put('/my-library/:id', authMiddleware, bookController.updateBookReview);
router.delete('/my-library/:id', authMiddleware, bookController.deleteBook);

module.exports = router;
