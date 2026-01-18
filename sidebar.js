/**
 * Pädagogischer Warenkorb - Sidebar Controller
 * Hauptlogik für die Unterrichtsplanungs-Sidebar
 */

class WarenkorbSidebar {
  constructor() {
    this.currentPattern = null;
    this.phases = [];
    this.selectedDifferentiation = [];
    this.metadata = {
      title: '',
      subject: '',
      grade: '',
      duration: ''
    };
    this.isCollapsed = false;
    this.container = null;
  }

  /**
   * Initialisiert die Sidebar
   */
  init() {
    // CSS einbinden
    this.injectStyles();
    
    // Sidebar erstellen
    this.render();
    
    // Event Listener hinzufügen
    this.attachEventListeners();
    
    // WLO-Overlay hinzufügen, wenn auf WLO-Seite
    if (this.isWLOPage()) {
      this.addWLOOverlays();
    }
    
    // Standard-Muster laden
    this.selectPattern('frontalunterricht');
    
    console.log('🛒 Pädagogischer Warenkorb initialisiert');
  }

  /**
   * Prüft ob wir auf einer WLO-Seite sind
   */
  isWLOPage() {
    return window.location.hostname.includes('wirlernenonline') ||
           window.location.hostname.includes('openeduhub');
  }

  /**
   * Injiziert CSS Styles
   */
  injectStyles() {
    if (document.getElementById('warenkorb-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'warenkorb-styles';
    style.textContent = WARENKORB_CSS;
    document.head.appendChild(style);
  }

  /**
   * Rendert die Sidebar
   */
  render() {
    // Existierende Sidebar entfernen
    const existing = document.getElementById('warenkorb-sidebar');
    if (existing) existing.remove();

    // Container erstellen
    this.container = document.createElement('div');
    this.container.id = 'warenkorb-sidebar';
    this.container.innerHTML = this.getTemplate();
    document.body.appendChild(this.container);
  }

  /**
   * Gibt das HTML-Template zurück
   */
  getTemplate() {
    const patternOptions = Object.values(TEACHING_PATTERNS)
      .map(p => `<option value="${p.id}">${p.name}</option>`)
      .join('');

    return `
      <button class="wk-toggle-btn" title="Sidebar ein-/ausblenden">🛒</button>
      
      <div class="wk-header">
        <h1>🛒 Pädagogischer Warenkorb</h1>
        <p>Unterrichtsplanung mit WLO-Inhalten</p>
      </div>

      <div class="wk-search-link">
        <input type="text" id="wk-search-input" placeholder="Suchbegriff eingeben...">
        <button id="wk-search-btn" title="In WLO suchen">🔍 Suchen</button>
      </div>

      <div class="wk-pattern-selector">
        <label>Ablaufmuster</label>
        <select id="wk-pattern-select">
          ${patternOptions}
        </select>
      </div>

      <div class="wk-phases" id="wk-phases-container">
        <!-- Phasen werden dynamisch eingefügt -->
      </div>

      <div class="wk-differentiation">
        <label>Binnendifferenzierung</label>
        <div class="wk-diff-options" id="wk-diff-options">
          ${this.getDifferentiationTags()}
        </div>
      </div>

      <div class="wk-footer">
        <button class="wk-btn wk-btn-secondary" id="wk-clear-btn">
          🗑️ Leeren
        </button>
        <button class="wk-btn wk-btn-primary" id="wk-export-btn">
          📄 PDF Export
        </button>
      </div>
    `;
  }

  /**
   * Generiert Differenzierungs-Tags
   */
  getDifferentiationTags() {
    const allOptions = [];
    
    // Förderbedarf
    if (DIFFERENTIATION_OPTIONS.foerderbedarf?.needs) {
      DIFFERENTIATION_OPTIONS.foerderbedarf.needs.forEach(need => {
        allOptions.push(`
          <label class="wk-diff-tag" data-diff-id="${need.id}" data-diff-hint="${need.hint}">
            <input type="checkbox" value="${need.id}">
            ${need.name}
          </label>
        `);
      });
    }

    // Leistungsniveaus
    if (DIFFERENTIATION_OPTIONS.leistung?.levels) {
      DIFFERENTIATION_OPTIONS.leistung.levels.forEach(level => {
        allOptions.push(`
          <label class="wk-diff-tag" data-diff-id="${level.id}" data-diff-hint="${level.hint}">
            <input type="checkbox" value="${level.id}">
            ${level.name}
          </label>
        `);
      });
    }

    return allOptions.join('');
  }

  /**
   * Rendert die Phasen des ausgewählten Musters
   */
  renderPhases() {
    const container = document.getElementById('wk-phases-container');
    if (!container || !this.currentPattern) return;

    container.innerHTML = this.currentPattern.phases.map((phase, index) => `
      <div class="wk-phase expanded" data-phase-id="${phase.id}" data-phase-index="${index}">
        <div class="wk-phase-header">
          <span class="wk-phase-icon">${phase.icon}</span>
          <div class="wk-phase-info">
            <div class="wk-phase-name">${phase.name}</div>
            <div class="wk-phase-meta">${phase.description}</div>
          </div>
          <span class="wk-phase-duration">${phase.duration}</span>
          <button class="wk-phase-toggle">▼</button>
        </div>
        <div class="wk-phase-content">
          <div class="wk-dropzone" data-phase-id="${phase.id}">
            <div class="wk-dropzone-hint">
              <span>📦</span>
              Inhalte hierher ziehen<br>oder automatisch suchen
            </div>
          </div>
          <div class="wk-auto-search">
            <input type="text" placeholder="Suchbegriff für ${phase.name}..." data-phase-id="${phase.id}">
            <button data-phase-id="${phase.id}">🔍 Auto</button>
          </div>
        </div>
      </div>
    `).join('');

    // Phasen-Daten initialisieren
    this.phases = this.currentPattern.phases.map(phase => ({
      ...phase,
      items: []
    }));
  }

  /**
   * Wählt ein Ablaufmuster aus
   */
  selectPattern(patternId) {
    this.currentPattern = TEACHING_PATTERNS[patternId];
    if (this.currentPattern) {
      this.renderPhases();
      this.setupDropZones();
    }
  }

  /**
   * Richtet Drag & Drop für die Dropzones ein
   */
  setupDropZones() {
    const dropzones = document.querySelectorAll('.wk-dropzone');
    
    dropzones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.closest('.wk-phase').classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.closest('.wk-phase').classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.closest('.wk-phase').classList.remove('drag-over');
        
        try {
          const data = JSON.parse(e.dataTransfer.getData('application/json'));
          this.addItemToPhase(zone.dataset.phaseId, data);
        } catch (err) {
          // Fallback: Text-Daten
          const text = e.dataTransfer.getData('text/plain');
          if (text) {
            this.addItemToPhase(zone.dataset.phaseId, {
              id: 'manual-' + Date.now(),
              title: text.substring(0, 100),
              type: '📎 Link',
              url: text.startsWith('http') ? text : ''
            });
          }
        }
      });
    });
  }

  /**
   * Fügt ein Item zu einer Phase hinzu
   */
  addItemToPhase(phaseId, item) {
    const phaseIndex = this.phases.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return;

    // Item zur Phase hinzufügen
    this.phases[phaseIndex].items.push(item);

    // UI aktualisieren
    this.renderPhaseItems(phaseId);
  }

  /**
   * Entfernt ein Item aus einer Phase
   */
  removeItemFromPhase(phaseId, itemId) {
    const phaseIndex = this.phases.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return;

    this.phases[phaseIndex].items = this.phases[phaseIndex].items.filter(
      item => item.id !== itemId
    );

    this.renderPhaseItems(phaseId);
  }

  /**
   * Rendert die Items einer Phase
   */
  renderPhaseItems(phaseId) {
    const phase = this.phases.find(p => p.id === phaseId);
    const dropzone = document.querySelector(`.wk-dropzone[data-phase-id="${phaseId}"]`);
    
    if (!phase || !dropzone) return;

    if (phase.items.length === 0) {
      dropzone.innerHTML = `
        <div class="wk-dropzone-hint">
          <span>📦</span>
          Inhalte hierher ziehen<br>oder automatisch suchen
        </div>
      `;
      dropzone.classList.remove('has-items');
    } else {
      dropzone.innerHTML = phase.items.map(item => `
        <div class="wk-content-item" draggable="true" data-item-id="${item.id}">
          ${item.thumbnail ? `<img src="${item.thumbnail}" alt="">` : ''}
          <div class="wk-content-item-info">
            <div class="wk-content-item-title">${item.title}</div>
            <div class="wk-content-item-type">${item.type}</div>
          </div>
          <button class="wk-content-item-remove" data-phase-id="${phaseId}" data-item-id="${item.id}">✕</button>
        </div>
      `).join('');
      dropzone.classList.add('has-items');

      // Remove-Button Events
      dropzone.querySelectorAll('.wk-content-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.removeItemFromPhase(btn.dataset.phaseId, btn.dataset.itemId);
        });
      });
    }
  }

  /**
   * Automatische Suche für eine Phase
   */
  async autoSearchForPhase(phaseId, query) {
    if (!query.trim()) return;

    try {
      const results = await WLO_API.search(query, { maxItems: 3 });
      results.forEach(item => {
        this.addItemToPhase(phaseId, item);
      });
    } catch (error) {
      console.error('Auto-Suche fehlgeschlagen:', error);
    }
  }

  /**
   * Fügt Warenkorb-Overlays zu WLO-Karten hinzu
   */
  addWLOOverlays() {
    // Beobachter für dynamisch geladene Karten
    const observer = new MutationObserver(() => {
      this.injectOverlayButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial ausführen
    setTimeout(() => this.injectOverlayButtons(), 1000);
  }

  /**
   * Injiziert Overlay-Buttons in WLO-Karten
   */
  injectOverlayButtons() {
    // Verschiedene Selektoren für WLO-Kacheln
    const cardSelectors = [
      '.result-card',
      '.edu-sharing-card',
      '[class*="card"]',
      '.search-result-item'
    ];

    cardSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(card => {
        if (card.querySelector('.wk-add-overlay')) return;
        
        // Positionierung für Overlay
        const style = window.getComputedStyle(card);
        if (style.position === 'static') {
          card.style.position = 'relative';
        }

        // Button erstellen
        const btn = document.createElement('button');
        btn.className = 'wk-add-overlay';
        btn.innerHTML = '🛒';
        btn.title = 'Zum Warenkorb hinzufügen';
        
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.addCardToCurrentPhase(card);
        });

        card.appendChild(btn);
      });
    });
  }

  /**
   * Fügt eine WLO-Karte zur ersten leeren Phase hinzu
   */
  addCardToCurrentPhase(card) {
    // Daten aus der Karte extrahieren
    const title = card.querySelector('h2, h3, .title, [class*="title"]')?.textContent?.trim() || 
                  card.querySelector('a')?.textContent?.trim() ||
                  'Unbenannter Inhalt';
    
    const description = card.querySelector('p, .description, [class*="desc"]')?.textContent?.trim() || '';
    const url = card.querySelector('a')?.href || '';
    const thumbnail = card.querySelector('img')?.src || '';

    const item = {
      id: 'wlo-' + Date.now(),
      title: title,
      description: description,
      url: url,
      thumbnail: thumbnail,
      type: '📦 WLO-Inhalt'
    };

    // Erste Phase mit weniger als 3 Items finden
    const targetPhase = this.phases.find(p => p.items.length < 3) || this.phases[0];
    if (targetPhase) {
      this.addItemToPhase(targetPhase.id, item);
      this.showNotification(`"${title}" hinzugefügt zu "${targetPhase.name}"`);
    }
  }

  /**
   * Zeigt eine Benachrichtigung
   */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 400px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000000;
      animation: wk-fade-in 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Registriert alle Event Listener
   */
  attachEventListeners() {
    // Toggle Sidebar
    this.container.querySelector('.wk-toggle-btn').addEventListener('click', () => {
      this.isCollapsed = !this.isCollapsed;
      this.container.classList.toggle('collapsed', this.isCollapsed);
    });

    // Pattern Auswahl
    document.getElementById('wk-pattern-select').addEventListener('change', (e) => {
      this.selectPattern(e.target.value);
    });

    // WLO Suche
    document.getElementById('wk-search-btn').addEventListener('click', () => {
      const query = document.getElementById('wk-search-input').value;
      WLO_API.openSearch(query);
    });

    document.getElementById('wk-search-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        WLO_API.openSearch(e.target.value);
      }
    });

    // Phase Toggle
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.wk-phase-header')) {
        const phase = e.target.closest('.wk-phase');
        phase.classList.toggle('expanded');
      }
    });

    // Auto-Search Buttons
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('.wk-auto-search button');
      if (btn) {
        const phaseId = btn.dataset.phaseId;
        const input = this.container.querySelector(`.wk-auto-search input[data-phase-id="${phaseId}"]`);
        if (input) {
          this.autoSearchForPhase(phaseId, input.value);
        }
      }
    });

    // Differenzierung Tags
    this.container.querySelectorAll('.wk-diff-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('active');
        this.updateDifferentiation();
      });
    });

    // Clear Button
    document.getElementById('wk-clear-btn').addEventListener('click', () => {
      if (confirm('Alle Inhalte aus den Phasen entfernen?')) {
        this.phases.forEach(phase => {
          phase.items = [];
          this.renderPhaseItems(phase.id);
        });
      }
    });

    // Export Button
    document.getElementById('wk-export-btn').addEventListener('click', () => {
      this.exportToPDF();
    });
  }

  /**
   * Aktualisiert die ausgewählte Differenzierung
   */
  updateDifferentiation() {
    this.selectedDifferentiation = [];
    
    this.container.querySelectorAll('.wk-diff-tag.active').forEach(tag => {
      this.selectedDifferentiation.push({
        id: tag.dataset.diffId,
        name: tag.textContent.trim(),
        hint: tag.dataset.diffHint
      });
    });
  }

  /**
   * Exportiert den Unterrichtsentwurf als PDF
   */
  exportToPDF() {
    const lessonPlan = {
      pattern: {
        id: this.currentPattern.id,
        name: this.currentPattern.name,
        description: this.currentPattern.description
      },
      phases: this.phases,
      differentiation: this.selectedDifferentiation,
      metadata: this.metadata
    };

    PDFExport.openPrintView(lessonPlan);
  }

  /**
   * Entfernt die Sidebar
   */
  destroy() {
    if (this.container) {
      this.container.remove();
    }
    const styles = document.getElementById('warenkorb-styles');
    if (styles) {
      styles.remove();
    }
  }
}

// CSS als String für Injection
const WARENKORB_CSS = `/* Inline CSS - wird bei Bedarf durch externe Datei ersetzt */`;

// Globale Instanz
let warenkorbInstance = null;

/**
 * Initialisiert den Pädagogischen Warenkorb
 */
function initWarenkorb() {
  if (warenkorbInstance) {
    warenkorbInstance.destroy();
  }
  warenkorbInstance = new WarenkorbSidebar();
  warenkorbInstance.init();
  return warenkorbInstance;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WarenkorbSidebar, initWarenkorb };
}
