/**
 * @fileoverview Debug utility for localStorage
 */

export function debugLocalStorage() {
  if (typeof window === 'undefined') {
    console.log('❌ Window is undefined, cannot access localStorage');
    return;
  }

  console.log('🔍 Debugging localStorage...');
  
  const keys = [
    'museum_artifacts',
    'museum_artifacts_backup',
    'museum_areas',
    'museum_areas_backup',
    'museum_display_positions',
    'museum_display_positions_backup',
    'museum_visitors',
    'museum_visitors_backup',
    'museum_interactions',
    'museum_interactions_backup',
  ];

  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        const parsed = JSON.parse(value);
        console.log(`✅ ${key}:`, parsed);
      } catch (error) {
        console.log(`❌ ${key}: Invalid JSON`, value);
      }
    } else {
      console.log(`❌ ${key}: Not found`);
    }
  });

  console.log('🔍 localStorage debugging complete');
}

// Auto-run on page load
if (typeof window !== 'undefined') {
  (window as any).debugLocalStorage = debugLocalStorage;
  console.log('🔧 Debug function available: window.debugLocalStorage()');
}
