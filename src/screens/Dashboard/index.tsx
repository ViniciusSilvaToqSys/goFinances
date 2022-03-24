import React, { useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

import { useTheme } from "styled-components";


import { HighLightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
import { format, parseISO } from "date-fns";


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
    LogoutButton,
    LoadContainer
} from './styles'; 
import { ptBR } from "date-fns/locale";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLightProps{
    amount: string;
    lastTransaction: string;
}
interface HighLightData {
    entries: HighLightProps;
    expensives: HighLightProps;
    total: HighLightProps;
}

export function Dashboard (){  
    const [isLoading, setIsLoading] = useState(true);  
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData);

    const theme = useTheme();


    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
    ){
        // filtrar por tipo de transacao, faz um map para pegar so as datas e depoi o math
        // pega a maior data, para ser a mais recente
        const lastTransaction = new Date( 
            Math.max.apply(Math, collection
            .filter(transactions => transactions.type === type)
            .map(transactions => new Date(transactions.date).getTime())));

        //const ndate = parseISO(lastTransaction);       
        return format(lastTransaction, "d 'de' MMMM");
    };


    async function loadTrasactions(){
        const dataKey = '@gofinance:transaction';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entreisTotal = 0;
        let expensiveTotal = 0;

        const transactionFomatted: DataListProps[] =  transactions.
            map((item: DataListProps) => {
                
                if (item.type === 'positive'){
                    entreisTotal += Number(item.amount);
                }else {
                    expensiveTotal += Number(item.amount);
                }

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

        setTransactions(transactionFomatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensive = getLastTransactionDate(transactions, 'negative');

        console.log(new Date(lastTransactionEntries));

        const total = entreisTotal - expensiveTotal;
        setHighLightData({
            entries: {
                amount: entreisTotal.toLocaleString('pt-Br',{
                    style: 'currency',
                    currency: 'BRL'                
                }),
                lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-Br',{
                    style: 'currency',
                    currency: 'BRL'                
                }),
                lastTransaction: `Última saída dia ${lastTransactionExpensive}`,
            },
            total: {
                amount: total.toLocaleString('pt-Br',{
                    style: 'currency',
                    currency: 'BRL'                
                })
            }
        });
        setIsLoading(false); // para não exibir mais o loading
    }

    async function limparAsyncStorage(){
        const dataKey = '@gofinance:transaction';
        const response = await AsyncStorage.removeItem(dataKey); 
    }

     useEffect(()=> {
       // limparAsyncStorage();
       loadTrasactions();
    },[]);

    useFocusEffect(useCallback(()=> {
        loadTrasactions();
    },[]));

    return (
        <Container>             
            {
                isLoading ? 
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer> :
                <>
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
                            amount={highLightData.entries.amount} 
                            lastTransaction={highLightData.entries.lastTransaction}
                        />
                        <HighLightCard 
                            type="down"
                            title="Saidas" 
                            amount={highLightData.expensives.amount} 
                            lastTransaction={highLightData.expensives.lastTransaction} 
                        />
                        <HighLightCard
                            type="total" 
                            title="Entradas" 
                            amount={highLightData.total.amount}
                            lastTransaction="01 a 16 de abril" 
                        />
                    </HighLightCards>   

                    <Transactions>
                        <Title>Listagem</Title>  
                        <TransactionsList
                            data={transactions}
                            keyExtractor={ item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}                  
                        />               
                    </Transactions>    
                </>
            }   
        </Container>
    )
}
