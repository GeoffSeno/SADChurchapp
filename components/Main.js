import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Text, List, ListItem, View, Fab, Button } from 'native-base';
import { FlatList } from 'react-native';
import { createDB, deleteDB, clearData, sendData } from './functions/db.js'
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'dbMk1.db' });
var SQLite = require('react-native-sqlite-storage')


class Main extends Component {  
  static navigationOptions = {
    headerTitle: 'Households'
  };

  constructor(props) {
    super(props)
    this.state = {
      active: 'true',
      FlatListItems: [],
      h_id: 1,
    };
    
    createDB();
    this.getAllHouseholds();
  }

  componentWillMount() {

  }

  getAllHouseholds(){
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM household_t', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          //console.log(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
      });
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <List>
          <FlatList
            data={this.state.FlatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <ListItem onPress={()=>this.props.navigation.navigate('Household', {h_id: item.household_id})}>
                  <Body>
                    <Text>{item.household_number} {item.household_street}</Text>
                    <Text note numberOfLines={1}>{item.household_barangay}</Text>
                  </Body>
                </ListItem>
            )}
          />
          </List>
        </Content>
        <Fab
          active={!this.state.active}
          direction="left"
          containerStyle={{ }}
          style={{ backgroundColor: '#16006a' }}
          position="bottomRight"
          onPress={() => this.setState({ active: !this.state.active })}>
          <Icon name="ios-list" />
          <Button style={{ backgroundColor: '#5b63ff' }} onPress={() => this.props.navigation.navigate('AddHousehold')}>
            <Icon name="add" />
          </Button>
          <Button style={{ backgroundColor: '#5b63ff' }} onPress={() => sendData()}>
            <Icon name="sync" />
          </Button>
        </Fab>
      </Container>
    );
  }

  componentDidMount(){
    this.getAllHouseholds();
  }

  componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props !== prevProps) {
        this.getAllHouseholds();
      }
    }

  componentWillUnmount() {
      
  }
}

export default Main;
