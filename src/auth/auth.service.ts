import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Logger } from 'nestjs-pino';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly repository: Repository<User>,
		private readonly passwordEncryption: PasswordEncryption,
		private readonly logger: Logger,
	) {}

	async signUp(email: string, password: string) {
		const userExist = await this.repository.findOneBy({ email });
		if (userExist) {
			this.logger.error('User exists', userExist);
			throw new BadRequestException('User already exists');
		}

		const result = await this.passwordEncryption.encrypt(password);
		const user = await this.repository.save({ email, password: result });
		this.logger.log('User create', user);
		return user;
	}

	async signIn(email: string, password: string) {
		const user = await this.repository.findOneBy({ email });
		if (!user) {
			this.logger.error('User not exists', email);
			throw new UnauthorizedException('User not exists');
		}

		if (!(await this.passwordEncryption.compare(user.password, password))) {
			this.logger.error('Invalid password', email);
			throw new UnauthorizedException('Invalid password');
		}

		this.logger.log('User sign in', user);

		return user;
	}
}
