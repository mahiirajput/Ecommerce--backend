
import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStats } from '../../interfaces/dashboard.interface';


@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(): Promise<DashboardStats> {
    return this.dashboardService.getDashboardStats();
  }
}