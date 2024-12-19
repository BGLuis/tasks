import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { PERMISSIONS_KEY } from '../decorator/permission.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private readonly reflector: Reflector,
		private readonly jwtService: JwtService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const canActivate = await super.canActivate(context);
		if (!canActivate) {
			return false;
		}

		const requiredRoles = this.reflector.getAllAndOverride<string[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
			PERMISSIONS_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles && !requiredPermissions) {
			return true;
		}

		const request = context.switchToHttp().getRequest();

		const token = request.headers.authorization?.split(' ')[1];
		if (!token) {
			throw new UnauthorizedException('No token provided');
		}

		const payload = this.jwtService.verify(token);

		const userRoles: string[] = payload.roles || [];
		const userPermissions: string[] = payload.permissions || [];

		const hasRole = () =>
			requiredRoles
				? requiredRoles.some((role) => userRoles.includes(role))
				: true;

		const hasPermission = () =>
			requiredPermissions
				? requiredPermissions.some((permission) =>
						userPermissions.includes(permission),
					)
				: true;

		if (!hasRole() || !hasPermission()) {
			throw new UnauthorizedException('Insufficient permissions');
		}
		console.log('passo 5');
		return true;
	}
}
