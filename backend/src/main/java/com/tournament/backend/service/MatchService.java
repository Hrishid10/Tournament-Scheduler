package com.tournament.backend.service;

import com.tournament.backend.dto.MatchResponse;
import com.tournament.backend.model.Match;
import com.tournament.backend.model.Team;
import com.tournament.backend.model.Tournament;
import com.tournament.backend.repository.MatchRepository;
import com.tournament.backend.repository.TeamRepository;
import com.tournament.backend.repository.TournamentRepository;
import com.tournament.backend.util.TournamentType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;
    private final SchedulerService schedulerService;

    public List<MatchResponse> generateSchedule(String tournamentId) {

        if (tournamentId == null || tournamentId.isBlank()) {
            throw new RuntimeException("Tournament ID is required");
        }

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        List<Team> teams = teamRepository.findByTournamentId(tournamentId);

        if (teams.size() < 4) {
            throw new RuntimeException("Minimum 4 teams required");
        }

        // delete old matches first
        matchRepository.deleteByTournamentId(tournamentId);

        List<Match> generated;

        if (tournament.getType() == TournamentType.ROUND_ROBIN) {
            generated = schedulerService.generateRoundRobin(tournamentId, teams);
        } else {
            generated = schedulerService.generateKnockout(tournamentId, teams);
        }

        matchRepository.saveAll(generated);

        return getMatches(tournamentId);
    }

    public List<MatchResponse> getMatches(String tournamentId) {

        if (tournamentId == null || tournamentId.isBlank()) {
            throw new RuntimeException("Tournament ID is required");
        }

        List<Team> teams = teamRepository.findByTournamentId(tournamentId);

        Map<String, String> teamMap = new HashMap<>();
        for (Team t : teams) {
            teamMap.put(t.getId(), t.getName());
        }

        // ✅ BYE support
        teamMap.put("BYE", "BYE");

        List<Match> matches = matchRepository.findByTournamentIdOrderByMatchNumberAsc(tournamentId);

        List<MatchResponse> response = new ArrayList<>();

        for (Match m : matches) {

            String teamAName = teamMap.getOrDefault(m.getTeamAId(), m.getTeamAId());
            String teamBName = teamMap.getOrDefault(m.getTeamBId(), m.getTeamBId());

            response.add(MatchResponse.builder()
                    .matchNumber(m.getMatchNumber())
                    .roundNumber(m.getRoundNumber())
                    .teamA(teamAName)
                    .teamB(teamBName)
                    .isBye(m.isBye())
                    .build());
        }

        return response;
    }
}
