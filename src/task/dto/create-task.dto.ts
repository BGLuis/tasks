import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreateTaskDto {
	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsBoolean()
	done: boolean;

	@IsDateString()
	createAt: Date;

	@IsDateString()
	updateAt: Date;
}
