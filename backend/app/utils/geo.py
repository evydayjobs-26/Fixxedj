"""Geographic utility functions."""
import math


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return the great-circle distance in kilometres between two points
    given as (latitude, longitude) pairs in decimal degrees.

    Uses the Haversine formula.
    """
    R = 6371.0  # Earth's mean radius in km

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lam = math.radians(lon2 - lon1)

    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lam / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def bounding_box(lat: float, lon: float, radius_km: float) -> tuple[float, float, float, float]:
    """Return (min_lat, min_lon, max_lat, max_lon) for a bounding box around the given point.

    Useful for quick pre-filter DB queries before the precise haversine check.
    """
    R = 6371.0
    delta_lat = math.degrees(radius_km / R)
    delta_lon = math.degrees(radius_km / (R * math.cos(math.radians(lat))))
    return (lat - delta_lat, lon - delta_lon, lat + delta_lat, lon + delta_lon)
