import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({
    status: 200,
    description: 'API is running',
    schema: {
      example: {
        success: true,
        message: 'API is running',
        data: { status: 'ok' },
      },
    },
  })
  check(): { success: true; message: string; data: { status: 'ok' } } {
    return {
      success: true,
      message: 'API is running',
      data: { status: 'ok' },
    };
  }
}