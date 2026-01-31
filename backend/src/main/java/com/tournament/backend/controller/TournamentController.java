package com.tournament.backend.controller;

import com.tournament.backend.dto.CreateTournamentRequest;
import com.tournament.backend.dto.TournamentResponse;
import com.tournament.backend.model.Tournament;
import com.tournament.backend.service.MatchService;
import com.tournament.backend.service.TournamentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;
    private final MatchService matchService;

    @PostMapping
    public Tournament createTournament(@Valid @RequestBody CreateTournamentRequest request) {
        return tournamentService.createTournament(request);
    }

    @GetMapping("/{id}")
    public TournamentResponse getTournament(@PathVariable String id) {
        return tournamentService.getTournamentWithDetails(id);
    }

    @PostMapping("/{id}/generate")
    public Object generateSchedule(@PathVariable String id) {
        return matchService.generateSchedule(id);
    }

    @GetMapping("/{id}/matches")
    public Object getMatches(@PathVariable String id) {
        return matchService.getMatches(id);
    }
}
