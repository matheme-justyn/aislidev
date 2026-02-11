// AISliDev Frontend Application

// Fetch API health status
async function checkHealth() {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        console.log('Health check:', data);
        return data;
    } catch (error) {
        console.error('Health check failed:', error);
        return null;
    }
}

// Fetch API information
async function getApiInfo() {
    try {
        const response = await fetch('/api');
        const data = await response.json();
        console.log('API info:', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch API info:', error);
        return null;
    }
}

// Initialize app
async function init() {
    console.log('AISliDev v0.0.2 initialized');

    // Check server health
    const health = await checkHealth();
    if (health) {
        console.log('✅ Server is healthy');
    }

    // Get API info
    await getApiInfo();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
