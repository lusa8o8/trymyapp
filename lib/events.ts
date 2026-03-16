import { createServiceClient } from './supabase-server';
import { EventType } from '@/types';

interface LogEventParams {
  event_type: EventType;
  user_id?: string;
  app_id?: string;
  session_id?: string;
  metadata?: Record<string, unknown>;
}

export async function logEvent(params: LogEventParams): Promise<void> {
  try {
    const supabase = createServiceClient();
    
    await supabase.from('events').insert({
      event_type: params.event_type,
      user_id: params.user_id || null,
      app_id: params.app_id || null,
      session_id: params.session_id || null,
      metadata: params.metadata || {},
    });
  } catch (error) {
    console.error('Failed to log event:', error);
  }
}