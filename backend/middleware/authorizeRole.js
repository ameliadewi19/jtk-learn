const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
      const { role } = req.user; // Ambil role dari req.user (hasil dari authenticate)
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'Access forbidden: insufficient role' });
      }
      next();
    };
  };
  
  module.exports = { authorizeRole };
  