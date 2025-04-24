const { supabaseClient } = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Verify the token with Supabase
    const { data, error } = await supabaseClient.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    
    // Add user to request object
    req.user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  try {
    // Check if user has admin role
    if (!req.user || req.user.user_metadata.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate, isAdmin };
