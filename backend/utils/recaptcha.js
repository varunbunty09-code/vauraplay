const axios = require('axios');

/**
 * Verify reCAPTCHA v2 token with Google
 * @param {string} token - The recaptcha token from frontend
 * @returns {Promise<boolean>} - Whether verification was successful
 */
const verifyRecaptcha = async (token) => {
    if (!token) return false;
    
    try {
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        if (!secret) {
            console.warn('RECAPTCHA_SECRET_KEY is not defined in environment variables. Skipping verification.');
            return true; // Don't block if not configured (development)
        }

        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
        );

        return response.data.success;
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return false;
    }
};

module.exports = { verifyRecaptcha };
