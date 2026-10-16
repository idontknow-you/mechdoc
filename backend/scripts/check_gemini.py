"""Check the configured Gemini connection without printing credentials."""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import config
from google import genai


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=config.GEMINI_MODEL)
    parser.add_argument("--list-models", action="store_true")
    args = parser.parse_args()
    try:
        with genai.Client(api_key=config.GEMINI_API_KEY, http_options={"timeout": 30000}) as client:
            if args.list_models:
                models = [model.name for model in client.models.list()
                          if "flash" in (model.name or "")
                          and "generateContent" in (model.supported_actions or [])]
                print(json.dumps({"available_text_models": models[:12]}))
            response = client.models.generate_content(
                model=args.model,
                contents="Return a JSON object with one string field named summary saying Connection working.",
                config={"response_mime_type": "application/json", "temperature": 0.3},
            )
            assert json.loads(response.text).get("summary")
            print(json.dumps({"connected": True, "model": args.model}))
            return 0
    except Exception as exc:
        message = str(exc)
        for secret in (config.GEMINI_API_KEY, config.GROQ_API_KEY):
            if secret:
                message = message.replace(secret, "[REDACTED]")
        print(json.dumps({"connected": False, "model": args.model,
                          "error_type": type(exc).__name__, "code": getattr(exc, "code", None),
                          "message": message[:1200]}))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
