import React from 'react';
import AuthContext from '../contexts/auth';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

// ---- Components
import PortfolioTable from '../components/portfolioTable';
import Loading from '../components/loading';
import StockModal from '../components/stockModal';

// ---- Assets
import AddButton from '../assets/add_button.svg';

// ---- Scripts
import appCache from '../scripts/cache';

// ---- CSS
import './portfolio.css';

export default class Portfolio extends React.Component {
  
  static contextType = AuthContext;
  
  state = { 
    user: this.context,
    portfolio: [],
    displayModal: false,
    loading: true,
  };

  componentDidMount() {
    const user = this.state.user;
    if(user !== null){
      this.getUserPortfolio(user.id);
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
      const res = await axios.get(`http://arbiter-stocks.herokuapp.com/portfolios/?user_id=${user_id}`)
      const { portfolio } = res.data;
      if(portfolio.length > 0){
        for(let i = 0; i < portfolio.length; i++){
          const nextRes = await axios.get(`http://arbiter-stocks.herokuapp.com/stocks/id/${portfolio[i].stock_id}`)
          let { stock } = nextRes.data;
          portfolio[i].symbol = stock.symbol;
          portfolio[i].company = stock.company;
          portfolio[i].currency = stock.currency;
          portfolio[i].open_price = stock.open_price;
        }
        this.setState({ portfolio: portfolio, loading: false });
      };
    }
    catch (err) {
      console.log('err', err);
    };
  };

  render() {
    const { user, portfolio, displayModal, loading } = this.state;
    return (
      <AuthContext.Consumer>
        {
          user => {
            if(user){
              if(loading) return <Loading />
              else return (<>
                {
                  displayModal ? <StockModal toggle={this.toggleModal}/> : <></>
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