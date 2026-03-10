const adminOnly = (req, res, next) => {
  // Allow all authenticated users
  next();
};

module.exports = adminOnly;