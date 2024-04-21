import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    Flex,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useMutation, gql } from '@apollo/client';

import {PasswordInput} from "../components/PasswordInput";
import {decodeLocal} from "../api/Common";
import {BaseSpinner} from "../components/BaseSpinner";
import {LoginInput} from "../components/LoginInput";


const HomePage = () => {

    useEffect(() => {
        document.title = "Авторизация";
    });

    const [valueLogin, setValueLogin] = useState('')
    const [valuePassword, setValuePassword] = useState('')
    const [valueModal, setValueModal] = useState(0) // 0 - остутсвует, 1 - успех входа, 2 - ошибка входа
    const navigate = useNavigate();

    const LOGIN = gql`
    mutation GetUser($username: String!, $password: String!){
        GetUser(username: $username, password: $password)}`;
    const [sendData, { data, loading, error }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            if (data == null) {
                setValueModal(2)
                return
            }
            console.log(data)
            localStorage.setItem("access_token", decodeLocal(data.GetUser))
            setTimeout(() => {
                window.location.reload();
                navigate('/')
            }, 1000)
            return (<Alert
                status='success'
                variant='subtle'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                height='200px'>
                <AlertIcon boxSize='40px' mr={0}/>
                <AlertTitle mt={4} mb={1} fontSize='lg'>
                    Вход выполнен
                </AlertTitle>
            </Alert>)
        }
    });

    const login = () => {
        navigate("/")
        console.log(valueLogin, valuePassword)
        try {
            sendData({variables: {username: valueLogin, password: valuePassword}})
        } catch (e) {
            console.log(e)
        }   
    }

    if (valueModal == 2) {
        setTimeout(() => {
            setValueModal(0)
        }, 1000)
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
                Ошибка авторизации!
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
                Введён неверный логин или пароль
            </AlertDescription>
        </Alert>)
    }
    if (error) {
        return <Text>Error</Text>
    }

    return (
        <div>
            {loading
                ?
                <>
                    <BaseSpinner/>
                </>
                :
                <Flex alignItems='center' flexDirection={'column'}>
                    <Stack spacing={2}>
                        <LoginInput value={valueLogin} setValue={setValueLogin}/>
                        <PasswordInput value={valuePassword} setValue={setValuePassword}/>
                        <Button style={{marginTop: '10px'}} onClick={login}>
                            Войти
                        </Button>
                    </Stack>
                </Flex>
            }
        </div>
    );
};

export default HomePage;