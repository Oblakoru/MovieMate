package com.example.reviews.rest;

import io.quarkus.hibernate.reactive.panache.Panache;
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
        review.id = null;
        return Panache.withTransaction(() -> review.persist())
                .replaceWith(Response.status(Response.Status.CREATED).build());
    }

    @GET
    public Uni<List<Review>> getAllReviews() {
        return reviewRepository.listAllReviews();
    }

    @GET
    @Path("/movie/{movieId}")
    public Uni<List<Review>> getReviewsByMovie(@PathParam("movieId") Long movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    @PUT
    @Path("/{id}")
    public Uni<Response> updateReview(@PathParam("id") Long id, Review updatedReview) {
        return Panache.withTransaction(() ->
                        reviewRepository.findById(id)
                                .onItem().ifNotNull().invoke(existingReview -> {
                                    existingReview.comment = updatedReview.comment;
                                    existingReview.rating = updatedReview.rating;
                                    existingReview.movieId = updatedReview.movieId;
                                    existingReview.userId = updatedReview.userId;
                                })
                ).onItem().ifNotNull().transform(ignore -> Response.ok().build())
                .onItem().ifNull().continueWith(Response.status(Response.Status.NOT_FOUND).build());
    }

    @DELETE
    @Path("/{id}")
    public Uni<Response> deleteReview(@PathParam("id") Long id) {
        return Panache.withTransaction(() ->
                reviewRepository.deleteById(id)
        ).map(deleted -> deleted ? Response.noContent().build() : Response.status(Response.Status.NOT_FOUND).build());
    }

    @GET
    @Path("/{id}")
    public Uni<Response> getReviewById(@PathParam("id") Long id) {
        return reviewRepository.findById(id)
                .onItem().ifNotNull().transform(review -> Response.ok(review).build())
                .onItem().ifNull().continueWith(Response.status(Response.Status.NOT_FOUND).build());
    }

}

