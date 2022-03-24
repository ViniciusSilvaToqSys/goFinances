import React, {useState} from "react";
import { 
    Keyboard, 
    Modal,     
    Alert
} from "react-native";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

//npm install react-native-uuid
import uuid from 'react-native-uuid';

// do hook form
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";


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

    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    async function handleRegister(form: FormData){
        const dataKey = '@gofinance:transaction';
        if (!transactionType)
            return Alert.alert('Selecione o tipo de transação');

        if (category.key === 'category')
            return Alert.alert('Selecione a categoria')



        const newTrasaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
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

           reset(); // por causa do reack hook form, tem essa propriedade
           setTransactionType('');
           setCategory({
               key: 'category',
               name: 'Categoria'
           });

           navigation.navigate('Listagem');


        }catch(error) {
            console.log(error);
            Alert.alert("Não foi possivel salvar");
        }
    }

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
                            onPress={() => handleTransactionTypeSelect('positive')}
                            isActive={transactionType === 'positive'}
                        />
                        <TransactionTypeButton
                            type="down"
                            title="Outcome"
                            onPress={() => handleTransactionTypeSelect('negative')}
                            isActive={transactionType === 'negative'}
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