package project.data_exchange_project.service;

import project.data_exchange_project.rest.dto.patient.PatientDataDto;

import java.util.List;

public interface GraphDBService {

  List<PatientDataDto> getPatientData(String patientName);
}
