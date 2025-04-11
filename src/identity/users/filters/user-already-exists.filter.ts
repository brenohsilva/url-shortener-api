import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AlreadyExistsError } from '../errors/already-exists.error';
import { Response } from 'express';

@Catch(AlreadyExistsError)
export class UserAlreadyExistsErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
