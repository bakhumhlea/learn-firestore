import React, { Component } from 'react';
import { db } from '../firebase';
import BusinessesList from './TodosList';

const BusinessPage = () => 
    <div className="container">
        <div className="row">
            <div className="col">
                <h1>Lokals Business Form</h1>
                <BusinessForm/>
            </div>
            <div  className="col">
                <h1>Businesses List</h1>
                <BusinessesList/>
            </div>
        </div>
    </div>


const INITIAL_STATE = {
    name: '',
    category: '',
    city: '',
    description: '',
    reccommend: 0,
    visitor: 0,
    price: 2,
    error: null,
};
const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const updateID = (id) => {
    db.getBusinesses().doc(id)
                .update({ID:id})
                .then(()=>console.log("Added ID"))
                .catch(error=>console.log(error));
}

class BusinessForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const {
            name,
            category,
            city,
            description,
            price,
        } = this.state;

        db.addBusiness(name,category,city,price,description).then((doc)=>{
            console.log(doc);
            updateID(doc.id);
            this.setState({
                ...INITIAL_STATE
            });
            console.log(this.state.message);
        }).catch((error) => {
            this.setState(byPropKey('error',error));
            alert(error);
        });

        event.preventDefault();
    }

    render() {
        const {
            name,
            category,
            city,
            description,
            price,
        } = this.state;

        const priceRange = (input) => {
            switch(input) {
                case '1' : {
                    return '$';
                }
                case '2' : {
                    return '$$';
                }
                case '3' : {
                    return '$$$';
                }
                default : return '$$';
            }
        }
        const isInvalid = 
            name === '' || 
            category === '' ||
            city === '';

        return (
            <div>
            <form onSubmit={this.onSubmit} id="business-form">
                <div className="form-group">
                    <input
                        className="form-control"
                        value={name}
                        onChange={event => this.setState(byPropKey('name', event.target.value))}
                        type="text"
                        placeholder="Business name"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control"
                        value={category}
                        onChange={event => this.setState(byPropKey('category', event.target.value))}
                        type="text"
                        placeholder="Business catagory"
                    />
                </div>
                <div className="input-group mb-3">
                    <input
                        className="form-control"
                        value={city}
                        onChange={event => this.setState(byPropKey('city', event.target.value))}
                        type="text"
                        placeholder="City"
                    />
                    <div className="input-group-append">
                        <button 
                            type="button"
                            className="btn btn-dark dropdown-toggle"
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false"
                        >
                            Price Range: {priceRange(price)} 
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <button type="button" className="dropdown-item" value="1"
                                onClick={event => this.setState(byPropKey('price', event.target.value))}>Low</button>
                            <button type="button" className="dropdown-item" value="2"
                                onClick={event => this.setState(byPropKey('price', event.target.value))}>Moderate</button>
                            <button type="button" className="dropdown-item" value="3"
                                onClick={event => this.setState(byPropKey('price', event.target.value))}>High</button>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={event => this.setState(byPropKey('description',event.target.value))}
                        type="text"
                        placeholder="Tell us about your business"
                    />
                </div>
                <div className="form-group">
                    <button 
                        className="btn btn-success"
                        disabled={isInvalid}
                        type="submit"
                    >
                    Add Your Business
                    </button>
                </div>
            </form>
            </div>
        );
    }
}
    

export default BusinessPage;