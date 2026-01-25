package com.tournament.backend.service;

import com.tournament.backend.model.Match;
import com.tournament.backend.model.Team;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SchedulerService {

    public List<Match> generateRoundRobin(String tournamentId, List<Team> teams) {

        List<Team> teamList = new ArrayList<>(teams);

        boolean hasBye = false;
        if (teamList.size() % 2 != 0) {
            hasBye = true;
            teamList.add(Team.builder().id("BYE").name("BYE").tournamentId(tournamentId).build());
        }

        int n = teamList.size();
        int rounds = n - 1;
        int matchesPerRound = n / 2;

        List<Match> allMatches = new ArrayList<>();
        int matchNo = 1;

        for (int round = 1; round <= rounds; round++) {

            for (int i = 0; i < matchesPerRound; i++) {

                Team teamA = teamList.get(i);
                Team teamB = teamList.get(n - 1 - i);

                boolean isByeMatch = teamA.getId().equals("BYE") || teamB.getId().equals("BYE");

                allMatches.add(Match.builder()
                        .tournamentId(tournamentId)
                        .matchNumber(matchNo++)
                        .roundNumber(1) 
                        .teamAId(teamA.getId())
                        .teamBId(teamB.getId())
                        .isBye(isByeMatch)
                        .build());
            }

            List<Team> rotated = new ArrayList<>();
            rotated.add(teamList.get(0));
            rotated.add(teamList.get(n - 1));
            rotated.addAll(teamList.subList(1, n - 1));
            teamList = rotated;
        }

        if (hasBye) {
            allMatches.removeIf(Match::isBye);
        }

        return allMatches;
    }

    public List<Match> generateKnockout(String tournamentId, List<Team> teams) {

        List<Team> shuffled = new ArrayList<>(teams);
        Collections.shuffle(shuffled);

        List<Match> allMatches = new ArrayList<>();
        int matchNo = 1;
        int roundNo = 1;

        List<Team> current = new ArrayList<>(shuffled);

        while (current.size() > 1) {

            List<Team> winners = new ArrayList<>();

            for (int i = 0; i < current.size(); i += 2) {

                Team teamA = current.get(i);

                if (i + 1 >= current.size()) {
        
                    winners.add(teamA);

                    allMatches.add(Match.builder()
                            .tournamentId(tournamentId)
                            .matchNumber(matchNo++)
                            .roundNumber(roundNo)
                            .teamAId(teamA.getId())
                            .teamBId("BYE")
                            .isBye(true)
                            .build());
                    continue;
                }

                Team teamB = current.get(i + 1);

                winners.add(teamA);

                allMatches.add(Match.builder()
                        .tournamentId(tournamentId)
                        .matchNumber(matchNo++)
                        .roundNumber(roundNo)
                        .teamAId(teamA.getId())
                        .teamBId(teamB.getId())
                        .isBye(false)
                        .build());
            }

            current = winners;
            roundNo++;
        }

        return allMatches;
    }
}
