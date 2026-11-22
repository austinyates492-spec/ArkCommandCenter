import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateTame} from './taming-engine.js';
import {unconsciousSupplies} from './torpor-maintenance.js';

function caseFor(food){
 const tame=calculateTame({creature:'Castoroides',level:150,food,tamingRate:10,foodDrainRate:1});
 assert.equal(tame.ok,true);
 const supplies=unconsciousSupplies({creature:'Castoroides',level:150,tameSeconds:tame.seconds,totalTorpor:350+21*149});
 assert.equal(supplies.ok,true);
 return {tame,supplies,narcotics:supplies.rows.find(row=>row.id==='narcotic').amount};
}

test('Castoroides 150 10x Superior Kibble needs zero narcotics only under ideal 4.8-minute tame',()=>{
 const {tame,narcotics}=caseFor('Superior Kibble');
 assert.equal(tame.seconds,288);
 assert.equal(narcotics,0);
});

test('Castoroides 150 10x Mejoberries needs narcotics on same server',()=>{
 const {tame,narcotics}=caseFor('Mejoberries');
 assert.ok(tame.seconds>1100);
 assert.ok(narcotics>=30);
});

test('observed longer taming time replaces ideal time when estimating torpor supplies',()=>{
 const short=caseFor('Superior Kibble');
 const longer=unconsciousSupplies({creature:'Castoroides',level:150,tameSeconds:20*60,totalTorpor:350+21*149});
 assert.equal(short.narcotics,0);
 assert.ok(longer.rows.find(row=>row.id==='narcotic').amount>0);
});

test('Castoroides current torpor can be lower than the theoretical full value',()=>{
 const full=unconsciousSupplies({creature:'Castoroides',level:150,tameSeconds:600,totalTorpor:3479});
 const reduced=unconsciousSupplies({creature:'Castoroides',level:150,tameSeconds:600,totalTorpor:3479,startingTorpor:2000});
 assert.ok(reduced.rows.find(row=>row.id==='narcotic').amount>full.rows.find(row=>row.id==='narcotic').amount);
});
