# Get all running processes of Flow Launcher
$flowLauncherProcesses = Get-Process -name "Flow.Launcher" -ErrorAction SilentlyContinue

# Check if there are any instances running
if ($flowLauncherProcesses) {
    # Loop through each process and close it
    foreach ($process in $flowLauncherProcesses) {
        Stop-Process -Id $process.Id -Force
        Write-Host "Closed Flow Launcher process with ID $($process.Id)"
    }
} else {
    Write-Host "No running instances of Flow Launcher found."
}

dotnet build Flow.Launcher.Plugin.ExtendedFlow

# Launch Flow Launcher by reversing the closeFlowLauncher.ps1 script
Start-Process -FilePath "C:\Users\lucie\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Flow Launcher\Flow Launcher.lnk"
