// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const form = document.getElementById('metaTagForm');
    const generateBtn = document.getElementById('generateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const resultCode = document.getElementById('resultCode');
    const copyBtn = document.getElementById('copyBtn');
    const loading = document.getElementById('loading');
    
    // Function to optimize title
    function optimizeTitle(title) {
        if (!title) return '';
        
        // Capitalize first letter of important words
        let optimized = title.replace(/\b\w+\b/g, word => {
            // Skip small words unless they are the first word
            const smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in'];
            if (!smallWords.includes(word.toLowerCase()) || title.indexOf(word) === 0) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        });
        
        // Ensure title isn't too long (60 chars is generally safe)
        if (optimized.length > 60) {
            optimized = optimized.substring(0, 57) + '...';
        }
        
        return optimized;
    }
    
    // Function to optimize description
    function optimizeDescription(description) {
        if (!description) return '';
        
        // Ensure description has proper length
        let optimized = description.trim();
        
        if (optimized.length > 160) {
            optimized = optimized.substring(0, 157) + '...';
        } else if (optimized.length < 50) {
            optimized += ' Learn more about our services and solutions.';
        }
        
        // Ensure it ends with proper punctuation
        if (!optimized.endsWith('.') && !optimized.endsWith('!') && !optimized.endsWith('?')) {
            optimized += '.';
        }
        
        return optimized;
    }
    
    // Generate meta tags function
    function generateMetaTags() {
        // Show loading indicator
        loading.style.display = 'block';
        resultContainer.style.display = 'none';
        
        // Get form values
        const title = document.getElementById('pageTitle').value;
        const description = document.getElementById('pageDescription').value;
        const keywords = document.getElementById('keywords').value;
        const url = document.getElementById('pageURL').value;
        const includeOG = document.getElementById('ogTags').checked;
        const includeTwitter = document.getElementById('twitterTags').checked;
        const includeRobots = document.getElementById('robotsTags').checked;
        
        // Optimize title and description
        const optimizedTitle = optimizeTitle(title);
        const optimizedDescription = optimizeDescription(description);
        
        // Generate meta tags
        let metaTags = `<title>${optimizedTitle}</title>\n`;
        metaTags += `<meta name="description" content="${optimizedDescription}">\n`;
        
        if (keywords && keywords.trim() !== '') {
            metaTags += `<meta name="keywords" content="${keywords.trim()}">\n`;
        }
        
        // Add canonical URL if provided
        if (url && url.trim() !== '') {
            metaTags += `<link rel="canonical" href="${url.trim()}">\n`;
        }
        
        // Add OpenGraph tags if selected
        if (includeOG) {
            metaTags += `<meta property="og:title" content="${optimizedTitle}">\n`;
            metaTags += `<meta property="og:description" content="${optimizedDescription}">\n`;
            if (url && url.trim() !== '') {
                metaTags += `<meta property="og:url" content="${url.trim()}">\n`;
            }
            metaTags += `<meta property="og:type" content="website">\n`;
        }
        
        // Add Twitter Card tags if selected
        if (includeTwitter) {
            metaTags += `<meta name="twitter:card" content="summary">\n`;
            metaTags += `<meta name="twitter:title" content="${optimizedTitle}">\n`;
            metaTags += `<meta name="twitter:description" content="${optimizedDescription}">\n`;
        }
        
        // Add robots tag if selected
        if (includeRobots) {
            metaTags += `<meta name="robots" content="index, follow">\n`;
        }
        
        // Short timeout just for loading effect
        setTimeout(() => {
            // Display result
            resultCode.textContent = metaTags;
            resultContainer.style.display = 'block';
            loading.style.display = 'none';
            
            // Scroll to result
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
    
    // Event listeners
    generateBtn.addEventListener('click', generateMetaTags);
    
    // Also handle form submission (for users who press Enter)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateMetaTags();
    });
    
    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function() {
        // Fallback for older browsers
        try {
            // Modern approach
            navigator.clipboard.writeText(resultCode.textContent)
                .then(() => {
                    // Show copied feedback
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                    fallbackCopyTextToClipboard(resultCode.textContent);
                });
        } catch (err) {
            fallbackCopyTextToClipboard(resultCode.textContent);
        }
    });
    
    // Fallback clipboard function
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = successful ? 'Copied!' : 'Failed!';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Fallback: Could not copy text: ', err);
        }
        
        document.body.removeChild(textArea);
    }
});