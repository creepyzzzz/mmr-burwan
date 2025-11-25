import { supabase } from '../lib/supabase';
import { Profile, Address, PartnerDetails } from '../types';

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(error.message);
    }

    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      dateOfBirth: data.date_of_birth || '',
      idNumber: data.id_number || '',
      address: data.address as Address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      },
      partnerDetails: data.partner_details as PartnerDetails | undefined,
      completionPercentage: data.completion_percentage || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    // Check if profile exists
    const existing = await this.getProfile(userId);

    const profileData: any = {
      user_id: userId,
      first_name: updates.firstName,
      last_name: updates.lastName,
      date_of_birth: updates.dateOfBirth,
      id_number: updates.idNumber,
      address: updates.address,
      partner_details: updates.partnerDetails,
      completion_percentage: updates.completionPercentage,
    };

    if (existing) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        userId: data.user_id,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        dateOfBirth: data.date_of_birth || '',
        idNumber: data.id_number || '',
        address: data.address as Address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
        },
        partnerDetails: data.partner_details as PartnerDetails | undefined,
        completionPercentage: data.completion_percentage || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        userId: data.user_id,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        dateOfBirth: data.date_of_birth || '',
        idNumber: data.id_number || '',
        address: data.address as Address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
        },
        partnerDetails: data.partner_details as PartnerDetails | undefined,
        completionPercentage: data.completion_percentage || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  },

  async updateAddress(userId: string, address: Address): Promise<Profile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return this.updateProfile(userId, { address });
  },

  async updatePartnerDetails(userId: string, partnerDetails: PartnerDetails): Promise<Profile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return this.updateProfile(userId, { partnerDetails });
  },

  async calculateCompletion(userId: string): Promise<number> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      return 0;
    }

    let completed = 0;
    const total = 5; // We check 5 fields

    // Check each field
    // 1. Name (first and last)
    if (profile.firstName && profile.lastName && 
        profile.firstName.trim() && profile.lastName.trim()) {
      completed++;
    }
    
    // 2. Date of birth
    if (profile.dateOfBirth && profile.dateOfBirth.trim()) {
      completed++;
    }
    
    // 3. ID number
    if (profile.idNumber && profile.idNumber.trim()) {
      completed++;
    }
    
    // 4. Address (street and city required)
    if (profile.address?.street && profile.address?.city && 
        profile.address.street.trim() && profile.address.city.trim()) {
      completed++;
    }
    
    // 5. Partner details (check if partner has at least first name and last name)
    if (profile.partnerDetails && 
        profile.partnerDetails.firstName && 
        profile.partnerDetails.lastName &&
        profile.partnerDetails.firstName.trim() && 
        profile.partnerDetails.lastName.trim()) {
      completed++;
    }

    const percentage = Math.round((completed / total) * 100);
    
    // Always update to ensure it's saved (even if percentage is 0)
    await this.updateProfile(userId, { completionPercentage: percentage });
    
    return percentage;
  },
};
