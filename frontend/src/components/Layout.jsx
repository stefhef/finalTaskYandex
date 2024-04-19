import { Tabs, TabList, Tab, Button, Heading, Spacer } from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import {useSelector} from "react-redux";
import {useActions} from '../hooks/useActions';


const Layout = ({children}) => {
    const {logout} = useActions();
    const {isAuth} = useSelector(state => state.auth);
    return(
    <div className='App'>
      <header w='100%'>
        <Heading bg='#028a7e' color='white' padding='1%'>
          Медленный калькулятор
        </Heading>
        <Tabs>
            <TabList >
                <Tab colorScheme='#028a7e' as={ReactRouterLink} to='/'>
                    Калькулятор
                </Tab>
                <Tab colorScheme='brand' as={ReactRouterLink} to='/settings'>
                    Настройки
                </Tab>
                <Tab colorScheme='brand' as={ReactRouterLink} to='/resourses'>
                    Вычислительные ресурсы
                </Tab>
                <Spacer />
                {isAuth ?
                            <>
                                <Tab>
                                    <ReactRouterLink to={'/'}>
                                        <Button onClick={logout}>
                                            Выйти
                                        </Button>
                                    </ReactRouterLink>
                                </Tab>
                                <Tab as={ReactRouterLink} to={'/profile'}>
                                    Профиль
                                </Tab>
                            </>
                            :
                            <>
                                <Tab as={ReactRouterLink} to={'/register'}>
                                    Регистрация
                                </Tab>
                                <Tab as={ReactRouterLink} to={'/login'}>
                                    Войти
                                </Tab>
                            </>
                        }
            </TabList>
        </Tabs>
        
      </header>
      <main style={{padding: "3%"}}>
        {children}
      </main>
    </div>
    )
}

export default Layout;