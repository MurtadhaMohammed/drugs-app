import React from 'react';
import { Button, Icon, Pane, Dialog, TextInputField, TextInput, Autocomplete, Combobox } from 'evergreen-ui'
import PrescriptionContext from '../context/PrescriptionContext';
import uuidv4 from 'uuid/v4'
class Header extends React.Component {
  constructor() {
    super()
    this.state = {
      isShown: false,
      name: '',
      age: '',
      drugsSelect: [],
      isDrug:false,
      drugItem:[]
    }

    fetch('https://api.fda.gov/drug/label.json?count=openfda.brand_name.exact&limit=1000').then((response)=>{
        return response.json()
    }).then((result)=>{
        let drugs = result.results
        let drugItem =[];
        drugs.map((item,i)=>{
          drugItem.push(item.term)
        })
        this.setState({drugItem})
    }).catch((error)=>{
         console.log(error)
    })
  }

  insertDrug(drug) {
    let drugs = this.state.drugsSelect
    drugs.push(drug)
    this.setState({ drugsSelect: drugs })
  }
  removeDrug(i) {
    let drugs = this.state.drugsSelect
    drugs.splice(i, 1)
    this.setState({ drugsSelect: drugs })
  }


  render() {
    let { name, age, drugsSelect, isShown,isDrug,drugItem } = this.state
    return (
      <PrescriptionContext.Consumer>
        {(ctx) => {
          return (
            <React.Fragment>
              <header className="container">
                <img className="logo" src={require('../assets/logo.svg')} />
                <Button className="create-btn" onClick={() => {
                  this.setState({ isShown: true })
                }}><Icon style={{ marginRight: 5 }} icon="add" size={20} /> New Presicription</Button>
              </header>
              <Pane>
                <Dialog
                  className="modal"
                  isShown={isShown}
                  title="New Presicription"
                  onCloseComplete={() => this.setState({ isShown: false })}
                  confirmLabel="Save"
                  onConfirm={
                    () => {
                      if (drugsSelect.length > 0) {
                        ctx.actions.addPrescription({ id: uuidv4(), name: name, age: age, date: Date.now() }, drugsSelect)
                        this.setState({isShown:false})
                      }else{
                         this.setState({isDrug:true})
                      }
                    }

                  }
                >
                  <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
                    <Pane flex={1} display="flex" paddingRight={10}>
                      <TextInputField
                        width="100%"
                        label="Patient Name ."
                        placeholder="Patient Name"
                        onChange={e => this.setState({ name: e.target.value })}
                        value={name}
                      />
                    </Pane>
                    <Pane display="flex">
                      <TextInputField
                        type="number"
                        label="Patient Age ."
                        placeholder="Patient Age"
                        onChange={e => this.setState({ age: e.target.value })}
                        value={age}
                      />
                    </Pane>

                  </Pane>
                  <Pane marginTop={10} padding={16} background="tint2" borderRadius={3} >

                    <Autocomplete

                      title="Fruits"
                      //onChange={(changedItem) => this.insertDrug(changedItem)}
                      items={drugItem}
                    >
                      {(props) => {
                        const { getInputProps, getRef, inputValue } = props
                        return (
                          <TextInputField
                            validationMessage={isDrug ? 'please select any drug':false}
                            disabled={(name == '' || age == '') ? true : false}
                            label="Select Drugs"
                            placeholder="Drugs List"
                            value={inputValue}
                            onKeyUp={(e) => {
                              if (e.key == "Enter") {
                                this.insertDrug({ id: uuidv4(), drugname: e.target.value })
                                props.clearSelection()
                                if(isDrug){
                                  this.setState({isDrug:false})
                                }
                              }
                            }}
                            innerRef={getRef}
                            {...getInputProps()}
                          />

                        )
                      }}
                    </Autocomplete>

                    <Pane display="flex" flexWrap='wrap'>
                      {
                        drugsSelect.map((item, i) => {
                          return <div className='drug-item' key={i}>{item.drugname}<Icon marginLeft={5} icon="cross" size={15} onClick={this.removeDrug.bind(this, i)} /></div>
                        })
                      }
                    </Pane>
                  </Pane>
                </Dialog>
              </Pane>
            </React.Fragment>
          )
        }}
      </PrescriptionContext.Consumer>
    )
  };
}


export default Header