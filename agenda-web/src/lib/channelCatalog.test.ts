import { describe, expect, it } from 'vitest';
import {
  CANALES_CATALOGO,
  CHANNEL_ICON_FILES,
  CHANNEL_ICON_PATH,
  isTvAbierta,
  matchChannels,
  resolveChannelsForDisplay,
} from '@/lib/channelCatalog';

const iconPath = (file: string) => `${CHANNEL_ICON_PATH}/${file}`;

const LISTA_A: Array<[string, string]> = [
  ['Canal 5', 'canal-5.webp'],
  ['El 5', 'canal-5.webp'],
  ['5*', 'canal-5.webp'],
  ['Canal 5*', 'canal-5.webp'],
  ['Canal5', 'canal-5.webp'],
  ['Azteca 7', 'azteca-7.webp'],
  ['TV Azteca 7', 'azteca-7.webp'],
  ['Azteca7', 'azteca-7.webp'],
  ['7', 'azteca-7.webp'],
  ['Nu9ve', 'nu9ve.webp'],
  ['Canal 9', 'nu9ve.webp'],
  ['El 9', 'nu9ve.webp'],
  ['Galavisión', 'nu9ve.webp'],
  ['Canal9', 'nu9ve.webp'],
  ['Imagen TV', 'imagen-tv.webp'],
  ['Imagen Televisión', 'imagen-tv.webp'],
  ['Canal 3', 'imagen-tv.webp'],
  ['ESPN', 'espn.webp'],
  ['ESPN México', 'espn.webp'],
  ['ESPN 1', 'espn-1.webp'],
  ['ESPN1', 'espn-1.webp'],
  ['ESPN 2', 'espn-2.webp'],
  ['ESPN2', 'espn-2.webp'],
  ['ESPN 3', 'espn-3.webp'],
  ['ESPN3', 'espn-3.webp'],
  ['ESPN 4', 'espn-4.webp'],
  ['ESPN4', 'espn-4.webp'],
  ['FOX', 'fox.webp'],
  ['Canal FOX', 'fox.webp'],
  ['FOX México', 'fox.webp'],
  ['Fox One', 'fox-one.webp'],
  ['FOX ONE', 'fox-one.webp'],
  ['FOXOne', 'fox-one.webp'],
  ['FOX+', 'fox-plus.webp'],
  ['Fox+', 'fox-plus.webp'],
  ['Fox Plus', 'fox-plus.webp'],
  ['FOX Plus', 'fox-plus.webp'],
  ['Fox Sports', 'fox-sports.webp'],
  ['Fox Sports 1', 'fox-sports.webp'],
  ['FS1', 'fox-sports.webp'],
  ['Nación Deportes', 'nacion-deportes.webp'],
  ['Nacion Deportes', 'nacion-deportes.webp'],
  ['Nación Deportes 1', 'nacion-deportes.webp'],
  ['Fox Sports 2', 'fox-sports-2.webp'],
  ['FS2', 'fox-sports-2.webp'],
  ['Nación Deportes 2', 'nacion-deportes-2.webp'],
  ['Nacion Deportes 2', 'nacion-deportes-2.webp'],
  ['Fox Sports 3', 'fox-sports-3.webp'],
  ['FS3', 'fox-sports-3.webp'],
  ['Nación Deportes 3', 'nacion-deportes-3.webp'],
  ['Nacion Deportes 3', 'nacion-deportes-3.webp'],
  ['Fox Sports Premium', 'fox-sports-premium.webp'],
  ['Nación Deportes Premium', 'nacion-deportes-premium.webp'],
  ['Nacion Deportes Premium', 'nacion-deportes-premium.webp'],
  ['TUDN', 'tudn.webp'],
  ['TUDN México', 'tudn.webp'],
  ['TUDN En Vivo', 'tudn.webp'],
  ['TVC Deportes', 'tvc-deportes.webp'],
  ['TVC Deportes 1', 'tvc-deportes.webp'],
  ['TVC Deportes 2', 'tvc-deportes-2.webp'],
  ['Azteca Deportes Network', 'azteca-deportes-network.webp'],
  ['Azteca Deportes', 'azteca-deportes-network.webp'],
  ['aztecadeportes.com', 'azteca-deportes-network.webp'],
  ['Sky Sports', 'sky-sports.webp'],
  ['SKY Sports', 'sky-sports.webp'],
  ['Sky+', 'sky-sports.webp'],
  ['Sky', 'sky-sports.webp'],
  ['TNT Sports', 'tnt-sports.webp'],
  ['TNT Sports México', 'tnt-sports.webp'],
  ['HBO Max', 'hbo-max.webp'],
  ['Max', 'hbo-max.webp'],
  ['HBO', 'hbo-max.webp'],
  ['ViX', 'vix.webp'],
  ['ViX+', 'vix.webp'],
  ['ViX Gratis', 'vix.webp'],
  ['ViX Premium', 'vix.webp'],
  ['Disney+ Premium', 'disney-plus-premium.webp'],
  ['Disney Plus Premium', 'disney-plus-premium.webp'],
  ['Prime Video', 'prime-video.webp'],
  ['Amazon Prime Video', 'prime-video.webp'],
  ['Amazon Prime', 'prime-video.webp'],
  ['Paramount+', 'paramount-plus.webp'],
  ['Paramount Plus', 'paramount-plus.webp'],
  ['F1 TV Pro', 'f1-tv-pro.webp'],
  ['F1 TV', 'f1-tv-pro.webp'],
  ['F1 TV Premium', 'f1-tv-pro.webp'],
  ['F1TV', 'f1-tv-pro.webp'],
  ['Apple TV', 'apple-tv.webp'],
  ['Apple TV+', 'apple-tv.webp'],
  ['Apple TV Plus', 'apple-tv.webp'],
  ['Pluto TV', 'pluto-tv.webp'],
  ['LMB TV', 'lmb-tv.webp'],
  ['LMB.TV', 'lmb-tv.webp'],
  ['Jonrón.TV', 'lmb-tv.webp'],
  ['Jonron TV', 'lmb-tv.webp'],
  ['Caliente TV', 'caliente-tv.webp'],
  ['Caliente.mx TV', 'caliente-tv.webp'],
  ['Claro Sports', 'claro-sports.webp'],
  ['Marca Claro', 'claro-sports.webp'],
  ['Claro Sports YouTube', 'claro-sports.webp'],
  ['DAZN', 'dazn.webp'],
  ['DAZN App', 'dazn.webp'],
  ['Tubi', 'tubi.webp'],
  ['Tubi TV', 'tubi.webp'],
  ['Laytime TV', 'laytime-tv.webp'],
  ['Laytime', 'laytime-tv.webp'],
  ['Fanatiz', 'fanatiz.webp'],
  ['Fanatiz México', 'fanatiz.webp'],
  ['MotoGP VideoPass', 'motogp-videopass.webp'],
  ['VideoPass', 'motogp-videopass.webp'],
  ['MotoGP TV', 'motogp-videopass.webp'],
  ['WTA TV', 'wta-tv.webp'],
  ['WTA Unlocked', 'wta-tv.webp'],
  ['Tennis TV', 'tennis-tv.webp'],
  ['TennisTV', 'tennis-tv.webp'],
  ['ATP Tennis TV', 'atp-tennis-tv.webp'],
  ['ATPTennis.TV', 'atp-tennis-tv.webp'],
  ['NBA League Pass', 'nba-league-pass.webp'],
  ['NBA Pass', 'nba-league-pass.webp'],
  ['FUTV', 'futv.webp'],
  ['1Baseball Network', '1baseball-network.webp'],
  ['1Baseball', '1baseball-network.webp'],
  ['BeisbolPlay', 'beisbolplay.webp'],
  ['BéisbolPlay', 'beisbolplay.webp'],
  ['AYM Sports', 'aym-sports.webp'],
  ['AyM Sports', 'aym-sports.webp'],
  ['YouTube', 'youtube.webp'],
  ['* YouTube', 'youtube.webp'],
  ['YouTube Live', 'youtube.webp'],
  ['RCN Nuestra Tele', 'rcn-nuestra-tele.webp'],
  ['Nuestra Tele', 'rcn-nuestra-tele.webp'],
  ['RCN Internacional', 'rcn-nuestra-tele.webp'],
  ['Globo Internacional', 'globo-internacional.webp'],
  ['TV Globo Internacional', 'globo-internacional.webp'],
  ['LPF Play', 'lpf-play.webp'],
  ['TyC Sports Internacional', 'tyc-sports-internacional.webp'],
  ['TyC Sports', 'tyc-sports-internacional.webp'],
  ['MegaSports', 'megasports.webp'],
  ['Mega Sports', 'megasports.webp'],
  ['Megacable Sports', 'megasports.webp'],
  ['Antel TV Internacional', 'antel-tv-internacional.webp'],
  ['Antel TV', 'antel-tv-internacional.webp'],
];

const LISTA_B: Array<[string, string]> = [
  ['Disney+', 'disney-plus.webp'],
  ['Disney Plus', 'disney-plus.webp'],
  ['Star+', 'disney-plus.webp'],
  ['Las Estrellas', 'las-estrellas.webp'],
  ['Canal 2', 'las-estrellas.webp'],
  ['Azteca Uno', 'azteca-uno.webp'],
  ['Azteca 1', 'azteca-uno.webp'],
  ['Canal 1', 'azteca-uno.webp'],
  ['Hi Sports', 'hi-sports.webp'],
  ['Afizzionados', 'afizzionados.webp'],
  ['Netflix', 'netflix.webp'],
  ['NFL Game Pass', 'nfl-game-pass.webp'],
  ['DAZN NFL', 'nfl-game-pass.webp'],
  ['MLS Season Pass', 'mls-season-pass.webp'],
  ['MLB.TV', 'mlb-tv.webp'],
  ['MLB TV', 'mlb-tv.webp'],
  ['UFC Fight Pass', 'ufc-fight-pass.webp'],
  ['FIFA+', 'fifa-plus.webp'],
  ['FIFA Plus', 'fifa-plus.webp'],
  ['OneFootball', 'onefootball.webp'],
  ['UEFA.tv', 'uefa-tv.webp'],
  ['UEFA TV', 'uefa-tv.webp'],
  ['Canal 6', 'canal-6.webp'],
  ['Multimedios', 'canal-6.webp'],
  ['Canal Once', 'canal-once.webp'],
  ['Canal 22', 'canal-22.webp'],
  ['TNT', 'tnt.webp'],
  ['Space', 'space.webp'],
  ['Chivas TV', 'chivas-tv.webp'],
  ['Claro Video', 'claro-video.webp'],
];

const LISTA_C_EXISTENTES: Array<[string, string]> = [
  ['NBA TV', 'nba-tv.webp'],
  ['NFL Network', 'nfl-network.webp'],
  ['MLB Network', 'mlb-network.webp'],
  ['NHL TV', 'nhl-tv.webp'],
  ['Golf Channel', 'golf-channel.webp'],
  ['Courtside 1891', 'courtside-1891.webp'],
  ['EuroLeague TV', 'euroleague-tv.webp'],
  ['Rally TV', 'rally-tv.webp'],
  ['Telemundo', 'telemundo.webp'],
  ['Univision', 'univision.webp'],
  ['Win Sports+', 'win-sports-plus.webp'],
  ['GolTV', 'goltv.webp'],
  ['Tigo Sports', 'tigo-sports.webp'],
  ['DSports', 'dsports.webp'],
  ['PX Sports', 'px-sports.webp'],
  ['Adrenalina Sports', 'adrenalina-sports.webp'],
  ['* Facebook', 'facebook-live.webp'],
  ['* Twitch', 'twitch.webp'],
];

describe('channelCatalog · compatibilidad existente', () => {
  it('conserva isTvAbierta sin regresiones', () => {
    expect(isTvAbierta('Canal 5, ESPN')).toBe(true);
    expect(isTvAbierta('El 9')).toBe(true);
    expect(isTvAbierta('Azteca 7')).toBe(true);
    expect(isTvAbierta('ESPN')).toBe(false);
    expect(isTvAbierta(null)).toBe(false);
    expect(isTvAbierta('')).toBe(false);
  });

  it('conserva matchChannels y sus coincidencias históricas', () => {
    expect(matchChannels('Canal 5').map((canal) => canal.id)).toContain('canal-5');
    expect(matchChannels('ESPN 2').map((canal) => canal.id)).toContain('espn');
    expect(matchChannels('Fox Sports 2').map((canal) => canal.id)).toContain('fox-sports');
    expect(matchChannels('TUDN').map((canal) => canal.id)).toContain('tudn');
    expect(matchChannels(null)).toEqual([]);
  });

  it('expone logo en los canales del catálogo que ya tienen icono', () => {
    expect(CANALES_CATALOGO.find((canal) => canal.id === 'espn')?.logo).toBe(iconPath('espn.webp'));
    expect(CANALES_CATALOGO.find((canal) => canal.id === 'canal-5')?.logo).toBe(iconPath('canal-5.webp'));
    expect(CANALES_CATALOGO.find((canal) => canal.id === 'max')?.logo).toBe(iconPath('hbo-max.webp'));
    expect(CANALES_CATALOGO.find((canal) => canal.id === 'f1-tv')?.logo).toBe(iconPath('f1-tv-pro.webp'));
  });
});

describe('resolveChannelsForDisplay · resolución exacta', () => {
  it('divide sólo por delimitadores de lista y conserva el orden', () => {
    const result = resolveChannelsForDisplay('Canal 5 · ESPN 2, FOX+');
    expect(result.map((channel) => channel.id)).toEqual(['canal-5', 'espn-2', 'fox-plus']);
    expect(result.map((channel) => channel.logo)).toEqual([
      iconPath('canal-5.webp'),
      iconPath('espn-2.webp'),
      iconPath('fox-plus.webp'),
    ]);
  });

  it('distingue ESPN de ESPN 1/2/3/4', () => {
    const result = resolveChannelsForDisplay('ESPN, ESPN 1, ESPN 2, ESPN 3, ESPN 4');
    expect(result.map((channel) => channel.logo)).toEqual([
      iconPath('espn.webp'),
      iconPath('espn-1.webp'),
      iconPath('espn-2.webp'),
      iconPath('espn-3.webp'),
      iconPath('espn-4.webp'),
    ]);
  });

  it('distingue Disney+ de Disney+ Premium', () => {
    expect(resolveChannelsForDisplay('Disney+')[0]?.logo).toBe(iconPath('disney-plus.webp'));
    expect(resolveChannelsForDisplay('Disney+ Premium')[0]?.logo).toBe(iconPath('disney-plus-premium.webp'));
  });

  it('distingue FOX, Fox One, FOX+ y la familia Fox Sports / Nación Deportes', () => {
    const inputs = [
      'FOX',
      'Fox One',
      'FOX+',
      'Fox Sports',
      'Fox Sports 2',
      'Fox Sports 3',
      'Fox Sports Premium',
      'Nación Deportes',
      'Nación Deportes 2',
      'Nación Deportes 3',
      'Nación Deportes Premium',
    ];
    expect(inputs.map((input) => resolveChannelsForDisplay(input)[0]?.logo)).toEqual([
      iconPath('fox.webp'),
      iconPath('fox-one.webp'),
      iconPath('fox-plus.webp'),
      iconPath('fox-sports.webp'),
      iconPath('fox-sports-2.webp'),
      iconPath('fox-sports-3.webp'),
      iconPath('fox-sports-premium.webp'),
      iconPath('nacion-deportes.webp'),
      iconPath('nacion-deportes-2.webp'),
      iconPath('nacion-deportes-3.webp'),
      iconPath('nacion-deportes-premium.webp'),
    ]);
  });

  it('distingue Tennis TV de ATP Tennis TV y TVC Deportes de TVC Deportes 2', () => {
    expect(resolveChannelsForDisplay('Tennis TV')[0]?.logo).toBe(iconPath('tennis-tv.webp'));
    expect(resolveChannelsForDisplay('ATPTennis.TV')[0]?.logo).toBe(iconPath('atp-tennis-tv.webp'));
    expect(resolveChannelsForDisplay('TVC Deportes')[0]?.logo).toBe(iconPath('tvc-deportes.webp'));
    expect(resolveChannelsForDisplay('TVC Deportes 2')[0]?.logo).toBe(iconPath('tvc-deportes-2.webp'));
  });

  it('limpia el prefijo * en * YouTube, * Facebook y * Twitch', () => {
    expect(resolveChannelsForDisplay('* YouTube')[0]?.logo).toBe(iconPath('youtube.webp'));
    expect(resolveChannelsForDisplay('* Facebook')[0]?.logo).toBe(iconPath('facebook-live.webp'));
    expect(resolveChannelsForDisplay('* Twitch')[0]?.logo).toBe(iconPath('twitch.webp'));
  });

  it('maneja Por confirmar y cadenas vacías', () => {
    const unconfirmed = resolveChannelsForDisplay('Por confirmar');
    expect(unconfirmed).toEqual([{ id: 'por-confirmar', nombre: 'Por confirmar', unconfirmed: true }]);
    expect(unconfirmed[0]?.logo).toBeUndefined();
    expect(resolveChannelsForDisplay('   ')).toEqual(unconfirmed);
    expect(resolveChannelsForDisplay(null)).toEqual(unconfirmed);
    expect(resolveChannelsForDisplay('Por definir · Canal 5').map((channel) => channel.id)).toEqual(['canal-5']);
  });

  it('usa fallback de texto sin logo para canales aún sin archivo', () => {
    const result = resolveChannelsForDisplay('ESPN Extra · Fox Deportes');
    expect(result).toHaveLength(2);
    expect(result.every((channel) => channel.logo === undefined)).toBe(true);
    expect(result.map((channel) => channel.nombre)).toEqual(['ESPN Extra', 'Fox Deportes']);
  });

  it('deduplica canales repetidos sin perder el orden', () => {
    expect(resolveChannelsForDisplay('ESPN, ESPN 2, ESPN').map((channel) => channel.id)).toEqual([
      'espn',
      'espn-2',
    ]);
  });
});

describe('resolveChannelsForDisplay · cobertura del scraper', () => {
  it.each(LISTA_A)('Lista A: %s → %s', (entrada, archivo) => {
    const result = resolveChannelsForDisplay(entrada);
    expect(result).toHaveLength(1);
    expect(result[0]?.logo).toBe(iconPath(archivo));
  });

  it.each(LISTA_B)('Lista B: %s → %s', (entrada, archivo) => {
    const result = resolveChannelsForDisplay(entrada);
    expect(result).toHaveLength(1);
    expect(result[0]?.logo).toBe(iconPath(archivo));
  });

  it.each(LISTA_C_EXISTENTES)('Lista C existente: %s → %s', (entrada, archivo) => {
    const result = resolveChannelsForDisplay(entrada);
    expect(result).toHaveLength(1);
    expect(result[0]?.logo).toBe(iconPath(archivo));
  });

  it('nunca devuelve logos de archivos que no existen en disco', () => {
    const available = new Set<string>(CHANNEL_ICON_FILES);
    const inputs = [...LISTA_A, ...LISTA_B, ...LISTA_C_EXISTENTES].map(([entrada]) => entrada);

    for (const entrada of inputs) {
      for (const channel of resolveChannelsForDisplay(entrada)) {
        if (!channel.logo) continue;
        expect(channel.logo.startsWith(`${CHANNEL_ICON_PATH}/`)).toBe(true);
        expect(available.has(channel.logo.slice(CHANNEL_ICON_PATH.length + 1))).toBe(true);
      }
    }
  });

  it('mantiene el catálogo visual sin duplicados ni archivos inexistentes', () => {
    const available = new Set<string>(CHANNEL_ICON_FILES);
    expect(available.size).toBe(CHANNEL_ICON_FILES.length);

    for (const canal of CANALES_CATALOGO) {
      if (!canal.logo) continue;
      expect(available.has(canal.logo.slice(CHANNEL_ICON_PATH.length + 1))).toBe(true);
    }
  });
});
