import proj4 from "proj4";

class SRSTranslator {
  /**
   * @param {Object} [projectionDefinitions]
   */
  constructor(projectionDefinitions) {
    this.projections = {};
    this.transformations = {};

    projectionDefinitions = Object.assign(
      SRSTranslator._getDefaultDefinitions(),
      projectionDefinitions || {}
    );
    for (let name in projectionDefinitions) {
      this.addProjection(name, projectionDefinitions[name]);
    }
  }

  /**
   * @param {String} name
   * @param {String} projection
   */
  addProjection(name, projection) {
    this.projections[name] = projection;
  }

  /**
   * @param {Number[]} coords
   * @param {String} projectionFrom
   * @param {String} projectionTo
   * @return {Number[]}
   */
  forward(coords, projectionFrom, projectionTo) {
    let height = undefined;
    if (coords.length === 3) {
      // proj4js doesn't support 'height', just preserve the input value
      height = coords.pop();
    }

    let transformation = this._getTransformation(projectionFrom, projectionTo);
    coords = transformation.forward(coords);

    if (typeof height !== "undefined") {
      coords[2] = height;
    }
    return coords;
  }

  /**
   * @param {String} projectionFrom
   * @param {String} projectionTo
   * @return {Function}
   */
  _getTransformation(projectionFrom, projectionTo) {
    let cacheKey = `${projectionFrom}:::${projectionTo}`;
    if (!this.transformations[cacheKey]) {
      let from = this._getProjection(projectionFrom);
      let to = this._getProjection(projectionTo);
      this.transformations[cacheKey] = proj4(from, to);
    }
    return this.transformations[cacheKey];
  }

  /**
   * @param {String} name
   * @return {String}
   * @private
   */
  _getProjection(name) {
    if (!this.projections[name]) {
      throw new Error(
        `Unknown projection name: "${name}".\nSee https://github.com/njam/citygml-to-3dtiles#option-srsprojections for details.`
      );
    }
    return this.projections[name];
  }

  /**
   * @returns {Object}
   * @private
   */
  static _getDefaultDefinitions() {
    return {
      WGS84:
        "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
      "CH1903+":
        "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs",
      "EPSG:2056":
        "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs",
      CH1903:
        "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs",
      "urn:ogc:def:crs:EPSG::7415":
        "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +vunits=m +no_defs",
      "EPSG:25833":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "urn:adv:crs:ETRS89_UTM32*DE_DHHN92_NH":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ",
      "urn:adv:crs:ETRS89_UTM32*DE_DHHN2016_NH":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ",
      "urn:ogc:def:crs,crs:EPSG::3414,crs:EPSG::6916":
        "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs",
      "EPSG:2000":
        "+proj=tmerc +lat_0=0 +lon_0=-62 +k=0.9995000000000001 +x_0=400000 +y_0=0 +ellps=clrk80 +units=m +no_defs",
      "EPSG:2001":
        "+proj=tmerc +lat_0=0 +lon_0=-62 +k=0.9995000000000001 +x_0=400000 +y_0=0 +ellps=clrk80 +towgs84=-255,-15,71,0,0,0,0 +units=m +no_defs",
      "EPSG:2002":
        "+proj=tmerc +lat_0=0 +lon_0=-62 +k=0.9995000000000001 +x_0=400000 +y_0=0 +ellps=clrk80 +towgs84=725,685,536,0,0,0,0 +units=m +no_defs",
      "EPSG:2003":
        "+proj=tmerc +lat_0=0 +lon_0=-62 +k=0.9995000000000001 +x_0=400000 +y_0=0 +ellps=clrk80 +towgs84=72,213.7,93,0,0,0,0 +units=m +no_defs",
      "EPSG:2004":
        "+proj=tmerc +lat_0=0 +lon_0=-62 +k=0.9995000000000001 +x_0=400000 +y_0=0 +ellps=clrk80 +towgs84=174,359,365,0,0,0,0 +units=m +no_defs",
      "EPSG:2005":
        "+proj=tmerc +lat_0=0 +lon_0=-62 +k=0.9995000000000001 +x_0=400000 +y_0=0 +ellps=clrk80 +towgs84=9,183,236,0,0,0,0 +units=m +no_defs",
      "EPSG:2006":
        "+proj=tmerc +lat_0=0 +lon_0=-62 +k=0.9995000000000001 +x_0=400000 +y_0=0 +ellps=clrk80 +towgs84=-149,128,296,0,0,0,0 +units=m +no_defs",
      "EPSG:2007":
        "+proj=tmerc +lat_0=0 +lon_0=-62 +k=0.9995000000000001 +x_0=400000 +y_0=0 +ellps=clrk80 +towgs84=195.671,332.517,274.607,0,0,0,0 +units=m +no_defs",
      "EPSG:2008":
        "+proj=tmerc +lat_0=0 +lon_0=-55.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2009":
        "+proj=tmerc +lat_0=0 +lon_0=-58.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2010":
        "+proj=tmerc +lat_0=0 +lon_0=-61.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2011":
        "+proj=tmerc +lat_0=0 +lon_0=-64.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2012":
        "+proj=tmerc +lat_0=0 +lon_0=-67.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2013":
        "+proj=tmerc +lat_0=0 +lon_0=-70.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2014":
        "+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2015":
        "+proj=tmerc +lat_0=0 +lon_0=-76.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2016":
        "+proj=tmerc +lat_0=0 +lon_0=-79.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2017":
        "+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2018":
        "+proj=tmerc +lat_0=0 +lon_0=-76.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2019":
        "+proj=tmerc +lat_0=0 +lon_0=-79.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2020":
        "+proj=tmerc +lat_0=0 +lon_0=-82.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2021":
        "+proj=tmerc +lat_0=0 +lon_0=-81 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2022":
        "+proj=tmerc +lat_0=0 +lon_0=-84 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2023":
        "+proj=tmerc +lat_0=0 +lon_0=-87 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2024":
        "+proj=tmerc +lat_0=0 +lon_0=-90 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2025":
        "+proj=tmerc +lat_0=0 +lon_0=-93 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2026":
        "+proj=tmerc +lat_0=0 +lon_0=-96 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2027": "+proj=utm +zone=15 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2028": "+proj=utm +zone=16 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2029": "+proj=utm +zone=17 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2030": "+proj=utm +zone=18 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2031": "+proj=utm +zone=17 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2032": "+proj=utm +zone=18 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2033": "+proj=utm +zone=19 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2034": "+proj=utm +zone=20 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2035": "+proj=utm +zone=21 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2036":
        "+proj=sterea +lat_0=46.5 +lon_0=-66.5 +k=0.999912 +x_0=2500000 +y_0=7500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2037":
        "+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2038":
        "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2039":
        "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs",
      "EPSG:2040":
        "+proj=utm +zone=30 +ellps=clrk80 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs",
      "EPSG:2041":
        "+proj=utm +zone=30 +ellps=clrk80 +towgs84=-124.76,53,466.79,0,0,0,0 +units=m +no_defs",
      "EPSG:2042":
        "+proj=utm +zone=29 +ellps=clrk80 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs",
      "EPSG:2043":
        "+proj=utm +zone=29 +ellps=clrk80 +towgs84=-124.76,53,466.79,0,0,0,0 +units=m +no_defs",
      "EPSG:2044":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +ellps=krass +towgs84=-17.51,-108.32,-62.39,0,0,0,0 +units=m +no_defs",
      "EPSG:2045":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +ellps=krass +towgs84=-17.51,-108.32,-62.39,0,0,0,0 +units=m +no_defs",
      "EPSG:2046":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2047":
        "+proj=tmerc +lat_0=0 +lon_0=17 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2048":
        "+proj=tmerc +lat_0=0 +lon_0=19 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2049":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2050":
        "+proj=tmerc +lat_0=0 +lon_0=23 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2051":
        "+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2052":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2053":
        "+proj=tmerc +lat_0=0 +lon_0=29 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2054":
        "+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2055":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2056":
        "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs",
      "EPSG:2057":
        "+proj=omerc +lat_0=27.51882880555555 +lonc=52.60353916666667 +alpha=0.5716611944444444 +k=0.999895934 +x_0=658377.437 +y_0=3044969.194 +gamma=0.5716611944444444 +ellps=intl +towgs84=-133.63,-157.5,-158.62,0,0,0,0 +units=m +no_defs",
      "EPSG:2058":
        "+proj=utm +zone=38 +ellps=intl +towgs84=-117,-132,-164,0,0,0,0 +units=m +no_defs",
      "EPSG:2059":
        "+proj=utm +zone=39 +ellps=intl +towgs84=-117,-132,-164,0,0,0,0 +units=m +no_defs",
      "EPSG:2060":
        "+proj=utm +zone=40 +ellps=intl +towgs84=-117,-132,-164,0,0,0,0 +units=m +no_defs",
      "EPSG:2061":
        "+proj=utm +zone=41 +ellps=intl +towgs84=-117,-132,-164,0,0,0,0 +units=m +no_defs",
      "EPSG:2062":
        "+proj=lcc +lat_1=40 +lat_0=40 +lon_0=0 +k_0=0.9988085293 +x_0=600000 +y_0=600000 +a=6378298.3 +b=6356657.142669561 +pm=madrid +units=m +no_defs",
      "EPSG:2063":
        "+proj=utm +zone=28 +a=6378249.2 +b=6356515 +towgs84=-23,259,-9,0,0,0,0 +units=m +no_defs",
      "EPSG:2064":
        "+proj=utm +zone=29 +a=6378249.2 +b=6356515 +towgs84=-23,259,-9,0,0,0,0 +units=m +no_defs",
      "EPSG:2065":
        "+proj=krovak +lat_0=49.5 +lon_0=42.5 +alpha=30.28813972222222 +k=0.9999 +x_0=-0 +y_0=-0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +pm=ferro +positive=1 +no_defs",
      "EPSG:2066":
        "+proj=cass +lat_0=11.25217861111111 +lon_0=-60.68600888888889 +x_0=37718.66159325 +y_0=36209.91512952 +a=6378293.645208759 +b=6356617.987679838 +to_meter=0.201166195164 +no_defs",
      "EPSG:2067":
        "+proj=utm +zone=20 +ellps=intl +towgs84=-0.465,372.095,171.736,0,0,0,0 +units=m +no_defs",
      "EPSG:2068":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9999 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2069":
        "+proj=tmerc +lat_0=0 +lon_0=11 +k=0.9999 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2070":
        "+proj=tmerc +lat_0=0 +lon_0=13 +k=0.9999 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2071":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2072":
        "+proj=tmerc +lat_0=0 +lon_0=17 +k=0.9999 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2073":
        "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9999 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2074":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2075":
        "+proj=tmerc +lat_0=0 +lon_0=23 +k=0.9999 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2076":
        "+proj=tmerc +lat_0=0 +lon_0=25 +k=0.9999 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2077":
        "+proj=utm +zone=32 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2078":
        "+proj=utm +zone=33 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2079":
        "+proj=utm +zone=34 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2080":
        "+proj=utm +zone=35 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2081":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=intl +units=m +no_defs",
      "EPSG:2082":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=intl +towgs84=27.5,14,186.4,0,0,0,0 +units=m +no_defs",
      "EPSG:2083":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=intl +towgs84=16,196,93,0,0,0,0 +units=m +no_defs",
      "EPSG:2084":
        "+proj=utm +zone=19 +south +ellps=intl +towgs84=16,196,93,0,0,0,0 +units=m +no_defs",
      "EPSG:2085":
        "+proj=lcc +lat_1=22.35 +lat_0=22.35 +lon_0=-81 +k_0=0.99993602 +x_0=500000 +y_0=280296.016 +datum=NAD27 +units=m +no_defs",
      "EPSG:2086":
        "+proj=lcc +lat_1=20.71666666666667 +lat_0=20.71666666666667 +lon_0=-76.83333333333333 +k_0=0.99994848 +x_0=500000 +y_0=229126.939 +datum=NAD27 +units=m +no_defs",
      "EPSG:2087":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9996 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +units=m +no_defs",
      "EPSG:2088":
        "+proj=tmerc +lat_0=0 +lon_0=11 +k=0.9996 +x_0=500000 +y_0=0 +datum=carthage +units=m +no_defs",
      "EPSG:2089":
        "+proj=utm +zone=38 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2090":
        "+proj=utm +zone=39 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2091":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=8500000 +y_0=0 +ellps=krass +towgs84=-76,-138,67,0,0,0,0 +units=m +no_defs",
      "EPSG:2092":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=9500000 +y_0=0 +ellps=krass +towgs84=-76,-138,67,0,0,0,0 +units=m +no_defs",
      "EPSG:2093":
        "+proj=tmerc +lat_0=0 +lon_0=106 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=-17.51,-108.32,-62.39,0,0,0,0 +units=m +no_defs",
      "EPSG:2094":
        "+proj=tmerc +lat_0=0 +lon_0=106 +k=0.9996 +x_0=500000 +y_0=0 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:2095":
        "+proj=utm +zone=28 +ellps=intl +towgs84=-173,253,27,0,0,0,0 +units=m +no_defs",
      "EPSG:2096":
        "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:2097":
        "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:2098":
        "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:2099":
        "+proj=cass +lat_0=25.38236111111111 +lon_0=50.76138888888889 +x_0=100000 +y_0=100000 +ellps=helmert +units=m +no_defs",
      "EPSG:2100":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +datum=GGRS87 +units=m +no_defs",
      "EPSG:2101":
        "+proj=lcc +lat_1=10.16666666666667 +lat_0=10.16666666666667 +lon_0=-71.60561777777777 +k_0=1 +x_0=0 +y_0=-52684.972 +ellps=intl +units=m +no_defs",
      "EPSG:2102":
        "+proj=lcc +lat_1=10.16666666666667 +lat_0=10.16666666666667 +lon_0=-71.60561777777777 +k_0=1 +x_0=200000 +y_0=147315.028 +ellps=intl +units=m +no_defs",
      "EPSG:2103":
        "+proj=lcc +lat_1=10.16666666666667 +lat_0=10.16666666666667 +lon_0=-71.60561777777777 +k_0=1 +x_0=500000 +y_0=447315.028 +ellps=intl +units=m +no_defs",
      "EPSG:2104":
        "+proj=lcc +lat_1=10.16666666666667 +lat_0=10.16666666666667 +lon_0=-71.60561777777777 +k_0=1 +x_0=-17044 +y_0=-23139.97 +ellps=intl +units=m +no_defs",
      "EPSG:2105":
        "+proj=tmerc +lat_0=-36.87972222222222 +lon_0=174.7641666666667 +k=0.9999 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2106":
        "+proj=tmerc +lat_0=-37.76111111111111 +lon_0=176.4661111111111 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2107":
        "+proj=tmerc +lat_0=-38.62444444444444 +lon_0=177.8855555555556 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2108":
        "+proj=tmerc +lat_0=-39.65083333333333 +lon_0=176.6736111111111 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2109":
        "+proj=tmerc +lat_0=-39.13555555555556 +lon_0=174.2277777777778 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2110":
        "+proj=tmerc +lat_0=-39.51222222222222 +lon_0=175.64 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2111":
        "+proj=tmerc +lat_0=-40.24194444444444 +lon_0=175.4880555555555 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2112":
        "+proj=tmerc +lat_0=-40.92527777777777 +lon_0=175.6472222222222 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2113":
        "+proj=tmerc +lat_0=-41.3011111111111 +lon_0=174.7763888888889 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2114":
        "+proj=tmerc +lat_0=-40.71472222222223 +lon_0=172.6719444444444 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2115":
        "+proj=tmerc +lat_0=-41.27444444444444 +lon_0=173.2991666666667 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2116":
        "+proj=tmerc +lat_0=-41.28972222222222 +lon_0=172.1088888888889 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2117":
        "+proj=tmerc +lat_0=-41.81055555555555 +lon_0=171.5811111111111 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2118":
        "+proj=tmerc +lat_0=-42.33361111111111 +lon_0=171.5497222222222 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2119":
        "+proj=tmerc +lat_0=-42.68888888888888 +lon_0=173.01 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2120":
        "+proj=tmerc +lat_0=-41.54444444444444 +lon_0=173.8019444444444 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2121":
        "+proj=tmerc +lat_0=-42.88611111111111 +lon_0=170.9797222222222 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2122":
        "+proj=tmerc +lat_0=-43.11 +lon_0=170.2608333333333 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2123":
        "+proj=tmerc +lat_0=-43.97777777777778 +lon_0=168.6061111111111 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2124":
        "+proj=tmerc +lat_0=-43.59055555555556 +lon_0=172.7269444444445 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2125":
        "+proj=tmerc +lat_0=-43.74861111111111 +lon_0=171.3605555555555 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2126":
        "+proj=tmerc +lat_0=-44.40194444444445 +lon_0=171.0572222222222 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2127":
        "+proj=tmerc +lat_0=-44.735 +lon_0=169.4675 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2128":
        "+proj=tmerc +lat_0=-45.13277777777778 +lon_0=168.3986111111111 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2129":
        "+proj=tmerc +lat_0=-45.56361111111111 +lon_0=167.7386111111111 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2130":
        "+proj=tmerc +lat_0=-45.81611111111111 +lon_0=170.6283333333333 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2131":
        "+proj=tmerc +lat_0=-45.86138888888889 +lon_0=170.2825 +k=0.99996 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2132":
        "+proj=tmerc +lat_0=-46.6 +lon_0=168.3427777777778 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2133":
        "+proj=utm +zone=58 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2134":
        "+proj=utm +zone=59 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2135":
        "+proj=utm +zone=60 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2136":
        "+proj=tmerc +lat_0=4.666666666666667 +lon_0=-1 +k=0.99975 +x_0=274319.7391633579 +y_0=0 +a=6378300 +b=6356751.689189189 +towgs84=-199,32,322,0,0,0,0 +to_meter=0.3047997101815088 +no_defs",
      "EPSG:2137":
        "+proj=tmerc +lat_0=0 +lon_0=-1 +k=0.9996 +x_0=500000 +y_0=0 +a=6378300 +b=6356751.689189189 +towgs84=-199,32,322,0,0,0,0 +units=m +no_defs",
      "EPSG:2138":
        "+proj=lcc +lat_1=60 +lat_2=46 +lat_0=44 +lon_0=-68.5 +x_0=0 +y_0=0 +ellps=clrk66 +units=m +no_defs",
      "EPSG:2139":
        "+proj=tmerc +lat_0=0 +lon_0=-55.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2140":
        "+proj=tmerc +lat_0=0 +lon_0=-58.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2141":
        "+proj=tmerc +lat_0=0 +lon_0=-61.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2142":
        "+proj=tmerc +lat_0=0 +lon_0=-64.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2143":
        "+proj=tmerc +lat_0=0 +lon_0=-67.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2144":
        "+proj=tmerc +lat_0=0 +lon_0=-70.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2145":
        "+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2146":
        "+proj=tmerc +lat_0=0 +lon_0=-76.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2147":
        "+proj=tmerc +lat_0=0 +lon_0=-79.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2148":
        "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2149":
        "+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2150":
        "+proj=utm +zone=17 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2151":
        "+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2152":
        "+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2153":
        "+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2154":
        "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2155":
        "+proj=lcc +lat_1=-14.26666666666667 +lat_0=-14.26666666666667 +lon_0=170 +k_0=1 +x_0=152400.3048006096 +y_0=0 +ellps=clrk66 +towgs84=-115,118,426,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2156":
        "+proj=utm +zone=59 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2157":
        "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2158":
        "+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2159":
        "+proj=tmerc +lat_0=6.666666666666667 +lon_0=-12 +k=1 +x_0=152399.8550907544 +y_0=0 +a=6378300 +b=6356751.689189189 +to_meter=0.3047997101815088 +no_defs",
      "EPSG:2160":
        "+proj=tmerc +lat_0=6.666666666666667 +lon_0=-12 +k=1 +x_0=243839.7681452071 +y_0=182879.8261089053 +a=6378300 +b=6356751.689189189 +to_meter=0.3047997101815088 +no_defs",
      "EPSG:2161":
        "+proj=utm +zone=28 +ellps=clrk80 +towgs84=-88,4,101,0,0,0,0 +units=m +no_defs",
      "EPSG:2162":
        "+proj=utm +zone=29 +ellps=clrk80 +towgs84=-88,4,101,0,0,0,0 +units=m +no_defs",
      "EPSG:2163":
        "+proj=laea +lat_0=45 +lon_0=-100 +x_0=0 +y_0=0 +a=6370997 +b=6370997 +units=m +no_defs",
      "EPSG:2164":
        "+proj=tmerc +lat_0=0 +lon_0=-5 +k=0.9996 +x_0=500000 +y_0=0 +ellps=clrk80 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs",
      "EPSG:2165":
        "+proj=tmerc +lat_0=0 +lon_0=-5 +k=0.9996 +x_0=500000 +y_0=0 +ellps=clrk80 +towgs84=-124.76,53,466.79,0,0,0,0 +units=m +no_defs",
      "EPSG:2166":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:2167":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:2168":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:2169":
        "+proj=tmerc +lat_0=49.83333333333334 +lon_0=6.166666666666667 +k=1 +x_0=80000 +y_0=100000 +ellps=intl +towgs84=-189.681,18.3463,-42.7695,-0.33746,-3.09264,2.53861,0.4598 +units=m +no_defs",
      "EPSG:2170":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:2171":
        "+proj=sterea +lat_0=50.625 +lon_0=21.08333333333333 +k=0.9998 +x_0=4637000 +y_0=5647000 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:2172":
        "+proj=sterea +lat_0=53.00194444444445 +lon_0=21.50277777777778 +k=0.9998 +x_0=4603000 +y_0=5806000 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:2173":
        "+proj=sterea +lat_0=53.58333333333334 +lon_0=17.00833333333333 +k=0.9998 +x_0=3501000 +y_0=5999000 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:2174":
        "+proj=sterea +lat_0=51.67083333333333 +lon_0=16.67222222222222 +k=0.9998 +x_0=3703000 +y_0=5627000 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:2175":
        "+proj=tmerc +lat_0=0 +lon_0=18.95833333333333 +k=0.999983 +x_0=237000 +y_0=-4700000 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:2176":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2177":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2178":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2179":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.999923 +x_0=8500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2180":
        "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2188":
        "+proj=utm +zone=25 +ellps=intl +towgs84=-425,-169,81,0,0,0,0 +units=m +no_defs",
      "EPSG:2189":
        "+proj=utm +zone=26 +ellps=intl +towgs84=-104,167,-38,0,0,0,0 +units=m +no_defs",
      "EPSG:2190":
        "+proj=utm +zone=26 +ellps=intl +towgs84=-203,141,53,0,0,0,0 +units=m +no_defs",
      "EPSG:2191": "+proj=utm +zone=28 +ellps=intl +units=m +no_defs",
      "EPSG:2192":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=2.337229166666667 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2193":
        "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2194":
        "+proj=lcc +lat_1=-14.26666666666667 +lat_0=-14.26666666666667 +lon_0=-170 +k_0=1 +x_0=152400.3048006096 +y_0=0 +ellps=clrk66 +towgs84=-115,118,426,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2195":
        "+proj=utm +zone=2 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2196":
        "+proj=tmerc +lat_0=0 +lon_0=9.5 +k=0.99995 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2197":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.99995 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2198":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2199":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:2200":
        "+proj=sterea +lat_0=46.5 +lon_0=-66.5 +k=0.999912 +x_0=300000 +y_0=800000 +a=6378135 +b=6356750.304921594 +units=m +no_defs",
      "EPSG:2201":
        "+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2202":
        "+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2203":
        "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2204":
        "+proj=lcc +lat_1=35.25 +lat_2=36.41666666666666 +lat_0=34.66666666666666 +lon_0=-86 +x_0=609601.2192024384 +y_0=30480.06096012192 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:2205":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=38.96666666666667 +lat_0=37.5 +lon_0=-84.25 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:2206":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=9500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2207":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=10500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2208":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=11500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2209":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=12500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2210":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=13500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2211":
        "+proj=tmerc +lat_0=0 +lon_0=42 +k=1 +x_0=14500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2212":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=15500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2213":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2214":
        "+proj=tmerc +lat_0=0 +lon_0=10.5 +k=0.999 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=-206.1,-174.7,-87.7,0,0,0,0 +units=m +no_defs",
      "EPSG:2215":
        "+proj=utm +zone=32 +a=6378249.2 +b=6356515 +towgs84=-70.9,-151.8,-41.4,0,0,0,0 +units=m +no_defs",
      "EPSG:2216":
        "+proj=utm +zone=22 +ellps=intl +towgs84=164,138,-189,0,0,0,0 +units=m +no_defs",
      "EPSG:2217":
        "+proj=utm +zone=23 +ellps=intl +towgs84=164,138,-189,0,0,0,0 +units=m +no_defs",
      "EPSG:2219":
        "+proj=utm +zone=19 +a=6378135 +b=6356750.304921594 +units=m +no_defs",
      "EPSG:2220":
        "+proj=utm +zone=20 +a=6378135 +b=6356750.304921594 +units=m +no_defs",
      "EPSG:2222":
        "+proj=tmerc +lat_0=31 +lon_0=-110.1666666666667 +k=0.9999 +x_0=213360 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2223":
        "+proj=tmerc +lat_0=31 +lon_0=-111.9166666666667 +k=0.9999 +x_0=213360 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2224":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2225":
        "+proj=lcc +lat_1=41.66666666666666 +lat_2=40 +lat_0=39.33333333333334 +lon_0=-122 +x_0=2000000.0001016 +y_0=500000.0001016001 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2226":
        "+proj=lcc +lat_1=39.83333333333334 +lat_2=38.33333333333334 +lat_0=37.66666666666666 +lon_0=-122 +x_0=2000000.0001016 +y_0=500000.0001016001 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2227":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.06666666666667 +lat_0=36.5 +lon_0=-120.5 +x_0=2000000.0001016 +y_0=500000.0001016001 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2228":
        "+proj=lcc +lat_1=37.25 +lat_2=36 +lat_0=35.33333333333334 +lon_0=-119 +x_0=2000000.0001016 +y_0=500000.0001016001 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2229":
        "+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000.0001016 +y_0=500000.0001016001 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2230":
        "+proj=lcc +lat_1=33.88333333333333 +lat_2=32.78333333333333 +lat_0=32.16666666666666 +lon_0=-116.25 +x_0=2000000.0001016 +y_0=500000.0001016001 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2231":
        "+proj=lcc +lat_1=40.78333333333333 +lat_2=39.71666666666667 +lat_0=39.33333333333334 +lon_0=-105.5 +x_0=914401.8288036576 +y_0=304800.6096012192 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2232":
        "+proj=lcc +lat_1=39.75 +lat_2=38.45 +lat_0=37.83333333333334 +lon_0=-105.5 +x_0=914401.8288036576 +y_0=304800.6096012192 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2233":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.23333333333333 +lat_0=36.66666666666666 +lon_0=-105.5 +x_0=914401.8288036576 +y_0=304800.6096012192 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2234":
        "+proj=lcc +lat_1=41.86666666666667 +lat_2=41.2 +lat_0=40.83333333333334 +lon_0=-72.75 +x_0=304800.6096012192 +y_0=152400.3048006096 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2235":
        "+proj=tmerc +lat_0=38 +lon_0=-75.41666666666667 +k=0.999995 +x_0=200000.0001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2236":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2237":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2238":
        "+proj=lcc +lat_1=30.75 +lat_2=29.58333333333333 +lat_0=29 +lon_0=-84.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2239":
        "+proj=tmerc +lat_0=30 +lon_0=-82.16666666666667 +k=0.9999 +x_0=200000.0001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2240":
        "+proj=tmerc +lat_0=30 +lon_0=-84.16666666666667 +k=0.9999 +x_0=699999.9998983998 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2241":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-112.1666666666667 +k=0.9999473679999999 +x_0=200000.0001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2242":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-114 +k=0.9999473679999999 +x_0=500000.0001016001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2243":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-115.75 +k=0.999933333 +x_0=800000.0001016001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2244":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=99999.99989839978 +y_0=249364.9987299975 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2245":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=249364.9987299975 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2246":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=38.96666666666667 +lat_0=37.5 +lon_0=-84.25 +x_0=500000.0001016001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2247":
        "+proj=lcc +lat_1=37.93333333333333 +lat_2=36.73333333333333 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=500000.0001016001 +y_0=500000.0001016001 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2248":
        "+proj=lcc +lat_1=39.45 +lat_2=38.3 +lat_0=37.66666666666666 +lon_0=-77 +x_0=399999.9998983998 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2249":
        "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000.0001016002 +y_0=750000 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2250":
        "+proj=lcc +lat_1=41.48333333333333 +lat_2=41.28333333333333 +lat_0=41 +lon_0=-70.5 +x_0=500000.0001016001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2251":
        "+proj=lcc +lat_1=47.08333333333334 +lat_2=45.48333333333333 +lat_0=44.78333333333333 +lon_0=-87 +x_0=7999999.999968001 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2252":
        "+proj=lcc +lat_1=45.7 +lat_2=44.18333333333333 +lat_0=43.31666666666667 +lon_0=-84.36666666666666 +x_0=5999999.999976001 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2253":
        "+proj=lcc +lat_1=43.66666666666666 +lat_2=42.1 +lat_0=41.5 +lon_0=-84.36666666666666 +x_0=3999999.999984 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2254":
        "+proj=tmerc +lat_0=29.5 +lon_0=-88.83333333333333 +k=0.99995 +x_0=300000.0000000001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2255":
        "+proj=tmerc +lat_0=29.5 +lon_0=-90.33333333333333 +k=0.99995 +x_0=699999.9998983998 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2256":
        "+proj=lcc +lat_1=49 +lat_2=45 +lat_0=44.25 +lon_0=-109.5 +x_0=599999.9999976 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2257":
        "+proj=tmerc +lat_0=31 +lon_0=-104.3333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2258":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000.0001016001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2259":
        "+proj=tmerc +lat_0=31 +lon_0=-107.8333333333333 +k=0.999916667 +x_0=830000.0001016001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2260":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2261":
        "+proj=tmerc +lat_0=40 +lon_0=-76.58333333333333 +k=0.9999375 +x_0=249999.9998983998 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2262":
        "+proj=tmerc +lat_0=40 +lon_0=-78.58333333333333 +k=0.9999375 +x_0=350000.0001016001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2263":
        "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2264":
        "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.2192024384 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2265":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.43333333333333 +lat_0=47 +lon_0=-100.5 +x_0=599999.9999976 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2266":
        "+proj=lcc +lat_1=47.48333333333333 +lat_2=46.18333333333333 +lat_0=45.66666666666666 +lon_0=-100.5 +x_0=599999.9999976 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2267":
        "+proj=lcc +lat_1=36.76666666666667 +lat_2=35.56666666666667 +lat_0=35 +lon_0=-98 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2268":
        "+proj=lcc +lat_1=35.23333333333333 +lat_2=33.93333333333333 +lat_0=33.33333333333334 +lon_0=-98 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2269":
        "+proj=lcc +lat_1=46 +lat_2=44.33333333333334 +lat_0=43.66666666666666 +lon_0=-120.5 +x_0=2500000.0001424 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2270":
        "+proj=lcc +lat_1=44 +lat_2=42.33333333333334 +lat_0=41.66666666666666 +lon_0=-120.5 +x_0=1500000.0001464 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2271":
        "+proj=lcc +lat_1=41.95 +lat_2=40.88333333333333 +lat_0=40.16666666666666 +lon_0=-77.75 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2272":
        "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2273":
        "+proj=lcc +lat_1=34.83333333333334 +lat_2=32.5 +lat_0=31.83333333333333 +lon_0=-81 +x_0=609600 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2274":
        "+proj=lcc +lat_1=36.41666666666666 +lat_2=35.25 +lat_0=34.33333333333334 +lon_0=-86 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2275":
        "+proj=lcc +lat_1=36.18333333333333 +lat_2=34.65 +lat_0=34 +lon_0=-101.5 +x_0=200000.0001016002 +y_0=999999.9998983998 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2276":
        "+proj=lcc +lat_1=33.96666666666667 +lat_2=32.13333333333333 +lat_0=31.66666666666667 +lon_0=-98.5 +x_0=600000 +y_0=2000000.0001016 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2277":
        "+proj=lcc +lat_1=31.88333333333333 +lat_2=30.11666666666667 +lat_0=29.66666666666667 +lon_0=-100.3333333333333 +x_0=699999.9998983998 +y_0=3000000 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2278":
        "+proj=lcc +lat_1=30.28333333333333 +lat_2=28.38333333333333 +lat_0=27.83333333333333 +lon_0=-99 +x_0=600000 +y_0=3999999.9998984 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2279":
        "+proj=lcc +lat_1=27.83333333333333 +lat_2=26.16666666666667 +lat_0=25.66666666666667 +lon_0=-98.5 +x_0=300000.0000000001 +y_0=5000000.0001016 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2280":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.71666666666667 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=500000.0001504 +y_0=999999.9999960001 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2281":
        "+proj=lcc +lat_1=40.65 +lat_2=39.01666666666667 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=500000.0001504 +y_0=1999999.999992 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2282":
        "+proj=lcc +lat_1=38.35 +lat_2=37.21666666666667 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=500000.0001504 +y_0=2999999.999988 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2283":
        "+proj=lcc +lat_1=39.2 +lat_2=38.03333333333333 +lat_0=37.66666666666666 +lon_0=-78.5 +x_0=3500000.0001016 +y_0=2000000.0001016 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2284":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=36.76666666666667 +lat_0=36.33333333333334 +lon_0=-78.5 +x_0=3500000.0001016 +y_0=999999.9998983998 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2285":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.5 +lat_0=47 +lon_0=-120.8333333333333 +x_0=500000.0001016001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2286":
        "+proj=lcc +lat_1=47.33333333333334 +lat_2=45.83333333333334 +lat_0=45.33333333333334 +lon_0=-120.5 +x_0=500000.0001016001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2287":
        "+proj=lcc +lat_1=46.76666666666667 +lat_2=45.56666666666667 +lat_0=45.16666666666666 +lon_0=-90 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2288":
        "+proj=lcc +lat_1=45.5 +lat_2=44.25 +lat_0=43.83333333333334 +lon_0=-90 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2289":
        "+proj=lcc +lat_1=44.06666666666667 +lat_2=42.73333333333333 +lat_0=42 +lon_0=-90 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2290":
        "+proj=sterea +lat_0=47.25 +lon_0=-63 +k=0.999912 +x_0=700000 +y_0=400000 +a=6378135 +b=6356750.304921594 +units=m +no_defs",
      "EPSG:2291":
        "+proj=sterea +lat_0=47.25 +lon_0=-63 +k=0.999912 +x_0=400000 +y_0=800000 +a=6378135 +b=6356750.304921594 +units=m +no_defs",
      "EPSG:2292":
        "+proj=sterea +lat_0=47.25 +lon_0=-63 +k=0.999912 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2294":
        "+proj=tmerc +lat_0=0 +lon_0=-61.5 +k=0.9999 +x_0=4500000 +y_0=0 +a=6378135 +b=6356750.304921594 +units=m +no_defs",
      "EPSG:2295":
        "+proj=tmerc +lat_0=0 +lon_0=-64.5 +k=0.9999 +x_0=5500000 +y_0=0 +a=6378135 +b=6356750.304921594 +units=m +no_defs",
      "EPSG:2308":
        "+proj=tmerc +lat_0=0 +lon_0=109 +k=0.9996 +x_0=500000 +y_0=10000000 +ellps=bessel +towgs84=-377,681,-50,0,0,0,0 +units=m +no_defs",
      "EPSG:2309":
        "+proj=tmerc +lat_0=0 +lon_0=116 +k=0.9996 +x_0=500000 +y_0=10000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:2310":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=0.9996 +x_0=500000 +y_0=10000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:2311":
        "+proj=tmerc +lat_0=0 +lon_0=6 +k=0.9996 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:2312": "+proj=utm +zone=33 +ellps=clrk80 +units=m +no_defs",
      "EPSG:2313": "+proj=utm +zone=33 +ellps=clrk80 +units=m +no_defs",
      "EPSG:2314":
        "+proj=cass +lat_0=10.44166666666667 +lon_0=-61.33333333333334 +x_0=86501.46392052001 +y_0=65379.0134283 +a=6378293.645208759 +b=6356617.987679838 +towgs84=-61.702,284.488,472.052,0,0,0,0 +to_meter=0.3047972654 +no_defs",
      "EPSG:2315":
        "+proj=utm +zone=19 +south +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs",
      "EPSG:2316":
        "+proj=utm +zone=20 +south +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs",
      "EPSG:2317":
        "+proj=lcc +lat_1=9 +lat_2=3 +lat_0=6 +lon_0=-66 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:2318":
        "+proj=lcc +lat_1=17 +lat_2=33 +lat_0=25.08951 +lon_0=48 +x_0=0 +y_0=0 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
      "EPSG:2319":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2320":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2321":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2322":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2323":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2324":
        "+proj=tmerc +lat_0=0 +lon_0=42 +k=1 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2325":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:2326":
        "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs",
      "EPSG:2327":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=13500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2328":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=14500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2329":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=15500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2330":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=16500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2331":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=17500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2332":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2333":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2334":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=20500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2335":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=21500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2336":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=22500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2337":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=23500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2338":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2339":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2340":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2341":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2342":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2343":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2344":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2345":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2346":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2347":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2348":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2349":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2350":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2351":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2352":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2353":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2354":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2355":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2356":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2357":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2358":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2359":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2360":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2361":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2362":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2363":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2364":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2365":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2366":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2367":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2368":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2369":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2370":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2371":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2372":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2373":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2374":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2375":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2376":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2377":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2378":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2379":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2380":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2381":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2382":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2383":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2384":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2385":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2386":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2387":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2388":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2389":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2390":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs",
      "EPSG:2391":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +no_defs",
      "EPSG:2392":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=2500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +no_defs",
      "EPSG:2393":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +no_defs",
      "EPSG:2394":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=4500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +no_defs",
      "EPSG:2395":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=8500000 +y_0=0 +ellps=krass +towgs84=-76,-138,67,0,0,0,0 +units=m +no_defs",
      "EPSG:2396":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=9500000 +y_0=0 +ellps=krass +towgs84=-76,-138,67,0,0,0,0 +units=m +no_defs",
      "EPSG:2397":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:2398":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:2399":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:2400":
        "+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs",
      "EPSG:2401":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2402":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2403":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2404":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2405":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2406":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2407":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2408":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2409":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2410":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2411":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2412":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2413":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2414":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2415":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2416":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2417":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2418":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2419":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2420":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2421":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2422":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2423":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2424":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2425":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2426":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2427":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2428":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2429":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2430":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2431":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2432":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2433":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2434":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2435":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2436":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2437":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2438":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2439":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2440":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2441":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2442":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:2443":
        "+proj=tmerc +lat_0=33 +lon_0=129.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2444":
        "+proj=tmerc +lat_0=33 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2445":
        "+proj=tmerc +lat_0=36 +lon_0=132.1666666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2446":
        "+proj=tmerc +lat_0=33 +lon_0=133.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2447":
        "+proj=tmerc +lat_0=36 +lon_0=134.3333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2448":
        "+proj=tmerc +lat_0=36 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2449":
        "+proj=tmerc +lat_0=36 +lon_0=137.1666666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2450":
        "+proj=tmerc +lat_0=36 +lon_0=138.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2451":
        "+proj=tmerc +lat_0=36 +lon_0=139.8333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2452":
        "+proj=tmerc +lat_0=40 +lon_0=140.8333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2453":
        "+proj=tmerc +lat_0=44 +lon_0=140.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2454":
        "+proj=tmerc +lat_0=44 +lon_0=142.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2455":
        "+proj=tmerc +lat_0=44 +lon_0=144.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2456":
        "+proj=tmerc +lat_0=26 +lon_0=142 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2457":
        "+proj=tmerc +lat_0=26 +lon_0=127.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2458":
        "+proj=tmerc +lat_0=26 +lon_0=124 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2459":
        "+proj=tmerc +lat_0=26 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2460":
        "+proj=tmerc +lat_0=20 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2461":
        "+proj=tmerc +lat_0=26 +lon_0=154 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2462":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:2463":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2464":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2465":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2466":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2467":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2468":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2469":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2470":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2471":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2472":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2473":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2474":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2475":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2476":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2477":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2478":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2479":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2480":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2481":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2482":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2483":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2484":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2485":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2486":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2487":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2488":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2489":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2490":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2491":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2492":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2493":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2494":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2495":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2496":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2497":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2498":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2499":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2500":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2501":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2502":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2503":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2504":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2505":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2506":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2507":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2508":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2509":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2510":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2511":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2512":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2513":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2514":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2515":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2516":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2517":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2518":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2519":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2520":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2521":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2522":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2523":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2524":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=8500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2525":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=9500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2526":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=10500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2527":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=11500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2528":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=12500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2529":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=13500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2530":
        "+proj=tmerc +lat_0=0 +lon_0=42 +k=1 +x_0=14500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2531":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=15500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2532":
        "+proj=tmerc +lat_0=0 +lon_0=48 +k=1 +x_0=16500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2533":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=17500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2534":
        "+proj=tmerc +lat_0=0 +lon_0=54 +k=1 +x_0=18500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2535":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=19500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2536":
        "+proj=tmerc +lat_0=0 +lon_0=60 +k=1 +x_0=20500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2537":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=21500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2538":
        "+proj=tmerc +lat_0=0 +lon_0=66 +k=1 +x_0=22500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2539":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=23500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2540":
        "+proj=tmerc +lat_0=0 +lon_0=72 +k=1 +x_0=24500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2541":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2542":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2543":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2544":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2545":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2546":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2547":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2548":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2549":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2550":
        "+proj=utm +zone=50 +south +ellps=bessel +towgs84=-404.78,685.68,45.47,0,0,0,0 +units=m +no_defs",
      "EPSG:2551":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2552":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2553":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2554":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2555":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2556":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2557":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2558":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2559":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2560":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2561":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2562":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2563":
        "+proj=tmerc +lat_0=0 +lon_0=138 +k=1 +x_0=46500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2564":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=47500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2565":
        "+proj=tmerc +lat_0=0 +lon_0=144 +k=1 +x_0=48500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2566":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=49500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2567":
        "+proj=tmerc +lat_0=0 +lon_0=150 +k=1 +x_0=50500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2568":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=51500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2569":
        "+proj=tmerc +lat_0=0 +lon_0=156 +k=1 +x_0=52500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2570":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=53500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2571":
        "+proj=tmerc +lat_0=0 +lon_0=162 +k=1 +x_0=54500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2572":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=55500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2573":
        "+proj=tmerc +lat_0=0 +lon_0=168 +k=1 +x_0=56500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2574":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=57500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2575":
        "+proj=tmerc +lat_0=0 +lon_0=174 +k=1 +x_0=58500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2576":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=59500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2577":
        "+proj=tmerc +lat_0=0 +lon_0=180 +k=1 +x_0=60000000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2578":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=61500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2579":
        "+proj=tmerc +lat_0=0 +lon_0=-174 +k=1 +x_0=62500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2580":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=63500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2581":
        "+proj=tmerc +lat_0=0 +lon_0=-168 +k=1 +x_0=64500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2582":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2583":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2584":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2585":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2586":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2587":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2588":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2589":
        "+proj=tmerc +lat_0=0 +lon_0=42 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2590":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2591":
        "+proj=tmerc +lat_0=0 +lon_0=48 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2592":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2593":
        "+proj=tmerc +lat_0=0 +lon_0=54 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2594":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2595":
        "+proj=tmerc +lat_0=0 +lon_0=60 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2596":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2597":
        "+proj=tmerc +lat_0=0 +lon_0=66 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2598":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2599":
        "+proj=tmerc +lat_0=0 +lon_0=72 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2600":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2601":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2602":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2603":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2604":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2605":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2606":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2607":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2608":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2609":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2610":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2611":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2612":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2613":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2614":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2615":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2616":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2617":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2618":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2619":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2620":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2621":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2622":
        "+proj=tmerc +lat_0=0 +lon_0=138 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2623":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2624":
        "+proj=tmerc +lat_0=0 +lon_0=144 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2625":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2626":
        "+proj=tmerc +lat_0=0 +lon_0=150 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2627":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2628":
        "+proj=tmerc +lat_0=0 +lon_0=156 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2629":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2630":
        "+proj=tmerc +lat_0=0 +lon_0=162 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2631":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2632":
        "+proj=tmerc +lat_0=0 +lon_0=168 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2633":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2634":
        "+proj=tmerc +lat_0=0 +lon_0=174 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2635":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2636":
        "+proj=tmerc +lat_0=0 +lon_0=180 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2637":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2638":
        "+proj=tmerc +lat_0=0 +lon_0=-174 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2639":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2640":
        "+proj=tmerc +lat_0=0 +lon_0=-168 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2641":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2642":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=8500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2643":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=9500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2644":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=10500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2645":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=11500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2646":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=12500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2647":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=13500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2648":
        "+proj=tmerc +lat_0=0 +lon_0=42 +k=1 +x_0=14500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2649":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=15500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2650":
        "+proj=tmerc +lat_0=0 +lon_0=48 +k=1 +x_0=16500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2651":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=17500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2652":
        "+proj=tmerc +lat_0=0 +lon_0=54 +k=1 +x_0=18500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2653":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=19500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2654":
        "+proj=tmerc +lat_0=0 +lon_0=60 +k=1 +x_0=20500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2655":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=21500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2656":
        "+proj=tmerc +lat_0=0 +lon_0=66 +k=1 +x_0=22500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2657":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=23500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2658":
        "+proj=tmerc +lat_0=0 +lon_0=72 +k=1 +x_0=24500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2659":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2660":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2661":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2662":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2663":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2664":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2665":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2666":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2667":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2668":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2669":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2670":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2671":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2672":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2673":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2674":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2675":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2676":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2677":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2678":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2679":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2680":
        "+proj=tmerc +lat_0=0 +lon_0=138 +k=1 +x_0=46500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2681":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=47500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2682":
        "+proj=tmerc +lat_0=0 +lon_0=144 +k=1 +x_0=48500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2683":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=49500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2684":
        "+proj=tmerc +lat_0=0 +lon_0=150 +k=1 +x_0=50500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2685":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=51500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2686":
        "+proj=tmerc +lat_0=0 +lon_0=156 +k=1 +x_0=52500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2687":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=53500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2688":
        "+proj=tmerc +lat_0=0 +lon_0=162 +k=1 +x_0=54500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2689":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=55500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2690":
        "+proj=tmerc +lat_0=0 +lon_0=168 +k=1 +x_0=56500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2691":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=57500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2692":
        "+proj=tmerc +lat_0=0 +lon_0=174 +k=1 +x_0=58500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2693":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=59500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2694":
        "+proj=tmerc +lat_0=0 +lon_0=180 +k=1 +x_0=60000000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2695":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=61500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2696":
        "+proj=tmerc +lat_0=0 +lon_0=-174 +k=1 +x_0=62500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2697":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=63500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2698":
        "+proj=tmerc +lat_0=0 +lon_0=-168 +k=1 +x_0=64500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2699":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2700":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2701":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2702":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2703":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2704":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2705":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2706":
        "+proj=tmerc +lat_0=0 +lon_0=42 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2707":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2708":
        "+proj=tmerc +lat_0=0 +lon_0=48 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2709":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2710":
        "+proj=tmerc +lat_0=0 +lon_0=54 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2711":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2712":
        "+proj=tmerc +lat_0=0 +lon_0=60 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2713":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2714":
        "+proj=tmerc +lat_0=0 +lon_0=66 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2715":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2716":
        "+proj=tmerc +lat_0=0 +lon_0=72 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2717":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2718":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2719":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2720":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2721":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2722":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2723":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2724":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2725":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2726":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2727":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2728":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2729":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2730":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2731":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2732":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2733":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2734":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2735":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2736":
        "+proj=utm +zone=36 +south +ellps=clrk66 +towgs84=219.315,168.975,-166.145,0.198,5.926,-2.356,-57.104 +units=m +no_defs",
      "EPSG:2737":
        "+proj=utm +zone=37 +south +ellps=clrk66 +towgs84=219.315,168.975,-166.145,0.198,5.926,-2.356,-57.104 +units=m +no_defs",
      "EPSG:2738":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2739":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2740":
        "+proj=tmerc +lat_0=0 +lon_0=138 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2741":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2742":
        "+proj=tmerc +lat_0=0 +lon_0=144 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2743":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2744":
        "+proj=tmerc +lat_0=0 +lon_0=150 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2745":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2746":
        "+proj=tmerc +lat_0=0 +lon_0=156 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2747":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2748":
        "+proj=tmerc +lat_0=0 +lon_0=162 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2749":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2750":
        "+proj=tmerc +lat_0=0 +lon_0=168 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2751":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2752":
        "+proj=tmerc +lat_0=0 +lon_0=174 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2753":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2754":
        "+proj=tmerc +lat_0=0 +lon_0=180 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2755":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2756":
        "+proj=tmerc +lat_0=0 +lon_0=-174 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2757":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2758":
        "+proj=tmerc +lat_0=0 +lon_0=-168 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:2759":
        "+proj=tmerc +lat_0=30.5 +lon_0=-85.83333333333333 +k=0.99996 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2760":
        "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2761":
        "+proj=tmerc +lat_0=31 +lon_0=-110.1666666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2762":
        "+proj=tmerc +lat_0=31 +lon_0=-111.9166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2763":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2764":
        "+proj=lcc +lat_1=36.23333333333333 +lat_2=34.93333333333333 +lat_0=34.33333333333334 +lon_0=-92 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2765":
        "+proj=lcc +lat_1=34.76666666666667 +lat_2=33.3 +lat_0=32.66666666666666 +lon_0=-92 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2766":
        "+proj=lcc +lat_1=41.66666666666666 +lat_2=40 +lat_0=39.33333333333334 +lon_0=-122 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2767":
        "+proj=lcc +lat_1=39.83333333333334 +lat_2=38.33333333333334 +lat_0=37.66666666666666 +lon_0=-122 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2768":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.06666666666667 +lat_0=36.5 +lon_0=-120.5 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2769":
        "+proj=lcc +lat_1=37.25 +lat_2=36 +lat_0=35.33333333333334 +lon_0=-119 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2770":
        "+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2771":
        "+proj=lcc +lat_1=33.88333333333333 +lat_2=32.78333333333333 +lat_0=32.16666666666666 +lon_0=-116.25 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2772":
        "+proj=lcc +lat_1=40.78333333333333 +lat_2=39.71666666666667 +lat_0=39.33333333333334 +lon_0=-105.5 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2773":
        "+proj=lcc +lat_1=39.75 +lat_2=38.45 +lat_0=37.83333333333334 +lon_0=-105.5 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2774":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.23333333333333 +lat_0=36.66666666666666 +lon_0=-105.5 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2775":
        "+proj=lcc +lat_1=41.86666666666667 +lat_2=41.2 +lat_0=40.83333333333334 +lon_0=-72.75 +x_0=304800.6096 +y_0=152400.3048 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2776":
        "+proj=tmerc +lat_0=38 +lon_0=-75.41666666666667 +k=0.999995 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2777":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2778":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2779":
        "+proj=lcc +lat_1=30.75 +lat_2=29.58333333333333 +lat_0=29 +lon_0=-84.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2780":
        "+proj=tmerc +lat_0=30 +lon_0=-82.16666666666667 +k=0.9999 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2781":
        "+proj=tmerc +lat_0=30 +lon_0=-84.16666666666667 +k=0.9999 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2782":
        "+proj=tmerc +lat_0=18.83333333333333 +lon_0=-155.5 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2783":
        "+proj=tmerc +lat_0=20.33333333333333 +lon_0=-156.6666666666667 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2784":
        "+proj=tmerc +lat_0=21.16666666666667 +lon_0=-158 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2785":
        "+proj=tmerc +lat_0=21.83333333333333 +lon_0=-159.5 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2786":
        "+proj=tmerc +lat_0=21.66666666666667 +lon_0=-160.1666666666667 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2787":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-112.1666666666667 +k=0.9999473679999999 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2788":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-114 +k=0.9999473679999999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2789":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-115.75 +k=0.999933333 +x_0=800000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2790":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2791":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-90.16666666666667 +k=0.999941177 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2792":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2793":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2794":
        "+proj=lcc +lat_1=43.26666666666667 +lat_2=42.06666666666667 +lat_0=41.5 +lon_0=-93.5 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2795":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.61666666666667 +lat_0=40 +lon_0=-93.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2796":
        "+proj=lcc +lat_1=39.78333333333333 +lat_2=38.71666666666667 +lat_0=38.33333333333334 +lon_0=-98 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2797":
        "+proj=lcc +lat_1=38.56666666666667 +lat_2=37.26666666666667 +lat_0=36.66666666666666 +lon_0=-98.5 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2798":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=38.96666666666667 +lat_0=37.5 +lon_0=-84.25 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2799":
        "+proj=lcc +lat_1=37.93333333333333 +lat_2=36.73333333333333 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2800":
        "+proj=lcc +lat_1=32.66666666666666 +lat_2=31.16666666666667 +lat_0=30.5 +lon_0=-92.5 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2801":
        "+proj=lcc +lat_1=30.7 +lat_2=29.3 +lat_0=28.5 +lon_0=-91.33333333333333 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2802":
        "+proj=tmerc +lat_0=43.66666666666666 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2803":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2804":
        "+proj=lcc +lat_1=39.45 +lat_2=38.3 +lat_0=37.66666666666666 +lon_0=-77 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2805":
        "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2806":
        "+proj=lcc +lat_1=41.48333333333333 +lat_2=41.28333333333333 +lat_0=41 +lon_0=-70.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2807":
        "+proj=lcc +lat_1=47.08333333333334 +lat_2=45.48333333333333 +lat_0=44.78333333333333 +lon_0=-87 +x_0=8000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2808":
        "+proj=lcc +lat_1=45.7 +lat_2=44.18333333333333 +lat_0=43.31666666666667 +lon_0=-84.36666666666666 +x_0=6000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2809":
        "+proj=lcc +lat_1=43.66666666666666 +lat_2=42.1 +lat_0=41.5 +lon_0=-84.36666666666666 +x_0=4000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2810":
        "+proj=lcc +lat_1=48.63333333333333 +lat_2=47.03333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2811":
        "+proj=lcc +lat_1=47.05 +lat_2=45.61666666666667 +lat_0=45 +lon_0=-94.25 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2812":
        "+proj=lcc +lat_1=45.21666666666667 +lat_2=43.78333333333333 +lat_0=43 +lon_0=-94 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2813":
        "+proj=tmerc +lat_0=29.5 +lon_0=-88.83333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2814":
        "+proj=tmerc +lat_0=29.5 +lon_0=-90.33333333333333 +k=0.99995 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2815":
        "+proj=tmerc +lat_0=35.83333333333334 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2816":
        "+proj=tmerc +lat_0=35.83333333333334 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2817":
        "+proj=tmerc +lat_0=36.16666666666666 +lon_0=-94.5 +k=0.999941177 +x_0=850000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2818":
        "+proj=lcc +lat_1=49 +lat_2=45 +lat_0=44.25 +lon_0=-109.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2819":
        "+proj=lcc +lat_1=43 +lat_2=40 +lat_0=39.83333333333334 +lon_0=-100 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2820":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.5833333333333 +k=0.9999 +x_0=200000 +y_0=8000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2821":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.6666666666667 +k=0.9999 +x_0=500000 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2822":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.5833333333333 +k=0.9999 +x_0=800000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2823":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.66666666666667 +k=0.999966667 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2824":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2825":
        "+proj=tmerc +lat_0=31 +lon_0=-104.3333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2826":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2827":
        "+proj=tmerc +lat_0=31 +lon_0=-107.8333333333333 +k=0.999916667 +x_0=830000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2828":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2829":
        "+proj=tmerc +lat_0=40 +lon_0=-76.58333333333333 +k=0.9999375 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2830":
        "+proj=tmerc +lat_0=40 +lon_0=-78.58333333333333 +k=0.9999375 +x_0=350000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2831":
        "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2832":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.43333333333333 +lat_0=47 +lon_0=-100.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2833":
        "+proj=lcc +lat_1=47.48333333333333 +lat_2=46.18333333333333 +lat_0=45.66666666666666 +lon_0=-100.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2834":
        "+proj=lcc +lat_1=41.7 +lat_2=40.43333333333333 +lat_0=39.66666666666666 +lon_0=-82.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2835":
        "+proj=lcc +lat_1=40.03333333333333 +lat_2=38.73333333333333 +lat_0=38 +lon_0=-82.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2836":
        "+proj=lcc +lat_1=36.76666666666667 +lat_2=35.56666666666667 +lat_0=35 +lon_0=-98 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2837":
        "+proj=lcc +lat_1=35.23333333333333 +lat_2=33.93333333333333 +lat_0=33.33333333333334 +lon_0=-98 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2838":
        "+proj=lcc +lat_1=46 +lat_2=44.33333333333334 +lat_0=43.66666666666666 +lon_0=-120.5 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2839":
        "+proj=lcc +lat_1=44 +lat_2=42.33333333333334 +lat_0=41.66666666666666 +lon_0=-120.5 +x_0=1500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2840":
        "+proj=tmerc +lat_0=41.08333333333334 +lon_0=-71.5 +k=0.99999375 +x_0=100000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2841":
        "+proj=lcc +lat_1=45.68333333333333 +lat_2=44.41666666666666 +lat_0=43.83333333333334 +lon_0=-100 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2842":
        "+proj=lcc +lat_1=44.4 +lat_2=42.83333333333334 +lat_0=42.33333333333334 +lon_0=-100.3333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2843":
        "+proj=lcc +lat_1=36.41666666666666 +lat_2=35.25 +lat_0=34.33333333333334 +lon_0=-86 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2844":
        "+proj=lcc +lat_1=36.18333333333333 +lat_2=34.65 +lat_0=34 +lon_0=-101.5 +x_0=200000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2845":
        "+proj=lcc +lat_1=33.96666666666667 +lat_2=32.13333333333333 +lat_0=31.66666666666667 +lon_0=-98.5 +x_0=600000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2846":
        "+proj=lcc +lat_1=31.88333333333333 +lat_2=30.11666666666667 +lat_0=29.66666666666667 +lon_0=-100.3333333333333 +x_0=700000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2847":
        "+proj=lcc +lat_1=30.28333333333333 +lat_2=28.38333333333333 +lat_0=27.83333333333333 +lon_0=-99 +x_0=600000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2848":
        "+proj=lcc +lat_1=27.83333333333333 +lat_2=26.16666666666667 +lat_0=25.66666666666667 +lon_0=-98.5 +x_0=300000 +y_0=5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2849":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.71666666666667 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2850":
        "+proj=lcc +lat_1=40.65 +lat_2=39.01666666666667 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2851":
        "+proj=lcc +lat_1=38.35 +lat_2=37.21666666666667 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=500000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2852":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2853":
        "+proj=lcc +lat_1=39.2 +lat_2=38.03333333333333 +lat_0=37.66666666666666 +lon_0=-78.5 +x_0=3500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2854":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=36.76666666666667 +lat_0=36.33333333333334 +lon_0=-78.5 +x_0=3500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2855":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.5 +lat_0=47 +lon_0=-120.8333333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2856":
        "+proj=lcc +lat_1=47.33333333333334 +lat_2=45.83333333333334 +lat_0=45.33333333333334 +lon_0=-120.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2857":
        "+proj=lcc +lat_1=40.25 +lat_2=39 +lat_0=38.5 +lon_0=-79.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2858":
        "+proj=lcc +lat_1=38.88333333333333 +lat_2=37.48333333333333 +lat_0=37 +lon_0=-81 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2859":
        "+proj=lcc +lat_1=46.76666666666667 +lat_2=45.56666666666667 +lat_0=45.16666666666666 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2860":
        "+proj=lcc +lat_1=45.5 +lat_2=44.25 +lat_0=43.83333333333334 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2861":
        "+proj=lcc +lat_1=44.06666666666667 +lat_2=42.73333333333333 +lat_0=42 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2862":
        "+proj=tmerc +lat_0=40.5 +lon_0=-105.1666666666667 +k=0.9999375 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2863":
        "+proj=tmerc +lat_0=40.5 +lon_0=-107.3333333333333 +k=0.9999375 +x_0=400000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2864":
        "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2865":
        "+proj=tmerc +lat_0=40.5 +lon_0=-110.0833333333333 +k=0.9999375 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2866":
        "+proj=lcc +lat_1=18.43333333333333 +lat_2=18.03333333333333 +lat_0=17.83333333333333 +lon_0=-66.43333333333334 +x_0=200000 +y_0=200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2867":
        "+proj=tmerc +lat_0=31 +lon_0=-110.1666666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2868":
        "+proj=tmerc +lat_0=31 +lon_0=-111.9166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2869":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2870":
        "+proj=lcc +lat_1=41.66666666666666 +lat_2=40 +lat_0=39.33333333333334 +lon_0=-122 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2871":
        "+proj=lcc +lat_1=39.83333333333334 +lat_2=38.33333333333334 +lat_0=37.66666666666666 +lon_0=-122 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2872":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.06666666666667 +lat_0=36.5 +lon_0=-120.5 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2873":
        "+proj=lcc +lat_1=37.25 +lat_2=36 +lat_0=35.33333333333334 +lon_0=-119 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2874":
        "+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2875":
        "+proj=lcc +lat_1=33.88333333333333 +lat_2=32.78333333333333 +lat_0=32.16666666666666 +lon_0=-116.25 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2876":
        "+proj=lcc +lat_1=40.78333333333333 +lat_2=39.71666666666667 +lat_0=39.33333333333334 +lon_0=-105.5 +x_0=914401.8288036576 +y_0=304800.6096012192 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2877":
        "+proj=lcc +lat_1=39.75 +lat_2=38.45 +lat_0=37.83333333333334 +lon_0=-105.5 +x_0=914401.8288036576 +y_0=304800.6096012192 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2878":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.23333333333333 +lat_0=36.66666666666666 +lon_0=-105.5 +x_0=914401.8288036576 +y_0=304800.6096012192 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2879":
        "+proj=lcc +lat_1=41.86666666666667 +lat_2=41.2 +lat_0=40.83333333333334 +lon_0=-72.75 +x_0=304800.6096012192 +y_0=152400.3048006096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2880":
        "+proj=tmerc +lat_0=38 +lon_0=-75.41666666666667 +k=0.999995 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2881":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2882":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2883":
        "+proj=lcc +lat_1=30.75 +lat_2=29.58333333333333 +lat_0=29 +lon_0=-84.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2884":
        "+proj=tmerc +lat_0=30 +lon_0=-82.16666666666667 +k=0.9999 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2885":
        "+proj=tmerc +lat_0=30 +lon_0=-84.16666666666667 +k=0.9999 +x_0=699999.9998983998 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2886":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-112.1666666666667 +k=0.9999473679999999 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2887":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-114 +k=0.9999473679999999 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2888":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-115.75 +k=0.999933333 +x_0=800000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2889":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=99999.99989839978 +y_0=249364.9987299975 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2890":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=249364.9987299975 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2891":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=38.96666666666667 +lat_0=37.5 +lon_0=-84.25 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2892":
        "+proj=lcc +lat_1=37.93333333333333 +lat_2=36.73333333333333 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=500000.0001016001 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2893":
        "+proj=lcc +lat_1=39.45 +lat_2=38.3 +lat_0=37.66666666666666 +lon_0=-77 +x_0=399999.9998983998 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2894":
        "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000.0001016002 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2895":
        "+proj=lcc +lat_1=41.48333333333333 +lat_2=41.28333333333333 +lat_0=41 +lon_0=-70.5 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2896":
        "+proj=lcc +lat_1=47.08333333333334 +lat_2=45.48333333333333 +lat_0=44.78333333333333 +lon_0=-87 +x_0=7999999.999968001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2897":
        "+proj=lcc +lat_1=45.7 +lat_2=44.18333333333333 +lat_0=43.31666666666667 +lon_0=-84.36666666666666 +x_0=5999999.999976001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2898":
        "+proj=lcc +lat_1=43.66666666666666 +lat_2=42.1 +lat_0=41.5 +lon_0=-84.36666666666666 +x_0=3999999.999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2899":
        "+proj=tmerc +lat_0=29.5 +lon_0=-88.83333333333333 +k=0.99995 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2900":
        "+proj=tmerc +lat_0=29.5 +lon_0=-90.33333333333333 +k=0.99995 +x_0=699999.9998983998 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2901":
        "+proj=lcc +lat_1=49 +lat_2=45 +lat_0=44.25 +lon_0=-109.5 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2902":
        "+proj=tmerc +lat_0=31 +lon_0=-104.3333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2903":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2904":
        "+proj=tmerc +lat_0=31 +lon_0=-107.8333333333333 +k=0.999916667 +x_0=830000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2905":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2906":
        "+proj=tmerc +lat_0=40 +lon_0=-76.58333333333333 +k=0.9999375 +x_0=249999.9998983998 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2907":
        "+proj=tmerc +lat_0=40 +lon_0=-78.58333333333333 +k=0.9999375 +x_0=350000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2908":
        "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2909":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.43333333333333 +lat_0=47 +lon_0=-100.5 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2910":
        "+proj=lcc +lat_1=47.48333333333333 +lat_2=46.18333333333333 +lat_0=45.66666666666666 +lon_0=-100.5 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2911":
        "+proj=lcc +lat_1=36.76666666666667 +lat_2=35.56666666666667 +lat_0=35 +lon_0=-98 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2912":
        "+proj=lcc +lat_1=35.23333333333333 +lat_2=33.93333333333333 +lat_0=33.33333333333334 +lon_0=-98 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2913":
        "+proj=lcc +lat_1=46 +lat_2=44.33333333333334 +lat_0=43.66666666666666 +lon_0=-120.5 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2914":
        "+proj=lcc +lat_1=44 +lat_2=42.33333333333334 +lat_0=41.66666666666666 +lon_0=-120.5 +x_0=1500000.0001464 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2915":
        "+proj=lcc +lat_1=36.41666666666666 +lat_2=35.25 +lat_0=34.33333333333334 +lon_0=-86 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2916":
        "+proj=lcc +lat_1=36.18333333333333 +lat_2=34.65 +lat_0=34 +lon_0=-101.5 +x_0=200000.0001016002 +y_0=999999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2917":
        "+proj=lcc +lat_1=33.96666666666667 +lat_2=32.13333333333333 +lat_0=31.66666666666667 +lon_0=-98.5 +x_0=600000 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2918":
        "+proj=lcc +lat_1=31.88333333333333 +lat_2=30.11666666666667 +lat_0=29.66666666666667 +lon_0=-100.3333333333333 +x_0=699999.9998983998 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2919":
        "+proj=lcc +lat_1=30.28333333333333 +lat_2=28.38333333333333 +lat_0=27.83333333333333 +lon_0=-99 +x_0=600000 +y_0=3999999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2920":
        "+proj=lcc +lat_1=27.83333333333333 +lat_2=26.16666666666667 +lat_0=25.66666666666667 +lon_0=-98.5 +x_0=300000.0000000001 +y_0=5000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2921":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.71666666666667 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=500000.0001504 +y_0=999999.9999960001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2922":
        "+proj=lcc +lat_1=40.65 +lat_2=39.01666666666667 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=500000.0001504 +y_0=1999999.999992 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2923":
        "+proj=lcc +lat_1=38.35 +lat_2=37.21666666666667 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=500000.0001504 +y_0=2999999.999988 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2924":
        "+proj=lcc +lat_1=39.2 +lat_2=38.03333333333333 +lat_0=37.66666666666666 +lon_0=-78.5 +x_0=3500000.0001016 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2925":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=36.76666666666667 +lat_0=36.33333333333334 +lon_0=-78.5 +x_0=3500000.0001016 +y_0=999999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2926":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.5 +lat_0=47 +lon_0=-120.8333333333333 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2927":
        "+proj=lcc +lat_1=47.33333333333334 +lat_2=45.83333333333334 +lat_0=45.33333333333334 +lon_0=-120.5 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2928":
        "+proj=lcc +lat_1=46.76666666666667 +lat_2=45.56666666666667 +lat_0=45.16666666666666 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2929":
        "+proj=lcc +lat_1=45.5 +lat_2=44.25 +lat_0=43.83333333333334 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2930":
        "+proj=lcc +lat_1=44.06666666666667 +lat_2=42.73333333333333 +lat_0=42 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2931":
        "+proj=tmerc +lat_0=0 +lon_0=13 +k=0.9996 +x_0=500000 +y_0=0 +a=6378249.2 +b=6356515 +towgs84=-106,-87,188,0,0,0,0 +units=m +no_defs",
      "EPSG:2932":
        "+proj=tmerc +lat_0=24.45 +lon_0=51.21666666666667 +k=0.99999 +x_0=200000 +y_0=300000 +ellps=intl +towgs84=-119.425,-303.659,-11.0006,1.1643,0.174458,1.09626,3.65706 +units=m +no_defs",
      "EPSG:2933":
        "+proj=utm +zone=50 +south +ellps=bessel +towgs84=-403,684,41,0,0,0,0 +units=m +no_defs",
      "EPSG:2934":
        "+proj=merc +lon_0=110 +k=0.997 +x_0=3900000 +y_0=900000 +ellps=bessel +towgs84=-403,684,41,0,0,0,0 +pm=jakarta +units=m +no_defs",
      "EPSG:2935":
        "+proj=tmerc +lat_0=0.1166666666666667 +lon_0=41.53333333333333 +k=1 +x_0=1300000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2936":
        "+proj=tmerc +lat_0=0.1166666666666667 +lon_0=44.53333333333333 +k=1 +x_0=2300000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2937":
        "+proj=tmerc +lat_0=0.1166666666666667 +lon_0=47.53333333333333 +k=1 +x_0=3300000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2938":
        "+proj=tmerc +lat_0=0.1166666666666667 +lon_0=50.53333333333333 +k=1 +x_0=4300000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2939":
        "+proj=tmerc +lat_0=0.1333333333333333 +lon_0=50.76666666666667 +k=1 +x_0=2300000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2940":
        "+proj=tmerc +lat_0=0.1333333333333333 +lon_0=53.76666666666667 +k=1 +x_0=3300000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2941":
        "+proj=tmerc +lat_0=0.1333333333333333 +lon_0=56.76666666666667 +k=1 +x_0=4300000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:2942":
        "+proj=utm +zone=28 +ellps=intl +towgs84=-499,-249,314,0,0,0,0 +units=m +no_defs",
      "EPSG:2943":
        "+proj=utm +zone=28 +ellps=intl +towgs84=-289,-124,60,0,0,0,0 +units=m +no_defs",
      "EPSG:2944":
        "+proj=tmerc +lat_0=0 +lon_0=-55.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2945":
        "+proj=tmerc +lat_0=0 +lon_0=-58.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2946":
        "+proj=tmerc +lat_0=0 +lon_0=-61.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2947":
        "+proj=tmerc +lat_0=0 +lon_0=-64.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2948":
        "+proj=tmerc +lat_0=0 +lon_0=-67.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2949":
        "+proj=tmerc +lat_0=0 +lon_0=-70.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2950":
        "+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2951":
        "+proj=tmerc +lat_0=0 +lon_0=-76.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2952":
        "+proj=tmerc +lat_0=0 +lon_0=-79.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2953":
        "+proj=sterea +lat_0=46.5 +lon_0=-66.5 +k=0.999912 +x_0=2500000 +y_0=7500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2954":
        "+proj=sterea +lat_0=47.25 +lon_0=-63 +k=0.999912 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2955":
        "+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2956":
        "+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2957":
        "+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2958":
        "+proj=utm +zone=17 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2959":
        "+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2960":
        "+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2961":
        "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2962":
        "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2964":
        "+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:2965":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=99999.99989839978 +y_0=249999.9998983998 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2966":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998983998 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:2967":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=99999.99989839978 +y_0=249999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2968":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:2969":
        "+proj=utm +zone=20 +ellps=intl +towgs84=137,248,-430,0,0,0,0 +units=m +no_defs",
      "EPSG:2970":
        "+proj=utm +zone=20 +ellps=intl +towgs84=-467,-16,-300,0,0,0,0 +units=m +no_defs",
      "EPSG:2971":
        "+proj=utm +zone=22 +ellps=intl +towgs84=-186,230,110,0,0,0,0 +units=m +no_defs",
      "EPSG:2972":
        "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2973":
        "+proj=utm +zone=20 +ellps=intl +towgs84=186,482,151,0,0,0,0 +units=m +no_defs",
      "EPSG:2975":
        "+proj=utm +zone=40 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2976":
        "+proj=utm +zone=6 +south +ellps=intl +towgs84=162,117,154,0,0,0,0 +units=m +no_defs",
      "EPSG:2977":
        "+proj=utm +zone=5 +south +ellps=intl +towgs84=72.438,345.918,79.486,1.6045,0.8823,0.5565,1.3746 +units=m +no_defs",
      "EPSG:2978":
        "+proj=utm +zone=7 +south +ellps=intl +towgs84=84,274,65,0,0,0,0 +units=m +no_defs",
      "EPSG:2979":
        "+proj=utm +zone=42 +south +ellps=intl +towgs84=145,-187,103,0,0,0,0 +units=m +no_defs",
      "EPSG:2980":
        "+proj=utm +zone=38 +south +ellps=intl +towgs84=-382,-59,-262,0,0,0,0 +units=m +no_defs",
      "EPSG:2981":
        "+proj=utm +zone=58 +south +ellps=intl +towgs84=335.47,222.58,-230.94,0,0,0,0 +units=m +no_defs",
      "EPSG:2982":
        "+proj=utm +zone=58 +south +ellps=intl +towgs84=-13,-348,292,0,0,0,0 +units=m +no_defs",
      "EPSG:2983":
        "+proj=utm +zone=58 +south +ellps=intl +towgs84=-122.383,-188.696,103.344,3.5107,-4.9668,-5.7047,4.4798 +units=m +no_defs",
      "EPSG:2984":
        "+proj=lcc +lat_1=-20.66666666666667 +lat_2=-22.33333333333333 +lat_0=-21.5 +lon_0=166 +x_0=400000 +y_0=300000 +ellps=intl +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2987":
        "+proj=utm +zone=21 +ellps=clrk66 +towgs84=30,430,368,0,0,0,0 +units=m +no_defs",
      "EPSG:2988":
        "+proj=utm +zone=1 +south +ellps=intl +towgs84=253,-132,-127,0,0,0,0 +units=m +no_defs",
      "EPSG:2989":
        "+proj=utm +zone=20 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2990":
        "+proj=tmerc +lat_0=-21.11666666666667 +lon_0=55.53333333333333 +k=1 +x_0=50000 +y_0=160000 +ellps=intl +towgs84=94,-948,-1262,0,0,0,0 +units=m +no_defs",
      "EPSG:2991":
        "+proj=lcc +lat_1=43 +lat_2=45.5 +lat_0=41.75 +lon_0=-120.5 +x_0=400000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:2992":
        "+proj=lcc +lat_1=43 +lat_2=45.5 +lat_0=41.75 +lon_0=-120.5 +x_0=399999.9999984 +y_0=0 +datum=NAD83 +units=ft +no_defs",
      "EPSG:2993":
        "+proj=lcc +lat_1=43 +lat_2=45.5 +lat_0=41.75 +lon_0=-120.5 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:2994":
        "+proj=lcc +lat_1=43 +lat_2=45.5 +lat_0=41.75 +lon_0=-120.5 +x_0=399999.9999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:2995":
        "+proj=utm +zone=58 +south +ellps=intl +towgs84=287.58,177.78,-135.41,0,0,0,0 +units=m +no_defs",
      "EPSG:2996":
        "+proj=utm +zone=58 +south +ellps=intl +towgs84=-13,-348,292,0,0,0,0 +units=m +no_defs",
      "EPSG:2997":
        "+proj=utm +zone=58 +south +ellps=intl +towgs84=-480.26,-438.32,-643.429,16.3119,20.1721,-4.0349,-111.7 +units=m +no_defs",
      "EPSG:2998":
        "+proj=utm +zone=58 +south +ellps=intl +towgs84=-10.18,-350.43,291.37,0,0,0,0 +units=m +no_defs",
      "EPSG:2999":
        "+proj=utm +zone=38 +south +ellps=intl +towgs84=-963,510,-359,0,0,0,0 +units=m +no_defs",
      "EPSG:3000":
        "+proj=merc +lon_0=110 +k=0.997 +x_0=3900000 +y_0=900000 +ellps=bessel +towgs84=-403,684,41,0,0,0,0 +units=m +no_defs",
      "EPSG:3001":
        "+proj=merc +lon_0=110 +k=0.997 +x_0=3900000 +y_0=900000 +ellps=bessel +towgs84=-377,681,-50,0,0,0,0 +units=m +no_defs",
      "EPSG:3002":
        "+proj=merc +lon_0=110 +k=0.997 +x_0=3900000 +y_0=900000 +ellps=bessel +towgs84=-587.8,519.75,145.76,0,0,0,0 +units=m +no_defs",
      "EPSG:3003":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs",
      "EPSG:3004":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9996 +x_0=2520000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs",
      "EPSG:3005":
        "+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 +x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3006":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3007":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3008":
        "+proj=tmerc +lat_0=0 +lon_0=13.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3009":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3010":
        "+proj=tmerc +lat_0=0 +lon_0=16.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3011":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3012":
        "+proj=tmerc +lat_0=0 +lon_0=14.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3013":
        "+proj=tmerc +lat_0=0 +lon_0=15.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3014":
        "+proj=tmerc +lat_0=0 +lon_0=17.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3015":
        "+proj=tmerc +lat_0=0 +lon_0=18.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3016":
        "+proj=tmerc +lat_0=0 +lon_0=20.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3017":
        "+proj=tmerc +lat_0=0 +lon_0=21.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3018":
        "+proj=tmerc +lat_0=0 +lon_0=23.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3019":
        "+proj=tmerc +lat_0=0 +lon_0=11.30827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs",
      "EPSG:3020":
        "+proj=tmerc +lat_0=0 +lon_0=13.55827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs",
      "EPSG:3021":
        "+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs",
      "EPSG:3022":
        "+proj=tmerc +lat_0=0 +lon_0=18.05827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs",
      "EPSG:3023":
        "+proj=tmerc +lat_0=0 +lon_0=20.30827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs",
      "EPSG:3024":
        "+proj=tmerc +lat_0=0 +lon_0=22.55827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs",
      "EPSG:3025":
        "+proj=tmerc +lat_0=0 +lon_0=11.30827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3026":
        "+proj=tmerc +lat_0=0 +lon_0=13.55827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3027":
        "+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3028":
        "+proj=tmerc +lat_0=0 +lon_0=18.05827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3029":
        "+proj=tmerc +lat_0=0 +lon_0=20.30827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3030":
        "+proj=tmerc +lat_0=0 +lon_0=22.55827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3031":
        "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3032":
        "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=70 +k=1 +x_0=6000000 +y_0=6000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:3033":
        "+proj=lcc +lat_1=-68.5 +lat_2=-74.5 +lat_0=-50 +lon_0=70 +x_0=6000000 +y_0=6000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:3034":
        "+proj=lcc +lat_1=35 +lat_2=65 +lat_0=52 +lon_0=10 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3035":
        "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3036":
        "+proj=utm +zone=36 +south +ellps=WGS84 +towgs84=0,0,0,-0,-0,-0,0 +units=m +no_defs",
      "EPSG:3037":
        "+proj=utm +zone=37 +south +ellps=WGS84 +towgs84=0,0,0,-0,-0,-0,0 +units=m +no_defs",
      "EPSG:3038":
        "+proj=utm +zone=26 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3039":
        "+proj=utm +zone=27 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3040":
        "+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3041":
        "+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3042":
        "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3043":
        "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3044":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3045":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3046":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3047":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3048":
        "+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3049":
        "+proj=utm +zone=37 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3050":
        "+proj=utm +zone=38 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3051":
        "+proj=utm +zone=39 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3054":
        "+proj=utm +zone=26 +ellps=intl +towgs84=-73,46,-86,0,0,0,0 +units=m +no_defs",
      "EPSG:3055":
        "+proj=utm +zone=27 +ellps=intl +towgs84=-73,46,-86,0,0,0,0 +units=m +no_defs",
      "EPSG:3056":
        "+proj=utm +zone=28 +ellps=intl +towgs84=-73,46,-86,0,0,0,0 +units=m +no_defs",
      "EPSG:3057":
        "+proj=lcc +lat_1=64.25 +lat_2=65.75 +lat_0=65 +lon_0=-19 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3058":
        "+proj=tmerc +lat_0=0 +lon_0=-8.5 +k=1 +x_0=50000 +y_0=-7800000 +ellps=intl +towgs84=982.609,552.753,-540.873,6.68163,-31.6115,-19.8482,16.805 +units=m +no_defs",
      "EPSG:3059":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3060":
        "+proj=utm +zone=58 +south +ellps=intl +towgs84=-11.64,-348.6,291.98,0,0,0,0 +units=m +no_defs",
      "EPSG:3061":
        "+proj=utm +zone=28 +ellps=intl +towgs84=-502.862,-247.438,312.724,0,0,0,0 +units=m +no_defs",
      "EPSG:3062":
        "+proj=utm +zone=26 +ellps=intl +towgs84=-204.619,140.176,55.226,0,0,0,0 +units=m +no_defs",
      "EPSG:3063":
        "+proj=utm +zone=26 +ellps=intl +towgs84=-106.226,166.366,-37.893,0,0,0,0 +units=m +no_defs",
      "EPSG:3064":
        "+proj=utm +zone=32 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3065":
        "+proj=utm +zone=33 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3066":
        "+proj=tmerc +lat_0=0 +lon_0=37 +k=0.9998 +x_0=500000 +y_0=-3000000 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:3067":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3068":
        "+proj=cass +lat_0=52.41864827777778 +lon_0=13.62720366666667 +x_0=40000 +y_0=10000 +datum=potsdam +units=m +no_defs",
      "EPSG:3069":
        "+proj=tmerc +lat_0=0 +lon_0=-90 +k=0.9996 +x_0=500000 +y_0=-4500000 +datum=NAD27 +units=m +no_defs",
      "EPSG:3070":
        "+proj=tmerc +lat_0=0 +lon_0=-90 +k=0.9996 +x_0=520000 +y_0=-4480000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3071":
        "+proj=tmerc +lat_0=0 +lon_0=-90 +k=0.9996 +x_0=520000 +y_0=-4480000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3072":
        "+proj=tmerc +lat_0=43.83333333333334 +lon_0=-67.875 +k=0.99998 +x_0=700000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3073":
        "+proj=tmerc +lat_0=43 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3074":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.375 +k=0.99998 +x_0=300000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3075":
        "+proj=tmerc +lat_0=43.83333333333334 +lon_0=-67.875 +k=0.99998 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3076":
        "+proj=tmerc +lat_0=43 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3077":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.375 +k=0.99998 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3078":
        "+proj=omerc +lat_0=45.30916666666666 +lonc=-86 +alpha=337.25556 +k=0.9996 +x_0=2546731.496 +y_0=-4354009.816 +no_uoff +gamma=337.25556 +datum=NAD83 +units=m +no_defs",
      "EPSG:3079":
        "+proj=omerc +lat_0=45.30916666666666 +lonc=-86 +alpha=337.25556 +k=0.9996 +x_0=2546731.496 +y_0=-4354009.816 +no_uoff +gamma=337.25556 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3080":
        "+proj=lcc +lat_1=27.41666666666667 +lat_2=34.91666666666666 +lat_0=31.16666666666667 +lon_0=-100 +x_0=914400 +y_0=914400 +datum=NAD27 +units=ft +no_defs",
      "EPSG:3081":
        "+proj=lcc +lat_1=27.41666666666667 +lat_2=34.91666666666666 +lat_0=31.16666666666667 +lon_0=-100 +x_0=1000000 +y_0=1000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3082":
        "+proj=lcc +lat_1=27.5 +lat_2=35 +lat_0=18 +lon_0=-100 +x_0=1500000 +y_0=5000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3083":
        "+proj=aea +lat_1=27.5 +lat_2=35 +lat_0=18 +lon_0=-100 +x_0=1500000 +y_0=6000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3084":
        "+proj=lcc +lat_1=27.5 +lat_2=35 +lat_0=18 +lon_0=-100 +x_0=1500000 +y_0=5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3085":
        "+proj=aea +lat_1=27.5 +lat_2=35 +lat_0=18 +lon_0=-100 +x_0=1500000 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3086":
        "+proj=aea +lat_1=24 +lat_2=31.5 +lat_0=24 +lon_0=-84 +x_0=400000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3087":
        "+proj=aea +lat_1=24 +lat_2=31.5 +lat_0=24 +lon_0=-84 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3088":
        "+proj=lcc +lat_1=37.08333333333334 +lat_2=38.66666666666666 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=1500000 +y_0=1000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3089":
        "+proj=lcc +lat_1=37.08333333333334 +lat_2=38.66666666666666 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=1500000 +y_0=999999.9998983998 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3090":
        "+proj=lcc +lat_1=37.08333333333334 +lat_2=38.66666666666666 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3091":
        "+proj=lcc +lat_1=37.08333333333334 +lat_2=38.66666666666666 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=1500000 +y_0=999999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3092":
        "+proj=utm +zone=51 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:3093":
        "+proj=utm +zone=52 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:3094":
        "+proj=utm +zone=53 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:3095":
        "+proj=utm +zone=54 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:3096":
        "+proj=utm +zone=55 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:3097":
        "+proj=utm +zone=51 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3098":
        "+proj=utm +zone=52 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3099":
        "+proj=utm +zone=53 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3100":
        "+proj=utm +zone=54 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3101":
        "+proj=utm +zone=55 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3102":
        "+proj=lcc +lat_1=-14.26666666666667 +lat_0=-14.26666666666667 +lon_0=-170 +k_0=1 +x_0=152400.3048006096 +y_0=95169.31165862332 +ellps=clrk66 +towgs84=-115,118,426,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3103": "+proj=utm +zone=28 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3104": "+proj=utm +zone=29 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3105": "+proj=utm +zone=30 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3106":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=0.9996 +x_0=500000 +y_0=0 +a=6377276.345 +b=6356075.41314024 +towgs84=283.7,735.9,261.1,0,0,0,0 +units=m +no_defs",
      "EPSG:3107":
        "+proj=lcc +lat_1=-28 +lat_2=-36 +lat_0=-32 +lon_0=135 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3108":
        "+proj=tmerc +lat_0=49.5 +lon_0=-2.416666666666667 +k=0.999997 +x_0=47000 +y_0=50000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3109":
        "+proj=tmerc +lat_0=49.225 +lon_0=-2.135 +k=0.9999999000000001 +x_0=40000 +y_0=70000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3110":
        "+proj=lcc +lat_1=-36 +lat_2=-38 +lat_0=-37 +lon_0=145 +x_0=2500000 +y_0=4500000 +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:3111":
        "+proj=lcc +lat_1=-36 +lat_2=-38 +lat_0=-37 +lon_0=145 +x_0=2500000 +y_0=2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3112":
        "+proj=lcc +lat_1=-18 +lat_2=-36 +lat_0=0 +lon_0=134 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3113":
        "+proj=tmerc +lat_0=-28 +lon_0=153 +k=0.99999 +x_0=50000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3114":
        "+proj=tmerc +lat_0=4.596200416666666 +lon_0=-80.07750791666666 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3115":
        "+proj=tmerc +lat_0=4.596200416666666 +lon_0=-77.07750791666666 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3116":
        "+proj=tmerc +lat_0=4.596200416666666 +lon_0=-74.07750791666666 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3117":
        "+proj=tmerc +lat_0=4.596200416666666 +lon_0=-71.07750791666666 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3118":
        "+proj=tmerc +lat_0=4.596200416666666 +lon_0=-68.07750791666666 +k=1 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3119":
        "+proj=tmerc +lat_0=0 +lon_0=10.5 +k=0.999 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=-206.1,-174.7,-87.7,0,0,0,0 +units=m +no_defs",
      "EPSG:3120":
        "+proj=sterea +lat_0=50.625 +lon_0=21.08333333333333 +k=0.9998 +x_0=4637000 +y_0=5467000 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3121":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06 +units=m +no_defs",
      "EPSG:3122":
        "+proj=tmerc +lat_0=0 +lon_0=119 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06 +units=m +no_defs",
      "EPSG:3123":
        "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06 +units=m +no_defs",
      "EPSG:3124":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06 +units=m +no_defs",
      "EPSG:3125":
        "+proj=tmerc +lat_0=0 +lon_0=125 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06 +units=m +no_defs",
      "EPSG:3126":
        "+proj=tmerc +lat_0=0 +lon_0=19 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3127":
        "+proj=tmerc +lat_0=0 +lon_0=20 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3128":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3129":
        "+proj=tmerc +lat_0=0 +lon_0=22 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3130":
        "+proj=tmerc +lat_0=0 +lon_0=23 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3131":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3132":
        "+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3133":
        "+proj=tmerc +lat_0=0 +lon_0=26 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3134":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3135":
        "+proj=tmerc +lat_0=0 +lon_0=28 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3136":
        "+proj=tmerc +lat_0=0 +lon_0=29 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3137":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3138":
        "+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3139":
        "+proj=cass +hyperbolic +lat_0=-16.25 +lon_0=179.333333333333 +x_0=251727.9155424 +y_0=334519.953768 +a=6378306.3696 +b=6356571.996 +towgs84=51,391,-36,0,0,0,0 +units=link +no_defs",
      "EPSG:3140":
        "+proj=cass +lat_0=-18 +lon_0=178 +x_0=109435.392 +y_0=141622.272 +a=6378306.3696 +b=6356571.996 +towgs84=51,391,-36,0,0,0,0 +to_meter=0.201168 +no_defs",
      "EPSG:3141":
        "+proj=utm +zone=60 +south +ellps=intl +towgs84=265.025,384.929,-194.046,0,0,0,0 +units=m +no_defs",
      "EPSG:3142":
        "+proj=utm +zone=1 +south +ellps=intl +towgs84=265.025,384.929,-194.046,0,0,0,0 +units=m +no_defs",
      "EPSG:3143":
        "+proj=tmerc +lat_0=-17 +lon_0=178.75 +k=0.99985 +x_0=2000000 +y_0=4000000 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:3146":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:3147":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:3148":
        "+proj=utm +zone=48 +a=6377276.345 +b=6356075.41314024 +towgs84=198,881,317,0,0,0,0 +units=m +no_defs",
      "EPSG:3149":
        "+proj=utm +zone=49 +a=6377276.345 +b=6356075.41314024 +towgs84=198,881,317,0,0,0,0 +units=m +no_defs",
      "EPSG:3150":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:3151":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:3152":
        "+proj=tmerc +lat_0=0 +lon_0=18.05779 +k=0.99999425 +x_0=100178.1808 +y_0=-6500614.7836 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3153":
        "+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3154":
        "+proj=utm +zone=7 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3155":
        "+proj=utm +zone=8 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3156":
        "+proj=utm +zone=9 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3157":
        "+proj=utm +zone=10 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3158":
        "+proj=utm +zone=14 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3159":
        "+proj=utm +zone=15 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3160":
        "+proj=utm +zone=16 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3161":
        "+proj=lcc +lat_1=44.5 +lat_2=53.5 +lat_0=0 +lon_0=-85 +x_0=930000 +y_0=6430000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3162":
        "+proj=lcc +lat_1=44.5 +lat_2=53.5 +lat_0=0 +lon_0=-85 +x_0=930000 +y_0=6430000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3163":
        "+proj=lcc +lat_1=-20.66666666666667 +lat_2=-22.33333333333333 +lat_0=-21.5 +lon_0=166 +x_0=400000 +y_0=300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3164":
        "+proj=utm +zone=58 +south +ellps=WGS84 +towgs84=-56.263,16.136,-22.856,0,0,0,0 +units=m +no_defs",
      "EPSG:3165":
        "+proj=lcc +lat_1=-22.24469175 +lat_2=-22.29469175 +lat_0=-22.26969175 +lon_0=166.44242575 +x_0=0.66 +y_0=1.02 +ellps=intl +towgs84=-10.18,-350.43,291.37,0,0,0,0 +units=m +no_defs",
      "EPSG:3166":
        "+proj=lcc +lat_1=-22.24472222222222 +lat_2=-22.29472222222222 +lat_0=-22.26972222222222 +lon_0=166.4425 +x_0=8.313000000000001 +y_0=-2.354 +ellps=intl +towgs84=-10.18,-350.43,291.37,0,0,0,0 +units=m +no_defs",
      "EPSG:3167":
        "+proj=omerc +lat_0=4 +lonc=102.25 +alpha=323.0257905 +k=0.99984 +x_0=40000 +y_0=0 +no_uoff +gamma=323.1301023611111 +a=6377295.664 +b=6356094.667915204 +to_meter=20.116756 +no_defs",
      "EPSG:3168":
        "+proj=omerc +lat_0=4 +lonc=102.25 +alpha=323.0257905 +k=0.99984 +x_0=804670.24 +y_0=0 +no_uoff +gamma=323.1301023611111 +a=6377295.664 +b=6356094.667915204 +units=m +no_defs",
      "EPSG:3169":
        "+proj=utm +zone=57 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3170":
        "+proj=utm +zone=58 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3171":
        "+proj=utm +zone=59 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3172":
        "+proj=utm +zone=59 +south +ellps=intl +towgs84=287.58,177.78,-135.41,0,0,0,0 +units=m +no_defs",
      "EPSG:3174":
        "+proj=aea +lat_1=42.122774 +lat_2=49.01518 +lat_0=45.568977 +lon_0=-84.455955 +x_0=1000000 +y_0=1000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3175":
        "+proj=aea +lat_1=42.122774 +lat_2=49.01518 +lat_0=45.568977 +lon_0=-83.248627 +x_0=1000000 +y_0=1000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3176":
        "+proj=tmerc +lat_0=0 +lon_0=106 +k=0.9996 +x_0=500000 +y_0=0 +a=6377276.345 +b=6356075.41314024 +towgs84=198,881,317,0,0,0,0 +units=m +no_defs",
      "EPSG:3177":
        "+proj=tmerc +lat_0=0 +lon_0=17 +k=0.9965000000000001 +x_0=1000000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3178":
        "+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3179":
        "+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3180":
        "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3181":
        "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3182":
        "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3183":
        "+proj=utm +zone=23 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3184":
        "+proj=utm +zone=24 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3185":
        "+proj=utm +zone=25 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3186":
        "+proj=utm +zone=26 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3187":
        "+proj=utm +zone=27 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3188":
        "+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3189":
        "+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3190":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.99995 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3191":
        "+proj=tmerc +lat_0=0 +lon_0=11 +k=0.99995 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3192":
        "+proj=tmerc +lat_0=0 +lon_0=13 +k=0.99995 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3193":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.99995 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3194":
        "+proj=tmerc +lat_0=0 +lon_0=17 +k=0.99995 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3195":
        "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.99995 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3196":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.99995 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3197":
        "+proj=tmerc +lat_0=0 +lon_0=23 +k=0.99995 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3198":
        "+proj=tmerc +lat_0=0 +lon_0=25 +k=0.99995 +x_0=200000 +y_0=0 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3199":
        "+proj=utm +zone=32 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3200":
        "+proj=lcc +lat_1=32.5 +lat_0=32.5 +lon_0=45 +k_0=0.9987864078000001 +x_0=1500000 +y_0=1166200 +ellps=clrk80 +towgs84=-239.1,-170.02,397.5,0,0,0,0 +units=m +no_defs",
      "EPSG:3201":
        "+proj=utm +zone=33 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3202":
        "+proj=utm +zone=34 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3203":
        "+proj=utm +zone=35 +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +units=m +no_defs",
      "EPSG:3204":
        "+proj=lcc +lat_1=-60.66666666666666 +lat_2=-63.33333333333334 +lat_0=-90 +lon_0=-66 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3205":
        "+proj=lcc +lat_1=-60.66666666666666 +lat_2=-63.33333333333334 +lat_0=-90 +lon_0=-54 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3206":
        "+proj=lcc +lat_1=-60.66666666666666 +lat_2=-63.33333333333334 +lat_0=-90 +lon_0=-42 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3207":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=-174 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3208":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=-66 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3209":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=-54 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3210":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=42 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3211":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=54 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3212":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=66 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3213":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=78 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3214":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3215":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=102 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3216":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=114 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3217":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=126 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3218":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=138 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3219":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=150 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3220":
        "+proj=lcc +lat_1=-64.66666666666667 +lat_2=-67.33333333333333 +lat_0=-90 +lon_0=162 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3221":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=-102 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3222":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=-90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3223":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=-78 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3224":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=-66 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3225":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=-18 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3226":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=-6 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3227":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=6 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3228":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=18 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3229":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=30 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3230":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=42 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3231":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=54 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3232":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=66 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3233":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=78 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3234":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3235":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=102 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3236":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=114 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3237":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=126 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3238":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=138 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3239":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=150 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3240":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=162 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3241":
        "+proj=lcc +lat_1=-68.66666666666667 +lat_2=-71.33333333333333 +lat_0=-90 +lon_0=174 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3242":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=-153 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3243":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=-135 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3244":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=-117 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3245":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=-99 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3246":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=-81 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3247":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=-63 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3248":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=-27 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3249":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=-9 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3250":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=9 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3251":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=27 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3252":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3253":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=63 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3254":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=81 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3255":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=99 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3256":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=117 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3257":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=135 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3258":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=153 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3259":
        "+proj=lcc +lat_1=-72.66666666666667 +lat_2=-75.33333333333333 +lat_0=-90 +lon_0=171 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3260":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=-168 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3261":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=-144 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3262":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=-120 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3263":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=-96 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3264":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=-72 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3265":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=-48 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3266":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=-24 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3267":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3268":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=24 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3269":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=48 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3270":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=72 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3271":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=96 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3272":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=120 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3273":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=144 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3274":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=168 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3275":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=-165 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3276":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=-135 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3277":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=-105 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3278":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=-75 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3279":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3280":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=-15 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3281":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=15 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3282":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3283":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=75 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3284":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=105 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3285":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=135 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3286":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=165 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3287":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=-150 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3288":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=-90 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3289":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=-30 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3290":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=30 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3291":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=90 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3292":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=150 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3293":
        "+proj=stere +lat_0=-90 +lat_ts=-80.23861111111111 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3294":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-78 +lon_0=162 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3295":
        "+proj=aeqd +lat_0=9.54670833333333 +lon_0=138.168744444444 +x_0=40000 +y_0=60000 +ellps=clrk66 +units=m +no_defs",
      "EPSG:3296":
        "+proj=utm +zone=5 +south +ellps=GRS80 +towgs84=0.072,-0.507,-0.245,-0.0183,0.0003,-0.007,-0.0093 +units=m +no_defs",
      "EPSG:3297":
        "+proj=utm +zone=6 +south +ellps=GRS80 +towgs84=0.072,-0.507,-0.245,-0.0183,0.0003,-0.007,-0.0093 +units=m +no_defs",
      "EPSG:3298":
        "+proj=utm +zone=7 +south +ellps=GRS80 +towgs84=0.072,-0.507,-0.245,-0.0183,0.0003,-0.007,-0.0093 +units=m +no_defs",
      "EPSG:3299":
        "+proj=utm +zone=8 +south +ellps=GRS80 +towgs84=0.072,-0.507,-0.245,-0.0183,0.0003,-0.007,-0.0093 +units=m +no_defs",
      "EPSG:3300":
        "+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0.055,-0.541,-0.185,0.0183,-0.0003,-0.007,-0.014 +units=m +no_defs",
      "EPSG:3301":
        "+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3302":
        "+proj=utm +zone=7 +south +ellps=intl +towgs84=410.721,55.049,80.746,2.5779,2.3514,0.6664,17.3311 +units=m +no_defs",
      "EPSG:3303":
        "+proj=utm +zone=7 +south +ellps=intl +towgs84=347.103,1078.12,2623.92,-33.8875,70.6773,-9.3943,186.074 +units=m +no_defs",
      "EPSG:3304":
        "+proj=utm +zone=6 +south +ellps=intl +towgs84=221.525,152.948,176.768,-2.3847,-1.3896,-0.877,11.4741 +units=m +no_defs",
      "EPSG:3305":
        "+proj=utm +zone=6 +south +ellps=intl +towgs84=215.525,149.593,176.229,-3.2624,-1.692,-1.1571,10.4773 +units=m +no_defs",
      "EPSG:3306":
        "+proj=utm +zone=5 +south +ellps=intl +towgs84=217.037,86.959,23.956,0,0,0,0 +units=m +no_defs",
      "EPSG:3307":
        "+proj=utm +zone=39 +ellps=WGS84 +towgs84=0,-0.15,0.68,0,0,0,0 +units=m +no_defs",
      "EPSG:3308":
        "+proj=lcc +lat_1=-30.75 +lat_2=-35.75 +lat_0=-33.25 +lon_0=147 +x_0=9300000 +y_0=4500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3309":
        "+proj=aea +lat_1=34 +lat_2=40.5 +lat_0=0 +lon_0=-120 +x_0=0 +y_0=-4000000 +datum=NAD27 +units=m +no_defs",
      "EPSG:3310":
        "+proj=aea +lat_1=34 +lat_2=40.5 +lat_0=0 +lon_0=-120 +x_0=0 +y_0=-4000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3311":
        "+proj=aea +lat_1=34 +lat_2=40.5 +lat_0=0 +lon_0=-120 +x_0=0 +y_0=-4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3312":
        "+proj=utm +zone=21 +ellps=intl +towgs84=-186,230,110,0,0,0,0 +units=m +no_defs",
      "EPSG:3313":
        "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3314":
        "+proj=lcc +lat_1=-6.5 +lat_2=-11.5 +lat_0=0 +lon_0=26 +x_0=0 +y_0=0 +ellps=clrk66 +towgs84=-103.746,-9.614,-255.95,0,0,0,0 +units=m +no_defs",
      "EPSG:3315":
        "+proj=tmerc +lat_0=-9 +lon_0=26 +k=0.9998 +x_0=0 +y_0=0 +ellps=clrk66 +towgs84=-103.746,-9.614,-255.95,0,0,0,0 +units=m +no_defs",
      "EPSG:3316":
        "+proj=tmerc +lat_0=0 +lon_0=22 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3317":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3318":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3319":
        "+proj=tmerc +lat_0=0 +lon_0=14 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3320":
        "+proj=tmerc +lat_0=0 +lon_0=16 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3321":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3322":
        "+proj=tmerc +lat_0=0 +lon_0=20 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3323":
        "+proj=tmerc +lat_0=0 +lon_0=22 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3324":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3325":
        "+proj=tmerc +lat_0=0 +lon_0=26 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3326":
        "+proj=tmerc +lat_0=0 +lon_0=28 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3327":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3328":
        "+proj=sterea +lat_0=52.16666666666666 +lon_0=19.16666666666667 +k=0.999714 +x_0=500000 +y_0=500000 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3329":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3330":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3331":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3332":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=8500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3333":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3334":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3335":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3336":
        "+proj=utm +zone=42 +south +ellps=intl +towgs84=145,-187,103,0,0,0,0 +units=m +no_defs",
      "EPSG:3337":
        "+proj=lcc +lat_1=-20.19506944444445 +lat_0=-20.19506944444445 +lon_0=57.52182777777778 +k_0=1 +x_0=1000000 +y_0=1000000 +ellps=clrk80 +towgs84=-770.1,158.4,-498.2,0,0,0,0 +units=m +no_defs",
      "EPSG:3338":
        "+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3339":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +towgs84=-79.9,-158,-168.9,0,0,0,0 +units=m +no_defs",
      "EPSG:3340":
        "+proj=tmerc +lat_0=0 +lon_0=14 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +towgs84=-79.9,-158,-168.9,0,0,0,0 +units=m +no_defs",
      "EPSG:3341":
        "+proj=tmerc +lat_0=0 +lon_0=16 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=clrk80 +towgs84=-79.9,-158,-168.9,0,0,0,0 +units=m +no_defs",
      "EPSG:3342":
        "+proj=utm +zone=33 +south +ellps=clrk80 +towgs84=-79.9,-158,-168.9,0,0,0,0 +units=m +no_defs",
      "EPSG:3343":
        "+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3344":
        "+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3345":
        "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3346":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3347":
        "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=63.390675 +lon_0=-91.86666666666666 +x_0=6200000 +y_0=3000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3348":
        "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=63.390675 +lon_0=-91.86666666666666 +x_0=6200000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3349":
        "+proj=merc +lon_0=-150 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3350":
        "+proj=tmerc +lat_0=0.1 +lon_0=21.95 +k=1 +x_0=250000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:3351":
        "+proj=tmerc +lat_0=0.1 +lon_0=24.95 +k=1 +x_0=1250000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:3352":
        "+proj=tmerc +lat_0=0.1 +lon_0=27.95 +k=1 +x_0=2250000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:3353": "+proj=utm +zone=32 +south +ellps=intl +units=m +no_defs",
      "EPSG:3354": "+proj=utm +zone=32 +south +ellps=intl +units=m +no_defs",
      "EPSG:3355":
        "+proj=tmerc +lat_0=30 +lon_0=31 +k=1 +x_0=615000 +y_0=810000 +ellps=helmert +towgs84=-146.21,112.63,4.05,0,0,0,0 +units=m +no_defs",
      "EPSG:3356":
        "+proj=utm +zone=17 +ellps=clrk66 +towgs84=67.8,106.1,138.8,0,0,0,0 +units=m +no_defs",
      "EPSG:3357":
        "+proj=utm +zone=17 +ellps=clrk66 +towgs84=42,124,147,0,0,0,0 +units=m +no_defs",
      "EPSG:3358":
        "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.22 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3359":
        "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.2192024385 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3360":
        "+proj=lcc +lat_1=34.83333333333334 +lat_2=32.5 +lat_0=31.83333333333333 +lon_0=-81 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3361":
        "+proj=lcc +lat_1=34.83333333333334 +lat_2=32.5 +lat_0=31.83333333333333 +lon_0=-81 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3362":
        "+proj=lcc +lat_1=41.95 +lat_2=40.88333333333333 +lat_0=40.16666666666666 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3363":
        "+proj=lcc +lat_1=41.95 +lat_2=40.88333333333333 +lat_0=40.16666666666666 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3364":
        "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3365":
        "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3366":
        "+proj=cass +lat_0=22.31213333333334 +lon_0=114.1785555555556 +x_0=40243.57775604237 +y_0=19069.93351512578 +a=6378293.645208759 +b=6356617.987679838 +units=m +no_defs",
      "EPSG:3367": "+proj=utm +zone=28 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3368": "+proj=utm +zone=29 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3369": "+proj=utm +zone=30 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3370": "+proj=utm +zone=59 +datum=NAD27 +units=m +no_defs",
      "EPSG:3371": "+proj=utm +zone=60 +datum=NAD27 +units=m +no_defs",
      "EPSG:3372": "+proj=utm +zone=59 +datum=NAD83 +units=m +no_defs",
      "EPSG:3373": "+proj=utm +zone=60 +datum=NAD83 +units=m +no_defs",
      "EPSG:3374": "+proj=utm +zone=29 +ellps=intl +units=m +no_defs",
      "EPSG:3375":
        "+proj=omerc +lat_0=4 +lonc=102.25 +alpha=323.0257964666666 +k=0.99984 +x_0=804671 +y_0=0 +no_uoff +gamma=323.1301023611111 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3376":
        "+proj=omerc +lat_0=4 +lonc=115 +alpha=53.31580995 +k=0.99984 +x_0=0 +y_0=0 +no_uoff +gamma=53.13010236111111 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3377":
        "+proj=cass +lat_0=2.121679744444445 +lon_0=103.4279362361111 +x_0=-14810.562 +y_0=8758.32 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3378":
        "+proj=cass +lat_0=2.682347636111111 +lon_0=101.9749050416667 +x_0=3673.785 +y_0=-4240.573 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3379":
        "+proj=cass +lat_0=3.769388088888889 +lon_0=102.3682989833333 +x_0=-7368.228 +y_0=6485.858 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3380":
        "+proj=cass +lat_0=3.68464905 +lon_0=101.3891079138889 +x_0=-34836.161 +y_0=56464.049 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3381":
        "+proj=cass +lat_0=4.9762852 +lon_0=103.070275625 +x_0=19594.245 +y_0=3371.895 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3382":
        "+proj=cass +lat_0=5.421517541666667 +lon_0=100.3443769638889 +x_0=-23.414 +y_0=62.283 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3383":
        "+proj=cass +lat_0=5.964672713888889 +lon_0=100.6363711111111 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3384":
        "+proj=cass +lat_0=4.859063022222222 +lon_0=100.8154105861111 +x_0=-1.769 +y_0=133454.779 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3385":
        "+proj=cass +lat_0=5.972543658333334 +lon_0=102.2952416694444 +x_0=13227.851 +y_0=8739.894 +ellps=GRS80 +units=m +no_defs",
      "EPSG:3386":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +no_defs",
      "EPSG:3387":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=5500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +no_defs",
      "EPSG:3388":
        "+proj=merc +lon_0=51 +lat_ts=42 +x_0=0 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:3389":
        "+proj=tmerc +lat_0=0 +lon_0=180 +k=1 +x_0=60500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:3390":
        "+proj=tmerc +lat_0=0 +lon_0=180 +k=1 +x_0=60500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:3391":
        "+proj=utm +zone=37 +ellps=clrk80 +towgs84=70.995,-335.916,262.898,0,0,0,0 +units=m +no_defs",
      "EPSG:3392":
        "+proj=utm +zone=38 +ellps=clrk80 +towgs84=70.995,-335.916,262.898,0,0,0,0 +units=m +no_defs",
      "EPSG:3393":
        "+proj=utm +zone=39 +ellps=clrk80 +towgs84=70.995,-335.916,262.898,0,0,0,0 +units=m +no_defs",
      "EPSG:3394":
        "+proj=lcc +lat_1=32.5 +lat_0=32.5 +lon_0=45 +k_0=0.9987864078000001 +x_0=1500000 +y_0=1166200 +ellps=clrk80 +units=m +no_defs",
      "EPSG:3395":
        "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3396":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3397":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3398":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3399":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:3400":
        "+proj=tmerc +lat_0=0 +lon_0=-115 +k=0.9992 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3401":
        "+proj=tmerc +lat_0=0 +lon_0=-115 +k=0.9992 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3402":
        "+proj=tmerc +lat_0=0 +lon_0=-115 +k=0.9992 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3403":
        "+proj=tmerc +lat_0=0 +lon_0=-115 +k=0.9992 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3404":
        "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.2192024384 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3405":
        "+proj=utm +zone=48 +ellps=WGS84 +towgs84=-192.873,-39.382,-111.202,-0.00205,-0.0005,0.00335,0.0188 +units=m +no_defs",
      "EPSG:3406":
        "+proj=utm +zone=49 +ellps=WGS84 +towgs84=-192.873,-39.382,-111.202,-0.00205,-0.0005,0.00335,0.0188 +units=m +no_defs",
      "EPSG:3407":
        "+proj=cass +lat_0=22.31213333333334 +lon_0=114.1785555555556 +x_0=40243.57775604237 +y_0=19069.93351512578 +a=6378293.645208759 +b=6356617.987679838 +to_meter=0.3047972654 +no_defs",
      "EPSG:3408":
        "+proj=laea +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs",
      "EPSG:3409":
        "+proj=laea +lat_0=-90 +lon_0=0 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs",
      "EPSG:3410":
        "+proj=cea +lon_0=0 +lat_ts=30 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs",
      "EPSG:3411":
        "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs",
      "EPSG:3412":
        "+proj=stere +lat_0=-90 +lat_ts=-70 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs",
      "EPSG:3413":
        "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3414":
        "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs",
      "EPSG:3415":
        "+proj=lcc +lat_1=18 +lat_2=24 +lat_0=21 +lon_0=114 +x_0=500000 +y_0=500000 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:3416":
        "+proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3417":
        "+proj=lcc +lat_1=43.26666666666667 +lat_2=42.06666666666667 +lat_0=41.5 +lon_0=-93.5 +x_0=1500000 +y_0=999999.9999898402 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3418":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.61666666666667 +lat_0=40 +lon_0=-93.5 +x_0=500000.00001016 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3419":
        "+proj=lcc +lat_1=39.78333333333333 +lat_2=38.71666666666667 +lat_0=38.33333333333334 +lon_0=-98 +x_0=399999.99998984 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3420":
        "+proj=lcc +lat_1=38.56666666666667 +lat_2=37.26666666666667 +lat_0=36.66666666666666 +lon_0=-98.5 +x_0=399999.99998984 +y_0=399999.99998984 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3421":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.5833333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.000010163 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3422":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.6666666666667 +k=0.9999 +x_0=500000.00001016 +y_0=6000000 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3423":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.5833333333333 +k=0.9999 +x_0=800000.0000101599 +y_0=3999999.99998984 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3424":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3425":
        "+proj=lcc +lat_1=43.26666666666667 +lat_2=42.06666666666667 +lat_0=41.5 +lon_0=-93.5 +x_0=1500000 +y_0=999999.9999898402 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3426":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.61666666666667 +lat_0=40 +lon_0=-93.5 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3427":
        "+proj=lcc +lat_1=39.78333333333333 +lat_2=38.71666666666667 +lat_0=38.33333333333334 +lon_0=-98 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3428":
        "+proj=lcc +lat_1=38.56666666666667 +lat_2=37.26666666666667 +lat_0=36.66666666666666 +lon_0=-98.5 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3429":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.5833333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.000010163 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3430":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.6666666666667 +k=0.9999 +x_0=500000.00001016 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3431":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.5833333333333 +k=0.9999 +x_0=800000.0000101599 +y_0=3999999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3432":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3433":
        "+proj=lcc +lat_1=36.23333333333333 +lat_2=34.93333333333333 +lat_0=34.33333333333334 +lon_0=-92 +x_0=399999.99998984 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3434":
        "+proj=lcc +lat_1=34.76666666666667 +lat_2=33.3 +lat_0=32.66666666666666 +lon_0=-92 +x_0=399999.99998984 +y_0=399999.99998984 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3435":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000.0000000001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3436":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-90.16666666666667 +k=0.999941177 +x_0=699999.9999898402 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3437":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.66666666666667 +k=0.999966667 +x_0=300000.0000000001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3438":
        "+proj=tmerc +lat_0=41.08333333333334 +lon_0=-71.5 +k=0.99999375 +x_0=99999.99998983997 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3439":
        "+proj=utm +zone=39 +ellps=clrk80 +towgs84=-180.624,-225.516,173.919,-0.81,-1.898,8.336,16.7101 +units=m +no_defs",
      "EPSG:3440":
        "+proj=utm +zone=40 +ellps=clrk80 +towgs84=-180.624,-225.516,173.919,-0.81,-1.898,8.336,16.7101 +units=m +no_defs",
      "EPSG:3441":
        "+proj=lcc +lat_1=36.23333333333333 +lat_2=34.93333333333333 +lat_0=34.33333333333334 +lon_0=-92 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3442":
        "+proj=lcc +lat_1=34.76666666666667 +lat_2=33.3 +lat_0=32.66666666666666 +lon_0=-92 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3443":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3444":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-90.16666666666667 +k=0.999941177 +x_0=699999.9999898402 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3445":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.66666666666667 +k=0.999966667 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3446":
        "+proj=tmerc +lat_0=41.08333333333334 +lon_0=-71.5 +k=0.99999375 +x_0=99999.99998983997 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3447":
        "+proj=lcc +lat_1=49.83333333333334 +lat_2=51.16666666666666 +lat_0=50.797815 +lon_0=4.359215833333333 +x_0=150328 +y_0=166262 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3448":
        "+proj=lcc +lat_1=18 +lat_0=18 +lon_0=-77 +k_0=1 +x_0=750000 +y_0=650000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3449":
        "+proj=utm +zone=17 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3450":
        "+proj=utm +zone=18 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3451":
        "+proj=lcc +lat_1=32.66666666666666 +lat_2=31.16666666666667 +lat_0=30.5 +lon_0=-92.5 +x_0=999999.9999898402 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3452":
        "+proj=lcc +lat_1=30.7 +lat_2=29.3 +lat_0=28.5 +lon_0=-91.33333333333333 +x_0=999999.9999898402 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3453":
        "+proj=lcc +lat_1=27.83333333333333 +lat_2=26.16666666666667 +lat_0=25.5 +lon_0=-91.33333333333333 +x_0=999999.9999898402 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3454":
        "+proj=lcc +lat_1=44.4 +lat_2=42.83333333333334 +lat_0=42.33333333333334 +lon_0=-100.3333333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3455":
        "+proj=lcc +lat_1=44.4 +lat_2=42.83333333333334 +lat_0=42.33333333333334 +lon_0=-100.3333333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3456":
        "+proj=lcc +lat_1=32.66666666666666 +lat_2=31.16666666666667 +lat_0=30.5 +lon_0=-92.5 +x_0=999999.9999898402 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3457":
        "+proj=lcc +lat_1=30.7 +lat_2=29.3 +lat_0=28.5 +lon_0=-91.33333333333333 +x_0=999999.9999898402 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3458":
        "+proj=lcc +lat_1=45.68333333333333 +lat_2=44.41666666666666 +lat_0=43.83333333333334 +lon_0=-100 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3459":
        "+proj=lcc +lat_1=44.4 +lat_2=42.83333333333334 +lat_0=42.33333333333334 +lon_0=-100.3333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3460":
        "+proj=tmerc +lat_0=-17 +lon_0=178.75 +k=0.99985 +x_0=2000000 +y_0=4000000 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:3461":
        "+proj=utm +zone=28 +a=6378249.2 +b=6356515 +towgs84=-83,37,124,0,0,0,0 +units=m +no_defs",
      "EPSG:3462":
        "+proj=utm +zone=29 +a=6378249.2 +b=6356515 +towgs84=-83,37,124,0,0,0,0 +units=m +no_defs",
      "EPSG:3463":
        "+proj=tmerc +lat_0=43.5 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3464":
        "+proj=tmerc +lat_0=43.5 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3465":
        "+proj=tmerc +lat_0=30.5 +lon_0=-85.83333333333333 +k=0.99996 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3466":
        "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3467":
        "+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3468":
        "+proj=omerc +lat_0=57 +lonc=-133.6666666666667 +alpha=323.1301023611111 +k=0.9999 +x_0=5000000 +y_0=-5000000 +no_uoff +gamma=323.1301023611111 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3469":
        "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3470":
        "+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3471":
        "+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3472":
        "+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3473":
        "+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3474":
        "+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3475":
        "+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3476":
        "+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3477":
        "+proj=lcc +lat_1=53.83333333333334 +lat_2=51.83333333333334 +lat_0=51 +lon_0=-176 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3478":
        "+proj=tmerc +lat_0=31 +lon_0=-111.9166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3479":
        "+proj=tmerc +lat_0=31 +lon_0=-111.9166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3480":
        "+proj=tmerc +lat_0=31 +lon_0=-110.1666666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3481":
        "+proj=tmerc +lat_0=31 +lon_0=-110.1666666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3482":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3483":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3484":
        "+proj=lcc +lat_1=36.23333333333333 +lat_2=34.93333333333333 +lat_0=34.33333333333334 +lon_0=-92 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3485":
        "+proj=lcc +lat_1=36.23333333333333 +lat_2=34.93333333333333 +lat_0=34.33333333333334 +lon_0=-92 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3486":
        "+proj=lcc +lat_1=34.76666666666667 +lat_2=33.3 +lat_0=32.66666666666666 +lon_0=-92 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3487":
        "+proj=lcc +lat_1=34.76666666666667 +lat_2=33.3 +lat_0=32.66666666666666 +lon_0=-92 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3488":
        "+proj=aea +lat_1=34 +lat_2=40.5 +lat_0=0 +lon_0=-120 +x_0=0 +y_0=-4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3489":
        "+proj=lcc +lat_1=41.66666666666666 +lat_2=40 +lat_0=39.33333333333334 +lon_0=-122 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3490":
        "+proj=lcc +lat_1=41.66666666666666 +lat_2=40 +lat_0=39.33333333333334 +lon_0=-122 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3491":
        "+proj=lcc +lat_1=39.83333333333334 +lat_2=38.33333333333334 +lat_0=37.66666666666666 +lon_0=-122 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3492":
        "+proj=lcc +lat_1=39.83333333333334 +lat_2=38.33333333333334 +lat_0=37.66666666666666 +lon_0=-122 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3493":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.06666666666667 +lat_0=36.5 +lon_0=-120.5 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3494":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.06666666666667 +lat_0=36.5 +lon_0=-120.5 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3495":
        "+proj=lcc +lat_1=37.25 +lat_2=36 +lat_0=35.33333333333334 +lon_0=-119 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3496":
        "+proj=lcc +lat_1=37.25 +lat_2=36 +lat_0=35.33333333333334 +lon_0=-119 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3497":
        "+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3498":
        "+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3499":
        "+proj=lcc +lat_1=33.88333333333333 +lat_2=32.78333333333333 +lat_0=32.16666666666666 +lon_0=-116.25 +x_0=2000000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3500":
        "+proj=lcc +lat_1=33.88333333333333 +lat_2=32.78333333333333 +lat_0=32.16666666666666 +lon_0=-116.25 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3501":
        "+proj=lcc +lat_1=39.75 +lat_2=38.45 +lat_0=37.83333333333334 +lon_0=-105.5 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3502":
        "+proj=lcc +lat_1=39.75 +lat_2=38.45 +lat_0=37.83333333333334 +lon_0=-105.5 +x_0=914401.8288036576 +y_0=304800.6096012192 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3503":
        "+proj=lcc +lat_1=40.78333333333333 +lat_2=39.71666666666667 +lat_0=39.33333333333334 +lon_0=-105.5 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3504":
        "+proj=lcc +lat_1=40.78333333333333 +lat_2=39.71666666666667 +lat_0=39.33333333333334 +lon_0=-105.5 +x_0=914401.8288036576 +y_0=304800.6096012192 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3505":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.23333333333333 +lat_0=36.66666666666666 +lon_0=-105.5 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3506":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.23333333333333 +lat_0=36.66666666666666 +lon_0=-105.5 +x_0=914401.8288036576 +y_0=304800.6096012192 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3507":
        "+proj=lcc +lat_1=41.86666666666667 +lat_2=41.2 +lat_0=40.83333333333334 +lon_0=-72.75 +x_0=304800.6096 +y_0=152400.3048 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3508":
        "+proj=lcc +lat_1=41.86666666666667 +lat_2=41.2 +lat_0=40.83333333333334 +lon_0=-72.75 +x_0=304800.6096012192 +y_0=152400.3048006096 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3509":
        "+proj=tmerc +lat_0=38 +lon_0=-75.41666666666667 +k=0.999995 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3510":
        "+proj=tmerc +lat_0=38 +lon_0=-75.41666666666667 +k=0.999995 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3511":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3512":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3513":
        "+proj=aea +lat_1=24 +lat_2=31.5 +lat_0=24 +lon_0=-84 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3514":
        "+proj=lcc +lat_1=30.75 +lat_2=29.58333333333333 +lat_0=29 +lon_0=-84.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3515":
        "+proj=lcc +lat_1=30.75 +lat_2=29.58333333333333 +lat_0=29 +lon_0=-84.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3516":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3517":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3518":
        "+proj=tmerc +lat_0=30 +lon_0=-82.16666666666667 +k=0.9999 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3519":
        "+proj=tmerc +lat_0=30 +lon_0=-82.16666666666667 +k=0.9999 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3520":
        "+proj=tmerc +lat_0=30 +lon_0=-84.16666666666667 +k=0.9999 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3521":
        "+proj=tmerc +lat_0=30 +lon_0=-84.16666666666667 +k=0.9999 +x_0=699999.9998983998 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3522":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-114 +k=0.9999473679999999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3523":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-114 +k=0.9999473679999999 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3524":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-112.1666666666667 +k=0.9999473679999999 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3525":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-112.1666666666667 +k=0.9999473679999999 +x_0=200000.0001016002 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3526":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-115.75 +k=0.999933333 +x_0=800000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3527":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-115.75 +k=0.999933333 +x_0=800000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3528":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3529":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3530":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-90.16666666666667 +k=0.999941177 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3531":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-90.16666666666667 +k=0.999941177 +x_0=699999.9999898402 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3532":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3533":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=99999.99989839978 +y_0=249999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3534":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=250000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3535":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3536":
        "+proj=lcc +lat_1=43.26666666666667 +lat_2=42.06666666666667 +lat_0=41.5 +lon_0=-93.5 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3537":
        "+proj=lcc +lat_1=43.26666666666667 +lat_2=42.06666666666667 +lat_0=41.5 +lon_0=-93.5 +x_0=1500000 +y_0=999999.9999898402 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3538":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.61666666666667 +lat_0=40 +lon_0=-93.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3539":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.61666666666667 +lat_0=40 +lon_0=-93.5 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3540":
        "+proj=lcc +lat_1=39.78333333333333 +lat_2=38.71666666666667 +lat_0=38.33333333333334 +lon_0=-98 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3541":
        "+proj=lcc +lat_1=39.78333333333333 +lat_2=38.71666666666667 +lat_0=38.33333333333334 +lon_0=-98 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3542":
        "+proj=lcc +lat_1=38.56666666666667 +lat_2=37.26666666666667 +lat_0=36.66666666666666 +lon_0=-98.5 +x_0=400000 +y_0=400000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3543":
        "+proj=lcc +lat_1=38.56666666666667 +lat_2=37.26666666666667 +lat_0=36.66666666666666 +lon_0=-98.5 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3544":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=38.96666666666667 +lat_0=37.5 +lon_0=-84.25 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3545":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=38.96666666666667 +lat_0=37.5 +lon_0=-84.25 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3546":
        "+proj=lcc +lat_1=37.08333333333334 +lat_2=38.66666666666666 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3547":
        "+proj=lcc +lat_1=37.08333333333334 +lat_2=38.66666666666666 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=1500000 +y_0=999999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3548":
        "+proj=lcc +lat_1=37.93333333333333 +lat_2=36.73333333333333 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3549":
        "+proj=lcc +lat_1=37.93333333333333 +lat_2=36.73333333333333 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=500000.0001016001 +y_0=500000.0001016001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3550":
        "+proj=lcc +lat_1=32.66666666666666 +lat_2=31.16666666666667 +lat_0=30.5 +lon_0=-92.5 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3551":
        "+proj=lcc +lat_1=32.66666666666666 +lat_2=31.16666666666667 +lat_0=30.5 +lon_0=-92.5 +x_0=999999.9999898402 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3552":
        "+proj=lcc +lat_1=30.7 +lat_2=29.3 +lat_0=28.5 +lon_0=-91.33333333333333 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3553":
        "+proj=lcc +lat_1=30.7 +lat_2=29.3 +lat_0=28.5 +lon_0=-91.33333333333333 +x_0=999999.9999898402 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3554":
        "+proj=tmerc +lat_0=43.5 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3555":
        "+proj=tmerc +lat_0=43.83333333333334 +lon_0=-67.875 +k=0.99998 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3556":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.375 +k=0.99998 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3557":
        "+proj=tmerc +lat_0=43.66666666666666 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3558":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3559":
        "+proj=lcc +lat_1=39.45 +lat_2=38.3 +lat_0=37.66666666666666 +lon_0=-77 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3560":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.71666666666667 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=500000.00001016 +y_0=999999.9999898402 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3561":
        "+proj=tmerc +lat_0=18.83333333333333 +lon_0=-155.5 +k=0.999966667 +x_0=152400.3048006096 +y_0=0 +ellps=clrk66 +towgs84=61,-285,-181,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3562":
        "+proj=tmerc +lat_0=20.33333333333333 +lon_0=-156.6666666666667 +k=0.999966667 +x_0=152400.3048006096 +y_0=0 +ellps=clrk66 +towgs84=61,-285,-181,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3563":
        "+proj=tmerc +lat_0=21.16666666666667 +lon_0=-158 +k=0.99999 +x_0=152400.3048006096 +y_0=0 +ellps=clrk66 +towgs84=61,-285,-181,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3564":
        "+proj=tmerc +lat_0=21.83333333333333 +lon_0=-159.5 +k=0.99999 +x_0=152400.3048006096 +y_0=0 +ellps=clrk66 +towgs84=61,-285,-181,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3565":
        "+proj=tmerc +lat_0=21.66666666666667 +lon_0=-160.1666666666667 +k=1 +x_0=152400.3048006096 +y_0=0 +ellps=clrk66 +towgs84=61,-285,-181,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3566":
        "+proj=lcc +lat_1=40.65 +lat_2=39.01666666666667 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=500000.00001016 +y_0=2000000.00001016 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3567":
        "+proj=lcc +lat_1=38.35 +lat_2=37.21666666666667 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=500000.00001016 +y_0=3000000 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3568":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.71666666666667 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=500000.00001016 +y_0=999999.9999898402 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3569":
        "+proj=lcc +lat_1=40.65 +lat_2=39.01666666666667 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=500000.00001016 +y_0=2000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3570":
        "+proj=lcc +lat_1=38.35 +lat_2=37.21666666666667 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=500000.00001016 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3571":
        "+proj=laea +lat_0=90 +lon_0=180 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3572":
        "+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3573":
        "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3574":
        "+proj=laea +lat_0=90 +lon_0=-40 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3575":
        "+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3576":
        "+proj=laea +lat_0=90 +lon_0=90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3577":
        "+proj=aea +lat_1=-18 +lat_2=-36 +lat_0=0 +lon_0=132 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3578":
        "+proj=aea +lat_1=61.66666666666666 +lat_2=68 +lat_0=59 +lon_0=-132.5 +x_0=500000 +y_0=500000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3579":
        "+proj=aea +lat_1=61.66666666666666 +lat_2=68 +lat_0=59 +lon_0=-132.5 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3580":
        "+proj=lcc +lat_1=62 +lat_2=70 +lat_0=0 +lon_0=-112 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3581":
        "+proj=lcc +lat_1=62 +lat_2=70 +lat_0=0 +lon_0=-112 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3582":
        "+proj=lcc +lat_1=39.45 +lat_2=38.3 +lat_0=37.66666666666666 +lon_0=-77 +x_0=399999.9998983998 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3583":
        "+proj=lcc +lat_1=41.48333333333333 +lat_2=41.28333333333333 +lat_0=41 +lon_0=-70.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3584":
        "+proj=lcc +lat_1=41.48333333333333 +lat_2=41.28333333333333 +lat_0=41 +lon_0=-70.5 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3585":
        "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3586":
        "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000.0001016002 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3587":
        "+proj=lcc +lat_1=45.7 +lat_2=44.18333333333333 +lat_0=43.31666666666667 +lon_0=-84.36666666666666 +x_0=6000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3588":
        "+proj=lcc +lat_1=45.7 +lat_2=44.18333333333333 +lat_0=43.31666666666667 +lon_0=-84.36666666666666 +x_0=5999999.999976001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3589":
        "+proj=lcc +lat_1=47.08333333333334 +lat_2=45.48333333333333 +lat_0=44.78333333333333 +lon_0=-87 +x_0=8000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3590":
        "+proj=lcc +lat_1=47.08333333333334 +lat_2=45.48333333333333 +lat_0=44.78333333333333 +lon_0=-87 +x_0=7999999.999968001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3591":
        "+proj=omerc +lat_0=45.30916666666666 +lonc=-86 +alpha=337.25556 +k=0.9996 +x_0=2546731.496 +y_0=-4354009.816 +no_uoff +gamma=337.25556 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3592":
        "+proj=lcc +lat_1=43.66666666666666 +lat_2=42.1 +lat_0=41.5 +lon_0=-84.36666666666666 +x_0=4000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3593":
        "+proj=lcc +lat_1=43.66666666666666 +lat_2=42.1 +lat_0=41.5 +lon_0=-84.36666666666666 +x_0=3999999.999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3594":
        "+proj=lcc +lat_1=47.05 +lat_2=45.61666666666667 +lat_0=45 +lon_0=-94.25 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3595":
        "+proj=lcc +lat_1=48.63333333333333 +lat_2=47.03333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3596":
        "+proj=lcc +lat_1=45.21666666666667 +lat_2=43.78333333333333 +lat_0=43 +lon_0=-94 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3597":
        "+proj=tmerc +lat_0=29.5 +lon_0=-88.83333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3598":
        "+proj=tmerc +lat_0=29.5 +lon_0=-88.83333333333333 +k=0.99995 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3599":
        "+proj=tmerc +lat_0=29.5 +lon_0=-90.33333333333333 +k=0.99995 +x_0=700000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3600":
        "+proj=tmerc +lat_0=29.5 +lon_0=-90.33333333333333 +k=0.99995 +x_0=699999.9998983998 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3601":
        "+proj=tmerc +lat_0=35.83333333333334 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3602":
        "+proj=tmerc +lat_0=35.83333333333334 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3603":
        "+proj=tmerc +lat_0=36.16666666666666 +lon_0=-94.5 +k=0.999941177 +x_0=850000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3604":
        "+proj=lcc +lat_1=49 +lat_2=45 +lat_0=44.25 +lon_0=-109.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3605":
        "+proj=lcc +lat_1=49 +lat_2=45 +lat_0=44.25 +lon_0=-109.5 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3606":
        "+proj=lcc +lat_1=43 +lat_2=40 +lat_0=39.83333333333334 +lon_0=-100 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3607":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.6666666666667 +k=0.9999 +x_0=500000 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3608":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.6666666666667 +k=0.9999 +x_0=500000.00001016 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3609":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.5833333333333 +k=0.9999 +x_0=200000 +y_0=8000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3610":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.5833333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.000010163 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3611":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.5833333333333 +k=0.9999 +x_0=800000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3612":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.5833333333333 +k=0.9999 +x_0=800000.0000101599 +y_0=3999999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3613":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.66666666666667 +k=0.999966667 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3614":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.66666666666667 +k=0.999966667 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3615":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3616":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3617":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3618":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3619":
        "+proj=tmerc +lat_0=31 +lon_0=-104.3333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3620":
        "+proj=tmerc +lat_0=31 +lon_0=-104.3333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3621":
        "+proj=tmerc +lat_0=31 +lon_0=-107.8333333333333 +k=0.999916667 +x_0=830000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3622":
        "+proj=tmerc +lat_0=31 +lon_0=-107.8333333333333 +k=0.999916667 +x_0=830000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3623":
        "+proj=tmerc +lat_0=40 +lon_0=-76.58333333333333 +k=0.9999375 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3624":
        "+proj=tmerc +lat_0=40 +lon_0=-76.58333333333333 +k=0.9999375 +x_0=249999.9998983998 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3625":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3626":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3627":
        "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3628":
        "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3629":
        "+proj=tmerc +lat_0=40 +lon_0=-78.58333333333333 +k=0.9999375 +x_0=350000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3630":
        "+proj=tmerc +lat_0=40 +lon_0=-78.58333333333333 +k=0.9999375 +x_0=350000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3631":
        "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.22 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3632":
        "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.2192024384 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3633":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.43333333333333 +lat_0=47 +lon_0=-100.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3634":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.43333333333333 +lat_0=47 +lon_0=-100.5 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3635":
        "+proj=lcc +lat_1=47.48333333333333 +lat_2=46.18333333333333 +lat_0=45.66666666666666 +lon_0=-100.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3636":
        "+proj=lcc +lat_1=47.48333333333333 +lat_2=46.18333333333333 +lat_0=45.66666666666666 +lon_0=-100.5 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3637":
        "+proj=lcc +lat_1=41.7 +lat_2=40.43333333333333 +lat_0=39.66666666666666 +lon_0=-82.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3638":
        "+proj=lcc +lat_1=40.03333333333333 +lat_2=38.73333333333333 +lat_0=38 +lon_0=-82.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3639":
        "+proj=lcc +lat_1=36.76666666666667 +lat_2=35.56666666666667 +lat_0=35 +lon_0=-98 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3640":
        "+proj=lcc +lat_1=36.76666666666667 +lat_2=35.56666666666667 +lat_0=35 +lon_0=-98 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3641":
        "+proj=lcc +lat_1=35.23333333333333 +lat_2=33.93333333333333 +lat_0=33.33333333333334 +lon_0=-98 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3642":
        "+proj=lcc +lat_1=35.23333333333333 +lat_2=33.93333333333333 +lat_0=33.33333333333334 +lon_0=-98 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3643":
        "+proj=lcc +lat_1=43 +lat_2=45.5 +lat_0=41.75 +lon_0=-120.5 +x_0=400000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3644":
        "+proj=lcc +lat_1=43 +lat_2=45.5 +lat_0=41.75 +lon_0=-120.5 +x_0=399999.9999984 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3645":
        "+proj=lcc +lat_1=46 +lat_2=44.33333333333334 +lat_0=43.66666666666666 +lon_0=-120.5 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3646":
        "+proj=lcc +lat_1=46 +lat_2=44.33333333333334 +lat_0=43.66666666666666 +lon_0=-120.5 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3647":
        "+proj=lcc +lat_1=44 +lat_2=42.33333333333334 +lat_0=41.66666666666666 +lon_0=-120.5 +x_0=1500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3648":
        "+proj=lcc +lat_1=44 +lat_2=42.33333333333334 +lat_0=41.66666666666666 +lon_0=-120.5 +x_0=1500000.0001464 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3649":
        "+proj=lcc +lat_1=41.95 +lat_2=40.88333333333333 +lat_0=40.16666666666666 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3650":
        "+proj=lcc +lat_1=41.95 +lat_2=40.88333333333333 +lat_0=40.16666666666666 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3651":
        "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3652":
        "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3653":
        "+proj=tmerc +lat_0=41.08333333333334 +lon_0=-71.5 +k=0.99999375 +x_0=100000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3654":
        "+proj=tmerc +lat_0=41.08333333333334 +lon_0=-71.5 +k=0.99999375 +x_0=99999.99998983997 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3655":
        "+proj=lcc +lat_1=34.83333333333334 +lat_2=32.5 +lat_0=31.83333333333333 +lon_0=-81 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3656":
        "+proj=lcc +lat_1=34.83333333333334 +lat_2=32.5 +lat_0=31.83333333333333 +lon_0=-81 +x_0=609600 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3657":
        "+proj=lcc +lat_1=45.68333333333333 +lat_2=44.41666666666666 +lat_0=43.83333333333334 +lon_0=-100 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3658":
        "+proj=lcc +lat_1=45.68333333333333 +lat_2=44.41666666666666 +lat_0=43.83333333333334 +lon_0=-100 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3659":
        "+proj=lcc +lat_1=44.4 +lat_2=42.83333333333334 +lat_0=42.33333333333334 +lon_0=-100.3333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3660":
        "+proj=lcc +lat_1=44.4 +lat_2=42.83333333333334 +lat_0=42.33333333333334 +lon_0=-100.3333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3661":
        "+proj=lcc +lat_1=36.41666666666666 +lat_2=35.25 +lat_0=34.33333333333334 +lon_0=-86 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3662":
        "+proj=lcc +lat_1=36.41666666666666 +lat_2=35.25 +lat_0=34.33333333333334 +lon_0=-86 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3663":
        "+proj=lcc +lat_1=31.88333333333333 +lat_2=30.11666666666667 +lat_0=29.66666666666667 +lon_0=-100.3333333333333 +x_0=700000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3664":
        "+proj=lcc +lat_1=31.88333333333333 +lat_2=30.11666666666667 +lat_0=29.66666666666667 +lon_0=-100.3333333333333 +x_0=699999.9998983998 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3665":
        "+proj=aea +lat_1=27.5 +lat_2=35 +lat_0=18 +lon_0=-100 +x_0=1500000 +y_0=6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3666":
        "+proj=lcc +lat_1=27.5 +lat_2=35 +lat_0=18 +lon_0=-100 +x_0=1500000 +y_0=5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3667":
        "+proj=lcc +lat_1=36.18333333333333 +lat_2=34.65 +lat_0=34 +lon_0=-101.5 +x_0=200000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3668":
        "+proj=lcc +lat_1=36.18333333333333 +lat_2=34.65 +lat_0=34 +lon_0=-101.5 +x_0=200000.0001016002 +y_0=999999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3669":
        "+proj=lcc +lat_1=33.96666666666667 +lat_2=32.13333333333333 +lat_0=31.66666666666667 +lon_0=-98.5 +x_0=600000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3670":
        "+proj=lcc +lat_1=33.96666666666667 +lat_2=32.13333333333333 +lat_0=31.66666666666667 +lon_0=-98.5 +x_0=600000 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3671":
        "+proj=lcc +lat_1=27.83333333333333 +lat_2=26.16666666666667 +lat_0=25.66666666666667 +lon_0=-98.5 +x_0=300000 +y_0=5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3672":
        "+proj=lcc +lat_1=27.83333333333333 +lat_2=26.16666666666667 +lat_0=25.66666666666667 +lon_0=-98.5 +x_0=300000.0000000001 +y_0=5000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3673":
        "+proj=lcc +lat_1=30.28333333333333 +lat_2=28.38333333333333 +lat_0=27.83333333333333 +lon_0=-99 +x_0=600000 +y_0=4000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3674":
        "+proj=lcc +lat_1=30.28333333333333 +lat_2=28.38333333333333 +lat_0=27.83333333333333 +lon_0=-99 +x_0=600000 +y_0=3999999.9998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3675":
        "+proj=lcc +lat_1=40.65 +lat_2=39.01666666666667 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3676":
        "+proj=lcc +lat_1=40.65 +lat_2=39.01666666666667 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=500000.0001504 +y_0=1999999.999992 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3677":
        "+proj=lcc +lat_1=40.65 +lat_2=39.01666666666667 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=500000.00001016 +y_0=2000000.00001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3678":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.71666666666667 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3679":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.71666666666667 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=500000.0001504 +y_0=999999.9999960001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3680":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.71666666666667 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=500000.00001016 +y_0=999999.9999898402 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3681":
        "+proj=lcc +lat_1=38.35 +lat_2=37.21666666666667 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=500000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3682":
        "+proj=lcc +lat_1=38.35 +lat_2=37.21666666666667 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=500000.0001504 +y_0=2999999.999988 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:3683":
        "+proj=lcc +lat_1=38.35 +lat_2=37.21666666666667 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=500000.00001016 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3684":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3685":
        "+proj=lcc +lat_1=39.2 +lat_2=38.03333333333333 +lat_0=37.66666666666666 +lon_0=-78.5 +x_0=3500000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3686":
        "+proj=lcc +lat_1=39.2 +lat_2=38.03333333333333 +lat_0=37.66666666666666 +lon_0=-78.5 +x_0=3500000.0001016 +y_0=2000000.0001016 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3687":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=36.76666666666667 +lat_0=36.33333333333334 +lon_0=-78.5 +x_0=3500000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3688":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=36.76666666666667 +lat_0=36.33333333333334 +lon_0=-78.5 +x_0=3500000.0001016 +y_0=999999.9998983998 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3689":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.5 +lat_0=47 +lon_0=-120.8333333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3690":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.5 +lat_0=47 +lon_0=-120.8333333333333 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3691":
        "+proj=lcc +lat_1=47.33333333333334 +lat_2=45.83333333333334 +lat_0=45.33333333333334 +lon_0=-120.5 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3692":
        "+proj=lcc +lat_1=47.33333333333334 +lat_2=45.83333333333334 +lat_0=45.33333333333334 +lon_0=-120.5 +x_0=500000.0001016001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3693":
        "+proj=lcc +lat_1=40.25 +lat_2=39 +lat_0=38.5 +lon_0=-79.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3694":
        "+proj=lcc +lat_1=38.88333333333333 +lat_2=37.48333333333333 +lat_0=37 +lon_0=-81 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3695":
        "+proj=lcc +lat_1=45.5 +lat_2=44.25 +lat_0=43.83333333333334 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3696":
        "+proj=lcc +lat_1=45.5 +lat_2=44.25 +lat_0=43.83333333333334 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3697":
        "+proj=lcc +lat_1=46.76666666666667 +lat_2=45.56666666666667 +lat_0=45.16666666666666 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3698":
        "+proj=lcc +lat_1=46.76666666666667 +lat_2=45.56666666666667 +lat_0=45.16666666666666 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3699":
        "+proj=lcc +lat_1=44.06666666666667 +lat_2=42.73333333333333 +lat_0=42 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3700":
        "+proj=lcc +lat_1=44.06666666666667 +lat_2=42.73333333333333 +lat_0=42 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3701":
        "+proj=tmerc +lat_0=0 +lon_0=-90 +k=0.9996 +x_0=520000 +y_0=-4480000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3702":
        "+proj=tmerc +lat_0=40.5 +lon_0=-105.1666666666667 +k=0.9999375 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3703":
        "+proj=tmerc +lat_0=40.5 +lon_0=-107.3333333333333 +k=0.9999375 +x_0=400000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3704":
        "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3705":
        "+proj=tmerc +lat_0=40.5 +lon_0=-110.0833333333333 +k=0.9999375 +x_0=800000 +y_0=100000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3706":
        "+proj=utm +zone=59 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3707":
        "+proj=utm +zone=60 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3708":
        "+proj=utm +zone=1 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3709":
        "+proj=utm +zone=2 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3710":
        "+proj=utm +zone=3 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3711":
        "+proj=utm +zone=4 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3712":
        "+proj=utm +zone=5 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3713":
        "+proj=utm +zone=6 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3714":
        "+proj=utm +zone=7 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3715":
        "+proj=utm +zone=8 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3716":
        "+proj=utm +zone=9 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3717":
        "+proj=utm +zone=10 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3718":
        "+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3719":
        "+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3720":
        "+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3721":
        "+proj=utm +zone=14 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3722":
        "+proj=utm +zone=15 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3723":
        "+proj=utm +zone=16 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3724":
        "+proj=utm +zone=17 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3725":
        "+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3726":
        "+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3727":
        "+proj=tmerc +lat_0=-21.11666666666667 +lon_0=55.53333333333333 +k=1 +x_0=160000 +y_0=50000 +ellps=intl +towgs84=94,-948,-1262,0,0,0,0 +units=m +no_defs",
      "EPSG:3728":
        "+proj=lcc +lat_1=41.7 +lat_2=40.43333333333333 +lat_0=39.66666666666666 +lon_0=-82.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3729":
        "+proj=lcc +lat_1=40.03333333333333 +lat_2=38.73333333333333 +lat_0=38 +lon_0=-82.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3730":
        "+proj=tmerc +lat_0=40.5 +lon_0=-105.1666666666667 +k=0.9999375 +x_0=200000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3731":
        "+proj=tmerc +lat_0=40.5 +lon_0=-107.3333333333333 +k=0.9999375 +x_0=399999.99998984 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3732":
        "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3733":
        "+proj=tmerc +lat_0=40.5 +lon_0=-110.0833333333333 +k=0.9999375 +x_0=800000.0000101599 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3734":
        "+proj=lcc +lat_1=41.7 +lat_2=40.43333333333333 +lat_0=39.66666666666666 +lon_0=-82.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3735":
        "+proj=lcc +lat_1=40.03333333333333 +lat_2=38.73333333333333 +lat_0=38 +lon_0=-82.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3736":
        "+proj=tmerc +lat_0=40.5 +lon_0=-105.1666666666667 +k=0.9999375 +x_0=200000.00001016 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3737":
        "+proj=tmerc +lat_0=40.5 +lon_0=-107.3333333333333 +k=0.9999375 +x_0=399999.99998984 +y_0=99999.99998983997 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3738":
        "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3739":
        "+proj=tmerc +lat_0=40.5 +lon_0=-110.0833333333333 +k=0.9999375 +x_0=800000.0000101599 +y_0=99999.99998983997 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3740":
        "+proj=utm +zone=10 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3741":
        "+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3742":
        "+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3743":
        "+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3744":
        "+proj=utm +zone=14 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3745":
        "+proj=utm +zone=15 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3746":
        "+proj=utm +zone=16 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3747":
        "+proj=utm +zone=17 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3748":
        "+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3749":
        "+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3750":
        "+proj=utm +zone=4 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3751":
        "+proj=utm +zone=5 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3752":
        "+proj=merc +lon_0=100 +lat_ts=-41 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3753":
        "+proj=lcc +lat_1=41.7 +lat_2=40.43333333333333 +lat_0=39.66666666666666 +lon_0=-82.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3754":
        "+proj=lcc +lat_1=40.03333333333333 +lat_2=38.73333333333333 +lat_0=38 +lon_0=-82.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3755":
        "+proj=tmerc +lat_0=40.5 +lon_0=-105.1666666666667 +k=0.9999375 +x_0=200000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3756":
        "+proj=tmerc +lat_0=40.5 +lon_0=-107.3333333333333 +k=0.9999375 +x_0=399999.99998984 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3757":
        "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3758":
        "+proj=tmerc +lat_0=40.5 +lon_0=-110.0833333333333 +k=0.9999375 +x_0=800000.0000101599 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3759":
        "+proj=tmerc +lat_0=21.16666666666667 +lon_0=-158 +k=0.99999 +x_0=500000.00001016 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:3760":
        "+proj=tmerc +lat_0=21.16666666666667 +lon_0=-158 +k=0.99999 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3761":
        "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3762":
        "+proj=lcc +lat_1=-54 +lat_2=-54.75 +lat_0=-55 +lon_0=-37 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3763":
        "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3764":
        "+proj=tmerc +lat_0=-44 +lon_0=-176.5 +k=1 +x_0=400000 +y_0=800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3765":
        "+proj=tmerc +lat_0=0 +lon_0=16.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3766":
        "+proj=lcc +lat_1=45.91666666666666 +lat_2=43.08333333333334 +lat_0=0 +lon_0=16.5 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3767":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3768":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3769":
        "+proj=utm +zone=20 +ellps=clrk66 +towgs84=-73,213,296,0,0,0,0 +units=m +no_defs",
      "EPSG:3770":
        "+proj=tmerc +lat_0=32 +lon_0=-64.75 +k=1 +x_0=550000 +y_0=100000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3771":
        "+proj=tmerc +lat_0=0 +lon_0=-111 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:3772":
        "+proj=tmerc +lat_0=0 +lon_0=-114 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:3773":
        "+proj=tmerc +lat_0=0 +lon_0=-117 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:3774":
        "+proj=tmerc +lat_0=0 +lon_0=-120 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:3775":
        "+proj=tmerc +lat_0=0 +lon_0=-111 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3776":
        "+proj=tmerc +lat_0=0 +lon_0=-114 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3777":
        "+proj=tmerc +lat_0=0 +lon_0=-117 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3778":
        "+proj=tmerc +lat_0=0 +lon_0=-120 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3779":
        "+proj=tmerc +lat_0=0 +lon_0=-111 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3780":
        "+proj=tmerc +lat_0=0 +lon_0=-114 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3781":
        "+proj=tmerc +lat_0=0 +lon_0=-117 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3782":
        "+proj=tmerc +lat_0=0 +lon_0=-120 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3783":
        "+proj=tmerc +lat_0=-25.06855261111111 +lon_0=-130.1129671111111 +k=1 +x_0=14200 +y_0=15500 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3784":
        "+proj=utm +zone=9 +south +ellps=intl +towgs84=185,165,42,0,0,0,0 +units=m +no_defs",
      "EPSG:3785":
        "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
      "EPSG:3786":
        "+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +a=6371007 +b=6371007 +units=m +no_defs",
      "EPSG:3787":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=500000 +y_0=-5000000 +datum=hermannskogel +units=m +no_defs",
      "EPSG:3788":
        "+proj=tmerc +lat_0=0 +lon_0=166 +k=1 +x_0=3500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3789":
        "+proj=tmerc +lat_0=0 +lon_0=169 +k=1 +x_0=3500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3790":
        "+proj=tmerc +lat_0=0 +lon_0=179 +k=1 +x_0=3500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3791":
        "+proj=tmerc +lat_0=0 +lon_0=-178 +k=1 +x_0=3500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3793":
        "+proj=tmerc +lat_0=0 +lon_0=-176.5 +k=1 +x_0=3500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3794":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=500000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3795":
        "+proj=lcc +lat_1=23 +lat_2=21.7 +lat_0=22.35 +lon_0=-81 +x_0=500000 +y_0=280296.016 +datum=NAD27 +units=m +no_defs",
      "EPSG:3796":
        "+proj=lcc +lat_1=21.3 +lat_2=20.13333333333333 +lat_0=20.71666666666667 +lon_0=-76.83333333333333 +x_0=500000 +y_0=229126.939 +datum=NAD27 +units=m +no_defs",
      "EPSG:3797":
        "+proj=lcc +lat_1=50 +lat_2=46 +lat_0=44 +lon_0=-70 +x_0=800000 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:3798":
        "+proj=lcc +lat_1=50 +lat_2=46 +lat_0=44 +lon_0=-70 +x_0=800000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3799":
        "+proj=lcc +lat_1=50 +lat_2=46 +lat_0=44 +lon_0=-70 +x_0=800000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3800":
        "+proj=tmerc +lat_0=0 +lon_0=-120 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:3801":
        "+proj=tmerc +lat_0=0 +lon_0=-120 +k=0.9999 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3802":
        "+proj=tmerc +lat_0=0 +lon_0=-120 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3812":
        "+proj=lcc +lat_1=49.83333333333334 +lat_2=51.16666666666666 +lat_0=50.797815 +lon_0=4.359215833333333 +x_0=649328 +y_0=665262 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3814":
        "+proj=tmerc +lat_0=32.5 +lon_0=-89.75 +k=0.9998335 +x_0=500000 +y_0=1300000 +datum=NAD83 +units=m +no_defs",
      "EPSG:3815":
        "+proj=tmerc +lat_0=32.5 +lon_0=-89.75 +k=0.9998335 +x_0=500000 +y_0=1300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3816":
        "+proj=tmerc +lat_0=32.5 +lon_0=-89.75 +k=0.9998335 +x_0=500000 +y_0=1300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3819":
        "+proj=longlat +ellps=bessel +towgs84=595.48,121.69,515.35,4.115,-2.9383,0.853,-3.408 +no_defs",
      "EPSG:3821": "+proj=longlat +ellps=aust_SA +no_defs",
      "EPSG:3822": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:3823": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:3824": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:3825":
        "+proj=tmerc +lat_0=0 +lon_0=119 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3826":
        "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3827":
        "+proj=tmerc +lat_0=0 +lon_0=119 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +units=m +no_defs",
      "EPSG:3828":
        "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +units=m +no_defs",
      "EPSG:3829":
        "+proj=utm +zone=51 +ellps=intl +towgs84=-637,-549,-203,0,0,0,0 +units=m +no_defs",
      "EPSG:3832":
        "+proj=merc +lon_0=150 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3833":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=2500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3834":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=2500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:3835":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:3836":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:3837":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3838":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3839":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=9500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3840":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=10500000 +y_0=0 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3841":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:3842":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:3843":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:3844":
        "+proj=sterea +lat_0=46 +lon_0=25 +k=0.99975 +x_0=500000 +y_0=500000 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs",
      "EPSG:3845":
        "+proj=tmerc +lat_0=0 +lon_0=11.30625 +k=1.000006 +x_0=1500025.141 +y_0=-667.282 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3846":
        "+proj=tmerc +lat_0=0 +lon_0=13.55626666666667 +k=1.0000058 +x_0=1500044.695 +y_0=-667.13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3847":
        "+proj=tmerc +lat_0=0 +lon_0=15.80628452944445 +k=1.00000561024 +x_0=1500064.274 +y_0=-667.711 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3848":
        "+proj=tmerc +lat_0=0 +lon_0=18.0563 +k=1.0000054 +x_0=1500083.521 +y_0=-668.8440000000001 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3849":
        "+proj=tmerc +lat_0=0 +lon_0=20.30631666666667 +k=1.0000052 +x_0=1500102.765 +y_0=-670.706 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3850":
        "+proj=tmerc +lat_0=0 +lon_0=22.55633333333333 +k=1.0000049 +x_0=1500121.846 +y_0=-672.557 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3851":
        "+proj=lcc +lat_1=-37.5 +lat_2=-44.5 +lat_0=-41 +lon_0=173 +x_0=3000000 +y_0=7000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3852":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-90 +lon_0=157 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3854":
        "+proj=tmerc +lat_0=0 +lon_0=18.05787 +k=0.99999506 +x_0=100182.7406 +y_0=-6500620.1207 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3855": "+geoidgrids=us_nga_egm08_25.tif +vunits=m +no_defs",
      "EPSG:3857":
        "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
      "EPSG:3873":
        "+proj=tmerc +lat_0=0 +lon_0=19 +k=1 +x_0=19500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3874":
        "+proj=tmerc +lat_0=0 +lon_0=20 +k=1 +x_0=20500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3875":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=21500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3876":
        "+proj=tmerc +lat_0=0 +lon_0=22 +k=1 +x_0=22500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3877":
        "+proj=tmerc +lat_0=0 +lon_0=23 +k=1 +x_0=23500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3878":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=24500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3879":
        "+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3880":
        "+proj=tmerc +lat_0=0 +lon_0=26 +k=1 +x_0=26500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3881":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=27500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3882":
        "+proj=tmerc +lat_0=0 +lon_0=28 +k=1 +x_0=28500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3883":
        "+proj=tmerc +lat_0=0 +lon_0=29 +k=1 +x_0=29500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3884":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=30500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3885":
        "+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=31500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3886": "+vunits=m +no_defs",
      "EPSG:3887": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:3888": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:3889": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:3890":
        "+proj=utm +zone=37 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3891":
        "+proj=utm +zone=38 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3892":
        "+proj=utm +zone=39 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3893":
        "+proj=tmerc +lat_0=29.02626833333333 +lon_0=46.5 +k=0.9994 +x_0=800000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:3900": "+vunits=m +no_defs",
      "EPSG:3901":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +vunits=m +no_defs",
      "EPSG:3902":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:3903":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:3906":
        "+proj=longlat +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +no_defs",
      "EPSG:3907":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=5500000 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +units=m +no_defs",
      "EPSG:3908":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.9999 +x_0=6500000 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +units=m +no_defs",
      "EPSG:3909":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=7500000 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +units=m +no_defs",
      "EPSG:3910":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9999 +x_0=8500000 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +units=m +no_defs",
      "EPSG:3911":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=500000 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +units=m +no_defs",
      "EPSG:3912":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=500000 +y_0=-5000000 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +units=m +no_defs",
      "EPSG:3920":
        "+proj=utm +zone=20 +ellps=clrk66 +towgs84=11,72,-101,0,0,0,0 +units=m +no_defs",
      "EPSG:3942":
        "+proj=lcc +lat_1=41.25 +lat_2=42.75 +lat_0=42 +lon_0=3 +x_0=1700000 +y_0=1200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3943":
        "+proj=lcc +lat_1=42.25 +lat_2=43.75 +lat_0=43 +lon_0=3 +x_0=1700000 +y_0=2200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3944":
        "+proj=lcc +lat_1=43.25 +lat_2=44.75 +lat_0=44 +lon_0=3 +x_0=1700000 +y_0=3200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3945":
        "+proj=lcc +lat_1=44.25 +lat_2=45.75 +lat_0=45 +lon_0=3 +x_0=1700000 +y_0=4200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3946":
        "+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3947":
        "+proj=lcc +lat_1=46.25 +lat_2=47.75 +lat_0=47 +lon_0=3 +x_0=1700000 +y_0=6200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3948":
        "+proj=lcc +lat_1=47.25 +lat_2=48.75 +lat_0=48 +lon_0=3 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3949":
        "+proj=lcc +lat_1=48.25 +lat_2=49.75 +lat_0=49 +lon_0=3 +x_0=1700000 +y_0=8200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3950":
        "+proj=lcc +lat_1=49.25 +lat_2=50.75 +lat_0=50 +lon_0=3 +x_0=1700000 +y_0=9200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3968":
        "+proj=lcc +lat_1=37 +lat_2=39.5 +lat_0=36 +lon_0=-79.5 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3969":
        "+proj=lcc +lat_1=37 +lat_2=39.5 +lat_0=36 +lon_0=-79.5 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3970":
        "+proj=lcc +lat_1=37 +lat_2=39.5 +lat_0=36 +lon_0=-79.5 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3973":
        "+proj=laea +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3974":
        "+proj=laea +lat_0=-90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3975":
        "+proj=cea +lon_0=0 +lat_ts=30 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3976":
        "+proj=stere +lat_0=-90 +lat_ts=-70 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3978":
        "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:3979":
        "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:3985":
        "+proj=lcc +lat_1=-6.5 +lat_2=-11.5 +lat_0=9 +lon_0=26 +x_0=500000 +y_0=500000 +ellps=clrk66 +towgs84=-103.746,-9.614,-255.95,0,0,0,0 +units=m +no_defs",
      "EPSG:3986":
        "+proj=tmerc +lat_0=-9 +lon_0=30 +k=1 +x_0=200000 +y_0=500000 +ellps=clrk66 +towgs84=-103.746,-9.614,-255.95,0,0,0,0 +units=m +no_defs",
      "EPSG:3987":
        "+proj=tmerc +lat_0=-9 +lon_0=28 +k=1 +x_0=200000 +y_0=500000 +ellps=clrk66 +towgs84=-103.746,-9.614,-255.95,0,0,0,0 +units=m +no_defs",
      "EPSG:3988":
        "+proj=tmerc +lat_0=-9 +lon_0=26 +k=1 +x_0=200000 +y_0=500000 +ellps=clrk66 +towgs84=-103.746,-9.614,-255.95,0,0,0,0 +units=m +no_defs",
      "EPSG:3989":
        "+proj=tmerc +lat_0=-9 +lon_0=24 +k=1 +x_0=200000 +y_0=500000 +ellps=clrk66 +towgs84=-103.746,-9.614,-255.95,0,0,0,0 +units=m +no_defs",
      "EPSG:3991":
        "+proj=lcc +lat_1=18.43333333333333 +lat_2=18.03333333333333 +lat_0=17.83333333333333 +lon_0=-66.43333333333334 +x_0=152400.3048006096 +y_0=0 +ellps=clrk66 +towgs84=11,72,-101,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3992":
        "+proj=lcc +lat_1=18.43333333333333 +lat_2=18.03333333333333 +lat_0=17.83333333333333 +lon_0=-66.43333333333334 +x_0=152400.3048006096 +y_0=30480.06096012192 +ellps=clrk66 +towgs84=11,72,-101,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:3993":
        "+proj=aeqd +guam +lat_0=13.4724663527778 +lon_0=144.748750705556 +x_0=50000 +y_0=50000 +ellps=clrk66 +towgs84=-100,-248,259,0,0,0,0 +units=m +no_defs",
      "EPSG:3994":
        "+proj=merc +lon_0=100 +lat_ts=-41 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3995":
        "+proj=stere +lat_0=90 +lat_ts=71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3996":
        "+proj=stere +lat_0=90 +lat_ts=75 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:3997":
        "+proj=tmerc +lat_0=0 +lon_0=55.33333333333334 +k=1 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:4000": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4001": "+proj=longlat +ellps=airy +no_defs",
      "EPSG:4002": "+proj=longlat +ellps=mod_airy +no_defs",
      "EPSG:4003": "+proj=longlat +ellps=aust_SA +no_defs",
      "EPSG:4004": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:4005": "+proj=longlat +a=6377492.018 +b=6356173.508712696 +no_defs",
      "EPSG:4006": "+proj=longlat +ellps=bess_nam +no_defs",
      "EPSG:4007":
        "+proj=longlat +a=6378293.645208759 +b=6356617.987679838 +no_defs",
      "EPSG:4008": "+proj=longlat +ellps=clrk66 +no_defs",
      "EPSG:4009":
        "+proj=longlat +a=6378450.047548896 +b=6356826.621488444 +no_defs",
      "EPSG:4010": "+proj=longlat +a=6378300.789 +b=6356566.435 +no_defs",
      "EPSG:4011": "+proj=longlat +a=6378249.2 +b=6356515 +no_defs",
      "EPSG:4012": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4013": "+proj=longlat +a=6378249.145 +b=6356514.966398753 +no_defs",
      "EPSG:4014": "+proj=longlat +a=6378249.2 +b=6356514.996941779 +no_defs",
      "EPSG:4015": "+proj=longlat +a=6377276.345 +b=6356075.41314024 +no_defs",
      "EPSG:4016": "+proj=longlat +ellps=evrstSS +no_defs",
      "EPSG:4017": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4018": "+proj=longlat +a=6377304.063 +b=6356103.038993155 +no_defs",
      "EPSG:4019": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4020": "+proj=longlat +ellps=helmert +no_defs",
      "EPSG:4021": "+proj=longlat +a=6378160 +b=6356774.50408554 +no_defs",
      "EPSG:4022": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4023": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4024": "+proj=longlat +ellps=krass +no_defs",
      "EPSG:4025": "+proj=longlat +ellps=WGS66 +no_defs",
      "EPSG:4026":
        "+proj=tmerc +lat_0=0 +lon_0=28.4 +k=0.9999400000000001 +x_0=200000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4027": "+proj=longlat +a=6376523 +b=6355862.933255573 +no_defs",
      "EPSG:4028": "+proj=longlat +a=6378298.3 +b=6356657.142669561 +no_defs",
      "EPSG:4029": "+proj=longlat +a=6378300 +b=6356751.689189189 +no_defs",
      "EPSG:4030": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:4031": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:4032": "+proj=longlat +a=6378136.2 +b=6356751.516927429 +no_defs",
      "EPSG:4033": "+proj=longlat +a=6378136.3 +b=6356751.616592146 +no_defs",
      "EPSG:4034":
        "+proj=longlat +a=6378249.144808011 +b=6356514.966204134 +no_defs",
      "EPSG:4035": "+proj=longlat +a=6371000 +b=6371000 +no_defs",
      "EPSG:4036": "+proj=longlat +ellps=GRS67 +no_defs",
      "EPSG:4037": "+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs",
      "EPSG:4038": "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs",
      "EPSG:4039": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4040": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4041": "+proj=longlat +a=6378135 +b=6356750.304921594 +no_defs",
      "EPSG:4042":
        "+proj=longlat +a=6377299.36559538 +b=6356098.359005156 +no_defs",
      "EPSG:4043": "+proj=longlat +ellps=WGS72 +no_defs",
      "EPSG:4044": "+proj=longlat +a=6377301.243 +b=6356100.230165384 +no_defs",
      "EPSG:4045": "+proj=longlat +a=6377299.151 +b=6356098.145120132 +no_defs",
      "EPSG:4046": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4047": "+proj=longlat +a=6371007 +b=6371007 +no_defs",
      "EPSG:4048":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4049":
        "+proj=tmerc +lat_0=0 +lon_0=14 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4050":
        "+proj=tmerc +lat_0=0 +lon_0=16 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4051":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4052": "+proj=longlat +a=6370997 +b=6370997 +no_defs",
      "EPSG:4053": "+proj=longlat +a=6371228 +b=6371228 +no_defs",
      "EPSG:4054": "+proj=longlat +a=6378273 +b=6356889.449 +no_defs",
      "EPSG:4055":
        "+proj=longlat +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4056":
        "+proj=tmerc +lat_0=0 +lon_0=20 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4057":
        "+proj=tmerc +lat_0=0 +lon_0=22 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4058":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4059":
        "+proj=tmerc +lat_0=0 +lon_0=26 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4060":
        "+proj=tmerc +lat_0=0 +lon_0=28 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4061":
        "+proj=utm +zone=33 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4062":
        "+proj=utm +zone=34 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4063":
        "+proj=utm +zone=35 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4071":
        "+proj=utm +zone=23 +south +ellps=intl +towgs84=-134,229,-29,0,0,0,0 +units=m +no_defs",
      "EPSG:4073": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4074": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4075": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4079": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4080": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4081": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4082":
        "+proj=utm +zone=27 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4083":
        "+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4087":
        "+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:4088":
        "+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:4093":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.99998 +x_0=200000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4094":
        "+proj=tmerc +lat_0=0 +lon_0=10 +k=0.99998 +x_0=400000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4095":
        "+proj=tmerc +lat_0=0 +lon_0=11.75 +k=0.99998 +x_0=600000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4096":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=800000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4097":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.99998 +x_0=200000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:4098":
        "+proj=tmerc +lat_0=0 +lon_0=10 +k=0.99998 +x_0=400000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:4099":
        "+proj=tmerc +lat_0=0 +lon_0=11.75 +k=0.99998 +x_0=600000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:4100":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=800000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:4120": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:4121": "+proj=longlat +datum=GGRS87 +no_defs",
      "EPSG:4122": "+proj=longlat +a=6378135 +b=6356750.304921594 +no_defs",
      "EPSG:4123":
        "+proj=longlat +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +no_defs",
      "EPSG:4124":
        "+proj=longlat +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs",
      "EPSG:4125":
        "+proj=longlat +ellps=bessel +towgs84=-404.78,685.68,45.47,0,0,0,0 +no_defs",
      "EPSG:4126": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4127":
        "+proj=longlat +ellps=clrk66 +towgs84=219.315,168.975,-166.145,0.198,5.926,-2.356,-57.104 +no_defs",
      "EPSG:4128": "+proj=longlat +ellps=clrk66 +no_defs",
      "EPSG:4129": "+proj=longlat +ellps=clrk66 +no_defs",
      "EPSG:4130":
        "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,-0,-0,-0,0 +no_defs",
      "EPSG:4131":
        "+proj=longlat +a=6377276.345 +b=6356075.41314024 +towgs84=198,881,317,0,0,0,0 +no_defs",
      "EPSG:4132":
        "+proj=longlat +ellps=clrk80 +towgs84=-239.1,-170.02,397.5,0,0,0,0 +no_defs",
      "EPSG:4133":
        "+proj=longlat +ellps=GRS80 +towgs84=0.055,-0.541,-0.185,0.0183,-0.0003,-0.007,-0.014 +no_defs",
      "EPSG:4134":
        "+proj=longlat +ellps=clrk80 +towgs84=-180.624,-225.516,173.919,-0.81,-1.898,8.336,16.7101 +no_defs",
      "EPSG:4135":
        "+proj=longlat +ellps=clrk66 +towgs84=61,-285,-181,0,0,0,0 +no_defs",
      "EPSG:4136": "+proj=longlat +ellps=clrk66 +no_defs",
      "EPSG:4137": "+proj=longlat +ellps=clrk66 +no_defs",
      "EPSG:4138": "+proj=longlat +ellps=clrk66 +no_defs",
      "EPSG:4139":
        "+proj=longlat +ellps=clrk66 +towgs84=11,72,-101,0,0,0,0 +no_defs",
      "EPSG:4140": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4141":
        "+proj=longlat +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +no_defs",
      "EPSG:4142":
        "+proj=longlat +ellps=clrk80 +towgs84=-125,53,467,0,0,0,0 +no_defs",
      "EPSG:4143":
        "+proj=longlat +ellps=clrk80 +towgs84=-124.76,53,466.79,0,0,0,0 +no_defs",
      "EPSG:4144":
        "+proj=longlat +a=6377276.345 +b=6356075.41314024 +towgs84=282,726,254,0,0,0,0 +no_defs",
      "EPSG:4145":
        "+proj=longlat +a=6377301.243 +b=6356100.230165384 +towgs84=283,682,231,0,0,0,0 +no_defs",
      "EPSG:4146":
        "+proj=longlat +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +no_defs",
      "EPSG:4147":
        "+proj=longlat +ellps=krass +towgs84=-17.51,-108.32,-62.39,0,0,0,0 +no_defs",
      "EPSG:4148": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4149":
        "+proj=longlat +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +no_defs",
      "EPSG:4150":
        "+proj=longlat +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +no_defs",
      "EPSG:4151": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4152": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4153":
        "+proj=longlat +ellps=intl +towgs84=-133.63,-157.5,-158.62,0,0,0,0 +no_defs",
      "EPSG:4154":
        "+proj=longlat +ellps=intl +towgs84=-117,-132,-164,0,0,0,0 +no_defs",
      "EPSG:4155":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-83,37,124,0,0,0,0 +no_defs",
      "EPSG:4156":
        "+proj=longlat +ellps=bessel +towgs84=589,76,480,0,0,0,0 +no_defs",
      "EPSG:4157":
        "+proj=longlat +a=6378293.645208759 +b=6356617.987679838 +no_defs",
      "EPSG:4158":
        "+proj=longlat +ellps=intl +towgs84=-0.465,372.095,171.736,0,0,0,0 +no_defs",
      "EPSG:4159":
        "+proj=longlat +ellps=intl +towgs84=-115.854,-99.0583,-152.462,0,0,0,0 +no_defs",
      "EPSG:4160": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4161":
        "+proj=longlat +ellps=intl +towgs84=27.5,14,186.4,0,0,0,0 +no_defs",
      "EPSG:4162": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:4163": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4164":
        "+proj=longlat +ellps=krass +towgs84=-76,-138,67,0,0,0,0 +no_defs",
      "EPSG:4165":
        "+proj=longlat +ellps=intl +towgs84=-173,253,27,0,0,0,0 +no_defs",
      "EPSG:4166": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4167": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4168":
        "+proj=longlat +a=6378300 +b=6356751.689189189 +towgs84=-199,32,322,0,0,0,0 +no_defs",
      "EPSG:4169":
        "+proj=longlat +ellps=clrk66 +towgs84=-115,118,426,0,0,0,0 +no_defs",
      "EPSG:4170": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4171": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4172": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4173": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4174": "+proj=longlat +a=6378300 +b=6356751.689189189 +no_defs",
      "EPSG:4175":
        "+proj=longlat +ellps=clrk80 +towgs84=-88,4,101,0,0,0,0 +no_defs",
      "EPSG:4176": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4178":
        "+proj=longlat +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +no_defs",
      "EPSG:4179":
        "+proj=longlat +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +no_defs",
      "EPSG:4180": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4181":
        "+proj=longlat +ellps=intl +towgs84=-189.681,18.3463,-42.7695,-0.33746,-3.09264,2.53861,0.4598 +no_defs",
      "EPSG:4182":
        "+proj=longlat +ellps=intl +towgs84=-425,-169,81,0,0,0,0 +no_defs",
      "EPSG:4183":
        "+proj=longlat +ellps=intl +towgs84=-104,167,-38,0,0,0,0 +no_defs",
      "EPSG:4184":
        "+proj=longlat +ellps=intl +towgs84=-203,141,53,0,0,0,0 +no_defs",
      "EPSG:4185": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4188":
        "+proj=longlat +ellps=airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +no_defs",
      "EPSG:4189": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4190": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4191": "+proj=longlat +ellps=krass +no_defs",
      "EPSG:4192":
        "+proj=longlat +ellps=intl +towgs84=-206.1,-174.7,-87.7,0,0,0,0 +no_defs",
      "EPSG:4193":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-70.9,-151.8,-41.4,0,0,0,0 +no_defs",
      "EPSG:4194":
        "+proj=longlat +ellps=intl +towgs84=164,138,-189,0,0,0,0 +no_defs",
      "EPSG:4195":
        "+proj=longlat +ellps=intl +towgs84=105,326,-102.5,0,0,0.814,-0.6 +no_defs",
      "EPSG:4196":
        "+proj=longlat +ellps=intl +towgs84=-45,417,-3.5,0,0,0.814,-0.6 +no_defs",
      "EPSG:4197": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4198": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4199": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4200":
        "+proj=longlat +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +no_defs",
      "EPSG:4201":
        "+proj=longlat +ellps=clrk80 +towgs84=-166,-15,204,0,0,0,0 +no_defs",
      "EPSG:4202":
        "+proj=longlat +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +no_defs",
      "EPSG:4203":
        "+proj=longlat +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +no_defs",
      "EPSG:4204":
        "+proj=longlat +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +no_defs",
      "EPSG:4205":
        "+proj=longlat +ellps=krass +towgs84=-43,-163,45,0,0,0,0 +no_defs",
      "EPSG:4206": "+proj=longlat +a=6378249.2 +b=6356515 +no_defs",
      "EPSG:4207":
        "+proj=longlat +ellps=intl +towgs84=-304.046,-60.576,103.64,0,0,0,0 +no_defs",
      "EPSG:4208":
        "+proj=longlat +ellps=intl +towgs84=-151.99,287.04,-147.45,0,0,0,0 +no_defs",
      "EPSG:4209":
        "+proj=longlat +a=6378249.145 +b=6356514.966398753 +towgs84=-143,-90,-294,0,0,0,0 +no_defs",
      "EPSG:4210":
        "+proj=longlat +ellps=clrk80 +towgs84=-160,-6,-302,0,0,0,0 +no_defs",
      "EPSG:4211":
        "+proj=longlat +ellps=bessel +towgs84=-377,681,-50,0,0,0,0 +no_defs",
      "EPSG:4212":
        "+proj=longlat +ellps=clrk80 +towgs84=31.95,300.99,419.19,0,0,0,0 +no_defs",
      "EPSG:4213":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-106,-87,188,0,0,0,0 +no_defs",
      "EPSG:4214":
        "+proj=longlat +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +no_defs",
      "EPSG:4215": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4216":
        "+proj=longlat +ellps=clrk66 +towgs84=-73,213,296,0,0,0,0 +no_defs",
      "EPSG:4217":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4218":
        "+proj=longlat +ellps=intl +towgs84=307,304,-318,0,0,0,0 +no_defs",
      "EPSG:4219":
        "+proj=longlat +ellps=bessel +towgs84=-384,664,-48,0,0,0,0 +no_defs",
      "EPSG:4220":
        "+proj=longlat +ellps=clrk80 +towgs84=-50.9,-347.6,-231,0,0,0,0 +no_defs",
      "EPSG:4221":
        "+proj=longlat +ellps=intl +towgs84=-148,136,90,0,0,0,0 +no_defs",
      "EPSG:4222":
        "+proj=longlat +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +no_defs",
      "EPSG:4223": "+proj=longlat +datum=carthage +no_defs",
      "EPSG:4224":
        "+proj=longlat +ellps=intl +towgs84=-134,229,-29,0,0,0,0 +no_defs",
      "EPSG:4225":
        "+proj=longlat +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +no_defs",
      "EPSG:4226": "+proj=longlat +a=6378249.2 +b=6356515 +no_defs",
      "EPSG:4227":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-190.421,8.532,238.69,0,0,0,0 +no_defs",
      "EPSG:4228": "+proj=longlat +a=6378249.2 +b=6356515 +no_defs",
      "EPSG:4229":
        "+proj=longlat +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +no_defs",
      "EPSG:4230":
        "+proj=longlat +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +no_defs",
      "EPSG:4231":
        "+proj=longlat +ellps=intl +towgs84=-83.11,-97.38,-117.22,0.00569291,-0.0446976,0.0442851,0.1218 +no_defs",
      "EPSG:4232":
        "+proj=longlat +ellps=clrk80 +towgs84=-346,-1,224,0,0,0,0 +no_defs",
      "EPSG:4233":
        "+proj=longlat +ellps=intl +towgs84=-133,-321,50,0,0,0,0 +no_defs",
      "EPSG:4234": "+proj=longlat +a=6378249.2 +b=6356515 +no_defs",
      "EPSG:4235": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4236":
        "+proj=longlat +ellps=intl +towgs84=-637,-549,-203,0,0,0,0 +no_defs",
      "EPSG:4237":
        "+proj=longlat +ellps=GRS67 +towgs84=52.17,-71.82,-14.9,0,0,0,0 +no_defs",
      "EPSG:4238":
        "+proj=longlat +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +no_defs",
      "EPSG:4239":
        "+proj=longlat +a=6377276.345 +b=6356075.41314024 +towgs84=217,823,299,0,0,0,0 +no_defs",
      "EPSG:4240":
        "+proj=longlat +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +no_defs",
      "EPSG:4241":
        "+proj=longlat +a=6378249.144808011 +b=6356514.966204134 +no_defs",
      "EPSG:4242":
        "+proj=longlat +ellps=clrk66 +towgs84=70,207,389.5,0,0,0,0 +no_defs",
      "EPSG:4243":
        "+proj=longlat +a=6377299.36559538 +b=6356098.359005156 +no_defs",
      "EPSG:4244":
        "+proj=longlat +a=6377276.345 +b=6356075.41314024 +towgs84=-97,787,86,0,0,0,0 +no_defs",
      "EPSG:4245":
        "+proj=longlat +a=6377304.063 +b=6356103.038993155 +towgs84=-11,851,5,0,0,0,0 +no_defs",
      "EPSG:4246":
        "+proj=longlat +ellps=clrk80 +towgs84=-294.7,-200.1,525.5,0,0,0,0 +no_defs",
      "EPSG:4247":
        "+proj=longlat +ellps=intl +towgs84=-273.5,110.6,-357.9,0,0,0,0 +no_defs",
      "EPSG:4248":
        "+proj=longlat +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +no_defs",
      "EPSG:4249": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4250":
        "+proj=longlat +ellps=clrk80 +towgs84=-130,29,364,0,0,0,0 +no_defs",
      "EPSG:4251":
        "+proj=longlat +ellps=clrk80 +towgs84=-90,40,88,0,0,0,0 +no_defs",
      "EPSG:4252": "+proj=longlat +a=6378249.2 +b=6356515 +no_defs",
      "EPSG:4253":
        "+proj=longlat +ellps=clrk66 +towgs84=-133,-77,-51,0,0,0,0 +no_defs",
      "EPSG:4254":
        "+proj=longlat +ellps=intl +towgs84=16,196,93,0,0,0,0 +no_defs",
      "EPSG:4255":
        "+proj=longlat +ellps=intl +towgs84=-333,-222,114,0,0,0,0 +no_defs",
      "EPSG:4256":
        "+proj=longlat +ellps=clrk80 +towgs84=41,-220,-134,0,0,0,0 +no_defs",
      "EPSG:4257":
        "+proj=longlat +ellps=bessel +towgs84=-587.8,519.75,145.76,0,0,0,0 +no_defs",
      "EPSG:4258": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4259":
        "+proj=longlat +ellps=intl +towgs84=-254.1,-5.36,-100.29,0,0,0,0 +no_defs",
      "EPSG:4260":
        "+proj=longlat +ellps=clrk80 +towgs84=-70.9,-151.8,-41.4,0,0,0,0 +no_defs",
      "EPSG:4261":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +no_defs",
      "EPSG:4262":
        "+proj=longlat +ellps=bessel +towgs84=639,405,60,0,0,0,0 +no_defs",
      "EPSG:4263":
        "+proj=longlat +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +no_defs",
      "EPSG:4264":
        "+proj=longlat +ellps=intl +towgs84=-252.95,-4.11,-96.38,0,0,0,0 +no_defs",
      "EPSG:4265":
        "+proj=longlat +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +no_defs",
      "EPSG:4266":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-74,-130,42,0,0,0,0 +no_defs",
      "EPSG:4267": "+proj=longlat +datum=NAD27 +no_defs",
      "EPSG:4268":
        "+proj=longlat +a=6378450.047548896 +b=6356826.621488444 +no_defs",
      "EPSG:4269": "+proj=longlat +datum=NAD83 +no_defs",
      "EPSG:4270":
        "+proj=longlat +ellps=clrk80 +towgs84=-243,-192,477,0,0,0,0 +no_defs",
      "EPSG:4271":
        "+proj=longlat +ellps=intl +towgs84=-10,375,165,0,0,0,0 +no_defs",
      "EPSG:4272": "+proj=longlat +datum=nzgd49 +no_defs",
      "EPSG:4273":
        "+proj=longlat +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +no_defs",
      "EPSG:4274":
        "+proj=longlat +ellps=intl +towgs84=-223.237,110.193,36.649,0,0,0,0 +no_defs",
      "EPSG:4275":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +no_defs",
      "EPSG:4276": "+proj=longlat +ellps=WGS66 +no_defs",
      "EPSG:4277": "+proj=longlat +datum=OSGB36 +no_defs",
      "EPSG:4278": "+proj=longlat +ellps=airy +no_defs",
      "EPSG:4279": "+proj=longlat +ellps=airy +no_defs",
      "EPSG:4280": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:4281":
        "+proj=longlat +a=6378300.789 +b=6356566.435 +towgs84=-275.722,94.7824,340.894,-8.001,-4.42,-11.821,1 +no_defs",
      "EPSG:4282":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-148,51,-291,0,0,0,0 +no_defs",
      "EPSG:4283": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4284":
        "+proj=longlat +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +no_defs",
      "EPSG:4285":
        "+proj=longlat +ellps=intl +towgs84=-128.16,-282.42,21.93,0,0,0,0 +no_defs",
      "EPSG:4286": "+proj=longlat +ellps=helmert +no_defs",
      "EPSG:4287":
        "+proj=longlat +ellps=intl +towgs84=164,138,-189,0,0,0,0 +no_defs",
      "EPSG:4288": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4289":
        "+proj=longlat +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +no_defs",
      "EPSG:4291":
        "+proj=longlat +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +no_defs",
      "EPSG:4292":
        "+proj=longlat +ellps=intl +towgs84=-355,21,72,0,0,0,0 +no_defs",
      "EPSG:4293":
        "+proj=longlat +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +no_defs",
      "EPSG:4294":
        "+proj=longlat +ellps=bessel +towgs84=-403,684,41,0,0,0,0 +no_defs",
      "EPSG:4295": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:4296": "+proj=longlat +a=6378249.2 +b=6356515 +no_defs",
      "EPSG:4297":
        "+proj=longlat +ellps=intl +towgs84=-189,-242,-91,0,0,0,0 +no_defs",
      "EPSG:4298":
        "+proj=longlat +ellps=evrstSS +towgs84=-533.4,669.2,-52.5,0,0,4.28,9.4 +no_defs",
      "EPSG:4299": "+proj=longlat +datum=ire65 +no_defs",
      "EPSG:4300":
        "+proj=longlat +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +no_defs",
      "EPSG:4301":
        "+proj=longlat +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +no_defs",
      "EPSG:4302":
        "+proj=longlat +a=6378293.645208759 +b=6356617.987679838 +towgs84=-61.702,284.488,472.052,0,0,0,0 +no_defs",
      "EPSG:4303": "+proj=longlat +ellps=helmert +no_defs",
      "EPSG:4304":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-73,-247,227,0,0,0,0 +no_defs",
      "EPSG:4306": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:4307":
        "+proj=longlat +ellps=clrk80 +towgs84=-186,-93,310,0,0,0,0 +no_defs",
      "EPSG:4308": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:4309":
        "+proj=longlat +ellps=intl +towgs84=-155,171,37,0,0,0,0 +no_defs",
      "EPSG:4310": "+proj=longlat +a=6378249.2 +b=6356515 +no_defs",
      "EPSG:4311":
        "+proj=longlat +ellps=intl +towgs84=-265,120,-358,0,0,0,0 +no_defs",
      "EPSG:4312": "+proj=longlat +datum=hermannskogel +no_defs",
      "EPSG:4313":
        "+proj=longlat +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +no_defs",
      "EPSG:4314": "+proj=longlat +datum=potsdam +no_defs",
      "EPSG:4315":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-23,259,-9,0,0,0,0 +no_defs",
      "EPSG:4316":
        "+proj=longlat +ellps=intl +towgs84=103.25,-100.4,-307.19,0,0,0,0 +no_defs",
      "EPSG:4317":
        "+proj=longlat +ellps=krass +towgs84=28,-121,-77,0,0,0,0 +no_defs",
      "EPSG:4318":
        "+proj=longlat +ellps=WGS84 +towgs84=-3.2,-5.7,2.8,0,0,0,0 +no_defs",
      "EPSG:4319":
        "+proj=longlat +ellps=GRS80 +towgs84=-20.8,11.3,2.4,0,0,0,0 +no_defs",
      "EPSG:4322":
        "+proj=longlat +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +no_defs",
      "EPSG:4324":
        "+proj=longlat +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +no_defs",
      "EPSG:4326": "+proj=longlat +datum=WGS84 +no_defs",
      "EPSG:4327": "+proj=longlat +datum=WGS84 +no_defs",
      "EPSG:4328": "+proj=geocent +datum=WGS84 +units=m +no_defs",
      "EPSG:4329": "+proj=longlat +datum=WGS84 +no_defs",
      "EPSG:4330": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4331": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4332": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4333": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4334": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4335": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4336": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4337": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4338": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4339": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4340": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4341": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4342": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4343": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4344": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4345": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4346": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4347": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4348": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4349": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4350": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4351": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4352": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4353": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4354": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4355": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4356": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4357": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4358": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4359": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4360": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4361": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4362": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4363": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4364": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4365": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4366": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4367": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4368": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4369": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4370": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4371": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4372": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4373": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4374": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4375": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4376": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4377": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4378": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4379": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4380": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4381": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4382": "+proj=geocent +ellps=intl +units=m +no_defs",
      "EPSG:4383": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:4384": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4385": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4386": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4387": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4388": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4389": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4390":
        "+proj=cass +lat_0=2.04258333333333 +lon_0=103.562758333333 +x_0=0 +y_0=0 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:4391":
        "+proj=cass +lat_0=2.71228333333333 +lon_0=101.941166666667 +x_0=-242.005 +y_0=-948.547 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:4392":
        "+proj=cass +lat_0=3.71097222222222 +lon_0=102.436177777778 +x_0=0 +y_0=0 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:4393":
        "+proj=cass +lat_0=3.68034444444444 +lon_0=101.508244444444 +x_0=-21759.438 +y_0=55960.906 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:4394":
        "+proj=cass +lat_0=4.94614166666667 +lon_0=102.895208333333 +x_0=0 +y_0=0 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:4395":
        "+proj=cass +lat_0=5.421325 +lon_0=100.345869444444 +x_0=0 +y_0=0 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:4396":
        "+proj=cass +lat_0=5.96514722222222 +lon_0=100.637594444444 +x_0=0 +y_0=0 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:4397":
        "+proj=cass +lat_0=4.85938055555556 +lon_0=100.816766666667 +x_0=0 +y_0=133453.669 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:4398":
        "+proj=cass +lat_0=5.89392222222222 +lon_0=102.177291666667 +x_0=0 +y_0=0 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:4399":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4400":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4401":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4402":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4403":
        "+proj=tmerc +lat_0=0 +lon_0=-165 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4404":
        "+proj=tmerc +lat_0=0 +lon_0=-159 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4405":
        "+proj=tmerc +lat_0=0 +lon_0=-153 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4406":
        "+proj=tmerc +lat_0=0 +lon_0=-147 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4407":
        "+proj=tmerc +lat_0=0 +lon_0=-141 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4408":
        "+proj=tmerc +lat_0=0 +lon_0=-135 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4409":
        "+proj=tmerc +lat_0=0 +lon_0=-129 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4410":
        "+proj=tmerc +lat_0=0 +lon_0=-123 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4411":
        "+proj=tmerc +lat_0=0 +lon_0=-117 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4412":
        "+proj=tmerc +lat_0=0 +lon_0=-111 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4413":
        "+proj=tmerc +lat_0=0 +lon_0=-105 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4414":
        "+proj=tmerc +lat_0=13.5 +lon_0=144.75 +k=1 +x_0=100000 +y_0=200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4415":
        "+proj=lcc +lat_1=-6.5 +lat_2=-11.5 +lat_0=-9 +lon_0=26 +x_0=500000 +y_0=500000 +ellps=clrk66 +towgs84=-103.746,-9.614,-255.95,0,0,0,0 +units=m +no_defs",
      "EPSG:4417":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:4418":
        "+proj=tmerc +lat_0=0 +lon_0=-75 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4419":
        "+proj=tmerc +lat_0=0 +lon_0=-69 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4420":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4421":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4422":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4423":
        "+proj=tmerc +lat_0=0 +lon_0=-165 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4424":
        "+proj=tmerc +lat_0=0 +lon_0=-159 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4425":
        "+proj=tmerc +lat_0=0 +lon_0=-153 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4426":
        "+proj=tmerc +lat_0=0 +lon_0=-147 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4427":
        "+proj=tmerc +lat_0=0 +lon_0=-141 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4428":
        "+proj=tmerc +lat_0=0 +lon_0=-135 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4429":
        "+proj=tmerc +lat_0=0 +lon_0=-129 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4430":
        "+proj=tmerc +lat_0=0 +lon_0=-123 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4431":
        "+proj=tmerc +lat_0=0 +lon_0=-117 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4432":
        "+proj=tmerc +lat_0=0 +lon_0=-111 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4433":
        "+proj=tmerc +lat_0=0 +lon_0=-105 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4434":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=8500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78,0,0,0,0 +units=m +no_defs",
      "EPSG:4437":
        "+proj=lcc +lat_1=18.43333333333333 +lat_2=18.03333333333333 +lat_0=17.83333333333333 +lon_0=-66.43333333333334 +x_0=200000 +y_0=200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4438":
        "+proj=tmerc +lat_0=0 +lon_0=-75 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4439":
        "+proj=tmerc +lat_0=0 +lon_0=-69 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4440": "+geoidgrids=nz_linz_nzgeoid2009.tif +vunits=m +no_defs",
      "EPSG:4455":
        "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4456":
        "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.5 +lon_0=-74 +x_0=609601.2192024384 +y_0=30480.06096012192 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:4457":
        "+proj=lcc +lat_1=45.68333333333333 +lat_2=44.41666666666666 +lat_0=43.83333333333334 +lon_0=-100 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:4458": "+vunits=m +no_defs",
      "EPSG:4462":
        "+proj=lcc +lat_1=-18 +lat_2=-36 +lat_0=-27 +lon_0=132 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:4463": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4465": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4466": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4467":
        "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4468": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4469": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4470": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4471":
        "+proj=utm +zone=38 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4472":
        "+proj=longlat +ellps=intl +towgs84=-381.788,-57.501,-256.673,0,0,0,0 +no_defs",
      "EPSG:4473": "+proj=geocent +ellps=intl +units=m +no_defs",
      "EPSG:4474":
        "+proj=utm +zone=38 +south +ellps=intl +towgs84=-382,-59,-262,0,0,0,0 +units=m +no_defs",
      "EPSG:4475":
        "+proj=longlat +ellps=intl +towgs84=-381.788,-57.501,-256.673,0,0,0,0 +no_defs",
      "EPSG:4479": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4480": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4481": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4482": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4483": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4484":
        "+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4485":
        "+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4486":
        "+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4487":
        "+proj=utm +zone=14 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4488":
        "+proj=utm +zone=15 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4489":
        "+proj=utm +zone=16 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4490": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4491":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=13500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4492":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=14500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4493":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=15500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4494":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=16500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4495":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=17500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4496":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4497":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4498":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=20500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4499":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=21500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4500":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=22500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4501":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=23500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4502":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4503":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4504":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4505":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4506":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4507":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4508":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4509":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4510":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4511":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4512":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4513":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4514":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4515":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4516":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4517":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4518":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4519":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4520":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4521":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4522":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4523":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4524":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4525":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4526":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4527":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4528":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4529":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4530":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4531":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4532":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4533":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4534":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4535":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4536":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4537":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4538":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4539":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4540":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4541":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4542":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4543":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4544":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4545":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4546":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4547":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4548":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4549":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4550":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4551":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4552":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4553":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4554":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:4555": "+proj=longlat +ellps=krass +no_defs",
      "EPSG:4556": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4557": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4558": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4559":
        "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4568":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=13500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4569":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=14500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4570":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=15500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4571":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=16500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4572":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=17500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4573":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4574":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4575":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=20500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4576":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=21500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4577":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=22500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4578":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=23500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4579":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4580":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4581":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4582":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4583":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4584":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4585":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4586":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4587":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4588":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4589":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4600": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4601":
        "+proj=longlat +ellps=clrk80 +towgs84=-255,-15,71,0,0,0,0 +no_defs",
      "EPSG:4602":
        "+proj=longlat +ellps=clrk80 +towgs84=725,685,536,0,0,0,0 +no_defs",
      "EPSG:4603":
        "+proj=longlat +ellps=clrk80 +towgs84=72,213.7,93,0,0,0,0 +no_defs",
      "EPSG:4604":
        "+proj=longlat +ellps=clrk80 +towgs84=174,359,365,0,0,0,0 +no_defs",
      "EPSG:4605":
        "+proj=longlat +ellps=clrk80 +towgs84=9,183,236,0,0,0,0 +no_defs",
      "EPSG:4606":
        "+proj=longlat +ellps=clrk80 +towgs84=-149,128,296,0,0,0,0 +no_defs",
      "EPSG:4607":
        "+proj=longlat +ellps=clrk80 +towgs84=195.671,332.517,274.607,0,0,0,0 +no_defs",
      "EPSG:4608": "+proj=longlat +ellps=clrk66 +no_defs",
      "EPSG:4609": "+proj=longlat +ellps=clrk66 +no_defs",
      "EPSG:4610": "+proj=longlat +a=6378140 +b=6356755.288157528 +no_defs",
      "EPSG:4611":
        "+proj=longlat +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +no_defs",
      "EPSG:4612": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4613":
        "+proj=longlat +ellps=bessel +towgs84=-403,684,41,0,0,0,0 +no_defs",
      "EPSG:4614":
        "+proj=longlat +ellps=intl +towgs84=-119.425,-303.659,-11.0006,1.1643,0.174458,1.09626,3.65706 +no_defs",
      "EPSG:4615":
        "+proj=longlat +ellps=intl +towgs84=-499,-249,314,0,0,0,0 +no_defs",
      "EPSG:4616":
        "+proj=longlat +ellps=intl +towgs84=-289,-124,60,0,0,0,0 +no_defs",
      "EPSG:4617": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4618":
        "+proj=longlat +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +no_defs",
      "EPSG:4619": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4620":
        "+proj=longlat +ellps=clrk80 +towgs84=-106,-129,165,0,0,0,0 +no_defs",
      "EPSG:4621":
        "+proj=longlat +ellps=intl +towgs84=137,248,-430,0,0,0,0 +no_defs",
      "EPSG:4622":
        "+proj=longlat +ellps=intl +towgs84=-467,-16,-300,0,0,0,0 +no_defs",
      "EPSG:4623":
        "+proj=longlat +ellps=intl +towgs84=-186,230,110,0,0,0,0 +no_defs",
      "EPSG:4624": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4625":
        "+proj=longlat +ellps=intl +towgs84=186,482,151,0,0,0,0 +no_defs",
      "EPSG:4626":
        "+proj=longlat +ellps=intl +towgs84=94,-948,-1262,0,0,0,0 +no_defs",
      "EPSG:4627": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4628":
        "+proj=longlat +ellps=intl +towgs84=162,117,154,0,0,0,0 +no_defs",
      "EPSG:4629":
        "+proj=longlat +ellps=intl +towgs84=72.438,345.918,79.486,1.6045,0.8823,0.5565,1.3746 +no_defs",
      "EPSG:4630":
        "+proj=longlat +ellps=intl +towgs84=84,274,65,0,0,0,0 +no_defs",
      "EPSG:4631":
        "+proj=longlat +ellps=intl +towgs84=145,-187,103,0,0,0,0 +no_defs",
      "EPSG:4632":
        "+proj=longlat +ellps=intl +towgs84=-382,-59,-262,0,0,0,0 +no_defs",
      "EPSG:4633":
        "+proj=longlat +ellps=intl +towgs84=335.47,222.58,-230.94,0,0,0,0 +no_defs",
      "EPSG:4634":
        "+proj=longlat +ellps=intl +towgs84=-13,-348,292,0,0,0,0 +no_defs",
      "EPSG:4635":
        "+proj=longlat +ellps=intl +towgs84=-122.383,-188.696,103.344,3.5107,-4.9668,-5.7047,4.4798 +no_defs",
      "EPSG:4636":
        "+proj=longlat +ellps=intl +towgs84=365,194,166,0,0,0,0 +no_defs",
      "EPSG:4637":
        "+proj=longlat +ellps=intl +towgs84=325,154,172,0,0,0,0 +no_defs",
      "EPSG:4638":
        "+proj=longlat +ellps=clrk66 +towgs84=30,430,368,0,0,0,0 +no_defs",
      "EPSG:4639":
        "+proj=longlat +ellps=intl +towgs84=253,-132,-127,0,0,0,0 +no_defs",
      "EPSG:4640": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4641":
        "+proj=longlat +ellps=intl +towgs84=287.58,177.78,-135.41,0,0,0,0 +no_defs",
      "EPSG:4642":
        "+proj=longlat +ellps=intl +towgs84=-13,-348,292,0,0,0,0 +no_defs",
      "EPSG:4643":
        "+proj=longlat +ellps=intl +towgs84=-480.26,-438.32,-643.429,16.3119,20.1721,-4.0349,-111.7 +no_defs",
      "EPSG:4644":
        "+proj=longlat +ellps=intl +towgs84=-10.18,-350.43,291.37,0,0,0,0 +no_defs",
      "EPSG:4645": "+proj=longlat +ellps=intl +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4646":
        "+proj=longlat +ellps=intl +towgs84=-963,510,-359,0,0,0,0 +no_defs",
      "EPSG:4647":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=32500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4652":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4653":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4654":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4655":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4656":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4657":
        "+proj=longlat +a=6377019.27 +b=6355762.5391 +towgs84=-28,199,5,0,0,0,0 +no_defs",
      "EPSG:4658":
        "+proj=longlat +ellps=intl +towgs84=-73,46,-86,0,0,0,0 +no_defs",
      "EPSG:4659": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4660":
        "+proj=longlat +ellps=intl +towgs84=982.609,552.753,-540.873,6.68163,-31.6115,-19.8482,16.805 +no_defs",
      "EPSG:4661": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4662":
        "+proj=longlat +ellps=intl +towgs84=-11.64,-348.6,291.98,0,0,0,0 +no_defs",
      "EPSG:4663":
        "+proj=longlat +ellps=intl +towgs84=-502.862,-247.438,312.724,0,0,0,0 +no_defs",
      "EPSG:4664":
        "+proj=longlat +ellps=intl +towgs84=-204.619,140.176,55.226,0,0,0,0 +no_defs",
      "EPSG:4665":
        "+proj=longlat +ellps=intl +towgs84=-106.226,166.366,-37.893,0,0,0,0 +no_defs",
      "EPSG:4666":
        "+proj=longlat +ellps=bessel +towgs84=508.088,-191.042,565.223,0,0,0,0 +no_defs",
      "EPSG:4667": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4668":
        "+proj=longlat +ellps=intl +towgs84=-86,-98,-119,0,0,0,0 +no_defs",
      "EPSG:4669": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4670": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4671": "+proj=longlat +a=6378249.2 +b=6356515 +no_defs",
      "EPSG:4672":
        "+proj=longlat +ellps=intl +towgs84=175,-38,113,0,0,0,0 +no_defs",
      "EPSG:4673":
        "+proj=longlat +ellps=intl +towgs84=174.05,-25.49,112.57,-0,-0,0.554,0.2263 +no_defs",
      "EPSG:4674": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4675":
        "+proj=longlat +ellps=clrk66 +towgs84=-100,-248,259,0,0,0,0 +no_defs",
      "EPSG:4676": "+proj=longlat +ellps=krass +no_defs",
      "EPSG:4677": "+proj=longlat +ellps=krass +no_defs",
      "EPSG:4678":
        "+proj=longlat +ellps=krass +towgs84=44.585,-131.212,-39.544,0,0,0,0 +no_defs",
      "EPSG:4679":
        "+proj=longlat +ellps=clrk80 +towgs84=-80.01,253.26,291.19,0,0,0,0 +no_defs",
      "EPSG:4680":
        "+proj=longlat +ellps=clrk80 +towgs84=124.5,-63.5,-281,0,0,0,0 +no_defs",
      "EPSG:4681": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4682":
        "+proj=longlat +a=6377276.345 +b=6356075.41314024 +towgs84=283.7,735.9,261.1,0,0,0,0 +no_defs",
      "EPSG:4683":
        "+proj=longlat +ellps=clrk66 +towgs84=-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06 +no_defs",
      "EPSG:4684":
        "+proj=longlat +ellps=intl +towgs84=-133,-321,50,0,0,0,0 +no_defs",
      "EPSG:4685": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4686": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4687":
        "+proj=longlat +ellps=GRS80 +towgs84=0.072,-0.507,-0.245,-0.0183,0.0003,-0.007,-0.0093 +no_defs",
      "EPSG:4688":
        "+proj=longlat +ellps=intl +towgs84=347.103,1078.12,2623.92,-33.8875,70.6773,-9.3943,186.074 +no_defs",
      "EPSG:4689":
        "+proj=longlat +ellps=intl +towgs84=410.721,55.049,80.746,2.5779,2.3514,0.6664,17.3311 +no_defs",
      "EPSG:4690":
        "+proj=longlat +ellps=intl +towgs84=221.525,152.948,176.768,-2.3847,-1.3896,-0.877,11.4741 +no_defs",
      "EPSG:4691":
        "+proj=longlat +ellps=intl +towgs84=215.525,149.593,176.229,-3.2624,-1.692,-1.1571,10.4773 +no_defs",
      "EPSG:4692":
        "+proj=longlat +ellps=intl +towgs84=217.037,86.959,23.956,0,0,0,0 +no_defs",
      "EPSG:4693":
        "+proj=longlat +ellps=WGS84 +towgs84=0,-0.15,0.68,0,0,0,0 +no_defs",
      "EPSG:4694": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4695":
        "+proj=longlat +ellps=clrk66 +towgs84=-103.746,-9.614,-255.95,0,0,0,0 +no_defs",
      "EPSG:4696": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4697": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4698":
        "+proj=longlat +ellps=intl +towgs84=145,-187,103,0,0,0,0 +no_defs",
      "EPSG:4699":
        "+proj=longlat +ellps=clrk80 +towgs84=-770.1,158.4,-498.2,0,0,0,0 +no_defs",
      "EPSG:4700": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4701":
        "+proj=longlat +ellps=clrk80 +towgs84=-79.9,-158,-168.9,0,0,0,0 +no_defs",
      "EPSG:4702": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4703": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4704": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4705": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4706":
        "+proj=longlat +ellps=helmert +towgs84=-146.21,112.63,4.05,0,0,0,0 +no_defs",
      "EPSG:4707":
        "+proj=longlat +ellps=intl +towgs84=114,-116,-333,0,0,0,0 +no_defs",
      "EPSG:4708":
        "+proj=longlat +ellps=aust_SA +towgs84=-491,-22,435,0,0,0,0 +no_defs",
      "EPSG:4709":
        "+proj=longlat +ellps=intl +towgs84=145,75,-272,0,0,0,0 +no_defs",
      "EPSG:4710":
        "+proj=longlat +ellps=intl +towgs84=-320,550,-494,0,0,0,0 +no_defs",
      "EPSG:4711":
        "+proj=longlat +ellps=intl +towgs84=124,-234,-25,0,0,0,0 +no_defs",
      "EPSG:4712":
        "+proj=longlat +ellps=intl +towgs84=-205,107,53,0,0,0,0 +no_defs",
      "EPSG:4713":
        "+proj=longlat +ellps=clrk80 +towgs84=-79,-129,145,0,0,0,0 +no_defs",
      "EPSG:4714":
        "+proj=longlat +ellps=intl +towgs84=-127,-769,472,0,0,0,0 +no_defs",
      "EPSG:4715":
        "+proj=longlat +ellps=intl +towgs84=-104,-129,239,0,0,0,0 +no_defs",
      "EPSG:4716":
        "+proj=longlat +ellps=intl +towgs84=298,-304,-375,0,0,0,0 +no_defs",
      "EPSG:4717":
        "+proj=longlat +ellps=clrk66 +towgs84=-2,151,181,0,0,0,0 +no_defs",
      "EPSG:4718":
        "+proj=longlat +ellps=intl +towgs84=252,-209,-751,0,0,0,0 +no_defs",
      "EPSG:4719":
        "+proj=longlat +ellps=intl +towgs84=211,147,111,0,0,0,0 +no_defs",
      "EPSG:4720":
        "+proj=longlat +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +no_defs",
      "EPSG:4721":
        "+proj=longlat +ellps=intl +towgs84=265.025,384.929,-194.046,0,0,0,0 +no_defs",
      "EPSG:4722":
        "+proj=longlat +ellps=intl +towgs84=-794,119,-298,0,0,0,0 +no_defs",
      "EPSG:4723":
        "+proj=longlat +ellps=clrk66 +towgs84=67.8,106.1,138.8,0,0,0,0 +no_defs",
      "EPSG:4724":
        "+proj=longlat +ellps=intl +towgs84=208,-435,-229,0,0,0,0 +no_defs",
      "EPSG:4725":
        "+proj=longlat +ellps=intl +towgs84=189,-79,-202,0,0,0,0 +no_defs",
      "EPSG:4726":
        "+proj=longlat +ellps=clrk66 +towgs84=42,124,147,0,0,0,0 +no_defs",
      "EPSG:4727":
        "+proj=longlat +ellps=intl +towgs84=403,-81,277,0,0,0,0 +no_defs",
      "EPSG:4728":
        "+proj=longlat +ellps=intl +towgs84=-307,-92,127,0,0,0,0 +no_defs",
      "EPSG:4729":
        "+proj=longlat +ellps=intl +towgs84=185,165,42,0,0,0,0 +no_defs",
      "EPSG:4730":
        "+proj=longlat +ellps=intl +towgs84=170,42,84,0,0,0,0 +no_defs",
      "EPSG:4731":
        "+proj=longlat +ellps=clrk80 +towgs84=51,391,-36,0,0,0,0 +no_defs",
      "EPSG:4732":
        "+proj=longlat +a=6378270 +b=6356794.343434343 +towgs84=102,52,-38,0,0,0,0 +no_defs",
      "EPSG:4733":
        "+proj=longlat +ellps=intl +towgs84=276,-57,149,0,0,0,0 +no_defs",
      "EPSG:4734":
        "+proj=longlat +ellps=intl +towgs84=-632,438,-609,0,0,0,0 +no_defs",
      "EPSG:4735":
        "+proj=longlat +ellps=intl +towgs84=647,1777,-1124,0,0,0,0 +no_defs",
      "EPSG:4736":
        "+proj=longlat +ellps=clrk80 +towgs84=260,12,-147,0,0,0,0 +no_defs",
      "EPSG:4737": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4738":
        "+proj=longlat +a=6378293.645208759 +b=6356617.987679838 +no_defs",
      "EPSG:4739":
        "+proj=longlat +ellps=intl +towgs84=-156,-271,-189,0,0,0,0 +no_defs",
      "EPSG:4740":
        "+proj=longlat +a=6378136 +b=6356751.361745712 +towgs84=0,0,1.5,-0,-0,0.076,0 +no_defs",
      "EPSG:4741": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4742": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4743":
        "+proj=longlat +ellps=clrk80 +towgs84=70.995,-335.916,262.898,0,0,0,0 +no_defs",
      "EPSG:4744": "+proj=longlat +ellps=clrk80 +no_defs",
      "EPSG:4745": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:4746": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:4747": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4748":
        "+proj=longlat +a=6378306.3696 +b=6356571.996 +towgs84=51,391,-36,0,0,0,0 +no_defs",
      "EPSG:4749": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4750":
        "+proj=longlat +ellps=WGS84 +towgs84=-56.263,16.136,-22.856,0,0,0,0 +no_defs",
      "EPSG:4751": "+proj=longlat +a=6377295.664 +b=6356094.667915204 +no_defs",
      "EPSG:4752":
        "+proj=longlat +a=6378306.3696 +b=6356571.996 +towgs84=51,391,-36,0,0,0,0 +no_defs",
      "EPSG:4753": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4754":
        "+proj=longlat +ellps=intl +towgs84=-208.406,-109.878,-2.5764,0,0,0,0 +no_defs",
      "EPSG:4755": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4756":
        "+proj=longlat +ellps=WGS84 +towgs84=-192.873,-39.382,-111.202,-0.00205,-0.0005,0.00335,0.0188 +no_defs",
      "EPSG:4757": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:4758": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4759": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4760": "+proj=longlat +ellps=WGS66 +no_defs",
      "EPSG:4761": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4762": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4763": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4764": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4765": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4766":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4767":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4768":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4769":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4770":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4771":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4772":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4773":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4774":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4775":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4776":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4777":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4778":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4779":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4780":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4781":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4782":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4783":
        "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4784":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4785":
        "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4786":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4787":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4788":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4789":
        "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4790":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4791":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4792":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4793":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4794":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4795":
        "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4796":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4797":
        "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4798":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4799":
        "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4800":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4801":
        "+proj=longlat +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +pm=bern +no_defs",
      "EPSG:4802":
        "+proj=longlat +ellps=intl +towgs84=307,304,-318,0,0,0,0 +pm=bogota +no_defs",
      "EPSG:4803":
        "+proj=longlat +ellps=intl +towgs84=-304.046,-60.576,103.64,0,0,0,0 +pm=lisbon +no_defs",
      "EPSG:4804":
        "+proj=longlat +ellps=bessel +towgs84=-587.8,519.75,145.76,0,0,0,0 +pm=jakarta +no_defs",
      "EPSG:4805":
        "+proj=longlat +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +no_defs",
      "EPSG:4806":
        "+proj=longlat +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +pm=rome +no_defs",
      "EPSG:4807":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +no_defs",
      "EPSG:4808": "+proj=longlat +ellps=bessel +pm=jakarta +no_defs",
      "EPSG:4809": "+proj=longlat +ellps=intl +pm=brussels +no_defs",
      "EPSG:4810":
        "+proj=longlat +ellps=intl +towgs84=-189,-242,-91,0,0,0,0 +pm=paris +no_defs",
      "EPSG:4811":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-73,-247,227,0,0,0,0 +pm=paris +no_defs",
      "EPSG:4812":
        "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4813":
        "+proj=longlat +ellps=bessel +towgs84=-377,681,-50,0,0,0,0 +pm=jakarta +no_defs",
      "EPSG:4814": "+proj=longlat +ellps=bessel +pm=stockholm +no_defs",
      "EPSG:4815": "+proj=longlat +ellps=bessel +pm=athens +no_defs",
      "EPSG:4816":
        "+proj=longlat +a=6378249.2 +b=6356515 +towgs84=-263,6,431,0,0,0,0 +pm=paris +no_defs",
      "EPSG:4817":
        "+proj=longlat +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +no_defs",
      "EPSG:4818":
        "+proj=longlat +ellps=bessel +towgs84=589,76,480,0,0,0,0 +pm=ferro +no_defs",
      "EPSG:4819":
        "+proj=longlat +ellps=clrk80 +towgs84=-186,-93,310,0,0,0,0 +pm=paris +no_defs",
      "EPSG:4820":
        "+proj=longlat +ellps=bessel +towgs84=-403,684,41,0,0,0,0 +pm=jakarta +no_defs",
      "EPSG:4821": "+proj=longlat +a=6378249.2 +b=6356515 +pm=paris +no_defs",
      "EPSG:4822":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:4823": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4824": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:4826":
        "+proj=lcc +lat_1=15 +lat_2=16.66666666666667 +lat_0=15.83333333333333 +lon_0=-24 +x_0=161587.83 +y_0=128511.202 +datum=WGS84 +units=m +no_defs",
      "EPSG:4839":
        "+proj=lcc +lat_1=48.66666666666666 +lat_2=53.66666666666666 +lat_0=51 +lon_0=10.5 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4855":
        "+proj=tmerc +lat_0=0 +lon_0=5.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4856":
        "+proj=tmerc +lat_0=0 +lon_0=6.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4857":
        "+proj=tmerc +lat_0=0 +lon_0=7.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4858":
        "+proj=tmerc +lat_0=0 +lon_0=8.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4859":
        "+proj=tmerc +lat_0=0 +lon_0=9.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4860":
        "+proj=tmerc +lat_0=0 +lon_0=10.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4861":
        "+proj=tmerc +lat_0=0 +lon_0=11.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4862":
        "+proj=tmerc +lat_0=0 +lon_0=12.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4863":
        "+proj=tmerc +lat_0=0 +lon_0=13.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4864":
        "+proj=tmerc +lat_0=0 +lon_0=14.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4865":
        "+proj=tmerc +lat_0=0 +lon_0=15.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4866":
        "+proj=tmerc +lat_0=0 +lon_0=16.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4867":
        "+proj=tmerc +lat_0=0 +lon_0=17.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4868":
        "+proj=tmerc +lat_0=0 +lon_0=18.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4869":
        "+proj=tmerc +lat_0=0 +lon_0=19.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4870":
        "+proj=tmerc +lat_0=0 +lon_0=20.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4871":
        "+proj=tmerc +lat_0=0 +lon_0=21.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4872":
        "+proj=tmerc +lat_0=0 +lon_0=22.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4873":
        "+proj=tmerc +lat_0=0 +lon_0=23.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4874":
        "+proj=tmerc +lat_0=0 +lon_0=24.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4875":
        "+proj=tmerc +lat_0=0 +lon_0=25.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4876":
        "+proj=tmerc +lat_0=0 +lon_0=26.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4877":
        "+proj=tmerc +lat_0=0 +lon_0=27.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4878":
        "+proj=tmerc +lat_0=0 +lon_0=28.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4879":
        "+proj=tmerc +lat_0=0 +lon_0=29.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4880":
        "+proj=tmerc +lat_0=0 +lon_0=30.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:4882": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4883": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4884": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4885": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4886": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4887": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4888": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4889": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4890": "+proj=geocent +ellps=NWL9D +units=m +no_defs",
      "EPSG:4891": "+proj=longlat +ellps=NWL9D +no_defs",
      "EPSG:4892": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4893": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4894": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4895": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4896": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4897": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4898": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4899": "+proj=geocent +ellps=intl +units=m +no_defs",
      "EPSG:4900":
        "+proj=longlat +ellps=intl +towgs84=-208.4058,-109.8777,-2.5764,0,0,0,0 +no_defs",
      "EPSG:4901":
        "+proj=longlat +a=6376523 +b=6355862.933255573 +pm=2.337208333333333 +no_defs",
      "EPSG:4902":
        "+proj=longlat +a=6376523 +b=6355862.933255573 +pm=paris +no_defs",
      "EPSG:4903":
        "+proj=longlat +a=6378298.3 +b=6356657.142669561 +pm=madrid +no_defs",
      "EPSG:4904":
        "+proj=longlat +ellps=bessel +towgs84=508.088,-191.042,565.223,0,0,0,0 +pm=lisbon +no_defs",
      "EPSG:4906": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4907": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4908": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4909": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4910": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4911": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4912": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4913": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4914": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4915": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4916": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4917": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4918": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4919": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4920": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4921": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4922":
        "+proj=geocent +a=6378136 +rf=298.257839303 +units=m +no_defs",
      "EPSG:4923":
        "+proj=longlat +a=6378136 +rf=298.257839303 +towgs84=0,0,1.5,0,0,0.076,0 +no_defs",
      "EPSG:4924": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4925": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4926": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4927": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4928": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4929": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4930": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4931": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4932": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4933": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4934": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4935": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4936": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4937": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4938": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4939": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4940": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4941": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4942": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4943": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4944": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4945": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4946": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4947": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4948": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4949": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4950": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4951": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4952": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4953": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4954": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4955": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:4956": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4957": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4958": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4959": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4960": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4961": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4962": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4963": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4964": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4965": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4966": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4967": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4968": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4969": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4970": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4971": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4972": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4973": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4974": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4975": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4976": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4977": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4978": "+proj=geocent +datum=WGS84 +units=m +no_defs",
      "EPSG:4979": "+proj=longlat +datum=WGS84 +no_defs",
      "EPSG:4980": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:4981": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4982": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4983": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4984": "+proj=geocent +ellps=WGS72 +units=m +no_defs",
      "EPSG:4985": "+proj=longlat +ellps=WGS72 +no_defs",
      "EPSG:4986": "+proj=geocent +ellps=WGS72 +units=m +no_defs",
      "EPSG:4987":
        "+proj=longlat +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +no_defs",
      "EPSG:4988": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4989": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4990": "+proj=geocent +ellps=krass +units=m +no_defs",
      "EPSG:4991": "+proj=longlat +ellps=krass +no_defs",
      "EPSG:4992": "+proj=geocent +ellps=krass +units=m +no_defs",
      "EPSG:4993":
        "+proj=longlat +ellps=krass +towgs84=44.585,-131.212,-39.544,0,0,0,0 +no_defs",
      "EPSG:4994": "+proj=geocent +ellps=clrk66 +units=m +no_defs",
      "EPSG:4995":
        "+proj=longlat +ellps=clrk66 +towgs84=-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06 +no_defs",
      "EPSG:4996": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4997": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:4998": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:4999": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:5011": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5012": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5013": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5014":
        "+proj=utm +zone=25 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5015":
        "+proj=utm +zone=26 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5016":
        "+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5018":
        "+proj=tmerc +lat_0=39.66666666666666 +lon_0=-8.131906111111112 +k=1 +x_0=0 +y_0=0 +ellps=intl +towgs84=-304.046,-60.576,103.64,0,0,0,0 +units=m +no_defs",
      "EPSG:5041":
        "+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5042":
        "+proj=stere +lat_0=-90 +lat_ts=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5048":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5069":
        "+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:5070":
        "+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:5071":
        "+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5072":
        "+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5105":
        "+proj=tmerc +lat_0=58 +lon_0=5.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5106":
        "+proj=tmerc +lat_0=58 +lon_0=6.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5107":
        "+proj=tmerc +lat_0=58 +lon_0=7.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5108":
        "+proj=tmerc +lat_0=58 +lon_0=8.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5109":
        "+proj=tmerc +lat_0=58 +lon_0=9.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5110":
        "+proj=tmerc +lat_0=58 +lon_0=10.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5111":
        "+proj=tmerc +lat_0=58 +lon_0=11.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5112":
        "+proj=tmerc +lat_0=58 +lon_0=12.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5113":
        "+proj=tmerc +lat_0=58 +lon_0=13.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5114":
        "+proj=tmerc +lat_0=58 +lon_0=14.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5115":
        "+proj=tmerc +lat_0=58 +lon_0=15.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5116":
        "+proj=tmerc +lat_0=58 +lon_0=16.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5117":
        "+proj=tmerc +lat_0=58 +lon_0=17.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5118":
        "+proj=tmerc +lat_0=58 +lon_0=18.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5119":
        "+proj=tmerc +lat_0=58 +lon_0=19.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5120":
        "+proj=tmerc +lat_0=58 +lon_0=20.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5121":
        "+proj=tmerc +lat_0=58 +lon_0=21.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5122":
        "+proj=tmerc +lat_0=58 +lon_0=22.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5123":
        "+proj=tmerc +lat_0=58 +lon_0=23.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5124":
        "+proj=tmerc +lat_0=58 +lon_0=24.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5125":
        "+proj=tmerc +lat_0=58 +lon_0=25.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5126":
        "+proj=tmerc +lat_0=58 +lon_0=26.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5127":
        "+proj=tmerc +lat_0=58 +lon_0=27.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5128":
        "+proj=tmerc +lat_0=58 +lon_0=28.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5129":
        "+proj=tmerc +lat_0=58 +lon_0=29.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5130":
        "+proj=tmerc +lat_0=58 +lon_0=30.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5132": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:5167":
        "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:5168":
        "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs",
      "EPSG:5169":
        "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:5170":
        "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:5171":
        "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:5172":
        "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:5173":
        "+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:5174":
        "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:5175":
        "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs",
      "EPSG:5176":
        "+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:5177":
        "+proj=tmerc +lat_0=38 +lon_0=131.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs",
      "EPSG:5178":
        "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs",
      "EPSG:5179":
        "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5180":
        "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5181":
        "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5182":
        "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5183":
        "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5184":
        "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5185":
        "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5186":
        "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5187":
        "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5188":
        "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5193": "+vunits=m +no_defs",
      "EPSG:5195": "+vunits=m +no_defs",
      "EPSG:5214": "+vunits=m +no_defs",
      "EPSG:5221":
        "+proj=krovak +lat_0=49.5 +lon_0=42.5 +alpha=30.2881397527778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +pm=ferro +units=m +no_defs",
      "EPSG:5223":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9996 +x_0=500000 +y_0=500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5228":
        "+proj=longlat +ellps=bessel +towgs84=572.213,85.334,461.94,4.9732,1.529,5.2484,3.5378 +no_defs",
      "EPSG:5229":
        "+proj=longlat +ellps=bessel +towgs84=572.213,85.334,461.94,4.9732,1.529,5.2484,3.5378 +pm=ferro +no_defs",
      "EPSG:5233":
        "+proj=longlat +a=6377276.345 +b=6356075.41314024 +towgs84=-0.293,766.95,87.713,0.195704,1.69507,3.47302,-0.039338 +no_defs",
      "EPSG:5234":
        "+proj=tmerc +lat_0=7.000480277777778 +lon_0=80.77171111111112 +k=0.9999238418 +x_0=200000 +y_0=200000 +a=6377276.345 +b=6356075.41314024 +towgs84=-97,787,86,0,0,0,0 +units=m +no_defs",
      "EPSG:5235":
        "+proj=tmerc +lat_0=7.000471527777778 +lon_0=80.77171308333334 +k=0.9999238418 +x_0=500000 +y_0=500000 +a=6377276.345 +b=6356075.41314024 +towgs84=-0.293,766.95,87.713,0.195704,1.69507,3.47302,-0.039338 +units=m +no_defs",
      "EPSG:5237": "+vunits=m +no_defs",
      "EPSG:5243":
        "+proj=lcc +lat_1=48.66666666666666 +lat_2=53.66666666666666 +lat_0=51 +lon_0=10.5 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5244": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5245": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5246": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:5247":
        "+proj=omerc +lat_0=4 +lonc=115 +alpha=53.31580995 +k=0.99984 +x_0=0 +y_0=0 +no_uoff +gamma=53.13010236111111 +ellps=GRS80 +units=m +no_defs",
      "EPSG:5250": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5251": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5252": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5253":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5254":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5255":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5256":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5257":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5258":
        "+proj=tmerc +lat_0=0 +lon_0=42 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5259":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5262": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5263": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5264": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5266":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5269":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=9500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5270":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=10500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5271":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=11500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5272":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=12500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5273":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=13500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5274":
        "+proj=tmerc +lat_0=0 +lon_0=42 +k=1 +x_0=14500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5275":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=15500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5292":
        "+proj=tmerc +lat_0=0 +lon_0=90.73333333333333 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5293":
        "+proj=tmerc +lat_0=0 +lon_0=89.55 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5294":
        "+proj=tmerc +lat_0=0 +lon_0=89.84999999999999 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5295":
        "+proj=tmerc +lat_0=0 +lon_0=90.03333333333333 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5296":
        "+proj=tmerc +lat_0=0 +lon_0=90.15000000000001 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5297":
        "+proj=tmerc +lat_0=0 +lon_0=91.13333333333334 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5298":
        "+proj=tmerc +lat_0=0 +lon_0=91.23333333333333 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5299":
        "+proj=tmerc +lat_0=0 +lon_0=89.34999999999999 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5300":
        "+proj=tmerc +lat_0=0 +lon_0=91.34999999999999 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5301":
        "+proj=tmerc +lat_0=0 +lon_0=89.84999999999999 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5302":
        "+proj=tmerc +lat_0=0 +lon_0=91.56666666666666 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5303":
        "+proj=tmerc +lat_0=0 +lon_0=89.06666666666666 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5304":
        "+proj=tmerc +lat_0=0 +lon_0=90.26666666666667 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5305":
        "+proj=tmerc +lat_0=0 +lon_0=89.55 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5306":
        "+proj=tmerc +lat_0=0 +lon_0=91.75 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5307":
        "+proj=tmerc +lat_0=0 +lon_0=90.5 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5308":
        "+proj=tmerc +lat_0=0 +lon_0=90.16666666666667 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5309":
        "+proj=tmerc +lat_0=0 +lon_0=90.11666666666666 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5310":
        "+proj=tmerc +lat_0=0 +lon_0=91.56666666666666 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5311":
        "+proj=tmerc +lat_0=0 +lon_0=90.86666666666666 +k=1 +x_0=250000 +y_0=-2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5316":
        "+proj=tmerc +lat_0=0 +lon_0=-7 +k=0.999997 +x_0=200000 +y_0=-6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5317": "+geoidgrids=dk_sdfe_fvr09.tif +vunits=m +no_defs",
      "EPSG:5318":
        "+proj=tmerc +lat_0=0 +lon_0=-7 +k=0.999997 +x_0=200000 +y_0=-6000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_fvr09.tif +vunits=m +no_defs",
      "EPSG:5320":
        "+proj=lcc +lat_1=44.5 +lat_2=54.5 +lat_0=0 +lon_0=-84 +x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:5321":
        "+proj=lcc +lat_1=44.5 +lat_2=54.5 +lat_0=0 +lon_0=-84 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5322": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5323": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5324": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5325":
        "+proj=lcc +lat_1=64.25 +lat_2=65.75 +lat_0=65 +lon_0=-19 +x_0=1700000 +y_0=300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5329":
        "+proj=merc +lon_0=3.192280555555556 +k=0.997 +x_0=3900000 +y_0=900000 +ellps=bessel +towgs84=-403,684,41,0,0,0,0 +pm=jakarta +units=m +no_defs",
      "EPSG:5330":
        "+proj=merc +lon_0=3.192280555555556 +k=0.997 +x_0=3900000 +y_0=900000 +ellps=bessel +towgs84=-377,681,-50,0,0,0,0 +pm=jakarta +units=m +no_defs",
      "EPSG:5331":
        "+proj=merc +lon_0=3.192280555555556 +k=0.997 +x_0=3900000 +y_0=900000 +ellps=bessel +towgs84=-587.8,519.75,145.76,0,0,0,0 +pm=jakarta +units=m +no_defs",
      "EPSG:5332": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5336": "+vunits=m +no_defs",
      "EPSG:5337":
        "+proj=utm +zone=25 +south +ellps=intl +towgs84=-151.99,287.04,-147.45,0,0,0,0 +units=m +no_defs",
      "EPSG:5340": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5341": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:5342": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:5343":
        "+proj=tmerc +lat_0=-90 +lon_0=-72 +k=1 +x_0=1500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5344":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5345":
        "+proj=tmerc +lat_0=-90 +lon_0=-66 +k=1 +x_0=3500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5346":
        "+proj=tmerc +lat_0=-90 +lon_0=-63 +k=1 +x_0=4500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5347":
        "+proj=tmerc +lat_0=-90 +lon_0=-60 +k=1 +x_0=5500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5348":
        "+proj=tmerc +lat_0=-90 +lon_0=-57 +k=1 +x_0=6500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5349":
        "+proj=tmerc +lat_0=-90 +lon_0=-54 +k=1 +x_0=7500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5352": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5353": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5354": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5355":
        "+proj=utm +zone=20 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5356":
        "+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5357":
        "+proj=utm +zone=21 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5358": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5359": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:5360": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5361":
        "+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5362":
        "+proj=utm +zone=18 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5363": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:5364": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:5365": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5367":
        "+proj=tmerc +lat_0=0 +lon_0=-84 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5368": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5369": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5370": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5371": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5372": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5373": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5379": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:5380": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5381": "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5382":
        "+proj=utm +zone=21 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5383":
        "+proj=utm +zone=22 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5387":
        "+proj=utm +zone=18 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5388":
        "+proj=utm +zone=17 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5389":
        "+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5391": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5392": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5393": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5396":
        "+proj=utm +zone=26 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5451":
        "+proj=longlat +ellps=clrk66 +towgs84=213.11,9.37,-74.95,0,0,0,0 +no_defs",
      "EPSG:5456":
        "+proj=lcc +lat_1=10.46666666666667 +lat_0=10.46666666666667 +lon_0=-84.33333333333333 +k_0=0.99995696 +x_0=500000 +y_0=271820.522 +ellps=clrk66 +towgs84=213.11,9.37,-74.95,0,0,0,0 +units=m +no_defs",
      "EPSG:5457":
        "+proj=lcc +lat_1=9 +lat_0=9 +lon_0=-83.66666666666667 +k_0=0.99995696 +x_0=500000 +y_0=327987.436 +ellps=clrk66 +towgs84=213.11,9.37,-74.95,0,0,0,0 +units=m +no_defs",
      "EPSG:5458":
        "+proj=lcc +lat_1=16.81666666666667 +lat_0=16.81666666666667 +lon_0=-90.33333333333333 +k_0=0.99992226 +x_0=500000 +y_0=292209.579 +datum=NAD27 +units=m +no_defs",
      "EPSG:5459":
        "+proj=lcc +lat_1=14.9 +lat_0=14.9 +lon_0=-90.33333333333333 +k_0=0.99989906 +x_0=500000 +y_0=325992.681 +ellps=clrk66 +towgs84=213.11,9.37,-74.95,0,0,0,0 +units=m +no_defs",
      "EPSG:5460":
        "+proj=lcc +lat_1=13.78333333333333 +lat_0=13.78333333333333 +lon_0=-89 +k_0=0.99996704 +x_0=500000 +y_0=295809.184 +ellps=clrk66 +towgs84=213.11,9.37,-74.95,0,0,0,0 +units=m +no_defs",
      "EPSG:5461":
        "+proj=lcc +lat_1=13.86666666666667 +lat_0=13.86666666666667 +lon_0=-85.5 +k_0=0.99990314 +x_0=500000 +y_0=359891.816 +ellps=clrk66 +towgs84=213.11,9.37,-74.95,0,0,0,0 +units=m +no_defs",
      "EPSG:5462":
        "+proj=lcc +lat_1=11.73333333333333 +lat_0=11.73333333333333 +lon_0=-85.5 +k_0=0.9999222800000001 +x_0=500000 +y_0=288876.327 +ellps=clrk66 +towgs84=213.11,9.37,-74.95,0,0,0,0 +units=m +no_defs",
      "EPSG:5463":
        "+proj=utm +zone=17 +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:5464":
        "+proj=longlat +a=6378293.645208759 +b=6356617.987679838 +no_defs",
      "EPSG:5466":
        "+proj=tmerc +lat_0=17.06124194444444 +lon_0=-88.6318575 +k=1 +x_0=66220.02833082761 +y_0=135779.5099885299 +a=6378293.645208759 +b=6356617.987679838 +units=m +no_defs",
      "EPSG:5467": "+proj=longlat +ellps=clrk66 +no_defs",
      "EPSG:5469":
        "+proj=lcc +lat_1=8.416666666666666 +lat_0=8.416666666666666 +lon_0=-80 +k_0=0.99989909 +x_0=500000 +y_0=294865.303 +ellps=clrk66 +units=m +no_defs",
      "EPSG:5472":
        "+proj=poly +lat_0=8.25 +lon_0=-81 +x_0=914391.7962 +y_0=999404.7217154861 +ellps=clrk66 +to_meter=0.9143917962 +no_defs",
      "EPSG:5479":
        "+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-78 +lon_0=163 +x_0=7000000 +y_0=5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5480":
        "+proj=lcc +lat_1=-73.66666666666667 +lat_2=-75.33333333333333 +lat_0=-74.5 +lon_0=165 +x_0=5000000 +y_0=3000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5481":
        "+proj=lcc +lat_1=-70.66666666666667 +lat_2=-72.33333333333333 +lat_0=-71.5 +lon_0=166 +x_0=3000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5482":
        "+proj=stere +lat_0=-90 +lat_ts=-90 +lon_0=180 +k=0.994 +x_0=5000000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5487": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5488": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5489": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5490":
        "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5498": "+proj=longlat +datum=NAD83 +vunits=m +no_defs",
      "EPSG:5499":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:5500":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:5513":
        "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +positive=1 +no_defs",
      "EPSG:5514":
        "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813975277778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs",
      "EPSG:5518":
        "+proj=tmerc +lat_0=-44 +lon_0=-176.5 +k=1 +x_0=350000 +y_0=650000 +ellps=intl +towgs84=175,-38,113,0,0,0,0 +units=m +no_defs",
      "EPSG:5519":
        "+proj=tmerc +lat_0=-44 +lon_0=-176.5 +k=1 +x_0=350000 +y_0=650000 +ellps=intl +towgs84=174.05,-25.49,112.57,-0,-0,0.554,0.2263 +units=m +no_defs",
      "EPSG:5520":
        "+proj=tmerc +lat_0=0 +lon_0=3 +k=1 +x_0=1500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:5523":
        "+proj=tmerc +lat_0=0 +lon_0=11.5 +k=0.9996 +x_0=1500000 +y_0=5500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5524": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:5527": "+proj=longlat +ellps=aust_SA +no_defs",
      "EPSG:5530":
        "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=aust_SA +units=m +no_defs",
      "EPSG:5531": "+proj=utm +zone=21 +south +ellps=aust_SA +units=m +no_defs",
      "EPSG:5532":
        "+proj=utm +zone=22 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:5533": "+proj=utm +zone=23 +south +ellps=aust_SA +units=m +no_defs",
      "EPSG:5534": "+proj=utm +zone=24 +south +ellps=aust_SA +units=m +no_defs",
      "EPSG:5535": "+proj=utm +zone=25 +south +ellps=aust_SA +units=m +no_defs",
      "EPSG:5536": "+proj=utm +zone=21 +south +ellps=intl +units=m +no_defs",
      "EPSG:5537": "+proj=utm +zone=22 +south +ellps=intl +units=m +no_defs",
      "EPSG:5538": "+proj=utm +zone=23 +south +ellps=intl +units=m +no_defs",
      "EPSG:5539": "+proj=utm +zone=24 +south +ellps=intl +units=m +no_defs",
      "EPSG:5544": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5545": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5546": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5550":
        "+proj=utm +zone=54 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5551":
        "+proj=utm +zone=55 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5552":
        "+proj=utm +zone=56 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5554":
        "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:5555":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:5556":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:5558": "+proj=geocent +ellps=krass +units=m +no_defs",
      "EPSG:5559":
        "+proj=lcc +lat_1=16.81666666666667 +lat_0=16.81666666666667 +lon_0=-90.33333333333333 +k_0=0.99992226 +x_0=500000 +y_0=292209.579 +ellps=clrk66 +towgs84=213.11,9.37,-74.95,0,0,0,0 +units=m +no_defs",
      "EPSG:5560": "+proj=longlat +ellps=krass +no_defs",
      "EPSG:5561": "+proj=longlat +ellps=krass +no_defs",
      "EPSG:5562":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5563":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5564":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5565":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5566":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5567":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5568":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5569":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5570":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5571":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5572":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5573":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5574":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5575":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5576":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5577":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5578":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5579":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5580":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5581":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5582":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5583":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5588":
        "+proj=sterea +lat_0=46.5 +lon_0=-66.5 +k=0.999912 +x_0=304800 +y_0=304800 +datum=NAD27 +units=ft +no_defs",
      "EPSG:5589":
        "+proj=tmerc +lat_0=17.0612419444444 +lon_0=-88.6318575 +k=1 +x_0=66220.0283308276 +y_0=135779.50998853 +a=6378293.64520876 +b=6356617.98767984 +to_meter=0.3047972654 +no_defs",
      "EPSG:5591": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5592": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5593": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:5596":
        "+proj=tmerc +lat_0=0 +lon_0=11.3333333333333 +k=1 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5597": "+vunits=m +no_defs",
      "EPSG:5598":
        "+proj=tmerc +lat_0=0 +lon_0=11.3333333333333 +k=1 +x_0=1000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:5600": "+vunits=m +no_defs",
      "EPSG:5601": "+vunits=m +no_defs",
      "EPSG:5602": "+vunits=m +no_defs",
      "EPSG:5603": "+vunits=m +no_defs",
      "EPSG:5604": "+vunits=m +no_defs",
      "EPSG:5605": "+vunits=m +no_defs",
      "EPSG:5606": "+vunits=m +no_defs",
      "EPSG:5607": "+vunits=m +no_defs",
      "EPSG:5608": "+vunits=m +no_defs",
      "EPSG:5609": "+vunits=m +no_defs",
      "EPSG:5610": "+vunits=m +no_defs",
      "EPSG:5611": "+vunits=m +no_defs",
      "EPSG:5612": "+vunits=m +no_defs",
      "EPSG:5613":
        "+geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5614": "+vunits=ft +no_defs",
      "EPSG:5615": "+vunits=m +no_defs",
      "EPSG:5616": "+geoidgrids=fr_ign_RALS2016.tif +vunits=m +no_defs",
      "EPSG:5617": "+geoidgrids=fr_ign_RAMG2016.tif +vunits=m +no_defs",
      "EPSG:5618": "+vunits=m +no_defs",
      "EPSG:5619": "+geoidgrids=fr_ign_gg10_sbv2.tif +vunits=m +no_defs",
      "EPSG:5620": "+geoidgrids=fr_ign_gg10_smv2.tif +vunits=m +no_defs",
      "EPSG:5621": "+vunits=m +no_defs",
      "EPSG:5623":
        "+proj=tmerc +lat_0=41.5 +lon_0=-83.6666666666667 +k=0.999942857 +x_0=152400.30480061 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:5624":
        "+proj=tmerc +lat_0=41.5 +lon_0=-85.75 +k=0.999909091 +x_0=152400.30480061 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:5625":
        "+proj=tmerc +lat_0=41.5 +lon_0=-88.75 +k=0.999909091 +x_0=152400.30480061 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:5627":
        "+proj=tmerc +lat_0=0 +lon_0=6 +k=0.9996 +x_0=500000 +y_0=0 +ellps=intl +units=m +no_defs",
      "EPSG:5628":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5629":
        "+proj=utm +zone=38 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5631":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=2500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5632":
        "+proj=lcc +lat_0=52 +lon_0=10 +lat_1=35 +lat_2=65 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5633":
        "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5634":
        "+proj=lcc +lat_0=52 +lon_0=10 +lat_1=35 +lat_2=65 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5635":
        "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5636":
        "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5637":
        "+proj=lcc +lat_0=52 +lon_0=10 +lat_1=35 +lat_2=65 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5638":
        "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5639":
        "+proj=lcc +lat_0=52 +lon_0=10 +lat_1=35 +lat_2=65 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5641":
        "+proj=merc +lat_ts=-2 +lon_0=-43 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5643":
        "+proj=lcc +lat_0=48 +lon_0=10 +lat_1=52.6666666666667 +lat_2=54.3333333333333 +x_0=815000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:5644":
        "+proj=utm +zone=39 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5646":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000.00001016 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:5649":
        "+proj=tmerc +lat_0=0 +lon_0=3 +k=0.9996 +x_0=31500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5650":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9996 +x_0=33500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5651":
        "+proj=tmerc +lat_0=0 +lon_0=3 +k=0.9996 +x_0=31500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5652":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=32500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5653":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9996 +x_0=33500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5654":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:5655":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:5659":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=500053 +y_0=-3999820 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs",
      "EPSG:5663":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5664":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=2500000 +y_0=0 +ellps=krass +towgs84=24,-123,-94,0.02,-0.25,-0.13,1.1 +units=m +no_defs",
      "EPSG:5665":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5666":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5667":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5668":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5669":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5670":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5671":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5672":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5673":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=24,-123,-94,0.02,-0.25,-0.13,1.1 +units=m +no_defs",
      "EPSG:5674":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5675":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:5676":
        "+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5677":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs",
      "EPSG:5678":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs",
      "EPSG:5679":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs",
      "EPSG:5680":
        "+proj=tmerc +lat_0=0 +lon_0=3 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5681": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:5682":
        "+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5683":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5684":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5685":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:5698":
        "+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=fr_ign_RAF18.tif +vunits=m +no_defs",
      "EPSG:5699":
        "+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=fr_ign_RAC09.tif +vunits=m +no_defs",
      "EPSG:5700":
        "+proj=utm +zone=1 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5701": "+geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:5702": "+vunits=us-ft +no_defs",
      "EPSG:5703": "+vunits=m +no_defs",
      "EPSG:5704": "+vunits=m +no_defs",
      "EPSG:5705": "+vunits=m +no_defs",
      "EPSG:5706": "+vunits=m +no_defs",
      "EPSG:5707":
        "+proj=lcc +lat_1=49.5 +lat_0=49.5 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=1200000 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +geoidgrids=fr_ign_RAF18.tif +vunits=m +no_defs",
      "EPSG:5708":
        "+proj=lcc +lat_1=42.165 +lat_0=42.165 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=4185861.369 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +geoidgrids=fr_ign_RAC09.tif +vunits=m +no_defs",
      "EPSG:5709": "+vunits=m +no_defs",
      "EPSG:5710": "+vunits=m +no_defs",
      "EPSG:5711":
        "+geoidgrids=au_ga_AUSGeoid2020_20180201.tif +vunits=m +no_defs",
      "EPSG:5712": "+geoidgrids=au_ga_AUSGeoid09_V1.01.tif +vunits=m +no_defs",
      "EPSG:5713": "+geoidgrids=ca_nrc_HT2_2010v70.tif +vunits=m +no_defs",
      "EPSG:5714": "+vunits=m +no_defs",
      "EPSG:5715": "+vunits=m +no_defs",
      "EPSG:5716": "+vunits=m +no_defs",
      "EPSG:5717": "+vunits=m +no_defs",
      "EPSG:5718": "+vunits=m +no_defs",
      "EPSG:5719": "+vunits=m +no_defs",
      "EPSG:5720": "+geoidgrids=fr_ign_RAF18.tif +vunits=m +no_defs",
      "EPSG:5721": "+geoidgrids=fr_ign_RAC09.tif +vunits=m +no_defs",
      "EPSG:5722": "+vunits=m +no_defs",
      "EPSG:5723": "+vunits=m +no_defs",
      "EPSG:5724": "+vunits=m +no_defs",
      "EPSG:5725": "+vunits=m +no_defs",
      "EPSG:5726": "+vunits=m +no_defs",
      "EPSG:5727": "+vunits=m +no_defs",
      "EPSG:5728": "+vunits=m +no_defs",
      "EPSG:5729": "+vunits=m +no_defs",
      "EPSG:5730": "+vunits=m +no_defs",
      "EPSG:5731": "+geoidgrids=uk_os_OSGM15_Malin.tif +vunits=m +no_defs",
      "EPSG:5732": "+geoidgrids=uk_os_OSGM15_Belfast.tif +vunits=m +no_defs",
      "EPSG:5733": "+geoidgrids=dk_sdfe_dnn.tif +vunits=m +no_defs",
      "EPSG:5734": "+vunits=m +no_defs",
      "EPSG:5735": "+vunits=m +no_defs",
      "EPSG:5736": "+vunits=m +no_defs",
      "EPSG:5737": "+vunits=m +no_defs",
      "EPSG:5738": "+vunits=m +no_defs",
      "EPSG:5739": "+vunits=m +no_defs",
      "EPSG:5740": "+geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:5741": "+vunits=m +no_defs",
      "EPSG:5742": "+geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:5743": "+vunits=m +no_defs",
      "EPSG:5744": "+vunits=m +no_defs",
      "EPSG:5745": "+vunits=m +no_defs",
      "EPSG:5746": "+geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:5747": "+vunits=m +no_defs",
      "EPSG:5748": "+vunits=m +no_defs",
      "EPSG:5749": "+geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:5750": "+geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:5751": "+vunits=m +no_defs",
      "EPSG:5752": "+vunits=m +no_defs",
      "EPSG:5753": "+vunits=m +no_defs",
      "EPSG:5754": "+vto_meter=0.3048007491 +no_defs",
      "EPSG:5755": "+geoidgrids=fr_ign_ggguy15.tif +vunits=m +no_defs",
      "EPSG:5756": "+geoidgrids=fr_ign_RAMART2016.tif +vunits=m +no_defs",
      "EPSG:5757": "+geoidgrids=fr_ign_RAGTBT2016.tif +vunits=m +no_defs",
      "EPSG:5758": "+geoidgrids=fr_ign_RAR07_bl.tif +vunits=m +no_defs",
      "EPSG:5759": "+vunits=m +no_defs",
      "EPSG:5760": "+vunits=m +no_defs",
      "EPSG:5761": "+vunits=m +no_defs",
      "EPSG:5762": "+vunits=m +no_defs",
      "EPSG:5763": "+vunits=m +no_defs",
      "EPSG:5764": "+vunits=m +no_defs",
      "EPSG:5765": "+vunits=m +no_defs",
      "EPSG:5766": "+vunits=m +no_defs",
      "EPSG:5767": "+vunits=m +no_defs",
      "EPSG:5768": "+vunits=m +no_defs",
      "EPSG:5769": "+vunits=m +no_defs",
      "EPSG:5770": "+vunits=m +no_defs",
      "EPSG:5771": "+vunits=m +no_defs",
      "EPSG:5772": "+vunits=m +no_defs",
      "EPSG:5773": "+geoidgrids=us_nga_egm96_15.tif +vunits=m +no_defs",
      "EPSG:5774": "+vunits=m +no_defs",
      "EPSG:5775": "+vunits=m +no_defs",
      "EPSG:5776": "+geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:5777": "+vunits=m +no_defs",
      "EPSG:5778": "+vunits=m +no_defs",
      "EPSG:5779": "+vunits=m +no_defs",
      "EPSG:5780": "+vunits=m +no_defs",
      "EPSG:5781": "+vunits=m +no_defs",
      "EPSG:5782": "+geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:5783": "+vunits=m +no_defs",
      "EPSG:5784": "+vunits=m +no_defs",
      "EPSG:5785": "+vunits=m +no_defs",
      "EPSG:5786": "+vunits=m +no_defs",
      "EPSG:5787": "+vunits=m +no_defs",
      "EPSG:5788": "+vunits=m +no_defs",
      "EPSG:5789": "+vunits=m +no_defs",
      "EPSG:5790": "+vunits=m +no_defs",
      "EPSG:5791": "+vunits=m +no_defs",
      "EPSG:5792": "+geoidgrids=fr_ign_RASPM2018.tif +vunits=m +no_defs",
      "EPSG:5793": "+vunits=m +no_defs",
      "EPSG:5794": "+vunits=m +no_defs",
      "EPSG:5795": "+vunits=m +no_defs",
      "EPSG:5796": "+vunits=m +no_defs",
      "EPSG:5797": "+vunits=m +no_defs",
      "EPSG:5798": "+vunits=m +no_defs",
      "EPSG:5799": "+geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:5825":
        "+proj=tmerc +lat_0=-35.3177362777778 +lon_0=149.009294830556 +k=1.000086 +x_0=200000 +y_0=600000 +ellps=aust_SA +units=m +no_defs",
      "EPSG:5828": "+proj=geocent +ellps=bessel +units=m +no_defs",
      "EPSG:5829": "+vunits=m +no_defs",
      "EPSG:5830": "+proj=longlat +ellps=bessel +no_defs",
      "EPSG:5831": "+vunits=m +no_defs",
      "EPSG:5832":
        "+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +units=m +vunits=m +no_defs",
      "EPSG:5833":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +units=m +vunits=m +no_defs",
      "EPSG:5834":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +units=m +vunits=m +no_defs",
      "EPSG:5835":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +units=m +vunits=m +no_defs",
      "EPSG:5836":
        "+proj=utm +zone=37 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5837":
        "+proj=utm +zone=40 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5839":
        "+proj=utm +zone=17 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5842":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9996 +x_0=500000 +y_0=10000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5843": "+vunits=m +no_defs",
      "EPSG:5844":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=0.9999 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5845":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5846":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5847":
        "+proj=tmerc +lat_0=0 +lon_0=13.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5848":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5849":
        "+proj=tmerc +lat_0=0 +lon_0=16.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5850":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5851":
        "+proj=tmerc +lat_0=0 +lon_0=14.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5852":
        "+proj=tmerc +lat_0=0 +lon_0=15.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5853":
        "+proj=tmerc +lat_0=0 +lon_0=17.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5854":
        "+proj=tmerc +lat_0=0 +lon_0=18.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5855":
        "+proj=tmerc +lat_0=0 +lon_0=20.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5856":
        "+proj=tmerc +lat_0=0 +lon_0=21.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5857":
        "+proj=tmerc +lat_0=0 +lon_0=23.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=se_lantmateriet_SWEN17_RH2000.tif +vunits=m +no_defs",
      "EPSG:5858":
        "+proj=utm +zone=22 +south +ellps=aust_SA +towgs84=-67.35,3.88,-38.22,0,0,0,0 +units=m +no_defs",
      "EPSG:5861": "+vunits=m +no_defs",
      "EPSG:5862": "+vunits=m +no_defs",
      "EPSG:5863": "+vunits=m +no_defs",
      "EPSG:5864": "+vunits=m +no_defs",
      "EPSG:5865": "+vunits=m +no_defs",
      "EPSG:5866": "+vunits=m +no_defs",
      "EPSG:5867": "+vunits=m +no_defs",
      "EPSG:5868": "+vunits=m +no_defs",
      "EPSG:5869": "+vunits=m +no_defs",
      "EPSG:5870": "+vunits=m +no_defs",
      "EPSG:5871": "+vunits=m +no_defs",
      "EPSG:5872": "+vunits=m +no_defs",
      "EPSG:5873": "+vunits=m +no_defs",
      "EPSG:5874": "+vunits=m +no_defs",
      "EPSG:5875":
        "+proj=utm +zone=18 +south +ellps=aust_SA +towgs84=-67.35,3.88,-38.22,0,0,0,0 +units=m +no_defs",
      "EPSG:5876":
        "+proj=utm +zone=19 +south +ellps=aust_SA +towgs84=-67.35,3.88,-38.22,0,0,0,0 +units=m +no_defs",
      "EPSG:5877":
        "+proj=utm +zone=20 +south +ellps=aust_SA +towgs84=-67.35,3.88,-38.22,0,0,0,0 +units=m +no_defs",
      "EPSG:5879":
        "+proj=utm +zone=38 +south +ellps=intl +towgs84=-381.788,-57.501,-256.673,0,0,0,0 +units=m +no_defs",
      "EPSG:5880":
        "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:5884": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:5885": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:5886": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:5887":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=0.9996 +x_0=1500000 +y_0=5000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:5890":
        "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=90 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs",
      "EPSG:5896":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:5897":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:5898":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:5899":
        "+proj=tmerc +lat_0=0 +lon_0=107.75 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:5921":
        "+proj=lcc +lat_0=81.317226 +lon_0=-111 +lat_1=85 +lat_2=77 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5922":
        "+proj=lcc +lat_0=81.317226 +lon_0=-39 +lat_1=85 +lat_2=77 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5923":
        "+proj=lcc +lat_0=81.317226 +lon_0=33 +lat_1=85 +lat_2=77 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5924":
        "+proj=lcc +lat_0=81.317226 +lon_0=105 +lat_1=85 +lat_2=77 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5925":
        "+proj=lcc +lat_0=81.317226 +lon_0=177 +lat_1=85 +lat_2=77 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5926":
        "+proj=lcc +lat_0=73.1557408611111 +lon_0=-111 +lat_1=77 +lat_2=69 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5927":
        "+proj=lcc +lat_0=73.1557408611111 +lon_0=-39 +lat_1=77 +lat_2=69 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5928":
        "+proj=lcc +lat_0=73.1557408611111 +lon_0=33 +lat_1=77 +lat_2=69 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5929":
        "+proj=lcc +lat_0=73.1557408611111 +lon_0=105 +lat_1=77 +lat_2=69 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5930":
        "+proj=lcc +lat_0=73.1557408611111 +lon_0=177 +lat_1=77 +lat_2=69 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5931":
        "+proj=lcc +lat_0=65.1012708888889 +lon_0=-111 +lat_1=69 +lat_2=61 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5932":
        "+proj=lcc +lat_0=65.1012708888889 +lon_0=-39 +lat_1=69 +lat_2=61 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5933":
        "+proj=lcc +lat_0=65.1012708888889 +lon_0=33 +lat_1=69 +lat_2=61 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5934":
        "+proj=lcc +lat_0=65.1012708888889 +lon_0=105 +lat_1=69 +lat_2=61 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5935":
        "+proj=lcc +lat_0=65.1012708888889 +lon_0=177 +lat_1=69 +lat_2=61 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:5936":
        "+proj=stere +lat_0=90 +lon_0=-150 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5937":
        "+proj=stere +lat_0=90 +lon_0=-100 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5938":
        "+proj=stere +lat_0=90 +lon_0=-33 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5939":
        "+proj=stere +lat_0=90 +lon_0=18 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5940":
        "+proj=stere +lat_0=90 +lon_0=105 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:5941":
        "+geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5942":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5945":
        "+proj=tmerc +lat_0=58 +lon_0=5.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5946":
        "+proj=tmerc +lat_0=58 +lon_0=6.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5947":
        "+proj=tmerc +lat_0=58 +lon_0=7.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5948":
        "+proj=tmerc +lat_0=58 +lon_0=8.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5949":
        "+proj=tmerc +lat_0=58 +lon_0=9.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5950":
        "+proj=tmerc +lat_0=58 +lon_0=10.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5951":
        "+proj=tmerc +lat_0=58 +lon_0=11.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5952":
        "+proj=tmerc +lat_0=58 +lon_0=12.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5953":
        "+proj=tmerc +lat_0=58 +lon_0=13.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5954":
        "+proj=tmerc +lat_0=58 +lon_0=14.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5955":
        "+proj=tmerc +lat_0=58 +lon_0=15.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5956":
        "+proj=tmerc +lat_0=58 +lon_0=16.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5957":
        "+proj=tmerc +lat_0=58 +lon_0=17.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5958":
        "+proj=tmerc +lat_0=58 +lon_0=18.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5959":
        "+proj=tmerc +lat_0=58 +lon_0=19.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5960":
        "+proj=tmerc +lat_0=58 +lon_0=20.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5961":
        "+proj=tmerc +lat_0=58 +lon_0=21.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5962":
        "+proj=tmerc +lat_0=58 +lon_0=22.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5963":
        "+proj=tmerc +lat_0=58 +lon_0=23.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5964":
        "+proj=tmerc +lat_0=58 +lon_0=24.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5965":
        "+proj=tmerc +lat_0=58 +lon_0=25.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5966":
        "+proj=tmerc +lat_0=58 +lon_0=26.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5967":
        "+proj=tmerc +lat_0=58 +lon_0=27.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5968":
        "+proj=tmerc +lat_0=58 +lon_0=28.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5969":
        "+proj=tmerc +lat_0=58 +lon_0=29.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5970":
        "+proj=tmerc +lat_0=58 +lon_0=30.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5971":
        "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5972":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5973":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5974":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5975":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:5976":
        "+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_HREF2018B_NN2000_EUREF89.tif +vunits=m +no_defs",
      "EPSG:6050":
        "+proj=lcc +lat_0=85.4371183333333 +lon_0=-30 +lat_1=87 +lat_2=83.6666666666667 +x_0=25500000 +y_0=1500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6051":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=-52 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=18500000 +y_0=2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6052":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=-12 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=20500000 +y_0=2500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6053":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=-69 +lat_1=80.3333333333333 +lat_2=77 +x_0=29500000 +y_0=3500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6054":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=-39 +lat_1=80.3333333333333 +lat_2=77 +x_0=31500000 +y_0=3500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6055":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=-10 +lat_1=80.3333333333333 +lat_2=77 +x_0=33500000 +y_0=3500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6056":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=-64 +lat_1=77 +lat_2=73.6666666666667 +x_0=20500000 +y_0=4500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6057":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=-39 +lat_1=77 +lat_2=73.6666666666667 +x_0=22500000 +y_0=4500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6058":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=-14 +lat_1=77 +lat_2=73.6666666666667 +x_0=24500000 +y_0=4500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6059":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-62 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=41500000 +y_0=5500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6060":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-42 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=43500000 +y_0=5500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6061":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-22 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=45500000 +y_0=5500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6062":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-56 +lat_1=70.3333333333333 +lat_2=67 +x_0=26500000 +y_0=6500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6063":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-38 +lat_1=70.3333333333333 +lat_2=67 +x_0=28500000 +y_0=6500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6064":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-20 +lat_1=70.3333333333333 +lat_2=67 +x_0=30500000 +y_0=6500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6065":
        "+proj=lcc +lat_0=65.3510393055555 +lon_0=-51 +lat_1=67 +lat_2=63.6666666666667 +x_0=11500000 +y_0=7500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6066":
        "+proj=lcc +lat_0=65.3510393055555 +lon_0=-34 +lat_1=67 +lat_2=63.6666666666667 +x_0=13500000 +y_0=7500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6067":
        "+proj=lcc +lat_0=62.0153068888889 +lon_0=-52 +lat_1=63.6666666666667 +lat_2=60.3333333333333 +x_0=20500000 +y_0=8500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6068":
        "+proj=lcc +lat_0=62.0153068888889 +lon_0=-37 +lat_1=63.6666666666667 +lat_2=60.3333333333333 +x_0=22500000 +y_0=8500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6069":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=16 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=22500000 +y_0=2500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6070":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=21 +lat_1=80.3333333333333 +lat_2=77 +x_0=11500000 +y_0=3500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6071":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=10 +lat_1=77 +lat_2=73.6666666666667 +x_0=26500000 +y_0=4500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6072":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=34 +lat_1=77 +lat_2=73.6666666666667 +x_0=28500000 +y_0=4500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6073":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=14 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=11500000 +y_0=5500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6074":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=34 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=13500000 +y_0=5500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6075":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=53 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=24500000 +y_0=2500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6076":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=93 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=26500000 +y_0=2500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6077":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=52 +lat_1=80.3333333333333 +lat_2=77 +x_0=13500000 +y_0=3500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6078":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=83 +lat_1=80.3333333333333 +lat_2=77 +x_0=15500000 +y_0=3500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6079":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=114 +lat_1=80.3333333333333 +lat_2=77 +x_0=17500000 +y_0=3500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6080":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=145 +lat_1=80.3333333333333 +lat_2=77 +x_0=19500000 +y_0=3500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6081":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=58 +lat_1=77 +lat_2=73.6666666666667 +x_0=30500000 +y_0=4500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6082":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=82 +lat_1=77 +lat_2=73.6666666666667 +x_0=32500000 +y_0=4500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6083":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=106 +lat_1=77 +lat_2=73.6666666666667 +x_0=34500000 +y_0=4500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6084":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=130 +lat_1=77 +lat_2=73.6666666666667 +x_0=36500000 +y_0=4500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6085":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=154 +lat_1=77 +lat_2=73.6666666666667 +x_0=38500000 +y_0=4500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6086":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=179 +lat_1=77 +lat_2=73.6666666666667 +x_0=40500000 +y_0=4500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6087":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=54 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=15500000 +y_0=5500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6088":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=74 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=17500000 +y_0=5500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6089":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=95 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=19500000 +y_0=5500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6090":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=116 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=21500000 +y_0=5500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6091":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=137 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=23500000 +y_0=5500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6092":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=158 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=25500000 +y_0=5500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6093":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=179 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=27500000 +y_0=5500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6094":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-163 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=29500000 +y_0=5500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6095":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-147 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=31500000 +y_0=5500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6096":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-165 +lat_1=70.3333333333333 +lat_2=67 +x_0=14500000 +y_0=6500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6097":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-147 +lat_1=70.3333333333333 +lat_2=67 +x_0=16500000 +y_0=6500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6098":
        "+proj=lcc +lat_0=85.4371183333333 +lon_0=-90 +lat_1=87 +lat_2=83.6666666666667 +x_0=23500000 +y_0=1500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6099":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=-115 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=14500000 +y_0=2500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6100":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=-75 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=16500000 +y_0=2500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6101":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=-129 +lat_1=80.3333333333333 +lat_2=77 +x_0=25500000 +y_0=3500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6102":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=-99 +lat_1=80.3333333333333 +lat_2=77 +x_0=27500000 +y_0=3500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6103":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=-69 +lat_1=80.3333333333333 +lat_2=77 +x_0=29500000 +y_0=3500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6104":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=-129 +lat_1=77 +lat_2=73.6666666666667 +x_0=14500000 +y_0=4500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6105":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=-104 +lat_1=77 +lat_2=73.6666666666667 +x_0=16500000 +y_0=4500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6106":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=-79 +lat_1=77 +lat_2=73.6666666666667 +x_0=18500000 +y_0=4500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6107":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-131 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=33500000 +y_0=5500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6108":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-111 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=35500000 +y_0=5500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6109":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-91 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=37500000 +y_0=5500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6110":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-71 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=39500000 +y_0=5500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6111":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-132 +lat_1=70.3333333333333 +lat_2=67 +x_0=18500000 +y_0=6500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6112":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-113 +lat_1=70.3333333333333 +lat_2=67 +x_0=20500000 +y_0=6500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6113":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-94 +lat_1=70.3333333333333 +lat_2=67 +x_0=22500000 +y_0=6500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6114":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-75 +lat_1=70.3333333333333 +lat_2=67 +x_0=24500000 +y_0=6500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6115":
        "+proj=lcc +lat_0=85.4371183333333 +lon_0=30 +lat_1=87 +lat_2=83.6666666666667 +x_0=27500000 +y_0=1500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6116":
        "+proj=lcc +lat_0=85.4371183333333 +lon_0=90 +lat_1=87 +lat_2=83.6666666666667 +x_0=29500000 +y_0=1500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6117":
        "+proj=lcc +lat_0=85.4371183333333 +lon_0=150 +lat_1=87 +lat_2=83.6666666666667 +x_0=31500000 +y_0=1500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6118":
        "+proj=lcc +lat_0=85.4371183333333 +lon_0=-150 +lat_1=87 +lat_2=83.6666666666667 +x_0=21500000 +y_0=1500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6119":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=133 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=28500000 +y_0=2500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6120":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=166 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=10500000 +y_0=2500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6121":
        "+proj=lcc +lat_0=82.0584248888889 +lon_0=-154 +lat_1=83.6666666666667 +lat_2=80.3333333333333 +x_0=12500000 +y_0=2500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6122":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=176 +lat_1=80.3333333333333 +lat_2=77 +x_0=21500000 +y_0=3500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6123":
        "+proj=lcc +lat_0=78.7073375277778 +lon_0=-153 +lat_1=80.3333333333333 +lat_2=77 +x_0=23500000 +y_0=3500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6124":
        "+proj=lcc +lat_0=75.3644033055556 +lon_0=-155 +lat_1=77 +lat_2=73.6666666666667 +x_0=12500000 +y_0=4500000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6125":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-5 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=47500000 +y_0=5500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6128":
        "+proj=tmerc +lat_0=0 +lon_0=-81 +k=0.9996 +x_0=499999.999998 +y_0=0 +ellps=clrk66 +units=ft +no_defs",
      "EPSG:6129":
        "+proj=tmerc +lat_0=0 +lon_0=-81 +k=0.9996 +x_0=499999.999998 +y_0=0 +ellps=clrk66 +units=ft +no_defs",
      "EPSG:6130": "+vunits=ft +no_defs",
      "EPSG:6131": "+vunits=ft +no_defs",
      "EPSG:6132": "+vunits=ft +no_defs",
      "EPSG:6133": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6134": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:6135": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:6141":
        "+proj=lcc +lat_0=19.3333333333333 +lon_0=-80.5666666666667 +lat_1=19.3333333333333 +lat_2=19.7 +x_0=899160 +y_0=579120 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:6144":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6145":
        "+proj=tmerc +lat_0=58 +lon_0=5.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6146":
        "+proj=tmerc +lat_0=58 +lon_0=6.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6147":
        "+proj=tmerc +lat_0=58 +lon_0=7.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6148":
        "+proj=tmerc +lat_0=58 +lon_0=8.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6149":
        "+proj=tmerc +lat_0=58 +lon_0=9.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6150":
        "+proj=tmerc +lat_0=58 +lon_0=10.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6151":
        "+proj=tmerc +lat_0=58 +lon_0=11.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6152":
        "+proj=tmerc +lat_0=58 +lon_0=12.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6153":
        "+proj=tmerc +lat_0=58 +lon_0=13.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6154":
        "+proj=tmerc +lat_0=58 +lon_0=14.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6155":
        "+proj=tmerc +lat_0=58 +lon_0=15.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6156":
        "+proj=tmerc +lat_0=58 +lon_0=16.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6157":
        "+proj=tmerc +lat_0=58 +lon_0=17.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6158":
        "+proj=tmerc +lat_0=58 +lon_0=18.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6159":
        "+proj=tmerc +lat_0=58 +lon_0=19.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6160":
        "+proj=tmerc +lat_0=58 +lon_0=20.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6161":
        "+proj=tmerc +lat_0=58 +lon_0=21.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6162":
        "+proj=tmerc +lat_0=58 +lon_0=22.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6163":
        "+proj=tmerc +lat_0=58 +lon_0=23.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6164":
        "+proj=tmerc +lat_0=58 +lon_0=24.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6165":
        "+proj=tmerc +lat_0=58 +lon_0=25.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6166":
        "+proj=tmerc +lat_0=58 +lon_0=26.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6167":
        "+proj=tmerc +lat_0=58 +lon_0=27.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6168":
        "+proj=tmerc +lat_0=58 +lon_0=28.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6169":
        "+proj=tmerc +lat_0=58 +lon_0=29.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6170":
        "+proj=tmerc +lat_0=58 +lon_0=30.5 +k=1 +x_0=100000 +y_0=1000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6171":
        "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6172":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6173":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6174":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6175":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6176":
        "+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=no_kv_href2008a.tif +vunits=m +no_defs",
      "EPSG:6178": "+vunits=m +no_defs",
      "EPSG:6179": "+vunits=m +no_defs",
      "EPSG:6180": "+vunits=m +no_defs",
      "EPSG:6181": "+vunits=m +no_defs",
      "EPSG:6182": "+vunits=m +no_defs",
      "EPSG:6183": "+vunits=m +no_defs",
      "EPSG:6184": "+vunits=m +no_defs",
      "EPSG:6185": "+vunits=m +no_defs",
      "EPSG:6186": "+vunits=m +no_defs",
      "EPSG:6187": "+vunits=m +no_defs",
      "EPSG:6190":
        "+proj=lcc +lat_0=90 +lon_0=4.36748666666667 +lat_1=51.1666672333333 +lat_2=49.8333339 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +units=m +vunits=m +no_defs",
      "EPSG:6200":
        "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=45.4833333333333 +lat_2=47.0833333333333 +x_0=609601.219202438 +y_0=0 +k_0=1.0000382 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:6201":
        "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3333333333333 +lat_1=44.1833333333333 +lat_2=45.7 +x_0=609601.219202438 +y_0=0 +k_0=1.0000382 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:6202":
        "+proj=lcc +lat_0=41.5 +lon_0=-84.3333333333333 +lat_1=42.1 +lat_2=43.6666666666667 +x_0=609601.219202438 +y_0=0 +k_0=1.0000382 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:6204":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=500000 +y_0=0 +ellps=bessel +towgs84=521.748,229.489,590.921,4.029,4.488,-15.521,-9.78 +units=m +no_defs",
      "EPSG:6207":
        "+proj=longlat +ellps=evrst30 +towgs84=293.17,726.18,245.36,0,0,0,0 +no_defs",
      "EPSG:6210":
        "+proj=utm +zone=23 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6211":
        "+proj=utm +zone=24 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6244":
        "+proj=col_urban +lat_0=7.08760639166667 +lon_0=-70.7583096555555 +x_0=1035263.443 +y_0=1275526.621 +h_0=100 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6245":
        "+proj=col_urban +lat_0=4.532325 +lon_0=-75.6734891666667 +x_0=1155824.666 +y_0=993087.465 +h_0=1470 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6246":
        "+proj=col_urban +lat_0=10.9231830833333 +lon_0=-74.8343313333333 +x_0=917264.406 +y_0=1699839.935 +h_0=100 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6247":
        "+proj=col_urban +lat_0=4.68048611111111 +lon_0=-74.1465916666667 +x_0=92334.879 +y_0=109320.965 +h_0=2550 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6248":
        "+proj=col_urban +lat_0=7.07888714166667 +lon_0=-73.1973432222222 +x_0=1097241.305 +y_0=1274642.278 +h_0=931 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6249":
        "+proj=col_urban +lat_0=3.44188333333333 +lon_0=-76.5205625 +x_0=1061900.18 +y_0=872364.63 +h_0=1000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6250":
        "+proj=col_urban +lat_0=10.3970475 +lon_0=-75.5112069444444 +x_0=842981.41 +y_0=1641887.09 +h_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6251":
        "+proj=col_urban +lat_0=7.88893673611111 +lon_0=-72.50287095 +x_0=842805.406 +y_0=1364404.57 +h_0=308 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6252":
        "+proj=col_urban +lat_0=1.62101229444444 +lon_0=-75.6191176027778 +x_0=1162300.348 +y_0=671068.716 +h_0=300 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6253":
        "+proj=col_urban +lat_0=4.41941282777778 +lon_0=-75.1799259333333 +x_0=877634.33 +y_0=980541.348 +h_0=1100 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6254":
        "+proj=col_urban +lat_0=3.84543818333333 +lon_0=-67.9052320888889 +x_0=1019177.687 +y_0=491791.326 +h_0=96 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6255":
        "+proj=col_urban +lat_0=-4.19768404722222 +lon_0=-69.9428110583333 +x_0=25978.217 +y_0=27501.365 +h_0=89.7 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6256":
        "+proj=col_urban +lat_0=5.06815388888889 +lon_0=-75.5110947222222 +x_0=1173727.04 +y_0=1052391.13 +h_0=2100 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6257":
        "+proj=col_urban +lat_0=6.22920888888889 +lon_0=-75.5648869444444 +x_0=835378.647 +y_0=1180816.875 +h_0=1510 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6258":
        "+proj=col_urban +lat_0=1.24996936666667 +lon_0=-70.2354616555556 +x_0=1093717.398 +y_0=629997.236 +h_0=170 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6259":
        "+proj=col_urban +lat_0=1.14002335833333 +lon_0=-76.6510212194444 +x_0=1047467.388 +y_0=617828.474 +h_0=655.2 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6260":
        "+proj=col_urban +lat_0=8.77308575555556 +lon_0=-75.8795533305556 +x_0=1131814.934 +y_0=1462131.119 +h_0=15 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6261":
        "+proj=col_urban +lat_0=2.94241505555556 +lon_0=-75.2964367222222 +x_0=864476.923 +y_0=817199.827 +h_0=430 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6262":
        "+proj=col_urban +lat_0=1.20098951388889 +lon_0=-77.2531256333333 +x_0=980469.695 +y_0=624555.332 +h_0=2530 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6263":
        "+proj=col_urban +lat_0=4.81359361111111 +lon_0=-75.6939513888889 +x_0=1153492.012 +y_0=1024195.255 +h_0=1500 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6264":
        "+proj=col_urban +lat_0=2.45615988333333 +lon_0=-76.6060916361111 +x_0=1052430.525 +y_0=763366.548 +h_0=1740 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6265":
        "+proj=col_urban +lat_0=6.18072141388889 +lon_0=-67.5007502472222 +x_0=1063834.703 +y_0=1175257.481 +h_0=51.58 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6266":
        "+proj=col_urban +lat_0=5.69424766111111 +lon_0=-76.6507538583333 +x_0=1047273.617 +y_0=1121443.09 +h_0=44 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6267":
        "+proj=col_urban +lat_0=11.5369133277778 +lon_0=-72.9027688694444 +x_0=1128154.73 +y_0=1767887.914 +h_0=6 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6268":
        "+proj=col_urban +lat_0=12.523794325 +lon_0=-81.72937595 +x_0=820439.298 +y_0=1877357.828 +h_0=6 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6269":
        "+proj=col_urban +lat_0=2.56407894166667 +lon_0=-72.640033325 +x_0=1159876.62 +y_0=775380.342 +h_0=185 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6270":
        "+proj=col_urban +lat_0=11.2196430555556 +lon_0=-74.2250052777778 +x_0=983892.409 +y_0=1732533.518 +h_0=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6271":
        "+proj=col_urban +lat_0=8.81055036666667 +lon_0=-74.722466825 +x_0=929043.607 +y_0=1466125.658 +h_0=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6272":
        "+proj=col_urban +lat_0=5.53419473888889 +lon_0=-73.3519389 +x_0=1080514.91 +y_0=1103772.028 +h_0=2800 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6273":
        "+proj=col_urban +lat_0=10.4472611111111 +lon_0=-73.2465713888889 +x_0=1090979.66 +y_0=1647208.93 +h_0=200 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6274":
        "+proj=col_urban +lat_0=4.1553751 +lon_0=-73.6244859861111 +x_0=1050678.757 +y_0=950952.124 +h_0=427.19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6275":
        "+proj=col_urban +lat_0=5.35392722222222 +lon_0=-72.4200402777778 +x_0=851184.177 +y_0=1083954.137 +h_0=300 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6307":
        "+proj=lcc +lat_0=17.8333333333333 +lon_0=-66.4333333333333 +lat_1=18.4333333333333 +lat_2=18.0333333333333 +x_0=200000 +y_0=200000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6309": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:6310":
        "+proj=longlat +ellps=WGS84 +towgs84=8.846,-4.394,-1.122,-0.00237,-0.146528,0.130428,0.783926 +no_defs",
      "EPSG:6311":
        "+proj=longlat +ellps=WGS84 +towgs84=8.846,-4.394,-1.122,-0.00237,-0.146528,0.130428,0.783926 +no_defs",
      "EPSG:6312":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=0.99995 +x_0=200000 +y_0=-3500000 +ellps=WGS84 +towgs84=8.846,-4.394,-1.122,-0.00237,-0.146528,0.130428,0.783926 +units=m +no_defs",
      "EPSG:6316":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=7500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:6317": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6318": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6319": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6320": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6321": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6322": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6323": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6324": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6325": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6328": "+proj=utm +zone=59 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6329": "+proj=utm +zone=60 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6330": "+proj=utm +zone=1 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6331": "+proj=utm +zone=2 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6332": "+proj=utm +zone=3 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6333": "+proj=utm +zone=4 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6334": "+proj=utm +zone=5 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6335": "+proj=utm +zone=6 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6336": "+proj=utm +zone=7 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6337": "+proj=utm +zone=8 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6338": "+proj=utm +zone=9 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6339": "+proj=utm +zone=10 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6340": "+proj=utm +zone=11 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6341": "+proj=utm +zone=12 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6342": "+proj=utm +zone=13 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6343": "+proj=utm +zone=14 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6344": "+proj=utm +zone=15 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6345": "+proj=utm +zone=16 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6346": "+proj=utm +zone=17 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6347": "+proj=utm +zone=18 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6348": "+proj=utm +zone=19 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6349": "+proj=longlat +ellps=GRS80 +vunits=m +no_defs",
      "EPSG:6350":
        "+proj=aea +lat_0=23 +lon_0=-96 +lat_1=29.5 +lat_2=45.5 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6351":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-163 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=29500000 +y_0=5500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6352":
        "+proj=lcc +lat_0=72.0250091944445 +lon_0=-147 +lat_1=73.6666666666667 +lat_2=70.3333333333333 +x_0=31500000 +y_0=5500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6353":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-165 +lat_1=70.3333333333333 +lat_2=67 +x_0=14500000 +y_0=6500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6354":
        "+proj=lcc +lat_0=68.6874755555556 +lon_0=-147 +lat_1=70.3333333333333 +lat_2=67 +x_0=16500000 +y_0=6500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6355":
        "+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6356":
        "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6357": "+vunits=m +no_defs",
      "EPSG:6358": "+vunits=us-ft +no_defs",
      "EPSG:6359": "+vunits=us-ft +no_defs",
      "EPSG:6360": "+vunits=us-ft +no_defs",
      "EPSG:6362":
        "+proj=lcc +lat_0=12 +lon_0=-102 +lat_1=17.5 +lat_2=29.5 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6363": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6364": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:6365": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:6366":
        "+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6367":
        "+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6368":
        "+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6369":
        "+proj=utm +zone=14 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6370":
        "+proj=utm +zone=15 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6371":
        "+proj=utm +zone=16 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6372":
        "+proj=lcc +lat_0=12 +lon_0=-102 +lat_1=17.5 +lat_2=29.5 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6381":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:6382":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:6383":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:6384":
        "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:6385":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:6386":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:6387":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:6391":
        "+proj=lcc +lat_0=19.3333333333333 +lon_0=-80.5666666666667 +lat_1=19.3333333333333 +lat_2=19.7 +x_0=899160 +y_0=579120 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=ft +no_defs",
      "EPSG:6393":
        "+proj=aea +lat_0=50 +lon_0=-154 +lat_1=55 +lat_2=65 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6394":
        "+proj=omerc +no_uoff +lat_0=57 +lonc=-133.666666666667 +alpha=323.130102361111 +gamma=323.130102361111 +k=0.9999 +x_0=5000000 +y_0=-5000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6395":
        "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6396":
        "+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6397":
        "+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6398":
        "+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6399":
        "+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6400":
        "+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6401":
        "+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6402":
        "+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6403":
        "+proj=lcc +lat_0=51 +lon_0=-176 +lat_1=53.8333333333333 +lat_2=51.8333333333333 +x_0=1000000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6404":
        "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6405":
        "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6406":
        "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6407":
        "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6408":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6409":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6410":
        "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6411":
        "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6412":
        "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=400000 +y_0=400000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6413":
        "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6414":
        "+proj=aea +lat_0=0 +lon_0=-120 +lat_1=34 +lat_2=40.5 +x_0=0 +y_0=-4000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6415":
        "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6416":
        "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6417":
        "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6418":
        "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6419":
        "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6420":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.06666666666667 +lat_0=36.5 +lon_0=-120.5 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6421":
        "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6422":
        "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6423":
        "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6424":
        "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6425":
        "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6426":
        "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6427":
        "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6428":
        "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.828803658 +y_0=304800.609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6429":
        "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6430":
        "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.828803658 +y_0=304800.609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6431":
        "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.8289 +y_0=304800.6096 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6432":
        "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.828803658 +y_0=304800.609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6433":
        "+proj=lcc +lat_0=40.8333333333333 +lon_0=-72.75 +lat_1=41.8666666666667 +lat_2=41.2 +x_0=304800.6096 +y_0=152400.3048 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6434":
        "+proj=lcc +lat_0=40.8333333333333 +lon_0=-72.75 +lat_1=41.8666666666667 +lat_2=41.2 +x_0=304800.609601219 +y_0=152400.30480061 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6435":
        "+proj=tmerc +lat_0=38 +lon_0=-75.4166666666667 +k=0.999995 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6436":
        "+proj=tmerc +lat_0=38 +lon_0=-75.4166666666667 +k=0.999995 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6437":
        "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6438":
        "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6439":
        "+proj=aea +lat_0=24 +lon_0=-84 +lat_1=24 +lat_2=31.5 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6440":
        "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6441":
        "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6442":
        "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6443":
        "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6444":
        "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6445":
        "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6446":
        "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=700000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6447":
        "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=699999.9998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6448":
        "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6449":
        "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6450":
        "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6451":
        "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6452":
        "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6453":
        "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6454":
        "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6455":
        "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6456":
        "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=700000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6457":
        "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=699999.99998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6458":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6459":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=99999.9998983998 +y_0=249999.9998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6460":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=250000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6461":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6462":
        "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6463":
        "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=999999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6464":
        "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6465":
        "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6466":
        "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6467":
        "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6468":
        "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=400000 +y_0=400000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6469":
        "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=399999.99998984 +y_0=399999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6470":
        "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6471":
        "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6472":
        "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6473":
        "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.0833333333333 +lat_2=38.6666666666667 +x_0=1500000 +y_0=999999.9998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6474":
        "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6475":
        "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000.0001016 +y_0=500000.0001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6476":
        "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=1000000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6477":
        "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=999999.99998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6478":
        "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=1000000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6479":
        "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=999999.99998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6480":
        "+proj=tmerc +lat_0=43.5 +lon_0=-69.125 +k=0.99998 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6481":
        "+proj=tmerc +lat_0=43.8333333333333 +lon_0=-67.875 +k=0.99998 +x_0=700000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6482":
        "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.375 +k=0.99998 +x_0=300000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6483":
        "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6484":
        "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6485":
        "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6486":
        "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6487":
        "+proj=lcc +lat_0=37.6666666666667 +lon_0=-77 +lat_1=39.45 +lat_2=38.3 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6488":
        "+proj=lcc +lat_0=37.6666666666667 +lon_0=-77 +lat_1=39.45 +lat_2=38.3 +x_0=399999.9998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6489":
        "+proj=lcc +lat_0=41 +lon_0=-70.5 +lat_1=41.4833333333333 +lat_2=41.2833333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6490":
        "+proj=lcc +lat_0=41 +lon_0=-70.5 +lat_1=41.4833333333333 +lat_2=41.2833333333333 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6491":
        "+proj=lcc +lat_0=41 +lon_0=-71.5 +lat_1=42.6833333333333 +lat_2=41.7166666666667 +x_0=200000 +y_0=750000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6492":
        "+proj=lcc +lat_0=41 +lon_0=-71.5 +lat_1=42.6833333333333 +lat_2=41.7166666666667 +x_0=200000.0001016 +y_0=750000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6493":
        "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=6000000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6494":
        "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=5999999.999976 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6495":
        "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=8000000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6496":
        "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=7999999.999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6497":
        "+proj=omerc +no_uoff +lat_0=45.3091666666667 +lonc=-86 +alpha=337.25556 +gamma=337.25556 +k=0.9996 +x_0=2546731.496 +y_0=-4354009.816 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6498":
        "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=4000000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6499":
        "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=3999999.999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6500":
        "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000 +y_0=100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6501":
        "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000.00001016 +y_0=99999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6502":
        "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6503":
        "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000.00001016 +y_0=99999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6504":
        "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000 +y_0=100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6505":
        "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000.00001016 +y_0=99999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6506":
        "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6507":
        "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6508":
        "+proj=tmerc +lat_0=32.5 +lon_0=-89.75 +k=0.9998335 +x_0=500000 +y_0=1300000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6509":
        "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=700000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6510":
        "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=699999.9998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6511":
        "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6512":
        "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6513":
        "+proj=tmerc +lat_0=36.1666666666667 +lon_0=-94.5 +k=0.999941177 +x_0=850000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6514":
        "+proj=lcc +lat_0=44.25 +lon_0=-109.5 +lat_1=49 +lat_2=45 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6515":
        "+proj=lcc +lat_0=44.25 +lon_0=-109.5 +lat_1=49 +lat_2=45 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6516":
        "+proj=lcc +lat_0=39.8333333333333 +lon_0=-100 +lat_1=43 +lat_2=40 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6517":
        "+proj=lcc +lat_0=39.8333333333333 +lon_0=-100 +lat_1=43 +lat_2=40 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6518":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000 +y_0=6000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6519":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000.00001016 +y_0=6000000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6520":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000 +y_0=8000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6521":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.00001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6522":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000 +y_0=4000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6523":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000.00001016 +y_0=3999999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6524":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.6666666666667 +k=0.999966667 +x_0=300000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6525":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.6666666666667 +k=0.999966667 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6526":
        "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6527":
        "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6528":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6529":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6530":
        "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6531":
        "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6532":
        "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6533":
        "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6534":
        "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6535":
        "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=249999.9998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6536":
        "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6537":
        "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6538":
        "+proj=lcc +lat_0=40.1666666666667 +lon_0=-74 +lat_1=41.0333333333333 +lat_2=40.6666666666667 +x_0=300000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6539":
        "+proj=lcc +lat_0=40.1666666666667 +lon_0=-74 +lat_1=41.0333333333333 +lat_2=40.6666666666667 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6540":
        "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6541":
        "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6542":
        "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.22 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6543":
        "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.219202438 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6544":
        "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6545":
        "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6546":
        "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6547":
        "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=599999.9999976 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6548":
        "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6549":
        "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6550":
        "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6551":
        "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6552":
        "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6553":
        "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6554":
        "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6555":
        "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6556":
        "+proj=lcc +lat_0=41.75 +lon_0=-120.5 +lat_1=43 +lat_2=45.5 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6557":
        "+proj=lcc +lat_0=41.75 +lon_0=-120.5 +lat_1=43 +lat_2=45.5 +x_0=399999.9999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6558":
        "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6559":
        "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6560":
        "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6561":
        "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000.0001464 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6562":
        "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6563":
        "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6564":
        "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6565":
        "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6566":
        "+proj=lcc +lat_0=17.8333333333333 +lon_0=-66.4333333333333 +lat_1=18.4333333333333 +lat_2=18.0333333333333 +x_0=200000 +y_0=200000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6567":
        "+proj=tmerc +lat_0=41.0833333333333 +lon_0=-71.5 +k=0.99999375 +x_0=100000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6568":
        "+proj=tmerc +lat_0=41.0833333333333 +lon_0=-71.5 +k=0.99999375 +x_0=99999.99998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6569":
        "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6570":
        "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6571":
        "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6572":
        "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6573":
        "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6574":
        "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6575":
        "+proj=lcc +lat_0=34.3333333333333 +lon_0=-86 +lat_1=36.4166666666667 +lat_2=35.25 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6576":
        "+proj=lcc +lat_0=34.3333333333333 +lon_0=-86 +lat_1=36.4166666666667 +lat_2=35.25 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6577":
        "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=700000 +y_0=3000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6578":
        "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=699999.9998984 +y_0=3000000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6579":
        "+proj=aea +lat_0=18 +lon_0=-100 +lat_1=27.5 +lat_2=35 +x_0=1500000 +y_0=6000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6580":
        "+proj=lcc +lat_0=18 +lon_0=-100 +lat_1=27.5 +lat_2=35 +x_0=1500000 +y_0=5000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6581":
        "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6582":
        "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000.0001016 +y_0=999999.9998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6583":
        "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6584":
        "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000.0001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6585":
        "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6586":
        "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000.0001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6587":
        "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=4000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6588":
        "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=3999999.9998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6589":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6590":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6591":
        "+proj=lcc +lat_0=36 +lon_0=-79.5 +lat_1=37 +lat_2=39.5 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6592":
        "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6593":
        "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000.0001016 +y_0=2000000.0001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6594":
        "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6595":
        "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000.0001016 +y_0=999999.9998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6596":
        "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6597":
        "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6598":
        "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6599":
        "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000.0001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6600":
        "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6601":
        "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6602":
        "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6603":
        "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6604":
        "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6605":
        "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6606":
        "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6607":
        "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6608":
        "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6609":
        "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6610":
        "+proj=tmerc +lat_0=0 +lon_0=-90 +k=0.9996 +x_0=520000 +y_0=-4480000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6611":
        "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6612":
        "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000.00001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6613":
        "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=400000 +y_0=100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6614":
        "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=399999.99998984 +y_0=99999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6615":
        "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000 +y_0=100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6616":
        "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000.00001016 +y_0=99999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6617":
        "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6618":
        "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6619":
        "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6620":
        "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000 +y_0=1000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6621":
        "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000 +y_0=3000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6622":
        "+proj=lcc +lat_0=44 +lon_0=-68.5 +lat_1=60 +lat_2=46 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6623":
        "+proj=aea +lat_0=44 +lon_0=-68.5 +lat_1=60 +lat_2=46 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:6624":
        "+proj=aea +lat_0=44 +lon_0=-68.5 +lat_1=60 +lat_2=46 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6625":
        "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000.00001016 +y_0=2000000.00001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6626":
        "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000.00001016 +y_0=999999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6627":
        "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000.00001016 +y_0=3000000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6628":
        "+proj=tmerc +lat_0=18.8333333333333 +lon_0=-155.5 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6629":
        "+proj=tmerc +lat_0=20.3333333333333 +lon_0=-156.666666666667 +k=0.999966667 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6630":
        "+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6631":
        "+proj=tmerc +lat_0=21.8333333333333 +lon_0=-159.5 +k=0.99999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6632":
        "+proj=tmerc +lat_0=21.6666666666667 +lon_0=-160.166666666667 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6633":
        "+proj=tmerc +lat_0=21.1666666666667 +lon_0=-158 +k=0.99999 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6634": "+proj=utm +zone=4 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6635": "+proj=utm +zone=5 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6636": "+proj=utm +zone=2 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:6637":
        "+proj=tmerc +lat_0=13.5 +lon_0=144.75 +k=1 +x_0=100000 +y_0=200000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6638": "+vunits=m +no_defs",
      "EPSG:6639": "+vunits=m +no_defs",
      "EPSG:6640": "+geoidgrids=us_noaa_g2012bg0.tif +vunits=m +no_defs",
      "EPSG:6641": "+geoidgrids=us_noaa_g2018p0.tif +vunits=m +no_defs",
      "EPSG:6642": "+geoidgrids=us_noaa_g2018p0.tif +vunits=m +no_defs",
      "EPSG:6643": "+geoidgrids=us_noaa_g2012bs0.tif +vunits=m +no_defs",
      "EPSG:6644": "+geoidgrids=us_noaa_g2012bg0.tif +vunits=m +no_defs",
      "EPSG:6646":
        "+proj=tmerc +lat_0=29.0262683333333 +lon_0=46.5 +k=0.9994 +x_0=800000 +y_0=0 +a=6378249.145 +rf=293.465 +towgs84=70.995,-335.916,262.898,0,0,0,0 +units=m +no_defs",
      "EPSG:6647": "+vunits=m +no_defs",
      "EPSG:6649": "+proj=longlat +ellps=GRS80 +vunits=m +no_defs",
      "EPSG:6650": "+proj=utm +zone=7 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6651": "+proj=utm +zone=8 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6652": "+proj=utm +zone=9 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6653":
        "+proj=utm +zone=10 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6654":
        "+proj=utm +zone=11 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6655":
        "+proj=utm +zone=12 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6656":
        "+proj=utm +zone=13 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6657":
        "+proj=utm +zone=14 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6658":
        "+proj=utm +zone=15 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6659":
        "+proj=utm +zone=16 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6660":
        "+proj=utm +zone=17 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6661":
        "+proj=utm +zone=18 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6662":
        "+proj=utm +zone=19 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6663":
        "+proj=utm +zone=20 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6664":
        "+proj=utm +zone=21 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6665":
        "+proj=utm +zone=22 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:6666": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6667": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6668": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6669":
        "+proj=tmerc +lat_0=33 +lon_0=129.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6670":
        "+proj=tmerc +lat_0=33 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6671":
        "+proj=tmerc +lat_0=36 +lon_0=132.166666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6672":
        "+proj=tmerc +lat_0=33 +lon_0=133.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6673":
        "+proj=tmerc +lat_0=36 +lon_0=134.333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6674":
        "+proj=tmerc +lat_0=36 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6675":
        "+proj=tmerc +lat_0=36 +lon_0=137.166666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6676":
        "+proj=tmerc +lat_0=36 +lon_0=138.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6677":
        "+proj=tmerc +lat_0=36 +lon_0=139.833333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6678":
        "+proj=tmerc +lat_0=40 +lon_0=140.833333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6679":
        "+proj=tmerc +lat_0=44 +lon_0=140.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6680":
        "+proj=tmerc +lat_0=44 +lon_0=142.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6681":
        "+proj=tmerc +lat_0=44 +lon_0=144.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6682":
        "+proj=tmerc +lat_0=26 +lon_0=142 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6683":
        "+proj=tmerc +lat_0=26 +lon_0=127.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6684":
        "+proj=tmerc +lat_0=26 +lon_0=124 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6685":
        "+proj=tmerc +lat_0=26 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6686":
        "+proj=tmerc +lat_0=20 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6687":
        "+proj=tmerc +lat_0=26 +lon_0=154 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6688": "+proj=utm +zone=51 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6689": "+proj=utm +zone=52 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6690": "+proj=utm +zone=53 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6691": "+proj=utm +zone=54 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6692": "+proj=utm +zone=55 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6693": "+vunits=m +no_defs",
      "EPSG:6694": "+vunits=m +no_defs",
      "EPSG:6695": "+geoidgrids=jp_gsi_gsigeo2011.tif +vunits=m +no_defs",
      "EPSG:6696":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:6697":
        "+proj=longlat +ellps=GRS80 +geoidgrids=jp_gsi_gsigeo2011.tif +vunits=m +no_defs",
      "EPSG:6700":
        "+proj=longlat +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +vunits=m +no_defs",
      "EPSG:6703":
        "+proj=tmerc +lat_0=0 +lon_0=-60 +k=0.9996 +x_0=500000 +y_0=10000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6704": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6705": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:6706": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:6707":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6708":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6709":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6720":
        "+proj=tmerc +lat_0=0 +lon_0=105.625 +k=1.000024 +x_0=50000 +y_0=1300000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6721":
        "+proj=tmerc +lat_0=0 +lon_0=105.625 +k=1.00002514 +x_0=50000 +y_0=1300000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6722":
        "+proj=tmerc +lat_0=0 +lon_0=96.875 +k=1 +x_0=50000 +y_0=1400000 +datum=WGS84 +units=m +no_defs",
      "EPSG:6723":
        "+proj=tmerc +lat_0=0 +lon_0=96.875 +k=0.99999387 +x_0=50000 +y_0=1500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6732": "+proj=utm +zone=41 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:6733": "+proj=utm +zone=42 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:6734": "+proj=utm +zone=43 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:6735": "+proj=utm +zone=44 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:6736": "+proj=utm +zone=46 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:6737": "+proj=utm +zone=47 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:6738": "+proj=utm +zone=59 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:6781": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6782": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6783": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6784":
        "+proj=tmerc +lat_0=44.5 +lon_0=-117.833333333333 +k=1.00016 +x_0=40000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6785":
        "+proj=tmerc +lat_0=44.5 +lon_0=-117.833333333333 +k=1.00016 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6786":
        "+proj=tmerc +lat_0=44.5 +lon_0=-117.833333333333 +k=1.00016 +x_0=40000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6787":
        "+proj=tmerc +lat_0=44.5 +lon_0=-117.833333333333 +k=1.00016 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6788":
        "+proj=tmerc +lat_0=41.75 +lon_0=-121.75 +k=1.0002 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6789":
        "+proj=tmerc +lat_0=41.75 +lon_0=-121.75 +k=1.0002 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6790":
        "+proj=tmerc +lat_0=41.75 +lon_0=-121.75 +k=1.0002 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6791":
        "+proj=tmerc +lat_0=41.75 +lon_0=-121.75 +k=1.0002 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6792":
        "+proj=lcc +lat_1=44.6666666666667 +lat_0=44.6666666666667 +lon_0=-121.25 +k_0=1.00012 +x_0=80000 +y_0=130000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6793":
        "+proj=lcc +lat_1=44.6666666666667 +lat_0=44.6666666666667 +lon_0=-121.25 +k_0=1.00012 +x_0=79999.99999968 +y_0=130000.00001472 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6794":
        "+proj=lcc +lat_1=44.6666666666667 +lat_0=44.6666666666667 +lon_0=-121.25 +k_0=1.00012 +x_0=80000 +y_0=130000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6795":
        "+proj=lcc +lat_1=44.6666666666667 +lat_0=44.6666666666667 +lon_0=-121.25 +k_0=1.00012 +x_0=79999.99999968 +y_0=130000.00001472 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6796":
        "+proj=lcc +lat_1=43.6666666666667 +lat_0=43.6666666666667 +lon_0=-119.75 +k_0=1.0002 +x_0=120000 +y_0=60000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6797":
        "+proj=lcc +lat_1=43.6666666666667 +lat_0=43.6666666666667 +lon_0=-119.75 +k_0=1.0002 +x_0=119999.99999952 +y_0=59999.99999976 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6798":
        "+proj=lcc +lat_1=43.6666666666667 +lat_0=43.6666666666667 +lon_0=-119.75 +k_0=1.0002 +x_0=120000 +y_0=60000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6799":
        "+proj=lcc +lat_1=43.6666666666667 +lat_0=43.6666666666667 +lon_0=-119.75 +k_0=1.0002 +x_0=119999.99999952 +y_0=59999.99999976 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6800":
        "+proj=tmerc +lat_0=42.5 +lon_0=-123.333333333333 +k=1.00007 +x_0=40000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6801":
        "+proj=tmerc +lat_0=42.5 +lon_0=-123.333333333333 +k=1.00007 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6802":
        "+proj=tmerc +lat_0=42.5 +lon_0=-123.333333333333 +k=1.00007 +x_0=40000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6803":
        "+proj=tmerc +lat_0=42.5 +lon_0=-123.333333333333 +k=1.00007 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6804":
        "+proj=lcc +lat_1=45.6666666666667 +lat_0=45.6666666666667 +lon_0=-120.5 +k_0=1.000008 +x_0=150000 +y_0=30000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6805":
        "+proj=lcc +lat_1=45.6666666666667 +lat_0=45.6666666666667 +lon_0=-120.5 +k_0=1.000008 +x_0=150000.00001464 +y_0=30000.00001512 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6806":
        "+proj=lcc +lat_1=45.6666666666667 +lat_0=45.6666666666667 +lon_0=-120.5 +k_0=1.000008 +x_0=150000 +y_0=30000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6807":
        "+proj=lcc +lat_1=45.6666666666667 +lat_0=45.6666666666667 +lon_0=-120.5 +k_0=1.000008 +x_0=150000.00001464 +y_0=30000.00001512 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6808":
        "+proj=omerc +no_uoff +lat_0=45.9166666666667 +lonc=-123 +alpha=295 +gamma=295 +k=1 +x_0=7000000 +y_0=-3000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6809":
        "+proj=omerc +no_uoff +lat_0=45.9166666666667 +lonc=-123 +alpha=295 +gamma=295 +k=1 +x_0=7000000.00000248 +y_0=-2999999.999988 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6810":
        "+proj=omerc +no_uoff +lat_0=45.9166666666667 +lonc=-123 +alpha=295 +gamma=295 +k=1 +x_0=7000000 +y_0=-3000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6811":
        "+proj=omerc +no_uoff +lat_0=45.9166666666667 +lonc=-123 +alpha=295 +gamma=295 +k=1 +x_0=7000000.00000248 +y_0=-2999999.999988 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6812":
        "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-123.333333333333 +k=1.000023 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6813":
        "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-123.333333333333 +k=1.000023 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6814":
        "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-123.333333333333 +k=1.000023 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6815":
        "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-123.333333333333 +k=1.000023 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6816":
        "+proj=tmerc +lat_0=44.5 +lon_0=-121 +k=1.00011 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6817":
        "+proj=tmerc +lat_0=44.5 +lon_0=-121 +k=1.00011 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6818":
        "+proj=tmerc +lat_0=44.5 +lon_0=-121 +k=1.00011 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6819":
        "+proj=tmerc +lat_0=44.5 +lon_0=-121 +k=1.00011 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6820":
        "+proj=tmerc +lat_0=43.75 +lon_0=-123.166666666667 +k=1.000015 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6821":
        "+proj=tmerc +lat_0=43.75 +lon_0=-123.166666666667 +k=1.000015 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6822":
        "+proj=tmerc +lat_0=43.75 +lon_0=-123.166666666667 +k=1.000015 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6823":
        "+proj=tmerc +lat_0=43.75 +lon_0=-123.166666666667 +k=1.000015 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6824":
        "+proj=tmerc +lat_0=41.75 +lon_0=-123.333333333333 +k=1.000043 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6825":
        "+proj=tmerc +lat_0=41.75 +lon_0=-123.333333333333 +k=1.000043 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6826":
        "+proj=tmerc +lat_0=41.75 +lon_0=-123.333333333333 +k=1.000043 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6827":
        "+proj=tmerc +lat_0=41.75 +lon_0=-123.333333333333 +k=1.000043 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6828":
        "+proj=tmerc +lat_0=45 +lon_0=-122.333333333333 +k=1.00005 +x_0=10000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6829":
        "+proj=tmerc +lat_0=45 +lon_0=-122.333333333333 +k=1.00005 +x_0=10000.0000152 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6830":
        "+proj=tmerc +lat_0=45 +lon_0=-122.333333333333 +k=1.00005 +x_0=10000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6831":
        "+proj=tmerc +lat_0=45 +lon_0=-122.333333333333 +k=1.00005 +x_0=10000.0000152 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6832":
        "+proj=tmerc +lat_0=45 +lon_0=-118 +k=1.00013 +x_0=40000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6833":
        "+proj=tmerc +lat_0=45 +lon_0=-118 +k=1.00013 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6834":
        "+proj=tmerc +lat_0=45 +lon_0=-118 +k=1.00013 +x_0=40000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6835":
        "+proj=tmerc +lat_0=45 +lon_0=-118 +k=1.00013 +x_0=39999.99999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6836":
        "+proj=tmerc +lat_0=43.25 +lon_0=-117 +k=1.0001 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6837":
        "+proj=tmerc +lat_0=43.25 +lon_0=-117 +k=1.0001 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6838":
        "+proj=tmerc +lat_0=43.25 +lon_0=-117 +k=1.0001 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6839":
        "+proj=tmerc +lat_0=43.25 +lon_0=-117 +k=1.0001 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6840":
        "+proj=omerc +no_uoff +lat_0=44.75 +lonc=-124.05 +alpha=5 +gamma=5 +k=1 +x_0=-300000 +y_0=-4600000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6841":
        "+proj=omerc +no_uoff +lat_0=44.75 +lonc=-124.05 +alpha=5 +gamma=5 +k=1 +x_0=-299999.9999988 +y_0=-4600000.00001208 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6842":
        "+proj=omerc +no_uoff +lat_0=44.75 +lonc=-124.05 +alpha=5 +gamma=5 +k=1 +x_0=-300000 +y_0=-4600000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6843":
        "+proj=omerc +no_uoff +lat_0=44.75 +lonc=-124.05 +alpha=5 +gamma=5 +k=1 +x_0=-299999.9999988 +y_0=-4600000.00001208 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6844":
        "+proj=tmerc +lat_0=45.25 +lon_0=-119.166666666667 +k=1.000045 +x_0=60000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6845":
        "+proj=tmerc +lat_0=45.25 +lon_0=-119.166666666667 +k=1.000045 +x_0=59999.99999976 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6846":
        "+proj=tmerc +lat_0=45.25 +lon_0=-119.166666666667 +k=1.000045 +x_0=60000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6847":
        "+proj=tmerc +lat_0=45.25 +lon_0=-119.166666666667 +k=1.000045 +x_0=59999.99999976 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6848":
        "+proj=tmerc +lat_0=45.0833333333333 +lon_0=-118.333333333333 +k=1.000175 +x_0=30000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6849":
        "+proj=tmerc +lat_0=45.0833333333333 +lon_0=-118.333333333333 +k=1.000175 +x_0=30000.00001512 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6850":
        "+proj=tmerc +lat_0=45.0833333333333 +lon_0=-118.333333333333 +k=1.000175 +x_0=30000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6851":
        "+proj=tmerc +lat_0=45.0833333333333 +lon_0=-118.333333333333 +k=1.000175 +x_0=30000.00001512 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6852":
        "+proj=lcc +lat_1=45.5 +lat_0=45.5 +lon_0=-122.75 +k_0=1.000002 +x_0=100000 +y_0=50000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6853":
        "+proj=lcc +lat_1=45.5 +lat_0=45.5 +lon_0=-122.75 +k_0=1.000002 +x_0=99999.9999996 +y_0=50000.00001504 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6854":
        "+proj=lcc +lat_1=45.5 +lat_0=45.5 +lon_0=-122.75 +k_0=1.000002 +x_0=100000 +y_0=50000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6855":
        "+proj=lcc +lat_1=45.5 +lat_0=45.5 +lon_0=-122.75 +k_0=1.000002 +x_0=99999.9999996 +y_0=50000.00001504 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6856":
        "+proj=tmerc +lat_0=44.3333333333333 +lon_0=-123.083333333333 +k=1.00001 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6857":
        "+proj=tmerc +lat_0=44.3333333333333 +lon_0=-123.083333333333 +k=1.00001 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6858":
        "+proj=tmerc +lat_0=44.3333333333333 +lon_0=-123.083333333333 +k=1.00001 +x_0=50000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6859":
        "+proj=tmerc +lat_0=44.3333333333333 +lon_0=-123.083333333333 +k=1.00001 +x_0=50000.00001504 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6860":
        "+proj=tmerc +lat_0=44.0833333333333 +lon_0=-122.5 +k=1.000155 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6861":
        "+proj=tmerc +lat_0=44.0833333333333 +lon_0=-122.5 +k=1.000155 +x_0=0 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6862":
        "+proj=tmerc +lat_0=44.0833333333333 +lon_0=-122.5 +k=1.000155 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6863":
        "+proj=tmerc +lat_0=44.0833333333333 +lon_0=-122.5 +k=1.000155 +x_0=0 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6867":
        "+proj=lcc +lat_0=41.75 +lon_0=-120.5 +lat_1=43 +lat_2=45.5 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6868":
        "+proj=lcc +lat_0=41.75 +lon_0=-120.5 +lat_1=43 +lat_2=45.5 +x_0=399999.9999984 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6870":
        "+proj=tmerc +lat_0=0 +lon_0=20 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6871":
        "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +geoidgrids=us_nga_egm08_25.tif +vunits=m +no_defs",
      "EPSG:6875":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9985 +x_0=7000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6876":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=3000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6879":
        "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6880":
        "+proj=lcc +lat_0=39.8333333333333 +lon_0=-100 +lat_1=43 +lat_2=40 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6881":
        "+proj=longlat +a=6378249.145 +rf=293.465 +towgs84=-24,-203,268,0,0,0,0 +no_defs",
      "EPSG:6882":
        "+proj=longlat +a=6378249.145 +rf=293.465 +towgs84=-183,-15,273,0,0,0,0 +no_defs",
      "EPSG:6883":
        "+proj=longlat +ellps=intl +towgs84=-235,-110,393,0,0,0,0 +no_defs",
      "EPSG:6884":
        "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6885":
        "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000.0001424 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6886":
        "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6887":
        "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000.0001464 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:6892": "+proj=longlat +a=6378249.145 +rf=293.465 +no_defs",
      "EPSG:6893":
        "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +geoidgrids=us_nga_egm08_25.tif +vunits=m +no_defs",
      "EPSG:6894":
        "+proj=longlat +a=6378249.145 +rf=293.465 +towgs84=-63,176,185,0,0,0,0 +no_defs",
      "EPSG:6915":
        "+proj=utm +zone=40 +a=6378249.145 +rf=293.465 +units=m +no_defs",
      "EPSG:6916": "+vunits=m +no_defs",
      "EPSG:6917":
        "+proj=longlat +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:6922":
        "+proj=lcc +lat_0=36 +lon_0=-98.25 +lat_1=39.5 +lat_2=37.5 +x_0=400000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:6923":
        "+proj=lcc +lat_0=36 +lon_0=-98.25 +lat_1=39.5 +lat_2=37.5 +x_0=399999.99998984 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:6924":
        "+proj=lcc +lat_0=36 +lon_0=-98.25 +lat_1=39.5 +lat_2=37.5 +x_0=400000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6925":
        "+proj=lcc +lat_0=36 +lon_0=-98.25 +lat_1=39.5 +lat_2=37.5 +x_0=399999.99998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:6927":
        "+proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:6931":
        "+proj=laea +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:6932":
        "+proj=laea +lat_0=-90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:6933":
        "+proj=cea +lat_ts=30 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:6934": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6956":
        "+proj=tmerc +lat_0=0 +lon_0=102 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:6957":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:6958":
        "+proj=tmerc +lat_0=0 +lon_0=108 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:6959":
        "+proj=tmerc +lat_0=0 +lon_0=107.75 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:6962":
        "+proj=lcc +lat_0=41 +lon_0=20 +lat_1=39 +lat_2=43 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:6966":
        "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=45.4833333333333 +lat_2=47.0833333333333 +x_0=609601.219202438 +y_0=0 +k_0=1.0000382 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:6978": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:6979": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:6980": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:6981": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6982": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6983": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:6984":
        "+proj=tmerc +lat_0=31.7343936111111 +lon_0=35.2045169444444 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6985": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:6986": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:6987": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:6988": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:6989":
        "+proj=longlat +ellps=GRS80 +towgs84=-23.772,-17.49,-17.859,0.3132,1.85274,-1.67299,5.4262 +no_defs",
      "EPSG:6990":
        "+proj=longlat +ellps=GRS80 +towgs84=-23.772,-17.49,-17.859,0.3132,1.85274,-1.67299,5.4262 +no_defs",
      "EPSG:6991":
        "+proj=tmerc +lat_0=31.7343936111111 +lon_0=35.2045169444444 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-23.772,-17.49,-17.859,0.3132,1.85274,-1.67299,5.4262 +units=m +no_defs",
      "EPSG:6996":
        "+proj=tmerc +lat_0=37.75 +lon_0=-122.45 +k=1.000007 +x_0=48000 +y_0=24000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:6997":
        "+proj=tmerc +lat_0=37.75 +lon_0=-122.45 +k=1.000007 +x_0=48000 +y_0=24000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7005":
        "+proj=utm +zone=37 +a=6378249.145 +rf=293.465 +towgs84=-242.2,-144.9,370.3,0,0,0,0 +units=m +no_defs",
      "EPSG:7006":
        "+proj=utm +zone=38 +a=6378249.145 +rf=293.465 +towgs84=-242.2,-144.9,370.3,0,0,0,0 +units=m +no_defs",
      "EPSG:7007":
        "+proj=utm +zone=39 +a=6378249.145 +rf=293.465 +units=m +no_defs",
      "EPSG:7034": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7035": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7036": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7037": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7038": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7039": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7040": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7041": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7042": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7057":
        "+proj=lcc +lat_1=43.2 +lat_0=43.2 +lon_0=-95.25 +k_0=1.000052 +x_0=3505207.01041402 +y_0=2926085.8521717 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7058":
        "+proj=lcc +lat_1=43.1666666666667 +lat_0=43.1666666666667 +lon_0=-92.75 +k_0=1.000043 +x_0=3810007.62001524 +y_0=2987045.97409195 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7059":
        "+proj=tmerc +lat_0=40.25 +lon_0=-91.2 +k=1.000035 +x_0=4114808.22961646 +y_0=2529845.05969012 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7060":
        "+proj=lcc +lat_1=42.5333333333333 +lat_0=42.5333333333333 +lon_0=-94.8333333333333 +k_0=1.000045 +x_0=4419608.83921768 +y_0=2621285.24257049 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7061":
        "+proj=lcc +lat_1=42.65 +lat_0=42.65 +lon_0=-92.25 +k_0=1.000032 +x_0=4724409.4488189 +y_0=2712725.42545085 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7062":
        "+proj=tmerc +lat_0=40.25 +lon_0=-95.7333333333333 +k=1.000039 +x_0=5029210.05842012 +y_0=2011684.02336805 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7063":
        "+proj=tmerc +lat_0=40.25 +lon_0=-94.6333333333333 +k=1.000045 +x_0=5334010.66802134 +y_0=2072644.14528829 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7064":
        "+proj=tmerc +lat_0=40.25 +lon_0=-93.7166666666667 +k=1.000033 +x_0=5638811.27762256 +y_0=2133604.26720853 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7065":
        "+proj=tmerc +lat_0=40.25 +lon_0=-92.8166666666667 +k=1.000027 +x_0=5943611.88722378 +y_0=2194564.38912878 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7066":
        "+proj=lcc +lat_1=41.8333333333333 +lat_0=41.8333333333333 +lon_0=-91.6666666666667 +k_0=1.00002 +x_0=6248412.49682499 +y_0=2438404.87680975 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7067":
        "+proj=tmerc +lat_0=40.25 +lon_0=-90.5333333333333 +k=1.000027 +x_0=6553213.10642621 +y_0=2316484.63296927 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7068":
        "+proj=lcc +lat_1=40.9166666666667 +lat_0=40.9166666666667 +lon_0=-93.75 +k_0=1.000037 +x_0=6858013.71602743 +y_0=1889763.77952756 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7069":
        "+proj=tmerc +lat_0=40.25 +lon_0=-91.9166666666667 +k=1.00002 +x_0=7162814.32562865 +y_0=1950723.9014478 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7070":
        "+proj=tmerc +lat_0=40.25 +lon_0=-91.25 +k=1.000018 +x_0=7467614.93522987 +y_0=1889763.77952756 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7071": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7072": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7073": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7074": "+proj=utm +zone=37 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7075": "+proj=utm +zone=38 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7076": "+proj=utm +zone=39 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7077": "+proj=utm +zone=40 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7078": "+proj=utm +zone=41 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7079": "+proj=utm +zone=42 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7080": "+proj=utm +zone=43 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7081": "+proj=utm +zone=44 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7084": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7085": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7086": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7087": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7088": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7109":
        "+proj=tmerc +lat_0=48.5 +lon_0=-112.5 +k=1.00016 +x_0=150000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7110":
        "+proj=tmerc +lat_0=48 +lon_0=-112.5 +k=1.00019 +x_0=100000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7111":
        "+proj=lcc +lat_1=48.5 +lat_0=48.5 +lon_0=-111 +k_0=1.000145 +x_0=150000 +y_0=200000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7112":
        "+proj=lcc +lat_1=48.5 +lat_0=48.5 +lon_0=-108.5 +k_0=1.00012 +x_0=200000 +y_0=150000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7113":
        "+proj=lcc +lat_1=48.3333333333333 +lat_0=48.3333333333333 +lon_0=-105.5 +k_0=1.00012 +x_0=200000 +y_0=100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7114":
        "+proj=lcc +lat_1=48.3333333333333 +lat_0=48.3333333333333 +lon_0=-105.5 +k_0=1.00009 +x_0=100000 +y_0=50000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7115":
        "+proj=tmerc +lat_0=44.75 +lon_0=-107.75 +k=1.000148 +x_0=200000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7116":
        "+proj=lcc +lat_1=46.25 +lat_0=46.25 +lon_0=-111.25 +k_0=1.000185 +x_0=100000 +y_0=100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7117":
        "+proj=lcc +lat_1=45.7833333333333 +lat_0=45.7833333333333 +lon_0=-108.416666666667 +k_0=1.0001515 +x_0=200000 +y_0=50000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7118":
        "+proj=tmerc +lat_0=42.6666666666667 +lon_0=-108.333333333333 +k=1.00024 +x_0=100000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7119":
        "+proj=tmerc +lat_0=48.5 +lon_0=-112.5 +k=1.00016 +x_0=150000.00001464 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:7120":
        "+proj=tmerc +lat_0=48 +lon_0=-112.5 +k=1.00019 +x_0=99999.9999996 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:7121":
        "+proj=lcc +lat_1=48.5 +lat_0=48.5 +lon_0=-111 +k_0=1.000145 +x_0=150000.00001464 +y_0=199999.9999992 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:7122":
        "+proj=lcc +lat_1=48.5 +lat_0=48.5 +lon_0=-108.5 +k_0=1.00012 +x_0=199999.9999992 +y_0=150000.00001464 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:7123":
        "+proj=lcc +lat_1=48.3333333333333 +lat_0=48.3333333333333 +lon_0=-105.5 +k_0=1.00012 +x_0=199999.9999992 +y_0=99999.9999996 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:7124":
        "+proj=lcc +lat_1=48.3333333333333 +lat_0=48.3333333333333 +lon_0=-105.5 +k_0=1.00009 +x_0=99999.9999996 +y_0=49999.99971024 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:7125":
        "+proj=tmerc +lat_0=44.75 +lon_0=-107.75 +k=1.000148 +x_0=199999.9999992 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:7126":
        "+proj=lcc +lat_1=46.25 +lat_0=46.25 +lon_0=-111.25 +k_0=1.000185 +x_0=99999.9999996 +y_0=99999.9999996 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:7127":
        "+proj=lcc +lat_1=45.7833333333333 +lat_0=45.7833333333333 +lon_0=-108.416666666667 +k_0=1.0001515 +x_0=199999.9999992 +y_0=50000.00001504 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:7128":
        "+proj=tmerc +lat_0=42.6666666666667 +lon_0=-108.333333333333 +k=1.00024 +x_0=99999.99998984 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7131":
        "+proj=tmerc +lat_0=37.75 +lon_0=-122.45 +k=1.000007 +x_0=48000 +y_0=24000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7132":
        "+proj=tmerc +lat_0=37.75 +lon_0=-122.45 +k=1.000007 +x_0=48000 +y_0=24000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7133": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7134": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:7135": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7136": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7137": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:7138": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7139": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7142":
        "+proj=tmerc +lat_0=31.7340969444444 +lon_0=35.2120805555556 +k=1 +x_0=170251.555 +y_0=126867.909 +a=6378300.789 +b=6356566.435 +units=m +no_defs",
      "EPSG:7257":
        "+proj=tmerc +lat_0=40.55 +lon_0=-84.95 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7258":
        "+proj=tmerc +lat_0=40.55 +lon_0=-84.95 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7259":
        "+proj=tmerc +lat_0=40.9 +lon_0=-85.05 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7260":
        "+proj=tmerc +lat_0=40.9 +lon_0=-85.05 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7261":
        "+proj=tmerc +lat_0=39 +lon_0=-85.85 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7262":
        "+proj=tmerc +lat_0=39 +lon_0=-85.85 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7263":
        "+proj=tmerc +lat_0=40.45 +lon_0=-87.3 +k=1.000029 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7264":
        "+proj=tmerc +lat_0=40.45 +lon_0=-87.3 +k=1.000029 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7265":
        "+proj=tmerc +lat_0=40.05 +lon_0=-85.4 +k=1.000038 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7266":
        "+proj=tmerc +lat_0=40.05 +lon_0=-85.4 +k=1.000038 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7267":
        "+proj=tmerc +lat_0=39.6 +lon_0=-86.5 +k=1.000036 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7268":
        "+proj=tmerc +lat_0=39.6 +lon_0=-86.5 +k=1.000036 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7269":
        "+proj=tmerc +lat_0=39 +lon_0=-86.3 +k=1.00003 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7270":
        "+proj=tmerc +lat_0=39 +lon_0=-86.3 +k=1.00003 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7271":
        "+proj=tmerc +lat_0=40.4 +lon_0=-86.65 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7272":
        "+proj=tmerc +lat_0=40.4 +lon_0=-86.65 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7273":
        "+proj=tmerc +lat_0=40.55 +lon_0=-86.4 +k=1.000028 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7274":
        "+proj=tmerc +lat_0=40.55 +lon_0=-86.4 +k=1.000028 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7275":
        "+proj=tmerc +lat_0=38.15 +lon_0=-85.6 +k=1.000021 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7276":
        "+proj=tmerc +lat_0=38.15 +lon_0=-85.6 +k=1.000021 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7277":
        "+proj=tmerc +lat_0=39.15 +lon_0=-87.15 +k=1.000024 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7278":
        "+proj=tmerc +lat_0=39.15 +lon_0=-87.15 +k=1.000024 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7279":
        "+proj=tmerc +lat_0=40.15 +lon_0=-86.6 +k=1.000032 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7280":
        "+proj=tmerc +lat_0=40.15 +lon_0=-86.6 +k=1.000032 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7281":
        "+proj=tmerc +lat_0=38.1 +lon_0=-86.5 +k=1.000025 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7282":
        "+proj=tmerc +lat_0=38.1 +lon_0=-86.5 +k=1.000025 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7283":
        "+proj=tmerc +lat_0=38.45 +lon_0=-87.1 +k=1.000018 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7284":
        "+proj=tmerc +lat_0=38.45 +lon_0=-87.1 +k=1.000018 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7285":
        "+proj=tmerc +lat_0=38.65 +lon_0=-84.9 +k=1.000029 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7286":
        "+proj=tmerc +lat_0=38.65 +lon_0=-84.9 +k=1.000029 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7287":
        "+proj=tmerc +lat_0=39.1 +lon_0=-85.65 +k=1.000036 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7288":
        "+proj=tmerc +lat_0=39.1 +lon_0=-85.65 +k=1.000036 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7289":
        "+proj=tmerc +lat_0=41.25 +lon_0=-84.95 +k=1.000036 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7290":
        "+proj=tmerc +lat_0=41.25 +lon_0=-84.95 +k=1.000036 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7291":
        "+proj=tmerc +lat_0=38.2 +lon_0=-86.95 +k=1.00002 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7292":
        "+proj=tmerc +lat_0=38.2 +lon_0=-86.95 +k=1.00002 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7293":
        "+proj=tmerc +lat_0=40.65 +lon_0=-85.85 +k=1.000033 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7294":
        "+proj=tmerc +lat_0=40.65 +lon_0=-85.85 +k=1.000033 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7295":
        "+proj=tmerc +lat_0=39.25 +lon_0=-85.05 +k=1.000038 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7296":
        "+proj=tmerc +lat_0=39.25 +lon_0=-85.05 +k=1.000038 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7297":
        "+proj=tmerc +lat_0=39.95 +lon_0=-87.3 +k=1.000025 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7298":
        "+proj=tmerc +lat_0=39.95 +lon_0=-87.3 +k=1.000025 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7299":
        "+proj=tmerc +lat_0=40.9 +lon_0=-86.3 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7300":
        "+proj=tmerc +lat_0=40.9 +lon_0=-86.3 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7301":
        "+proj=tmerc +lat_0=38.15 +lon_0=-87.65 +k=1.000013 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7302":
        "+proj=tmerc +lat_0=38.15 +lon_0=-87.65 +k=1.000013 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7303":
        "+proj=tmerc +lat_0=40.35 +lon_0=-85.7 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7304":
        "+proj=tmerc +lat_0=40.35 +lon_0=-85.7 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7305":
        "+proj=tmerc +lat_0=39.9 +lon_0=-86 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7306":
        "+proj=tmerc +lat_0=39.9 +lon_0=-86 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7307":
        "+proj=tmerc +lat_0=39.65 +lon_0=-85.8 +k=1.000036 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7308":
        "+proj=tmerc +lat_0=39.65 +lon_0=-85.8 +k=1.000036 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7309":
        "+proj=tmerc +lat_0=37.95 +lon_0=-86.15 +k=1.000027 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7310":
        "+proj=tmerc +lat_0=37.95 +lon_0=-86.15 +k=1.000027 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7311":
        "+proj=tmerc +lat_0=39.75 +lon_0=-85.45 +k=1.000043 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7312":
        "+proj=tmerc +lat_0=39.75 +lon_0=-85.45 +k=1.000043 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7313":
        "+proj=tmerc +lat_0=40.35 +lon_0=-86.15 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7314":
        "+proj=tmerc +lat_0=40.35 +lon_0=-86.15 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7315":
        "+proj=tmerc +lat_0=40.65 +lon_0=-85.5 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7316":
        "+proj=tmerc +lat_0=40.65 +lon_0=-85.5 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7317":
        "+proj=tmerc +lat_0=38.7 +lon_0=-85.95 +k=1.000022 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7318":
        "+proj=tmerc +lat_0=38.7 +lon_0=-85.95 +k=1.000022 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7319":
        "+proj=tmerc +lat_0=40.7 +lon_0=-87.1 +k=1.000027 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7320":
        "+proj=tmerc +lat_0=40.7 +lon_0=-87.1 +k=1.000027 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7321":
        "+proj=tmerc +lat_0=40.3 +lon_0=-85 +k=1.000038 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7322":
        "+proj=tmerc +lat_0=40.3 +lon_0=-85 +k=1.000038 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7323":
        "+proj=tmerc +lat_0=38.55 +lon_0=-85.35 +k=1.000028 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7324":
        "+proj=tmerc +lat_0=38.55 +lon_0=-85.35 +k=1.000028 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7325":
        "+proj=tmerc +lat_0=38.8 +lon_0=-85.8 +k=1.000025 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7326":
        "+proj=tmerc +lat_0=38.8 +lon_0=-85.8 +k=1.000025 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7327":
        "+proj=tmerc +lat_0=39.3 +lon_0=-86.15 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7328":
        "+proj=tmerc +lat_0=39.3 +lon_0=-86.15 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7329":
        "+proj=tmerc +lat_0=38.4 +lon_0=-87.45 +k=1.000015 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7330":
        "+proj=tmerc +lat_0=38.4 +lon_0=-87.45 +k=1.000015 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7331":
        "+proj=tmerc +lat_0=41.25 +lon_0=-85.45 +k=1.000037 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7332":
        "+proj=tmerc +lat_0=41.25 +lon_0=-85.45 +k=1.000037 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7333":
        "+proj=tmerc +lat_0=40.7 +lon_0=-87.4 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7334":
        "+proj=tmerc +lat_0=40.7 +lon_0=-87.4 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7335":
        "+proj=tmerc +lat_0=40.9 +lon_0=-86.75 +k=1.000027 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7336":
        "+proj=tmerc +lat_0=40.9 +lon_0=-86.75 +k=1.000027 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7337":
        "+proj=tmerc +lat_0=38.95 +lon_0=-86.5 +k=1.000028 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7338":
        "+proj=tmerc +lat_0=38.95 +lon_0=-86.5 +k=1.000028 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7339":
        "+proj=tmerc +lat_0=39.45 +lon_0=-86.95 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7340":
        "+proj=tmerc +lat_0=39.45 +lon_0=-86.95 +k=1.000031 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7341":
        "+proj=tmerc +lat_0=39.15 +lon_0=-86.9 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7342":
        "+proj=tmerc +lat_0=39.15 +lon_0=-86.9 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7343":
        "+proj=tmerc +lat_0=39.6 +lon_0=-87.35 +k=1.000022 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7344":
        "+proj=tmerc +lat_0=39.6 +lon_0=-87.35 +k=1.000022 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7345":
        "+proj=tmerc +lat_0=37.8 +lon_0=-86.7 +k=1.00002 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7346":
        "+proj=tmerc +lat_0=37.8 +lon_0=-86.7 +k=1.00002 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7347":
        "+proj=tmerc +lat_0=37.85 +lon_0=-87.3 +k=1.000015 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7348":
        "+proj=tmerc +lat_0=37.85 +lon_0=-87.3 +k=1.000015 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7349":
        "+proj=tmerc +lat_0=37.75 +lon_0=-87.95 +k=1.000013 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7350":
        "+proj=tmerc +lat_0=37.75 +lon_0=-87.95 +k=1.000013 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7351":
        "+proj=tmerc +lat_0=39.7 +lon_0=-85.05 +k=1.000044 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7352":
        "+proj=tmerc +lat_0=39.7 +lon_0=-85.05 +k=1.000044 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7353":
        "+proj=tmerc +lat_0=38.9 +lon_0=-85.3 +k=1.000038 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7354":
        "+proj=tmerc +lat_0=38.9 +lon_0=-85.3 +k=1.000038 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7355":
        "+proj=tmerc +lat_0=39.3 +lon_0=-85.9 +k=1.00003 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7356":
        "+proj=tmerc +lat_0=39.3 +lon_0=-85.9 +k=1.00003 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7357":
        "+proj=tmerc +lat_0=37.75 +lon_0=-87.05 +k=1.000014 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7358":
        "+proj=tmerc +lat_0=37.75 +lon_0=-87.05 +k=1.000014 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7359":
        "+proj=tmerc +lat_0=41.5 +lon_0=-85 +k=1.000041 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7360":
        "+proj=tmerc +lat_0=41.5 +lon_0=-85 +k=1.000041 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7361":
        "+proj=tmerc +lat_0=38.9 +lon_0=-87.5 +k=1.000017 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7362":
        "+proj=tmerc +lat_0=38.9 +lon_0=-87.5 +k=1.000017 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7363":
        "+proj=tmerc +lat_0=40.2 +lon_0=-86.9 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7364":
        "+proj=tmerc +lat_0=40.2 +lon_0=-86.9 +k=1.000026 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7365":
        "+proj=tmerc +lat_0=37.8 +lon_0=-87.55 +k=1.000015 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7366":
        "+proj=tmerc +lat_0=37.8 +lon_0=-87.55 +k=1.000015 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7367":
        "+proj=tmerc +lat_0=39.25 +lon_0=-87.45 +k=1.00002 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7368":
        "+proj=tmerc +lat_0=39.25 +lon_0=-87.45 +k=1.00002 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7369":
        "+proj=tmerc +lat_0=40.55 +lon_0=-85.25 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7370":
        "+proj=tmerc +lat_0=40.55 +lon_0=-85.25 +k=1.000034 +x_0=240000 +y_0=36000 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7371":
        "+proj=geocent +ellps=GRS80 +towgs84=0.819,-0.5762,-1.6446,-0.00378,-0.03317,0.00318,0.0693 +units=m +no_defs",
      "EPSG:7372": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7373": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:7374":
        "+proj=utm +zone=39 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7375":
        "+proj=utm +zone=40 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7376":
        "+proj=utm +zone=41 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7400":
        "+proj=longlat +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +geoidgrids=fr_ign_RAF18.tif +vunits=m +no_defs",
      "EPSG:7401":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:7402":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:7403":
        "+proj=lcc +lat_1=44.1 +lat_0=44.1 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=3200000 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:7404":
        "+proj=longlat +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +vunits=m +no_defs",
      "EPSG:7405":
        "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:7406": "+proj=longlat +datum=NAD27 +vunits=us-ft +no_defs",
      "EPSG:7407":
        "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=34.65 +lat_2=36.1833333333333 +x_0=609601.219202438 +y_0=0 +datum=NAD27 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:7408":
        "+proj=sterea +lat_0=52.1561605555556 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +vunits=m +no_defs",
      "EPSG:7409":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:7410":
        "+proj=longlat +a=6378249.145 +rf=293.465 +towgs84=-180.624,-225.516,173.919,-0.81,-1.898,8.336,16.71006 +vunits=m +no_defs",
      "EPSG:7411":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:7412":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +geoidgrids=fr_ign_RAF18.tif +vunits=m +no_defs",
      "EPSG:7413":
        "+proj=lcc +lat_1=44.1 +lat_0=44.1 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=3200000 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +geoidgrids=fr_ign_RAF18.tif +vunits=m +no_defs",
      "EPSG:7414":
        "+proj=longlat +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +vunits=m +no_defs",
      "EPSG:7415":
        "+proj=sterea +lat_0=52.1561605555556 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +vunits=m +no_defs",
      "EPSG:7416":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:7417":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:7418":
        "+proj=tmerc +lat_0=0 +lon_0=9.5 +k=0.99995 +x_0=200000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:7419":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.99995 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:7420":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=dk_sdfe_dvr90.tif +vunits=m +no_defs",
      "EPSG:7421":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +geoidgrids=fr_ign_RAF18.tif +vunits=m +no_defs",
      "EPSG:7422":
        "+proj=lcc +lat_1=44.1 +lat_0=44.1 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=3200000 +ellps=clrk80ign +pm=paris +towgs84=-168,-60,320,0,0,0,0 +units=m +geoidgrids=fr_ign_RAF18.tif +vunits=m +no_defs",
      "EPSG:7423":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:7446": "+vunits=m +no_defs",
      "EPSG:7447": "+vunits=m +no_defs",
      "EPSG:7528":
        "+proj=tmerc +lat_0=43.3666666666667 +lon_0=-90 +k=1.0000365285 +x_0=147218.6942 +y_0=0.0037 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7529":
        "+proj=tmerc +lat_0=45.7061111111111 +lon_0=-90.6222222222222 +k=1.0000495683 +x_0=172821.9461 +y_0=0.0017 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7530":
        "+proj=tmerc +lat_0=45.1333333333333 +lon_0=-91.85 +k=1.0000486665 +x_0=93150 +y_0=0.0029 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7531":
        "+proj=lcc +lat_1=46.6696483772222 +lat_0=46.6696483772222 +lon_0=-91.1527777777778 +k_0=1.0000331195 +x_0=228600.4575 +y_0=148551.4837 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7532":
        "+proj=tmerc +lat_0=43 +lon_0=-88 +k=1.00002 +x_0=31600 +y_0=4600 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7533":
        "+proj=tmerc +lat_0=43.4813888888889 +lon_0=-91.7972222222222 +k=1.0000382778 +x_0=175260.3502 +y_0=0.0048 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7534":
        "+proj=lcc +lat_1=45.8987148658333 +lat_0=45.8987148658333 +lon_0=-92.4577777777778 +k_0=1.0000383841 +x_0=64008.1276 +y_0=59445.9043 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7535":
        "+proj=tmerc +lat_0=42.7194444444444 +lon_0=-88.5 +k=1.0000286569 +x_0=244754.8893 +y_0=0.0049 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7536":
        "+proj=lcc +lat_1=44.9778568986111 +lat_0=44.9778568986111 +lon_0=-91.2944444444444 +k_0=1.0000391127 +x_0=60045.72 +y_0=44091.4346 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7537":
        "+proj=tmerc +lat_0=43.6 +lon_0=-90.7083333333333 +k=1.0000463003 +x_0=199949.1989 +y_0=0.0086 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7538":
        "+proj=lcc +lat_1=43.4625466458333 +lat_0=43.4625466458333 +lon_0=-89.3944444444444 +k_0=1.00003498 +x_0=169164.3381 +y_0=111569.6134 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7539":
        "+proj=lcc +lat_1=43.200055605 +lat_0=43.200055605 +lon_0=-90.9388888888889 +k_0=1.0000349151 +x_0=113690.6274 +y_0=53703.1201 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7540":
        "+proj=lcc +lat_1=43.0695160375 +lat_0=43.0695160375 +lon_0=-89.4222222222222 +k_0=1.0000384786 +x_0=247193.2944 +y_0=146591.9896 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7541":
        "+proj=tmerc +lat_0=41.4722222222222 +lon_0=-88.775 +k=1.0000346418 +x_0=263347.7263 +y_0=0.0076 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7542":
        "+proj=tmerc +lat_0=44.4 +lon_0=-87.2722222222222 +k=1.0000187521 +x_0=158801.1176 +y_0=0.0023 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7543":
        "+proj=tmerc +lat_0=45.8833333333333 +lon_0=-91.9166666666667 +k=1.0000385418 +x_0=59131.3183 +y_0=0.0041 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7544":
        "+proj=tmerc +lat_0=44.4083333333333 +lon_0=-91.8944444444444 +k=1.0000410324 +x_0=51816.104 +y_0=0.003 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7545":
        "+proj=lcc +lat_1=44.8722811263889 +lat_0=44.8722811263889 +lon_0=-91.2888888888889 +k_0=1.000035079 +x_0=120091.4402 +y_0=91687.9239 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7546":
        "+proj=tmerc +lat_0=45.4388888888889 +lon_0=-88.1416666666667 +k=1.0000552095 +x_0=133502.6683 +y_0=0.0063 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7547":
        "+proj=tmerc +lat_0=44.0055555555556 +lon_0=-88.6333333333333 +k=1.0000673004 +x_0=275844.5533 +y_0=0.0157 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7548":
        "+proj=tmerc +lat_0=41.4111111111111 +lon_0=-90.8 +k=1.0000349452 +x_0=242316.4841 +y_0=0.01 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7549":
        "+proj=lcc +lat_1=42.6375622769444 +lat_0=42.6375622769444 +lon_0=-89.8388888888889 +k_0=1.0000390487 +x_0=170078.7403 +y_0=45830.2947 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7550":
        "+proj=lcc +lat_1=43.8070001177778 +lat_0=43.8070001177778 +lon_0=-89.2416666666667 +k_0=1.0000344057 +x_0=150876.3018 +y_0=79170.7795 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7551":
        "+proj=tmerc +lat_0=42.5388888888889 +lon_0=-90.1611111111111 +k=1.0000394961 +x_0=113081.0261 +y_0=0.0045 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7552":
        "+proj=tmerc +lat_0=45.4333333333333 +lon_0=-90.2555555555556 +k=1.0000677153 +x_0=220980.4419 +y_0=0.0085 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7553":
        "+proj=tmerc +lat_0=44.2533351277778 +lon_0=-90.8442965194444 +k=1.0000353 +x_0=27000 +y_0=25000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7554":
        "+proj=tmerc +lat_0=42.2166666666667 +lon_0=-87.8944444444444 +k=1.0000260649 +x_0=185928.3728 +y_0=0.0009 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7555":
        "+proj=tmerc +lat_0=43.2666666666667 +lon_0=-87.55 +k=1.0000233704 +x_0=79857.7614 +y_0=0.0012 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7556":
        "+proj=tmerc +lat_0=43.4511111111111 +lon_0=-91.3166666666667 +k=1.0000319985 +x_0=130454.6598 +y_0=0.0033 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7557":
        "+proj=lcc +lat_1=45.1542371052778 +lat_0=45.1542371052778 +lon_0=-89.0333333333333 +k_0=1.0000627024 +x_0=198425.197 +y_0=105279.7829 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7558":
        "+proj=tmerc +lat_0=44.8444444444444 +lon_0=-89.7333333333333 +k=1.0000599003 +x_0=116129.0323 +y_0=0.0058 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7559":
        "+proj=lcc +lat_1=44.9009044236111 +lat_0=44.9009044236111 +lon_0=-89.77 +k_0=1.000053289 +x_0=74676.1493 +y_0=55049.2669 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7560":
        "+proj=tmerc +lat_0=44.6916666666667 +lon_0=-87.7111111111111 +k=1.0000234982 +x_0=238658.8794 +y_0=0.0032 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7561":
        "+proj=tmerc +lat_0=44.7166666666667 +lon_0=-88.4166666666667 +k=1.0000362499 +x_0=105461.0121 +y_0=0.0029 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7562":
        "+proj=lcc +lat_1=44.0000739286111 +lat_0=44.0000739286111 +lon_0=-90.6416666666667 +k_0=1.0000434122 +x_0=204521.209 +y_0=121923.9861 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7563":
        "+proj=tmerc +lat_0=44.3972222222222 +lon_0=-87.9083333333333 +k=1.0000236869 +x_0=182880.3676 +y_0=0.0033 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7564":
        "+proj=lcc +lat_1=45.7042237702778 +lat_0=45.7042237702778 +lon_0=-89.5444444444444 +k_0=1.0000686968 +x_0=70104.1401 +y_0=57588.0346 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7565":
        "+proj=lcc +lat_1=44.6361488719444 +lat_0=44.6361488719444 +lon_0=-92.2277777777778 +k_0=1.0000362977 +x_0=167640.3354 +y_0=86033.0876 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7566":
        "+proj=tmerc +lat_0=44.6611111111111 +lon_0=-92.6333333333333 +k=1.0000433849 +x_0=141732.2823 +y_0=0.0059 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7567":
        "+proj=lcc +lat_1=44.4168239752778 +lat_0=44.4168239752778 +lon_0=-89.5 +k_0=1.000039936 +x_0=56388.1128 +y_0=50022.1874 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7568":
        "+proj=tmerc +lat_0=44.5555555555556 +lon_0=-90.4888888888889 +k=1.0000649554 +x_0=227990.8546 +y_0=0.0109 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7569":
        "+proj=lcc +lat_1=43.3223129275 +lat_0=43.3223129275 +lon_0=-90.4305555555556 +k_0=1.0000375653 +x_0=202387.6048 +y_0=134255.4253 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7570":
        "+proj=tmerc +lat_0=41.9444444444444 +lon_0=-89.0722222222222 +k=1.0000337311 +x_0=146304.2926 +y_0=0.0068 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7571":
        "+proj=tmerc +lat_0=43.9194444444444 +lon_0=-91.0666666666667 +k=1.0000495976 +x_0=250546.1013 +y_0=0.0234 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7572":
        "+proj=tmerc +lat_0=42.8194444444444 +lon_0=-89.9 +k=1.0000373868 +x_0=185623.5716 +y_0=0.0051 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7573":
        "+proj=lcc +lat_1=45.9000991313889 +lat_0=45.9000991313889 +lon_0=-91.1166666666667 +k_0=1.0000573461 +x_0=216713.2336 +y_0=120734.1631 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7574":
        "+proj=tmerc +lat_0=44.0361111111111 +lon_0=-88.6055555555556 +k=1.000032144 +x_0=262433.3253 +y_0=0.0096 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7575":
        "+proj=tmerc +lat_0=44.0361111111111 +lon_0=-92.6333333333333 +k=1.0000381803 +x_0=165506.7302 +y_0=0.0103 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7576":
        "+proj=lcc +lat_1=45.1778220858333 +lat_0=45.1778220858333 +lon_0=-90.4833333333333 +k_0=1.0000597566 +x_0=187147.5744 +y_0=107746.7522 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7577":
        "+proj=tmerc +lat_0=43.1611111111111 +lon_0=-91.3666666666667 +k=1.0000361538 +x_0=256946.9138 +y_0=0.0041 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7578":
        "+proj=lcc +lat_1=43.5750329397222 +lat_0=43.5750329397222 +lon_0=-90.7833333333333 +k_0=1.0000408158 +x_0=222504.4451 +y_0=47532.0602 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7579":
        "+proj=lcc +lat_1=46.0778440905556 +lat_0=46.0778440905556 +lon_0=-89.4888888888889 +k_0=1.0000730142 +x_0=134417.0689 +y_0=50337.1092 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7580":
        "+proj=lcc +lat_1=42.6694620969444 +lat_0=42.6694620969444 +lon_0=-88.5416666666667 +k_0=1.0000367192 +x_0=232562.8651 +y_0=111088.2224 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7581":
        "+proj=lcc +lat_1=45.9612198333333 +lat_0=45.9612198333333 +lon_0=-91.7833333333333 +k_0=1.0000475376 +x_0=234086.8682 +y_0=188358.6058 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7582":
        "+proj=tmerc +lat_0=42.9180555555556 +lon_0=-88.0638888888889 +k=1.00003738 +x_0=120091.4415 +y_0=0.003 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7583":
        "+proj=tmerc +lat_0=42.5694444444444 +lon_0=-88.225 +k=1.0000346179 +x_0=208788.418 +y_0=0.0034 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7584":
        "+proj=tmerc +lat_0=43.4202777777778 +lon_0=-88.8166666666667 +k=1.0000333645 +x_0=185013.9709 +y_0=0.007 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7585":
        "+proj=lcc +lat_1=44.1139440458333 +lat_0=44.1139440458333 +lon_0=-89.2416666666667 +k_0=1.0000392096 +x_0=120091.4402 +y_0=45069.7587 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7586":
        "+proj=lcc +lat_1=44.3625954694444 +lat_0=44.3625954694444 +lon_0=-90 +k_0=1.0000421209 +x_0=208483.6173 +y_0=134589.754 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7587":
        "+proj=tmerc +lat_0=43.3666666666667 +lon_0=-90 +k=1.0000365285 +x_0=147218.694132588 +y_0=0.00365760731521463 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7588":
        "+proj=tmerc +lat_0=45.7061111111111 +lon_0=-90.6222222222222 +k=1.0000495683 +x_0=172821.945948692 +y_0=0.00182880365760732 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7589":
        "+proj=tmerc +lat_0=45.1333333333333 +lon_0=-91.85 +k=1.0000486665 +x_0=93150 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7590":
        "+proj=lcc +lat_1=46.6696483772222 +lat_0=46.6696483772222 +lon_0=-91.1527777777778 +k_0=1.0000331195 +x_0=228600.457505715 +y_0=148551.483566167 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7591":
        "+proj=tmerc +lat_0=43 +lon_0=-88 +k=1.00002 +x_0=31599.9998983998 +y_0=4599.9998983998 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7592":
        "+proj=tmerc +lat_0=43.4813888888889 +lon_0=-91.7972222222222 +k=1.0000382778 +x_0=175260.3502159 +y_0=0.00487680975361951 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7593":
        "+proj=lcc +lat_1=45.8987148658333 +lat_0=45.8987148658333 +lon_0=-92.4577777777778 +k_0=1.0000383841 +x_0=64008.1277114554 +y_0=59445.9041910084 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7594":
        "+proj=tmerc +lat_0=42.7194444444444 +lon_0=-88.5 +k=1.0000286569 +x_0=244754.889204978 +y_0=0.00487680975361951 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7595":
        "+proj=lcc +lat_1=44.9778568986111 +lat_0=44.9778568986111 +lon_0=-91.2944444444444 +k_0=1.0000391127 +x_0=60045.7200914402 +y_0=44091.434493269 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7596":
        "+proj=tmerc +lat_0=43.6 +lon_0=-90.7083333333333 +k=1.0000463003 +x_0=199949.198983998 +y_0=0.00853441706883414 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7597":
        "+proj=lcc +lat_1=43.4625466458333 +lat_0=43.4625466458333 +lon_0=-89.3944444444444 +k_0=1.00003498 +x_0=169164.338023876 +y_0=111569.613512827 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7598":
        "+proj=lcc +lat_1=43.200055605 +lat_0=43.200055605 +lon_0=-90.9388888888889 +k_0=1.0000349151 +x_0=113690.627381255 +y_0=53703.1202438405 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7599":
        "+proj=lcc +lat_1=43.0695160375 +lat_0=43.0695160375 +lon_0=-89.4222222222222 +k_0=1.0000384786 +x_0=247193.294386589 +y_0=146591.989636779 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7600":
        "+proj=tmerc +lat_0=41.4722222222222 +lon_0=-88.775 +k=1.0000346418 +x_0=263347.726390653 +y_0=0.00762001524003048 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7601":
        "+proj=tmerc +lat_0=44.4 +lon_0=-87.2722222222222 +k=1.0000187521 +x_0=158801.117602235 +y_0=0.00243840487680975 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7602":
        "+proj=tmerc +lat_0=45.8833333333333 +lon_0=-91.9166666666667 +k=1.0000385418 +x_0=59131.3182626365 +y_0=0.00396240792481585 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7603":
        "+proj=tmerc +lat_0=44.4083333333333 +lon_0=-91.8944444444444 +k=1.0000410324 +x_0=51816.1039370079 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7604":
        "+proj=lcc +lat_1=44.8722811263889 +lat_0=44.8722811263889 +lon_0=-91.2888888888889 +k_0=1.000035079 +x_0=120091.44018288 +y_0=91687.9239014478 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7605":
        "+proj=tmerc +lat_0=45.4388888888889 +lon_0=-88.1416666666667 +k=1.0000552095 +x_0=133502.668224536 +y_0=0.0064008128016256 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7606":
        "+proj=tmerc +lat_0=44.0055555555556 +lon_0=-88.6333333333333 +k=1.0000673004 +x_0=275844.553213106 +y_0=0.0158496316992634 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7607":
        "+proj=tmerc +lat_0=41.4111111111111 +lon_0=-90.8 +k=1.0000349452 +x_0=242316.484023368 +y_0=0.0100584201168402 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7608":
        "+proj=lcc +lat_1=42.6375622769444 +lat_0=42.6375622769444 +lon_0=-89.8388888888889 +k_0=1.0000390487 +x_0=170078.74015748 +y_0=45830.2948437897 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7609":
        "+proj=lcc +lat_1=43.8070001177778 +lat_0=43.8070001177778 +lon_0=-89.2416666666667 +k_0=1.0000344057 +x_0=150876.301752604 +y_0=79170.7793751588 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7610":
        "+proj=tmerc +lat_0=42.5388888888889 +lon_0=-90.1611111111111 +k=1.0000394961 +x_0=113081.026162052 +y_0=0.00457200914401829 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7611":
        "+proj=tmerc +lat_0=45.4333333333333 +lon_0=-90.2555555555556 +k=1.0000677153 +x_0=220980.441960884 +y_0=0.00853441706883414 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7612":
        "+proj=tmerc +lat_0=44.2533351277778 +lon_0=-90.8442965194444 +k=1.0000353 +x_0=27000 +y_0=24999.9998983998 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7613":
        "+proj=tmerc +lat_0=42.2166666666667 +lon_0=-87.8944444444444 +k=1.0000260649 +x_0=185928.372771146 +y_0=0.000914401828803658 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7614":
        "+proj=tmerc +lat_0=43.2666666666667 +lon_0=-87.55 +k=1.0000233704 +x_0=79857.7615443231 +y_0=0.00121920243840488 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7615":
        "+proj=tmerc +lat_0=43.4511111111111 +lon_0=-91.3166666666667 +k=1.0000319985 +x_0=130454.659690119 +y_0=0.00335280670561341 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7616":
        "+proj=lcc +lat_1=45.1542371052778 +lat_0=45.1542371052778 +lon_0=-89.0333333333333 +k_0=1.0000627024 +x_0=198425.196850394 +y_0=105279.782880366 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7617":
        "+proj=tmerc +lat_0=44.8444444444444 +lon_0=-89.7333333333333 +k=1.0000599003 +x_0=116129.032258065 +y_0=0.00579121158242317 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7618":
        "+proj=lcc +lat_1=44.9009044236111 +lat_0=44.9009044236111 +lon_0=-89.77 +k_0=1.000053289 +x_0=74676.1493522987 +y_0=55049.2669545339 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7619":
        "+proj=tmerc +lat_0=44.6916666666667 +lon_0=-87.7111111111111 +k=1.0000234982 +x_0=238658.879451359 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7620":
        "+proj=tmerc +lat_0=44.7166666666667 +lon_0=-88.4166666666667 +k=1.0000362499 +x_0=105461.012141224 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7621":
        "+proj=lcc +lat_1=44.0000739286111 +lat_0=44.0000739286111 +lon_0=-90.6416666666667 +k_0=1.0000434122 +x_0=204521.209042418 +y_0=121923.986182372 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7622":
        "+proj=tmerc +lat_0=44.3972222222222 +lon_0=-87.9083333333333 +k=1.0000236869 +x_0=182880.367589535 +y_0=0.00335280670561341 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7623":
        "+proj=lcc +lat_1=45.7042237702778 +lat_0=45.7042237702778 +lon_0=-89.5444444444444 +k_0=1.0000686968 +x_0=70104.1402082804 +y_0=57588.0347472695 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7624":
        "+proj=lcc +lat_1=44.6361488719444 +lat_0=44.6361488719444 +lon_0=-92.2277777777778 +k_0=1.0000362977 +x_0=167640.335280671 +y_0=86033.0877317755 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7625":
        "+proj=tmerc +lat_0=44.6611111111111 +lon_0=-92.6333333333333 +k=1.0000433849 +x_0=141732.282245365 +y_0=0.00579121158242317 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7626":
        "+proj=lcc +lat_1=44.4168239752778 +lat_0=44.4168239752778 +lon_0=-89.5 +k_0=1.000039936 +x_0=56388.1127762256 +y_0=50022.1874523749 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7627":
        "+proj=tmerc +lat_0=44.5555555555556 +lon_0=-90.4888888888889 +k=1.0000649554 +x_0=227990.854457709 +y_0=0.0109728219456439 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7628":
        "+proj=lcc +lat_1=43.3223129275 +lat_0=43.3223129275 +lon_0=-90.4305555555556 +k_0=1.0000375653 +x_0=202387.60477521 +y_0=134255.425450851 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7629":
        "+proj=tmerc +lat_0=41.9444444444444 +lon_0=-89.0722222222222 +k=1.0000337311 +x_0=146304.292608585 +y_0=0.00670561341122682 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7630":
        "+proj=tmerc +lat_0=43.9194444444444 +lon_0=-91.0666666666667 +k=1.0000495976 +x_0=250546.101397003 +y_0=0.0234696469392939 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7631":
        "+proj=tmerc +lat_0=42.8194444444444 +lon_0=-89.9 +k=1.0000373868 +x_0=185623.571551943 +y_0=0.00518161036322073 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7632":
        "+proj=lcc +lat_1=45.9000991313889 +lat_0=45.9000991313889 +lon_0=-91.1166666666667 +k_0=1.0000573461 +x_0=216713.233731268 +y_0=120734.163169926 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7633":
        "+proj=tmerc +lat_0=44.0361111111111 +lon_0=-88.6055555555556 +k=1.000032144 +x_0=262433.32517145 +y_0=0.0094488188976378 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7634":
        "+proj=tmerc +lat_0=44.0361111111111 +lon_0=-92.6333333333333 +k=1.0000381803 +x_0=165506.73009906 +y_0=0.0103632207264415 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7635":
        "+proj=lcc +lat_1=45.1778220858333 +lat_0=45.1778220858333 +lon_0=-90.4833333333333 +k_0=1.0000597566 +x_0=187147.574295149 +y_0=107746.752146304 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7636":
        "+proj=tmerc +lat_0=43.1611111111111 +lon_0=-91.3666666666667 +k=1.0000361538 +x_0=256946.913893828 +y_0=0.00396240792481585 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7637":
        "+proj=lcc +lat_1=43.5750329397222 +lat_0=43.5750329397222 +lon_0=-90.7833333333333 +k_0=1.0000408158 +x_0=222504.44500889 +y_0=47532.0603505207 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7638":
        "+proj=lcc +lat_1=46.0778440905556 +lat_0=46.0778440905556 +lon_0=-89.4888888888889 +k_0=1.0000730142 +x_0=134417.068834138 +y_0=50337.1092710185 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7639":
        "+proj=lcc +lat_1=42.6694620969444 +lat_0=42.6694620969444 +lon_0=-88.5416666666667 +k_0=1.0000367192 +x_0=232562.86512573 +y_0=111088.222402845 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7640":
        "+proj=lcc +lat_1=45.9612198333333 +lat_0=45.9612198333333 +lon_0=-91.7833333333333 +k_0=1.0000475376 +x_0=234086.868173736 +y_0=188358.605943612 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7641":
        "+proj=tmerc +lat_0=42.9180555555556 +lon_0=-88.0638888888889 +k=1.00003738 +x_0=120091.441402083 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7642":
        "+proj=tmerc +lat_0=42.5694444444444 +lon_0=-88.225 +k=1.0000346179 +x_0=208788.417881636 +y_0=0.00335280670561341 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7643":
        "+proj=tmerc +lat_0=43.4202777777778 +lon_0=-88.8166666666667 +k=1.0000333645 +x_0=185013.970942342 +y_0=0.00701041402082804 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7644":
        "+proj=lcc +lat_1=44.1139440458333 +lat_0=44.1139440458333 +lon_0=-89.2416666666667 +k_0=1.0000392096 +x_0=120091.44018288 +y_0=45069.7588011176 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7645":
        "+proj=lcc +lat_1=44.3625954694444 +lat_0=44.3625954694444 +lon_0=-90 +k_0=1.0000421209 +x_0=208483.617272035 +y_0=134589.753924308 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:7651": "+vunits=m +no_defs",
      "EPSG:7652": "+vunits=m +no_defs",
      "EPSG:7656": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:7657": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7658": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:7659": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7660": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:7661": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7662": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:7663": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7664": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:7665": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7677":
        "+proj=geocent +a=6378136 +rf=298.257839303 +units=m +no_defs",
      "EPSG:7678": "+proj=longlat +a=6378136 +rf=298.257839303 +no_defs",
      "EPSG:7679":
        "+proj=geocent +a=6378136 +rf=298.257839303 +units=m +no_defs",
      "EPSG:7680": "+proj=longlat +a=6378136 +rf=298.257839303 +no_defs",
      "EPSG:7681": "+proj=geocent +ellps=GSK2011 +units=m +no_defs",
      "EPSG:7682": "+proj=longlat +ellps=GSK2011 +no_defs",
      "EPSG:7683": "+proj=longlat +ellps=GSK2011 +no_defs",
      "EPSG:7684": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7685": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7686": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7692":
        "+proj=tmerc +lat_0=0 +lon_0=68.5166666666667 +k=1 +x_0=1300000 +y_0=14743.5 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7693":
        "+proj=tmerc +lat_0=0 +lon_0=71.5166666666667 +k=1 +x_0=2300000 +y_0=14743.5 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7694":
        "+proj=tmerc +lat_0=0 +lon_0=74.5166666666667 +k=1 +x_0=3300000 +y_0=14743.5 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7695":
        "+proj=tmerc +lat_0=0 +lon_0=77.5166666666667 +k=1 +x_0=4300000 +y_0=14743.5 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7696":
        "+proj=tmerc +lat_0=0 +lon_0=80.5166666666667 +k=1 +x_0=5300000 +y_0=14743.5 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7699": "+vunits=m +no_defs",
      "EPSG:7700": "+vunits=m +no_defs",
      "EPSG:7707": "+geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:7755":
        "+proj=lcc +lat_0=24 +lon_0=80 +lat_1=12.472955 +lat_2=35.1728044444444 +x_0=4000000 +y_0=4000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7756":
        "+proj=lcc +lat_0=16.25543298 +lon_0=80.875 +lat_1=13.75 +lat_2=18.75 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7757":
        "+proj=lcc +lat_0=28.00157897 +lon_0=94.5 +lat_1=27 +lat_2=29 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7758":
        "+proj=lcc +lat_0=26.00257703 +lon_0=92.75 +lat_1=24.6666666666667 +lat_2=27.3333333333333 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7759":
        "+proj=lcc +lat_0=25.87725247 +lon_0=85.875 +lat_1=24.625 +lat_2=27.125 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7760":
        "+proj=lcc +lat_0=28.62510126 +lon_0=77 +lat_1=28.375 +lat_2=28.875 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7761":
        "+proj=lcc +lat_0=22.37807121 +lon_0=71.375 +lat_1=20.7916666666667 +lat_2=23.9583333333333 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7762":
        "+proj=lcc +lat_0=29.25226266 +lon_0=76 +lat_1=28.0833333333333 +lat_2=30.4166666666667 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7763":
        "+proj=lcc +lat_0=31.75183497 +lon_0=77.375 +lat_1=30.75 +lat_2=32.75 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7764":
        "+proj=lcc +lat_0=34.75570874 +lon_0=76.5 +lat_1=33.0833333333333 +lat_2=36.4166666666667 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7765":
        "+proj=lcc +lat_0=23.62652682 +lon_0=85.625 +lat_1=22.5416666666667 +lat_2=24.7083333333333 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7766":
        "+proj=lcc +lat_0=24.00529821 +lon_0=78.375 +lat_1=22 +lat_2=26 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7767":
        "+proj=lcc +lat_0=18.88015774 +lon_0=76.75 +lat_1=16.625 +lat_2=21.125 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7768":
        "+proj=lcc +lat_0=24.75060911 +lon_0=94 +lat_1=24.0833333333333 +lat_2=25.4166666666667 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7769":
        "+proj=lcc +lat_0=25.62524747 +lon_0=91.375 +lat_1=25.2083333333333 +lat_2=26.0416666666667 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7770":
        "+proj=lcc +lat_0=26.12581974 +lon_0=94.375 +lat_1=25.375 +lat_2=26.875 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7771":
        "+proj=lcc +lat_0=25.63452135 +lon_0=93.5 +lat_1=23.0416666666667 +lat_2=28.2083333333333 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7772":
        "+proj=lcc +lat_0=20.25305174 +lon_0=84.375 +lat_1=18.5833333333333 +lat_2=21.9166666666667 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7773":
        "+proj=lcc +lat_0=31.00178226 +lon_0=75.375 +lat_1=30 +lat_2=32 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7774":
        "+proj=lcc +lat_0=26.88505546 +lon_0=73.875 +lat_1=24.2916666666667 +lat_2=29.4583333333333 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7775":
        "+proj=lcc +lat_0=27.13270823 +lon_0=80.875 +lat_1=24.875 +lat_2=29.375 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7776":
        "+proj=lcc +lat_0=30.0017132 +lon_0=79.375 +lat_1=29 +lat_2=31 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7777":
        "+proj=tmerc +lat_0=10.25 +lon_0=93.25 +k=0.9999428 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7778":
        "+proj=tmerc +lat_0=21 +lon_0=82.25 +k=0.9998332 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7779":
        "+proj=tmerc +lat_0=15.375 +lon_0=74 +k=0.9999913 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7780":
        "+proj=tmerc +lat_0=15.125 +lon_0=76.375 +k=0.9998012 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7781":
        "+proj=tmerc +lat_0=10.5 +lon_0=76 +k=0.9999177 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7782":
        "+proj=tmerc +lat_0=10 +lon_0=73.125 +k=0.9999536 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7783":
        "+proj=tmerc +lat_0=23.125 +lon_0=92.75 +k=0.9999821 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7784":
        "+proj=tmerc +lat_0=27.625 +lon_0=88.5 +k=0.9999926 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7785":
        "+proj=tmerc +lat_0=10.875 +lon_0=78.375 +k=0.9997942 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7786":
        "+proj=tmerc +lat_0=23.75 +lon_0=91.75 +k=0.9999822 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7787":
        "+proj=tmerc +lat_0=24.375 +lon_0=87.875 +k=0.9998584 +x_0=1000000 +y_0=1000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:7789": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7791":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7792":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7793":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7794":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9985 +x_0=7000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7795":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=3000000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7796": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7797": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:7798": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:7799":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7800":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7801":
        "+proj=lcc +lat_0=42.6678756833333 +lon_0=25.5 +lat_1=42 +lat_2=43.3333333333333 +x_0=500000 +y_0=4725824.3591 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7803":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7804":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7805":
        "+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7815": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:7816": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:7825":
        "+proj=tmerc +lat_0=0.0833333333333333 +lon_0=23.5 +k=1 +x_0=1300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:7826":
        "+proj=tmerc +lat_0=0.0833333333333333 +lon_0=26.5 +k=1 +x_0=2300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:7827":
        "+proj=tmerc +lat_0=0.0833333333333333 +lon_0=29.5 +k=1 +x_0=3300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:7828":
        "+proj=tmerc +lat_0=0.0833333333333333 +lon_0=32.5 +k=1 +x_0=4300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:7829":
        "+proj=tmerc +lat_0=0.0833333333333333 +lon_0=35.5 +k=1 +x_0=5300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:7830":
        "+proj=tmerc +lat_0=0.0833333333333333 +lon_0=38.5 +k=1 +x_0=6300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:7831":
        "+proj=tmerc +lat_0=0.0833333333333333 +lon_0=41.5 +k=1 +x_0=7300000 +y_0=0 +ellps=krass +units=m +no_defs",
      "EPSG:7832": "+vunits=m +no_defs",
      "EPSG:7837": "+vunits=m +no_defs",
      "EPSG:7839": "+geoidgrids=nz_linz_nzgeoid2016.tif +vunits=m +no_defs",
      "EPSG:7841": "+vunits=m +no_defs",
      "EPSG:7842": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7843": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7844": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7845":
        "+proj=lcc +lat_0=0 +lon_0=134 +lat_1=-18 +lat_2=-36 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7846": "+proj=utm +zone=46 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7847": "+proj=utm +zone=47 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7848": "+proj=utm +zone=48 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7849": "+proj=utm +zone=49 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7850": "+proj=utm +zone=50 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7851": "+proj=utm +zone=51 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7852": "+proj=utm +zone=52 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7853": "+proj=utm +zone=53 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7854": "+proj=utm +zone=54 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7855": "+proj=utm +zone=55 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7856": "+proj=utm +zone=56 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7857": "+proj=utm +zone=57 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7858": "+proj=utm +zone=58 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7859": "+proj=utm +zone=59 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:7877":
        "+proj=tmerc +lat_0=-15.9666666666667 +lon_0=-5.71666666666667 +k=1 +x_0=300000 +y_0=2000000 +ellps=intl +units=m +no_defs",
      "EPSG:7878": "+proj=utm +zone=30 +south +ellps=intl +units=m +no_defs",
      "EPSG:7879": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:7880":
        "+proj=longlat +ellps=WGS84 +towgs84=-0.077,0.079,0.086,0,0,0,0 +no_defs",
      "EPSG:7881":
        "+proj=longlat +ellps=WGS84 +towgs84=-0.077,0.079,0.086,0,0,0,0 +no_defs",
      "EPSG:7882":
        "+proj=tmerc +lat_0=-15.9666666666667 +lon_0=-5.71666666666667 +k=1 +x_0=299483.737 +y_0=2000527.879 +ellps=WGS84 +towgs84=-0.077,0.079,0.086,0,0,0,0 +units=m +no_defs",
      "EPSG:7883":
        "+proj=utm +zone=30 +south +ellps=WGS84 +towgs84=-0.077,0.079,0.086,0,0,0,0 +units=m +no_defs",
      "EPSG:7884": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7885": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:7886": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:7887":
        "+proj=utm +zone=30 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:7888": "+vunits=m +no_defs",
      "EPSG:7889": "+vunits=m +no_defs",
      "EPSG:7890": "+geoidgrids=us_nga_egm08_25.tif +vunits=m +no_defs",
      "EPSG:7899":
        "+proj=lcc +lat_0=-37 +lon_0=145 +lat_1=-36 +lat_2=-38 +x_0=2500000 +y_0=2500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:7900": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7901": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7902": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7903": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7904": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7905": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7906": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7907": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7908": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7909": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7910": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7911": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7912": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7914": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7915": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7916": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7917": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7918": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7919": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7920": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7921": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7922": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7923": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7924": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7925": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7926": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7927": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7928": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7929": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7930": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:7931": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:7954":
        "+proj=utm +zone=30 +south +ellps=intl +units=m +vunits=m +no_defs",
      "EPSG:7955":
        "+proj=utm +zone=30 +south +ellps=WGS84 +towgs84=-0.077,0.079,0.086,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:7956":
        "+proj=utm +zone=30 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +geoidgrids=us_nga_egm08_25.tif +vunits=m +no_defs",
      "EPSG:7962": "+vunits=m +no_defs",
      "EPSG:7968": "+vunits=m +no_defs",
      "EPSG:7976": "+vunits=m +no_defs",
      "EPSG:7979": "+vunits=m +no_defs",
      "EPSG:7991":
        "+proj=tmerc +lat_0=0 +lon_0=-79.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:7992":
        "+proj=utm +zone=33 +south +ellps=intl +towgs84=-254.1,-5.36,-100.29,0,0,0,0 +units=m +no_defs",
      "EPSG:8013":
        "+proj=tmerc +lat_0=0 +lon_0=117.883333333333 +k=1.0000044 +x_0=50000 +y_0=4100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8014":
        "+proj=tmerc +lat_0=0 +lon_0=115.25 +k=1.0000022 +x_0=60000 +y_0=2700000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8015":
        "+proj=tmerc +lat_0=0 +lon_0=122.333333333333 +k=1.00000298 +x_0=50000 +y_0=2300000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8016":
        "+proj=tmerc +lat_0=0 +lon_0=115.433333333333 +k=0.99999592 +x_0=50000 +y_0=4000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8017":
        "+proj=tmerc +lat_0=0 +lon_0=113.666666666667 +k=0.99999796 +x_0=50000 +y_0=3050000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8018":
        "+proj=tmerc +lat_0=0 +lon_0=105.625 +k=1.00002514 +x_0=50000 +y_0=1400000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8019":
        "+proj=tmerc +lat_0=0 +lon_0=96.875 +k=0.99999387 +x_0=50000 +y_0=1600000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8020":
        "+proj=tmerc +lat_0=0 +lon_0=115.933333333333 +k=1.000019 +x_0=40000 +y_0=4100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8021":
        "+proj=tmerc +lat_0=0 +lon_0=121.883333333333 +k=1.0000055 +x_0=50000 +y_0=4050000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8022":
        "+proj=tmerc +lat_0=0 +lon_0=114.066666666667 +k=1.00000236 +x_0=50000 +y_0=2750000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8023":
        "+proj=tmerc +lat_0=0 +lon_0=114.583333333333 +k=1.00000628 +x_0=50000 +y_0=3450000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8024":
        "+proj=tmerc +lat_0=0 +lon_0=121.5 +k=1.00004949 +x_0=60000 +y_0=3800000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8025":
        "+proj=tmerc +lat_0=0 +lon_0=114.983333333333 +k=1.00000314 +x_0=50000 +y_0=3650000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8026":
        "+proj=tmerc +lat_0=0 +lon_0=114.315277777778 +k=1.000014 +x_0=55000 +y_0=3700000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8027":
        "+proj=tmerc +lat_0=0 +lon_0=116.933333333333 +k=0.9999989 +x_0=50000 +y_0=2550000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8028":
        "+proj=tmerc +lat_0=0 +lon_0=128.75 +k=1.0000165 +x_0=50000 +y_0=2100000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8029":
        "+proj=tmerc +lat_0=0 +lon_0=115.366666666667 +k=1.00000157 +x_0=50000 +y_0=3750000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8030":
        "+proj=tmerc +lat_0=0 +lon_0=115.166666666667 +k=1.0000055 +x_0=50000 +y_0=4050000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8031":
        "+proj=tmerc +lat_0=0 +lon_0=115.816666666667 +k=0.99999906 +x_0=50000 +y_0=3900000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8032":
        "+proj=tmerc +lat_0=0 +lon_0=118.6 +k=1.00000135 +x_0=50000 +y_0=2500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8035":
        "+proj=tmerc +lat_0=0 +lon_0=-63 +k=0.9996 +x_0=500000.0001016 +y_0=0 +datum=WGS84 +units=us-ft +no_defs",
      "EPSG:8036":
        "+proj=tmerc +lat_0=0 +lon_0=-57 +k=0.9996 +x_0=500000.0001016 +y_0=0 +datum=WGS84 +units=us-ft +no_defs",
      "EPSG:8042": "+proj=longlat +a=6376045 +rf=310 +pm=ferro +no_defs",
      "EPSG:8043": "+proj=longlat +a=6376045 +rf=310 +pm=ferro +no_defs",
      "EPSG:8044":
        "+proj=cass +lat_0=48.0384638888889 +lon_0=31.8041805555556 +x_0=0 +y_0=0 +a=6376045 +rf=310 +pm=ferro +units=m +no_defs",
      "EPSG:8045":
        "+proj=cass +lat_0=48.2087611111111 +lon_0=34.0409222222222 +x_0=0 +y_0=0 +a=6376045 +rf=310 +pm=ferro +units=m +no_defs",
      "EPSG:8050": "+vunits=ft +no_defs",
      "EPSG:8051": "+vunits=ft +no_defs",
      "EPSG:8052": "+vunits=us-ft +no_defs",
      "EPSG:8053": "+vunits=us-ft +no_defs",
      "EPSG:8058":
        "+proj=lcc +lat_0=-33.25 +lon_0=147 +lat_1=-30.75 +lat_2=-35.75 +x_0=9300000 +y_0=4500000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8059":
        "+proj=lcc +lat_0=-32 +lon_0=135 +lat_1=-28 +lat_2=-36 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8065":
        "+proj=omerc +lat_0=32.25 +lonc=-111.4 +alpha=45 +gamma=45 +k=1.00011 +x_0=48768 +y_0=243840 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8066":
        "+proj=tmerc +lat_0=31.25 +lon_0=-112.166666666667 +k=1.00009 +x_0=548640 +y_0=304800 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8067":
        "+proj=tmerc +lat_0=31.5 +lon_0=-113.166666666667 +k=1.000055 +x_0=182880 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8068":
        "+proj=lcc +lat_1=30.5 +lat_0=30.5 +lon_0=-110.75 +k_0=0.9998 +x_0=9144 +y_0=-188976 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8082":
        "+proj=tmerc +lat_0=0 +lon_0=-61.5 +k=0.9999 +x_0=24500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8083":
        "+proj=tmerc +lat_0=0 +lon_0=-64.5 +k=0.9999 +x_0=25500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8084": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8085": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8086": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8088":
        "+proj=lcc +lat_0=65 +lon_0=-19 +lat_1=64.25 +lat_2=65.75 +x_0=2700000 +y_0=300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:8089": "+vunits=m +no_defs",
      "EPSG:8090":
        "+proj=tmerc +lat_0=45.4388888888889 +lon_0=-88.1416666666667 +k=1.0000552095 +x_0=133502.6683 +y_0=0.0063 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8091":
        "+proj=tmerc +lat_0=45.4388888888889 +lon_0=-88.1416666666667 +k=1.0000552095 +x_0=133502.668224536 +y_0=0.0064008128016256 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8092":
        "+proj=lcc +lat_1=44.8722811263889 +lat_0=44.8722811263889 +lon_0=-91.2888888888889 +k_0=1.000035079 +x_0=120091.4402 +y_0=91687.9239 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8093":
        "+proj=lcc +lat_1=44.8722811263889 +lat_0=44.8722811263889 +lon_0=-91.2888888888889 +k_0=1.000035079 +x_0=120091.44018288 +y_0=91687.9239014478 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8095":
        "+proj=lcc +lat_1=44.3625954694444 +lat_0=44.3625954694444 +lon_0=-90 +k_0=1.0000421209 +x_0=208483.6173 +y_0=134589.754 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8096":
        "+proj=lcc +lat_1=44.3625954694444 +lat_0=44.3625954694444 +lon_0=-90 +k_0=1.0000421209 +x_0=208483.617272035 +y_0=134589.753924308 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8097":
        "+proj=lcc +lat_1=44.1139440458333 +lat_0=44.1139440458333 +lon_0=-89.2416666666667 +k_0=1.0000392096 +x_0=120091.4402 +y_0=45069.7587 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8098":
        "+proj=lcc +lat_1=44.1139440458333 +lat_0=44.1139440458333 +lon_0=-89.2416666666667 +k_0=1.0000392096 +x_0=120091.44018288 +y_0=45069.7588011176 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8099":
        "+proj=tmerc +lat_0=43.4202777777778 +lon_0=-88.8166666666667 +k=1.0000333645 +x_0=185013.9709 +y_0=0.007 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8100":
        "+proj=tmerc +lat_0=43.4202777777778 +lon_0=-88.8166666666667 +k=1.0000333645 +x_0=185013.970942342 +y_0=0.00701041402082804 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8101":
        "+proj=tmerc +lat_0=42.5694444444444 +lon_0=-88.225 +k=1.0000346179 +x_0=208788.418 +y_0=0.0034 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8102":
        "+proj=tmerc +lat_0=42.5694444444444 +lon_0=-88.225 +k=1.0000346179 +x_0=208788.417881636 +y_0=0.00335280670561341 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8103":
        "+proj=tmerc +lat_0=42.9180555555556 +lon_0=-88.0638888888889 +k=1.00003738 +x_0=120091.4415 +y_0=0.003 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8104":
        "+proj=tmerc +lat_0=42.9180555555556 +lon_0=-88.0638888888889 +k=1.00003738 +x_0=120091.441402083 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8105":
        "+proj=lcc +lat_1=45.9612198333333 +lat_0=45.9612198333333 +lon_0=-91.7833333333333 +k_0=1.0000475376 +x_0=234086.8682 +y_0=188358.6058 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8106":
        "+proj=lcc +lat_1=45.9612198333333 +lat_0=45.9612198333333 +lon_0=-91.7833333333333 +k_0=1.0000475376 +x_0=234086.868173736 +y_0=188358.605943612 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8107":
        "+proj=lcc +lat_1=42.6694620969444 +lat_0=42.6694620969444 +lon_0=-88.5416666666667 +k_0=1.0000367192 +x_0=232562.8651 +y_0=111088.2224 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8108":
        "+proj=lcc +lat_1=42.6694620969444 +lat_0=42.6694620969444 +lon_0=-88.5416666666667 +k_0=1.0000367192 +x_0=232562.86512573 +y_0=111088.222402845 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8109":
        "+proj=lcc +lat_1=46.0778440905556 +lat_0=46.0778440905556 +lon_0=-89.4888888888889 +k_0=1.0000730142 +x_0=134417.0689 +y_0=50337.1092 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8110":
        "+proj=lcc +lat_1=46.0778440905556 +lat_0=46.0778440905556 +lon_0=-89.4888888888889 +k_0=1.0000730142 +x_0=134417.068834138 +y_0=50337.1092710185 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8111":
        "+proj=lcc +lat_1=43.5750329397222 +lat_0=43.5750329397222 +lon_0=-90.7833333333333 +k_0=1.0000408158 +x_0=222504.4451 +y_0=47532.0602 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8112":
        "+proj=lcc +lat_1=43.5750329397222 +lat_0=43.5750329397222 +lon_0=-90.7833333333333 +k_0=1.0000408158 +x_0=222504.44500889 +y_0=47532.0603505207 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8113":
        "+proj=tmerc +lat_0=43.1611111111111 +lon_0=-91.3666666666667 +k=1.0000361538 +x_0=256946.9138 +y_0=0.0041 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8114":
        "+proj=tmerc +lat_0=43.1611111111111 +lon_0=-91.3666666666667 +k=1.0000361538 +x_0=256946.913893828 +y_0=0.00396240792481585 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8115":
        "+proj=lcc +lat_1=45.1778220858333 +lat_0=45.1778220858333 +lon_0=-90.4833333333333 +k_0=1.0000597566 +x_0=187147.5744 +y_0=107746.7522 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8116":
        "+proj=lcc +lat_1=45.1778220858333 +lat_0=45.1778220858333 +lon_0=-90.4833333333333 +k_0=1.0000597566 +x_0=187147.574295149 +y_0=107746.752146304 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8117":
        "+proj=tmerc +lat_0=44.0361111111111 +lon_0=-92.6333333333333 +k=1.0000381803 +x_0=165506.7302 +y_0=0.0103 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8118":
        "+proj=tmerc +lat_0=44.0361111111111 +lon_0=-92.6333333333333 +k=1.0000381803 +x_0=165506.73009906 +y_0=0.0103632207264415 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8119":
        "+proj=tmerc +lat_0=44.0361111111111 +lon_0=-88.6055555555556 +k=1.000032144 +x_0=262433.3253 +y_0=0.0096 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8120":
        "+proj=tmerc +lat_0=44.0361111111111 +lon_0=-88.6055555555556 +k=1.000032144 +x_0=262433.32517145 +y_0=0.0094488188976378 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8121":
        "+proj=lcc +lat_1=45.9000991313889 +lat_0=45.9000991313889 +lon_0=-91.1166666666667 +k_0=1.0000573461 +x_0=216713.2336 +y_0=120734.1631 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8122":
        "+proj=lcc +lat_1=45.9000991313889 +lat_0=45.9000991313889 +lon_0=-91.1166666666667 +k_0=1.0000573461 +x_0=216713.233731268 +y_0=120734.163169926 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8123":
        "+proj=tmerc +lat_0=42.8194444444444 +lon_0=-89.9 +k=1.0000373868 +x_0=185623.5716 +y_0=0.0051 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8124":
        "+proj=tmerc +lat_0=42.8194444444444 +lon_0=-89.9 +k=1.0000373868 +x_0=185623.571551943 +y_0=0.00518161036322073 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8125":
        "+proj=tmerc +lat_0=43.9194444444444 +lon_0=-91.0666666666667 +k=1.0000495976 +x_0=250546.1013 +y_0=0.0234 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8126":
        "+proj=tmerc +lat_0=43.9194444444444 +lon_0=-91.0666666666667 +k=1.0000495976 +x_0=250546.101397003 +y_0=0.0234696469392939 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8127":
        "+proj=tmerc +lat_0=41.9444444444444 +lon_0=-89.0722222222222 +k=1.0000337311 +x_0=146304.2926 +y_0=0.0068 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8128":
        "+proj=tmerc +lat_0=41.9444444444444 +lon_0=-89.0722222222222 +k=1.0000337311 +x_0=146304.292608585 +y_0=0.00670561341122682 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8129":
        "+proj=lcc +lat_1=43.3223129275 +lat_0=43.3223129275 +lon_0=-90.4305555555556 +k_0=1.0000375653 +x_0=202387.6048 +y_0=134255.4253 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8130":
        "+proj=lcc +lat_1=43.3223129275 +lat_0=43.3223129275 +lon_0=-90.4305555555556 +k_0=1.0000375653 +x_0=202387.60477521 +y_0=134255.425450851 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8131":
        "+proj=tmerc +lat_0=44.5555555555556 +lon_0=-90.4888888888889 +k=1.0000649554 +x_0=227990.8546 +y_0=0.0109 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8132":
        "+proj=tmerc +lat_0=44.5555555555556 +lon_0=-90.4888888888889 +k=1.0000649554 +x_0=227990.854457709 +y_0=0.0109728219456439 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8133":
        "+proj=lcc +lat_1=44.4168239752778 +lat_0=44.4168239752778 +lon_0=-89.5 +k_0=1.000039936 +x_0=56388.1128 +y_0=50022.1874 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8134":
        "+proj=lcc +lat_1=44.4168239752778 +lat_0=44.4168239752778 +lon_0=-89.5 +k_0=1.000039936 +x_0=56388.1127762256 +y_0=50022.1874523749 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8135":
        "+proj=tmerc +lat_0=44.6611111111111 +lon_0=-92.6333333333333 +k=1.0000433849 +x_0=141732.2823 +y_0=0.0059 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8136":
        "+proj=tmerc +lat_0=44.6611111111111 +lon_0=-92.6333333333333 +k=1.0000433849 +x_0=141732.282245365 +y_0=0.00579121158242317 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8137":
        "+proj=lcc +lat_1=44.6361488719444 +lat_0=44.6361488719444 +lon_0=-92.2277777777778 +k_0=1.0000362977 +x_0=167640.3354 +y_0=86033.0876 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8138":
        "+proj=lcc +lat_1=44.6361488719444 +lat_0=44.6361488719444 +lon_0=-92.2277777777778 +k_0=1.0000362977 +x_0=167640.335280671 +y_0=86033.0877317755 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8139":
        "+proj=lcc +lat_1=45.7042237702778 +lat_0=45.7042237702778 +lon_0=-89.5444444444444 +k_0=1.0000686968 +x_0=70104.1401 +y_0=57588.0346 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8140":
        "+proj=lcc +lat_1=45.7042237702778 +lat_0=45.7042237702778 +lon_0=-89.5444444444444 +k_0=1.0000686968 +x_0=70104.1402082804 +y_0=57588.0347472695 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8141":
        "+proj=tmerc +lat_0=44.3972222222222 +lon_0=-87.9083333333333 +k=1.0000236869 +x_0=182880.3676 +y_0=0.0033 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8142":
        "+proj=tmerc +lat_0=44.3972222222222 +lon_0=-87.9083333333333 +k=1.0000236869 +x_0=182880.367589535 +y_0=0.00335280670561341 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8143":
        "+proj=lcc +lat_1=44.0000739286111 +lat_0=44.0000739286111 +lon_0=-90.6416666666667 +k_0=1.0000434122 +x_0=204521.209 +y_0=121923.9861 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8144":
        "+proj=lcc +lat_1=44.0000739286111 +lat_0=44.0000739286111 +lon_0=-90.6416666666667 +k_0=1.0000434122 +x_0=204521.209042418 +y_0=121923.986182372 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8145":
        "+proj=tmerc +lat_0=44.7166666666667 +lon_0=-88.4166666666667 +k=1.0000362499 +x_0=105461.0121 +y_0=0.0029 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8146":
        "+proj=tmerc +lat_0=44.7166666666667 +lon_0=-88.4166666666667 +k=1.0000362499 +x_0=105461.012141224 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8147":
        "+proj=tmerc +lat_0=44.6916666666667 +lon_0=-87.7111111111111 +k=1.0000234982 +x_0=238658.8794 +y_0=0.0032 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8148":
        "+proj=tmerc +lat_0=44.6916666666667 +lon_0=-87.7111111111111 +k=1.0000234982 +x_0=238658.879451359 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8149":
        "+proj=lcc +lat_1=44.9009044236111 +lat_0=44.9009044236111 +lon_0=-89.77 +k_0=1.000053289 +x_0=74676.1493 +y_0=55049.2669 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8150":
        "+proj=lcc +lat_1=44.9009044236111 +lat_0=44.9009044236111 +lon_0=-89.77 +k_0=1.000053289 +x_0=74676.1493522987 +y_0=55049.2669545339 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8151":
        "+proj=tmerc +lat_0=44.8444444444444 +lon_0=-89.7333333333333 +k=1.0000599003 +x_0=116129.0323 +y_0=0.0058 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8152":
        "+proj=tmerc +lat_0=44.8444444444444 +lon_0=-89.7333333333333 +k=1.0000599003 +x_0=116129.032258065 +y_0=0.00579121158242317 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8153":
        "+proj=lcc +lat_1=45.1542371052778 +lat_0=45.1542371052778 +lon_0=-89.0333333333333 +k_0=1.0000627024 +x_0=198425.197 +y_0=105279.7829 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8154":
        "+proj=lcc +lat_1=45.1542371052778 +lat_0=45.1542371052778 +lon_0=-89.0333333333333 +k_0=1.0000627024 +x_0=198425.196850394 +y_0=105279.782880366 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8155":
        "+proj=tmerc +lat_0=43.4511111111111 +lon_0=-91.3166666666667 +k=1.0000319985 +x_0=130454.6598 +y_0=0.0033 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8156":
        "+proj=tmerc +lat_0=43.4511111111111 +lon_0=-91.3166666666667 +k=1.0000319985 +x_0=130454.659690119 +y_0=0.00335280670561341 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8157":
        "+proj=tmerc +lat_0=43.2666666666667 +lon_0=-87.55 +k=1.0000233704 +x_0=79857.7614 +y_0=0.0012 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8158":
        "+proj=tmerc +lat_0=43.2666666666667 +lon_0=-87.55 +k=1.0000233704 +x_0=79857.7615443231 +y_0=0.00121920243840488 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8159":
        "+proj=tmerc +lat_0=42.2166666666667 +lon_0=-87.8944444444444 +k=1.0000260649 +x_0=185928.3728 +y_0=0.0009 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8160":
        "+proj=tmerc +lat_0=42.2166666666667 +lon_0=-87.8944444444444 +k=1.0000260649 +x_0=185928.372771146 +y_0=0.000914401828803658 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8161":
        "+proj=tmerc +lat_0=44.2533351277778 +lon_0=-90.8442965194444 +k=1.0000353 +x_0=27000 +y_0=25000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8162":
        "+proj=tmerc +lat_0=44.2533351277778 +lon_0=-90.8442965194444 +k=1.0000353 +x_0=27000 +y_0=24999.9998983998 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8163":
        "+proj=tmerc +lat_0=45.4333333333333 +lon_0=-90.2555555555556 +k=1.0000677153 +x_0=220980.4419 +y_0=0.0085 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8164":
        "+proj=tmerc +lat_0=45.4333333333333 +lon_0=-90.2555555555556 +k=1.0000677153 +x_0=220980.441960884 +y_0=0.00853441706883414 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8165":
        "+proj=tmerc +lat_0=42.5388888888889 +lon_0=-90.1611111111111 +k=1.0000394961 +x_0=113081.0261 +y_0=0.0045 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8166":
        "+proj=tmerc +lat_0=42.5388888888889 +lon_0=-90.1611111111111 +k=1.0000394961 +x_0=113081.026162052 +y_0=0.00457200914401829 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8167":
        "+proj=lcc +lat_1=43.8070001177778 +lat_0=43.8070001177778 +lon_0=-89.2416666666667 +k_0=1.0000344057 +x_0=150876.3018 +y_0=79170.7795 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8168":
        "+proj=lcc +lat_1=43.8070001177778 +lat_0=43.8070001177778 +lon_0=-89.2416666666667 +k_0=1.0000344057 +x_0=150876.301752604 +y_0=79170.7793751588 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8169":
        "+proj=lcc +lat_1=42.6375622769444 +lat_0=42.6375622769444 +lon_0=-89.8388888888889 +k_0=1.0000390487 +x_0=170078.7403 +y_0=45830.2947 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8170":
        "+proj=lcc +lat_1=42.6375622769444 +lat_0=42.6375622769444 +lon_0=-89.8388888888889 +k_0=1.0000390487 +x_0=170078.74015748 +y_0=45830.2948437897 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8171":
        "+proj=tmerc +lat_0=41.4111111111111 +lon_0=-90.8 +k=1.0000349452 +x_0=242316.4841 +y_0=0.01 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8172":
        "+proj=tmerc +lat_0=41.4111111111111 +lon_0=-90.8 +k=1.0000349452 +x_0=242316.484023368 +y_0=0.0100584201168402 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8173":
        "+proj=tmerc +lat_0=44.0055555555556 +lon_0=-88.6333333333333 +k=1.0000673004 +x_0=275844.5533 +y_0=0.0157 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8177":
        "+proj=tmerc +lat_0=44.0055555555556 +lon_0=-88.6333333333333 +k=1.0000673004 +x_0=275844.553213106 +y_0=0.0158496316992634 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8179":
        "+proj=tmerc +lat_0=44.4083333333333 +lon_0=-91.8944444444444 +k=1.0000410324 +x_0=51816.104 +y_0=0.003 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8180":
        "+proj=tmerc +lat_0=44.4083333333333 +lon_0=-91.8944444444444 +k=1.0000410324 +x_0=51816.1039370079 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8181":
        "+proj=tmerc +lat_0=45.8833333333333 +lon_0=-91.9166666666667 +k=1.0000385418 +x_0=59131.3183 +y_0=0.0041 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8182":
        "+proj=tmerc +lat_0=45.8833333333333 +lon_0=-91.9166666666667 +k=1.0000385418 +x_0=59131.3182626365 +y_0=0.00396240792481585 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8184":
        "+proj=tmerc +lat_0=44.4 +lon_0=-87.2722222222222 +k=1.0000187521 +x_0=158801.1176 +y_0=0.0023 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8185":
        "+proj=tmerc +lat_0=44.4 +lon_0=-87.2722222222222 +k=1.0000187521 +x_0=158801.117602235 +y_0=0.00243840487680975 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8187":
        "+proj=tmerc +lat_0=41.4722222222222 +lon_0=-88.775 +k=1.0000346418 +x_0=263347.7263 +y_0=0.0076 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8189":
        "+proj=tmerc +lat_0=41.4722222222222 +lon_0=-88.775 +k=1.0000346418 +x_0=263347.726390653 +y_0=0.00762001524003048 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8191":
        "+proj=lcc +lat_1=43.0695160375 +lat_0=43.0695160375 +lon_0=-89.4222222222222 +k_0=1.0000384786 +x_0=247193.2944 +y_0=146591.9896 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8193":
        "+proj=lcc +lat_1=43.0695160375 +lat_0=43.0695160375 +lon_0=-89.4222222222222 +k_0=1.0000384786 +x_0=247193.294386589 +y_0=146591.989636779 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8196":
        "+proj=lcc +lat_1=43.200055605 +lat_0=43.200055605 +lon_0=-90.9388888888889 +k_0=1.0000349151 +x_0=113690.6274 +y_0=53703.1201 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8197":
        "+proj=lcc +lat_1=43.200055605 +lat_0=43.200055605 +lon_0=-90.9388888888889 +k_0=1.0000349151 +x_0=113690.627381255 +y_0=53703.1202438405 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8198":
        "+proj=lcc +lat_1=43.4625466458333 +lat_0=43.4625466458333 +lon_0=-89.3944444444444 +k_0=1.00003498 +x_0=169164.3381 +y_0=111569.6134 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8200":
        "+proj=lcc +lat_1=43.4625466458333 +lat_0=43.4625466458333 +lon_0=-89.3944444444444 +k_0=1.00003498 +x_0=169164.338023876 +y_0=111569.613512827 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8201":
        "+proj=tmerc +lat_0=43.6 +lon_0=-90.7083333333333 +k=1.0000463003 +x_0=199949.1989 +y_0=0.0086 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8202":
        "+proj=tmerc +lat_0=43.6 +lon_0=-90.7083333333333 +k=1.0000463003 +x_0=199949.198983998 +y_0=0.00853441706883414 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8203":
        "+proj=lcc +lat_1=44.9778568986111 +lat_0=44.9778568986111 +lon_0=-91.2944444444444 +k_0=1.0000391127 +x_0=60045.72 +y_0=44091.4346 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8204":
        "+proj=lcc +lat_1=44.9778568986111 +lat_0=44.9778568986111 +lon_0=-91.2944444444444 +k_0=1.0000391127 +x_0=60045.7200914402 +y_0=44091.434493269 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8205":
        "+proj=tmerc +lat_0=42.7194444444444 +lon_0=-88.5 +k=1.0000286569 +x_0=244754.8893 +y_0=0.0049 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8206":
        "+proj=tmerc +lat_0=42.7194444444444 +lon_0=-88.5 +k=1.0000286569 +x_0=244754.889204978 +y_0=0.00487680975361951 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8207":
        "+proj=lcc +lat_1=45.8987148658333 +lat_0=45.8987148658333 +lon_0=-92.4577777777778 +k_0=1.0000383841 +x_0=64008.1276 +y_0=59445.9043 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8208":
        "+proj=lcc +lat_1=45.8987148658333 +lat_0=45.8987148658333 +lon_0=-92.4577777777778 +k_0=1.0000383841 +x_0=64008.1277114554 +y_0=59445.9041910084 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8209":
        "+proj=tmerc +lat_0=43.4813888888889 +lon_0=-91.7972222222222 +k=1.0000382778 +x_0=175260.3502 +y_0=0.0048 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8210":
        "+proj=tmerc +lat_0=43.4813888888889 +lon_0=-91.7972222222222 +k=1.0000382778 +x_0=175260.3502159 +y_0=0.00487680975361951 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8212":
        "+proj=tmerc +lat_0=43 +lon_0=-88 +k=1.00002 +x_0=31600 +y_0=4600 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8213":
        "+proj=tmerc +lat_0=43 +lon_0=-88 +k=1.00002 +x_0=31599.9998983998 +y_0=4599.9998983998 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8214":
        "+proj=lcc +lat_1=46.6696483772222 +lat_0=46.6696483772222 +lon_0=-91.1527777777778 +k_0=1.0000331195 +x_0=228600.4575 +y_0=148551.4837 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8216":
        "+proj=lcc +lat_1=46.6696483772222 +lat_0=46.6696483772222 +lon_0=-91.1527777777778 +k_0=1.0000331195 +x_0=228600.457505715 +y_0=148551.483566167 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8218":
        "+proj=tmerc +lat_0=45.1333333333333 +lon_0=-91.85 +k=1.0000486665 +x_0=93150 +y_0=0.0029 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8220":
        "+proj=tmerc +lat_0=45.1333333333333 +lon_0=-91.85 +k=1.0000486665 +x_0=93150 +y_0=0.00304800609601219 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8222":
        "+proj=tmerc +lat_0=45.7061111111111 +lon_0=-90.6222222222222 +k=1.0000495683 +x_0=172821.9461 +y_0=0.0017 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8224":
        "+proj=tmerc +lat_0=45.7061111111111 +lon_0=-90.6222222222222 +k=1.0000495683 +x_0=172821.945948692 +y_0=0.00182880365760732 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8225":
        "+proj=tmerc +lat_0=43.3666666666667 +lon_0=-90 +k=1.0000365285 +x_0=147218.6942 +y_0=0.0037 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8226":
        "+proj=tmerc +lat_0=43.3666666666667 +lon_0=-90 +k=1.0000365285 +x_0=147218.694132588 +y_0=0.00365760731521463 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8227": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8228": "+vunits=ft +no_defs",
      "EPSG:8230": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8231": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8232": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8233": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8235": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8237": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8238": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8239": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8240": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8242": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8244": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8246": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8247": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8248": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8249": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8250": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8251": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8252": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8253": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8254": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8255": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8266": "+geoidgrids=dk_sdfe_gvr2000.tif +vunits=m +no_defs",
      "EPSG:8267": "+geoidgrids=dk_sdfe_gvr2016.tif +vunits=m +no_defs",
      "EPSG:8311":
        "+proj=tmerc +lat_0=43.5 +lon_0=-117.666666666667 +k=1.00014 +x_0=90000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8312":
        "+proj=tmerc +lat_0=43.5 +lon_0=-117.666666666667 +k=1.00014 +x_0=90000.00001488 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8313":
        "+proj=tmerc +lat_0=43.5 +lon_0=-119 +k=1.00022 +x_0=20000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8314":
        "+proj=tmerc +lat_0=43.5 +lon_0=-119 +k=1.00022 +x_0=19999.99999992 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8315":
        "+proj=lcc +lat_1=45.5833333333333 +lat_0=45.5833333333333 +lon_0=-123.416666666667 +k_0=1.000045 +x_0=30000 +y_0=20000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8316":
        "+proj=lcc +lat_1=45.5833333333333 +lat_0=45.5833333333333 +lon_0=-123.416666666667 +k_0=1.000045 +x_0=30000.00001512 +y_0=19999.99999992 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8317":
        "+proj=tmerc +lat_0=44.25 +lon_0=-119.633333333333 +k=1.00012 +x_0=20000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8318":
        "+proj=tmerc +lat_0=44.25 +lon_0=-119.633333333333 +k=1.00012 +x_0=19999.99999992 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8319":
        "+proj=tmerc +lat_0=41.75 +lon_0=-118.416666666667 +k=1.00019 +x_0=80000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8320":
        "+proj=tmerc +lat_0=41.75 +lon_0=-118.416666666667 +k=1.00019 +x_0=79999.99999968 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8321":
        "+proj=lcc +lat_1=45.25 +lat_0=45.25 +lon_0=-117.25 +k_0=1.000085 +x_0=40000 +y_0=70000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8322":
        "+proj=lcc +lat_1=45.25 +lat_0=45.25 +lon_0=-117.25 +k_0=1.000085 +x_0=39999.99999984 +y_0=70000.00001496 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8323":
        "+proj=lcc +lat_1=42 +lat_0=42 +lon_0=-122.25 +k_0=1.00004 +x_0=60000 +y_0=-60000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8324":
        "+proj=lcc +lat_1=42 +lat_0=42 +lon_0=-122.25 +k_0=1.00004 +x_0=59999.99999976 +y_0=-59999.99999976 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8325":
        "+proj=lcc +lat_1=47 +lat_0=47 +lon_0=-120.25 +k_0=0.99927 +x_0=30000 +y_0=290000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8326":
        "+proj=lcc +lat_1=47 +lat_0=47 +lon_0=-120.25 +k_0=0.99927 +x_0=30000.00001512 +y_0=290000.00001408 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8327":
        "+proj=lcc +lat_1=46.1666666666667 +lat_0=46.1666666666667 +lon_0=-120.5 +k_0=1 +x_0=100000 +y_0=140000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8328":
        "+proj=lcc +lat_1=46.1666666666667 +lat_0=46.1666666666667 +lon_0=-120.5 +k_0=1 +x_0=99999.9999996 +y_0=139999.99999944 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8329":
        "+proj=lcc +lat_1=43.5 +lat_0=43.5 +lon_0=-120.5 +k_0=1.00006 +x_0=40000 +y_0=-80000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8330":
        "+proj=lcc +lat_1=43.5 +lat_0=43.5 +lon_0=-120.5 +k_0=1.00006 +x_0=39999.99999984 +y_0=-79999.99999968 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8331":
        "+proj=tmerc +lat_0=41.75 +lon_0=-117.583333333333 +k=1.00018 +x_0=70000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8332":
        "+proj=tmerc +lat_0=41.75 +lon_0=-117.583333333333 +k=1.00018 +x_0=70000.00001496 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8333":
        "+proj=lcc +lat_1=46.1666666666667 +lat_0=46.1666666666667 +lon_0=-119 +k_0=1.000025 +x_0=50000 +y_0=130000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8334":
        "+proj=lcc +lat_1=46.1666666666667 +lat_0=46.1666666666667 +lon_0=-119 +k_0=1.000025 +x_0=50000.00001504 +y_0=130000.00001472 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8335":
        "+proj=lcc +lat_1=44 +lat_0=44 +lon_0=-118 +k_0=1.00017 +x_0=60000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8336":
        "+proj=lcc +lat_1=44 +lat_0=44 +lon_0=-118 +k_0=1.00017 +x_0=59999.99999976 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8337":
        "+proj=tmerc +lat_0=41.75 +lon_0=-120.333333333333 +k=1.000215 +x_0=70000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8338":
        "+proj=tmerc +lat_0=41.75 +lon_0=-120.333333333333 +k=1.000215 +x_0=70000.00001496 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8339":
        "+proj=lcc +lat_1=42.5 +lat_0=42.5 +lon_0=-122.583333333333 +k_0=1.00015 +x_0=10000 +y_0=60000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8340":
        "+proj=lcc +lat_1=42.5 +lat_0=42.5 +lon_0=-122.583333333333 +k_0=1.00015 +x_0=10000.0000152 +y_0=59999.99999976 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8341":
        "+proj=lcc +lat_1=45.25 +lat_0=45.25 +lon_0=-119 +k_0=1.00014 +x_0=30000 +y_0=90000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8342":
        "+proj=lcc +lat_1=45.25 +lat_0=45.25 +lon_0=-119 +k_0=1.00014 +x_0=30000.00001512 +y_0=90000.00001488 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8343":
        "+proj=tmerc +lat_0=45.25 +lon_0=-117.5 +k=1.000195 +x_0=60000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8344":
        "+proj=tmerc +lat_0=45.25 +lon_0=-117.5 +k=1.000195 +x_0=59999.99999976 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8345":
        "+proj=lcc +lat_1=42.5 +lat_0=42.5 +lon_0=-120 +k_0=1.000245 +x_0=40000 +y_0=60000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8346":
        "+proj=lcc +lat_1=42.5 +lat_0=42.5 +lon_0=-120 +k_0=1.000245 +x_0=39999.99999984 +y_0=59999.99999976 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8347":
        "+proj=tmerc +lat_0=43 +lon_0=-122 +k=1.000223 +x_0=20000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8348":
        "+proj=tmerc +lat_0=43 +lon_0=-122 +k=1.000223 +x_0=19999.99999992 +y_0=0 +ellps=GRS80 +units=ft +no_defs",
      "EPSG:8349":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=dk_sdfe_gvr2000.tif +vunits=m +no_defs",
      "EPSG:8350":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=dk_sdfe_gvr2016.tif +vunits=m +no_defs",
      "EPSG:8351":
        "+proj=longlat +ellps=bessel +towgs84=485.021,169.465,483.839,7.786342,4.397554,4.102655,0 +no_defs",
      "EPSG:8352":
        "+proj=krovak +axis=swu +lat_0=49.5 +lon_0=24.8333333333333 +alpha=30.2881397527778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=485.021,169.465,483.839,7.786342,4.397554,4.102655,0 +units=m +no_defs",
      "EPSG:8353":
        "+proj=krovak +lat_0=49.5 +lon_0=24.8333333333333 +alpha=30.2881397527778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=485.021,169.465,483.839,7.786342,4.397554,4.102655,0 +units=m +no_defs",
      "EPSG:8357": "+vunits=m +no_defs",
      "EPSG:8358": "+vunits=m +no_defs",
      "EPSG:8360":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:8370":
        "+proj=lcc +lat_0=50.797815 +lon_0=4.35921583333333 +lat_1=49.8333333333333 +lat_2=51.1666666666667 +x_0=649328 +y_0=665262 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs",
      "EPSG:8378": "+vunits=m +no_defs",
      "EPSG:8379":
        "+proj=tmerc +lat_0=36.25 +lon_0=-114.966666666667 +k=1.0001 +x_0=100000 +y_0=200000 +datum=NAD83 +units=m +no_defs",
      "EPSG:8380":
        "+proj=tmerc +lat_0=36.25 +lon_0=-114.966666666667 +k=1.0001 +x_0=99999.99998984 +y_0=200000.00001016 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:8381":
        "+proj=tmerc +lat_0=36.25 +lon_0=-114.966666666667 +k=1.000135 +x_0=300000 +y_0=400000 +datum=NAD83 +units=m +no_defs",
      "EPSG:8382":
        "+proj=tmerc +lat_0=36.25 +lon_0=-114.966666666667 +k=1.000135 +x_0=300000 +y_0=399999.99998984 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:8383":
        "+proj=tmerc +lat_0=36.25 +lon_0=-114.966666666667 +k=1.0001 +x_0=100000 +y_0=200000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8384":
        "+proj=tmerc +lat_0=36.25 +lon_0=-114.966666666667 +k=1.0001 +x_0=99999.99998984 +y_0=200000.00001016 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8385":
        "+proj=tmerc +lat_0=36.25 +lon_0=-114.966666666667 +k=1.000135 +x_0=300000 +y_0=400000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8387":
        "+proj=tmerc +lat_0=36.25 +lon_0=-114.966666666667 +k=1.000135 +x_0=300000 +y_0=399999.99998984 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8391":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=0.999929 +x_0=300000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8395":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:8397": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8399": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8401": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8403": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8425": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8426": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8427": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8428": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:8429": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8430": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8431": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8433":
        "+proj=tmerc +lat_0=22.2123972222222 +lon_0=113.536469444444 +k=1 +x_0=20000 +y_0=20000 +ellps=intl +units=m +no_defs",
      "EPSG:8434": "+vunits=m +no_defs",
      "EPSG:8441":
        "+proj=labrd +lat_0=-18.9 +lon_0=46.4372291666667 +azi=18.9 +k=0.9995 +x_0=400000 +y_0=800000 +ellps=intl +units=m +no_defs",
      "EPSG:8449": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8455": "+proj=utm +zone=53 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:8456": "+proj=utm +zone=54 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:8518":
        "+proj=tmerc +lat_0=37.5 +lon_0=-101.6 +k=1.000156 +x_0=457200.914401829 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8519":
        "+proj=tmerc +lat_0=37.5 +lon_0=-100.95 +k=1.000134 +x_0=762001.524003048 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8520":
        "+proj=tmerc +lat_0=37.5 +lon_0=-100.35 +k=1.000116 +x_0=1066802.13360427 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8521":
        "+proj=tmerc +lat_0=37.5 +lon_0=-99.45 +k=1.000082 +x_0=1371602.74320549 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8522":
        "+proj=tmerc +lat_0=37.5 +lon_0=-98.6666666666667 +k=1.000078 +x_0=1676403.35280671 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8523":
        "+proj=tmerc +lat_0=37.5 +lon_0=-98.15 +k=1.000068 +x_0=1981203.96240793 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8524":
        "+proj=tmerc +lat_0=37.5 +lon_0=-97.3333333333333 +k=1.000049 +x_0=2286004.57200914 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8525":
        "+proj=lcc +lat_1=39.1666666666667 +lat_0=39.1666666666667 +lon_0=-96.5 +k_0=1.000044 +x_0=2590805.18161036 +y_0=182880.365760732 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8526":
        "+proj=lcc +lat_1=38.5 +lat_0=38.5 +lon_0=-96.5 +k_0=1.00005 +x_0=2895605.79121158 +y_0=91440.1828803658 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8527":
        "+proj=lcc +lat_1=39.6333333333333 +lat_0=39.6333333333333 +lon_0=-95.75 +k_0=1.00004 +x_0=3200406.4008128 +y_0=213360.426720853 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8528":
        "+proj=lcc +lat_1=39.1 +lat_0=39.1 +lon_0=-95.25 +k_0=1.000033 +x_0=3505207.01041402 +y_0=182880.365760732 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8529":
        "+proj=tmerc +lat_0=36.75 +lon_0=-101.416666666667 +k=1.00014 +x_0=3810007.62001524 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8531":
        "+proj=tmerc +lat_0=36.75 +lon_0=-100.4 +k=1.000109 +x_0=4114808.22961646 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8533":
        "+proj=tmerc +lat_0=36.75 +lon_0=-99.6666666666667 +k=1.000097 +x_0=4419608.83921768 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8534":
        "+proj=tmerc +lat_0=36.75 +lon_0=-99.2 +k=1.000087 +x_0=4724409.4488189 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8535":
        "+proj=tmerc +lat_0=36.75 +lon_0=-98.55 +k=1.000069 +x_0=5029210.05842012 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8536":
        "+proj=lcc +lat_1=37.7666666666667 +lat_0=37.7666666666667 +lon_0=-97.5 +k_0=1.000059 +x_0=5334010.66802134 +y_0=121920.243840488 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8538":
        "+proj=lcc +lat_1=37.1833333333333 +lat_0=37.1833333333333 +lon_0=-97.5 +k_0=1.000055 +x_0=5638811.27762256 +y_0=60960.1219202439 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8539":
        "+proj=tmerc +lat_0=36.75 +lon_0=-95.9666666666667 +k=1.000034 +x_0=5943611.88722378 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8540":
        "+proj=tmerc +lat_0=36.75 +lon_0=-95.0833333333333 +k=1.000031 +x_0=6248412.49682499 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs",
      "EPSG:8541": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8542": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8543": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8544": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8545": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8675": "+vunits=m +no_defs",
      "EPSG:8677":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=5500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:8678":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.9999 +x_0=6500000 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +units=m +no_defs",
      "EPSG:8679":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9999 +x_0=8500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:8682":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:8683": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8684": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8685": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8686":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=500000 +y_0=0 +ellps=bessel +towgs84=476.08,125.947,417.81,4.610862,2.388137,-11.942335,9.896638 +units=m +no_defs",
      "EPSG:8687":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:8690": "+vunits=m +no_defs",
      "EPSG:8691": "+vunits=m +no_defs",
      "EPSG:8692": "+proj=utm +zone=54 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8693": "+proj=utm +zone=55 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8694":
        "+proj=longlat +a=6378249.145 +rf=293.465 +towgs84=-93.799,-132.737,-219.073,-1.844,0.648,-6.37,-0.169 +no_defs",
      "EPSG:8697": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8698": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8699": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8700":
        "+proj=tmerc +lat_0=31 +lon_0=-110.166666666667 +k=0.9999 +x_0=213360 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8701":
        "+proj=tmerc +lat_0=31 +lon_0=-111.916666666667 +k=0.9999 +x_0=213360 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8702":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8703":
        "+proj=lcc +lat_0=44.7833333333333 +lon_0=-87 +lat_1=47.0833333333333 +lat_2=45.4833333333333 +x_0=7999999.999968 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8704":
        "+proj=lcc +lat_0=43.3166666666667 +lon_0=-84.3666666666667 +lat_1=45.7 +lat_2=44.1833333333333 +x_0=5999999.999976 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8705":
        "+proj=lcc +lat_0=41.5 +lon_0=-84.3666666666667 +lat_1=43.6666666666667 +lat_2=42.1 +x_0=3999999.999984 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8706":
        "+proj=lcc +lat_0=44.25 +lon_0=-109.5 +lat_1=49 +lat_2=45 +x_0=599999.9999976 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8707":
        "+proj=lcc +lat_0=47 +lon_0=-100.5 +lat_1=48.7333333333333 +lat_2=47.4333333333333 +x_0=599999.9999976 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8708":
        "+proj=lcc +lat_0=45.6666666666667 +lon_0=-100.5 +lat_1=47.4833333333333 +lat_2=46.1833333333333 +x_0=599999.9999976 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8709":
        "+proj=lcc +lat_0=43.6666666666667 +lon_0=-120.5 +lat_1=46 +lat_2=44.3333333333333 +x_0=2500000.0001424 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8710":
        "+proj=lcc +lat_0=41.6666666666667 +lon_0=-120.5 +lat_1=44 +lat_2=42.3333333333333 +x_0=1500000.0001464 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8711":
        "+proj=lcc +lat_0=31.8333333333333 +lon_0=-81 +lat_1=34.8333333333333 +lat_2=32.5 +x_0=609600 +y_0=0 +datum=NAD83 +units=ft +vunits=ft +no_defs",
      "EPSG:8712":
        "+proj=lcc +lat_0=34.3333333333333 +lon_0=-92 +lat_1=36.2333333333333 +lat_2=34.9333333333333 +x_0=399999.99998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8713":
        "+proj=lcc +lat_0=32.6666666666667 +lon_0=-92 +lat_1=34.7666666666667 +lat_2=33.3 +x_0=399999.99998984 +y_0=399999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8714":
        "+proj=lcc +lat_0=39.3333333333333 +lon_0=-122 +lat_1=41.6666666666667 +lat_2=40 +x_0=2000000.0001016 +y_0=500000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8715":
        "+proj=lcc +lat_0=37.6666666666667 +lon_0=-122 +lat_1=39.8333333333333 +lat_2=38.3333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8716":
        "+proj=lcc +lat_0=36.5 +lon_0=-120.5 +lat_1=38.4333333333333 +lat_2=37.0666666666667 +x_0=2000000.0001016 +y_0=500000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8717":
        "+proj=lcc +lat_0=35.3333333333333 +lon_0=-119 +lat_1=37.25 +lat_2=36 +x_0=2000000.0001016 +y_0=500000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8718":
        "+proj=lcc +lat_0=33.5 +lon_0=-118 +lat_1=35.4666666666667 +lat_2=34.0333333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8719":
        "+proj=lcc +lat_0=32.1666666666667 +lon_0=-116.25 +lat_1=33.8833333333333 +lat_2=32.7833333333333 +x_0=2000000.0001016 +y_0=500000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8720":
        "+proj=lcc +lat_0=39.3333333333333 +lon_0=-105.5 +lat_1=40.7833333333333 +lat_2=39.7166666666667 +x_0=914401.828803658 +y_0=304800.609601219 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8721":
        "+proj=lcc +lat_0=37.8333333333333 +lon_0=-105.5 +lat_1=39.75 +lat_2=38.45 +x_0=914401.828803658 +y_0=304800.609601219 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8722":
        "+proj=lcc +lat_0=36.6666666666667 +lon_0=-105.5 +lat_1=38.4333333333333 +lat_2=37.2333333333333 +x_0=914401.828803658 +y_0=304800.609601219 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8723":
        "+proj=lcc +lat_0=40.8333333333333 +lon_0=-72.75 +lat_1=41.8666666666667 +lat_2=41.2 +x_0=304800.609601219 +y_0=152400.30480061 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8724":
        "+proj=tmerc +lat_0=38 +lon_0=-75.4166666666667 +k=0.999995 +x_0=200000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8725":
        "+proj=lcc +lat_0=29 +lon_0=-84.5 +lat_1=30.75 +lat_2=29.5833333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8726":
        "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8727":
        "+proj=tmerc +lat_0=24.3333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8728":
        "+proj=tmerc +lat_0=30 +lon_0=-82.1666666666667 +k=0.9999 +x_0=200000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8729":
        "+proj=tmerc +lat_0=30 +lon_0=-84.1666666666667 +k=0.9999 +x_0=699999.9998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8730":
        "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-112.166666666667 +k=0.999947368 +x_0=200000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8731":
        "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-114 +k=0.999947368 +x_0=500000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8732":
        "+proj=tmerc +lat_0=41.6666666666667 +lon_0=-115.75 +k=0.999933333 +x_0=800000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8733":
        "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-88.3333333333333 +k=0.999975 +x_0=300000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8734":
        "+proj=tmerc +lat_0=36.6666666666667 +lon_0=-90.1666666666667 +k=0.999941177 +x_0=699999.99998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8735":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.6666666666667 +k=0.999966667 +x_0=99999.9998983998 +y_0=249999.9998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8736":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.0833333333333 +k=0.999966667 +x_0=900000 +y_0=249999.9998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8737":
        "+proj=lcc +lat_0=41.5 +lon_0=-93.5 +lat_1=43.2666666666667 +lat_2=42.0666666666667 +x_0=1500000 +y_0=999999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8738":
        "+proj=lcc +lat_0=40 +lon_0=-93.5 +lat_1=41.7833333333333 +lat_2=40.6166666666667 +x_0=500000.00001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8739":
        "+proj=lcc +lat_0=38.3333333333333 +lon_0=-98 +lat_1=39.7833333333333 +lat_2=38.7166666666667 +x_0=399999.99998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8740":
        "+proj=lcc +lat_0=36.6666666666667 +lon_0=-98.5 +lat_1=38.5666666666667 +lat_2=37.2666666666667 +x_0=399999.99998984 +y_0=399999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8741":
        "+proj=lcc +lat_0=37.5 +lon_0=-84.25 +lat_1=37.9666666666667 +lat_2=38.9666666666667 +x_0=500000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8742":
        "+proj=lcc +lat_0=36.3333333333333 +lon_0=-85.75 +lat_1=37.9333333333333 +lat_2=36.7333333333333 +x_0=500000.0001016 +y_0=500000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8743":
        "+proj=lcc +lat_0=30.5 +lon_0=-92.5 +lat_1=32.6666666666667 +lat_2=31.1666666666667 +x_0=999999.99998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8744":
        "+proj=lcc +lat_0=28.5 +lon_0=-91.3333333333333 +lat_1=30.7 +lat_2=29.3 +x_0=999999.99998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8745":
        "+proj=tmerc +lat_0=43.6666666666667 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8746":
        "+proj=tmerc +lat_0=42.8333333333333 +lon_0=-70.1666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8747":
        "+proj=lcc +lat_0=37.6666666666667 +lon_0=-77 +lat_1=39.45 +lat_2=38.3 +x_0=399999.9998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8748":
        "+proj=lcc +lat_0=41 +lon_0=-71.5 +lat_1=42.6833333333333 +lat_2=41.7166666666667 +x_0=200000.0001016 +y_0=750000 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8749":
        "+proj=lcc +lat_0=41 +lon_0=-70.5 +lat_1=41.4833333333333 +lat_2=41.2833333333333 +x_0=500000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8750":
        "+proj=lcc +lat_0=46.5 +lon_0=-93.1 +lat_1=48.6333333333333 +lat_2=47.0333333333333 +x_0=800000.00001016 +y_0=99999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8751":
        "+proj=lcc +lat_0=45 +lon_0=-94.25 +lat_1=47.05 +lat_2=45.6166666666667 +x_0=800000.00001016 +y_0=99999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8752":
        "+proj=lcc +lat_0=43 +lon_0=-94 +lat_1=45.2166666666667 +lat_2=43.7833333333333 +x_0=800000.00001016 +y_0=99999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8753":
        "+proj=tmerc +lat_0=29.5 +lon_0=-88.8333333333333 +k=0.99995 +x_0=300000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8754":
        "+proj=tmerc +lat_0=29.5 +lon_0=-90.3333333333333 +k=0.99995 +x_0=699999.9998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8755":
        "+proj=lcc +lat_0=39.8333333333333 +lon_0=-100 +lat_1=43 +lat_2=40 +x_0=500000.00001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8756":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.583333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.00001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8757":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.666666666667 +k=0.9999 +x_0=500000.00001016 +y_0=6000000 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8758":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.583333333333 +k=0.9999 +x_0=800000.00001016 +y_0=3999999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8759":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.6666666666667 +k=0.999966667 +x_0=300000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8760":
        "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8761":
        "+proj=tmerc +lat_0=31 +lon_0=-104.333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8762":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8763":
        "+proj=tmerc +lat_0=31 +lon_0=-107.833333333333 +k=0.999916667 +x_0=830000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8764":
        "+proj=tmerc +lat_0=38.8333333333333 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8765":
        "+proj=tmerc +lat_0=40 +lon_0=-76.5833333333333 +k=0.9999375 +x_0=249999.9998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8766":
        "+proj=tmerc +lat_0=40 +lon_0=-78.5833333333333 +k=0.9999375 +x_0=350000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8767":
        "+proj=lcc +lat_0=40.1666666666667 +lon_0=-74 +lat_1=41.0333333333333 +lat_2=40.6666666666667 +x_0=300000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8768":
        "+proj=lcc +lat_0=33.75 +lon_0=-79 +lat_1=36.1666666666667 +lat_2=34.3333333333333 +x_0=609601.219202438 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8769":
        "+proj=lcc +lat_0=39.6666666666667 +lon_0=-82.5 +lat_1=41.7 +lat_2=40.4333333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8770":
        "+proj=lcc +lat_0=38 +lon_0=-82.5 +lat_1=40.0333333333333 +lat_2=38.7333333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8771":
        "+proj=lcc +lat_0=35 +lon_0=-98 +lat_1=36.7666666666667 +lat_2=35.5666666666667 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8772":
        "+proj=lcc +lat_0=33.3333333333333 +lon_0=-98 +lat_1=35.2333333333333 +lat_2=33.9333333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8773":
        "+proj=lcc +lat_0=40.1666666666667 +lon_0=-77.75 +lat_1=41.95 +lat_2=40.8833333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8774":
        "+proj=lcc +lat_0=39.3333333333333 +lon_0=-77.75 +lat_1=40.9666666666667 +lat_2=39.9333333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8775":
        "+proj=tmerc +lat_0=41.0833333333333 +lon_0=-71.5 +k=0.99999375 +x_0=99999.99998984 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8776":
        "+proj=lcc +lat_0=43.8333333333333 +lon_0=-100 +lat_1=45.6833333333333 +lat_2=44.4166666666667 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8777":
        "+proj=lcc +lat_0=42.3333333333333 +lon_0=-100.333333333333 +lat_1=44.4 +lat_2=42.8333333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8778":
        "+proj=lcc +lat_0=34.3333333333333 +lon_0=-86 +lat_1=36.4166666666667 +lat_2=35.25 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8779":
        "+proj=lcc +lat_0=34 +lon_0=-101.5 +lat_1=36.1833333333333 +lat_2=34.65 +x_0=200000.0001016 +y_0=999999.9998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8780":
        "+proj=lcc +lat_0=31.6666666666667 +lon_0=-98.5 +lat_1=33.9666666666667 +lat_2=32.1333333333333 +x_0=600000 +y_0=2000000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8781":
        "+proj=lcc +lat_0=29.6666666666667 +lon_0=-100.333333333333 +lat_1=31.8833333333333 +lat_2=30.1166666666667 +x_0=699999.9998984 +y_0=3000000 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8782":
        "+proj=lcc +lat_0=27.8333333333333 +lon_0=-99 +lat_1=30.2833333333333 +lat_2=28.3833333333333 +x_0=600000 +y_0=3999999.9998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8783":
        "+proj=lcc +lat_0=25.6666666666667 +lon_0=-98.5 +lat_1=27.8333333333333 +lat_2=26.1666666666667 +x_0=300000 +y_0=5000000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8784":
        "+proj=lcc +lat_0=40.3333333333333 +lon_0=-111.5 +lat_1=41.7833333333333 +lat_2=40.7166666666667 +x_0=500000.00001016 +y_0=999999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8785":
        "+proj=lcc +lat_0=38.3333333333333 +lon_0=-111.5 +lat_1=40.65 +lat_2=39.0166666666667 +x_0=500000.00001016 +y_0=2000000.00001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8786":
        "+proj=lcc +lat_0=36.6666666666667 +lon_0=-111.5 +lat_1=38.35 +lat_2=37.2166666666667 +x_0=500000.00001016 +y_0=3000000 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8787":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000.00001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8788":
        "+proj=lcc +lat_0=37.6666666666667 +lon_0=-78.5 +lat_1=39.2 +lat_2=38.0333333333333 +x_0=3500000.0001016 +y_0=2000000.0001016 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8789":
        "+proj=lcc +lat_0=36.3333333333333 +lon_0=-78.5 +lat_1=37.9666666666667 +lat_2=36.7666666666667 +x_0=3500000.0001016 +y_0=999999.9998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8790":
        "+proj=lcc +lat_0=47 +lon_0=-120.833333333333 +lat_1=48.7333333333333 +lat_2=47.5 +x_0=500000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8791":
        "+proj=lcc +lat_0=45.3333333333333 +lon_0=-120.5 +lat_1=47.3333333333333 +lat_2=45.8333333333333 +x_0=500000.0001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8792":
        "+proj=lcc +lat_0=38.5 +lon_0=-79.5 +lat_1=40.25 +lat_2=39 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8793":
        "+proj=lcc +lat_0=37 +lon_0=-81 +lat_1=38.8833333333333 +lat_2=37.4833333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8794":
        "+proj=lcc +lat_0=45.1666666666667 +lon_0=-90 +lat_1=46.7666666666667 +lat_2=45.5666666666667 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8795":
        "+proj=lcc +lat_0=43.8333333333333 +lon_0=-90 +lat_1=45.5 +lat_2=44.25 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8796":
        "+proj=lcc +lat_0=42 +lon_0=-90 +lat_1=44.0666666666667 +lat_2=42.7333333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8797":
        "+proj=tmerc +lat_0=40.5 +lon_0=-105.166666666667 +k=0.9999375 +x_0=200000.00001016 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8798":
        "+proj=tmerc +lat_0=40.5 +lon_0=-107.333333333333 +k=0.9999375 +x_0=399999.99998984 +y_0=99999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8799":
        "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8800":
        "+proj=tmerc +lat_0=40.5 +lon_0=-110.083333333333 +k=0.9999375 +x_0=800000.00001016 +y_0=99999.99998984 +datum=NAD83 +units=us-ft +vunits=us-ft +no_defs",
      "EPSG:8801":
        "+proj=tmerc +lat_0=30.5 +lon_0=-85.8333333333333 +k=0.99996 +x_0=200000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8802":
        "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8803":
        "+proj=omerc +no_uoff +lat_0=57 +lonc=-133.666666666667 +alpha=323.130102361111 +gamma=323.130102361111 +k=0.9999 +x_0=5000000 +y_0=-5000000 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8804":
        "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8805":
        "+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8806":
        "+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8807":
        "+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8808":
        "+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8809":
        "+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8810":
        "+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8811":
        "+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8812":
        "+proj=lcc +lat_0=51 +lon_0=-176 +lat_1=53.8333333333333 +lat_2=51.8333333333333 +x_0=1000000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8813":
        "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8814":
        "+proj=tmerc +lat_0=35.8333333333333 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8815":
        "+proj=tmerc +lat_0=36.1666666666667 +lon_0=-94.5 +k=0.999941177 +x_0=850000 +y_0=0 +datum=NAD83 +units=m +vunits=m +no_defs",
      "EPSG:8816": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8817": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8818": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:8826":
        "+proj=tmerc +lat_0=42 +lon_0=-114 +k=0.9996 +x_0=2500000 +y_0=1200000 +datum=NAD83 +units=m +no_defs",
      "EPSG:8836":
        "+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:8837":
        "+proj=utm +zone=37 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:8838":
        "+proj=utm +zone=38 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:8839":
        "+proj=utm +zone=39 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:8840":
        "+proj=utm +zone=40 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:8841": "+vunits=m +no_defs",
      "EPSG:8857":
        "+proj=eqearth +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:8858":
        "+proj=eqearth +lon_0=-90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:8859":
        "+proj=eqearth +lon_0=150 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:8860": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8881": "+vunits=m +no_defs",
      "EPSG:8888": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:8897": "+vunits=ft +no_defs",
      "EPSG:8898": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8899": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8900": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8901": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8902": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8903": "+proj=utm +zone=1 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:8904": "+vunits=m +no_defs",
      "EPSG:8905": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8906": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8907": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8908":
        "+proj=tmerc +lat_0=0 +lon_0=-84 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8909": "+proj=utm +zone=16 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8910": "+proj=utm +zone=17 +ellps=GRS80 +units=m +no_defs",
      "EPSG:8911": "+vunits=m +no_defs",
      "EPSG:8912":
        "+proj=tmerc +lat_0=0 +lon_0=-84 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:8915": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8916": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8917": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8918": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8919": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8920": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8921": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8922": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8923": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8924": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8925": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8926": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8927": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8928": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8929": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8930": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8931": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8932": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8933": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8934": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8935": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8936": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8937": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8938": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8939": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8940": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8941": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8942": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8943": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8944": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8945": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8946": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8947": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:8948": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8949": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8950": "+proj=utm +zone=18 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:8951": "+proj=utm +zone=19 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:8972": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8973": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8974": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8975": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8976": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8977": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8978": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8979": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8980": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8981": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8982": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8983": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8984": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8985": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8986": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8987": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8988": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8989": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8990": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8991": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8992": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8993": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8994": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8995": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8996": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8997": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8998": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:8999": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9000": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9001": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9002": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9003": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9004": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9005": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9006": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9007": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9008": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9009": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9010": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9011": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9012": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9013": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9014": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9015": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9016": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9017": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9018": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9019": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9039":
        "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9040":
        "+proj=lcc +lat_0=52 +lon_0=10 +lat_1=35 +lat_2=65 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9053": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:9054": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:9055": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:9056": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:9057": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:9059": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9060": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9061": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9062": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9063": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9064": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9065": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9066": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9067": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9068": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9069": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9070": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9071": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9072": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9073": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9074": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9075": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9130": "+vunits=m +no_defs",
      "EPSG:9138": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9139": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:9140": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:9141":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=7500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9146": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9147": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9148": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9149": "+proj=utm +zone=18 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:9150": "+proj=utm +zone=19 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:9151": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9152": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9153": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9154": "+proj=utm +zone=18 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:9155": "+proj=utm +zone=19 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:9156":
        "+proj=utm +zone=32 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9157":
        "+proj=utm +zone=33 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9158":
        "+proj=utm +zone=34 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9159":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9996 +x_0=500000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9182": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9183": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9184": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9191":
        "+proj=aea +lat_0=-40 +lon_0=175 +lat_1=-30 +lat_2=-50 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:9205":
        "+proj=tmerc +lat_0=0 +lon_0=103 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9206":
        "+proj=tmerc +lat_0=0 +lon_0=104 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9207":
        "+proj=tmerc +lat_0=0 +lon_0=104.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9208":
        "+proj=tmerc +lat_0=0 +lon_0=104.75 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9209":
        "+proj=tmerc +lat_0=0 +lon_0=105.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9210":
        "+proj=tmerc +lat_0=0 +lon_0=105.75 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9211":
        "+proj=tmerc +lat_0=0 +lon_0=106 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9212":
        "+proj=tmerc +lat_0=0 +lon_0=106.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9213":
        "+proj=tmerc +lat_0=0 +lon_0=106.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9214":
        "+proj=tmerc +lat_0=0 +lon_0=107 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9215":
        "+proj=tmerc +lat_0=0 +lon_0=107.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9216":
        "+proj=tmerc +lat_0=0 +lon_0=107.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9217":
        "+proj=tmerc +lat_0=0 +lon_0=108.25 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9218":
        "+proj=tmerc +lat_0=0 +lon_0=108.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs",
      "EPSG:9221":
        "+proj=aea +lat_0=-30 +lon_0=25 +lat_1=-22 +lat_2=-38 +x_0=1400000 +y_0=1300000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9222":
        "+proj=aea +lat_0=-42 +lon_0=44 +lat_1=-34 +lat_2=-50 +x_0=1200000 +y_0=1300000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9245": "+geoidgrids=ca_nrc_CGG2013an83.tif +vunits=m +no_defs",
      "EPSG:9248":
        "+proj=longlat +ellps=intl +towgs84=-192.26,65.72,132.08,0,0,0,0 +no_defs",
      "EPSG:9249":
        "+proj=tmerc +lat_0=-90 +lon_0=-72 +k=1 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-192.26,65.72,132.08,0,0,0,0 +units=m +no_defs",
      "EPSG:9250":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=intl +towgs84=-192.26,65.72,132.08,0,0,0,0 +units=m +no_defs",
      "EPSG:9251":
        "+proj=longlat +ellps=intl +towgs84=-9.5,122.9,138.2,0,0,0,0 +no_defs",
      "EPSG:9252":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=intl +towgs84=-9.5,122.9,138.2,0,0,0,0 +units=m +no_defs",
      "EPSG:9253":
        "+proj=longlat +ellps=intl +towgs84=-78.1,101.6,133.3,0,0,0,0 +no_defs",
      "EPSG:9254":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=intl +towgs84=-78.1,101.6,133.3,0,0,0,0 +units=m +no_defs",
      "EPSG:9255": "+vunits=m +no_defs",
      "EPSG:9265": "+proj=utm +zone=19 +south +ellps=WGS84 +units=m +no_defs",
      "EPSG:9266": "+proj=geocent +ellps=bessel +units=m +no_defs",
      "EPSG:9267":
        "+proj=longlat +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +no_defs",
      "EPSG:9271":
        "+proj=tmerc +lat_0=0 +lon_0=10.3333333333333 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
      "EPSG:9272":
        "+proj=tmerc +lat_0=0 +lon_0=13.3333333333333 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
      "EPSG:9273":
        "+proj=tmerc +lat_0=0 +lon_0=16.3333333333333 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs",
      "EPSG:9274": "+vunits=m +no_defs",
      "EPSG:9279": "+vunits=m +no_defs",
      "EPSG:9284":
        "+proj=tmerc +lat_0=-90 +lon_0=-72 +k=1 +x_0=1500000 +y_0=0 +ellps=intl +units=m +no_defs",
      "EPSG:9285":
        "+proj=tmerc +lat_0=-90 +lon_0=-66 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +units=m +no_defs",
      "EPSG:9286":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9287": "+vunits=m +no_defs",
      "EPSG:9288": "+vunits=m +no_defs",
      "EPSG:9289":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9290":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9292":
        "+proj=geocent +ellps=GRS80 +towgs84=1.16835,-1.42001,-2.24431,-0.00822,-0.05508,0.01818,0.23388 +units=m +no_defs",
      "EPSG:9293": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9294": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9295": "+proj=utm +zone=39 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9296": "+proj=utm +zone=40 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9297": "+proj=utm +zone=41 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9299": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9300":
        "+proj=tmerc +lat_0=52.3 +lon_0=-1.5 +k=1 +x_0=198873.0046 +y_0=375064.3871 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9303": "+vunits=m +no_defs",
      "EPSG:9306":
        "+proj=tmerc +lat_0=52.3 +lon_0=-1.5 +k=1 +x_0=198873.0046 +y_0=375064.3871 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:9307": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9308": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9309": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9311":
        "+proj=laea +lat_0=45 +lon_0=-100 +x_0=0 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:9331": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9332":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,-0.008393,0.000749,-0.010276,0 +no_defs",
      "EPSG:9333":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,-0.008393,0.000749,-0.010276,0 +no_defs",
      "EPSG:9335": "+vunits=m +no_defs",
      "EPSG:9351": "+geoidgrids=nc_dittt_Ranc08_Circe.tif +vunits=m +no_defs",
      "EPSG:9354":
        "+proj=stere +lat_0=-90 +lat_ts=-65 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:9356":
        "+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,-0.008393,0.000749,-0.010276,0 +units=m +no_defs",
      "EPSG:9357":
        "+proj=utm +zone=37 +ellps=GRS80 +towgs84=0,0,0,-0.008393,0.000749,-0.010276,0 +units=m +no_defs",
      "EPSG:9358":
        "+proj=utm +zone=38 +ellps=GRS80 +towgs84=0,0,0,-0.008393,0.000749,-0.010276,0 +units=m +no_defs",
      "EPSG:9359":
        "+proj=utm +zone=39 +ellps=GRS80 +towgs84=0,0,0,-0.008393,0.000749,-0.010276,0 +units=m +no_defs",
      "EPSG:9360":
        "+proj=utm +zone=40 +ellps=GRS80 +towgs84=0,0,0,-0.008393,0.000749,-0.010276,0 +units=m +no_defs",
      "EPSG:9364": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9367":
        "+proj=tmerc +lat_0=53.5 +lon_0=-2.25 +k=1 +x_0=203252.175 +y_0=407512.765 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9368":
        "+proj=tmerc +lat_0=53.5 +lon_0=-2.25 +k=1 +x_0=203252.175 +y_0=407512.765 +ellps=GRS80 +units=m +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9372": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9373":
        "+proj=tmerc +lat_0=52.45 +lon_0=-0.85 +k=1 +x_0=49350.157 +y_0=108398.212 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9374":
        "+proj=tmerc +lat_0=52.45 +lon_0=-0.85 +k=1 +x_0=49350.157 +y_0=108398.212 +ellps=GRS80 +units=m +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9377":
        "+proj=tmerc +lat_0=4 +lon_0=-73 +k=0.9992 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9378": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9379": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9380": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9384": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9387":
        "+proj=tmerc +lat_0=57.4 +lon_0=-3.2 +k=1 +x_0=155828.702 +y_0=115225.707 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9388":
        "+proj=tmerc +lat_0=57.4 +lon_0=-3.2 +k=1 +x_0=155828.702 +y_0=115225.707 +ellps=GRS80 +units=m +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9389": "+vunits=m +no_defs",
      "EPSG:9390": "+vunits=m +no_defs",
      "EPSG:9391":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:9392": "+geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:9393": "+geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:9394": "+geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:9395":
        "+geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9396":
        "+geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9397":
        "+geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9398":
        "+geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9399":
        "+geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9400":
        "+geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9401":
        "+geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9402": "+geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:9403": "+proj=longlat +ellps=intl +no_defs",
      "EPSG:9404": "+proj=utm +zone=27 +ellps=intl +units=m +no_defs",
      "EPSG:9405": "+proj=utm +zone=28 +ellps=intl +units=m +no_defs",
      "EPSG:9406":
        "+proj=utm +zone=27 +ellps=intl +towgs84=-307,-92,127,0,0,0,0 +units=m +no_defs",
      "EPSG:9407":
        "+proj=utm +zone=28 +ellps=intl +towgs84=-307,-92,127,0,0,0,0 +units=m +no_defs",
      "EPSG:9422":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9423":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9424":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9425":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9426":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9427":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9428":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9429":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9430":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9449":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=uk_os_OSGM15_Malin.tif +vunits=m +no_defs",
      "EPSG:9450":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=uk_os_OSGM15_Belfast.tif +vunits=m +no_defs",
      "EPSG:9451": "+vunits=m +no_defs",
      "EPSG:9452":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9453": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9456":
        "+proj=tmerc +lat_0=55.75 +lon_0=-4.35 +k=1 +x_0=93720.394 +y_0=113870.493 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9457":
        "+proj=tmerc +lat_0=55.75 +lon_0=-4.35 +k=1 +x_0=93720.394 +y_0=113870.493 +ellps=GRS80 +units=m +geoidgrids=uk_os_OSGM15_GB.tif +vunits=m +no_defs",
      "EPSG:9458": "+vunits=m +no_defs",
      "EPSG:9462": "+proj=longlat +ellps=GRS80 +vunits=m +no_defs",
      "EPSG:9463":
        "+proj=longlat +ellps=GRS80 +geoidgrids=au_ga_AUSGeoid2020_20180201.tif +vunits=m +no_defs",
      "EPSG:9464":
        "+proj=longlat +ellps=GRS80 +geoidgrids=au_ga_AUSGeoid2020_20180201.tif +vunits=m +no_defs",
      "EPSG:9468": "+proj=geocent +ellps=WGS84 +units=m +no_defs",
      "EPSG:9469": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:9470": "+proj=longlat +ellps=WGS84 +no_defs",
      "EPSG:9471": "+vunits=m +no_defs",
      "EPSG:9473":
        "+proj=aea +lat_0=0 +lon_0=132 +lat_1=-18 +lat_2=-36 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9474": "+proj=longlat +a=6378136 +rf=298.257839303 +no_defs",
      "EPSG:9475": "+proj=longlat +a=6378136 +rf=298.257839303 +no_defs",
      "EPSG:9476": "+proj=utm +zone=46 +ellps=WGS84 +units=m +no_defs",
      "EPSG:9477": "+proj=utm +zone=47 +ellps=WGS84 +units=m +no_defs",
      "EPSG:9478": "+proj=utm +zone=48 +ellps=WGS84 +units=m +no_defs",
      "EPSG:9479": "+proj=utm +zone=49 +ellps=WGS84 +units=m +no_defs",
      "EPSG:9480": "+proj=utm +zone=50 +ellps=WGS84 +units=m +no_defs",
      "EPSG:9481": "+proj=utm +zone=51 +ellps=WGS84 +units=m +no_defs",
      "EPSG:9482": "+proj=utm +zone=52 +ellps=WGS84 +units=m +no_defs",
      "EPSG:9487": "+proj=utm +zone=47 +south +ellps=WGS84 +units=m +no_defs",
      "EPSG:9488": "+proj=utm +zone=48 +south +ellps=WGS84 +units=m +no_defs",
      "EPSG:9489": "+proj=utm +zone=49 +south +ellps=WGS84 +units=m +no_defs",
      "EPSG:9490": "+proj=utm +zone=50 +south +ellps=WGS84 +units=m +no_defs",
      "EPSG:9491": "+proj=utm +zone=51 +south +ellps=WGS84 +units=m +no_defs",
      "EPSG:9492": "+proj=utm +zone=52 +south +ellps=WGS84 +units=m +no_defs",
      "EPSG:9493": "+proj=utm +zone=53 +south +ellps=WGS84 +units=m +no_defs",
      "EPSG:9494": "+proj=utm +zone=54 +south +ellps=WGS84 +units=m +no_defs",
      "EPSG:9498":
        "+proj=tmerc +lat_0=-34.6292666666667 +lon_0=-58.4633083333333 +k=1 +x_0=20000 +y_0=70000 +ellps=WGS84 +units=m +no_defs",
      "EPSG:9500":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9501":
        "+proj=longlat +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +vunits=m +no_defs",
      "EPSG:9502":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=ft +no_defs",
      "EPSG:9503":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=ft +no_defs",
      "EPSG:9504":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=ft +no_defs",
      "EPSG:9505":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:9506":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:9507":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:9508":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:9509":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap.tif +vunits=m +no_defs",
      "EPSG:9510":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9511":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9512":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9513":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9514":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9515":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9516":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=es_ign_egm08-rednap-canarias.tif +vunits=m +no_defs",
      "EPSG:9517":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=us_nga_egm08_25.tif +vunits=m +no_defs",
      "EPSG:9518":
        "+proj=longlat +datum=WGS84 +geoidgrids=us_nga_egm08_25.tif +vunits=m +no_defs",
      "EPSG:9519":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9520":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,-0.008393,0.000749,-0.010276,0 +vunits=m +no_defs",
      "EPSG:9521": "+proj=longlat +ellps=WGS84 +vunits=m +no_defs",
      "EPSG:9522":
        "+proj=longlat +ellps=GRS80 +geoidgrids=us_noaa_g2018p0.tif +vunits=m +no_defs",
      "EPSG:9523":
        "+proj=longlat +ellps=GRS80 +geoidgrids=us_noaa_g2018p0.tif +vunits=m +no_defs",
      "EPSG:9524":
        "+proj=longlat +ellps=GRS80 +geoidgrids=us_noaa_g2012bg0.tif +vunits=m +no_defs",
      "EPSG:9525":
        "+proj=longlat +ellps=GRS80 +geoidgrids=us_noaa_g2012bg0.tif +vunits=m +no_defs",
      "EPSG:9526":
        "+proj=longlat +ellps=GRS80 +geoidgrids=us_noaa_g2012bs0.tif +vunits=m +no_defs",
      "EPSG:9527":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=nz_linz_nzgeoid2009.tif +vunits=m +no_defs",
      "EPSG:9528":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=nz_linz_nzgeoid2016.tif +vunits=m +no_defs",
      "EPSG:9529": "+proj=longlat +ellps=WGS84 +vunits=m +no_defs",
      "EPSG:9530":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_ggguy15.tif +vunits=m +no_defs",
      "EPSG:9531":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_RAGTBT2016.tif +vunits=m +no_defs",
      "EPSG:9532":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_RALS2016.tif +vunits=m +no_defs",
      "EPSG:9533":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_RAMG2016.tif +vunits=m +no_defs",
      "EPSG:9534":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_gg10_sbv2.tif +vunits=m +no_defs",
      "EPSG:9535":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_gg10_smv2.tif +vunits=m +no_defs",
      "EPSG:9536":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9537":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_RAMART2016.tif +vunits=m +no_defs",
      "EPSG:9538":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_RAF18.tif +vunits=m +no_defs",
      "EPSG:9539":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_RAC09.tif +vunits=m +no_defs",
      "EPSG:9540":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=nc_dittt_Ranc08_Circe.tif +vunits=m +no_defs",
      "EPSG:9541":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=fr_ign_RASPM2018.tif +vunits=m +no_defs",
      "EPSG:9542":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +vunits=m +no_defs",
      "EPSG:9543": "+proj=longlat +ellps=GRS80 +vunits=m +no_defs",
      "EPSG:9544":
        "+proj=longlat +ellps=GRS80 +geoidgrids=ca_nrc_CGG2013an83.tif +vunits=m +no_defs",
      "EPSG:9545": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9546": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9547": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9650":
        "+geoidgrids=pl_gugik_geoid2011-PL-KRON86-NH.tif +geoid_crs=WGS84 +vunits=m +no_defs",
      "EPSG:9651":
        "+geoidgrids=pl_gugik_geoid2011-PL-EVRF2007-NH.tif +geoid_crs=WGS84 +vunits=m +no_defs",
      "EPSG:9656":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=pl_gugik_geoid2011-PL-KRON86-NH.tif +geoid_crs=WGS84 +vunits=m +no_defs",
      "EPSG:9657":
        "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +geoidgrids=pl_gugik_geoid2011-PL-EVRF2007-NH.tif +geoid_crs=WGS84 +vunits=m +no_defs",
      "EPSG:9663": "+vunits=m +no_defs",
      "EPSG:9666": "+vunits=m +no_defs",
      "EPSG:9669": "+vunits=m +no_defs",
      "EPSG:9672": "+vunits=m +no_defs",
      "EPSG:9674":
        "+proj=aea +lat_0=34 +lon_0=-120 +lat_1=43 +lat_2=48 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:9675": "+vunits=m +no_defs",
      "EPSG:9678":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=0.9996 +x_0=500000 +y_0=-2000000 +ellps=evrst30 +towgs84=283.729,735.942,261.143,0,0,0,0 +units=m +no_defs",
      "EPSG:9680":
        "+proj=tmerc +lat_0=0 +lon_0=90 +k=0.9996 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:9681": "+vunits=m +no_defs",
      "EPSG:9694": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9695": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9696": "+proj=longlat +ellps=GRS80 +no_defs",
      "EPSG:9697": "+proj=utm +zone=12 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:9698": "+proj=utm +zone=18 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:9699": "+proj=utm +zone=19 +south +ellps=GRS80 +units=m +no_defs",
      "EPSG:9700": "+proj=geocent +ellps=GRS80 +units=m +no_defs",
      "EPSG:9701": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:9702": "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
      "EPSG:9705": "+proj=longlat +datum=WGS84 +vunits=m +no_defs",
      "EPSG:9707":
        "+proj=longlat +datum=WGS84 +geoidgrids=us_nga_egm96_15.tif +vunits=m +no_defs",
      "EPSG:9709": "+proj=utm +zone=23 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9711":
        "+proj=utm +zone=23 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:9712": "+proj=utm +zone=24 +datum=NAD83 +units=m +no_defs",
      "EPSG:9713": "+proj=utm +zone=24 +ellps=GRS80 +units=m +no_defs",
      "EPSG:9714":
        "+proj=utm +zone=24 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:9715":
        "+proj=utm +zone=15 +ellps=GRS80 +units=m +vunits=m +no_defs",
      "EPSG:20004":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20005":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20006":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20007":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20008":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=8500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20009":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=9500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20010":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=10500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20011":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=11500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20012":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=12500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20013":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=13500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20014":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=14500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20015":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=15500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20016":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=16500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20017":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=17500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20018":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20019":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20020":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=20500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20021":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=21500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20022":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=22500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20023":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=23500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20024":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=24500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20025":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=25500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20026":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=26500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20027":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=27500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20028":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=28500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20029":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=29500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20030":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20031":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=31500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20032":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=32500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20064":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20065":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20066":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20067":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20068":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20069":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20070":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20071":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20072":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20073":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20074":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20075":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20076":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20077":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20078":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20079":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20080":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20081":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20082":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20083":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20084":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20085":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20086":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20087":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20088":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20089":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20090":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20091":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20092":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=24.47,-130.89,-81.56,-0,-0,0.13,-0.22 +units=m +no_defs",
      "EPSG:20135":
        "+proj=utm +zone=35 +ellps=clrk80 +towgs84=-166,-15,204,0,0,0,0 +units=m +no_defs",
      "EPSG:20136":
        "+proj=utm +zone=36 +ellps=clrk80 +towgs84=-166,-15,204,0,0,0,0 +units=m +no_defs",
      "EPSG:20137":
        "+proj=utm +zone=37 +ellps=clrk80 +towgs84=-166,-15,204,0,0,0,0 +units=m +no_defs",
      "EPSG:20138":
        "+proj=utm +zone=38 +ellps=clrk80 +towgs84=-166,-15,204,0,0,0,0 +units=m +no_defs",
      "EPSG:20248":
        "+proj=utm +zone=48 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20249":
        "+proj=utm +zone=49 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20250":
        "+proj=utm +zone=50 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20251":
        "+proj=utm +zone=51 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20252":
        "+proj=utm +zone=52 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20253":
        "+proj=utm +zone=53 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20254":
        "+proj=utm +zone=54 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20255":
        "+proj=utm +zone=55 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20256":
        "+proj=utm +zone=56 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20257":
        "+proj=utm +zone=57 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20258":
        "+proj=utm +zone=58 +south +ellps=aust_SA +towgs84=-117.808,-51.536,137.784,0.303,0.446,0.234,-0.29 +units=m +no_defs",
      "EPSG:20348":
        "+proj=utm +zone=48 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20349":
        "+proj=utm +zone=49 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20350":
        "+proj=utm +zone=50 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20351":
        "+proj=utm +zone=51 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20352":
        "+proj=utm +zone=52 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20353":
        "+proj=utm +zone=53 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20354":
        "+proj=utm +zone=54 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20355":
        "+proj=utm +zone=55 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20356":
        "+proj=utm +zone=56 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20357":
        "+proj=utm +zone=57 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20358":
        "+proj=utm +zone=58 +south +ellps=aust_SA +towgs84=-134,-48,149,0,0,0,0 +units=m +no_defs",
      "EPSG:20436":
        "+proj=utm +zone=36 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
      "EPSG:20437":
        "+proj=utm +zone=37 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
      "EPSG:20438":
        "+proj=utm +zone=38 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
      "EPSG:20439":
        "+proj=utm +zone=39 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
      "EPSG:20440":
        "+proj=utm +zone=40 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
      "EPSG:20499":
        "+proj=utm +zone=39 +ellps=intl +towgs84=-143,-236,7,0,0,0,0 +units=m +no_defs",
      "EPSG:20538":
        "+proj=utm +zone=38 +ellps=krass +towgs84=-43,-163,45,0,0,0,0 +units=m +no_defs",
      "EPSG:20539":
        "+proj=utm +zone=39 +ellps=krass +towgs84=-43,-163,45,0,0,0,0 +units=m +no_defs",
      "EPSG:20790":
        "+proj=tmerc +lat_0=39.66666666666666 +lon_0=1 +k=1 +x_0=200000 +y_0=300000 +ellps=intl +towgs84=-304.046,-60.576,103.64,0,0,0,0 +pm=lisbon +units=m +no_defs",
      "EPSG:20791":
        "+proj=tmerc +lat_0=39.66666666666666 +lon_0=1 +k=1 +x_0=0 +y_0=0 +ellps=intl +towgs84=-304.046,-60.576,103.64,0,0,0,0 +pm=lisbon +units=m +no_defs",
      "EPSG:20822":
        "+proj=utm +zone=22 +south +ellps=intl +towgs84=-151.99,287.04,-147.45,0,0,0,0 +units=m +no_defs",
      "EPSG:20823":
        "+proj=utm +zone=23 +south +ellps=intl +towgs84=-151.99,287.04,-147.45,0,0,0,0 +units=m +no_defs",
      "EPSG:20824":
        "+proj=utm +zone=24 +south +ellps=intl +towgs84=-151.99,287.04,-147.45,0,0,0,0 +units=m +no_defs",
      "EPSG:20934":
        "+proj=utm +zone=34 +south +a=6378249.145 +b=6356514.966398753 +towgs84=-143,-90,-294,0,0,0,0 +units=m +no_defs",
      "EPSG:20935":
        "+proj=utm +zone=35 +south +a=6378249.145 +b=6356514.966398753 +towgs84=-143,-90,-294,0,0,0,0 +units=m +no_defs",
      "EPSG:20936":
        "+proj=utm +zone=36 +south +a=6378249.145 +b=6356514.966398753 +towgs84=-143,-90,-294,0,0,0,0 +units=m +no_defs",
      "EPSG:21035":
        "+proj=utm +zone=35 +south +ellps=clrk80 +towgs84=-160,-6,-302,0,0,0,0 +units=m +no_defs",
      "EPSG:21036":
        "+proj=utm +zone=36 +south +ellps=clrk80 +towgs84=-160,-6,-302,0,0,0,0 +units=m +no_defs",
      "EPSG:21037":
        "+proj=utm +zone=37 +south +ellps=clrk80 +towgs84=-160,-6,-302,0,0,0,0 +units=m +no_defs",
      "EPSG:21095":
        "+proj=utm +zone=35 +ellps=clrk80 +towgs84=-160,-6,-302,0,0,0,0 +units=m +no_defs",
      "EPSG:21096":
        "+proj=utm +zone=36 +ellps=clrk80 +towgs84=-160,-6,-302,0,0,0,0 +units=m +no_defs",
      "EPSG:21097":
        "+proj=utm +zone=37 +ellps=clrk80 +towgs84=-160,-6,-302,0,0,0,0 +units=m +no_defs",
      "EPSG:21100":
        "+proj=merc +lon_0=110 +k=0.997 +x_0=3900000 +y_0=900000 +ellps=bessel +towgs84=-377,681,-50,0,0,0,0 +pm=jakarta +units=m +no_defs",
      "EPSG:21148":
        "+proj=utm +zone=48 +south +ellps=bessel +towgs84=-377,681,-50,0,0,0,0 +units=m +no_defs",
      "EPSG:21149":
        "+proj=utm +zone=49 +south +ellps=bessel +towgs84=-377,681,-50,0,0,0,0 +units=m +no_defs",
      "EPSG:21150":
        "+proj=utm +zone=50 +south +ellps=bessel +towgs84=-377,681,-50,0,0,0,0 +units=m +no_defs",
      "EPSG:21291":
        "+proj=tmerc +lat_0=0 +lon_0=-62 +k=0.9995000000000001 +x_0=400000 +y_0=0 +ellps=clrk80 +towgs84=31.95,300.99,419.19,0,0,0,0 +units=m +no_defs",
      "EPSG:21292":
        "+proj=tmerc +lat_0=13.17638888888889 +lon_0=-59.55972222222222 +k=0.9999986 +x_0=30000 +y_0=75000 +ellps=clrk80 +towgs84=31.95,300.99,419.19,0,0,0,0 +units=m +no_defs",
      "EPSG:21413":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=13500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21414":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=14500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21415":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=15500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21416":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=16500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21417":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=17500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21418":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21419":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21420":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=20500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21421":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=21500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21422":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=22500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21423":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=23500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21453":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21454":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21455":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21456":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21457":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21458":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21459":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21460":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21461":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21462":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21463":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21473":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21474":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21475":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21476":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21477":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21478":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21479":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21480":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21481":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21482":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21483":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21500":
        "+proj=lcc +lat_1=49.83333333333334 +lat_2=51.16666666666666 +lat_0=90 +lon_0=0 +x_0=150000 +y_0=5400000 +ellps=intl +pm=brussels +units=m +no_defs",
      "EPSG:21780":
        "+proj=somerc +lat_0=46.95240555555556 +lon_0=0 +k_0=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +pm=bern +units=m +no_defs",
      "EPSG:21781":
        "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21782":
        "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs",
      "EPSG:21817":
        "+proj=utm +zone=17 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:21818":
        "+proj=utm +zone=18 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:21891":
        "+proj=tmerc +lat_0=4.599047222222222 +lon_0=-77.08091666666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:21892":
        "+proj=tmerc +lat_0=4.599047222222222 +lon_0=-74.08091666666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:21893":
        "+proj=tmerc +lat_0=4.599047222222222 +lon_0=-71.08091666666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:21894":
        "+proj=tmerc +lat_0=4.599047222222222 +lon_0=-68.08091666666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:21896":
        "+proj=tmerc +lat_0=4.599047222222222 +lon_0=-77.08091666666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:21897":
        "+proj=tmerc +lat_0=4.599047222222222 +lon_0=-74.08091666666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:21898":
        "+proj=tmerc +lat_0=4.599047222222222 +lon_0=-71.08091666666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:21899":
        "+proj=tmerc +lat_0=4.599047222222222 +lon_0=-68.08091666666667 +k=1 +x_0=1000000 +y_0=1000000 +ellps=intl +towgs84=307,304,-318,0,0,0,0 +units=m +no_defs",
      "EPSG:22032":
        "+proj=utm +zone=32 +south +ellps=clrk80 +towgs84=-50.9,-347.6,-231,0,0,0,0 +units=m +no_defs",
      "EPSG:22033":
        "+proj=utm +zone=33 +south +ellps=clrk80 +towgs84=-50.9,-347.6,-231,0,0,0,0 +units=m +no_defs",
      "EPSG:22091":
        "+proj=tmerc +lat_0=0 +lon_0=11.5 +k=0.9996 +x_0=500000 +y_0=10000000 +ellps=clrk80 +towgs84=-50.9,-347.6,-231,0,0,0,0 +units=m +no_defs",
      "EPSG:22092":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=0.9996 +x_0=500000 +y_0=10000000 +ellps=clrk80 +towgs84=-50.9,-347.6,-231,0,0,0,0 +units=m +no_defs",
      "EPSG:22171":
        "+proj=tmerc +lat_0=-90 +lon_0=-72 +k=1 +x_0=1500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22172":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22173":
        "+proj=tmerc +lat_0=-90 +lon_0=-66 +k=1 +x_0=3500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22174":
        "+proj=tmerc +lat_0=-90 +lon_0=-63 +k=1 +x_0=4500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22175":
        "+proj=tmerc +lat_0=-90 +lon_0=-60 +k=1 +x_0=5500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22176":
        "+proj=tmerc +lat_0=-90 +lon_0=-57 +k=1 +x_0=6500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22177":
        "+proj=tmerc +lat_0=-90 +lon_0=-54 +k=1 +x_0=7500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22181":
        "+proj=tmerc +lat_0=-90 +lon_0=-72 +k=1 +x_0=1500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22182":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22183":
        "+proj=tmerc +lat_0=-90 +lon_0=-66 +k=1 +x_0=3500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22184":
        "+proj=tmerc +lat_0=-90 +lon_0=-63 +k=1 +x_0=4500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22185":
        "+proj=tmerc +lat_0=-90 +lon_0=-60 +k=1 +x_0=5500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22186":
        "+proj=tmerc +lat_0=-90 +lon_0=-57 +k=1 +x_0=6500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22187":
        "+proj=tmerc +lat_0=-90 +lon_0=-54 +k=1 +x_0=7500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:22191":
        "+proj=tmerc +lat_0=-90 +lon_0=-72 +k=1 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs",
      "EPSG:22192":
        "+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs",
      "EPSG:22193":
        "+proj=tmerc +lat_0=-90 +lon_0=-66 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs",
      "EPSG:22194":
        "+proj=tmerc +lat_0=-90 +lon_0=-63 +k=1 +x_0=4500000 +y_0=0 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs",
      "EPSG:22195":
        "+proj=tmerc +lat_0=-90 +lon_0=-60 +k=1 +x_0=5500000 +y_0=0 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs",
      "EPSG:22196":
        "+proj=tmerc +lat_0=-90 +lon_0=-57 +k=1 +x_0=6500000 +y_0=0 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs",
      "EPSG:22197":
        "+proj=tmerc +lat_0=-90 +lon_0=-54 +k=1 +x_0=7500000 +y_0=0 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs",
      "EPSG:22234":
        "+proj=utm +zone=34 +south +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22235":
        "+proj=utm +zone=35 +south +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22236":
        "+proj=utm +zone=36 +south +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22275":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22277":
        "+proj=tmerc +lat_0=0 +lon_0=17 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22279":
        "+proj=tmerc +lat_0=0 +lon_0=19 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22281":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22283":
        "+proj=tmerc +lat_0=0 +lon_0=23 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22285":
        "+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22287":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22289":
        "+proj=tmerc +lat_0=0 +lon_0=29 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22291":
        "+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22293":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=0 +y_0=0 +axis=wsu +a=6378249.145 +b=6356514.966398753 +towgs84=-136,-108,-292,0,0,0,0 +units=m +no_defs",
      "EPSG:22332": "+proj=utm +zone=32 +datum=carthage +units=m +no_defs",
      "EPSG:22391":
        "+proj=lcc +lat_1=36 +lat_0=36 +lon_0=9.9 +k_0=0.999625544 +x_0=500000 +y_0=300000 +datum=carthage +units=m +no_defs",
      "EPSG:22392":
        "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=9.9 +k_0=0.999625769 +x_0=500000 +y_0=300000 +datum=carthage +units=m +no_defs",
      "EPSG:22521":
        "+proj=utm +zone=21 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs",
      "EPSG:22522":
        "+proj=utm +zone=22 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs",
      "EPSG:22523":
        "+proj=utm +zone=23 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs",
      "EPSG:22524":
        "+proj=utm +zone=24 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs",
      "EPSG:22525":
        "+proj=utm +zone=25 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs",
      "EPSG:22700":
        "+proj=lcc +lat_1=34.65 +lat_0=34.65 +lon_0=37.35 +k_0=0.9996256 +x_0=300000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=-190.421,8.532,238.69,0,0,0,0 +units=m +no_defs",
      "EPSG:22770":
        "+proj=lcc +lat_1=34.65 +lat_0=34.65 +lon_0=37.35 +k_0=0.9996256 +x_0=300000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=-190.421,8.532,238.69,0,0,0,0 +units=m +no_defs",
      "EPSG:22780":
        "+proj=sterea +lat_0=34.2 +lon_0=39.15 +k=0.9995341 +x_0=0 +y_0=0 +a=6378249.2 +b=6356515 +towgs84=-190.421,8.532,238.69,0,0,0,0 +units=m +no_defs",
      "EPSG:22832":
        "+proj=utm +zone=32 +a=6378249.2 +b=6356515 +units=m +no_defs",
      "EPSG:22991":
        "+proj=tmerc +lat_0=30 +lon_0=35 +k=1 +x_0=300000 +y_0=1100000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs",
      "EPSG:22992":
        "+proj=tmerc +lat_0=30 +lon_0=31 +k=1 +x_0=615000 +y_0=810000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs",
      "EPSG:22993":
        "+proj=tmerc +lat_0=30 +lon_0=27 +k=1 +x_0=700000 +y_0=200000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs",
      "EPSG:22994":
        "+proj=tmerc +lat_0=30 +lon_0=27 +k=1 +x_0=700000 +y_0=1200000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs",
      "EPSG:23028":
        "+proj=utm +zone=28 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23029":
        "+proj=utm +zone=29 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23030":
        "+proj=utm +zone=30 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23031":
        "+proj=utm +zone=31 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23032":
        "+proj=utm +zone=32 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23033":
        "+proj=utm +zone=33 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23034":
        "+proj=utm +zone=34 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23035":
        "+proj=utm +zone=35 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23036":
        "+proj=utm +zone=36 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23037":
        "+proj=utm +zone=37 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23038":
        "+proj=utm +zone=38 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23090":
        "+proj=tmerc +lat_0=0 +lon_0=0 +k=0.9996 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23095":
        "+proj=tmerc +lat_0=0 +lon_0=5 +k=0.9996 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
      "EPSG:23239":
        "+proj=utm +zone=39 +ellps=clrk80 +towgs84=-346,-1,224,0,0,0,0 +units=m +no_defs",
      "EPSG:23240":
        "+proj=utm +zone=40 +ellps=clrk80 +towgs84=-346,-1,224,0,0,0,0 +units=m +no_defs",
      "EPSG:23433":
        "+proj=utm +zone=33 +a=6378249.2 +b=6356515 +units=m +no_defs",
      "EPSG:23700":
        "+proj=somerc +lat_0=47.14439372222222 +lon_0=19.04857177777778 +k_0=0.99993 +x_0=650000 +y_0=200000 +ellps=GRS67 +towgs84=52.17,-71.82,-14.9,0,0,0,0 +units=m +no_defs",
      "EPSG:23830":
        "+proj=tmerc +lat_0=0 +lon_0=94.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23831":
        "+proj=tmerc +lat_0=0 +lon_0=97.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23832":
        "+proj=tmerc +lat_0=0 +lon_0=100.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23833":
        "+proj=tmerc +lat_0=0 +lon_0=103.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23834":
        "+proj=tmerc +lat_0=0 +lon_0=106.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23835":
        "+proj=tmerc +lat_0=0 +lon_0=109.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23836":
        "+proj=tmerc +lat_0=0 +lon_0=112.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23837":
        "+proj=tmerc +lat_0=0 +lon_0=115.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23838":
        "+proj=tmerc +lat_0=0 +lon_0=118.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23839":
        "+proj=tmerc +lat_0=0 +lon_0=121.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23840":
        "+proj=tmerc +lat_0=0 +lon_0=124.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23841":
        "+proj=tmerc +lat_0=0 +lon_0=127.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23842":
        "+proj=tmerc +lat_0=0 +lon_0=130.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23843":
        "+proj=tmerc +lat_0=0 +lon_0=133.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23844":
        "+proj=tmerc +lat_0=0 +lon_0=136.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23845":
        "+proj=tmerc +lat_0=0 +lon_0=139.5 +k=0.9999 +x_0=200000 +y_0=1500000 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23846":
        "+proj=utm +zone=46 +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23847":
        "+proj=utm +zone=47 +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23848":
        "+proj=utm +zone=48 +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23849":
        "+proj=utm +zone=49 +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23850":
        "+proj=utm +zone=50 +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23851":
        "+proj=utm +zone=51 +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23852":
        "+proj=utm +zone=52 +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23853":
        "+proj=utm +zone=53 +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23866":
        "+proj=utm +zone=46 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23867":
        "+proj=utm +zone=47 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23868":
        "+proj=utm +zone=48 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23869":
        "+proj=utm +zone=49 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23870":
        "+proj=utm +zone=50 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23871":
        "+proj=utm +zone=51 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23872":
        "+proj=utm +zone=52 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23877":
        "+proj=utm +zone=47 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23878":
        "+proj=utm +zone=48 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23879":
        "+proj=utm +zone=49 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23880":
        "+proj=utm +zone=50 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23881":
        "+proj=utm +zone=51 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23882":
        "+proj=utm +zone=52 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23883":
        "+proj=utm +zone=53 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23884":
        "+proj=utm +zone=54 +south +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:23886":
        "+proj=utm +zone=46 +south +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23887":
        "+proj=utm +zone=47 +south +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23888":
        "+proj=utm +zone=48 +south +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23889":
        "+proj=utm +zone=49 +south +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23890":
        "+proj=utm +zone=50 +south +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23891":
        "+proj=utm +zone=51 +south +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23892":
        "+proj=utm +zone=52 +south +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23893":
        "+proj=utm +zone=53 +south +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23894":
        "+proj=utm +zone=54 +south +a=6378160 +b=6356774.50408554 +towgs84=-24,-15,5,0,0,0,0 +units=m +no_defs",
      "EPSG:23946":
        "+proj=utm +zone=46 +a=6377276.345 +b=6356075.41314024 +towgs84=217,823,299,0,0,0,0 +units=m +no_defs",
      "EPSG:23947":
        "+proj=utm +zone=47 +a=6377276.345 +b=6356075.41314024 +towgs84=217,823,299,0,0,0,0 +units=m +no_defs",
      "EPSG:23948":
        "+proj=utm +zone=48 +a=6377276.345 +b=6356075.41314024 +towgs84=217,823,299,0,0,0,0 +units=m +no_defs",
      "EPSG:24047":
        "+proj=utm +zone=47 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs",
      "EPSG:24048":
        "+proj=utm +zone=48 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs",
      "EPSG:24100":
        "+proj=lcc +lat_1=18 +lat_0=18 +lon_0=-77 +k_0=1 +x_0=167638.49597 +y_0=121918.90616 +a=6378249.144808011 +b=6356514.966204134 +to_meter=0.3047972654 +no_defs",
      "EPSG:24200":
        "+proj=lcc +lat_1=18 +lat_0=18 +lon_0=-77 +k_0=1 +x_0=250000 +y_0=150000 +ellps=clrk66 +towgs84=70,207,389.5,0,0,0,0 +units=m +no_defs",
      "EPSG:24305":
        "+proj=utm +zone=45 +a=6377276.345 +b=6356075.41314024 +towgs84=282,726,254,0,0,0,0 +units=m +no_defs",
      "EPSG:24306":
        "+proj=utm +zone=46 +a=6377276.345 +b=6356075.41314024 +towgs84=282,726,254,0,0,0,0 +units=m +no_defs",
      "EPSG:24311":
        "+proj=utm +zone=41 +a=6377301.243 +b=6356100.230165384 +towgs84=283,682,231,0,0,0,0 +units=m +no_defs",
      "EPSG:24312":
        "+proj=utm +zone=42 +a=6377301.243 +b=6356100.230165384 +towgs84=283,682,231,0,0,0,0 +units=m +no_defs",
      "EPSG:24313":
        "+proj=utm +zone=43 +a=6377301.243 +b=6356100.230165384 +towgs84=283,682,231,0,0,0,0 +units=m +no_defs",
      "EPSG:24342":
        "+proj=utm +zone=42 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24343":
        "+proj=utm +zone=43 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24344":
        "+proj=utm +zone=44 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24345":
        "+proj=utm +zone=45 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24346":
        "+proj=utm +zone=46 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24347":
        "+proj=utm +zone=47 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24370":
        "+proj=lcc +lat_1=39.5 +lat_0=39.5 +lon_0=68 +k_0=0.99846154 +x_0=2153865.73916853 +y_0=2368292.194628102 +a=6377299.36559538 +b=6356098.359005156 +to_meter=0.9143985307444408 +no_defs",
      "EPSG:24371":
        "+proj=lcc +lat_1=32.5 +lat_0=32.5 +lon_0=68 +k_0=0.99878641 +x_0=2743195.592233322 +y_0=914398.5307444407 +a=6377299.36559538 +b=6356098.359005156 +to_meter=0.9143985307444408 +no_defs",
      "EPSG:24372":
        "+proj=lcc +lat_1=26 +lat_0=26 +lon_0=74 +k_0=0.99878641 +x_0=2743195.592233322 +y_0=914398.5307444407 +a=6377299.36559538 +b=6356098.359005156 +to_meter=0.9143985307444408 +no_defs",
      "EPSG:24373":
        "+proj=lcc +lat_1=19 +lat_0=19 +lon_0=80 +k_0=0.99878641 +x_0=2743195.592233322 +y_0=914398.5307444407 +a=6377299.36559538 +b=6356098.359005156 +to_meter=0.9143985307444408 +no_defs",
      "EPSG:24374":
        "+proj=lcc +lat_1=12 +lat_0=12 +lon_0=80 +k_0=0.99878641 +x_0=2743195.592233322 +y_0=914398.5307444407 +a=6377299.36559538 +b=6356098.359005156 +to_meter=0.9143985307444408 +no_defs",
      "EPSG:24375":
        "+proj=lcc +lat_1=26 +lat_0=26 +lon_0=90 +k_0=0.99878641 +x_0=2743185.69 +y_0=914395.23 +a=6377276.345 +b=6356075.41314024 +towgs84=282,726,254,0,0,0,0 +units=m +no_defs",
      "EPSG:24376":
        "+proj=lcc +lat_1=32.5 +lat_0=32.5 +lon_0=68 +k_0=0.99878641 +x_0=2743196.4 +y_0=914398.8 +a=6377301.243 +b=6356100.230165384 +towgs84=283,682,231,0,0,0,0 +units=m +no_defs",
      "EPSG:24377":
        "+proj=lcc +lat_1=26 +lat_0=26 +lon_0=74 +k_0=0.99878641 +x_0=2743196.4 +y_0=914398.8 +a=6377301.243 +b=6356100.230165384 +towgs84=283,682,231,0,0,0,0 +units=m +no_defs",
      "EPSG:24378":
        "+proj=lcc +lat_1=32.5 +lat_0=32.5 +lon_0=68 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24379":
        "+proj=lcc +lat_1=26 +lat_0=26 +lon_0=74 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24380":
        "+proj=lcc +lat_1=26 +lat_0=26 +lon_0=90 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24381":
        "+proj=lcc +lat_1=19 +lat_0=19 +lon_0=80 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24382":
        "+proj=lcc +lat_1=26 +lat_0=26 +lon_0=90 +k_0=0.99878641 +x_0=2743195.592233322 +y_0=914398.5307444407 +a=6377299.36559538 +b=6356098.359005156 +to_meter=0.9143985307444408 +no_defs",
      "EPSG:24383":
        "+proj=lcc +lat_1=12 +lat_0=12 +lon_0=80 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs",
      "EPSG:24500":
        "+proj=cass +lat_0=1.287646666666667 +lon_0=103.8530022222222 +x_0=30000 +y_0=30000 +a=6377304.063 +b=6356103.038993155 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:24547":
        "+proj=utm +zone=47 +a=6377304.063 +b=6356103.038993155 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:24548":
        "+proj=utm +zone=48 +a=6377304.063 +b=6356103.038993155 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs",
      "EPSG:24571":
        "+proj=omerc +lat_0=4 +lonc=102.25 +alpha=323.0257905 +k=0.99984 +x_0=804671.2997750348 +y_0=0 +no_uoff +gamma=323.1301023611111 +a=6377304.063 +b=6356103.038993155 +towgs84=-11,851,5,0,0,0,0 +to_meter=20.11678249437587 +no_defs",
      "EPSG:24600":
        "+proj=lcc +lat_1=32.5 +lat_0=32.5 +lon_0=45 +k_0=0.9987864078000001 +x_0=1500000 +y_0=1166200 +ellps=clrk80 +towgs84=-294.7,-200.1,525.5,0,0,0,0 +units=m +no_defs",
      "EPSG:24718":
        "+proj=utm +zone=18 +ellps=intl +towgs84=-273.5,110.6,-357.9,0,0,0,0 +units=m +no_defs",
      "EPSG:24719":
        "+proj=utm +zone=19 +ellps=intl +towgs84=-273.5,110.6,-357.9,0,0,0,0 +units=m +no_defs",
      "EPSG:24720":
        "+proj=utm +zone=20 +ellps=intl +towgs84=-273.5,110.6,-357.9,0,0,0,0 +units=m +no_defs",
      "EPSG:24817":
        "+proj=utm +zone=17 +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24818":
        "+proj=utm +zone=18 +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24819":
        "+proj=utm +zone=19 +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24820":
        "+proj=utm +zone=20 +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24821":
        "+proj=utm +zone=21 +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24877":
        "+proj=utm +zone=17 +south +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24878":
        "+proj=utm +zone=18 +south +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24879":
        "+proj=utm +zone=19 +south +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24880":
        "+proj=utm +zone=20 +south +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24881":
        "+proj=utm +zone=21 +south +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24882":
        "+proj=utm +zone=22 +south +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24891":
        "+proj=tmerc +lat_0=-6 +lon_0=-80.5 +k=0.99983008 +x_0=222000 +y_0=1426834.743 +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24892":
        "+proj=tmerc +lat_0=-9.5 +lon_0=-76 +k=0.99932994 +x_0=720000 +y_0=1039979.159 +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:24893":
        "+proj=tmerc +lat_0=-9.5 +lon_0=-70.5 +k=0.99952992 +x_0=1324000 +y_0=1040084.558 +ellps=intl +towgs84=-288,175,-376,0,0,0,0 +units=m +no_defs",
      "EPSG:25000":
        "+proj=tmerc +lat_0=4.666666666666667 +lon_0=-1 +k=0.99975 +x_0=274319.51 +y_0=0 +ellps=clrk80 +towgs84=-130,29,364,0,0,0,0 +units=m +no_defs",
      "EPSG:25231":
        "+proj=utm +zone=31 +a=6378249.2 +b=6356515 +units=m +no_defs",
      "EPSG:25391":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-133,-77,-51,0,0,0,0 +units=m +no_defs",
      "EPSG:25392":
        "+proj=tmerc +lat_0=0 +lon_0=119 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-133,-77,-51,0,0,0,0 +units=m +no_defs",
      "EPSG:25393":
        "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-133,-77,-51,0,0,0,0 +units=m +no_defs",
      "EPSG:25394":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-133,-77,-51,0,0,0,0 +units=m +no_defs",
      "EPSG:25395":
        "+proj=tmerc +lat_0=0 +lon_0=125 +k=0.99995 +x_0=500000 +y_0=0 +ellps=clrk66 +towgs84=-133,-77,-51,0,0,0,0 +units=m +no_defs",
      "EPSG:25700":
        "+proj=merc +lon_0=110 +k=0.997 +x_0=3900000 +y_0=900000 +ellps=bessel +towgs84=-587.8,519.75,145.76,0,0,0,0 +pm=jakarta +units=m +no_defs",
      "EPSG:25828":
        "+proj=utm +zone=28 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25829":
        "+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25830":
        "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25831":
        "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25832":
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25833":
        "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25834":
        "+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25835":
        "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25836":
        "+proj=utm +zone=36 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25837":
        "+proj=utm +zone=37 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25838":
        "+proj=utm +zone=38 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25884":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:25932":
        "+proj=utm +zone=32 +south +ellps=intl +towgs84=-254.1,-5.36,-100.29,0,0,0,0 +units=m +no_defs",
      "EPSG:26191":
        "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=-5.4 +k_0=0.999625769 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs",
      "EPSG:26192":
        "+proj=lcc +lat_1=29.7 +lat_0=29.7 +lon_0=-5.4 +k_0=0.9996155960000001 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs",
      "EPSG:26193":
        "+proj=lcc +lat_1=26.1 +lat_0=26.1 +lon_0=-5.4 +k_0=0.9996 +x_0=1200000 +y_0=400000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs",
      "EPSG:26194":
        "+proj=lcc +lat_1=26.1 +lat_0=26.1 +lon_0=-5.4 +k_0=0.999616304 +x_0=1200000 +y_0=400000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs",
      "EPSG:26195":
        "+proj=lcc +lat_1=22.5 +lat_0=22.5 +lon_0=-5.4 +k_0=0.999616437 +x_0=1500000 +y_0=400000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs",
      "EPSG:26237":
        "+proj=utm +zone=37 +ellps=bessel +towgs84=639,405,60,0,0,0,0 +units=m +no_defs",
      "EPSG:26331":
        "+proj=utm +zone=31 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=m +no_defs",
      "EPSG:26332":
        "+proj=utm +zone=32 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=m +no_defs",
      "EPSG:26391":
        "+proj=tmerc +lat_0=4 +lon_0=4.5 +k=0.99975 +x_0=230738.26 +y_0=0 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=m +no_defs",
      "EPSG:26392":
        "+proj=tmerc +lat_0=4 +lon_0=8.5 +k=0.99975 +x_0=670553.98 +y_0=0 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=m +no_defs",
      "EPSG:26393":
        "+proj=tmerc +lat_0=4 +lon_0=12.5 +k=0.99975 +x_0=1110369.7 +y_0=0 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=m +no_defs",
      "EPSG:26432":
        "+proj=utm +zone=32 +south +ellps=intl +towgs84=-252.95,-4.11,-96.38,0,0,0,0 +units=m +no_defs",
      "EPSG:26591":
        "+proj=tmerc +lat_0=0 +lon_0=-3.45233333333333 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +pm=rome +units=m +no_defs",
      "EPSG:26592":
        "+proj=tmerc +lat_0=0 +lon_0=2.54766666666666 +k=0.9996 +x_0=2520000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +pm=rome +units=m +no_defs",
      "EPSG:26632":
        "+proj=utm +zone=32 +a=6378249.2 +b=6356515 +towgs84=-74,-130,42,0,0,0,0 +units=m +no_defs",
      "EPSG:26692":
        "+proj=utm +zone=32 +south +a=6378249.2 +b=6356515 +towgs84=-74,-130,42,0,0,0,0 +units=m +no_defs",
      "EPSG:26701": "+proj=utm +zone=1 +datum=NAD27 +units=m +no_defs",
      "EPSG:26702": "+proj=utm +zone=2 +datum=NAD27 +units=m +no_defs",
      "EPSG:26703": "+proj=utm +zone=3 +datum=NAD27 +units=m +no_defs",
      "EPSG:26704": "+proj=utm +zone=4 +datum=NAD27 +units=m +no_defs",
      "EPSG:26705": "+proj=utm +zone=5 +datum=NAD27 +units=m +no_defs",
      "EPSG:26706": "+proj=utm +zone=6 +datum=NAD27 +units=m +no_defs",
      "EPSG:26707": "+proj=utm +zone=7 +datum=NAD27 +units=m +no_defs",
      "EPSG:26708": "+proj=utm +zone=8 +datum=NAD27 +units=m +no_defs",
      "EPSG:26709": "+proj=utm +zone=9 +datum=NAD27 +units=m +no_defs",
      "EPSG:26710": "+proj=utm +zone=10 +datum=NAD27 +units=m +no_defs",
      "EPSG:26711": "+proj=utm +zone=11 +datum=NAD27 +units=m +no_defs",
      "EPSG:26712": "+proj=utm +zone=12 +datum=NAD27 +units=m +no_defs",
      "EPSG:26713": "+proj=utm +zone=13 +datum=NAD27 +units=m +no_defs",
      "EPSG:26714": "+proj=utm +zone=14 +datum=NAD27 +units=m +no_defs",
      "EPSG:26715": "+proj=utm +zone=15 +datum=NAD27 +units=m +no_defs",
      "EPSG:26716": "+proj=utm +zone=16 +datum=NAD27 +units=m +no_defs",
      "EPSG:26717": "+proj=utm +zone=17 +datum=NAD27 +units=m +no_defs",
      "EPSG:26718": "+proj=utm +zone=18 +datum=NAD27 +units=m +no_defs",
      "EPSG:26719": "+proj=utm +zone=19 +datum=NAD27 +units=m +no_defs",
      "EPSG:26720": "+proj=utm +zone=20 +datum=NAD27 +units=m +no_defs",
      "EPSG:26721": "+proj=utm +zone=21 +datum=NAD27 +units=m +no_defs",
      "EPSG:26722": "+proj=utm +zone=22 +datum=NAD27 +units=m +no_defs",
      "EPSG:26729":
        "+proj=tmerc +lat_0=30.5 +lon_0=-85.83333333333333 +k=0.99996 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26730":
        "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26731":
        "+proj=omerc +lat_0=57 +lonc=-133.6666666666667 +alpha=323.1301023611111 +k=0.9999 +x_0=5000000.001016002 +y_0=-5000000.001016002 +no_uoff +gamma=323.1301023611111 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26732":
        "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26733":
        "+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26734":
        "+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26735":
        "+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26736":
        "+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26737":
        "+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=213360.4267208534 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26738":
        "+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26739":
        "+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=182880.3657607315 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26740":
        "+proj=lcc +lat_1=53.83333333333334 +lat_2=51.83333333333334 +lat_0=51 +lon_0=-176 +x_0=914401.8288036576 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26741":
        "+proj=lcc +lat_1=41.66666666666666 +lat_2=40 +lat_0=39.33333333333334 +lon_0=-122 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26742":
        "+proj=lcc +lat_1=39.83333333333334 +lat_2=38.33333333333334 +lat_0=37.66666666666666 +lon_0=-122 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26743":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.06666666666667 +lat_0=36.5 +lon_0=-120.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26744":
        "+proj=lcc +lat_1=37.25 +lat_2=36 +lat_0=35.33333333333334 +lon_0=-119 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26745":
        "+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26746":
        "+proj=lcc +lat_1=33.88333333333333 +lat_2=32.78333333333333 +lat_0=32.16666666666666 +lon_0=-116.25 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26747":
        "+proj=lcc +lat_1=34.41666666666666 +lat_2=33.86666666666667 +lat_0=34.13333333333333 +lon_0=-118.3333333333333 +x_0=1276106.450596901 +y_0=127079.524511049 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26748":
        "+proj=tmerc +lat_0=31 +lon_0=-110.1666666666667 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26749":
        "+proj=tmerc +lat_0=31 +lon_0=-111.9166666666667 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26750":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26751":
        "+proj=lcc +lat_1=36.23333333333333 +lat_2=34.93333333333333 +lat_0=34.33333333333334 +lon_0=-92 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26752":
        "+proj=lcc +lat_1=34.76666666666667 +lat_2=33.3 +lat_0=32.66666666666666 +lon_0=-92 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26753":
        "+proj=lcc +lat_1=39.71666666666667 +lat_2=40.78333333333333 +lat_0=39.33333333333334 +lon_0=-105.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26754":
        "+proj=lcc +lat_1=39.75 +lat_2=38.45 +lat_0=37.83333333333334 +lon_0=-105.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26755":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.23333333333333 +lat_0=36.66666666666666 +lon_0=-105.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26756":
        "+proj=lcc +lat_1=41.86666666666667 +lat_2=41.2 +lat_0=40.83333333333334 +lon_0=-72.75 +x_0=182880.3657607315 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26757":
        "+proj=tmerc +lat_0=38 +lon_0=-75.41666666666667 +k=0.999995 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26758":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26759":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26760":
        "+proj=lcc +lat_1=30.75 +lat_2=29.58333333333333 +lat_0=29 +lon_0=-84.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26766":
        "+proj=tmerc +lat_0=30 +lon_0=-82.16666666666667 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26767":
        "+proj=tmerc +lat_0=30 +lon_0=-84.16666666666667 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26768":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-112.1666666666667 +k=0.9999473679999999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26769":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-114 +k=0.9999473679999999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26770":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-115.75 +k=0.999933333 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26771":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26772":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-90.16666666666667 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26773":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26774":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26775":
        "+proj=lcc +lat_1=43.26666666666667 +lat_2=42.06666666666667 +lat_0=41.5 +lon_0=-93.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26776":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.61666666666667 +lat_0=40 +lon_0=-93.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26777":
        "+proj=lcc +lat_1=39.78333333333333 +lat_2=38.71666666666667 +lat_0=38.33333333333334 +lon_0=-98 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26778":
        "+proj=lcc +lat_1=38.56666666666667 +lat_2=37.26666666666667 +lat_0=36.66666666666666 +lon_0=-98.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26779":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=38.96666666666667 +lat_0=37.5 +lon_0=-84.25 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26780":
        "+proj=lcc +lat_1=36.73333333333333 +lat_2=37.93333333333333 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26781":
        "+proj=lcc +lat_1=31.16666666666667 +lat_2=32.66666666666666 +lat_0=30.66666666666667 +lon_0=-92.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26782":
        "+proj=lcc +lat_1=29.3 +lat_2=30.7 +lat_0=28.66666666666667 +lon_0=-91.33333333333333 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26783":
        "+proj=tmerc +lat_0=43.83333333333334 +lon_0=-68.5 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26784":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26785":
        "+proj=lcc +lat_1=38.3 +lat_2=39.45 +lat_0=37.83333333333334 +lon_0=-77 +x_0=243840.4876809754 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26786":
        "+proj=lcc +lat_1=41.71666666666667 +lat_2=42.68333333333333 +lat_0=41 +lon_0=-71.5 +x_0=182880.3657607315 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26787":
        "+proj=lcc +lat_1=41.28333333333333 +lat_2=41.48333333333333 +lat_0=41 +lon_0=-70.5 +x_0=60960.12192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26791":
        "+proj=lcc +lat_1=47.03333333333333 +lat_2=48.63333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26792":
        "+proj=lcc +lat_1=45.61666666666667 +lat_2=47.05 +lat_0=45 +lon_0=-94.25 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26793":
        "+proj=lcc +lat_1=43.78333333333333 +lat_2=45.21666666666667 +lat_0=43 +lon_0=-94 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26794":
        "+proj=tmerc +lat_0=29.66666666666667 +lon_0=-88.83333333333333 +k=0.99996 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26795":
        "+proj=tmerc +lat_0=30.5 +lon_0=-90.33333333333333 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26796":
        "+proj=tmerc +lat_0=35.83333333333334 +lon_0=-90.5 +k=0.999933333 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26797":
        "+proj=tmerc +lat_0=35.83333333333334 +lon_0=-92.5 +k=0.999933333 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26798":
        "+proj=tmerc +lat_0=36.16666666666666 +lon_0=-94.5 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26799":
        "+proj=lcc +lat_1=34.41666666666666 +lat_2=33.86666666666667 +lat_0=34.13333333333333 +lon_0=-118.3333333333333 +x_0=1276106.450596901 +y_0=1268253.006858014 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:26801":
        "+proj=tmerc +lat_0=41.5 +lon_0=-83.66666666666667 +k=0.999942857 +x_0=152400.3048006096 +y_0=0 +a=6378450.047548896 +b=6356826.621488444 +units=us-ft +no_defs",
      "EPSG:26802":
        "+proj=tmerc +lat_0=41.5 +lon_0=-85.75 +k=0.999909091 +x_0=152400.3048006096 +y_0=0 +a=6378450.047548896 +b=6356826.621488444 +units=us-ft +no_defs",
      "EPSG:26803":
        "+proj=tmerc +lat_0=41.5 +lon_0=-88.75 +k=0.999909091 +x_0=152400.3048006096 +y_0=0 +a=6378450.047548896 +b=6356826.621488444 +units=us-ft +no_defs",
      "EPSG:26811":
        "+proj=lcc +lat_1=45.48333333333333 +lat_2=47.08333333333334 +lat_0=44.78333333333333 +lon_0=-87 +x_0=609601.2192024384 +y_0=0 +a=6378450.047548896 +b=6356826.621488444 +units=us-ft +no_defs",
      "EPSG:26812":
        "+proj=lcc +lat_1=44.18333333333333 +lat_2=45.7 +lat_0=43.31666666666667 +lon_0=-84.33333333333333 +x_0=609601.2192024384 +y_0=0 +a=6378450.047548896 +b=6356826.621488444 +units=us-ft +no_defs",
      "EPSG:26813":
        "+proj=lcc +lat_1=42.1 +lat_2=43.66666666666666 +lat_0=41.5 +lon_0=-84.33333333333333 +x_0=609601.2192024384 +y_0=0 +a=6378450.047548896 +b=6356826.621488444 +units=us-ft +no_defs",
      "EPSG:26814":
        "+proj=tmerc +lat_0=43.66666666666666 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26815":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26819":
        "+proj=lcc +lat_1=48.63333333333333 +lat_2=47.03333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=800000.0000101601 +y_0=99999.99998984 +datum=NAD83 +units=m +no_defs",
      "EPSG:26820":
        "+proj=lcc +lat_1=47.05 +lat_2=45.61666666666667 +lat_0=45 +lon_0=-94.25 +x_0=800000.0000101601 +y_0=99999.99998984 +datum=NAD83 +units=m +no_defs",
      "EPSG:26821":
        "+proj=lcc +lat_1=45.21666666666667 +lat_2=43.78333333333333 +lat_0=43 +lon_0=-94 +x_0=800000.0000101601 +y_0=99999.99998984 +datum=NAD83 +units=m +no_defs",
      "EPSG:26822":
        "+proj=lcc +lat_1=43 +lat_2=40 +lat_0=39.83333333333334 +lon_0=-100 +x_0=500000.0000101601 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26823":
        "+proj=lcc +lat_1=40.25 +lat_2=39 +lat_0=38.5 +lon_0=-79.5 +x_0=1968500 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26824":
        "+proj=lcc +lat_1=38.88333333333333 +lat_2=37.48333333333333 +lat_0=37 +lon_0=-81 +x_0=1968500 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26825":
        "+proj=tmerc +lat_0=43.66666666666666 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26826":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26830":
        "+proj=lcc +lat_1=48.63333333333333 +lat_2=47.03333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=800000.0000101601 +y_0=99999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26831":
        "+proj=lcc +lat_1=47.05 +lat_2=45.61666666666667 +lat_0=45 +lon_0=-94.25 +x_0=800000.0000101601 +y_0=99999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26832":
        "+proj=lcc +lat_1=45.21666666666667 +lat_2=43.78333333333333 +lat_0=43 +lon_0=-94 +x_0=800000.0000101601 +y_0=99999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26833":
        "+proj=lcc +lat_1=43 +lat_2=40 +lat_0=39.83333333333334 +lon_0=-100 +x_0=500000.0000101601 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26834":
        "+proj=lcc +lat_1=40.25 +lat_2=39 +lat_0=38.5 +lon_0=-79.5 +x_0=1968500 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26835":
        "+proj=lcc +lat_1=38.88333333333333 +lat_2=37.48333333333333 +lat_0=37 +lon_0=-81 +x_0=1968500 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26836":
        "+proj=tmerc +lat_0=43.66666666666666 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26837":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26841":
        "+proj=lcc +lat_1=48.63333333333333 +lat_2=47.03333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=800000.0000101601 +y_0=99999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26842":
        "+proj=lcc +lat_1=47.05 +lat_2=45.61666666666667 +lat_0=45 +lon_0=-94.25 +x_0=800000.0000101601 +y_0=99999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26843":
        "+proj=lcc +lat_1=45.21666666666667 +lat_2=43.78333333333333 +lat_0=43 +lon_0=-94 +x_0=800000.0000101601 +y_0=99999.99998984 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26844":
        "+proj=lcc +lat_1=43 +lat_2=40 +lat_0=39.83333333333334 +lon_0=-100 +x_0=500000.0000101601 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26845":
        "+proj=lcc +lat_1=40.25 +lat_2=39 +lat_0=38.5 +lon_0=-79.5 +x_0=1968500 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26846":
        "+proj=lcc +lat_1=38.88333333333333 +lat_2=37.48333333333333 +lat_0=37 +lon_0=-81 +x_0=1968500 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26847":
        "+proj=tmerc +lat_0=43.66666666666666 +lon_0=-68.5 +k=0.9999 +x_0=300000.0000000001 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:26848":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:26849":
        "+proj=lcc +lat_1=48.63333333333333 +lat_2=47.03333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=800000.0000101599 +y_0=99999.99998983997 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:26850":
        "+proj=lcc +lat_1=47.05 +lat_2=45.61666666666667 +lat_0=45 +lon_0=-94.25 +x_0=800000.0000101599 +y_0=99999.99998983997 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:26851":
        "+proj=lcc +lat_1=45.21666666666667 +lat_2=43.78333333333333 +lat_0=43 +lon_0=-94 +x_0=800000.0000101599 +y_0=99999.99998983997 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:26852":
        "+proj=lcc +lat_1=43 +lat_2=40 +lat_0=39.83333333333334 +lon_0=-100 +x_0=500000.00001016 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:26853":
        "+proj=lcc +lat_1=40.25 +lat_2=39 +lat_0=38.5 +lon_0=-79.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:26854":
        "+proj=lcc +lat_1=38.88333333333333 +lat_2=37.48333333333333 +lat_0=37 +lon_0=-81 +x_0=600000 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:26855":
        "+proj=tmerc +lat_0=43.66666666666666 +lon_0=-68.5 +k=0.9999 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26856":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26857":
        "+proj=lcc +lat_1=48.63333333333333 +lat_2=47.03333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=800000.0000101599 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26858":
        "+proj=lcc +lat_1=47.05 +lat_2=45.61666666666667 +lat_0=45 +lon_0=-94.25 +x_0=800000.0000101599 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26859":
        "+proj=lcc +lat_1=45.21666666666667 +lat_2=43.78333333333333 +lat_0=43 +lon_0=-94 +x_0=800000.0000101599 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26860":
        "+proj=lcc +lat_1=43 +lat_2=40 +lat_0=39.83333333333334 +lon_0=-100 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26861":
        "+proj=lcc +lat_1=40.25 +lat_2=39 +lat_0=38.5 +lon_0=-79.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26862":
        "+proj=lcc +lat_1=38.88333333333333 +lat_2=37.48333333333333 +lat_0=37 +lon_0=-81 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26863":
        "+proj=tmerc +lat_0=43.66666666666666 +lon_0=-68.5 +k=0.9999 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26864":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26865":
        "+proj=lcc +lat_1=48.63333333333333 +lat_2=47.03333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=800000.0000101599 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26866":
        "+proj=lcc +lat_1=47.05 +lat_2=45.61666666666667 +lat_0=45 +lon_0=-94.25 +x_0=800000.0000101599 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26867":
        "+proj=lcc +lat_1=45.21666666666667 +lat_2=43.78333333333333 +lat_0=43 +lon_0=-94 +x_0=800000.0000101599 +y_0=99999.99998983997 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26868":
        "+proj=lcc +lat_1=43 +lat_2=40 +lat_0=39.83333333333334 +lon_0=-100 +x_0=500000.00001016 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26869":
        "+proj=lcc +lat_1=40.25 +lat_2=39 +lat_0=38.5 +lon_0=-79.5 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26870":
        "+proj=lcc +lat_1=38.88333333333333 +lat_2=37.48333333333333 +lat_0=37 +lon_0=-81 +x_0=600000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs",
      "EPSG:26891":
        "+proj=tmerc +lat_0=0 +lon_0=-82.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26892":
        "+proj=tmerc +lat_0=0 +lon_0=-81 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26893":
        "+proj=tmerc +lat_0=0 +lon_0=-84 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26894":
        "+proj=tmerc +lat_0=0 +lon_0=-87 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26895":
        "+proj=tmerc +lat_0=0 +lon_0=-90 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26896":
        "+proj=tmerc +lat_0=0 +lon_0=-93 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26897":
        "+proj=tmerc +lat_0=0 +lon_0=-96 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26898":
        "+proj=tmerc +lat_0=0 +lon_0=-53 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26899":
        "+proj=tmerc +lat_0=0 +lon_0=-56 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:26901": "+proj=utm +zone=1 +datum=NAD83 +units=m +no_defs",
      "EPSG:26902": "+proj=utm +zone=2 +datum=NAD83 +units=m +no_defs",
      "EPSG:26903": "+proj=utm +zone=3 +datum=NAD83 +units=m +no_defs",
      "EPSG:26904": "+proj=utm +zone=4 +datum=NAD83 +units=m +no_defs",
      "EPSG:26905": "+proj=utm +zone=5 +datum=NAD83 +units=m +no_defs",
      "EPSG:26906": "+proj=utm +zone=6 +datum=NAD83 +units=m +no_defs",
      "EPSG:26907": "+proj=utm +zone=7 +datum=NAD83 +units=m +no_defs",
      "EPSG:26908": "+proj=utm +zone=8 +datum=NAD83 +units=m +no_defs",
      "EPSG:26909": "+proj=utm +zone=9 +datum=NAD83 +units=m +no_defs",
      "EPSG:26910": "+proj=utm +zone=10 +datum=NAD83 +units=m +no_defs",
      "EPSG:26911": "+proj=utm +zone=11 +datum=NAD83 +units=m +no_defs",
      "EPSG:26912": "+proj=utm +zone=12 +datum=NAD83 +units=m +no_defs",
      "EPSG:26913": "+proj=utm +zone=13 +datum=NAD83 +units=m +no_defs",
      "EPSG:26914": "+proj=utm +zone=14 +datum=NAD83 +units=m +no_defs",
      "EPSG:26915": "+proj=utm +zone=15 +datum=NAD83 +units=m +no_defs",
      "EPSG:26916": "+proj=utm +zone=16 +datum=NAD83 +units=m +no_defs",
      "EPSG:26917": "+proj=utm +zone=17 +datum=NAD83 +units=m +no_defs",
      "EPSG:26918": "+proj=utm +zone=18 +datum=NAD83 +units=m +no_defs",
      "EPSG:26919": "+proj=utm +zone=19 +datum=NAD83 +units=m +no_defs",
      "EPSG:26920": "+proj=utm +zone=20 +datum=NAD83 +units=m +no_defs",
      "EPSG:26921": "+proj=utm +zone=21 +datum=NAD83 +units=m +no_defs",
      "EPSG:26922": "+proj=utm +zone=22 +datum=NAD83 +units=m +no_defs",
      "EPSG:26923": "+proj=utm +zone=23 +datum=NAD83 +units=m +no_defs",
      "EPSG:26929":
        "+proj=tmerc +lat_0=30.5 +lon_0=-85.83333333333333 +k=0.99996 +x_0=200000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26930":
        "+proj=tmerc +lat_0=30 +lon_0=-87.5 +k=0.999933333 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26931":
        "+proj=omerc +lat_0=57 +lonc=-133.6666666666667 +alpha=323.1301023611111 +k=0.9999 +x_0=5000000 +y_0=-5000000 +no_uoff +gamma=323.1301023611111 +datum=NAD83 +units=m +no_defs",
      "EPSG:26932":
        "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26933":
        "+proj=tmerc +lat_0=54 +lon_0=-146 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26934":
        "+proj=tmerc +lat_0=54 +lon_0=-150 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26935":
        "+proj=tmerc +lat_0=54 +lon_0=-154 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26936":
        "+proj=tmerc +lat_0=54 +lon_0=-158 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26937":
        "+proj=tmerc +lat_0=54 +lon_0=-162 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26938":
        "+proj=tmerc +lat_0=54 +lon_0=-166 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26939":
        "+proj=tmerc +lat_0=54 +lon_0=-170 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26940":
        "+proj=lcc +lat_1=53.83333333333334 +lat_2=51.83333333333334 +lat_0=51 +lon_0=-176 +x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26941":
        "+proj=lcc +lat_1=41.66666666666666 +lat_2=40 +lat_0=39.33333333333334 +lon_0=-122 +x_0=2000000 +y_0=500000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26942":
        "+proj=lcc +lat_1=39.83333333333334 +lat_2=38.33333333333334 +lat_0=37.66666666666666 +lon_0=-122 +x_0=2000000 +y_0=500000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26943":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.06666666666667 +lat_0=36.5 +lon_0=-120.5 +x_0=2000000 +y_0=500000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26944":
        "+proj=lcc +lat_1=37.25 +lat_2=36 +lat_0=35.33333333333334 +lon_0=-119 +x_0=2000000 +y_0=500000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26945":
        "+proj=lcc +lat_1=35.46666666666667 +lat_2=34.03333333333333 +lat_0=33.5 +lon_0=-118 +x_0=2000000 +y_0=500000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26946":
        "+proj=lcc +lat_1=33.88333333333333 +lat_2=32.78333333333333 +lat_0=32.16666666666666 +lon_0=-116.25 +x_0=2000000 +y_0=500000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26948":
        "+proj=tmerc +lat_0=31 +lon_0=-110.1666666666667 +k=0.9999 +x_0=213360 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26949":
        "+proj=tmerc +lat_0=31 +lon_0=-111.9166666666667 +k=0.9999 +x_0=213360 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26950":
        "+proj=tmerc +lat_0=31 +lon_0=-113.75 +k=0.999933333 +x_0=213360 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26951":
        "+proj=lcc +lat_1=36.23333333333333 +lat_2=34.93333333333333 +lat_0=34.33333333333334 +lon_0=-92 +x_0=400000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26952":
        "+proj=lcc +lat_1=34.76666666666667 +lat_2=33.3 +lat_0=32.66666666666666 +lon_0=-92 +x_0=400000 +y_0=400000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26953":
        "+proj=lcc +lat_1=40.78333333333333 +lat_2=39.71666666666667 +lat_0=39.33333333333334 +lon_0=-105.5 +x_0=914401.8289 +y_0=304800.6096 +datum=NAD83 +units=m +no_defs",
      "EPSG:26954":
        "+proj=lcc +lat_1=39.75 +lat_2=38.45 +lat_0=37.83333333333334 +lon_0=-105.5 +x_0=914401.8289 +y_0=304800.6096 +datum=NAD83 +units=m +no_defs",
      "EPSG:26955":
        "+proj=lcc +lat_1=38.43333333333333 +lat_2=37.23333333333333 +lat_0=36.66666666666666 +lon_0=-105.5 +x_0=914401.8289 +y_0=304800.6096 +datum=NAD83 +units=m +no_defs",
      "EPSG:26956":
        "+proj=lcc +lat_1=41.86666666666667 +lat_2=41.2 +lat_0=40.83333333333334 +lon_0=-72.75 +x_0=304800.6096 +y_0=152400.3048 +datum=NAD83 +units=m +no_defs",
      "EPSG:26957":
        "+proj=tmerc +lat_0=38 +lon_0=-75.41666666666667 +k=0.999995 +x_0=200000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26958":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-81 +k=0.999941177 +x_0=200000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26959":
        "+proj=tmerc +lat_0=24.33333333333333 +lon_0=-82 +k=0.999941177 +x_0=200000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26960":
        "+proj=lcc +lat_1=30.75 +lat_2=29.58333333333333 +lat_0=29 +lon_0=-84.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26961":
        "+proj=tmerc +lat_0=18.83333333333333 +lon_0=-155.5 +k=0.999966667 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26962":
        "+proj=tmerc +lat_0=20.33333333333333 +lon_0=-156.6666666666667 +k=0.999966667 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26963":
        "+proj=tmerc +lat_0=21.16666666666667 +lon_0=-158 +k=0.99999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26964":
        "+proj=tmerc +lat_0=21.83333333333333 +lon_0=-159.5 +k=0.99999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26965":
        "+proj=tmerc +lat_0=21.66666666666667 +lon_0=-160.1666666666667 +k=1 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26966":
        "+proj=tmerc +lat_0=30 +lon_0=-82.16666666666667 +k=0.9999 +x_0=200000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26967":
        "+proj=tmerc +lat_0=30 +lon_0=-84.16666666666667 +k=0.9999 +x_0=700000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26968":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-112.1666666666667 +k=0.9999473679999999 +x_0=200000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26969":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-114 +k=0.9999473679999999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26970":
        "+proj=tmerc +lat_0=41.66666666666666 +lon_0=-115.75 +k=0.999933333 +x_0=800000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26971":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26972":
        "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-90.16666666666667 +k=0.999941177 +x_0=700000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26973":
        "+proj=tmerc +lat_0=37.5 +lon_0=-85.66666666666667 +k=0.999966667 +x_0=100000 +y_0=250000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26974":
        "+proj=tmerc +lat_0=37.5 +lon_0=-87.08333333333333 +k=0.999966667 +x_0=900000 +y_0=250000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26975":
        "+proj=lcc +lat_1=43.26666666666667 +lat_2=42.06666666666667 +lat_0=41.5 +lon_0=-93.5 +x_0=1500000 +y_0=1000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26976":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.61666666666667 +lat_0=40 +lon_0=-93.5 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26977":
        "+proj=lcc +lat_1=39.78333333333333 +lat_2=38.71666666666667 +lat_0=38.33333333333334 +lon_0=-98 +x_0=400000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26978":
        "+proj=lcc +lat_1=38.56666666666667 +lat_2=37.26666666666667 +lat_0=36.66666666666666 +lon_0=-98.5 +x_0=400000 +y_0=400000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26979":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=37.96666666666667 +lat_0=37.5 +lon_0=-84.25 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26980":
        "+proj=lcc +lat_1=37.93333333333333 +lat_2=36.73333333333333 +lat_0=36.33333333333334 +lon_0=-85.75 +x_0=500000 +y_0=500000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26981":
        "+proj=lcc +lat_1=32.66666666666666 +lat_2=31.16666666666667 +lat_0=30.5 +lon_0=-92.5 +x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26982":
        "+proj=lcc +lat_1=30.7 +lat_2=29.3 +lat_0=28.5 +lon_0=-91.33333333333333 +x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26983":
        "+proj=tmerc +lat_0=43.66666666666666 +lon_0=-68.5 +k=0.9999 +x_0=300000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26984":
        "+proj=tmerc +lat_0=42.83333333333334 +lon_0=-70.16666666666667 +k=0.999966667 +x_0=900000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26985":
        "+proj=lcc +lat_1=39.45 +lat_2=38.3 +lat_0=37.66666666666666 +lon_0=-77 +x_0=400000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26986":
        "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26987":
        "+proj=lcc +lat_1=41.48333333333333 +lat_2=41.28333333333333 +lat_0=41 +lon_0=-70.5 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26988":
        "+proj=lcc +lat_1=47.08333333333334 +lat_2=45.48333333333333 +lat_0=44.78333333333333 +lon_0=-87 +x_0=8000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26989":
        "+proj=lcc +lat_1=45.7 +lat_2=44.18333333333333 +lat_0=43.31666666666667 +lon_0=-84.36666666666666 +x_0=6000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26990":
        "+proj=lcc +lat_1=43.66666666666666 +lat_2=42.1 +lat_0=41.5 +lon_0=-84.36666666666666 +x_0=4000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26991":
        "+proj=lcc +lat_1=48.63333333333333 +lat_2=47.03333333333333 +lat_0=46.5 +lon_0=-93.09999999999999 +x_0=800000 +y_0=100000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26992":
        "+proj=lcc +lat_1=47.05 +lat_2=45.61666666666667 +lat_0=45 +lon_0=-94.25 +x_0=800000 +y_0=100000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26993":
        "+proj=lcc +lat_1=45.21666666666667 +lat_2=43.78333333333333 +lat_0=43 +lon_0=-94 +x_0=800000 +y_0=100000 +datum=NAD83 +units=m +no_defs",
      "EPSG:26994":
        "+proj=tmerc +lat_0=29.5 +lon_0=-88.83333333333333 +k=0.99995 +x_0=300000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26995":
        "+proj=tmerc +lat_0=29.5 +lon_0=-90.33333333333333 +k=0.99995 +x_0=700000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26996":
        "+proj=tmerc +lat_0=35.83333333333334 +lon_0=-90.5 +k=0.999933333 +x_0=250000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26997":
        "+proj=tmerc +lat_0=35.83333333333334 +lon_0=-92.5 +k=0.999933333 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:26998":
        "+proj=tmerc +lat_0=36.16666666666666 +lon_0=-94.5 +k=0.999941177 +x_0=850000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:27037":
        "+proj=utm +zone=37 +ellps=clrk80 +towgs84=-243,-192,477,0,0,0,0 +units=m +no_defs",
      "EPSG:27038":
        "+proj=utm +zone=38 +ellps=clrk80 +towgs84=-243,-192,477,0,0,0,0 +units=m +no_defs",
      "EPSG:27039":
        "+proj=utm +zone=39 +ellps=clrk80 +towgs84=-243,-192,477,0,0,0,0 +units=m +no_defs",
      "EPSG:27040":
        "+proj=utm +zone=40 +ellps=clrk80 +towgs84=-243,-192,477,0,0,0,0 +units=m +no_defs",
      "EPSG:27120":
        "+proj=utm +zone=20 +ellps=intl +towgs84=-10,375,165,0,0,0,0 +units=m +no_defs",
      "EPSG:27200":
        "+proj=nzmg +lat_0=-41 +lon_0=173 +x_0=2510000 +y_0=6023150 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27205":
        "+proj=tmerc +lat_0=-36.87986527777778 +lon_0=174.7643393611111 +k=0.9999 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27206":
        "+proj=tmerc +lat_0=-37.76124980555556 +lon_0=176.46619725 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27207":
        "+proj=tmerc +lat_0=-38.62470277777778 +lon_0=177.8856362777778 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27208":
        "+proj=tmerc +lat_0=-39.65092930555556 +lon_0=176.6736805277778 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27209":
        "+proj=tmerc +lat_0=-39.13575830555556 +lon_0=174.22801175 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27210":
        "+proj=tmerc +lat_0=-39.51247038888889 +lon_0=175.6400368055556 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27211":
        "+proj=tmerc +lat_0=-40.24194713888889 +lon_0=175.4880996111111 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27212":
        "+proj=tmerc +lat_0=-40.92553263888889 +lon_0=175.6473496666667 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27213":
        "+proj=tmerc +lat_0=-41.30131963888888 +lon_0=174.7766231111111 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27214":
        "+proj=tmerc +lat_0=-40.71475905555556 +lon_0=172.6720465 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27215":
        "+proj=tmerc +lat_0=-41.27454472222222 +lon_0=173.2993168055555 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27216":
        "+proj=tmerc +lat_0=-41.28991152777778 +lon_0=172.1090281944444 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27217":
        "+proj=tmerc +lat_0=-41.81080286111111 +lon_0=171.5812600555556 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27218":
        "+proj=tmerc +lat_0=-42.33369427777778 +lon_0=171.5497713055556 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27219":
        "+proj=tmerc +lat_0=-42.68911658333333 +lon_0=173.0101333888889 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27220":
        "+proj=tmerc +lat_0=-41.54448666666666 +lon_0=173.8020741111111 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27221":
        "+proj=tmerc +lat_0=-42.88632236111111 +lon_0=170.9799935 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27222":
        "+proj=tmerc +lat_0=-43.11012813888889 +lon_0=170.2609258333333 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27223":
        "+proj=tmerc +lat_0=-43.97780288888889 +lon_0=168.606267 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27224":
        "+proj=tmerc +lat_0=-43.59063758333333 +lon_0=172.7271935833333 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27225":
        "+proj=tmerc +lat_0=-43.74871155555556 +lon_0=171.3607484722222 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27226":
        "+proj=tmerc +lat_0=-44.40222036111111 +lon_0=171.0572508333333 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27227":
        "+proj=tmerc +lat_0=-44.73526797222222 +lon_0=169.4677550833333 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27228":
        "+proj=tmerc +lat_0=-45.13290258333333 +lon_0=168.3986411944444 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27229":
        "+proj=tmerc +lat_0=-45.56372616666666 +lon_0=167.7388617777778 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27230":
        "+proj=tmerc +lat_0=-45.81619661111111 +lon_0=170.6285951666667 +k=1 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27231":
        "+proj=tmerc +lat_0=-45.86151336111111 +lon_0=170.2825891111111 +k=0.99996 +x_0=300000 +y_0=700000 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27232":
        "+proj=tmerc +lat_0=-46.60000961111111 +lon_0=168.342872 +k=1 +x_0=300002.66 +y_0=699999.58 +datum=nzgd49 +units=m +no_defs",
      "EPSG:27258": "+proj=utm +zone=58 +south +datum=nzgd49 +units=m +no_defs",
      "EPSG:27259": "+proj=utm +zone=59 +south +datum=nzgd49 +units=m +no_defs",
      "EPSG:27260": "+proj=utm +zone=60 +south +datum=nzgd49 +units=m +no_defs",
      "EPSG:27291":
        "+proj=tmerc +lat_0=-39 +lon_0=175.5 +k=1 +x_0=274319.5243848086 +y_0=365759.3658464114 +datum=nzgd49 +to_meter=0.9143984146160287 +no_defs",
      "EPSG:27292":
        "+proj=tmerc +lat_0=-44 +lon_0=171.5 +k=1 +x_0=457199.2073080143 +y_0=457199.2073080143 +datum=nzgd49 +to_meter=0.9143984146160287 +no_defs",
      "EPSG:27391":
        "+proj=tmerc +lat_0=58 +lon_0=-4.666666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs",
      "EPSG:27392":
        "+proj=tmerc +lat_0=58 +lon_0=-2.333333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs",
      "EPSG:27393":
        "+proj=tmerc +lat_0=58 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs",
      "EPSG:27394":
        "+proj=tmerc +lat_0=58 +lon_0=2.5 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs",
      "EPSG:27395":
        "+proj=tmerc +lat_0=58 +lon_0=6.166666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs",
      "EPSG:27396":
        "+proj=tmerc +lat_0=58 +lon_0=10.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs",
      "EPSG:27397":
        "+proj=tmerc +lat_0=58 +lon_0=14.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs",
      "EPSG:27398":
        "+proj=tmerc +lat_0=58 +lon_0=18.33333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs",
      "EPSG:27429":
        "+proj=utm +zone=29 +ellps=intl +towgs84=-223.237,110.193,36.649,0,0,0,0 +units=m +no_defs",
      "EPSG:27492":
        "+proj=tmerc +lat_0=39.66666666666666 +lon_0=-8.131906111111112 +k=1 +x_0=180.598 +y_0=-86.98999999999999 +ellps=intl +towgs84=-223.237,110.193,36.649,0,0,0,0 +units=m +no_defs",
      "EPSG:27493":
        "+proj=tmerc +lat_0=39.66666666666666 +lon_0=-8.131906111111112 +k=1 +x_0=180.598 +y_0=-86.98999999999999 +ellps=intl +towgs84=-223.237,110.193,36.649,0,0,0,0 +units=m +no_defs",
      "EPSG:27500":
        "+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=5.399999999999999 +k_0=0.99950908 +x_0=500000 +y_0=300000 +a=6376523 +b=6355862.933255573 +pm=2.337208333333333 +units=m +no_defs",
      "EPSG:27561":
        "+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27562":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27563":
        "+proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27564":
        "+proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27571":
        "+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=1200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27572":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27573":
        "+proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=3200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27574":
        "+proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=4185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27581":
        "+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=1200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27582":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27583":
        "+proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=3200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27584":
        "+proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=4185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27591":
        "+proj=lcc +lat_1=49.50000000000001 +lat_0=49.50000000000001 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27592":
        "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27593":
        "+proj=lcc +lat_1=44.10000000000001 +lat_0=44.10000000000001 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27594":
        "+proj=lcc +lat_1=42.16500000000001 +lat_0=42.16500000000001 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:27700":
        "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +datum=OSGB36 +units=m +no_defs",
      "EPSG:28191":
        "+proj=cass +lat_0=31.73409694444445 +lon_0=35.21208055555556 +x_0=170251.555 +y_0=126867.909 +a=6378300.789 +b=6356566.435 +towgs84=-275.722,94.7824,340.894,-8.001,-4.42,-11.821,1 +units=m +no_defs",
      "EPSG:28192":
        "+proj=tmerc +lat_0=31.73409694444445 +lon_0=35.21208055555556 +k=1 +x_0=170251.555 +y_0=1126867.909 +a=6378300.789 +b=6356566.435 +towgs84=-275.722,94.7824,340.894,-8.001,-4.42,-11.821,1 +units=m +no_defs",
      "EPSG:28193":
        "+proj=cass +lat_0=31.73409694444445 +lon_0=35.21208055555556 +x_0=170251.555 +y_0=1126867.909 +a=6378300.789 +b=6356566.435 +towgs84=-275.722,94.7824,340.894,-8.001,-4.42,-11.821,1 +units=m +no_defs",
      "EPSG:28232":
        "+proj=utm +zone=32 +south +a=6378249.2 +b=6356515 +towgs84=-148,51,-291,0,0,0,0 +units=m +no_defs",
      "EPSG:28348":
        "+proj=utm +zone=48 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28349":
        "+proj=utm +zone=49 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28350":
        "+proj=utm +zone=50 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28351":
        "+proj=utm +zone=51 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28352":
        "+proj=utm +zone=52 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28353":
        "+proj=utm +zone=53 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28354":
        "+proj=utm +zone=54 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28355":
        "+proj=utm +zone=55 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28356":
        "+proj=utm +zone=56 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28357":
        "+proj=utm +zone=57 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28358":
        "+proj=utm +zone=58 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:28402":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=2500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28403":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28404":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28405":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28406":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28407":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28408":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=8500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28409":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=9500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28410":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=10500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28411":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=11500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28412":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=12500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28413":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=13500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28414":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=14500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28415":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=15500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28416":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=16500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28417":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=17500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28418":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28419":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28420":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=20500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28421":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=21500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28422":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=22500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28423":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=23500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28424":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=24500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28425":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=25500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28426":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=26500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28427":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=27500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28428":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=28500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28429":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=29500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28430":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=30500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28431":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=31500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28432":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=32500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28462":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28463":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28464":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28465":
        "+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28466":
        "+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28467":
        "+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28468":
        "+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28469":
        "+proj=tmerc +lat_0=0 +lon_0=51 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28470":
        "+proj=tmerc +lat_0=0 +lon_0=57 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28471":
        "+proj=tmerc +lat_0=0 +lon_0=63 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28472":
        "+proj=tmerc +lat_0=0 +lon_0=69 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28473":
        "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28474":
        "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28475":
        "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28476":
        "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28477":
        "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28478":
        "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28479":
        "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28480":
        "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28481":
        "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28482":
        "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28483":
        "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28484":
        "+proj=tmerc +lat_0=0 +lon_0=141 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28485":
        "+proj=tmerc +lat_0=0 +lon_0=147 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28486":
        "+proj=tmerc +lat_0=0 +lon_0=153 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28487":
        "+proj=tmerc +lat_0=0 +lon_0=159 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28488":
        "+proj=tmerc +lat_0=0 +lon_0=165 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28489":
        "+proj=tmerc +lat_0=0 +lon_0=171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28490":
        "+proj=tmerc +lat_0=0 +lon_0=177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28491":
        "+proj=tmerc +lat_0=0 +lon_0=-177 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28492":
        "+proj=tmerc +lat_0=0 +lon_0=-171 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs",
      "EPSG:28600":
        "+proj=tmerc +lat_0=24.45 +lon_0=51.21666666666667 +k=0.99999 +x_0=200000 +y_0=300000 +ellps=intl +towgs84=-128.16,-282.42,21.93,0,0,0,0 +units=m +no_defs",
      "EPSG:28991":
        "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=0 +y_0=0 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs",
      "EPSG:28992":
        "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs",
      "EPSG:29100":
        "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29101":
        "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29118":
        "+proj=utm +zone=18 +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29119":
        "+proj=utm +zone=19 +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29120":
        "+proj=utm +zone=20 +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29121":
        "+proj=utm +zone=21 +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29122":
        "+proj=utm +zone=22 +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29168":
        "+proj=utm +zone=18 +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29169":
        "+proj=utm +zone=19 +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29170":
        "+proj=utm +zone=20 +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29171":
        "+proj=utm +zone=21 +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29172":
        "+proj=utm +zone=22 +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29177":
        "+proj=utm +zone=17 +south +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29178":
        "+proj=utm +zone=18 +south +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29179":
        "+proj=utm +zone=19 +south +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29180":
        "+proj=utm +zone=20 +south +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29181":
        "+proj=utm +zone=21 +south +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29182":
        "+proj=utm +zone=22 +south +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29183":
        "+proj=utm +zone=23 +south +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29184":
        "+proj=utm +zone=24 +south +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29185":
        "+proj=utm +zone=25 +south +ellps=GRS67 +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29187":
        "+proj=utm +zone=17 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29188":
        "+proj=utm +zone=18 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29189":
        "+proj=utm +zone=19 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29190":
        "+proj=utm +zone=20 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29191":
        "+proj=utm +zone=21 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29192":
        "+proj=utm +zone=22 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29193":
        "+proj=utm +zone=23 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29194":
        "+proj=utm +zone=24 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29195":
        "+proj=utm +zone=25 +south +ellps=aust_SA +towgs84=-57,1,-41,0,0,0,0 +units=m +no_defs",
      "EPSG:29220":
        "+proj=utm +zone=20 +south +ellps=intl +towgs84=-355,21,72,0,0,0,0 +units=m +no_defs",
      "EPSG:29221":
        "+proj=utm +zone=21 +south +ellps=intl +towgs84=-355,21,72,0,0,0,0 +units=m +no_defs",
      "EPSG:29333":
        "+proj=utm +zone=33 +south +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +units=m +no_defs",
      "EPSG:29371":
        "+proj=tmerc +lat_0=-22 +lon_0=11 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +to_meter=1.0000135965 +no_defs",
      "EPSG:29373":
        "+proj=tmerc +lat_0=-22 +lon_0=13 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +to_meter=1.0000135965 +no_defs",
      "EPSG:29375":
        "+proj=tmerc +lat_0=-22 +lon_0=15 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +to_meter=1.0000135965 +no_defs",
      "EPSG:29377":
        "+proj=tmerc +lat_0=-22 +lon_0=17 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +to_meter=1.0000135965 +no_defs",
      "EPSG:29379":
        "+proj=tmerc +lat_0=-22 +lon_0=19 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +to_meter=1.0000135965 +no_defs",
      "EPSG:29381":
        "+proj=tmerc +lat_0=-22 +lon_0=21 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +to_meter=1.0000135965 +no_defs",
      "EPSG:29383":
        "+proj=tmerc +lat_0=-22 +lon_0=23 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +to_meter=1.0000135965 +no_defs",
      "EPSG:29385":
        "+proj=tmerc +lat_0=-22 +lon_0=25 +k=1 +x_0=0 +y_0=0 +axis=wsu +ellps=bess_nam +towgs84=616,97,-251,0,0,0,0 +to_meter=1.0000135965 +no_defs",
      "EPSG:29635":
        "+proj=utm +zone=35 +a=6378249.2 +b=6356515 +units=m +no_defs",
      "EPSG:29636":
        "+proj=utm +zone=36 +a=6378249.2 +b=6356515 +units=m +no_defs",
      "EPSG:29700":
        "+proj=omerc +lat_0=-18.9 +lonc=44.10000000000001 +alpha=18.9 +k=0.9995000000000001 +x_0=400000 +y_0=800000 +gamma=18.9 +ellps=intl +towgs84=-189,-242,-91,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:29701":
        "+proj=labrd +lat_0=-18.9 +lon_0=44.1 +azi=18.9 +k=0.9995 +x_0=400000 +y_0=800000 +ellps=intl +pm=paris +units=m +no_defs",
      "EPSG:29702":
        "+proj=omerc +lat_0=-18.9 +lonc=44.10000000000001 +alpha=18.9 +k=0.9995000000000001 +x_0=400000 +y_0=800000 +gamma=18.9 +ellps=intl +towgs84=-189,-242,-91,0,0,0,0 +pm=paris +units=m +no_defs",
      "EPSG:29738":
        "+proj=utm +zone=38 +south +ellps=intl +towgs84=-189,-242,-91,0,0,0,0 +units=m +no_defs",
      "EPSG:29739":
        "+proj=utm +zone=39 +south +ellps=intl +towgs84=-189,-242,-91,0,0,0,0 +units=m +no_defs",
      "EPSG:29849":
        "+proj=utm +zone=49 +ellps=evrstSS +towgs84=-533.4,669.2,-52.5,0,0,4.28,9.4 +units=m +no_defs",
      "EPSG:29850":
        "+proj=utm +zone=50 +ellps=evrstSS +towgs84=-533.4,669.2,-52.5,0,0,4.28,9.4 +units=m +no_defs",
      "EPSG:29871":
        "+proj=omerc +lat_0=4 +lonc=115 +alpha=53.31582047222222 +k=0.99984 +x_0=590476.8714630401 +y_0=442857.653094361 +gamma=53.13010236111111 +ellps=evrstSS +towgs84=-533.4,669.2,-52.5,0,0,4.28,9.4 +to_meter=20.11676512155263 +no_defs",
      "EPSG:29872":
        "+proj=omerc +lat_0=4 +lonc=115 +alpha=53.31582047222222 +k=0.99984 +x_0=590476.8727431979 +y_0=442857.6545573985 +gamma=53.13010236111111 +ellps=evrstSS +towgs84=-533.4,669.2,-52.5,0,0,4.28,9.4 +to_meter=0.3047994715386762 +no_defs",
      "EPSG:29873":
        "+proj=omerc +lat_0=4 +lonc=115 +alpha=53.31582047222222 +k=0.99984 +x_0=590476.87 +y_0=442857.65 +gamma=53.13010236111111 +ellps=evrstSS +towgs84=-533.4,669.2,-52.5,0,0,4.28,9.4 +units=m +no_defs",
      "EPSG:29874":
        "+proj=omerc +no_uoff +lat_0=4 +lonc=115 +alpha=53.3158204722222 +gamma=53.1301023611111 +k=0.99984 +x_0=2000000 +y_0=5000000 +ellps=evrstSS +towgs84=-679,669,-48,0,0,0,0 +units=m +no_defs",
      "EPSG:29900":
        "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +datum=ire65 +units=m +no_defs",
      "EPSG:29901":
        "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1 +x_0=200000 +y_0=250000 +ellps=airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs",
      "EPSG:29902":
        "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +datum=ire65 +units=m +no_defs",
      "EPSG:29903":
        "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs",
      "EPSG:30161":
        "+proj=tmerc +lat_0=33 +lon_0=129.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30162":
        "+proj=tmerc +lat_0=33 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30163":
        "+proj=tmerc +lat_0=36 +lon_0=132.1666666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30164":
        "+proj=tmerc +lat_0=33 +lon_0=133.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30165":
        "+proj=tmerc +lat_0=36 +lon_0=134.3333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30166":
        "+proj=tmerc +lat_0=36 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30167":
        "+proj=tmerc +lat_0=36 +lon_0=137.1666666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30168":
        "+proj=tmerc +lat_0=36 +lon_0=138.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30169":
        "+proj=tmerc +lat_0=36 +lon_0=139.8333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30170":
        "+proj=tmerc +lat_0=40 +lon_0=140.8333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30171":
        "+proj=tmerc +lat_0=44 +lon_0=140.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30172":
        "+proj=tmerc +lat_0=44 +lon_0=142.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30173":
        "+proj=tmerc +lat_0=44 +lon_0=144.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30174":
        "+proj=tmerc +lat_0=26 +lon_0=142 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30175":
        "+proj=tmerc +lat_0=26 +lon_0=127.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30176":
        "+proj=tmerc +lat_0=26 +lon_0=124 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30177":
        "+proj=tmerc +lat_0=26 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30178":
        "+proj=tmerc +lat_0=20 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30179":
        "+proj=tmerc +lat_0=26 +lon_0=154 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
      "EPSG:30200":
        "+proj=cass +lat_0=10.44166666666667 +lon_0=-61.33333333333334 +x_0=86501.46392051999 +y_0=65379.0134283 +a=6378293.645208759 +b=6356617.987679838 +towgs84=-61.702,284.488,472.052,0,0,0,0 +to_meter=0.201166195164 +no_defs",
      "EPSG:30339": "+proj=utm +zone=39 +ellps=helmert +units=m +no_defs",
      "EPSG:30340": "+proj=utm +zone=40 +ellps=helmert +units=m +no_defs",
      "EPSG:30491":
        "+proj=lcc +lat_1=36 +lat_0=36 +lon_0=2.7 +k_0=0.999625544 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=-73,-247,227,0,0,0,0 +units=m +no_defs",
      "EPSG:30492":
        "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=2.7 +k_0=0.999625769 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=-73,-247,227,0,0,0,0 +units=m +no_defs",
      "EPSG:30493":
        "+proj=lcc +lat_1=36 +lat_0=36 +lon_0=2.7 +k_0=0.999625544 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +units=m +no_defs",
      "EPSG:30494":
        "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=2.7 +k_0=0.999625769 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +units=m +no_defs",
      "EPSG:30729":
        "+proj=utm +zone=29 +ellps=clrk80 +towgs84=-186,-93,310,0,0,0,0 +units=m +no_defs",
      "EPSG:30730":
        "+proj=utm +zone=30 +ellps=clrk80 +towgs84=-186,-93,310,0,0,0,0 +units=m +no_defs",
      "EPSG:30731":
        "+proj=utm +zone=31 +ellps=clrk80 +towgs84=-186,-93,310,0,0,0,0 +units=m +no_defs",
      "EPSG:30732":
        "+proj=utm +zone=32 +ellps=clrk80 +towgs84=-186,-93,310,0,0,0,0 +units=m +no_defs",
      "EPSG:30791":
        "+proj=lcc +lat_1=36 +lat_0=36 +lon_0=2.7 +k_0=0.999625544 +x_0=500135 +y_0=300090 +ellps=clrk80 +towgs84=-186,-93,310,0,0,0,0 +units=m +no_defs",
      "EPSG:30792":
        "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=2.7 +k_0=0.999625769 +x_0=500135 +y_0=300090 +ellps=clrk80 +towgs84=-186,-93,310,0,0,0,0 +units=m +no_defs",
      "EPSG:30800":
        "+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs",
      "EPSG:31028":
        "+proj=utm +zone=28 +a=6378249.2 +b=6356515 +units=m +no_defs",
      "EPSG:31121":
        "+proj=utm +zone=21 +ellps=intl +towgs84=-265,120,-358,0,0,0,0 +units=m +no_defs",
      "EPSG:31154":
        "+proj=tmerc +lat_0=0 +lon_0=-54 +k=0.9996 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-265,120,-358,0,0,0,0 +units=m +no_defs",
      "EPSG:31170":
        "+proj=tmerc +lat_0=0 +lon_0=-55.68333333333333 +k=0.9996 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-265,120,-358,0,0,0,0 +units=m +no_defs",
      "EPSG:31171":
        "+proj=tmerc +lat_0=0 +lon_0=-55.68333333333333 +k=0.9999 +x_0=500000 +y_0=0 +ellps=intl +towgs84=-265,120,-358,0,0,0,0 +units=m +no_defs",
      "EPSG:31251":
        "+proj=tmerc +lat_0=0 +lon_0=28 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31252":
        "+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31253":
        "+proj=tmerc +lat_0=0 +lon_0=34 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31254":
        "+proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31255":
        "+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31256":
        "+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31257":
        "+proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1 +x_0=150000 +y_0=-5000000 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31258":
        "+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=450000 +y_0=-5000000 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31259":
        "+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=750000 +y_0=-5000000 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31265":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31266":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=6500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31267":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=7500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31268":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=8500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31275":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.9999 +x_0=5500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31276":
        "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.9999 +x_0=6500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31277":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=7500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31278":
        "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=7500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31279":
        "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9999 +x_0=8500000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31281":
        "+proj=tmerc +lat_0=0 +lon_0=28 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31282":
        "+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31283":
        "+proj=tmerc +lat_0=0 +lon_0=34 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31284":
        "+proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1 +x_0=150000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31285":
        "+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=450000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31286":
        "+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=750000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31287":
        "+proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +x_0=400000 +y_0=400000 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31288":
        "+proj=tmerc +lat_0=0 +lon_0=28 +k=1 +x_0=150000 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31289":
        "+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=450000 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31290":
        "+proj=tmerc +lat_0=0 +lon_0=34 +k=1 +x_0=750000 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31291":
        "+proj=tmerc +lat_0=0 +lon_0=28 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31292":
        "+proj=tmerc +lat_0=0 +lon_0=31 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31293":
        "+proj=tmerc +lat_0=0 +lon_0=34 +k=1 +x_0=0 +y_0=0 +ellps=bessel +towgs84=682,-203,480,0,0,0,0 +pm=ferro +units=m +no_defs",
      "EPSG:31294":
        "+proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1 +x_0=150000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31295":
        "+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=450000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31296":
        "+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=750000 +y_0=0 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31297":
        "+proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +x_0=400000 +y_0=400000 +datum=hermannskogel +units=m +no_defs",
      "EPSG:31300":
        "+proj=lcc +lat_1=49.83333333333334 +lat_2=51.16666666666666 +lat_0=90 +lon_0=4.356939722222222 +x_0=150000.01256 +y_0=5400088.4378 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs",
      "EPSG:31370":
        "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs",
      "EPSG:31461":
        "+proj=tmerc +lat_0=0 +lon_0=3 +k=1 +x_0=1500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:31462":
        "+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:31463":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:31464":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:31465":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:31466":
        "+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:31467":
        "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:31468":
        "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:31469":
        "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +datum=potsdam +units=m +no_defs",
      "EPSG:31528":
        "+proj=utm +zone=28 +a=6378249.2 +b=6356515 +towgs84=-23,259,-9,0,0,0,0 +units=m +no_defs",
      "EPSG:31529":
        "+proj=utm +zone=29 +a=6378249.2 +b=6356515 +towgs84=-23,259,-9,0,0,0,0 +units=m +no_defs",
      "EPSG:31600":
        "+proj=sterea +lat_0=45.9 +lon_0=25.39246588888889 +k=0.9996667 +x_0=500000 +y_0=500000 +ellps=intl +towgs84=103.25,-100.4,-307.19,0,0,0,0 +units=m +no_defs",
      "EPSG:31700":
        "+proj=sterea +lat_0=46 +lon_0=25 +k=0.99975 +x_0=500000 +y_0=500000 +ellps=krass +towgs84=28,-121,-77,0,0,0,0 +units=m +no_defs",
      "EPSG:31838":
        "+proj=utm +zone=38 +ellps=WGS84 +towgs84=-3.2,-5.7,2.8,0,0,0,0 +units=m +no_defs",
      "EPSG:31839":
        "+proj=utm +zone=39 +ellps=WGS84 +towgs84=-3.2,-5.7,2.8,0,0,0,0 +units=m +no_defs",
      "EPSG:31900":
        "+proj=tmerc +lat_0=0 +lon_0=48 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-20.8,11.3,2.4,0,0,0,0 +units=m +no_defs",
      "EPSG:31901":
        "+proj=tmerc +lat_0=0 +lon_0=48 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-20.8,11.3,2.4,0,0,0,0 +units=m +no_defs",
      "EPSG:31965":
        "+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31966":
        "+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31967":
        "+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31968":
        "+proj=utm +zone=14 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31969":
        "+proj=utm +zone=15 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31970":
        "+proj=utm +zone=16 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31971":
        "+proj=utm +zone=17 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31972":
        "+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31973":
        "+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31974":
        "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31975":
        "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31976":
        "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31977":
        "+proj=utm +zone=17 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31978":
        "+proj=utm +zone=18 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31979":
        "+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31980":
        "+proj=utm +zone=20 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31981":
        "+proj=utm +zone=21 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31982":
        "+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31983":
        "+proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31984":
        "+proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31985":
        "+proj=utm +zone=25 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31986":
        "+proj=utm +zone=17 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31987":
        "+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31988":
        "+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31989":
        "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31990":
        "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31991":
        "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31992":
        "+proj=utm +zone=17 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31993":
        "+proj=utm +zone=18 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31994":
        "+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31995":
        "+proj=utm +zone=20 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31996":
        "+proj=utm +zone=21 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31997":
        "+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31998":
        "+proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:31999":
        "+proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:32000":
        "+proj=utm +zone=25 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      "EPSG:32001":
        "+proj=lcc +lat_1=48.71666666666667 +lat_2=47.85 +lat_0=47 +lon_0=-109.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32002":
        "+proj=lcc +lat_1=47.88333333333333 +lat_2=46.45 +lat_0=45.83333333333334 +lon_0=-109.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32003":
        "+proj=lcc +lat_1=46.4 +lat_2=44.86666666666667 +lat_0=44 +lon_0=-109.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32005":
        "+proj=lcc +lat_1=41.85 +lat_2=42.81666666666667 +lat_0=41.33333333333334 +lon_0=-100 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32006":
        "+proj=lcc +lat_1=40.28333333333333 +lat_2=41.71666666666667 +lat_0=39.66666666666666 +lon_0=-99.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32007":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.5833333333333 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32008":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.6666666666667 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32009":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.5833333333333 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32010":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.66666666666667 +k=0.999966667 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32011":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.66666666666667 +k=0.9999749999999999 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32012":
        "+proj=tmerc +lat_0=31 +lon_0=-104.3333333333333 +k=0.999909091 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32013":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32014":
        "+proj=tmerc +lat_0=31 +lon_0=-107.8333333333333 +k=0.999916667 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32015":
        "+proj=tmerc +lat_0=40 +lon_0=-74.33333333333333 +k=0.999966667 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32016":
        "+proj=tmerc +lat_0=40 +lon_0=-76.58333333333333 +k=0.9999375 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32017":
        "+proj=tmerc +lat_0=40 +lon_0=-78.58333333333333 +k=0.9999375 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32018":
        "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.5 +lon_0=-74 +x_0=304800.6096012192 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32019":
        "+proj=lcc +lat_1=34.33333333333334 +lat_2=36.16666666666666 +lat_0=33.75 +lon_0=-79 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32020":
        "+proj=lcc +lat_1=47.43333333333333 +lat_2=48.73333333333333 +lat_0=47 +lon_0=-100.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32021":
        "+proj=lcc +lat_1=46.18333333333333 +lat_2=47.48333333333333 +lat_0=45.66666666666666 +lon_0=-100.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32022":
        "+proj=lcc +lat_1=40.43333333333333 +lat_2=41.7 +lat_0=39.66666666666666 +lon_0=-82.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32023":
        "+proj=lcc +lat_1=38.73333333333333 +lat_2=40.03333333333333 +lat_0=38 +lon_0=-82.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32024":
        "+proj=lcc +lat_1=35.56666666666667 +lat_2=36.76666666666667 +lat_0=35 +lon_0=-98 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32025":
        "+proj=lcc +lat_1=33.93333333333333 +lat_2=35.23333333333333 +lat_0=33.33333333333334 +lon_0=-98 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32026":
        "+proj=lcc +lat_1=44.33333333333334 +lat_2=46 +lat_0=43.66666666666666 +lon_0=-120.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32027":
        "+proj=lcc +lat_1=42.33333333333334 +lat_2=44 +lat_0=41.66666666666666 +lon_0=-120.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32028":
        "+proj=lcc +lat_1=40.88333333333333 +lat_2=41.95 +lat_0=40.16666666666666 +lon_0=-77.75 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32029":
        "+proj=lcc +lat_1=39.93333333333333 +lat_2=40.8 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32030":
        "+proj=tmerc +lat_0=41.08333333333334 +lon_0=-71.5 +k=0.9999938 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32031":
        "+proj=lcc +lat_1=33.76666666666667 +lat_2=34.96666666666667 +lat_0=33 +lon_0=-81 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32033":
        "+proj=lcc +lat_1=32.33333333333334 +lat_2=33.66666666666666 +lat_0=31.83333333333333 +lon_0=-81 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32034":
        "+proj=lcc +lat_1=44.41666666666666 +lat_2=45.68333333333333 +lat_0=43.83333333333334 +lon_0=-100 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32035":
        "+proj=lcc +lat_1=42.83333333333334 +lat_2=44.4 +lat_0=42.33333333333334 +lon_0=-100.3333333333333 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32036":
        "+proj=lcc +lat_1=35.25 +lat_2=36.41666666666666 +lat_0=34.66666666666666 +lon_0=-86 +x_0=30480.06096012192 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32037":
        "+proj=lcc +lat_1=34.65 +lat_2=36.18333333333333 +lat_0=34 +lon_0=-101.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32038":
        "+proj=lcc +lat_1=32.13333333333333 +lat_2=33.96666666666667 +lat_0=31.66666666666667 +lon_0=-97.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32039":
        "+proj=lcc +lat_1=30.11666666666667 +lat_2=31.88333333333333 +lat_0=29.66666666666667 +lon_0=-100.3333333333333 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32040":
        "+proj=lcc +lat_1=28.38333333333333 +lat_2=30.28333333333333 +lat_0=27.83333333333333 +lon_0=-99 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32041":
        "+proj=lcc +lat_1=26.16666666666667 +lat_2=27.83333333333333 +lat_0=25.66666666666667 +lon_0=-98.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32042":
        "+proj=lcc +lat_1=40.71666666666667 +lat_2=41.78333333333333 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32043":
        "+proj=lcc +lat_1=39.01666666666667 +lat_2=40.65 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32044":
        "+proj=lcc +lat_1=37.21666666666667 +lat_2=38.35 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32045":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32046":
        "+proj=lcc +lat_1=38.03333333333333 +lat_2=39.2 +lat_0=37.66666666666666 +lon_0=-78.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32047":
        "+proj=lcc +lat_1=36.76666666666667 +lat_2=37.96666666666667 +lat_0=36.33333333333334 +lon_0=-78.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32048":
        "+proj=lcc +lat_1=47.5 +lat_2=48.73333333333333 +lat_0=47 +lon_0=-120.8333333333333 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32049":
        "+proj=lcc +lat_1=45.83333333333334 +lat_2=47.33333333333334 +lat_0=45.33333333333334 +lon_0=-120.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32050":
        "+proj=lcc +lat_1=39 +lat_2=40.25 +lat_0=38.5 +lon_0=-79.5 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32051":
        "+proj=lcc +lat_1=37.48333333333333 +lat_2=38.88333333333333 +lat_0=37 +lon_0=-81 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32052":
        "+proj=lcc +lat_1=45.56666666666667 +lat_2=46.76666666666667 +lat_0=45.16666666666666 +lon_0=-90 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32053":
        "+proj=lcc +lat_1=44.25 +lat_2=45.5 +lat_0=43.83333333333334 +lon_0=-90 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32054":
        "+proj=lcc +lat_1=42.73333333333333 +lat_2=44.06666666666667 +lat_0=42 +lon_0=-90 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32055":
        "+proj=tmerc +lat_0=40.66666666666666 +lon_0=-105.1666666666667 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32056":
        "+proj=tmerc +lat_0=40.66666666666666 +lon_0=-107.3333333333333 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32057":
        "+proj=tmerc +lat_0=40.66666666666666 +lon_0=-108.75 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32058":
        "+proj=tmerc +lat_0=40.66666666666666 +lon_0=-110.0833333333333 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32061":
        "+proj=lcc +lat_1=16.81666666666667 +lat_0=16.81666666666667 +lon_0=-90.33333333333333 +k_0=0.99992226 +x_0=500000 +y_0=292209.579 +datum=NAD27 +units=m +no_defs",
      "EPSG:32062":
        "+proj=lcc +lat_1=14.9 +lat_0=14.9 +lon_0=-90.33333333333333 +k_0=0.99989906 +x_0=500000 +y_0=325992.681 +datum=NAD27 +units=m +no_defs",
      "EPSG:32064":
        "+proj=tmerc +lat_0=0 +lon_0=-99 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32065":
        "+proj=tmerc +lat_0=0 +lon_0=-93 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32066":
        "+proj=tmerc +lat_0=0 +lon_0=-87 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32067":
        "+proj=tmerc +lat_0=0 +lon_0=-81 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32074":
        "+proj=tmerc +lat_0=0 +lon_0=-99 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32075":
        "+proj=tmerc +lat_0=0 +lon_0=-93 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32076":
        "+proj=tmerc +lat_0=0 +lon_0=-87 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32077":
        "+proj=tmerc +lat_0=0 +lon_0=-81 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32081":
        "+proj=tmerc +lat_0=0 +lon_0=-53 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:32082":
        "+proj=tmerc +lat_0=0 +lon_0=-56 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:32083":
        "+proj=tmerc +lat_0=0 +lon_0=-58.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:32084":
        "+proj=tmerc +lat_0=0 +lon_0=-61.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:32085":
        "+proj=tmerc +lat_0=0 +lon_0=-64.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:32086":
        "+proj=tmerc +lat_0=0 +lon_0=-67.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:32098":
        "+proj=lcc +lat_1=60 +lat_2=46 +lat_0=44 +lon_0=-68.5 +x_0=0 +y_0=0 +datum=NAD27 +units=m +no_defs",
      "EPSG:32099":
        "+proj=lcc +lat_1=27.83333333333333 +lat_2=26.16666666666667 +lat_0=25.66666666666667 +lon_0=-91.33333333333333 +x_0=609601.2192024384 +y_0=0 +datum=NAD27 +units=us-ft +no_defs",
      "EPSG:32100":
        "+proj=lcc +lat_1=49 +lat_2=45 +lat_0=44.25 +lon_0=-109.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32104":
        "+proj=lcc +lat_1=43 +lat_2=40 +lat_0=39.83333333333334 +lon_0=-100 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32107":
        "+proj=tmerc +lat_0=34.75 +lon_0=-115.5833333333333 +k=0.9999 +x_0=200000 +y_0=8000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32108":
        "+proj=tmerc +lat_0=34.75 +lon_0=-116.6666666666667 +k=0.9999 +x_0=500000 +y_0=6000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32109":
        "+proj=tmerc +lat_0=34.75 +lon_0=-118.5833333333333 +k=0.9999 +x_0=800000 +y_0=4000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32110":
        "+proj=tmerc +lat_0=42.5 +lon_0=-71.66666666666667 +k=0.999966667 +x_0=300000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32111":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32112":
        "+proj=tmerc +lat_0=31 +lon_0=-104.3333333333333 +k=0.999909091 +x_0=165000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32113":
        "+proj=tmerc +lat_0=31 +lon_0=-106.25 +k=0.9999 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32114":
        "+proj=tmerc +lat_0=31 +lon_0=-107.8333333333333 +k=0.999916667 +x_0=830000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32115":
        "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32116":
        "+proj=tmerc +lat_0=40 +lon_0=-76.58333333333333 +k=0.9999375 +x_0=250000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32117":
        "+proj=tmerc +lat_0=40 +lon_0=-78.58333333333333 +k=0.9999375 +x_0=350000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32118":
        "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32119":
        "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.22 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32120":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.43333333333333 +lat_0=47 +lon_0=-100.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32121":
        "+proj=lcc +lat_1=47.48333333333333 +lat_2=46.18333333333333 +lat_0=45.66666666666666 +lon_0=-100.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32122":
        "+proj=lcc +lat_1=41.7 +lat_2=40.43333333333333 +lat_0=39.66666666666666 +lon_0=-82.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32123":
        "+proj=lcc +lat_1=40.03333333333333 +lat_2=38.73333333333333 +lat_0=38 +lon_0=-82.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32124":
        "+proj=lcc +lat_1=36.76666666666667 +lat_2=35.56666666666667 +lat_0=35 +lon_0=-98 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32125":
        "+proj=lcc +lat_1=35.23333333333333 +lat_2=33.93333333333333 +lat_0=33.33333333333334 +lon_0=-98 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32126":
        "+proj=lcc +lat_1=46 +lat_2=44.33333333333334 +lat_0=43.66666666666666 +lon_0=-120.5 +x_0=2500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32127":
        "+proj=lcc +lat_1=44 +lat_2=42.33333333333334 +lat_0=41.66666666666666 +lon_0=-120.5 +x_0=1500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32128":
        "+proj=lcc +lat_1=41.95 +lat_2=40.88333333333333 +lat_0=40.16666666666666 +lon_0=-77.75 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32129":
        "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32130":
        "+proj=tmerc +lat_0=41.08333333333334 +lon_0=-71.5 +k=0.99999375 +x_0=100000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32133":
        "+proj=lcc +lat_1=34.83333333333334 +lat_2=32.5 +lat_0=31.83333333333333 +lon_0=-81 +x_0=609600 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32134":
        "+proj=lcc +lat_1=45.68333333333333 +lat_2=44.41666666666666 +lat_0=43.83333333333334 +lon_0=-100 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32135":
        "+proj=lcc +lat_1=44.4 +lat_2=42.83333333333334 +lat_0=42.33333333333334 +lon_0=-100.3333333333333 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32136":
        "+proj=lcc +lat_1=36.41666666666666 +lat_2=35.25 +lat_0=34.33333333333334 +lon_0=-86 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32137":
        "+proj=lcc +lat_1=36.18333333333333 +lat_2=34.65 +lat_0=34 +lon_0=-101.5 +x_0=200000 +y_0=1000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32138":
        "+proj=lcc +lat_1=33.96666666666667 +lat_2=32.13333333333333 +lat_0=31.66666666666667 +lon_0=-98.5 +x_0=600000 +y_0=2000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32139":
        "+proj=lcc +lat_1=31.88333333333333 +lat_2=30.11666666666667 +lat_0=29.66666666666667 +lon_0=-100.3333333333333 +x_0=700000 +y_0=3000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32140":
        "+proj=lcc +lat_1=30.28333333333333 +lat_2=28.38333333333333 +lat_0=27.83333333333333 +lon_0=-99 +x_0=600000 +y_0=4000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32141":
        "+proj=lcc +lat_1=27.83333333333333 +lat_2=26.16666666666667 +lat_0=25.66666666666667 +lon_0=-98.5 +x_0=300000 +y_0=5000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32142":
        "+proj=lcc +lat_1=41.78333333333333 +lat_2=40.71666666666667 +lat_0=40.33333333333334 +lon_0=-111.5 +x_0=500000 +y_0=1000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32143":
        "+proj=lcc +lat_1=40.65 +lat_2=39.01666666666667 +lat_0=38.33333333333334 +lon_0=-111.5 +x_0=500000 +y_0=2000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32144":
        "+proj=lcc +lat_1=38.35 +lat_2=37.21666666666667 +lat_0=36.66666666666666 +lon_0=-111.5 +x_0=500000 +y_0=3000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32145":
        "+proj=tmerc +lat_0=42.5 +lon_0=-72.5 +k=0.999964286 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32146":
        "+proj=lcc +lat_1=39.2 +lat_2=38.03333333333333 +lat_0=37.66666666666666 +lon_0=-78.5 +x_0=3500000 +y_0=2000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32147":
        "+proj=lcc +lat_1=37.96666666666667 +lat_2=36.76666666666667 +lat_0=36.33333333333334 +lon_0=-78.5 +x_0=3500000 +y_0=1000000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32148":
        "+proj=lcc +lat_1=48.73333333333333 +lat_2=47.5 +lat_0=47 +lon_0=-120.8333333333333 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32149":
        "+proj=lcc +lat_1=47.33333333333334 +lat_2=45.83333333333334 +lat_0=45.33333333333334 +lon_0=-120.5 +x_0=500000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32150":
        "+proj=lcc +lat_1=40.25 +lat_2=39 +lat_0=38.5 +lon_0=-79.5 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32151":
        "+proj=lcc +lat_1=38.88333333333333 +lat_2=37.48333333333333 +lat_0=37 +lon_0=-81 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32152":
        "+proj=lcc +lat_1=46.76666666666667 +lat_2=45.56666666666667 +lat_0=45.16666666666666 +lon_0=-90 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32153":
        "+proj=lcc +lat_1=45.5 +lat_2=44.25 +lat_0=43.83333333333334 +lon_0=-90 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32154":
        "+proj=lcc +lat_1=44.06666666666667 +lat_2=42.73333333333333 +lat_0=42 +lon_0=-90 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32155":
        "+proj=tmerc +lat_0=40.5 +lon_0=-105.1666666666667 +k=0.9999375 +x_0=200000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32156":
        "+proj=tmerc +lat_0=40.5 +lon_0=-107.3333333333333 +k=0.9999375 +x_0=400000 +y_0=100000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32157":
        "+proj=tmerc +lat_0=40.5 +lon_0=-108.75 +k=0.9999375 +x_0=600000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32158":
        "+proj=tmerc +lat_0=40.5 +lon_0=-110.0833333333333 +k=0.9999375 +x_0=800000 +y_0=100000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32161":
        "+proj=lcc +lat_1=18.43333333333333 +lat_2=18.03333333333333 +lat_0=17.83333333333333 +lon_0=-66.43333333333334 +x_0=200000 +y_0=200000 +datum=NAD83 +units=m +no_defs",
      "EPSG:32164":
        "+proj=tmerc +lat_0=0 +lon_0=-99 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:32165":
        "+proj=tmerc +lat_0=0 +lon_0=-93 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:32166":
        "+proj=tmerc +lat_0=0 +lon_0=-87 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:32167":
        "+proj=tmerc +lat_0=0 +lon_0=-81 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=NAD83 +units=us-ft +no_defs",
      "EPSG:32180":
        "+proj=tmerc +lat_0=0 +lon_0=-55.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32181":
        "+proj=tmerc +lat_0=0 +lon_0=-53 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32182":
        "+proj=tmerc +lat_0=0 +lon_0=-56 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32183":
        "+proj=tmerc +lat_0=0 +lon_0=-58.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32184":
        "+proj=tmerc +lat_0=0 +lon_0=-61.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32185":
        "+proj=tmerc +lat_0=0 +lon_0=-64.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32186":
        "+proj=tmerc +lat_0=0 +lon_0=-67.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32187":
        "+proj=tmerc +lat_0=0 +lon_0=-70.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32188":
        "+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32189":
        "+proj=tmerc +lat_0=0 +lon_0=-76.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32190":
        "+proj=tmerc +lat_0=0 +lon_0=-79.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32191":
        "+proj=tmerc +lat_0=0 +lon_0=-82.5 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32192":
        "+proj=tmerc +lat_0=0 +lon_0=-81 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32193":
        "+proj=tmerc +lat_0=0 +lon_0=-84 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32194":
        "+proj=tmerc +lat_0=0 +lon_0=-87 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32195":
        "+proj=tmerc +lat_0=0 +lon_0=-90 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32196":
        "+proj=tmerc +lat_0=0 +lon_0=-93 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32197":
        "+proj=tmerc +lat_0=0 +lon_0=-96 +k=0.9999 +x_0=304800 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32198":
        "+proj=lcc +lat_1=60 +lat_2=46 +lat_0=44 +lon_0=-68.5 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32199":
        "+proj=lcc +lat_1=27.83333333333333 +lat_2=26.16666666666667 +lat_0=25.5 +lon_0=-91.33333333333333 +x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
      "EPSG:32201":
        "+proj=utm +zone=1 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32202":
        "+proj=utm +zone=2 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32203":
        "+proj=utm +zone=3 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32204":
        "+proj=utm +zone=4 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32205":
        "+proj=utm +zone=5 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32206":
        "+proj=utm +zone=6 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32207":
        "+proj=utm +zone=7 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32208":
        "+proj=utm +zone=8 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32209":
        "+proj=utm +zone=9 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32210":
        "+proj=utm +zone=10 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32211":
        "+proj=utm +zone=11 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32212":
        "+proj=utm +zone=12 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32213":
        "+proj=utm +zone=13 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32214":
        "+proj=utm +zone=14 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32215":
        "+proj=utm +zone=15 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32216":
        "+proj=utm +zone=16 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32217":
        "+proj=utm +zone=17 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32218":
        "+proj=utm +zone=18 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32219":
        "+proj=utm +zone=19 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32220":
        "+proj=utm +zone=20 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32221":
        "+proj=utm +zone=21 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32222":
        "+proj=utm +zone=22 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32223":
        "+proj=utm +zone=23 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32224":
        "+proj=utm +zone=24 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32225":
        "+proj=utm +zone=25 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32226":
        "+proj=utm +zone=26 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32227":
        "+proj=utm +zone=27 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32228":
        "+proj=utm +zone=28 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32229":
        "+proj=utm +zone=29 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32230":
        "+proj=utm +zone=30 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32231":
        "+proj=utm +zone=31 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32232":
        "+proj=utm +zone=32 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32233":
        "+proj=utm +zone=33 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32234":
        "+proj=utm +zone=34 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32235":
        "+proj=utm +zone=35 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32236":
        "+proj=utm +zone=36 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32237":
        "+proj=utm +zone=37 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32238":
        "+proj=utm +zone=38 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32239":
        "+proj=utm +zone=39 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32240":
        "+proj=utm +zone=40 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32241":
        "+proj=utm +zone=41 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32242":
        "+proj=utm +zone=42 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32243":
        "+proj=utm +zone=43 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32244":
        "+proj=utm +zone=44 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32245":
        "+proj=utm +zone=45 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32246":
        "+proj=utm +zone=46 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32247":
        "+proj=utm +zone=47 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32248":
        "+proj=utm +zone=48 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32249":
        "+proj=utm +zone=49 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32250":
        "+proj=utm +zone=50 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32251":
        "+proj=utm +zone=51 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32252":
        "+proj=utm +zone=52 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32253":
        "+proj=utm +zone=53 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32254":
        "+proj=utm +zone=54 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32255":
        "+proj=utm +zone=55 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32256":
        "+proj=utm +zone=56 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32257":
        "+proj=utm +zone=57 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32258":
        "+proj=utm +zone=58 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32259":
        "+proj=utm +zone=59 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32260":
        "+proj=utm +zone=60 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32301":
        "+proj=utm +zone=1 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32302":
        "+proj=utm +zone=2 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32303":
        "+proj=utm +zone=3 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32304":
        "+proj=utm +zone=4 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32305":
        "+proj=utm +zone=5 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32306":
        "+proj=utm +zone=6 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32307":
        "+proj=utm +zone=7 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32308":
        "+proj=utm +zone=8 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32309":
        "+proj=utm +zone=9 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32310":
        "+proj=utm +zone=10 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32311":
        "+proj=utm +zone=11 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32312":
        "+proj=utm +zone=12 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32313":
        "+proj=utm +zone=13 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32314":
        "+proj=utm +zone=14 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32315":
        "+proj=utm +zone=15 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32316":
        "+proj=utm +zone=16 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32317":
        "+proj=utm +zone=17 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32318":
        "+proj=utm +zone=18 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32319":
        "+proj=utm +zone=19 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32320":
        "+proj=utm +zone=20 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32321":
        "+proj=utm +zone=21 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32322":
        "+proj=utm +zone=22 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32323":
        "+proj=utm +zone=23 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32324":
        "+proj=utm +zone=24 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32325":
        "+proj=utm +zone=25 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32326":
        "+proj=utm +zone=26 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32327":
        "+proj=utm +zone=27 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32328":
        "+proj=utm +zone=28 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32329":
        "+proj=utm +zone=29 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32330":
        "+proj=utm +zone=30 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32331":
        "+proj=utm +zone=31 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32332":
        "+proj=utm +zone=32 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32333":
        "+proj=utm +zone=33 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32334":
        "+proj=utm +zone=34 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32335":
        "+proj=utm +zone=35 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32336":
        "+proj=utm +zone=36 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32337":
        "+proj=utm +zone=37 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32338":
        "+proj=utm +zone=38 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32339":
        "+proj=utm +zone=39 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32340":
        "+proj=utm +zone=40 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32341":
        "+proj=utm +zone=41 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32342":
        "+proj=utm +zone=42 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32343":
        "+proj=utm +zone=43 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32344":
        "+proj=utm +zone=44 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32345":
        "+proj=utm +zone=45 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32346":
        "+proj=utm +zone=46 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32347":
        "+proj=utm +zone=47 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32348":
        "+proj=utm +zone=48 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32349":
        "+proj=utm +zone=49 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32350":
        "+proj=utm +zone=50 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32351":
        "+proj=utm +zone=51 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32352":
        "+proj=utm +zone=52 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32353":
        "+proj=utm +zone=53 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32354":
        "+proj=utm +zone=54 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32355":
        "+proj=utm +zone=55 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32356":
        "+proj=utm +zone=56 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32357":
        "+proj=utm +zone=57 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32358":
        "+proj=utm +zone=58 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32359":
        "+proj=utm +zone=59 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32360":
        "+proj=utm +zone=60 +south +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs",
      "EPSG:32401":
        "+proj=utm +zone=1 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32402":
        "+proj=utm +zone=2 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32403":
        "+proj=utm +zone=3 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32404":
        "+proj=utm +zone=4 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32405":
        "+proj=utm +zone=5 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32406":
        "+proj=utm +zone=6 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32407":
        "+proj=utm +zone=7 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32408":
        "+proj=utm +zone=8 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32409":
        "+proj=utm +zone=9 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32410":
        "+proj=utm +zone=10 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32411":
        "+proj=utm +zone=11 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32412":
        "+proj=utm +zone=12 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32413":
        "+proj=utm +zone=13 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32414":
        "+proj=utm +zone=14 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32415":
        "+proj=utm +zone=15 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32416":
        "+proj=utm +zone=16 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32417":
        "+proj=utm +zone=17 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32418":
        "+proj=utm +zone=18 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32419":
        "+proj=utm +zone=19 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32420":
        "+proj=utm +zone=20 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32421":
        "+proj=utm +zone=21 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32422":
        "+proj=utm +zone=22 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32423":
        "+proj=utm +zone=23 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32424":
        "+proj=utm +zone=24 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32425":
        "+proj=utm +zone=25 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32426":
        "+proj=utm +zone=26 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32427":
        "+proj=utm +zone=27 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32428":
        "+proj=utm +zone=28 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32429":
        "+proj=utm +zone=29 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32430":
        "+proj=utm +zone=30 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32431":
        "+proj=utm +zone=31 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32432":
        "+proj=utm +zone=32 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32433":
        "+proj=utm +zone=33 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32434":
        "+proj=utm +zone=34 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32435":
        "+proj=utm +zone=35 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32436":
        "+proj=utm +zone=36 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32437":
        "+proj=utm +zone=37 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32438":
        "+proj=utm +zone=38 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32439":
        "+proj=utm +zone=39 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32440":
        "+proj=utm +zone=40 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32441":
        "+proj=utm +zone=41 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32442":
        "+proj=utm +zone=42 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32443":
        "+proj=utm +zone=43 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32444":
        "+proj=utm +zone=44 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32445":
        "+proj=utm +zone=45 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32446":
        "+proj=utm +zone=46 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32447":
        "+proj=utm +zone=47 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32448":
        "+proj=utm +zone=48 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32449":
        "+proj=utm +zone=49 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32450":
        "+proj=utm +zone=50 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32451":
        "+proj=utm +zone=51 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32452":
        "+proj=utm +zone=52 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32453":
        "+proj=utm +zone=53 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32454":
        "+proj=utm +zone=54 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32455":
        "+proj=utm +zone=55 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32456":
        "+proj=utm +zone=56 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32457":
        "+proj=utm +zone=57 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32458":
        "+proj=utm +zone=58 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32459":
        "+proj=utm +zone=59 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32460":
        "+proj=utm +zone=60 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32501":
        "+proj=utm +zone=1 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32502":
        "+proj=utm +zone=2 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32503":
        "+proj=utm +zone=3 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32504":
        "+proj=utm +zone=4 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32505":
        "+proj=utm +zone=5 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32506":
        "+proj=utm +zone=6 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32507":
        "+proj=utm +zone=7 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32508":
        "+proj=utm +zone=8 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32509":
        "+proj=utm +zone=9 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32510":
        "+proj=utm +zone=10 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32511":
        "+proj=utm +zone=11 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32512":
        "+proj=utm +zone=12 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32513":
        "+proj=utm +zone=13 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32514":
        "+proj=utm +zone=14 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32515":
        "+proj=utm +zone=15 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32516":
        "+proj=utm +zone=16 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32517":
        "+proj=utm +zone=17 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32518":
        "+proj=utm +zone=18 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32519":
        "+proj=utm +zone=19 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32520":
        "+proj=utm +zone=20 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32521":
        "+proj=utm +zone=21 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32522":
        "+proj=utm +zone=22 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32523":
        "+proj=utm +zone=23 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32524":
        "+proj=utm +zone=24 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32525":
        "+proj=utm +zone=25 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32526":
        "+proj=utm +zone=26 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32527":
        "+proj=utm +zone=27 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32528":
        "+proj=utm +zone=28 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32529":
        "+proj=utm +zone=29 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32530":
        "+proj=utm +zone=30 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32531":
        "+proj=utm +zone=31 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32532":
        "+proj=utm +zone=32 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32533":
        "+proj=utm +zone=33 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32534":
        "+proj=utm +zone=34 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32535":
        "+proj=utm +zone=35 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32536":
        "+proj=utm +zone=36 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32537":
        "+proj=utm +zone=37 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32538":
        "+proj=utm +zone=38 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32539":
        "+proj=utm +zone=39 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32540":
        "+proj=utm +zone=40 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32541":
        "+proj=utm +zone=41 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32542":
        "+proj=utm +zone=42 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32543":
        "+proj=utm +zone=43 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32544":
        "+proj=utm +zone=44 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32545":
        "+proj=utm +zone=45 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32546":
        "+proj=utm +zone=46 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32547":
        "+proj=utm +zone=47 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32548":
        "+proj=utm +zone=48 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32549":
        "+proj=utm +zone=49 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32550":
        "+proj=utm +zone=50 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32551":
        "+proj=utm +zone=51 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32552":
        "+proj=utm +zone=52 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32553":
        "+proj=utm +zone=53 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32554":
        "+proj=utm +zone=54 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32555":
        "+proj=utm +zone=55 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32556":
        "+proj=utm +zone=56 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32557":
        "+proj=utm +zone=57 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32558":
        "+proj=utm +zone=58 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32559":
        "+proj=utm +zone=59 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32560":
        "+proj=utm +zone=60 +south +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
      "EPSG:32601": "+proj=utm +zone=1 +datum=WGS84 +units=m +no_defs",
      "EPSG:32602": "+proj=utm +zone=2 +datum=WGS84 +units=m +no_defs",
      "EPSG:32603": "+proj=utm +zone=3 +datum=WGS84 +units=m +no_defs",
      "EPSG:32604": "+proj=utm +zone=4 +datum=WGS84 +units=m +no_defs",
      "EPSG:32605": "+proj=utm +zone=5 +datum=WGS84 +units=m +no_defs",
      "EPSG:32606": "+proj=utm +zone=6 +datum=WGS84 +units=m +no_defs",
      "EPSG:32607": "+proj=utm +zone=7 +datum=WGS84 +units=m +no_defs",
      "EPSG:32608": "+proj=utm +zone=8 +datum=WGS84 +units=m +no_defs",
      "EPSG:32609": "+proj=utm +zone=9 +datum=WGS84 +units=m +no_defs",
      "EPSG:32610": "+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs",
      "EPSG:32611": "+proj=utm +zone=11 +datum=WGS84 +units=m +no_defs",
      "EPSG:32612": "+proj=utm +zone=12 +datum=WGS84 +units=m +no_defs",
      "EPSG:32613": "+proj=utm +zone=13 +datum=WGS84 +units=m +no_defs",
      "EPSG:32614": "+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs",
      "EPSG:32615": "+proj=utm +zone=15 +datum=WGS84 +units=m +no_defs",
      "EPSG:32616": "+proj=utm +zone=16 +datum=WGS84 +units=m +no_defs",
      "EPSG:32617": "+proj=utm +zone=17 +datum=WGS84 +units=m +no_defs",
      "EPSG:32618": "+proj=utm +zone=18 +datum=WGS84 +units=m +no_defs",
      "EPSG:32619": "+proj=utm +zone=19 +datum=WGS84 +units=m +no_defs",
      "EPSG:32620": "+proj=utm +zone=20 +datum=WGS84 +units=m +no_defs",
      "EPSG:32621": "+proj=utm +zone=21 +datum=WGS84 +units=m +no_defs",
      "EPSG:32622": "+proj=utm +zone=22 +datum=WGS84 +units=m +no_defs",
      "EPSG:32623": "+proj=utm +zone=23 +datum=WGS84 +units=m +no_defs",
      "EPSG:32624": "+proj=utm +zone=24 +datum=WGS84 +units=m +no_defs",
      "EPSG:32625": "+proj=utm +zone=25 +datum=WGS84 +units=m +no_defs",
      "EPSG:32626": "+proj=utm +zone=26 +datum=WGS84 +units=m +no_defs",
      "EPSG:32627": "+proj=utm +zone=27 +datum=WGS84 +units=m +no_defs",
      "EPSG:32628": "+proj=utm +zone=28 +datum=WGS84 +units=m +no_defs",
      "EPSG:32629": "+proj=utm +zone=29 +datum=WGS84 +units=m +no_defs",
      "EPSG:32630": "+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs",
      "EPSG:32631": "+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs",
      "EPSG:32632": "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs",
      "EPSG:32633": "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs",
      "EPSG:32634": "+proj=utm +zone=34 +datum=WGS84 +units=m +no_defs",
      "EPSG:32635": "+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs",
      "EPSG:32636": "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs",
      "EPSG:32637": "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs",
      "EPSG:32638": "+proj=utm +zone=38 +datum=WGS84 +units=m +no_defs",
      "EPSG:32639": "+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs",
      "EPSG:32640": "+proj=utm +zone=40 +datum=WGS84 +units=m +no_defs",
      "EPSG:32641": "+proj=utm +zone=41 +datum=WGS84 +units=m +no_defs",
      "EPSG:32642": "+proj=utm +zone=42 +datum=WGS84 +units=m +no_defs",
      "EPSG:32643": "+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs",
      "EPSG:32644": "+proj=utm +zone=44 +datum=WGS84 +units=m +no_defs",
      "EPSG:32645": "+proj=utm +zone=45 +datum=WGS84 +units=m +no_defs",
      "EPSG:32646": "+proj=utm +zone=46 +datum=WGS84 +units=m +no_defs",
      "EPSG:32647": "+proj=utm +zone=47 +datum=WGS84 +units=m +no_defs",
      "EPSG:32648": "+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs",
      "EPSG:32649": "+proj=utm +zone=49 +datum=WGS84 +units=m +no_defs",
      "EPSG:32650": "+proj=utm +zone=50 +datum=WGS84 +units=m +no_defs",
      "EPSG:32651": "+proj=utm +zone=51 +datum=WGS84 +units=m +no_defs",
      "EPSG:32652": "+proj=utm +zone=52 +datum=WGS84 +units=m +no_defs",
      "EPSG:32653": "+proj=utm +zone=53 +datum=WGS84 +units=m +no_defs",
      "EPSG:32654": "+proj=utm +zone=54 +datum=WGS84 +units=m +no_defs",
      "EPSG:32655": "+proj=utm +zone=55 +datum=WGS84 +units=m +no_defs",
      "EPSG:32656": "+proj=utm +zone=56 +datum=WGS84 +units=m +no_defs",
      "EPSG:32657": "+proj=utm +zone=57 +datum=WGS84 +units=m +no_defs",
      "EPSG:32658": "+proj=utm +zone=58 +datum=WGS84 +units=m +no_defs",
      "EPSG:32659": "+proj=utm +zone=59 +datum=WGS84 +units=m +no_defs",
      "EPSG:32660": "+proj=utm +zone=60 +datum=WGS84 +units=m +no_defs",
      "EPSG:32661":
        "+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:32662":
        "+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:32663":
        "+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
      "EPSG:32664":
        "+proj=tmerc +lat_0=0 +lon_0=-99 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=WGS84 +units=us-ft +no_defs",
      "EPSG:32665":
        "+proj=tmerc +lat_0=0 +lon_0=-93 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=WGS84 +units=us-ft +no_defs",
      "EPSG:32666":
        "+proj=tmerc +lat_0=0 +lon_0=-87 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=WGS84 +units=us-ft +no_defs",
      "EPSG:32667":
        "+proj=tmerc +lat_0=0 +lon_0=-81 +k=0.9996 +x_0=500000.001016002 +y_0=0 +datum=WGS84 +units=us-ft +no_defs",
      "EPSG:32701": "+proj=utm +zone=1 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32702": "+proj=utm +zone=2 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32703": "+proj=utm +zone=3 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32704": "+proj=utm +zone=4 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32705": "+proj=utm +zone=5 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32706": "+proj=utm +zone=6 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32707": "+proj=utm +zone=7 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32708": "+proj=utm +zone=8 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32709": "+proj=utm +zone=9 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32710": "+proj=utm +zone=10 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32711": "+proj=utm +zone=11 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32712": "+proj=utm +zone=12 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32713": "+proj=utm +zone=13 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32714": "+proj=utm +zone=14 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32715": "+proj=utm +zone=15 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32716": "+proj=utm +zone=16 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32717": "+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32718": "+proj=utm +zone=18 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32719": "+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32720": "+proj=utm +zone=20 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32721": "+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32722": "+proj=utm +zone=22 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32723": "+proj=utm +zone=23 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32724": "+proj=utm +zone=24 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32725": "+proj=utm +zone=25 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32726": "+proj=utm +zone=26 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32727": "+proj=utm +zone=27 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32728": "+proj=utm +zone=28 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32729": "+proj=utm +zone=29 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32730": "+proj=utm +zone=30 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32731": "+proj=utm +zone=31 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32732": "+proj=utm +zone=32 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32733": "+proj=utm +zone=33 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32734": "+proj=utm +zone=34 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32735": "+proj=utm +zone=35 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32736": "+proj=utm +zone=36 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32737": "+proj=utm +zone=37 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32738": "+proj=utm +zone=38 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32739": "+proj=utm +zone=39 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32740": "+proj=utm +zone=40 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32741": "+proj=utm +zone=41 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32742": "+proj=utm +zone=42 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32743": "+proj=utm +zone=43 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32744": "+proj=utm +zone=44 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32745": "+proj=utm +zone=45 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32746": "+proj=utm +zone=46 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32747": "+proj=utm +zone=47 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32748": "+proj=utm +zone=48 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32749": "+proj=utm +zone=49 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32750": "+proj=utm +zone=50 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32751": "+proj=utm +zone=51 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32752": "+proj=utm +zone=52 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32753": "+proj=utm +zone=53 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32754": "+proj=utm +zone=54 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32755": "+proj=utm +zone=55 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32756": "+proj=utm +zone=56 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32757": "+proj=utm +zone=57 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32758": "+proj=utm +zone=58 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32759": "+proj=utm +zone=59 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32760": "+proj=utm +zone=60 +south +datum=WGS84 +units=m +no_defs",
      "EPSG:32761":
        "+proj=stere +lat_0=-90 +lat_ts=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs",
      "EPSG:32766":
        "+proj=tmerc +lat_0=0 +lon_0=36 +k=0.9996 +x_0=500000 +y_0=10000000 +datum=WGS84 +units=m +no_defs",
    };
  }
}

export default SRSTranslator;
