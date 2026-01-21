/**
 * Safe equation evaluation for PASCO datasheet equations
 * This module provides a safe alternative to eval() for evaluating mathematical expressions
 */

import { Parser } from 'expr-eval';
import { dewpoint, heatindex, limit, linearInterpolate, usound, windchill } from './math.js';

// Create parser instance with custom functions
const parser = new Parser();

// Add mathematical functions that might be used in equations
parser.functions.sqrt = Math.sqrt;
parser.functions.log = Math.log10;
parser.functions.ln = Math.log;
parser.functions.log10 = Math.log10;
parser.functions.sin = Math.sin;
parser.functions.cos = Math.cos;
parser.functions.tan = Math.tan;
parser.functions.asin = Math.asin;
parser.functions.acos = Math.acos;
parser.functions.atan = Math.atan;
parser.functions.atan2 = Math.atan2;
parser.functions.abs = Math.abs;
parser.functions.pow = Math.pow;
parser.functions.exp = Math.exp;
parser.functions.floor = Math.floor;
parser.functions.ceil = Math.ceil;
parser.functions.round = Math.round;

export interface EquationVariables {
  [key: string]: number | null;
}

/**
 * Parse parenthetical contents from a string
 * Generates [level, contents] pairs
 */
export function* parentheticContents(str: string): Generator<[number, string], void, unknown> {
  const stack: number[] = [];

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '(') {
      stack.push(i);
    } else if (c === ')' && stack.length > 0) {
      const start = stack.pop()!;
      yield [stack.length, str.slice(start + 1, i)];
    }
  }
}

/**
 * Evaluate a table equation using linear interpolation
 * @param rawEquation Equation string like "table((880*60.8)+336.9,7122,45,14100,20,17245,15,51725,0)"
 */
export function evaluateTableEquation(rawEquation: string): number {
  // Remove 'table(' prefix and ')' suffix
  const trimmedEquation = rawEquation.slice(6, -1);
  const elements = trimmedEquation.split(',');

  // Evaluate the x expression
  const xExpression = elements.shift()!;
  const x = parser.evaluate(xExpression);

  // Parse remaining values as points
  const values = elements.map((e) => parseFloat(e));
  const points: [number, number][] = [];

  while (values.length >= 2) {
    const px = values.shift()!;
    const py = values.shift()!;
    points.push([px, py]);
  }

  return linearInterpolate(x, points);
}

/**
 * Evaluate a limit expression
 * @param expression Expression like "limit(value, min, max)"
 */
export function evaluateLimitExpression(expression: string): number {
  const match = expression.match(/limit\(([^,]+),([^,]+),([^)]+)\)/);
  if (!match) {
    throw new Error(`Invalid limit expression: ${expression}`);
  }

  const val = parseFloat(match[1]!);
  const minVal = parseFloat(match[2]!);
  const maxVal = parseFloat(match[3]!);

  return limit(val, minVal, maxVal);
}

/**
 * Evaluate a PASCO datasheet equation
 * @param rawEquation The equation string from the datasheet
 * @param variables Object mapping variable IDs to their values
 */
export function evaluateEquation(rawEquation: string, variables: EquationVariables): number | null {
  // Replace variable references [n] with actual values
  let equation = rawEquation;

  // Find all variable references like [123] or [1_2]
  const varMatches = equation.match(/\[([0-9_]+)\]/g) || [];

  for (const match of varMatches) {
    const varKey = match.slice(1, -1); // Remove brackets
    const value = variables[varKey];

    if (value === null || value === undefined) {
      // If any variable is null, the equation can't be evaluated
      return null;
    }

    equation = equation.replace(match, value.toString());
  }

  // Convert Python-style power operator to JavaScript
  equation = equation.replace(/\^/g, '**');

  // Handle special equation types
  if (equation.startsWith('table')) {
    return evaluateTableEquation(equation);
  }

  if (equation.startsWith('usound')) {
    const match = equation.match(/usound\(([^,]+),([^)]+)\)/);
    if (match) {
      const pingEchoTime = parseFloat(match[1]!);
      const speedOfSound = parseFloat(match[2]!);
      return usound(pingEchoTime, speedOfSound);
    }
    return null;
  }

  if (equation.startsWith('dewpoint')) {
    const match = equation.match(/dewpoint\(([^,]+),([^)]+)\)/);
    if (match) {
      const tempC = parseFloat(match[1]!);
      const relativeHumidity = parseFloat(match[2]!);
      if (Number.isNaN(tempC) || Number.isNaN(relativeHumidity)) {
        return null;
      }
      return dewpoint(tempC, relativeHumidity);
    }
    return null;
  }

  if (equation.startsWith('windchill')) {
    const match = equation.match(/windchill\(([^,]+),([^)]+)\)/);
    if (match) {
      const tempC = parseFloat(match[1]!);
      const windMs = parseFloat(match[2]!);
      if (Number.isNaN(tempC) || Number.isNaN(windMs)) {
        return null;
      }
      return windchill(tempC, windMs);
    }
    return null;
  }

  if (equation.startsWith('heatindex')) {
    const match = equation.match(/heatindex\(([^,]+),([^)]+)\)/);
    if (match) {
      const tempC = parseFloat(match[1]!);
      const relativeHumidity = parseFloat(match[2]!);
      return heatindex(tempC, relativeHumidity);
    }
    return null;
  }

  if (equation.startsWith('codenodepos')) {
    // Not implemented
    return null;
  }

  // Process limit() expressions within the equation
  const parentheticVals = Array.from(parentheticContents(equation));
  for (const [_level, eqn] of parentheticVals) {
    if (eqn.startsWith('limit')) {
      const limitResult = evaluateLimitExpression(`limit(${eqn.slice(6)}`);
      equation = equation.replace(eqn, limitResult.toString());
    }
  }

  // Check for null/None values
  if (equation.includes('None') || equation.includes('null')) {
    return null;
  }

  // Replace math functions
  equation = equation.replace(/sqrt/g, 'sqrt');
  equation = equation.replace(/atan2/g, 'atan2');
  equation = equation.replace(/log(?!10)/g, 'log10');

  // Convert ** back to ^ for expr-eval
  equation = equation.replace(/\*\*/g, '^');

  try {
    return parser.evaluate(equation);
  } catch {
    throw new Error(`Invalid equation: ${rawEquation}`);
  }
}
