export type MapMarker = {
  [key: string]: [mapboxgl.Marker, mapboxgl.LngLatLike];
};

export type TransactionLocation = {
  syncDate: Date;
  transactDate: Date;
  branchID: string;
  IMEI: string;
  pax: number;
  totalAmount: number;
  coordinates: string; // Coordinates are in JSON string
};

export type BusLocations = {
  ID: number;
  IMEI: string;
  PAO: string;
  branchID: string;
  contact: string;
  coordinates: string;
  lastGPSUpdate: Date;
  lastTransact: Date;
  routeCode: string;
  routeName: string;

  longitude: number;
  latitude: number;
};

