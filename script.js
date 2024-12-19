document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const generateBtn = document.getElementById('generateBtn');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    const radioButtons = document.getElementsByName('commandType');
    const moderatorRadios = document.getElementsByName('moderator');

    generateBtn.addEventListener('click', generateCommand);
    copyBtn.addEventListener('click', copyToClipboard);

    function generateCommand() {
        const input = inputText.value.trim();
        if (!input) {
            resultText.value = '';
            return;
        }

        // Split input into lines and filter out empty lines
        const lines = input.split(/\n/).filter(line => line.trim());
        
        // Get selected command type
        let commandType = '';
        for (const radio of radioButtons) {
            if (radio.checked) {
                commandType = radio.value;
                break;
            }
        }

        // Get selected moderator
        let moderator = '';
        for (const radio of moderatorRadios) {
            if (radio.checked) {
                moderator = radio.value;
                break;
            }
        }

        // Process each line
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
        }).filter(cmd => cmd); // Remove empty commands

        // Join commands with single newlines
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
