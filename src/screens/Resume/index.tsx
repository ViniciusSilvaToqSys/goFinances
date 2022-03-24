import React,  {useCallback, useEffect, useState} from 'react';
import  AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { HistoryCard } from '../../components/HistoryCard';
//consegue pegar a altura do menu de baixo do tab navigator
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';

import { 
    Container, 
    Header, 
    Title, 
    Content, 
    ChartContent ,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer

} from './styles';
import { categories } from '../../utils/categories';
//npm install react-native-svg
//npm install victory-native
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme} from 'styled-components';


interface TransactionData{
    id: string;
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
    percent: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
}

export function Resume(){
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    const [totalByCategories, setTotalByCategories]= useState<CategoryData[]>([]);
    
    const theme = useTheme();

    function handleDateChange(action: 'next' | 'prev'){
        if (action === 'next'){
            setSelectedDate(addMonths(selectedDate, 1));
        }else{
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    async function loadData(){
        setIsLoading(true);
        const dataKey = '@gofinance:transaction';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
            .filter((expensive: TransactionData) => 
                expensive.type === 'negative' &&
                new Date(expensive.date).getMonth() === selectedDate.getMonth() &&   
                new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            );

        const expensivesTotal = expensives
            .reduce((acumullator: number, expensive: TransactionData )=>{
                return acumullator + Number(expensive.amount);
            }, 0);

        const totalByCategory: CategoryData[] = [];   
            
        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if(expensive.category === category.key){
                    categorySum += Number(expensive.amount);
                }
            });

            const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

            if (categorySum > 0){
                const totalFormatted = categorySum
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })

                    totalByCategory.push({
                        key: category.key,
                        name: category.name,
                        color: category.color,
                        total: categorySum,
                        totalFormatted,
                        percent
                    });
            }
        });

        setTotalByCategories(totalByCategory);    
        setIsLoading(false);
    }

    useFocusEffect(useCallback(()=>{
        loadData();
    },[selectedDate]));
    
    return (
        <Container>                        
            <Header>
                <Title>Resumo por Categoria</Title>
            </Header>
                {
                    isLoading ? 
                    <LoadContainer>
                        <ActivityIndicator 
                            color={theme.colors.primary}
                            size="large"
                        />
                    </LoadContainer> :
                    
                    <Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight(),
                        }}
                    >
                        <MonthSelect>
                            <MonthSelectButton onPress={()=> handleDateChange('prev')}>
                                <MonthSelectIcon name="chevron-left" />
                            </MonthSelectButton>

                            <Month>
                                {format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}
                            </Month>

                            <MonthSelectButton onPress={()=> handleDateChange('next')}>
                                <MonthSelectIcon name="chevron-right"/>
                            </MonthSelectButton>
                        </MonthSelect>
                        
                        <ChartContent>
                            <VictoryPie
                                data={totalByCategories}
                                colorScale={totalByCategories.map(category => category.color)}
                                style={{
                                    labels: { 
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
                                    }
                                }}
                                labelRadius={50}
                                x="percent"
                                y="total"
                            />
                        </ChartContent>
                        {
                            totalByCategories.map(item=> (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }   
                    </Content>                
                }
        </Container>
    )
}