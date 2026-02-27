"""
First Fit Decreasing (FFD) Algorithm for 3D Bin Packing

Strategy:
1. Sort items by volume (largest first)
2. For each item, find the first position where it fits
3. Place item at that position
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


def find_first_fit_position(
    dims: Tuple[float, float, float],
    bin_dims: Tuple[float, float, float],
    placed_items: List[Dict[str, Any]],
    step: float = 1.0
) -> Tuple[float, float, float] | None:
    """
    Find the first position where the item fits.
    Scans along X, then Y, then Z axes.
    """
    w, h, d = dims
    bw, bh, bd = bin_dims
    
    # Generate candidate positions
    # Start with origin, then extreme points from placed items
    positions = [(0, 0, 0)]
    
    for item in placed_items:
        ix = item["position"]["x"]
        iy = item["position"]["y"]
        iz = item["position"]["z"]
        iw = item["dimensions"]["width"]
        ih = item["dimensions"]["height"]
        id_ = item["dimensions"]["depth"]
        
        # Add extreme points (corners where new items could be placed)
        positions.append((ix + iw, iy, iz))  # Right of item
        positions.append((ix, iy + ih, iz))  # On top of item
        positions.append((ix, iy, iz + id_))  # In front of item
    
    # Sort positions by z, then y, then x (bottom-back-left first)
    positions.sort(key=lambda p: (p[2], p[1], p[0]))
    
    for pos in positions:
        x, y, z = pos
        if fits_in_bin((x, y, z), dims, bin_dims):
            if not check_collision((x, y, z), dims, placed_items):
                return (x, y, z)
    
    # If no extreme point works, do a grid search
    z = 0
    while z + d <= bd:
        y = 0
        while y + h <= bh:
            x = 0
            while x + w <= bw:
                if not check_collision((x, y, z), dims, placed_items):
                    return (x, y, z)
                x += step
            y += step
        z += step
    
    return None


def first_fit_decreasing(
    bin_dims: Tuple[float, float, float],
    items: List[Dict[str, Any]]
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """
    First Fit Decreasing algorithm for 3D bin packing.
    
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
        
        position = find_first_fit_position(dims, bin_dims, packed_items)
        
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
