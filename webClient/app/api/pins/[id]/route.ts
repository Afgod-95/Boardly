import { itemData } from "@/data/ItemsData";
import { NextRequest, NextResponse } from "next/server";
import { PinItem } from "@/webClient/types/pin";

// Type for route params
type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET pin by id 
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<PinItem | { error: string; message: string }>> {
  try {
    // Await params in Next.js 15+
    const { id } = await params;
    
    // Convert id to number if it's numeric, otherwise keep as string
    const pinId = isNaN(Number(id)) ? id : Number(id);
    
    // Find pin with type-safe comparison
    const pin = itemData.find((p) => {
      // Handle both string and number comparisons
      return p.id === pinId || p.id.toString() === id;
    });
    
    if (!pin) {
      return NextResponse.json(
        { 
          error: "Not Found",
          message: `Pin with id '${id}' not found` 
        },
        { status: 404 }
      );
    }
    
    // Return pin with proper caching headers
    return NextResponse.json(pin, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching pin:', error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        message: "Failed to fetch pin" 
      },
      { status: 500 }
    );
  }
}

// Optional: GET all pins
export async function getAllPins(): Promise<PinItem[]> {
  return itemData;
}

// Optional: GET pins with pagination
export async function getPaginatedPins(
  page: number = 1,
  limit: number = 20
): Promise<{ pins: PinItem[]; total: number; page: number; totalPages: number }> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPins = itemData.slice(startIndex, endIndex);
  
  return {
    pins: paginatedPins,
    total: itemData.length,
    page,
    totalPages: Math.ceil(itemData.length / limit),
  };
}