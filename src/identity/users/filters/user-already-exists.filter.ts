import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AlreadyExistsError } from 'src/common/errors/already-exists.error';

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
