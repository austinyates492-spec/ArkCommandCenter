import React from 'react';
import {Check, Shield, Sparkles, Leaf, Crown, Snowflake, Zap, Factory, Circle, Orbit, BookOpen} from 'lucide-react';
import './themes.css';
import './personality.css';

// Ten distinct design systems, shared across web, installable mobile PWA and desktop.
export const themes=[
 {id:'red',label:'Obsidian Command',tagline:'Tactical command deck',icon:Shield,main:'#f34b63',dark:'#100b10',backdrop:'#42151e',field:'#21131b',shape:'tactical'},
 {id:'purple',label:'Voidwalker',tagline:'Cosmic holograms',icon:Orbit,main:'#b98aff',dark:'#0f0b1c',backdrop:'#3a2465',field:'#241c3c',shape:'cosmic'},
 {id:'lime',label:'Aberration',tagline:'Bioluminescent wilds',icon:Leaf,main:'#a2ed78',dark:'#0a1712',backdrop:'#205b40',field:'#142c27',shape:'organic'},
 {id:'gold',label:'Ascendant Gold',tagline:'Refined prestige',icon:Crown,main:'#f1cb75',dark:'#16120c',backdrop:'#614826',field:'#302518',shape:'luxury'},
 {id:'ice',label:'Cryostasis',tagline:'Frosted precision',icon:Snowflake,main:'#92e8fc',dark:'#091a24',backdrop:'#305b72',field:'#173747',shape:'frost'},
 {id:'pink',label:'Neon Genesis',tagline:'Synthwave afterglow',icon:Zap,main:'#ff73c9',dark:'#180c24',backdrop:'#693478',field:'#321c45',shape:'synth'},
 {id:'orange',label:'Industrial Forge',tagline:'Molten machinery',icon:Factory,main:'#ffac56',dark:'#19120d',backdrop:'#633519',field:'#322318',shape:'industrial'},
 {id:'monochrome',label:'Monolith',tagline:'Minimal, high contrast',icon:Circle,main:'#ffffff',dark:'#111111',backdrop:'#555555',field:'#f3f3f3',shape:'minimal'},
 {id:'rainbow',label:'Prismatic',tagline:'Iridescent spectrum',icon:Sparkles,main:'#ff99dd',dark:'#120d28',backdrop:'#49336c',field:'#241c42',shape:'prismatic',stripe:'linear-gradient(90deg,#ff709e,#ffca6c,#70f4bb,#69b6ff,#c28dff)'},
 {id:'forest',label:"Survivor's Journal",tagline:'A field guide to survival',icon:BookOpen,main:'#badb8b',dark:'#171b12',backdrop:'#405335',field:'#2c3928',shape:'journal'}
];
export const themeIds=themes.map(theme=>theme.id);
export default function ThemePicker({value,onChange}){
 return <section className="panel knockout-panel theme-picker"><div className="panelhead"><div><h2>Personalize Your Command</h2></div><span className="badge gold">10 SIGNATURE THEMES</span></div><div className="theme-grid">{themes.map(theme=>{const Icon=theme.icon;return <button type="button" key={theme.id} className={`theme-option personality-preview personality-${theme.shape} ${theme.id===value?'active':''}`} aria-pressed={theme.id===value} onClick={()=>onChange(theme.id)}><span className="theme-swatch" style={{'--preview-accent':theme.main,'--preview-dark':theme.dark,'--preview-backdrop':theme.backdrop,'--preview-field':theme.field}}><span className="mini-rail"><i/><i/><i/></span><span className="mini-panels"><i/><i/><i/></span><span className="theme-preview-icon"><Icon size={24}/></span>{theme.id===value&&<span className="theme-selected"><Check size={18}/></span>}</span><strong>{theme.label}</strong><small>{theme.tagline}</small></button>})}</div><div className="notice">The selected look follows you across the website, installable mobile experience and desktop app when your cloud preferences sync. Motion respects your device's Reduced Motion setting.</div></section>;
}
