import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

// ---- Components
import PortfolioTable from '../components/portfolioTable';
import Loading from '../components/loading';
import PurchaseModal from '../components/purchaseModal';

// ---- Contexts
import AuthContext from '../contexts/auth';

// ---- Assets
import AddButton from '../assets/add_button.svg';

// ---- Scripts
import appCache from '../scripts/cache';
import iexReqs from '../scripts/iex';
import myEnv from '../scripts/vars';

// ---- CSS
import './portfolio.css';

export default class Portfolio extends React.Component {
  
  static contextType = AuthContext;
  
  state = { 
    user: this.context.user,
    portfolio: appCache.getItem('portfolio') || [],
    displayModal: false,
    loading: true,
    selling: false,
  };

  componentDidMount() {
    const { user, portfolio } = this.state;
    if(user !== null){
      if(!portfolio.length || 
         Date.now() - portfolio.updated * 1 > 60000 ||
         !portfolio.update){
        this.getUserPortfolio(user.id);
      };
    }
    else{
      this.setState({loading: false});
    };
  };

  toggleModal = (e) => {
    if(e.target.getAttribute('value') !== 'true') return;
    const { displayModal } = this.state
    this.setState({displayModal: !displayModal});
  };

  getUserPortfolio = async (user_id) => {
    try {
      const res = await axios.get(`${myEnv.BASE_URL}/portfolios/?user_id=${user_id}`)
      const { portfolio } = res.data;
      if(portfolio.length > 0){
        for(let item of portfolio){
          const nextRes = await axios.get(`${myEnv.BASE_URL}/stocks/id/${item.stock_id}`)
          let { stock } = nextRes.data;
          const price = await iexReqs.getStockPrice(stock.symbol);
          item.symbol = stock.symbol;
          item.company = stock.company;
          item.currency = stock.currency;
          item.open_price = stock.open_price;
          item.price = price.data;
        };
        portfolio.updated = Date.now();
        appCache.setItem('portfolio', portfolio);
        this.setState({ portfolio: portfolio, loading: false });
      }
      else this.setState({ portfolio: [], loading: false});
    }
    catch (err) {
      console.log('err', err);
    };
  };

  updatePortfolio = () => {
    this.setState({loading: true});
    const user_id = this.state.user.id;
    this.getUserPortfolio(user_id);
  };

  render() {
    const { portfolio, displayModal, loading } = this.state;
    return (
      <AuthContext.Consumer>
        {
          context => {
            if(context.user){
              if(loading) return (
              <>
                {
                  displayModal ? <PurchaseModal toggle={this.toggleModal} updatePortfolio={this.updatePortfolio} portfolio={portfolio}/> : <></>
                }
                <Loading />
              </>
              )
              else return (<>
                {
                  displayModal ? <PurchaseModal toggle={this.toggleModal} updatePortfolio={this.updatePortfolio} portfolio={portfolio}/> : <></>
                }
                <div className="portfolio position-relative">
                  <PortfolioTable portfolio={portfolio} />
                  <div value={true} className="btn buy ripple position-absolute pos-bottom-right" data-toggle="tooltip" data-placement="top" title="Buy Stocks" onClick={this.toggleModal}>
                    <img value={true} className="buy" src={AddButton} alt="Buy Stocks" style={{color: 'blue', width:'5rem','height':'auto'}}/>
                  </div>
                </div>)
              </>)
            }
            else{
              return <Redirect to="/login" />
            };
          }
        }
      </AuthContext.Consumer>  
    );
  };
};