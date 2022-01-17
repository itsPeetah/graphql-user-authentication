import React from "react"
import { Form, Formik } from "formik"
import { Box, Button } from "@chakra-ui/react"
import InputField from "./InputField"
import { useMutation } from "urql"
import { useRegisterMutation } from "../generated/graphql"
import { toErrorMap } from "../utils/toErrorMap"

export default function RegisterForm() {

    const [{}, register] = useRegisterMutation();

    return (
        <Formik
            initialValues={{username: "", password:""}}
            onSubmit={async(values, {setErrors}) =>  {
                console.log(values)
                const response = await register(values) // The "values" keys map perfectly to the GraphQL mutation's parameters so we don't need to specify them
                console.log(response.data)
                
                if(response.data?.register.errors){
                    setErrors(toErrorMap(response.data.register.errors))
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
    )
  }