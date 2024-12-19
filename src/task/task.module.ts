import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TaskHistory } from './entities/task-history.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Task, TaskHistory]), AuthModule],
	controllers: [TaskController],
	providers: [TaskService],
})
export class TaskModule {}
