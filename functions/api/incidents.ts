export const onRequestGet: PagesFunction<{ DB: D1Database }> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");
    if (!projectId) return Response.json({ ok: false, error: "projectId required" }, { status: 400 });

    const res = await env.DB.prepare(
      "SELECT id, project_id, title, status, started_at, last_update_at, risk_score, reason_json, top_claims_json " +
      "FROM incidents WHERE project_id=? ORDER BY last_update_at DESC LIMIT 100"
    ).bind(projectId).all();

    return Response.json({ ok: true, incidents: res.results ?? [] });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
};
