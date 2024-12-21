import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { addUserGroupDto } from './dto/add-user-group.dto';

@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
	constructor(private readonly groupService: GroupService) {}
	// TODO: Implement Guard for valid user permissions
	@Post()
	async create(
		@CurrentUser() user: CurrentUserDto,
		@Body() dto: CreateGroupDto,
	) {
		const group = await this.groupService.create(dto, user.userId);
		delete group.owner;
		delete group.userGroups;
		return group;
	}

	@Post(':id/users')
	async addUser(@Param('id') id: string, @Body() dto: addUserGroupDto) {
		return this.groupService.addUser(dto, id);
	}

	@Get()
	findAllByUser(@CurrentUser() user: CurrentUserDto) {
		return this.groupService.findAllByUser(user.userId);
	}

	@Get(':id')
	async findOne(
		@CurrentUser() user: CurrentUserDto,
		@Param('id') id: string,
	) {
		return await this.groupService.findOneByUser(id, user.userId);
	}

	@Get(':id/users')
	async findUsers(@Param('id') id: string) {
		return this.groupService.findUsers(id);
	}

	@Patch(':id')
	update(
		@CurrentUser() user: CurrentUserDto,
		@Param('id') id: string,
		@Body() updateGroupDto: UpdateGroupDto,
	) {
		return this.groupService.update(id, updateGroupDto, user.userId);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.groupService.remove(id);
	}
}
