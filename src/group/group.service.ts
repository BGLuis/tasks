import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserGroup } from './entities/user-group.entity';
import { Permission } from './entities/permission.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { addUserGroupDto } from './dto/add-user-group.dto';

@Injectable()
export class GroupService {
	constructor(
		@InjectRepository(Group)
		private readonly groupRepository: Repository<Group>,
		@InjectRepository(Permission)
		private readonly permissionRepository: Repository<Permission>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(UserGroup)
		private readonly userGroupRepository: Repository<UserGroup>,
		private eventEmitter: EventEmitter2,
	) {}

	async create(dto: CreateGroupDto, userId: string) {
		const group = await this.groupRepository.save(dto);
		const userGroup = this.userGroupRepository.create({
			userId,
			groupId: group.id,
			permissions: await this.permissionRepository.find(),
		});
		const userGroupSave = await this.userGroupRepository.save(userGroup);
		group.userGroups = [userGroupSave];
		group.owner = userGroupSave;
		return this.groupRepository.save(group);
	}

	findAll() {
		return this.groupRepository.find();
	}

	findAllByUser(userId: string) {
		return this.groupRepository.find({
			where: {
				userGroups: {
					userId,
				},
			},
		});
	}

	findOne(id: string) {
		return this.groupRepository.findOneBy({ id });
	}

	async findOneByUser(id: string, userId: string) {
		return await this.groupRepository.findOne({
			relations: {
				tasks: true,
			},
			where: {
				id,
				userGroups: {
					userId,
				},
			},
		});
	}

	async findUsers(id: string) {
		const users = await this.userGroupRepository.find({
			relations: {
				user: true,
				permissions: true,
			},
			select: {
				userId: false,
				groupId: false,
				user: {
					id: true,
					email: true,
				},
			},
			where: {
				groupId: id,
			},
		});
		return users.map((userGroup) => {
			delete userGroup.user.password;
			delete userGroup.user.roles;
			return {
				...userGroup.user,
				permissions: userGroup.permissions.map((p) => p.name),
			};
		});
	}

	async update(id: string, dto: UpdateGroupDto, userId: string) {
		const group = await this.groupRepository.findOneBy({ id });
		if (!group) throw new NotFoundException(`Group not found`);

		const modifiedField: string[] = [];
		for (const key in dto) {
			if (group[key] != dto[key]) {
				modifiedField.push(key);
			}
		}

		this.eventEmitter.emit('group.updated', {
			groupId: group.id,
			modifiedBy: userId,
			modifiedField,
		});

		this.groupRepository.merge(group, dto);
		return this.groupRepository.save(group);
	}

	async remove(id: string) {
		const group = await this.groupRepository.findOneBy({ id });
		if (!group) throw new NotFoundException(`Group not found`);

		return this.groupRepository.remove(group);
	}

	async addUser(dto: addUserGroupDto, groupId: string) {
		const group = await this.groupRepository.findOneBy({ id: groupId });
		if (!group) throw new NotFoundException(`Group not found`);

		const user = await this.userRepository.findOneBy({ id: dto.userid });
		if (!user) throw new NotFoundException(`User not found`);

		const userGroup = this.userGroupRepository.create({
			userId: dto.userid,
			groupId,
			permissions: await this.permissionRepository.find({
				where: dto.permission.map((name) => ({ name })),
			}),
		});
		return this.userGroupRepository.save(userGroup);
	}
}
