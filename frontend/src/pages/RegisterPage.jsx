import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Alert, AlertIcon, AlertDescription, AlertTitle, Button, Flex, Spacer, Stack} from "@chakra-ui/react";
import { useMutation, gql } from '@apollo/client';

import {BaseSpinner} from "../components/BaseSpinner";
import {PasswordInput} from "../components/PasswordInput";
import {LoginInput} from "../components/LoginInput";
import {EmailInput} from "../components/EmailInput";
import {decodeLocal} from "../api/Common.js";


const HomePage = () => {

    const REGISTER = gql`
    mutation Register($username: String!, $password: String!){
        Register(username: $username, password: $password)}`;

    const [isLoading, setIsLoading] = useState(false)
    const [valueLogin, setValueLogin] = useState('')
    const [valueEmail, setValueEmail] = useState('')
    const [valuePassword1, setValuePassword1] = useState('')
    const [valuePassword2, setValuePassword2] = useState('')

    const [valueModal, setValueModal] = useState(0) // 0 - остутсвует, 1 - успех регистрации, 2 - ошибка
    const [textError, setTextError] = useState('')
    const navigate = useNavigate();


    const [sendData, { data, loading, error }] = useMutation(REGISTER, {
        errorPolicy: 'all',
        onCompleted: (data) => {
            if (data == null) {
                setValueModal(2)
                return
            }
            console.log(data)
            localStorage.setItem("access_token", decodeLocal(data.Register))
            navigate('/')
            window.location.reload();
            
        }
    });
    useEffect(() => {
        document.title = "Регистрация";
    }, []);

    const register = () => {
        if (![valueLogin, valuePassword1, valuePassword2, valueEmail].every(e => Boolean(e))) {
            setValueModal(2);
            setTextError('Не все данные введены');
            return;
        }    

        if (valuePassword1 !== valuePassword2) {
            setIsLoading(false)
            setValueModal(2)
            setTextError('Пароли не совпадают')
            return
        }

        setIsLoading(true)
        sendData({variables: {username: valueLogin, password: valuePassword1}})
        
    }

    if (valueModal === 2) {
        setTimeout(() => {
            setValueModal(0);
            setTextError('')
        }, 2000)
        return (<Alert
            status='error'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'>
            <AlertIcon boxSize='40px' mr={0}/>
            <AlertTitle mt={4} mb={1} fontSize='lg'>
                Ошибка регистрации!
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
                {textError}
            </AlertDescription>
        </Alert>)
    }

    return (
        <div>
            {isLoading || loading
                ?
                <>
                    <BaseSpinner/>
                </>
                :
                <Flex alignItems='center' flexDirection={'column'}>
                    <Stack spacing={2}>
                        <LoginInput value={valueLogin} setValue={setValueLogin}/>
                        <EmailInput value={valueEmail} setValue={setValueEmail}/>

                        <PasswordInput value={valuePassword1} setValue={setValuePassword1}/>
                        <PasswordInput value={valuePassword2} setValue={setValuePassword2}
                                       placeholder={'Повторите пароль'}/>
                        <Flex>

                            <Button onClick={register}>
                                Зарегистрироваться
                            </Button>
                            <Spacer/>
                            <Button>
                                <Link to={'/login'}>
                                    Войти
                                </Link>
                            </Button>

                        </Flex>
                    </Stack>
                </Flex>
            }
        </div>);
};

export default HomePage;