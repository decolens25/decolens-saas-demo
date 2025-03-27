import { fetchEventSource } from '@microsoft/fetch-event-source';
import { scaleImageToMaxDimension, dataUrlToBlob } from '../utils/imageUtils';

const serverUrl = import.meta.env.VITE_DECOLENS_SERVER_URL || "https://api.decolens.com";
const apiKey = import.meta.env.VITE_DECOLENS_SERVER_API_KEY;

export interface AnalysisResponse {
  purpose: string,         // Type or purpose of the room.
  ambiance: string,        // Ambiance of the room. 
  lighting: string,        // Lighting condition of the room.
  materials: string,       // Materials used in the room.
  colors: string[],        // Prominent colors in the room in HEX values.
  summary: string,         // Overall aesthetic analysis summary of the room.
  recommendations: {
    description: string,   // Detailed description of the art piece being recommended. Not for displaying to the user.
    summary: string,       // Short summary of the description, fit for displaying to the user.
    justification: string, // Reason why this art is being recommended.
    artworkIds: string[],  // Ids of artworks being recommended.
  }[]
}

export interface Preferences {
  colors: string[];
  vibes: string[];
  priceRange?: [number, number];
}

interface AnalysisStreamCallback {
  onPartial?: (response: AnalysisResponse) => void;
  onComplete?: (response: AnalysisResponse) => void;
  onError?: (error: Event) => void;
}

export const decolensApi = {
  async analyzeRoom(
    imageUrl: string,
    preferences: Preferences = { vibes: [], priceRange: [] },
    callback: AnalysisStreamCallback = {}
  ): Promise<AbortController> {
    // Create a new AbortController
    const controller = new AbortController();
    
    try {
      // Scale down the image to max 1024px in either dimension
      const scaledImageUrl = await scaleImageToMaxDimension(imageUrl, 1024);
      
      // Convert the scaled image to a Blob
      let imageBlob: Blob;
      if (scaledImageUrl.startsWith('data:')) {
        imageBlob = dataUrlToBlob(scaledImageUrl);
      } else {
        // For URLs, fetch and then scale
        const response = await fetch(scaledImageUrl);
        imageBlob = await response.blob();
      }

      // Create FormData and append the image
      const formData = new FormData();
      formData.append('image', imageBlob, 'image.jpg');

      // Add preferences if provided
      console.log("decolens");
      console.log(preferences);
      if (preferences && (preferences.vibes?.length > 0 || preferences.priceRange?.length == 2)) {
        formData.append('preferences', JSON.stringify(preferences));
      }

      // Use fetchEventSource to handle streaming responses
      await fetchEventSource(`${serverUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
        signal: controller.signal,
        onmessage(ev) {
          try {
            // Handle different event types
            switch (ev.event) {
              case 'partial':
                const partialResult: AnalysisResponse = JSON.parse(ev.data);
                callback.onPartial?.(partialResult);
                break;
              case 'complete':
                const finalResult: AnalysisResponse = JSON.parse(ev.data);
                callback.onComplete?.(finalResult);
                break;
              default:
                // Handle unknown event types
                console.log('Unknown event type:', ev.event, ev.data);
            }
          } catch (error) {
            console.error('Error parsing event data:', error);
            callback.onError?.(new ErrorEvent('parse_error', { error }));
          }
        },
        onerror(err) {
          console.error('EventSource error:', err);
          callback.onError?.(err);
          throw err;
        },
        onclose() {
          console.log('EventSource connection closed');
        },
      });
    } catch (error) {
      console.error('Error analyzing room:', error);
      callback.onError?.(new ErrorEvent('fetch_error', { error }));
    }

    return controller;
  },
};