package com.redhat.demo.robotservice.rest;

import java.io.IOException;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;

public class Listener implements ClientRequestFilter {

  @Override
  public void filter(ClientRequestContext requestContext) throws IOException {
    System.out.println("URI :" + requestContext.getUri());
      System.out.println("Headers : " + requestContext.getHeaders());
    System.out.println(requestContext.getMethod() + "," +
      requestContext.getAcceptableMediaTypes() + "," +
      requestContext.getConfiguration().getProperties() + "," 
  );
      
  }
  
}
