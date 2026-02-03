export const onRequestGet: PagesFunction<{ DB: D1Database }> = async ({ env }) => {
  try {
    const res = await env.DB
      .prepare("SELECT id, name, timezone, created_at FROM projects ORDER BY created_at DESC LIMIT 100")
      .all();

    return Response.json({ ok: true, projects: res.results ?? [] });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async ({ request, env }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String((body as any).name ?? "").trim();
    if (!name) return Response.json({ ok: false, error: "name required" }, { status: 400 });

    const id = crypto.randomUUID();
    const now = Date.now();
    const tz = "Europe/Helsinki";

    await env.DB
      .prepare("INSERT INTO projects (id, name, timezone, created_at) VALUES (?, ?, ?, ?)")
      .bind(id, name, tz, now)
      .run();

    return Response.json({ ok: true, project: { id, name, timezone: tz, created_at: now } }, { status: 201 });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
};
