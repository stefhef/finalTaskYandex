import { Tabs, TabList, Tab, Heading, Link as ChakraLink } from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'

const Layout = ({children}) => {
    return(
    <div className='App'>
      <header w='100%'>
        <Heading bg='#028a7e' color='white' padding='1%'>
          Медленный калькулятор
        </Heading>
        <Tabs>
            <TabList >
                <Tab colorScheme='#028a7e'>
                    <ChakraLink as={ReactRouterLink} to='/'>Калькулятор</ChakraLink>
                </Tab>
                <Tab colorScheme='brand'>
                    <ChakraLink as={ReactRouterLink} to='/settings'>Настройки</ChakraLink>
                </Tab>
                <Tab colorScheme='brand'>
                    <ChakraLink as={ReactRouterLink} to='/resourses'>Вычислительные ресурсы</ChakraLink>
                </Tab>
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