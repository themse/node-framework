import { hash } from 'bcryptjs';

export class User {
	private password: string;

	constructor(private readonly email: string, private readonly name: string) {}

	getEmail(): string {
		return this.email;
	}

	getName(): string {
		return this.name;
	}

	getPassword(): string {
		return this.password;
	}

	async setPassword(password: string, salt: number): Promise<void> {
		this.password = await hash(password, salt);
	}
}
