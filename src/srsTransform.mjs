import proj4 from 'proj4'

defineProjection(
  ['EPSG:2056', 'CH1903+'],
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
);
defineProjection(
  ['EPSG:21781', 'CH1903'],
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'
);
defineProjection(
  ['EPSG:7415', 'urn:ogc:def:crs:EPSG::7415'],
  '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +vunits=m +no_defs'
);


/**
 * @param {String[]} names
 * @param {String} definition
 */
function defineProjection(names, definition) {
  names.forEach(name => {
    proj4.defs(name, definition);
  })
}

let projectionCache = {};

function getProjection(srsCode) {
  if (!projectionCache[srsCode]) {
    if (!proj4.defs(srsCode)) {
      throw new Error(`Unknown SRS: "${srsCode}"`);
    }
    projectionCache[srsCode] = proj4(srsCode);
  }
  return projectionCache[srsCode];
}

/**
 * @param {Number[]} coords
 * @param {String} srsCodeFrom
 * @param {String} srsCodeTo
 */
function srsTransform(coords, srsCodeFrom, srsCodeTo) {
  let height = undefined;
  if (coords.length === 3) {
    // proj4js doesn't support 'height', just preserve the input value
    height = coords[2];
    coords = [coords[0], coords[1]];
  }

  let from = getProjection(srsCodeFrom);
  let to = getProjection(srsCodeTo);
  coords = proj4(from, to, coords);

  if (typeof height !== 'undefined') {
    coords[2] = height;
  }

  return coords;
}

export default srsTransform
