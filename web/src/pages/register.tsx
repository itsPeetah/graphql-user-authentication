import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface registerProps{

}

const Register : React.FC<registerProps> = ({}) => {

    const router = useRouter() 
    const [{}, register] = useRegisterMutation();

    return(
        <Wrapper variant="small">
            <Formik
                initialValues={{username: "", password:""}}
                onSubmit={async(values, {setErrors}) =>  {
                    console.log(values)
                    const response = await register({args: values}) // The "values" keys map perfectly to the GraphQL mutation's parameters so we don't need to specify them
                    console.log(response.data)
                    
                    if(response.data?.register.errors){
                        setErrors(toErrorMap(response.data.register.errors))
                    } else if (response.data?.register.user){
                        // it worked
                        router.push('/')
                    }
                    
                    return response
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <InputField name="username" placeholder="Username..." label="Username"/>
                        <Box mt={4}>
                            <InputField name="password" placeholder="Password..." label="Password" type="password"/>
                        </Box>
                        <Button mt={4} isLoading={isSubmitting} type="submit" color='blue.500'>Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default Register