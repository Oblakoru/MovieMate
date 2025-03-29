package com.example.service;

import com.example.dao.ReviewDAO;
import com.example.model.Review;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ReviewService {

    @Inject
    ReviewDAO reviewDAO;

    public Uni<List<Review>> getAllReviews() {
        return Uni.createFrom().item(reviewDAO.getAllReviews());
    }

    public Uni<Review> getReviewById(Long id) {
        return Uni.createFrom().item(reviewDAO.getReviewById(id));
    }

    public Uni<Void> addReview(Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            return Uni.createFrom().failure(new IllegalArgumentException("Rating must be between 1 and 5"));
        }
        reviewDAO.saveReview(review);
        return Uni.createFrom().voidItem();
    }

    public Uni<Void> deleteReview(Long id) {
        reviewDAO.deleteReview(id);
        return Uni.createFrom().voidItem();
    }
}
