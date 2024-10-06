package project.data_exchange_project.repository;

import org.eclipse.rdf4j.query.BindingSet;
import org.eclipse.rdf4j.query.TupleQueryResult;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.sparql.SPARQLRepository;
import org.eclipse.rdf4j.sparqlbuilder.core.Prefix;
import org.eclipse.rdf4j.sparqlbuilder.core.SparqlBuilder;
import org.eclipse.rdf4j.sparqlbuilder.core.Variable;
import org.eclipse.rdf4j.sparqlbuilder.core.query.Queries;
import org.eclipse.rdf4j.sparqlbuilder.core.query.SelectQuery;
import org.eclipse.rdf4j.sparqlbuilder.graphpattern.TriplePattern;
import org.eclipse.rdf4j.sparqlbuilder.rdf.Rdf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import project.data_exchange_project.rest.dto.node.ExpandingEdge;
import project.data_exchange_project.rest.dto.patient.PatientDataDto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class GraphDbRepository {

  @Autowired
  private SPARQLRepository sparqlRepository;

  Prefix fhir = SparqlBuilder.prefix("fhir", Rdf.iri("http://hl7.org/fhir/"));

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

  public List<ExpandingEdge> expandNeighbouringNodes(String nodeUri) {
    Variable object = SparqlBuilder.var("object");
    Variable objectType = SparqlBuilder.var("object_type");
    Variable connection = SparqlBuilder.var("connection");
    Variable referenceObject = SparqlBuilder.var("referenceObject");

    SelectQuery selectQuery = Queries.SELECT(object, objectType, connection)
            .prefix(fhir)
            .distinct()
            .where(
                    object.has(fhir.iri("nodeRole"), fhir.iri("treeRoot")),
                    object.isA(objectType),
                    object.has(connection, referenceObject),
                    referenceObject.has(fhir.iri("reference"), Rdf.iri(nodeUri))
            );

    String sparqlQueryString = selectQuery.getQueryString();
    System.out.println("SPARQL Query: " + sparqlQueryString);

    List<ExpandingEdge> listOfExpandingEdges = new ArrayList<>();

    // Execute the query and process the result
    List<String> results = new ArrayList<>();
    try (RepositoryConnection repoConnection = sparqlRepository.getConnection()) {
      TupleQueryResult result = repoConnection.prepareTupleQuery(sparqlQueryString).evaluate();

      while (result.hasNext()) {
        BindingSet bindingSet = result.next();
        results.add("Object: " + bindingSet.getValue("object") +
                ", Object Type: " + bindingSet.getValue("object_type") +
                ", Connection: " + bindingSet.getValue("connection"));

        listOfExpandingEdges.add(
                new ExpandingEdge(
                        bindingSet.getValue("object").stringValue(),
                        nodeUri,
                        bindingSet.getValue("connection").stringValue().concat(".reference")
                )
        );
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    // Output the results (you can adapt this to return or process differently)
    results.forEach(System.out::println);

    return listOfExpandingEdges;
  }

  public List<ExpandingEdge> expandNode(String nodeUri) {

    Variable object = SparqlBuilder.var("object");
    Variable connection = SparqlBuilder.var("connection");

    SelectQuery selectQuery = Queries.SELECT(object, connection)
            .prefix(fhir)
            .where(
                    Rdf.iri(nodeUri).has(connection, object)
            );

    String sparqlQueryString = selectQuery.getQueryString();
    System.out.println("SPARQL Query: " + sparqlQueryString);

    List<ExpandingEdge> listOfExpandingEdges = new ArrayList<>();

    int oneTime = 0;

    // Execute the query and process the result
    List<String> results = new ArrayList<>();
    try (RepositoryConnection repoConnection = sparqlRepository.getConnection()) {
      TupleQueryResult result = repoConnection.prepareTupleQuery(sparqlQueryString).evaluate();

      while (result.hasNext()) {
        BindingSet bindingSet = result.next();
        results.add("Predicate: " + bindingSet.getValue("connection") +
                ", Object: " + bindingSet.getValue("object"));

        String predicateValue = bindingSet.getValue("connection").stringValue();
        String objectValue = bindingSet.getValue("object").stringValue();
        // Skip predicates you want to ignore
        if (!(predicateValue.contains("rdf-syntax-ns#type") ||
                predicateValue.contains("fhir/nodeRole"))) {
            listOfExpandingEdges.add(
                  new ExpandingEdge(
                          nodeUri,
                          objectValue,
                          predicateValue
                  )
          );
        }

        if (objectValue.startsWith("node") && oneTime++ == 1) {
          System.out.println("expanding on blank node: " + objectValue);
          listOfExpandingEdges.addAll(recursiveExpandOnNodes(nodeUri, 1));
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    // Output the results (you can adapt this to return or process differently)
    results.forEach(System.out::println);

    return listOfExpandingEdges;
  }

  private List<ExpandingEdge> recursiveExpandOnNodes(String subject, int level) {
    List<TriplePattern> wherePatterns = new ArrayList<>();
    Variable currentSubject = SparqlBuilder.var("o1"); // Initialize with o1 (after ?subject)

    // The first triple pattern
    Variable p = SparqlBuilder.var("p");
    Variable o1 = SparqlBuilder.var("o1");
    wherePatterns.add(Rdf.iri(subject).has(p, o1));

    // Iteratively create the rest of the triple patterns based on the level
    for (int i = 1; i <= level; i++) {
      Variable nextP = SparqlBuilder.var("p" + i);
      Variable nextO = SparqlBuilder.var("o" + (i + 1));
      wherePatterns.add(currentSubject.has(nextP, nextO));
      currentSubject = nextO;  // Update current subject to next object
    }

    // Create the SELECT query with all variable projections
    SelectQuery selectQuery = Queries.SELECT();
    for (int i = 1; i <= level; i++) {
      selectQuery.select(SparqlBuilder.var("p" + i), SparqlBuilder.var("o" + i));
    }
    selectQuery.select(SparqlBuilder.var("o" + (level+1)));

    selectQuery.prefix(fhir)
            .where(wherePatterns.toArray(new TriplePattern[0]));

    System.out.println("query for expansion of blank node: ");
    System.out.println(selectQuery.getQueryString());

    String sparqlQueryString = selectQuery.getQueryString();
    List<ExpandingEdge> listOfExpandingEdges = new ArrayList<>();

    int oneTime = 0;

    try (RepositoryConnection repoConnection = sparqlRepository.getConnection()) {
      TupleQueryResult result = repoConnection.prepareTupleQuery(sparqlQueryString).evaluate();

      while (result.hasNext()) {
        BindingSet bindingSet = result.next();

        String subjectBlankNode = bindingSet.getValue("o" + level).stringValue();
        String predicate = bindingSet.getValue("p" + level).stringValue();
        String objectValue = bindingSet.getValue("o" + (level+1)).stringValue();

        if (!(predicate.contains("rdf-syntax-ns#type") ||
                predicate.contains("fhir/nodeRole"))) {
          listOfExpandingEdges.add(
                  new ExpandingEdge(
                          subjectBlankNode,
                          objectValue,
                          predicate
                  )
          );
        }

        if (objectValue.startsWith("node") && oneTime++ == 0) {
          System.out.println("expanding on blank node: " + objectValue);
          listOfExpandingEdges.addAll(recursiveExpandOnNodes(subject, level+1));
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    for (ExpandingEdge e : listOfExpandingEdges) {
      System.out.println("source: " + e.source() + " | target: " + e.target() + " | label: " + e.label());
    }

    return listOfExpandingEdges;
  }
}
