# Setup Instructions for AI Features

## Getting Your Gemini API Key

1. **Go to Google AI Studio:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Get API Key" or "Create API Key"
   - Copy the API key that's generated

3. **Add to Your Project:**
   - Create a file named `.env.local` in the project root
   - Add this line:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```
   - Replace `your_actual_api_key_here` with your real API key

4. **Restart Development Server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

## How the AI Feature Works

When creating a new test, you'll now have a 2-step process:

**Step 1: Basic Info**
- Enter test name
- Set test date
- Select materials (optional)

**Step 2: AI Planning** ✨
- Describe your study goals in natural language
- Tell the AI about:
  - Your learning style (visual, reading, hands-on)
  - Topics you struggle with
  - Areas you want to focus on
  - How you like to study
  - Any specific priorities

**Example Input:**
```
I'm a visual learner and struggle with organic chemistry reactions.
I need extra time on synthesis problems and mechanisms.
I prefer understanding concepts deeply rather than memorization.
I want to focus 60% on problem-solving and 40% on theory.
```

**What the AI Does:**
- Analyzes your goals and learning style
- Recommends optimal daily study time
- Identifies 3-5 key focus areas
- Suggests study techniques that match your style
- Creates a personalized timeline
- Distributes tasks according to your priorities

The AI will automatically:
✅ Create study units based on your focus areas
✅ Distribute time according to your preferences
✅ Generate daily tasks aligned with your goals
✅ Optimize the schedule for your test date

## Testing Without API Key

If you don't have an API key yet, the app will still work:
- The AI step is optional
- You can skip the AI planning and create a basic schedule
- The algorithm will use default settings from your study preferences

## Troubleshooting

**"API key not found" error:**
- Make sure `.env.local` exists in project root
- Check that the variable name is exactly `NEXT_PUBLIC_GEMINI_API_KEY`
- Restart the development server after adding the key

**AI not responding:**
- Check your API quota at Google AI Studio
- Ensure you have internet connection
- The app will fallback to basic scheduling if AI fails
