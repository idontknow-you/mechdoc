$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

$mechDoctorVenv = Join-Path $PSScriptRoot 'backend\.venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $mechDoctorVenv)) {
    $mechDoctorCandidates = @()
    $mechDoctorInstalledRoot = Join-Path $env:LOCALAPPDATA 'Programs\Python'
    if (Test-Path -LiteralPath $mechDoctorInstalledRoot) {
        $mechDoctorCandidates += Get-ChildItem -LiteralPath $mechDoctorInstalledRoot -Directory |
            Sort-Object Name -Descending |
            ForEach-Object { Join-Path $_.FullName 'python.exe' }
    }
    $mechDoctorCommand = Get-Command python.exe -ErrorAction SilentlyContinue
    if ($mechDoctorCommand) { $mechDoctorCandidates += $mechDoctorCommand.Source }
    $mechDoctorPython = $null
    foreach ($mechDoctorCandidate in $mechDoctorCandidates) {
        if (Test-Path -LiteralPath $mechDoctorCandidate) {
            & $mechDoctorCandidate --version 2>$null
            if ($LASTEXITCODE -eq 0) { $mechDoctorPython = $mechDoctorCandidate; break }
        }
    }
    if (-not $mechDoctorPython) { throw 'Install Python 3.11 or newer, then run setup again.' }
    & $mechDoctorPython -m venv (Join-Path $PSScriptRoot 'backend\.venv')
    if ($LASTEXITCODE -ne 0) { throw 'Could not create the Python environment.' }
}
& $mechDoctorVenv -m pip install -r (Join-Path $PSScriptRoot 'backend\requirements.txt')
if ($LASTEXITCODE -ne 0) { throw 'Backend dependency installation failed.' }

Push-Location -LiteralPath (Join-Path $PSScriptRoot 'frontend')
try {
    & npm.cmd ci
    if ($LASTEXITCODE -ne 0) { throw 'Frontend dependency installation failed.' }
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed.' }
} finally { Pop-Location }

$mechDoctorEnv = Join-Path $PSScriptRoot 'backend\.env'
if (-not (Test-Path -LiteralPath $mechDoctorEnv)) {
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'backend\.env.example') -Destination $mechDoctorEnv
}
Write-Host 'Setup complete. Add your Gemini key to backend/.env, then run Start-MechDoctor.cmd.'
Write-Host 'Open http://localhost:5000 after starting the app.'
