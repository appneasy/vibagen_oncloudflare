interface Env {
  DB: D1Database
  RESEND_API_KEY?: string
  TELEGRAM_BOT_TOKEN?: string
  ADMIN_ALERT_EMAIL?: string
}

interface Monitor {
  id: number
  customer_slug: string | null
  url: string
  label: string
  check_interval: number
  expected_status: number
  expected_keyword: string | null
  is_active: number
  alert_emails: string | null
  telegram_chat_id: string | null
}

interface CheckResult {
  monitorId: number
  status: 'up' | 'down'
  statusCode: number | null
  responseTimeMs: number | null
  errorMessage: string | null
  region: string
}

interface OpenIncident {
  id: number
  monitor_id: number
  started_at: string
}

interface MaintenanceWindow {
  monitor_id: number
}

interface AlertAction {
  monitor: Monitor
  type: 'down' | 'resolved'
  errorMessage: string | null
  durationSeconds: number | null
}

async function checkMonitor(monitor: Monitor, region: string): Promise<CheckResult> {
  const base: CheckResult = {
    monitorId: monitor.id,
    status: 'down',
    statusCode: null,
    responseTimeMs: null,
    errorMessage: null,
    region,
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000) // 15s timeout

    const start = Date.now()
    const response = await fetch(monitor.url, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'Vibagen-UptimeChecker/1.0' },
      redirect: 'follow',
    })
    const elapsed = Date.now() - start
    clearTimeout(timeout)

    base.statusCode = response.status
    base.responseTimeMs = elapsed

    // Check status code
    if (response.status !== monitor.expected_status) {
      base.status = 'down'
      base.errorMessage = `Expected ${monitor.expected_status}, got ${response.status}`
      return base
    }

    // Keyword check (if configured)
    if (monitor.expected_keyword) {
      const body = await response.text()
      if (!body.includes(monitor.expected_keyword)) {
        base.status = 'down'
        base.errorMessage = `Keyword "${monitor.expected_keyword}" not found in response`
        return base
      }
    }

    base.status = 'up'
    return base

  } catch (err) {
    base.errorMessage = err instanceof Error ? err.message : 'Unknown error'
    // Distinguish timeout from other errors
    if (err instanceof DOMException && err.name === 'AbortError') {
      base.errorMessage = 'Timeout after 15s'
    }
    return base
  }
}

async function sendEmailAlert(
  env: Env,
  monitor: Monitor,
  type: 'down' | 'resolved',
  errorMessage: string | null,
  durationSeconds: number | null,
  now: string,
): Promise<void> {
  if (!env.RESEND_API_KEY) return

  const recipients: string[] = []
  if (env.ADMIN_ALERT_EMAIL) recipients.push(env.ADMIN_ALERT_EMAIL)
  if (monitor.alert_emails) {
    for (const e of monitor.alert_emails.split(',')) {
      const trimmed = e.trim()
      if (trimmed && !recipients.includes(trimmed)) recipients.push(trimmed)
    }
  }
  if (recipients.length === 0) return

  const isDown = type === 'down'
  const subject = isDown
    ? `🔴 DOWN: ${monitor.label}`
    : `✅ RESOLVED: ${monitor.label}`

  let body = `Monitor: ${monitor.label}\nURL: ${monitor.url}\n`
  if (isDown) {
    body += `Status: DOWN\n`
    if (errorMessage) body += `Error: ${errorMessage}\n`
  } else {
    body += `Status: UP (Resolved)\n`
    if (durationSeconds != null) body += `Downtime: ${formatAlertDuration(durationSeconds)}\n`
  }
  body += `Time: ${now}\n\n— VIBAGEN Uptime Monitor`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VIBAGEN Monitor <monitor@vibagen.com>',
        to: recipients,
        subject,
        text: body,
      }),
    })
  } catch (err) {
    console.error('[Alert/Email] Failed:', err)
  }
}

async function sendTelegramAlert(
  env: Env,
  monitor: Monitor,
  type: 'down' | 'resolved',
  errorMessage: string | null,
  durationSeconds: number | null,
  now: string,
): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN) return

  const chatIds: string[] = []
  if (monitor.telegram_chat_id) chatIds.push(monitor.telegram_chat_id)
  if (chatIds.length === 0) return

  const isDown = type === 'down'
  let text = isDown
    ? `🔴 *DOWN*: ${escapeMarkdown(monitor.label)}\n`
    : `✅ *RESOLVED*: ${escapeMarkdown(monitor.label)}\n`

  text += `URL: ${monitor.url}\n`
  if (isDown && errorMessage) {
    text += `Error: ${escapeMarkdown(errorMessage)}\n`
  }
  if (!isDown && durationSeconds != null) {
    text += `Downtime: ${formatAlertDuration(durationSeconds)}\n`
  }
  text += `Time: ${now}`

  for (const chatId of chatIds) {
    try {
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      })
    } catch (err) {
      console.error('[Alert/Telegram] Failed:', err)
    }
  }
}

function escapeMarkdown(s: string): string {
  return s.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
}

function formatAlertDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

async function handleIncidents(
  env: Env,
  results: CheckResult[],
  monitors: Map<number, Monitor>,
  now: string,
): Promise<AlertAction[]> {
  // Get all currently open incidents (resolved_at IS NULL)
  const openIncidents = await env.DB.prepare(
    'SELECT id, monitor_id, started_at FROM uptime_incidents WHERE resolved_at IS NULL'
  ).all<OpenIncident>()

  const openMap = new Map<number, OpenIncident>()
  for (const inc of openIncidents.results ?? []) {
    openMap.set(inc.monitor_id, inc)
  }

  const batch: D1PreparedStatement[] = []
  const alertActions: AlertAction[] = []

  for (const result of results) {
    const existing = openMap.get(result.monitorId)

    if (result.status === 'down' && !existing) {
      // New incident — create it
      batch.push(
        env.DB.prepare(
          `INSERT INTO uptime_incidents (monitor_id, severity, started_at)
           VALUES (?1, 'major', ?2)`
        ).bind(result.monitorId, now)
      )
      const monitor = monitors.get(result.monitorId)
      if (monitor) {
        alertActions.push({ monitor, type: 'down', errorMessage: result.errorMessage, durationSeconds: null })
      }
    } else if (result.status === 'up' && existing) {
      // Resolve existing incident
      const startedAt = new Date(existing.started_at + 'Z').getTime()
      const nowMs = new Date(now).getTime()
      const durationSeconds = Math.round((nowMs - startedAt) / 1000)

      batch.push(
        env.DB.prepare(
          `UPDATE uptime_incidents SET resolved_at = ?1, duration_seconds = ?2
           WHERE id = ?3`
        ).bind(now, durationSeconds, existing.id)
      )
      const monitor = monitors.get(result.monitorId)
      if (monitor) {
        alertActions.push({ monitor, type: 'resolved', errorMessage: null, durationSeconds })
      }
    } else if (result.status === 'down' && existing) {
      // Still down — check if we need to escalate severity
      const startedAt = new Date(existing.started_at + 'Z').getTime()
      const nowMs = new Date(now).getTime()
      const downMinutes = (nowMs - startedAt) / 60000

      if (downMinutes >= 30) {
        // Escalate to critical
        batch.push(
          env.DB.prepare(
            `UPDATE uptime_incidents SET severity = 'critical' WHERE id = ?1 AND severity != 'critical'`
          ).bind(existing.id)
        )
      }
    }
  }

  if (batch.length > 0) {
    await env.DB.batch(batch)
  }

  return alertActions
}

export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    const now = new Date().toISOString()

    // 1. Get all active monitors
    const monitors = await env.DB.prepare(
      'SELECT * FROM uptime_monitors WHERE is_active = 1'
    ).all<Monitor>()

    if (!monitors.results?.length) return

    // 2. Get monitors currently in maintenance window
    const maintenance = await env.DB.prepare(
      `SELECT monitor_id FROM uptime_maintenance
       WHERE start_time <= ?1 AND end_time >= ?1`
    ).bind(now).all<MaintenanceWindow>()

    const inMaintenance = new Set(
      (maintenance.results ?? []).map(m => m.monitor_id)
    )

    // 3. Check each monitor (skip if in maintenance)
    const results: CheckResult[] = []

    // Get CF region from cron controller
    const region = (controller as any).colo ?? 'unknown'

    for (const monitor of monitors.results) {
      if (inMaintenance.has(monitor.id)) continue

      const result = await checkMonitor(monitor, region)
      results.push(result)
    }

    if (results.length === 0) return

    // 4. Batch insert check results
    const insertStmt = env.DB.prepare(
      `INSERT INTO uptime_checks (monitor_id, status, status_code, response_time_ms, error_message, region, checked_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
    )

    const batch: D1PreparedStatement[] = results.map(r =>
      insertStmt.bind(r.monitorId, r.status, r.statusCode, r.responseTimeMs, r.errorMessage, r.region, now)
    )

    await env.DB.batch(batch)

    // 5. Build monitors map for alert lookups
    const monitorsMap = new Map<number, Monitor>()
    for (const m of monitors.results) {
      monitorsMap.set(m.id, m)
    }

    // 6. Handle incidents (detect new, resolve existing) and collect alerts
    const alerts = await handleIncidents(env, results, monitorsMap, now)

    // 7. Fire alerts without blocking the response
    for (const alert of alerts) {
      ctx.waitUntil(sendEmailAlert(env, alert.monitor, alert.type, alert.errorMessage, alert.durationSeconds, now))
      ctx.waitUntil(sendTelegramAlert(env, alert.monitor, alert.type, alert.errorMessage, alert.durationSeconds, now))
    }
  },
} satisfies ExportedHandler<Env>
