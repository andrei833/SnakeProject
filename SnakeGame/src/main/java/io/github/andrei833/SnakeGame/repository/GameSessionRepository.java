package io.github.andrei833.SnakeGame.repository;

import io.github.andrei833.SnakeGame.model.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {}
