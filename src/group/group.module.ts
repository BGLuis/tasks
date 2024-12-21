import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Permission } from './entities/permission.entity';
import { User } from 'src/user/entities/user.entity';
import { UserGroup } from './entities/user-group.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Group, Permission, User, UserGroup]),
		AuthModule,
		EventEmitterModule.forRoot(),
	],
	controllers: [GroupController],
	providers: [GroupService],
})
export class GroupModule {}
