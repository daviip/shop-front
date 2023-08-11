import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    try {
      const body = await req.json();

      const response = await fetch(
        `${process.env.URL_BACK}/items/order_detail`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return NextResponse.json({ ok: false });
      }

      const { data } = await response.json();

      return NextResponse.json({ ok: true, id: data.id });
    } catch (error) {
      console.error(error);

      return NextResponse.json({ ok: false });
    }
  }
}
