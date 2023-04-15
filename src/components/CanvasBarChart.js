import { useState } from 'react';
import CanvasJSReact from '../canvasjs.react';

const Canvasjschart = CanvasJSReact.CanvasJSChart;

function CanvasBarChart(){
    let dataPoints = [{x:1,y:1}, {x:2,y:2}, {x:3,y:3}];
    let dataPoints1 = [{x:1,y:5}, {x:2,y:6}, {x:3,y:1}];
    const initOptions = {
        theme: "dark1",
        animationEnabled: true,
        zoomEnabled: true,
        title: {
            text: "Tata Steel Stock"
        },
        axisY: {
            title: "Axis 1",
        },
        axisY2: {
            title: "Axis 2",
        },
        data: [{
            type: "column",
            dataPoints: dataPoints
        }, {
            type: "column",
            dataPoints: dataPoints1,
        }]
    }
    const [options, setOptions] = useState(initOptions);
    setInterval(()=>{
        dataPoints = [{x:1,y:1}, {x:2,y:2}, {x:3,y:3}];
        dataPoints1 = [{x:1,y:5}, {x:2,y:6}, {x:3,y:1}];
        const newOptions = {
            theme: "dark1",
            animationEnabled: true,
            zoomEnabled: true,
            title: {
                text: "Tata Steel Stock"
            },
            data: [{
                type: "column",
                dataPoints: dataPoints
            }, {
                type: "column",
                dataPoints: dataPoints1,
            }]
        }
        setOptions(newOptions);
    }, 5000);
    return (
        <div>
            <Canvasjschart options={options} />
        </div>
    )
}

export default CanvasBarChart;