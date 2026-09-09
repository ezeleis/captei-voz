# Agent instructions

Always fetch https://www.assemblyai.com/docs/llms.txt before writing AssemblyAI code.
The API has changed — do not rely on memorized parameter names.

No API keys in client-side code. Voice Agent API uses `Authorization: Bearer`; STT/LLM Gateway use the raw key (no Bearer). Always terminate realtime sessions.

Idea lock: `docs/IDEA-LOCK.md`. Implementation only after BMAD stress-test approval.
