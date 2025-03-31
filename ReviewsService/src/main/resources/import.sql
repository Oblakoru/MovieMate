
INSERT INTO review(id, comment, rating, movieId, userId) VALUES (1, 'Great movie!', 5, 101, 1001);
INSERT INTO review(id, comment, rating, movieId, userId) VALUES (2, 'Not bad', 3, 102, 1002);
INSERT INTO review(id, comment, rating, movieId, userId) VALUES (3, 'Terrible experience', 1, 103, 1003);
ALTER SEQUENCE review_seq RESTART WITH 4;
