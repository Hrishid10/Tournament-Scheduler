package com.tournament.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResponse {

    private int matchNumber;
    private int roundNumber;

    private String teamA;
    private String teamB;

    private boolean isBye;
}
