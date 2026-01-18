/**
 * Pädagogischer Warenkorb - Bundle
 * Alle Komponenten in einer Datei für Bookmarklet-Nutzung
 */

(function() {
  'use strict';

  // Bereits geladen? Dann toggle
  if (document.getElementById('warenkorb-sidebar')) {
    document.getElementById('warenkorb-sidebar').remove();
    var styles = document.getElementById('warenkorb-styles');
    if (styles) styles.remove();
    console.log('🛒 Warenkorb geschlossen');
    return;
  }

  // === PATTERNS ===
  var PATTERNS = {
    frontalunterricht: {
      name: 'Frontalunterricht',
      desc: 'Klassischer lehrerzentrierter Unterricht',
      phases: [
        { icon: '🎯', name: 'Einstieg', desc: 'Motivation, Vorwissen aktivieren', dur: '10 min' },
        { icon: '📚', name: 'Erarbeitung', desc: 'Neuer Stoff wird präsentiert', dur: '20 min' },
        { icon: '📝', name: 'Sicherung', desc: 'Zusammenfassung, Wiederholung', dur: '10 min' },
        { icon: '✏️', name: 'Übung', desc: 'Anwendung und Vertiefung', dur: '15 min' },
        { icon: '🏁', name: 'Abschluss', desc: 'Reflexion, Ausblick', dur: '5 min' }
      ]
    },
    problemorientiert: {
      name: 'Problemorientiertes Lernen',
      desc: 'Lernen durch Lösen authentischer Probleme',
      phases: [
        { icon: '❓', name: 'Problemstellung', desc: 'Authentisches Problem präsentieren', dur: '10 min' },
        { icon: '💡', name: 'Hypothesenbildung', desc: 'Vermutungen sammeln', dur: '10 min' },
        { icon: '🔍', name: 'Recherche', desc: 'Informationen sammeln', dur: '25 min' },
        { icon: '🔧', name: 'Lösungsentwicklung', desc: 'Lösungsansätze erarbeiten', dur: '15 min' },
        { icon: '🎤', name: 'Präsentation', desc: 'Ergebnisse vorstellen', dur: '15 min' }
      ]
    },
    stationenlernen: {
      name: 'Stationenlernen',
      desc: 'Selbstständiges Arbeiten an Stationen',
      phases: [
        { icon: '📋', name: 'Einführung', desc: 'Stationen und Regeln erklären', dur: '10 min' },
        { icon: '1️⃣', name: 'Station 1', desc: 'Erste Lernstation', dur: '15 min' },
        { icon: '2️⃣', name: 'Station 2', desc: 'Zweite Lernstation', dur: '15 min' },
        { icon: '3️⃣', name: 'Station 3', desc: 'Dritte Lernstation', dur: '15 min' },
        { icon: '📊', name: 'Auswertung', desc: 'Ergebnisse zusammentragen', dur: '10 min' }
      ]
    },
    flippedClassroom: {
      name: 'Flipped Classroom',
      desc: 'Theorie zuhause, Anwendung im Unterricht',
      phases: [
        { icon: '🏠', name: 'Vorbereitung', desc: 'Video/Material zur Vorbereitung', dur: 'zuhause' },
        { icon: '❓', name: 'Aktivierung', desc: 'Vorwissen prüfen, Fragen klären', dur: '10 min' },
        { icon: '🎯', name: 'Vertiefung', desc: 'Intensive Übungen', dur: '30 min' },
        { icon: '🛠️', name: 'Projektarbeit', desc: 'Komplexe Aufgaben', dur: '20 min' },
        { icon: '💬', name: 'Feedback', desc: 'Individuelle Rückmeldung', dur: '10 min' }
      ]
    },
    kooperativ: {
      name: 'Kooperatives Lernen',
      desc: 'Think-Pair-Share Methode',
      phases: [
        { icon: '🤔', name: 'Think', desc: 'Individuelles Nachdenken', dur: '5 min' },
        { icon: '👥', name: 'Pair', desc: 'Austausch mit Partner', dur: '10 min' },
        { icon: '🗣️', name: 'Share', desc: 'Ergebnisse im Plenum', dur: '10 min' },
        { icon: '👨‍👩‍👧‍👦', name: 'Gruppenarbeit', desc: 'Vertiefende Aufgabe', dur: '20 min' },
        { icon: '🖼️', name: 'Galeriegang', desc: 'Ergebnisse präsentieren', dur: '15 min' }
      ]
    }
  };

  var currentPattern = 'frontalunterricht';
  var phaseContents = {};

  // === CSS ===
  var CSS = `
    #warenkorb-sidebar {
      position: fixed;
      top: 0;
      right: 0;
      width: 380px;
      height: 100vh;
      background: #ffffff;
      border-left: 1px solid #e2e8f0;
      box-shadow: -4px 0 15px rgba(0,0,0,0.1);
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      color: #1e293b;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
    }
    #warenkorb-sidebar.collapsed {
      transform: translateX(340px);
    }
    #warenkorb-sidebar * {
      box-sizing: border-box;
    }
    .wk-toggle {
      position: absolute;
      left: -44px;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 88px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border: none;
      border-radius: 12px 0 0 12px;
      color: white;
      cursor: pointer;
      font-size: 24px;
      box-shadow: -2px 0 10px rgba(0,0,0,0.15);
    }
    .wk-toggle:hover {
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
    }
    .wk-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      flex-shrink: 0;
    }
    .wk-header h1 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
    }
    .wk-header p {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }
    .wk-search {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
    }
    .wk-search input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .wk-search input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .wk-search button {
      padding: 10px 16px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
    }
    .wk-search button:hover {
      background: #1d4ed8;
    }
    .wk-pattern {
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
    }
    .wk-pattern label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .wk-pattern select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      font-size: 14px;
      cursor: pointer;
      outline: none;
    }
    .wk-pattern select:focus {
      border-color: #2563eb;
    }
    .wk-phases {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    .wk-phase {
      background: #f8fafc;
      border: 2px dashed #e2e8f0;
      border-radius: 10px;
      margin-bottom: 12px;
      transition: all 0.2s;
    }
    .wk-phase.drag-over {
      border-color: #2563eb;
      background: rgba(37,99,235,0.05);
      transform: scale(1.01);
    }
    .wk-phase-head {
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }
    .wk-phase-icon {
      font-size: 22px;
      line-height: 1;
    }
    .wk-phase-info {
      flex: 1;
      min-width: 0;
    }
    .wk-phase-name {
      font-weight: 600;
      font-size: 14px;
      color: #1e293b;
    }
    .wk-phase-desc {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .wk-phase-dur {
      font-size: 11px;
      color: #64748b;
      background: white;
      padding: 4px 10px;
      border-radius: 6px;
      white-space: nowrap;
    }
    .wk-phase-body {
      display: none;
      padding: 0 14px 14px;
    }
    .wk-phase.open .wk-phase-body {
      display: block;
    }
    .wk-drop {
      min-height: 70px;
      background: white;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 12px;
      padding: 16px;
      text-align: center;
    }
    .wk-drop.has-items {
      align-items: stretch;
      padding: 8px;
      gap: 8px;
    }
    .wk-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 13px;
    }
    .wk-item-title {
      flex: 1;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wk-item-remove {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 16px;
      padding: 0;
      opacity: 0.6;
    }
    .wk-item-remove:hover {
      opacity: 1;
    }
    .wk-footer {
      padding: 12px 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 10px;
      flex-shrink: 0;
      background: #f8fafc;
    }
    .wk-btn {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .wk-btn-primary {
      background: #2563eb;
      color: white;
    }
    .wk-btn-primary:hover {
      background: #1d4ed8;
    }
    .wk-btn-secondary {
      background: white;
      color: #475569;
      border: 1px solid #e2e8f0;
    }
    .wk-btn-secondary:hover {
      background: #f1f5f9;
    }
  `;

  // === RENDER ===
  function renderPhases() {
    var p = PATTERNS[currentPattern];
    return p.phases.map(function(ph, i) {
      var items = phaseContents[currentPattern + '-' + i] || [];
      var itemsHtml = items.length > 0 
        ? items.map(function(item, idx) {
            return '<div class="wk-item"><span class="wk-item-title">' + item + '</span><button class="wk-item-remove" data-phase="' + i + '" data-idx="' + idx + '">×</button></div>';
          }).join('')
        : '<span>📦 Inhalte hierher ziehen oder Text eingeben</span>';
      
      return '<div class="wk-phase open" data-phase="' + i + '">' +
        '<div class="wk-phase-head">' +
          '<span class="wk-phase-icon">' + ph.icon + '</span>' +
          '<div class="wk-phase-info">' +
            '<div class="wk-phase-name">' + ph.name + '</div>' +
            '<div class="wk-phase-desc">' + ph.desc + '</div>' +
          '</div>' +
          '<span class="wk-phase-dur">' + ph.dur + '</span>' +
        '</div>' +
        '<div class="wk-phase-body">' +
          '<div class="wk-drop' + (items.length > 0 ? ' has-items' : '') + '" data-phase="' + i + '">' +
            itemsHtml +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function render() {
    var opts = Object.keys(PATTERNS).map(function(k) {
      var sel = k === currentPattern ? ' selected' : '';
      return '<option value="' + k + '"' + sel + '>' + PATTERNS[k].name + '</option>';
    }).join('');

    sidebar.innerHTML = 
      '<button class="wk-toggle" title="Ein-/Ausblenden">🛒</button>' +
      '<div class="wk-header">' +
        '<h1>🛒 Pädagogischer Warenkorb</h1>' +
        '<p>Unterrichtsplanung mit WLO-Inhalten</p>' +
      '</div>' +
      '<div class="wk-search">' +
        '<input type="text" id="wk-q" placeholder="Suchbegriff für WLO...">' +
        '<button id="wk-go">🔍 Suchen</button>' +
      '</div>' +
      '<div class="wk-pattern">' +
        '<label>Ablaufmuster wählen</label>' +
        '<select id="wk-sel">' + opts + '</select>' +
      '</div>' +
      '<div class="wk-phases" id="wk-phases">' + renderPhases() + '</div>' +
      '<div class="wk-footer">' +
        '<button class="wk-btn wk-btn-secondary" id="wk-clear">🗑️ Leeren</button>' +
        '<button class="wk-btn wk-btn-primary" id="wk-print">📄 Drucken</button>' +
      '</div>';

    attachEvents();
  }

  function attachEvents() {
    // Toggle
    sidebar.querySelector('.wk-toggle').onclick = function() {
      sidebar.classList.toggle('collapsed');
    };

    // WLO Suche
    sidebar.querySelector('#wk-go').onclick = function() {
      var q = sidebar.querySelector('#wk-q').value;
      window.open('https://suche.wirlernenonline.de/search/de/search?q=' + encodeURIComponent(q), '_blank');
    };
    sidebar.querySelector('#wk-q').onkeypress = function(e) {
      if (e.key === 'Enter') sidebar.querySelector('#wk-go').click();
    };

    // Pattern wechseln
    sidebar.querySelector('#wk-sel').onchange = function(e) {
      currentPattern = e.target.value;
      sidebar.querySelector('#wk-phases').innerHTML = renderPhases();
      attachPhaseEvents();
    };

    // Buttons
    sidebar.querySelector('#wk-clear').onclick = function() {
      if (confirm('Alle Inhalte löschen?')) {
        phaseContents = {};
        sidebar.querySelector('#wk-phases').innerHTML = renderPhases();
        attachPhaseEvents();
      }
    };
    sidebar.querySelector('#wk-print').onclick = function() {
      var html = generatePrintHTML();
      var win = window.open('', '_blank');
      win.document.write(html);
      win.document.close();
      setTimeout(function() { win.print(); }, 300);
    };

    attachPhaseEvents();
  }

  function attachPhaseEvents() {
    // Phase toggle
    sidebar.querySelectorAll('.wk-phase-head').forEach(function(el) {
      el.onclick = function() {
        el.parentElement.classList.toggle('open');
      };
    });

    // Drop zones
    sidebar.querySelectorAll('.wk-drop').forEach(function(drop) {
      drop.ondragover = function(e) {
        e.preventDefault();
        drop.parentElement.parentElement.classList.add('drag-over');
      };
      drop.ondragleave = function() {
        drop.parentElement.parentElement.classList.remove('drag-over');
      };
      drop.ondrop = function(e) {
        e.preventDefault();
        drop.parentElement.parentElement.classList.remove('drag-over');
        var text = e.dataTransfer.getData('text/plain');
        if (text) {
          addItem(drop.dataset.phase, text.substring(0, 100));
        }
      };
      // Klick zum manuellen Hinzufügen
      drop.ondblclick = function() {
        var text = prompt('Inhalt hinzufügen:');
        if (text) {
          addItem(drop.dataset.phase, text);
        }
      };
    });

    // Remove buttons
    sidebar.querySelectorAll('.wk-item-remove').forEach(function(btn) {
      btn.onclick = function(e) {
        e.stopPropagation();
        var key = currentPattern + '-' + btn.dataset.phase;
        var items = phaseContents[key] || [];
        items.splice(parseInt(btn.dataset.idx), 1);
        phaseContents[key] = items;
        sidebar.querySelector('#wk-phases').innerHTML = renderPhases();
        attachPhaseEvents();
      };
    });
  }

  function addItem(phaseIdx, text) {
    var key = currentPattern + '-' + phaseIdx;
    if (!phaseContents[key]) phaseContents[key] = [];
    phaseContents[key].push(text);
    sidebar.querySelector('#wk-phases').innerHTML = renderPhases();
    attachPhaseEvents();
  }

  function generatePrintHTML() {
    var p = PATTERNS[currentPattern];
    var phasesHtml = p.phases.map(function(ph, i) {
      var items = phaseContents[currentPattern + '-' + i] || [];
      return '<div style="border:1px solid #e2e8f0;border-radius:8px;margin-bottom:16px;overflow:hidden;">' +
        '<div style="background:#f1f5f9;padding:12px 16px;display:flex;align-items:center;gap:12px;">' +
          '<span style="font-size:20px;">' + ph.icon + '</span>' +
          '<div style="flex:1;"><strong>' + ph.name + '</strong><br><small style="color:#64748b;">' + ph.desc + '</small></div>' +
          '<span style="color:#64748b;">' + ph.dur + '</span>' +
        '</div>' +
        '<div style="padding:16px;">' +
          (items.length > 0 
            ? '<ul style="margin:0;padding-left:20px;">' + items.map(function(it) { return '<li>' + it + '</li>'; }).join('') + '</ul>'
            : '<em style="color:#94a3b8;">Keine Inhalte zugeordnet</em>') +
        '</div>' +
      '</div>';
    }).join('');

    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Unterrichtsentwurf</title></head><body style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;">' +
      '<h1 style="color:#1d4ed8;">📋 Unterrichtsentwurf</h1>' +
      '<p style="background:#f1f5f9;padding:12px 16px;border-radius:8px;"><strong>' + p.name + '</strong> – ' + p.desc + '</p>' +
      '<h2>Unterrichtsverlauf</h2>' +
      phasesHtml +
      '<p style="text-align:center;color:#94a3b8;margin-top:40px;font-size:12px;">Erstellt mit dem Pädagogischen Warenkorb • wirlernenonline.de</p>' +
    '</body></html>';
  }

  // === INIT ===
  var style = document.createElement('style');
  style.id = 'warenkorb-styles';
  style.textContent = CSS;
  document.head.appendChild(style);

  var sidebar = document.createElement('div');
  sidebar.id = 'warenkorb-sidebar';
  document.body.appendChild(sidebar);

  render();

  console.log('🛒 Pädagogischer Warenkorb geladen!');
  console.log('   Doppelklick auf Dropzone = manuell hinzufügen');
  console.log('   Text auf Dropzone ziehen = Drag & Drop');

})();
