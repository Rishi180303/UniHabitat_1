import { supabase } from './supabase'

export interface Listing {
  id?: string
  user_id: string
  title?: string
  description?: string
  address?: string
  unit_number?: string
  university?: string
  price?: number
  sublease_type?: string
  furnishing?: string
  lease_type?: string
  total_bedrooms?: number
  available_bedrooms?: number
  total_bathrooms?: number
  move_in_date?: string
  move_out_date?: string
  amenities?: any
  images?: any
  video_url?: string
  created_at?: string
  [key: string]: any
}

export async function createListing(listing: Listing) {
  const { data, error } = await supabase
    .from('listings')
    .insert([listing])
    .select()
  if (error) throw error
  return data[0]
}

export async function getUserListings(user_id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getListingById(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateListing(listing: Listing) {
  if (!listing.id) throw new Error('Listing ID is required for update')
  const { data, error } = await supabase
    .from('listings')
    .update(listing)
    .eq('id', listing.id)
    .select()
  if (error) throw error
  return data[0]
} 