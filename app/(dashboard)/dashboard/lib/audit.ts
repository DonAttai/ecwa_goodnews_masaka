import { prisma } from "@/lib/prisma"
import {
  AuditAction,
  EntityType,
} from "@/generated/prisma/client"
import { z } from "zod"

export interface AuditUser {
  userId?: string | null
  email?: string | null
  name?: string | null
}

interface AuditLogInput {
  user: AuditUser
  action: AuditAction
  entity: EntityType
  entityId: string
  description: string
  metadata?: Record<string, unknown>
}

/**
 * Writes an audit log entry with a standardized shape. Centralizes the
 * create/update/delete audit logic that was previously duplicated and
 * inconsistent across member actions.
 */
export async function logAudit({
  user,
  action,
  entity,
  entityId,
  description,
  metadata = {},
}: AuditLogInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: user.userId ?? null,
      action,
      entity,
      entityId,
      description,
      metadata: {
        ...metadata,
        actorUserId: user.userId ?? null,
        actorEmail: user.email ?? null,
      },
    },
  })
}

export const auditMetadataSchema = z.record(
  z.string(),
  z.unknown()
).optional()
