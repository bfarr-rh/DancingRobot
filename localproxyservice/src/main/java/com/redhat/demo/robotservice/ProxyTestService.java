package com.redhat.demo.robotservice;


import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.redhat.demo.robotservice.model.Cmd;



@Path("/rpc/Robot.Cmd") 
public class ProxyTestService {

    @POST
    //@Produces(MediaType.APPLICATION_JSON)
    //@Consumes(MediaType.APPLICATION_JSON)
    public String robotMockEndPoint(String a) {
        System.out.println("Received command :" + a);
        return "OK";
    }

}