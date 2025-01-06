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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { GroupMembershipGuard } from 'src/group/guard/group-membership.guard';
import { Permissions } from 'src/group/decorator/permission.decorator';

@Controller('group/:idGroup/task')
@UseGuards(GroupMembershipGuard)
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Permissions('task-create')
	@Post()
	create(
		@Param('idGroup') idGroup: string,
		@CurrentUser() user: CurrentUserDto,
		@Body() createTaskDto: CreateTaskDto,
	) {
		return this.taskService.create(createTaskDto, user.userId, idGroup);
	}

	@Get()
	findAll(@Param('idGroup') idGroup: string) {
		return this.taskService.findAll(idGroup);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.taskService.findOne(id);
	}

	@Permissions('task-update')
	@Patch(':id/checkd')
	check(@CurrentUser() user: CurrentUserDto, @Param('id') id: string) {
		return this.taskService.checkd(id, user.userId);
	}

	@Permissions('task-update')
	@Patch(':id')
	update(
		@CurrentUser() user: CurrentUserDto,
		@Param('id') id: string,
		@Body() updateTaskDto: UpdateTaskDto,
	) {
		return this.taskService.update(id, updateTaskDto, user.userId);
	}

	@Permissions('task-delete')
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.taskService.remove(id);
	}

	@Get(':id/history')
	history(@Param('id') id: string) {
		return this.taskService.getHistory(id);
	}
}
