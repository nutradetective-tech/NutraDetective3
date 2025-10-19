// config/supabase.js
// Supabase Configuration for NutraDetective
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== SUPABASE CREDENTIALS =====
const supabaseUrl = 'https://yimmcoegsjxfyhbcblig.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbW1jb2Vnc2p4ZnloYmNibGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDY5MDgsImV4cCI6MjA3NjQyMjkwOH0.dNv3UuLXN4C6Gt31W14D03NsHEab71yPpzeW5YrLFK0';

console.log('🔷 Initializing Supabase...');
console.log('📡 Project URL:', supabaseUrl);

// ===== CREATE SUPABASE CLIENT =====
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('✅ Supabase client initialized successfully');

// ===== EXPORT STORAGE BUCKET NAME =====
// We'll use this for profile pictures
export const STORAGE_BUCKET = 'profiles';

export default supabase;