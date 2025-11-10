/**
 * @fileoverview API Layer Exports for Museum Portal
 */

export * from './client';
export * from './endpoints';
export * from './types';
export * from './hooks';

// Export Services
export { AreaService } from './areaService';
export { ArtifactService } from './artifactService';
export { DisplayPositionService } from './displayPositionService';
export { VisitorService } from './visitorService';
export { RoleService } from './roleService';
export { ExhibitionService } from './exhibitionService';
export { HistoricalContextService } from './historicalContextService';
export { DashboardService } from './dashboardService';

// Export Service Types
export type { 
  Role, 
  RoleCreateRequest, 
  RoleUpdateRequest 
} from './roleService';