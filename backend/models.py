from pydantic import BaseModel
from typing import List, Optional


class Bin(BaseModel):
    width: float
    height: float
    depth: float


class Item(BaseModel):
    id: str
    width: float
    height: float
    depth: float


class PackRequest(BaseModel):
    bin: Bin
    items: List[Item]
    algorithm: str  # "ffd" or "best_fit"


class Position(BaseModel):
    x: float
    y: float
    z: float


class Dimensions(BaseModel):
    width: float
    height: float
    depth: float


class PackedItem(BaseModel):
    id: str
    position: Position
    dimensions: Dimensions
    color: str


class Stats(BaseModel):
    totalItems: int
    packedCount: int
    binVolume: float
    usedVolume: float


class PackResponse(BaseModel):
    success: bool
    algorithm: str
    utilization: float
    packedItems: List[PackedItem]
    unpackedItems: List[str]
    stats: Stats
