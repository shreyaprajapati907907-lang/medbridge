export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { question } = req.body;

        if (!question || typeof question !== "string") {
            return res.status(400).json({
                error: "Please provide a question."
            });
        }

        const prompt = `
You are MedBridge, an educational medical-information assistant.

Your job is to explain medical information in simple, understandable language.
You are NOT a doctor and must NOT diagnose diseases, prescribe medicines, or tell
the user to change or stop a treatment.

If a question involves an emergency or potentially serious symptoms, clearly
recommend seeking appropriate professional medical care.

For general medical information:
- Explain concepts simply.
- Use headings and bullet points when useful.
- Clearly distinguish general information from a medical diagnosis.
- Do not invent medical facts.
- Encourage the user to consult a qualified healthcare professional for
  personalized medical advice.

User's question:
${question}
`;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API error:", data);

            return res.status(response.status).json({
                error: "Gemini API request failed."
            });
        }

        const answer =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) {
            return res.status(500).json({
                error: "Gemini returned no answer."
            });
        }

        return res.status(200).json({
            answer: answer
        });

    } catch (error) {
        console.error("Server error:", error);

        return res.status(500).json({
            error: "Something went wrong."
        });
    }
}
