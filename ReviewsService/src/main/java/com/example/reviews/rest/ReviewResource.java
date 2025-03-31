package com.example.reviews.rest;

import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.example.reviews.dao.ReviewRepository;
import com.example.reviews.vao.Review;

import java.util.List;

@Path("/reviews")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ReviewResource {

    @Inject
    ReviewRepository reviewRepository;

    @POST
    public Uni<Response> addReview(Review review) {
        review.id = null; // Ensure the ID is null for new reviews
        return reviewRepository.persist(review)
                .onItem().invoke(() -> System.out.println("Review added: " + review.comment))
                .replaceWith(Response.status(Response.Status.CREATED).build());
    }

    @GET
    public Uni<List<Review>> getAllReviews() {
        return reviewRepository.listAllReviews()
                .onItem().invoke(reviews -> {
                    System.out.println("Retrieved " + reviews.size() + " reviews from the database");
                    reviews.forEach(review -> System.out.println("Review: " + review.id + ", Movie ID: " + review.movieId));
                });
    }

    @GET
    @Path("/movie/{movieId}")
    public Uni<List<Review>> getReviewsByMovie(@PathParam("movieId") Long movieId) {
        return reviewRepository.findByMovieId(movieId);
    }
}