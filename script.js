document.getElementById('analyzeButton').addEventListener('click', function () {
    const funcInput = document.getElementById('functionInput').value;
    const variablesInput = document.getElementById('variablesInput').value;
    const resultDiv = document.getElementById('result');
    const chartContainer = document.getElementById('chartContainer');
    const extraInfoDiv = document.getElementById('extraInfo');

    try {
        // Değişkenlere değer atama
        const variableValues = parseVariables(variablesInput);
        const func = math.parse(funcInput);

        // Değişkenlerle fonksiyonu değerlendir
        const type = getFunctionType(funcInput);
        const evaluatedResult = math.evaluate(funcInput, variableValues);

        // Fonksiyon sıfırsa, sıfır fonksiyonu olarak belirleyin
        if (evaluatedResult === 0) {
            resultDiv.innerHTML = "<strong>Fonksiyon Türü:</strong> Sıfır Fonksiyonu";
        } else {
            resultDiv.innerHTML = `<strong>Fonksiyon Türü:</strong> ${type}`;
        }

        // Ek bilgileri göster
        const extraInfo = getExtraInfo(type);
        extraInfoDiv.innerHTML = extraInfo;

        // Grafik Çizme
        chartContainer.innerHTML = '';  // Önceki grafiği temizle
        drawGraph(funcInput, variableValues);
    } catch (error) {
        resultDiv.innerHTML = `<span class="text-red-500">Geçersiz fonksiyon!</span>`;
    }
});

// Fonksiyon türünü belirle
function getFunctionType(funcInput) {
    if (funcInput.includes('x') && !funcInput.includes('^')) {
        return 'Doğrusal';
    } else if (funcInput.includes('x') && funcInput.includes('^')) {
        return 'Üstel';
    } else if (funcInput.includes('x') && !funcInput.includes('+') && !funcInput.includes('-')) {
        return 'Birinci Dereceden';
    } else if (!funcInput.includes('x')) {
        return 'Sabit';
    } else {
        return 'Belirlenemedi';
    }
}

// Fonksiyon türüne göre ek bilgiler
function getExtraInfo(type) {
    const info = {
        'Doğrusal': 'Doğrusal fonksiyon, bir doğru şeklinde grafiği olan fonksiyonlardır. Örnek: y = 2x + 3',
        'Üstel': 'Üstel fonksiyonlar, değişkenin üssünde yer alan fonksiyonlardır. Örnek: y = x^2',
        'Birinci Dereceden': 'Birinci dereceden fonksiyonlar, genellikle doğrusal ve sabit olmayan fonksiyonlardır. Örnek: y = x + 1',
        'Sabit': 'Sabit fonksiyon, her x değeri için aynı sonucu veren fonksiyonlardır. Örnek: y = 5',
        'Belirlenemedi': 'Geçersiz fonksiyon türü.'
    };
    return info[type] || 'Tanım kümesi yok.';
}

// Değişken değerlerini parse et
function parseVariables(variablesInput) {
    const variables = {};
    const pairs = variablesInput.split(',');
    pairs.forEach(pair => {
        const [varName, value] = pair.split('=');
        if (varName && value) {
            variables[varName.trim()] = parseFloat(value.trim());
        }
    });
    return variables;
}

// Fonksiyon grafiğini çiz
function drawGraph(funcInput, variableValues) {
    const ctx = document.createElement('canvas');
    document.getElementById('chartContainer').appendChild(ctx);

    const data = [];
    for (let x = -10; x <= 10; x++) {
        try {
            // Değişkenleri fonksiyona ata
            const evaluatedFunc = math.evaluate(funcInput, { ...variableValues, x: x });
            data.push({ x: x, y: evaluatedFunc });
        } catch (error) {
            // Hata durumunda veri eklenmemesi sağlanır
        }
    }

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Fonksiyon Grafiği',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            scales: {
                x: { type: 'linear', position: 'bottom' },
                y: { beginAtZero: false }
            }
        }
    });
}
