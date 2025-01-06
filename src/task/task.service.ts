import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskHistory } from './entities/task-history.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TaskService {
	constructor(
		@InjectRepository(Task)
		private readonly TaskRepository: Repository<Task>,
		@InjectRepository(TaskHistory)
		private readonly TaskHistoryRepository: Repository<TaskHistory>,
		private eventEmitter: EventEmitter2,
	) {}

	create(dto: CreateTaskDto, userId: string, groupId: string) {
		const task = this.TaskRepository.create({
			...dto,
			CreateBy: userId,
			group: { id: groupId },
		});
		task.done = false;
		return this.TaskRepository.save(task);
	}

	findAll(groupId: string) {
		return this.TaskRepository.findBy({ group: { id: groupId } });
	}

	findOne(id: string) {
		return this.TaskRepository.findOneBy({ id });
	}

	async checkd(id: string, userId: string) {
		const task = await this.TaskRepository.findOneBy({
			id,
		});
		if (!task) return null;
		task.done = !task.done;

		await this.TaskHistoryRepository.save({
			taskId: task.id,
			modifiedBy: userId,
			modifiedField: ['done'],
		});

		return this.TaskRepository.save(task);
	}

	async update(id: string, dto: UpdateTaskDto, userId: string) {
		const task = await this.TaskRepository.findOneBy({ id });
		if (!task) throw new NotFoundException(`Task not found`);

		const modifiedField: string[] = [];
		for (const key in dto) {
			if (task[key] != dto[key]) {
				modifiedField.push(key);
			}
		}

		this.eventEmitter.emit('task.updated', {
			taskId: task.id,
			modifiedBy: userId,
			modifiedField,
		});

		this.TaskRepository.merge(task, dto);
		return this.TaskRepository.save(task);
	}

	async remove(id: string) {
		const task = await this.TaskRepository.findOneBy({ id });
		if (!task) throw new NotFoundException(`Task not found`);
		return this.TaskRepository.remove(task);
	}

	async getHistory(id: string) {
		return this.TaskHistoryRepository.find({
			where: { taskId: id },
			order: { modifiedAt: 'DESC' },
		});
	}

	@OnEvent('task.updated')
	async onTaskUpdated(event) {
		const task = await this.TaskRepository.findOneBy({ id: event.taskId });
		if (!task) throw new NotFoundException(`Task not found`);

		this.TaskHistoryRepository.save({
			taskId: task.id,
			modifiedBy: event.modifiedBy,
			modifiedField: event.modifiedField,
		});
	}
}
