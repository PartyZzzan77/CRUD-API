export interface IUserRequest {
    id: string;
    username: string;
    age: number;
    hobbies: string[] | []
}

export interface IUserRequestTest {
    username: string;
    age: number;
    hobbies: string[] | []
    id?: string
}