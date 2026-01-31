package com.tournament.backend.dto;

import com.tournament.backend.model.Team;
import com.tournament.backend.model.Match;
import com.tournament.backend.util.TournamentType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournamentResponse {

    private String id;
    private String name;
    private TournamentType type;
    private LocalDateTime createdAt;

    private List<Team> teams;      
    private List<Match> matches;   
}
