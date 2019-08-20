Set-Location "$PSScriptRoot\..\..\"

Write-Output "Installing modules from package.json :"

#Installing node modules
$moduleInstall = "npm install"
Invoke-Expression $moduleInstall

#Copying custom VideoReporter file into node_modules package
$vidRepSrc = ".\external-tools\nod_modUpdate\VideoReporter.js"
$vidRepDst = ".\node_modules\protractor-video-reporter\lib"
Copy-Item  -path $vidRepSrc -destination $vidRepDst -Force

#Installing webdrivers
Set-Location ".\node_modules\.bin"
Invoke-Expression ".\webdriver-manager update"
Invoke-Expression ".\webdriver-manager update --version.chrome=2.35" 
Invoke-Expression ".\webdriver-manager update --versions.gecko=v0.20.1" 
Invoke-Expression ".\webdriver-manager update --versions.standalone=3.11.0" 
Invoke-Expression ".\webdriver-manager update --ie32"