package com.example.reviews.consumer;

import io.quarkus.logging.Log;
import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.jms.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@ApplicationScoped
public class ReviewConsumer implements Runnable {

    @Inject
    ConnectionFactory connectionFactory;

    private final ExecutorService scheduler = Executors.newSingleThreadExecutor();

    private volatile String lastReview;

    public String getLastReview() {
        return lastReview;
    }

    void onStart(@Observes StartupEvent ev) {
        scheduler.submit(this);
    }

    void onStop(@Observes ShutdownEvent ev) {
        scheduler.shutdown();
    }

    @Override
    public void run() {
        try (JMSContext context = connectionFactory.createContext(JMSContext.AUTO_ACKNOWLEDGE)) {
            JMSConsumer consumer = context.createConsumer(context.createQueue("reviews"));
            while (true) {
                Message message = consumer.receive();
                if (message == null) return;
                lastReview = message.getBody(String.class);
                Log.info("Received review event: %s".formatted(lastReview));
                try {
                    Thread.sleep(1000); // Add a 1-second delay
                } catch (InterruptedException e) {
                    Log.error("Thread interrupted: {}", e.getMessage(), e);
                }
            }
        } catch (JMSException e) {
            throw new RuntimeException(e);
        }
    }
}