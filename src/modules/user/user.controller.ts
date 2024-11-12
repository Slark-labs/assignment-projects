import { Controller } from "@nestjs/common";
import { CreateUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller()

export class UserController{

    constructor(private readonly userService:UserService  ){}

    

}