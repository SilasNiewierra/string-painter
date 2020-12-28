import { Component } from "react";
import './Painter.scss';

class Painter extends Component{

    render(){
        return(
            <div className="painter-wrapper">
                <div className="painter"></div>
                <div className="info"></div>
            </div>
        );
    }

}

export default Painter;