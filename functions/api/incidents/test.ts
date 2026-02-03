export const onRequestPost: PagesFunction<{ DB: D1Database }> = async ({ request, env }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const projectId = String((body as any).projectId ?? "").trim();
    if (!projectId) return Response.json({ ok: false, error: "projectId required" }, { status: 400 });

    const id = crypto.randomUUID();
    const now = Date.now();

    const risk = Math.floor(55 + Math.random() * 35); // 55–90
    const reason = {
      fired: ["volume_spike", "boycott_framing"],
      z_volume: +(2 + Math.random() * 4).toFixed(2),
      velocity: +(1 + Math.random() * 3).toFixed(2),
      notes: "Test incident (manual)"
    };
    const claims = [
      { claim: "People are calling for a boycott", confidence: 0.66 },
      { claim: "Brand is being accused of misleading marketing", confidence: 0.52 }
    ];

    await env.DB.prepare(
      "INSERT INTO incidents (id, project_id, title, status, started_at, last_update_at, risk_score, reason_json, top_claims_json) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      id,
      projectId,
      `Emerging backlash: test spike (${risk})`,
      risk >= 75 ? "open" : "monitoring",
      now,
      now,
      risk,
      JSON.stringify(reason),
      JSON.stringify(claims)
    ).run();

    return Response.json({ ok: true, incidentId: id }, { status: 201 });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
};
