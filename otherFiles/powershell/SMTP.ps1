Import-Module ServerManager 

Add-WindowsFeature SMTP-Server,Web-Mgmt-Console,WEB-WMI


stop-service smtpsvc

$Networkip =@()
$Networks = Get-WmiObject Win32_NetworkAdapterConfiguration -ComputerName localhost | ? {$_.IPEnabled}
foreach($Network in $Networks)  {  $Networkip = $Network.IpAddress[0]  }


$IpRelayList = @("127.0.0.1")

#adding relays
$iisObject = new-object System.DirectoryServices.DirectoryEntry("IIS://localhost/smtpsvc/1")
$relays = $iisObject.Properties["RelayIpList"].Value
$bindingFlags = [Reflection.BindingFlags] "Public, Instance, GetProperty"
$ipList = $relays.GetType().InvokeMember("IPGrant", $bindingFlags, $null, $relays, $null);


#if relay list is empty we are retrieving host subnets and adding to relay
$Networkip =@()
if($IpRelayList.Count -eq 0)
{
    $Networks = Get-WmiObject Win32_NetworkAdapterConfiguration -ComputerName localhost | ? {$_.IPEnabled}
    foreach($Network in $Networks)  
    {   
        $line = Get-NetworkAddress $Network.IpAddress[0] $Network.IpSubnet[0]
        $line = $line + ", " + $Network.IpSubnet[0]
        $Networkip += $line
    }
}

$ipList = $Networkip + $IpRelayList

# This is important, we need to pass an object array of one element containing our ipList array
[Object[]] $ipArray = @()
$ipArray += , $ipList

# Now update
$bindingFlags = [Reflection.BindingFlags] "Public, Instance, SetProperty"
$ipList = $relays.GetType().InvokeMember("IPGrant", $bindingFlags, $null, $relays, $ipArray);

$iisObject.Properties["RelayIpList"].Value = $relays

#Set max message size
$iisObject.MaxMessageSize = 10485760


$iisObject.CommitChanges()

start-service smtpsvc

Start-Sleep -Seconds 15

Send-MailMessage -From automation@kdi.kongsberg.com -To prashant.singh@kdi.kongsberg.com -Body "Test report attached" -Subject "Poseidon Next Test Report" -SmtpServer localhost -Attachments .\email.html
