package com.example.messaging;

import com.example.model.Review;
import io.smallrye.mutiny.Uni;
import io.smallrye.reactive.messaging.Outgoing;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ReviewMessaging {

    @Outgoing("review-log")
    public Uni<String> logReview(Review review) {
        String message = "Review added: " + review.getUserId() + " rated " + review.getMovieId() + " as " + review.getRating();
        return Uni.createFrom().item(message);
    }
}
