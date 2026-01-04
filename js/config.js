// config.js
// Global CONFIG object for emission factors, transport metadata, carbon credit info, and UI helpers

var CONFIG = {
  // Emission factors in kg CO2 per km
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96
  },

  // Transport mode metadata
  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicicleta",
      icon: "🚲",
      color: "#10b981"
    },
    car: {
      label: "Carro",
      icon: "🚗",
      color: "#059669"
    },
    bus: {
      label: "Ônibus",
      icon: "🚌",
      color: "#34d399"
    },
    truck: {
      label: "Caminhão",
      icon: "🚚",
      color: "#f59e0b"
    }
  },

  // Carbon credit info
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150
  },

  /**
   * Populates the datalist with all cities from RoutesDB
   */
  populateDatalist: function() {
    if (!window.RoutesDB) return;
    var cities = RoutesDB.getAllCities();
    var datalist = document.getElementById('cities-list');
    if (!datalist) return;
    datalist.innerHTML = '';
    cities.forEach(function(city) {
      var opt = document.createElement('option');
      opt.value = city;
      datalist.appendChild(opt);
    });
  },

  /**
   * Sets up autofill for distance input based on selected cities
   */
  setupDistanceAutoFill: function() {
    var originInput = document.getElementById('origin');
    var destInput = document.getElementById('destination');
    var distanceInput = document.getElementById('distance');
    var manualCheckbox = document.getElementById('manual-distance');
    var helper = document.querySelector('.calculator__helper');
    if (!originInput || !destInput || !distanceInput || !manualCheckbox || !helper) return;

    function updateDistance() {
      var origin = originInput.value.trim();
      var dest = destInput.value.trim();
      if (origin && dest) {
        var dist = window.RoutesDB ? RoutesDB.findDistance(origin, dest) : null;
        if (dist != null) {
          distanceInput.value = dist;
          distanceInput.readOnly = true;
          helper.textContent = 'Distância encontrada automaticamente';
          helper.style.color = '#10b981'; // green
        } else {
          distanceInput.value = '';
          helper.textContent = 'Distância não encontrada. Insira manualmente.';
          helper.style.color = '#ef4444'; // red
        }
      } else {
        distanceInput.value = '';
        helper.textContent = 'A distância será preenchida automaticamente';
        helper.style.color = '';
      }
    }

    originInput.addEventListener('change', updateDistance);
    destInput.addEventListener('change', updateDistance);

    manualCheckbox.addEventListener('change', function() {
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;
        helper.textContent = 'Insira a distância manualmente';
        helper.style.color = '#3b82f6'; // info blue
      } else {
        updateDistance();
      }
    });
  }
};

// Usage example:
// CONFIG.populateDatalist();
// CONFIG.setupDistanceAutoFill();
