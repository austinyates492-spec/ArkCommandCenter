import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('knockout Taming Lab renders creature-specific outline while preserving search and calculations',()=>{
 const source=readFileSync(new URL('TamingLab.jsx',import.meta.url),'utf8');
 assert.match(source,/Search creatures and variants/);
 assert.match(source,/CreatureLineArt creature=\{creature\}/);
 assert.match(source,/RexArtwork/);
 assert.doesNotMatch(source,/Dinosaur illustration placeholder/);
 assert.doesNotMatch(source,/CreaturePortrait/);
});
test('passive and specialty lab placeholders remain until those artwork phases',()=>{
 for(const [file,placeholder] of [['SpecialtyLab.jsx','🦀'],['PassiveLab.jsx','🦕']]){
  const source=readFileSync(new URL(file,import.meta.url),'utf8');
  assert.ok(source.includes('<div className="featureart" role="img"'),file+' placeholder wrapper');
  assert.ok(source.includes(placeholder),file+' original placeholder');
 }
});
