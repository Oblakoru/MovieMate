package com.example.reviews.dao;
import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import com.example.reviews.vao.Review;

import java.util.List;

@ApplicationScoped
public class ReviewRepository implements PanacheRepository<Review> {

    public Uni<Void> addReview (Review review) {
        return persist(review).replaceWithVoid();
    }

    public Uni<List<Review>> listAllReviews() {
        return findAll().list();
    }
}
