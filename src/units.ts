/**
 * PASCO Unit Conversions
 *
 * Unit conversion data extracted from official PASCO datasheets.
 * Each unit group has a base unit (Scale=1, Offset=0).
 * To convert from base to target: targetValue = baseValue * scale + offset
 * To convert from target to base: baseValue = (targetValue - offset) / scale
 */

export interface UnitDefinition {
  tag: string;
  scale: number;
  offset: number;
}

export interface UnitGroup {
  tag: string;
  defaultUnit: string;
  usDefault?: string;
  units: Record<string, UnitDefinition>;
}

/**
 * All unit groups with their conversion factors
 */
export const UNIT_GROUPS: Record<string, UnitGroup> = {
  Unitless: {
    tag: 'Unitless',
    defaultUnit: 'Unitless',
    units: {
      Unitless: { tag: 'Unitless', scale: 1, offset: 0 },
    },
  },
  Time: {
    tag: 'Time',
    defaultUnit: 's',
    units: {
      s: { tag: 's', scale: 1, offset: 0 },
      ms: { tag: 'ms', scale: 1000, offset: 0 },
      us: { tag: 'us', scale: 1000000, offset: 0 },
      minutes: { tag: 'minutes', scale: 0.01666666666666667, offset: 0 },
      hours: { tag: 'hours', scale: 0.0002777777777777778, offset: 0 },
      days: { tag: 'days', scale: 1.157407407407407e-5, offset: 0 },
    },
  },
  Temperature: {
    tag: 'Temperature',
    defaultUnit: 'DegC',
    usDefault: 'DegF',
    units: {
      DegC: { tag: 'DegC', scale: 1, offset: 0 },
      DegF: { tag: 'DegF', scale: 1.8, offset: 32 },
      K: { tag: 'K', scale: 1, offset: 273.15 },
    },
  },
  Pressure: {
    tag: 'Pressure',
    defaultUnit: 'kPa',
    usDefault: 'psi',
    units: {
      psi: { tag: 'psi', scale: 1, offset: 0 },
      Nm2: { tag: 'Nm2', scale: 6894.757293, offset: 0 },
      kPa: { tag: 'kPa', scale: 6.894757293, offset: 0 },
      atm: { tag: 'atm', scale: 0.068045964, offset: 0 },
      torr: { tag: 'torr', scale: 51.71492032, offset: 0 },
      hPa: { tag: 'hPa', scale: 68.94757293, offset: 0 },
      inHg: { tag: 'inHg', scale: 2.036021, offset: 0 },
      mmHg: { tag: 'mmHg', scale: 51.71492032, offset: 0 },
      mBar: { tag: 'mBar', scale: 68.94757293, offset: 0 },
      Pa: { tag: 'Pa', scale: 6894.757293, offset: 0 },
      inH2O: { tag: 'inH2O', scale: 27.679904843, offset: 0 },
    },
  },
  Voltage: {
    tag: 'Voltage',
    defaultUnit: 'V',
    units: {
      V: { tag: 'V', scale: 1, offset: 0 },
      mV: { tag: 'mV', scale: 1000, offset: 0 },
    },
  },
  Length: {
    tag: 'Length',
    defaultUnit: 'm',
    usDefault: 'ft',
    units: {
      m: { tag: 'm', scale: 1, offset: 0 },
      cm: { tag: 'cm', scale: 100, offset: 0 },
      mm: { tag: 'mm', scale: 1000, offset: 0 },
      in: { tag: 'in', scale: 39.37007874, offset: 0 },
      ft: { tag: 'ft', scale: 3.280839895, offset: 0 },
      mil: { tag: 'mil', scale: 39370.07874, offset: 0 },
      km: { tag: 'km', scale: 0.001, offset: 0 },
      um: { tag: 'um', scale: 1000000, offset: 0 },
      nm: { tag: 'nm', scale: 1000000000, offset: 0 },
    },
  },
  Force: {
    tag: 'Force',
    defaultUnit: 'N',
    usDefault: 'lbs',
    units: {
      N: { tag: 'N', scale: 1, offset: 0 },
      lbs: { tag: 'lbs', scale: 0.224808943, offset: 0 },
      kgmps2: { tag: 'kgmps2', scale: 1, offset: 0 },
    },
  },
  MagneticField: {
    tag: 'MagneticField',
    defaultUnit: 'tesla',
    units: {
      gauss: { tag: 'gauss', scale: 1, offset: 0 },
      mtesla: { tag: 'mtesla', scale: 0.1, offset: 0 },
      tesla: { tag: 'tesla', scale: 0.0001, offset: 0 },
      utesla: { tag: 'utesla', scale: 100, offset: 0 },
    },
  },
  Acceleration: {
    tag: 'Acceleration',
    defaultUnit: 'ms2',
    usDefault: 'fts2',
    units: {
      ms2: { tag: 'ms2', scale: 1, offset: 0 },
      grav: { tag: 'grav', scale: 0.101972, offset: 0 },
      fts2: { tag: 'fts2', scale: 3.280839895, offset: 0 },
      cms2: { tag: 'cms2', scale: 100.0, offset: 0 },
    },
  },
  Velocity: {
    tag: 'Velocity',
    defaultUnit: 'mps',
    usDefault: 'fps',
    units: {
      mps: { tag: 'mps', scale: 1, offset: 0 },
      fps: { tag: 'fps', scale: 3.280839895, offset: 0 },
      kph: { tag: 'kph', scale: 3.6, offset: 0 },
      mph: { tag: 'mph', scale: 2.236936292, offset: 0 },
      knots: { tag: 'knots', scale: 1.943844492, offset: 0 },
      cmps: { tag: 'cmps', scale: 100.0, offset: 0 },
      mmps: { tag: 'mmps', scale: 1000.0, offset: 0 },
    },
  },
  Angle: {
    tag: 'Angle',
    defaultUnit: 'rad',
    units: {
      rad: { tag: 'rad', scale: 1, offset: 0 },
      deg: { tag: 'deg', scale: 57.2957795, offset: 0 },
      rev: { tag: 'rev', scale: 0.159155, offset: 0 },
    },
  },
  AngularVelocity: {
    tag: 'AngularVelocity',
    defaultUnit: 'radps',
    units: {
      radps: { tag: 'radps', scale: 1, offset: 0 },
      degps: { tag: 'degps', scale: 57.2957795, offset: 0 },
      revpm: { tag: 'revpm', scale: 9.549297, offset: 0 },
      revps: { tag: 'revps', scale: 0.159155, offset: 0 },
    },
  },
  AngularAcceleration: {
    tag: 'AngularAcceleration',
    defaultUnit: 'radps2',
    units: {
      radps2: { tag: 'radps2', scale: 1, offset: 0 },
      degps2: { tag: 'degps2', scale: 57.2957795, offset: 0 },
      revpmps: { tag: 'revpmps', scale: 9.549297, offset: 0 },
      revps2: { tag: 'revps2', scale: 0.159155, offset: 0 },
    },
  },
  Charge: {
    tag: 'Charge',
    defaultUnit: 'uC',
    units: {
      nC: { tag: 'nC', scale: 1, offset: 0 },
      uC: { tag: 'uC', scale: 0.001, offset: 0 },
      C: { tag: 'C', scale: 0.000000001, offset: 0 },
    },
  },
  Current: {
    tag: 'Current',
    defaultUnit: 'A',
    units: {
      A: { tag: 'A', scale: 1, offset: 0 },
      mA: { tag: 'mA', scale: 1000, offset: 0 },
      uA: { tag: 'uA', scale: 1e6, offset: 0 },
      nA: { tag: 'nA', scale: 1e9, offset: 0 },
      pA: { tag: 'pA', scale: 1e12, offset: 0 },
    },
  },
  Volume: {
    tag: 'Volume',
    defaultUnit: 'L',
    units: {
      L: { tag: 'L', scale: 1, offset: 0 },
      mL: { tag: 'mL', scale: 1000, offset: 0 },
      ft3: { tag: 'ft3', scale: 0.035314667, offset: 0 },
      m3: { tag: 'm3', scale: 0.001, offset: 0 },
      mm3: { tag: 'mm3', scale: 1000000, offset: 0 },
    },
  },
  FlowRate: {
    tag: 'FlowRate',
    defaultUnit: 'Lps',
    units: {
      Lps: { tag: 'Lps', scale: 1, offset: 0 },
      cfm: { tag: 'cfm', scale: 2.118879973, offset: 0 },
      m3ps: { tag: 'm3ps', scale: 0.001, offset: 0 },
      galps: { tag: 'galps', scale: 0.26417205236, offset: 0 },
      galpm: { tag: 'galpm', scale: 15.850323, offset: 0 },
      Lpm: { tag: 'Lpm', scale: 60, offset: 0 },
      Lph: { tag: 'Lph', scale: 3600, offset: 0 },
    },
  },
  Resistance: {
    tag: 'Resistance',
    defaultUnit: 'ohm',
    units: {
      ohm: { tag: 'ohm', scale: 1, offset: 0 },
      kohm: { tag: 'kohm', scale: 0.001, offset: 0 },
      megaohm: { tag: 'megaohm', scale: 1e-6, offset: 0 },
      milliohm: { tag: 'milliohm', scale: 1000, offset: 0 },
    },
  },
  Capacitance: {
    tag: 'Capacitance',
    defaultUnit: 'uF',
    units: {
      F: { tag: 'F', scale: 1, offset: 0 },
      mF: { tag: 'mF', scale: 1000, offset: 0 },
      uF: { tag: 'uF', scale: 1000000, offset: 0 },
      nF: { tag: 'nF', scale: 1000000000, offset: 0 },
      pF: { tag: 'pF', scale: 1000000000000, offset: 0 },
    },
  },
  Energy: {
    tag: 'Energy',
    defaultUnit: 'J',
    units: {
      J: { tag: 'J', scale: 1, offset: 0 },
      Nm: { tag: 'Nm', scale: 1, offset: 0 },
      eV: { tag: 'eV', scale: 6.241506479963234e18, offset: 0 },
      kWh: { tag: 'kWh', scale: 2.777777777777778e-7, offset: 0 },
      Ws: { tag: 'Ws', scale: 1, offset: 0 },
    },
  },
  Percent: {
    tag: 'Percent',
    defaultUnit: 'percent',
    units: {
      percent: { tag: 'percent', scale: 1, offset: 0 },
    },
  },
  Conductivity: {
    tag: 'Conductivity',
    defaultUnit: 'uSpcm',
    units: {
      uSpcm: { tag: 'uSpcm', scale: 1, offset: 0 },
    },
  },
  Light: {
    tag: 'Light',
    defaultUnit: 'lux',
    units: {
      lux: { tag: 'lux', scale: 1, offset: 0 },
    },
  },
  Concentration: {
    tag: 'Concentration',
    defaultUnit: 'mgpL',
    units: {
      mgpL: { tag: 'mgpL', scale: 1, offset: 0 },
      gpL: { tag: 'gpL', scale: 0.001, offset: 0 },
      ppm: { tag: 'ppm', scale: 1, offset: 0 },
      ppt: { tag: 'ppt', scale: 0.001, offset: 0 },
      pph: { tag: 'pph', scale: 0.0001, offset: 0 },
    },
  },
  Frequency: {
    tag: 'Frequency',
    defaultUnit: 'Hz',
    units: {
      Hz: { tag: 'Hz', scale: 1, offset: 0 },
      kHz: { tag: 'kHz', scale: 0.001, offset: 0 },
      MHz: { tag: 'MHz', scale: 0.000001, offset: 0 },
      GHz: { tag: 'GHz', scale: 0.000000001, offset: 0 },
    },
  },
  Mass: {
    tag: 'Mass',
    defaultUnit: 'kg',
    units: {
      kg: { tag: 'kg', scale: 1, offset: 0 },
      g: { tag: 'g', scale: 1000, offset: 0 },
      oz: { tag: 'oz', scale: 35.273962, offset: 0 },
      lb: { tag: 'lb', scale: 2.204623, offset: 0 },
    },
  },
  Power: {
    tag: 'Power',
    defaultUnit: 'W',
    units: {
      W: { tag: 'W', scale: 1, offset: 0 },
      mW: { tag: 'mW', scale: 1000, offset: 0 },
    },
  },
  Momentum: {
    tag: 'Momentum',
    defaultUnit: 'kgmps',
    units: {
      kgmps: { tag: 'kgmps', scale: 1, offset: 0 },
      Ns: { tag: 'Ns', scale: 1, offset: 0 },
      gcmps: { tag: 'gcmps', scale: 100000, offset: 0 },
    },
  },
  AbsoluteHumidity: {
    tag: 'AbsoluteHumidity',
    defaultUnit: 'gpm3',
    units: {
      gpm3: { tag: 'gpm3', scale: 1, offset: 0 },
    },
  },
  SoundLevel: {
    tag: 'SoundLevel',
    defaultUnit: 'dBA',
    units: {
      dBA: { tag: 'dBA', scale: 1, offset: 0 },
      dBC: { tag: 'dBC', scale: 1, offset: 0 },
    },
  },
  Drops: {
    tag: 'Drops',
    defaultUnit: 'drops',
    units: {
      drops: { tag: 'drops', scale: 1, offset: 0 },
    },
  },
};

/**
 * Map unit tags to their unit groups for quick lookup
 */
export const UNIT_TAG_TO_GROUP: Record<string, string> = {};

// Build the unit tag to group map
for (const [groupName, group] of Object.entries(UNIT_GROUPS)) {
  for (const unitTag of Object.keys(group.units)) {
    UNIT_TAG_TO_GROUP[unitTag] = groupName;
  }
}

/**
 * Convert a value from one unit to another within the same unit group
 * @param value The value to convert
 * @param fromUnit The source unit tag
 * @param toUnit The target unit tag
 * @returns The converted value, or null if units are incompatible
 */
export function convertUnit(value: number, fromUnit: string, toUnit: string): number | null {
  const fromGroup = UNIT_TAG_TO_GROUP[fromUnit];
  const toGroup = UNIT_TAG_TO_GROUP[toUnit];

  if (!fromGroup || !toGroup || fromGroup !== toGroup) {
    return null; // Incompatible units
  }

  const group = UNIT_GROUPS[fromGroup];
  if (!group) return null;

  const fromDef = group.units[fromUnit];
  const toDef = group.units[toUnit];

  if (!fromDef || !toDef) return null;

  // Convert to base unit first, then to target unit
  const baseValue = (value - fromDef.offset) / fromDef.scale;
  const targetValue = baseValue * toDef.scale + toDef.offset;

  return targetValue;
}

/**
 * Get the unit group for a given unit tag
 * @param unitTag The unit tag to look up
 * @returns The unit group name, or undefined if not found
 */
export function getUnitGroup(unitTag: string): string | undefined {
  return UNIT_TAG_TO_GROUP[unitTag];
}

/**
 * Get all available units for a given unit group
 * @param groupName The unit group name
 * @returns Array of unit tags in the group
 */
export function getUnitsInGroup(groupName: string): string[] {
  const group = UNIT_GROUPS[groupName];
  return group ? Object.keys(group.units) : [];
}

/**
 * Get the default unit for a unit group
 * @param groupName The unit group name
 * @param useUS Whether to use US default if available
 * @returns The default unit tag
 */
export function getDefaultUnit(groupName: string, useUS = false): string | undefined {
  const group = UNIT_GROUPS[groupName];
  if (!group) return undefined;
  return useUS && group.usDefault ? group.usDefault : group.defaultUnit;
}
