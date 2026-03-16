export type UserRole = 'developer' | 'tester' | 'admin';
export type AppStatus = 'pending' | 'active' | 'inactive' | 'rejected';
export type AppTier = 'free' | 'builder' | 'launch';
export type ExtensionType = 'trymyapp_uk' | 'dev' | 'none';
export type TestStatus = 'started' | 'completed' | 'abandoned';
export type ReportStatus = 'pending' | 'generating' | 'ready' | 'failed';
export type TxnStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type TxnType = 'builder_tier' | 'launch_tier' | 'creator_payout';
export type EventType = 
  | 'session_started' 
  | 'session_ended' 
  | 'app_viewed' 
  | 'test_started' 
  | 'test_completed' 
  | 'feedback_submitted' 
  | 'button_clicked' 
  | 'navigation_event';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  display_name: string | null;
  avatar_url: string | null;
  youtube_url: string | null;
  channel_name: string | null;
  niche: string | null;
  bio: string | null;
  is_approved_creator: boolean;
  created_at: string;
}

export interface App {
  id: string;
  developer_id: string;
  name: string;
  url: string;
  description: string;
  instructions: string;
  category: string;
  status: AppStatus;
  tier: AppTier;
  extension_assigned: boolean;
  extension_slug: string | null;
  extension_type: ExtensionType;
  screenshot_url: string | null;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string;
  app_id: string;
  tester_id: string;
  started_at: string;
  completed_at: string | null;
  status: TestStatus;
}

export interface Feedback {
  id: string;
  test_id: string;
  ux_rating: number | null;
  ux_feedback: string | null;
  bug_report: string | null;
  suggestions: string | null;
  checklist_done: boolean;
  would_use: boolean | null;
  created_at: string;
}

export interface Event {
  id: string;
  event_type: EventType;
  user_id: string | null;
  app_id: string | null;
  session_id: string | null;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface Session {
  id: string;
  user_id: string | null;
  app_id: string | null;
  started_at: string;
  ended_at: string | null;
  completion_status: string;
  total_actions: number;
}

export interface Report {
  id: string;
  app_id: string;
  status: ReportStatus;
  content_json: ReportContent | null;
  content_html: string | null;
  generated_at: string | null;
  feedback_count: number;
  created_at: string;
}

export interface ReportContent {
  summary: string;
  ux_score_avg: number;
  top_issues: Array<{ issue: string; frequency: number; severity: 'high' | 'medium' | 'low' }>;
  bugs: Array<{ description: string; frequency: number }>;
  suggestions: Array<{ suggestion: string; votes: number }>;
  sentiment: 'positive' | 'neutral' | 'negative';
  would_use_pct: number;
  priority_actions: string[];
}

export interface Transaction {
  id: string;
  developer_id: string | null;
  app_id: string | null;
  stripe_session_id: string | null;
  type: TxnType;
  amount_cents: number;
  currency: string;
  status: TxnStatus;
  platform_cut: number | null;
  creator_payout: number | null;
  stripe_connect_id: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface AppAnalytics {
  app_id: string;
  app_name: string;
  total_views: number;
  tests_started: number;
  tests_completed: number;
  feedback_count: number;
  completion_rate: number;
  avg_ux_score: number | null;
  avg_session_duration_secs: number | null;
  would_use_pct: number | null;
}