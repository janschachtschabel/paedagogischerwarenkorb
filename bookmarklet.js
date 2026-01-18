/**
 * Bookmarklet für den Pädagogischen Warenkorb
 * 
 * Installation:
 * 1. Neues Lesezeichen erstellen
 * 2. Als URL den minifizierten Code unten einfügen
 * 
 * Für lokale Entwicklung den DEVELOPMENT Block verwenden,
 * für Produktion den PRODUCTION Block.
 */

// ============================================
// DEVELOPMENT - Lokale Dateien laden
// ============================================

// Bookmarklet-Code (formatiert für Lesbarkeit):
/*
javascript:(function(){
  // Prüfen ob bereits geladen
  if(window.warenkorbInstance){
    window.warenkorbInstance.destroy();
    window.warenkorbInstance = null;
    return;
  }
  
  // Basis-URL für lokale Entwicklung
  var baseUrl = 'http://localhost:3000/';
  
  // CSS laden
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = baseUrl + 'sidebar.css';
  document.head.appendChild(css);
  
  // Scripts laden
  var scripts = ['patterns.js', 'wlo-api.js', 'pdf-export.js', 'sidebar.js'];
  var loaded = 0;
  
  scripts.forEach(function(src){
    var s = document.createElement('script');
    s.src = baseUrl + src;
    s.onload = function(){
      loaded++;
      if(loaded === scripts.length){
        setTimeout(function(){ initWarenkorb(); }, 100);
      }
    };
    document.body.appendChild(s);
  });
})();
*/

// Minifiziert für Lesezeichen (DEVELOPMENT):
const BOOKMARKLET_DEV = `javascript:(function(){if(window.warenkorbInstance){window.warenkorbInstance.destroy();window.warenkorbInstance=null;return}var b='http://localhost:3000/';var c=document.createElement('link');c.rel='stylesheet';c.href=b+'sidebar.css';document.head.appendChild(c);var s=['patterns.js','wlo-api.js','pdf-export.js','sidebar.js'],l=0;s.forEach(function(src){var sc=document.createElement('script');sc.src=b+src;sc.onload=function(){l++;if(l===s.length)setTimeout(function(){initWarenkorb()},100)};document.body.appendChild(sc)})})();`;


// ============================================
// PRODUCTION - Bundle von CDN/Server laden
// ============================================

// Für Produktion sollte ein gebündeltes Script verwendet werden:
/*
javascript:(function(){
  if(window.warenkorbInstance){
    window.warenkorbInstance.destroy();
    window.warenkorbInstance = null;
    return;
  }
  var s = document.createElement('script');
  s.src = 'https://your-domain.com/warenkorb/bundle.min.js';
  s.onload = function(){ initWarenkorb(); };
  document.body.appendChild(s);
})();
*/

const BOOKMARKLET_PROD = `javascript:(function(){if(window.warenkorbInstance){window.warenkorbInstance.destroy();window.warenkorbInstance=null;return}var s=document.createElement('script');s.src='https://your-domain.com/warenkorb/bundle.min.js';s.onload=function(){initWarenkorb()};document.body.appendChild(s)})();`;


// ============================================
// Inline-Version (alles in einem Script)
// ============================================

// Diese Version enthält alle Abhängigkeiten inline
// Generiert durch build-Prozess

function generateInlineBookmarklet() {
  // Würde den gesamten Code minifizieren und inline einbetten
  // Für Demo-Zwecke hier nur Platzhalter
  return BOOKMARKLET_DEV;
}

// Export für Build-Tools
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    BOOKMARKLET_DEV, 
    BOOKMARKLET_PROD,
    generateInlineBookmarklet 
  };
}

console.log('='.repeat(50));
console.log('PÄDAGOGISCHER WARENKORB - BOOKMARKLET');
console.log('='.repeat(50));
console.log('\nFür lokale Entwicklung diesen Code als Lesezeichen speichern:\n');
console.log(BOOKMARKLET_DEV);
console.log('\n' + '='.repeat(50));
