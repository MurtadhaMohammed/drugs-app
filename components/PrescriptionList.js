import React from 'react';
import PrescriptionContext from '../context/PrescriptionContext';
import { Button, Icon, Dialog, Pane } from 'evergreen-ui'
import print from 'print-js'

class PrescriptionList extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <PrescriptionContext.Consumer>
        {(ctx) => {
          return (
            <main className="container">
              <p>Prescriptions List</p>

             
              {
                ctx.state.prescription.map((item, i) => {
                  return (
                    <div key={i} className="pres-item">
                      <p># {item.data.name}</p>
                      <div>
                        <Button className="print-btn" onClick={() => {
                          ctx.actions.getPriscription(item,function(data){
                             //console.log(data)
                             let info = []
                             data.map((drug,i)=>{
                               let drugname = drug.drugname
                                 info.push({'#':i,'Drug Name':drugname})
                             })
                             print({
                                printable: info,
                                properties: ['#','Drug Name'],
                                 type: 'json',
                                 gridHeaderStyle: 'border: 1px solid #eee;padding:10px',
                                 gridStyle: 'border: 1px solid #eee;padding:10px',
                                 header:`<p>${item.data.name}</p>`
                                })
                          })
                      
                        }}><Icon icon="print" size={15} /></Button>
                        <Button className="remove-btn" onClick={() =>
                          ctx.actions.deleteItem(item)
                        } ><Icon icon="trash" size={15} /></Button>
                      </div>
                    </div>
                  )
                })
              }

            </main>
          )

        }}
      </PrescriptionContext.Consumer>
    )
  };
}

export default PrescriptionList