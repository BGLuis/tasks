import {
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from 'src/user/entities/user.entity';
import { Permission } from './permission.entity';

@Entity('user_groups')
export class UserGroup {
	@PrimaryColumn()
	userId: string;

	@PrimaryColumn()
	groupId: string;

	@ManyToMany(() => Permission, (permission) => permission.id)
	@JoinTable()
	permissions: Permission[];

	@ManyToOne(() => Group, (group) => group.id, {
		cascade: true,
		onDelete: 'CASCADE',
	})
	group: Group;

	@ManyToOne(() => User, (user) => user.id, {
		eager: true,
		cascade: true,
		onDelete: 'CASCADE',
	})
	user: User;
}
