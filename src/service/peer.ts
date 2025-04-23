class PeerService {
    peer!: RTCPeerConnection;
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ],
                    }
                ],

            })
        }
    }
    async setLocalDescription(ans: RTCSessionDescriptionInit) {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }
    async getOffer() {
        if (this.peer) {

        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
        }
    }
    async getAnswer(offer: RTCSessionDescriptionInit){
        if (this.peer) {
            
            console.log("getAnswer: received offer", offer);
            if (!offer || !offer.type) {
                console.error("Invalid offer passed to getAnswer:", offer);
                throw new Error("Invalid offer passed to getAnswer");
            }
            await this.peer.setRemoteDescription(offer);
            const answer = await this.peer.createAnswer();
            console.log("Created answer:", answer);
            await this.peer.setLocalDescription(answer);
            return answer;
        }
    }
}
export default new PeerService();