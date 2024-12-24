document.addEventListener('DOMContentLoaded', function () {
    const inputText = document.getElementById('inputText');
    const generateBtn = document.getElementById('generateBtn');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');

    generateBtn.addEventListener('click', generateCommand);
    copyBtn.addEventListener('click', copyToClipboard);

    function generateCommand() {
        const input = inputText.value.trim();
        if (!input) {
            resultText.value = '';
            return;
        }

        // Объект для хранения времени по датам
        const timeByDate = {};
        let totalOnlineTime = 0; // Переменная для общего времени онлайн

        // Разбиваем ввод на строки
        const lines = input.split('\n');

        // Регулярное выражение для извлечения времени игры
        const timeRegex = /время игры:\s*(\d{2}:\d{2}:\d{2})/;

        lines.forEach(line => {
            const dateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
            const timeMatch = line.match(timeRegex);

            if (dateMatch && timeMatch) {
                const date = formatDate(dateMatch[1]); // Форматируем дату
                const playTime = timeMatch[1];

                // Суммируем время
                if (!timeByDate[date]) {
                    timeByDate[date] = 0; // Инициализация времени
                }

                const seconds = convertTimeToSeconds(playTime);
                timeByDate[date] += seconds; // Суммируем время по дате
                totalOnlineTime += seconds; // Суммируем общее время
            }
        });

        // Формируем результат
        let result = '';
        for (const date in timeByDate) {
            result += `${date}: ${convertSecondsToTime(timeByDate[date])}\n`;
        }

        // Добавляем итоговое время
        result += `\nИтоговое время онлайна: ${convertSecondsToTime(totalOnlineTime)}`;
        resultText.value = result;
    }

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`; // Возвращаем формат DD.MM.YYYY
    }

    function convertTimeToSeconds(time) {
        const parts = time.split(':').map(Number);
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    function convertSecondsToTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function copyToClipboard() {
        if (!resultText.value) {
            return;
        }

        resultText.select();
        resultText.setSelectionRange(0, 99999); // Для мобильных устройств

        try {
            navigator.clipboard.writeText(resultText.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Скопировано!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        } catch (err) {
            document.execCommand('copy');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Скопировано!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }
    }

    // Добавьте обработчик событий для реального времени генерации команд
    inputText.addEventListener('input', generateCommand);
});