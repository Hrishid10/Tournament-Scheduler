package com.tournament.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "matches")
public class Match {

    @Id
    private String id;

    private String tournamentId;

    private int matchNumber;

    private int roundNumber;

    private String teamAId;
    private String teamBId;

    private boolean isBye;
}
