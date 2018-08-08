import React, { Component } from 'react';
import { db } from '../firebase';


class BusinessesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businesses : [],
            businessToDelete: null,
            currentlyEditing: null,
            log: [],
        }
    }
    componentDidMount() {
        
        db.getBusinesses().get().then((doc) => {
            doc.forEach((business)=> {
                this.setState({ businesses:  this.state.businesses.concat(business.data()) })
                console.log(this.state.businesses);
            });
        });
        db.getBusinesses().orderBy('name','desc').onSnapshot((snapshot) => {
            var {businesses} = this.state;
            snapshot.docChanges().forEach(change => {
                if (change.type === 'modified') {
                    //console.log(this.state.businesses);
                    this.setState({ 
                        businesses: businesses.concat(change.doc.data())
                    });
                }
                if (change.type === 'removed') {
                    for (var i = 0; i < businesses.length; i++) {
                        if (change.doc.data().ID === businesses[i].ID) {
                            businesses.splice(i,1);
                        }
                    }
                    this.setState({businesses: businesses});
                    console.log('removed '+change.doc.data().ID);
                }
            });
            
        });
    }
    
    logged(e) {
        e.preventDefault();
        console.log(this.state.businesses);
        var a_ID = [];
        this.state.businesses.forEach((b)=>{a_ID.push(b.ID)});
        this.setState({log: a_ID});
    }
    refresh(e) {
        e.preventDefault();
        this.setState({businesses: []});
        
        db.getBusinesses().orderBy('name','asc').get().then((doc) => {
            
            doc.forEach((business)=> {
                
                this.setState({ businesses:  this.state.businesses.concat(business.data()) });
                
                //console.log(this.state.businesses);
            });
        });
        
        /**db.getBusinesses().orderBy('price','desc').onSnapshot((snapshot) => {
            var {businesses} = this.state;
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    this.setState({ 
                        businesses: businesses.concat(change.doc.data())
                    });
                }
                if (change.type === 'removed') {
                    this.setState({
                        businesses: businesses.splice(businesses
                            .forEach((b,i)=> {
                                if (b.name === change.doc.data().name) {return console.log(b[i])}
                            }),1)
                    });
                }
            });
            
        });*/
    }

    businessToEdit(e,i) {
        e.preventDefault();
        this.setState({
            currentlyEditing: i
        });
    }

    businessToDelete(e,b) {
        e.preventDefault();
        this.setState({
            businessToDelete: {
                id: b.ID,
                name: b.name,
            }
        });
    }

    deleteBusiness(e) {
        e.preventDefault();
        db.deleteBusiness(this.state.businessToDelete.id);
        //console.log(`${id} has been removed from this.state.businesses at index ${i}!`);
        //let arr = this.state.businesses;
        //arr.splice(i,1);
        //this.setState({businesses: arr});
    }
    
    render() {
        const { businesses } = this.state;
        const editMode = this.state.currentlyEditing;
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
        return (
            <div className="container">
                <div className="modal fade" id="confirmDelete" tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                { this.state.businessToDelete?
                                `Are you sure? you want to delete ${this.state.businessToDelete.name} from our database...`
                                :
                                'No pending business to be delete'
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">I change my mind</button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    data-dismiss="modal"
                                    onClick={event=>this.deleteBusiness( event )}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="btn-group" role="group" aria-label="Basic example" style={{width: '100%'}}>
                        <button 
                            className="btn btn-dark"
                            type="button" 
                            onClick={e=>this.logged(e)}
                            style={{width: '50%'}}
                        >
                            ID Log
                        </button>
                        <button 
                            className="btn btn-warning" 
                            type="button" 
                            onClick={e => this.refresh(e)}
                            style={{width: '50%'}}
                        >
                            {businesses.length===0?"Lists Businesses":"Refresh"}
                        </button>
                    </div>
                    <p className="card-text" style={{textAlign: "center",width: '100%',margin: '10px 0 10px 0'}}>Total Businesses: {this.state.businesses.length}</p>
                    <div className="card-text" style={{textAlign: "center",width: '100%',margin: '10px 0 10px 0'}}>{
                        this.state.log.map((id,i)=>
                        <p key={i}>{id}</p>
                        )
                    }</div>
                </div>
                <div className="row">
                    {businesses.map((business,index) => { 
                        return editMode!==index?
                        <div className="card" style={{width: '100%', marginBottom: '10px'}} key={index}>
                            <div className="card-body">
                                <h5 className="card-title">{business.name}
                                    <button 
                                        className="btn btn-light"
                                        type="button"
                                        onClick={e=> this.businessToEdit(e,index)}>
                                        Edit
                                    </button>
                                </h5>
                                <p className="card-text">{business.description}</p>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">City: {business.city}</li>
                                <li className="list-group-item">Category: {business.category}</li>
                                <li className="list-group-item">Price Range: {priceRange(business.price)}</li>
                            </ul>
                            
                            <div className="card-body">
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    data-toggle="modal"
                                    data-target="#confirmDelete"
                                    onClick={event=> this.businessToDelete(event, business)}
                                >
                                Remove
                                </button>
                            </div>
                        </div>
                        :
                        <div className="card" style={{width: '100%', marginBottom: '10px'}} key={index}>
                            <form>
                            <div className="card-body">
                                <input className="card-title" style={{border: 'none',width: '100%'}}
                                    value={business.name}
                                />
                                <textarea className="card-text" style={{border: 'none'}}
                                    value={business.description}
                                />
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">City: <input type="text" value={business.city} style={{border: 'none'}}/></li>
                                <li className="list-group-item">Category: <input type="text" value={business.category} style={{border: 'none'}}/></li>
                                <li className="list-group-item">Price Range: <input type="number" min="1" max="3" value={business.price} style={{border: 'none'}}/></li>
                            </ul>
                            
                            <div className="card-body">
                                <button 
                                    className="btn btn-light"
                                    type="button"
                                    onClick={e=> this.businessToEdit(e,null)}>
                                    Close
                                </button>
                                <button 
                                    className="btn btn-success"
                                    type="submit">
                                    Save
                                </button>
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    data-toggle="modal"
                                    data-target="#confirmDelete"
                                    onClick={event=> this.businessToDelete(event, business)}
                                >
                                Remove
                                </button>
                            </div>
                            </form>
                        </div>
                    })}
                </div>
            </div>
        );
    }

}

export default BusinessesList;