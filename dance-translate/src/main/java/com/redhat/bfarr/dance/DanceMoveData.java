package com.redhat.bfarr.dance;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.camel.Headers;
import org.json.JSONArray;


public class DanceMoveData {
	Map<String, JSONArray> jsonArrayvalues = new ConcurrentHashMap<String, JSONArray>();
	Map<String, String> jsonValues = new ConcurrentHashMap<String, String>();
	
	public void setValue(String name, String content) {
		name = name.split("-")[0];
		jsonArrayvalues.put(name, new JSONArray(content));
		jsonValues.put(name, content);
		System.out.println("name: " + name);
		System.out.println("Set Value: " + content);
	}
	
	public String getMoves(String direction, @Headers Map<String,?> headers) {
		String result = jsonValues.get(direction);

		for (String key : headers.keySet()) {
			if (key.startsWith("P_")) {
				result = result.replaceAll(key, headers.get(key).toString());
			}
		}
		return result;
		
	}
	/*
	public String getMoves(String direction, String name, String speed, String turnSpeed, String delay) {
		String baseCommand = jsonValues.get(direction);
		return getCommand(baseCommand, name, speed, turnSpeed, delay);
	}
	*/
	
	private String getCommand(String baseCommands, String name, String speed, String turnSpeed, String delay) {
		String result = baseCommands.replaceAll("P_NAME", name)
				.replaceAll("P_SPEED", speed)
				.replaceAll("P_TURN_SPEED", turnSpeed)
				.replaceAll("P_DELAY", delay);

		return result;
	}
	
		
	
}
