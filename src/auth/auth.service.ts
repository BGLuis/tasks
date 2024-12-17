import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { Role } from 'src/user/entities/role.entity';
import { Permission } from 'src/user/entities/permission.entity';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Role)
		private readonly RoleRepository: Repository<Role>,
		@InjectRepository(Permission)
		private readonly PermitionRepository: Repository<Permission>,
		private readonly passwordEncryption: PasswordEncryption,
		private readonly logger: Logger,
	) {}

	async signUp(email: string, password: string) {
		const userExist = await this.userRepository.findOneBy({ email });
		if (userExist) {
			this.logger.error('User exists', userExist);
			throw new BadRequestException('User already exists');
		}

		const result = await this.passwordEncryption.encrypt(password);
		const user = await this.userRepository.save({
			email,
			password: result,
			roles: await this.RoleRepository.findBy({ name: 'user' }),
		});
		this.logger.log('User create', user);
		return user;
	}

	async signIn(email: string, password: string) {
		const user = await this.userRepository.findOneBy({ email });
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

	async initializeData() {
		const roles = await this.RoleRepository.find();
		if (roles.length === 0) {
			this.logger.log('No roles found, creating roles');
			await this.PermitionRepository.save([
				{ name: 'task-create' },
				{ name: 'task-read' },
				{ name: 'task-update' },
				{ name: 'task-delete' },
				{ name: 'user-create' },
				{ name: 'user-read' },
				{ name: 'user-update' },
				{ name: 'user-delete' },
				{ name: '*' },
			]);
			await this.RoleRepository.save([
				{
					name: 'developer',
					permissions: await this.PermitionRepository.find(),
				},
				{
					name: 'user',
					permissions: await this.PermitionRepository.find({
						where: {
							name: Like('task-%'),
						},
					}),
				},
			]);
		}
	}
}
