package io.github.andrei833.SnakeGame.repository;

import io.github.andrei833.SnakeGame.model.Move;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoveRepository extends JpaRepository<Move, Long> {}
