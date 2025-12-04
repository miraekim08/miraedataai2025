import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateStudyPlan(params: {
    testName: string;
    testDate: Date;
    materials: string[];
    userGoals: string;
    studyType: string;
    intensityLevel: string;
}) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a study planning assistant. Create a detailed study plan based on the following information:

Test Name: ${params.testName}
Test Date: ${params.testDate.toLocaleDateString()}
Materials to Study: ${params.materials.join(", ") || "Not specified"}
Study Type: ${params.studyType}
Intensity Level: ${params.intensityLevel}

User's Goals and Focus Areas:
${params.userGoals}

Based on this information, create a study plan with:
1. Recommended daily study time allocation
2. Suggested focus areas and priorities
3. Specific topics or chapters to emphasize
4. Study techniques that would work best
5. A brief timeline/pacing strategy

Format your response as a JSON object with these fields:
{
  "dailyMinutes": number (suggested daily study time in minutes),
  "focusAreas": string[] (3-5 key areas to focus on),
  "studyTechniques": string[] (recommended techniques),
  "timeline": string (brief pacing strategy),
  "customRecommendations": string (personalized advice)
}

Return ONLY the JSON object, no additional text.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        // Fallback if JSON parsing fails
        return {
            dailyMinutes: 120,
            focusAreas: ["Core concepts", "Practice problems", "Review"],
            studyTechniques: ["Active recall", "Spaced repetition"],
            timeline: "Start with fundamentals, build to complex topics",
            customRecommendations: text
        };
    } catch (error) {
        console.error("Error generating study plan:", error);
        return null;
    }
}
