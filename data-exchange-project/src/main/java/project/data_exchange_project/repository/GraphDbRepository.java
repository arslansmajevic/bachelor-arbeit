package project.data_exchange_project.repository;

import org.eclipse.rdf4j.query.BindingSet;
import org.eclipse.rdf4j.query.TupleQueryResult;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.sparql.SPARQLRepository;
import org.eclipse.rdf4j.sparqlbuilder.constraint.Expression;
import org.eclipse.rdf4j.sparqlbuilder.constraint.Expressions;
import org.eclipse.rdf4j.sparqlbuilder.constraint.SparqlFunction;
import org.eclipse.rdf4j.sparqlbuilder.core.Prefix;
import org.eclipse.rdf4j.sparqlbuilder.core.SparqlBuilder;
import org.eclipse.rdf4j.sparqlbuilder.core.Variable;
import org.eclipse.rdf4j.sparqlbuilder.core.query.Queries;
import org.eclipse.rdf4j.sparqlbuilder.core.query.SelectQuery;
import org.eclipse.rdf4j.sparqlbuilder.graphpattern.TriplePattern;
import org.eclipse.rdf4j.sparqlbuilder.rdf.Rdf;
import org.eclipse.rdf4j.sparqlbuilder.rdf.RdfLiteral;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import project.data_exchange_project.rest.dto.node.ExpandingEdge;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Repository
public class GraphDbRepository {

  @Autowired
  private SPARQLRepository sparqlRepository;

  Prefix fhir = SparqlBuilder.prefix("fhir", Rdf.iri("http://hl7.org/fhir/"));

  public List<ExpandingEdge> expandNeighbouringNodes(String nodeUri) {
    Variable object = SparqlBuilder.var("object");
    Variable objectType = SparqlBuilder.var("object_type");
    Variable connection = SparqlBuilder.var("connection");
    Variable referenceObject = SparqlBuilder.var("referenceObject");

    /*SelectQuery selectQuery = Queries.SELECT(object, objectType, connection)
            .prefix(fhir)
            .distinct()
            .where(
                    object.isA(objectType),
                    object.has(connection, referenceObject),
                    referenceObject.has(fhir.iri("reference"), Rdf.iri(nodeUri))
            );*/

    SelectQuery selectQuery = Queries.SELECT(object, objectType, connection)
            .where(
                    object.has(connection, Rdf.iri(nodeUri))
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
        results.add("Object: " + bindingSet.getValue("object") +
                ", Object Type: " + bindingSet.getValue("object_type") +
                ", Connection: " + bindingSet.getValue("connection"));

        if (!bindingSet.getValue("object").stringValue().contains("http")) {
          if (oneTime++ == 0) {
            listOfExpandingEdges.addAll(upstreamRecursiveNodeExpansion(nodeUri, 1));
          }
        } else {
          listOfExpandingEdges.add(
                  new ExpandingEdge(
                          bindingSet.getValue("object").stringValue(),
                          nodeUri,
                          bindingSet.getValue("connection").stringValue().concat(".reference")
                  )
          );
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return listOfExpandingEdges;
  }

  public List<ExpandingEdge> expandNode(String nodeUri) {

    Variable object = SparqlBuilder.var("object");
    Variable connection = SparqlBuilder.var("connection");

    System.out.println("nodeUri " + nodeUri);
    SelectQuery selectQuery = Queries.SELECT(object, connection)
            .prefix(fhir)
            .where(
                    Rdf.iri(nodeUri).has(connection, object)
            );

    String sparqlQueryString = selectQuery.getQueryString();

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

        // skipping some predicates
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

        // if blank node, then perform recursion
        if (objectValue.startsWith("node") && oneTime++ == 1) {
          listOfExpandingEdges.addAll(downstreamRecursiveNodeExpansion(nodeUri, 1));
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    // Output the results (you can adapt this to return or process differently)
    results.forEach(System.out::println);

    return listOfExpandingEdges;
  }

  private List<ExpandingEdge> downstreamRecursiveNodeExpansion(String subject, int level) {
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

        System.out.println(listOfExpandingEdges);

        if (objectValue.startsWith("node") && oneTime++ == 0) {
          System.out.println("expanding on blank node: " + objectValue);
          listOfExpandingEdges.addAll(downstreamRecursiveNodeExpansion(subject, level+1));
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return listOfExpandingEdges;
  }

  private List<ExpandingEdge> upstreamRecursiveNodeExpansion(String subject, int level) {

    List<TriplePattern> wherePatterns = new ArrayList<>();
    Variable currentSubject = SparqlBuilder.var("s1"); // Initialize with o1 (after ?subject)

    // The first triple pattern
    Variable p = SparqlBuilder.var("p");
    Variable s1 = SparqlBuilder.var("s1");
    // wherePatterns.add(Rdf.iri(subject).has(p, o1));
    wherePatterns.add(s1.has(p, Rdf.iri(subject)));

    // Iteratively create the rest of the triple patterns based on the level
    for (int i = 1; i <= level; i++) {
      Variable nextP = SparqlBuilder.var("p" + i);
      Variable nextS = SparqlBuilder.var("s" + (i + 1));

      wherePatterns.add(nextS.has(nextP, currentSubject));
      currentSubject = nextS;
    }

    // Create the SELECT query with all variable projections
    SelectQuery selectQuery = Queries.SELECT();
    for (int i = 1; i <= level; i++) {
      selectQuery.select(SparqlBuilder.var("p" + i), SparqlBuilder.var("s" + i));
    }
    selectQuery.select(SparqlBuilder.var("s" + (level+1)));

    selectQuery.prefix(fhir)
            .where(wherePatterns.toArray(new TriplePattern[0]));

    String sparqlQueryString = selectQuery.getQueryString();
    List<ExpandingEdge> listOfExpandingEdges = new ArrayList<>();

    int oneTime = 0;

    try (RepositoryConnection repoConnection = sparqlRepository.getConnection()) {
      TupleQueryResult result = repoConnection.prepareTupleQuery(sparqlQueryString).evaluate();

      while (result.hasNext()) {
        BindingSet bindingSet = result.next();

        String objectAsSubject = bindingSet.getValue("s" + level).stringValue();
        String predicate = bindingSet.getValue("p" + level).stringValue();
        String subjectAsSubject = bindingSet.getValue("s" + (level+1)).stringValue();

        if (!Objects.equals(predicate, "")) {
          if (subjectAsSubject.contains("http")) {
            listOfExpandingEdges.add(
                    new ExpandingEdge(
                            subject,
                            subjectAsSubject,
                            predicate + ".reference"
                    )
            );
          } else {
            if (oneTime++ == 0) {
              listOfExpandingEdges.addAll(upstreamRecursiveNodeExpansion(subject, level+1));
            }
          }
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return listOfExpandingEdges;

  }

  public List<String> autocompleteInstances(String keyword, Integer limit) {

    // Define variables
    Variable s = SparqlBuilder.var("s");

    // Define triple pattern
    TriplePattern pattern = s.has(SparqlBuilder.var("p"), SparqlBuilder.var("o"));

    // Define filter with case-insensitive check for "patient"
    RdfLiteral<String> keywordLiteral = Rdf.literalOf(keyword);
    Expression<?> caseInsensitiveFilter = Expressions.function(
            SparqlFunction.valueOf("CONTAINS"),
            Expressions.function(SparqlFunction.valueOf("UCASE"), Expressions.function(SparqlFunction.valueOf("STR"), s)),
            Expressions.function(SparqlFunction.valueOf("UCASE"), keywordLiteral)
    );

    // Build the query
    SelectQuery query = Queries.SELECT().distinct()
            .where(pattern.filter(caseInsensitiveFilter))
            .limit(limit);

    String sparqlQueryString = query.getQueryString();

    List<String> resultList = new ArrayList<>();

    // Execute the query and process the result
    try (RepositoryConnection repoConnection = sparqlRepository.getConnection()) {
      TupleQueryResult result = repoConnection.prepareTupleQuery(sparqlQueryString).evaluate();

      while (result.hasNext()) {
        BindingSet bindingSet = result.next();
        resultList.add(bindingSet.getValue("s").stringValue());
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    // Return the list of matching instances
    return resultList;
  }
}
