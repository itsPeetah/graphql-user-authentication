import React from "react"
import { Form, Formik } from "formik"
import { Box, Button } from "@chakra-ui/react"
import InputField from "./InputField"
import { useMutation } from "urql"

const REGISTER_MUTATION = `
mutation Register ($username:String!, $password:String!){
    register(args :{username:$username, password:$password}){
        user {
            _id
            username
        }
        errors {
            field
            message
        }
    }
}
`


export default function RegisterForm() {

    const [{}, register] = useMutation(REGISTER_MUTATION)
    
    const onSubmit = async(values:object) =>  {
        console.log(values)
        const response = await register(values) // The "values" keys map perfectly to the GraphQL mutation's parameters so we don't need to specify them
        return response
    }

    return (
        <Formik
            initialValues={{username: "", password:""}}
            onSubmit={onSubmit}
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
    )
  }