document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const copyBtn = document.getElementById('copy-btn');
    const promptInput = document.getElementById('prompt-input');
    const imageContainer = document.getElementById('image-container');
    const imagePlaceholder = document.getElementById('image-placeholder');
    const loader = document.getElementById('loader');
    const codeSnippet = document.getElementById('code-snippet');

    let currentImageUrl = null;

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a prompt.');
            return;
        }

        // --- Start loading state ---
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        imagePlaceholder.classList.add('hidden');
        imageContainer.innerHTML = ''; // Clear previous image
        const newLoader = document.createElement('div');
        newLoader.className = 'loader';
        imageContainer.appendChild(newLoader);
        downloadBtn.classList.add('hidden');

        try {
            const result = await websim.imageGen({ prompt });
            currentImageUrl = result.url;
            
            // --- Display image ---
            imageContainer.innerHTML = ''; // Clear loader
            const img = document.createElement('img');
            img.src = currentImageUrl;
            img.alt = prompt;
            img.onload = () => {
                downloadBtn.classList.remove('hidden');
            };
            imageContainer.appendChild(img);

        } catch (error) {
            console.error('Image generation failed:', error);
            imageContainer.innerHTML = '<p class="error-message">Sorry, the image could not be generated. Please try again.</p>';
            imagePlaceholder.classList.remove('hidden'); // Show placeholder again on error
        } finally {
            // --- End loading state ---
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Image';
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (currentImageUrl) {
            // This function is defined here for demonstration, but the code on the page is what's explained.
            downloadImage(currentImageUrl, 'ai-generated-image.png');
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeSnippet.innerText).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Copied!`;
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy code:', err);
            alert('Failed to copy code to clipboard.');
        });
    });

    // The function shown in the code snippet on the page
    async function downloadImage(imageUrl, filename = 'ai-image.png') {
        try {
            // Using a CORS proxy for browser security if needed, but websim URLs should be fine.
            const response = await fetch(imageUrl);
             if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download the image:', error);
            alert('Could not download the image. The resource might be protected by CORS policy. Try right-clicking the image and selecting "Save Image As...".');
        }
    }
});

