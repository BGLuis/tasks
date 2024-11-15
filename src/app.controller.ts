import { Controller, Logger, Get } from '@nestjs/common';

@Controller()
export class AppController {
	private readonly logger = new Logger(AppController.name);

	@Get('logger-test')
	logTest(): string {
		this.logger.verbose('This is a log message');
		this.logger.debug('This is a log message');
		this.logger.log('This is a log message');
		this.logger.warn('This is a log message');
		this.logger.error('This is a log message');
		return 'log ';
	}
}
