package com.tournament.backend.repository;

import com.tournament.backend.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TeamRepository extends MongoRepository<Team, String> {
    List<Team> findByTournamentId(String tournamentId);
}
