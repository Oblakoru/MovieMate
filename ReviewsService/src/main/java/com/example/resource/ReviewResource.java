package com.example.resource;

import com.example.model.Review;
import com.example.service.ReviewService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/reviews")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReviewResource {

    @Inject
    ReviewService reviewService;

    @GET
    public Uni<List<Review>> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GET
    @Path("/{id}")
    public Uni<Review> getReview(@PathParam("id") Long id) {
        return reviewService.getReviewById(id);
    }

    @POST
    public Uni<Void> addReview(Review review) {
        return reviewService.addReview(review);
    }

    @DELETE
    @Path("/{id}")
    public Uni<Void> deleteReview(@PathParam("id") Long id) {
        return reviewService.deleteReview(id);
    }
}
