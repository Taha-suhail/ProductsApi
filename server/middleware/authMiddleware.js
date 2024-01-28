// middleware/authMiddleware.js
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next(); // User is authenticated, continue to the next middleware
    } else {
      res.redirect('/login'); // Redirect to login page if not authenticated
    }
  };
  
  module.exports = isAuthenticated;
  