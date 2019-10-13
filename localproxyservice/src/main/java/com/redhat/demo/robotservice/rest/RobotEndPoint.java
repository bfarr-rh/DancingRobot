package com.redhat.demo.robotservice.rest;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import com.redhat.demo.robotservice.model.Cmd;

import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.core.MediaType;

@RegisterRestClient
@RequestScoped
public interface RobotEndPoint extends AutoCloseable {
  
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @javax.ws.rs.Produces(MediaType.WILDCARD)
  public String sendCommand(Cmd cmd); 
}
