import React, { useEffect, useState } from 'react';
import '../styles/SvgSpider.css';

const SvgSpider = ({ scores, aspects, isDarkMode }) => {
    const [positionsLoaded, setPositionsLoaded] = useState(false);

    useEffect(() => {
        const updatePointPosition = (score, lineId, pointId) => {
            const line = document.getElementById(lineId);
            const point = document.getElementById(pointId);

            if (!line || !point) return;

            const x1 = parseFloat(line.getAttribute('x1'));
            const y1 = parseFloat(line.getAttribute('y1'));
            const x2 = parseFloat(line.getAttribute('x2'));
            const y2 = parseFloat(line.getAttribute('y2'));

            const fraction = (score - 1) / 9;
            const newX = x1 + (x2 - x1) * fraction;
            const newY = y1 + (y2 - y1) * fraction;

            point.setAttribute('cx', newX);
            point.setAttribute('cy', newY);
        };

        scores.forEach((score, index) => {
            updatePointPosition(score, `line${index + 1}`, `point${index + 1}`);
        });

        const updateConnectingLines = () => {
            const points = ['point1', 'point2', 'point3', 'point4', 'point5'];
            points.forEach((pointId, index) => {
                const point = document.getElementById(pointId);
                const nextPoint = document.getElementById(points[(index + 1) % points.length]);
                const line = document.getElementById(`connectLine${index + 1}`);

                if (!point || !nextPoint || !line) return;

                line.setAttribute('x1', point.getAttribute('cx'));
                line.setAttribute('y1', point.getAttribute('cy'));
                line.setAttribute('x2', nextPoint.getAttribute('cx'));
                line.setAttribute('y2', nextPoint.getAttribute('cy'));
            });
        };

        const updateFilledArea = () => {
            const filledArea = document.getElementById('filledArea');
            const pointsList = ['point1', 'point2', 'point3', 'point4', 'point5']
                .map((pointId) => {
                    const point = document.getElementById(pointId);
                    return point ? `${point.getAttribute('cx')},${point.getAttribute('cy')}` : '';
                })
                .join(' ');

            if (filledArea) {
                filledArea.setAttribute('points', pointsList);
            }
        };

        updateConnectingLines();
        updateFilledArea();

        // Ensure positions are loaded before rendering text
        setPositionsLoaded(true);
    }, [scores]);

    const positions = [
        { dx: 25, dy: 15 },  // Position for aspect 1
        { dx: 20, dy: 10 },   // Position for aspect 2
        { dx: -10, dy: 15 },    // Position for aspect 3
        { dx: -20, dy: -5 },   // Position for aspect 4
        { dx: 0, dy: -5 },    // Position for aspect 5
    ];

    return (
        <svg id="svgweb" viewBox="65 190 200 120" xmlns="http://www.w3.org/2000/svg">
            <polygon points="200,250 165.45084971874738,297.5528258147577 109.54915028125264,279.3892626146237 109.54915028125264,220.61073738537635 165.45084971874738,202.44717418524234" style={{ fill: "#8e67ea", stroke: "#251f68", strokeWidth: "2" }} />
            <line x1="150" y1="250" x2="200" y2="250" style={{ stroke: "#251f68", strokeWidth: "1" }} id="line1" />
            <line x1="150" y1="250" x2="165.45084971874738" y2="297.5528258147577" style={{ stroke: "#251f68", strokeWidth: "1" }} id="line2" />
            <line x1="150" y1="250" x2="109.54915028125264" y2="279.3892626146237" style={{ stroke: "#251f68", strokeWidth: "1" }} id="line3" />
            <line x1="150" y1="250" x2="109.54915028125264" y2="220.61073738537635" style={{ stroke: "#251f68", strokeWidth: "1" }} id="line4" />
            <line x1="150" y1="250" x2="165.45084971874738" y2="202.44717418524234" style={{ stroke: "#251f68", strokeWidth: "1" }} id="line5" />

            <line x1="162.5" y1="250" x2="153.86271242968684" y2="261.8882064536894" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="175" y1="250" x2="157.7254248593737" y2="273.77641290737884" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="187.5" y1="250" x2="161.58813728906054" y2="285.66461936106825" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="153.86271242968684" y1="261.8882064536894" x2="139.88728757031316" y2="257.3473156536559" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="157.7254248593737" y1="273.77641290737884" x2="129.77457514062633" y2="264.6946313073118" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="161.58813728906054" y1="285.66461936106825" x2="119.66186271093946" y2="272.0419469609677" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="139.88728757031316" y1="242.6526843463441" x2="139.88728757031316" y2="257.3473156536559" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="129.7745751406263" y1="235.30536869268818" x2="129.7745751406263" y2="264.6946313073118" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="119.66186271093946" y1="227.95805303903226" x2="119.66186271093946" y2="272.0419469609677" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="153.86271242968684" y1="238.11179354631058" x2="162.5" y2="250" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="157.7254248593737" y1="226.22358709262116" x2="175" y2="250" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="161.58813728906054" y1="214.33538063893174" x2="187.5" y2="250" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="139.88728757031316" y1="242.6526843463441" x2="153.86271242968684" y2="238.11179354631058" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="129.7745751406263" y1="235.30536869268818" x2="157.7254248593737" y2="226.22358709262116" style={{ stroke: "#251f68", strokeWidth: "1" }} />
            <line x1="119.66186271093946" y1="227.95805303903226" x2="161.58813728906054" y2="214.33538063893174" style={{ stroke: "#251f68", strokeWidth: "1" }} />

            <circle cx="150" cy="250" r="3" fill="white" stroke="#000" strokeWidth="1" id="point1" />
            <circle cx="165.45084971874738" cy="297.5528258147577" r="3" fill="white" stroke="#000" strokeWidth="1" id="point2" />
            <circle cx="109.54915028125264" cy="279.3892626146237" r="3" fill="white" stroke="#000" strokeWidth="1" id="point3" />
            <circle cx="109.54915028125264" cy="220.61073738537635" r="3" fill="white" stroke="#000" strokeWidth="1" id="point4" />
            <circle cx="165.45084971874738" cy="202.44717418524234" r="3" fill="white" stroke="#000" strokeWidth="1" id="point5" />

            <line id="connectLine1" x1="150" y1="250" x2="165.45084971874738" y2="297.5528258147577" style={{ stroke: "white", strokeWidth: "1" }} />
            <line id="connectLine2" x1="165.45084971874738" y1="297.5528258147577" x2="109.54915028125264" y2="279.3892626146237" style={{ stroke: "white", strokeWidth: "1" }} />
            <line id="connectLine3" x1="109.54915028125264" y1="279.3892626146237" x2="109.54915028125264" y2="220.61073738537635" style={{ stroke: "white", strokeWidth: "1" }} />
            <line id="connectLine4" x1="109.54915028125264" y1="220.61073738537635" x2="165.45084971874738" y2="202.44717418524234" style={{ stroke: "white", strokeWidth: "1" }} />
            <line id="connectLine5" x1="165.45084971874738" y2="202.44717418524234" x2="150" style={{ stroke: "white", strokeWidth: "1" }} />

            <polygon id="filledArea" points="150,250 165.45084971874738,297.5528258147577 109.54915028125264,279.3892626146237 109.54915028125264,220.61073738537635 165.45084971874738,202.44717418524234" fill="rgba(255, 255, 255, 0.393)" />

            {positionsLoaded && aspects.map((aspect, index) => {
                const line = document.getElementById(`line${index + 1}`);
                if (!line) return null;
                const x = parseFloat(line.getAttribute('x2'));
                const y = parseFloat(line.getAttribute('y2'));
                const position = positions[index];
                return (
                    <text key={index} x={x} y={y} dx={position.dx} dy={position.dy} fill={isDarkMode ? 'white' : 'black'} fontSize="10" textAnchor="middle">
                        {aspect}
                    </text>
                );
            })}
        </svg>
    );
};

export default SvgSpider;
