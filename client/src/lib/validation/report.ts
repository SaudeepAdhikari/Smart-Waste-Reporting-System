import { z } from 'zod';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_EVIDENCE_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
  QUANTITY_UNITS,
  SEVERITY_LEVELS,
  WASTE_TYPES,
  type LocationCaptureStatus,
  type QuantityUnit,
  type ReportSeverity,
  type WasteType,
} from '@/types/reports';

const locationStatusSchema = z.enum([
  'not_set',
  'address_only',
  'coordinates_ready',
] as const satisfies readonly LocationCaptureStatus[]);

const evidenceImageSchema = z.object({
  id: z.string(),
  file: z.instanceof(File),
  previewUrl: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
});

function hasValidCoordinates(
  latitude: number | null | undefined,
  longitude: number | null | undefined
): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Citizen waste report form schema.
 * Input allows empty select values for UX; output is fully validated.
 * Location must include a usable address and/or valid coordinates.
 */
export const reportFormSchema = z
  .object({
    wasteType: z
      .union([z.literal(''), z.enum(WASTE_TYPES)])
      .refine((value): value is WasteType => value !== '', {
        message: 'Please select a waste type',
      }),
    description: z
      .string()
      .trim()
      .min(1, 'Please describe the waste you observed')
      .min(10, 'Please add a bit more detail (at least 10 characters)')
      .max(1000, 'Description must be 1000 characters or less'),
    estimatedQuantity: z
      .union([z.number(), z.literal('')])
      .refine(
        (value): value is number =>
          typeof value === 'number' && Number.isFinite(value),
        { message: 'Enter a valid estimated quantity' }
      )
      .refine((value) => value > 0, {
        message: 'Quantity must be greater than zero',
      })
      .refine((value) => value <= 100_000, {
        message: 'Quantity seems too large. Please check the value',
      }),
    quantityUnit: z
      .union([z.literal(''), z.enum(QUANTITY_UNITS)])
      .refine((value): value is QuantityUnit => value !== '', {
        message: 'Please select a quantity unit',
      }),
    severity: z
      .union([z.literal(''), z.enum(SEVERITY_LEVELS)])
      .refine((value): value is ReportSeverity => value !== '', {
        message: 'Please select a severity level',
      }),
    address: z
      .string()
      .trim()
      .max(500, 'Address must be 500 characters or less'),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    locationStatus: locationStatusSchema,
    images: z
      .array(evidenceImageSchema)
      .max(
        MAX_EVIDENCE_IMAGES,
        `You can attach up to ${MAX_EVIDENCE_IMAGES} photos`
      )
      .superRefine((images, ctx) => {
        images.forEach((image, index) => {
          if (
            !ACCEPTED_IMAGE_TYPES.includes(
              image.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
            )
          ) {
            ctx.addIssue({
              code: 'custom',
              message: `"${image.name}" is not a supported image type. Use JPEG, PNG, or WEBP.`,
              path: [index],
            });
          }
          if (image.size > MAX_IMAGE_SIZE_BYTES) {
            ctx.addIssue({
              code: 'custom',
              message: `"${image.name}" is too large. Maximum size is 10 MB.`,
              path: [index],
            });
          }
        });
      }),
  })
  .superRefine((data, ctx) => {
    const coordsReady = hasValidCoordinates(data.latitude, data.longitude);

    if (data.latitude !== null && data.latitude !== undefined) {
      if (
        typeof data.latitude !== 'number' ||
        !Number.isFinite(data.latitude) ||
        data.latitude < -90 ||
        data.latitude > 90
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Latitude must be a number between -90 and 90',
          path: ['latitude'],
        });
      }
    }

    if (data.longitude !== null && data.longitude !== undefined) {
      if (
        typeof data.longitude !== 'number' ||
        !Number.isFinite(data.longitude) ||
        data.longitude < -180 ||
        data.longitude > 180
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Longitude must be a number between -180 and 180',
          path: ['longitude'],
        });
      }
    }

    if (!coordsReady) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please select the location of the waste.',
        path: ['latitude'],
      });
    }

    if (!coordsReady && data.locationStatus === 'coordinates_ready') {
      ctx.addIssue({
        code: 'custom',
        message: 'Location coordinates are incomplete. Please update the location.',
        path: ['locationStatus'],
      });
    }
  });

export type ReportFormSchemaData = z.output<typeof reportFormSchema>;
export type ReportFormSchemaInput = z.input<typeof reportFormSchema>;

export function validateEvidenceFile(file: File): string | null {
  if (
    !ACCEPTED_IMAGE_TYPES.includes(
      file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
    )
  ) {
    return `"${file.name}" is not supported. Please use JPEG, PNG, or WEBP images.`;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `"${file.name}" is too large. Maximum size is 10 MB per image.`;
  }
  if (file.size <= 0) {
    return `"${file.name}" appears to be empty. Please choose another image.`;
  }
  return null;
}
