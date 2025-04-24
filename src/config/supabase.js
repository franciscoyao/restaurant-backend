const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client with anonymous key (for public operations)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Client with service role key (for admin operations)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabaseClient, supabaseAdmin };
