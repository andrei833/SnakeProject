package io.github.andrei833.SnakeGame.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "moves")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Move {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to the game session
    @ManyToOne(optional = false)
    @JoinColumn(name = "game_session_id")
    private GameSession gameSession;

    private int x;
    private int y;

    private Instant timestamp;
}
