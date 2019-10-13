package com.redhat.demo.robotservice.model;

public class Command {
	private String robotName;
	private String cmdString;
	
	public String getRobotName() {
		return robotName;
	}
	public void setRobotName(String robotName) {
		this.robotName = robotName;
	}

	public String getCmdString() {
		return cmdString;
	}
	public void setCmdString(String cmdString) {
		this.cmdString = cmdString;
	}

	@Override
	public String toString() {
		return "Command [CmdString=" + cmdString + ", robotName=" + robotName + "]";
	}

	
}
