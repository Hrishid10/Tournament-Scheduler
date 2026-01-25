package com.tournament.backend.repository;

import com.tournament.backend.model.Match;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MatchRepository extends MongoRepository<Match, String> {
    List<Match> findByTournamentIdOrderByMatchNumberAsc(String tournamentId);
    void deleteByTournamentId(String tournamentId);
}
