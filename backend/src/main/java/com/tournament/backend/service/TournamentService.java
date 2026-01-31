package com.tournament.backend.service;

import com.tournament.backend.dto.CreateTournamentRequest;
import com.tournament.backend.dto.MatchResponse;
import com.tournament.backend.dto.TournamentResponse;
import com.tournament.backend.model.Match;
import com.tournament.backend.model.Team;
import com.tournament.backend.model.Tournament;
import com.tournament.backend.repository.TeamRepository;
import com.tournament.backend.repository.TournamentRepository;
import com.tournament.backend.util.TournamentType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.tournament.backend.repository.MatchRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;

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

    public TournamentResponse getTournamentWithDetails(String id) {

        Tournament tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        List<Team> teams = teamRepository.findByTournamentId(id);
        List<Match> matches = matchRepository.findByTournamentIdOrderByMatchNumberAsc(id);

        Map<String, String> teamMap = teams.stream()
                .collect(Collectors.toMap(Team::getId, Team::getName));

        matches.forEach(match -> {
            List<MatchResponse> matchResponses = matches.stream()
                    .map(m -> MatchResponse.builder()
                            .matchNumber(m.getMatchNumber())
                            .roundNumber(m.getRoundNumber())
                            .teamA(teamMap.get(m.getTeamAId()))
                            .teamB(teamMap.get(m.getTeamBId()))
                            .isBye(m.isBye())
                            .build())
                    .toList();
        });

        return TournamentResponse.builder()
                .id(tournament.getId())
                .name(tournament.getName())
                .type(tournament.getType())
                .createdAt(tournament.getCreatedAt())
                .teams(teams)
                .matches(matches)
                .build();
    }

    private TournamentType parseType(String type) {
        if (type == null)
            return TournamentType.ROUND_ROBIN;

        type = type.trim().toUpperCase().replace(" ", "_");
        if (type.equals("ROUNDROBIN"))
            type = "ROUND_ROBIN";

        return TournamentType.valueOf(type);
    }
}
