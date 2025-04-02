package com.example.reviews.rest;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import com.example.reviews.test.TestResources;

@QuarkusTest
@QuarkusTestResource(TestResources.class)
public class ReviewResourceTest {

    @BeforeEach
    void setUp() {
        // Clear existing data and seed test data
        // First delete all existing reviews
        // (Note: We'll need to be careful here if REST endpoint for delete all doesn't exist)
        try {
            RestAssured.given()
                    .when()
                    .delete("/reviews")
                    .then();
        } catch (Exception e) {
            // Ignore if delete all endpoint doesn't exist
        }

        // Then create a new test review
        RestAssured.given()
                .contentType("application/json")
                .body("{\"comment\":\"Great movie!\",\"rating\":5,\"movieId\":101,\"userId\":1001}")
                .post("/reviews");
    }

    @Test
    void testGetReviewById() {
        RestAssured.given()
                .pathParam("id", 1)
                .when()
                .get("/reviews/{id}")
                .then()
                .statusCode(200);
    }

    @Test
    void testUpdateReview() {
        RestAssured.given()
                .pathParam("id", 1)
                .contentType("application/json")
                .body("{\"comment\":\"Updated comment\",\"rating\":4,\"movieId\":101,\"userId\":1001}")
                .when()
                .put("/reviews/{id}")
                .then()
                .statusCode(200);
    }

    @Test
    void testDeleteReview() {
        RestAssured.given()
                .pathParam("id", 1)
                .when()
                .delete("/reviews/{id}")
                .then()
                .statusCode(204);
    }
}