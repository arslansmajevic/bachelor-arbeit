package project.data_exchange_project.repository;

import org.eclipse.rdf4j.query.BindingSet;
import org.eclipse.rdf4j.query.TupleQueryResult;
import org.eclipse.rdf4j.repository.sparql.SPARQLRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class GraphDbRepository {

  @Autowired
  private SPARQLRepository sparqlRepository;

  public void executeSparqlQuery() {
    String sparqlQueryString = "SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10";

    try (TupleQueryResult result = sparqlRepository.getConnection().prepareTupleQuery(sparqlQueryString).evaluate()) {
      while (result.hasNext()) {
        BindingSet bindingSet = result.next();
        System.out.println("Subject: " + bindingSet.getValue("s"));
        System.out.println("Predicate: " + bindingSet.getValue("p"));
        System.out.println("Object: " + bindingSet.getValue("o"));
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public List<String> getMoviesForHuman1() {
    String sparqlQueryString = "PREFIX voc: <https://swapi.co/vocabulary/> " +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
            "SELECT ?movieName WHERE { " +
            "<https://swapi.co/resource/human/1> voc:film ?movie . " +
            "?movie rdfs:label ?movieName . }";

    List<String> movies = new ArrayList<>();

    try (TupleQueryResult result = sparqlRepository.getConnection().prepareTupleQuery(sparqlQueryString).evaluate()) {
      while (result.hasNext()) {
        BindingSet bindingSet = result.next();
        String movieName = bindingSet.getValue("movieName").stringValue();
        movies.add(movieName);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return movies;
  }
}
