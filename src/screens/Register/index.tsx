import React, {useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { 
    Keyboard, 
    Modal,     
    Alert
} from "react-native";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


import uuid from 'react-native-uuid';

//expo install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';
//npm install @hookform/resolvers yup
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";

//npm install react-hook-form
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";


import {  CategorySelect } from '../CategorySelect';


import { 
    Container,
    Header,
    Title,
    Form, 
    Fields,
    TransactionsType
} from "./styles";

interface FormData {
   name: string;
   amount : string; 
}

const dataKey = '@gofinance:transaction';

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório'),
    amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('Preencher o valor')
})

export function Register(){    
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect(type: 'up' | 'down'){
        setTransactionType(type);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    async function handleRegister(form: FormData){
        if (!transactionType)
            return Alert.alert('Selecione o tipo de transação');

        if (category.key === 'category')
            return Alert.alert('Selecione a categoria')



        const newTrasaction = {
            id: String(uuid.v4()),
            name: form.name,
            amout: form.amount,
            transactionType,
            category: category.key,
            date: new Date()
        }
        
        try{           
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];
            // pega o que tinha e junta com o novo 
            const dataFomatted = [
                ...currentData,
                newTrasaction

            ];
           await AsyncStorage.setItem(dataKey, JSON.stringify(dataFomatted));    
        }catch(error) {
            console.log(error);
            Alert.alert("Não foi possivel salvar");
        }
    }

    useEffect(()=> {
        async function loadData(){
            const data1 = await AsyncStorage.getItem(dataKey);
           console.log(JSON.parse(data1!));
        }
        loadData();
    },[]);

    return (
        <TouchableWithoutFeedback 
            onPress={Keyboard.dismiss}
            containerStyle= {{ flex: 1 }}
            style={{ flex: 1}}
        >
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <InputForm
                        name="name"
                        control={control}
                        placeholder="Nome"  
                        autoCapitalize="sentences" 
                        autoCorrect={false} 
                        error={errors.name && errors.name.message}
                    />
                    <InputForm
                        name="amount"
                        control={control}
                        placeholder="Preço"
                        keyboardType="numeric"
                        error={errors.name && errors.amount.message}
                    />
                    <TransactionsType>
                        <TransactionTypeButton
                            type="up"
                            title="Income"
                            onPress={() => handleTransactionTypeSelect('up')}
                            isActive={transactionType === 'up'}
                        />
                        <TransactionTypeButton
                            type="down"
                            title="Outcome"
                            onPress={() => handleTransactionTypeSelect('down')}
                            isActive={transactionType === 'down'}
                        />
                    </TransactionsType>
                    <CategorySelectButton 
                        title={category.name}
                        onPress={handleOpenSelectCategoryModal}
                    />
                </Fields>
                <Button 
                    title="Enviar"
                    onPress={handleSubmit(handleRegister)}
                />                
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>            
        </Container>
        </TouchableWithoutFeedback>
    );
}