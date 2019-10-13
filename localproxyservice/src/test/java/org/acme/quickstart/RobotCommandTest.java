package org.acme.quickstart;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class RobotCommandTest {

    //@Test
    public void testMockEndpoint() {
        given()
          .when().basePath("/rpc/Robot.Cmd")
          .body("{ \"cmd\": \"speedRight 50\"}")
          .post()
          .then()
             .statusCode(200)
             .body(is("OK"));
    }

    //@Test
    public void testLocalEndpoint() {
        given()
          .when().basePath("/command")
          .body("{ \"robotName\": \"TEST\", \"cmdString\": \"speedRight 50\"}")
          .post()
          .then()
             .statusCode(200);
    }

}