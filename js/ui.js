// ui.js
// Global UI object for utility and rendering methods

var UI = {
  /**
   * Formats a number with fixed decimals and thousand separators
   * @param {number} number
   * @param {number} decimals
   * @returns {string}
   */
  formatNumber: function(number, decimals) {
    if (typeof number !== 'number' || isNaN(number)) return '';
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  /**
   * Formats a value as Brazilian Real currency
   * @param {number} value
   * @returns {string}
   */
  formatCurrency: function(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  },

  /**
   * Shows an element by removing 'hidden' class
   * @param {string} elementId
   */
  showElement: function(elementId) {
    var el = document.getElementById(elementId);
    if (el) el.classList.remove('hidden');
  },

  /**
   * Hides an element by adding 'hidden' class
   * @param {string} elementId
   */
  hideElement: function(elementId) {
    var el = document.getElementById(elementId);
    if (el) el.classList.add('hidden');
  },

  /**
   * Scrolls smoothly to an element by ID
   * @param {string} elementId
   */
  scrollToElement: function(elementId) {
    var el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },

  /**
   * Renders the result card HTML for a route calculation
   * @param {object} data - { origin, destination, distance, emission, mode, savings }
   * @returns {string} HTML string
   */
  renderResult: function(data) {
    var modeMeta = window.CONFIG ? CONFIG.TRANSPORT_MODES[data.mode] : null;
    var html = '';
    // Route card
    html += `<div class="results__card results__card--route">
      <span class="results__route">${data.origin} <span class="results__arrow">→</span> ${data.destination}</span>
    </div>`;
    // Distance card
    html += `<div class="results__card results__card--distance">
      <span class="results__label">Distância</span>
      <span class="results__value">${UI.formatNumber(data.distance, 1)} km</span>
    </div>`;
    // Emission card
    html += `<div class="results__card results__card--emission">
      <span class="results__label">Emissão de CO₂</span>
      <span class="results__value"><span class="results__icon">🌱</span> ${UI.formatNumber(data.emission, 2)} kg</span>
    </div>`;
    // Transport card
    if (modeMeta) {
      html += `<div class="results__card results__card--transport">
        <span class="results__label">Transporte</span>
        <span class="results__mode"><span class="results__icon">${modeMeta.icon}</span> ${modeMeta.label}</span>
      </div>`;
    }
    // Savings card (if not car and savings exist)
    if (data.mode !== 'car' && data.savings && data.savings.savedKg > 0) {
      html += `<div class="results__card results__card--savings">
        <span class="results__label">Economia</span>
        <span class="results__value">${UI.formatNumber(data.savings.savedKg, 2)} kg (${UI.formatNumber(data.savings.percentage, 2)}%)</span>
      </div>`;
    }
    return html;
  },

  /**
   * Renders comparison cards for all transport modes
   * @param {Array} modesArray - from CALCULATOR.calculateAllModes()
   * @param {string} selectedMode
   * @returns {string} HTML string
   */
  renderComparison: function(modesArray, selectedMode) {
    var maxEmission = Math.max.apply(null, modesArray.map(m => m.emission));
    var html = '';
    modesArray.forEach(function(m) {
      var meta = window.CONFIG ? CONFIG.TRANSPORT_MODES[m.mode] : null;
      var selected = m.mode === selectedMode;
      var barPercent = maxEmission > 0 ? (m.emission / maxEmission) * 100 : 0;
      var barColor = '#10b981'; // green
      if (barPercent > 100) barColor = '#ef4444'; // red
      else if (barPercent > 75) barColor = '#f59e0b'; // orange
      else if (barPercent > 25) barColor = '#facc15'; // yellow
      html += `<div class="comparison__item${selected ? ' comparison__item--selected' : ''}">
        <div class="comparison__header">
          <span class="comparison__icon">${meta ? meta.icon : ''}</span>
          <span class="comparison__label">${meta ? meta.label : m.mode}</span>
          <span class="comparison__emission">${UI.formatNumber(m.emission, 2)} kg CO₂</span>
          ${selected ? '<span class="comparison__badge">Selecionado</span>' : ''}
        </div>
        <div class="comparison__stats">
          <span class="comparison__percent">${UI.formatNumber(m.percentageVsCar, 2)}% vs Carro</span>
          <div class="comparison__bar" style="width:${barPercent}%;background:${barColor};height:8px;border-radius:4px;"></div>
        </div>
      </div>`;
    });
    html += `<div class="comparison__tip">
      <span class="comparison__tip-text">Dica: Modos de transporte mais ecológicos ajudam a reduzir sua pegada de carbono!</span>
    </div>`;
    return html;
  },

  /**
   * Renders carbon credit info cards
   * @param {object} creditsData - { credits, price: {min, max, average} }
   * @returns {string} HTML string
   */
  renderCarbonCredits: function(creditsData) {
    var html = '';
    html += `<div class="carbon__grid">
      <div class="carbon__card carbon__card--credits">
        <span class="carbon__label">Créditos Necessários</span>
        <span class="carbon__value">${UI.formatNumber(creditsData.credits, 4)}</span>
        <span class="carbon__helper">1 crédito = 1000 kg CO₂</span>
      </div>
      <div class="carbon__card carbon__card--price">
        <span class="carbon__label">Preço estimado</span>
        <span class="carbon__value">${UI.formatCurrency(creditsData.price.average)}</span>
        <span class="carbon__helper">Faixa: ${UI.formatCurrency(creditsData.price.min)} - ${UI.formatCurrency(creditsData.price.max)}</span>
      </div>
    </div>
    <div class="carbon__info">
      <span class="carbon__info-text">Créditos de carbono são certificados que representam a compensação de emissões de CO₂. Ao adquirir créditos, você apoia projetos ambientais que removem ou evitam emissões de gases de efeito estufa.</span>
    </div>
    <button class="carbon__button" type="button">Compensar Emissões</button>`;
    return html;
  },

  /**
   * Shows loading spinner and disables button
   * @param {HTMLElement} buttonElement
   */
  showLoading: function(buttonElement) {
    if (!buttonElement) return;
    buttonElement.dataset.originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  /**
   * Hides loading spinner and restores button text
   * @param {HTMLElement} buttonElement
   */
  hideLoading: function(buttonElement) {
    if (!buttonElement) return;
    buttonElement.disabled = false;
    if (buttonElement.dataset.originalText) {
      buttonElement.innerHTML = buttonElement.dataset.originalText;
      delete buttonElement.dataset.originalText;
    }
  }
};

// All methods are part of the global UI object
// Utility methods: formatNumber, formatCurrency, showElement, hideElement, scrollToElement
// Rendering methods: renderResult, renderComparison, renderCarbonCredits
// Loading methods: showLoading, hideLoading
