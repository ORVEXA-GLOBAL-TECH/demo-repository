// Live GPS Fleet Tracking & Geofence WebSocket Client

export interface LiveMRLocation {
  mrId: string;
  mrName: string;
  latitude: number;
  longitude: number;
  speed: number;
  batteryLevel: number;
  accuracy: number;
  currentDoctorName?: string;
  isInsideGeofence?: boolean;
  status: 'ACTIVE' | 'IDLE' | 'IN_VISIT' | 'OFFLINE';
  timestamp: string;
}

export interface GeofenceAlertEvent {
  alertId: string;
  mrId: string;
  mrName: string;
  doctorId: string;
  doctorName: string;
  distanceMeters: number;
  event: string;
  timestamp: string;
}

type LocationCallback = (locations: LiveMRLocation[]) => void;
type AlertCallback = (alert: GeofenceAlertEvent) => void;

class LiveTrackingManager {
  private ws: WebSocket | null = null;
  private locationListeners: Set<LocationCallback> = new Set();
  private alertListeners: Set<AlertCallback> = new Set();
  private simulationInterval: any = null;

  // Active MR Cache
  private currentMRs: Map<string, LiveMRLocation> = new Map([
    [
      'mr-1',
      {
        mrId: '22222222-2222-2222-2222-222222222208',
        mrName: 'Rahul Verma',
        latitude: 18.9821,
        longitude: 72.8341,
        speed: 24.5,
        batteryLevel: 88,
        accuracy: 4.2,
        currentDoctorName: 'Dr. A. Mehta (KEM Hospital)',
        isInsideGeofence: true,
        status: 'IN_VISIT',
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
    [
      'mr-2',
      {
        mrId: '22222222-2222-2222-2222-222222222209',
        mrName: 'Priya Shah',
        latitude: 18.9525,
        longitude: 72.8185,
        speed: 38.0,
        batteryLevel: 72,
        accuracy: 5.0,
        currentDoctorName: 'Dr. Sanjay Deshmukh (Saifee Hospital)',
        isInsideGeofence: false,
        status: 'ACTIVE',
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
    [
      'mr-3',
      {
        mrId: '22222222-2222-2222-2222-222222222210',
        mrName: 'Amit Saxena',
        latitude: 19.0765,
        longitude: 73.0015,
        speed: 0,
        batteryLevel: 94,
        accuracy: 3.5,
        currentDoctorName: 'Dr. R. K. Joshi (Apollo Vashi)',
        isInsideGeofence: true,
        status: 'IN_VISIT',
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
  ]);

  public connect(url: string = 'ws://localhost:8080/ws/tracking') {
    if (typeof window === 'undefined') return;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('[WebSocket Tracking]: Connected to Alleviare GPS gateway');
        this.stopSimulation();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.alertId) {
            this.notifyAlerts(data);
          } else if (data.mrId) {
            this.updateMR(data);
          }
        } catch (_) {}
      };

      this.ws.onerror = () => {
        // Fallback to simulation if WebSocket server not currently active
        this.startSimulation();
      };

      this.ws.onclose = () => {
        this.startSimulation();
      };
    } catch (_) {
      this.startSimulation();
    }
  }

  public onLocationUpdate(cb: LocationCallback): () => void {
    this.locationListeners.add(cb);
    cb(Array.from(this.currentMRs.values()));
    return () => this.locationListeners.delete(cb);
  }

  public onGeofenceAlert(cb: AlertCallback): () => void {
    this.alertListeners.add(cb);
    return () => this.alertListeners.delete(cb);
  }

  private updateMR(mr: LiveMRLocation) {
    this.currentMRs.set(mr.mrId, mr);
    this.notifyLocations();
  }

  private notifyLocations() {
    const list = Array.from(this.currentMRs.values());
    this.locationListeners.forEach((cb) => cb(list));
  }

  private notifyAlerts(alert: GeofenceAlertEvent) {
    this.alertListeners.forEach((cb) => cb(alert));
  }

  private startSimulation() {
    if (this.simulationInterval) return;

    this.simulationInterval = setInterval(() => {
      this.currentMRs.forEach((mr) => {
        // Simulate small movement jitter and speed variations
        const latDelta = (Math.random() - 0.5) * 0.0008;
        const lngDelta = (Math.random() - 0.5) * 0.0008;
        mr.latitude += latDelta;
        mr.longitude += lngDelta;
        mr.speed = Math.max(0, Math.round((mr.speed + (Math.random() - 0.5) * 6) * 10) / 10);
        mr.timestamp = new Date().toLocaleTimeString();

        // Random geofence trigger check
        if (Math.random() < 0.08 && !mr.isInsideGeofence) {
          mr.isInsideGeofence = true;
          this.notifyAlerts({
            alertId: `ALERT-${Date.now()}`,
            mrId: mr.mrId,
            mrName: mr.mrName,
            doctorId: 'DOC-401',
            doctorName: mr.currentDoctorName || 'Dr. A. Mehta Clinic',
            distanceMeters: 84.5,
            event: 'ENTERED_150M_GEOFENCE',
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      });

      this.notifyLocations();
    }, 4000);
  }

  private stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
}

export const liveTracking = new LiveTrackingManager();
