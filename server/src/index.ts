
import { createServer } from 'http';

const transport = new WsTransport()
const server = createServer();

server.on('upgrade', async (request, socket, head) => {
    const ws = await transport.handleUpgrade(request, socket, head)  
    ws.send(JSON.stringify({ type: 'HELLO' }))
})

server.listen(8080, () => {
    console.log('Listening on port 8080')
})