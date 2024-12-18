import { Component } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {GraphDatabaseDto} from "../../../dtos/configs/configs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

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

  constructor(
    private adminService: AdminService,
    private notification: ToastrService
              ) {}

  ngOnInit(): void {
    this.loadDatabaseConfig();
  }

  private loadDatabaseConfig(): void {
    this.adminService.getDatabaseConfig().subscribe({
      next: (config) => {
        this.graphDatabaseConfig = config;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load database configuration.';

      },
    });
  }

  saveConfig(): void {

    if (this.graphDatabaseConfig.graphDbServerUrl === '' || this.graphDatabaseConfig.port === null || this.graphDatabaseConfig.port < 0 || this.graphDatabaseConfig.repositoryId === '') {
      this.notification.warning("Invalid input")
      return;
    }

    this.adminService.updateDatabaseConfig(this.graphDatabaseConfig).subscribe(
      {
        next: config => {
          this.graphDatabaseConfig = config;
          this.notification.success("Config has been updated. Backend will restart!")
        },
        error: (err) => {
          this.errorMessage = 'Failed to update database configuration.';
          this.notification.warning('Failed to update database configuration.')
        },
      }
    )
  }

  generateUrl(): string {
    return this.graphDatabaseConfig.graphDbServerUrl + ':' + this.graphDatabaseConfig.port + '/repositories/' + this.graphDatabaseConfig.repositoryId;
  }
}
