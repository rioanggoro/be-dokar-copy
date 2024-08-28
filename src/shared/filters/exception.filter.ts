import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = (exception instanceof HttpException)
      ? exception.getStatus()
      : 500;

    const exceptionResponse = (exception instanceof HttpException)
      ? exception.getResponse()
      : { message: exception.message };

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException(exception.message);
    }

    response.status(status).json({
      statusCode: status,
      status: status === 500 ? 'Internal Server Error' : 'Error',
      message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message,
      // Optional: You may include the request path or timestamp if needed
      // path: request.url,
      // timestamp: new Date().toISOString(),
    });
  }
}
