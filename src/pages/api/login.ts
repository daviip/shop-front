import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const body = await req.json();

      const responseLogin = await fetch(`${process.env.URL_BACK}/auth/login`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const { data: dataLogin } = await responseLogin.json();

      const responseUser = await fetch(`${process.env.URL_BACK}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const { data: dataUser } = await responseUser.json();

      if (!responseLogin.ok || !responseUser.ok) {
        return NextResponse.json({ ok: false });
      }

      return NextResponse.json({
        ok: true,
        token: dataLogin.access_token,
        id: dataUser.id,
      });
    } catch (error) {
      console.error(error);

      return NextResponse.json({ ok: false });
    }
  }
}
