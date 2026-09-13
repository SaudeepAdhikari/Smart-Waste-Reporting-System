'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  reportFormSchema,
  type ReportFormSchemaData,
} from '@/lib/validation/report';
import {
  type CreateReportPayload,
  type EvidenceImageItem,
  type GeoJsonPoint,
  type LocationCaptureStatus,
  type ReportFormValues,
} from '@/types/reports';
import { useCreateReport } from '@/services/queries/reports';
import { ApiError } from '@/services/api/client';
import { WasteTypeField } from './waste-type-field';
import { QuantityField } from './quantity-field';
import { SeverityField } from './severity-field';
import { LocationField } from './location-field';
import { EvidenceUploader } from './evidence-uploader';
import { ReportReview } from './report-review';
import { SubmitButton } from '@/components/auth/submit-button';

const defaultValues: ReportFormValues = {
  wasteType: '',
  description: '',
  estimatedQuantity: '',
  quantityUnit: '',
  severity: '',
  address: '',
  latitude: null,
  longitude: null,
  locationStatus: 'not_set',
  images: [],
};

function deriveLocationStatus(
  address: string,
  latitude: number | null,
  longitude: number | null
): LocationCaptureStatus {
  const hasCoordinates =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  if (hasCoordinates) {
    return 'coordinates_ready';
  }
  if (address.trim().length >= 5) {
    return 'address_only';
  }
  return 'not_set';
}

function toGeoJsonPoint(
  latitude: number | null,
  longitude: number | null
): GeoJsonPoint | null {
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  // GeoJSON Point coordinates are [longitude, latitude]
  return {
    type: 'Point',
    coordinates: [longitude, latitude],
  };
}

function buildCreateReportPayload(
  data: ReportFormSchemaData
): CreateReportPayload {
  return {
    wasteType: data.wasteType,
    description: data.description.trim(),
    estimatedQuantity: data.estimatedQuantity,
    quantityUnit: data.quantityUnit,
    severity: data.severity,
    address: data.address.trim(),
    location: toGeoJsonPoint(data.latitude, data.longitude),
    imageCount: data.images.length,
  };
}

function getCitizenFriendlyError(error: unknown): string {
  if (error instanceof ApiError) {
    if (
      error.message.toLowerCase().includes('network') ||
      error.message.toLowerCase().includes('unable to connect')
    ) {
      return 'Report submission service is not connected yet. Please try again later.';
    }
    if (error.statusCode === 401 || error.statusCode === 403) {
      return 'Your session has expired. Please sign in again to submit a report.';
    }
    if (error.statusCode === 404 || error.statusCode === 501) {
      return 'Report submission service is not connected yet. Please try again later.';
    }
    if (error.statusCode === 400) {
      const messages = Array.isArray(error.details)
        ? error.details.filter((detail): detail is string => typeof detail === 'string')
        : [];
      if (messages.length > 0) {
        return messages.join('. ');
      }
      return error.message || 'Please check your details and try submitting again.';
    }
    if (error.statusCode && error.statusCode >= 500) {
      return 'The reporting service is temporarily unavailable. Please try again later.';
    }
    return error.message || 'We could not submit your report. Please try again.';
  }

  if (error instanceof Error && error.message) {
    const lower = error.message.toLowerCase();
    if (
      lower.includes('fetch') ||
      lower.includes('network') ||
      lower.includes('failed to fetch')
    ) {
      return 'Report submission service is not connected yet. Please try again later.';
    }
  }

  return 'We could not submit your report. Please check your details and try again.';
}

function revokeImageUrls(images: EvidenceImageItem[]) {
  for (const image of images) {
    URL.revokeObjectURL(image.previewUrl);
  }
}

export function ReportForm() {
  const router = useRouter();
  const imagesRef = useRef<EvidenceImageItem[]>([]);
  const createReport = useCreateReport();
  const isSubmitting = createReport.isPending;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<ReportFormValues, unknown, ReportFormSchemaData>({
    resolver: zodResolver(reportFormSchema) as Resolver<
      ReportFormValues,
      unknown,
      ReportFormSchemaData
    >,
    defaultValues,
    mode: 'onSubmit',
  });

  const watchedValues = useWatch({ control });
  const watchedImages = watchedValues.images;
  const currentImages = (watchedImages ?? []) as EvidenceImageItem[];

  useEffect(() => {
    imagesRef.current = (watchedImages ?? []) as EvidenceImageItem[];
  }, [watchedImages]);

  useEffect(() => {
    return () => {
      revokeImageUrls(imagesRef.current);
    };
  }, []);

  const syncLocationStatus = (address: string) => {
    const { latitude, longitude } = getValues();
    setValue(
      'locationStatus',
      deriveLocationStatus(address, latitude, longitude),
      { shouldDirty: true, shouldValidate: false }
    );
  };

  const onSubmit = async (data: ReportFormSchemaData) => {
    clearErrors('root');

    const payload = buildCreateReportPayload(data);

    try {
      const report = await createReport.mutateAsync(payload);
      revokeImageUrls(data.images);
      setValue('images', [], { shouldDirty: false });
      router.push(`/reports/${report.id}`);
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: getCitizenFriendlyError(error),
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Leave this page? Your report details have not been submitted and will be lost.'
      );
      if (!confirmed) {
        return;
      }
    }
    router.push('/');
  };

  const imageError =
    typeof errors.images?.message === 'string'
      ? errors.images.message
      : Array.isArray(errors.images)
        ? errors.images.find((item) => item?.message)?.message
        : undefined;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
      noValidate
      aria-describedby={errors.root ? 'report-form-error' : undefined}
    >
      <section
        aria-labelledby="waste-information-heading"
        className="space-y-5 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div>
          <h2
            id="waste-information-heading"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            1. Waste information
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Tell us what kind of waste you found and roughly how much there is.
          </p>
        </div>

        <Controller
          name="wasteType"
          control={control}
          render={({ field }) => (
            <WasteTypeField
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.wasteType?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Description
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <p
            id="description-hint"
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            Describe what you observed, the condition, whether it is overflowing,
            or if it blocks a road or path.
          </p>
          <textarea
            id="description"
            rows={4}
            disabled={isSubmitting}
            placeholder="e.g. Overflowing plastic bags beside the bin, partly blocking the footpath"
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={
              errors.description
                ? 'description-hint description-error'
                : 'description-hint'
            }
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 sm:text-sm"
            {...register('description')}
          />
          {errors.description && (
            <p
              id="description-error"
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {errors.description.message}
            </p>
          )}
        </div>

        <Controller
          name="estimatedQuantity"
          control={control}
          render={({ field: quantityField }) => (
            <Controller
              name="quantityUnit"
              control={control}
              render={({ field: unitField }) => (
                <QuantityField
                  quantity={quantityField.value}
                  unit={unitField.value}
                  onQuantityChange={quantityField.onChange}
                  onUnitChange={unitField.onChange}
                  onQuantityBlur={quantityField.onBlur}
                  onUnitBlur={unitField.onBlur}
                  quantityError={errors.estimatedQuantity?.message}
                  unitError={errors.quantityUnit?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          )}
        />

        <Controller
          name="severity"
          control={control}
          render={({ field }) => (
            <SeverityField
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.severity?.message}
              disabled={isSubmitting}
            />
          )}
        />
      </section>

      <section
        aria-labelledby="location-heading"
        className="space-y-5 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div>
          <h2
            id="location-heading"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            2. Location
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Select the waste location on the map or use your device GPS. A precise
            location is required to help collectors find and verify the waste.
          </p>
        </div>

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <LocationField
              address={field.value}
              latitude={watchedValues.latitude ?? null}
              longitude={watchedValues.longitude ?? null}
              locationStatus={watchedValues.locationStatus ?? 'not_set'}
              onAddressChange={(value) => {
                field.onChange(value);
                syncLocationStatus(value);
              }}
              onAddressBlur={field.onBlur}
              onLocationChange={(lat, lng) => {
                setValue('latitude', lat, { shouldDirty: true, shouldValidate: false });
                setValue('longitude', lng, { shouldDirty: true, shouldValidate: false });
                syncLocationStatus(field.value);
              }}
              addressError={errors.address?.message}
              locationStatusError={errors.locationStatus?.message}
              latitudeError={errors.latitude?.message}
              longitudeError={errors.longitude?.message}
              disabled={isSubmitting}
            />
          )}
        />
      </section>

      <section
        aria-labelledby="evidence-heading"
        className="space-y-5 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div>
          <h2
            id="evidence-heading"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            3. Evidence
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Optional photos help municipal staff verify the report. Images are
            validated on your device and are not uploaded yet.
          </p>
        </div>

        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <EvidenceUploader
              images={field.value}
              onChange={field.onChange}
              error={imageError}
              disabled={isSubmitting}
            />
          )}
        />
      </section>

      <section
        aria-labelledby="review-heading"
        className="space-y-5 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div>
          <h2
            id="review-heading"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            4. Review and submit
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Confirm your details, then submit the waste report.
          </p>
        </div>

        <ReportReview
          wasteType={watchedValues.wasteType ?? ''}
          description={watchedValues.description ?? ''}
          estimatedQuantity={watchedValues.estimatedQuantity ?? ''}
          quantityUnit={watchedValues.quantityUnit ?? ''}
          severity={watchedValues.severity ?? ''}
          address={watchedValues.address ?? ''}
          latitude={watchedValues.latitude ?? null}
          longitude={watchedValues.longitude ?? null}
          images={currentImages}
        />

        {errors.root && (
          <div
            id="report-form-error"
            className="rounded-md bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200"
            role="alert"
          >
            {errors.root.message}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <div className="sm:flex-1">
            <SubmitButton
              isLoading={isSubmitting}
              loadingText="Submitting report..."
            >
              Submit Waste Report
            </SubmitButton>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="min-h-11 w-full rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:w-auto sm:min-w-32"
          >
            Cancel
          </button>
        </div>
      </section>
    </form>
  );
}
