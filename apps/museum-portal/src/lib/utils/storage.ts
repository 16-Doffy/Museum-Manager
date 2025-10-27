/**
 * @fileoverview Storage utilities for Museum Portal
 * 
 * Utilities for managing localStorage with backup mechanisms
 */

import { Artifact, Area, DisplayPosition, Visitor, Interaction } from '../api/types';

const STORAGE_KEYS = {
  ARTIFACTS: 'museum_artifacts',
  AREAS: 'museum_areas', 
  DISPLAY_POSITIONS: 'museum_display_positions',
  VISITORS: 'museum_visitors',
  INTERACTIONS: 'museum_interactions',
} as const;

const BACKUP_KEYS = {
  ARTIFACTS: 'museum_artifacts_backup',
  AREAS: 'museum_areas_backup',
  DISPLAY_POSITIONS: 'museum_display_positions_backup', 
  VISITORS: 'museum_visitors_backup',
  INTERACTIONS: 'museum_interactions_backup',
} as const;

export class StorageManager {
  static save<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      
      // Also save backup
      const backupKey = key + '_backup';
      localStorage.setItem(backupKey, jsonData);
      
      console.log(`✅ Saved to localStorage: ${key}`, data);
      console.log(`✅ Also saved backup: ${backupKey}`);
    } catch (error) {
      console.error(`Error saving to localStorage ${key}:`, error);
    }
  }

  static load<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    
    try {
      // Try main storage first
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log(`✅ Loaded from localStorage: ${key}`, parsed);
        return parsed;
      }
      
      // Try backup storage
      const backupKey = key + '_backup';
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        const parsed = JSON.parse(backup);
        console.log(`✅ Loaded from backup localStorage: ${backupKey}`, parsed);
        // Restore main storage
        localStorage.setItem(key, backup);
        return parsed;
      }
      
      console.log(`No data found for ${key}, using fallback`);
      return fallback;
    } catch (error) {
      console.error(`Error loading from localStorage ${key}:`, error);
      return fallback;
    }
  }

  static clear(key: string): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(key);
    localStorage.removeItem(key + '_backup');
    console.log(`Cleared localStorage: ${key}`);
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      this.clear(key);
    });
    console.log('Cleared all museum data from localStorage');
  }

  // Specific methods for each data type
  static saveArtifacts(artifacts: Artifact[]): void {
    this.save(STORAGE_KEYS.ARTIFACTS, artifacts);
  }

  static loadArtifacts(fallback: Artifact[]): Artifact[] {
    return this.load(STORAGE_KEYS.ARTIFACTS, fallback);
  }

  static saveAreas(areas: Area[]): void {
    this.save(STORAGE_KEYS.AREAS, areas);
  }

  static loadAreas(fallback: Area[]): Area[] {
    return this.load(STORAGE_KEYS.AREAS, fallback);
  }

  static saveDisplayPositions(displayPositions: DisplayPosition[]): void {
    this.save(STORAGE_KEYS.DISPLAY_POSITIONS, displayPositions);
  }

  static loadDisplayPositions(fallback: DisplayPosition[]): DisplayPosition[] {
    return this.load(STORAGE_KEYS.DISPLAY_POSITIONS, fallback);
  }

  static saveVisitors(visitors: Visitor[]): void {
    this.save(STORAGE_KEYS.VISITORS, visitors);
  }

  static loadVisitors(fallback: Visitor[]): Visitor[] {
    return this.load(STORAGE_KEYS.VISITORS, fallback);
  }

  static saveInteractions(interactions: Interaction[]): void {
    this.save(STORAGE_KEYS.INTERACTIONS, interactions);
  }

  static loadInteractions(fallback: Interaction[]): Interaction[] {
    return this.load(STORAGE_KEYS.INTERACTIONS, fallback);
  }
}
