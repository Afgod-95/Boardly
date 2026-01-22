import { NextRequest, NextResponse } from "next/server";
import { itemData } from "@/data/ItemsData";

//get all pins
export async function GET() {
    return NextResponse.json(itemData)
}