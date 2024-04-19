import {useEffect, useState} from "react";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    Flex,
    Stack,
} from "@chakra-ui/react";
import {PasswordInput} from "../components/PasswordInput";
import {useNavigate} from "react-router-dom";
import {decodeLocal} from "../api/Common";
import {BaseSpinner} from "../components/BaseSpinner";
import {LoginInput} from "../components/LoginInput";
import { useMutation, gql } from '@apollo/client';

const HomePage = () => {

    useEffect(() => {
        document.title = "Авторизация";
    });

    const [isLoading, setIsLoading] = useState(false)
    const [valueLogin, setValueLogin] = useState('')
    const [valuePassword, setValuePassword] = useState('')
    const [valueModal, setValueModal] = useState(0) // 0 - остутсвует, 1 - успех входа, 2 - ошибка входа
    const navigate = useNavigate();

    const LOGIN = gql`
    mutation GetUser($username: String!, $password: String!){
        GetUser(username: $username, password: $password)}`;
    const [sendData, { dataMutation, loadingMutation, errorMutation }] = useMutation(LOGIN);

    const login = async () => {
        setIsLoading(true)
        sendData({variables: {username: valueLogin, password: valuePassword}})
    }

    if (isLoading && !loadingMutation) {
        console.log(dataMutation, loadingMutation, isLoading)
        if (errorMutation || dataMutation == null) {
            setValueModal(2)
            setIsLoading(false)
        } else {
            localStorage.setItem("access_token", decodeLocal(dataMutation.access_token))
            setValueModal(1)
        }
    }

    if (valueModal === 1) {
        setTimeout(() => {
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
    } else if (valueModal === 2) {
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

    return (
        <div>
            {isLoading || loadingMutation
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