// routes/logout.js
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  // Clear session information upon logout
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
    }
    res.redirect('/login'); // Redirect to login page after logout
  });
});

module.exports = router;
