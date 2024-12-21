import { User } from 'src/user/entities/user.entity';
import {
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskHistory } from './task-history.entity';
import { Group } from 'src/group/entities/group.entity';

@Entity('tasks')
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	done: boolean;

	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	createAt: Date;

	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	updateAt: Date;

	@Column()
	@ManyToOne(() => User, (user) => user.id)
	CreateBy: string;

	@ManyToOne(() => Group, (group) => group.id)
	group: Group;

	@OneToMany(() => TaskHistory, (history) => history.taskId, {
		cascade: true,
	})
	history: TaskHistory[];

	@BeforeUpdate()
	updateDate() {
		this.updateAt = new Date();
	}
}
