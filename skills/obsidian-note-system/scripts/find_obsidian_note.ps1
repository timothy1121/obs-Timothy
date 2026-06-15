param(
    [Parameter(Mandatory = $true)]
    [string]$Title,

    [Parameter(Mandatory = $false)]
    [string]$Root = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Root)) {
    if ($env:OBSIDIAN_NOTE_SYSTEM_VAULT_ROOT) {
        $Root = $env:OBSIDIAN_NOTE_SYSTEM_VAULT_ROOT
    } else {
        $Root = "D:\obsidian"
    }
}

$Root = $Root.Trim()

if (-not (Test-Path -LiteralPath $Root)) {
    throw "Vault root not found: $Root"
}

$files = Get-ChildItem -LiteralPath $Root -Recurse -File -Filter "*.md"
$normalizedTitle = $Title.Trim()

$exact = $files | Where-Object { $_.BaseName -eq $normalizedTitle }
if ($exact) {
    $exact | Select-Object -ExpandProperty FullName
    exit 0
}

$stem = $files | Where-Object { $_.BaseName -like "*$normalizedTitle*" }
if ($stem) {
    $stem | Select-Object -ExpandProperty FullName
    exit 0
}

Write-Output "No note found for: $Title"
