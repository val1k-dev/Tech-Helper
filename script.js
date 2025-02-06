document.addEventListener('DOMContentLoaded', function () {
    const inputText = document.getElementById('inputText');
    const generateBtn = document.getElementById('generateBtn');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    const radioButtons = document.getElementsByName('commandType');
    const moderatorRadios = document.getElementsByName('moderator');
    const moderatorOtherInput = document.getElementById('moderatorOtherInput'); // Добавляем поле "Другое"
    const otherModeratorLabel = document.getElementById('otherModeratorLabel'); // Добавляем поле "Другое"

    generateBtn.addEventListener('click', generateCommand);
    copyBtn.addEventListener('click', copyToClipboard);

    function generateCommand() {
        const input = inputText.value.trim();
        if (!input) {
            resultText.value = '';
            return;
        }

        const lines = input.split(/\n/).filter(line => line.trim());

        let commandType = '';
        for (const radio of radioButtons) {
            if (radio.checked) {
                commandType = radio.value;
                break;
            }
        }

        function handleModeratorChange() {
            for (const radio of moderatorRadios) {
                if (radio.checked && radio.value === 'other') {
                    // Показываем поле ввода и скрываем label "Другое"
                    moderatorOtherInput.style.display = 'block';
                    otherModeratorLabel.style.display = 'none';
                    moderatorOtherInput.focus();
                } else {
                    // Скрываем поле ввода и показываем label
                    moderatorOtherInput.style.display = 'none';
                    otherModeratorLabel.style.display = 'inline-block';
                }
            }
        }

        // Вешаем обработчики на все радио-кнопки
        moderatorRadios.forEach(radio => {
            radio.addEventListener('change', handleModeratorChange);
        });

        // Инициализация при загрузке страницы
        handleModeratorChange();

        // Получаем выбранного модератора с учетом поля "Другое"
        let moderator = '';
        for (const radio of moderatorRadios) {
            if (radio.checked) {
                moderator = radio.value;

                if (moderator === 'other') { // Если выбрано "Другое"
                    moderator = moderatorOtherInput.value.trim(); // Берем значение из текстового поля
                    if (!moderator) { // Если поле пустое, показываем ошибку
                        alert('Введите тег модератора в поле "Другое"');
                        return;
                    }
                }
                break;
            }
        }

        let commands = lines.map(line => {
            const [nickname, ...reasonParts] = line.trim().split(/\s+/);
            const reason = reasonParts.join(' ');

            if (!nickname || !reason) return '';

            if (commandType === 'banoff') {
                return `/banoff ${nickname} 998 ${reason} // ${moderator}`;
            } else if (commandType === 'jailoff') {
                return `/jailoff ${nickname} 5000 ${reason} // ${moderator}`;
            }
            return '';
        }).filter(cmd => cmd);

        resultText.value = commands.join('\n');
    }

    function copyToClipboard() {
        if (!resultText.value) {
            return;
        }

        resultText.select();
        resultText.setSelectionRange(0, 99999); // For mobile devices

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

    // Add input event listener for real-time command generation
    inputText.addEventListener('input', generateCommand);
});