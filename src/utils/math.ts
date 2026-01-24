/**
 * Mathematical utilities for PASCO sensor calculations
 */

/**
 * Linear interpolation between points
 * @param x Input value
 * @param points Array of [x, y] coordinate pairs
 */
export function linearInterpolate(x: number, points: [number, number][]): number {
  if (points.length < 2) {
    throw new Error('At least 2 points required for interpolation');
  }

  let xi: number;
  let yi: number;
  let xNext: number;
  let yNext: number;

  // Find the interval containing x
  for (let i = 0; i < points.length - 1; i++) {
    const point = points[i];
    const nextPoint = points[i + 1];
    if (point && nextPoint) {
      [xi, yi] = point;
      [xNext, yNext] = nextPoint;

      if (xi <= x && x <= xNext) {
        break;
      }
    }
  }

  // Handle x outside the range of points
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const secondPoint = points[1];
  const secondLastPoint = points[points.length - 2];

  if (!firstPoint || !lastPoint || !secondPoint || !secondLastPoint) {
    throw new Error('Invalid points array');
  }

  if (x < firstPoint[0]) {
    [xi, yi] = firstPoint;
    [xNext, yNext] = secondPoint;
  } else if (x > lastPoint[0]) {
    [xi, yi] = secondLastPoint;
    [xNext, yNext] = lastPoint;
  }

  // Perform linear interpolation
  return ((yNext! - yi!) / (xNext! - xi!)) * (x - xi!) + yi!;
}

/**
 * Calculate linear conversion: y = m*x + b
 */
export function calcLinearParams(raw: number, m: number, b: number): number {
  return m * raw + b;
}

/**
 * Calculate 4-parameter calibration (slope offset according to factory calibration)
 */
export function calc4Params(raw: number, x1: number, y1: number, x2: number, y2: number): number {
  const b = (x1 * y2 - x2 * y1) / (x1 - x2);
  let m: number;
  if (x1 !== 0) {
    m = (y1 - b) / x1;
  } else if (x2 !== 0) {
    m = (y2 - b) / x2;
  } else {
    m = 0;
  }

  return m * raw + b;
}

/**
 * Calculate rotary position
 */
export function calcRotaryPos(count: number, x: number, r: number): number {
  return (count * x) / r;
}

/**
 * Limit a number between minimum and maximum values
 */
export function limit(num: number, minimum: number, maximum: number): number {
  return Math.max(Math.min(num, maximum), minimum);
}

/**
 * Round a number to a specified number of decimal places.
 * Uses the common pattern: Math.round(value * 10^precision) / 10^precision
 *
 * @param value The number to round
 * @param precision Number of decimal places (default: 0)
 * @returns The rounded number
 *
 * @example
 * ```typescript
 * roundToPrecision(3.14159, 2)  // 3.14
 * roundToPrecision(3.14159, 0)  // 3
 * roundToPrecision(123.456, 1)  // 123.5
 * ```
 */
export function roundToPrecision(value: number, precision: number = 0): number {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Calculate 3-input vector magnitude (for acceleration, etc.)
 */
export function threeInputVector(ax: number, ay: number, az: number): number {
  return Math.sqrt(ax ** 2 + ay ** 2 + az ** 2);
}

/**
 * Calculate dew point from temperature and relative humidity
 * @param tempC Temperature in Celsius
 * @param relativeHumidity Relative humidity percentage
 */
export function dewpoint(tempC: number, relativeHumidity: number): number {
  const vaporPressureSat = 6.11 * 10 ** ((7.5 * tempC) / (237.7 + tempC));
  const vaporPressureActual = (relativeHumidity * vaporPressureSat) / 100;

  return (
    (-443.22 + 237.7 * Math.log(vaporPressureActual)) / (-Math.log(vaporPressureActual) + 19.08)
  );
}

/**
 * Calculate wind chill from temperature and wind speed
 * @param tempC Temperature in Celsius
 * @param windMs Wind speed in m/s
 */
export function windchill(tempC: number, windMs: number): number {
  const tempF = (9 * tempC) / 5 + 32;
  const windMph = windMs * 2.237;

  let windChillF: number;
  if (windMph < 3.0 || tempF > 50.0) {
    windChillF = tempF;
  } else {
    windChillF =
      35.74 + 0.6215 * tempF - 35.75 * windMph ** 0.16 + 0.4275 * tempF * windMph ** 0.16;
  }

  return (5 * (windChillF - 32)) / 9;
}

/**
 * Calculate heat index from temperature and relative humidity
 * @param tempC Temperature in Celsius
 * @param relativeHumidity Relative humidity percentage
 */
export function heatindex(tempC: number, relativeHumidity: number): number {
  const vaporPressureSat = 6.11 * 10 ** ((7.5 * tempC) / (237.7 + tempC));
  const vaporPressureActual = (relativeHumidity * vaporPressureSat) / 100;

  return tempC + 0.55555 * (vaporPressureActual - 10.0);
}

/**
 * Calculate ultrasonic distance
 * @param pingEchoTime Ping echo time in microseconds
 * @param speedOfSound Speed of sound in m/s
 */
export function usound(pingEchoTime: number, speedOfSound: number): number {
  return ((pingEchoTime / 1000000) * speedOfSound) / 2;
}
