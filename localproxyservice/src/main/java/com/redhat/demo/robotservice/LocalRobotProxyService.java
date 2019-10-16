package com.redhat.demo.robotservice;

import java.net.URL;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.MediaType;

import com.redhat.demo.robotservice.model.Command;
import com.redhat.demo.robotservice.model.Cmd;
import com.redhat.demo.robotservice.rest.Listener;
import com.redhat.demo.robotservice.rest.RobotEndPoint;
import java.io.IOException;
import java.net.URI;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.eclipse.microprofile.rest.client.RestClientBuilder;

import io.quarkus.runtime.annotations.RegisterForReflection;

@Path("/command")
@RegisterForReflection
public class LocalRobotProxyService {

    
    static Map<String, String> robotNames = new ConcurrentHashMap<String, String>() {
        private static final long serialVersionUID = 1L;

        {
            put("DM_ROBOT", "http://192.168.0.11/rpc/Robot.Cmd");
put("DANCE_ROBOT", "http://192.168.0.10/rpc/Robot.Cmd");
put("OPENSHIFT", "http://192.168.0.12/rpc/Robot.Cmd");
put("BUILDAH", "http://192.168.0.13/rpc/Robot.Cmd");
put("PODMAN", "http://192.168.0.11/rpc/Robot.Cmd");
put("CRI-O", "http://192.168.0.10/rpc/Robot.Cmd");

        }
    };

    @POST
    //@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    public String hello(Command command) throws IOException {
        RobotEndPoint robotEndPoint = null;
        try {
        System.out.println(command.toString());
        String baseURL = robotNames.get(command.getRobotName());

        String commandToSend = String.format("{ \"cmd\" : \"%s;\" }", command.getCmdString());
        System.out.println("Using url:" + baseURL + " command: " + commandToSend);
        Cmd cmd = new Cmd();
        cmd.setCmd(commandToSend);
        URI apiUrl = new URI(baseURL);
   
        sendToRobot(baseURL, commandToSend);
        /*
        robotEndPoint = RestClientBuilder.newBuilder()
            .baseUri(apiUrl)
            .register(Listener.class)
            .connectTimeout(1000, TimeUnit.MILLISECONDS)
            .readTimeout(5000, TimeUnit.MILLISECONDS)
            .build(RobotEndPoint.class);
        
            
        robotEndPoint.sendCommand(cmd);
        */
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        finally {
            
            if (robotEndPoint != null) {
                try {
                    robotEndPoint.close();
                    System.out.println("Closed endpoint");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } 
        }
        return "";
    }

    
    public static void sendToRobot(String apiUrl, String cmd) throws IOException {
		System.out.println("Robot command: " + cmd);
		DefaultHttpClient httpClient = new DefaultHttpClient();
		HttpPost postRequest = new HttpPost(apiUrl);
		StringEntity params = new StringEntity(cmd);
		postRequest.addHeader("accept", "application/json");
		postRequest.addHeader("content-type", "application/json");
		postRequest.setEntity(params);

		HttpResponse response = httpClient.execute(postRequest);

		if (response.getStatusLine().getStatusCode() != 200) {
			throw new RuntimeException("Failed : HTTP error code : "
			   + response.getStatusLine().getStatusCode());
		}
	}
    
}