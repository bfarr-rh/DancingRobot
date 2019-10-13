# Local Proxy Service for Robots

This is a local proxy service which needs to run within the wifi network that the robots are using. The service needs to be able to expose an external API with accessible IP/DNS to OpenShift services.
It maps ROBOT names to local IP destinations. 

It takes JSON input as below:
http://10.0.0.10/command
{
    "robotName": "PODMAN",
    "cmdString": "speedRight 50"
}

and will pass this to the ROBOT api located within the local network to 
http://192.168.0.5/rpc/Robot.Cmd
{ "cmd" : "speedright 50" }

The service can be run in the quarkus:dev mode, java jar runner or native executable that can also be containerised.

Notes:
1. Testing locally there were some issues testing the service depending on the binding address and having the service call its mock test service with localhost did not work unless it was bound to certain ips. Need to investigate this issue.