
import * as firebase from "firebase/app";
import "firebase/messaging";
import fire from './config/fire'

const messaging = fire.messaging();
messaging.usePublicVapidKey(
// Project Settings => Cloud Messaging => Web Push certificates
"BNEa0ZYiVND6VbyD2vXuz7HQm-9zbxIbiCmT0MtFsUUL1sU5-QsqT2HV1EQwHndPrW9_qLC5yaHwAepJGYXmqjU"
);
export { messaging };