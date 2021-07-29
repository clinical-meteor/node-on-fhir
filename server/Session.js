/**
 * This is simple session storage for example purposes only. We need this to
 * provide session support to our node example. In real-life scenarios you
 * would probably use some framework with built-in (or plugged-in) session support.
 * @author Vladimir Ignatov <vlad.ignatov@gmail.com>
 */

 const Crypto = require("crypto");

 // This is the server-side memory storage for all the active sessions
 const __SESSIONS = {};
 
 // The name of the cookie we use is fixed to "smart-sid"
 const COOKIE_NAME = "smart-sid";
 
 // Every 10 seconds loop through all the sessions and delete those that are expired
 (function cleanUp() {
     let now = new Date();
     for (let sid in __SESSIONS) {
         let session = __SESSIONS[sid];
         if (session.expires <= now) {
             delete __SESSIONS[sid];
         }
     }
     setTimeout(cleanUp, 10000);
 })();
 
 // Parse the cookie header and return the value of the COOKIE_NAME cookie (or null)
 function getSessionIdFromCookie(request) {
     let cookie = String(request.headers.cookie || "")
         .trim()
         .split(/\s*;\s*/)
         .find(token => token.split("=")[0] === COOKIE_NAME);
 
     if (cookie) {
         return cookie.split("=")[1];
     }
 
     return null;
 }
 
 module.exports = class Session
 {
     static fromRequest(request) {
         let sid = getSessionIdFromCookie(request);
         if (sid && __SESSIONS[sid]) {
             return new Session(sid, __SESSIONS[sid].data);
         }
         return null;
     }
 
     static destroy(request) {
         let sid = getSessionIdFromCookie(request);
         if (sid && __SESSIONS[sid]) {
             delete __SESSIONS[sid];
         }
     }
 
     constructor(sid, data = {}) {
         this.name = COOKIE_NAME;
         this.sid = sid || Crypto.randomBytes(16).toString("hex");
         this.data = data;
         this.touch();
     }
 
     toJSON() {
         return {
             sid: this.sid,
             expires: this.expires,
             cookie: this.cookie,
             data: this.data
         };
     }
 
     expire(after) {
         let exp = new Date(Date.now() + after);
         this.expires = exp;
         this.cookie = `${this.name}=${this.sid}; Expires=${exp.toUTCString()}`;
         if (after <= 0 && __SESSIONS[this.sid]) {
             delete __SESSIONS[this.sid];
         } else {
             __SESSIONS[this.sid] = this.toJSON();
         }
         return this;
     }
 
     destroy() {
         return this.expire(-1000);
     }
 
     touch() {
         return this.expire(1000 * 60 * 5);
     }
 
     async set(key, value) {
         this.data[key] = value;
         this.touch();
         return value;
     }
 
     async get(key) {
         this.touch();
         return this.data[key];
     }
 
     async unset(key) {
         this.touch();
         if (this.data.hasOwnProperty(key)) {
             delete this.data[key];
             return true;
         }
         return false;
     }
 };
 