package project.data_exchange_project.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;
import project.data_exchange_project.exception.ErrorResponse;
import project.data_exchange_project.rest.dto.CustomQueryDto;
import project.data_exchange_project.rest.dto.SparqlResult;
import project.data_exchange_project.rest.dto.configs.SparqlQueryDto;
import project.data_exchange_project.rest.dto.node.ExpandingEdge;
import project.data_exchange_project.rest.dto.node.GraphNode;
import project.data_exchange_project.service.GraphDBService;
import project.data_exchange_project.service.UserService;

import java.lang.invoke.MethodHandles;
import java.util.List;

@RestController
@RequestMapping(value = "/data")
public class DataEndpoint {

  private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  private final GraphDBService graphDBService;
  private final UserService userService;

  public DataEndpoint(GraphDBService graphDBService, UserService userService) {
    this.graphDBService = graphDBService;
    this.userService = userService;
  }


  @PutMapping("expand-neighbour")
  @Operation(summary = "Expand neighbouring nodes",
          description = "Fetches the neighbouring nodes (other nodes that reference the graph node) for a given graph node. ")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Successfully retrieved the expanding edges"),
          @ApiResponse(responseCode = "503", description = "Database service is unavailable",
                  content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
          @ApiResponse(responseCode = "400", description = "Malformed query",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  })
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

  @PutMapping("perform-query")
  public SparqlResult customQuery(@RequestBody CustomQueryDto customQueryDto) {
    return graphDBService.performCustomQuery(customQueryDto);
  }

  @GetMapping("queries")
  public List<SparqlQueryDto> getSparqlQueries(@RequestParam(value = "id", required = false) Long id) {
    log.info("GET /data/queries/");
    return userService.getSparqlQueries(id);
  }

  @PutMapping("queries")
  public SparqlQueryDto updateSparqlQuery(@RequestBody SparqlQueryDto sparqlQueryDto) {
    log.info("PUT /data/queries/{}", sparqlQueryDto);
    return userService.updateSparqlQuery(sparqlQueryDto);
  }
}
