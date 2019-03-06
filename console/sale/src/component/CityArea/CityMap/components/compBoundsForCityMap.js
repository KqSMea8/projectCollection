const AMap = window.AMap;
export default function(bounds) {
  const lngDistance = bounds.getNorthEast().getLng() - bounds.getSouthWest().getLng();
  const newNorthEast = new AMap.LngLat(bounds.getSouthWest().getLng() + lngDistance * 1.4, bounds.getNorthEast().getLat());
  const newSouthWest = new AMap.LngLat(bounds.getSouthWest().getLng() - lngDistance * 0.1, bounds.getSouthWest().getLat());
  return new AMap.Bounds(newSouthWest, newNorthEast);
}
