# Holiday Jeopardy: Gemini AI Integration

This application leverages the Google Gemini API to create a dynamic, interactive Jeopardy-style experience.

## Models Used

- **Game Generation**: `gemini-3-flash-preview`
  - Used to generate a structured JSON game board based on a user-provided holiday topic.
  - Configuration: `responseMimeType: "application/json"` with a strict `responseSchema`.
- **Hint Logic**: `gemini-3-flash-preview`
  - Generates context-aware hints (max 10 words) for clues to help struggling players without revealing the answer.
- **Text-to-Speech (TTS)**: `gemini-2.5-flash-preview-tts`
  - Transforms clue text into spoken audio using the `Fenrir` voice to act as a virtual game host.

## Implementation Details

### Game Board Schema
The AI is instructed to return a specific JSON structure:
- `categories`: Array of 5 categories.
- `questions`: Array of 5 questions per category with values (200-1000).
- `finalJeopardy`: A high-stakes single question with category, clue, and answer.

### Audio Processing
TTS output is received as raw PCM data (base64 encoded), which is decoded via `AudioContext` and `Int16Array` for low-latency playback in the browser.

### Error Handling
The application includes a `FALLBACK_GAME_DATA` set (defined in `constants.ts`) to ensure the game remains playable even if API limits are reached or connectivity issues occur.