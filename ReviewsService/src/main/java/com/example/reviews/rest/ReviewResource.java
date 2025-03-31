package com.example.reviews.rest;

import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import com.example.reviews.dao.ReviewRepository;
import com.example.reviews.vao.Review;

import java.util.List;

import static io.quarkus.hibernate.reactive.panache.PanacheEntityBase.persist;

@Path("/reviews")
public class ReviewResource {

    @Inject
    ReviewRepository reviewRepository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Uni<Void> addReview(Review review) {
        // Ensure the ID is null for new entities
        review.id = null;
        return persist(review).replaceWithVoid();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Uni<List<Review>> getAllReviews() {
        return reviewRepository.listAllReviews()
                .onItem().invoke(reviews -> {
                    System.out.println("Retrieved " + reviews.size() + " reviews from the database");
                    reviews.forEach(review -> System.out.println("Review: " + review.id + ", " + review.movie));
                });
    }
}