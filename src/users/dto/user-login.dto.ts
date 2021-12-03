import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Password is incorrect' })
	email: string;

	@IsString({ message: 'Password is incorrect' })
	password: string;
}
