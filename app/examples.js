// Схемы-примеры к заданиям. Рисованы вручную в SVG, работают без интернета.
(function(){
const ink = '#2F2721', soft = '#A89A86', acc = '#8C3A26', fnt = 'font-family="Plex,Segoe UI,Arial" font-size="15" fill="#2F2721"';
const wrap = (body, h) => `<svg viewBox="0 0 520 ${h||260}" xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

window.EXAMPLES = {
cylinders: wrap(`
  <line x1="0" y1="40" x2="520" y2="40" stroke="${soft}" stroke-dasharray="4 4"/>
  <text x="8" y="32" ${fnt}>горизонт</text>
  <g fill="none" stroke="${ink}" stroke-width="2">
    <ellipse cx="90" cy="80" rx="50" ry="10"/><ellipse cx="90" cy="210" rx="50" ry="22"/>
    <line x1="40" y1="80" x2="40" y2="210"/><line x1="140" y1="80" x2="140" y2="210"/>
  </g>
  <line x1="90" y1="60" x2="90" y2="235" stroke="${acc}" stroke-dasharray="5 4"/>
  <text x="40" y="250" ${fnt}>ниже горизонта</text><text x="40" y="268" ${fnt}>эллипс круглее</text>
  <g transform="translate(330 140) rotate(-30)" fill="none" stroke="${ink}" stroke-width="2">
    <ellipse cx="-70" cy="0" rx="14" ry="40"/><ellipse cx="70" cy="0" rx="20" ry="46"/>
    <line x1="-70" y1="-40" x2="70" y2="-46"/><line x1="-70" y1="40" x2="70" y2="46"/>
    <line x1="-100" y1="0" x2="110" y2="0" stroke="${acc}" stroke-dasharray="5 4" stroke-width="1.5"/>
  </g>
  <text x="300" y="250" ${fnt}>эллипс всегда</text><text x="300" y="268" ${fnt}>поперёк оси</text>
`, 280),
sphere: wrap(`
  <circle cx="140" cy="130" r="90" fill="none" stroke="${ink}" stroke-width="2"/>
  <ellipse cx="140" cy="130" rx="90" ry="30" fill="none" stroke="${acc}" stroke-width="1.6" transform="rotate(-20 140 130)"/>
  <ellipse cx="140" cy="130" rx="34" ry="90" fill="none" stroke="${acc}" stroke-width="1.6" transform="rotate(-20 140 130)"/>
  <text x="270" y="110" ${fnt}>две линии по поверхности</text>
  <text x="270" y="128" ${fnt}>уже делают шар объёмным</text>
  <text x="270" y="146" ${fnt}>при любом повороте</text>
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
  <text x="40" y="270" ${fnt}>одна кривая через всё тело, плечи и таз</text><text x="40" y="290" ${fnt}>наклонены в разные стороны</text>
`, 300),
proportions: wrap(`
  <g stroke="${soft}" stroke-width="0.8">
    ${Array.from({length:9},(_,i)=>`<line x1="30" y1="${15+i*30}" x2="250" y2="${15+i*30}"/><text x="8" y="${20+i*30}" font-size="11" fill="${soft}" stroke="none">${i}</text>`).join('')}
  </g>
  <g fill="none" stroke="${ink}" stroke-width="2">
    <ellipse cx="140" cy="30" rx="12" ry="15"/>
    <rect x="114" y="52" width="52" height="46" rx="6"/>
    <rect x="118" y="102" width="44" height="30" rx="6"/>
    <path d="M114 58 L102 105 L98 140 M166 58 L178 105 L182 140"/>
    <path d="M126 132 L123 188 L121 240 M154 132 L157 188 L159 240"/>
  </g>
  <g fill="${acc}"><circle cx="102" cy="105" r="4"/><circle cx="178" cy="105" r="4"/><circle cx="123" cy="188" r="4"/><circle cx="157" cy="188" r="4"/></g>
  <text x="270" y="40" ${fnt}>единица — высота головы</text>
  <text x="270" y="60" ${fnt}>весь рост около 7,5 голов</text>
  <text x="270" y="90" ${fnt}>локти примерно на талии</text>
  <text x="270" y="110" ${fnt}>запястья у паха</text>
  <text x="270" y="140" ${fnt}>грудь и таз: две коробки,</text>
  <text x="270" y="158" ${fnt}>между ними гибкий живот</text>
  <text x="270" y="190" ${fnt}>предплечье не толще плеча</text>
`),
folds: wrap(`
  <g fill="none" stroke="${ink}" stroke-width="2">
    <path d="M40 40 L40 200 M220 40 L220 200"/>
    <path d="M40 40 Q130 70 220 40"/>
    <path d="M40 200 Q130 185 220 200"/>
  </g>
  <g fill="none" stroke="${acc}" stroke-width="1.6">
    <path d="M44 46 Q130 100 216 46"/><path d="M48 52 Q130 135 212 52"/><path d="M54 60 Q130 168 206 60"/>
  </g>
  <g fill="${acc}"><circle cx="40" cy="40" r="5"/><circle cx="220" cy="40" r="5"/></g>
  <g fill="none" stroke="${ink}" stroke-width="2">
    <path d="M300 40 L300 150 Q300 222 372 222 L500 222"/>
    <path d="M356 40 L356 150 Q356 168 374 168 L500 168"/>
  </g>
  <g fill="none" stroke="${acc}" stroke-width="1.6">
    <path d="M356 118 Q330 112 302 124"/><path d="M358 150 Q330 150 306 172"/>
    <path d="M366 164 Q346 184 336 210"/><path d="M378 168 Q384 196 392 222"/>
  </g>
  <g ${fnt}>
    <text x="40" y="236">натяжение между</text><text x="40" y="256">точками опоры</text>
    <text x="300" y="250">сжатие на сгибе</text>
  </g>
`),
light: wrap(`
  <defs><radialGradient id="g1" cx="0.35" cy="0.35" r="0.75">
    <stop offset="0" stop-color="#F6EFE3"/><stop offset="0.5" stop-color="#BDB0A0"/><stop offset="0.62" stop-color="#4A3F38"/><stop offset="0.9" stop-color="#6A5D52"/></radialGradient></defs>
  <ellipse cx="185" cy="214" rx="105" ry="20" fill="#3E342D" opacity="0.5"/>
  <circle cx="140" cy="130" r="85" fill="url(#g1)"/>
  <circle cx="40" cy="28" r="9" fill="#B8862F"/>
  <g stroke="${ink}" stroke-width="0.8" fill="${ink}">
    <line x1="120" y1="108" x2="300" y2="40"/><circle cx="120" cy="108" r="2.2"/>
    <line x1="155" y1="143" x2="300" y2="74"/><circle cx="155" cy="143" r="2.2"/>
    <line x1="170" y1="160" x2="300" y2="108"/><circle cx="170" cy="160" r="2.2"/>
    <line x1="182" y1="172" x2="300" y2="142"/><circle cx="182" cy="172" r="2.2"/>
    <line x1="194" y1="186" x2="300" y2="176"/><circle cx="194" cy="186" r="2.2"/>
    <line x1="250" y1="218" x2="300" y2="218"/><circle cx="250" cy="218" r="2.2"/>
  </g>
  <g ${fnt}>
    <text x="306" y="45">свет</text><text x="306" y="79">полутон</text>
    <text x="306" y="113">линия терминатора</text><text x="306" y="147">собственная тень</text>
    <text x="306" y="181">рефлекс</text><text x="306" y="223">падающая тень</text>
  </g>
`),
values: wrap(`
  <defs><clipPath id="vc"><circle cx="390" cy="104" r="70"/></clipPath></defs>
  <rect x="20" y="34" width="72" height="72" fill="#E9E1D3"/><rect x="92" y="34" width="72" height="72" fill="#9C8F7E"/><rect x="164" y="34" width="72" height="72" fill="#3E342D"/>
  <g ${fnt}><text x="20" y="132">светлый</text><text x="104" y="132">средний</text><text x="176" y="132">тёмный</text></g>
  <ellipse cx="428" cy="180" rx="86" ry="13" fill="#3E342D"/>
  <circle cx="390" cy="104" r="70" fill="#3E342D"/>
  <g clip-path="url(#vc)" transform="rotate(-45 390 104)">
    <rect x="320" y="34" width="140" height="70" fill="#9C8F7E"/>
    <ellipse cx="390" cy="104" rx="70" ry="30" fill="#9C8F7E"/>
    <ellipse cx="390" cy="66" rx="36" ry="22" fill="#E9E1D3"/>
  </g>
  <g ${fnt}><text x="20" y="196">три тона без переходов</text><text x="20" y="216">передают объём и свет</text></g>
`),
head: wrap(`
  <g fill="none" stroke="${ink}" stroke-width="2">
    <circle cx="140" cy="112" r="72"/>
    <ellipse cx="184" cy="114" rx="20" ry="44"/>
    <path d="M76 146 L104 212 Q118 232 132 234 L166 222 L186 166"/>
  </g>
  <g fill="none" stroke="${acc}" stroke-width="1.6">
    <path d="M68 112 A72 22 0 0 0 212 112"/>
    <path d="M128 40 Q108 120 132 234"/>
  </g>
  <g stroke="${soft}" stroke-width="1" stroke-dasharray="3 3">
    <line x1="60" y1="62" x2="230" y2="62"/><line x1="60" y1="112" x2="230" y2="112"/>
    <line x1="60" y1="170" x2="230" y2="170"/><line x1="60" y1="234" x2="230" y2="234"/>
  </g>
  <g ${fnt}>
    <text x="262" y="60">шар черепа,</text><text x="262" y="80">боковая плоскость срезана</text>
    <text x="262" y="112">линия бровей и центр лица</text><text x="262" y="132">огибают форму</text>
    <text x="262" y="166">лоб, нос и нижняя часть</text><text x="262" y="186">лица примерно равны</text>
  </g>
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
