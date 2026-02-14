import * as Location from 'expo-location';
import { Alert } from 'react-native';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export interface LatLng {
    latitude: number;
    longitude: number;
}

export interface RouteInfo {
    distance: string;
    duration: string;
    polyline: string; // encoded polyline
}

export const MapsService = {
    async getCurrentLocation(): Promise<LatLng | null> {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Allow location access to find nearby routes.');
                return null;
            }

            const location = await Location.getCurrentPositionAsync({});
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
        } catch (error) {
            console.error('Error getting location:', error);
            return null;
        }
    },

    async getDirections(origin: LatLng, destination: string): Promise<RouteInfo | null> {
        if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
            console.warn("Google Maps API Key not configured");
            return null;
        }

        try {
            // Directions API call
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();

            if (data.routes.length > 0) {
                const route = data.routes[0];
                return {
                    distance: route.legs[0].distance.text,
                    duration: route.legs[0].duration.text,
                    polyline: route.overview_polyline.points,
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching directions:', error);
            return null;
        }
    }
};
