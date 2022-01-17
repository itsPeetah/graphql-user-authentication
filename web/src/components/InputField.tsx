import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string; // takes all props an html input takes, but the name is forced to be required.
} 

const InputField : React.FC<InputFieldProps> = ({label, size:_, ...props})=>{

    const [field, {error}] = useField(props);

    return(
        <FormControl isInvalid={!!error /* error can be an empty string -> cast as boolean ('': false, 'err msg': true) */}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props} id={field.name} placeholder={props.placeholder} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}

export default InputField