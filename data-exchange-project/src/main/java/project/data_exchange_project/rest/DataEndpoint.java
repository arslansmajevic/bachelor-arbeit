package project.data_exchange_project.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;
import project.data_exchange_project.rest.dto.node.ExpandingEdge;
import project.data_exchange_project.rest.dto.node.GraphNode;
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

  @PutMapping("expand-neighbour")
  public List<ExpandingEdge> expandNeighbouringNodes(@RequestBody GraphNode graphNode) {
    log.info("PUT /data/expand-neighbour {}", graphNode);
    return graphDBService.expandNeighbouringNodes(graphNode);
  }

  @PutMapping("expand-node")
  public List<ExpandingEdge> expandNode(@RequestBody GraphNode graphNode) {
    log.info("PUT /data/expand-node {}", graphNode);
    return graphDBService.expandNode(graphNode);
  }

  @GetMapping("autocomplete")
  public List<String> autoCompleteName(@RequestParam("keyword") String keyword, @Param("limit") Integer limit) {
    log.info("GET /data/autocomplete?keyword={}&limit={}", keyword, limit);
    return graphDBService.autoCompleteName(keyword, limit);
  }
}
