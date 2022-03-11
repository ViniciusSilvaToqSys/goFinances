import React, { useState, useEffect } from "react";

import { HighLightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
import { format } from "date-fns";

//expo install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [data, setData] = useState<DataListProps>([]);

    async function loadTrasactions(){
        const dataKey = '@gofinance:transaction';
        const response = await AsyncStorage.getItem(dataKey);
        const trasactions = response ? JSON.parse(response) : [];

        const transactionFomatted: DataListProps[] =  trasactions.
            map((item: DataListProps) => {
                
                const amount = Number(item.amount)
                    .toLocaleString('pt-Br', {
                        style: 'currency',
                        currency: 'BRL'
                    });


            //const amount = item.amount;
                
            const ndate = new Date(item.date);        
            const date = format(ndate, "dd-MM-yy");
            //const date = Intl.DateTimeFormat('pt-Br', {
            //    day: '2-digit',
            //    month: '2-digit',
            //    year: '2-digit'
            //}).format(new Date(item.date));

            return {
                id:item.id,
                name: item.name,
                amount,
                date,
                type: item.type,
                category: item.category,
            }


        });

        setData(transactionFomatted);

    }

    async function limparAsyncStorage(){
        const dataKey = '@gofinance:transaction';
        const response = await AsyncStorage.removeItem(dataKey); 
    }

     useEffect(()=> {
        //limparAsyncStorage();
        loadTrasactions();
    },[]);

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
