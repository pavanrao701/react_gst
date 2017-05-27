import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/js/button.js';
import React from 'react';
import ReactDOM from 'react-dom';

var currencyFormatter = new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' });

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
        this.props.onPriceExcludingGSTChange(event.target.value, this.props.index);
    }

    handlePriceIncludingGSTChange(event) {
        this.props.onPriceIncludingGSTChange(event.target.value, this.props.index);
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
                    <input type="number" className="form-control" placeholder="excluding gst" name="priceExcludingGST" value={this.props.lineItem.priceExcludingGST}
                        onChange={this.handlePriceExcludingGSTChange}/>
                </div>
                <div className="form-group col-md-2 col-sm-2">
                    <label htmlFor="gst" className="sr-only">GST</label>
                    <p className="form-control-static">{currencyFormatter.format(this.props.lineItem.GST)}</p>
                </div>
                <div className="form-group col-md-3 col-sm-4">
                    <label htmlFor="priceWithGST" className="sr-only">Price including GST</label>
                    <input type="number" className="form-control" placeholder="including gst" name="priceIncludingGST" value={this.props.lineItem.priceIncludingGST}
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
    constructor(props){
        super(props);
        this.state = {
            lineItems: [
                {
                    priceExcludingGST: 0.0,
                    GST: 0.0,
                    priceIncludingGST: 0.0
                }
            ]
        };
        this.handlePriceExcludingGSTChange = this.handlePriceExcludingGSTChange.bind(this);
        this.handlePriceIncludingGSTChange = this.handlePriceIncludingGSTChange.bind(this);
        this.handleAddLineItem = this.handleAddLineItem.bind(this);
        this.handleRemoveLineItem = this.handleRemoveLineItem.bind(this);
    }

    handlePriceExcludingGSTChange(value, index) {
        var newLineItems = this.state.lineItems.slice(0);
        newLineItems[index].priceExcludingGST = parseFloat(value);
        newLineItems[index].GST = parseFloat(value) * 0.15;
        newLineItems[index].priceIncludingGST = parseFloat(value) * 1.15;
        this.setState({
            lineItems: newLineItems
        });
    }

    handlePriceIncludingGSTChange(value, index) {
        var newLineItems = this.state.lineItems.slice(0);
        newLineItems[index].priceExcludingGST = parseFloat(value) / 1.15;
        newLineItems[index].GST = (parseFloat(value) / 1.15) * 0.15;
        newLineItems[index].priceIncludingGST = parseFloat(value);
        this.setState({
            lineItems: newLineItems
        });
    }

    handleAddLineItem(index) {
        var lineItem = {
            priceExcludingGST: 0,
            GST: 0,
            priceIncludingGST: 0
        };
        var newLineItems = this.state.lineItems.slice(0);
        newLineItems.splice(index + 1, 0, lineItem);
        this.setState({
            lineItems: newLineItems
        });
    }

    handleRemoveLineItem(index) {
        var newLineItems = this.state.lineItems.slice(0);
        newLineItems.splice(index, 1);
        this.setState({
            lineItems: newLineItems
        });
    }

    totalExcludingGST() {
            var total = 0.0;
            for(var i = 0; i < this.state.lineItems.length; i++){
                total = total + this.state.lineItems[i].priceExcludingGST;
            }
            return total;
        };
    totalGST(){
            var total = 0.0;
            for(var i = 0; i < this.state.lineItems.length; i++){
                total = total + this.state.lineItems[i].GST;
            }
            return total;
        };
    totalIncludingGST( ){
            var total = 0.0;
            for(var i = 0; i < this.state.lineItems.length; i++){
                total = total + this.state.lineItems[i].priceIncludingGST;
            }
            return total;
        };
    render() {
        const lineItems = this.state.lineItems.map(
            (lineItem, index) =>
                <GstCalculatorLineItem key={index} index={index} lineItem={lineItem}
                     onPriceExcludingGSTChange={this.handlePriceExcludingGSTChange}
                     onPriceIncludingGSTChange={this.handlePriceIncludingGSTChange}
                     onAddLineItem={this.handleAddLineItem}
                     onRemoveLineItem={this.handleRemoveLineItem}
                     disableRemoveButton={this.state.lineItems.length <= 1} />
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

$(document).ready(function(){

    ReactDOM.render(
        <GstCalculator />,
        document.getElementById('gstCalculator')
        );

    });
