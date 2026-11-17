import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('knockout Taming Lab renders creature-specific outline while preserving search and calculations',()=>{
 const source=readFileSync(new URL('TamingLab.jsx',import.meta.url),'utf8');
 assert.match(source,/Search official creature names/);
 assert.match(source,/CreatureLineArt creature=\{creature\}/);
 assert.match(source,/RexArtwork/);
 assert.doesNotMatch(source,/Dinosaur illustration placeholder/);
 assert.doesNotMatch(source,/CreaturePortrait/);
});
test('passive and specialty labs now show actual theme-colored field sketches',()=>{
 for(const file of ['SpecialtyLab.jsx','PassiveLab.jsx']){
  const source=readFileSync(new URL(file,import.meta.url),'utf8');
  assert.match(source,/CreatureLineArt creature=\{creature\}/);
  assert.match(source,/taming-art-stage/);
  assert.doesNotMatch(source,/illustration placeholder/);
 }
});
