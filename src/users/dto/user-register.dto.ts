import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: "Your email's not valid" })
	email: string;

	@IsString({ message: 'Please enter password' })
	password: string;

	@IsString({ message: 'Please enter your name' })
	name: string;
}
