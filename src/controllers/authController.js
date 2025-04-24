const { supabaseAdmin } = require('../config/supabase');

// Sign up a new staff user (admin only)
const createStaffUser = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;
    
    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        role: role || 'staff'
      }
    });
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Staff user created successfully',
      data: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getCurrentUser = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    res.status(200).json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        ...req.user.user_metadata
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStaffUser,
  getCurrentUser
};
