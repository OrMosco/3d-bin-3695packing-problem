"""
3D Bin Packing API Server
FastAPI backend for the bin packing visualizer
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import PackRequest, PackResponse, PackedItem, Stats, Position, Dimensions
from algorithms import first_fit_decreasing, best_fit

app = FastAPI(
    title="3D Bin Packing API",
    description="API for solving 3D bin packing problems",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "3D Bin Packing API is running 📦",
        "endpoints": {
            "pack": "POST /api/pack",
            "algorithms": "GET /api/algorithms"
        }
    }


@app.get("/api/algorithms")
async def get_algorithms():
    """Get available packing algorithms."""
    return {
        "algorithms": [
            {
                "id": "ffd",
                "name": "First Fit Decreasing",
                "description": "Sorts items by volume and places each in the first available position"
            },
            {
                "id": "best_fit",
                "name": "Best Fit",
                "description": "Evaluates all positions and selects the one that minimizes wasted space"
            }
        ]
    }


@app.post("/api/pack", response_model=PackResponse)
async def pack_items(request: PackRequest):
    """
    Pack items into a bin using the specified algorithm.
    
    - **bin**: Bin dimensions (width, height, depth)
    - **items**: List of items with id, width, height, depth
    - **algorithm**: Either "ffd" or "best_fit"
    """
    
    # Validate algorithm choice
    if request.algorithm not in ["ffd", "best_fit"]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid algorithm '{request.algorithm}'. Use 'ffd' or 'best_fit'."
        )
    
    # Validate bin dimensions
    if request.bin.width <= 0 or request.bin.height <= 0 or request.bin.depth <= 0:
        raise HTTPException(
            status_code=400,
            detail="Bin dimensions must be positive numbers."
        )
    
    # Validate items
    if not request.items:
        raise HTTPException(
            status_code=400,
            detail="At least one item is required."
        )
    
    for item in request.items:
        if item.width <= 0 or item.height <= 0 or item.depth <= 0:
            raise HTTPException(
                status_code=400,
                detail=f"Item '{item.id}' has invalid dimensions. All dimensions must be positive."
            )
    
    # Prepare bin dimensions
    bin_dims = (request.bin.width, request.bin.height, request.bin.depth)
    
    # Prepare items list
    items_list = [
        {
            "id": item.id,
            "width": item.width,
            "height": item.height,
            "depth": item.depth
        }
        for item in request.items
    ]
    
    # Run the selected algorithm
    if request.algorithm == "ffd":
        packed_items, unpacked_ids = first_fit_decreasing(bin_dims, items_list)
    else:
        packed_items, unpacked_ids = best_fit(bin_dims, items_list)
    
    # Calculate statistics
    bin_volume = request.bin.width * request.bin.height * request.bin.depth
    used_volume = sum(
        item["dimensions"]["width"] * item["dimensions"]["height"] * item["dimensions"]["depth"]
        for item in packed_items
    )
    utilization = (used_volume / bin_volume) * 100 if bin_volume > 0 else 0
    
    # Convert packed items to response format
    response_packed_items = [
        PackedItem(
            id=item["id"],
            position=Position(**item["position"]),
            dimensions=Dimensions(**item["dimensions"]),
            color=item["color"]
        )
        for item in packed_items
    ]
    
    return PackResponse(
        success=True,
        algorithm=request.algorithm,
        utilization=round(utilization, 2),
        packedItems=response_packed_items,
        unpackedItems=unpacked_ids,
        stats=Stats(
            totalItems=len(request.items),
            packedCount=len(packed_items),
            binVolume=bin_volume,
            usedVolume=used_volume
        )
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
