import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TaskHistory } from './entities/task-history.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GroupModule } from 'src/group/group.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Task, TaskHistory]),
		EventEmitterModule.forRoot(),
		AuthModule,
		GroupModule,
	],
	controllers: [TaskController],
	providers: [TaskService],
})
export class TaskModule {}
