import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2"
import User from "../entities/User";
import { MyGraphQLContext } from "src/types";

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
    async getUser(
        @Arg("username", () => String) username : string
    ) : Promise<UserResponse>{
        const theUser = await User.findOne({where:{username}})
        if(!theUser){
            return {errors:[{field: "Username", message: "Username does not exist"}]}
        }
        else return {user:theUser}
    }

    @Query(() => [User])
    async allUsers() : Promise<User[]>{
        const users = User.find()
        return users;
    }


    @Mutation(() => UserResponse)
    async register(
        @Arg("args") args : UsernamePasswordInput,
        @Ctx() {req} : MyGraphQLContext
    ) : Promise<UserResponse> {
        
        // Check username and password length
        if (args.username.length < 3){
            return {errors: [{field: "Username", message: "Username must be at least 3 characters long."}]}
        } else if (args.password.length < 3){
            return {errors: [{field: "Password", message: "Password must be at least 3 characters long."}]}
        }

        // Only stored hashed password
        const hashedPassword = await argon2.hash(args.password)

        // Try creating a new user, fail if username is already taken
        try{
            const theUser = await User.create({username: args.username, password: hashedPassword}).save()
            
            // AUTO-LOGIN
            req.session.userId = theUser._id

            return { user: theUser };

        } catch (err){
            // Error code for trying to create a user with an already existing username
            // username column is set as unique
            if(err.code == "23505") return {errors:[{field: "Username", message:"Username already taken."}]}
            else return{errors:[{field:"Unknown", message:"Something went wrong..."}]}
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("args") args : UsernamePasswordInput,
        @Ctx() {req} : MyGraphQLContext
    ) : Promise<UserResponse>{
        // Check if the username exists
        const theUser = await User.findOne({where:{username:args.username}})
        if(!theUser) return {errors:[{field:"Username", message:"Username not found."}]}
        
        // Validate password
        const passwordIsValid = await argon2.verify(theUser.password, args.password)
        if(!passwordIsValid) return {errors:[{field:"Password", message:"password is not valid."}]}

        req.session.userId = theUser._id

        return {user:theUser}
    }

    @Query(() => User, {nullable:true})
    async me( @Ctx() {req} : MyGraphQLContext ) : Promise<User|null|undefined> {

        if (!req.session.userId){
            return null;
        }
        
        const theUser = await User.findOne({_id: req.session.userId})
        return theUser // return theUser! if I'm sure it's going to be defined
    }
    
}