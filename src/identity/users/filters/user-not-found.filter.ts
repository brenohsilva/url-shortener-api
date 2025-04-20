import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError } from 'src/common/errors/not-found.error';


@Catch(NotFoundError)
export class UserNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    response.status(404).json({
      statusCode: 404,
      message: exception.message,
    });
  }
}
