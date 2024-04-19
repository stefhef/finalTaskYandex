import {Flex, Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {Icon} from "@chakra-ui/icons";
import {MdOutlineEmojiPeople} from "react-icons/md";

export const LoginInput = (props) => {

    return (
        <Flex style={{margin: '1hv'}}>
            {/*<Text style={{width: '2000px'}}>*/}
            {/*    {`Введите ${props.addon ? props.addon : 'логин'}:`}*/}
            {/*</Text>*/}
            <InputGroup size='md'>
                {/*<InputLeftAddon children={`Введите ${props.addon ? props.addon : 'логин'}`}/>*/}
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
