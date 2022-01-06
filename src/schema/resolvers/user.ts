import { Arg, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2"
import User from "../entities/User";

@InputType()
class UsernamePasswordInput{
    @Field(() => String)
    username:string
    
    @Field(() => String)
    password:string
}

@ObjectType()
class FieldError{
    @Field(()=>String)
    field: string;
    
    @Field(()=>String)
    message: string
}

@ObjectType()
class UserResponse{
    @Field(() => [FieldError], {nullable:true})
    errors?:FieldError[];

    @Field(() => User, {nullable:true})
    user?:User;
}


@Resolver(_=>User)
export default class UserResolver{
    
    @Query(() => UserResponse, {nullable:true})
    async findUser(
        @Arg("username", () => String) username : string
    ) : Promise<UserResponse>{
        const theUser = await User.findOne({where:{username}})
        if(!theUser){
            return {errors:[{field: "Username", message: "Username does not exist"}]}
        }
        else return {user:theUser}
    }

    @Query(() => [User])
    async findAllUsers() : Promise<User[]>{
        const users = User.find()
        return users;
    }


    @Mutation(() => UserResponse)
    async createUser(
        @Arg("args") args : UsernamePasswordInput
    ) : Promise<UserResponse> {

        if (args.username.length < 3){
            return {errors: [{field: "Username", message: "Username must be at least 3 characters long."}]}
        }

        if (args.password.length < 3){
            return {errors: [{field: "Password", message: "Password must be at least 3 characters long."}]}
        }

        const hashedPassword = await argon2.hash(args.password)
        try{
            const theUser = await User.create({username: args.username, password: hashedPassword}).save()
            return { user: theUser };
        } catch (err){
            // Error code for trying to create a user with an already existing username
            // username column is set as unique
            if(err.code == "23505") return {errors:[{field: "Username", message:"Username already taken."}]}
            else return{errors:[{field:"Unknown", message:"Something went wrong..."}]}
        }        
    }
    
}