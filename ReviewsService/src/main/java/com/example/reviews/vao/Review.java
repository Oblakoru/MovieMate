package com.example.reviews.vao;

import jakarta.persistence.Cacheable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;

@Entity
@Cacheable
public class Review extends PanacheEntity {

    @Column(length = 255)
    public String comment;

    @Column(nullable = false)
    public int rating;

    @Column(nullable = false)
    public Long movieId;

    @Column(nullable = false)
    public Long userId;

}

