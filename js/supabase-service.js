// Supabase Service
const SupabaseService = {
  client: null,

  init() {
    this.client = window.supabase.createClient(
      window.CONFIG.SUPABASE.URL,
      window.CONFIG.SUPABASE.KEY
    );
  },

  async getRelationships() {
    try {
      const { data, error } = await this.client
        .from('relationships')
        .select('*')
        .order('events', { ascending: false });
      
      if (error) {
        console.error('Error fetching relationships:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching relationships:', error);
      return [];
    }
  },

  async getRelationshipById(id) {
    try {
      const { data, error } = await this.client
        .from('relationships')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching relationship:', error);
      return null;
    }
  },

  async getRelationshipStats(relationshipId) {
    try {
      const { data, error } = await this.client
        .from('relationship_stats')
        .select('*')
        .eq('relationship_id', relationshipId);
      
      if (error) {
        console.error('Error fetching stats:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching stats:', error);
      return [];
    }
  }
};

// Initialize Supabase
window.SupabaseService = SupabaseService;