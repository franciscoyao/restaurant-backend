const { supabaseClient, supabaseAdmin } = require('../config/supabase');

// Get all menu items
const getAllMenuItems = async (req, res, next) => {
  try {
    const { data, error } = await supabaseClient
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

// Get menu items by category
const getMenuItemsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    
    const { data, error } = await supabaseClient
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

// Get a single menu item
const getMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseClient
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    next(error);
  }
};

// Create a new menu item
const createMenuItem = async (req, res, next) => {
  try {
    const newItem = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .insert([newItem])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update a menu item
const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    next(error);
  }
};

// Delete a menu item
const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabaseAdmin
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
const getCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabaseClient
      .from('menu_items')
      .select('category')
      .order('category', { ascending: true });
    
    if (error) throw error;
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemsByCategory,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories
};
