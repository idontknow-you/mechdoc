"""Create a distributable ZIP with source, shared components, and built frontend."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

PROJECT = Path(__file__).resolve().parents[1]
WORKSPACE = PROJECT.parent
OUTPUT = WORKSPACE / "MechDoctor-final.zip"
EXCLUDE_DIRS = {"node_modules", ".venv", "venv", "__pycache__", ".pytest_cache", ".runtime", ".git", "test-artifacts"}


def package():
    if not (PROJECT / "frontend/dist/index.html").is_file():
        raise RuntimeError("Build the frontend before packaging.")
    sources = [PROJECT, WORKSPACE / "TANVI doc", WORKSPACE / "stitch_mechdoctor_fault_diagnosis_system"]
    count = 0
    with ZipFile(OUTPUT, "w", ZIP_DEFLATED, compresslevel=8) as archive:
        for root in sources:
            if not root.is_dir():
                continue
            for path in sorted(root.rglob("*")):
                relative = path.relative_to(WORKSPACE)
                if any(part in EXCLUDE_DIRS for part in relative.parts):
                    continue
                if not path.is_file() or path.name.endswith((".log", ".pyc", ".zip")):
                    continue
                if path.name.startswith(".env") and path.name != ".env.example":
                    continue
                archive.write(path, Path("MechDoctor") / relative)
                count += 1
        archive.writestr("MechDoctor/OPEN-ME.txt", "MechDoctor final project\n\nOpen mechdoctor-main/README.md.\nOn a new machine, run mechdoctor-main/Setup-MechDoctor.cmd once, add your Gemini key to backend/.env, then run mechdoctor-main/Start-MechDoctor.cmd.\nOpen http://localhost:5000.\n\nThe original TANVI components and Stitch design references are included.\nThe source, built HTML/CSS/JS, tests, and dependency manifests are included.\nAPI keys, installed dependencies, logs, and caches are excluded.\n")
    with ZipFile(OUTPUT) as archive:
        assert archive.testzip() is None
        names = set(archive.namelist())
        assert "MechDoctor/mechdoctor-main/frontend/dist/index.html" in names
        assert "MechDoctor/TANVI doc/DiagnosisReport.jsx" in names
        assert "MechDoctor/mechdoctor-main/backend/services/ai_service.py" in names
        assert not any(Path(name).name == ".env" for name in names)
    print(f"Created {OUTPUT.name}: {count + 1} files, {OUTPUT.stat().st_size:,} bytes. Archive integrity verified.")


if __name__ == "__main__":
    package()
