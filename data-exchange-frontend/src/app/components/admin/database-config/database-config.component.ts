import { Component } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {GraphDatabaseDto} from "../../../dtos/configs/configs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-database-config',
  templateUrl: './database-config.component.html',
  styleUrl: './database-config.component.css'
})
export class DatabaseConfigComponent {

  graphDatabaseConfig: GraphDatabaseDto = {
    graphDbServerUrl: '',
    repositoryId: '',
    port: 0,
    generatedUrl: '',
  };
  errorMessage?: string; // For error handling
  successMessage?: string; // For showing a success message

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDatabaseConfig();
  }

  private loadDatabaseConfig(): void {
    this.adminService.getDatabaseConfig().subscribe({
      next: (config) => {
        this.graphDatabaseConfig = config; // Bind the received data to the instance
      },
      error: (err) => {
        this.errorMessage = 'Failed to load database configuration.';
        console.error(err); // For debugging purposes
      },
    });
  }

  saveConfig(): void {

    if (this.graphDatabaseConfig.graphDbServerUrl === '' || this.graphDatabaseConfig.port === null || this.graphDatabaseConfig.port < 0 || this.graphDatabaseConfig.repositoryId === '') {
      alert('Invalid input!')
      return;
    }

    this.adminService.updateDatabaseConfig(this.graphDatabaseConfig).subscribe(
      {
        next: config => {
          this.graphDatabaseConfig = config;
        },
        error: (err) => {
          this.errorMessage = 'Failed to update database configuration.';
          console.error(err); // For debugging purposes
        },
      }
    )
  }

  generateUrl(): string {
    return this.graphDatabaseConfig.graphDbServerUrl + ':' + this.graphDatabaseConfig.port + '/repositories/' + this.graphDatabaseConfig.repositoryId;
  }
}
