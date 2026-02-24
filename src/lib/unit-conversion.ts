// ============================================
// Unit Conversion Utilities
// Convert between oz/ml and support grams
// ============================================

export type MeasurementUnit = 'imperial' | 'metric';

// Conversion factors
const OZ_TO_ML = 25; // Standard UK 25ml single shot
const TSP_TO_ML = 4.92892;
const TBSP_TO_ML = 14.7868;
const CUP_TO_ML = 236.588;
const DASH_ML = 0.92; // ~1ml per dash
const CL_TO_ML = 10;

interface ParsedMeasure {
    amount: number;
    unit: string;
    rest: string; // anything after the unit
}

/**
 * Parse a measurement string like "1 1/2 oz" or "2 cl" into its components
 */
function parseMeasure(measure: string): ParsedMeasure | null {
    if (!measure || !measure.trim()) return null;

    const cleaned = measure.trim();

    // Match patterns like: "1 1/2 oz", "2.5 cl", "1/2 tsp", "3 dashes"
    const regex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.?\d*)\s*(oz|cl|ml|tsp|tbsp|tablespoon|teaspoon|cup|cups|dash|dashes|shot|shots|part|parts|jigger|jiggers|pint|pints|gill|gills|l|litre|liter)\s*(.*)/i;
    const match = cleaned.match(regex);

    if (!match) return null;

    let amount: number;
    const rawAmount = match[1].trim();

    // Handle mixed fractions like "1 1/2"
    if (rawAmount.includes(' ')) {
        const parts = rawAmount.split(' ');
        const whole = parseFloat(parts[0]);
        const fracParts = parts[1].split('/');
        amount = whole + parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    } else if (rawAmount.includes('/')) {
        const fracParts = rawAmount.split('/');
        amount = parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
    } else {
        amount = parseFloat(rawAmount);
    }

    if (isNaN(amount)) return null;

    return {
        amount,
        unit: match[2].toLowerCase(),
        rest: match[3]?.trim() || '',
    };
}

/**
 * Convert a parsed measure to ml
 */
function toMl(amount: number, unit: string): number {
    switch (unit) {
        case 'oz':
            return amount * OZ_TO_ML;
        case 'cl':
            return amount * CL_TO_ML;
        case 'ml':
            return amount;
        case 'tsp':
        case 'teaspoon':
            return amount * TSP_TO_ML;
        case 'tbsp':
        case 'tablespoon':
            return amount * TBSP_TO_ML;
        case 'cup':
        case 'cups':
            return amount * CUP_TO_ML;
        case 'dash':
        case 'dashes':
            return amount * DASH_ML;
        case 'shot':
        case 'shots':
        case 'jigger':
        case 'jiggers':
            return amount * 25; // 1 standard 25ml shot
        case 'part':
        case 'parts':
            return amount * OZ_TO_ML; // treat "parts" as oz
        case 'pint':
        case 'pints':
            return amount * 473.176;
        case 'gill':
        case 'gills':
            return amount * 118.294;
        case 'l':
        case 'litre':
        case 'liter':
            return amount * 1000;
        default:
            return amount * OZ_TO_ML;
    }
}

/**
 * Format a number nicely (round to 1 decimal, drop trailing .0)
 */
function formatNum(n: number): string {
    if (n < 1) {
        // Show fractions for small amounts
        const rounded = Math.round(n * 10) / 10;
        return rounded.toString();
    }
    const rounded = Math.round(n * 10) / 10;
    return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
}

/**
 * Convert a measurement string to the target unit system
 */
export function convertMeasure(measure: string, targetUnit: MeasurementUnit): string {
    if (!measure || !measure.trim()) return measure;

    const parsed = parseMeasure(measure);
    if (!parsed) return measure; // Can't parse — return as-is

    if (targetUnit === 'imperial') {
        // Already imperial units like oz — return original
        if (['oz', 'tsp', 'teaspoon', 'tbsp', 'tablespoon', 'dash', 'dashes', 'cup', 'cups', 'shot', 'shots', 'part', 'parts'].includes(parsed.unit)) {
            return measure;
        }
        // Convert from metric to imperial
        const ml = toMl(parsed.amount, parsed.unit);
        const oz = ml / OZ_TO_ML;
        const suffix = parsed.rest ? ` ${parsed.rest}` : '';

        if (oz < 0.25) {
            // Use tsp for very small amounts
            const tsp = ml / TSP_TO_ML;
            return `${formatNum(tsp)} tsp${suffix}`;
        }
        return `${formatNum(oz)} oz${suffix}`;
    }

    // Convert to metric (ml)
    if (parsed.unit === 'ml') return measure; // Already ml

    const ml = toMl(parsed.amount, parsed.unit);
    const suffix = parsed.rest ? ` ${parsed.rest}` : '';

    if (ml < 5) {
        return `${formatNum(ml)} ml${suffix}`;
    }
    return `${formatNum(ml)} ml${suffix}`;
}

/**
 * Get display label for unit system
 */
export function getUnitLabel(unit: MeasurementUnit): string {
    return unit === 'imperial' ? 'oz' : 'ml';
}
