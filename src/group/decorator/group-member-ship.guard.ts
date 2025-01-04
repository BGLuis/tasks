import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GroupService } from '../group.service';

@Injectable()
export class GroupMembershipGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly groupService: GroupService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const paramValue = request.params['paramName'];

		const user = request.user;
		const group = await this.groupService.findOne(paramValue.idGroup);

		return group.userGroups
			.map((userGroup) => userGroup.user.id)
			.includes(user.id);
	}
}
