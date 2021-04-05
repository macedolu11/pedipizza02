import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, Text, TextInput,View, Button, ToastAndroid } from "react-native";
// IMG
import ImgPizza from './assets/pizza.jpg'
// NAVEGAÇÃO
import { NavigationContainer, TabRouter } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FlatList } from "react-native-gesture-handler";
import axios from 'axios'

const Tab = createBottomTabNavigator()

const Lancamento = (props) =>{
  console.log(props)
  return (
    <View>
      <View style={estilos.divalig}>
        <Text style={estilos.title}> Dados do Pedido</Text>
        <Text>Nome: </Text>
        <TextInput
          label="Nome"
          style={estilos.input}
          placeholder="Digite aqui seu nome"
          value={props.lancamentos.nome}
          onChangeText={(txt) => {props.atualizarInput("nome", txt);}}
        />
        <Text>Sabor: </Text>
        <TextInput
          label="Sabor"
          style={estilos.input}
          placeholder="Sabor desejado"
          value={props.lancamentos.sabor}
          onChangeText={(txt) => {props.atualizarInput("sabor", txt);}}
          // onChangeText={(txt) => {this.atualizartexto('nome',txt)}}
        />
        <Text>Tamanho: </Text>
        <TextInput
          label="Tamanho"
          style={estilos.input}
          placeholder="Tamanho Desejado"
          value={props.lancamentos.tamanho}
          onChangeText={(txt) => {props.atualizarInput("tamanho", txt);}}
        />
        <Text>Quantidade: </Text>
        <TextInput
          label="Quantidade"
          style={estilos.input}
          placeholder="Quantidade desejada"
          value={props.lancamentos.quantidade}
          onChangeText={(txt) => {props.atualizarInput("quantidade", txt);}}
        />
        <Button
          style={estilos.button}
          title="Realizar Pedido"
          onPress={() => {props.salvar()}}
        />
      </View>
    </View>
  );
}

const Dados = (props) =>{
  // console.log(props)
  return(
    <View style={estilos.divpedido}> 
      <Text style={estilos.titlepedido}> {props.item.nome}</Text>
      <Text> Quantidade:{props.item.quantidade} | Sabor: {props.item.sabor} | Tamanho:{props.item.tamanho} </Text>
      <TextInput style={estilos.sep} />
    </View>
  )
}

const Pedido = (props) => {
  return (
    <FlatList
      data={props.lancamentos}
      renderItem={Dados}
      keyExtractor={(idx) => idx.index}
    />
  );
};

class App extends React.Component {
  state = {
    pedido: {
      nome: "",
      sabor: "",
      tamanho: "",
      quantidade: "",
    },

    lancamentos: [],
  };

  componentDidMount(){
    axios.get('https://backendfecaf.herokuapp.com/extrato')
    .then((res) => {
      console.log(res.data)
      const newState = {...this.state}
      newState.lancamentos = [...res.data];
      this.setState(newState)
    })
    
  }

  atualizartexto(campo, text) {
    const newState = { ...this.state };
    newState.pedido[campo] = text;
    this.setState(newState);
  }

  salvar() {
    axios.post("https://backendfecaf.herokuapp.com/lancamento",
    {...this.state.pedido}, 
    )
    .then( (req,res) =>{
      console.log(res)
      // ToastAndroid.show("Pedido feito com sucesso", ToastAndroid.LONG)
    })

    // const newState = { ...this.state };
    // const obj = { ...this.state.pedido };
    // newState.lancamentos.push(obj);
    // this.setState(newState);
  }

  render() {
    return (
      <View style={estilos.container}>
        <View style={estilos.cabecalho}>
          <Image source={ImgPizza} style={estilos.imagem}></Image>
        </View>
        <View style={estilos.corpo}>
          <NavigationContainer>
            <Tab.Navigator>
              {/* ABAS */}
              <Tab.Screen name="Lançamento">
                {() => {
                  return (
                    <Lancamento
                      lancamentos={this.state.pedido}
                      atualizarInput={ (campo, text) => {this.atualizartexto(campo,text)} }
                      salvar={() => {this.salvar()}}
                    />
                  );
                }}
              </Tab.Screen>

              <Tab.Screen name="Pedido">
                {() => {
                  return <Pedido lancamentos={this.state.lancamentos} />;
                }}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  cabecalho: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "stretch",
  },
  imagem: {
    flex: 1,
    width: "100%",
  },
  corpo: {
    flex: 4,
    backgroundColor: "#CFF",
  },
  divpedido: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  titlepedido: {
    fontSize: 20,
  },
  sep: {
    width: "100%",
    height: 1,
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    marginTop: 20,
  },
  input: {
    alignContent: "center",
    marginTop: 10,
    marginBottom: 10,
    width: 220,
    borderWidth: 2,
  },

  hr: {
    width: 220,
    height: 1,
    borderWidth: 1,
  },

  div: {
    marginLeft: 1,
    textAlign: "left",
  },
  divalig: {
    justifyContent: "center",
    alignItems: "center",
  },
  divsep: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 320,
  },
  button:{
    width: 1,
  }
});

export default App