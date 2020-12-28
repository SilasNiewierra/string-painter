import { Component } from "react";
import './Painter.scss';
import missing from '../../assets/images/missing.png';
import { HiDownload } from 'react-icons/hi';
import { jsPDF } from "jspdf";


class Painter extends Component {

    constructor(props) {
        super(props);
        this.drawCircle = this.drawCircle.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.updateNextPoint = this.updateNextPoint.bind(this);
        this.printList = this.printList.bind(this);
        this.setStartingPoint = this.setStartingPoint.bind(this);
        this.validateStartingPoint = this.validateStartingPoint.bind(this);
        this.state = { stepSize: 90, nextPoint: 10, startPoint: null, hasBeenDrawn: false };
        this.pointCoordinates = {};
        this.drawingHistory = [];
        this.tempStart = null;
    }

    updateInputValue(evt) {
        this.setState({
            stepSize: evt.target.value
        });

    }

    updateNextPoint(evt) {
        if (evt.target.value <= this.state.stepSize && evt.target.value > 0) {
            this.setState({
                nextPoint: evt.target.value
            });

        } else {
            alert("Please enter only valid numbers");
        }

    }

    setStartingPoint() {
        this.setState({
            startPoint: this.tempStart
        });
    }

    validateStartingPoint(evt) {
        if (evt.target.value <= this.state.stepSize && evt.target.value > 0) {
            this.tempStart = evt.target.value;
        } else {
            alert("Please enter only valid numbers");
        }
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
        this.setState({
            hasBeenDrawn: true
        })
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
        var doc = new jsPDF();

        doc.setFontSize(22);
        doc.text(20, 20, 'Your Custom String Intructions');

        doc.setFontSize(10);
        doc.text(20, 40, 'Start');
        var final_index = 0;
        for (let i = 0; i < this.drawingHistory.length; i++) {
            doc.text(20, 50 + i * 10, this.drawingHistory[i] + "");
            final_index = i;
        }
        doc.text(20, 50 + (final_index + 1) * 10, 'End');

        doc.save('instructions.pdf');
    }

    render() {
        return (
            <div className="painter-wrapper">
                <div className="painter">
                    <canvas id="canvas"></canvas>
                    {!this.state.hasBeenDrawn &&
                        <div>
                            <img src={missing} alt=" " width={100} />
                            Whoops! Seems like you haven't drawn your circle yet
                        </div>
                    }
                </div>
                <div className="info">

                    <h2>String Art Creator</h2>
                    <p>
                        Use our intuitive String Art Creator to develop an image consisting of only one string.
                        Once you're down with the creative part, just print the instructions as pdf and
                        follow them to create your String Art as a real project.
                    </p>

                    <h4>Define the amount of circle points</h4>
                    <div className="config-section-wrapper">
                        <input className="config-input" value={this.state.stepSize} onChange={this.updateInputValue} type="number" />
                        <button className="config-button" onClick={() => this.drawCircle(this.state.stepSize)}>Draw The Circle</button>
                    </div>
                    {
                        this.state.hasBeenDrawn && <div>
                            <h4>Set Your Starting Point</h4>
                            <div className="config-section-wrapper">
                                <input className="config-input" value={this.tempStart} onChange={this.validateStartingPoint} type="number" />
                                <button className="config-button" onClick={this.setStartingPoint} >Set Starting Point</button>
                            </div>
                        </div>
                    }
                    {
                        this.state.startPoint !== null &&
                        <div>
                            <h4>Draw A New Line</h4>
                            <div className="config-section-wrapper">
                                <input className="config-input" value={this.state.nextPoint} onChange={this.updateNextPoint} type="number" />
                                <button className="config-button" onClick={() => this.drawLine(this.state.nextPoint)} >Draw A Line</button>
                            </div>
                        </div>
                    }

                    <button className="download-button" onClick={() => this.printList()} ><HiDownload /> Print Drawing History</button>
                </div>
            </div>
        );
    }

}

export default Painter;