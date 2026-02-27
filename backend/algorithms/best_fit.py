"""
Best Fit Algorithm for 3D Bin Packing

Strategy:
1. Sort items by volume (largest first)
2. For each item, evaluate ALL possible positions
3. Score each position based on minimizing wasted space
4. Place item at the best-scored position
"""

from typing import List, Tuple, Dict, Any
import random


def generate_color() -> str:
    """Generate a random color in hex format."""
    colors = [
        "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
        "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A",
        "#CDDC39", "#FFC107", "#FF9800", "#FF5722", "#795548"
    ]
    return random.choice(colors)


def check_collision(
    pos: Tuple[float, float, float],
    dims: Tuple[float, float, float],
    placed_items: List[Dict[str, Any]]
) -> bool:
    """
    Check if a box at position with given dimensions collides with any placed items.
    Returns True if there is a collision.
    """
    x, y, z = pos
    w, h, d = dims
    
    for item in placed_items:
        ix = item["position"]["x"]
        iy = item["position"]["y"]
        iz = item["position"]["z"]
        iw = item["dimensions"]["width"]
        ih = item["dimensions"]["height"]
        id_ = item["dimensions"]["depth"]
        
        # Check for overlap in all three dimensions
        overlap_x = x < ix + iw and x + w > ix
        overlap_y = y < iy + ih and y + h > iy
        overlap_z = z < iz + id_ and z + d > iz
        
        if overlap_x and overlap_y and overlap_z:
            return True
    
    return False


def fits_in_bin(
    pos: Tuple[float, float, float],
    dims: Tuple[float, float, float],
    bin_dims: Tuple[float, float, float]
) -> bool:
    """Check if item at position fits within bin boundaries."""
    x, y, z = pos
    w, h, d = dims
    bw, bh, bd = bin_dims
    
    return (x >= 0 and y >= 0 and z >= 0 and
            x + w <= bw and y + h <= bh and z + d <= bd)


def calculate_score(
    pos: Tuple[float, float, float],
    dims: Tuple[float, float, float],
    placed_items: List[Dict[str, Any]],
    bin_dims: Tuple[float, float, float]
) -> float:
    """
    Calculate a score for placing an item at a position.
    Lower score = better fit.
    
    Scoring factors:
    - Distance from origin (prefer bottom-back-left corner)
    - Contact with walls or other items (more contact = better)
    - Height of placement (prefer lower positions)
    """
    x, y, z = pos
    w, h, d = dims
    bw, bh, bd = bin_dims
    
    # Base score: distance from origin (normalized)
    distance_score = (x / bw + y / bh + z / bd) / 3
    
    # Contact score: count how many surfaces touch walls or items
    contact_score = 0
    
    # Check wall contacts
    if x == 0:
        contact_score += 1
    if y == 0:
        contact_score += 1
    if z == 0:
        contact_score += 1
    if x + w == bw:
        contact_score += 1
    if y + h == bh:
        contact_score += 1
    if z + d == bd:
        contact_score += 1
    
    # Check item contacts
    for item in placed_items:
        ix = item["position"]["x"]
        iy = item["position"]["y"]
        iz = item["position"]["z"]
        iw = item["dimensions"]["width"]
        ih = item["dimensions"]["height"]
        id_ = item["dimensions"]["depth"]
        
        # Check if surfaces are adjacent
        # Right surface of other item touches left surface of new item
        if abs(ix + iw - x) < 0.01:
            if (y < iy + ih and y + h > iy and z < iz + id_ and z + d > iz):
                contact_score += 1
        # Left surface of other item touches right surface of new item
        if abs(x + w - ix) < 0.01:
            if (y < iy + ih and y + h > iy and z < iz + id_ and z + d > iz):
                contact_score += 1
        # Top surface of other item touches bottom of new item
        if abs(iy + ih - y) < 0.01:
            if (x < ix + iw and x + w > ix and z < iz + id_ and z + d > iz):
                contact_score += 1
        # Bottom of other item touches top of new item
        if abs(y + h - iy) < 0.01:
            if (x < ix + iw and x + w > ix and z < iz + id_ and z + d > iz):
                contact_score += 1
        # Front of other item touches back of new item
        if abs(iz + id_ - z) < 0.01:
            if (x < ix + iw and x + w > ix and y < iy + ih and y + h > iy):
                contact_score += 1
        # Back of other item touches front of new item
        if abs(z + d - iz) < 0.01:
            if (x < ix + iw and x + w > ix and y < iy + ih and y + h > iy):
                contact_score += 1
    
    # Height penalty (prefer placing items lower)
    height_penalty = y / bh
    
    # Combined score (lower is better)
    # More contacts = better (subtract), closer to origin = better
    final_score = distance_score + height_penalty - (contact_score * 0.3)
    
    return final_score


def get_candidate_positions(
    dims: Tuple[float, float, float],
    bin_dims: Tuple[float, float, float],
    placed_items: List[Dict[str, Any]]
) -> List[Tuple[float, float, float]]:
    """Generate candidate positions for placement."""
    positions = set()
    positions.add((0, 0, 0))
    
    bw, bh, bd = bin_dims
    w, h, d = dims
    
    for item in placed_items:
        ix = item["position"]["x"]
        iy = item["position"]["y"]
        iz = item["position"]["z"]
        iw = item["dimensions"]["width"]
        ih = item["dimensions"]["height"]
        id_ = item["dimensions"]["depth"]
        
        # Extreme points from this item
        candidates = [
            (ix + iw, iy, iz),      # Right of item
            (ix, iy + ih, iz),      # On top of item
            (ix, iy, iz + id_),     # In front of item
            (ix + iw, iy + ih, iz), # Top-right
            (ix + iw, iy, iz + id_),# Front-right
            (ix, iy + ih, iz + id_),# Top-front
            (0, iy, iz),            # Against left wall at same y,z
            (ix, 0, iz),            # Against bottom at same x,z
            (ix, iy, 0),            # Against back at same x,y
        ]
        
        for pos in candidates:
            if pos[0] >= 0 and pos[1] >= 0 and pos[2] >= 0:
                if pos[0] + w <= bw and pos[1] + h <= bh and pos[2] + d <= bd:
                    positions.add(pos)
    
    return list(positions)


def find_best_fit_position(
    dims: Tuple[float, float, float],
    bin_dims: Tuple[float, float, float],
    placed_items: List[Dict[str, Any]]
) -> Tuple[float, float, float] | None:
    """
    Find the best position for the item based on scoring.
    """
    candidates = get_candidate_positions(dims, bin_dims, placed_items)
    
    best_position = None
    best_score = float('inf')
    
    for pos in candidates:
        if fits_in_bin(pos, dims, bin_dims):
            if not check_collision(pos, dims, placed_items):
                score = calculate_score(pos, dims, placed_items, bin_dims)
                if score < best_score:
                    best_score = score
                    best_position = pos
    
    return best_position


def best_fit(
    bin_dims: Tuple[float, float, float],
    items: List[Dict[str, Any]]
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """
    Best Fit algorithm for 3D bin packing.
    
    Args:
        bin_dims: (width, height, depth) of the bin
        items: List of items with id, width, height, depth
    
    Returns:
        Tuple of (packed_items, unpacked_item_ids)
    """
    # Sort items by volume (largest first)
    sorted_items = sorted(
        items,
        key=lambda x: x["width"] * x["height"] * x["depth"],
        reverse=True
    )
    
    packed_items = []
    unpacked_ids = []
    
    for item in sorted_items:
        dims = (item["width"], item["height"], item["depth"])
        
        position = find_best_fit_position(dims, bin_dims, packed_items)
        
        if position is not None:
            packed_item = {
                "id": item["id"],
                "position": {"x": position[0], "y": position[1], "z": position[2]},
                "dimensions": {
                    "width": item["width"],
                    "height": item["height"],
                    "depth": item["depth"]
                },
                "color": generate_color()
            }
            packed_items.append(packed_item)
        else:
            unpacked_ids.append(item["id"])
    
    return packed_items, unpacked_ids
