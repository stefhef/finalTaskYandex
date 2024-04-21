import {Flex, Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {Icon} from "@chakra-ui/icons";
import {MdOutlineEmojiPeople} from "react-icons/md";

export const LoginInput = (props) => {

    return (
        <Flex style={{margin: '1hv'}}>
            <InputGroup size='md'>
                <InputLeftElement
                    pointerEvents={'none'}
                    children={<Icon as={MdOutlineEmojiPeople} color={'gray.300'}/>}/>
                <Input
                    required={true}
                    value={props.value}
                    onChange={e => props.setValue(e.target.value)}
                    pr='4.5rem'
                    placeholder={props.placeholder ? props.placeholder : 'Логин'}
                />
            </InputGroup>
        </Flex>
    )
}
