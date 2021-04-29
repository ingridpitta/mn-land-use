const landUseNames = {
  '01': 'One & Two Family Buildings',
  '02': 'Multi-Family Walk-Up Buildings',
  '03': 'Multi-Family Elevator Buildings',
  '04': 'Mixed Residential & Commercial Buildings',
  '05': 'Commercial & Office Buildings',
  '06': 'Industrial & Manufacturing',
  '07': 'Transportation & Utility',
  '08': 'Public Facilities & Institutions',
  '09': 'Open Space & Outdoor Recreation',
  '10': 'Parking Facilities',
  '11': 'Vacant Land'
};

const parameters = {
  layers: ["lots"],
};

const token =
  "pk.eyJ1IjoiaW5ncmlkcGl0dGEiLCJhIjoiY2tvMHVseXIyMGdiZzJwbnNxbGE1amFuMiJ9.gGx38AYvwp-a9d03BRtMnA";

const style = "mapbox://styles/ingridpitta/cko0v2sa60b5b17oh20857bj1";

mapboxgl.accessToken = token;

const map = new mapboxgl.Map({
  container: "map",
  style,
  center: [-73.99, 40.718],
  zoom: 13,
  minZoom: 13,
  maxZoom: 18,
  hash: true,
});

const addNavigationControls = () => {
  const nav = new mapboxgl.NavigationControl();
  
  return map.addControl(nav, 'top-left');
};

addNavigationControls();

const createPopUp = (lngLat, lot) => {
  const {
    BBL: bbl,
    LandUse: landUse,
    ZoneDist1: zone,
    BldgClass: bldgClass,
    OwnerName: ownerName,
  } = lot.properties;

  const popUpHTML = `<dl>
    <dt>BBL</dt>
    <dd>${bbl || '-'}</dd>
    <dt>Land Use</dt>
    <dd>${landUseNames[landUse] || '-'}</dd>
    <dt>Zoning District</dt>
    <dd>${zone || '-'}</dd>
    <dt>Building Class</dt>
    <dd>${bldgClass || '-'}</dd>
    <dt>Owner</dt>
    <dd>${ownerName || '-'}</dd>
  </dl>`;

  return new mapboxgl.Popup()
    .setLngLat(lngLat)
    .setHTML(popUpHTML)
    .addTo(map);
};

const getFeatures = (geometry, parameters) =>  map.queryRenderedFeatures(geometry, parameters);


map.on('click', (e) => {
  const { point: geometry, lngLat } = e;

  const features = getFeatures(geometry, parameters);
  const lot = features[0];

  return lot && createPopUp(lngLat, lot);
});

map.on('mousemove', (e) => {
  if(!map.loaded){
    return
  }

  const { point: geometry } = e;

  const features = getFeatures(geometry, parameters);

  return map.getCanvas().style.cursor = features.length ? 'pointer' : '';
});
