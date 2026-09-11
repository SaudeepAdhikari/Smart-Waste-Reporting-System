import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import {
  QUANTITY_UNITS,
  SEVERITY_LEVELS,
  WASTE_TYPES,
  type QuantityUnit,
  type ReportSeverity,
  type WasteType,
} from '../constants/report.constants';

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}

function IsGeoJsonPoint(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGeoJsonPoint',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: unknown): boolean {
          if (!value || typeof value !== 'object') {
            return false;
          }
          const candidate = value as Record<string, unknown>;
          if (candidate.type !== 'Point') {
            return false;
          }
          const coords = candidate.coordinates;
          if (!Array.isArray(coords) || coords.length !== 2) {
            return false;
          }
          const [longitude, latitude] = coords;
          if (typeof longitude !== 'number' || typeof latitude !== 'number') {
            return false;
          }
          if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
            return false;
          }
          if (longitude < -180 || longitude > 180) {
            return false;
          }
          if (latitude < -90 || latitude > 90) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid GeoJSON Point with coordinates [longitude, latitude]`;
        },
      },
    });
  };
}

export class CreateReportDto {
  @IsEnum(WASTE_TYPES, { message: 'Please select a valid waste type' })
  wasteType!: WasteType;

  @IsString()
  @MinLength(10, { message: 'Please add a bit more detail (at least 10 characters)' })
  @MaxLength(1000, { message: 'Description must be 1000 characters or less' })
  description!: string;

  @IsNumber({}, { message: 'Enter a valid estimated quantity' })
  @Min(0.01, { message: 'Quantity must be greater than zero' })
  @Max(100000, { message: 'Quantity seems too large. Please check the value' })
  estimatedQuantity!: number;

  @IsEnum(QUANTITY_UNITS, { message: 'Please select a quantity unit' })
  quantityUnit!: QuantityUnit;

  @IsEnum(SEVERITY_LEVELS, { message: 'Please select a severity level' })
  severity!: ReportSeverity;

  @IsString()
  @MaxLength(500, { message: 'Address must be 500 characters or less' })
  address!: string;

  @IsGeoJsonPoint({ message: 'Please select the location of the waste' })
  location!: GeoJSONPoint;

  @IsInt({ message: 'imageCount must be an integer' })
  @Min(0)
  @Max(5)
  @IsOptional()
  imageCount?: number;
}
