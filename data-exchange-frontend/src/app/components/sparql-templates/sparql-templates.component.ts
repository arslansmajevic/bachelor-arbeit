import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {SelectMoreInstancesComponent} from "../templates/select-more-instances/select-more-instances.component";
import {SparqlEndpointComponent} from "../templates/sparql-endpoint/sparql-endpoint.component";

@Component({
  selector: 'app-sparql-templates',
  templateUrl: './sparql-templates.component.html',
  styleUrl: './sparql-templates.component.css'
})
export class SparqlTemplatesComponent {

  openSidenav = false;

  cards = [
    { title: 'Select multiple instances', description: 'Use this template to select multiple instances from the database and show them all at once on a graph.', component: SelectMoreInstancesComponent },
    { title: 'SPARQL Endpoint', description: 'Use this template to write custom SPARQL queries. Results are shown in tabular form.', component: SparqlEndpointComponent }
  ];

  @ViewChild('drawerContent', { read: ViewContainerRef }) drawerContent!: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  // Open card and load the corresponding component
  openCard(card: any) {
    this.openSidenav = true;
    this.loadComponent(card.component);
  }

  // Dynamically load a component into the placeholder
  private loadComponent(component: any) {
    this.drawerContent.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.drawerContent.createComponent(componentFactory);
  }
}
