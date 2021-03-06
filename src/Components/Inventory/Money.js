import React, {useState, useEffect} from "react"
import { Card, Row, Button, Col } from "react-bootstrap"
import APIManager from "../Modules/APIManager"


const Money = () => {
    const [money, setMoney] = useState([])
    const [editable, setEditable] = useState(false)


    const handleEvtChange = (event) => {
        const stateToChange = { ...money};
        stateToChange[event.target.id] = parseInt(event.target.value);
        setMoney(stateToChange);
        
    }
     useEffect(() => {
        APIManager.GetAll("moneyBags").then((response) => {
            let check = false
            let money = {}
            money.gp = 0
            money.sp = 0
            money.cp = 0
            money.characterId = parseInt(sessionStorage.characterId)
            response.forEach(bag => {
                
                if(bag.characterId === parseInt(sessionStorage.characterId)){
                    check=true
                }
            })
         
            
            if (check === true){
                APIManager.GetCharactersSpells("moneyBags").then((response) => {
                  
                    setMoney(response[0])
                })
            }else{
                APIManager.Post("moneyBags", money).then(() => {
                    APIManager.GetCharactersSpells("moneyBags").then((response) => {
                        setMoney(response[0])
                    })
                })
            }
        })
     }, [])

     const handleEdit = () => {
        setEditable(true)
    }
    const handleEditSave = () => {
        
        APIManager.Update("moneyBags", money.id, money).then(() => {
            setEditable(false)

        })
    }
    if(editable){

    
    return (
        <Card className="moneyCard">
             <Card.Body className="moneyCardBody">
            <Row className="moneyTitleRow">
           
                <Card.Title className="moneyTitle">Coin Purse</Card.Title>
                <Button className="newSpellBtn" onClick={handleEditSave}>
                    Save Coins
                </Button>
            </Row>
            <Row className="moneyEditRow"> 
            <Col>
    <p className="moneyNumbersLeftEdit">GP: <textarea className="moneyEdit" id="gp"onChange={handleEvtChange}>{money.gp}</textarea></p>
    </Col> 
    <Col>
     <p className="moneyNumbersMiddleEdit">SP: <textarea className="moneyEdit" id="sp" onChange={handleEvtChange}>{money.sp}</textarea></p> 
     </Col>
     <Col>
     <p className="moneyNumbersRightEdit">CP: <textarea className="moneyEdit" id="cp" onChange={handleEvtChange}>{money.cp}</textarea></p>
     </Col>  
            </Row>
            </Card.Body>
        </Card>
    )
    }else {
        return(
            <Card className="moneyCard">
              <Card.Body className="moneyCardBody">
            <Row className="moneyTitleRow">
                <Card.Title className="moneyTitle">Coin Purse</Card.Title>
            </Row>
            <Row className="moneyEditRow"> 
            <Col>
        <p className="moneyNumbersLeft">GP: <a className="money" onClick={handleEdit} >{money.gp}</a></p>
        </Col>
        <Col>
         <p className="moneyNumbersMiddle">SP: <a className="money" onClick={handleEdit}>{money.sp}</a></p>
         </Col>
         <Col>
          <p className="moneyNumbersRight" >CP: <a className="money" onClick={handleEdit}>{money.cp}</a></p>
          </Col>
            </Row>
            </Card.Body>
        </Card>
        )
    }
}

export default Money