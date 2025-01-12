# Visualizing Semantic Healthcare Data
## Integrating FHIR and RDF for Graph-Based Exploration and Interaction

This repository is the project part of my bachelor thesis. 
Please refer to the corresponding folders for the documentation and source code of the different components. 

## Docker Compose
You start the whole application using the [```docker-compose.yml```](https://github.com/arslansmajevic/bachelor-arbeit/blob/main/docker-compose.yml) with the following command:

    docker compose up 
This starts the frontend Angular instance, the backend SpringBoot instance and also the GraphDB instance. 
```conf
http://localhost:7200 # graphdb
http://localhost:8080 # springboot
http://localhost:8080/api/v1/swagger-ui # springboot api
http://localhost # angular
```
IMPORTANT!
The GraphDB uses persistent storage in this case. A repository named ```graphdb-prod``` has to be initialized in the GraphDB instance so that the backend can retrieve these resources. To that end, the folder [```graphdb-data```](https://github.com/arslansmajevic/bachelor-arbeit/tree/main/graphdb-data) is used as persistent storage here! It already has this repository initialized with data imports that can be found in [graphdb-data/work/workbench/upload](https://github.com/arslansmajevic/bachelor-arbeit/tree/main/graphdb-data/work/workbench/upload). 
This is probabbly the simplest way to have a ready instance of GraphDB for the backend to use. Be careful how you change the repository, because it would also be have to changed in the backend instance in [```ProdGraphDBConfigGenerator.java```](https://github.com/arslansmajevic/bachelor-arbeit/blob/main/data-exchange-project/src/main/java/project/dataexchangeproject/datagenerator/ProdGraphDBConfigGenerator.java). 

If you want a clean GraphDB instance, then you can just delete the folder ```graphdb-data``` when pulled. When running compose again and a new instance will be created, a new clean ```graphdb-data``` folder. THIS FOLDER WILL NOT CONTAIN THE REPOSITORY NEEDED FROM THE BACKEND, so you have to create this manually! 

Also this configuration is only intended for local use. 

Don't forget to run when finished:
```docker compose down```
Also, if changes are made to code - you have to delete the old images, as docker compose relies heavily on caching and does not look for changes.
