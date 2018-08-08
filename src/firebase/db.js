import { db } from './firebase';

const COLLECTIONS = {
    businesses: 'businesses',
}

export const addBusiness = (name,category,city,price,description) =>
    db.collection(COLLECTIONS.businesses).add({
        name: name,
        category: category,
        city: city,
        description: description,
        reccommend: 0,
        visitor: 0,
        price: price,
        ID: "",
    });

export const getBusinesses = () =>
    db.collection(COLLECTIONS.businesses);

export const deleteBusiness = (id) => {
        if (id) {
            db.collection(COLLECTIONS.businesses).doc(id).delete()
                .then(()=>{
                    console.log(`Business ID: ${id} has been delete from Database`);
                    return id
                })
                .catch(()=>alert("Error Occor, Try Again!"));
        }
    }
