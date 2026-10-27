// Схемы-примеры к заданиям. Рисованы вручную в SVG, работают без интернета.
(function(){
const ink = '#2b2730', soft = '#9a93a3', acc = '#c4553a', fnt = 'font-family="Segoe UI,Arial" font-size="13" fill="#2b2730"';
const wrap = (body, h) => `<svg viewBox="0 0 520 ${h||260}" xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

window.EXAMPLES = {
boxes: wrap(`
  <line x1="0" y1="70" x2="520" y2="70" stroke="${soft}" stroke-dasharray="4 4"/>
  <text x="8" y="62" ${fnt}>линия горизонта</text>
  <circle cx="20" cy="70" r="4" fill="${acc}"/><circle cx="500" cy="70" r="4" fill="${acc}"/>
  <g stroke="${soft}" stroke-width="0.8">
    <line x1="20" y1="70" x2="230" y2="120"/><line x1="20" y1="70" x2="230" y2="230"/>
    <line x1="500" y1="70" x2="230" y2="120"/><line x1="500" y1="70" x2="230" y2="230"/>
  </g>
  <g fill="none" stroke="${ink}" stroke-width="2">
    <path d="M230 120 L230 230 M230 120 L150 101 L150 192 L230 230 M230 120 L330 98 L330 186 L230 230"/>
    <path d="M150 101 L246 79 L330 98"/>
  </g>
  <g fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="3 3">
    <path d="M150 192 L250 168 L330 186 M250 168 L246 79"/>
  </g>
  <text x="340" y="150" ${fnt}>невидимые рёбра тонко</text>
  <text x="340" y="168" ${fnt}>вертикали остаются вертикальными</text>
`),
cylinders: wrap(`
  <line x1="0" y1="40" x2="520" y2="40" stroke="${soft}" stroke-dasharray="4 4"/>
  <text x="8" y="32" ${fnt}>горизонт</text>
  <g fill="none" stroke="${ink}" stroke-width="2">
    <ellipse cx="90" cy="80" rx="50" ry="10"/><ellipse cx="90" cy="210" rx="50" ry="22"/>
    <line x1="40" y1="80" x2="40" y2="210"/><line x1="140" y1="80" x2="140" y2="210"/>
  </g>
  <line x1="90" y1="60" x2="90" y2="235" stroke="${acc}" stroke-dasharray="5 4"/>
  <text x="40" y="252" ${fnt}>ниже горизонта эллипс круглее</text>
  <g transform="translate(330 140) rotate(-30)" fill="none" stroke="${ink}" stroke-width="2">
    <ellipse cx="-70" cy="0" rx="14" ry="40"/><ellipse cx="70" cy="0" rx="20" ry="46"/>
    <line x1="-70" y1="-40" x2="70" y2="-46"/><line x1="-70" y1="40" x2="70" y2="46"/>
    <line x1="-100" y1="0" x2="110" y2="0" stroke="${acc}" stroke-dasharray="5 4" stroke-width="1.5"/>
  </g>
  <text x="270" y="252" ${fnt}>эллипс всегда поперёк оси</text>
`),
sphere: wrap(`
  <circle cx="140" cy="130" r="90" fill="none" stroke="${ink}" stroke-width="2"/>
  <ellipse cx="140" cy="130" rx="90" ry="30" fill="none" stroke="${acc}" stroke-width="1.6" transform="rotate(-20 140 130)"/>
  <ellipse cx="140" cy="130" rx="34" ry="90" fill="none" stroke="${acc}" stroke-width="1.6" transform="rotate(-20 140 130)"/>
  <text x="270" y="110" ${fnt}>две линии по поверхности</text>
  <text x="270" y="128" ${fnt}>уже делают шар объёмным</text>
  <text x="270" y="146" ${fnt}>поверни «глобус» как угодно</text>
`),
gesture: wrap(`
  <g fill="none" stroke="${acc}" stroke-width="4">
    <path d="M110 40 C 150 90, 160 150, 110 240"/>
    <path d="M330 40 C 300 100, 360 160, 400 240"/>
  </g>
  <g fill="none" stroke="${ink}" stroke-width="2">
    <ellipse cx="108" cy="30" rx="14" ry="17"/>
    <line x1="80" y1="78" x2="160" y2="92"/><line x1="96" y1="150" x2="160" y2="138"/>
    <ellipse cx="333" cy="30" rx="14" ry="17"/>
    <line x1="300" y1="86" x2="360" y2="74"/><line x1="320" y1="150" x2="385" y2="162"/>
  </g>
  <text x="180" y="80" ${fnt}>плечи</text><text x="180" y="146" ${fnt}>таз</text>
  <text x="40" y="256" ${fnt}>одна кривая через всё тело, плечи и таз наклонены в разные стороны</text>
`),
proportions: wrap(`
  <g stroke="${soft}" stroke-width="0.8">
    ${Array.from({length:9},(_,i)=>`<line x1="30" y1="${15+i*30}" x2="250" y2="${15+i*30}"/><text x="8" y="${20+i*30}" font-size="11" fill="${soft}" stroke="none">${i}</text>`).join('')}
  </g>
  <g fill="none" stroke="${ink}" stroke-width="2">
    <ellipse cx="140" cy="30" rx="12" ry="15"/>
    <rect x="114" y="52" width="52" height="46" rx="6"/>
    <rect x="118" y="102" width="44" height="30" rx="6"/>
    <path d="M114 58 L100 110 L96 150 M166 58 L180 110 L184 150"/>
    <path d="M126 132 L122 200 L120 240 M154 132 L158 200 L160 240"/>
  </g>
  <g fill="${acc}"><circle cx="100" cy="110" r="4"/><circle cx="180" cy="110" r="4"/><circle cx="122" cy="200" r="4"/><circle cx="158" cy="200" r="4"/></g>
  <text x="270" y="40" ${fnt}>мера — высота головы</text>
  <text x="270" y="60" ${fnt}>весь рост около 7,5 голов</text>
  <text x="270" y="90" ${fnt}>локти примерно на талии</text>
  <text x="270" y="110" ${fnt}>запястья у паха</text>
  <text x="270" y="140" ${fnt}>грудь и таз — две коробки,</text>
  <text x="270" y="158" ${fnt}>между ними гибкий живот</text>
  <text x="270" y="190" ${fnt}>предплечье не толще плеча</text>
`),
folds: wrap(`
  <g fill="none" stroke="${ink}" stroke-width="2">
    <path d="M60 60 L120 60 L140 150 L120 230 L60 230 L50 150 Z"/>
    <path d="M300 60 C 330 100, 330 140, 300 180 L 360 240"/>
  </g>
  <circle cx="140" cy="150" r="6" fill="${acc}"/>
  <g fill="none" stroke="${acc}" stroke-width="1.6">
    <path d="M70 110 L134 148"/><path d="M68 140 L132 152"/><path d="M70 190 L134 156"/>
  </g>
  <text x="160" y="140" ${fnt}>точка натяжения</text>
  <text x="160" y="158" ${fnt}>складки расходятся от неё</text>
  <text x="300" y="256" ${fnt}>на сгибе ткань собирается</text>
`),
light: wrap(`
  <defs><radialGradient id="g1" cx="0.35" cy="0.35" r="0.75">
    <stop offset="0" stop-color="#f4f0ea"/><stop offset="0.5" stop-color="#bdb6ae"/><stop offset="0.62" stop-color="#4a4550"/><stop offset="0.9" stop-color="#5d5864"/></radialGradient></defs>
  <ellipse cx="190" cy="215" rx="110" ry="22" fill="#3a3540" opacity="0.55"/>
  <circle cx="140" cy="130" r="85" fill="url(#g1)"/>
  <circle cx="40" cy="30" r="10" fill="#f2c94c"/>
  <g ${fnt}>
    <text x="250" y="60">свет</text><text x="250" y="90">полутон</text>
    <text x="250" y="120">граница тени (самое тёмное место)</text>
    <text x="250" y="150">собственная тень</text><text x="250" y="180">рефлекс от пола, светлее тени</text>
    <text x="250" y="230">падающая тень</text>
  </g>
`),
values: wrap(`
  <rect x="20" y="40" width="80" height="80" fill="#e9e5df"/><rect x="100" y="40" width="80" height="80" fill="#9d968f"/><rect x="180" y="40" width="80" height="80" fill="#3d3943"/>
  <text x="20" y="140" ${fnt}>светлый, средний, тёмный</text>
  <circle cx="390" cy="110" r="70" fill="#9d968f"/>
  <path d="M390 40 A70 70 0 0 1 390 180 A40 70 0 0 0 390 40" fill="#3d3943"/>
  <path d="M345 75 A40 40 0 0 1 380 55 A30 30 0 0 0 345 75" fill="#e9e5df"/>
  <text x="300" y="215" ${fnt}>картинка читается в трёх тонах,</text>
  <text x="300" y="233" ${fnt}>значит, прочитается и в цвете</text>
`),
head: wrap(`
  <g fill="none" stroke="${ink}" stroke-width="2">
    <circle cx="120" cy="110" r="70"/>
    <ellipse cx="88" cy="110" rx="20" ry="45"/>
    <path d="M70 160 L95 220 L150 230 L185 160"/>
  </g>
  <g fill="none" stroke="${acc}" stroke-width="1.5">
    <path d="M60 110 C 120 120, 160 118, 190 108"/><path d="M128 40 C 150 100, 160 170, 150 230"/>
  </g>
  <text x="230" y="70" ${fnt}>шар черепа, бока срезаны</text>
  <text x="230" y="95" ${fnt}>линия бровей и центр лица</text>
  <text x="230" y="120" ${fnt}>огибают форму, а не идут ровно</text>
  <text x="230" y="160" ${fnt}>снизу коробка челюсти</text>
`),
warmcool: wrap(`
  <defs>
    <radialGradient id="w1" cx="0.35" cy="0.35" r="0.8"><stop offset="0" stop-color="#ffb37a"/><stop offset="0.45" stop-color="#d4473a"/><stop offset="0.65" stop-color="#6b2a4c"/><stop offset="1" stop-color="#7c3a63"/></radialGradient>
    <radialGradient id="c1" cx="0.35" cy="0.35" r="0.8"><stop offset="0" stop-color="#e7d6e6"/><stop offset="0.45" stop-color="#b8475a"/><stop offset="0.65" stop-color="#5a2420"/><stop offset="1" stop-color="#6f3324"/></radialGradient>
  </defs>
  <circle cx="120" cy="120" r="80" fill="url(#w1)"/><circle cx="380" cy="120" r="80" fill="url(#c1)"/>
  <text x="40" y="230" ${fnt}>тёплый свет, холодная тень</text>
  <text x="300" y="230" ${fnt}>холодный свет, тёплая тень</text>
`)
};
})();
