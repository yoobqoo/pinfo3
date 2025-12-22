import { createClient } from '@supabase/supabase-js';
import { Project, Pin } from '../types';

const SUPABASE_URL = 'https://myatzzknbeyzuuzqiwbj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15YXR6emtuYmV5enV1enFpd2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MTkwNDQsImV4cCI6MjA4MTE5NTA0NH0.7GsaOeQG7IG79T5alB6y0kUwuAkWTxxhuAmCVIlY0j8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
};

// --- DB Helper Functions ---

// 1. Fetch all data for user
export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
    try {
        // Fetch Projects
        const { data: projectsData, error: projError } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (projError) throw projError;

        // Fetch Pins
        const { data: pinsData, error: pinsError } = await supabase
            .from('pins')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (pinsError) throw pinsError;

        if (!projectsData) return [];

        // Join Projects and Pins
        return projectsData.map(p => ({
            id: p.id,
            name: p.name,
            color: p.color,
            createdAt: new Date(p.created_at).getTime(),
            pins: (pinsData || [])
                .filter(pin => pin.project_id === p.id)
                .map(pin => ({
                    id: pin.id,
                    originalUrl: pin.original_url,
                    title: pin.title,
                    summary: pin.summary,
                    platform: pin.platform,
                    tags: pin.tags || [],
                    createdAt: new Date(pin.created_at).getTime(),
                    thumbnailUrl: pin.thumbnail_url,
                    isAnalyzing: false
                }))
        }));
    } catch (e) {
        console.error("Error fetching data from Supabase:", e);
        return [];
    }
};

// 2. Create Project
export const createProjectInDb = async (userId: string, name: string, color: string): Promise<Project | null> => {
    const { data, error } = await supabase
        .from('projects')
        .insert({
            user_id: userId,
            name,
            color
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating project:", error);
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        color: data.color,
        createdAt: new Date(data.created_at).getTime(),
        pins: []
    };
};

// 3. Create Pin
export const createPinInDb = async (userId: string, projectId: string, pin: Pin): Promise<Pin | null> => {
    const { data, error } = await supabase
        .from('pins')
        .insert({
            user_id: userId,
            project_id: projectId,
            original_url: pin.originalUrl,
            title: pin.title,
            summary: pin.summary,
            platform: pin.platform,
            tags: pin.tags,
            thumbnail_url: pin.thumbnailUrl
        })
        .select()
        .single();

    if (error) {
         console.error("Error creating pin:", error);
         return null;
    }

    return {
        id: data.id,
        originalUrl: data.original_url,
        title: data.title,
        summary: data.summary,
        platform: data.platform,
        tags: data.tags,
        createdAt: new Date(data.created_at).getTime(),
        thumbnailUrl: data.thumbnail_url,
        isAnalyzing: false
    };
};