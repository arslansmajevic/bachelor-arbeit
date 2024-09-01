package project.data_exchange_project.repository;

import org.eclipse.rdf4j.query.BindingSet;
import org.eclipse.rdf4j.query.TupleQueryResult;
import org.eclipse.rdf4j.repository.sparql.SPARQLRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import project.data_exchange_project.rest.dto.patient.PatientDataDto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class GraphDbRepository {

  @Autowired
  private SPARQLRepository sparqlRepository;

  public List<PatientDataDto> getPatientInformation() {
    String sparqlListAllPatients = "PREFIX fhir: <http://hl7.org/fhir/>\n" +
            "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "PREFIX : <http://example.org/fhir/Patient/>\n" +
            "\n" +
            "SELECT ?patient ?system ?value ?use (GROUP_CONCAT(?givenName; separator=\" \") AS ?givenNames) ?family ?gender ?birthDate\n" +
            "WHERE {\n" +
            "  ?patient a fhir:Patient ; # match any RDF Resource that is of type fhir:Patient\n" +
            "           fhir:Patient.identifier ?identifier ;\n" +
            "           fhir:Patient.name ?name ;\n" +
            "           fhir:Patient.gender ?gender ;\n" +
            "           fhir:Patient.birthDate ?birthDate .\n" +
            "  \n" +
            "  ?identifier fhir:system ?system ;\n" +
            "              fhir:value ?value .\n" +
            "  \n" +
            "  ?name fhir:use ?use ;\n" +
            "        fhir:family ?family ;\n" +
            "        fhir:given ?givenName .\n" +
            "}\n" +
            "GROUP BY ?patient ?identifier ?system ?value ?use ?family ?gender ?birthDate";

    List<PatientDataDto> patientDataDtos = new ArrayList<>();

    try (TupleQueryResult result = sparqlRepository.getConnection().prepareTupleQuery(sparqlListAllPatients).evaluate()) {
      while (result.hasNext()) {
        BindingSet bindingSet = result.next();

        PatientDataDto resultPatient = new PatientDataDto(
                bindingSet.getValue("patient").stringValue(),
                bindingSet.getValue("givenNames").stringValue(),
                bindingSet.getValue("family").stringValue(),
                bindingSet.getValue("gender").stringValue(),
                LocalDate.now()
        );

        patientDataDtos.add(resultPatient);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return patientDataDtos;
  }
}
