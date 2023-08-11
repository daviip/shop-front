import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method === "GET") {
    try {
      const response = await fetch(`${process.env.URL_BACK}/items/product`, {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      });

      const data = await response.json();

      return NextResponse.json(data);
    } catch (error) {
      console.error(error);

      return NextResponse.json({});
    }
  }
}
