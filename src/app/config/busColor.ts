import { BusDetails } from "../models/bus.model";
import { BusLocations } from "../models/map.model";

export const identifyBusColor = (bus: BusDetails | BusLocations): string => {
  if (!bus.routeCode || !bus.lastTransact) return 'red';
  if ('timeOut' in bus && bus.timeOut) return 'violet';

  const timeDiff = (new Date().getTime() - new Date(bus.lastTransact).getTime()) / 1000;

  let className = '';

  switch (true) { // Check last transaction update
    case (timeDiff >= 3600): // More than 1 hour
      className = 'orange';
      break;
    case (timeDiff >= 1800 && timeDiff < 3600): // Less than 1 hour; more than 30 mins
      className = 'yellow';
      break;
    case (timeDiff < 1800 && timeDiff >= 900): // Less than 1 hour; less than 30 mins; more than 15 mins
      className = 'green';
      break;
    default: // less than 15 mins
      className = 'blue';
  }

  return className;
};
