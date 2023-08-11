import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method === "GET") {
    try {
      const id = req.nextUrl.searchParams.get("id");

      if (!id) {
        return NextResponse.json({});
      }

      const response = await fetch(
        `${process.env.URL_BACK}/items/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`,
          },
        }
      );

      const data = await response.json();

      return NextResponse.json(data);
    } catch (error) {
      console.error(error);

      return NextResponse.json({});
    }
  }
}
