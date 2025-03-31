package com.example.reviews.dao;

import com.example.reviews.vao.Review;
import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ReviewRepository implements PanacheRepository<Review> {

    public Uni<List<Review>> listAllReviews() {
        return listAll();
    }

    public Uni<List<Review>> findByMovieId(Long movieId) {
        return list("movieId", movieId);
    }
}
