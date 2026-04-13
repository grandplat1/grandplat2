const PACKS = [
  'explore',
  'lite',
  'magic',
  'skyfactory',
  'tech',
  'ultimate',
  'vanilla'
];

const GAME_OPTS = {
  container: 'game_frame',
  servers: [],
  relays: [],
  enableMinceraft: false,
  allowUpdateSvc: false,
  allowUpdateDL: false,
  checkRelaysForUpdates: false,
  enableGithubButton: false,
  allowFNAWSkins: false,
  autoFixLegacyStyleAttr: true,
  allowBootMenu: false,
  enforceVSync: true,
  enableEPKVersionCheck: true
};

document.addEventListener('DOMContentLoaded', async function () {
  let hash = window.location.hash;
  if (hash.startsWith('#/')) {
    hash = hash.substring(2);
    if (hash.startsWith('play/')) {
      const pack = (hash = hash.substring(5)).split('/')[0];
      hash = hash.substring(pack.length);
      if (hash.startsWith('/')) hash = hash.substring(1);
      else hash = undefined;
      if (PACKS.indexOf(pack) > -1) launch(pack, hash);
    }
  }
  for (const pack of PACKS) {
    const el = document.createElement('a');
    el.href = `javascript:launch('${pack}')`;
    el.textContent = pack.toUpperCase();
    document.body.appendChild(el);
  }
});

function launch (pack_variant = getDeviceDefaultPack(), game_type = getBrowserDefaultGameType()) {
  document.open();
  document.write(`<!DOCTYPE html><html><head><title>Eags Modpack ${pack_variant.toUpperCase()}</title><link rel="icon" href="favicon.png"><style>html,body{margin:0;padding:0}body{width:100vw;height:100vh;}</style></head><body id="game_frame"></body></html>`);
  document.close();

  const opts = {};

  if (game_type === 'js') {
    opts.assetsURI = [ { url: `games/${pack_variant}/assets.epk`, path: '' }, { url: `games/${pack_variant}/mods.epk`, path: '$assetRepository' } ];
  } else {
    opts.assetsURI = `games/${pack_variant}/assets_${game_type}.epw`;
    opts.assetRepository = `games/${pack_variant}/mods.epk`;
  }

  window.eaglercraftXOpts = { ...GAME_OPTS, ...opts };

  const script = document.createElement('script');
  script.src = `games/${game_type === 'js' ? `${pack_variant}/classes` : 'wasm_bootstrap'}.js`;

  script.onload = () => {
    console.log(window.eaglercraftXOpts);
    window.focus();
    window.main();
  };

  document.head.appendChild(script);

  window.location.hash = `/play/${pack_variant}`;
}

function getDeviceDefaultPack () {
  return navigator.deviceMemory > 8 ? 'explore' : 'lite';
}

function getBrowserDefaultGameType () {
  const wasm = (typeof WebAssembly !== 'undefined');
  const jspi = (typeof WebAssembly.Suspending !== 'undefined');
  if (wasm && jspi) return 'jspi';
  else if (wasm) return 'wasm';
  else return 'js';
}
