package com.tournament.backend.service;

import com.tournament.backend.dto.CreateTournamentRequest;
import com.tournament.backend.model.Team;
import com.tournament.backend.model.Tournament;
import com.tournament.backend.repository.TeamRepository;
import com.tournament.backend.repository.TournamentRepository;
import com.tournament.backend.util.TournamentType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;

    public Tournament createTournament(CreateTournamentRequest request) {

        Tournament tournament = Tournament.builder()
                .name(request.getName())
                .type(request.getType())  
                .createdAt(LocalDateTime.now())
                .build();

        Tournament savedTournament = tournamentRepository.save(tournament);

        List<Team> teams = new ArrayList<>();
        for (String teamName : request.getTeams()) {
            teams.add(Team.builder()
                    .tournamentId(savedTournament.getId())
                    .name(teamName)
                    .build());
        }

        teamRepository.saveAll(teams);

        return savedTournament;
    }

    public Tournament getTournament(String id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
    }

    private TournamentType parseType(String type) {
        if (type == null) return TournamentType.ROUND_ROBIN;

        type = type.trim().toUpperCase().replace(" ", "_");
        if (type.equals("ROUNDROBIN")) type = "ROUND_ROBIN";

        return TournamentType.valueOf(type);
    }
}
