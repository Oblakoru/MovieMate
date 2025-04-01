package com.example.reviews.rest;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.BeforeEach;
import io.restassured.RestAssured;

@QuarkusTest
public class ReviewResourceTest {

    @BeforeEach
    void setUp() {
        // Make sure the DB is clean or has the required data
        // Assuming you have a way to clear DB or seed necessary data
        RestAssured.given()
                .contentType("application/json")
                .body("{\"comment\":\"Great movie!\",\"rating\":5,\"movieId\":101,\"userId\":1001}")
                .post("/reviews");
    }

    @Test
    void testGetReviewById() {
        // Now you can test GET /reviews/{id}
        RestAssured.given()
                .pathParam("id", 1)
                .when()
                .get("/reviews/{id}")
                .then()
                .statusCode(200); // Should return 200 if review exists
    }

    @Test
    void testUpdateReview() {
        // Test the PUT /reviews/{id}
        RestAssured.given()
                .pathParam("id", 1)
                .contentType("application/json")
                .body("{\"comment\":\"Updated comment\",\"rating\":4,\"movieId\":101,\"userId\":1001}")
                .when()
                .put("/reviews/{id}")
                .then()
                .statusCode(200); // Should return 200 after successful update
    }

    @Test
    void testDeleteReview() {
        // Test DELETE /reviews/{id}
        RestAssured.given()
                .pathParam("id", 1)
                .when()
                .delete("/reviews/{id}")
                .then()
                .statusCode(204); // Should return 204 if deletion is successful
    }
}
