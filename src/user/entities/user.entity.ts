import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { UserGroup } from 'src/group/entities/user-group.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@ManyToMany(() => Role, (role) => role.id, { cascade: true, eager: true })
	@JoinTable()
	roles: Role[];

	@OneToMany(() => UserGroup, (userGroup) => userGroup.user)
	userGroups: UserGroup[];
}
