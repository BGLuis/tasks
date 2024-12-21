import { IsString, IsUUID } from 'class-validator';

export class addUserGroupDto {
	@IsUUID()
	userid: string;

	@IsString({ each: true })
	permission: string[];
}
