param 
( 
    [string]$buildId = "",
    [string]$buildNumber = "1.1",
    [string]$definitionName = "",
    [string]$teamFoundationCollectionUri = "",
    [string]$teamProject = "",
    [string]$appUnderTest = "",
    [string]$reportHost = ""
)

Set-Location "$PSScriptRoot\..\..\"

$path = ".\allure-results";

if (!(test-path $path)) {
    New-Item -ItemType Directory -Force -Path $path
}
if (!!(test-path "$path\executor.json")) {
    Remove-Item "$path\executor.json" -Force
}

#Getting the actual order of the build after removing the date part
$buildOrder = $buildNumber -replace "[^(\d+|.)]", "" #removing Non-numbers
$buildOrder = $buildOrder -replace (get-date).year, "" #removing year
$buildOrder = $buildOrder -replace "\.", "0" #replacing decimal(.)

#Getting the hostname of the report machine
$myHost = If ($reportHost.Length -gt 0) {$reportHost} Else {(Get-WmiObject win32_computersystem).DNSHostName}

#Creating the executor file in allure-results
Write-Output "{
    `"buildName`": `"BuildDef.:$definitionName Build#:$buildNumber`",
    `"buildOrder`": `"$buildOrder`",
    `"buildUrl`": `"$teamFoundationCollectionUri$teamProject/_build?buildId=$buildId`",
    `"name`": `"VSTS`",
    `"reportName`": `"AllureReport`",
    `"reportUrl`": `"http://$myHost`:8333/VSTS/$appUnderTest/$buildNumber`",
    `"type`": `"vsts`",
    `"url`": `"http://$myHost`:8333`"
    }" > $path\executor.json

Start-Sleep -s 5

#Copying history to allure-results
$sourceRoot = ".\allure-report\history"
if (test-path $sourceRoot) {
    if (!!(test-path "$path\history")) {
        Remove-Item "$path\history" -Force -Recurse
    }
    Copy-Item -Path $sourceRoot -Recurse -Destination $path -Container
}

#Creating allure report
$buildReport = "allure generate allure-results --clean"
Invoke-Expression $buildReport

#Copying videos to allure-reports
$vidSrc = ".\build-js\reports\videos"
$vidDst = ".\allure-report"
if (test-path $vidSrc) {
    Copy-Item -Path $vidSrc -Recurse -Destination $vidDst -Container
}

#Copying environment to allure-reports
$envSrc = ".\environment.json"
$envDst = ".\allure-report\widgets"
if (test-path $envSrc) {
    Copy-Item -Path $envSrc -Destination $envDst #-Container
}

#Copying custom allure files to allure-reports
$envSrc = ".\external-tools\allureSupplements\*"
$envDst = ".\allure-report"
if (test-path $envSrc) {
    Copy-Item -Path $envSrc -Destination $envDst -Force
}


