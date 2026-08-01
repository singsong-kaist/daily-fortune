import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type FortuneDraw = {
  id: string;
  created_at: string;
  fortune: string;
  lucky_item: string;
  lucky_number: number;
  user_id: string | null;
};
