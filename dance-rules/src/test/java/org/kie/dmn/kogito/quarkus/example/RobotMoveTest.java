/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.kie.dmn.kogito.quarkus.example;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasEntry;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

@QuarkusTest
public class RobotMoveTest {
    
    @Test
    public void testSpinLeft() {
        given()
               .body("{\n" +
                     "    \"moveValue\": -300" +
                     "}")
               .contentType(ContentType.JSON)
          .when()
               .post("/RobotMove")
          .then()
             .statusCode(200)
               .body("'dmn-context'.'RobotMove'", is("spinleft"))
               .body("decision-results", hasItem(allOf(hasEntry("decision-name", "RobotMove"),
                                                       hasEntry("result", "spinleft"))));
    }
    @Test
    public void testOutOfRange() {
        given()
               .body("{\n" +
                     "    \"moveValue\": -800" +
                     "}")
               .contentType(ContentType.JSON)
          .when()
               .post("/RobotMove")
          .then()
             .statusCode(200)
               .body("decision-results", hasItem(allOf(hasEntry("decision-name", "RobotMove"),
                                                       hasEntry("result", null))));
    }
}
