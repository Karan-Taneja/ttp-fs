import React, { Component } from 'react';
import axios from 'axios';

// ---- Contexts
import AuthContext from '../contexts/auth';

// ---- Scripts
import iexReqs from '../scripts/iex';
import appCache from '../scripts/cache';
import format from '../scripts/format';

// ---- CSS
import './stockModal.css';

class StockModal extends Component {
  
  static contextType = AuthContext;

  state = {
    user: this.context.user,
    stocks: appCache.getItem('stocks'),
    portfolio: this.props.portfolio,
    symbol: '',
    displayList: [],
    quantity: '',
    currency: null,
    open_price: null,
    price: null,
    total: null,
    err: '',
  };

  getStockPrice = async () => {
    const { stocks, symbol } = this.state;
    try{
      const initialRes = await iexReqs.getStockPrice(symbol);
      const open_price = stocks[symbol].open_price;
      const currency = stocks[symbol].currency;
      this.setState({price: initialRes.data, displayList: [], open_price, currency})
    }
    catch(err){
      console.log(err);
    }
    this.pingStockPrice = setInterval(async () => {
      try {
        const res = await iexReqs.getStockPrice(symbol);
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
    else this.setState({[name]: e.target.value});
  };

  handleQuantity = (e) => {
    let value = Math.floor(parseInt(e.target.value));
    if(value < 0) return;
    if(isNaN(value)) {
      value = '';
      this.setState({'quantity': value, total: 0});
    }
    else {
      const { price } = this.state;
      const nuTotal =  value * price;
      this.setState({'quantity':value, 'total': nuTotal});
    };
  }

  handleClick = (e) => {
    const symbol = e.target.getAttribute('value');
    const displayList = [];
    this.setState({symbol, displayList});
  };

  handlePurchase = () => 0;

//   handlePurchase = async () => {
//     const { user, quantity , total, symbol } = this.state;
//     if(user.funds < total) {
//       this.setState({'err': 'Insufficient funds'})
//     }
//     else if(quantity === 0) return;
//     else{
//       const funds = user.funds - total;
//       let owned = false;
//       for(item of portfolio){
//         if(item.symbol === symbol) {
//           owned = true;
//           break;
//         };
//       };
//       if(owned){
//         try{
//         await axios.post(`http://arbiter-stocks.herokuapp.com/transactions/?user_id=${user.id}`, {

//         })

//         /*
// const { user_id } = req.query;
//   const { stock_id, quantity, price_per_stock } = req.body;

//         */
//         await axios.put(`http://arbiter-stocks.herokuapp.com/users/?email=${user.email}`, {
//           'funds': funds
//         });
//         }
//         catch(err) {
//           console.log(err)
//         }
//       }
//       else{

//       }
//       clearInterval(this.pingStockPrice);
//     }
//   };

  getUserInformation = async () => {
    const { user } = this.state;
    const res = await axios.get(`http://arbiter-stocks.herokuapp.com/users/?email=${user.email}`);
    user.id = res.data.user.id;
    user.funds = res.data.user.funds;
    this.context.update(user);
  };

  componentDidMount(){
    const user = this.context.user;
    if(user && !user.funds){
      this.getUserInformation();
    };
  };
  
  componentWillUnmount(){
    clearInterval(this.pingStockPrice);
  };

  render(){
    const { user, symbol, displayList, stocks, quantity, currency, open_price, price, total, err } = this.state;
    console.log(stocks['A'])
    let f_open_price, f_price, f_total, f_funds;
    if(user){
      if(currency && price && open_price && total){
        f_total = total ? format.returnFormatted(currency, total) : total;
        f_price = price ? format.returnFormatted(currency, price) : price;
        f_open_price = open_price ? format.returnFormatted(currency, open_price) : open_price;
      };
      if(user.funds){
        let funds = user.funds;
        f_funds = user.funds ? format.returnFormatted('USD', funds) : user.funds;
      };
    };
    const displayError = (err === '' ?
    <div style={{height: '4em'}}></div> 
    : 
    <div className="d-flex justify-content-center mx-n3" style={{height: '4em', marginBottom: 'none'}}>
      <div className="alert alert-danger col-12 text-center" role="alert">
        {err}
      </div>
    </div>);

    return (
    <div className="blackdrop" onClick={this.props.toggle} value={true}>
      <div className="modalBox">
        <form className="px-3 pb-4 col-12">
          {
            !this.state.price ?
            <h1 className="modalHeader col-12 text-center pt-2">Select Stock</h1>
            :
            <h1 className="modalHeader col-12 text-center pt-2">{stocks[symbol].company} Stock</h1>
          }
          {displayError}
          {
            !this.state.price ?
            <>
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
            </>
            :
            <div>
              <h1 className="col-12 text-center">{symbol}</h1>
              <div className="d-flex justify-content-center" style={{width: '100%'}}>
                <div className="col-6 text-center">
                  <label>Available Funds</label>
                  <div className="prices">{f_funds}</div>
                </div>
              </div>
              <div className="d-flex px-0" style={{width: '100%'}}>
                <div className="col-3 text-center">
                  <label>Open Price</label>
                  <div className="prices">{f_open_price}</div>
                </div>
                <div className="col-3 text-center"> 
                  <label>Price</label>
                  <div className="prices">{f_price}</div>
                </div>
                <div className="form-group col-3 text-center">
                  <label>Quantity</label>
                  <input type="number" autoComplete="off" className="form-control inputField text-center" placeholder="0" value={quantity} name="quantity" onChange={this.handleQuantity} />
                </div>
                <div className="text-center col-3">
                  <label>Total</label>
                  <div className="prices">{f_total || '$0'}</div>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end px-0">
                <button type="submit" className="btn btn-primary" onClick={this.handlePurchase}>Purchase</button>
              </div> 
            </div>
          }
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