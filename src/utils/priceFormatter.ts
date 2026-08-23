import type { Property } from "../types/property";

export const getPricePerUnitDisplay = (property: Property): string | null => {
  const unitsToSqYards: Record<string, number> = {
    "sq. yards": 1,
    "sq. yard": 1,
    "sq. feet": 1 / 9,
    "sq. ft": 1 / 9,
    "acres": 4840,
    "acre": 4840,
    "guntas": 121,
    "cents": 48.4,
    "cent": 48.4,
    "hectares": 11959.9,
    "hectare": 11959.9,
    "bigha": 3025,
  };

  const formatUnit = (val: number) => {
    return val >= 100000 
      ? `₹${(val / 100000).toFixed(2)} Lac` 
      : `₹${Math.round(val).toLocaleString()}`;
  };

  if (property.pricePerUnit) {
    const targetUnit = property.pricePerUnit.toLowerCase().trim();
    
    // Check if the provided pricePerUnit is one of our known standard units
    if (unitsToSqYards[targetUnit] && property.price && property.area && property.areaUnit) {
      const sourceUnit = property.areaUnit.toLowerCase().trim();
      if (unitsToSqYards[sourceUnit]) {
        // Convert to base (Sq. Yards)
        const areaInSqYards = property.area * unitsToSqYards[sourceUnit];
        // Convert to target
        const areaInTarget = areaInSqYards / unitsToSqYards[targetUnit];
        const perUnitValue = property.price / areaInTarget;
        
        // Capitalize unit beautifully (e.g. "sq. feet" -> "Sq. Feet")
        const displayUnit = property.pricePerUnit
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ')
          .replace('Sq. ', 'Sq.');

        return `${formatUnit(perUnitValue)} / ${displayUnit}`;
      }
    }
    // Fallback: If it's a custom string like "₹2500 / Custom" or a unit we couldn't convert, return verbatim.
    return property.pricePerUnit;
  }

  // Auto-calculate using the property's base areaUnit if pricePerUnit is empty
  if (property.price && property.area && property.areaUnit) {
    const perUnitValue = property.price / property.area;
    return `${formatUnit(perUnitValue)} / ${property.areaUnit.replace('Sq. ', 'Sq.')}`;
  }

  return null;
};
