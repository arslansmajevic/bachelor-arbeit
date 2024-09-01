package project.data_exchange_project.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.data_exchange_project.rest.dto.patient.PatientDataDto;
import project.data_exchange_project.service.GraphDBService;

import java.lang.invoke.MethodHandles;
import java.util.List;

@RestController
@RequestMapping(value = "/data")
public class DataEndpoint {

  private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  private final GraphDBService graphDBService;

  public DataEndpoint(GraphDBService graphDBService) {
    this.graphDBService = graphDBService;
  }

  @GetMapping
  public List<PatientDataDto> test(@RequestParam("patientName") String patientName) {
    return graphDBService.getPatientData(patientName);
  }
}
