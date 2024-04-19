import {useState} from "react";
import {Button, Input, InputGroup, InputLeftElement, InputRightElement} from "@chakra-ui/react";
import {Icon} from "@chakra-ui/icons";
import {MdLockOutline} from "react-icons/md";

export const PasswordInput = (props) => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    return (
        <InputGroup size='md' style={{margin: '1hv'}}>
            <InputLeftElement
                pointerEvents={'none'}
                children={<Icon as={MdLockOutline} color={'gray.300'}/>} />
            <Input
                required={true}
                value={props.value}
                onChange={e => props.setValue(e.target.value)}
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                placeholder={props.placeholder ? props.placeholder : 'Пароль'}
            />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='xs' onClick={handleClick} margin={"0.5rem"}>
                    {show ? 'Спрятать' : 'Показать'}
                </Button>
            </InputRightElement>
        </InputGroup>
    )
}
