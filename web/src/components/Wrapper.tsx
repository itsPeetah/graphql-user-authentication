import { Box } from "@chakra-ui/react";
import React from "react";

interface wrapperProps {
    variant?:'small'|'regular'
}

export const Wrapper : React.FC<wrapperProps> = ({children, variant='regular'}) => {
    return(
        <Box mx="auto" mt={8} maxW={variant==='regular'?'800px':'400px'} w="100%">
            {children}
        </Box>
    );
}