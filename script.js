let currentRotation = 0;
let drumItems = [];

async function fetchDrumItems() {
    try {
        const response = await fetch('http://localhost:3000/drum-items');
        if (!response.ok) {
            throw new Error('Failed to fetch drum items');
        }
        drumItems = await response.json();
        createWheel(drumItems);

        document.getElementById('spin').onclick = async function () {
            try {
                const result = await spinWheel();
                const totalSlices = drumItems.length;
                const sliceAngle = 360 / totalSlices;

                const index = drumItems.findIndex(item => item.id === result.id);
                const targetAngle = 360 - (index * sliceAngle + sliceAngle / 2);

                let spinAngle = targetAngle - (currentRotation % 360);
                if (spinAngle < 0) spinAngle += 360;
                spinAngle += 360 * 5;
                currentRotation += spinAngle;
                const wheel = document.getElementById('wheel');
                wheel.style.transition = `transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)`;
                wheel.style.transform = `rotate(${currentRotation}deg)`;
                document.getElementById('spin').disabled = true;

                setTimeout(() => {
                    document.getElementById('result').textContent = `Ви виграли: ${result.value}`;
                    document.getElementById('spin').disabled = false;
                }, 5000);
            } catch (error) {
                console.error('Error during spin:', error);
            }
        };
    } catch (error) {
        console.error('Error fetching drum items:', error);
    }
}

async function spinWheel() {
    const response = await fetch('http://localhost:3000/spin-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch spin result');
    }

    const result = await response.json();
    return result;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createWheel(items) {
    const prizesContainer = document.getElementById('prizes');
    const sliceAngle = 360 / items.length;

    items.forEach((item, index) => {
        const angle = sliceAngle * index;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const largeArcFlag = sliceAngle > 180 ? 1 : 0;

        const startAngle = angle * (Math.PI / 180);
        const endAngle = (angle + sliceAngle) * (Math.PI / 180);

        const x1 = 200 + 200 * Math.cos(startAngle);
        const y1 = 200 + 200 * Math.sin(startAngle);
        const x2 = 200 + 200 * Math.cos(endAngle);
        const y2 = 200 + 200 * Math.sin(endAngle);

        const d = `M200,200 L${x1},${y1} A200,200 0 ${largeArcFlag},1 ${x2},${y2} Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', getRandomColor());
        path.setAttribute('stroke', '#333');
        path.setAttribute('stroke-width', '1');

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const textAngle = (angle + sliceAngle / 2) * (Math.PI / 180);
        const textX = 200 + 140 * Math.cos(textAngle);
        const textY = 200 + 140 * Math.sin(textAngle);

        text.setAttribute('x', textX);
        text.setAttribute('y', textY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '16');
        text.setAttribute('transform', `rotate(${90 + angle + sliceAngle / 2}, ${textX}, ${textY})`);
        text.textContent = item.value;

        prizesContainer.appendChild(path);
        prizesContainer.appendChild(text);
    });
}

fetchDrumItems();
