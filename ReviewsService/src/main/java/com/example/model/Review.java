package com.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String movieId;
    private int rating;
    private String comment;

    public Review() {}
    public Review(String userId, String movieId, int rating, String comment) {
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public String getMovieId() { return movieId; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
}
