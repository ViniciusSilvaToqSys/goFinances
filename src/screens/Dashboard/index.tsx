import React from "react";

import { HighLightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import { 
    Container,
    Header,
    UserInfo, 
    Photo,
    User,
    UserGreeting,
    UserName,
    UserWrapper,
    Icon,
    HighLightCards,
    Transactions, 
    Title,
    TransactionsList,
    LogoutButton
} from './styles'; 

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard (){
    const data: DataListProps[] =[{
        id: '1',
        type: "positive",
        title:"Desenvolvimento de Site",
        amount:"R$ 12.000,00",
        category:{
            name: "Vendas",
            icon: "dollar-sign"
        },
        date: "13/04/2022",
    },
    {
        id: '2',
        type: "negative",
        title:"Hamburger Pizzy",
        amount:"R$ 59,00",
        category:{
            name: "Alimentação",
            icon: "coffee"
        },
        date: "10/04/2022",
    },
    {
        id: '3',
        type: "negative",
        title:"Aluguel do Apartamento",
        amount:"R$ 1.200,00",
        category:{
            name: "Casa",
            icon: "shopping-bag"
        },
        date: "08/04/2022",
    }
];
    return (
        <Container> 
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{uri: 'https://github.com/ViniciusSilvaToqSys.png'}}/>
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Vinicius</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton onPress={() => {}}>
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>              
            </Header>   
            <HighLightCards>                                  
                <HighLightCard 
                    type="up"
                    title="Entradas" 
                    amount="R$ 17.400,000" 
                    lastTransaction="Ultima entrada dia 13 de abril" 
                />
                <HighLightCard 
                    type="down"
                    title="Saidas" 
                    amount="R$ 7.500,000" 
                    lastTransaction="Ultima saída dia 10 de abril" 
                />
                <HighLightCard
                    type="total" 
                    title="Entradas" 
                    amount="R$ 9.900,000" 
                    lastTransaction="01 a 16 de abril" 
                />
            </HighLightCards>   

            <Transactions>
                <Title>Listagem</Title>  
                <TransactionsList
                    data={data}
                    keyExtractor={ item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}                  
                />               
            </Transactions>    
        </Container>



    )
}
