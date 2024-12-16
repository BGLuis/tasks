import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
	) {}

	@Post('signup')
	async signUp(@Body() body: SignUpAuthDto) {
		const { email, password } = body;
		const user = await this.authService.signUp(email, password);

		const result = user;
		delete result.password;

		return result;
	}

	@Post('signin')
	async signIn(@Body() body: SignInAuthDto) {
		const { email, password } = body;
		const user = await this.authService.signIn(email, password);

		const payload = { email: user.email, sub: user.id, iss: 'login' };

		return { accessToken: this.jwtService.sign(payload) };
	}
}
