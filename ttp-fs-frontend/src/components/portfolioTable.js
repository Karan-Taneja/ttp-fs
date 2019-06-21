import React from 'react';
import './table.css';

// ---- Scripts
import format from '../scripts/format'

export default (props) =>  { 
  const { portfolio } = props;
  return (<>
    {
      portfolio.length > 0 ? (
      <>
      <div className="portfolio-table table d-flex flex-wrap justify-content-center col-12">
        <div className="row col-12 justify-content-center flex-nowrap">
          <div className="name-column number col-1 text-left align-middle py-2">#</div>
          <div className="name-column symbol col-2 text-left align-middle py-2">Symbol</div>
          <div className="name-column company col-3 text-left align-middle py-2">Company</div>
          <div className="name-column amount col-3 text-left align-middle py-2">Quantity</div>
          <div className="name-column value col-3 text-left align-middle py-2">Value</div>
        </div>
        { 
          portfolio.map((e, i) => {
          const value = format.returnFormatted(e.currency, (e.quantity * e.open_price));
          const bg = i+1 % 2 === 0 ? 'even' : 'odd'
          return (
          <div className='stock-row row col-12 justify-content-center flex-nowrap' key={i}>
            <div className={`${bg} stock-column number col-1 text-left align-middle py-2`}>{i+1}</div>
            <div className={`${bg} stock-column symbol col-2 text-left align-middle py-2`}>{e.symbol}</div>
            <div className={`${bg} stock-column company col-3 text-left align-middle py-2`}>{e.company}</div>
            <div className={`${bg} stock-column quantity col-3 text-left align-middle py-2`}>{e.quantity}</div>
            <div className={`${bg} stock-column value col-3 text-left align-middle py-2`}>{value}</div>
          </div>
          )
        }) }
      </div>
      </>
      )
      :
      <div className="row col-10">You have no stocks</div>
    }
  </>)
};