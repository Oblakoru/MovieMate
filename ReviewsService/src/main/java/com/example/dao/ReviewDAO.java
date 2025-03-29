package com.example.dao;

import com.example.model.Review;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

@ApplicationScoped
public class ReviewDAO {

    @PersistenceContext
    EntityManager entityManager;

    public List<Review> getAllReviews() {
        return entityManager.createQuery("SELECT r FROM Review r", Review.class).getResultList();
    }

    public Review getReviewById(Long id) {
        return entityManager.find(Review.class, id);
    }

    public void saveReview(Review review) {
        entityManager.persist(review);
    }

    public void deleteReview(Long id) {
        Review review = entityManager.find(Review.class, id);
        if (review != null) {
            entityManager.remove(review);
        }
    }
}
