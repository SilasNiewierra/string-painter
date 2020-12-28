import { Component } from "react";
import './Painter.scss';
import missing from '../../assets/images/missing.png';
import { HiDownload } from 'react-icons/hi';
import { HiTrash } from 'react-icons/hi';
import { jsPDF } from "jspdf";


class Painter extends Component {

    constructor(props) {
        super(props);

        this.setCircleSteps = this.setCircleSteps.bind(this);

        this.keydownFunction = this.keydownFunction.bind(this);
        this.clearAll = this.clearAll.bind(this);

        this.drawCircle = this.drawCircle.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.drawPoint = this.drawPoint.bind(this);

        this.printList = this.printList.bind(this);

        this.pointCoordinates = {};
        this.drawingHistory = [];
        this.stepRadius = 6;

        this.state = {
            hasBeenDrawn: false,

            steps: 90,
            currentPoint: 0,
            nextPoint: 0
        };
    }

    setCircleSteps(evt) {
        this.setState({
            steps: evt.target.value
        });

    }

    // React to keyboard inputs as drawing instrcutions
    keydownFunction(event) {
        // ESC
        if (event.keyCode === 27) {
            this.drawPoint(this.state.nextPoint, "#000000");
            this.setState({
                nextPoint: 0
            });
        }
        // BACKSPACE
        else if (event.keyCode === 8) {
            if (this.state.nextPoint <= 9) {
                this.drawPoint(this.state.nextPoint, "#000000");
                this.setState({
                    nextPoint: 0
                });
            } else {
                this.drawPoint(this.state.nextPoint, "#000000");
                this.setState({
                    nextPoint: Math.floor(this.state.nextPoint / 10)
                });
                this.drawPoint(this.state.nextPoint, "#AA4465");
            }
        }
        // NUMBER between 0 and 9 and 0 and 9 on the numpad
        else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
            let keyValue = event.keyCode > 57 ? event.keyCode - 96 : event.keyCode - 48;
            let possibleNextPoint = this.state.nextPoint * 10 + keyValue;

            if (possibleNextPoint > 0 && possibleNextPoint <= this.state.steps) {
                this.drawPoint(this.state.nextPoint, "#000000");

                this.setState({
                    nextPoint: possibleNextPoint
                });
                this.drawPoint(this.state.nextPoint, "#AA4465");

            }
        }
        // ENTER
        else if (event.keyCode === 13) {
            // check if next point is valid
            if (this.state.nextPoint <= this.state.steps && this.state.nextPoint > 0 && this.state.nextPoint !== this.state.currentPoint) {
                // if it's the initial point, set the point without line and color it
                if (this.state.currentPoint === 0) {
                    this.setState({
                        currentPoint: this.state.nextPoint
                    });
                    this.drawPoint(this.state.currentPoint, "#f557a6");
                    this.drawingHistory.push(this.state.currentPoint);
                }
                // if it's not the initial point, draw the line and color the new points
                else {
                    this.drawPoint(this.state.currentPoint, "#000000");
                    this.drawLine();
                    this.setState({
                        currentPoint: this.state.nextPoint
                    });
                    this.drawPoint(this.state.currentPoint, "#f557a6");
                    this.drawingHistory.push(this.state.currentPoint);
                }
                this.setState({
                    nextPoint: 0
                });
            }
        }

    }



    // Drawing Functions

    drawCircle(steps) {
        this.pointCoordinates = {};
        var degree = 360 / steps;
        var radian = degree * Math.PI / 180;
        var size = 700;


        var canvas = document.getElementById('canvas');
        canvas.style.display = "block";
        var ctx = canvas.getContext("2d");

        canvas.width = canvas.height = size;


        var step = radian;
        var h = size / 2;
        var k = size / 2;
        var r = size / 2 - this.stepRadius * 3;
        ctx.strokeStyle = "rgb(0,0,0)";

        var index = 1;
        for (var theta = 0; theta < 2 * Math.PI; theta += step) {
            let x = Math.floor(h + r * Math.sin(theta));
            let y = Math.floor(k - r * Math.cos(theta));
            this.pointCoordinates[index] = ([x, y]);
            
            ctx.beginPath();
            ctx.arc(x, y, Math.floor(this.stepRadius), 0, 2 * Math.PI);
            ctx.fill();
            // ctx.fillRect(x, y, this.stepRadius, this.stepRadius);
            ctx.font = "10px Arial";
            ctx.fillText(index, x, y - this.stepRadius);
            index += 1;

        }
        ctx.closePath();
        this.setState({
            hasBeenDrawn: true
        });
        document.addEventListener("keydown", this.keydownFunction, false);
    }

    drawLine() {
        var canvas = document.getElementById('canvas');

        var context = canvas.getContext('2d');
        context.strokeStyle = "rgb(0,0,0)";
        context.beginPath();

        var x = this.pointCoordinates[this.state.currentPoint][0] + this.stepRadius / 2;
        var y = this.pointCoordinates[this.state.currentPoint][1] + this.stepRadius / 2;
        context.moveTo(x, y);

        var new_x = this.pointCoordinates[this.state.nextPoint][0] + this.stepRadius / 2;
        var new_y = this.pointCoordinates[this.state.nextPoint][1] + this.stepRadius / 2;
        context.lineTo(new_x, new_y);
        context.stroke();


        this.setState({
            currentPoint: this.state.nextPoint
        });
    }

    drawPoint(point, color) {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext("2d");

        // Draw Next Point
        ctx.fillStyle = color;
        if (point in this.pointCoordinates) {
            let x = this.pointCoordinates[point][0];
            let y = this.pointCoordinates[point][1];
            ctx.beginPath();
            ctx.arc(x, y, Math.floor(this.stepRadius), 0, 2 * Math.PI);
            ctx.fill();
            // ctx.fillRect(x, y, this.stepRadius, this.stepRadius);
        }
    }

    // Download the drawing history as PDF
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

    clearAll() {
        this.setState({
            hasBeenDrawn: false,

            steps: 90,
            currentPoint: 0,
            nextPoint: 0
        });

        this.pointCoordinates = {};
        this.drawingHistory = [];

        var canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
    }


    // Lifecycle Methods
    componentDidMount() {
        var canvas = document.getElementById('canvas');
        canvas.style.display = "none";
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keydownFunction, false);
    }

    render() {
        return (
            <div className="painter-wrapper">

                {/* PAINTER CANVAS */}
                <div className="painter">
                    {
                        !this.state.hasBeenDrawn &&
                        <div className="missing-wrapper">
                            <img src={missing} alt=" " width={100} />
                            <p>Whoops! Seems like you haven't drawn your circle yet.</p>
                        </div>
                    }
                    <canvas id="canvas"></canvas>
                </div>

                {/* CONFIG INFO */}
                <div className="info">

                    {/* TITLE */}
                    <div>
                        <h2 align="center">String Art Creator</h2>
                        <p>
                            Use our intuitive String Art Creator to develop an image consisting of only one string.
                            Once you're down with the creative part, just print the instructions as pdf and
                            follow them to create your String Art as a real project.
                    </p>
                    </div>


                    {/* CIRCLE DRAWING */}
                    {
                        !this.state.hasBeenDrawn &&
                        <div>
                            <h4 align="center">Define the amount of circle points</h4>
                            <div className="config-section-wrapper">
                                <input className="config-input" value={this.state.steps} onChange={this.setCircleSteps} type="number" />
                                <button className="config-button" onClick={() => this.drawCircle(this.state.steps)}>Draw The Circle</button>
                            </div>
                        </div>
                    }

                    {/* LINE INSTRUCTIONS */}
                    {
                        this.state.hasBeenDrawn &&
                        <div>
                            <h4 align="center">Draw A New Line</h4>
                            <p>
                                Enter a number to draw a line from the current point to it.
                                Press ENTER to draw the line, ESC to delete the current number
                                and BACKSPACE to delete the last entered digit.
                                The current and next point have to be different!</p>

                            <div className="next-point-info-wrapper">
                                <input className="next-point-info" value={this.state.nextPoint} readOnly={true}></input>
                            </div>
                        </div>
                    }

                    {/* CLEAR AND DOWNLOAD */}
                    <div className="actions-wrapper">
                        <button className="clear-button" onClick={this.clearAll} ><HiTrash /> </button>
                        <button className="download-button" onClick={this.printList} ><HiDownload /> Print Drawing History</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default Painter;