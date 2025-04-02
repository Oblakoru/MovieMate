package com.example.reviews.test;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import org.testcontainers.containers.PostgreSQLContainer;

import java.util.HashMap;
import java.util.Map;

import org.testcontainers.containers.GenericContainer;
import org.testcontainers.utility.DockerImageName;

public class TestResources implements QuarkusTestResourceLifecycleManager {
    private static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:14")
            .withDatabaseName("MovieMate")
            .withUsername("postgres")
            .withPassword("root");

    private static final GenericContainer<?> ACTIVEMQ = new GenericContainer<>(
            DockerImageName.parse("apache/activemq-artemis:latest"))
            .withExposedPorts(61616)
            .withEnv("ARTEMIS_USER", "artemis")
            .withEnv("ARTEMIS_PASSWORD", "simetraehcapa");

    @Override
    public Map<String, String> start() {
        POSTGRES.start();
        ACTIVEMQ.start();

        Map<String, String> config = new HashMap<>();

        // PostgreSQL Configuration
        config.put("quarkus.datasource.reactive.url", "postgresql://" + POSTGRES.getHost() + ":" + POSTGRES.getFirstMappedPort() + "/MovieMate");
        config.put("quarkus.datasource.username", POSTGRES.getUsername());
        config.put("quarkus.datasource.password", POSTGRES.getPassword());
        config.put("quarkus.hibernate-orm.database.generation", "update");

        // ActiveMQ Configuration
        String activeMqUrl = "tcp://" + ACTIVEMQ.getHost() + ":" + ACTIVEMQ.getMappedPort(61616);
        config.put("quarkus.artemis.url", activeMqUrl);
        config.put("quarkus.artemis.username", "artemis");
        config.put("quarkus.artemis.password", "simetraehcapa");

        return config;
    }

    @Override
    public void stop() {
        if (POSTGRES != null && POSTGRES.isRunning()) {
            POSTGRES.stop();
        }
        if (ACTIVEMQ != null && ACTIVEMQ.isRunning()) {
            ACTIVEMQ.stop();
        }
    }
}