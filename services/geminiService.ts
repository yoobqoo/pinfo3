
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, Platform } from "../types";

/**
 * 1. Metadata Scraper - Focused on Stability for Threads (OG based)
 */
export const scrapeMetadata = async (url: string) => {
    const isYoutube = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
    const isNaverBlog = url.includes("blog.naver.com");
    const isThreads = url.includes("threads.net") || url.includes("threads.com");

    const fetchWithProxy = async (targetUrl: string): Promise<string | null> => {
        const proxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
            `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
        ];
        
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
            description: decode(getTag('description')),
            ogTitle: decode(getTag('title'))
        };
    };

    // A. YouTube Case
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

    // B. Threads Case (OG Metadata Strategy)
    if (isThreads) {
        // Extract postId and author from URL
        // Example: https://www.threads.net/@user/post/POST_ID
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/').filter(p => p);
        const authorMatch = urlObj.pathname.match(/\/(@[^\/]+)/);
        const postMatch = urlObj.pathname.match(/\/post\/([^\/]+)/);

        const author = authorMatch ? authorMatch[1] : undefined;
        const postId = postMatch ? postMatch[1] : undefined;
        const canonicalUrl = `${urlObj.origin}${urlObj.pathname}`; // Remove query params

        const html = await fetchWithProxy(url);
        if (html) {
            const meta = extractMeta(html);
            let cleanTitle = meta.ogTitle || meta.title || "Threads Post";
            
            // Clean title if it contains "on Threads"
            if (cleanTitle.includes('on Threads')) {
                cleanTitle = cleanTitle.split('on Threads')[0].trim();
            }

            return {
                title: cleanTitle,
                image: meta.image || undefined,
                description: meta.description || "",
                platform: 'threads' as Platform,
                author: author,
                authorProfileUrl: author ? `https://www.threads.net/${author}` : undefined,
                platformId: postId,
                fullContentCollected: false, // Threads server-side limitation
                canonicalUrl: canonicalUrl
            };
        }
    }

    // C. Naver Blog Special Case
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

    // D. Generic Case
    const html = await fetchWithProxy(url);
    const meta = extractMeta(html || "");
    const lowerUrl = url.toLowerCase();
    let platform: Platform = 'other';
    
    if (lowerUrl.includes('instagram')) platform = 'instagram';
    else if (lowerUrl.includes('threads')) platform = 'threads';
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
 * 2. AI Insight Generator
 */
export const generateAIInsight = async (url: string, title: string, context: string, platform: Platform, intent?: string) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const intentHint = intent ? `\nUser's purpose for saving: ${intent}` : '';
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `URL: ${url}\nTitle: ${title}\nContext: ${context}\nPlatform: ${platform}${intentHint}`,
            config: {
                systemInstruction: `Analyze in Korean and extract actionable tasks.
                - Summary: 3 key bullet points about the content.
                - Tags: 3 relevant keywords.
                - Tasks: 1~3 concrete, immediately actionable to-do items the user can actually DO based on this content.
                  (e.g. for a restaurant: "예약 전화하기", "카카오맵에 저장하기" / for a recipe: "장보기: 재료명들" / for an article: "팀에 공유하기")
                  Tasks must be specific actions, not vague summaries. Keep each task under 25 characters.
                - Tone: Insightful and action-oriented.
                - Response must be pure JSON.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["summary", "tags", "tasks"]
                }
            }
        });

        if (response.text) return JSON.parse(response.text.trim());
    } catch (e) {
        console.error("AI Error:", e);
    }
    return { summary: context ? (context.substring(0, 100) + "...") : "저장되었습니다.", tags: [platform], tasks: [] };
};
