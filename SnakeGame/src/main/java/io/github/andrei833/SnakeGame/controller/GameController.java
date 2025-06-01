package io.github.andrei833.SnakeGame.controller;

import io.github.andrei833.SnakeGame.model.GameSession;
import io.github.andrei833.SnakeGame.model.Move;
import io.github.andrei833.SnakeGame.model.User;
import io.github.andrei833.SnakeGame.repository.GameSessionRepository;
import io.github.andrei833.SnakeGame.repository.MoveRepository;
import io.github.andrei833.SnakeGame.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameSessionRepository gameSessionRepository;
    private final MoveRepository moveRepository;
    private final UserRepository userRepository;

    public GameController(GameSessionRepository gameSessionRepository, MoveRepository moveRepository, UserRepository userRepository) {
        this.gameSessionRepository = gameSessionRepository;
        this.moveRepository = moveRepository;
        this.userRepository = userRepository;
    }

    // DTO to receive moves from frontend
    public static class MoveDto {
        public int x;
        public int y;
        public Instant timestamp;
    }

    public static class GameDataDto {
        public Instant startedAt;
        public Instant endedAt;
        public List<MoveDto> moves;
    }

    @PostMapping("/save")
    public String saveGame(@AuthenticationPrincipal User user, @RequestBody GameDataDto gameData) {
        // Save GameSession
        GameSession session = GameSession.builder()
                .user(user)
                .startedAt(gameData.startedAt)
                .endedAt(gameData.endedAt)
                .build();
        gameSessionRepository.save(session);

        // Save moves with the session linked
        for (MoveDto moveDto : gameData.moves) {
            Move move = Move.builder()
                    .gameSession(session)
                    .x(moveDto.x)
                    .y(moveDto.y)
                    .timestamp(moveDto.timestamp)
                    .build();
            moveRepository.save(move);
        }

        return "Game saved successfully";
    }
}
