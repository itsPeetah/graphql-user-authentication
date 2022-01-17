import React from "react"
import { Form, Formik } from "formik"
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import InputField from "./InputField"

export default function FormikExample() {
    return (
        <Formik initialValues={{username: "", password:""}} onSubmit={(values) => {console.log(values)}} >
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