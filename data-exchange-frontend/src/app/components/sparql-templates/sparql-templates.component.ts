import { Component } from '@angular/core';

@Component({
  selector: 'app-sparql-templates',
  templateUrl: './sparql-templates.component.html',
  styleUrl: './sparql-templates.component.css'
})
export class SparqlTemplatesComponent {

  openSidenav = false;

  toggleSidenav() {
    this.openSidenav = !this.openSidenav;
  }
}
