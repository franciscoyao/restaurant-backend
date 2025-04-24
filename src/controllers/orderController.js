const { supabaseClient, supabaseAdmin } = require('../config/supabase');

// Create a new order
const createOrder = async (req, res, next) => {
  try {
    const { customer_name, customer_email, customer_phone, pickup_time, notes, items } = req.body;
    
    // Start a transaction
    // Note: Supabase JS client doesn't support transactions directly
    // We'll use multiple operations and handle errors carefully
    
    // 1. Calculate total amount
    let total_amount = 0;
    const orderItems = [];
    
    // Fetch menu items to get prices
    const menuItemIds = items.map(item => item.menu_item_id);
    const { data: menuItems, error: menuError } = await supabaseClient
      .from('menu_items')
      .select('id, price')
      .in('id', menuItemIds);
    
    if (menuError) throw menuError;
    
    // Calculate total and prepare order items
    for (const item of items) {
      const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item with id ${item.menu_item_id} not found`
        });
      }
      
      const itemTotal = menuItem.price * item.quantity;
      total_amount += itemTotal;
      
      orderItems.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes
      });
    }
    
    // 2. Create the order
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        customer_name,
        customer_email,
        customer_phone,
        pickup_time,
        notes,
        total_amount,
        status: 'new'
      }])
      .select();
    
    if (orderError) throw orderError;
    
    const orderId = orderData[0].id;
    
    // 3. Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: orderId
    }));
    
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsWithOrderId);
    
    if (itemsError) {
      // If there's an error with order items, delete the order to maintain consistency
      await supabaseAdmin.from('orders').delete().eq('id', orderId);
      throw itemsError;
    }
    
    // 4. Return the complete order with items
    const { data: completeOrder, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
      .eq('id', orderId)
      .single();
    
    if (fetchError) throw fetchError;
    
    res.status(201).json({
      success: true,
      data: completeOrder
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    // Parse query parameters
    const { status, limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    // Build query
    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      count: data.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: data
    });
  } catch (error) {
    next(error);
  }
};

// Get a single order
const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          *,
          menu_item:menu_items(name, price, category)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
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

// Update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
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

// Get orders by customer phone
const getOrdersByCustomer = async (req, res, next) => {
  try {
    const { phone } = req.params;
    
    const { data, error } = await supabaseClient
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          *,
          menu_item:menu_items(name)
        )
      `)
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false });
    
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

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getOrdersByCustomer
};
