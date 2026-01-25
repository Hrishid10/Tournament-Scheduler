package com.tournament.backend.dto;

import com.tournament.backend.util.TournamentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTournamentRequest {

    @NotBlank(message = "Tournament name is required")
    private String name;

    @NotNull(message = "Tournament type is required")
    private TournamentType type;

    @NotNull
    @Size(min = 4, message = "Minimum 4 teams required")
    private List<@NotBlank String> teams;
}
