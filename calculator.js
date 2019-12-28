import React from "react"
import ReactDOM from "react-dom"

const calculatorButtons = [
    {
      id: "clear",
      class:"item-clear",
      label:"AC",
      obj:"clear",
    },
    {
      id: "divide",
      class:"item-operators",
      label:"/",
      obj:"/"
    },
    {
      id: "multiply",
      class:"item-operators",
      label:"x",
      obj:"*"
    },
    {
      id: "seven",
      class:"item-digit",
      label:"7",
      obj:7
    },
    {
      id: "eight",
      class:"item-digit",
      label:"8",
      obj:8
    },
    {
      id: "nine",
      class:"item-digit",
      label:"9",
      obj:9
    },
    {
      id: "subtract",
      class:"item-operators",
      label:"-",
      obj:"-"
    },
    {
      id: "four",
      class:"item-digit",
      label:"4",
      obj:4
    },
    {
      id: "five",
      class:"item-digit",
      label:"5",
      obj:5
    },
    {
      id: "six",
      class:"item-digit",
      label:"6",
      obj:6
    },
    {
      id: "add",
      class:"item-operators",
      label:"+",
      obj:"+"
    },
    {
      id: "one",
      class:"item-digit",
      label:"1",
      obj:1
    },
    {
      id: "two",
      class:"item-digit",
      label:"2",
      obj:2
    },
    {
      id: "three",
      class:"item-digit",
      label:"3",
      obj:3
    },
    {
      id: "equals",
      class:"item-equals",
      label:"=",
      obj:"="
    },
    {
      id: "zero",
      class:"item-zero",
      label:"0",
      obj:0
    },
    {
      id: "decimal",
      class:"item-digit",
      label:".",
      obj:"."
    },
  ]
  
  class App extends React.Component{
    constructor(props){
      super(props);
      this.state={
        display:'0', //bottom display (white color)
        upperDisplay:'',
        flagEquals:0, //equals button (=) was clicked
        flagOperator:0, //operator (+,-,/,*) displayed
        flagDecimals:0,
        negativeNumber:0,  //operating on negative number
        minusOperator:0,
        digitsLimit:0
      }
      this.handleClick=this.handleClick.bind(this);
      this.handleEquals=this.handleEquals.bind(this);
      this.handleDigits=this.handleDigits.bind(this);
      this.handleOperator=this.handleOperator.bind(this);
      this.handleDecimals=this.handleDecimals.bind(this);
    }
  
    
    handleClick(e){
      const data = [...this.state.display, e];
      const regexDigit = (/\d/);
      const expression = [...this.state.upperDisplay, e];
      const regexOperator = (/[\+\-\*\/]/);
      const flagEquals = this.state.flagEquals;
      const flagOperator = this.state.flagOperator;
      const flagDecimals = this.state.flagDecimals;
      const negativeNumber = this.state.negativeNumber;
      const minusOperator = this.state.minusOperator;
      if(this.state.digitsLimit==1) return; //disabling handleClick if "digit limit" message pops up
      if(flagEquals==1){ //After equals button (=) was clicked
        if(e=="clear"){
          this.setState({negativeNumber:0});
          this.setState({flagEquals:0});
          this.setState({flagOperator:0});
          this.setState({display:'0'});
          this.setState({upperDisplay:''});
        }
        if(regexDigit.test(e)){
          this.setState({flagEquals:0});
          expression.splice(0,expression.length-1);
          data.splice(0,data.length-1);
          this.handleDigits(e,flagOperator,data,expression);
        }
        if(regexOperator.test(e)){
          this.setState({flagEquals:0});
          expression.splice(0,expression.length-data.length);
          this.setState({upperDisplay:data});
        }
      }
      if(this.state.display=="0"&&regexDigit.test(e)){//The very first input OR input from 0
        data.splice(0,1);
        this.setState({display:data});
        this.setState({upperDisplay:expression})
      }
      if(e=="clear"){ //AC button
        this.setState({negativeNumber:0});
        this.setState({flagEquals:0});
        this.setState({flagOperator:0});
        this.setState({flagDecimals:0});
        this.setState({minusOperator:0});
        this.setState({display:'0'});
        this.setState({upperDisplay:''});
      }
      if(regexDigit.test(e)){//When clicking a digit
        this.handleDigits(e,flagOperator,data,expression);
      }
      if(regexOperator.test(e)){//Clicking operator
        this.handleOperator(e,flagOperator,negativeNumber,expression,data,minusOperator);
      }
      if(e=="="){//when clicking =
        this.handleEquals(e,data,expression,flagEquals,flagOperator,negativeNumber);
      }
      if(e=="."){
        this.handleDecimals(e,flagDecimals,data,expression,flagOperator);
      }
    }
    
    handleEquals(e,data,expression,flagEquals,flagOperator,negativeNumber){//RETURNING UNDEFINED AFTER 9/- -> press * and then =
      if(flagOperator==1){//e.g. handle 9*
          if(negativeNumber==1){//e.g. handle 9*-
            expression.splice(expression.length-2,1);
            this.setState({negativeNumber:0});
          }
          expression.splice(expression.length-2,1);
          this.setState({flagOperator:0})
      }
      const formula = expression.join("");//to reflect the expression's formula in upperDisplay
      const result = eval(expression.splice(0,expression.length-1).join(""));
      const rounded=Math.round(1000000000000 * result)/ 1000000000000; //more precision
      //const rounded = parseFloat((result).toFixed(16))//round a number
      if(this.state.upperDisplay==''){
        result = 0;
      } 
        this.setState({
          upperDisplay:formula+""+rounded,
          display:""+rounded,
          flagEquals:1,//setting flag for Equals to determine actions after "=" button click
          flagDecimals:0
        });
        data = result;
    }
    
    handleDigits(e,flagOperator,data,expression){
      if(data.length>14){
        this.setState({display:"DIGITS   LIMIT"})
        this.setState({digitsLimit:1});//disabling handleCLick while LIMIT message is shown
        data.splice(data.length-1,1)
        expression.splice(expression.length-1,1)
        setTimeout(function(){
            this.setState({display:data});
            this.setState({digitsLimit:0});//enabling handleCLick
        }.bind(this),800);
        return
    }
      if(this.state.display=="0"&&e=="0"&&expression.length>1){// prevent from entering multiple "0"s in upperDisplay, allowing only one "0"
        expression.splice(expression.length-1,1);
      }
      if(flagOperator==1){ //if operator is displayed in bottom display
        data.splice(0,1);
        this.setState({flagOperator:0})
      }
      this.setState({
        display:data,
        upperDisplay:expression,
        flagOperator:0,//set all operator flags to 0 to avoid bugs
        negativeNumber:0,
        minusOperator:0
      });
    }
   
    handleOperator(e,flagOperator,negativeNumber,expression,data,minusOperator){//if any operator was clicked
      if(flagOperator==0&&e=="-"){//if first operator clicked is "-"
        this.setState({minusOperator:1});
      }
      if(flagOperator==1){//if there is any sign in the expression already
        if(minusOperator==0){//if the first sign was not "-"
          if(e!=="-"){//second sign is not "-"
            if(negativeNumber==1){
              expression.splice(expression.length-2,1);
            }
            else{
              expression.splice(expression.length-2,1);
            }
          }
          if(e=="-"){//second sign is "-"
            this.setState({minusOperator:1});
            this.setState({negativeNumber:1});
          }
        }
        if(minusOperator==1){//first sign was "-"
          if(e!=="-"){//second sign is not "-"
            this.setState({minusOperator:0});
            if(negativeNumber==1){//eg pressing * after expression== 9/-
              expression.splice(expression.length-3,2);
            }
            if(negativeNumber==0){//eg pressing * after expression== 9-
              expression.splice(expression.length-2,1);
            }
            this.setState({negativeNumber:0})
          }
          if(e=="-"){//second sign is "-"
            expression.splice(expression.length-2,1);
          }
        }
      }
      data.splice(0,data.length-1);//only display 1 sign at a time
      this.setState({
        display:e,
        upperDisplay:expression,
        flagOperator:1,
        flagDecimals:0
      });
    }
    
    handleDecimals(e,flagDecimals,data,expression,flagOperator){
      if(flagOperator==1){
        expression.splice(expression.length-1,1);
        data.splice(data.length-1,1);
        expression = [...expression,0,e];
        data = [...data,0,e]
        this.setState({flagOperator:0})
      }
      if(expression[0]==e&&flagDecimals==0){//if upperDisplay is empty and 
        this.setState({upperDisplay:"0"+expression});
        this.setState({display:data})
        this.setState({flagDecimals:1});
        return
      }
      if(flagDecimals==1){
        expression.splice(expression.length-1,1);
        data.splice(data.length-1,1);
      }
      this.setState({upperDisplay:expression});
      this.setState({display:data})
      this.setState({flagDecimals:1});
    }
    
    render(){
      
      const buttons = calculatorButtons.map(button=><button key={button.id} id={button.id} className={button.class} onClick={(e)=>this.handleClick(button.obj)}>{button.label}</button>);
      return(
        <div id="parent">
          <div id="calculator">
            <div id="display-parent">
              <div id="upper-display"><h5>{this.state.upperDisplay}</h5>
              </div>
              <div id="display"><p>{this.state.display}</p>
              </div>
            </div>
            <div id="buttons">
              {buttons}
            </div>
          </div>
        </div>
      )
    }
  }
  ReactDOM.render(<App />,document.getElementById('root'));