
import { createClient } from '@supabase/supabase-js';
import { Project, Pin } from '../types';

// Use environment variables provided by Vercel
const SUPABASE_URL = (typeof process !== 'undefined' && process.env?.SUPABASE_URL) || 'https://myatzzknbeyzuuzqiwbj.supabase.co';
const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) || '';

// Create a safe mock auth object to prevent "Cannot read property 'getSession' of undefined"
const mockSupabase = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
        signInWithOtp: async () => ({ error: new Error("Supabase is not configured.") })
    },
    from: () => ({
        select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }), single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) })
    })
} as any;

export const supabase = SUPABASE_ANON_KEY 
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : mockSupabase;

export const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
};

// --- DB Helper Functions ---

export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
    try {
        const { data: projectsData, error: projError } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (projError) throw projError;

        const { data: pinsData, error: pinsError } = await supabase
            .from('pins')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (pinsError) throw pinsError;

        if (!projectsData) return [];

        return projectsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            color: p.color,
            createdAt: new Date(p.created_at).getTime(),
            pins: (pinsData || [])
                .filter((pin: any) => pin.project_id === p.id)
                .map((pin: any) => ({
                    id: pin.id,
                    originalUrl: pin.original_url,
                    title: pin.title,
                    summary: pin.summary,
                    platform: pin.platform,
                    tags: pin.tags || [],
                    createdAt: new Date(pin.created_at).getTime(),
                    thumbnailUrl: pin.thumbnail_url,
                    isAnalyzing: false,
                    note: pin.note,
                    intent: pin.intent,
                    tasks: pin.tasks || [],
                    completedTasks: pin.completedTasks || []
                }))
        }));
    } catch (e) {
        console.error("Error fetching data from Supabase:", e);
        return [];
    }
};

export const createProjectInDb = async (userId: string, name: string, color: string): Promise<Project | null> => {
    const { data, error } = await supabase
        .from('projects')
        .insert({ user_id: userId, name, color })
        .select()
        .single();

    if (error || !data) return null;
    return {
        id: data.id,
        name: data.name,
        color: data.color,
        createdAt: new Date(data.created_at).getTime(),
        pins: []
    };
};

export const updateProjectInDb = async (projectId: string, name: string, color: string) => {
    const { error } = await supabase.from('projects').update({ name, color }).eq('id', projectId);
    return !error;
};

export const deleteProjectInDb = async (projectId: string) => {
    await supabase.from('pins').delete().eq('project_id', projectId);
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    return !error;
};

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
            thumbnail_url: pin.thumbnailUrl,
            note: pin.note,
            intent: pin.intent,
            tasks: pin.tasks || [],
            completed_tasks: pin.completedTasks || []
        })
        .select()
        .single();

    if (error || !data) return null;
    return {
        id: data.id,
        originalUrl: data.original_url,
        title: data.title,
        summary: data.summary,
        platform: data.platform,
        tags: data.tags,
        createdAt: new Date(data.created_at).getTime(),
        thumbnailUrl: data.thumbnail_url,
        isAnalyzing: false,
        note: data.note,
        intent: data.intent,
        tasks: data.tasks || [],
        completedTasks: data.completed_tasks || []
    };
};

export const updatePinAIInDb = async (pinId: string, summary: string, tags: string[], tasks: string[]) => {
    const { error } = await supabase.from('pins').update({ summary, tags, tasks }).eq('id', pinId);
    return !error;
};

export const updatePinTasksInDb = async (pinId: string, completedTasks: number[]) => {
    const { error } = await supabase.from('pins').update({ completed_tasks: completedTasks }).eq('id', pinId);
    return !error;
};

export const updatePinNoteInDb = async (pinId: string, note: string) => {
    const { error } = await supabase.from('pins').update({ note }).eq('id', pinId);
    return !error;
};

export const deletePinFromDb = async (pinId: string) => {
    const { error } = await supabase.from('pins').delete().eq('id', pinId);
    return !error;
};
