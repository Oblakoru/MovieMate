package com.example.reviews.producer;

import com.example.reviews.vao.Review;
import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.jms.ConnectionFactory;
import jakarta.jms.JMSContext;
import jakarta.jms.Queue;

import io.vertx.core.json.JsonObject; // Make sure to import this

@ApplicationScoped
public class ReviewProducer {

    @Inject
    ConnectionFactory connectionFactory;

    public void sendReviewEvent(String action, Review review) {
        try (JMSContext context = connectionFactory.createContext(JMSContext.AUTO_ACKNOWLEDGE)) {
            Queue queue = context.createQueue("reviews");

            // Convert Review object to JSON
            JsonObject reviewMessage = new JsonObject()
                    .put("action", action)
                    .put("id", review.id)
                    .put("comment", review.comment)
                    .put("rating", review.rating)
                    .put("movieId", review.movieId)
                    .put("userId", review.userId);

            // Send the JSON message as a string
            context.createProducer().send(queue, reviewMessage.encode());
        }
    }
}