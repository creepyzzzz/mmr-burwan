import { supabase } from '../lib/supabase';
import { AuditLog, UserRole } from '../types';

export const auditService = {
  async getLogs(filters?: {
    actorId?: string;
    actorRole?: UserRole;
    action?: string;
    resourceType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AuditLog[]> {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (filters) {
      if (filters.actorId) {
        query = query.eq('actor_id', filters.actorId);
      }
      if (filters.actorRole) {
        query = query.eq('actor_role', filters.actorRole);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.resourceType) {
        query = query.eq('resource_type', filters.resourceType);
      }
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data.map((log) => ({
      id: log.id,
      actorId: log.actor_id,
      actorName: log.actor_name,
      actorRole: log.actor_role as UserRole,
      action: log.action,
      resourceType: log.resource_type,
      resourceId: log.resource_id,
      details: log.details,
      timestamp: log.timestamp,
    }));
  },

  async createLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        actor_id: log.actorId,
        actor_name: log.actorName,
        actor_role: log.actorRole,
        action: log.action,
        resource_type: log.resourceType,
        resource_id: log.resourceId,
        details: log.details || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      actorId: data.actor_id,
      actorName: data.actor_name,
      actorRole: data.actor_role as UserRole,
      action: data.action,
      resourceType: data.resource_type,
      resourceId: data.resource_id,
      details: data.details,
      timestamp: data.timestamp,
    };
  },
};
