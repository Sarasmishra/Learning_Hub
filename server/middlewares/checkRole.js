

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.role;
    console.log("userRole - ",userRole)
    console.log("allowedRole - ",allowedRoles) // Assuming `role` is available in `req` (set by `isAuthenticated` middleware)
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied. You do not have the required role.",
        success: false
      });
    }

    next(); // Proceed if the role matches
  };
};

module.exports = checkRole;
