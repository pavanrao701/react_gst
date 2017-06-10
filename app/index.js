import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/js/button.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Map, List, fromJS } from 'immutable';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux'

var currencyFormatter = new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' });
const GST = 0.15;

//Actions

const setPriceExcludingGST = (value, index) => {
    return {
        type: 'SET_PRICE_EXCLUDING_GST',
        value,
        index
    }
}


const setPriceIncludingGST = (value, index) => {
    return {
        type: 'SET_PRICE_INCLUDING_GST',
        value,
        index
    }
}

const addLineItem = (index) => {
    return {
        type: 'ADD_LINE_ITEM',
        index
    }
}

const removeLineItem = (index) => {
    return {
        type: 'REMOVE_LINE_ITEM',
        index
    }
}

//Initial state

const initialState = {
    data: Map({
        lineItems: List([
            Map({
                priceExcludingGST: 0.0,
                GST: 0.0,
                priceIncludingGST: 0.0
            })
        ])
    })
}

//Reducers

const prices = (state = initialState, action) => {
    
    switch (action.type) {
        case 'SET_PRICE_EXCLUDING_GST':
            return {
                data: state.data
                    .setIn(['lineItems', action.index, 'priceExcludingGST'], parseFloat(action.value))
                    .setIn(['lineItems', action.index, 'GST'], parseFloat(action.value) * GST)
                    .setIn(['lineItems', action.index, 'priceIncludingGST'], parseFloat(action.value) * (1 + GST))
            };
        case 'SET_PRICE_INCLUDING_GST':
            return {
                data: state.data
                    .setIn(['lineItems', action.index, 'priceExcludingGST'], parseFloat(action.value) / (1 + GST))
                    .setIn(['lineItems', action.index, 'GST'], (parseFloat(action.value) / (1 + GST)) * GST)
                    .setIn(['lineItems', action.index, 'priceIncludingGST'], parseFloat(action.value))

            }
        case 'ADD_LINE_ITEM':
            return {
                data: state.data.update(
                    'lineItems',
                    (lineItems) => lineItems.insert(
                        action.index + 1,
                        Map({
                            priceExcludingGST: 0,
                            GST: 0,
                            priceIncludingGST: 0
                        })
                    )
                )
            };
        case 'REMOVE_LINE_ITEM':
            return {
                data: state.data.update(
                    'lineItems',
                    (lineItems) => lineItems.delete(action.index)
                )
            };
        default:
            return state;
    }
}

const appReducer = combineReducers({
    prices
})

//Store

let store = createStore(appReducer);

class GstCalculatorHeader extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="form-group col-md-3 col-sm-4">
                    <label className="sr-only">Price excluding GST</label>
                    <p className="form-control-static">Price excl. GST</p>
                </div>
                <div className="form-group col-md-2 col-sm-2">
                    <label className="sr-only">GST</label>
                    <p className="form-control-static">GST</p>
                </div>
                <div className="form-group col-md-3 col-sm-3">
                    <label className="sr-only">Price including GST</label>
                    <p className="form-control-static">Price incl. GST</p>
                </div>
            </div>
        );
    }
}

class GstCalculatorLineItem extends React.Component {

    constructor(props) {
        super(props);
        this.handlePriceExcludingGSTChange = this.handlePriceExcludingGSTChange.bind(this);
        this.handlePriceIncludingGSTChange = this.handlePriceIncludingGSTChange.bind(this);
        this.handleAddLineItem = this.handleAddLineItem.bind(this);
        this.handleRemoveLineItem = this.handleRemoveLineItem.bind(this);
    }

    handlePriceExcludingGSTChange(event) {
        this.props.onSetPriceExcludingGST(event.target.value, this.props.index);
    }

    handlePriceIncludingGSTChange(event) {
        this.props.onSetPriceIncludingGST(event.target.value, this.props.index);
    }

    handleAddLineItem(event) {
        this.props.onAddLineItem(this.props.index);
    }

    handleRemoveLineItem(event) {
        this.props.onRemoveLineItem(this.props.index);
    }

    render() {
        return (
            <div className="row">
                <div className="form-group col-md-3 col-sm-4">
                    <label htmlFor="priceWithoutGST" className="sr-only">Price excluding GST</label>
                    <input type="number" className="form-control" placeholder="excluding gst" name="priceExcludingGST" value={this.props.lineItem.get('priceExcludingGST')}
                        onChange={this.handlePriceExcludingGSTChange}/>
                </div>
                <div className="form-group col-md-2 col-sm-2">
                    <label htmlFor="gst" className="sr-only">GST</label>
                    <p className="form-control-static">{currencyFormatter.format(this.props.lineItem.get('GST'))}</p>
                </div>
                <div className="form-group col-md-3 col-sm-4">
                    <label htmlFor="priceWithGST" className="sr-only">Price including GST</label>
                    <input type="number" className="form-control" placeholder="including gst" name="priceIncludingGST" value={this.props.lineItem.get('priceIncludingGST')}
                        onChange={this.handlePriceIncludingGSTChange}/>
                </div>
                <div className="col-md-3 col-sm-2">
                    <button type="button" className="form-control btn btn-default" onClick={this.handleRemoveLineItem} disabled={this.props.disableRemoveButton}>
                        <span className="glyphicon glyphicon-minus"></span>
                    </button>
                    <button type="button" className="form-control btn btn-default" onClick={this.handleAddLineItem}>
                        <span className="glyphicon glyphicon-plus"></span>
                    </button>
                </div>
            </div>
        );
    }
}

class GstCalculatorFooter extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="row">
                <div className="form-group col-md-3 col-sm-4">
                    <label className="sr-only">Total excluding GST</label>
                    <p className="form-control-static">{currencyFormatter.format(this.props.totalExcludingGST)}</p>
                </div>
                <div className="form-group col-md-2 col-sm-2">
                    <label className="sr-only">GST</label>
                    <p className="form-control-static">{currencyFormatter.format(this.props.totalGST)}</p>
                </div>
                <div className="form-group col-md-3 col-sm-4">
                    <label className="sr-only">Total including GST</label>
                    <p className="form-control-static">{currencyFormatter.format(this.props.totalIncludingGST)}</p>
                </div>
            </div>
        );
    }
}

class GstCalculator extends React.Component {
    constructor(props) {
        super(props);
    }

    totalExcludingGST() {
            var total = 0.0;
            for(var i = 0; i < this.props.lineItems.size; i++){
                total = total + this.props.lineItems.getIn([i, 'priceExcludingGST']);
            }
            return total;
        };
    totalGST() {
            var total = 0.0;
            for(var i = 0; i < this.props.lineItems.size; i++){
                total = total + this.props.lineItems.getIn([i, 'GST']);
            }
            return total;
        };
    totalIncludingGST() {
            var total = 0.0;
            for(var i = 0; i < this.props.lineItems.size; i++){
                total = total + this.props.lineItems.getIn([i, 'priceIncludingGST']);
            }
            return total;
        };
    render() {
        const lineItems = this.props.lineItems.map(
            (lineItem, index) =>
                <GstCalculatorLineItem key={index} index={index} lineItem={lineItem}
                     onSetPriceExcludingGST={this.props.onSetPriceExcludingGST}
                     onSetPriceIncludingGST={this.props.onSetPriceIncludingGST}
                     onAddLineItem={this.props.onAddLineItem}
                     onRemoveLineItem={this.props.onRemoveLineItem}
                     disableRemoveButton={this.props.lineItems.size <= 1} />
            );
        return (
            <div className="col-md-12 form-inline">
                <GstCalculatorHeader />
                {lineItems}
                <GstCalculatorFooter totalExcludingGST={this.totalExcludingGST()} totalGST={this.totalGST()} totalIncludingGST={this.totalIncludingGST()}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lineItems: state.prices.data.get('lineItems')
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSetPriceExcludingGST: (price, index) => {
            dispatch(setPriceExcludingGST(price, index));
        },
        onSetPriceIncludingGST: (price, index) => {
            dispatch(setPriceIncludingGST(price, index));
        },
        onAddLineItem: (index) => {
            dispatch(addLineItem(index));
        },
        onRemoveLineItem: (index) => {
            dispatch(removeLineItem(index));
        }
    }
}

const GstCalculatorContainer = connect(mapStateToProps, mapDispatchToProps)(GstCalculator);

$(document).ready(function(){

    ReactDOM.render(
        <Provider store={store}>
            <GstCalculatorContainer />
        </Provider>,
        document.getElementById('gstCalculator')
        );
    });
