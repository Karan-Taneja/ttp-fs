import React, { Component } from 'react';
import Axios from 'axios';

// ---- Scripts
import iexReqs from '../scripts/iex';
import appCache from '../scripts/cache';

// ---- CSS
import './stockModal.css';

class StockModal extends Component {
  
  state = {
    stocks: appCache.getItem('stocks'),
    symbol: '',
    displayList: [],
    quantity: '',
    price: '',
    total: '',
  };

  getStockPrice = async () => {
    try{
      const initialRes = await iexReqs.getStockPrice(this.state.symbol);
      this.setState({price: initialRes.data, displayList: []})
    }
    catch(err){
      console.log(err);
    }
    this.pingStockPrice = setInterval(async () => {
      try {
        const res = await iexReqs.getStockPrice(this.state.symbol);
        this.setState({price: res.data})
      }
      catch(err) {
        console.log(err)
      }
    }, 60000);
  };

  handleSymbolSubmit = (e) => {
    e.preventDefault();
    const { symbol, stocks } = this.state;
    const pass = stocks[symbol];
    if(pass) this.getStockPrice();
    else return;
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value.toUpperCase();
    if(name === "symbol") {
      const { stocks } = this.state;
      const displayList = [];
      for(let stock in stocks){
        if(stock[0] !== value[0] || displayList.length >= 3) break;
        else if(stock.indexOf(value) === 0) displayList.push(stock);
      };
      this.setState({[name]: value, displayList});
    }
    else {
      this.setState({[name]: e.target.value});
    };
  };

  handleClick = (e) => {
    const symbol = e.target.getAttribute('value');
    const displayList = [];
    this.setState({symbol, displayList});
  };

  handlePurchase = () => {
    clearInterval(this.pingStockPrice);
  };

  componentWillUnmount(){
    clearInterval(this.pingStockPrice);
  };

  render(){

    const { symbol, displayList, quantity, price } = this.state;

    return (
    <div className="blackdrop" onClick={this.props.toggle} value={true}>
      <div className="modalBox">
        <h1 className="modalHeader col-12 text-center pt-2">Stock Data</h1>
        <form className="px-3 py-4 col-12">
          <div className="form-group">
            <label htmlFor="exampleInputSymbol1">Stock Symbol</label>
            <input type="text" autoComplete="off" className="form-control" placeholder="Stock Symbol" value={symbol} name="symbol" onChange={this.handleChange} />
            <div>
              {displayList.map((e, i) => {
                return <div className="form-control" name={symbol} value={e} key={i} onClick={this.handleClick}>{e}</div>
              })}
            </div>
          </div>
          <div className="col-12 d-flex justify-content-end px-0">
            <button type="submit" className="btn btn-primary" onClick={this.handleSymbolSubmit}>Submit</button>
          </div>
        </form>
      </div>
    </div>
    );
  };
};

export default StockModal;

/*

  TODO:

    1. Create transparent black backdrop
    2. Figure out how to center position absolute
    3. Implement the rest LOL
*/