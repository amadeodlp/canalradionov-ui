import { supabase } from '@lib/supabase';

export interface Episode {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  duration_seconds: number;
  publish_date: string;
  play_count: number;
  image_url?: string;
}

export interface RadioShow {
  id: string;
  title: string;
  description: string;
  host_name: string;
  image_url: string;
  is_live: boolean;
  scheduled_time: string;
  end_time: string;
  tags: string[];
  episodes?: Episode[];
}

class MediaService {
  async getAllShows(): Promise<RadioShow[]> {
    const { data } = await supabase
      .from('radio_shows')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  }

  async getShowById(id: string): Promise<RadioShow | null> {
    const { data } = await supabase
      .from('radio_shows')
      .select('*, episodes(*)')
      .eq('id', id)
      .single();
    return data;
  }

  async getLiveShows(): Promise<RadioShow[]> {
    const { data } = await supabase
      .from('radio_shows')
      .select('*')
      .eq('is_live', true);
    return data || [];
  }

  async getUpcomingShows(): Promise<RadioShow[]> {
    const { data } = await supabase
      .from('radio_shows')
      .select('*')
      .eq('is_live', false)
      .gt('scheduled_time', new Date().toISOString())
      .order('scheduled_time', { ascending: true });
    return data || [];
  }

  async getFeaturedShows(): Promise<RadioShow[]> {
    const { data } = await supabase
      .from('radio_shows')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);
    return data || [];
  }

  async searchShows(query: string): Promise<RadioShow[]> {
    const { data } = await supabase
      .from('radio_shows')
      .select('*')
      .ilike('title', `%${query}%`);
    return data || [];
  }

  async incrementPlayCount(episodeId: string): Promise<void> {
    await supabase
      .from('episodes')
      .update({ play_count: supabase.rpc as unknown })
      .eq('id', episodeId)
      .catch(() => {});
  }
}

export const mediaService = new MediaService();
export default mediaService;
