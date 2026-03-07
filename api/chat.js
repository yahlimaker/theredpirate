export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          systemInstruction: {
            parts: [{
              text: `אתה עוזר לקוחות של חנות צעצועים "הפיראט האדום" - רשת חנויות צעצועים מובילה בישראל.
תפקידך לעזור ללקוחות עם:
- המלצות על צעצועים לפי גיל ותקציב
- מידע על מוצרים ומבצעים
- מידע על סניפים ושעות פתיחה (8 סניפים ברחבי הארץ)
- שאלות כלליות על החנות
ענה תמיד בעברית, בצורה ידידותית וקצרה. אל תמציא מחירים ספציפיים.`
            }]
          }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'מצטער, לא הצלחתי לענות.';
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ text: 'שגיאה בשרת. נסה שוב.' });
  }
}
