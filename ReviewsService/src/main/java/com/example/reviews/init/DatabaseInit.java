package com.example.reviews.init;

import io.quarkus.runtime.Startup;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;

import com.example.reviews.vao.Review;

@Startup
@ApplicationScoped
public class DatabaseInit {

    @PostConstruct
    void init() {
        Review.count()
                .onItem().invoke(count -> {
                    if (count == 0) {
                        System.out.println("No reviews found. Inserting sample data...");
                        insertInitialData();
                    } else {
                        System.out.println("Database already initialized with " + count + " reviews.");
                    }
                })
                .subscribe().with(
                        success -> {},
                        failure -> System.err.println("Failed to check DB state: " + failure.getMessage())
                );
    }

    private void insertInitialData() {
        Review r1 = new Review();
        r1.comment = "Great movie!";
        r1.rating = 5;
        r1.movieId = 101L;
        r1.userId = 1001L;

        Review r2 = new Review();
        r2.comment = "Not bad";
        r2.rating = 3;
        r2.movieId = 102L;
        r2.userId = 1002L;

        Review r3 = new Review();
        r3.comment = "Terrible experience";
        r3.rating = 1;
        r3.movieId = 103L;
        r3.userId = 1003L;

        Uni.combine().all().unis(
                r1.persist(), r2.persist(), r3.persist()
        ).with((res1, res2, res3) -> {
            System.out.println("Initial reviews inserted.");
            return null;
        }).subscribe().with(
                success -> {},
                failure -> System.err.println("Failed to insert sample reviews: " + failure.getMessage())
        );
    }

}
