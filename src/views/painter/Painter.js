import { Component } from "react";
import './Painter.scss';

class Painter extends Component {

    constructor(props) {
        super(props);
        this.drawCircle = this.drawCircle.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.updateNextPoint = this.updateNextPoint.bind(this);
        this.printList = this.printList.bind(this);
        this.state = { stepSize: 90, nextPoint: 10, startPoint: 1 };
        this.pointCoordinates = {};
        this.drawingHistory = [];
    }

    updateInputValue(evt) {
        this.setState({
            stepSize: evt.target.value
        });

    }

    updateNextPoint(evt) {
        this.setState({
            nextPoint: evt.target.value
        });

    }

    drawCircle(steps) {
        this.pointCoordinates = {};
        var degree = 360 / steps;
        var radian = degree * Math.PI / 180;
        var size = 700;
        var stepRadius = 6;
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext("2d");

        canvas.width = canvas.height = size;


        var step = radian;
        var h = size / 2;
        var k = size / 2;
        var r = size / 2 - stepRadius * 3;
        ctx.strokeStyle = "rgb(0,0,0)";

        ctx.beginPath();
        var index = 1;
        for (var theta = 0; theta < 2 * Math.PI; theta += step) {
            let x = Math.floor(h + r * Math.cos(theta));
            let y = Math.floor(k - r * Math.sin(theta));
            this.pointCoordinates[index] = ([x, y]);
            ctx.fillRect(x, y, stepRadius, stepRadius);
            ctx.font = "10px Arial";
            ctx.fillText(index, x, y - stepRadius);
            index += 1;

        }
        ctx.closePath();
    }

    drawLine(end) {
        var stepRadius = 6;
        var canvas = document.getElementById('canvas');

        var context = canvas.getContext('2d');
        context.strokeStyle = "rgb(0,0,0)";
        context.beginPath();

        var x = this.pointCoordinates[this.state.startPoint][0] + stepRadius / 2;
        var y = this.pointCoordinates[this.state.startPoint][1] + stepRadius / 2;
        context.moveTo(x, y);

        if (this.state.startPoint !== end) {
            var new_x = this.pointCoordinates[end][0] + stepRadius / 2;
            var new_y = this.pointCoordinates[end][1] + stepRadius / 2;
            context.lineTo(new_x, new_y);
            context.stroke();

            this.drawingHistory.push(end);

            this.setState({
                startPoint: end
            });
        } else {
            alert("the start and end point must be different");
        }

    }

    printList() {
        console.log(this.drawingHistory);
    }

    render() {
        return (
            <div className="painter-wrapper">
                <div className="painter">

                    <canvas id="canvas"></canvas>

                </div>
                <div className="info">
                    
                    <input value={this.state.stepSize} onChange={this.updateInputValue} />
                    <button className="config-button" onClick={() => this.drawCircle(this.state.stepSize)}>Draw The Circle</button>

                    <input value={this.state.nextPoint} onChange={this.updateNextPoint} />
                    <button className="config-button" onClick={() => this.drawLine(this.state.nextPoint)} >Draw A Line</button>


                    <button className="config-button" onClick={() => this.printList()} >Print Drawing History</button>
                </div>
            </div>
        );
    }

}

export default Painter;