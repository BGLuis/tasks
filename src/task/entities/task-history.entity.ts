import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_history')
export class TaskHistory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@ManyToOne(() => Task, (task) => task.id)
	taskId: string;

	@Column()
	@ManyToOne(() => User, (user) => user.id)
	modifiedBy: string;

	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	modifiedAt: Date;

	@Column('simple-array')
	modifiedField: string[];
}
