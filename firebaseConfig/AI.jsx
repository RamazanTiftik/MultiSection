const AI_API_KEY = "AIzaSyCBGWEv--Ym3FnD6vVJrbXaVLATPezQi8k"


export async function runAI(promptText) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AI_API_KEY}`
            ,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }]
                })
            }
        );

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || 'Cevap alınamadı.';
    } catch (error) {
        console.error('AI hata:', error);
        return 'Bir hata oluştu.';
    }
}