export interface DatabaseServiceInterface<T> {
	client: T;

	connect(): Promise<void>;
	disconnect(): Promise<void>;
}
