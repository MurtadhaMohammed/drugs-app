import React from 'react';
import PrescriptionContext from '../context/PrescriptionContext';
import firebase from 'firebase'


class PrescriptionProvider extends React.Component {
    constructor() {
        super()
        this.state = {
            prescription: [],
            pres: []
        }

        this.firebaseConfig()
        this.getPriscriptions()

    }

    getPriscriptions() {
        firebase.firestore().collection('patients').orderBy('date', 'desc').onSnapshot((snapshot) => {
            let prescription = []

            snapshot.forEach((doc) => {
                prescription.push({ id: doc.id, data: doc.data() })
                this.setState({
                    prescription
                })
            })
        })
    }

    firebaseConfig() {
        var config = {
            apiKey: "AIzaSyDGHQI5EACZa4cPCGjdLLhHEmyhBRks7qw",
            authDomain: "fikra-drugs.firebaseapp.com",
            databaseURL: "https://fikra-drugs.firebaseio.com",
            projectId: "fikra-drugs",
            storageBucket: "",
            messagingSenderId: "217157335125"
        };
        firebase.initializeApp(config);
        const settings = { timestampsInSnapshots: true };
        firebase.firestore().settings(settings);
    }
    render() {
        return (
            <PrescriptionContext.Provider value={{
                state: this.state, actions: {
                    addPrescription: (patient, drugs) => {
                        firebase.firestore().collection('patients').add(patient)
                            .then(function () {
                                drugs.map((item, i) => {
                                    item.patient_id = '/patients/' + patient.id
                                    firebase.firestore().collection('precriptions').add(item)
                                })
                            })

                    },
                    deleteItem: (item) => {

                        firebase.firestore().collection("patients").doc(item.id).delete().then(function () {
                            firebase.firestore().collection("precriptions").where("patient_id", "==", "/patients/" + item.data.id).get().then(function (doc) {
                                doc.forEach((doc) => {
                                    firebase.firestore().collection("precriptions").doc(doc.id).delete()
                                })
                            })
                        }).catch(function (error) {
                            console.error("Error removing document: ", error);
                        });
                    },
                    getPriscription: (item,callback) => {
                        firebase.firestore().collection("precriptions").where("patient_id", "==", "/patients/" + item.data.id).get().then(function (doc) {
                            let pres = []
                            doc.forEach((doc) => {
                                pres.push(doc.data())
                            })
                            callback(pres)
                        })
                    }
                }
            }}>
                {this.props.children}
            </PrescriptionContext.Provider>
        )
    };
}

export default PrescriptionProvider