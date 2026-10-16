"""Regression checks for fresh, input-specific summaries on every submission."""
import json

import config
from services import ai_service


def test_changed_inputs_make_new_gemini_calls_and_update_summary(monkeypatch, client, scenario_1):
    prompts = []

    def generated(prompt):
        prompts.append(prompt)
        line = next(line for line in prompt.splitlines() if line.startswith("Readings entered: "))
        readings = json.loads(line.removeprefix("Readings entered: "))
        return {"summary": f"The reported temperature is {readings['temperature_c']} degrees C.",
                "uncertainty": "Confirm the operating range and inspect the machine.",
                "safety": ["Follow the approved isolation procedure."]}

    monkeypatch.setattr(config, "GEMINI_API_KEY", "test-key")
    monkeypatch.setattr(ai_service, "_gemini", generated)
    first = client.post("/api/diagnose", json=scenario_1)
    second = client.post("/api/diagnose", json={**scenario_1, "temperature_c": 96})
    assert len(prompts) == 2 and prompts[0] != prompts[1]
    assert first.get_json()["ai_source"] == second.get_json()["ai_source"] == "gemini"
    assert "95.0" in first.get_json()["ai_summary"]
    assert "96.0" in second.get_json()["ai_summary"]
    assert first.get_json()["ai_summary"] != second.get_json()["ai_summary"]
    assert first.headers["Cache-Control"] == second.headers["Cache-Control"] == "no-store"


def test_template_changes_even_if_candidate_faults_stay_the_same(client, scenario_1):
    first = client.post("/api/diagnose", json=scenario_1).get_json()
    second = client.post("/api/diagnose", json={**scenario_1, "temperature_c": 96}).get_json()
    assert [fault["id"] for fault in first["faults"]] == [fault["id"] for fault in second["faults"]]
    assert first["ai_summary"] != second["ai_summary"]
    assert "95.0" in first["ai_summary"] and "96.0" in second["ai_summary"]


def test_prompt_requires_current_readings_and_preserves_unknowns(scenario_1):
    from services.diagnosis_engine import diagnose, normalise_inputs
    inputs = normalise_inputs(scenario_1)
    prompt = ai_service.build_prompt(inputs, diagnose(inputs))
    assert "fresh summary specifically for this request" in prompt
    assert "exact supplied" in prompt
    assert "Missing readings are unknown" in prompt
