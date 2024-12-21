import { IsString, Length } from 'class-validator';

export class CreateGroupDto {
	@IsString()
	name: string;

	@IsString()
	@Length(0, 255)
	description: string;
}
