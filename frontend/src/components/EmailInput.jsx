import {Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {EmailIcon} from "@chakra-ui/icons";

export const EmailInput = (props) => {

    return (
        <InputGroup>
            <InputLeftElement
                pointerEvents={'none'}
                children={<EmailIcon color={'gray.300'}/> }/>
            <Input
                value={props.value}
                required={true}
                onChange={e => props.setValue(e.target.value)}
                placeholder={'Почта'}
                focusBorderColor='blue.400'
            />
        </InputGroup>
    )
}
