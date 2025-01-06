import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { Role } from 'src/user/entities/role.entity';
import { Permission } from 'src/group/entities/permission.entity';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Role)
		private readonly RoleRepository: Repository<Role>,
		@InjectRepository(Permission)
		private readonly PermitionRepository: Repository<Permission>,
		private readonly passwordEncryption: PasswordEncryption,
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
				{ name: 'task-update' },
				{ name: 'task-delete' },
				{ name: 'user-update' },
				{ name: 'user-delete' },
				{ name: 'user-invite' },
				{ name: 'group-update' },
				{ name: 'group-delete' },
			]);
			await this.RoleRepository.save([
				{
					name: 'developer',
				},
				{
					name: 'user',
				},
			]);
		}
	}
}
