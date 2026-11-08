import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('all three taming labs render their original symbolic placeholders, not sourced creature photos',()=>{
 for(const [file,placeholder] of [
  ['TamingLab.jsx','🦖'],
  ['SpecialtyLab.jsx','🦀'],
  ['PassiveLab.jsx','🦕']
 ]){
  const source=readFileSync(new URL(file,import.meta.url),'utf8');
  assert.ok(source.includes(`<div className="featureart" role="img"`),`${file}: themed placeholder wrapper`);
  assert.ok(source.includes(placeholder),`${file}: original placeholder`);
  assert.ok(!source.includes('CreaturePortrait'),`${file}: no licensed game-art component`);
 }
});
