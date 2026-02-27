/**
 * 3D Bin Packing Algorithms
 * Pure JavaScript implementation for client-side packing
 */

const COLORS = [
  "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
  "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A",
  "#CDDC39", "#FFC107", "#FF9800", "#FF5722", "#795548"
];

function generateColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

/**
 * Check if a box at position with given dimensions collides with any placed items.
 */
function checkCollision(pos, dims, placedItems) {
  const [x, y, z] = pos;
  const [w, h, d] = dims;

  for (const item of placedItems) {
    const ix = item.position.x;
    const iy = item.position.y;
    const iz = item.position.z;
    const iw = item.dimensions.width;
    const ih = item.dimensions.height;
    const id = item.dimensions.depth;

    // Check for overlap in all three dimensions
    const overlapX = x < ix + iw && x + w > ix;
    const overlapY = y < iy + ih && y + h > iy;
    const overlapZ = z < iz + id && z + d > iz;

    if (overlapX && overlapY && overlapZ) {
      return true;
    }
  }

  return false;
}

/**
 * Check if item at position fits within bin boundaries.
 */
function fitsInBin(pos, dims, binDims) {
  const [x, y, z] = pos;
  const [w, h, d] = dims;
  const [bw, bh, bd] = binDims;

  return (
    x >= 0 && y >= 0 && z >= 0 &&
    x + w <= bw && y + h <= bh && z + d <= bd
  );
}

/**
 * Find the first position where the item fits (FFD algorithm).
 */
function findFirstFitPosition(dims, binDims, placedItems, step = 1.0) {
  const [w, h, d] = dims;
  const [bw, bh, bd] = binDims;

  // Generate candidate positions
  const positions = [[0, 0, 0]];

  for (const item of placedItems) {
    const ix = item.position.x;
    const iy = item.position.y;
    const iz = item.position.z;
    const iw = item.dimensions.width;
    const ih = item.dimensions.height;
    const id = item.dimensions.depth;

    // Add extreme points
    positions.push([ix + iw, iy, iz]); // Right of item
    positions.push([ix, iy + ih, iz]); // On top of item
    positions.push([ix, iy, iz + id]); // In front of item
  }

  // Sort positions by z, then y, then x (bottom-back-left first)
  positions.sort((a, b) => {
    if (a[2] !== b[2]) return a[2] - b[2];
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[0] - b[0];
  });

  for (const pos of positions) {
    if (fitsInBin(pos, dims, binDims)) {
      if (!checkCollision(pos, dims, placedItems)) {
        return pos;
      }
    }
  }

  // If no extreme point works, do a grid search
  for (let z = 0; z + d <= bd; z += step) {
    for (let y = 0; y + h <= bh; y += step) {
      for (let x = 0; x + w <= bw; x += step) {
        if (!checkCollision([x, y, z], dims, placedItems)) {
          return [x, y, z];
        }
      }
    }
  }

  return null;
}

/**
 * Calculate a score for placing an item at a position (Best Fit algorithm).
 * Lower score = better fit.
 */
function calculateScore(pos, dims, placedItems, binDims) {
  const [x, y, z] = pos;
  const [w, h, d] = dims;
  const [bw, bh, bd] = binDims;

  // Base score: distance from origin (normalized)
  const distanceScore = (x / bw + y / bh + z / bd) / 3;

  // Contact score: count how many surfaces touch walls or items
  let contactScore = 0;

  // Check wall contacts
  if (x === 0) contactScore += 1;
  if (y === 0) contactScore += 1;
  if (z === 0) contactScore += 1;
  if (x + w === bw) contactScore += 1;
  if (y + h === bh) contactScore += 1;
  if (z + d === bd) contactScore += 1;

  // Check item contacts
  for (const item of placedItems) {
    const ix = item.position.x;
    const iy = item.position.y;
    const iz = item.position.z;
    const iw = item.dimensions.width;
    const ih = item.dimensions.height;
    const id = item.dimensions.depth;

    // Right surface of other item touches left surface of new item
    if (Math.abs(ix + iw - x) < 0.01) {
      if (y < iy + ih && y + h > iy && z < iz + id && z + d > iz) {
        contactScore += 1;
      }
    }
    // Left surface of other item touches right surface of new item
    if (Math.abs(x + w - ix) < 0.01) {
      if (y < iy + ih && y + h > iy && z < iz + id && z + d > iz) {
        contactScore += 1;
      }
    }
    // Top surface of other item touches bottom of new item
    if (Math.abs(iy + ih - y) < 0.01) {
      if (x < ix + iw && x + w > ix && z < iz + id && z + d > iz) {
        contactScore += 1;
      }
    }
    // Bottom of other item touches top of new item
    if (Math.abs(y + h - iy) < 0.01) {
      if (x < ix + iw && x + w > ix && z < iz + id && z + d > iz) {
        contactScore += 1;
      }
    }
    // Front of other item touches back of new item
    if (Math.abs(iz + id - z) < 0.01) {
      if (x < ix + iw && x + w > ix && y < iy + ih && y + h > iy) {
        contactScore += 1;
      }
    }
    // Back of other item touches front of new item
    if (Math.abs(z + d - iz) < 0.01) {
      if (x < ix + iw && x + w > ix && y < iy + ih && y + h > iy) {
        contactScore += 1;
      }
    }
  }

  // Height penalty (prefer placing items lower)
  const heightPenalty = y / bh;

  // Combined score (lower is better)
  return distanceScore + heightPenalty - contactScore * 0.3;
}

/**
 * Generate candidate positions for Best Fit placement.
 */
function getCandidatePositions(dims, binDims, placedItems) {
  const positions = new Set();
  positions.add("0,0,0");

  const [bw, bh, bd] = binDims;
  const [w, h, d] = dims;

  for (const item of placedItems) {
    const ix = item.position.x;
    const iy = item.position.y;
    const iz = item.position.z;
    const iw = item.dimensions.width;
    const ih = item.dimensions.height;
    const id = item.dimensions.depth;

    // Extreme points from this item
    const candidates = [
      [ix + iw, iy, iz],       // Right of item
      [ix, iy + ih, iz],       // On top of item
      [ix, iy, iz + id],       // In front of item
      [ix + iw, iy + ih, iz],  // Top-right
      [ix + iw, iy, iz + id],  // Front-right
      [ix, iy + ih, iz + id],  // Top-front
      [0, iy, iz],             // Against left wall at same y,z
      [ix, 0, iz],             // Against bottom at same x,z
      [ix, iy, 0],             // Against back at same x,y
    ];

    for (const pos of candidates) {
      if (pos[0] >= 0 && pos[1] >= 0 && pos[2] >= 0) {
        if (pos[0] + w <= bw && pos[1] + h <= bh && pos[2] + d <= bd) {
          positions.add(`${pos[0]},${pos[1]},${pos[2]}`);
        }
      }
    }
  }

  return Array.from(positions).map(s => s.split(",").map(Number));
}

/**
 * Find the best position for the item based on scoring.
 */
function findBestFitPosition(dims, binDims, placedItems) {
  const candidates = getCandidatePositions(dims, binDims, placedItems);

  let bestPosition = null;
  let bestScore = Infinity;

  for (const pos of candidates) {
    if (fitsInBin(pos, dims, binDims)) {
      if (!checkCollision(pos, dims, placedItems)) {
        const score = calculateScore(pos, dims, placedItems, binDims);
        if (score < bestScore) {
          bestScore = score;
          bestPosition = pos;
        }
      }
    }
  }

  return bestPosition;
}

/**
 * First Fit Decreasing algorithm for 3D bin packing.
 */
export function firstFitDecreasing(binDims, items) {
  const [bw, bh, bd] = binDims;

  // Sort items by volume (largest first)
  const sortedItems = [...items].sort(
    (a, b) => (b.width * b.height * b.depth) - (a.width * a.height * a.depth)
  );

  const packedItems = [];
  const unpackedIds = [];

  for (const item of sortedItems) {
    const dims = [item.width, item.height, item.depth];
    const position = findFirstFitPosition(dims, binDims, packedItems);

    if (position !== null) {
      packedItems.push({
        id: item.id,
        position: { x: position[0], y: position[1], z: position[2] },
        dimensions: {
          width: item.width,
          height: item.height,
          depth: item.depth
        },
        color: generateColor()
      });
    } else {
      unpackedIds.push(item.id);
    }
  }

  return { packedItems, unpackedIds };
}

/**
 * Best Fit algorithm for 3D bin packing.
 */
export function bestFit(binDims, items) {
  const [bw, bh, bd] = binDims;

  // Sort items by volume (largest first)
  const sortedItems = [...items].sort(
    (a, b) => (b.width * b.height * b.depth) - (a.width * a.height * a.depth)
  );

  const packedItems = [];
  const unpackedIds = [];

  for (const item of sortedItems) {
    const dims = [item.width, item.height, item.depth];
    const position = findBestFitPosition(dims, binDims, packedItems);

    if (position !== null) {
      packedItems.push({
        id: item.id,
        position: { x: position[0], y: position[1], z: position[2] },
        dimensions: {
          width: item.width,
          height: item.height,
          depth: item.depth
        },
        color: generateColor()
      });
    } else {
      unpackedIds.push(item.id);
    }
  }

  return { packedItems, unpackedIds };
}

/**
 * Main packing function that wraps both algorithms.
 */
export function packItems(bin, items, algorithm) {
  const binDims = [bin.width, bin.height, bin.depth];
  const binVolume = bin.width * bin.height * bin.depth;

  let result;
  if (algorithm === "best_fit") {
    result = bestFit(binDims, items);
  } else {
    result = firstFitDecreasing(binDims, items);
  }

  // Calculate stats
  const totalItemVolume = items.reduce(
    (sum, item) => sum + item.width * item.height * item.depth,
    0
  );
  const packedVolume = result.packedItems.reduce(
    (sum, item) =>
      sum + item.dimensions.width * item.dimensions.height * item.dimensions.depth,
    0
  );
  const utilization = binVolume > 0 ? (packedVolume / binVolume) * 100 : 0;

  return {
    packedItems: result.packedItems,
    unpackedItems: result.unpackedIds,
    stats: {
      totalItems: items.length,
      packedCount: result.packedItems.length,
      unpackedCount: result.unpackedIds.length,
      binVolume,
      packedVolume,
      utilization: Math.round(utilization * 100) / 100
    }
  };
}
