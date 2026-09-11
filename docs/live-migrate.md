# Live DB migration ritual (Supabase = live, docker = dev)

Three commands, in order, every time. `migrate deploy` never touches row
data — only the new `migration.sql` files run. Data is at risk only if a
migration file itself is destructive (`DROP`/`TRUNCATE`), which is why
step 1 exists: on free tier there are no backups, so you make your own.

1. Back up live first (~30 seconds, your safety net):
   pg_dump "<DIRECT_URL>" -Fc -f live-backup-$(date +%F).dump
   (Keep the quotes — the URL contains `?`/`&`. Keep last 4 dumps.)

2. Preview what's pending (read-only, changes nothing):
   pnpm prisma migrate status

3. If step 2 lists pending migrations, open each new `migration.sql` and
   glance at it: all `CREATE`/`ADD COLUMN`/`ADD VALUE` = inherently safe.
   Any `DROP`/`TRUNCATE`/`DELETE` = stop and think (restore plan first).

4. Apply, then confirm:
   pnpm prisma migrate deploy
   pnpm prisma migrate status   # expect: "Database schema is up to date!"

Nevers: `migrate dev` and `db push` are docker-only — never against live.
`P1001` on Supabase pooler is usually transient: wait 10s and retry.
Restore from a dump: pg_restore -d "<DIRECT_URL>" -c live-backup-<date>.dump
