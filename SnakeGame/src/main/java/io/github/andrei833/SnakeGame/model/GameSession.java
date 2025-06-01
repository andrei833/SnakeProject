package io.github.andrei833.SnakeGame.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "game_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    private Instant startedAt;

    private Instant endedAt;

    // One-to-many moves in the game
    @OneToMany(mappedBy = "gameSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Move> moves;

    public long getDurationSeconds() {
        if (startedAt != null && endedAt != null) {
            return endedAt.getEpochSecond() - startedAt.getEpochSecond();
        }
        return 0;
    }
}
