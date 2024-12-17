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
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Permissions } from 'src/auth/decorator/permission.decorator';

@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Post()
	create(@Body() createTaskDto: CreateTaskDto) {
		return this.taskService.create(createTaskDto);
	}
	@Permissions('admin')
	@Get()
	findAll() {
		return this.taskService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.taskService.findOne(id);
	}

	@Patch(':id/checkd')
	check(@Param('id') id: string) {
		return this.taskService.checkd(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
		return this.taskService.update(id, updateTaskDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.taskService.remove(id);
	}
}
