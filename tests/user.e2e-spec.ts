import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
import casual from 'casual';

let application: App;

const mockUser = {
	email: casual.email,
	name: casual.name,
	password: casual.password,
};

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

afterAll(() => {
	application.close();
});

describe('User e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: mockUser.email, password: mockUser.password });

		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'den.example@gmail.com', password: 'somepassword' });

		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: mockUser.email, password: mockUser.password });

		expect(res.statusCode).toBe(401);
		expect(res.body.jwt).toBeUndefined();
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'den.example@gmail.com', password: 'somepassword' });

		const res = await request(application.app)
			.post('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);

		expect(res.body.email).toBe('den.example@gmail.com');
	});

	it('Info - error', async () => {
		const res = await request(application.app)
			.post('/users/info')
			.set('Authorization', `Bearer ${casual.integer(0)}`);

		expect(res.statusCode).toBe(401);
	});
});
