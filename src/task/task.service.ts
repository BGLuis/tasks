import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
	constructor(
		@InjectRepository(Task)
		private readonly repository: Repository<Task>,
	) {}

	create(dto: CreateTaskDto) {
		const task = this.repository.create(dto);
		task.done = false;
		return this.repository.save(task);
	}

	findAll() {
		return this.repository.find();
	}

	findOne(id: string) {
		return this.repository.findOneBy({ id });
	}

	async checkd(id: string) {
		const task = await this.repository.findOneBy({ id });
		if (!task) return null;
		task.done = !task.done;
		return this.repository.save(task);
	}

	async update(id: string, dto: UpdateTaskDto) {
		const task = await this.repository.findOneBy({ id });
		if (!task) return null;
		this.repository.merge(task, dto);
		return this.repository.save(task);
	}

	async remove(id: string) {
		const task = await this.repository.findOneBy({ id });
		if (!task) return null;
		return this.repository.remove(task);
	}
}
