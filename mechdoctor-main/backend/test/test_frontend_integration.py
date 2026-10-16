"""Integration contract used by the connected browser frontend."""
import pytest


def test_built_frontend_is_served_from_the_backend(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.content_type
    assert b"MechDoctor" in response.data
    assert b"/assets/" in response.data


@pytest.mark.parametrize("machine", ["electric_motor", "water_pump", "gearbox", "conveyor_belt"])
def test_catalogue_options_can_be_submitted_for_every_machine(client, machine):
    catalogue = client.get("/api/machines").get_json()["machines"]
    definition = next(item for item in catalogue if item["id"] == machine)
    payload = {"machine": machine}
    for field in definition["fields"]:
        if field["type"] == "select":
            payload[field["name"]] = field["options"][-1]["value"]
        elif field["type"] == "number":
            payload[field["name"]] = 95 if field["name"] == "temperature_c" else 1450
    response = client.post("/api/diagnose", json=payload)
    assert response.status_code == 200, response.get_json()
    report = response.get_json()
    assert report["machine"] == machine
    assert report["ai_summary"] and report["uncertainty"]
    assert report["faults"] and report["safety_precautions"]
    scores = [fault["score"] for fault in report["faults"]]
    assert scores == sorted(scores, reverse=True)
    for fault in report["faults"]:
        assert fault["inspection_steps"] and fault["maintenance_actions"]
        assert fault["confidence"] in {"Low", "Medium", "High"}


def test_unknown_fields_do_not_become_normal_readings(client):
    response = client.post("/api/diagnose", json={"machine": "water_pump"})
    assert response.status_code == 200
    report = response.get_json()
    assert report["faults"][0]["id"] == "no_clear_pattern"
    assert report["faults"][0]["score"] == 0
    assert "vibration" not in report["inputs"]
