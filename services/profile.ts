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
    const profileData: any = {
      user_id: userId,
      first_name: updates.firstName,
      last_name: updates.lastName,
      date_of_birth: updates.dateOfBirth,
      id_number: updates.idNumber,
      address: updates.address,
      partner_details: updates.partnerDetails,
      completion_percentage: updates.completionPercentage,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined fields to avoid overwriting with null/undefined if that's unintentional, 
    // but upsert usually requires a fuller object or careful handling. 
    // However, the original code reconstructed the object from 'updates'. 
    // We should probably merge with existing if we want partial updates via upsert, 
    // BUT supbase upsert replaces the row if it exists unless we use onConflict + ignoreDuplicates (which we don't want).
    // Actually, simple UPDATE ... WHERE user_id is better if we just want to update fields.
    // The original code handled Create vs Update.
    // Optimization: Try UPDATE first. If it returns 0 rows, then INSERT.
    // This avoids the 'getProfile' read.

    // Remove keys that are undefined to avoid sending them? 
    // The original code mapped inputs to profileData explicitly. undefined values would be passed as such.

    // Let's stick to the plan: efficiently handle create/update.
    // Since we don't know for sure if it exists without checking, 
    // and we want to return the FULL profile, `upsert` is best if we have all data.
    // verifying usage: updateProfile is usually called with partial updates. 
    // `upsert` with partial data might wipe other fields if we are not careful.
    // The previous implementation fetched existing first. 
    // To do this safely and safely without fetching, we can use `upsert` only if we are sure we pass all fields, 
    // OR we revert to the pattern: try UPDATE. if count=0, INSERT.

    // Try UPDATE first
    const { data: updatedData, error: updateError } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (updateError) throw new Error(updateError.message);

    if (updatedData) {
      return this.mapProfile(updatedData);
    }

    // If no update happened (profile doesn't exist), INSERT
    // We need to ensure we don't insert partial data that violates constraints, 
    // but looking at schema, most fields seem nullable or we have defaults.
    // We might drastically fail if we insert minimal data. 
    // But original code did: `const existing = await this.getProfile(userId);`
    // If existing -> update. Else -> insert.
    // So 'updates' + 'userId' is all we have.

    const { data: insertedData, error: insertError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

    return this.mapProfile(insertedData);
  },

  async updateAddress(userId: string, address: Address): Promise<Profile> {
    return this.updateProfile(userId, { address });
  },

  async updatePartnerDetails(userId: string, partnerDetails: PartnerDetails): Promise<Profile> {
    return this.updateProfile(userId, { partnerDetails });
  },

  async calculateCompletion(userId: string, currentProfile?: Profile | null): Promise<{ percentage: number; profile?: Profile }> {
    let profile = currentProfile;

    if (!profile) {
      profile = await this.getProfile(userId);
    }

    if (!profile) {
      return { percentage: 0 };
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

    // only update if changed to save a write
    if (profile.completionPercentage !== percentage) {
      const updatedProfile = await this.updateProfile(userId, { completionPercentage: percentage });
      return { percentage, profile: updatedProfile };
    }

    return { percentage, profile };
  },

  mapProfile(data: any): Profile {
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
};
