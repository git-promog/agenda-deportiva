#!/usr/bin/env node
/**
 * ╔════════════════════════════════════════════════════════════════════╗
 * ║  BROADCAST MANAGER — Herramienta CLI para gérer transmisiones     ║
 * ╠════════════════════════════════════════════════════════════════════╣
 * ║  Uso:                                                              ║
 * ║  npm run broadcast:set -- <matchId> "<broadcasters>" [--streaming=<url>] [--notes=<text>] [--confirmed] ║
 * ║  npm run broadcast:list                                                  ║
 * ║  npm run broadcast:remove -- <matchId>                                   ║
 * ║  npm run broadcast:missing                                               ║
 * ║  npm run broadcast:check                                                 ║
 * ║                                                                          ║
 * ║  Ejemplos:                                                               ║
 * ║  npm run broadcast:set -- m15 "TUDN · ViX" --streaming="https://vix.com" --notes="Confirmado 15 jun" ║
 * ║  npm run broadcast:list                                                  ║
 * ║  npm run broadcast:missing                                               ║
 * ╚════════════════════════════════════════════════════════════════════╝
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = join(__dirname, '..');
const OVERRIDES_PATH = join(__dirname, 'broadcasters-overrides.json');
const SYNC_SCRIPT_PATH = join(__dirname, 'sync-fifa.mjs');

// Leer argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.error('❌  Especifica un comando: set, list, remove, missing, check');
  process.exit(1);
}

// Función para leer el archivo de overrides
function loadOverrides() {
  try {
    const data = readFileSync(OVERRIDES_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌  Error al leer broadcasters-overrides.json:', err.message);
    process.exit(1);
  }
}

// Función para guardar el archivo de overrides
function saveOverrides(data) {
  try {
    // Asegurar que _README esté presente
    if (!data._README) {
      data._README = "Edita este archivo para agregar transmisiones por partido. Usa el id del partido (m1, m2, ...). El script sync-fifa.mjs lee este archivo y lo PRESERVA sin sobreescribir. Campos soportados: broadcasters (string), streaming (URL), notes (string), confirmed (boolean).";
    }
    writeFileSync(OVERRIDES_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log('✅  broadcasters-overrides.json actualizado');
  } catch (err) {
    console.error('❌  Error al guardar broadcasters-overrides.json:', err.message);
    process.exit(1);
  }
}

// Función para obtener lista de todos los partidos (m1-m104)
function getAllMatchIds() {
  const ids = [];
  for (let i = 1; i <= 104; i++) {
    ids.push(`m${i}`);
  }
  return ids;
}

// COMANDO: set
if (command === 'set') {
  const matchId = args[1];
  if (!matchId) {
    console.error('❌  Especifica el ID del partido (ej: m15)');
    process.exit(1);
  }
  
  const broadcasters = args[2];
  if (!broadcasters) {
    console.error('❌  Especifica las transmisiones (ej: "TUDN · ViX")');
    process.exit(1);
  }
  
    // Parsear opciones adicionales
    const options = {};
    let i = 3;
    while (i < args.length) {
      if (args[i].startsWith('--')) {
        const arg = args[i].slice(2);
        if (arg.includes('=')) {
          // Formato --key=value
          const [key, value] = arg.split('=');
          // Manejo especial para booleanos
          if (key === 'confirmed') {
            options[key] = value.toLowerCase() === 'true' || value === '1';
          } else {
            options[key] = value;
          }
          i++; // Incrementar para pasar al siguiente argumento
        } else {
          // Formato --key value o --key (bandera)
          if (args[i+1] && !args[i+1].startsWith('--')) {
            options[arg] = args[i+1];
            i += 2;
          } else {
            // Bandera sin valor (ej: --confirmed)
            options[arg] = true;
            i += 1;
          }
        }
      } else {
        i++;
      }
    }
  
  const overrides = loadOverrides();
  overrides[matchId] = {
    broadcasters: broadcasters,
    streaming: options.streaming || undefined,
    notes: options.notes || undefined,
    confirmed: options.confirmed === true
  };
  
  // Eliminar campos undefined
  Object.keys(overrides[matchId]).forEach(key => {
    if (overrides[matchId][key] === undefined) {
      delete overrides[matchId][key];
    }
  });
  
  saveOverrides(overrides);
  console.log(`✅  Override configurado para ${matchId}`);
  console.log(`   Transmisiones: ${broadcasters}`);
  if (options.streaming) console.log(`   Streaming: ${options.streaming}`);
  if (options.notes) console.log(`   Notas: ${options.notes}`);
  if (options.confirmed) console.log(`   Confirmado: sí`);
  
  // Sugerir ejecutar sync
  console.log('\n💡  Para aplicar cambios, ejecuta:');
  console.log('   npm run sync-fifa');
}

// COMANDO: list
else if (command === 'list') {
  const overrides = loadOverrides();
  const matchIds = Object.keys(overrides).filter(id => id !== '_README');
  
  if (matchIds.length === 0) {
    console.log('📭  No hay overrides configurados');
  } else {
    console.log(`📋  ${matchIds.length} partido(s) con override:\n`);
    matchIds.sort().forEach(id => {
      const ov = overrides[id];
      console.log(`  ${id}:`);
      console.log(`    📺 Transmisiones: ${ov.broadcasters}`);
      if (ov.streaming) console.log(`    📡 Streaming: ${ov.streaming}`);
      if (ov.notes) console.log(`    📝 Notas: ${ov.notes}`);
      if (ov.confirmed) console.log(`    ✅ Confirmado: sí`);
      console.log('');
    });
  }
}

// COMANDO: remove
else if (command === 'remove') {
  const matchId = args[1];
  if (!matchId) {
    console.error('❌  Especifica el ID del partido a remover (ej: m15)');
    process.exit(1);
  }
  
  const overrides = loadOverrides();
  if (!overrides[matchId]) {
    console.log(`⚠️  No existe override para ${matchId}`);
  } else {
    delete overrides[matchId];
    saveOverrides(overrides);
    console.log(`✅  Override removido para ${matchId}`);
  }
}

// COMANDO: missing
else if (command === 'missing') {
  const overrides = loadOverrides();
  const allIds = getAllMatchIds();
  const overrideIds = Object.keys(overrides).filter(id => id !== '_README');
  const missingIds = allIds.filter(id => !overrideIds.includes(id));
  
  console.log(`🔍  Partidos SIN override: ${missingIds.length}/104`);
  if (missingIds.length > 0) {
    // Mostrar en grupos de 10
    for (let i = 0; i < missingIds.length; i += 10) {
      const chunk = missingIds.slice(i, i + 10);
      console.log(`   ${chunk.join(' ')}`);
    }
    console.log('\n💡  Usa "npm run broadcast:set -- <id> ..." para agregar overrides');
  } else {
    console.log('✅  ¡Todos los partidos tienen override!');
  }
}

// COMANDO: check
else if (command === 'check') {
  const overrides = loadOverrides();
  const allIds = getAllMatchIds();
  const overrideIds = Object.keys(overrides).filter(id => id !== '_README');
  
  // Validar formato
  let errors = [];
  overrideIds.forEach(id => {
    const ov = overrides[id];
    if (!ov.broadcasters || typeof ov.broadcasters !== 'string') {
      errors.push(`${id}: broadcasters debe ser string no vacío`);
    }
    if (ov.streaming !== undefined && typeof ov.streaming !== 'string') {
      errors.push(`${id}: streaming debe ser string o undefined`);
    }
    if (ov.notes !== undefined && typeof ov.notes !== 'string') {
      errors.push(`${id}: notes debe ser string o undefined`);
    }
    if (ov.confirmed !== undefined && typeof ov.confirmed !== 'boolean') {
      errors.push(`${id}: confirmed debe ser boolean o undefined`);
    }
  });
  
  if (errors.length > 0) {
    console.error('❌  Errores de validación:');
    errors.forEach(err => console.error(`   - ${err}`));
    process.exit(1);
  } else {
    console.log('✅  Todos los overrides tienen formato válido');
  }
  
  console.log(`\n📊  Estadísticas:`);
  console.log(`   Total partidos: ${allIds.length}`);
  console.log(`   Con override: ${overrideIds.length}`);
  console.log(`   Sin override: ${allIds.length - overrideIds.length}`);
  
  // Mostrar partidos con streaming/notas
  const withStreaming = overrideIds.filter(id => overrides[id].streaming);
  const withNotes = overrideIds.filter(id => overrides[id].notes);
  const confirmed = overrideIds.filter(id => overrides[id].confirmed === true);
  
  if (withStreaming.length > 0) console.log(`   Con streaming: ${withStreaming.length}`);
  if (withNotes.length > 0) console.log(`   Con notas: ${withNotes.length}`);
  if (confirmed.length > 0) console.log(`   Confirmados: ${confirmed.length}`);
}

// COMANDO desconocido
else {
  console.error(`❌  Comando desconocido: ${command}`);
  console.error('✅  Comandos válidos: set, list, remove, missing, check');
  process.exit(1);
}