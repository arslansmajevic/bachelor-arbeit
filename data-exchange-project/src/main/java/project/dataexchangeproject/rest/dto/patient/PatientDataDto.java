package project.dataexchangeproject.rest.dto.patient;

import java.time.LocalDate;

public record PatientDataDto(
        String patientIdentifier,
        String givenNames,
        String familyName,
        String gender,
        LocalDate dateOfBirth
) {
}
