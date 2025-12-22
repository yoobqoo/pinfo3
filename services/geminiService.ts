import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, Platform } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 1. Metadata Scraper (Fast & Instant)
 */
export const scrapeMetadata = async (url: string) => {
    // A. YouTube Check
    const isYoutube = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
    if (isYoutube) {
        try {
            const oembedEndpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const response = await fetch(oembedEndpoint);
            if (response.ok) {
                const data = await response.json();
                return { title: data.title, image: data.thumbnail_url, platform: 'youtube' as Platform };
            }
        } catch (e) {}
    }

    // B. Generic Scraper
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

    let html = '';
    const proxies = [
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    ];

    for (const proxy of proxies) {
        try {
            const res = await fetch(proxy);
            if (res.ok) {
                if (proxy.includes('allorigins')) {
                    const json = await res.json();
                    html = json.contents;
                } else {
                    html = await res.text();
                }
                if (html) break;
            }
        } catch (e) {}
    }

    const meta = extractMeta(html);
    const lowerUrl = url.toLowerCase();
    let platform: Platform = 'other';
    if (lowerUrl.includes('instagram')) platform = 'instagram';
    else if (lowerUrl.includes('brunch') || lowerUrl.includes('velog') || lowerUrl.includes('medium') || lowerUrl.includes('tistory')) platform = 'blog';
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
 * 2. AI Insight Generator (Background Task)
 * 가독성을 위한 구조화된 텍스트 생성
 */
export const generateAIInsight = async (url: string, title: string, context: string, platform: Platform) => {
    try {
        let platformInstruction = "전문적인 웹 콘텐츠 분석가입니다.";
        if (platform === 'youtube') {
            platformInstruction = `유튜브 영상 분석 전문가입니다. 
            googleSearch를 활용해 영상의 실제 자막과 주요 타임라인을 확인하고, 
            가장 핵심적인 정보 3가지를 리스트 형식으로 정리하세요.`;
        } else if (platform === 'instagram') {
            platformInstruction = "인스타그램 트렌드 분석가입니다. 본문의 핵심 메시지와 의도를 3가지 포인트로 정리하세요.";
        }

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `URL: ${url}\nTitle: ${title}\nContext: ${context}\nPlatform: ${platform}`,
            config: {
                systemInstruction: `${platformInstruction}
                1. googleSearch 도구로 링크의 상세 내용을 분석하세요.
                2. 분석 결과에서 가장 중요한 핵심 정보 3개를 한국어로 작성하세요.
                3. **중요: 가독성을 위해 각 정보는 "이모지 + 한 줄 요약" 형식을 사용하고, 각 항목 사이에는 줄바꿈(Enter)을 2번 넣어 구분하세요.**
                4. 예시: 
                   📌 핵심 요약: 해당 영상의 가장 중요한 목적을 설명합니다.\n\n
                   ✅ 주요 포인트: 구체적인 방법론이나 수치를 언급합니다.\n\n
                   🚀 기대 효과: 이를 통해 얻을 수 있는 이점을 요약합니다.
                5. 관련 키워드 3개를 한국어로 추출하세요.
                6. 반드시 JSON 형식으로만 응답하세요.`,
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { 
                            type: Type.STRING,
                            description: "이모지와 줄바꿈으로 구조화된 3가지 핵심 요약 텍스트"
                        },
                        tags: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "핵심 키워드 3개"
                        }
                    },
                    required: ["summary", "tags"]
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
    } catch (e) {
        console.error("Gemini AI Insight Error:", e);
    }
    
    return { 
        summary: context ? (context.substring(0, 150) + "...") : "내용을 분석할 수 없지만 링크가 저장되었습니다.", 
        tags: [platform, "링크"] 
    };
};

export const analyzeUrl = async (url: string): Promise<AIAnalysisResult> => {
    const meta = await scrapeMetadata(url);
    const aiData = await generateAIInsight(url, meta.title, meta.description, meta.platform);
    return {
        title: meta.title,
        summary: aiData.summary,
        platform: meta.platform,
        tags: aiData.tags,
        thumbnailUrl: meta.image
    };
};
