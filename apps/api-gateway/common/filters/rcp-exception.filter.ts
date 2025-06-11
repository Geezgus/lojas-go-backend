import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Erro interno no servidor'

    console.error('[Erro capturado no AllExceptionsFilter]', exception)

    if (exception instanceof RpcException) {
      status = HttpStatus.SERVICE_UNAVAILABLE
      const error = exception.getError()
      message = typeof error === 'string' ? error : (error as any)?.message || message
    } else if (
      exception instanceof AggregateError ||
      (exception instanceof Error && exception.message?.includes('ECONNREFUSED')) ||
      (exception instanceof Error && exception.message?.includes('ECONNRESET'))
    ) {
      status = HttpStatus.SERVICE_UNAVAILABLE
      message = 'Serviço temporariamente indisponível. Tente novamente mais tarde.'
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const responseMessage = exception.getResponse()
      message = typeof responseMessage === 'string' ? responseMessage : (responseMessage as any).message
    } else if (typeof exception === 'object' && exception !== null && 'message' in exception) {
      // Casos como: { status: 'error', message: '...' }
      status = HttpStatus.SERVICE_UNAVAILABLE
      message = (exception as any).message || message
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    })
  }
}
