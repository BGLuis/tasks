import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GroupService } from '../group.service';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PERMISSIONS_KEY } from '../decorator/permission.decorator';

@Injectable()
export class GroupMembershipGuard implements CanActivate {
	private readonly logger = new Logger(GroupMembershipGuard.name);

	constructor(
		private readonly jwtAuthGuard: JwtAuthGuard,
		private readonly reflector: Reflector,
		private readonly groupService: GroupService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const userValid = await this.jwtAuthGuard.canActivate(context);

		if (!userValid) {
			this.logger.log('User is not authenticated');
			return false;
		}

		const request = context.switchToHttp().getRequest();
		const groupId = request.params['idGroup'];

		if (!groupId) {
			throw new BadRequestException('Group id is required');
		}

		const group = await this.groupService.findOne(groupId);

		if (!group) {
			throw new NotFoundException('Group not found');
		}

		const user: CurrentUserDto = request.user;
		const groupUsers = await this.groupService.findUsers(groupId);

		const isUserInGroup = groupUsers.filter(
			(userGroup) => userGroup.id === user.userId,
		)[0];
		if (!isUserInGroup) {
			throw new UnauthorizedException(
				'User is not a member of the group',
			);
		}

		const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
			PERMISSIONS_KEY,
			[context.getHandler(), context.getClass()],
		);

		const userPermissions = isUserInGroup.permissions || [];

		const hasPermission = () =>
			requiredPermissions
				? requiredPermissions.some((permission) =>
						userPermissions.includes(permission),
					)
				: true;

		if (!hasPermission()) {
			throw new UnauthorizedException('Insufficient permissions');
		}

		return true;
	}
}
