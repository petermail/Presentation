import React, {Component} from 'react';
import './App.css';


const options = [];
const newOptions = [];
var nextId = 0;

export default class App3 extends Component{
  constructor(){
      super();
      this.state = {
          description: null,
          options: options,
          error: null,
          isAdmin: true,
          wallet: null,
          notes: null,
          balance: 0,
          tx: null,
          newOptions: newOptions,
          newDescription: ''
      }
      
  }
  componentDidMount(){
  }
  onUpdateOption = (i, val) => {
    var wasDone = false;
    this.setState(state => {
      const options = state.options.map((item) => {
        if (i === item.id && !wasDone){
          item.votes = item.votes + parseFloat(val);
          wasDone = true;
        }
        return item;
      });
      return {
        options,
      };
    });
  };
  onAddOption = (id, opText) => {
    let op = { id: id, text: opText, votes: 0 };
    this.setState({ options: [...this.state.options, op] });
  };

  addOption = () => {
    let op = { id: nextId, text: '' };
    this.setState({ newOptions: [...this.state.newOptions, op] });
    ++nextId;
  }
  updateOption = (id, text) => {
    var wasDone = false;
    this.setState(state => {
        const newOptions = state.newOptions.map((item) => {
            if (id == item.id && !wasDone){
                item.text = text;
                wasDone = true;
            }
            return item;
        });
        return newOptions;
    });
  }
  finishPoll = () => {
    console.log("poll description: ", this.state.newDescription);
    console.log("poll options: ", this.state.newOptions);
  }
  handleChange = (event) => {
    this.setState({ newDescription: event.target.value });
  }
  handleItemChange = (event) => {
      console.log(event.target.value);
      console.log(event.target.name);
      this.updateOption(event.target.name, event.target.value);
  }

  render(){
    return (
        <div>
          { 
            <div>balance: {this.state.balance} ARTv1</div>
          }
          {
            this.state.isAdmin &&
            <div>is admin</div>
          }
            <h1>App v.1.0</h1>
            {this.state.isAdmin &&
              <div>
                <form>
                new description: 
                    <input id="newDesc" type="text" onChange={this.handleChange} />
                <ul>
                {this.state.newOptions.map((item) => (
                  <li key={item.id} id={item.id}>
                    <input type="text" name={item.id} value={item.text} onChange={this.handleItemChange} />
                  </li>
                ))}
                <div><a href="#" onClick={this.addOption}>add option</a></div>
                <div><a href="#" onClick={this.finishPoll}>finish</a></div>
                </ul>
                </form>
              </div>
            }
            {this.state.error &&
                <div>{this.state.error}</div>
            }
            {this.state.notes &&
              <div><a href={this.state.tx}>{this.state.notes}</a></div>
            }
        </div>
    )
  }
}