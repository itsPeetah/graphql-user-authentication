import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Wrapper } from "../components/Wrapper";

interface registerProps{

}

const Register : React.FC<registerProps> = ({}) => {
    return(
        <Wrapper variant="small">
            <RegisterForm/>
        </Wrapper>
    );
}

export default Register