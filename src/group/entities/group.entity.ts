import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserGroup } from './user-group.entity';
import { Task } from 'src/task/entities/task.entity';

@Entity('groups')
export class Group {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	description: string;

	@OneToOne(() => UserGroup, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	owner: UserGroup;

	@OneToMany(() => UserGroup, (userGroup) => userGroup.group, {
		onDelete: 'CASCADE',
	})
	userGroups: UserGroup[];

	@OneToMany(() => Task, (task) => task.group, {
		cascade: true,
	})
	@JoinColumn()
	tasks: Task[];
}
