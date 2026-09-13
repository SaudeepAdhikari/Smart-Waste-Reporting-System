/**
 * Canonical role definitions for the Smart Waste Management System.
 *
 * Three application roles exist:
 * - CITIZEN: Public users who submit waste reports
 * - MUNICIPALITY: Municipal staff who verify and manage reports
 * - COLLECTOR: Waste collection staff who execute collection tasks
 *
 * These constants are the single source of truth for role strings.
 * Do not duplicate role strings elsewhere.
 */

export const CITIZEN_ROLE = 'CITIZEN' as const;
export const MUNICIPALITY_ROLE = 'MUNICIPALITY' as const;
export const COLLECTOR_ROLE = 'COLLECTOR' as const;

export const ALL_ROLES = [CITIZEN_ROLE, MUNICIPALITY_ROLE, COLLECTOR_ROLE] as const;

export const CITIZEN_ONLY_ROLES = [CITIZEN_ROLE] as const;
export const MUNICIPALITY_ROLES = [MUNICIPALITY_ROLE, COLLECTOR_ROLE] as const;

export type UserRole = (typeof ALL_ROLES)[number];

export const DEFAULT_ROLE: UserRole = CITIZEN_ROLE;