package com.example.reviews.vao;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

@Entity
public class Review extends PanacheEntity {
    @Column(name = "username")  // Rename the column to avoid the reserved keyword
    public String user;
    public String movie;
    public String content;
    public int rating;
}

