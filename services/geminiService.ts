
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, Platform } from "../types";

/**
 * 1. Metadata Scraper - Optimized for Parallel Speed
 */
export const scrapeMetadata = async (url: string) => {
    const isYoutube = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
    const isNaverBlog = url.includes("blog.naver.com");

    const fetchWithProxy = async (targetUrl: string): Promise<string | null> => {
        const proxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
            `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
        ];
        
        // Parallel fetching to use the fastest proxy response
        // Fix: Replaced Promise.any with manual implementation to resolve TS error: Property 'any' does not exist on type 'PromiseConstructor'
        try {
            return await new Promise<string>((resolve, reject) => {
                let rejectedCount = 0;
                proxies.forEach(async (proxy) => {
                    try {
                        const res = await fetch(proxy);
                        if (!res.ok) throw new Error('Proxy fetch failed');
                        let content: string;
                        if (proxy.includes('allorigins')) {
                            const json = await res.json();
                            content = json.contents;
                        } else {
                            content = await res.text();
                        }
                        resolve(content);
                    } catch (e) {
                        rejectedCount++;
                        if (rejectedCount === proxies.length) {
                            reject(new Error('All proxies failed'));
                        }
                    }
                });
            });
        } catch (e) {
            return null;
        }
    };

    const extractMeta = (html: string) => {
        const getTag = (prop: string) => {
            const re1 = new RegExp(`<meta[^>]+(?:property|name)=["'](?:og:|twitter:)?${prop}["'][^>]*content=["']([^"']+)["']`, 'i');
            const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:|twitter:)?${prop}["']`, 'i');
            const match = html.match(re1) || html.match(re2);
            return match ? match[1] : null;
        };
        const titleRegex = /<title[^>]*>([^<]+)<\/title>/i;
        const decode = (str: string | null) => {
            if (!str) return null;
            return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        };
        return {
            title: decode(getTag('title') || html.match(titleRegex)?.[1]),
            image: decode(getTag('image')),
            description: decode(getTag('description'))
        };
    };

    // A. YouTube Case (Oembed is usually fastest)
    if (isYoutube) {
        try {
            const oembedEndpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const response = await fetch(oembedEndpoint);
            if (response.ok) {
                const data = await response.json();
                return { title: data.title, image: data.thumbnail_url, platform: 'youtube' as Platform, description: "" };
            }
        } catch (e) {}
    }

    // B. Naver Blog Special Case
    if (isNaverBlog) {
        let mainHtml = await fetchWithProxy(url);
        if (mainHtml) {
            const iframeMatch = mainHtml.match(/<iframe[^>]+id=["']mainFrame["'][^>]+src=["']([^"']+)["']/i);
            if (iframeMatch) {
                let iframeUrl = iframeMatch[1];
                if (iframeUrl.startsWith('/')) iframeUrl = `https://blog.naver.com${iframeUrl}`;
                
                const iframeHtml = await fetchWithProxy(iframeUrl);
                if (iframeHtml) {
                    const imgMatch = iframeHtml.match(/<img[^>]+src=["'](https:\/\/postfiles\.pstatic\.net\/[^"']+)["']/i) ||
                                   iframeHtml.match(/<img[^>]+src=["'](https:\/\/blogfiles\.pstatic\.net\/[^"']+)["']/i) ||
                                   iframeHtml.match(/<img[^>]+src=["']([^"']+)["'][^>]*class=["'][^"']*se-image-resource[^"']*["']/i);
                    
                    const meta = extractMeta(iframeHtml);
                    return {
                        title: meta.title || "Naver Blog",
                        image: imgMatch ? imgMatch[1] : meta.image,
                        description: meta.description || "",
                        platform: 'blog' as Platform
                    };
                }
            }
        }
    }

    // C. Generic Case
    const html = await fetchWithProxy(url);
    const meta = extractMeta(html || "");
    const lowerUrl = url.toLowerCase();
    let platform: Platform = 'other';
    if (lowerUrl.includes('instagram')) platform = 'instagram';
    else if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) platform = 'twitter';
    else if (lowerUrl.includes('linkedin')) platform = 'linkedin';
    else if (lowerUrl.includes('github')) platform = 'github';
    else if (lowerUrl.includes('brunch') || lowerUrl.includes('velog') || lowerUrl.includes('medium') || lowerUrl.includes('tistory') || isNaverBlog) platform = 'blog';
    else if (lowerUrl.includes('news')) platform = 'news';
    else if (isYoutube) platform = 'youtube';

    return {
        title: meta.title || url,
        image: meta.image || undefined,
        description: meta.description || "",
        platform
    };
};

/**
 * 2. AI Insight Generator - Optimized for Speed
 */
export const generateAIInsight = async (url: string, title: string, context: string, platform: Platform) => {
    try {
        // Fix: Use process.env.API_KEY directly when initializing GoogleGenAI as per SDK guidelines
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `URL: ${url}\nTitle: ${title}\nContext: ${context}\nPlatform: ${platform}`,
            config: {
                systemInstruction: `Analyze concisely. Korean. 3 bullets. 3 tags. JSON only.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["summary", "tags"]
                }
            }
        });

        // Fix: Access response text via the .text property (not a method) and trim before parsing
        if (response.text) return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("AI Error:", e);
    }
    return { summary: context ? (context.substring(0, 100) + "...") : "저장되었습니다.", tags: [platform] };
};
