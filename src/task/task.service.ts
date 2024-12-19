import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskHistory } from './entities/task-history.entity';

@Injectable()
export class TaskService {
	constructor(
		@InjectRepository(Task)
		private readonly TaskRepository: Repository<Task>,
		@InjectRepository(TaskHistory)
		private readonly TaskHistoryRepository: Repository<TaskHistory>,
	) {}

	create(dto: CreateTaskDto, userId: string) {
		const task = this.TaskRepository.create({ ...dto, CreateBy: userId });
		task.done = false;
		return this.TaskRepository.save(task);
	}

	findAll() {
		return this.TaskRepository.find();
	}

	findOne(id: string) {
		return this.TaskRepository.findOneBy({ id });
	}

	async checkd(id: string, userId: string) {
		const task = await this.TaskRepository.findOneBy({ id });
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
		if (!task) return null;

		const modifiedField: string[] = [];
		for (const key in dto) {
			if (task[key] != dto[key]) {
				modifiedField.push(key);
			}
		}

		this.TaskRepository.merge(task, dto);
		this.TaskHistoryRepository.save({
			taskId: task.id,
			modifiedBy: userId,
			modifiedField: modifiedField,
		});

		return this.TaskRepository.save(task);
	}

	async remove(id: string) {
		const task = await this.TaskRepository.findOneBy({ id });
		if (!task) return null;
		return this.TaskRepository.remove(task);
	}

	async getHistory(id: string) {
		return this.TaskHistoryRepository.find({
			where: { taskId: id },
			order: { modifiedAt: 'DESC' },
		});
	}
}
