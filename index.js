const util = require('minecraft-server-util');

const client = new util.RCON('localhost', { port: 25575, enableSRV: true, timeout: 5000, password: '123' });
var state = {
    doDaylightCycle : true,
    difficulty: 'hard',
    connected: false,
    running: true
};

client.on('output', (message) => {
    var nPlayers = message.split(' ')[2];
    if(nPlayers < 1){
        client.connect()
            .then(async () => {
                state.connected = true;
                if(state.running){
                    if(state.doDaylightCycle){
                        await client.run('gamerule doDaylightCycle false');
                        state.doDaylightCycle = false;
                    }

                    if(state.difficulty == 'hard'){
                        await client.run('difficulty peaceful');
                        state.difficulty = 'peaceful';
                    }
                    console.log('pause');
                    state.running = false;
                }
                setTimeout(() => {
                    client.close();
                    state.connected = false;
                }, 3*100);

            })
            .catch((error) => {
                throw error;
            });
        return;
    }
    if(nPlayers > 0){
        client.connect()
            .then(async () => {
                state.connected = true;

                if(!state.running){
                    if(!state.doDaylightCycle){
                        await client.run('gamerule doDaylightCycle true');
                        state.doDaylightCycle = true;
                    }

                    if(state.difficulty != 'hard'){
                        await client.run('difficulty hard');
                        state.difficulty = 'hard';
                    }
                    console.log('start');
                    state.running = true;
                }
                
                setTimeout(() => {
                    client.close();
                    state.connected = false;
                }, 3*100);
            })
            .catch((error) => {
                throw error;
            });
        return;
    }
});

setInterval(() => {
    if(!state.connected){
        client.connect()
            .then(async () => {
                state.connected = true;
                await client.run('list');
                console.log('run');
                setTimeout(() => {
                    client.close();
                    state.connected = false;
                }, 3*100);
            })
            .catch((error) => {
                throw error;
            });
    }
}, 2*1000);

