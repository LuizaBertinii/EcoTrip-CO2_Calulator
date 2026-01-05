// app.js
// Initialization and event handling for CO2 Calculator

(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // 1. Populate city autocomplete datalist
    if (window.CONFIG && typeof CONFIG.populateDatalist === 'function') {
      CONFIG.populateDatalist();
    }
    // 2. Enable auto-distance feature
    if (window.CONFIG && typeof CONFIG.setupDistanceAutoFill === 'function') {
      CONFIG.setupDistanceAutoFill();
    }
    // 3. Get the calculator form element
    var form = document.getElementById('calculator-form');
    if (!form) return;
    // 4. Add submit event listener to the form
    form.addEventListener('submit', function(e) {
      // --- FORM SUBMIT HANDLER ---
      e.preventDefault(); // Prevent default form submission
      // 1. Get all form values
      var origin = (form.origin && form.origin.value.trim()) || '';
      var destination = (form.destination && form.destination.value.trim()) || '';
      var distance = (form.distance && parseFloat(form.distance.value)) || 0;
      var transportMode = '';
      var radios = form.querySelectorAll('input[name="transport"]');
      radios.forEach(function(radio) {
        if (radio.checked) transportMode = radio.value;
      });
      // 2. Validate inputs
      if (!origin || !destination || !distance || distance <= 0) {
        alert('Por favor, preencha origem, destino e uma distância válida.');
        return;
      }
      // 3. Get submit button
      var submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) return;
      // 4. Show loading state
      if (window.UI && typeof UI.showLoading === 'function') {
        UI.showLoading(submitButton);
      }
      // 5. Hide previous results
      if (window.UI) {
        UI.hideElement('results');
        UI.hideElement('comparison');
        UI.hideElement('carbon-credits');
      }
      // 6. Simulate processing delay
      setTimeout(function() {
        try {
          // --- CALCULATION & RENDERING ---
          // Calculate emission for selected mode
          var emission = window.Calculator ? Calculator.calculateEmissions(distance, transportMode) : 0;
          // Calculate car emission as baseline
          var carEmission = window.Calculator ? Calculator.calculateEmissions(distance, 'car') : 0;
          // Calculate savings compared to car
          var savings = window.Calculator ? Calculator.calculateSavings(emission, carEmission) : null;
          // Calculate all modes for comparison
          console.log(window.Calculator);
          var modesArray = window.Calculator ? Calculator.calculateAllModes(distance) : [];
          // Calculate carbon credits and price estimate
          var credits = window.Calculator ? Calculator.calculateCarbonCredits(emission) : 0;
          var price = window.Calculator ? Calculator.estimateCreditPrice(credits) : { min: 0, max: 0, average: 0 };
          // Build data objects for rendering
          var resultData = {
            origin: origin,
            destination: destination,
            distance: distance,
            emission: emission,
            mode: transportMode,
            savings: savings
          };
          var creditsData = {
            credits: credits,
            price: price
          };
          // Render results
          if (window.UI) {
            var resultsContent = document.getElementById('results-content');
            var comparisonContent = document.getElementById('comparison-content');
            var carbonCreditsContent = document.getElementById('carbon-credits-content');
            if (resultsContent) resultsContent.innerHTML = UI.renderResult(resultData);
            console.log('Modes Array for Comparison:', modesArray);
            if (comparisonContent) comparisonContent.innerHTML = UI.renderComparison(modesArray, transportMode);
            if (carbonCreditsContent) carbonCreditsContent.innerHTML = UI.renderCarbonCredits(creditsData);
            // Show all result sections
            UI.showElement('results');
            UI.showElement('comparison');
            UI.showElement('carbon-credits');
            // Scroll to results
            UI.scrollToElement('results');
            // Hide loading
            UI.hideLoading(submitButton);
          }
        } catch (err) {
          // Error handling
          console.error('Erro ao calcular emissões:', err);
          alert('Ocorreu um erro ao calcular as emissões. Tente novamente.');
          if (window.UI && typeof UI.hideLoading === 'function') {
            UI.hideLoading(submitButton);
          }
        }
      }, 1500);
    });
    // 5. Log to console
    console.log('Calculadora finalizada');
  });
})();
