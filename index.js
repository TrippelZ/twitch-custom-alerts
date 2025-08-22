let TwitchSocket;
let SessionId;
let KeepaliveTime;
let KeepaliveTimeout;

function ConnectToSocket() {
    TwitchSocket = new WebSocket("wss://eventsub.wss.twitch.tv/ws");
    TwitchSocket.onmessage = OnMessage;
}

function SessionDisconnected() {
    TwitchSocket.close();
    ConnectToSocket();
}

function SessionWelcome(payload) {
    SessionId     = payload.session.id;
    KeepaliveTime = payload.session.keepalive_timeout_seconds * 1000; // We convert it to milliseconds because that's what JavaScript uses.
}

function UpdateKeepalive() {
    if(KeepaliveTimeout) {
        clearTimeout(KeepaliveTimeout);
    }
    KeepaliveTimeout = setTimeout(SessionDisconnected, KeepaliveTime);
}

function SubscribeToEvents() {
    console.log("WebSocket Connected!");
}

function OnMessage(event) {
    const message = JSON.parse(event.data);

    switch(message.metadata.message_type) {
        case "session_welcome":
            SessionWelcome(message.payload);
            UpdateKeepalive();
            SubscribeToEvents();
            break;

        case "session_keepalive":
            UpdateKeepalive();
            break;
    }
}

window.onload = ConnectToSocket;