// calculator.js
// Global CALCULATOR object for CO2 emission calculations


// CALCULATOR: global object for all emission and credit calculations
var Calculator = {
  /**
   * Calculates CO2 emissions for a given distance and transport mode
   * @param {number} distanceKM - Distance in kilometers
   * @param {string} transportMode - One of 'bicycle', 'car', 'bus', 'truck'
   * @returns {number} Emissions in kg CO2, rounded to 2 decimals
   */
  calculateEmissions: function(distanceKM, transportMode) {
    if (!window.CONFIG || !CONFIG.EMISSION_FACTORS) return 0;
    var factor = CONFIG.EMISSION_FACTORS[transportMode] || 0;
    var result = Number(distanceKM) * factor;
    return Math.round(result * 100) / 100;
  },

  /**
   * Calculates emissions for all transport modes for a given distance.
   * Returns an array of objects: [{ mode, emission, percentageVsCar } ...], sorted by emission ascending.
   * percentageVsCar: 100 for car, 0 for zero emission, >100 for higher than car.
   * @param {number} distanceKM
   * @returns {Array<{mode: string, emission: number, percentageVsCar: number}>}
   */
  calculateAllModes: function(distanceKM) {
    if (!window.CONFIG || !CONFIG.EMISSION_FACTORS) return [];
    var results = [];
    var carEmission = Calculator.calculateEmissions(distanceKM, 'car');

    for (var mode in CONFIG.EMISSION_FACTORS) {
      var emission = this.calculateEmissions(distanceKM, mode);

      var percentageVsCar = null;

      // If car baseline is available and non-zero, compute percentage vs car
      if (
        carEmission !== null &&
        typeof carEmission === "number" &&
        carEmission !== 0
      ) {
        percentageVsCar = (emission / carEmission) * 100; // compute raw percentage
        percentageVsCar = Math.round(percentageVsCar * 100) / 100; // round to 2 decimals
      } else if (carEmission === 0 && emission === 0) {
        // both zero: define as 100% (equivalent)
        percentageVsCar = 100;
      } else {
        // baseline missing or carEmission is zero while emission > 0 => undefined percentage
        percentageVsCar = null;
      }

       results.push({
        mode: mode,
        emission: emission,
        percentageVsCar: percentageVsCar,
      });
    }
    // Sort by emission ascending
    results.sort(function(a, b) { return a.emission - b.emission; });
    return results;
  },

  /**
   * Calculates savings in kg and percent compared to a baseline emission
   * @param {number} emission - Emission for selected mode
   * @param {number} baselineEmission - Baseline emission (e.g., car)
   * @returns {{savedKg: number, percentage: number}}
   */
  calculateSavings: function(emission, baselineEmission) {
    var saved = baselineEmission - emission;
    var percent = baselineEmission > 0 ? (saved / baselineEmission) * 100 : 0;
    return {
      savedKg: Math.round(saved * 100) / 100,
      percentage: Math.round(percent * 100) / 100
    };
  },

  /**
   * Calculates the number of carbon credits needed for a given emission (kg)
   * @param {number} emissionKg
   * @returns {number} Number of credits, rounded to 4 decimals
   */
  calculateCarbonCredits: function(emissionKg) {
    if (!window.CONFIG || !CONFIG.CARBON_CREDIT) return 0;
    var credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
    return Math.round(credits * 10000) / 10000;
  },

  /**
   * Estimates the price range for a given number of carbon credits
   * @param {number} credits
   * @returns {{min: number, max: number, average: number}}
   */
  estimateCreditPrice: function(credits) {
    if (!window.CONFIG || !CONFIG.CARBON_CREDIT) return { min: 0, max: 0, average: 0 };
    var min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
    var max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
    var average = (min + max) / 2;
    return {
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      average: Math.round(average * 100) / 100
    };
  }
};

// Usage example:
// CALCULATOR.calculateEmissions(100, 'car');
// CALCULATOR.calculateAllModes(100);
