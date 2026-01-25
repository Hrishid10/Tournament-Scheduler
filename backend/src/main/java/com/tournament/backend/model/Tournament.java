package com.tournament.backend.model;

import com.tournament.backend.util.TournamentType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "tournaments")
public class Tournament {

    @Id
    private String id;

    private String name;

    private TournamentType type;

    private LocalDateTime createdAt;
}
