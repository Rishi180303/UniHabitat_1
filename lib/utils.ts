import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function checkUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, university, major, graduation_year, bio, avatar_url')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error checking user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error checking user profile:', error)
    return null
  }
}

export function hasCompleteProfile(profile: any) {
  if (!profile) return false
  
  return !!(
    profile.full_name &&
    profile.university &&
    profile.major &&
    profile.graduation_year &&
    profile.bio
  )
}