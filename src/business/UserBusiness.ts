import { UsersDatabase } from "../database/UsersDatabase";
import { GetUsersInput, GetUsersOutput, LoginInput, LoginOutput, SignupInput, SignupOutput } from "../dto/UserDTO";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";
import { User } from "../models/User";
import { HashManager } from "../services/HashManage";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";
import { USER_ROLES } from "../types";

export class UserBusiness {
    constructor(
        private usersDatabase: UsersDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    public getUsers = async (input: GetUsersInput): Promise<GetUsersOutput> => {
        const { q, token } = input

        if (typeof q !== "string" && q !== undefined) {
            throw new BadRequestError("'q' deve ser string ou undefined")
        }

        if(typeof token !== "string" ){
            throw new BadRequestError("token vazio")
        }

        // verifica se o token é válido
        const payload = this.tokenManager.getPayload(token)


        if(payload === null){
            throw new BadRequestError("token não é válido")
        }

        if(payload.role !== USER_ROLES.ADMIN){
            throw new BadRequestError("Precisa ser ADMIN")
        }

        const usersDB = await this.usersDatabase.findUsers(q)

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            )

            return user.toBusinessModel()
        })

        const output: GetUsersOutput = users

        return output
    }

    public signup = async (input: SignupInput): Promise<SignupOutput> => {
        const { name, email, password } = input

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const id = this.idGenerator.generate()

        const passwordHash = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            name,
            email,
            passwordHash,
            USER_ROLES.NORMAL, // só é possível criar users com contas normais
            new Date().toISOString()
        )

        const newUserDB = newUser.toDBModel()
        await this.usersDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getIdUser(),
            name: newUser.getNameUser(),
            role: newUser.getRoleUser()
        }
        const token = this.tokenManager.createToken(tokenPayload)

        const output: SignupOutput = {
            message: "Cadastro realizado com sucesso",
            token: token
        }

        return output
    }

    public login = async (input: LoginInput): Promise<LoginOutput> => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new Error("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new Error("'password' deve ser string")
        }

        const userDB = await this.usersDatabase.findUserByEmail(email)

        if (!userDB) {
            throw new NotFoundError("'email' não encontrado")
        }

        const passwordHash = this.hashManager.compare(password, userDB.password)
        
        if(!passwordHash){
            throw new BadRequestError("'email' ou 'password' incorreto")
        }

        const tokenPayload: TokenPayload = {
                id: userDB.id,
                name: userDB.name,
                role: userDB.role
        }

        const token = this.tokenManager.createToken(tokenPayload)


        const output: LoginOutput = {
            message: "Login realizado com sucesso",
            token: token
        }

        return output
    }
}