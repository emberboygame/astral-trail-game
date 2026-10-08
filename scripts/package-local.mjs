import fs from 'node:fs';
import path from 'node:path';
const dir='local-build';let html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
html=html.replace(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g,(_,url)=>`<script type="module">${fs.readFileSync(path.join(dir,url),'utf8').replaceAll('</script','<\\/script')}</script>`);
html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,tag=>{const url=tag.match(/href="([^"]+)"/)[1];return `<style>${fs.readFileSync(path.join(dir,url),'utf8')}</style>`;});
html=html.replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g,'');
html=html.replace(/<link\b[^>]*rel="icon"[^>]*>/g,tag=>{const url=tag.match(/href="([^"]+)"/)[1];return `<link rel="icon" href="data:image/svg+xml;base64,${fs.readFileSync(path.join(dir,url)).toString('base64')}">`;});
if(/(?:src|href)="(?:\.\/)?assets\//.test(html))throw Error('Unbundled asset URL');
fs.mkdirSync('release',{recursive:true});fs.writeFileSync('release/Startrail-v0.9.3.html',html);console.log('Standalone offline HTML:',html.length,'bytes');
