package project.data_exchange_project.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;

@RestController
@RequestMapping(value = "/user")
public class UserEndpoint {

    private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());


}
