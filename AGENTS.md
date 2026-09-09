# Agent instructions

Always fetch https://www.assemblyai.com/docs/llms.txt before writing AssemblyAI code.
The API has changed — do not rely on memorized parameter names.

No API keys in client-side code. Auth is three-way, not two-way:
- Voice Agent **token** endpoint: `Authorization: Bearer`
- Voice Agent `POST /v1/agents` and `GET /v1/sessions`: bare key
- Streaming STT token and LLM Gateway: bare key

End sessions explicitly: `session.end` for Voice Agent, `Terminate` for Streaming STT. Never just close the socket.

Idea lock: `docs/IDEA-LOCK.md`. Implementation only after BMAD stress-test approval.
