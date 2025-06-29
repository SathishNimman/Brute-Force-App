const LoginAttempt = require("../models/LoginAttemps");
const MAX_USER_ATTEMPTS = 5;
const MAX_IP_ATTEMPTS = 100;
const USER_ATTEMPT_WINDOW_MS = 5 * 60 * 1000;  
const USER_SUSPEND_MS = 15 * 60 * 1000;        
const IP_SUSPEND_MS = 5 * 60 * 1000;           
/**
 * @param {string} email
 * @param {string} ip 
 * @returns {Promise<{blocked: boolean, reason?: string}>}
 */
async function checkBruteForce(email, ip) {
    const now = new Date();
    
  //  IP-Level checking 
    const ipWindowStart = new Date(now.getTime() - USER_ATTEMPT_WINDOW_MS);
    const failedByIP = await LoginAttempt.find({
        ip,
        success: false,
        timestamp: { $gte: ipWindowStart }
    }).sort({ timestamp: 1 });
    if (failedByIP.length >= MAX_IP_ATTEMPTS) {
        const blockTriggerAttempt = failedByIP[MAX_IP_ATTEMPTS - 1];
        const blockReleaseTime = new Date(blockTriggerAttempt.timestamp.getTime() + IP_SUSPEND_MS);
        if (now < blockReleaseTime) {
            const remainingSeconds = ((blockReleaseTime - now) / 1000).toFixed(0);
            console.log(`[checkBruteForce]  IP BLOCK ACTIVE for ${ip}. Remaining: ${remainingSeconds}s`);
            return {
                blocked: true,
                reason: `Too many failed attempts from your IP. Try again after ${remainingSeconds} seconds.`
            };
        } else {
            console.log(`[checkBruteForce]  IP BLOCK EXPIRED for ${ip}. Resetting IP failure count.`);
            await LoginAttempt.deleteMany({ ip, success: false });
        }
    } else {
        console.log(`[checkBruteForce]  IP: ${ip}, Failed attempts (${failedByIP.length}) less than threshold (${MAX_IP_ATTEMPTS}). No IP block active.`);
    }

    //  User-Level Checking 

    const userWindowStart = new Date(now.getTime() - USER_ATTEMPT_WINDOW_MS);
    const failedByUserInWindow = await LoginAttempt.find({
        email,
        success: false,
        timestamp: { $gte: userWindowStart }
    }).sort({ timestamp: 1 });
    if (failedByUserInWindow.length >= MAX_USER_ATTEMPTS) {
        const blockTriggerAttempt = failedByUserInWindow[MAX_USER_ATTEMPTS - 1];
        const blockReleaseTime = new Date(blockTriggerAttempt.timestamp.getTime() + USER_SUSPEND_MS);
        if (now < blockReleaseTime) {
            const remainingMinutes = ((blockReleaseTime - now) / (1000 * 60)).toFixed(1);
            return {
                blocked: true,
                reason: `You have reached the maximum number of attempts. Please try again after ${remainingMinutes} minutes.`
            };
        } else {
            console.log(`[checkBruteForce]  USER BLOCK EXPIRED for ${email}. Cleaning old user attempts.`);
            await LoginAttempt.deleteMany({
                email,
                success: false,
                timestamp: { $lt: userWindowStart }
            });
        }
    } else {
        console.log(`[checkBruteForce]  User: ${email}, Failed attempts in window (${failedByUserInWindow.length}) less than threshold (${MAX_USER_ATTEMPTS}). No user block active.`);
    }

    return { blocked: false };
}

module.exports = checkBruteForce;
