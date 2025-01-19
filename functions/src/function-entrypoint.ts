/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onSchedule } from 'firebase-functions/v2/scheduler'
import giveawayHandler from './giveaway-scheduler/handler.js'

export const giveawayScheduler = onSchedule('*/1 * * * *', () => {
    return giveawayHandler()
})
