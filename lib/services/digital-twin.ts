
import { agromonitoring, Polygon, SoilData } from './agromonitoring';

export interface DigitalTwinState {
    id: string;
    farmName: string;
    cropType: 'Wheat' | 'Rice' | 'Corn';
    growthStage: 'Initial' | 'Vegetative' | 'Reproductive' | 'Ripening';
    healthIndex: number; // 0 to 1 (NDVI mapping)
    soilCondition: {
        moisture: number;
        temp: number;
        nitrogen: 'Low' | 'Medium' | 'High';
    };
    environmentalStatus: 'Optimal' | 'Caution' | 'Stress';
    pestProbabilityScore: number; // 0 to 100
    lastUpdated: string;
    satelliteBoundary: any;
}

export const digitalTwinService = {
    // Mock simulation of generating a twin from satellite data
    async generateTwin(polygon: Polygon, soil: SoilData): Promise<DigitalTwinState> {
        // In a real app, this would query historical satellite imagery and ML models
        return {
            id: `twin_${polygon.id}`,
            farmName: polygon.name,
            cropType: 'Wheat', // Default or detected
            growthStage: 'Vegetative',
            healthIndex: 0.72,
            soilCondition: {
                moisture: soil.moisture,
                temp: soil.t10,
                nitrogen: 'Medium'
            },
            environmentalStatus: 'Optimal',
            pestProbabilityScore: 12,
            lastUpdated: new Date().toISOString(),
            satelliteBoundary: polygon.geo_json
        };
    },

    // Simulate real-time updates
    async getHealthHotspots(twinId: string) {
        // Returns coordinates for AR/VR highlighting
        return [
            { lat: 10, lng: 10, type: 'PEST', severity: 'HIGH' },
            { lat: 11, lng: 11, type: 'STRESS', severity: 'MEDIUM' }
        ];
    },

    async getPredictionTimeline(twinId: string) {
        return [
            { date: '2025-10-12', stage: 'Sowing', health: 1.0 },
            { date: '2026-02-19', stage: 'Vegetative', health: 0.72 }, // Present
            { date: '2026-03-20', stage: 'Reproductive', health: 0.85 }, // Future
            { date: '2026-04-15', stage: 'Harvesting', health: 0.90 } // Future
        ];
    }
};
